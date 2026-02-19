/**
 * Balance Builder — Game Configuration
 * Single 2-minute match session with 4-color bucket system.
 * Branding: "Bajaj Life Insurance" (never "Bajaj Allianz Life Insurance").
 */

// ── Tile Types (4 colors only) ─────────────────────────────────────────

export const TILE_TYPES = ['GREEN', 'BLUE', 'YELLOW', 'RED'];

export const TILE_META = {
    GREEN: {
        label: 'Family Plan',
        color: '#10B981',
        bg: 'linear-gradient(145deg, #059669 0%, #10B981 50%, #34D399 100%)',
        glow: 'rgba(16, 185, 129, 0.45)',
        bucketBg: 'linear-gradient(180deg, #064E3B 0%, #059669 100%)',
        bucketBorder: 'rgba(16, 185, 129, 0.5)',
    },
    BLUE: {
        label: 'Child Education Plan',
        color: '#3B82F6',
        bg: 'linear-gradient(145deg, #1D4ED8 0%, #3B82F6 50%, #60A5FA 100%)',
        glow: 'rgba(59, 130, 246, 0.45)',
        bucketBg: 'linear-gradient(180deg, #1E3A5F 0%, #1D4ED8 100%)',
        bucketBorder: 'rgba(59, 130, 246, 0.5)',
    },
    YELLOW: {
        label: 'Retirement Plan',
        color: '#F59E0B',
        bg: 'linear-gradient(145deg, #D97706 0%, #F59E0B 50%, #FBBF24 100%)',
        glow: 'rgba(245, 158, 11, 0.45)',
        bucketBg: 'linear-gradient(180deg, #78350F 0%, #D97706 100%)',
        bucketBorder: 'rgba(245, 158, 11, 0.5)',
    },
    RED: {
        label: 'Emergency Fund',
        color: '#EF4444',
        bg: 'linear-gradient(145deg, #B91C1C 0%, #EF4444 50%, #F87171 100%)',
        glow: 'rgba(239, 68, 68, 0.45)',
        bucketBg: 'linear-gradient(180deg, #7F1D1D 0%, #DC2626 100%)',
        bucketBorder: 'rgba(239, 68, 68, 0.5)',
    },
};

// ── Bucket Scoring ─────────────────────────────────────────────────────

// Increased to 400 to make the game challenging (approx 30-40 matches per bucket)
export const BUCKET_MAX = 400;

export const SCORING = {
    match3: 10,
    match4: 18,
    match5: 30,
    comboBonus: 5,
    cascadeBonus: 7,
};

// ── Timer ──────────────────────────────────────────────────────────────

export const GAME_DURATION_SECONDS = 120; // 2 minutes

// ── Praise Messages ────────────────────────────────────────────────────

export const PRAISE_MESSAGES = [
    'Good Job!',
    'Excellent!',
    'Amazing!',
    'Outstanding!',
    'Perfect!',
    'Well Done!',
    'Brilliant!',
    'Keep Going!',
];

// ── Game Phases ────────────────────────────────────────────────────────

export const GAME_PHASES = {
    LANDING: 'landing',
    ENTRY: 'entry',
    HOW_TO_PLAY: 'how_to_play',
    PLAYING: 'playing',
    FINISHED: 'finished',
    RESULT: 'result',
    THANK_YOU: 'thank_you',
    EXITED: 'exited',
};

// ── Score Calculation ──────────────────────────────────────────────────

export function computeFinalScore(buckets) {
    if (!buckets) return 0;

    // Sum points for all 4 types (default 0 if missing)
    const totalPoints = TILE_TYPES.reduce((acc, type) => {
        const val = buckets[type] || 0;
        return acc + Math.min(val, BUCKET_MAX);
    }, 0);

    const maxPossible = TILE_TYPES.length * BUCKET_MAX;

    // Normalize to 0-100 percentage
    const percentage = (totalPoints / maxPossible) * 100;

    return Math.round(Math.min(percentage, 100));
}

export function allBucketsFull(buckets) {
    if (!buckets) return false;
    // Check if ALL buckets reached BUCKET_MAX
    return TILE_TYPES.every(type => (buckets[type] || 0) >= BUCKET_MAX);
}

export function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}
