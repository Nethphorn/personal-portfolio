export default function ResumePanel() {
  return (
    <div className="p3-panel">
      <h2 className="p3-panel-title">Resume</h2>
      <p className="p3-panel-text">
        Download my resume to learn more about my experience and qualifications.
      </p>
      <div className="p3-resume-links">
        <a href="img/resume/CV_Nethphorn_Tepbrathna_EN.pdf" target="_blank" className="p3-resume-btn">
          English
        </a>
        <a href="img/resume/CV_Nethphorn_Tepbrathna_JP.pdf" target="_blank" className="p3-resume-btn">
          日本語
        </a>
        <a href="img/resume/CV_Nethphorn_Tepbrathna_TH.pdf" target="_blank" className="p3-resume-btn">
          ภาษาไทย
        </a>
      </div>
    </div>
  )
}
