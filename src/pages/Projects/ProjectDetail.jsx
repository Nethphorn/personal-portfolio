import { useWeather } from './useWeather'
import RectTriangle from './RectTriangle'
import './ProjectDetail.css'

export default function ProjectDetail({ selected, closing, onClose }) {
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
                {(selected.live || selected.github) && (
                  <div className="para-links">
                    {selected.live && (
                      <a className="para-link" href={selected.live} target="_blank" rel="noopener noreferrer">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                          <path d="M15 3h6v6" />
                          <path d="M10 14 21 3" />
                        </svg>
                        Live Demo
                      </a>
                    )}
                    {selected.github && (
                      <a className="para-link" href={selected.github} target="_blank" rel="noopener noreferrer">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58 0-.29-.01-1.05-.02-2.06-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.65.24 2.87.12 3.17.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.62-5.49 5.92.43.37.81 1.1.81 2.22 0 1.6-.01 2.89-.01 3.29 0 .32.22.7.83.58A12 12 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                        </svg>
                        GitHub
                      </a>
                    )}
                  </div>
                )}
              </>
            )}
            {selected && <button className="para-close" onClick={handleClose}>&times;</button>}
          </div>
        </div>
      </div>
    </>
  )
}
