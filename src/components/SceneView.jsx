import { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js'
import createWelcomeText from './WelcomeText'
import createShape from './ShapeOverlay'

function centerModel(model) {
  const box = new THREE.Box3().setFromObject(model)
  const size = box.getSize(new THREE.Vector3())
  const center = box.getCenter(new THREE.Vector3())
  model.position.set(-center.x, -center.y, -center.z)
  return 3.0 / Math.max(size.x, size.y, size.z)
}

// ============ BACKGROUND CONFIG — adjust these ============ //
const BG_HOT_PINK = '#FF66B2'   // ← left side color
const BG_DARK_PINK = '#8B004B'  // ← right side color
const BG_SPLIT = 9              // ← split position (0-20)
// ========================================================== //

function createBackground(scene) {
  const canvas = document.createElement('canvas')
  canvas.width = 20
  canvas.height = 1
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = BG_HOT_PINK
  ctx.fillRect(0, 0, BG_SPLIT, 1)
  ctx.fillStyle = BG_DARK_PINK
  ctx.fillRect(BG_SPLIT, 0, canvas.width - BG_SPLIT, 1)
  const texture = new THREE.CanvasTexture(canvas)
  texture.magFilter = THREE.NearestFilter
  texture.minFilter = THREE.NearestFilter
  scene.background = texture
}

function loadModel(scene, clock, mixerRef) {
  const loader = new GLTFLoader()
  loader.load(
    'assets/3D_model/risa-sitting.glb',
    (gltf) => {
      const m = gltf.scene
      const grp = new THREE.Group()
      scene.add(grp)
      grp.add(m)

      const s = centerModel(m)
      grp.scale.set(s, s, s)
      grp.position.set(0, -7.5, 0)
      grp.rotation.set(-0.1, -0.3, 0)

      m.traverse((ch) => {
        if (!ch.isMesh || !ch.material) return
        const arr = Array.isArray(ch.material) ? ch.material : [ch.material]
        ch.material = arr.map(() => new THREE.MeshBasicMaterial({ color: 0xffffff }))
        ch.material = ch.material.length === 1 ? ch.material[0] : ch.material
      })

      mixerRef.current = new THREE.AnimationMixer(m)
      if (gltf.animations.length) mixerRef.current.clipAction(gltf.animations[0]).play()
      console.log('Model loaded, meshes:', m.children.length)
    },
    undefined,
    (err) => console.error('Model error:', err)
  )
}

export default function SceneView() {
  const containerRef = useRef(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const w = el.clientWidth
    const h = el.clientHeight

    const scene = new THREE.Scene()
    createBackground(scene)

    const camera = new THREE.PerspectiveCamera(38, w / h, 0.1, 50)
    camera.position.set(0, 0.5, 8)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(w, h)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    el.appendChild(renderer.domElement)

    const composer = new EffectComposer(renderer)
    composer.addPass(new RenderPass(scene, camera))
    const bloom = new UnrealBloomPass(new THREE.Vector2(w, h), 0.15, 0.1, 0.05)
    composer.addPass(bloom)
    composer.addPass(new OutputPass())

    const clock = new THREE.Clock()
    const mixerRef = { current: null }

    loadModel(scene, clock, mixerRef)
    const welcome = createWelcomeText(scene)
    createShape(scene)

    let running = true
    function animate() {
      if (!running) return
      requestAnimationFrame(animate)
      if (mixerRef.current) mixerRef.current.update(clock.getDelta())
      welcome.update(clock.getElapsedTime())
      composer.render()
    }
    animate()

    function resize() {
      const cw = el.clientWidth
      const ch = el.clientHeight
      if (cw < 1 || ch < 1) return
      camera.aspect = cw / ch
      camera.updateProjectionMatrix()
      renderer.setSize(cw, ch)
      composer.setSize(cw, ch)
    }
    const ro = new ResizeObserver(resize)
    ro.observe(el)

    return () => {
      running = false
      ro.disconnect()
      renderer.dispose()
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
}
