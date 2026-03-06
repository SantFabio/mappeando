import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/dynamic-prep-courses-map/', // necessário para GitHub Pages
  plugins: [
    react(),
    tailwindcss(),
  ],
})
