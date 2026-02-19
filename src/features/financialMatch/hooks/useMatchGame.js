/**
 * useMatchGame — Balance Builder orchestration hook.
 * Handles game loop, scoring, buckets, praise timing, and sound triggers.
 */
import { useReducer, useCallback, useEffect, useRef } from 'react';
import { gameReducer, initialState, A } from './gameReducer.js';
import {
    GAME_PHASES,
    TILE_TYPES,
    PRAISE_MESSAGES,
    SCORING,
    computeFinalScore,
    allBucketsFull,
} from '../config/gameConfig.js';
import {
    findMatches,
    wouldCreateMatch,
    getMatchedTypes,
    removeMatches,
    applyGravity,
    refillGrid,
} from '../../../core/matchEngine/index.js';
import { submitToLMS } from '../services/apiClient.js';

// Audio Assets
import swapSoundUrl from '../../assets/audio/swapping.wav';
import burstSoundUrl from '../../assets/audio/burst_audio.wav';

let floatId = 0;
function nextFloatId() {
    return `f-${++floatId}`;
}

// Preload Audio
const audioCache = {
    swap: new Audio(swapSoundUrl),
    burst: new Audio(burstSoundUrl),
};

// Configure Audio
Object.values(audioCache).forEach(audio => {
    audio.volume = 0.6;
    audio.preload = 'auto'; // ensure ready
});

// Helper to play sound (clones to allow overlapping)
const playSound = (type) => {
    if (type === 'swap' || type === 'burst') {
        const sound = audioCache[type];
        if (sound) {
            const clone = sound.cloneNode();
            clone.volume = 0.6;
            clone.play().catch(() => { });
        }
    }
};



export function useMatchGame() {
    const [state, dispatch] = useReducer(gameReducer, initialState);

    const timerRef = useRef(null);
    const leadFiredRef = useRef(false);
    const praiseTimeoutRef = useRef(null);
    const voiceRef = useRef(null);

    // ── Preload Voices (Fix for first occurring male voice) ────────────
    useEffect(() => {
        const loadVoices = () => {
            const voices = window.speechSynthesis.getVoices();
            if (voices.length > 0) {
                // Prioritize Female
                const femaleVoice = voices.find(v =>
                    v.name.includes('Zira') ||
                    v.name.includes('Samantha') ||
                    v.name.includes('Google US English') ||
                    v.name.includes('Female')
                );
                if (femaleVoice) {
                    voiceRef.current = femaleVoice;
                }
            }
        };

        loadVoices();
        if (typeof window !== 'undefined' && window.speechSynthesis) {
            window.speechSynthesis.onvoiceschanged = loadVoices;
        }

        return () => {
            if (typeof window !== 'undefined' && window.speechSynthesis) {
                window.speechSynthesis.onvoiceschanged = null;
            }
        };
    }, []);

    const speakPraise = useCallback((text) => {
        if (!window.speechSynthesis) return;
        window.speechSynthesis.cancel();

        const utter = new SpeechSynthesisUtterance(text);
        utter.rate = 1.1;
        utter.pitch = 1.2;
        utter.volume = 1.0;

        if (voiceRef.current) {
            utter.voice = voiceRef.current;
        } else {
            // Fallback try
            const voices = window.speechSynthesis.getVoices();
            const femaleVoice = voices.find(v =>
                v.name.includes('Zira') ||
                v.name.includes('Samantha') ||
                v.name.includes('Google US English') ||
                v.name.includes('Female')
            );
            if (femaleVoice) utter.voice = femaleVoice;
        }

        window.speechSynthesis.speak(utter);
    }, []);

    // ── Timer (1Hz countdown) ──────────────────────────────────────────
    useEffect(() => {
        if (state.gameStatus === GAME_PHASES.PLAYING) {
            timerRef.current = setInterval(() => {
                dispatch({ type: A.TICK });
            }, 1000);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [state.gameStatus]);

    // ── Win Condition Watcher (Updates frequently) ─────────────────────
    useEffect(() => {
        if (state.gameStatus === GAME_PHASES.PLAYING) {
            if (allBucketsFull(state.buckets)) {
                dispatch({ type: A.FINISH_GAME });
            }
        }
    }, [state.gameStatus, state.buckets]);

    // ── Phase Transition Watcher (Strict) ──────────────────────────────
    useEffect(() => {
        const { gameStatus } = state;

        if (gameStatus === GAME_PHASES.FINISHED) {
            if (timerRef.current) clearInterval(timerRef.current);
            // Wait 1.5s then show result
            const t = setTimeout(() => {
                dispatch({ type: A.SHOW_RESULT });
            }, 1500);
            return () => clearTimeout(t);
        }

        if (gameStatus === GAME_PHASES.EXITED) {
            if (timerRef.current) clearInterval(timerRef.current);

            // Submit partial score lead
            if (!leadFiredRef.current && state.entryDetails) {
                leadFiredRef.current = true;
                const score = computeFinalScore(state.buckets);
                submitToLMS({
                    name: state.entryDetails.name,
                    mobile_no: state.entryDetails.mobile,
                    summary_dtls: `Balance Builder - Early Exit - Score: ${score}/100`,
                    p_data_source: 'BALANCE_BUILDER_LEAD',
                });
            }

            const t = setTimeout(() => {
                dispatch({ type: A.SHOW_RESULT });
            }, 800);
            return () => clearTimeout(t);
        }
    }, [state.gameStatus]); // Depends ONLY on status to avoid reset loops

    // ── Cleanup ────────────────────────────────────────────────────────
    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
            if (praiseTimeoutRef.current) clearTimeout(praiseTimeoutRef.current);
        };
    }, []);

    const handleEntrySubmit = useCallback(async (name, mobile) => {
        dispatch({ type: A.SET_ENTRY, payload: { name, mobile } });
        leadFiredRef.current = false;
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const dateStr = tomorrow.toISOString().split('T')[0];

        await submitToLMS({
            name: name.trim(),
            mobile_no: mobile,
            param4: dateStr,
            param19: '09:00 AM',
            summary_dtls: 'Balance Builder Lead',
            p_data_source: 'BALANCE_BUILDER_LEAD',
        });

        dispatch({ type: A.SHOW_HOW_TO_PLAY });
    }, []);

    const startGame = useCallback(() => {
        dispatch({ type: A.START_GAME });
    }, []);

    // ── Cell Tap Logic ──────────────────────────────────────────────
    const handleCellTap = useCallback(
        (row, col) => {
            if (state.isProcessing || state.gameStatus !== GAME_PHASES.PLAYING) return;

            const { selectedCell, grid } = state;

            if (!selectedCell) {
                dispatch({ type: A.SELECT_CELL, payload: { row, col } });
                return;
            }

            if (selectedCell.row === row && selectedCell.col === col) {
                dispatch({ type: A.DESELECT });
                return;
            }

            // Check adjacency
            const { row: r1, col: c1 } = selectedCell;
            const r2 = row;
            const c2 = col;
            const isAdjacent = (Math.abs(r1 - r2) === 1 && c1 === c2) || (Math.abs(c1 - c2) === 1 && r1 === r2);

            if (!isAdjacent) {
                dispatch({ type: A.SELECT_CELL, payload: { row, col } });
                return;
            }

            const isValid = wouldCreateMatch(grid, r1, c1, r2, c2);

            if (!isValid) {
                dispatch({ type: A.APPLY_INVALID_SWAP });
                return;
            }

            // Valid Swap
            playSound('swap');
            dispatch({ type: A.SET_PROCESSING, payload: true });

            const newGrid = grid.map((r) => r.map((c) => ({ ...c })));
            const a = { ...newGrid[r1][c1] };
            const b = { ...newGrid[r2][c2] };
            newGrid[r1][c1] = { ...b, row: r1, col: c1 };
            newGrid[r2][c2] = { ...a, row: r2, col: c2 };

            resolveChain(newGrid);
        },
        [state.isProcessing, state.gameStatus, state.selectedCell, state.grid] // eslint-disable-line react-hooks/exhaustive-deps
    );

    // ── Chain Resolution (Async) ────────────────────────────────────
    const resolveChain = useCallback(
        async (swappedGrid) => {
            let currentGrid = swappedGrid;
            let chainStep = 0;
            let totalPointsThisChain = 0;

            while (true) {
                const matchedKeys = findMatches(currentGrid);
                if (matchedKeys.size === 0) break;

                chainStep++;
                const matchLen = matchedKeys.size;
                const matchedTypes = [...getMatchedTypes(currentGrid, matchedKeys)];

                // Points
                let pts = SCORING.match3;
                if (matchLen >= 5) pts = SCORING.match5;
                else if (matchLen >= 4) pts = SCORING.match4;
                const bonus = (chainStep > 1 ? SCORING.comboBonus : 0) + (chainStep > 2 ? SCORING.cascadeBonus : 0);
                totalPointsThisChain += pts + bonus;

                // Visuals & Sound
                playSound('burst');

                // Update State (Explode)
                dispatch({
                    type: A.APPLY_MATCH,
                    payload: {
                        matchedTypes,
                        matchLen,
                        comboStep: chainStep,
                        explodingCells: [...matchedKeys],
                        newGrid: currentGrid,
                    },
                });

                // Float UI
                addFloat(`+${pts + bonus}`, matchedTypes[0]);

                // Logic: Remove -> Gravity -> Refill
                const removed = removeMatches(currentGrid, matchedKeys);
                const gravitated = applyGravity(removed);
                currentGrid = refillGrid(gravitated, TILE_TYPES, 0);

                await new Promise((res) => setTimeout(res, 450));
            }

            // Final Grid Set
            dispatch({ type: A.SET_GRID, payload: currentGrid });
            dispatch({ type: A.CLEAR_EXPLOSIONS });

            // Praise Logic: Strictly after cascade settles
            if (chainStep >= 2 || totalPointsThisChain >= 25) {
                await new Promise((res) => setTimeout(res, 100));
                showPraise();
            }
        },
        [] // eslint-disable-line react-hooks/exhaustive-deps
    );

    const showPraise = useCallback(() => {
        const msg = PRAISE_MESSAGES[Math.floor(Math.random() * PRAISE_MESSAGES.length)];
        speakPraise(msg);
        dispatch({ type: A.SHOW_PRAISE, payload: msg });

        if (praiseTimeoutRef.current) clearTimeout(praiseTimeoutRef.current);
        praiseTimeoutRef.current = setTimeout(() => {
            dispatch({ type: A.HIDE_PRAISE });
        }, 1500);
    }, []);

    const addFloat = useCallback((value, tileType) => {
        const id = nextFloatId();
        dispatch({
            type: A.ADD_FLOAT,
            payload: {
                id,
                value,
                x: 40 + Math.random() * 20,
                y: 40 + Math.random() * 20,
            },
        });
        setTimeout(() => {
            dispatch({ type: A.REMOVE_FLOAT, payload: id });
        }, 800);
    }, []);

    // Public Actions
    const exitGame = useCallback(() => {
        dispatch({ type: A.EXIT_GAME });
    }, []);

    const restartGame = useCallback(() => {
        leadFiredRef.current = false;
        dispatch({ type: A.RESTART_GAME });
    }, []);

    const showThankYou = useCallback(() => {
        dispatch({ type: A.SHOW_THANK_YOU });
    }, []);

    const handleBookSlot = useCallback(
        async (formData) => {
            try {
                await submitToLMS({
                    name: formData.name,
                    mobile_no: formData.mobile,
                    param4: formData.date,
                    param19: formData.time,
                    summary_dtls: 'Balance Builder - Slot Booking',
                    p_data_source: 'BALANCE_BUILDER_BOOKING',
                });
            } catch (error) {
                console.error("Booking failed", error);
            } finally {
                dispatch({ type: A.SHOW_THANK_YOU });
            }
        },
        []
    );

    const finalScore = computeFinalScore(state.buckets);

    return {
        state,
        finalScore,
        handleEntrySubmit,
        startGame,
        handleCellTap,
        exitGame,
        restartGame,
        showThankYou,
        handleBookSlot,
    };
}
