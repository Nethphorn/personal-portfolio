import './RectTriangle.css'

function pts(fx, fy, W, H, TRI) {
  if (fx === 1 && fy === 1) return `0,0 ${W - TRI},0 ${W},${H} 0,${H}`
  if (fx === 1)             return `0,${H} ${W - TRI},${H} ${W},0 0,0`
  if (fy === 1)             return `${W},0 ${TRI},0 0,${H} ${W},${H}`
  return `${W},${H} ${TRI},${H} 0,0 ${W},0`
}

export default function RectTriangle({
  flipX, flipY, children,
  width = 975, height = 100, triWidth = 150, strokeWidth = 6,
} = {}) {
  const fx = flipX ?? -1, fy = flipY ?? -1
  const cw = width + strokeWidth * 2
  const ch = height + strokeWidth * 2

  return (
    <div className="rect-tri-deco" style={{ width: cw, height: ch }}>
      <svg viewBox={`${-strokeWidth} ${-strokeWidth} ${cw} ${ch}`} className="rect-tri-svg" preserveAspectRatio="none">
        <polygon
          points={pts(fx, fy, width, height, triWidth)}
          className="rect-tri-poly"
          strokeWidth={strokeWidth * 2}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      {children && <div className="rect-tri-content">{children}</div>}
    </div>
  )
}
