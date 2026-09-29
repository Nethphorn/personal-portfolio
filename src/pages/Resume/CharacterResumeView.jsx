import { useCallback } from 'react'
import CharacterScene from '../../components/CharacterScene'

export default function CharacterResumeView() {
  const onAnimate = useCallback((t, mesh) => {
    const leg = mesh.getObjectByName('J_Bip_R_LowerLeg')
    if (leg) {
      if (leg._initX === undefined) leg._initX = leg.rotation.x
      leg.rotation.x = leg._initX + Math.sin(t * 1) * 0.1
    }
    const neck = mesh.getObjectByName('J_Bip_C_Neck')
    if (neck) {
      if (neck._initZ === undefined) neck._initZ = neck.rotation.z
      neck.rotation.z = neck._initZ + Math.sin(t * 0.6) * 0.04
    }
    const arm = mesh.getObjectByName('J_Bip_L_UpperArm')
    if (arm) {
      if (arm._initX === undefined) arm._initX = arm.rotation.x
      arm.rotation.x = arm._initX + Math.sin(t * 0.4) * 0.025
    }
  }, [])

  return (
    <CharacterScene
      modelPath="assets/3D_model/risa-cross-legs.glb"
      cameraPosition={[0, -3.06, 13.81]}
      defaultPosition={[5.56, -4.44]}
      defaultSpin={-112.1}
      defaultTilt={-0.3}
      scaleDivisor={4.0}
      backgroundColor="#ffa6ea"
      onAnimate={onAnimate}
    />
  )
}
