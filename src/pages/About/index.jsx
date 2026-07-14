import { useContext, useEffect } from 'react'
import { NavContext } from '../../lib/navContext'
import CharacterAboutView from './CharacterAboutView'
import AboutPanel from './AboutPanel'

export default function About() {
  const startTransition = useContext(NavContext)

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') startTransition?.('/') }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [startTransition])

  return (
    <>
      <CharacterAboutView />
      <div className="about-back" onClick={() => startTransition?.('/')}>
        <span className="about-back-key">ESC</span>
        <span className="about-back-label">Back</span>
      </div>
      <AboutPanel />
    </>
  )
}
