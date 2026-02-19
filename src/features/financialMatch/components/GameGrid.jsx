/**
 * GameGrid — Premium glass board container, 6x6 grid, centered praise overlay.
 */
import { memo, useCallback, useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { GRID_SIZE } from '../../../core/matchEngine/index.js';
import GameTile from './GameTile.jsx';
import { AnimatePresence, motion } from 'framer-motion';

const GameGrid = memo(function GameGrid({
    grid,
    selectedCell,
    explodingCells,
    floatingScores,
    activePraise,
    onCellTap,
}) {
    const containerRef = useRef(null);
    const [cellSize, setCellSize] = useState(48);

    // Responsive Cell Sizing
    useEffect(() => {
        if (!containerRef.current) return;
        const observer = new ResizeObserver((entries) => {
            const width = entries[0].contentRect.width;
            // Subtract padding (16px total) and gap (3px * 5)
            const availableW = width - 24;
            const maxByWidth = Math.floor(availableW / GRID_SIZE);
            // Clamp size (Mobile small -> Desktop large)
            setCellSize(Math.max(42, Math.min(64, maxByWidth)));
        });
        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    const handleTap = useCallback(
        (row, col) => onCellTap(row, col),
        [onCellTap]
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
                        display: 'grid',
                        gridTemplateColumns: `repeat(${GRID_SIZE}, ${cellSize}px)`,
                        gridTemplateRows: `repeat(${GRID_SIZE}, ${cellSize}px)`,
                        gap: '4px',
                        position: 'relative',
                        zIndex: 1,
                        padding: '2px', // Inner padding
                    }}
                >
                    {grid.map((row) =>
                        row.map((tile) => {
                            if (!tile)
                                return <div key={Math.random()} style={{ width: cellSize, height: cellSize }} />;

                            const isSelected = selectedCell?.row === tile.row && selectedCell?.col === tile.col;
                            const isExploding = explodingCells.has(`${tile.row}-${tile.col}`);

                            return (
                                <GameTile
                                    key={tile.id}
                                    tile={tile}
                                    isSelected={isSelected}
                                    isExploding={isExploding}
                                    onTap={handleTap}
                                    cellSize={cellSize}
                                />
                            );
                        })
                    )}
                </div>

                {/* Floating Scores Overlay */}
                <AnimatePresence>
                    {floatingScores.map((fs) => (
                        <motion.div
                            key={fs.id}
                            initial={{ opacity: 0, y: 0, scale: 0.5 }}
                            animate={{ opacity: 1, y: -40, scale: 1.2 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                            className="float-point absolute pointer-events-none z-50 text-center w-full"
                            style={{
                                left: 0,
                                top: `${fs.y}%`, // Use % relative to board? Or absolute px?
                                // Actually, positioning floating scores relative to the CELL is hard without layout calculation.
                                // Let's use simple centralized feedback or random position near center if precise cell xy is hard.
                                // Or better: pass the screen-space coordinates?
                                // For simplicity in React, passing 'x/y %' relative to board center is easiest if we don't track refs per cell.
                                // The current implementation uses random x/y. Let's stick to that but constrain it better.
                                transform: `translateX(${fs.x - 50}px)`, // Offset from center
                            }}
                        >
                            <span className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] text-bb-gold">
                                {fs.value}
                            </span>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* Praise Overlay (Centered) */}
                <AnimatePresence>
                    {activePraise && (
                        <motion.div
                            key={activePraise}
                            initial={{ opacity: 0, scale: 0.5, y: 20 }}
                            animate={{ opacity: 1, scale: 1.2, y: 0 }}
                            exit={{ opacity: 0, scale: 1.5, y: -20 }}
                            transition={{ duration: 0.4, type: 'spring', bounce: 0.5 }}
                            className="absolute inset-0 flex items-center justify-center pointer-events-none z-[100]"
                        >
                            <div className="bg-black/40 backdrop-blur-sm px-6 py-3 rounded-2xl border border-white/20 shadow-2xl">
                                <span
                                    className="font-game text-3xl sm:text-4xl text-transparent bg-clip-text bg-gradient-to-br from-yellow-300 via-orange-400 to-red-500 drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] tracking-wide"
                                >
                                    {activePraise}
                                </span>
                            </div>

                            {/* Sparkles */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity }} className="w-40 h-40 border-2 border-dashed border-white/10 rounded-full" />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

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
};

export default GameGrid;
