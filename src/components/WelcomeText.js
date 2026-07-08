import * as THREE from 'three'

// ============ WELCOME TEXT CONFIG — adjust these ============ //
const CFG = {
  text: 'Welcome',            // ← text to display
  x: -6.5,                    // ← starting X
  y: -2.5,                    // ← starting Y
  angle: 1,                   // ← scroll angle in radians
  speed: 0.8,                 // ← scroll speed
  textRotation: 1,            // ← text tilt in radians
  color: '#FF66B2',           // ← fill color
  outline: '#000000',            // ← outline color
  fontSize: 76,               // ← font size (px on canvas)
  count: 20,                  // ← how many texts
  gap: 2.8,                   // ← spacing between each
  scaleX: 3.6,                // ← sprite scale X
  scaleY: 0.9,                // ← sprite scale Y
}
// ============================================================ //

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
