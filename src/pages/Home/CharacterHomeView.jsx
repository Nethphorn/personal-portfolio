import { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js'
import createWelcomeText from './WelcomeText'
import createShape from './ShapeOverlay'
import { registerDebug } from '../../lib/debugStore'

function centerModel(model) {
  const box = new THREE.Box3().setFromObject(model)
  const size = box.getSize(new THREE.Vector3())
  const center = box.getCenter(new THREE.Vector3())
  model.position.set(-center.x, -center.y, -center.z)
  return 3.0 / Math.max(size.x, size.y, size.z)
}

const BG_HOT_PINK = '#FF88CC'
const BG_DARK_PINK = '#8B004B'
const BG_SPLIT = 9
const BG_Z = -5

function createBackground(scene, w, h) {
  const aspect = w / h
  const fovRad = 38 * Math.PI / 180
  const dist = 8 - BG_Z
  const vh = 2 * dist * Math.tan(fovRad / 2)
  const vw = vh * aspect
  const splitRatio = BG_SPLIT / 20

  const video = document.createElement('video')
  video.src = '/assets/wallpaper/summer-day.webm'
  video.loop = true
  video.muted = true
  video.playsInline = true
  video.play().catch(() => {})

  const videoMat = new THREE.MeshBasicMaterial({
    map: new THREE.VideoTexture(video),
    transparent: true,
    opacity: 0.15,
    depthWrite: false,
    side: THREE.DoubleSide,
  })
  const videoPlane = new THREE.Mesh(new THREE.PlaneGeometry(vw, vh), videoMat)
  videoPlane.position.set(0, 0, BG_Z)
  scene.add(videoPlane)

  video.addEventListener('loadedmetadata', () => {
    const vAspect = video.videoWidth / video.videoHeight
    const sAspect = vw / vh
    let gw, gh
    if (vAspect > sAspect) {
      gw = vw
      gh = vw / vAspect
    } else {
      gw = vh * vAspect
      gh = vh
    }
    videoPlane.geometry = new THREE.PlaneGeometry(gw, gh)
  })

  const leftW = vw * splitRatio
  const rightW = vw * (1 - splitRatio)
  const leftX = -vw / 2 + leftW / 2
  const rightX = -vw / 2 + leftW + rightW / 2

  const leftCanvas = document.createElement('canvas')
  leftCanvas.width = 64
  leftCanvas.height = 64
  const lctx = leftCanvas.getContext('2d')
  lctx.fillStyle = '#FF66B2'
  lctx.fillRect(0, 0, 64, 64)
  const leftTex = new THREE.CanvasTexture(leftCanvas)
  const leftMat = new THREE.SpriteMaterial({
    map: leftTex,
    depthWrite: false,
  })
  const leftSprite = new THREE.Sprite(leftMat)
  leftSprite.position.set(leftX, 0, BG_Z + 1)
  leftSprite.scale.set(leftW, vh, 1)
  scene.add(leftSprite)

  const rightPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(rightW, vh),
    new THREE.MeshBasicMaterial({ color: BG_DARK_PINK, transparent: true, opacity: 0.15, side: THREE.DoubleSide, depthWrite: false })
  )
  rightPlane.position.set(rightX, 0, BG_Z + 0.5)
  scene.add(rightPlane)
}

function loadModel(scene, camera, clock, mixerRef, cleanupFns) {
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

      cleanupFns.push(registerDebug({ scene, camera, target: grp }))
    },
    undefined,
    (err) => console.error('Model error:', err)
  )
}

export default function CharacterHomeView() {
  const containerRef = useRef(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const w = el.clientWidth
    const h = el.clientHeight

    const scene = new THREE.Scene()
    createBackground(scene, w, h)

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
    const cleanupFns = []

    loadModel(scene, camera, clock, mixerRef, cleanupFns)
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
      cleanupFns.forEach(fn => fn())
      ro.disconnect()
      renderer.dispose()
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
}
