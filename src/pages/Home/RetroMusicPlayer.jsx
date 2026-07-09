import { useRef, useState, useEffect, useCallback } from 'react'
import './RetroMusicPlayer.css'

const SONG_NAME = "Full Moon Full Life"

export default function RetroMusicPlayer() {
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [loop, setLoop] = useState(false)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const onTime = () => setCurrentTime(audio.currentTime)
    const onLoaded = () => setDuration(audio.duration)
    const onEnd = () => setPlaying(false)

    audio.addEventListener('timeupdate', onTime)
    audio.addEventListener('loadedmetadata', onLoaded)
    audio.addEventListener('ended', onEnd)
    return () => {
      audio.removeEventListener('timeupdate', onTime)
      audio.removeEventListener('loadedmetadata', onLoaded)
      audio.removeEventListener('ended', onEnd)
    }
  }, [])

  const togglePlay = useCallback(() => {
    const a = audioRef.current
    if (!a) return
    if (playing) { a.pause(); setPlaying(false) }
    else { a.play().then(() => setPlaying(true)).catch(() => {}) }
  }, [playing])

  const seek = useCallback((e) => {
    const a = audioRef.current
    if (!a || !duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    const frac = (e.clientX - rect.left) / rect.width
    a.currentTime = frac * duration
  }, [duration])

  const changeVol = useCallback((e) => {
    const v = parseFloat(e.target.value)
    setVolume(v)
    if (audioRef.current) audioRef.current.volume = v
  }, [])

  const fmt = (s) => {
    if (!s || !isFinite(s)) return '0:00'
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  const progress = duration ? (currentTime / duration) * 100 : 0

  return (
    <div className="music-player">
      <audio ref={audioRef} src="/assets/audio/Full Moon Full Life.mp3" loop={loop} preload="metadata" />

      <div className="music-now-playing">Now Playing: {SONG_NAME}</div>

      <div className="music-progress" onClick={seek}>
        <div className="music-progress-fill" style={{ width: `${progress}%` }} />
        <div className="music-progress-thumb" style={{ left: `${progress}%` }} />
      </div>

      <div className="music-time">
        <span>{fmt(currentTime)}</span>
        <span>{fmt(duration)}</span>
      </div>

      <div className="music-controls">
        <button className="music-btn" onClick={() => { audioRef.current.currentTime = 0 }} title="Back">⏮</button>
        <button className="music-btn play-btn" onClick={togglePlay} title={playing ? 'Pause' : 'Play'}>
          {playing ? '⏸' : '▶'}
        </button>
        <button className="music-btn" onClick={() => { if (audioRef.current) audioRef.current.currentTime = 0 }} title="Next">⏭</button>
        <button className={`music-btn ${loop ? 'active' : ''}`} onClick={() => setLoop(l => { if (audioRef.current) audioRef.current.loop = !l; return !l })} title="Loop">
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
