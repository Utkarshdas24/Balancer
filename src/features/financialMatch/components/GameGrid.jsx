/**
 * GameGrid — Premium glass board container, 6x6 grid, centered praise overlay.
 */
import { memo, useCallback, useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { GRID_SIZE } from '../../../core/matchEngine/index.js';
import GameTile from './GameTile.jsx';

const GameGrid = memo(function GameGrid({
    grid,
    selectedCell,
    explodingCells,
    floatingScores,
    activePraise,
    onCellTap,
    onSwap,
}) {
    const containerRef = useRef(null);
    const [cellSize, setCellSize] = useState(48);

    // Responsive Cell Sizing - Throttled
    useEffect(() => {
        if (!containerRef.current) return;

        let frameId;
        const observer = new ResizeObserver((entries) => {
            if (frameId) cancelAnimationFrame(frameId);
            frameId = requestAnimationFrame(() => {
                const width = entries[0].contentRect.width;
                // Subtract padding (16px total) and gap (3px * 5)
                const availableW = width - 24;
                const maxByWidth = Math.floor(availableW / GRID_SIZE);
                // Clamp size (Mobile small -> Desktop large)
                setCellSize(Math.max(42, Math.min(64, maxByWidth)));
            });
        });

        observer.observe(containerRef.current);
        return () => {
            observer.disconnect();
            if (frameId) cancelAnimationFrame(frameId);
        };
    }, []);

    const handleTap = useCallback(
        (row, col) => onCellTap(row, col),
        [onCellTap]
    );

    const handleSwipe = useCallback(
        (row, col, direction) => {
            let targetRow = row;
            let targetCol = col;
            if (direction === 'LEFT') targetCol--;
            else if (direction === 'RIGHT') targetCol++;
            else if (direction === 'UP') targetRow--;
            else if (direction === 'DOWN') targetRow++;

            // Validate bounds
            if (
                targetRow >= 0 && targetRow < GRID_SIZE &&
                targetCol >= 0 && targetCol < GRID_SIZE
            ) {
                if (onSwap) {
                    onSwap(row, col, targetRow, targetCol);
                }
            }
        },
        [onSwap]
    );

    if (!grid) return null;

    return (
        <div
            ref={containerRef}
            className="relative flex-1 w-full max-w-[600px] flex items-center justify-center p-4 z-10"
        >
            {/* Glass Board Container */}
            <div
                className="glass-panel relative p-3 rounded-[1rem] shadow-glass border border-bb-glass-border"
                style={{
                    background: 'linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
                    boxShadow: '0 20px 50px -12px rgba(0,0,0,0.5)'
                }}
            >
                {/* Inner Glow Mesh */}
                <div className="absolute inset-0 rounded-[1rem] pointer-events-none shadow-[inset_0_0_20px_rgba(59,130,246,0.1)]" />

                <div
                    style={{
                        position: 'relative',
                        width: GRID_SIZE * cellSize,
                        height: GRID_SIZE * cellSize,
                        zIndex: 1,
                        padding: '2px', // Inner padding
                    }}
                >
                    {grid.map((row, rI) =>
                        row.map((tile, cI) => {
                            const x = cI * cellSize;
                            const y = rI * cellSize;

                            // Stable Keys for empty cells
                            if (!tile)
                                return (
                                    <div
                                        key={`empty-${rI}-${cI}`}
                                        style={{
                                            position: 'absolute',
                                            left: 0,
                                            top: 0,
                                            width: cellSize,
                                            height: cellSize,
                                            transform: `translate3d(${x}px, ${y}px, 0)`
                                        }}
                                    />
                                );

                            const isSelected = selectedCell?.row === tile.row && selectedCell?.col === tile.col;
                            // Check via ID or coords? Using Set of coords "r-c" from reducer
                            const isExploding = explodingCells.has(`${tile.row}-${tile.col}`);

                            return (
                                <GameTile
                                    key={tile.id}
                                    tile={tile}
                                    x={x}
                                    y={y}
                                    isSelected={isSelected}
                                    isExploding={isExploding}
                                    onTap={handleTap}
                                    onSwipe={handleSwipe}
                                    cellSize={cellSize}
                                />
                            );
                        })
                    )}
                </div>

                {/* Floating Scores Overlay */}
                {floatingScores.map((fs) => (
                    <div
                        key={fs.id}
                        className="float-point absolute pointer-events-none z-50 text-center w-full animate-float-up"
                        style={{
                            left: 0,
                            // Vertical positioning roughly centered or randomized in reducer
                            // We use transform from CSS, but start position needs to be set if x/y provided
                            // If x/y are %:
                            top: `${fs.y}%`,
                            transform: `translateX(${fs.x - 50}px)`,
                            // Note: CSS animation 'float-up' overrides transform!
                            // Issue: fs.x is set in reducer. If keyframe uses translate3d(0,0,0), it resets X.
                            // Fix: Apply X via specific style wrapper or change keyframe. 
                            // Keyframe float-up moves Y. We can apply X on parent.
                        }}
                    >
                        <div style={{ transform: `translateX(${fs.x - 50}px)` }}>
                            <span className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] text-bb-gold">
                                {fs.value}
                            </span>
                        </div>
                    </div>
                ))}

                {/* Praise Overlay (Centered) */}
                {activePraise && (
                    <div
                        key={activePraise}
                        className="absolute inset-0 flex items-center justify-center pointer-events-none z-[100] animate-praise-in"
                    >
                        <div className="bg-black/40 backdrop-blur-sm px-6 py-3 rounded-2xl border border-white/20 shadow-2xl">
                            <span
                                className="font-game text-3xl sm:text-4xl text-transparent bg-clip-text bg-gradient-to-br from-yellow-300 via-orange-400 to-red-500 drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] tracking-wide"
                            >
                                {activePraise}
                            </span>
                        </div>

                        {/* Sparkles (CSS Rotate) */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-40 h-40 border-2 border-dashed border-white/10 rounded-full animate-[spin_4s_linear_infinite]" />
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
});

GameGrid.propTypes = {
    grid: PropTypes.array,
    selectedCell: PropTypes.object,
    explodingCells: PropTypes.instanceOf(Set).isRequired,
    floatingScores: PropTypes.array.isRequired,
    activePraise: PropTypes.string,
    onCellTap: PropTypes.func.isRequired,
    onSwap: PropTypes.func,
};

export default GameGrid;

