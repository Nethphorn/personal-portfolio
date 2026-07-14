import { useContext } from 'react'
import { NavContext } from '../../lib/navContext'
import CharacterContactView from './CharacterContactView'
import ContactPanel from './ContactPanel'

export default function Contact() {
  const startTransition = useContext(NavContext)

  return (
    <>
      <CharacterContactView />
      <div className="about-back" onClick={() => startTransition?.('/')}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        <span>Back</span>
      </div>
      <ContactPanel />
    </>
  )
}
