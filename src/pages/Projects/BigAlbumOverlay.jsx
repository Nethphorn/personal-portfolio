import { BigAlbumCover } from './AlbumCover'
import './BigAlbumOverlay.css'

export default function BigAlbumOverlay({ selected, closing, closingAlbum, onClose }) {
  const album = selected || closingAlbum
  const [palC1, palC2] = album?.colors || ['#000', '#000']

  function handleClose() {
    if (closing) return
    onClose()
  }

  return (
    <div className={`big-album-wrap ${closing ? 'closing' : ''}`} onClick={handleClose}>
      <button className="back-btn" onClick={e => { e.stopPropagation(); handleClose() }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
      </button>
      <div className="big-album-inner" onClick={e => e.stopPropagation()}>
        <div className="vinyl-record" />
        <div className="big-album-cover">
          <BigAlbumCover c1={palC1} c2={palC2} />
        </div>
      </div>
    </div>
  )
}
