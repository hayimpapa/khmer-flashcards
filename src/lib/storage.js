// Storage layer: uses Supabase when configured, otherwise falls back to
// localStorage so the app is fully usable out of the box.

import { supabase, hasSupabase } from './supabase'
import { seedDecks } from './seedData'

const LS_KEY = 'khmer-flashcards:v1'

function uid() {
  return (
    Date.now().toString(36) +
    Math.random().toString(36).slice(2, 10)
  )
}

function nowIso() {
  return new Date().toISOString()
}

function readLocal() {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  // First boot: hydrate from seed data.
  const decks = []
  const cards = []
  for (const d of seedDecks) {
    const deckId = uid()
    decks.push({
      id: deckId,
      name: d.name,
      description: d.description,
      created_at: nowIso(),
    })
    for (const c of d.cards) {
      cards.push({
        id: uid(),
        deck_id: deckId,
        khmer_text: c.khmer_text,
        khmer_transliteration: c.khmer_transliteration,
        english_phonetic: c.english_phonetic,
        english_translation: c.english_translation,
        image_url: null,
        learned: false,
        created_at: nowIso(),
      })
    }
  }
  const state = { decks, cards }
  writeLocal(state)
  return state
}

function writeLocal(state) {
  localStorage.setItem(LS_KEY, JSON.stringify(state))
}

// ─────────────────────────────────────────────────────────────────────────────
// Public API

export async function listDecks() {
  if (hasSupabase) {
    const { data, error } = await supabase
      .from('decks')
      .select('*, cards(count)')
      .order('created_at', { ascending: true })
    if (error) throw error
    return data.map((d) => ({
      id: d.id,
      name: d.name,
      description: d.description,
      created_at: d.created_at,
      card_count: d.cards?.[0]?.count ?? 0,
    }))
  }
  const { decks, cards } = readLocal()
  return decks.map((d) => ({
    ...d,
    card_count: cards.filter((c) => c.deck_id === d.id).length,
  }))
}

export async function getDeck(id) {
  if (hasSupabase) {
    const { data, error } = await supabase.from('decks').select('*').eq('id', id).single()
    if (error) throw error
    return data
  }
  const { decks } = readLocal()
  return decks.find((d) => d.id === id) ?? null
}

export async function createDeck({ name, description }) {
  if (hasSupabase) {
    const { data, error } = await supabase
      .from('decks')
      .insert({ name, description })
      .select()
      .single()
    if (error) throw error
    return data
  }
  const state = readLocal()
  const deck = { id: uid(), name, description: description ?? '', created_at: nowIso() }
  state.decks.push(deck)
  writeLocal(state)
  return deck
}

export async function updateDeck(id, patch) {
  if (hasSupabase) {
    const { data, error } = await supabase
      .from('decks')
      .update(patch)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  }
  const state = readLocal()
  const idx = state.decks.findIndex((d) => d.id === id)
  if (idx === -1) throw new Error('Deck not found')
  state.decks[idx] = { ...state.decks[idx], ...patch }
  writeLocal(state)
  return state.decks[idx]
}

export async function deleteDeck(id) {
  if (hasSupabase) {
    const { error } = await supabase.from('decks').delete().eq('id', id)
    if (error) throw error
    return
  }
  const state = readLocal()
  state.decks = state.decks.filter((d) => d.id !== id)
  state.cards = state.cards.filter((c) => c.deck_id !== id)
  writeLocal(state)
}

export async function listCards(deckId) {
  if (hasSupabase) {
    const { data, error } = await supabase
      .from('cards')
      .select('*')
      .eq('deck_id', deckId)
      .order('created_at', { ascending: true })
    if (error) throw error
    return data
  }
  const { cards } = readLocal()
  return cards.filter((c) => c.deck_id === deckId)
}

export async function createCard(deckId, card) {
  const payload = {
    deck_id: deckId,
    khmer_text: card.khmer_text ?? '',
    khmer_transliteration: card.khmer_transliteration ?? '',
    english_phonetic: card.english_phonetic ?? '',
    english_translation: card.english_translation ?? '',
    image_url: card.image_url ?? null,
  }
  if (hasSupabase) {
    const { data, error } = await supabase.from('cards').insert(payload).select().single()
    if (error) throw error
    return data
  }
  const state = readLocal()
  const row = { id: uid(), ...payload, learned: false, created_at: nowIso() }
  state.cards.push(row)
  writeLocal(state)
  return row
}

export async function updateCard(id, patch) {
  if (hasSupabase) {
    const { data, error } = await supabase
      .from('cards')
      .update(patch)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  }
  const state = readLocal()
  const idx = state.cards.findIndex((c) => c.id === id)
  if (idx === -1) throw new Error('Card not found')
  state.cards[idx] = { ...state.cards[idx], ...patch }
  writeLocal(state)
  return state.cards[idx]
}

export async function deleteCard(id) {
  if (hasSupabase) {
    const { error } = await supabase.from('cards').delete().eq('id', id)
    if (error) throw error
    return
  }
  const state = readLocal()
  state.cards = state.cards.filter((c) => c.id !== id)
  writeLocal(state)
}

// Local-only "learned" tracking. Supabase schema doesn't include it by
// default to keep the published SQL minimal; we stash it client-side.
const PROGRESS_KEY = 'khmer-flashcards:progress:v1'

export function getProgress() {
  try {
    return JSON.parse(localStorage.getItem(PROGRESS_KEY) ?? '{}')
  } catch {
    return {}
  }
}

export function setLearned(cardId, learned) {
  const p = getProgress()
  if (learned) p[cardId] = true
  else delete p[cardId]
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(p))
}

export function resetProgress(cardIds) {
  const p = getProgress()
  for (const id of cardIds) delete p[id]
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(p))
}
