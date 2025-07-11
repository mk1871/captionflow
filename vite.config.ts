import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/translation-page-for-obs/', // Ajustado para el repositorio translation-page-for-obs
  plugins: [vue(), tailwindcss()],
})
