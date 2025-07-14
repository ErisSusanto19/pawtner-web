import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './setupTests.js',
    include: [
      'src/**/*.{test,spec}.{js,ts,jsx,tsx}',
      'src/**/__test__/*.{js,ts,jsx,tsx}'
    ],
    coverage: {
      reporter: ['text', 'html'],
      exclude: ['src/setupTests.js'],
    },
    ui: true,
    watch: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    host: '0.0.0.0',
    port: 5173
  }
})
