import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          'three-addons': [
            'three/addons/loaders/GLTFLoader.js',
            'three/addons/libs/meshopt_decoder.module.js',
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
