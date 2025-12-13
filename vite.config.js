import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Expose on network (0.0.0.0)
    allowedHosts: 'all', // Allow ngrok and other tunneling services
  },
})

