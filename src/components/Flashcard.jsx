import { useEffect, useState } from 'react'

// Flip card with a deliberate delay before the answer becomes legible.
// The flip animation runs for 700ms; we keep the back content faded out
// until ~600ms in so users get a moment to commit to their answer.

const REVEAL_DELAY_MS = 650

export default function Flashcard({ card, flipped, onFlip }) {
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    if (flipped) {
      const t = setTimeout(() => setRevealed(true), REVEAL_DELAY_MS)
      return () => clearTimeout(t)
    }
    setRevealed(false)
  }, [flipped, card?.id])

  if (!card) return null

  return (
    <div className="flip-scene w-full">
      <button
        type="button"
        onClick={onFlip}
        className={`flip-card w-full aspect-[5/3] rounded-2xl ${flipped ? 'flipped' : ''}`}
        aria-pressed={flipped}
      >
        {/* Front */}
        <div className="flip-face rounded-2xl bg-white border border-ink-200 shadow-card overflow-hidden">
          <div className="h-full grid grid-rows-[auto_1fr_auto]">
            <div className="px-5 pt-4 flex items-center justify-between text-xs uppercase tracking-wider text-ink-800/50">
              <span>Khmer</span>
              <span>Tap to flip</span>
            </div>
            <div className="px-6 grid place-items-center text-center">
              <div>
                <div className="font-khmer text-5xl sm:text-6xl text-khmer-700 leading-tight">
                  {card.khmer_text}
                </div>
                <div className="mt-4 text-phonetic-700 text-lg sm:text-xl font-serif italic">
                  {card.khmer_transliteration}
                </div>
                <div className="mt-2 text-phonetic-600 text-sm sm:text-base">
                  pronounced{' '}
                  <span className="font-medium text-phonetic-700">
                    “{card.english_phonetic}”
                  </span>
                </div>
              </div>
            </div>
            <div className="px-5 pb-4 text-center text-xs text-ink-800/40">
              What does this mean?
            </div>
          </div>
        </div>

        {/* Back */}
        <div className="flip-face flip-back rounded-2xl bg-english-50 border border-english-100 shadow-card overflow-hidden">
          <div className={`back-content ${revealed ? 'revealed' : ''} h-full`}>
            <div className="h-full grid grid-rows-[auto_1fr_auto]">
              <div className="px-5 pt-4 flex items-center justify-between text-xs uppercase tracking-wider text-english-700/70">
                <span>English</span>
                <span>Tap to flip back</span>
              </div>
              <div className="px-6 grid place-items-center text-center">
                <div className="flex flex-col items-center gap-4">
                  {card.image_url ? (
                    <img
                      src={card.image_url}
                      alt={card.english_translation}
                      className="max-h-32 w-auto rounded-lg object-contain"
                    />
                  ) : (
                    <ImagePlaceholder />
                  )}
                  <div className="text-3xl sm:text-4xl font-semibold text-english-700">
                    {card.english_translation}
                  </div>
                </div>
              </div>
              <div className="px-5 pb-4 text-center text-xs text-english-700/60">
                {card.khmer_transliteration} · “{card.english_phonetic}”
              </div>
            </div>
          </div>
        </div>
      </button>
    </div>
  )
}

function ImagePlaceholder() {
  return (
    <div className="h-24 w-24 rounded-lg border-2 border-dashed border-english-500/40 grid place-items-center text-english-500/60 text-xs">
      image
    </div>
  )
}
