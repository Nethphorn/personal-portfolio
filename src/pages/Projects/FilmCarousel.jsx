import { useState, useRef, useEffect, useCallback } from 'react'
import { AlbumCover } from './AlbumCover'
import { projects } from './data'
import './FilmCarousel.css'

const REPEAT = 20
const items = Array(REPEAT).fill(projects).flat()

export default function FilmCarousel({ selected, onSelect }) {
  const [hoveredIdx, setHoveredIdx] = useState(null)
  const trackRef = useRef(null)
  const progress = useRef(0)
  const raf = useRef(null)
  const drag = useRef(null)
  const dragMoved = useRef(false)
  const hoverPaused = useRef(false)
  const dimmed = selected != null

  const tick = useCallback(() => {
    if (!drag.current && !hoverPaused.current) {
      progress.current += 0.0003
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
      dragMoved.current = true
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
    dragMoved.current = false
    const rect = trackRef.current?.getBoundingClientRect()
    drag.current = { startX: e.clientX, startProgress: progress.current, trackW: rect?.width || 1 }
  }

  return (
    <div className={`film-wrap ${dimmed ? 'dimmed' : ''}`}>
      <div className="film-strip"
        onMouseEnter={() => { hoverPaused.current = true }}
        onMouseLeave={() => { hoverPaused.current = false }}
      >
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
              <div className="film-frame-inner" onClick={() => { if (dragMoved.current) return; onSelect(p) }}>
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
  )
}
