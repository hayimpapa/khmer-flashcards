// 100 sample Khmer words across 7 decks. Used both for the local-storage
// fallback and as the source of truth for supabase/seed.sql (kept in sync
// by scripts/generate-seed-sql.mjs).

export const seedDecks = [
  {
    slug: 'food',
    name: 'Food',
    description: 'Everyday Cambodian foods, ingredients, and flavors.',
    cards: [
      { khmer_text: 'បាយ', khmer_transliteration: 'bay', english_phonetic: 'bye', english_translation: 'rice (cooked)' },
      { khmer_text: 'អង្ករ', khmer_transliteration: 'âng·kâ', english_phonetic: 'ahng-kor', english_translation: 'rice (uncooked)' },
      { khmer_text: 'សាច់មាន់', khmer_transliteration: 'sach moan', english_phonetic: 'sahk moan', english_translation: 'chicken (meat)' },
      { khmer_text: 'ត្រី', khmer_transliteration: 'trei', english_phonetic: 'trey', english_translation: 'fish' },
      { khmer_text: 'សាច់គោ', khmer_transliteration: 'sach koo', english_phonetic: 'sahk koh', english_translation: 'beef' },
      { khmer_text: 'សាច់ជ្រូក', khmer_transliteration: 'sach chrouk', english_phonetic: 'sahk chrook', english_translation: 'pork' },
      { khmer_text: 'បន្លែ', khmer_transliteration: 'banlae', english_phonetic: 'bahn-lai', english_translation: 'vegetables' },
      { khmer_text: 'ផ្លែឈើ', khmer_transliteration: 'phlae chheu', english_phonetic: 'plai chuh', english_translation: 'fruit' },
      { khmer_text: 'ស្ករ', khmer_transliteration: 'skâ', english_phonetic: 'skor', english_translation: 'sugar' },
      { khmer_text: 'អំបិល', khmer_transliteration: 'âmbel', english_phonetic: 'um-bel', english_translation: 'salt' },
      { khmer_text: 'ម្ទេស', khmer_transliteration: 'mteh', english_phonetic: 'm-teh', english_translation: 'chili pepper' },
      { khmer_text: 'ខ្ទឹមបារាំង', khmer_transliteration: 'khteum barang', english_phonetic: 'k-teum bah-rang', english_translation: 'onion' },
      { khmer_text: 'ខ្ទឹមស', khmer_transliteration: 'khteum sââ', english_phonetic: 'k-teum sah', english_translation: 'garlic' },
      { khmer_text: 'នំប៉័ង', khmer_transliteration: 'num pang', english_phonetic: 'num pung', english_translation: 'bread' },
      { khmer_text: 'ស៊ុត', khmer_transliteration: 'sut', english_phonetic: 'soot', english_translation: 'egg' },
      { khmer_text: 'មី', khmer_transliteration: 'mii', english_phonetic: 'mee', english_translation: 'noodles' },
      { khmer_text: 'ស៊ុប', khmer_transliteration: 'sup', english_phonetic: 'soup', english_translation: 'soup' },
      { khmer_text: 'កាហ្វេ', khmer_transliteration: 'kafee', english_phonetic: 'kah-fay', english_translation: 'coffee' },
    ],
  },
  {
    slug: 'animals',
    name: 'Animals',
    description: 'Domestic and wild animals you might see in Cambodia.',
    cards: [
      { khmer_text: 'ឆ្មា', khmer_transliteration: 'chhmaa', english_phonetic: 'ch-mah', english_translation: 'cat' },
      { khmer_text: 'ឆ្កែ', khmer_transliteration: 'chhkae', english_phonetic: 'ch-kai', english_translation: 'dog' },
      { khmer_text: 'បក្សី', khmer_transliteration: 'baksei', english_phonetic: 'bahk-sey', english_translation: 'bird' },
      { khmer_text: 'ដំរី', khmer_transliteration: 'damrei', english_phonetic: 'dum-rey', english_translation: 'elephant' },
      { khmer_text: 'ពស់', khmer_transliteration: 'puh', english_phonetic: 'puh', english_translation: 'snake' },
      { khmer_text: 'គោ', khmer_transliteration: 'koo', english_phonetic: 'koh', english_translation: 'cow' },
      { khmer_text: 'ជ្រូក', khmer_transliteration: 'chrouk', english_phonetic: 'chrook', english_translation: 'pig' },
      { khmer_text: 'មាន់', khmer_transliteration: 'moan', english_phonetic: 'moan', english_translation: 'chicken' },
      { khmer_text: 'ទា', khmer_transliteration: 'tia', english_phonetic: 'tee-uh', english_translation: 'duck' },
      { khmer_text: 'សេះ', khmer_transliteration: 'seh', english_phonetic: 'seh', english_translation: 'horse' },
      { khmer_text: 'ខ្លា', khmer_transliteration: 'khla', english_phonetic: 'klah', english_translation: 'tiger' },
      { khmer_text: 'ស្វា', khmer_transliteration: 'svaa', english_phonetic: 'svah', english_translation: 'monkey' },
      { khmer_text: 'ទន្សាយ', khmer_transliteration: 'tonsaay', english_phonetic: 'ton-sigh', english_translation: 'rabbit' },
      { khmer_text: 'ត្រី', khmer_transliteration: 'trei', english_phonetic: 'trey', english_translation: 'fish' },
      { khmer_text: 'កង្កែប', khmer_transliteration: 'kangkaep', english_phonetic: 'kang-kape', english_translation: 'frog' },
      { khmer_text: 'ក្របី', khmer_transliteration: 'krâbei', english_phonetic: 'kruh-bey', english_translation: 'water buffalo' },
      { khmer_text: 'ពពែ', khmer_transliteration: 'pupae', english_phonetic: 'poo-pai', english_translation: 'goat' },
    ],
  },
  {
    slug: 'numbers',
    name: 'Numbers',
    description: 'Counting from one to ten in Khmer.',
    cards: [
      { khmer_text: 'មួយ', khmer_transliteration: 'muoy', english_phonetic: 'mooey', english_translation: 'one' },
      { khmer_text: 'ពីរ', khmer_transliteration: 'pii', english_phonetic: 'pee', english_translation: 'two' },
      { khmer_text: 'បី', khmer_transliteration: 'bei', english_phonetic: 'bey', english_translation: 'three' },
      { khmer_text: 'បួន', khmer_transliteration: 'buon', english_phonetic: 'boo-un', english_translation: 'four' },
      { khmer_text: 'ប្រាំ', khmer_transliteration: 'pram', english_phonetic: 'pruhm', english_translation: 'five' },
      { khmer_text: 'ប្រាំមួយ', khmer_transliteration: 'pram muoy', english_phonetic: 'pruhm mooey', english_translation: 'six' },
      { khmer_text: 'ប្រាំពីរ', khmer_transliteration: 'pram pii', english_phonetic: 'pruhm pee', english_translation: 'seven' },
      { khmer_text: 'ប្រាំបី', khmer_transliteration: 'pram bei', english_phonetic: 'pruhm bey', english_translation: 'eight' },
      { khmer_text: 'ប្រាំបួន', khmer_transliteration: 'pram buon', english_phonetic: 'pruhm boo-un', english_translation: 'nine' },
      { khmer_text: 'ដប់', khmer_transliteration: 'dap', english_phonetic: 'dop', english_translation: 'ten' },
      { khmer_text: 'ដប់មួយ', khmer_transliteration: 'dap muoy', english_phonetic: 'dop mooey', english_translation: 'eleven' },
      { khmer_text: 'ម្ភៃ', khmer_transliteration: 'mphei', english_phonetic: 'm-pay', english_translation: 'twenty' },
      { khmer_text: 'មួយរយ', khmer_transliteration: 'muoy rôy', english_phonetic: 'mooey roy', english_translation: 'one hundred' },
    ],
  },
  {
    slug: 'greetings',
    name: 'Greetings & Phrases',
    description: 'Everyday polite expressions to get conversations started.',
    cards: [
      { khmer_text: 'សួស្តី', khmer_transliteration: 'suosdei', english_phonetic: 'soo-uhs-day', english_translation: 'hello' },
      { khmer_text: 'លាហើយ', khmer_transliteration: 'lia haey', english_phonetic: 'lee-uh high', english_translation: 'goodbye' },
      { khmer_text: 'អរគុណ', khmer_transliteration: 'âkun', english_phonetic: 'or-koon', english_translation: 'thank you' },
      { khmer_text: 'សូមអភ័យទោស', khmer_transliteration: 'som âphey tooh', english_phonetic: 'sohm uh-pay-toh', english_translation: 'sorry / excuse me' },
      { khmer_text: 'បាទ', khmer_transliteration: 'baat', english_phonetic: 'baht', english_translation: 'yes (male speaker)' },
      { khmer_text: 'ចាស', khmer_transliteration: 'chaa', english_phonetic: 'chah', english_translation: 'yes (female speaker)' },
      { khmer_text: 'ទេ', khmer_transliteration: 'tee', english_phonetic: 'tay', english_translation: 'no' },
      { khmer_text: 'សុខសប្បាយទេ?', khmer_transliteration: 'sok sabaay tee', english_phonetic: 'sok suh-bye tay', english_translation: 'how are you?' },
      { khmer_text: 'ខ្ញុំសុខសប្បាយ', khmer_transliteration: 'khnhom sok sabaay', english_phonetic: 'k-nyom sok suh-bye', english_translation: 'I am well' },
      { khmer_text: 'សូម', khmer_transliteration: 'som', english_phonetic: 'sohm', english_translation: 'please' },
      { khmer_text: 'ខ្ញុំឈ្មោះ', khmer_transliteration: 'khnhom chhmuoh', english_phonetic: 'k-nyom ch-moo-uh', english_translation: 'my name is' },
      { khmer_text: 'អ្នកឈ្មោះអ្វី?', khmer_transliteration: 'neak chhmuoh avei', english_phonetic: 'nay-ak ch-moo-uh ah-vay', english_translation: "what's your name?" },
      { khmer_text: 'រីករាយ', khmer_transliteration: 'reek reay', english_phonetic: 'reek ree-ay', english_translation: 'happy / pleased' },
      { khmer_text: 'អត់អីទេ', khmer_transliteration: 'ât ei tee', english_phonetic: 'ot ay tay', english_translation: "it's okay / you're welcome" },
      { khmer_text: 'យល់ហើយ', khmer_transliteration: 'yul haey', english_phonetic: 'yull high', english_translation: 'understood' },
      { khmer_text: 'អរុណសួស្ដី', khmer_transliteration: 'arun suosdei', english_phonetic: 'ah-roon soo-uhs-day', english_translation: 'good morning' },
      { khmer_text: 'រាត្រីសួស្ដី', khmer_transliteration: 'reatrei suosdei', english_phonetic: 'ree-uh-trey soo-uhs-day', english_translation: 'good night' },
    ],
  },
  {
    slug: 'body-parts',
    name: 'Body Parts',
    description: 'Words for parts of the body — useful at the doctor or for kids.',
    cards: [
      { khmer_text: 'ក្បាល', khmer_transliteration: 'kbaal', english_phonetic: 'kuh-bahl', english_translation: 'head' },
      { khmer_text: 'ដៃ', khmer_transliteration: 'dai', english_phonetic: 'dye', english_translation: 'hand' },
      { khmer_text: 'ជើង', khmer_transliteration: 'cheung', english_phonetic: 'cherng', english_translation: 'foot / leg' },
      { khmer_text: 'ភ្នែក', khmer_transliteration: 'phnek', english_phonetic: 'puh-nake', english_translation: 'eye' },
      { khmer_text: 'ត្រចៀក', khmer_transliteration: 'trâchiek', english_phonetic: 'troh-cheek', english_translation: 'ear' },
      { khmer_text: 'ច្រមុះ', khmer_transliteration: 'chrâmoh', english_phonetic: 'chroh-moh', english_translation: 'nose' },
      { khmer_text: 'មាត់', khmer_transliteration: 'moat', english_phonetic: 'moht', english_translation: 'mouth' },
      { khmer_text: 'ធ្មេញ', khmer_transliteration: 'thmenh', english_phonetic: 't-meny', english_translation: 'tooth' },
      { khmer_text: 'សក់', khmer_transliteration: 'sâk', english_phonetic: 'sok', english_translation: 'hair' },
      { khmer_text: 'បេះដូង', khmer_transliteration: 'beh doung', english_phonetic: 'bay-doong', english_translation: 'heart' },
      { khmer_text: 'ពោះ', khmer_transliteration: 'puoh', english_phonetic: 'poh', english_translation: 'belly / stomach' },
      { khmer_text: 'ខ្នង', khmer_transliteration: 'khnâng', english_phonetic: 'k-nong', english_translation: 'back' },
    ],
  },
  {
    slug: 'colors',
    name: 'Colors',
    description: 'Basic color vocabulary.',
    cards: [
      { khmer_text: 'ក្រហម', khmer_transliteration: 'krâhâm', english_phonetic: 'kruh-hom', english_translation: 'red' },
      { khmer_text: 'ខៀវ', khmer_transliteration: 'khiev', english_phonetic: 'kee-uv', english_translation: 'blue' },
      { khmer_text: 'បៃតង', khmer_transliteration: 'baitâng', english_phonetic: 'bye-tong', english_translation: 'green' },
      { khmer_text: 'លឿង', khmer_transliteration: 'leung', english_phonetic: 'leu-ung', english_translation: 'yellow' },
      { khmer_text: 'ខ្មៅ', khmer_transliteration: 'khmav', english_phonetic: 'k-mao', english_translation: 'black' },
      { khmer_text: 'ស', khmer_transliteration: 'sââ', english_phonetic: 'sah', english_translation: 'white' },
      { khmer_text: 'ត្នោត', khmer_transliteration: 'tnaot', english_phonetic: 't-naot', english_translation: 'brown' },
      { khmer_text: 'ស្វាយ', khmer_transliteration: 'svaay', english_phonetic: 'svye', english_translation: 'purple' },
      { khmer_text: 'ប្រផេះ', khmer_transliteration: 'prâpheh', english_phonetic: 'pruh-peh', english_translation: 'gray' },
      { khmer_text: 'ផ្កាឈូក', khmer_transliteration: 'phka chhouk', english_phonetic: 'puh-kah chook', english_translation: 'pink' },
    ],
  },
  {
    slug: 'common-objects',
    name: 'Common Objects',
    description: 'Things you see around the house and classroom every day.',
    cards: [
      { khmer_text: 'ទឹក', khmer_transliteration: 'teuk', english_phonetic: 'took', english_translation: 'water' },
      { khmer_text: 'ផ្ទះ', khmer_transliteration: 'phteah', english_phonetic: 'p-teah', english_translation: 'house' },
      { khmer_text: 'ទ្វារ', khmer_transliteration: 'tvear', english_phonetic: 't-vear', english_translation: 'door' },
      { khmer_text: 'កៅអី', khmer_transliteration: 'kav ei', english_phonetic: 'kao-ay', english_translation: 'chair' },
      { khmer_text: 'តុ', khmer_transliteration: 'tok', english_phonetic: 'tok', english_translation: 'table' },
      { khmer_text: 'សៀវភៅ', khmer_transliteration: 'siev phov', english_phonetic: 'see-uv pov', english_translation: 'book' },
      { khmer_text: 'ប៊ិក', khmer_transliteration: 'bik', english_phonetic: 'bik', english_translation: 'pen' },
      { khmer_text: 'ខ្មៅដៃ', khmer_transliteration: 'khmav dai', english_phonetic: 'k-mao dye', english_translation: 'pencil' },
      { khmer_text: 'បង្អួច', khmer_transliteration: 'bângouch', english_phonetic: 'bong-ooch', english_translation: 'window' },
      { khmer_text: 'គ្រែ', khmer_transliteration: 'krae', english_phonetic: 'krai', english_translation: 'bed' },
      { khmer_text: 'ឡាន', khmer_transliteration: 'laan', english_phonetic: 'lahn', english_translation: 'car' },
      { khmer_text: 'កង់', khmer_transliteration: 'kâng', english_phonetic: 'kong', english_translation: 'bicycle' },
      { khmer_text: 'ទូរស័ព្ទ', khmer_transliteration: 'turâsâp', english_phonetic: 'too-rah-sup', english_translation: 'telephone' },
      { khmer_text: 'ម៉ោង', khmer_transliteration: 'maong', english_phonetic: 'maong', english_translation: 'clock / hour' },
    ],
  },
]

export const totalSeedCards = seedDecks.reduce((n, d) => n + d.cards.length, 0)

// Convention used by both the localStorage hydration and the SQL seed
// (and by scripts/generate-images.mjs when it saves files). Keep in
// sync with the slugify in that script.
export function slugifyForImage(s) {
  return String(s)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function seedImagePath(deckSlug, englishTranslation) {
  return `/images/${deckSlug}/${slugifyForImage(englishTranslation)}.jpg`
}
