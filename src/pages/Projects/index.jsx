import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CharacterProjectView from './CharacterProjectView'
import ProjectsPanel from './ProjectsPanel'

export default function Projects() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState(null)

  return (
    <>
      <CharacterProjectView onProjectClick={setSelected} />
      <div className="about-back" onClick={() => navigate('/')}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        <span>Back</span>
      </div>
      <ProjectsPanel selected={selected} onClose={() => setSelected(null)} />
    </>
  )
}
