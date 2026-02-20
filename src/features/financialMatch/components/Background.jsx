/**
 * Background — Cinematic dashboard background with faint graph texture and floaters.
 */
import { memo } from 'react';

const Background = memo(function Background() {
    const isLowEnd = typeof navigator !== 'undefined' && navigator.hardwareConcurrency <= 4;

    return (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-cinematic">
            {/* 1. Deep NAVY Gradient handled in index.css */}

            {/* 2. Faint Grid (Financial Texture) */}
            <div className="absolute inset-0 grid-texture opacity-20" />

            {/* 3. Floating Gradient Blurs (CSS Animation) */}
            {/* Only render complex blurs on high-end */}
            {!isLowEnd && (
                <>
                    <div
                        className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full animate-[pulse_8s_ease-in-out_infinite]"
                    />
                    <div
                        className="absolute bottom-[-10%] right-[10%] w-[400px] h-[400px] bg-teal-500/10 blur-[100px] rounded-full animate-[pulse_10s_ease-in-out_infinite] delay-1000"
                    />
                </>
            )}

            {/* 4. Subtle particles (Dust motes) */}
            {/* Reduced count for low-end */}
            {[...Array(isLowEnd ? 4 : 12)].map((_, i) => (
                <div
                    key={i}
                    className="absolute w-1 h-1 bg-white rounded-full blur-[1px] animate-[ping_4s_cubic-bezier(0,0,0.2,1)_infinite]"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 5}s`,
                        animationDuration: `${3 + Math.random() * 4}s`,
                        opacity: 0.2
                    }}
                />
            ))}
        </div>
    );
});

export default Background;
