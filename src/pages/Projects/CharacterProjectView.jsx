import { useRef, useEffect, useCallback } from 'react'
import CharacterScene from '../../components/CharacterScene'

const CAM_POS = [2.86, 0.61, 9.78]
const DEF_POS = [-4.68, -5.99]
const DEF_SPIN = 35.5
const DEF_TILT = -4.5
const SCALE_DIV = 3.0
const ANIM_IDX = 2
const BG_COLOR = '#ffffff'
const MODEL_COLOR = 0xFD77D9
const ANIM_SPEED = 2

export default function CharacterProjectView({ onProjectClick }) {
  const scrollRef = useRef(null)

  useEffect(() => {
    return () => {
      if (scrollRef.current) {
        scrollRef.current = null
      }
    }
  }, [])

  const onAnimate = useCallback((t, mesh) => {
    if (mesh._initY === undefined) mesh._initY = mesh.position.y
    mesh.position.y = mesh._initY + Math.sin(t * 0.3) * 0.015
    const lu = mesh.getObjectByName('J_Bip_L_UpperLeg')
    const ll = mesh.getObjectByName('J_Bip_L_LowerLeg')
    const ru = mesh.getObjectByName('J_Bip_R_UpperLeg')
    const rl = mesh.getObjectByName('J_Bip_R_LowerLeg')
    const neck = mesh.getObjectByName('J_Bip_C_Neck')
    const luArm = mesh.getObjectByName('J_Bip_L_UpperArm')
    const llArm = mesh.getObjectByName('J_Bip_L_LowerArm')
    const ruArm = mesh.getObjectByName('J_Bip_R_UpperArm')
    const rlArm = mesh.getObjectByName('J_Bip_R_LowerArm')

    const thighX = -0.5
    const thighY = 0
    const thighZ = 0
    const thighAnim = Math.sin(t * 0.3) * 0.06
    if (lu) {
      if (lu._ix === undefined) lu._ix = lu.rotation.x
      if (lu._iy === undefined) lu._iy = lu.rotation.y
      if (lu._iz === undefined) lu._iz = lu.rotation.z
      lu.rotation.x = lu._ix + thighX + thighAnim
      lu.rotation.y = lu._iy + thighY
      lu.rotation.z = lu._iz + thighZ
    }
    if (ru) {
      if (ru._ix === undefined) ru._ix = ru.rotation.x
      if (ru._iy === undefined) ru._iy = ru.rotation.y
      if (ru._iz === undefined) ru._iz = ru.rotation.z
      ru.rotation.x = ru._ix + thighX + thighAnim
      ru.rotation.y = ru._iy + thighY
      ru.rotation.z = ru._iz + thighZ
    }

    const kneeX = 0.5
    const kneeY = 0
    const kneeZ = 0
    const kneeAnim = Math.sin(t * 0.3) * 0.08
    if (ll) {
      if (ll._ix === undefined) ll._ix = ll.rotation.x
      if (ll._iy === undefined) ll._iy = ll.rotation.y
      if (ll._iz === undefined) ll._iz = ll.rotation.z
      ll.rotation.x = ll._ix + kneeX + kneeAnim
      ll.rotation.y = ll._iy + kneeY
      ll.rotation.z = ll._iz + kneeZ
    }
    if (rl) {
      if (rl._ix === undefined) rl._ix = rl.rotation.x
      if (rl._iy === undefined) rl._iy = rl.rotation.y
      if (rl._iz === undefined) rl._iz = rl.rotation.z
      rl.rotation.x = rl._ix + kneeX + kneeAnim
      rl.rotation.y = rl._iy + kneeY
      rl.rotation.z = rl._iz + kneeZ
    }

    const neckX = -1
    const neckY = 0
    const neckZ = 0
    if (neck) {
      if (neck._ix === undefined) neck._ix = neck.rotation.x
      if (neck._iy === undefined) neck._iy = neck.rotation.y
      if (neck._iz === undefined) neck._iz = neck.rotation.z
      neck.rotation.x = neck._ix + neckX
      neck.rotation.y = neck._iy + neckY
      neck.rotation.z = neck._iz + neckZ + Math.sin(t * 0.5) * 0.04
    }

    const shoulderLX = -0.2
    const shoulderLY = 0
    const shoulderLZ = -0.2
    const shoulderRX = 0.2
    const shoulderRY = 0
    const shoulderRZ = 0.2
    const shoulderAnim = Math.sin(t * 0.15) * 0.06
    if (luArm) {
      if (luArm._ix === undefined) luArm._ix = luArm.rotation.x
      if (luArm._iy === undefined) luArm._iy = luArm.rotation.y
      if (luArm._iz === undefined) luArm._iz = luArm.rotation.z
      luArm.rotation.x = luArm._ix + shoulderLX + shoulderAnim
      luArm.rotation.y = luArm._iy + shoulderLY
      luArm.rotation.z = luArm._iz + shoulderLZ
    }
    if (ruArm) {
      if (ruArm._ix === undefined) ruArm._ix = ruArm.rotation.x
      if (ruArm._iy === undefined) ruArm._iy = ruArm.rotation.y
      if (ruArm._iz === undefined) ruArm._iz = ruArm.rotation.z
      ruArm.rotation.x = ruArm._ix + shoulderRX + shoulderAnim
      ruArm.rotation.y = ruArm._iy + shoulderRY
      ruArm.rotation.z = ruArm._iz + shoulderRZ
    }

    const elbowLX = 0.3
    const elbowLY = 0.1
    const elbowLZ = 0.2
    const elbowRX = -0.3
    const elbowRY = -0.1
    const elbowRZ = -0.2
    const elbowAnim = Math.sin(t * 0.2) * 0.06
    if (llArm) {
      if (llArm._ix === undefined) llArm._ix = llArm.rotation.x
      if (llArm._iy === undefined) llArm._iy = llArm.rotation.y
      if (llArm._iz === undefined) llArm._iz = llArm.rotation.z
      llArm.rotation.x = llArm._ix + elbowLX + elbowAnim
      llArm.rotation.y = llArm._iy + elbowLY
      llArm.rotation.z = llArm._iz + elbowLZ
    }
    if (rlArm) {
      if (rlArm._ix === undefined) rlArm._ix = rlArm.rotation.x
      if (rlArm._iy === undefined) rlArm._iy = rlArm.rotation.y
      if (rlArm._iz === undefined) rlArm._iz = rlArm.rotation.z
      rlArm.rotation.x = rlArm._ix + elbowRX + elbowAnim
      rlArm.rotation.y = rlArm._iy + elbowRY
      rlArm.rotation.z = rlArm._iz + elbowRZ
    }

    const bones = {
      hips: 'J_Bip_C_Hips', spine: 'J_Bip_C_Spine',
      chest: 'J_Bip_C_Chest', upperChest: 'J_Bip_C_UpperChest',
      head: 'J_Bip_C_Head',
    }
    const bodyX = 0
    const bodyY = 0
    const bodyZ = 0
    for (const name of Object.values(bones)) {
      const b = mesh.getObjectByName(name)
      if (b) {
        if (b._ix === undefined) b._ix = b.rotation.x
        if (b._iy === undefined) b._iy = b.rotation.y
        if (b._iz === undefined) b._iz = b.rotation.z
        b.rotation.x = b._ix + bodyX
        b.rotation.y = b._iy + bodyY
        b.rotation.z = b._iz + bodyZ
      }
    }
  }, [])

  return (
    <CharacterScene
      modelPath="/assets/3D_model/risa-falling.glb"
      cameraPosition={CAM_POS}
      defaultPosition={DEF_POS}
      defaultSpin={DEF_SPIN}
      defaultTilt={DEF_TILT}
      scaleDivisor={SCALE_DIV}
      animationIndex={ANIM_IDX}
      backgroundColor={BG_COLOR}
      modelColor={MODEL_COLOR}
      animSpeed={ANIM_SPEED}
      onAnimate={onAnimate}
    />
  )
}
