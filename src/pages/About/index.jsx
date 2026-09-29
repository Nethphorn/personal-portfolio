import { useContext, useEffect, useState, useCallback } from 'react'
import { NavContext } from '../../lib/navContext'
import CharacterAboutView from './CharacterAboutView'
import AboutPanel from './AboutPanel'

import './GlassShard.css'
import './Para.css'
import './about.css'
import './Textbox.css'

const PAGES = ['About', 'Gallery']

const PAGE_CONTENT = [
  {
    title: 'About Me',
    text: "I'm a passionate full-stack developer with expertise in building modern web applications. I enjoy creating interactive experiences that blend functionality with creative design.",
  },
  { title: 'Gallery', text: 'A collection of moments and projects.' },
]

export default function About() {
  const startTransition = useContext(NavContext)
  const [page, setPage] = useState(0)

  const goNext = useCallback(() => setPage(p => (p + 1) % PAGES.length), [])
  const goPrev = useCallback(() => setPage(p => (p - 1 + PAGES.length) % PAGES.length), [])

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') startTransition?.('/')
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowLeft') goPrev()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [startTransition, goNext, goPrev])

  return (
    <>
      <CharacterAboutView />
      <div className="about-back" onClick={() => startTransition?.('/')}>
        <span className="about-back-key">ESC</span>
        <span className="about-back-label">Back</span>
      </div>
      <div className="glass-shard">
        <img src="/assets/my_photo_rnbg.png" className="glass-shard-img" style={{ transform: page === 0 ? 'translateX(0%)' : 'translateX(-120%)' }} />
        <img src="/assets/me_rnbg.png" className="glass-shard-img glass-shard-img-2" style={{ transform: page === 1 ? 'translateX(0%)' : 'translateX(150%)' }} />
      </div>
      <div className="glass-shard glass-shard-2" />
      <div className="about-para">
        <div className="about-para-bg" />
        <div className="about-para-fg" />
        <div className="text-box-slide">
          <div className="text-box-track" style={{ transform: `translateX(${page * -50}%)` }}>
            <div className="text-box">
              <h2>About Me</h2>
              <p>I'm a passionate full-stack developer with expertise in building modern web applications. I enjoy creating interactive experiences that blend functionality with creative design.</p>
            </div>
            <div className="text-box">
              <h2>Gallery</h2>
              <p>A collection of moments and projects.</p>
            </div>
          </div>
        </div>
        <div className="about-para-nav">
          <button className="about-arrow" onClick={goPrev}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          {PAGES.map((name, i) => (
            <button
              key={name}
              className={`about-dot${i === page ? ' active' : ''}`}
              onClick={() => setPage(i)}
            />
          ))}
          <button className="about-arrow" onClick={goNext}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>
      <AboutPanel />
    </>
  )
}
