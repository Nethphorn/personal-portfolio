import { useEffect, useState } from 'react'
import { onPageReady } from '../lib/transitionBus'
import './SplashScreen.css'

export default function SplashScreen({ onDone }) {
  const [phase, setPhase] = useState('enter')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const unsub = onPageReady(() => setReady(true))
    return unsub
  }, [])

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('first'), 400)
    const t2 = setTimeout(() => setPhase('second'), 1600)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  useEffect(() => {
    if (phase !== 'second') return
    if (ready) {
      const t = setTimeout(() => setPhase('exit'), 1500)
      return () => clearTimeout(t)
    }
    const fallback = setTimeout(() => setPhase('exit'), 12000)
    return () => clearTimeout(fallback)
  }, [phase, ready])

  useEffect(() => {
    if (phase !== 'exit') return
    const t = setTimeout(() => onDone?.(), 1200)
    return () => clearTimeout(t)
  }, [phase, onDone])

  return (
    <div className={`splash ${phase === 'exit' ? 'splash-exit' : ''}`}>
      <div className="splash-inner">
        <div className="splash-line">
          <span className={`splash-text splash-name ${phase === 'first' || phase === 'second' || phase === 'exit' ? 'splash-visible' : ''}`}>
            Nethphorn Tepbrathna
          </span>
        </div>
        <div className="splash-line">
          <span className={`splash-text splash-sub ${phase === 'second' || phase === 'exit' ? 'splash-visible' : ''}`}>
            Portfolio
          </span>
        </div>
      </div>
    </div>
  )
}
