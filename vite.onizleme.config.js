// Tek dosyalık önizleme: VITE_HASH=1 VITE_DEMO=1 npx vite build -c vite.onizleme.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig({ plugins: [react()], base: './', build: { outDir: 'onizleme-dist', emptyOutDir: true, assetsInlineLimit: 100000000, cssCodeSplit: false, rollupOptions: { output: { inlineDynamicImports: true } } } })
