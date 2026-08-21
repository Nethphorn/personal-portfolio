import * as THREE from 'three'
import CharacterScene from '../../components/CharacterScene'

const WALL_W = 10
const WALL_H = 30

export default function CharacterContactView() {
  let wallAdded = false

  function onAnimate(t, mesh, camera, scene) {
    if (!wallAdded) {
      wallAdded = true
      const geo = new THREE.PlaneGeometry(WALL_H, WALL_W)
      const mat = new THREE.MeshBasicMaterial({
        color: 0x445566, side: THREE.DoubleSide, transparent: true, opacity: 0.3,
      })
      const wall = new THREE.Mesh(geo, mat)
      wall.rotation.y = Math.PI / 2
      wall.position.set(3, 3, 0)
      scene.add(wall)
    }

    const head = mesh.getObjectByName('J_Bip_C_Head')
    if (head) head.lookAt(camera.position)
    const neck = mesh.getObjectByName('J_Bip_C_Neck')
    if (neck) {
      if (neck._iz === undefined) neck._iz = neck.rotation.z
      neck.rotation.z = neck._iz + Math.sin(t * 0.4) * 0.04
    }
    const rArm = mesh.getObjectByName('J_Bip_R_UpperArm')
    if (rArm) {
      if (rArm._rx === undefined) rArm._rx = rArm.rotation.x
      rArm.rotation.x = rArm._rx + Math.sin(t * 0.3) * 0.04
    }
    const breath = Math.sin(t * 0.5) * 0.015
    for (const name of ['J_Bip_C_Chest', 'J_Bip_C_UpperChest', 'J_Bip_C_Spine']) {
      const b = mesh.getObjectByName(name)
      if (b) {
        if (b._bx === undefined) b._bx = b.rotation.x
        b.rotation.x = b._bx + breath
      }
    }
  }

  return (
    <>
      <CharacterScene
        modelPath="assets/3D_model/risa-wallstand.glb"
        cameraPosition={[6.85, 6.23, 5.11]}
        defaultPosition={[1.92, -5.82]}
        defaultTilt={0}
        defaultSpin={0}
        scaleDivisor={3.0}
        positionControls
        onAnimate={onAnimate}
        backgroundColor="#ffa6ea"
      />
    </>
  )
}
