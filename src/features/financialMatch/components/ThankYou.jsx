/**
 * ThankYou — Exact Replica of Life Milestone Race Design.
 */
import { motion } from 'framer-motion';
import Confetti from './Confetti';

const ThankYou = ({ onRestart, userName }) => {
    // Styling from ScoreResultsScreen framework
    const ghibliCardClass = "relative w-full min-h-[100dvh] flex flex-col overflow-hidden max-w-[600px] mx-auto text-sans";
    const ghibliContentClass = "relative z-50 w-full h-full flex flex-col py-8 px-4 sm:px-8 overflow-y-auto custom-scrollbar justify-center items-center";

    return (
        <div className={ghibliCardClass} style={{
            background: "linear-gradient(180deg, #00509E 0%, #003366 100%)" // Deep Blue Game Theme
        }}>
            <Confetti />

            {/* Background Pattern */}
            <div className="absolute inset-0 z-0 pointer-events-none bg-cover bg-center opacity-60 mix-blend-overlay"
                style={{ backgroundImage: 'linear-gradient(radial-gradient, circle at center, rgba(255,255,255,0.2) 0%, transparent 70%)' }}>
            </div>

            <div className={ghibliContentClass}>
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="flex flex-col items-center justify-center w-full text-center"
                >
                    <motion.h1
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-4xl sm:text-6xl md:text-7xl font-black text-white italic tracking-tight drop-shadow-xl mb-6 leading-tight uppercase"
                    >
                        Thank You {userName}
                    </motion.h1>

                    <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-base sm:text-xl md:text-2xl text-blue-100 font-bold drop-shadow-md mb-2 uppercase tracking-wide"
                    >
                        For sharing your details
                    </motion.p>
                    <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-sm sm:text-lg md:text-xl text-white/90 font-medium drop-shadow-md mb-12 uppercase tracking-wide"
                    >
                        Our Relationship Manager will connect with you
                    </motion.p>

                    <motion.button
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        onClick={onRestart}
                        className="bg-[#FF8C00] hover:bg-[#FF7000] text-white font-black text-sm py-3 px-8 shadow-[0_4px_0_#993D00] active:translate-y-1 active:shadow-none transition-all uppercase tracking-widest border-2 border-white/20 rounded-full"
                    >
                        RETAKE
                    </motion.button>
                </motion.div>
            </div>
        </div>
    );
};

export default ThankYou;
