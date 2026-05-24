import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listDecks, createDeck, deleteDeck } from '../lib/storage.js'

export default function Home() {
  const [decks, setDecks] = useState([])
  const [loading, setLoading] = useState(true)
  const [showNew, setShowNew] = useState(false)

  async function reload() {
    setLoading(true)
    try {
      setDecks(await listDecks())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    reload()
  }, [])

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <section className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-ink-900">Your decks</h1>
          <p className="text-ink-800/70 mt-1">
            Pick a deck to study, manage cards, or print a set for the classroom.
          </p>
        </div>
        <button className="btn-primary" onClick={() => setShowNew(true)}>
          + New deck
        </button>
      </section>

      {loading ? (
        <div className="text-ink-800/60">Loading…</div>
      ) : decks.length === 0 ? (
        <EmptyState onCreate={() => setShowNew(true)} />
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {decks.map((d) => (
            <DeckCard key={d.id} deck={d} onChanged={reload} />
          ))}
        </div>
      )}

      {showNew && (
        <NewDeckModal
          onClose={() => setShowNew(false)}
          onCreated={() => {
            setShowNew(false)
            reload()
          }}
        />
      )}
    </div>
  )
}

function DeckCard({ deck, onChanged }) {
  async function onDelete(e) {
    e.preventDefault()
    e.stopPropagation()
    if (!confirm(`Delete deck "${deck.name}" and all its cards?`)) return
    await deleteDeck(deck.id)
    onChanged()
  }

  return (
    <Link
      to={`/deck/${deck.id}`}
      className="panel p-5 hover:border-khmer-500/40 hover:shadow-lg transition-all group block"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="font-semibold text-ink-900 group-hover:text-khmer-700 transition-colors truncate">
            {deck.name}
          </h2>
          {deck.description && (
            <p className="text-sm text-ink-800/70 mt-1 line-clamp-2">{deck.description}</p>
          )}
        </div>
        <button
          onClick={onDelete}
          aria-label="Delete deck"
          className="opacity-0 group-hover:opacity-100 transition-opacity text-ink-800/50 hover:text-red-600 text-sm"
        >
          ✕
        </button>
      </div>
      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="inline-flex items-center gap-1.5 text-ink-800/70">
          <span className="h-1.5 w-1.5 rounded-full bg-khmer-500" />
          {deck.card_count} {deck.card_count === 1 ? 'card' : 'cards'}
        </span>
        <span className="text-khmer-700 font-medium group-hover:translate-x-0.5 transition-transform">
          Open →
        </span>
      </div>
    </Link>
  )
}

function EmptyState({ onCreate }) {
  return (
    <div className="panel p-10 text-center">
      <div className="text-4xl font-khmer text-khmer-600 mb-3">ស្វាគមន៍</div>
      <h2 className="text-lg font-semibold">No decks yet</h2>
      <p className="text-ink-800/70 mt-1">Create your first deck to start adding flashcards.</p>
      <button className="btn-primary mt-4" onClick={onCreate}>
        + Create a deck
      </button>
    </div>
  )
}

function NewDeckModal({ onClose, onCreated }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [saving, setSaving] = useState(false)

  async function submit(e) {
    e.preventDefault()
    if (!name.trim()) return
    setSaving(true)
    try {
      await createDeck({ name: name.trim(), description: description.trim() })
      onCreated()
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal onClose={onClose} title="New deck">
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="label">Name</label>
          <input
            autoFocus
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Weather"
          />
        </div>
        <div>
          <label className="label">Description (optional)</label>
          <textarea
            className="input"
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What this deck is about."
          />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'Creating…' : 'Create deck'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

export function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 bg-ink-900/30 backdrop-blur-sm grid place-items-center p-4">
      <div className="panel w-full max-w-lg p-6 relative">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={onClose} className="text-ink-800/60 hover:text-ink-900">
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
