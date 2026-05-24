import { useEffect, useMemo, useState } from 'react'
import { Modal } from '../pages/Home.jsx'
import { generateFlashcardsPdf } from '../lib/pdf.js'

export default function PrintModal({ deck, cards, onClose }) {
  const [from, setFrom] = useState(1)
  const [to, setTo] = useState(Math.min(20, cards.length))
  const [includePractice, setIncludePractice] = useState(true)
  const [includeImagePlaceholder, setIncludeImagePlaceholder] = useState(true)
  const [layout, setLayout] = useState('2-per-page') // or '4-per-page'
  const [direction, setDirection] = useState('khmer-first') // or 'english-first'
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  // Wait for the Khmer web font before we let users export, so the
  // canvas-rendered Khmer glyphs are not the system fallback.
  const [fontReady, setFontReady] = useState(false)

  useEffect(() => {
    if (!document.fonts?.load) {
      setFontReady(true)
      return
    }
    Promise.all([
      document.fonts.load('700 36px "Noto Sans Khmer"'),
      document.fonts.load('600 24px "Noto Sans Khmer"'),
    ])
      .then(() => setFontReady(true))
      .catch(() => setFontReady(true))
  }, [])

  const selected = useMemo(() => {
    const lo = Math.max(1, Math.min(from, cards.length))
    const hi = Math.max(lo, Math.min(to, cards.length))
    return cards.slice(lo - 1, hi)
  }, [from, to, cards])

  async function exportPdf() {
    setBusy(true)
    setError('')
    try {
      await generateFlashcardsPdf({
        deckName: deck.name,
        cards: selected,
        includePractice,
        includeImagePlaceholder,
        layout,
        direction,
      })
    } catch (e) {
      console.error(e)
      setError(e?.message ?? 'Something went wrong while generating the PDF.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <Modal title={`Print “${deck.name}”`} onClose={onClose}>
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">First card</label>
            <input
              type="number"
              min={1}
              max={cards.length}
              className="input"
              value={from}
              onChange={(e) => setFrom(Number(e.target.value) || 1)}
            />
          </div>
          <div>
            <label className="label">Last card</label>
            <input
              type="number"
              min={1}
              max={cards.length}
              className="input"
              value={to}
              onChange={(e) => setTo(Number(e.target.value) || 1)}
            />
          </div>
        </div>
        <div className="text-xs text-ink-800/60">
          Selecting cards {Math.max(1, Math.min(from, cards.length))}–
          {Math.max(from, Math.min(to, cards.length))} of {cards.length} ·{' '}
          <button
            type="button"
            className="text-khmer-700 hover:underline"
            onClick={() => {
              setFrom(1)
              setTo(cards.length)
            }}
          >
            select all
          </button>
        </div>

        <div>
          <label className="label">Front of card</label>
          <div className="grid grid-cols-2 gap-2">
            <LayoutOption
              checked={direction === 'khmer-first'}
              onChange={() => setDirection('khmer-first')}
              title="Khmer → English"
              desc="For English speakers learning Khmer"
            />
            <LayoutOption
              checked={direction === 'english-first'}
              onChange={() => setDirection('english-first')}
              title="English → Khmer"
              desc="For Khmer speakers learning English"
            />
          </div>
        </div>

        <div>
          <label className="label">Layout</label>
          <div className="grid grid-cols-2 gap-2">
            <LayoutOption
              checked={layout === '2-per-page'}
              onChange={() => setLayout('2-per-page')}
              title="2 per page"
              desc="8.5 × 5.5 in cards"
            />
            <LayoutOption
              checked={layout === '4-per-page'}
              onChange={() => setLayout('4-per-page')}
              title="4 per page"
              desc="4.25 × 5.5 in cards"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={includePractice}
              onChange={(e) => setIncludePractice(e.target.checked)}
            />
            Include ruled handwriting lines under the Khmer word
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={includeImagePlaceholder}
              onChange={(e) => setIncludeImagePlaceholder(e.target.checked)}
            />
            Reserve a placeholder box for the picture on the back
          </label>
        </div>

        {!fontReady && (
          <div className="text-xs text-ink-800/60">Loading Khmer font…</div>
        )}
        {error && (
          <div className="text-xs text-red-700 bg-red-50 border border-red-100 rounded p-2">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-2 pt-1">
          <button className="btn-secondary" onClick={onClose} disabled={busy}>
            Cancel
          </button>
          <button
            className="btn-primary"
            onClick={exportPdf}
            disabled={busy || !fontReady || selected.length === 0}
          >
            {busy ? 'Building PDF…' : `Download PDF (${selected.length} cards)`}
          </button>
        </div>
      </div>
    </Modal>
  )
}

function LayoutOption({ checked, onChange, title, desc }) {
  return (
    <label
      className={`cursor-pointer rounded-lg border p-3 transition-colors ${
        checked
          ? 'border-khmer-500 bg-khmer-50'
          : 'border-ink-200 hover:border-ink-200/80'
      }`}
    >
      <input type="radio" checked={checked} onChange={onChange} className="sr-only" />
      <div className="font-medium text-sm">{title}</div>
      <div className="text-xs text-ink-800/60">{desc}</div>
    </label>
  )
}
