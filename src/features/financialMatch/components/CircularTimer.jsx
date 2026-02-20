/**
 * CircularTimer — High-end animated countdown ring.
 * Pulses red under 30s. Electric Blue normal state.
 */
import { memo } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

const RADIUS = 24;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const CircularTimer = memo(function CircularTimer({ timeLeft, totalTime }) {
    const fraction = timeLeft / totalTime;
    const offset = CIRCUMFERENCE * (1 - fraction);
    const isWarning = timeLeft <= 30;

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const display = `${minutes}:${seconds.toString().padStart(2, '0')}`;

    const strokeColor = isWarning ? '#EF4444' : '#3B82F6';

    return (
        <div className={`relative flex items-center justify-center w-16 h-16 ${isWarning ? 'animate-pulse' : ''}`}>
            {/* Glow Backing */}
            {isWarning && (
                <div className="absolute inset-0 rounded-full bg-red-500/20 blur-xl animate-pulse" />
            )}

            <svg width={60} height={60} viewBox="0 0 60 60" className="transform -rotate-90 drop-shadow-lg">
                {/* Track */}
                <circle
                    cx="30"
                    cy="30"
                    r={RADIUS}
                    fill="none"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="3"
                />
                {/* Progress */}
                <motion.circle
                    cx="30"
                    cy="30"
                    r={RADIUS}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray={CIRCUMFERENCE}
                    initial={{ strokeDashoffset: 0 }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1, ease: "linear" }}
                    style={{ filter: `drop-shadow(0 0 4px ${strokeColor})` }}
                />
            </svg>

            {/* Time Text */}
            <div className="absolute inset-0 flex items-center justify-center">
                <span
                    className="font-game text-sm text-white drop-shadow-md tracking-wider leading-none"
                >
                    {display}
                </span>
            </div>
        </div>
    );
});

CircularTimer.propTypes = {
    timeLeft: PropTypes.number.isRequired,
    totalTime: PropTypes.number.isRequired,
};

export default CircularTimer;
