import { useWeather } from './useWeather'
import RectTriangle from './RectTriangle'
import './ProjectPanel.css'

export default function ProjectPanel({ selected, closing, onClose }) {
  const { timeStr, dateStr, temp, emoji } = useWeather()

  function handleClose() {
    if (closing) return
    onClose()
  }

  return (
    <>
      <RectTriangle flipY={-1}>
        {temp && <span className="rt-weather">{emoji} {temp}</span>}
        <span className="rt-date">{dateStr}</span>
        <span className="rt-time">{timeStr}</span>
      </RectTriangle>

      <div className="para-deco">
        <div className="para-bg" />
        <div className="para-fg">
          <div className="para-content">
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
    </>
  )
}
