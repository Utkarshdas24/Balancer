/**
 * HowToPlay — Reverted to Vertical List Layout.
 * - Vertical scrolling enabled.
 * - Distinct Goal Buckets Legend included.
 * - Generous spacing for cleaner UI.
 */
import { memo } from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { ArrowRightLeft, Target, Timer, Link2, Play } from 'lucide-react';

/* ── Custom Icons ── */
const SwapIcon = () => (
    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 shadow-[0_4px_0_#1e40af] flex items-center justify-center border border-blue-300">
        <ArrowRightLeft className="text-white w-7 h-7 stroke-[3]" />
    </div>
);

const BucketIcon = () => (
    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 shadow-[0_4px_0_#be123c] flex items-center justify-center border border-rose-300">
        <Target className="text-white w-7 h-7 stroke-[3]" />
    </div>
);

const TimerIcon = () => (
    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-cyan-600 shadow-[0_4px_0_#0e7490] flex items-center justify-center border border-cyan-300">
        <Timer className="text-white w-7 h-7 stroke-[3]" />
    </div>
);

const ChainIcon = () => (
    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-[0_4px_0_#c2410c] flex items-center justify-center border border-orange-300">
        <Link2 className="text-white w-7 h-7 stroke-[3]" />
    </div>
);

const HowToPlay = memo(function HowToPlay({ onStart }) {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    const goals = [
        { label: 'Family Plan', color: '#10B981', bg: 'linear-gradient(145deg, #059669 0%, #10B981 100%)', border: '#047857' },
        { label: 'Child Education', color: '#3B82F6', bg: 'linear-gradient(145deg, #1D4ED8 0%, #3B82F6 100%)', border: '#1e40af' },
        { label: 'Retirement Plan', color: '#F59E0B', bg: 'linear-gradient(145deg, #D97706 0%, #F59E0B 100%)', border: '#b45309' },
        { label: 'Emergency Fund', color: '#EF4444', bg: 'linear-gradient(145deg, #B91C1C 0%, #EF4444 100%)', border: '#b91c1c' },
    ];

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="fixed inset-0 z-50 flex flex-col items-center w-full h-full overflow-hidden bg-[#050B14]"
            style={{
                backgroundImage: `
          radial-gradient(circle at 50% 0%, #1e3a8a 0%, #050B14 60%),
          repeating-linear-gradient(45deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 40px),
          repeating-linear-gradient(-45deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 40px)
        `
            }}
        >
            {/* Scrollable Content Area */}
            <div className="flex-1 w-full max-w-md px-6 pt-10 pb-32 overflow-y-auto custom-scrollbar flex flex-col items-center gap-6">

                {/* Title */}
                <motion.div variants={itemVariants} className="text-center shrink-0">
                    <h1 className="font-game text-5xl text-transparent bg-clip-text bg-gradient-to-b from-blue-200 via-blue-400 to-blue-600 drop-shadow-[0_4px_0_rgba(0,0,0,0.5)] stroke-text-blue">
                        HOW TO PLAY
                    </h1>
                    <p className="text-blue-200/80 text-xs font-semibold tracking-wide mt-2 uppercase">
                        Match blocks. Fill buckets. Secure your future.
                    </p>
                </motion.div>

                {/* Instruction Cards (Vertical List) */}
                <div className="w-full space-y-4 shrink-0">

                    {/* Card 1: Swap */}
                    <motion.div variants={itemVariants} className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl opacity-40 blur"></div>
                        <div className="relative bg-[#0a1529] border border-blue-500/50 rounded-2xl p-4 flex items-center gap-5 shadow-[inset_0_0_20px_rgba(59,130,246,0.2)]">
                            <SwapIcon />
                            <div className="flex-1 min-w-0">
                                <h3 className="text-white font-black text-sm uppercase tracking-wide mb-1">Swap Adjacent Tiles</h3>
                                <p className="text-blue-200/60 text-xs leading-tight font-medium">
                                    Tap two neighboring tiles to swap them matches of 3 or more.
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Card 2: Fill Buckets */}
                    <motion.div variants={itemVariants} className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl opacity-40 blur"></div>
                        <div className="relative bg-[#0a1529] border border-blue-500/50 rounded-2xl p-4 flex items-center gap-5 shadow-[inset_0_0_20px_rgba(59,130,246,0.2)]">
                            <BucketIcon />
                            <div className="flex-1 min-w-0">
                                <h3 className="text-white font-black text-sm uppercase tracking-wide mb-1">Fill Buckets</h3>
                                <p className="text-blue-200/60 text-xs leading-tight font-medium">
                                    Each color fills its matching financial goal bucket.
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Card 3: Timer */}
                    <motion.div variants={itemVariants} className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl opacity-40 blur"></div>
                        <div className="relative bg-[#0a1529] border border-blue-500/50 rounded-2xl p-4 flex items-center gap-5 shadow-[inset_0_0_20px_rgba(59,130,246,0.2)]">
                            <TimerIcon />
                            <div className="flex-1 min-w-0">
                                <h3 className="text-white font-black text-sm uppercase tracking-wide mb-1">2 Minutes</h3>
                                <p className="text-blue-200/60 text-xs leading-tight font-medium">
                                    You have 120 seconds to maximize your score.
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Card 4: Combos */}
                    <motion.div variants={itemVariants} className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl opacity-40 blur"></div>
                        <div className="relative bg-[#0a1529] border border-blue-500/50 rounded-2xl p-4 flex items-center gap-5 shadow-[inset_0_0_20px_rgba(59,130,246,0.2)]">
                            <ChainIcon />
                            <div className="flex-1 min-w-0">
                                <h3 className="text-white font-black text-sm uppercase tracking-wide mb-1">Chain Combos</h3>
                                <p className="text-blue-200/60 text-xs leading-tight font-medium">
                                    Cascading matches give big point bonuses!
                                </p>
                            </div>
                        </div>
                    </motion.div>

                </div>

                {/* Scoring Panel */}
                <motion.div variants={itemVariants} className="w-full relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl opacity-60 blur"></div>
                    <div className="relative bg-gradient-to-b from-[#1e3a8a] to-[#0f172a] border border-indigo-400/50 rounded-2xl p-4 shadow-xl">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0f172a] px-3 py-0.5 rounded-full border border-indigo-400/50">
                            <span className="text-[0.6rem] font-black text-indigo-300 tracking-widest uppercase">Scoring</span>
                        </div>

                        <div className="flex justify-between items-center gap-2 pt-2">
                            {[
                                { matches: '3', points: '+10', color: 'from-blue-400 to-blue-600', shadow: '#1e40af' },
                                { matches: '4', points: '+18', color: 'from-purple-400 to-purple-600', shadow: '#6b21a8' },
                                { matches: '5', points: '+30', color: 'from-amber-400 to-orange-500', shadow: '#c2410c' },
                            ].map((item) => (
                                <div key={item.matches} className="flex-1 flex items-center justify-center gap-2">
                                    <div className="relative">
                                        <span className={`font-game text-4xl text-transparent bg-clip-text bg-gradient-to-b ${item.color} drop-shadow break-words`}
                                            style={{ filter: `drop-shadow(0 4px 0 ${item.shadow})` }}>
                                            {item.matches}
                                        </span>
                                    </div>
                                    <div className="flex flex-col leading-none">
                                        <span className="text-[0.5rem] text-white/60 font-bold uppercase mb-0.5">{item.matches} Match</span>
                                        <span className={`font-game text-sm text-transparent bg-clip-text bg-gradient-to-b ${item.color} drop-shadow-sm`}>
                                            {item.points}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* GOAL BUCKETS LEGEND */}
                <motion.div variants={itemVariants} className="w-full mt-2">
                    <h3 className="text-center text-blue-200/80 text-[10px] font-bold uppercase tracking-[0.2em] mb-4">Goal Buckets</h3>
                    <div className="grid grid-cols-1 gap-3 bg-[#0a1529]/50 p-4 rounded-2xl border border-white/5">
                        {goals.map((g, i) => (
                            <div key={i} className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-lg shadow-sm shrink-0 border border-white/10"
                                    style={{ background: g.bg, boxShadow: `0 2px 0 ${g.border}` }}></div>
                                <div className="flex-1 border-b border-white/5 pb-2">
                                    <span className="text-white text-sm font-bold uppercase tracking-wide block">{g.label}</span>
                                    <span className="text-white/40 text-[10px] font-medium uppercase tracking-wider">Match tiles to fill</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

            </div>

            {/* Footer / Start Button - Fixed at Bottom */}
            <motion.div
                variants={itemVariants}
                className="absolute bottom-0 left-0 w-full p-6 bg-[#050B14]/95 backdrop-blur-xl border-t border-white/10 z-20"
            >
                <div className="w-full max-w-md mx-auto">
                    <button
                        onClick={onStart}
                        className="w-full py-4 rounded-2xl font-game text-xl tracking-wider text-white uppercase relative overflow-hidden group transition-transform active:scale-[0.98] shadow-[0_6px_0_#b45309,0_15px_20px_rgba(0,0,0,0.4)] hover:shadow-[0_8px_0_#b45309,0_20px_25px_rgba(0,0,0,0.4)] active:shadow-[0_2px_0_#b45309] active:translate-y-1"
                    >
                        <div className="absolute inset-0 bg-gradient-to-b from-[#fcd34d] via-[#f59e0b] to-[#d97706]"></div>
                        <div className="absolute inset-x-0 top-0 h-[2px] bg-white/60"></div>
                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/10 to-transparent"></div>
                        <div className="relative flex items-center justify-center gap-3 drop-shadow-md">
                            <span className="text-[#78350f] text-stroke-white">START PLAYING</span>
                            <Play className="w-6 h-6 fill-[#78350f] text-[#78350f]" strokeWidth={3} />
                        </div>
                    </button>
                </div>
            </motion.div>

            <style>{`
        .text-stroke-white {
          -webkit-text-stroke: 1px rgba(255,255,255,0.4);
        }
        .stroke-text-blue {
          -webkit-text-stroke: 2px #1e3a8a;
        }
      `}</style>
        </motion.div>
    );
});

HowToPlay.propTypes = {
    onStart: PropTypes.func.isRequired,
};

export default HowToPlay;
