/**
 * StageIntro — Full-screen stage intro modal with plan name,
 * tile icons, goal info, and tip.
 */
import { memo } from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { TILE_META } from '../config/gameConfig.js';

const StageIntro = memo(function StageIntro({ stageConfig, stageNumber, onStart }) {
    if (!stageConfig) return null;

    const { name, subtitle, planName, themeAccent, introMessage, introTip, tileTypes, stageGoal, maxMoves } = stageConfig;

    return (
        <div className="min-h-[100dvh] w-full flex flex-col items-center justify-center px-4 relative overflow-hidden">
            {/* Radial glow */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: `radial-gradient(ellipse at center, ${themeAccent}22 0%, transparent 70%)`,
                }}
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, type: 'spring', stiffness: 200 }}
                className="relative z-10 w-full max-w-sm flex flex-col items-center"
            >
                {/* Stage badge */}
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.15 }}
                    className="px-5 py-1.5 rounded-full text-[0.65rem] font-black uppercase tracking-[0.25em] mb-3"
                    style={{
                        background: `${themeAccent}22`,
                        border: `1.5px solid ${themeAccent}66`,
                        color: themeAccent,
                    }}
                >
                    Stage {stageNumber} of 5
                </motion.div>

                {/* Stage name */}
                <motion.h1
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.25 }}
                    className="font-game text-[1.6rem] text-white text-center leading-tight mb-1"
                    style={{ textShadow: `0 0 1.5rem ${themeAccent}66` }}
                >
                    {name}
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-white/50 text-[0.8rem] font-semibold text-center mb-4"
                >
                    {subtitle}
                </motion.p>

                {/* Plan name if applicable */}
                {planName && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.35 }}
                        className="px-4 py-2 rounded-xl mb-4 text-center"
                        style={{
                            background: 'rgba(255,255,255,0.06)',
                            border: '1px solid rgba(255,255,255,0.1)',
                        }}
                    >
                        <span className="text-white/30 text-[0.6rem] font-bold uppercase tracking-[0.15em] block mb-0.5">
                            Featured Plan
                        </span>
                        <span className="text-white font-bold text-[0.85rem]">{planName}</span>
                    </motion.div>
                )}

                {/* Intro card */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="match-glass rounded-2xl p-5 w-full mb-4"
                >
                    <p className="text-white/70 text-[0.8rem] leading-relaxed text-center mb-4">
                        {introMessage}
                    </p>

                    {/* Tile icons for this stage */}
                    <div className="flex items-center justify-center gap-3 mb-4">
                        {tileTypes.map((type) => {
                            const meta = TILE_META[type];
                            return (
                                <motion.div
                                    key={type}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.5, type: 'spring', stiffness: 300 }}
                                    className="flex flex-col items-center gap-1"
                                >
                                    <div
                                        className="w-10 h-10 rounded-xl flex items-center justify-center text-[1.3rem]"
                                        style={{
                                            background: 'rgba(255,255,255,0.08)',
                                            border: '1px solid rgba(255,255,255,0.15)',
                                        }}
                                    >
                                        {meta?.emoji}
                                    </div>
                                    <span className="text-white/40 text-[0.5rem] font-bold uppercase tracking-wide">
                                        {meta?.label}
                                    </span>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Goal and moves */}
                    <div className="flex items-center justify-center gap-6">
                        <div className="text-center">
                            <span className="text-white/30 text-[0.55rem] font-bold uppercase tracking-widest block">
                                Goal
                            </span>
                            <span className="text-white font-game text-[1rem]">
                                {stageGoal.protectionTarget}%
                            </span>
                        </div>
                        <div className="h-6 w-px bg-white/10" />
                        <div className="text-center">
                            <span className="text-white/30 text-[0.55rem] font-bold uppercase tracking-widest block">
                                Moves
                            </span>
                            <span className="text-white font-game text-[1rem]">{maxMoves}</span>
                        </div>
                    </div>
                </motion.div>

                {/* Tip */}
                {introTip && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.55 }}
                        className="text-match-neon/60 text-[0.7rem] font-semibold text-center mb-5 px-2"
                    >
                        💡 {introTip}
                    </motion.p>
                )}

                {/* Start button */}
                <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={onStart}
                    className="btn-primary w-full max-w-[16rem] py-3.5 text-[0.95rem] font-black uppercase tracking-wider"
                    style={{
                        background: `linear-gradient(135deg, ${themeAccent} 0%, ${themeAccent}cc 100%)`,
                        boxShadow: `0 0 1.5rem ${themeAccent}55`,
                    }}
                    id={`fm-start-stage-${stageNumber}`}
                >
                    Start Stage {stageNumber}
                </motion.button>
            </motion.div>
        </div>
    );
});

StageIntro.propTypes = {
    stageConfig: PropTypes.object.isRequired,
    stageNumber: PropTypes.number.isRequired,
    onStart: PropTypes.func.isRequired,
};

export default StageIntro;
