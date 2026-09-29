import { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'
import { registerDebug, subscribeCameraMode } from '../lib/debugStore'
import { onTransition, signalPageReady } from '../lib/transitionBus'

export default function CharacterScene({
  modelPath,
  cameraPosition = [0, 1, 17],
  defaultPosition = [-6, -6],
  defaultSpin = 0,
  defaultTilt = 0,
  scaleDivisor = 10.0,
  animationIndex = 1,
  backgroundColor,
  modelColor = 0xffffff,
  bloomStrength = 0.15,
  positionControls = false,
  animSpeed = 1,
  onAnimate = null,
  onSceneReady = null,
}) {
  const containerRef = useRef(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    let running = true
    const unsubTransition = onTransition(() => { running = false })
    let mixer = null
    let outer = null
    let inner = null
    let tiltGrp = null
    let spinGrp = null
    let mesh = null
    let gltfResult = null

    const w = el.clientWidth
    const h = el.clientHeight

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(backgroundColor)

    const camera = new THREE.PerspectiveCamera(38, w / h, 0.1, 50)
    camera.position.set(...cameraPosition)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: false })
    renderer.setSize(w, h)
    renderer.setPixelRatio(1)
    el.appendChild(renderer.domElement)

    const composer = new EffectComposer(renderer)
    composer.addPass(new RenderPass(scene, camera))
    const bloomRes = new THREE.Vector2(Math.floor(w / 4), Math.floor(h / 4))
    const bloom = new UnrealBloomPass(bloomRes, bloomStrength, 0.1, 0.05)
    composer.addPass(bloom)

    const clock = new THREE.Clock()

    let outerRef, tiltRef, dragRef
    if (positionControls) {
      outerRef = { current: null }
      tiltRef = { current: null }
      dragRef = { current: { active: false, sx: 0, sy: 0, startPos: new THREE.Vector3(), startRotY: 0, startRotX: 0 } }
    }

    if (onSceneReady) onSceneReady({ scene, camera, renderer })

    const loader = new GLTFLoader()
    loader.load(
      modelPath,
      (gltf) => {
        if (!running) return
        setupModel(gltf)
      },
      undefined,
      (err) => console.error('Model load failed:', err)
    )

    function setupModel(gltf) {
      const m = gltf.scene
      mesh = m

      outer = new THREE.Group()
      scene.add(outer)
      tiltGrp = new THREE.Group()
      outer.add(tiltGrp)
      spinGrp = new THREE.Group()
      tiltGrp.add(spinGrp)
      inner = new THREE.Group()
      spinGrp.add(inner)
      inner.add(m)

      const box = new THREE.Box3().setFromObject(m)
      const size = box.getSize(new THREE.Vector3())
      const center = box.getCenter(new THREE.Vector3())
      m.position.set(-center.x, -center.y, -center.z)
      const s = scaleDivisor / Math.max(size.x, size.y, size.z)
      inner.scale.set(s, s, s)
      outer.position.set(defaultPosition[0], defaultPosition[1], 0)
      tiltGrp.rotation.x = THREE.MathUtils.degToRad(defaultTilt)
      spinGrp.rotation.y = THREE.MathUtils.degToRad(defaultSpin)

      if (positionControls) {
        outerRef.current = outer
        tiltRef.current = tiltGrp
      }

      const unregDebug = registerDebug({
        scene,
        camera,
        target: {
          position: outer.position,
          rotation: {
            get x() { return tiltGrp.rotation.x },
            get y() { return spinGrp.rotation.y },
            get z() { return 0 },
          },
        },
      })
      cleanupFns.push(unregDebug)

      m.traverse((ch) => {
        if (!ch.isMesh || !ch.material) return
        const arr = Array.isArray(ch.material) ? ch.material : [ch.material]
        ch.material = arr.map(() => new THREE.MeshBasicMaterial({ color: modelColor }))
        ch.material = ch.material.length === 1 ? ch.material[0] : ch.material
      })

      if (gltf.animations && gltf.animations.length > 0) {
        mixer = new THREE.AnimationMixer(m)
        const fallClip = gltf.animations[Math.min(animationIndex, gltf.animations.length - 1)]
        if (fallClip) {
          const fallAction = mixer.clipAction(fallClip)
          fallAction.setLoop(THREE.LoopOnce)
          fallAction.clampWhenFinished = true
          fallAction.play()
        }
      }

      signalPageReady()
    }

    let cleanupFns = []

    let isCamMode = false
    let camSph = { theta: 0, phi: 0, distance: 17 }

    function posToSph(pos) {
      const r = pos.length()
      return {
        theta: Math.atan2(pos.x, pos.z),
        phi: Math.asin(THREE.MathUtils.clamp(pos.y / r, -1, 1)),
        distance: r,
      }
    }

    function applyCamSph(sph) {
      const x = sph.distance * Math.sin(sph.theta) * Math.cos(sph.phi)
      const y = sph.distance * Math.sin(sph.phi)
      const z = sph.distance * Math.cos(sph.theta) * Math.cos(sph.phi)
      camera.position.set(x, y, z)
      camera.lookAt(0, 0, 0)
    }

    if (positionControls) {
      const unsubCam = subscribeCameraMode((enabled) => {
        isCamMode = enabled
        if (enabled) camSph = posToSph(camera.position)
      })
      cleanupFns.push(unsubCam)

      function onPointerDown(e) {
        if (isCamMode) {
          dragRef.current = {
            active: true,
            mode: 'cam',
            sx: e.clientX, sy: e.clientY,
            startTheta: camSph.theta,
            startPhi: camSph.phi,
            startDist: camSph.distance,
          }
        } else {
          const o = outerRef.current
          if (!o || !spinGrp) return
          dragRef.current = {
            active: true,
            mode: 'char',
            sx: e.clientX, sy: e.clientY,
            startPos: o.position.clone(),
            startRotY: spinGrp.rotation.y,
            startTilt: tiltGrp.rotation.x,
          }
        }
      }

      function onPointerMove(e) {
        const d = dragRef.current
        if (!d.active) return
        const dx = e.clientX - d.sx
        const dy = e.clientY - d.sy

        if (d.mode === 'cam') {
          if (e.shiftKey) {
            camSph.distance = d.startDist + dy * 0.05
            camSph.distance = Math.max(2, camSph.distance)
          } else {
            camSph.theta = d.startTheta - dx * 0.01
            camSph.phi = d.startPhi + dy * 0.01
            camSph.phi = THREE.MathUtils.clamp(camSph.phi, -Math.PI / 2 + 0.01, Math.PI / 2 - 0.01)
          }
          applyCamSph(camSph)
        } else {
          const o = outerRef.current
          if (!o || !spinGrp) return
          if (e.altKey) {
            e.preventDefault()
            tiltGrp.rotation.x = d.startTilt + dy * 0.01
          } else if (e.shiftKey) {
            spinGrp.rotation.y = d.startRotY + dx * 0.01
          } else {
            o.position.x = d.startPos.x + dx * 0.04
            o.position.y = d.startPos.y - dy * 0.04
          }
        }
      }

      function onPointerUp() {
        dragRef.current.active = false
      }

      el.addEventListener('pointerdown', onPointerDown)
      window.addEventListener('pointermove', onPointerMove)
      window.addEventListener('pointerup', onPointerUp)
      cleanupFns.push(
        () => el.removeEventListener('pointerdown', onPointerDown),
        () => window.removeEventListener('pointermove', onPointerMove),
        () => window.removeEventListener('pointerup', onPointerUp),
      )

      function onWheel(e) {
        e.preventDefault()
        if (isCamMode) {
          camSph.distance += e.deltaY * 0.02
          camSph.distance = Math.max(2, Math.min(50, camSph.distance))
          applyCamSph(camSph)
        } else if (outer) {
          outer.position.z += e.deltaY * 0.02
        }
      }
      el.addEventListener('wheel', onWheel, { passive: false })
      cleanupFns.push(() => el.removeEventListener('wheel', onWheel))

      let animIdx = animationIndex
      function onKey(e) {
        if (e.key === 'a' && mixer && gltfResult) {
          animIdx = (animIdx + 1) % gltfResult.animations.length
          mixer.stopAllAction()
          const clip = gltfResult.animations[animIdx]
          if (clip) {
            const action = mixer.clipAction(clip)
            action.play()
          }
        }
        if (e.key === 'l' && gltfResult) {
        }
        if (e.key === 's' && outer && tiltGrp && spinGrp) {
        }
      }
      window.addEventListener('keydown', onKey)
      cleanupFns.push(() => window.removeEventListener('keydown', onKey))
    }

    let centered = false
    function animate() {
      if (!running) return
      requestAnimationFrame(animate)
      if (document.hidden) return
      const dt = clock.getDelta()
      const t = clock.getElapsedTime()
      if (mixer) mixer.update(dt)
      if (mixer && mesh && !centered) {
        centered = true
        const box2 = new THREE.Box3().setFromObject(mesh)
        const c2 = box2.getCenter(new THREE.Vector3())
        mesh.position.set(-c2.x, -c2.y, -c2.z)
      }
      if (onAnimate && mesh) onAnimate(t * animSpeed, mesh, camera, scene)
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
      unsubTransition()
      ro.disconnect()
      renderer.dispose()
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement)
      cleanupFns.forEach(fn => fn())
    }
  }, [modelPath, cameraPosition, defaultPosition, defaultSpin, defaultTilt, scaleDivisor, animationIndex, backgroundColor, modelColor, bloomStrength, positionControls, animSpeed])

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
}
