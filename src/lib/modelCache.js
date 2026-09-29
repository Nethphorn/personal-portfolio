import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import * as THREE from 'three'

const cache = new Map()
const loading = new Map()
const loader = new GLTFLoader()

function cloneModel(gltf) {
  const cloned = gltf.scene.clone(true)
  return {
    scene: cloned,
    animations: gltf.animations,
    scenes: gltf.scenes,
    cameras: gltf.cameras,
    asset: gltf.asset,
    parser: gltf.parser,
    userData: gltf.userData
  }
}

export function preloadModel(path) {
  if (cache.has(path)) return Promise.resolve(cache.get(path))
  if (loading.has(path)) return loading.get(path)

  const promise = new Promise((resolve, reject) => {
    loader.load(path, (gltf) => {
      cache.set(path, gltf)
      loading.delete(path)
      resolve(gltf)
    }, undefined, (err) => {
      loading.delete(path)
      reject(err)
    })
  })
  loading.set(path, promise)
  return promise
}

export function getCachedModel(path) {
  const gltf = cache.get(path)
  console.log('[Cache] getCachedModel:', path, 'hit:', !!gltf)
  return gltf ? cloneModel(gltf) : null
}

export function clearCache() {
  cache.clear()
  loading.clear()
}