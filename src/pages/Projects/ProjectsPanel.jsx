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

const wmoCodes = {
  0: ['☀️', 'Clear'], 1: ['🌤️', 'Mainly Clear'], 2: ['⛅', 'Partly Cloudy'], 3: ['☁️', 'Overcast'],
  45: ['🌫️', 'Foggy'], 48: ['🌫️', 'Foggy'],
  51: ['🌦️', 'Drizzle'], 53: ['🌦️', 'Drizzle'], 55: ['🌦️', 'Drizzle'],
  61: ['🌧️', 'Rain'], 63: ['🌧️', 'Rain'], 65: ['🌧️', 'Rain'],
  71: ['❄️', 'Snow'], 73: ['❄️', 'Snow'], 75: ['❄️', 'Snow'],
  80: ['🌦️', 'Rain Showers'], 81: ['🌦️', 'Rain Showers'], 82: ['🌦️', 'Rain Showers'],
  95: ['⛈️', 'Thunderstorm'], 96: ['⛈️', 'Thunderstorm'], 99: ['⛈️', 'Thunderstorm'],
}

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

export default function ProjectsPanel({ selected, onClose, onSelect }) {
  const [hoveredIdx, setHoveredIdx] = useState(null)
  const [closing, setClosing] = useState(false)
  const [now, setNow] = useState(new Date())
  const [weather, setWeather] = useState(null)
  const trackRef = useRef(null)
  const progress = useRef(0)
  const raf = useRef(null)
  const drag = useRef(null)
  const dragMoved = useRef(false)
  const hoverPaused = useRef(false)
  const items = Array(20).fill(projects).flat()
  const selectedIdx = selected ? projects.findIndex(p => p.title === selected.title) : 0
  const [palC1, palC2] = selected ? palette[selectedIdx % palette.length] : ['#000', '#000']

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

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    let ok = true
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          if (!ok) return
          const { latitude, longitude } = pos.coords
          fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`)
            .then(r => r.json())
            .then(data => { if (ok && data.current_weather) setWeather(data.current_weather) })
            .catch(() => {})
        },
        () => {}
      )
    }
    return () => { ok = false }
  }, [])

  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
  const dateStr = new Intl.DateTimeFormat('en-CA', {
    timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(now).replace(/-/g, '/')
  const timeStr = new Intl.DateTimeFormat('en-GB', {
    timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: false,
  }).format(now)
  const temp = weather ? `${Math.round(weather.temperature)}°C` : null
  const [emoji, label] = weather ? (wmoCodes[weather.weathercode] || ['', '']) : ['', '']

  function handleClose() {
    if (closing) return
    hoverPaused.current = false
    setClosing(true)
    setTimeout(() => {
      setClosing(false)
      onClose()
    }, 400)
  }

  function onMouseDown(e) {
    dragMoved.current = false
    const rect = trackRef.current?.getBoundingClientRect()
    drag.current = { startX: e.clientX, startProgress: progress.current, trackW: rect?.width || 1 }
  }

  return (
    <>
      {selected && !closing && <div className="projects-overlay" onClick={handleClose} />}

      <div className="para-deco">
        <div className="para-bg" />
        <div className="para-fg">
          <div className="para-content">
            <div className="para-header">
              <span className="para-time">{timeStr}</span>
              <span className="para-date">{dateStr}</span>
              {temp && <span className="para-weather">{temp} {emoji}</span>}
            </div>
            {selected && !closing && (
              <>
                <h2 className="para-title">{selected.title}</h2>
                <p className="para-desc">{selected.desc}</p>
                <div className="para-tags">
                  {selected.tech.map(t => <span key={t} className="para-tag">{t}</span>)}
                </div>
              </>
            )}
            {selected && <button className="para-close" onClick={handleClose}>&times;</button>}
          </div>
        </div>
      </div>

      {(selected || closing) && (
        <div className={`big-album-wrap ${closing ? 'closing' : ''}`} onClick={handleClose}>
          <button className="back-btn" onClick={handleClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="big-album-inner" onClick={e => e.stopPropagation()}>
            <div className="vinyl-record" />
            <div className="big-album-cover">
              <svg viewBox="0 0 300 300" className="big-album-svg">
                <defs>
                  <linearGradient id={`big-ag`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={palC1} />
                    <stop offset="100%" stopColor={palC2} />
                  </linearGradient>
                </defs>
                <rect width="300" height="300" fill="url(#big-ag)" rx="20" />
                <circle cx="150" cy="150" r="100" fill="rgba(0,0,0,0.15)" />
                <circle cx="150" cy="150" r="40" fill="rgba(255,255,255,0.08)" />
                <circle cx="150" cy="150" r="12" fill="rgba(255,255,255,0.15)" />
              </svg>
            </div>
          </div>
        </div>
      )}

      <div className={`film-wrap ${selected && !closing ? 'dimmed' : ''}`}>
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

    </>
  )
}

export { projects }
