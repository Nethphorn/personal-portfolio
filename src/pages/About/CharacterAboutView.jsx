import { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js'
import { registerDebug } from '../../lib/debugStore'

export default function CharacterAboutView() {
  const containerRef = useRef(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    let running = true
    let mixer = null
    const animBones = { head: null, neck: null, legL: null, legR: null, kneeL: null, kneeR: null }
    let unregDebug = null

    const w = el.clientWidth
    const h = el.clientHeight

    const scene = new THREE.Scene()
    scene.background = new THREE.Color('#2D0A1E')

    const camera = new THREE.PerspectiveCamera(38, w / h, 0.1, 50)
    camera.position.set(-0.98, 0.85, 5.86)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(w, h)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    el.appendChild(renderer.domElement)

    const composer = new EffectComposer(renderer)
    composer.addPass(new RenderPass(scene, camera))
    const bloomRes = new THREE.Vector2(Math.floor(w / 2), Math.floor(h / 2))
    const bloom = new UnrealBloomPass(bloomRes, 0.15, 0.1, 0.05)
    composer.addPass(bloom)
    composer.addPass(new OutputPass())

    const clock = new THREE.Clock()

    const loader = new GLTFLoader()
    loader.load(
      'assets/3D_model/risa-laying-pose.glb',
      (gltf) => {
        if (!running) return
        setupModel(gltf)
      },
      undefined,
      (err) => console.error('Model load failed:', err)
    )

    function setupModel(gltf) {
      const m = gltf.scene
      const grp = new THREE.Group()
      scene.add(grp)
      grp.add(m)

      const box = new THREE.Box3().setFromObject(m)
      const size = box.getSize(new THREE.Vector3())
      const center = box.getCenter(new THREE.Vector3())
      m.position.set(-center.x, -center.y, -center.z)
      const s = 1.8 / Math.max(size.x, size.y, size.z)
      grp.scale.set(s, s, s)
      grp.position.set(3, -0.7, 0)

      unregDebug = registerDebug({ scene, camera, target: grp })

      m.traverse((ch) => {
        if (!ch.isMesh || !ch.material) return
        const arr = Array.isArray(ch.material) ? ch.material : [ch.material]
        ch.material = arr.map(() => new THREE.MeshBasicMaterial({ color: 0xffffff }))
        ch.material = ch.material.length === 1 ? ch.material[0] : ch.material
      })

      m.traverse((ch) => {
        if (ch.isBone) {
          const name = ch.name.toLowerCase()
          if (!animBones.neck && name.includes('neck')) animBones.neck = ch
          if (!animBones.head && name.includes('head')) animBones.head = ch
          if (name.includes('_l_')) {
            if (!animBones.legL && name.includes('upperleg')) animBones.legL = ch
            if (!animBones.kneeL && name.includes('lowerleg')) animBones.kneeL = ch
          }
          if (name.includes('_r_')) {
            if (!animBones.legR && name.includes('upperleg')) animBones.legR = ch
            if (!animBones.kneeR && name.includes('lowerleg')) animBones.kneeR = ch
          }
        }
      })

        if (gltf.animations && gltf.animations.length > 0) {
          mixer = new THREE.AnimationMixer(m)
          const action = mixer.clipAction(gltf.animations[0])
          action.play()
        }
      }

    function animate() {
      if (!running) return
      requestAnimationFrame(animate)
      if (document.hidden) return
      const dt = clock.getDelta()
      if (mixer) mixer.update(dt)
      const t = clock.getElapsedTime()
      if (animBones.head) animBones.head.rotation.z = Math.sin(t * 0.8) * 0.12
      if (animBones.neck) animBones.neck.rotation.x = -0.15
      if (animBones.kneeL) animBones.kneeL.rotation.x = (Math.sin(t * 0.8) + 1) * 0.7
      if (animBones.kneeR) animBones.kneeR.rotation.x = (Math.sin(t * 0.8 + Math.PI) + 1) * 0.7
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

    function onKey(e) {
      if (e.key === 'p') {
      }
    }
    window.addEventListener('keydown', onKey)

    return () => {
      running = false
      if (unregDebug) unregDebug()
      window.removeEventListener('keydown', onKey)
      ro.disconnect()
      renderer.dispose()
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
}