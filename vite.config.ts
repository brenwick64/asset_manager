import { defineConfig } from 'vite'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import electron from 'vite-plugin-electron/simple'
import react from '@vitejs/plugin-react'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig(({ mode }) => {
  const isTest = mode === 'test'

  return {
    plugins: [
      react(),
      electron({
        main: {
          entry: 'electron/main.ts',
          // If you ever need Vite build tweaks for MAIN, put them here:
          // vite: { build: { sourcemap: true } }
        },
        preload: {
          input: path.join(__dirname, 'electron/preload.ts'),
          // If you ever need Vite build tweaks for PRELOAD, put them here:
          // vite: { build: { sourcemap: true } }
        },
        // Optional: Node/Electron polyfills for the renderer (per plugin docs)
        renderer: isTest ? undefined : {},
      }),
    ],

    // These are Vite (renderer) build options. This is where `build:` belongs.
    build: {
      assetsDir: 'assets',
    }
  }
})
