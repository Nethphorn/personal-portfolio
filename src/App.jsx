import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Projects from './pages/Projects'
import Contact from './pages/Contact'
import Resume from './pages/Resume'

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
        <Routes>
          {ROUTES.map(r => (
            <Route key={r.path} path={r.path} element={r.element} />
          ))}
        </Routes>
      </div>
    </BrowserRouter>
  )
}
