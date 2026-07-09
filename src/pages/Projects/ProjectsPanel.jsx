const projects = [
  {
    title: 'Portfolio OS',
    desc: 'A fully interactive desktop environment in the browser with window management, file system, and 3D avatar.',
    tech: ['React', 'Three.js', 'CSS'],
  },
  {
    title: 'Game App',
    desc: 'A browser-based game built with modern web technologies and smooth animations.',
    tech: ['JavaScript', 'Canvas', 'WebGL'],
  },
  {
    title: 'E-Commerce Platform',
    desc: 'Full-featured online store with user authentication, product management, and payment integration.',
    tech: ['Node.js', 'MongoDB', 'React'],
  },
]

export default function ProjectsPanel() {
  return (
    <div className="p3-panel">
      <h2 className="p3-panel-title">Projects</h2>
      <div className="p3-project-list">
        {projects.map((p, i) => (
          <div key={i} className="p3-project-item">
            <h3 className="p3-project-name">{p.title}</h3>
            <p className="p3-project-desc">{p.desc}</p>
            <div className="p3-tags">
              {p.tech.map((t) => (
                <span key={t} className="p3-tag">{t}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
