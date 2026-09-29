import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js'
import { reportProgress } from './transitionBus'

export function createGLTFLoader() {
  const loader = new GLTFLoader()
  loader.setMeshoptDecoder(MeshoptDecoder)
  return loader
}

export function loadGLTF(loader, url, onLoad, onError) {
  return loader.load(
    url,
    onLoad,
    (event) => {
      if (event.lengthComputable && event.total > 0) {
        reportProgress(event.loaded / event.total)
      }
    },
    onError,
  )
}
