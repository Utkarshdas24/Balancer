/**
 * TutorialHand.jsx — Animated Hand for Tutorial Overlay
 */
import { motion } from 'framer-motion';
import { Hand } from 'lucide-react';

const TutorialHand = () => {
    return (
        <div className="absolute inset-0 pointer-events-none z-[200] flex items-center justify-center">
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

            {/* Instruction Text */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-[20%] w-full text-center px-6"
            >
                <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-wider drop-shadow-[0_4px_0_rgba(0,0,0,0.5)] mb-2">
                    How to Play
                </h2>
                <p className="text-base sm:text-lg text-blue-100 font-bold bg-black/40 inline-block px-4 py-2 rounded-full border border-white/20">
                    Swap tiles to make a match!
                </p>
            </motion.div>

            {/* Hand Animation */}
            <div className="relative w-64 h-64 flex items-center justify-center">
                {/* Reference Grid Highlight (Mock) */}
                <div className="absolute flex gap-1">
                    <div className="w-12 h-12 border-2 border-white/50 rounded-xl bg-white/10" />
                    <div className="w-12 h-12 border-2 border-dashed border-bb-gold rounded-xl bg-bb-gold/20 animate-pulse" />
                </div>

                <motion.div
                    initial={{ x: -25, y: 25, opacity: 0 }}
                    animate={{
                        x: [-25, 25, -25], // Move right then back
                        y: [25, 25, 25],
                        opacity: [0, 1, 1, 0]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                        repeatDelay: 0.5
                    }}
                    className="absolute z-10 text-white drop-shadow-xl"
                >
                    <Hand size={48} className="fill-white/20 -rotate-12" strokeWidth={2} />
                </motion.div>
            </div>
        </div>
    );
};

export default TutorialHand;
