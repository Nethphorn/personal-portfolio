import { createContext, useContext, useRef, useState, useEffect, useCallback } from 'react'
import { PLAYLISTS, getTimeSlot } from './music'

const MusicContext = createContext(null)

export function MusicProvider({ children }) {
  const audioRef = useRef(null)
  const [slot, setSlot] = useState(() => getTimeSlot())
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [loop, setLoop] = useState(false)

  const playingRef = useRef(false)
  const resumeRef = useRef(false)
  const slotRef = useRef(slot)
  slotRef.current = slot

  const currentTrack = PLAYLISTS[slot][index]

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const onTime = () => setCurrentTime(audio.currentTime)
    const onLoaded = () => setDuration(audio.duration)
    const onEnd = () => {
      resumeRef.current = true
      const nextSlot = getTimeSlot()
      if (nextSlot !== slotRef.current) {
        setSlot(nextSlot)
        setIndex(0)
      } else {
        setIndex((i) => (i + 1) % PLAYLISTS[slotRef.current].length)
      }
    }

    audio.addEventListener('timeupdate', onTime)
    audio.addEventListener('loadedmetadata', onLoaded)
    audio.addEventListener('ended', onEnd)
    return () => {
      audio.removeEventListener('timeupdate', onTime)
      audio.removeEventListener('loadedmetadata', onLoaded)
      audio.removeEventListener('ended', onEnd)
    }
  }, [])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    setCurrentTime(0)
    setDuration(0)
    audio.load()
    if (resumeRef.current || playingRef.current) {
      resumeRef.current = false
      audio.play().then(() => setPlaying(true)).catch(() => {})
    }
  }, [slot, index])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const onGesture = () => {
      audio.play().then(() => {
        playingRef.current = true
        setPlaying(true)
        cleanup()
      }).catch(() => {})
    }
    const cleanup = () => {
      document.removeEventListener('pointerdown', onGesture)
      document.removeEventListener('keydown', onGesture)
      document.removeEventListener('touchstart', onGesture)
      document.removeEventListener('scroll', onGesture, true)
    }

    audio.play().then(() => {
      playingRef.current = true
      setPlaying(true)
    }).catch(() => {
      document.addEventListener('pointerdown', onGesture)
      document.addEventListener('keydown', onGesture)
      document.addEventListener('touchstart', onGesture)
      document.addEventListener('scroll', onGesture, true)
    })
    return cleanup
  }, [])

  const togglePlay = useCallback(() => {
    const a = audioRef.current
    if (!a) return
    if (playingRef.current) { a.pause(); playingRef.current = false; setPlaying(false) }
    else { a.play().then(() => { playingRef.current = true; setPlaying(true) }).catch(() => {}) }
  }, [])

  const prevTrack = useCallback(() => {
    const len = PLAYLISTS[slotRef.current].length
    setIndex((i) => (i - 1 + len) % len)
  }, [])

  const nextTrack = useCallback(() => {
    const len = PLAYLISTS[slotRef.current].length
    setIndex((i) => (i + 1) % len)
  }, [])

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

  const setLoopOn = useCallback((l) => {
    if (audioRef.current) audioRef.current.loop = l
    setLoop(l)
  }, [])

  return (
    <MusicContext.Provider value={{ currentTrack, playing, currentTime, duration, volume, loop, togglePlay, prevTrack, nextTrack, seek, changeVol, setLoopOn }}>
      <audio ref={audioRef} src={currentTrack.src} loop={loop} preload="metadata" />
      {children}
    </MusicContext.Provider>
  )
}

export function useMusic() {
  const ctx = useContext(MusicContext)
  if (!ctx) throw new Error('useMusic must be used within a MusicProvider')
  return ctx
}