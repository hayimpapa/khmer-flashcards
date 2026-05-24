import { Routes, Route, Link, useLocation } from 'react-router-dom'
import Home from './pages/Home.jsx'
import DeckPage from './pages/DeckPage.jsx'
import StudyPage from './pages/StudyPage.jsx'
import { hasSupabase } from './lib/supabase.js'

export default function App() {
  const location = useLocation()
  return (
    <div className="min-h-full flex flex-col">
      <header className="border-b border-ink-200 bg-white/80 backdrop-blur sticky top-0 z-30">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="h-9 w-9 rounded-lg bg-khmer-600 text-khmer-50 grid place-items-center font-khmer text-xl shadow-sm">
              ក
            </div>
            <div className="leading-tight">
              <div className="font-semibold text-ink-900">Khmer Flashcards</div>
              <div className="text-xs text-ink-800/60">Learn · Practice · Print</div>
            </div>
          </Link>
          <nav className="flex items-center gap-2 text-sm">
            <Link
              to="/"
              className={`btn-ghost ${location.pathname === '/' ? 'bg-ink-100' : ''}`}
            >
              Decks
            </Link>
            <a
              href="https://en.wikipedia.org/wiki/Khmer_alphabet"
              target="_blank"
              rel="noreferrer"
              className="btn-ghost hidden sm:inline-flex"
            >
              About Khmer
            </a>
          </nav>
        </div>
        {!hasSupabase && (
          <div className="bg-khmer-50 text-khmer-700 text-xs px-4 py-1.5 text-center border-t border-khmer-100">
            Running in offline mode — data is stored in your browser. Add Supabase
            credentials in <code className="font-mono">.env</code> to sync to a database.
          </div>
        )}
      </header>

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/deck/:id" element={<DeckPage />} />
          <Route path="/deck/:id/study" element={<StudyPage />} />
        </Routes>
      </main>

      <footer className="border-t border-ink-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-4 text-xs text-ink-800/60 flex flex-wrap items-center justify-between gap-2">
          <span>Built for teachers and learners of Khmer · សួស្តី!</span>
          <span>{hasSupabase ? 'Connected to Supabase' : 'Local mode'}</span>
        </div>
      </footer>
    </div>
  )
}
