import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { URL } from 'url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(new URL('.', import.meta.url).pathname, 'src'),
    },
  },
})
