/**
 * TutorialHand.jsx — Animated Hand for Tutorial Overlay
 */
import { motion } from 'framer-motion';
import { Hand } from 'lucide-react';

const TutorialHand = () => {
    return (
        <div className="absolute inset-0 pointer-events-none z-[200] flex flex-col items-center justify-center">
            {/* Subtle Overlay to highlight text/hand, but keep grid visible */}
            <div className="absolute inset-0 bg-black/40" />

            {/* Instruction Text */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative z-10 text-center mb-8 px-4"
            >
                <h2 className="text-3xl font-black text-white uppercase tracking-wider drop-shadow-lg mb-2">
                    How to Play
                </h2>
                <div className="bg-bb-blue/80 backdrop-blur-md px-6 py-2 rounded-full border border-white/30 shadow-xl inline-block">
                    <p className="text-lg text-white font-bold">
                        Swap tiles to make a match!
                    </p>
                </div>
            </motion.div>

            {/* Hand Animation */}
            <div className="relative z-10 w-32 h-32 flex items-center justify-center">
                <motion.div
                    initial={{ x: -30, y: 10, opacity: 0 }}
                    animate={{
                        x: [-30, 30, -30], // Horizontal Swipe Gesture
                        y: [10, 10, 10],   // Stay relatively level
                        opacity: [0, 1, 1, 0]
                    }}
                    transition={{
                        duration: 1.2,
                        repeat: Infinity,
                        ease: "easeInOut",
                        repeatDelay: 0.2
                    }}
                    className="drop-shadow-2xl filter"
                >
                    <Hand size={64} className="fill-white text-bb-navy" strokeWidth={1.5} />
                </motion.div>

                {/* Optional: Simple dashed line to indicate path */}
                <svg className="absolute w-20 h-2 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30">
                    <line x1="0" y1="1" x2="80" y2="1" stroke="white" strokeWidth="2" strokeDasharray="4 4" />
                </svg>
            </div>
        </div>
    );
};

export default TutorialHand;
