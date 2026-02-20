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

// ── Audio Pooling System (Memory Safety) ─────────────────────────────
const AUDIO_POOL_SIZE = 2;
const AUDIO_POOL = {
    swap: [],
    burst: [],
};

let audioInitialized = false;

function initAudio() {
    if (audioInitialized) return;
    audioInitialized = true;

    for (let i = 0; i < AUDIO_POOL_SIZE; i++) {
        const s1 = new Audio(swapSoundUrl);
        s1.volume = 0.6;
        s1.preload = 'auto';
        AUDIO_POOL.swap.push(s1);

        const s2 = new Audio(burstSoundUrl);
        s2.volume = 0.6;
        s2.preload = 'auto';
        AUDIO_POOL.burst.push(s2);
    }
}

const playSound = (type) => {
    if (!audioInitialized) initAudio();
    const pool = AUDIO_POOL[type];
    if (pool && pool.length > 0) {
        // Find a free channel or takeover the first one
        const sound = pool.find((s) => s.paused) || pool[0];
        sound.currentTime = 0;
        sound.play().catch(() => { });
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

        if (gameStatus === GAME_PHASES.TUTORIAL) {
            // Auto-advance tutorial after 3 seconds
            const t = setTimeout(() => {
                localStorage.setItem('bb_tutorial_completed', 'true');
                dispatch({ type: A.COMPLETE_TUTORIAL });
            }, 3000);
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
        initAudio(); // Lazy load audio
        const hasSeenTutorial = localStorage.getItem('bb_tutorial_completed');
        if (hasSeenTutorial === 'true') {
            dispatch({ type: A.START_GAME });
        } else {
            dispatch({ type: A.START_GAME }); // Start initializes grid
            // Then immediately switch to tutorial phase
            // Ideally we'd pass payload to START_GAME but let's just dispatch second action for simplicity
            // or modify START_GAME to handle it. 
            // Better: Dispatch START_GAME, then dispatch SHOW_TUTORIAL if needed.
            dispatch({ type: A.SHOW_TUTORIAL });
        }
    }, []);

    const showPraise = useCallback(() => {
        const msg = PRAISE_MESSAGES[Math.floor(Math.random() * PRAISE_MESSAGES.length)];
        speakPraise(msg);
        dispatch({ type: A.SHOW_PRAISE, payload: msg });

        if (praiseTimeoutRef.current) clearTimeout(praiseTimeoutRef.current);
        praiseTimeoutRef.current = setTimeout(() => {
            dispatch({ type: A.HIDE_PRAISE });
        }, 1500);
    }, [speakPraise]);

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

    // ── Batched Cascade Resolution (Performance Optimized) ──────────
    const resolveChain = useCallback(
        async (startGrid) => {
            let currentGrid = startGrid;
            const steps = [];

            // 1. Calculate Entire Cascade Sequence In-Memory
            while (true) {
                const matchedKeys = findMatches(currentGrid);
                if (matchedKeys.size === 0) break;

                const matchedTypes = [...getMatchedTypes(currentGrid, matchedKeys)];

                // Logic: Remove -> Gravity -> Refill
                const removed = removeMatches(currentGrid, matchedKeys);
                const gravitated = applyGravity(removed);
                const nextGrid = refillGrid(gravitated, TILE_TYPES, 0);

                steps.push({
                    grid: nextGrid, // The resulting grid for this step
                    matchedTypes,
                    matchLen: matchedKeys.size,
                    explodingCells: matchedKeys
                });

                currentGrid = nextGrid;
            }

            // 2. Dispatch Each Step with Visual Delay
            if (steps.length === 0) {
                dispatch({ type: A.SET_PROCESSING, payload: false });
                return;
            }

            let chainStep = 0;
            for (const step of steps) {
                chainStep++;
                playSound('burst');

                // Visual Extras (Floaters)
                const { matchedTypes, matchLen } = step;
                let pts = SCORING.match3;
                if (matchLen >= 5) pts = SCORING.match5;
                else if (matchLen >= 4) pts = SCORING.match4;
                const bonus = (chainStep > 1 ? SCORING.comboBonus : 0) + (chainStep > 2 ? SCORING.cascadeBonus : 0);
                const total = pts + bonus;

                addFloat(`+${total}`, matchedTypes[0]);

                // Dispatch "RESOLVE_CASCADE"
                dispatch({
                    type: A.RESOLVE_CASCADE,
                    payload: {
                        grid: step.grid,
                        matchedTypes: step.matchedTypes,
                        matchLen: step.matchLen,
                        comboStep: chainStep,
                        // Note: explodingCells is used internally by reducer for logic if needed, 
                        // but currently RESOLVE_CASCADE just moves to next grid.
                        // If we want to animate explosion, we might need to verify logic.
                        // Assuming new grid + waiting is enough based on request.
                    }
                });

                // Visual Lag (Wait for user to see update)
                await new Promise((res) => setTimeout(res, 450));
            }

            // Praise Logic
            if (chainStep >= 2) {
                await new Promise((res) => setTimeout(res, 100));
                showPraise();
            }

            dispatch({ type: A.SET_PROCESSING, payload: false });
        },
        [addFloat, showPraise]
    );

    // ── Cell Tap Logic ──────────────────────────────────────────────
    const handleCellTap = useCallback(
        (row, col) => {
            initAudio();
            const isPlaying = state.gameStatus === GAME_PHASES.PLAYING;
            const isTutorial = state.gameStatus === GAME_PHASES.TUTORIAL;

            if (state.isProcessing || (!isPlaying && !isTutorial)) return;

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

            // If in Tutorial, complete it now
            if (isTutorial) {
                localStorage.setItem('bb_tutorial_completed', 'true');
                dispatch({ type: A.COMPLETE_TUTORIAL });
            }

            dispatch({ type: A.SET_PROCESSING, payload: true });

            const newGrid = grid.map((r) => r.map((c) => ({ ...c })));
            const a = { ...newGrid[r1][c1] };
            const b = { ...newGrid[r2][c2] };
            newGrid[r1][c1] = { ...b, row: r1, col: c1 };
            newGrid[r2][c2] = { ...a, row: r2, col: c2 };

            resolveChain(newGrid);
        },
        [state.isProcessing, state.gameStatus, state.selectedCell, state.grid, resolveChain]
    );

    // ── Drag Swap Logic (New) ───────────────────────────────────────
    const handleDragSwap = useCallback(
        (r1, c1, r2, c2) => {
            initAudio();
            const isPlaying = state.gameStatus === GAME_PHASES.PLAYING;
            const isTutorial = state.gameStatus === GAME_PHASES.TUTORIAL;

            if (state.isProcessing || (!isPlaying && !isTutorial)) return;

            // Validate adjacency logic again (just in case)
            const isAdjacent = (Math.abs(r1 - r2) === 1 && c1 === c2) || (Math.abs(c1 - c2) === 1 && r1 === r2);
            if (!isAdjacent) return;

            const grid = state.grid;
            const isValid = wouldCreateMatch(grid, r1, c1, r2, c2);

            if (!isValid) {
                dispatch({ type: A.APPLY_INVALID_SWAP });
                return;
            }

            // Valid Swap
            playSound('swap');

            // If in Tutorial, complete it now
            if (isTutorial) {
                localStorage.setItem('bb_tutorial_completed', 'true');
                dispatch({ type: A.COMPLETE_TUTORIAL });
            }

            dispatch({ type: A.SET_PROCESSING, payload: true });
            dispatch({ type: A.DESELECT });

            const newGrid = grid.map((r) => r.map((c) => ({ ...c })));
            const a = { ...newGrid[r1][c1] };
            const b = { ...newGrid[r2][c2] };
            newGrid[r1][c1] = { ...b, row: r1, col: c1 };
            newGrid[r2][c2] = { ...a, row: r2, col: c2 };

            resolveChain(newGrid);
        },
        [state.isProcessing, state.gameStatus, state.grid, resolveChain]
    );

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
        handleDragSwap,
        exitGame,
        restartGame,
        showThankYou,
        handleBookSlot,
    };
}
