import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

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

export default function App() {
  return (
    <BrowserRouter>
      <div className="p3-root">
        <Suspense fallback={null}>
          <Routes>
            {ROUTES.map(r => (
              <Route key={r.path} path={r.path} element={r.element} />
            ))}
          </Routes>
        </Suspense>
      </div>
    </BrowserRouter>
  )
}
