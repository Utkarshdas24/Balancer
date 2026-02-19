import React, { useEffect, useRef, useState } from "react";

const ScoreRing = ({ score }) => {
    const canvasRef = useRef(null);
    const [displayScore, setDisplayScore] = useState(0);

    // Clamped score logic - ensure it's a number
    const safeScore = isNaN(score) ? 0 : score;
    const clampedScore = Math.min(Math.max(Number(safeScore), 0), 100);

    // Discrete Zone Colors
    const getZoneColor = (val) => {
        if (val < 40) return "#FF3D00"; // Red (Low)
        if (val < 75) return "#FFD600"; // Yellow (Medium)
        return "#00E676"; // Green (High)
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        let animationFrameId;

        // Configuration
        const startAngle = 0.8 * Math.PI; // Slightly more open than 0.75
        const endAngle = 2.2 * Math.PI;
        const totalRotationRange = endAngle - startAngle;

        // Canvas dimensions
        const width = canvas.width;
        const height = canvas.height;
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) / 2 - 20; // Padding
        const trackWidth = 20;

        let animatedValue = 0; // Local var for the loop

        const animate = () => {
            // Simple ease-out
            const diff = clampedScore - animatedValue;
            if (Math.abs(diff) > 0.5) {
                animatedValue += diff * 0.08;
            } else {
                animatedValue = clampedScore;
            }

            // Update state for text
            setDisplayScore(Math.round(animatedValue));

            // Clear
            ctx.clearRect(0, 0, width, height);

            // 1. Draw Background Track (Dark Arc)
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, startAngle, endAngle);
            ctx.lineWidth = trackWidth;
            ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
            ctx.lineCap = "round";
            ctx.stroke();

            // 2. Draw Active Glow Arc
            const progress = animatedValue / 100;
            const currentAngle = startAngle + (progress * totalRotationRange);

            // Determine Color Based on Score Zone
            const activeColor = getZoneColor(animatedValue);

            ctx.save();
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, startAngle, currentAngle);
            ctx.lineWidth = trackWidth;
            ctx.strokeStyle = activeColor;
            ctx.lineCap = "round";

            // The Glow Effect
            ctx.shadowBlur = 20;
            ctx.shadowColor = activeColor;

            ctx.stroke();
            ctx.restore();

            // 3. Draw Ticks (Subtle)
            const tickCount = 40;
            ctx.save();
            // No glow for ticks
            ctx.shadowBlur = 0;
            for (let i = 0; i <= tickCount; i++) {
                const tickProgress = i / tickCount;
                const angle = startAngle + tickProgress * totalRotationRange;

                // Simple white ticks
                const isMajor = i % 10 === 0;
                const tickLen = isMajor ? 12 : 6;
                const innerR = radius - trackWidth / 2 - 5;
                const outerR = innerR - tickLen;

                const x1 = centerX + Math.cos(angle) * innerR;
                const y1 = centerY + Math.sin(angle) * innerR;
                const x2 = centerX + Math.cos(angle) * outerR;
                const y2 = centerY + Math.sin(angle) * outerR;

                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.lineWidth = isMajor ? 2 : 1;
                ctx.strokeStyle = tickProgress <= progress ? "rgba(255, 255, 255, 0.9)" : "rgba(255, 255, 255, 0.2)";
                ctx.stroke();
            }
            ctx.restore();

            // 4. Draw Needle
            const needleLen = radius - 10;
            const needleX = centerX + Math.cos(currentAngle) * needleLen;
            const needleY = centerY + Math.sin(currentAngle) * needleLen;

            ctx.save();
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(needleX, needleY);
            ctx.lineWidth = 4;
            ctx.strokeStyle = "#fff";
            ctx.lineCap = "round";
            // Glow for needle
            ctx.shadowBlur = 15;
            ctx.shadowColor = "#fff";
            ctx.stroke();

            // Pivot Circle
            ctx.beginPath();
            ctx.arc(centerX, centerY, 8, 0, Math.PI * 2);
            ctx.fillStyle = "#fff";
            ctx.fill();

            ctx.restore();

            if (Math.abs(diff) > 0.5) {
                animationFrameId = requestAnimationFrame(animate);
            }
        };

        animate();

        return () => {
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
        };
    }, [clampedScore]);

    // Calculate color for text based on score
    const scoreColor = getZoneColor(displayScore);

    return (
        <div className="relative flex flex-col items-center justify-center select-none w-full max-w-[350px] mx-auto">
            <canvas
                ref={canvasRef}
                width={350}
                height={300}
                className="w-full h-auto drop-shadow-xl"
            />

            {/* Score Text Overlay - Moved below the speedometer via negative margin/positioning to avoid needle cut */}
            <div className="text-center pointer-events-none z-10 -mt-12 mb-4">
                <div
                    className="text-5xl sm:text-6xl font-black text-white italic tracking-tighter"
                    style={{
                        textShadow: `0 0 20px ${scoreColor}, 0 0 40px ${scoreColor}`
                    }}
                >
                    {displayScore}
                    <span className="text-2xl sm:text-3xl font-bold not-italic ml-1 text-white/50">/100</span>
                </div>
            </div>
        </div>
    );
};

export default ScoreRing;
