import * as THREE from 'three'

const CFG = {
  x: -3,
  y: -3,
  w: 500,
  h: 200,
  diag: 120,
  scale: 0.014,
  flipX: false,
  flipY: true,
  rotation: 340,
  colorBg: '#FD77D9',
  colorFg: '#B03A74',
}

export default function createShape(scene) {
  const res = 4
  const canvas = document.createElement('canvas')
  canvas.width = Math.ceil((CFG.w + 20) * res)
  canvas.height = Math.ceil((CFG.h + 20) * res)
  const ctx = canvas.getContext('2d')

  ctx.save()
  ctx.scale(res, res)
  ctx.translate(CFG.w / 2 + 10, CFG.h / 2 + 10)
  ctx.scale(CFG.flipX ? -1 : 1, CFG.flipY ? -1 : 1)
  ctx.translate(-(CFG.w / 2 + 10), -(CFG.h / 2 + 10))

  const draw = (xOff, yOff) => {
    ctx.beginPath()
    ctx.moveTo(10 + xOff, 15 + yOff)
    ctx.lineTo(10 + CFG.w - xOff, 15 + yOff)
    ctx.lineTo(10 + CFG.w - CFG.diag - xOff, 15 + CFG.h - yOff)
    ctx.lineTo(10 + xOff, 15 + CFG.h - yOff)
    ctx.closePath()
    ctx.fill()
  }

  ctx.fillStyle = CFG.colorBg
  draw(0, 0)
  ctx.fillStyle = CFG.colorFg
  draw(10, 5)
  ctx.restore()

  const texture = new THREE.CanvasTexture(canvas)
  texture.magFilter = THREE.LinearFilter
  const mat = new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false })
  const sprite = new THREE.Sprite(mat)
  sprite.position.set(CFG.x, CFG.y, 0.5)
  sprite.scale.set(CFG.w * CFG.scale, CFG.h * CFG.scale, 1)
  sprite.material.rotation = CFG.rotation * Math.PI / 180
  sprite.material.depthTest = false
  scene.add(sprite)

  return sprite
}
