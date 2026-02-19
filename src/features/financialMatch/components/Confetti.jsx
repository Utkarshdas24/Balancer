/**
 * Confetti — Canvas-based celebration animation.
 * Replicated from LifeMilestoneRace.
 */
import { useEffect, useRef } from 'react';

const Confetti = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let width = window.innerWidth;
        let height = window.innerHeight;

        canvas.width = width;
        canvas.height = height;

        const pieces = [];
        const numberOfPieces = 150;
        const colors = ['#0066B2', '#FF8C00', '#ffffff', '#FFD700', '#00A3E0'];

        class ConfettiPiece {
            constructor() {
                this.init();
            }
            init() {
                this.x = Math.random() * width;
                this.y = Math.random() * height - height;
                this.rotation = Math.random() * 360;
                this.size = Math.random() * 8 + 4;
                this.color = colors[Math.floor(Math.random() * colors.length)];
                this.vx = Math.random() * 2 - 1;
                this.vy = Math.random() * 2 + 2;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.rotation += 2;
                if (this.y > height) {
                    this.init();
                    this.y = -20;
                }
            }
            draw() {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate((this.rotation * Math.PI) / 180);
                ctx.fillStyle = this.color;
                ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
                ctx.restore();
            }
        }

        for (let i = 0; i < numberOfPieces; i++) {
            pieces.push(new ConfettiPiece());
        }

        let animationId;
        const animate = () => {
            ctx.clearRect(0, 0, width, height);
            pieces.forEach((p) => {
                p.update();
                p.draw();
            });
            animationId = requestAnimationFrame(animate);
        };

        animate();

        const timer = setTimeout(() => {
            cancelAnimationFrame(animationId);
            ctx.clearRect(0, 0, width, height);
        }, 5000);

        const handleResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };
        window.addEventListener('resize', handleResize);

        return () => {
            cancelAnimationFrame(animationId);
            clearTimeout(timer);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-[100]"
        />
    );
};

export default Confetti;
