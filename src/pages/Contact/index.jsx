import { useContext, useEffect } from 'react'
import { NavContext } from '../../lib/navContext'
import CharacterContactView from './CharacterContactView'
import ContactPanel from './ContactPanel'

export default function Contact() {
  const startTransition = useContext(NavContext)

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') startTransition?.('/') }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [startTransition])

  return (
    <>
      <CharacterContactView />
      <div className="about-back" onClick={() => startTransition?.('/')}>
        <span className="about-back-key">ESC</span>
        <span className="about-back-label">Back</span>
      </div>
      <ContactPanel />
    </>
  )
}
