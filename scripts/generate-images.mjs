// One-shot image generator: fetches a cartoon illustration for every
// card in seedData.js from pollinations.ai and saves it under
// public/images/<deck-slug>/<card-slug>.jpg. Skips files that already
// exist so it's safe to re-run after editing prompts.
//
//   node scripts/generate-images.mjs            # generate everything missing
//   node scripts/generate-images.mjs --force    # re-download everything
//   node scripts/generate-images.mjs food       # only the "food" deck slug

import { writeFile, mkdir, access } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const seedModule = await import(
  pathToFileURL(join(__dirname, '..', 'src', 'lib', 'seedData.js')).href
)
const { seedDecks } = seedModule

const args = process.argv.slice(2)
const FORCE = args.includes('--force')
const ONLY = args.find((a) => !a.startsWith('--'))

const STYLE =
  'flat vector children illustration, soft pastel colors, ' +
  'simple shapes, clean white background, centered, friendly, ' +
  'no text, no letters, no words, no watermark'

// Prompt overrides for items that don't translate to a single concrete
// object (abstract concepts, numbers, colors). Anything not in here uses
// the English translation directly.
const PROMPT_OVERRIDES = {
  // Numbers — show that many objects to keep it visual + culture-neutral.
  one: 'one bright red apple',
  two: 'two ripe oranges side by side',
  three: 'three yellow bananas in a row',
  four: 'four small strawberries',
  five: 'five colorful balloons',
  six: 'six round cookies on a plate',
  seven: 'seven small fish swimming',
  eight: 'eight green leaves',
  nine: 'nine smiling stars',
  ten: 'ten paper hearts in a row',
  eleven: 'eleven small flowers',
  twenty: 'twenty tiny dots arranged in a square',
  'one hundred': 'a big number sign showing many small dots in a square grid',

  // Colors — pair with a familiar object so the color reads clearly.
  red: 'a single bright red apple',
  blue: 'a friendly blue ball',
  green: 'a green leaf',
  yellow: 'a yellow lemon',
  black: 'a black umbrella',
  white: 'a fluffy white cloud',
  brown: 'a brown chocolate cookie',
  purple: 'a purple grape cluster',
  gray: 'a small gray stone',
  pink: 'a soft pink flower',

  // Greetings & phrases — depict a kid-friendly scene.
  hello: 'a smiling cartoon child waving hello with one hand',
  goodbye: 'a cartoon child waving goodbye, slight sad smile',
  'thank you': 'a cartoon child holding their hands together politely',
  'sorry / excuse me': 'a cartoon child with a gentle apologetic expression, one hand raised slightly',
  'yes (male speaker)': 'a cartoon boy nodding yes with a smile and thumbs up',
  'yes (female speaker)': 'a cartoon girl nodding yes with a smile and thumbs up',
  no: 'a cartoon child shaking their head no, hand raised gently',
  'how are you?': 'two cartoon children greeting each other with smiles',
  'i am well': 'a cartoon child giving a happy thumbs up',
  please: 'a cartoon child with hands together asking politely',
  'my name is': 'a cartoon child pointing at themselves with a smile',
  "what's your name?": 'two cartoon children meeting and pointing curiously',
  'happy / pleased': 'a cartoon child with a big joyful smile',
  "it's okay / you're welcome": 'a cartoon child shrugging with a kind smile',
  understood: 'a cartoon child with a small lightbulb above their head and a smile',
  'good morning': 'a cartoon sunrise with a smiling sun over green hills',
  'good night': 'a friendly cartoon moon and stars over a cozy house',

  // Specific food/animals where the plain word is ambiguous.
  'rice (cooked)': 'a bowl of steamed white rice',
  'rice (uncooked)': 'a small mound of raw white rice grains',
  'chicken (meat)': 'a plate with pieces of cooked chicken',
  beef: 'a juicy beef steak on a plate',
  pork: 'a plate of cooked pork slices',
  fish: 'a single cute cartoon fish',
  vegetables: 'a colorful assortment of fresh vegetables',
  fruit: 'a colorful basket of mixed fruit',
  bread: 'a fresh loaf of bread',
  egg: 'a single sunny side up egg',
  'water buffalo': 'a friendly cartoon water buffalo standing in grass',
  goat: 'a small cartoon goat with horns',
  cow: 'a friendly cartoon spotted cow',
  pig: 'a happy pink cartoon pig',
  chicken: 'a cartoon chicken standing in grass',
  duck: 'a small yellow cartoon duck',
  horse: 'a friendly brown cartoon horse',
  tiger: 'a striped orange cartoon tiger, cute style',
  monkey: 'a playful cartoon monkey',
  rabbit: 'a fluffy white cartoon rabbit',
  frog: 'a green cartoon frog sitting on a leaf',

  // Body parts: clarify ambiguous ones.
  head: 'a smiling cartoon head, like a friendly emoji',
  hand: 'a single cartoon hand with five fingers',
  'foot / leg': 'a cartoon human foot',
  eye: 'a single friendly cartoon eye',
  ear: 'a cartoon human ear',
  nose: 'a small cartoon human nose',
  mouth: 'a smiling cartoon mouth with teeth',
  tooth: 'a single shiny white cartoon tooth',
  hair: 'a tuft of brown cartoon hair',
  heart: 'a red cartoon heart shape',
  'belly / stomach': 'a cartoon child pointing to their belly',
  back: 'a cartoon child seen from behind, pointing at their back',

  // Common objects with disambiguation.
  water: 'a glass of clear water',
  house: 'a small cartoon house with a red roof',
  door: 'a wooden cartoon door, closed',
  chair: 'a simple wooden cartoon chair',
  table: 'a wooden cartoon dining table',
  book: 'an open cartoon storybook',
  pen: 'a single blue ballpoint pen',
  pencil: 'a sharpened yellow pencil',
  window: 'a square cartoon window with a view of the sky',
  bed: 'a small cartoon bed with a pillow and blanket',
  car: 'a small cartoon car, side view',
  bicycle: 'a small cartoon bicycle, side view',
  telephone: 'a cartoon smartphone with a friendly face on screen',
  'clock / hour': 'a round wall clock showing three o\'clock',

  // Spice / flavor disambiguation.
  sugar: 'a small bowl of white sugar with a spoon',
  salt: 'a small bowl of salt with a spoon',
  'chili pepper': 'a single bright red cartoon chili pepper',
  onion: 'a brown onion with green stems',
  garlic: 'a single bulb of garlic',
  noodles: 'a steaming bowl of noodles',
  soup: 'a bowl of warm soup with steam',
  coffee: 'a cup of hot coffee with steam',
}

function slugify(s) {
  return String(s)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Stable per-card seed so re-runs produce the same image until the
// prompt changes.
function seedFor(text) {
  let h = 2166136261
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return Math.abs(h) % 1_000_000
}

function buildPrompt(card) {
  const key = card.english_translation.toLowerCase()
  const subject = PROMPT_OVERRIDES[key] ?? `a ${card.english_translation}`
  return `${subject}, ${STYLE}`
}

async function exists(p) {
  try {
    await access(p)
    return true
  } catch {
    return false
  }
}

async function fetchImage(prompt, seed) {
  const url =
    'https://image.pollinations.ai/prompt/' +
    encodeURIComponent(prompt) +
    `?width=512&height=512&nologo=true&seed=${seed}&model=flux`
  const res = await fetch(url, {
    headers: { 'user-agent': 'khmer-flashcards-seeder/0.1' },
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const buf = Buffer.from(await res.arrayBuffer())
  if (buf.length < 1000) throw new Error(`response too small (${buf.length} bytes)`)
  return buf
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function main() {
  const root = join(__dirname, '..', 'public', 'images')
  await mkdir(root, { recursive: true })

  let ok = 0
  let skipped = 0
  let failed = 0

  for (const deck of seedDecks) {
    if (ONLY && deck.slug !== ONLY) continue
    const deckDir = join(root, deck.slug)
    await mkdir(deckDir, { recursive: true })

    for (const card of deck.cards) {
      const file = `${slugify(card.english_translation)}.jpg`
      const outPath = join(deckDir, file)
      const rel = `/images/${deck.slug}/${file}`

      if (!FORCE && (await exists(outPath))) {
        skipped += 1
        continue
      }

      const prompt = buildPrompt(card)
      const seed = seedFor(card.english_translation + '|' + deck.slug)

      let lastErr
      let buf
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          buf = await fetchImage(prompt, seed)
          break
        } catch (e) {
          lastErr = e
          await sleep(1500 * attempt)
        }
      }
      if (!buf) {
        failed += 1
        console.error(`  ✗ ${rel}  (${lastErr?.message ?? 'unknown error'})`)
        continue
      }
      await writeFile(outPath, buf)
      ok += 1
      console.log(`  ✓ ${rel}  (${(buf.length / 1024).toFixed(0)} KB)`)
      // Be polite to a free service.
      await sleep(600)
    }
  }

  console.log('')
  console.log(`Done — ${ok} generated, ${skipped} already existed, ${failed} failed.`)
  console.log(
    'Re-run with --force to regenerate everything, or pass a deck slug to limit scope.',
  )
}

await main()
