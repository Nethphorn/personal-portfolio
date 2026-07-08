import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const COLORS = ['#16CFFB', '#7DE6FD', '#77FEFC']

const OPTIONS = [
  { name: 'About Me',   rotation: -25, offsetX: 40, offsetY: 55,  desc: 'About me',   path: '/about' },
  { name: 'Projects',   rotation: -15, offsetX: 90, offsetY: 30,  desc: 'Projects',   path: '/projects' },
  { name: 'Contact',    rotation: -8,  offsetX: 70, offsetY: 35,  desc: 'Contact',    path: '/contact' },
  { name: 'Resume',     rotation: -0.7,offsetX: 70, offsetY: 40,  desc: 'Resume',     path: '/resume' },
]

const SEL_PATH = 'M 24.853754,93.31573 135.14625,49.684266 114.14751,97.331142 Z'
const SEL_BG_PATH = 'M 12.7428765,95.50088 144.25712,47.499123 116.75625,95.465764 Z'

export default function MainMenu() {
  const [hovered, setHovered] = useState(0)
  const navigate = useNavigate()
  const soundRef = useRef(null)

  useEffect(() => {
    soundRef.current = new Audio('/sfx/navigation.wav')
    soundRef.current.volume = 0.3
  }, [])

  return (
    <div className="p3-menu-container">
      <div className="p3-menu-stack">
        {OPTIONS.map((opt, i) => (
          <P3Option
            key={opt.name}
            opt={opt}
            idx={i}
            isActive={hovered === i}
            onHover={() => {
              if (hovered !== i) {
                setHovered(i)
                if (soundRef.current) {
                  soundRef.current.currentTime = 0
                  soundRef.current.play().catch(() => {})
                }
              }
            }}
          />
        ))}
      </div>
    </div>
  )
}

function P3Option({ opt, idx, isActive, onHover }) {
  const navigate = useNavigate()
  const maskId = `sel-mask-${idx}`
  const nameLen = opt.name.replace(/\s/g, '').length
  const cursorScaleX = nameLen * 0.5 + 1.5
  const cursorTf = `translate(-60, -10) rotate(8, 0, 100) scale(${cursorScaleX}, 3)`
  const textColor = isActive ? '#000' : COLORS[(idx + 2) % 3]
  const zIdx = isActive ? 10 : OPTIONS.length - idx

  return (
    <div
      className="p3-option-wrap"
      style={{
        zIndex: zIdx,
        marginTop: idx === 0 ? 0 : -50,
      }}
    >
      <button className="p3-option-hitbox" onMouseEnter={onHover} onClick={() => navigate(opt.path)} title={opt.desc} />

      <svg
        width="950" height="200"
        className="p3-option-svg"
        transform-origin="25% center"
        style={{
          translate: `${opt.offsetX}px ${opt.offsetY}px`,
          rotate: `${opt.rotation}deg`,
        }}
      >
        <defs>
          <mask id={maskId} maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse"
            x="0" y="0" width="950" height="200">
            <rect width="100%" height="100%" fill="black" />
            <g transform={cursorTf} transform-origin="left center">
              <path fill="white" d={SEL_PATH} />
              <path transform-origin="52 100" fill="white" d={SEL_BG_PATH} />
            </g>
          </mask>
        </defs>

        {isActive && (
          <g transform={cursorTf} transform-origin="left center">
            <path className="p3-bg-beat" fill="#FD77D9" transform-origin="52 100" d={SEL_BG_PATH} />
            <path fill="#FFFFFF" d={SEL_PATH} />
          </g>
        )}

        <text
          x="150" y="120"
          fill={textColor}
          transform-origin="25% center"
          style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: '4.5rem',
            fontWeight: 800,
            fontStyle: 'italic',
            letterSpacing: '-0.14em',
            transition: 'transform 0.1s cubic-bezier(0.34, 1.56, 0.64, 1)',
            transform: isActive ? 'scale(1.5)' : 'scale(1)',
          }}
        >
          {opt.name}
        </text>

        {isActive && (
          <g mask={`url(#${maskId})`}>
            <text
              x="150" y="120"
              fill="#FF0000"
              transform-origin="25% center"
              style={{
                fontFamily: "'Inter', system-ui, sans-serif",
                fontSize: '4.5rem',
                fontWeight: 800,
                fontStyle: 'italic',
                letterSpacing: '-0.14em',
                transform: 'scale(1.5)',
              }}
            >
              {opt.name}
            </text>
          </g>
        )}
      </svg>
    </div>
  )
}
