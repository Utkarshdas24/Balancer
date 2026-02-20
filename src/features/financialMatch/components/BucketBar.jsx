/**
 * BucketBar — 4 Vertical Glass Capsules with Liquid Fill & Wave Animation.
 * "Premium Lab/Fintech" Aesthetic.
 */
import { memo } from 'react';
import PropTypes from 'prop-types';
import { TILE_META, BUCKET_MAX } from '../config/gameConfig.js';
import { CheckCircle2 } from 'lucide-react';

const BUCKET_ORDER = ['GREEN', 'BLUE', 'YELLOW', 'RED'];

const BucketBar = memo(function BucketBar({ buckets }) {
    return (
        <div className="w-full shrink-0 px-4 py-3 pb-safe z-10">
            <div className="flex items-end justify-between gap-3 h-32 sm:h-36">
                {BUCKET_ORDER.map((type) => {
                    const meta = TILE_META[type];
                    const value = Math.min(buckets[type] || 0, BUCKET_MAX);
                    const pct = Math.round((value / BUCKET_MAX) * 100);
                    const isFull = pct >= 100;

                    // Color Vars
                    const color = meta.color;

                    return (
                        <div key={type} className="flex flex-col items-center gap-2 flex-1 h-full relative group">

                            {/* Label */}
                            <span className={`text-[0.6rem] font-bold uppercase tracking-wider text-center leading-tight transition-colors ${isFull ? 'text-bb-gold drop-shadow-md' : 'text-blue-200/60'}`}>
                                {meta.label.split(' ')[0]}
                            </span>

                            {/* Capsule Container */}
                            <div
                                className={`bucket-capsule w-full flex-1 relative flex items-end justify-center ${isFull ? 'full' : ''}`}
                                style={{
                                    boxShadow: isFull ? `0 0 20px ${color}66` : undefined
                                }}
                            >
                                {/* Background Tint */}
                                <div className="absolute inset-0 bg-white/5" />

                                {/* Liquid Fill (GPU Transform) */}
                                <div
                                    className="absolute inset-0 z-0 overflow-hidden transition-transform duration-500 ease-out"
                                    style={{
                                        transform: `scaleY(${pct / 100})`,
                                        transformOrigin: 'bottom',
                                    }}
                                >
                                    {/* Inner Color (Counter-scale if we wanted to preserve aspect, but here we just fill) */}
                                    <div
                                        className="absolute inset-0 opacity-80"
                                        style={{ background: meta.bucketBg }}
                                    />
                                    {/* Wave Overlay - Scaling with parent (acceptable trade-off for perf) */}
                                    <div
                                        className="absolute top-0 left-[-50%] w-[200%] h-6 opacity-40 animate-wave"
                                        style={{
                                            background: `linear-gradient(90deg, transparent, #fff, transparent)`,
                                            transform: `scaleY(${100 / pct || 1})` // Optional: Try to un-squash? No, keeps it simple.
                                        }}
                                    />
                                    {/* Top Gloss Line */}
                                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/40" />
                                </div>

                                {/* Percentage Text (Always visible, high contrast) */}
                                <div className="absolute bottom-2 inset-x-0 text-center z-10">
                                    <span className="font-game text-sm sm:text-base drop-shadow-md text-white">
                                        {pct}%
                                    </span>
                                </div>

                                {/* Secured Badge (Overlay when full) */}
                                <div
                                    className={`absolute top-[-8px] inset-x-0 flex justify-center z-20 transition-all duration-300 ${isFull ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-50'}`}
                                >
                                    <div className="bg-bb-gold text-bb-navy text-[0.5rem] font-black uppercase px-2 py-0.5 rounded-full shadow-lg flex items-center gap-1 border border-white/20">
                                        <CheckCircle2 className="w-2.5 h-2.5" />
                                        Secured
                                    </div>
                                </div>

                                {/* Full Pulse Effect */}
                                {isFull && (
                                    <div
                                        className="absolute inset-0 rounded-[inherit] border-2 border-bb-gold/50 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]"
                                    />
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
});

BucketBar.propTypes = {
    buckets: PropTypes.object.isRequired,
};

export default BucketBar;
