/**
 * TermPlanBadge — Golden "Term Plan Activated!" explosion overlay.
 * Shown when SHIELD matches neutralize RISK tiles.
 */
import { memo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';

const TermPlanBadge = memo(function TermPlanBadge({ isVisible, onDone }) {
    useEffect(() => {
        if (isVisible) {
            const t = setTimeout(onDone, 1600);
            return () => clearTimeout(t);
        }
    }, [isVisible, onDone]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    key="term-plan"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[200] flex items-center justify-center pointer-events-none"
                >
                    {/* Background lightning flash */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 0.4, 0] }}
                        transition={{ duration: 0.4, times: [0, 0.3, 1] }}
                        className="absolute inset-0"
                        style={{ background: 'radial-gradient(ellipse at center, rgba(245,158,11,0.5) 0%, transparent 70%)' }}
                    />

                    {/* Particle bursts */}
                    {[...Array(12)].map((_, i) => {
                        const angle = (i / 12) * 360;
                        const radius = 80 + Math.random() * 40;
                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                                animate={{
                                    opacity: 0,
                                    x: Math.cos((angle * Math.PI) / 180) * radius,
                                    y: Math.sin((angle * Math.PI) / 180) * radius,
                                    scale: 0,
                                }}
                                transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
                                className="absolute w-3 h-3 rounded-full"
                                style={{
                                    background: i % 2 === 0 ? '#F59E0B' : '#FBBF24',
                                    boxShadow: '0 0 0.5rem #F59E0B',
                                }}
                            />
                        );
                    })}

                    {/* Main badge */}
                    <motion.div
                        initial={{ scale: 0, rotate: -15 }}
                        animate={{ scale: [0, 1.2, 1], rotate: [-15, 5, 0] }}
                        transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
                        className="relative flex flex-col items-center"
                    >
                        <div
                            className="px-6 py-4 rounded-2xl flex flex-col items-center gap-1"
                            style={{
                                background: 'linear-gradient(135deg, #92400E 0%, #D97706 50%, #F59E0B 100%)',
                                boxShadow: '0 0 3rem 1rem rgba(245,158,11,0.6), 0 0 0.5rem 0.125rem rgba(254,243,199,0.5), inset 0 2px 0 rgba(255,255,255,0.3)',
                                border: '2px solid rgba(254,243,199,0.5)',
                            }}
                        >
                            <span style={{ fontSize: '2.5rem', filter: 'drop-shadow(0 0 1rem gold)' }}>🏆</span>
                            <div className="font-game text-white text-[1.3rem] tracking-wide leading-tight"
                                style={{ textShadow: '0 0 1rem rgba(255,255,255,0.8)' }}>
                                TERM PLAN
                            </div>
                            <div className="font-game text-yellow-100 text-[0.85rem] tracking-widest uppercase">
                                Activated!
                            </div>
                            <div className="text-yellow-100/70 text-[0.65rem] font-semibold">
                                +15 Protection Bonus
                            </div>
                        </div>

                        {/* Shimmer lines */}
                        {[-40, 40].map((x, i) => (
                            <motion.div
                                key={i}
                                initial={{ scaleY: 0, opacity: 0 }}
                                animate={{ scaleY: 1, opacity: [0, 1, 0] }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: `calc(50% + ${x}px)`,
                                    width: '2px',
                                    height: '60px',
                                    background: 'linear-gradient(to bottom, transparent, #F59E0B, transparent)',
                                    transformOrigin: 'center',
                                }}
                            />
                        ))}
                    </motion.div>
                </motion.div>
            )
            }
        </AnimatePresence >
    );
});

TermPlanBadge.propTypes = {
    isVisible: PropTypes.bool.isRequired,
    onDone: PropTypes.func.isRequired,
};

export default TermPlanBadge;
