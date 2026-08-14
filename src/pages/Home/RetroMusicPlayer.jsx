import { useMusic } from '../../lib/musicContext.jsx'
import './RetroMusicPlayer.css'

export default function RetroMusicPlayer() {
  const { currentTrack, playing, currentTime, duration, volume, loop, togglePlay, prevTrack, nextTrack, seek, changeVol, setLoopOn } = useMusic()

  const fmt = (s) => {
    if (!s || !isFinite(s)) return '0:00'
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  const progress = duration ? (currentTime / duration) * 100 : 0

  return (
    <div className="music-player">
      <div className="music-now-playing">Now Playing: {currentTrack.name}</div>

      <div className="music-progress" onClick={seek}>
        <div className="music-progress-fill" style={{ width: `${progress}%` }} />
        <div className="music-progress-thumb" style={{ left: `${progress}%` }} />
      </div>

      <div className="music-time">
        <span>{fmt(currentTime)}</span>
        <span>{fmt(duration)}</span>
      </div>

      <div className="music-controls">
        <button className="music-btn" onClick={prevTrack} title="Back">⏮</button>
        <button className="music-btn play-btn" onClick={togglePlay} title={playing ? 'Pause' : 'Play'}>
          {playing ? '⏸' : '▶'}
        </button>
        <button className="music-btn" onClick={nextTrack} title="Next">⏭</button>
        <button className={`music-btn ${loop ? 'active' : ''}`} onClick={() => setLoopOn(!loop)} title="Loop">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 4 23 10 17 10" />
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
          </svg>
        </button>
      </div>

      <div className="music-volume-wrapper">
        <div className="music-volume-hover">
          <div className="music-volume-popup">
            <div className="vol-slider-track">
              <input type="range" min="0" max="1" step="0.01" value={volume} onChange={changeVol} className="vol-slider-vertical" />
            </div>
          </div>
          <span className="vol-icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              {volume > 0 && <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />}
            </svg>
          </span>
        </div>
      </div>
    </div>
  )
}