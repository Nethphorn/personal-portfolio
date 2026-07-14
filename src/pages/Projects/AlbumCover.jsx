import { palette } from './data'

export function AlbumCover({ title, index }) {
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

export function BigAlbumCover({ c1, c2 }) {
  return (
    <svg viewBox="0 0 300 300" className="big-album-svg">
      <defs>
        <linearGradient id="big-ag" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={c1} />
          <stop offset="100%" stopColor={c2} />
        </linearGradient>
      </defs>
      <rect width="300" height="300" fill="url(#big-ag)" rx="20" />
      <circle cx="150" cy="150" r="100" fill="rgba(0,0,0,0.15)" />
      <circle cx="150" cy="150" r="40" fill="rgba(255,255,255,0.08)" />
      <circle cx="150" cy="150" r="12" fill="rgba(255,255,255,0.15)" />
    </svg>
  )
}
