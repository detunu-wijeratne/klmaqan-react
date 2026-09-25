import { Routes, Route, Link, Navigate } from 'react-router-dom'
import ProjectsPage from './pages/ProjectsPage'
import ProjectDetailPage from './pages/ProjectDetailPage'

function MinimalHeader() {
  return (
    <header className="border-b border-neutral-100 bg-white px-6 py-4 md:px-10">
      <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between">
        <Link to="/" className="font-alata text-lg tracking-wide text-neutral-900">
          KLMAQAN
        </Link>
        <nav className="flex items-center gap-6 text-sm text-neutral-600">
          <Link to="/projects" className="hover:text-neutral-900">
            Projects
          </Link>
        </nav>
      </div>
    </header>
  )
}

export default function App() {
  return (
    <div className="min-h-screen bg-white">
      <MinimalHeader />
      <Routes>
        <Route path="/" element={<Navigate to="/projects" replace />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/project/:slug" element={<ProjectDetailPage />} />
        <Route path="*" element={<div className="px-6 py-24 text-center text-neutral-500">Page not found.</div>} />
      </Routes>
    </div>
  )
}
