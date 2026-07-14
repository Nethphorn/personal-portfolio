import { useState, useRef } from 'react'
import FilmCarousel from './FilmCarousel'
import ProjectPanel from './ProjectPanel'
import BigAlbumOverlay from './BigAlbumOverlay'
import './ProjectsPanel.css'

export default function ProjectsPanel({ selected, onClose, onSelect }) {
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

  return (
    <>
      {selected && !closing && <div className="projects-overlay" onClick={handleClose} />}

      <ProjectPanel selected={selected} closing={closing} onClose={handleClose} />

      {(selected || closing) && (
        <BigAlbumOverlay selected={selected} closing={closing} closingAlbum={closingAlbumRef.current} onClose={handleClose} />
      )}

      <FilmCarousel selected={selected} onSelect={onSelect} />
    </>
  )
}
