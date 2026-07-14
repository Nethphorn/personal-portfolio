import { useState, useContext, useEffect } from 'react'
import { NavContext } from '../../lib/navContext'
import CharacterProjectView from './CharacterProjectView'
import ProjectsPanel from './ProjectsPanel'

export default function Projects() {
  const startTransition = useContext(NavContext)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') startTransition?.('/') }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [startTransition])

  return (
    <>
      <CharacterProjectView onProjectClick={setSelected} />
      <div className="about-back" onClick={() => startTransition?.('/')}>
        <span className="about-back-key">ESC</span>
        <span className="about-back-label">Back</span>
      </div>
      <ProjectsPanel selected={selected} onClose={() => setSelected(null)} onSelect={setSelected} />
    </>
  )
}
