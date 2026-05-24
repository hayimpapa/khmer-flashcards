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
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation) values (deck_food_id, 'បាយ', 'bay', 'bye', 'rice (cooked)');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation) values (deck_food_id, 'អង្ករ', 'âng·kâ', 'ahng-kor', 'rice (uncooked)');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation) values (deck_food_id, 'សាច់មាន់', 'sach moan', 'sahk moan', 'chicken (meat)');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation) values (deck_food_id, 'ត្រី', 'trei', 'trey', 'fish');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation) values (deck_food_id, 'សាច់គោ', 'sach koo', 'sahk koh', 'beef');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation) values (deck_food_id, 'សាច់ជ្រូក', 'sach chrouk', 'sahk chrook', 'pork');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation) values (deck_food_id, 'បន្លែ', 'banlae', 'bahn-lai', 'vegetables');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation) values (deck_food_id, 'ផ្លែឈើ', 'phlae chheu', 'plai chuh', 'fruit');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation) values (deck_food_id, 'ស្ករ', 'skâ', 'skor', 'sugar');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation) values (deck_food_id, 'អំបិល', 'âmbel', 'um-bel', 'salt');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation) values (deck_food_id, 'ម្ទេស', 'mteh', 'm-teh', 'chili pepper');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation) values (deck_food_id, 'ខ្ទឹមបារាំង', 'khteum barang', 'k-teum bah-rang', 'onion');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation) values (deck_food_id, 'ខ្ទឹមស', 'khteum sââ', 'k-teum sah', 'garlic');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation) values (deck_food_id, 'នំប៉័ង', 'num pang', 'num pung', 'bread');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation) values (deck_food_id, 'ស៊ុត', 'sut', 'soot', 'egg');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation) values (deck_food_id, 'មី', 'mii', 'mee', 'noodles');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation) values (deck_food_id, 'ស៊ុប', 'sup', 'soup', 'soup');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation) values (deck_food_id, 'កាហ្វេ', 'kafee', 'kah-fay', 'coffee');
end $$;

-- Animals (17 cards)
do $$
declare
  deck_animals_id uuid;
begin
  insert into public.decks (name, description) values ('Animals', 'Domestic and wild animals you might see in Cambodia.') returning id into deck_animals_id;
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation) values (deck_animals_id, 'ឆ្មា', 'chhmaa', 'ch-mah', 'cat');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation) values (deck_animals_id, 'ឆ្កែ', 'chhkae', 'ch-kai', 'dog');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation) values (deck_animals_id, 'បក្សី', 'baksei', 'bahk-sey', 'bird');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation) values (deck_animals_id, 'ដំរី', 'damrei', 'dum-rey', 'elephant');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation) values (deck_animals_id, 'ពស់', 'puh', 'puh', 'snake');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation) values (deck_animals_id, 'គោ', 'koo', 'koh', 'cow');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation) values (deck_animals_id, 'ជ្រូក', 'chrouk', 'chrook', 'pig');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation) values (deck_animals_id, 'មាន់', 'moan', 'moan', 'chicken');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation) values (deck_animals_id, 'ទា', 'tia', 'tee-uh', 'duck');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation) values (deck_animals_id, 'សេះ', 'seh', 'seh', 'horse');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation) values (deck_animals_id, 'ខ្លា', 'khla', 'klah', 'tiger');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation) values (deck_animals_id, 'ស្វា', 'svaa', 'svah', 'monkey');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation) values (deck_animals_id, 'ទន្សាយ', 'tonsaay', 'ton-sigh', 'rabbit');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation) values (deck_animals_id, 'ត្រី', 'trei', 'trey', 'fish');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation) values (deck_animals_id, 'កង្កែប', 'kangkaep', 'kang-kape', 'frog');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation) values (deck_animals_id, 'ក្របី', 'krâbei', 'kruh-bey', 'water buffalo');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation) values (deck_animals_id, 'ពពែ', 'pupae', 'poo-pai', 'goat');
end $$;

-- Numbers (13 cards)
do $$
declare
  deck_numbers_id uuid;
begin
  insert into public.decks (name, description) values ('Numbers', 'Counting from one to ten in Khmer.') returning id into deck_numbers_id;
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation) values (deck_numbers_id, 'មួយ', 'muoy', 'mooey', 'one');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation) values (deck_numbers_id, 'ពីរ', 'pii', 'pee', 'two');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation) values (deck_numbers_id, 'បី', 'bei', 'bey', 'three');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation) values (deck_numbers_id, 'បួន', 'buon', 'boo-un', 'four');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation) values (deck_numbers_id, 'ប្រាំ', 'pram', 'pruhm', 'five');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation) values (deck_numbers_id, 'ប្រាំមួយ', 'pram muoy', 'pruhm mooey', 'six');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation) values (deck_numbers_id, 'ប្រាំពីរ', 'pram pii', 'pruhm pee', 'seven');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation) values (deck_numbers_id, 'ប្រាំបី', 'pram bei', 'pruhm bey', 'eight');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation) values (deck_numbers_id, 'ប្រាំបួន', 'pram buon', 'pruhm boo-un', 'nine');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation) values (deck_numbers_id, 'ដប់', 'dap', 'dop', 'ten');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation) values (deck_numbers_id, 'ដប់មួយ', 'dap muoy', 'dop mooey', 'eleven');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation) values (deck_numbers_id, 'ម្ភៃ', 'mphei', 'm-pay', 'twenty');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation) values (deck_numbers_id, 'មួយរយ', 'muoy rôy', 'mooey roy', 'one hundred');
end $$;

-- Greetings & Phrases (17 cards)
do $$
declare
  deck_greetings_id uuid;
begin
  insert into public.decks (name, description) values ('Greetings & Phrases', 'Everyday polite expressions to get conversations started.') returning id into deck_greetings_id;
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation) values (deck_greetings_id, 'សួស្តី', 'suosdei', 'soo-uhs-day', 'hello');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation) values (deck_greetings_id, 'លាហើយ', 'lia haey', 'lee-uh high', 'goodbye');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation) values (deck_greetings_id, 'អរគុណ', 'âkun', 'or-koon', 'thank you');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation) values (deck_greetings_id, 'សូមអភ័យទោស', 'som âphey tooh', 'sohm uh-pay-toh', 'sorry / excuse me');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation) values (deck_greetings_id, 'បាទ', 'baat', 'baht', 'yes (male speaker)');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation) values (deck_greetings_id, 'ចាស', 'chaa', 'chah', 'yes (female speaker)');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation) values (deck_greetings_id, 'ទេ', 'tee', 'tay', 'no');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation) values (deck_greetings_id, 'សុខសប្បាយទេ?', 'sok sabaay tee', 'sok suh-bye tay', 'how are you?');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation) values (deck_greetings_id, 'ខ្ញុំសុខសប្បាយ', 'khnhom sok sabaay', 'k-nyom sok suh-bye', 'I am well');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation) values (deck_greetings_id, 'សូម', 'som', 'sohm', 'please');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation) values (deck_greetings_id, 'ខ្ញុំឈ្មោះ', 'khnhom chhmuoh', 'k-nyom ch-moo-uh', 'my name is');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation) values (deck_greetings_id, 'អ្នកឈ្មោះអ្វី?', 'neak chhmuoh avei', 'nay-ak ch-moo-uh ah-vay', 'what''s your name?');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation) values (deck_greetings_id, 'រីករាយ', 'reek reay', 'reek ree-ay', 'happy / pleased');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation) values (deck_greetings_id, 'អត់អីទេ', 'ât ei tee', 'ot ay tay', 'it''s okay / you''re welcome');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation) values (deck_greetings_id, 'យល់ហើយ', 'yul haey', 'yull high', 'understood');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation) values (deck_greetings_id, 'អរុណសួស្ដី', 'arun suosdei', 'ah-roon soo-uhs-day', 'good morning');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation) values (deck_greetings_id, 'រាត្រីសួស្ដី', 'reatrei suosdei', 'ree-uh-trey soo-uhs-day', 'good night');
end $$;

-- Body Parts (12 cards)
do $$
declare
  deck_body_parts_id uuid;
begin
  insert into public.decks (name, description) values ('Body Parts', 'Words for parts of the body — useful at the doctor or for kids.') returning id into deck_body_parts_id;
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation) values (deck_body_parts_id, 'ក្បាល', 'kbaal', 'kuh-bahl', 'head');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation) values (deck_body_parts_id, 'ដៃ', 'dai', 'dye', 'hand');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation) values (deck_body_parts_id, 'ជើង', 'cheung', 'cherng', 'foot / leg');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation) values (deck_body_parts_id, 'ភ្នែក', 'phnek', 'puh-nake', 'eye');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation) values (deck_body_parts_id, 'ត្រចៀក', 'trâchiek', 'troh-cheek', 'ear');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation) values (deck_body_parts_id, 'ច្រមុះ', 'chrâmoh', 'chroh-moh', 'nose');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation) values (deck_body_parts_id, 'មាត់', 'moat', 'moht', 'mouth');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation) values (deck_body_parts_id, 'ធ្មេញ', 'thmenh', 't-meny', 'tooth');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation) values (deck_body_parts_id, 'សក់', 'sâk', 'sok', 'hair');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation) values (deck_body_parts_id, 'បេះដូង', 'beh doung', 'bay-doong', 'heart');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation) values (deck_body_parts_id, 'ពោះ', 'puoh', 'poh', 'belly / stomach');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation) values (deck_body_parts_id, 'ខ្នង', 'khnâng', 'k-nong', 'back');
end $$;

-- Colors (10 cards)
do $$
declare
  deck_colors_id uuid;
begin
  insert into public.decks (name, description) values ('Colors', 'Basic color vocabulary.') returning id into deck_colors_id;
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation) values (deck_colors_id, 'ក្រហម', 'krâhâm', 'kruh-hom', 'red');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation) values (deck_colors_id, 'ខៀវ', 'khiev', 'kee-uv', 'blue');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation) values (deck_colors_id, 'បៃតង', 'baitâng', 'bye-tong', 'green');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation) values (deck_colors_id, 'លឿង', 'leung', 'leu-ung', 'yellow');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation) values (deck_colors_id, 'ខ្មៅ', 'khmav', 'k-mao', 'black');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation) values (deck_colors_id, 'ស', 'sââ', 'sah', 'white');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation) values (deck_colors_id, 'ត្នោត', 'tnaot', 't-naot', 'brown');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation) values (deck_colors_id, 'ស្វាយ', 'svaay', 'svye', 'purple');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation) values (deck_colors_id, 'ប្រផេះ', 'prâpheh', 'pruh-peh', 'gray');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation) values (deck_colors_id, 'ផ្កាឈូក', 'phka chhouk', 'puh-kah chook', 'pink');
end $$;

-- Common Objects (14 cards)
do $$
declare
  deck_common_objects_id uuid;
begin
  insert into public.decks (name, description) values ('Common Objects', 'Things you see around the house and classroom every day.') returning id into deck_common_objects_id;
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation) values (deck_common_objects_id, 'ទឹក', 'teuk', 'took', 'water');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation) values (deck_common_objects_id, 'ផ្ទះ', 'phteah', 'p-teah', 'house');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation) values (deck_common_objects_id, 'ទ្វារ', 'tvear', 't-vear', 'door');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation) values (deck_common_objects_id, 'កៅអី', 'kav ei', 'kao-ay', 'chair');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation) values (deck_common_objects_id, 'តុ', 'tok', 'tok', 'table');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation) values (deck_common_objects_id, 'សៀវភៅ', 'siev phov', 'see-uv pov', 'book');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation) values (deck_common_objects_id, 'ប៊ិក', 'bik', 'bik', 'pen');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation) values (deck_common_objects_id, 'ខ្មៅដៃ', 'khmav dai', 'k-mao dye', 'pencil');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation) values (deck_common_objects_id, 'បង្អួច', 'bângouch', 'bong-ooch', 'window');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation) values (deck_common_objects_id, 'គ្រែ', 'krae', 'krai', 'bed');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation) values (deck_common_objects_id, 'ឡាន', 'laan', 'lahn', 'car');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation) values (deck_common_objects_id, 'កង់', 'kâng', 'kong', 'bicycle');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation) values (deck_common_objects_id, 'ទូរស័ព្ទ', 'turâsâp', 'too-rah-sup', 'telephone');
  insert into public.cards (deck_id, khmer_text, khmer_transliteration, english_phonetic, english_translation) values (deck_common_objects_id, 'ម៉ោង', 'maong', 'maong', 'clock / hour');
end $$;

commit;

-- Inserted 7 decks and 101 cards.
