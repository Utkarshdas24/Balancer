/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ['class'],
    content: [
        './index.html',
        './src/**/*.{js,jsx}',
    ],
    theme: {
        container: {
            center: true,
            padding: '2rem',
            screens: { '2xl': '1400px' },
        },
        extend: {
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                display: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
                game: ['Luckiest Guy', 'cursive'],
            },
            colors: {
                'bb-navy': '#081c3a',
                'bb-deep': '#0f2a55',
                'bb-glass': 'rgba(255, 255, 255, 0.08)',
                'bb-glass-border': 'rgba(255, 255, 255, 0.12)',
                'bb-accent': '#3B82F6',
                'bb-gold': '#F59E0B',
                'bb-green': '#10B981',
                'bb-red': '#EF4444',
                'bajaj-blue': '#0066B2',
                'bajaj-orange': '#FF8C00',
            },
            boxShadow: {
                'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.36)',
                'tile': '0 4px 6px -1px rgba(0, 0, 0, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.3)',
                'tile-active': '0 0 15px rgba(255, 255, 255, 0.5), inset 0 0 10px rgba(255, 255, 255, 0.3)',
                'glow-text': '0 0 10px rgba(255, 255, 255, 0.5)',
            },
            backgroundImage: {
                'tile-green': 'linear-gradient(180deg, #2ecc71 0%, #1f8f4e 100%)',
                'tile-blue': 'linear-gradient(180deg, #3B82F6 0%, #1D4ED8 100%)',
                'tile-yellow': 'linear-gradient(180deg, #FCD34D 0%, #D97706 100%)',
                'tile-red': 'linear-gradient(180deg, #F87171 0%, #DC2626 100%)',
                'highlight-strip': 'linear-gradient(180deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 100%)',
            },
            keyframes: {
                'wave': {
                    '0%': { transform: 'translateX(0) translateZ(0) scaleY(1)' },
                    '50%': { transform: 'translateX(-25%) translateZ(0) scaleY(0.8)' },
                    '100%': { transform: 'translateX(-50%) translateZ(0) scaleY(1)' },
                },
                'pulse-glow': {
                    '0%, 100%': { opacity: '1', boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)' },
                    '50%': { opacity: '0.8', boxShadow: '0 0 20px rgba(59, 130, 246, 0.8)' },
                },
                'particle-rise': {
                    '0%': { transform: 'translateY(0) scale(1)', opacity: '1' },
                    '100%': { transform: 'translateY(-60px) scale(0.5)', opacity: '0' },
                },
                'praise-enter': {
                    '0%': { opacity: '0', transform: 'scale(0.5)' },
                    '60%': { opacity: '1', transform: 'scale(1.1)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
                'praise-exit': {
                    '0%': { opacity: '1', transform: 'scale(1)' },
                    '100%': { opacity: '0', transform: 'scale(1.2) translateY(-20px)' },
                },
                'shake': {
                    '0%, 100%': { transform: 'translateX(0)' },
                    '20%': { transform: 'translateX(-4px)' },
                    '40%': { transform: 'translateX(4px)' },
                    '60%': { transform: 'translateX(-2px)' },
                    '80%': { transform: 'translateX(2px)' },
                },
                'tile-pop': {
                    '0%': { transform: 'scale(0)' },
                    '60%': { transform: 'scale(1.1)' },
                    '100%': { transform: 'scale(1)' },
                },
            },
            animation: {
                'wave': 'wave 3s linear infinite',
                'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
                'particle-rise': 'particle-rise 1s ease-out forwards',
                'praise-enter': 'praise-enter 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
                'praise-exit': 'praise-exit 0.4s ease-in forwards',
                'shake': 'shake 0.3s ease-in-out',
                'tile-pop': 'tile-pop 0.3s ease-out',
            },
        },
    },
    plugins: [],
};
