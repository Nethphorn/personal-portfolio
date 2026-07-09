export default function ContactPanel() {
  return (
    <div className="p3-panel">
      <h2 className="p3-panel-title">Contact</h2>
      <p className="p3-panel-text">
        Feel free to reach out! I'm always open to discussing new projects, creative ideas, or opportunities.
      </p>
      <div className="p3-contact-links">
        <a href="https://github.com/Nethphorn" target="_blank" rel="noreferrer" className="p3-contact-link">
          <span className="p3-contact-icon">GH</span>
          <span>GitHub</span>
        </a>
        <a href="https://www.linkedin.com/in/nethphorn-tepbrathna-975348318/" target="_blank" rel="noreferrer" className="p3-contact-link">
          <span className="p3-contact-icon">LI</span>
          <span>LinkedIn</span>
        </a>
        <a href="mailto:nethphorn.tb@gmail.com" className="p3-contact-link">
          <span className="p3-contact-icon">@</span>
          <span>Email</span>
        </a>
      </div>
    </div>
  )
}
