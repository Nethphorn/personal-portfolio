import { useContext, useEffect } from 'react'
import { NavContext } from '../../lib/navContext'
import CharacterResumeView from './CharacterResumeView'
import './ResumePara.css'

const RESUMES = [
  { lang: 'English', file: '/img/resume/Nethphorn Tepbrathna.cv.pdf' },
  { lang: '日本語', file: '/img/resume/履歴書.pdf' },
]

export default function Resume() {
  const startTransition = useContext(NavContext)

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') startTransition?.('/') }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [startTransition])

  return (
    <>
      <CharacterResumeView />
      <div className="about-back" onClick={() => startTransition?.('/')}>
        <span className="about-back-key">ESC</span>
        <span className="about-back-label">Back</span>
      </div>
      <div className="resume-stack">
        <div className="flip">
          <div className="resume-para">
            <div className="resume-para-bg" />
            <div className="resume-para-fg" />
            <div className="resume-para-content">
              <span className="resume-para-title">Resume</span>
            </div>
          </div>
        </div>
        {RESUMES.map((r) => (
          <div className="flip" key={r.lang}>
            <div className="resume-sub">
              <div className="resume-sub-content">
                <span className="resume-sub-label">{r.lang}</span>
                <div className="resume-sub-actions">
                  <a className="resume-action" href={r.file} target="_blank" rel="noopener noreferrer">View</a>
                  <a className="resume-action" href={r.file} download>Download</a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
