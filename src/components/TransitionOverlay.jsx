import { useEffect, useState, useRef } from 'react'
import { fireTransition, onPageReady } from '../lib/transitionBus'
import './TransitionOverlay.css'

export default function TransitionOverlay({ targetName, onNavigate, onComplete }) {
  const [phase, setPhase] = useState(null)
  const readyRef = useRef(false)
  const startedAt = useRef(Date.now())

  useEffect(() => {
    fireTransition()
  }, [])

  useEffect(() => {
    const unsub = onPageReady(() => {
      readyRef.current = true
      const elapsed = Date.now() - startedAt.current
      const minHold = 2000
      const delay = Math.max(0, minHold - elapsed)
      setTimeout(() => {
        setPhase('panel-out')
      }, delay)
    })
    return unsub
  }, [])

  useEffect(() => {
    if (phase === 'curtain-in') {
      const t = setTimeout(() => setPhase('panel-in'), 480)
      return () => clearTimeout(t)
    }
    if (phase === 'panel-in') {
      const t = setTimeout(() => onNavigate?.(), 500)
      return () => clearTimeout(t)
    }
    if (phase === 'panel-out') {
      const t = setTimeout(() => setPhase('curtain-out'), 500)
      return () => clearTimeout(t)
    }
    if (phase === 'curtain-out') {
      const t = setTimeout(() => onComplete?.(), 600)
      return () => clearTimeout(t)
    }
  }, [phase, onNavigate, onComplete])

  const fallbackRef = useRef(null)
  useEffect(() => {
    if (phase === 'panel-in') {
      fallbackRef.current = setTimeout(() => {
        setPhase('panel-out')
      }, 8000)
    }
    return () => {
      if (fallbackRef.current) clearTimeout(fallbackRef.current)
    }
  }, [phase])

  useEffect(() => {
    const t = setTimeout(() => setPhase('curtain-in'), 30)
    return () => clearTimeout(t)
  }, [])

  const cover = phase === 'curtain-in' || phase === 'panel-in' || phase === 'panel-out'
  const exit = phase === 'curtain-out' ? 'exit' : ''
  const active = phase !== null

  return (
    <div className={`p3t${active ? ' active' : ''} ${cover ? 'cover' : ''} ${exit}${phase === 'panel-in' || phase === 'panel-out' ? ` ${phase}` : ''}`}>
      <div className="p3t-curtain" />
      <div className="p3t-panel-wrap">
        <span className="p3t-label">{targetName}</span>
      </div>
    </div>
  )
}
