/**
 * Balance Builder — Game Reducer
 * Single-session 2-minute timer with bucket scoring.
 * No stages, no protection meter, no risk tiles.
 */

import {
    GAME_PHASES,
    TILE_TYPES,
    BUCKET_MAX,
    SCORING,
    computeFinalScore,
    clamp,
} from '../config/gameConfig.js';
import { createMatchEngine } from '../../../core/matchEngine/index.js';

// ── Action Types ────────────────────────────────────────────────────────

export const A = {
    SET_ENTRY: 'SET_ENTRY',
    SHOW_HOW_TO_PLAY: 'SHOW_HOW_TO_PLAY',
    START_GAME: 'START_GAME',
    TICK: 'TICK',
    FINISH_GAME: 'FINISH_GAME',
    SHOW_RESULT: 'SHOW_RESULT',
    SHOW_THANK_YOU: 'SHOW_THANK_YOU',
    EXIT_GAME: 'EXIT_GAME',
    RESTART_GAME: 'RESTART_GAME',

    SELECT_CELL: 'SELECT_CELL',
    DESELECT: 'DESELECT',
    SET_PROCESSING: 'SET_PROCESSING',
    APPLY_MATCH: 'APPLY_MATCH',
    APPLY_INVALID_SWAP: 'APPLY_INVALID_SWAP',
    SET_GRID: 'SET_GRID',
    CLEAR_EXPLOSIONS: 'CLEAR_EXPLOSIONS',

    ADD_FLOAT: 'ADD_FLOAT',
    REMOVE_FLOAT: 'REMOVE_FLOAT',

    SHOW_PRAISE: 'SHOW_PRAISE',
    HIDE_PRAISE: 'HIDE_PRAISE',
};

// ── Initial State ──────────────────────────────────────────────────────

export const initialState = {
    entryDetails: null,
    gameStatus: GAME_PHASES.LANDING,
    timeLeft: 120,

    grid: null,
    selectedCell: null,
    explodingCells: new Set(),
    floatingScores: [],
    isProcessing: false,

    buckets: {
        GREEN: 0,
        BLUE: 0,
        YELLOW: 0,
        RED: 0,
    },

    totalMatches: 0,
    maxCombo: 0,
    activeCombo: 0,
    activePraise: null,
};

// ── Helpers ────────────────────────────────────────────────────────────

function addToBucket(buckets, type, points) {
    const copy = { ...buckets };
    if (copy[type] !== undefined) {
        copy[type] = clamp(copy[type] + points, 0, BUCKET_MAX);
    }
    return copy;
}

// ── Reducer ────────────────────────────────────────────────────────────

export function gameReducer(state, action) {
    switch (action.type) {

        case A.SET_ENTRY:
            return {
                ...state,
                entryDetails: action.payload,
                // Stay in LANDING so popup doesn't unmount prematurely
            };

        case A.SHOW_HOW_TO_PLAY:
            return { ...state, gameStatus: GAME_PHASES.HOW_TO_PLAY };

        case A.START_GAME: {
            const eng = createMatchEngine({
                tileTypes: TILE_TYPES,
                maxMoves: 999,
            });
            return {
                ...state,
                grid: eng.initialGrid,
                buckets: { GREEN: 0, BLUE: 0, YELLOW: 0, RED: 0 },
                timeLeft: 120,
                totalMatches: 0,
                maxCombo: 0,
                activeCombo: 0,
                selectedCell: null,
                explodingCells: new Set(),
                floatingScores: [],
                activePraise: null,
                isProcessing: false,
                gameStatus: GAME_PHASES.PLAYING,
            };
        }

        case A.TICK: {
            const newTime = Math.max(0, state.timeLeft - 1);
            if (newTime <= 0) {
                return {
                    ...state,
                    timeLeft: 0,
                    gameStatus: GAME_PHASES.FINISHED,
                    isProcessing: false,
                };
            }
            return { ...state, timeLeft: newTime };
        }

        case A.FINISH_GAME:
            return {
                ...state,
                gameStatus: GAME_PHASES.FINISHED,
                isProcessing: false,
            };

        case A.SHOW_RESULT:
            return { ...state, gameStatus: GAME_PHASES.RESULT };

        case A.SHOW_THANK_YOU:
            return { ...state, gameStatus: GAME_PHASES.THANK_YOU };

        case A.EXIT_GAME:
            return {
                ...state,
                gameStatus: GAME_PHASES.EXITED,
                isProcessing: false,
            };

        case A.RESTART_GAME:
            return {
                ...initialState,
                entryDetails: state.entryDetails,
                gameStatus: state.entryDetails ? GAME_PHASES.HOW_TO_PLAY : GAME_PHASES.LANDING,
            };

        /* ── Grid Interactions ── */

        case A.SELECT_CELL:
            return { ...state, selectedCell: action.payload };

        case A.DESELECT:
            return { ...state, selectedCell: null };

        case A.SET_PROCESSING:
            return { ...state, isProcessing: action.payload };

        case A.APPLY_MATCH: {
            const {
                matchedTypes,
                matchLen,
                comboStep,
                explodingCells,
                newGrid,
            } = action.payload;

            /* Calculate bucket points per matched type */
            let bucketPoints = SCORING.match3;
            if (matchLen >= 5) bucketPoints = SCORING.match5;
            else if (matchLen >= 4) bucketPoints = SCORING.match4;

            const bonus =
                (comboStep > 1 ? SCORING.comboBonus : 0) +
                (comboStep > 2 ? SCORING.cascadeBonus : 0);

            let newBuckets = { ...state.buckets };
            for (const type of matchedTypes) {
                newBuckets = addToBucket(newBuckets, type, bucketPoints + bonus);
            }

            return {
                ...state,
                grid: newGrid,
                buckets: newBuckets,
                totalMatches: state.totalMatches + 1,
                activeCombo: comboStep,
                maxCombo: Math.max(state.maxCombo, comboStep),
                explodingCells: new Set(explodingCells),
                selectedCell: null,
            };
        }

        case A.APPLY_INVALID_SWAP:
            return {
                ...state,
                selectedCell: null,
                isProcessing: false,
            };

        case A.SET_GRID:
            return { ...state, grid: action.payload };

        case A.CLEAR_EXPLOSIONS:
            return { ...state, explodingCells: new Set(), isProcessing: false };

        case A.ADD_FLOAT:
            return { ...state, floatingScores: [...state.floatingScores, action.payload] };

        case A.REMOVE_FLOAT:
            return { ...state, floatingScores: state.floatingScores.filter((f) => f.id !== action.payload) };

        case A.SHOW_PRAISE:
            return { ...state, activePraise: action.payload };

        case A.HIDE_PRAISE:
            return { ...state, activePraise: null };

        default:
            return state;
    }
}
