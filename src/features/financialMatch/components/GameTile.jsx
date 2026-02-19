/**
 * GameTile — Premium 14px rounded block with gloss, inner glow, and 3D depth.
 * "Tactile Fintech Gem" style.
 */
import { memo } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';

// Tile Metadata with Tailwind gradients
const TILE_STYLES = {
    GREEN: { bg: 'bg-tile-green', shadow: 'shadow-green-900/40', icon: 'Family' },
    BLUE: { bg: 'bg-tile-blue', shadow: 'shadow-blue-900/40', icon: 'Edu' },
    YELLOW: { bg: 'bg-tile-yellow', shadow: 'shadow-amber-900/40', icon: 'Retire' },
    RED: { bg: 'bg-tile-red', shadow: 'shadow-red-900/40', icon: 'Emerg' },
};

// Simple Icon Placeholders (Use Lucide, or keep minimal shapes)
// For max performance & cleanliness, let's use minimal SVG shapes.

const TileIcon = ({ type }) => {
    const stroke = "rgba(255,255,255,0.9)";
    const fill = "rgba(255,255,255,0.15)";

    if (type === 'GREEN') return (
        <svg viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[55%] h-[55%] drop-shadow-md">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" fill={fill} />
            <circle cx="9" cy="7" r="4" fill={fill} />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    ); // Users
    if (type === 'BLUE') return (
        <svg viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[50%] h-[50%] drop-shadow-md">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" fill={fill} />
            <path d="M6 12v5c3 3 9 3 12 0v-5" />
        </svg>
    ); // Graduation Cap
    if (type === 'YELLOW') return (
        <svg viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[55%] h-[55%] drop-shadow-md">
            <circle cx="12" cy="12" r="10" fill={fill} />
            <path d="M12 6v6l4 2" />
        </svg>
    ); // Clock/Time/Coin
    if (type === 'RED') return (
        <svg viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[50%] h-[50%] drop-shadow-md">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2" fill={fill} />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
    ); // Medkit/Briefcase
    return null;
};

const GameTile = memo(function GameTile({
    tile,
    isSelected,
    isExploding,
    onTap,
    cellSize
}) {
    if (!tile || !tile.type) return <div style={{ width: cellSize, height: cellSize }} />;

    const style = TILE_STYLES[tile.type] || TILE_STYLES.GREEN;
    const isSelectedClass = isSelected ? 'scale-95 ring-[3px] ring-white/80 ring-offset-2 ring-offset-bb-navy z-20 brightness-110' : '';
    const animClass = isExploding ? 'animate-tile-pop opacity-0' : '';

    // Calculate internal dimensions
    // Subtracting gap/padding relative to cell size if needed, 
    // but parent grid handles gap. We fill the cell.

    return (
        <motion.div
            layoutId={tile.id} // Enable Framer Motion shared layout for smooth swaps? 
            // Actually, standard CSS transform is lighter for 60fps game grid if possible, 
            // but Framer's 'layout' prop is great for swaps. 
            // Let's stick to standard prop-driven rendering for now to avoid overhead, unless 'layout' is needed.
            // Re-using the CSS transition from index.css logic for perf.

            className={`relative flex items-center justify-center 
        ${style.bg} ${style.shadow} ${isSelectedClass} ${animClass} 
        tile-premium select-none active:scale-[0.85]`}
            style={{
                width: cellSize,
                height: cellSize,
                // Override shadow for specific colors if needed
            }}
            onClick={() => onTap(tile.row, tile.col)}
            initial={false}
            animate={{ scale: isExploding ? 1.5 : 1, opacity: isExploding ? 0 : 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
            {/* Icon content */}
            <TileIcon type={tile.type} />

            {/* Selection Glow Overlay */}
            {isSelected && (
                <motion.div
                    layoutId="select-glow"
                    className="absolute inset-0 rounded-[14px] bg-white/20 animate-pulse"
                />
            )}
        </motion.div>
    );
});

GameTile.propTypes = {
    tile: PropTypes.object,
    isSelected: PropTypes.bool,
    isExploding: PropTypes.bool,
    onTap: PropTypes.func.isRequired,
    cellSize: PropTypes.number.isRequired,
};

export default GameTile;
