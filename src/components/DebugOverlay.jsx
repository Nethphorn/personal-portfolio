import { useEffect, useState, useRef, useCallback } from 'react'
import * as THREE from 'three'
import { subscribe, setCameraMode } from '../lib/debugStore'
import './DebugOverlay.css'

export default function DebugOverlay() {
  const [sceneInfo, setSceneInfo] = useState(null)
  const [showCamera, setShowCamera] = useState(false)
  const [showGrid, setShowGrid] = useState(true)
  const [visible, setVisible] = useState(true)
  const [pos, setPos] = useState({ x: 0, y: 0, z: 0 })
  const [rot, setRot] = useState({ x: 0, y: 0, z: 0 })

  const sceneRef = useRef(null)
  const helpersRef = useRef(null)
  const rafRef = useRef(null)

  useEffect(() => {
    const unsub = subscribe((info) => {
      if (!info && sceneRef.current) {
        const h = helpersRef.current
        if (h) {
          sceneRef.current.remove(h)
        }
        helpersRef.current = null
        sceneRef.current = null
      }
      if (info) {
        sceneRef.current = info.scene
        if (!helpersRef.current) {
          const gy = -4
          const grp = new THREE.Group()

          const floor = new THREE.Mesh(
            new THREE.PlaneGeometry(20, 20),
            new THREE.MeshBasicMaterial({ color: 0x334, transparent: true, opacity: 0.25, side: THREE.DoubleSide, depthWrite: false })
          )
          floor.rotation.x = -Math.PI / 2
          floor.position.y = gy
          grp.add(floor)

          const lineMat = new THREE.MeshBasicMaterial({ color: 0x889, transparent: true, opacity: 0.6 })
          const s = 10
          for (let i = -s; i <= s; i++) {
            const h = new THREE.Mesh(new THREE.BoxGeometry(s * 2, 0.01, 0.01), lineMat)
            h.position.set(0, gy + 0.02, i)
            grp.add(h)
            const v = new THREE.Mesh(new THREE.BoxGeometry(0.01, 0.01, s * 2), lineMat)
            v.position.set(i, gy + 0.02, 0)
            grp.add(v)
          }

          function stick(from, to, color) {
            const d = new THREE.Vector3().copy(to).sub(from)
            const mid = new THREE.Vector3().copy(from).add(d.clone().multiplyScalar(0.5))
            const len = d.length()
            const m = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, len, 6), new THREE.MeshBasicMaterial({ color }))
            m.position.copy(mid)
            m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.clone().normalize())
            grp.add(m)
          }

          stick(new THREE.Vector3(0, gy, 0), new THREE.Vector3(5, gy, 0), 0xff6666)
          stick(new THREE.Vector3(0, gy, 0), new THREE.Vector3(0, gy + 5, 0), 0x66ff66)
          stick(new THREE.Vector3(0, gy, 0), new THREE.Vector3(0, gy, 5), 0x6688ff)

          grp.visible = showGrid
          info.scene.add(grp)
          helpersRef.current = grp
        }
      }
      setSceneInfo(info)
    })
    return () => {
      unsub()
      if (helpersRef.current && sceneRef.current) {
        sceneRef.current.remove(helpersRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (helpersRef.current) {
      helpersRef.current.visible = showGrid
    }
  }, [showGrid, sceneInfo])

  useEffect(() => {
    if (!sceneInfo) return
    const tick = () => {
      const src = showCamera ? sceneInfo.camera : sceneInfo.target
      if (src) {
        setPos({
          x: src.position.x,
          y: src.position.y,
          z: src.position.z,
        })
        setRot({
          x: THREE.MathUtils.radToDeg(sceneInfo.target.rotation.x),
          y: THREE.MathUtils.radToDeg(sceneInfo.target.rotation.y),
          z: THREE.MathUtils.radToDeg(sceneInfo.target.rotation.z),
        })
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    tick()
    return () => cancelAnimationFrame(rafRef.current)
  }, [sceneInfo, showCamera])

  useEffect(() => {
    const handler = (e) => {
      if (e.key === '`') {
        setVisible(v => !v)
        e.preventDefault()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  if (!visible || !sceneInfo) return null

  const val = (n) => n.toFixed(2)
  const deg = (n) => `${((n % 360) + 360) % 360 < 0.01 ? 0 : ((n % 360) + 360) % 360}`

  return (
    <div className="debug-overlay">
      <div className="debug-header">
        <span className="debug-title">Scene Debug</span>
        <button className="debug-close" onClick={() => setVisible(false)} title="Hide (Press ` to show)">&times;</button>
      </div>

      <div className="debug-body">
        <div className="debug-section-header">{showCamera ? 'Camera' : 'Position'}</div>
        <div className="debug-section">
          <span className="debug-label">X</span><span className="debug-value">{val(pos.x)}</span>
          <span className="debug-label">Y</span><span className="debug-value">{val(pos.y)}</span>
          <span className="debug-label">Z</span><span className="debug-value">{val(pos.z)}</span>
        </div>

        <div className="debug-section-header">Rotation</div>
        <div className="debug-section">
          <span className="debug-label">Tilt</span><span className="debug-value">{rot.x.toFixed(1)}&deg;</span>
          <span className="debug-label">Spin</span><span className="debug-value">{rot.y.toFixed(1)}&deg;</span>
        </div>

        <div className="debug-toggle-group">
          <button className={`debug-btn ${!showCamera ? 'active' : ''}`} onClick={() => { setShowCamera(false); setCameraMode(false) }}>
            Character
          </button>
          <button className={`debug-btn ${showCamera ? 'active' : ''}`} onClick={() => { setShowCamera(true); setCameraMode(true) }}>
            Camera
          </button>
        </div>

        <div className="debug-toggle-group">
          <button className={`debug-btn ${showGrid ? 'active' : ''}`} onClick={() => setShowGrid(v => !v)}>
            Grid {showGrid ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>
    </div>
  )
}
