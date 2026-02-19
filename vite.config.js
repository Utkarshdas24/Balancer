import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    base: './',
    plugins: [react()],
    build: {
        outDir: 'dist',
        rollupOptions: {
            output: {
                name: 'FinancialMatchArena',
                exports: 'named',
                format: 'es',
            },
        },
    },
    server: {
        port: 5006,
    },
});
