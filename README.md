# Khmer Flashcards

A clean, classroom-friendly flashcard app for learning Khmer.

- **Flip-card study mode** with a 650ms reveal delay so learners commit to
  an answer before they see it.
- **Deck management** — create decks, add/edit/delete cards.
- **Printable PDF** — one-click 8.5×5.5 in (or 4-up) printable flashcards
  with ruled handwriting lines on the front and an image placeholder on
  the back; duplex-aligned so the back of card 1 lines up with the front
  of card 1.
- **Pre-seeded with 100+ words** across Food, Animals, Numbers,
  Greetings, Body Parts, Colors, and Common Objects.
- **Optional Supabase backend.** Without credentials, the app runs fully
  offline using `localStorage`, pre-seeded from the same data file.

## Stack

React + Vite + Tailwind, Supabase (optional), jsPDF for export. Khmer
glyphs in the PDF are rendered through `<canvas>` using the
[Noto Sans Khmer](https://fonts.google.com/noto/specimen/Noto+Sans+Khmer)
web font, so no large TTF needs to be bundled.

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:5173 and start flipping cards. The first deck list
is hydrated from `src/lib/seedData.js`.

## Connecting to Supabase (optional)

1. Create a Supabase project at https://supabase.com.
2. Open the SQL editor and paste the contents of
   [`supabase/seed.sql`](./supabase/seed.sql). It creates the schema and
   inserts the 100+ seed cards.
3. Copy `.env.example` → `.env` and fill in your project URL and anon key.
4. Restart `npm run dev`. The banner at the top will switch to
   "Connected to Supabase".

The default RLS policies in `seed.sql` are permissive (anonymous read +
write) — fine for a single-teacher classroom MVP, but you'll want to
tighten them (e.g. `auth.uid() is not null`) before going to production.

## Regenerating the seed SQL

`supabase/seed.sql` is generated from `src/lib/seedData.js` to keep the
offline and database datasets in sync. After editing the word list:

```bash
node scripts/generate-seed-sql.mjs
```

## Project layout

```
src/
  pages/        Home (deck list), DeckPage (manage), StudyPage (flip mode)
  components/   Flashcard (3D flip + delayed reveal), PrintModal
  lib/
    storage.js   Supabase + localStorage adapters
    pdf.js       jsPDF + canvas-based Khmer rendering
    seedData.js  Source of truth for seed decks / cards
supabase/seed.sql   Generated DDL + INSERTs for Supabase
```

## Printing tips

- The PDF emits front pages then back pages, mirrored for duplex
  printing. In your print dialog, choose **two-sided / flip on long
  edge** for the 2-per-page layout, or **flip on short edge** for the
  4-per-page layout.
- Use heavier paper (24–32 lb / 90–120 gsm) so the back doesn't show
  through.
- The handwriting guide lines under each Khmer word use a dotted
  midline + solid baseline, sized for ballpoint practice.
