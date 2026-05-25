-- Khmer Flashcards — Supabase schema + seed data
-- Generated from src/lib/seedData.js. Paste into the Supabase SQL editor.
-- Safe to re-run: drops and recreates the tables.

begin;

-- ── Schema ──────────────────────────────────────────────────────────────
drop table if exists public.cards cascade;
drop table if exists public.decks cascade;

create table public.decks (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  description text,
  created_at  timestamptz not null default now()
);

create table public.cards (
  id                    uuid primary key default gen_random_uuid(),
  deck_id               uuid not null references public.decks(id) on delete cascade,
  khmer_text            text not null,
  khmer_transliteration text not null default '',
  english_phonetic      text not null default '',
  english_translation   text not null,
  image_url             text,
  created_at            timestamptz not null default now()
);

create index cards_deck_id_idx on public.cards (deck_id);

-- Enable Row Level Security and allow anonymous read/write for the MVP.
-- Tighten these policies (e.g. require auth.uid()) before going to production.
alter table public.decks enable row level security;
alter table public.cards enable row level security;

create policy "public read decks"   on public.decks for select using (true);
create policy "public write decks"  on public.decks for all    using (true) with check (true);
create policy "public read cards"   on public.cards for select using (true);
create policy "public write cards"  on public.cards for all    using (true) with check (true);

-- ── Seed data ───────────────────────────────────────────────────────────

-- Food (18 cards)
do $$
declare
  deck_food_id uuid;
begin
  insert into public.decks (name, description) values ('Food', 'Everyday Cambodian foods, ingredients, and flavors.') returning id into deck_food_id;
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation, image_url) values (deck_food_id, 'បាយ', 'bay', 'bye', 'rice (cooked)', '/images/food/rice-cooked.jpg');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation, image_url) values (deck_food_id, 'អង្ករ', 'âng·kâ', 'ahng-kor', 'rice (uncooked)', '/images/food/rice-uncooked.jpg');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation, image_url) values (deck_food_id, 'សាច់មាន់', 'sach moan', 'sahk moan', 'chicken (meat)', '/images/food/chicken-meat.jpg');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation, image_url) values (deck_food_id, 'ត្រី', 'trei', 'trey', 'fish', '/images/food/fish.jpg');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation, image_url) values (deck_food_id, 'សាច់គោ', 'sach koo', 'sahk koh', 'beef', '/images/food/beef.jpg');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation, image_url) values (deck_food_id, 'សាច់ជ្រូក', 'sach chrouk', 'sahk chrook', 'pork', '/images/food/pork.jpg');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation, image_url) values (deck_food_id, 'បន្លែ', 'banlae', 'bahn-lai', 'vegetables', '/images/food/vegetables.jpg');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation, image_url) values (deck_food_id, 'ផ្លែឈើ', 'phlae chheu', 'plai chuh', 'fruit', '/images/food/fruit.jpg');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation, image_url) values (deck_food_id, 'ស្ករ', 'skâ', 'skor', 'sugar', '/images/food/sugar.jpg');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation, image_url) values (deck_food_id, 'អំបិល', 'âmbel', 'um-bel', 'salt', '/images/food/salt.jpg');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation, image_url) values (deck_food_id, 'ម្ទេស', 'mteh', 'm-teh', 'chili pepper', '/images/food/chili-pepper.jpg');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation, image_url) values (deck_food_id, 'ខ្ទឹមបារាំង', 'khteum barang', 'k-teum bah-rang', 'onion', '/images/food/onion.jpg');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation, image_url) values (deck_food_id, 'ខ្ទឹមស', 'khteum sââ', 'k-teum sah', 'garlic', '/images/food/garlic.jpg');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation, image_url) values (deck_food_id, 'នំប៉័ង', 'num pang', 'num pung', 'bread', '/images/food/bread.jpg');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation, image_url) values (deck_food_id, 'ស៊ុត', 'sut', 'soot', 'egg', '/images/food/egg.jpg');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation, image_url) values (deck_food_id, 'មី', 'mii', 'mee', 'noodles', '/images/food/noodles.jpg');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation, image_url) values (deck_food_id, 'ស៊ុប', 'sup', 'soup', 'soup', '/images/food/soup.jpg');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation, image_url) values (deck_food_id, 'កាហ្វេ', 'kafee', 'kah-fay', 'coffee', '/images/food/coffee.jpg');
end $$;

-- Animals (17 cards)
do $$
declare
  deck_animals_id uuid;
begin
  insert into public.decks (name, description) values ('Animals', 'Domestic and wild animals you might see in Cambodia.') returning id into deck_animals_id;
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation, image_url) values (deck_animals_id, 'ឆ្មា', 'chhmaa', 'ch-mah', 'cat', '/images/animals/cat.jpg');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation, image_url) values (deck_animals_id, 'ឆ្កែ', 'chhkae', 'ch-kai', 'dog', '/images/animals/dog.jpg');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation, image_url) values (deck_animals_id, 'បក្សី', 'baksei', 'bahk-sey', 'bird', '/images/animals/bird.jpg');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation, image_url) values (deck_animals_id, 'ដំរី', 'damrei', 'dum-rey', 'elephant', '/images/animals/elephant.jpg');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation, image_url) values (deck_animals_id, 'ពស់', 'puh', 'puh', 'snake', '/images/animals/snake.jpg');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation, image_url) values (deck_animals_id, 'គោ', 'koo', 'koh', 'cow', '/images/animals/cow.jpg');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation, image_url) values (deck_animals_id, 'ជ្រូក', 'chrouk', 'chrook', 'pig', '/images/animals/pig.jpg');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation, image_url) values (deck_animals_id, 'មាន់', 'moan', 'moan', 'chicken', '/images/animals/chicken.jpg');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation, image_url) values (deck_animals_id, 'ទា', 'tia', 'tee-uh', 'duck', '/images/animals/duck.jpg');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation, image_url) values (deck_animals_id, 'សេះ', 'seh', 'seh', 'horse', '/images/animals/horse.jpg');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation, image_url) values (deck_animals_id, 'ខ្លា', 'khla', 'klah', 'tiger', '/images/animals/tiger.jpg');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation, image_url) values (deck_animals_id, 'ស្វា', 'svaa', 'svah', 'monkey', '/images/animals/monkey.jpg');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation, image_url) values (deck_animals_id, 'ទន្សាយ', 'tonsaay', 'ton-sigh', 'rabbit', '/images/animals/rabbit.jpg');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation, image_url) values (deck_animals_id, 'ត្រី', 'trei', 'trey', 'fish', '/images/animals/fish.jpg');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation, image_url) values (deck_animals_id, 'កង្កែប', 'kangkaep', 'kang-kape', 'frog', '/images/animals/frog.jpg');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation, image_url) values (deck_animals_id, 'ក្របី', 'krâbei', 'kruh-bey', 'water buffalo', '/images/animals/water-buffalo.jpg');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation, image_url) values (deck_animals_id, 'ពពែ', 'pupae', 'poo-pai', 'goat', '/images/animals/goat.jpg');
end $$;

-- Numbers (13 cards)
do $$
declare
  deck_numbers_id uuid;
begin
  insert into public.decks (name, description) values ('Numbers', 'Counting from one to ten in Khmer.') returning id into deck_numbers_id;
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation, image_url) values (deck_numbers_id, 'មួយ', 'muoy', 'mooey', 'one', '/images/numbers/one.jpg');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation, image_url) values (deck_numbers_id, 'ពីរ', 'pii', 'pee', 'two', '/images/numbers/two.jpg');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation, image_url) values (deck_numbers_id, 'បី', 'bei', 'bey', 'three', '/images/numbers/three.jpg');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation, image_url) values (deck_numbers_id, 'បួន', 'buon', 'boo-un', 'four', '/images/numbers/four.jpg');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation, image_url) values (deck_numbers_id, 'ប្រាំ', 'pram', 'pruhm', 'five', '/images/numbers/five.jpg');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation, image_url) values (deck_numbers_id, 'ប្រាំមួយ', 'pram muoy', 'pruhm mooey', 'six', '/images/numbers/six.jpg');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation, image_url) values (deck_numbers_id, 'ប្រាំពីរ', 'pram pii', 'pruhm pee', 'seven', '/images/numbers/seven.jpg');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation, image_url) values (deck_numbers_id, 'ប្រាំបី', 'pram bei', 'pruhm bey', 'eight', '/images/numbers/eight.jpg');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation, image_url) values (deck_numbers_id, 'ប្រាំបួន', 'pram buon', 'pruhm boo-un', 'nine', '/images/numbers/nine.jpg');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation, image_url) values (deck_numbers_id, 'ដប់', 'dap', 'dop', 'ten', '/images/numbers/ten.jpg');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation, image_url) values (deck_numbers_id, 'ដប់មួយ', 'dap muoy', 'dop mooey', 'eleven', '/images/numbers/eleven.jpg');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation, image_url) values (deck_numbers_id, 'ម្ភៃ', 'mphei', 'm-pay', 'twenty', '/images/numbers/twenty.jpg');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation, image_url) values (deck_numbers_id, 'មួយរយ', 'muoy rôy', 'mooey roy', 'one hundred', '/images/numbers/one-hundred.jpg');
end $$;

-- Greetings & Phrases (17 cards)
do $$
declare
  deck_greetings_id uuid;
begin
  insert into public.decks (name, description) values ('Greetings & Phrases', 'Everyday polite expressions to get conversations started.') returning id into deck_greetings_id;
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation, image_url) values (deck_greetings_id, 'សួស្តី', 'suosdei', 'soo-uhs-day', 'hello', '/images/greetings/hello.jpg');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation, image_url) values (deck_greetings_id, 'លាហើយ', 'lia haey', 'lee-uh high', 'goodbye', '/images/greetings/goodbye.jpg');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation, image_url) values (deck_greetings_id, 'អរគុណ', 'âkun', 'or-koon', 'thank you', '/images/greetings/thank-you.jpg');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation, image_url) values (deck_greetings_id, 'សូមអភ័យទោស', 'som âphey tooh', 'sohm uh-pay-toh', 'sorry / excuse me', '/images/greetings/sorry-excuse-me.jpg');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation, image_url) values (deck_greetings_id, 'បាទ', 'baat', 'baht', 'yes (male speaker)', '/images/greetings/yes-male-speaker.jpg');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation, image_url) values (deck_greetings_id, 'ចាស', 'chaa', 'chah', 'yes (female speaker)', '/images/greetings/yes-female-speaker.jpg');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation, image_url) values (deck_greetings_id, 'ទេ', 'tee', 'tay', 'no', '/images/greetings/no.jpg');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation, image_url) values (deck_greetings_id, 'សុខសប្បាយទេ?', 'sok sabaay tee', 'sok suh-bye tay', 'how are you?', '/images/greetings/how-are-you.jpg');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation, image_url) values (deck_greetings_id, 'ខ្ញុំសុខសប្បាយ', 'khnhom sok sabaay', 'k-nyom sok suh-bye', 'I am well', '/images/greetings/i-am-well.jpg');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation, image_url) values (deck_greetings_id, 'សូម', 'som', 'sohm', 'please', '/images/greetings/please.jpg');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation, image_url) values (deck_greetings_id, 'ខ្ញុំឈ្មោះ', 'khnhom chhmuoh', 'k-nyom ch-moo-uh', 'my name is', '/images/greetings/my-name-is.jpg');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation, image_url) values (deck_greetings_id, 'អ្នកឈ្មោះអ្វី?', 'neak chhmuoh avei', 'nay-ak ch-moo-uh ah-vay', 'what''s your name?', '/images/greetings/what-s-your-name.jpg');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation, image_url) values (deck_greetings_id, 'រីករាយ', 'reek reay', 'reek ree-ay', 'happy / pleased', '/images/greetings/happy-pleased.jpg');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation, image_url) values (deck_greetings_id, 'អត់អីទេ', 'ât ei tee', 'ot ay tay', 'it''s okay / you''re welcome', '/images/greetings/it-s-okay-you-re-welcome.jpg');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation, image_url) values (deck_greetings_id, 'យល់ហើយ', 'yul haey', 'yull high', 'understood', '/images/greetings/understood.jpg');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation, image_url) values (deck_greetings_id, 'អរុណសួស្ដី', 'arun suosdei', 'ah-roon soo-uhs-day', 'good morning', '/images/greetings/good-morning.jpg');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation, image_url) values (deck_greetings_id, 'រាត្រីសួស្ដី', 'reatrei suosdei', 'ree-uh-trey soo-uhs-day', 'good night', '/images/greetings/good-night.jpg');
end $$;

-- Body Parts (12 cards)
do $$
declare
  deck_body_parts_id uuid;
begin
  insert into public.decks (name, description) values ('Body Parts', 'Words for parts of the body — useful at the doctor or for kids.') returning id into deck_body_parts_id;
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation, image_url) values (deck_body_parts_id, 'ក្បាល', 'kbaal', 'kuh-bahl', 'head', '/images/body-parts/head.jpg');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation, image_url) values (deck_body_parts_id, 'ដៃ', 'dai', 'dye', 'hand', '/images/body-parts/hand.jpg');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation, image_url) values (deck_body_parts_id, 'ជើង', 'cheung', 'cherng', 'foot / leg', '/images/body-parts/foot-leg.jpg');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation, image_url) values (deck_body_parts_id, 'ភ្នែក', 'phnek', 'puh-nake', 'eye', '/images/body-parts/eye.jpg');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation, image_url) values (deck_body_parts_id, 'ត្រចៀក', 'trâchiek', 'troh-cheek', 'ear', '/images/body-parts/ear.jpg');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation, image_url) values (deck_body_parts_id, 'ច្រមុះ', 'chrâmoh', 'chroh-moh', 'nose', '/images/body-parts/nose.jpg');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation, image_url) values (deck_body_parts_id, 'មាត់', 'moat', 'moht', 'mouth', '/images/body-parts/mouth.jpg');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation, image_url) values (deck_body_parts_id, 'ធ្មេញ', 'thmenh', 't-meny', 'tooth', '/images/body-parts/tooth.jpg');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation, image_url) values (deck_body_parts_id, 'សក់', 'sâk', 'sok', 'hair', '/images/body-parts/hair.jpg');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation, image_url) values (deck_body_parts_id, 'បេះដូង', 'beh doung', 'bay-doong', 'heart', '/images/body-parts/heart.jpg');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation, image_url) values (deck_body_parts_id, 'ពោះ', 'puoh', 'poh', 'belly / stomach', '/images/body-parts/belly-stomach.jpg');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation, image_url) values (deck_body_parts_id, 'ខ្នង', 'khnâng', 'k-nong', 'back', '/images/body-parts/back.jpg');
end $$;

-- Colors (10 cards)
do $$
declare
  deck_colors_id uuid;
begin
  insert into public.decks (name, description) values ('Colors', 'Basic color vocabulary.') returning id into deck_colors_id;
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation, image_url) values (deck_colors_id, 'ក្រហម', 'krâhâm', 'kruh-hom', 'red', '/images/colors/red.jpg');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation, image_url) values (deck_colors_id, 'ខៀវ', 'khiev', 'kee-uv', 'blue', '/images/colors/blue.jpg');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation, image_url) values (deck_colors_id, 'បៃតង', 'baitâng', 'bye-tong', 'green', '/images/colors/green.jpg');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation, image_url) values (deck_colors_id, 'លឿង', 'leung', 'leu-ung', 'yellow', '/images/colors/yellow.jpg');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation, image_url) values (deck_colors_id, 'ខ្មៅ', 'khmav', 'k-mao', 'black', '/images/colors/black.jpg');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation, image_url) values (deck_colors_id, 'ស', 'sââ', 'sah', 'white', '/images/colors/white.jpg');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation, image_url) values (deck_colors_id, 'ត្នោត', 'tnaot', 't-naot', 'brown', '/images/colors/brown.jpg');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation, image_url) values (deck_colors_id, 'ស្វាយ', 'svaay', 'svye', 'purple', '/images/colors/purple.jpg');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation, image_url) values (deck_colors_id, 'ប្រផេះ', 'prâpheh', 'pruh-peh', 'gray', '/images/colors/gray.jpg');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation, image_url) values (deck_colors_id, 'ផ្កាឈូក', 'phka chhouk', 'puh-kah chook', 'pink', '/images/colors/pink.jpg');
end $$;

-- Common Objects (14 cards)
do $$
declare
  deck_common_objects_id uuid;
begin
  insert into public.decks (name, description) values ('Common Objects', 'Things you see around the house and classroom every day.') returning id into deck_common_objects_id;
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation, image_url) values (deck_common_objects_id, 'ទឹក', 'teuk', 'took', 'water', '/images/common-objects/water.jpg');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation, image_url) values (deck_common_objects_id, 'ផ្ទះ', 'phteah', 'p-teah', 'house', '/images/common-objects/house.jpg');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation, image_url) values (deck_common_objects_id, 'ទ្វារ', 'tvear', 't-vear', 'door', '/images/common-objects/door.jpg');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation, image_url) values (deck_common_objects_id, 'កៅអី', 'kav ei', 'kao-ay', 'chair', '/images/common-objects/chair.jpg');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation, image_url) values (deck_common_objects_id, 'តុ', 'tok', 'tok', 'table', '/images/common-objects/table.jpg');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation, image_url) values (deck_common_objects_id, 'សៀវភៅ', 'siev phov', 'see-uv pov', 'book', '/images/common-objects/book.jpg');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation, image_url) values (deck_common_objects_id, 'ប៊ិក', 'bik', 'bik', 'pen', '/images/common-objects/pen.jpg');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation, image_url) values (deck_common_objects_id, 'ខ្មៅដៃ', 'khmav dai', 'k-mao dye', 'pencil', '/images/common-objects/pencil.jpg');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation, image_url) values (deck_common_objects_id, 'បង្អួច', 'bângouch', 'bong-ooch', 'window', '/images/common-objects/window.jpg');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation, image_url) values (deck_common_objects_id, 'គ្រែ', 'krae', 'krai', 'bed', '/images/common-objects/bed.jpg');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation, image_url) values (deck_common_objects_id, 'ឡាន', 'laan', 'lahn', 'car', '/images/common-objects/car.jpg');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation, image_url) values (deck_common_objects_id, 'កង់', 'kâng', 'kong', 'bicycle', '/images/common-objects/bicycle.jpg');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation, image_url) values (deck_common_objects_id, 'ទូរស័ព្ទ', 'turâsâp', 'too-rah-sup', 'telephone', '/images/common-objects/telephone.jpg');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation, image_url) values (deck_common_objects_id, 'ម៉ោង', 'maong', 'maong', 'clock / hour', '/images/common-objects/clock-hour.jpg');
end $$;

commit;

-- Inserted 7 decks and 101 cards.
