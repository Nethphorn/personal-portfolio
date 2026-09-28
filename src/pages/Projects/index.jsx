import { useState, useContext } from 'react'
import { NavContext } from '../../lib/navContext'
import CharacterProjectView from './CharacterProjectView'
import ProjectsPanel from './ProjectsPanel'

export default function Projects() {
  const startTransition = useContext(NavContext)
  const [selected, setSelected] = useState(null)

  return (
    <>
      <CharacterProjectView onProjectClick={setSelected} />
      <div className="about-back" onClick={() => startTransition?.('/')}>
        <span className="about-back-key">ESC</span>
        <span className="about-back-label">Back</span>
      </div>
      <ProjectsPanel
        selected={selected}
        onClose={() => setSelected(null)}
        onSelect={setSelected}
        onHome={() => startTransition?.('/')}
      />
    </>
  )
}
