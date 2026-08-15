import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'

// ESM 환경에서 __dirname 대체 — resolve.alias 의 절대 경로 기준점
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss(),
  ],
  // @/ → src/ 경로 별칭 (tsconfig paths 와 동기화)
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
})
