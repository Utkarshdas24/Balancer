/**
 * LandingPage — Branded intro with animated gradient background.
 * "Balance Builder – Powered by Bajaj Life Insurance"
 */
import { memo } from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.15, delayChildren: 0.3 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const LandingPage = memo(function LandingPage({ onStart }) {
    return (
        <motion.div
            className="w-full min-h-[100dvh] flex flex-col items-center justify-center px-5 relative overflow-hidden"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{
                background: 'linear-gradient(180deg, #0D1B3E 0%, #060E24 50%, #0A1628 100%)',
            }}
        >
            {/* Background glows */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[15%] left-[10%] w-80 h-80 rounded-full bg-blue-600/8 blur-[100px]" />
                <div className="absolute bottom-[20%] right-[5%] w-72 h-72 rounded-full bg-emerald-500/6 blur-[80px]" />
                <div className="absolute top-[60%] left-[50%] w-64 h-64 rounded-full bg-amber-500/5 blur-[90px]" />
            </div>

            {/* Floating tiles decoration */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[
                    { color: '#10B981', x: '12%', y: '18%', delay: 0, size: 32 },
                    { color: '#3B82F6', x: '78%', y: '22%', delay: 0.5, size: 28 },
                    { color: '#F59E0B', x: '20%', y: '70%', delay: 1, size: 24 },
                    { color: '#EF4444', x: '82%', y: '65%', delay: 1.5, size: 30 },
                    { color: '#3B82F6', x: '45%', y: '85%', delay: 2, size: 20 },
                    { color: '#10B981', x: '68%', y: '12%', delay: 0.8, size: 22 },
                ].map((tile, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{
                            opacity: [0, 0.3, 0.15, 0.3],
                            scale: [0, 1, 0.9, 1],
                            y: [0, -10, 0, -10],
                        }}
                        transition={{
                            delay: tile.delay,
                            duration: 4,
                            repeat: Infinity,
                            repeatType: 'reverse',
                            ease: 'easeInOut',
                        }}
                        className="absolute rounded-lg"
                        style={{
                            left: tile.x,
                            top: tile.y,
                            width: tile.size,
                            height: tile.size,
                            background: tile.color,
                            boxShadow: `0 0 1.5rem ${tile.color}55`,
                        }}
                    />
                ))}
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center text-center max-w-sm">
                {/* Bajaj Life Insurance branding */}
                <motion.div variants={itemVariants} className="mb-6">
                    <div
                        className="px-4 py-1.5 rounded-full text-[0.6rem] font-black uppercase tracking-[0.25em]"
                        style={{
                            background: 'rgba(0, 102, 178, 0.15)',
                            border: '1.5px solid rgba(0, 102, 178, 0.35)',
                            color: '#60A5FA',
                        }}
                    >
                        Bajaj Life Insurance
                    </div>
                </motion.div>

                {/* Title */}
                <motion.h1
                    variants={itemVariants}
                    className="font-game text-[2.2rem] leading-[1.1] text-white mb-2"
                    style={{ textShadow: '0 0 2rem rgba(59,130,246,0.3)' }}
                >
                    Balance<br />Builder
                </motion.h1>

                <motion.p
                    variants={itemVariants}
                    className="text-white/40 text-[0.75rem] font-bold uppercase tracking-[0.2em] mb-6"
                >
                    Secure Your Financial Future
                </motion.p>

                {/* 4 bucket previews */}
                <motion.div variants={itemVariants} className="flex items-center gap-3 mb-8">
                    {[
                        { color: '#10B981', label: 'Family' },
                        { color: '#3B82F6', label: 'Education' },
                        { color: '#F59E0B', label: 'Retirement' },
                        { color: '#EF4444', label: 'Emergency' },
                    ].map((b, i) => (
                        <motion.div
                            key={b.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 + i * 0.1 }}
                            className="flex flex-col items-center gap-1"
                        >
                            <div
                                className="w-8 h-8 rounded-lg"
                                style={{
                                    background: b.color,
                                    boxShadow: `0 0 1rem ${b.color}44`,
                                }}
                            />
                            <span className="text-[0.45rem] font-bold text-white/30 uppercase tracking-wider">
                                {b.label}
                            </span>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Start CTA */}
                <motion.div variants={itemVariants} className="w-full max-w-[16rem]">
                    <button
                        onClick={onStart}
                        id="btn-start-balance"
                        className="w-full py-3.5 rounded-xl font-game text-[0.95rem] tracking-widest text-white uppercase transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                        style={{
                            background: 'linear-gradient(135deg, #0066B2 0%, #3B82F6 100%)',
                            boxShadow: '0 4px 20px rgba(0, 102, 178, 0.3)',
                        }}
                    >
                        Start Game
                    </button>
                </motion.div>

                {/* Disclaimer */}
                <motion.p
                    variants={itemVariants}
                    className="text-white/15 text-[0.55rem] font-medium mt-6 max-w-[16rem] leading-relaxed"
                >
                    Match blocks to fill your financial goal buckets in 2 minutes
                </motion.p>
            </div>
        </motion.div>
    );
});

LandingPage.propTypes = {
    onStart: PropTypes.func.isRequired,
};

export default LandingPage;
