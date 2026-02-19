/**
 * BadgeOverlay — Shows special effect badges:
 * TERM_PLAN, POWER_SHIELD, EMERGENCY_COVER
 */
import { memo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';

const BADGE_DATA = {
    TERM_PLAN: {
        emoji: '🏆',
        title: 'TERM PLAN',
        subtitle: 'Activated!',
        detail: '+15 Risk Neutralized',
        gradient: 'linear-gradient(135deg, #92400E 0%, #D97706 50%, #F59E0B 100%)',
        glow: 'rgba(245,158,11,0.5)',
        border: 'rgba(254,243,199,0.5)',
    },
    POWER_SHIELD: {
        emoji: '⚡',
        title: 'POWER SHIELD',
        subtitle: 'Row Cleared!',
        detail: '+20 Bonus Points',
        gradient: 'linear-gradient(135deg, #4C1D95 0%, #7C3AED 50%, #8B5CF6 100%)',
        glow: 'rgba(139,92,246,0.5)',
        border: 'rgba(196,181,253,0.5)',
    },
    EMERGENCY_COVER: {
        emoji: '🚨',
        title: 'EMERGENCY COVER',
        subtitle: 'All Risks Cleared!',
        detail: '+25 Bonus Points',
        gradient: 'linear-gradient(135deg, #7F1D1D 0%, #DC2626 50%, #EF4444 100%)',
        glow: 'rgba(239,68,68,0.5)',
        border: 'rgba(252,165,165,0.5)',
    },
};

const BadgeOverlay = memo(function BadgeOverlay({ activeBadge, onDone }) {
    useEffect(() => {
        if (activeBadge) {
            const t = setTimeout(onDone, 1600);
            return () => clearTimeout(t);
        }
    }, [activeBadge, onDone]);

    const data = activeBadge ? BADGE_DATA[activeBadge] : null;

    return (
        <AnimatePresence>
            {data && (
                <motion.div
                    key={activeBadge}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[200] flex items-center justify-center pointer-events-none"
                >
                    {/* Radial flash */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 0.4, 0] }}
                        transition={{ duration: 0.4, times: [0, 0.3, 1] }}
                        className="absolute inset-0"
                        style={{
                            background: `radial-gradient(ellipse at center, ${data.glow} 0%, transparent 70%)`,
                        }}
                    />

                    {/* Particle ring */}
                    {[...Array(10)].map((_, i) => {
                        const angle = (i / 10) * 360;
                        const radius = 70 + Math.random() * 30;
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
                                transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
                                className="absolute w-2.5 h-2.5 rounded-full"
                                style={{ background: data.glow }}
                            />
                        );
                    })}

                    {/* Badge card */}
                    <motion.div
                        initial={{ scale: 0, rotate: -10 }}
                        animate={{ scale: [0, 1.15, 1], rotate: [-10, 3, 0] }}
                        transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
                        className="relative flex flex-col items-center"
                    >
                        <div
                            className="px-6 py-4 rounded-2xl flex flex-col items-center gap-0.5"
                            style={{
                                background: data.gradient,
                                boxShadow: `0 0 3rem 1rem ${data.glow}, inset 0 2px 0 rgba(255,255,255,0.3)`,
                                border: `2px solid ${data.border}`,
                            }}
                        >
                            <span style={{ fontSize: '2.2rem', filter: `drop-shadow(0 0 1rem ${data.glow})` }}>
                                {data.emoji}
                            </span>
                            <div
                                className="font-game text-white text-[1.15rem] tracking-wide leading-tight"
                                style={{ textShadow: '0 0 1rem rgba(255,255,255,0.8)' }}
                            >
                                {data.title}
                            </div>
                            <div className="font-game text-white/80 text-[0.75rem] tracking-widest uppercase">
                                {data.subtitle}
                            </div>
                            <div className="text-white/60 text-[0.6rem] font-semibold mt-0.5">
                                {data.detail}
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
});

BadgeOverlay.propTypes = {
    activeBadge: PropTypes.string,
    onDone: PropTypes.func.isRequired,
};

export default BadgeOverlay;
