import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/2D-RACING-GAME/',
  plugins: [react()],
  server: { port: 5173 },
})
