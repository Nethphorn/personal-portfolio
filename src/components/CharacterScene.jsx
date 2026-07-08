import { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'

export default function CharacterScene({
  modelPath,
  cameraPosition = [0, 1, 17],
  defaultPosition = [-6, -6],
  defaultSpin = 0,
  defaultTilt = 0,
  scaleDivisor = 10.0,
  animationIndex = 1,
  backgroundColor = '#2D0A1E',
  bloomStrength = 0.15,
  positionControls = false,
}) {
  const containerRef = useRef(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    let running = true
    let mixer = null
    let outer = null
    let inner = null
    let tiltGrp = null
    let spinGrp = null
    let mesh = null
    let gltfResult = null
    let limbBones = { legL: null, legR: null, neck: null }

    const w = el.clientWidth
    const h = el.clientHeight

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(backgroundColor)

    const camera = new THREE.PerspectiveCamera(38, w / h, 0.1, 50)
    camera.position.set(...cameraPosition)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(w, h)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    el.appendChild(renderer.domElement)

    const composer = new EffectComposer(renderer)
    composer.addPass(new RenderPass(scene, camera))
    const bloom = new UnrealBloomPass(new THREE.Vector2(w, h), bloomStrength, 0.1, 0.05)
    composer.addPass(bloom)

    const clock = new THREE.Clock()

    let outerRef, tiltRef, dragRef
    if (positionControls) {
      outerRef = { current: null }
      tiltRef = { current: null }
      dragRef = { current: { active: false, sx: 0, sy: 0, startPos: new THREE.Vector3(), startRotY: 0, startRotX: 0 } }
    }

    const loader = new GLTFLoader()
    loader.load(
      modelPath,
      (gltf) => {
        if (!running) return
        gltfResult = gltf
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

        m.traverse((ch) => {
          if (!ch.isMesh || !ch.material) return
          const arr = Array.isArray(ch.material) ? ch.material : [ch.material]
          ch.material = arr.map(() => new THREE.MeshBasicMaterial({ color: 0xffffff }))
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

        limbBones = { legL: null, legR: null, neck: null }
        m.traverse((ch) => {
          if (!ch.isBone) return
          if (ch.name === 'J_Bip_L_UpperLeg') limbBones.legL = ch
          if (ch.name === 'J_Bip_R_UpperLeg') limbBones.legR = ch
          if (ch.name === 'J_Bip_C_Neck') limbBones.neck = ch
        })
      },
      undefined,
      (err) => console.error('Model error:', err)
    )

    let cleanupFns = []

    if (positionControls) {
      function onPointerDown(e) {
        const o = outerRef.current
        const t = tiltRef.current
        if (!o || !t || !spinGrp) return
        dragRef.current = {
          active: true,
          sx: e.clientX,
          sy: e.clientY,
          startPos: o.position.clone(),
          startRotY: spinGrp.rotation.y,
          startRotX: t.rotation.x,
        }
      }

      function onPointerMove(e) {
        const d = dragRef.current
        if (!d.active) return
        const o = outerRef.current
        const t = tiltRef.current
        if (!o || !t || !spinGrp) return
        const dx = e.clientX - d.sx
        const dy = e.clientY - d.sy

        if (e.shiftKey) {
          spinGrp.rotation.y = d.startRotY + dx * 0.01
        } else if (e.altKey) {
          t.rotation.x = d.startRotX + dy * 0.01
        } else {
          o.position.x = d.startPos.x + dx * 0.04
          o.position.y = d.startPos.y - dy * 0.04
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

      let animIdx = animationIndex
      function onKey(e) {
        if (e.key === 'a' && mixer && gltfResult) {
          animIdx = (animIdx + 1) % gltfResult.animations.length
          mixer.stopAllAction()
          const clip = gltfResult.animations[animIdx]
          if (clip) {
            const action = mixer.clipAction(clip)
            action.play()
            console.log(`Animation[${animIdx}]: "${clip.name || 'unnamed'}"`)
          }
        }
        if (e.key === 'l' && gltfResult) {
          console.log(`Animations (${gltfResult.animations.length}):`, gltfResult.animations.map((a, i) => `${i}: ${a.name || 'unnamed'}`).join(', '))
        }
        if (e.key === 's' && outer && tiltGrp && spinGrp) {
          console.log(`// Saved state for: ${modelPath}`)
          console.log(`cameraPosition: [${camera.position.x.toFixed(2)}, ${camera.position.y.toFixed(2)}, ${camera.position.z.toFixed(2)}]`)
          console.log(`defaultPosition: [${outer.position.x.toFixed(2)}, ${outer.position.y.toFixed(2)}]`)
          console.log(`defaultSpin: ${THREE.MathUtils.radToDeg(spinGrp.rotation.y).toFixed(1)}`)
          console.log(`defaultTilt: ${THREE.MathUtils.radToDeg(tiltGrp.rotation.x).toFixed(1)}`)
        }
      }
      window.addEventListener('keydown', onKey)
      cleanupFns.push(() => window.removeEventListener('keydown', onKey))
    }

    let centered = false
    function animate() {
      if (!running) return
      requestAnimationFrame(animate)
      const dt = clock.getDelta()
      const t = clock.getElapsedTime()
      if (mixer) mixer.update(dt)
      if (limbBones.legL) limbBones.legL.rotation.x = THREE.MathUtils.degToRad(130 + Math.sin(t * 1.2 + Math.PI) * 2)
      if (limbBones.legR) limbBones.legR.rotation.x = THREE.MathUtils.degToRad(130 + Math.sin(t * 1.2 + Math.PI) * 2)
      if (limbBones.neck) limbBones.neck.rotation.x = Math.sin(t * 1.2) * 0.04
      if (outer) outer.position.y = defaultPosition[1] + Math.sin(t * 2.5) * 0.02
      if (mixer && mesh && !centered) {
        centered = true
        const box2 = new THREE.Box3().setFromObject(mesh)
        const c2 = box2.getCenter(new THREE.Vector3())
        mesh.position.set(-c2.x, -c2.y, -c2.z)
      }
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
      cleanupFns.forEach(fn => fn())
    }
  }, [modelPath, cameraPosition, defaultPosition, defaultSpin, defaultTilt, scaleDivisor, animationIndex, backgroundColor, bloomStrength, positionControls])

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
}
