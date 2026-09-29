import { useState, useRef, useEffect } from 'react'
import FilmCarousel from './FilmCarousel'
import ProjectDetail from './ProjectDetail'
import BigAlbumOverlay from './BigAlbumOverlay'
import './ProjectsPanel.css'

export default function ProjectsPanel({ selected, onClose, onSelect, onHome }) {
  const [closing, setClosing] = useState(false)
  const closingAlbumRef = useRef(null)

  function handleClose() {
    if (closing) return
    closingAlbumRef.current = selected
    setClosing(true)
    onClose()
    setTimeout(() => {
      setClosing(false)
      closingAlbumRef.current = null
    }, 400)
  }

  useEffect(() => {
    const handler = (e) => {
      if (e.key !== 'Escape') return
      if (selected) { handleClose(); return }
      if (closing) return
      onHome?.()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [selected, closing, onHome])

  return (
    <>
      {selected && !closing && <div className="projects-overlay" onClick={handleClose} />}

      <ProjectDetail selected={selected} closing={closing} onClose={handleClose} />

      {(selected || closing) && (
        <BigAlbumOverlay selected={selected} closing={closing} closingAlbum={closingAlbumRef.current} onClose={handleClose} />
      )}

      <FilmCarousel selected={selected} onSelect={onSelect} />
    </>
  )
}
