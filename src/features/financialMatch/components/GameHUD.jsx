/**
 * GameHUD — Branding removed. Scaling Timer enabled.
 */
import { memo } from 'react';
import PropTypes from 'prop-types';
import CircularTimer from './CircularTimer.jsx';
import { GAME_DURATION_SECONDS } from '../config/gameConfig.js';
import { XCircle } from 'lucide-react';

const GameHUD = memo(function GameHUD({ timeLeft, onExit }) {
    return (
        <div className="w-full shrink-0 flex items-center justify-between px-4 py-3 pb-2 z-20">
            <div className="glass-header w-full flex items-center justify-between px-4 py-2 rounded-2xl border border-white/10 relative h-14">

                {/* Center: Timer with Scaling Animation */}
                <div
                    className={`absolute left-1/2 -translate-x-1/2 top-[-6px] transition-all duration-500 ease-in-out z-30 ${timeLeft <= 10 ? 'scale-125 top-2 drop-shadow-[0_0_15px_rgba(255,0,0,0.6)]' : 'scale-100'}`}
                >
                    <div className={`bg-bb-navy p-1 rounded-full border border-bb-accent/20 shadow-xl transition-colors ${timeLeft <= 10 ? 'border-red-500/50 bg-red-900/40' : ''}`}>
                        <CircularTimer timeLeft={timeLeft} totalTime={GAME_DURATION_SECONDS} />
                    </div>
                </div>

                {/* Right: Exit */}
                <button
                    onClick={onExit}
                    className="group flex flex-col items-center gap-0.5 opacity-60 hover:opacity-100 transition-opacity ml-auto"
                    aria-label="Exit Game"
                >
                    <XCircle className="w-6 h-6 text-white drop-shadow-md group-hover:text-red-400 transition-colors" />
                </button>
            </div>
        </div>
    );
});

GameHUD.propTypes = {
    timeLeft: PropTypes.number.isRequired,
    onExit: PropTypes.func.isRequired,
};

export default GameHUD;
