import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js'
import { clone as cloneSkeleton } from 'three/addons/utils/SkeletonUtils.js'

const cache = new Map()
const pending = new Map()
const loader = new GLTFLoader()
loader.setMeshoptDecoder(MeshoptDecoder)

function cloneModel(gltf) {
  return {
    scene: cloneSkeleton(gltf.scene),
    animations: gltf.animations,
    scenes: gltf.scenes,
    cameras: gltf.cameras,
    asset: gltf.asset,
    parser: gltf.parser,
    userData: gltf.userData,
  }
}

export function preloadModel(path) {
  if (cache.has(path)) return Promise.resolve(cache.get(path))
  if (pending.has(path)) return pending.get(path)

  const promise = new Promise((resolve, reject) => {
    loader.load(
      path,
      (gltf) => {
        cache.set(path, gltf)
        pending.delete(path)
        resolve(gltf)
      },
      undefined,
      (err) => {
        pending.delete(path)
        reject(err)
      }
    )
  })
  pending.set(path, promise)
  return promise
}

export async function loadModel(path) {
  const gltf = await preloadModel(path)
  return cloneModel(gltf)
}

export function clearCache() {
  cache.clear()
  pending.clear()
}
