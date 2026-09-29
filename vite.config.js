import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync, mkdirSync, readdirSync, statSync, existsSync } from 'fs'
import { join, relative, dirname } from 'path'

function copyToDist(sourceDir, filePatterns) {
  return {
    name: `copy-${sourceDir.replace(/[/\\]/g, '-')}`,
    closeBundle() {
      const src = join(process.cwd(), sourceDir)
      const dest = join(process.cwd(), 'dist', sourceDir)
      if (!existsSync(src)) return

      function walk(dir) {
        const entries = readdirSync(dir)
        for (const entry of entries) {
          const full = join(dir, entry)
          if (statSync(full).isDirectory()) {
            walk(full)
          } else if (filePatterns.some((p) => entry.endsWith(p))) {
            const rel = relative(src, full)
            const out = join(dest, rel)
            mkdirSync(dirname(out), { recursive: true })
            copyFileSync(full, out)
          }
        }
      }
      walk(src)
    }
  }
}

export default defineConfig({
  plugins: [
    react(),
    copyToDist('assets', ['.glb', '.gltf', '.bin', '.png', '.webm', '.wav', '.mp3', '.fbx']),
    copyToDist('img', ['.pdf']),
  ],
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          'three-addons': [
            'three/addons/loaders/GLTFLoader.js',
            'three/addons/postprocessing/EffectComposer.js',
            'three/addons/postprocessing/RenderPass.js',
            'three/addons/postprocessing/UnrealBloomPass.js',
            'three/addons/postprocessing/OutputPass.js',
          ],
        },
      },
    },
  },
})
