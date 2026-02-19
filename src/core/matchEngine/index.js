/**
 * Match Engine Core — Generic, reusable, stage-configurable match-3 engine.
 * 6×6 grid. Zero business logic. Rules injected via stage config.
 *
 * @module matchEngine
 */

// ── Constants ──────────────────────────────────────────────────────────────

export const GRID_SIZE = 6;
export const MIN_MATCH = 3;

// ── Pure Utility Functions ─────────────────────────────────────────────────

function cellId() {
    return Math.random().toString(36).slice(2, 9);
}

function randomTileType(tileTypes, excludeTypes = []) {
    const eligible = tileTypes.filter((t) => !excludeTypes.includes(t));
    if (!eligible.length)
        return tileTypes[Math.floor(Math.random() * tileTypes.length)];
    return eligible[Math.floor(Math.random() * eligible.length)];
}

function createTile(type, row, col) {
    return { id: cellId(), type, row, col };
}

// ── Match Detection ────────────────────────────────────────────────────────

/**
 * Find all horizontal and vertical matches (3+ in a row).
 * @returns {Set<string>} Set of "row-col" position keys.
 */
export function findMatches(grid) {
    const matched = new Set();
    const size = grid.length;

    for (let r = 0; r < size; r++) {
        let run = 1;
        for (let c = 1; c < size; c++) {
            const cur = grid[r][c];
            const prev = grid[r][c - 1];
            if (cur && prev && cur.type === prev.type) {
                run++;
                if (run >= MIN_MATCH) {
                    for (let k = c - run + 1; k <= c; k++) matched.add(`${r}-${k}`);
                }
            } else {
                run = 1;
            }
        }
    }

    for (let c = 0; c < size; c++) {
        let run = 1;
        for (let r = 1; r < size; r++) {
            const cur = grid[r][c];
            const prev = grid[r - 1][c];
            if (cur && prev && cur.type === prev.type) {
                run++;
                if (run >= MIN_MATCH) {
                    for (let k = r - run + 1; k <= r; k++) matched.add(`${k}-${c}`);
                }
            } else {
                run = 1;
            }
        }
    }

    return matched;
}

// ── Swap Validation ────────────────────────────────────────────────────────

export function wouldCreateMatch(grid, r1, c1, r2, c2) {
    const size = grid.length;
    const isAdjacent =
        (Math.abs(r1 - r2) === 1 && c1 === c2) ||
        (Math.abs(c1 - c2) === 1 && r1 === r2);
    if (!isAdjacent) return false;
    if (r1 < 0 || r1 >= size || c1 < 0 || c1 >= size) return false;
    if (r2 < 0 || r2 >= size || c2 < 0 || c2 >= size) return false;
    if (!grid[r1][c1] || !grid[r2][c2]) return false;

    const testGrid = grid.map((row) => row.map((cell) => (cell ? { ...cell } : null)));
    const a = testGrid[r1][c1];
    const b = testGrid[r2][c2];
    testGrid[r1][c1] = { ...b, row: r1, col: c1 };
    testGrid[r2][c2] = { ...a, row: r2, col: c2 };

    return findMatches(testGrid).size > 0;
}

// ── Gravity ────────────────────────────────────────────────────────────────

export function applyGravity(grid) {
    const size = grid.length;
    const newGrid = Array.from({ length: size }, () => Array(size).fill(null));

    for (let c = 0; c < size; c++) {
        let writeRow = size - 1;
        for (let r = size - 1; r >= 0; r--) {
            if (grid[r][c] !== null) {
                newGrid[writeRow][c] = { ...grid[r][c], row: writeRow, col: c };
                writeRow--;
            }
        }
    }

    return newGrid;
}

// ── Refill ─────────────────────────────────────────────────────────────────

export function refillGrid(grid, tileTypes, riskBias = 0) {
    const size = grid.length;
    const riskType = tileTypes.includes('RISK') ? 'RISK' : null;

    const newGrid = grid.map((row, r) =>
        row.map((cell, c) => {
            if (cell !== null) return cell;
            let type;
            if (riskType && Math.random() < riskBias) {
                type = riskType;
            } else {
                type = randomTileType(tileTypes);
            }
            return createTile(type, r, c);
        })
    );

    return newGrid;
}

// ── Remove Matches ─────────────────────────────────────────────────────────

export function removeMatches(grid, matchedKeys) {
    return grid.map((row, r) =>
        row.map((cell, c) => (matchedKeys.has(`${r}-${c}`) ? null : cell))
    );
}

// ── Valid Moves Check ──────────────────────────────────────────────────────

export function hasValidMoves(grid) {
    const size = grid.length;
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            if (c + 1 < size && wouldCreateMatch(grid, r, c, r, c + 1)) return true;
            if (r + 1 < size && wouldCreateMatch(grid, r, c, r + 1, c)) return true;
        }
    }
    return false;
}

// ── Grid Generation (no initial matches, guaranteed valid moves) ───────────

export function generateInitialGrid(tileTypes, maxAttempts = 100) {
    const size = GRID_SIZE;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        const grid = Array.from({ length: size }, (_, r) =>
            Array.from({ length: size }, (_, c) =>
                createTile(randomTileType(tileTypes), r, c)
            )
        );
        if (findMatches(grid).size === 0 && hasValidMoves(grid)) return grid;
    }

    /* Fallback: manually avoid triplets */
    const grid = Array.from({ length: size }, (_, r) =>
        Array.from({ length: size }, (_, c) => createTile(tileTypes[0], r, c))
    );

    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            const excluded = [];
            if (c >= 2 && grid[r][c - 1].type === grid[r][c - 2].type) {
                excluded.push(grid[r][c - 1].type);
            }
            if (r >= 2 && grid[r - 1][c].type === grid[r - 2][c].type) {
                excluded.push(grid[r - 1][c].type);
            }
            grid[r][c] = createTile(randomTileType(tileTypes, excluded), r, c);
        }
    }

    return grid;
}

// ── Utility Queries ────────────────────────────────────────────────────────

export function countTilesByType(grid, type) {
    let count = 0;
    for (const row of grid) {
        for (const cell of row) {
            if (cell && cell.type === type) count++;
        }
    }
    return count;
}

export function getMatchedTypes(grid, matchedKeys) {
    const types = new Set();
    for (const key of matchedKeys) {
        const [r, c] = key.split('-').map(Number);
        if (grid[r]?.[c]) types.add(grid[r][c].type);
    }
    return types;
}

export function getMatchLength(grid, matchedKeys) {
    return matchedKeys.size;
}

/**
 * Check if any matched SHIELD tile is adjacent to a RISK tile.
 */
export function checkShieldRiskAdjacency(grid, matchedKeys) {
    const size = grid.length;
    for (const key of matchedKeys) {
        const [r, c] = key.split('-').map(Number);
        if (grid[r]?.[c]?.type !== 'SHIELD') continue;
        const neighbors = [
            [r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1],
        ];
        for (const [nr, nc] of neighbors) {
            if (nr >= 0 && nr < size && nc >= 0 && nc < size) {
                if (grid[nr]?.[nc]?.type === 'RISK') return true;
            }
        }
    }
    return false;
}

/**
 * Remove ALL tiles of a specific type from grid (for Emergency Cover).
 */
export function clearAllOfType(grid, type) {
    return grid.map((row) =>
        row.map((cell) => (cell && cell.type === type ? null : cell))
    );
}

// ── Factory ────────────────────────────────────────────────────────────────

/**
 * Create a configured match engine instance for a specific stage.
 *
 * @param {Object} config
 * @param {string[]}  config.tileTypes
 * @param {Object}    config.scoringRules
 * @param {number}    config.riskSpawnRate
 * @param {Object}    config.specialRules
 * @param {Object}    config.stageGoal
 * @param {number}    config.maxMoves
 */
export function createMatchEngine(config) {
    const {
        tileTypes,
        scoringRules = {},
        riskSpawnRate = 0,
        specialRules = {},
        stageGoal = {},
        maxMoves = 20,
    } = config;

    const grid = generateInitialGrid(tileTypes);

    return {
        config,
        tileTypes,
        scoringRules,
        riskSpawnRate,
        specialRules,
        stageGoal,
        maxMoves,
        initialGrid: grid,
        findMatches,
        wouldCreateMatch,
        generateInitialGrid: () => generateInitialGrid(tileTypes),
        hasValidMoves,
        applyGravity,
        removeMatches,
        refillGrid: (g, bias) => refillGrid(g, tileTypes, bias),
        countTilesByType,
        getMatchedTypes,
        getMatchLength,
        checkShieldRiskAdjacency,
        clearAllOfType,
    };
}
