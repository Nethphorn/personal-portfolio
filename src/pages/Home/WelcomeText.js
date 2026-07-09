import * as THREE from 'three'

const CFG = {
  speed: 0.025,
  angle: -0.15,
  color: '#ffffff',
  gap: 0.35,
  fontSize: 0.3,
  count: 12,
}

let fallbackCanvas = null
function getCanvas() {
  if (fallbackCanvas) return fallbackCanvas
  const c = document.createElement('canvas')
  c.width = 512
  c.height = 128
  const ctx = c.getContext('2d')
  ctx.fillStyle = 'transparent'
  ctx.fillRect(0, 0, 512, 128)
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  fallbackCanvas = c
  return c
}

function makeSprite(text, size) {
  const c = getCanvas()
  const ctx = c.getContext('2d')
  ctx.clearRect(0, 0, c.width, c.height)
  ctx.font = `${size * 160}px "MadouFutoMaruGothic", sans-serif`
  ctx.fillStyle = CFG.color
  ctx.shadowColor = 'rgba(0,0,0,0.5)'
  ctx.shadowBlur = 10
  ctx.fillText(text, c.width * 0.5, c.height * 0.5)
  const tex = new THREE.CanvasTexture(c)
  tex.needsUpdate = true
  const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false, opacity: 1 })
  const sprite = new THREE.Sprite(mat)
  sprite.scale.set(size * 12, size * 3, 1)
  return sprite
}

export default function createWelcomeText(scene) {
  const sprites = []
  const n = CFG.count
  for (let i = 0; i < n; i++) {
    const s = makeSprite('Welcome', CFG.fontSize)
    s.position.set((i - (n - 1) / 2) * CFG.gap * 3, 0, -3)
    scene.add(s)
    sprites.push(s)
  }

  return {
    update(t) {
      for (let i = 0; i < sprites.length; i++) {
        const s = sprites[i]
        const baseX = (i - (n - 1) / 2) * CFG.gap * 3
        const offset = Math.sin((t * 0.5 + i * 0.3)) * 0.15
        s.position.x = baseX + (t * CFG.speed * (i % 2 === 0 ? 1 : -1)) % (CFG.gap * 3)
        s.position.y = Math.sin(t * 0.8 + i * 0.5) * 0.1 + offset
        s.material.opacity = 0.12 + Math.sin(t * 0.6 + i * 0.7) * 0.06
      }
    },
  }
}
