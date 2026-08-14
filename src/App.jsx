import { lazy, Suspense, useState, useCallback } from 'react'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import { NavContext } from './lib/navContext'
import { MusicProvider } from './lib/musicContext.jsx'
import TransitionOverlay from './components/TransitionOverlay'
import SplashScreen from './components/SplashScreen'

const ROUTE_NAMES = {
  '/': 'Home',
  '/about': 'About',
  '/projects': 'Projects',
  '/contact': 'Contact',
  '/resume': 'Resume',
}

const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))
const Projects = lazy(() => import('./pages/Projects'))
const Contact = lazy(() => import('./pages/Contact'))
const Resume = lazy(() => import('./pages/Resume'))

const ROUTES = [
  { path: '/', element: <Home /> },
  { path: '/about', element: <About /> },
  { path: '/projects', element: <Projects /> },
  { path: '/contact', element: <Contact /> },
  { path: '/resume', element: <Resume /> },
]

function AppContent() {
  const navigate = useNavigate()
  const [transition, setTransition] = useState(null)

  const startTransition = useCallback((path) => {
    const name = ROUTE_NAMES[path] || 'Page'
    setTransition({ path, name })
  }, [])

  const handleNavigate = useCallback(() => {
    setTransition((t) => {
      if (t) setTimeout(() => navigate(t.path), 0)
      return t
    })
  }, [navigate])

  const endTransition = useCallback(() => {
    setTransition(null)
  }, [])

  return (
    <NavContext.Provider value={startTransition}>
      <div className="p3-root">
        {transition && (
          <TransitionOverlay
            targetName={transition.name}
            onNavigate={handleNavigate}
            onComplete={endTransition}
          />
        )}
        <Suspense fallback={null}>
          <Routes>
            {ROUTES.map(r => (
              <Route key={r.path} path={r.path} element={r.element} />
            ))}
          </Routes>
        </Suspense>
      </div>
    </NavContext.Provider>
  )
}

export default function App() {
  const [splashDone, setSplashDone] = useState(false)

  return (
    <BrowserRouter>
      {!splashDone && <SplashScreen onDone={() => setSplashDone(true)} />}
      <MusicProvider>
        <AppContent />
      </MusicProvider>
    </BrowserRouter>
  )
}
