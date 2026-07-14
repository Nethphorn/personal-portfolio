import * as THREE from 'three'

const CFG = {
  text: 'Welcome',
  x: -6.5,
  y: -2.5,
  angle: 1,
  speed: 0.8,
  textRotation: 1,
  color: '#FF66B2',
  outline: '#000000',
  fontSize: 76,
  count: 20,
  gap: 2.8,
  scaleX: 3.6,
  scaleY: 0.9,
}

export default function createWelcomeText(scene) {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 128
  const ctx = canvas.getContext('2d')
  ctx.font = `bold ${CFG.fontSize}px Inter, system-ui, sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  ctx.strokeStyle = CFG.outline
  ctx.lineWidth = 5
  ctx.lineJoin = 'round'
  ctx.strokeText(CFG.text, 256, 64)
  ctx.fillStyle = CFG.color
  ctx.fillText(CFG.text, 256, 64)

  const texture = new THREE.CanvasTexture(canvas)
  const mat = new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false })
  const sprites = []

  for (let i = 0; i < CFG.count; i++) {
    const s = new THREE.Sprite(mat.clone())
    s.scale.set(CFG.scaleX, CFG.scaleY, 1)
    s.material.rotation = CFG.textRotation
    scene.add(s)
    sprites.push(s)
  }

  function update(elapsed) {
    const dirX = Math.cos(CFG.angle)
    const dirY = Math.sin(CFG.angle)
    const totalLen = CFG.count * CFG.gap
    for (let i = 0; i < sprites.length; i++) {
      const t = ((elapsed * CFG.speed + i * CFG.gap) % totalLen + totalLen) % totalLen
      sprites[i].position.x = CFG.x + t * dirX
      sprites[i].position.y = CFG.y + t * dirY
    }
  }

  return { update }
}
