import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(),tailwindcss()],
  server: {
    proxy: {
      '/api/pdf/merge': {
        target: 'https://pdfbuddy-10101721923.development.catalystappsail.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
