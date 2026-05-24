import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  getDeck,
  listCards,
  createCard,
  updateCard,
  deleteCard,
  getProgress,
} from '../lib/storage.js'
import { Modal } from './Home.jsx'
import PrintModal from '../components/PrintModal.jsx'

export default function DeckPage() {
  const { id } = useParams()
  const [deck, setDeck] = useState(null)
  const [cards, setCards] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null) // card object or "new"
  const [showPrint, setShowPrint] = useState(false)
  const [progress, setProgress] = useState({})

  async function reload() {
    setLoading(true)
    try {
      const [d, cs] = await Promise.all([getDeck(id), listCards(id)])
      setDeck(d)
      setCards(cs)
      setProgress(getProgress())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    reload()
  }, [id])

  const learnedCount = useMemo(
    () => cards.filter((c) => progress[c.id]).length,
    [cards, progress],
  )

  if (loading && !deck) {
    return <div className="mx-auto max-w-6xl px-4 py-8 text-ink-800/60">Loading deck…</div>
  }
  if (!deck) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        <Link to="/" className="text-khmer-700 hover:underline">
          ← Back to decks
        </Link>
        <p className="mt-4">Deck not found.</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Link to="/" className="text-sm text-ink-800/70 hover:text-khmer-700">
        ← Back to decks
      </Link>

      <header className="mt-3 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">{deck.name}</h1>
          {deck.description && (
            <p className="text-ink-800/70 mt-1 max-w-2xl">{deck.description}</p>
          )}
          <div className="mt-3 flex items-center gap-4 text-sm">
            <ProgressPill total={cards.length} learned={learnedCount} />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to={`/deck/${deck.id}/study`} className="btn-primary">
            ▶ Study
          </Link>
          <button className="btn-secondary" onClick={() => setShowPrint(true)}>
            Print PDF
          </button>
          <button className="btn-secondary" onClick={() => setEditing('new')}>
            + Add card
          </button>
        </div>
      </header>

      <section className="mt-8">
        {cards.length === 0 ? (
          <div className="panel p-10 text-center">
            <p className="text-ink-800/70">No cards yet — add your first one.</p>
            <button className="btn-primary mt-4" onClick={() => setEditing('new')}>
              + Add card
            </button>
          </div>
        ) : (
          <ul className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((c, i) => (
              <CardRow
                key={c.id}
                card={c}
                index={i + 1}
                learned={!!progress[c.id]}
                onEdit={() => setEditing(c)}
                onDelete={async () => {
                  if (!confirm(`Delete card "${c.english_translation}"?`)) return
                  await deleteCard(c.id)
                  reload()
                }}
              />
            ))}
          </ul>
        )}
      </section>

      {editing && (
        <CardEditor
          deckId={deck.id}
          card={editing === 'new' ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null)
            reload()
          }}
        />
      )}

      {showPrint && (
        <PrintModal deck={deck} cards={cards} onClose={() => setShowPrint(false)} />
      )}
    </div>
  )
}

function ProgressPill({ total, learned }) {
  const pct = total ? Math.round((learned / total) * 100) : 0
  return (
    <div className="flex items-center gap-3">
      <div className="h-2 w-40 bg-ink-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-english-500 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-ink-800/70">
        {learned} / {total} learned
      </span>
    </div>
  )
}

function CardRow({ card, index, learned, onEdit, onDelete }) {
  return (
    <li className="panel p-4 group">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="text-[10px] uppercase tracking-wider text-ink-800/50">
            #{index} {learned && <span className="text-english-600">· learned</span>}
          </div>
          <div className="font-khmer text-2xl text-khmer-700 mt-1 leading-tight truncate">
            {card.khmer_text}
          </div>
          <div className="text-phonetic-700 text-sm italic mt-0.5 truncate">
            {card.khmer_transliteration}
            <span className="text-ink-800/40"> · {card.english_phonetic}</span>
          </div>
          <div className="text-english-700 font-medium mt-2 truncate">
            {card.english_translation}
          </div>
        </div>
        <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            className="text-ink-800/60 hover:text-khmer-700 text-sm"
            onClick={onEdit}
            aria-label="Edit"
          >
            ✎
          </button>
          <button
            className="text-ink-800/60 hover:text-red-600 text-sm"
            onClick={onDelete}
            aria-label="Delete"
          >
            ✕
          </button>
        </div>
      </div>
    </li>
  )
}

function CardEditor({ deckId, card, onClose, onSaved }) {
  const [form, setForm] = useState({
    khmer_text: card?.khmer_text ?? '',
    khmer_transliteration: card?.khmer_transliteration ?? '',
    english_phonetic: card?.english_phonetic ?? '',
    english_translation: card?.english_translation ?? '',
    image_url: card?.image_url ?? '',
  })
  const [saving, setSaving] = useState(false)

  function bind(key) {
    return {
      value: form[key],
      onChange: (e) => setForm((f) => ({ ...f, [key]: e.target.value })),
    }
  }

  async function submit(e) {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = { ...form, image_url: form.image_url || null }
      if (card) await updateCard(card.id, payload)
      else await createCard(deckId, payload)
      onSaved()
    } finally {
      setSaving(false)
    }
  }

  function pickFile(e) {
    const f = e.target.files?.[0]
    if (!f) return
    const r = new FileReader()
    r.onload = () => setForm((s) => ({ ...s, image_url: r.result }))
    r.readAsDataURL(f)
  }

  return (
    <Modal title={card ? 'Edit card' : 'Add card'} onClose={onClose}>
      <form onSubmit={submit} className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="label">Khmer (Unicode)</label>
            <input
              className="input font-khmer text-lg"
              placeholder="សួស្តី"
              {...bind('khmer_text')}
            />
          </div>
          <div>
            <label className="label">Transliteration (Latin)</label>
            <input
              className="input italic"
              placeholder="suosdei"
              {...bind('khmer_transliteration')}
            />
          </div>
        </div>
        <div>
          <label className="label">Phonetic guide (English)</label>
          <input
            className="input"
            placeholder="soo-uhs-day"
            {...bind('english_phonetic')}
          />
        </div>
        <div>
          <label className="label">English translation</label>
          <input
            className="input"
            placeholder="hello"
            {...bind('english_translation')}
          />
        </div>
        <div>
          <label className="label">Image (optional)</label>
          <div className="flex items-center gap-3">
            {form.image_url ? (
              <img
                src={form.image_url}
                alt=""
                className="h-14 w-14 object-cover rounded-md border border-ink-200"
              />
            ) : (
              <div className="h-14 w-14 rounded-md border-2 border-dashed border-ink-200 grid place-items-center text-ink-800/40 text-[10px]">
                none
              </div>
            )}
            <input type="file" accept="image/*" onChange={pickFile} className="text-sm" />
            {form.image_url && (
              <button
                type="button"
                className="text-xs text-red-600 hover:underline"
                onClick={() => setForm((s) => ({ ...s, image_url: '' }))}
              >
                remove
              </button>
            )}
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'Saving…' : card ? 'Save changes' : 'Add card'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
