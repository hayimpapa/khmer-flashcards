import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getDeck, listCards, getProgress, setLearned, resetProgress } from '../lib/storage.js'
import Flashcard from '../components/Flashcard.jsx'

export default function StudyPage() {
  const { id } = useParams()
  const [deck, setDeck] = useState(null)
  const [cards, setCards] = useState([])
  const [order, setOrder] = useState([])
  const [pos, setPos] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [progress, setProgressState] = useState({})
  const [shuffleOn, setShuffleOn] = useState(false)

  useEffect(() => {
    let alive = true
    Promise.all([getDeck(id), listCards(id)]).then(([d, cs]) => {
      if (!alive) return
      setDeck(d)
      setCards(cs)
      setOrder(cs.map((_, i) => i))
      setPos(0)
      setFlipped(false)
      setProgressState(getProgress())
    })
    return () => {
      alive = false
    }
  }, [id])

  const current = useMemo(() => cards[order[pos]], [cards, order, pos])

  function go(delta) {
    setFlipped(false)
    setPos((p) => Math.min(Math.max(p + delta, 0), Math.max(order.length - 1, 0)))
  }

  function shuffle() {
    const a = [...order]
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[a[i], a[j]] = [a[j], a[i]]
    }
    setOrder(a)
    setPos(0)
    setFlipped(false)
    setShuffleOn(true)
  }

  function unshuffle() {
    setOrder(cards.map((_, i) => i))
    setPos(0)
    setFlipped(false)
    setShuffleOn(false)
  }

  function markLearned(learned) {
    if (!current) return
    setLearned(current.id, learned)
    setProgressState(getProgress())
    setTimeout(() => go(1), 150)
  }

  // Keyboard shortcuts
  useEffect(() => {
    function onKey(e) {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault()
        setFlipped((f) => !f)
      } else if (e.key === 'ArrowRight') go(1)
      else if (e.key === 'ArrowLeft') go(-1)
      else if (e.key === 'k' || e.key === 'K') markLearned(true)
      else if (e.key === 'r' || e.key === 'R') markLearned(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  if (!deck) {
    return <div className="mx-auto max-w-3xl px-4 py-8 text-ink-800/60">Loading…</div>
  }
  if (cards.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <Link to={`/deck/${id}`} className="text-sm text-khmer-700 hover:underline">
          ← Back to deck
        </Link>
        <div className="panel mt-4 p-10 text-center">
          <p>This deck has no cards yet.</p>
        </div>
      </div>
    )
  }

  const learnedCount = cards.filter((c) => progress[c.id]).length
  const pct = Math.round((learnedCount / cards.length) * 100)

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="flex items-center justify-between text-sm">
        <Link to={`/deck/${id}`} className="text-ink-800/70 hover:text-khmer-700">
          ← Back to deck
        </Link>
        <div className="text-ink-800/60">
          {deck.name} · {pos + 1} of {order.length}
        </div>
      </div>

      <div className="mt-3 h-1.5 rounded-full bg-ink-100 overflow-hidden">
        <div
          className="h-full bg-khmer-500 transition-all"
          style={{ width: `${((pos + 1) / order.length) * 100}%` }}
        />
      </div>

      <div className="mt-8">
        <Flashcard card={current} flipped={flipped} onFlip={() => setFlipped((f) => !f)} />
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          <button className="btn-secondary" onClick={() => go(-1)} disabled={pos === 0}>
            ← Prev
          </button>
          <button
            className="btn-secondary"
            onClick={() => go(1)}
            disabled={pos === order.length - 1}
          >
            Next →
          </button>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary" onClick={() => setFlipped((f) => !f)}>
            Flip
          </button>
          {shuffleOn ? (
            <button className="btn-secondary" onClick={unshuffle}>
              Sort
            </button>
          ) : (
            <button className="btn-secondary" onClick={shuffle}>
              Shuffle
            </button>
          )}
        </div>
      </div>

      <div className="mt-6 panel p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm text-ink-800/70">
          {progress[current?.id] ? (
            <span className="text-english-700 font-medium">✓ Marked as learned</span>
          ) : (
            <span>How well did you know it?</span>
          )}
        </div>
        <div className="flex gap-2">
          <button
            className="btn bg-amber-50 text-amber-700 hover:bg-amber-100"
            onClick={() => markLearned(false)}
          >
            Review again
          </button>
          <button
            className="btn bg-english-100 text-english-700 hover:bg-english-500/20"
            onClick={() => markLearned(true)}
          >
            I knew it ✓
          </button>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between text-xs text-ink-800/60">
        <div>
          {learnedCount} / {cards.length} learned ({pct}%)
        </div>
        <button
          className="hover:text-red-600"
          onClick={() => {
            if (!confirm('Reset learned progress for this deck?')) return
            resetProgress(cards.map((c) => c.id))
            setProgressState(getProgress())
          }}
        >
          Reset progress
        </button>
      </div>

      <div className="mt-4 text-[11px] text-ink-800/50 text-center">
        Keyboard: <kbd className="kbd">Space</kbd> flip ·{' '}
        <kbd className="kbd">←</kbd> / <kbd className="kbd">→</kbd> navigate ·{' '}
        <kbd className="kbd">K</kbd> knew it · <kbd className="kbd">R</kbd> review again
      </div>
    </div>
  )
}
