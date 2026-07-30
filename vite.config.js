import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/plan-repas/',   // doit correspondre EXACTEMENT au nom du dépôt
})