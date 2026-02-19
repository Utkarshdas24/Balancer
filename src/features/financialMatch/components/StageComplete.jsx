/**
 * StageComplete — Stage completion overlay with goal result and next-stage CTA.
 */
import { memo } from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { TOTAL_STAGES } from '../config/stageConfigs.js';

const StageComplete = memo(function StageComplete({
    stageNumber,
    stageConfig,
    protectionAchieved,
    protectionTarget,
    stageRawScore,
    onNext,
}) {
    const goalMet = protectionAchieved >= protectionTarget;
    const isLastStage = stageNumber >= TOTAL_STAGES;
    const accent = stageConfig?.themeAccent || '#3B82F6';

    return (
        <div className="min-h-[100dvh] w-full flex flex-col items-center justify-center px-4 relative overflow-hidden">
            {/* Background glow */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: goalMet
                        ? `radial-gradient(ellipse at center, ${accent}22 0%, transparent 60%)`
                        : 'radial-gradient(ellipse at center, rgba(239,68,68,0.12) 0%, transparent 60%)',
                }}
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                className="relative z-10 w-full max-w-sm flex flex-col items-center"
            >
                {/* Emoji badge */}
                <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    className="text-[3.5rem] mb-3"
                >
                    {goalMet ? '🏆' : '💪'}
                </motion.div>

                {/* Status */}
                <motion.h2
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="font-game text-[1.5rem] text-white text-center leading-tight mb-1"
                >
                    {goalMet ? 'Stage Complete!' : 'Stage Over'}
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-white/50 text-[0.8rem] font-semibold mb-4"
                >
                    Stage {stageNumber} — {stageConfig?.name}
                </motion.p>

                {/* Stats card */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    className="match-glass rounded-2xl p-5 w-full mb-5"
                >
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="text-center">
                            <span className="text-white/30 text-[0.55rem] font-bold uppercase tracking-widest block mb-1">
                                Protection
                            </span>
                            <span
                                className="font-game text-[1.3rem]"
                                style={{ color: goalMet ? '#10B981' : '#EF4444' }}
                            >
                                {protectionAchieved}%
                            </span>
                            <span className="text-white/30 text-[0.7rem]"> / {protectionTarget}%</span>
                        </div>
                        <div className="text-center">
                            <span className="text-white/30 text-[0.55rem] font-bold uppercase tracking-widest block mb-1">
                                Stage Score
                            </span>
                            <span className="font-game text-[1.3rem] text-white">
                                {stageRawScore}
                            </span>
                        </div>
                    </div>

                    {/* Goal badge */}
                    <div
                        className="flex items-center justify-center gap-2 py-2 rounded-lg"
                        style={{
                            background: goalMet ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
                            border: goalMet ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(239,68,68,0.3)',
                        }}
                    >
                        <span>{goalMet ? '✅' : '⚠️'}</span>
                        <span
                            className="text-[0.75rem] font-bold"
                            style={{ color: goalMet ? '#10B981' : '#EF4444' }}
                        >
                            {goalMet
                                ? `Goal achieved! (${protectionTarget}%+)`
                                : `Goal: ${protectionTarget}% — Keep going!`}
                        </span>
                    </div>
                </motion.div>

                {/* Next button */}
                <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={onNext}
                    className="btn-primary w-full max-w-[16rem] py-3.5 text-[0.95rem] font-black uppercase tracking-wider"
                    style={{
                        background: `linear-gradient(135deg, ${accent} 0%, ${accent}cc 100%)`,
                        boxShadow: `0 0 1.5rem ${accent}55`,
                    }}
                    id={`fm-next-stage-${stageNumber}`}
                >
                    {isLastStage ? '🏁 View Results' : `➡️ Stage ${stageNumber + 1}`}
                </motion.button>
            </motion.div>
        </div>
    );
});

StageComplete.propTypes = {
    stageNumber: PropTypes.number.isRequired,
    stageConfig: PropTypes.object,
    protectionAchieved: PropTypes.number.isRequired,
    protectionTarget: PropTypes.number.isRequired,
    stageRawScore: PropTypes.number.isRequired,
    onNext: PropTypes.func.isRequired,
};

export default StageComplete;
