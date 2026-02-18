import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    root: '.',
    publicDir: 'public',
    define: {
        'import.meta.env.VITE_LIBRARY_URL': JSON.stringify(
            process.env.VITE_LIBRARY_URL || 'https://clevertree.github.io/songwalker-library'
        ),
    },
    optimizeDeps: {
        // Don't pre-bundle songwalker-js — esbuild breaks the WASM import.meta.url resolution
        exclude: ['songwalker-js'],
    },
    build: {
        outDir: 'dist',
        target: 'es2022',
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                about: resolve(__dirname, 'about.html'),
                keyboard: resolve(__dirname, 'keyboard.html'),
                vsti: resolve(__dirname, 'vsti.html'),
            },
            output: {
                manualChunks: {
                    'monaco-editor': ['monaco-editor'],
                },
            },
        },
    },
    server: {
        port: 3000,
        headers: {
            // Required for SharedArrayBuffer (AudioWorklet)
            'Cross-Origin-Opener-Policy': 'same-origin',
            'Cross-Origin-Embedder-Policy': 'require-corp',
        },
        fs: {
            // Allow serving files from symlinked songwalker-js (for npm link)
            allow: ['..'],
        },
    },
});
