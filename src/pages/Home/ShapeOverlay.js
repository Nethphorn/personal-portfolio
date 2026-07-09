import * as THREE from 'three'

const CFG = {
  x: 6,
  y: -1,
  z: -4,
  topWidth: 1.2,
  bottomWidth: 0.4,
  height: 1.6,
  color1: '#ff66b2',
  color2: '#cc3388',
  rotation: -0.3,
  flipX: 1,
}

export default function createShape(scene) {
  const c = document.createElement('canvas')
  c.width = 128
  c.height = 256
  const ctx = c.getContext('2d')
  const grad = ctx.createLinearGradient(0, 0, 128, 256)
  grad.addColorStop(0, CFG.color1)
  grad.addColorStop(1, CFG.color2)
  ctx.fillStyle = grad
  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.lineTo(128, 0)
  ctx.lineTo(128 - 32, 256)
  ctx.lineTo(32, 256)
  ctx.closePath()
  ctx.fill()

  const tex = new THREE.CanvasTexture(c)
  const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false, opacity: 0.35 })
  const sprite = new THREE.Sprite(mat)
  sprite.position.set(CFG.x * CFG.flipX, CFG.y, CFG.z)
  sprite.scale.set(CFG.topWidth, CFG.height, 1)
  sprite.rotation.z = CFG.rotation
  scene.add(sprite)
}
