// Regenerate supabase/seed.sql from src/lib/seedData.js so the database
// import and the local-storage fallback share one source of truth.
//
//   node scripts/generate-seed-sql.mjs

import { writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const seedModule = await import(
  pathToFileURL(join(__dirname, '..', 'src', 'lib', 'seedData.js')).href
)
const { seedDecks, seedImagePath } = seedModule

function esc(s) {
  return String(s ?? '').replace(/'/g, "''")
}

const lines = []
lines.push('-- Khmer Flashcards — Supabase schema + seed data')
lines.push('-- Generated from src/lib/seedData.js. Paste into the Supabase SQL editor.')
lines.push('-- Safe to re-run: drops and recreates the tables.')
lines.push('')
lines.push('begin;')
lines.push('')
lines.push('-- ── Schema ──────────────────────────────────────────────────────────────')
lines.push('drop table if exists public.cards cascade;')
lines.push('drop table if exists public.decks cascade;')
lines.push('')
lines.push('create table public.decks (')
lines.push('  id          uuid primary key default gen_random_uuid(),')
lines.push('  name        text not null,')
lines.push('  description text,')
lines.push('  created_at  timestamptz not null default now()')
lines.push(');')
lines.push('')
lines.push('create table public.cards (')
lines.push('  id                    uuid primary key default gen_random_uuid(),')
lines.push('  deck_id               uuid not null references public.decks(id) on delete cascade,')
lines.push('  khmer_text            text not null,')
lines.push('  khmer_transliteration text not null default \'\',')
lines.push('  english_phonetic      text not null default \'\',')
lines.push('  english_translation   text not null,')
lines.push('  image_url             text,')
lines.push('  created_at            timestamptz not null default now()')
lines.push(');')
lines.push('')
lines.push('create index cards_deck_id_idx on public.cards (deck_id);')
lines.push('')
lines.push('-- Enable Row Level Security and allow anonymous read/write for the MVP.')
lines.push("-- Tighten these policies (e.g. require auth.uid()) before going to production.")
lines.push('alter table public.decks enable row level security;')
lines.push('alter table public.cards enable row level security;')
lines.push('')
lines.push("create policy \"public read decks\"   on public.decks for select using (true);")
lines.push("create policy \"public write decks\"  on public.decks for all    using (true) with check (true);")
lines.push("create policy \"public read cards\"   on public.cards for select using (true);")
lines.push("create policy \"public write cards\"  on public.cards for all    using (true) with check (true);")
lines.push('')
lines.push('-- ── Seed data ───────────────────────────────────────────────────────────')

let total = 0
for (const deck of seedDecks) {
  const deckVar = `deck_${deck.slug.replace(/-/g, '_')}_id`
  lines.push('')
  lines.push(`-- ${deck.name} (${deck.cards.length} cards)`)
  lines.push('do $$')
  lines.push('declare')
  lines.push(`  ${deckVar} uuid;`)
  lines.push('begin')
  lines.push(
    `  insert into public.decks (name, description) values ('${esc(deck.name)}', '${esc(
      deck.description,
    )}') returning id into ${deckVar};`,
  )
  for (const c of deck.cards) {
    total += 1
    const imagePath = seedImagePath(deck.slug, c.english_translation)
    lines.push(
      `  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation, image_url) values (${deckVar}, '${esc(
        c.khmer_text,
      )}', '${esc(c.khmer_transliteration)}', '${esc(c.english_phonetic)}', '${esc(
        c.english_translation,
      )}', '${esc(imagePath)}');`,
    )
  }
  lines.push('end $$;')
}

lines.push('')
lines.push('commit;')
lines.push('')
lines.push(`-- Inserted ${seedDecks.length} decks and ${total} cards.`)
lines.push('')

const outPath = join(__dirname, '..', 'supabase', 'seed.sql')
writeFileSync(outPath, lines.join('\n'))
console.log(`Wrote ${outPath} (${seedDecks.length} decks, ${total} cards)`)
