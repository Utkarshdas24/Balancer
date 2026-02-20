/**
 * GameTile — Premium 14px rounded block with gloss, inner glow, and 3D depth.
 * "Tactile Fintech Gem" style.
 */
import { memo, useRef } from 'react';
import PropTypes from 'prop-types';

// Tile Metadata with Tailwind gradients
const TILE_STYLES = {
    GREEN: { bg: 'bg-tile-green', shadow: 'shadow-green-900/40', icon: 'Family' },
    BLUE: { bg: 'bg-tile-blue', shadow: 'shadow-blue-900/40', icon: 'Edu' },
    YELLOW: { bg: 'bg-tile-yellow', shadow: 'shadow-amber-900/40', icon: 'Retire' },
    RED: { bg: 'bg-tile-red', shadow: 'shadow-red-900/40', icon: 'Emerg' },
};

// Simple Icon Placeholders (Use Lucide, or keep minimal shapes)
const TileIcon = ({ type }) => {
    const stroke = "rgba(255,255,255,0.9)";
    const fill = "rgba(255,255,255,0.15)";

    if (type === 'GREEN') return (
        <svg viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[55%] h-[55%]">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" fill={fill} />
            <circle cx="9" cy="7" r="4" fill={fill} />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    ); // Users
    if (type === 'BLUE') return (
        <svg viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[50%] h-[50%]">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" fill={fill} />
            <path d="M6 12v5c3 3 9 3 12 0v-5" />
        </svg>
    ); // Graduation Cap
    if (type === 'YELLOW') return (
        <svg viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[55%] h-[55%]">
            <circle cx="12" cy="12" r="10" fill={fill} />
            <path d="M12 6v6l4 2" />
        </svg>
    ); // Clock/Time/Coin
    if (type === 'RED') return (
        <svg viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[50%] h-[50%]">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2" fill={fill} />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
    ); // Medkit/Briefcase
    return null;
};

const GameTile = memo(function GameTile({
    tile,
    x,
    y,
    isSelected,
    isExploding,
    onTap,
    onSwipe,
    cellSize
}) {
    // Native Swipe Detection
    const touchStartRef = useRef(null);

    // Fallback if x/y missing (though GameGrid should provide them)
    const posX = x !== undefined ? x : (tile?.col || 0) * cellSize;
    const posY = y !== undefined ? y : (tile?.row || 0) * cellSize;

    if (!tile || !tile.type) return <div style={{ width: cellSize, height: cellSize }} />;

    const style = TILE_STYLES[tile.type] || TILE_STYLES.GREEN;

    // CSS-based State Classes
    const isSelectedClass = isSelected ? 'scale-95 ring-[3px] ring-white/80 ring-offset-2 ring-offset-bb-navy z-20 brightness-110' : '';

    const handlePointerDown = (e) => {
        touchStartRef.current = { x: e.clientX, y: e.clientY };
        // e.target.setPointerCapture(e.pointerId); // Optional
    };

    const handlePointerUp = (e) => {
        if (!touchStartRef.current) return;
        const dx = e.clientX - touchStartRef.current.x;
        const dy = e.clientY - touchStartRef.current.y;
        touchStartRef.current = null;

        const absX = Math.abs(dx);
        const absY = Math.abs(dy);
        const threshold = 30; // px

        if (Math.max(absX, absY) < threshold) {
            // Tap
            onTap(tile.row, tile.col);
        } else {
            // Swipe
            if (absX > absY) {
                onSwipe(tile.row, tile.col, dx > 0 ? 'RIGHT' : 'LEFT');
            } else {
                onSwipe(tile.row, tile.col, dy > 0 ? 'DOWN' : 'UP');
            }
        }
    };

    // Outer wrapper handles positioning & moving (sliding)
    // Inner div handles scale/pop effects
    return (
        <div
            className="absolute top-0 left-0 transition-transform duration-300 ease-out will-change-transform"
            style={{
                width: cellSize,
                height: cellSize,
                transform: `translate3d(${posX}px, ${posY}px, 0)`,
                zIndex: isSelected ? 30 : 10,
            }}
        >
            <div
                className={`relative w-full h-full flex items-center justify-center 
                ${style.bg} ${style.shadow} ${isSelectedClass} 
                tile-premium select-none touch-action-none transition-all duration-200`}
                style={{
                    transform: isExploding ? 'scale3d(1.5, 1.5, 1)' : 'scale3d(1, 1, 1)',
                    opacity: isExploding ? 0 : 1,
                }}
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
                onPointerLeave={() => { touchStartRef.current = null; }}
            >
                {/* Icon content */}
                <TileIcon type={tile.type} />

                {/* Selection Glow Overlay */}
                {isSelected && (
                    <div
                        className="absolute inset-0 rounded-[14px] bg-white/20 animate-pulse"
                    />
                )}
            </div>
        </div>
    );
}, (prev, next) => {
    // Custom Memo Comparison
    return (
        prev.tile.id === next.tile.id &&
        prev.tile.type === next.tile.type &&
        prev.x === next.x &&
        prev.y === next.y &&
        prev.isSelected === next.isSelected &&
        prev.isExploding === next.isExploding &&
        prev.cellSize === next.cellSize
    );
});

GameTile.propTypes = {
    tile: PropTypes.object,
    x: PropTypes.number,
    y: PropTypes.number,
    isSelected: PropTypes.bool,
    isExploding: PropTypes.bool,
    onTap: PropTypes.func.isRequired,
    onSwipe: PropTypes.func,
    cellSize: PropTypes.number.isRequired,
};

export default GameTile;
