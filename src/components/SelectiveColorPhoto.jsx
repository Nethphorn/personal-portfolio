import { useRef, useEffect } from 'react'

function hslToRgb(h, s, l) {
  h /= 360
  const a = s * Math.min(l, 1 - l)
  const f = (n) => {
    const k = (n + h * 12) % 12
    return l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
  }
  return [f(0) * 255, f(8) * 255, f(4) * 255]
}

export default function SelectiveColorPhoto({
  src,
  eyeColor = '#16CFFB',
  leftEye = { cx: 0.42, cy: 0.38, r: 0.035 },
  rightEye = { cx: 0.58, cy: 0.38, r: 0.035 },
  className,
}) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d', { willReadFrequently: true })

      const maxDim = 600
      let w = img.width, h = img.height
      if (w > maxDim || h > maxDim) {
        const ratio = Math.min(maxDim / w, maxDim / h)
        w = Math.floor(w * ratio)
        h = Math.floor(h * ratio)
      }

      canvas.width = w
      canvas.height = h
      ctx.drawImage(img, 0, 0, w, h)

      const imageData = ctx.getImageData(0, 0, w, h)
      const d = imageData.data

      const hex = eyeColor.replace('#', '')
      const targetR = parseInt(hex.slice(0, 2), 16)
      const targetG = parseInt(hex.slice(2, 4), 16)
      const targetB = parseInt(hex.slice(4, 6), 16)

      const eyes = [
        { cx: leftEye.cx * w, cy: leftEye.cy * h, r: leftEye.r * Math.max(w, h) },
        { cx: rightEye.cx * w, cy: rightEye.cy * h, r: rightEye.r * Math.max(w, h) },
      ]

      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const i = (y * w + x) * 4
          const r = d[i], g = d[i + 1], b = d[i + 2]

          let inEye = false
          let dist = Infinity
          for (const eye of eyes) {
            const dx = x - eye.cx, dy = y - eye.cy
            const d2 = Math.sqrt(dx * dx + dy * dy)
            if (d2 < eye.r) {
              inEye = true
              dist = d2
              break
            }
            dist = Math.min(dist, d2)
          }

          const gray = 0.299 * r + 0.587 * g + 0.114 * b

          if (inEye) {
            const lum = gray / 255
            const [hr, hg, hb] = hslToRgb(210, 0.85, lum * 0.6 + 0.2)
            const feather = Math.max(0, 1 - (eyes[0].r - dist) / (eyes[0].r * 0.3))
            d[i] = hr * (1 - feather * 0.3) + r * feather * 0.3
            d[i + 1] = hg * (1 - feather * 0.3) + g * feather * 0.3
            d[i + 2] = hb * (1 - feather * 0.3) + b * feather * 0.3
          } else {
            d[i] = gray
            d[i + 1] = gray
            d[i + 2] = gray
          }
        }
      }

      ctx.putImageData(imageData, 0, 0)
    }
    img.src = src
  }, [src, eyeColor, leftEye, rightEye])

  return <canvas ref={canvasRef} className={className} />
}
