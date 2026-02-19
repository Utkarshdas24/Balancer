/**
 * TileLegend — Compact tile key below the grid.
 * Shows only the active tiles for the current stage.
 */
import { memo } from 'react';
import PropTypes from 'prop-types';

const TileLegend = memo(function TileLegend({ tileTypes, tileMeta }) {
    if (!tileTypes || !tileMeta) return null;

    return (
        <div className="w-full flex items-center justify-center gap-3 py-2 px-3 shrink-0" role="list" aria-label="Tile Legend">
            {tileTypes.map((type) => {
                const meta = tileMeta[type];
                if (!meta) return null;
                return (
                    <div key={type} className="flex items-center gap-1" role="listitem">
                        <span className="text-[0.9rem]">{meta.emoji}</span>
                        <span className="text-[0.55rem] text-white/35 font-bold uppercase tracking-wider">
                            {meta.label}
                        </span>
                    </div>
                );
            })}
        </div>
    );
});

TileLegend.propTypes = {
    tileTypes: PropTypes.array.isRequired,
    tileMeta: PropTypes.object.isRequired,
};

export default TileLegend;
