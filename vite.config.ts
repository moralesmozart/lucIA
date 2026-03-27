import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
// For GitHub Pages: `npm run build:pages` (base /lucIA/)
export default defineConfig({
  plugins: [react(), tailwindcss()],
})
