import { useEffect, useState } from 'react'

// Flip card with a deliberate delay before the answer becomes legible.
// The flip animation runs for 1000ms; we keep the answer side faded out
// until after the flip completes so users can't read the answer mid-flip.

const REVEAL_DELAY_MS = 1050

export default function Flashcard({ card, flipped, onFlip, direction = 'khmer-first' }) {
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    if (flipped) {
      const t = setTimeout(() => setRevealed(true), REVEAL_DELAY_MS)
      return () => clearTimeout(t)
    }
    setRevealed(false)
  }, [flipped, card?.id])

  if (!card) return null

  const khmerFirst = direction === 'khmer-first'
  const frontSide = khmerFirst ? (
    <KhmerSide card={card} hint="What does this mean?" />
  ) : (
    <EnglishSide card={card} hint="How do you say this in Khmer?" />
  )
  const backSide = khmerFirst ? (
    <EnglishSide card={card} hint="Tap to flip back" />
  ) : (
    <KhmerSide card={card} hint="Tap to flip back" />
  )

  return (
    <div className="flip-scene w-full">
      <button
        type="button"
        onClick={onFlip}
        className={`flip-card w-full aspect-[5/3] rounded-2xl ${flipped ? 'flipped' : ''}`}
        aria-pressed={flipped}
      >
        <div className="flip-face rounded-2xl overflow-hidden">{frontSide}</div>
        <div className="flip-face flip-back rounded-2xl overflow-hidden">
          <div className={`back-content ${revealed ? 'revealed' : ''} h-full`}>
            {backSide}
          </div>
        </div>
      </button>
    </div>
  )
}

function KhmerSide({ card, hint }) {
  return (
    <div className="h-full bg-white border border-ink-200 shadow-card rounded-2xl">
      <div className="h-full grid grid-rows-[auto_1fr_auto]">
        <div className="px-5 pt-4 flex items-center justify-between text-xs uppercase tracking-wider text-ink-800/50">
          <span>Khmer · ខ្មែរ</span>
          <span>Tap to flip</span>
        </div>
        <div className="px-6 grid place-items-center text-center">
          <div className="flex flex-col items-center gap-3">
            <CardImage card={card} tone="khmer" />
            <div className="font-khmer text-5xl sm:text-6xl text-khmer-700 leading-tight">
              {card.khmer_text}
            </div>
            <div className="text-phonetic-700 text-lg sm:text-xl font-serif italic">
              {card.khmer_transliteration}
            </div>
            <div className="text-phonetic-600 text-sm sm:text-base -mt-1">
              pronounced{' '}
              <span className="font-medium text-phonetic-700">
                “{card.english_phonetic}”
              </span>
            </div>
          </div>
        </div>
        <div className="px-5 pb-4 text-center text-xs text-ink-800/40">{hint}</div>
      </div>
    </div>
  )
}

function EnglishSide({ card, hint }) {
  return (
    <div className="h-full bg-english-50 border border-english-100 shadow-card rounded-2xl">
      <div className="h-full grid grid-rows-[auto_1fr_auto]">
        <div className="px-5 pt-4 flex items-center justify-between text-xs uppercase tracking-wider text-english-700/70">
          <span>English</span>
          <span>Tap to flip</span>
        </div>
        <div className="px-6 grid place-items-center text-center">
          <div className="flex flex-col items-center gap-4">
            <CardImage card={card} tone="english" />
            <div className="text-3xl sm:text-4xl font-semibold text-english-700">
              {card.english_translation}
            </div>
          </div>
        </div>
        <div className="px-5 pb-4 text-center text-xs text-english-700/60">{hint}</div>
      </div>
    </div>
  )
}

function CardImage({ card, tone }) {
  const [broken, setBroken] = useState(false)
  useEffect(() => setBroken(false), [card?.id, card?.image_url])
  if (card.image_url && !broken) {
    return (
      <img
        src={card.image_url}
        alt={card.english_translation}
        onError={() => setBroken(true)}
        className="max-h-28 w-auto rounded-lg object-contain"
      />
    )
  }
  const ring =
    tone === 'khmer'
      ? 'border-khmer-500/30 text-khmer-600/50'
      : 'border-english-500/40 text-english-500/60'
  return (
    <div
      className={`h-20 w-20 rounded-lg border-2 border-dashed grid place-items-center text-xs ${ring}`}
    >
      image
    </div>
  )
}
