import { useContext, useEffect } from 'react'
import { NavContext } from '../../lib/navContext'
import ResumePanel from './ResumePanel'
import CharacterResumeView from './CharacterResumeView'
import './ResumePara.css'

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
      <ResumePanel />
      <div className="resume-stack">
        <div className="flip">
          <div className="resume-para">
            <div className="resume-para-bg" />
            <div className="resume-para-fg" />
          </div>
        </div>
        <div className="flip"><div className="resume-sub" /></div>
        <div className="flip"><div className="resume-sub" /></div>
        <div className="flip"><div className="resume-sub" /></div>
        <div className="flip"><div className="resume-sub" /></div>
        <div className="flip"><div className="resume-sub" /></div>
      </div>
    </>
  )
}
