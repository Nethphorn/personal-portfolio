import { useState, useRef, useEffect, useCallback } from 'react'
import './ProjectsPanel.css'

const projects = [
  {
    title: 'Portfolio OS',
    desc: 'A fully interactive desktop environment in the browser with window management, file system, and 3D avatar.',
    tech: ['React', 'Three.js', 'CSS'],
  },
  {
    title: 'Game App',
    desc: 'A browser-based game built with modern web technologies and smooth animations.',
    tech: ['JavaScript', 'Canvas', 'WebGL'],
  },
  {
    title: 'E-Commerce Platform',
    desc: 'Full-featured online store with user authentication, product management, and payment integration.',
    tech: ['Node.js', 'MongoDB', 'React'],
  },
]

const palette = [
  ['#FF6B6B', '#C0392B'],
  ['#6BCB77', '#2D6A4F'],
  ['#4D96FF', '#1A3A6B'],
]

function AlbumCover({ title, index }) {
  const [c1, c2] = palette[index % palette.length]
  return (
    <svg viewBox="0 0 200 200" className="album-svg">
      <defs>
        <linearGradient id={`ag-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={c1} />
          <stop offset="100%" stopColor={c2} />
        </linearGradient>
      </defs>
      <rect width="200" height="200" fill={`url(#ag-${index})`} rx="14" />
      <circle cx="100" cy="100" r="65" fill="rgba(0,0,0,0.15)" />
      <circle cx="100" cy="100" r="28" fill="rgba(255,255,255,0.08)" />
      <circle cx="100" cy="100" r="8" fill="rgba(255,255,255,0.15)" />
      <text x="100" y="175" fill="#fff" fontFamily="Inter, system-ui, sans-serif" fontSize="14" fontWeight="700" textAnchor="middle">{title}</text>
    </svg>
  )
}

export default function ProjectsPanel({ selected, onClose }) {
  const [hoveredIdx, setHoveredIdx] = useState(null)
  const trackRef = useRef(null)
  const progress = useRef(0)
  const raf = useRef(null)
  const drag = useRef(null)
  const items = Array(20).fill(projects).flat()

  const tick = useCallback(() => {
    if (!drag.current) {
      progress.current += 0.0006
      if (progress.current > 1) progress.current = 0
      const pct = -50 + progress.current * 50
      if (trackRef.current) {
        trackRef.current.style.transform = `translateX(${pct}%)`
      }
    }
    raf.current = requestAnimationFrame(tick)
  }, [])

  useEffect(() => {
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [tick])

  useEffect(() => {
    function onMove(e) {
      if (!drag.current) return
      const dx = e.clientX - drag.current.startX
      progress.current = drag.current.startProgress + dx / (drag.current.trackW * 0.5)
      if (progress.current > 1) progress.current -= 1
      if (progress.current < 0) progress.current += 1
      const pct = -50 + progress.current * 50
      if (trackRef.current) {
        trackRef.current.style.transform = `translateX(${pct}%)`
      }
    }
    function onUp() {
      drag.current = null
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
  }, [])

  function onMouseDown(e) {
    const rect = trackRef.current?.getBoundingClientRect()
    drag.current = { startX: e.clientX, startProgress: progress.current, trackW: rect?.width || 1 }
  }

  return (
    <>
      <div className="film-wrap">
        <div className="film-strip">
          <div
            className="film-track"
            ref={trackRef}
            onMouseDown={onMouseDown}
          >
            {items.map((p, i) => (
              <div
                key={i}
                className={`film-frame ${hoveredIdx === i ? 'hovered' : ''}`}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                <div className="film-frame-inner" onClick={() => setSelected(p)}>
                  <AlbumCover title={p.title} index={i % projects.length} />
                  <div className="film-frame-overlay">
                    <span className="film-frame-title">{p.title}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selected && (
        <div className="album-desc-overlay" onClick={onClose}>
          <div className="album-desc-panel" onClick={e => e.stopPropagation()}>
            <button className="album-desc-close" onClick={onClose}>&times;</button>
            <h2 className="album-desc-title">{selected.title}</h2>
            <p className="album-desc-text">{selected.desc}</p>
            <div className="album-desc-tags">
              {selected.tech.map(t => (
                <span key={t} className="album-desc-tag">{t}</span>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export { projects }
