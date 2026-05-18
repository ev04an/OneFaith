// One-shot script: downloads the full WEB Bible from bolls.life into
// assets/bible.json. Run with `node scripts/fetch-bible.mjs`.
// Endpoint: GET https://bolls.life/get-text/WEB/{bookNum}/{chapter}/
// Response: [{ pk, verse, text }, ...]
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = resolve(ROOT, 'assets', 'bible.json');

const BOOKS = [
  { id: 'gen', num: 1, name: 'Genesis', chapters: 50 },
  { id: 'exo', num: 2, name: 'Exodus', chapters: 40 },
  { id: 'lev', num: 3, name: 'Leviticus', chapters: 27 },
  { id: 'num', num: 4, name: 'Numbers', chapters: 36 },
  { id: 'deu', num: 5, name: 'Deuteronomy', chapters: 34 },
  { id: 'jos', num: 6, name: 'Joshua', chapters: 24 },
  { id: 'jdg', num: 7, name: 'Judges', chapters: 21 },
  { id: 'rut', num: 8, name: 'Ruth', chapters: 4 },
  { id: '1sa', num: 9, name: '1 Samuel', chapters: 31 },
  { id: '2sa', num: 10, name: '2 Samuel', chapters: 24 },
  { id: '1ki', num: 11, name: '1 Kings', chapters: 22 },
  { id: '2ki', num: 12, name: '2 Kings', chapters: 25 },
  { id: '1ch', num: 13, name: '1 Chronicles', chapters: 29 },
  { id: '2ch', num: 14, name: '2 Chronicles', chapters: 36 },
  { id: 'ezr', num: 15, name: 'Ezra', chapters: 10 },
  { id: 'neh', num: 16, name: 'Nehemiah', chapters: 13 },
  { id: 'est', num: 17, name: 'Esther', chapters: 10 },
  { id: 'job', num: 18, name: 'Job', chapters: 42 },
  { id: 'psa', num: 19, name: 'Psalms', chapters: 150 },
  { id: 'pro', num: 20, name: 'Proverbs', chapters: 31 },
  { id: 'ecc', num: 21, name: 'Ecclesiastes', chapters: 12 },
  { id: 'sos', num: 22, name: 'Song of Solomon', chapters: 8 },
  { id: 'isa', num: 23, name: 'Isaiah', chapters: 66 },
  { id: 'jer', num: 24, name: 'Jeremiah', chapters: 52 },
  { id: 'lam', num: 25, name: 'Lamentations', chapters: 5 },
  { id: 'eze', num: 26, name: 'Ezekiel', chapters: 48 },
  { id: 'dan', num: 27, name: 'Daniel', chapters: 12 },
  { id: 'hos', num: 28, name: 'Hosea', chapters: 14 },
  { id: 'joe', num: 29, name: 'Joel', chapters: 3 },
  { id: 'amo', num: 30, name: 'Amos', chapters: 9 },
  { id: 'oba', num: 31, name: 'Obadiah', chapters: 1 },
  { id: 'jon', num: 32, name: 'Jonah', chapters: 4 },
  { id: 'mic', num: 33, name: 'Micah', chapters: 7 },
  { id: 'nah', num: 34, name: 'Nahum', chapters: 3 },
  { id: 'hab', num: 35, name: 'Habakkuk', chapters: 3 },
  { id: 'zep', num: 36, name: 'Zephaniah', chapters: 3 },
  { id: 'hag', num: 37, name: 'Haggai', chapters: 2 },
  { id: 'zec', num: 38, name: 'Zechariah', chapters: 14 },
  { id: 'mal', num: 39, name: 'Malachi', chapters: 4 },
  { id: 'mat', num: 40, name: 'Matthew', chapters: 28 },
  { id: 'mar', num: 41, name: 'Mark', chapters: 16 },
  { id: 'luk', num: 42, name: 'Luke', chapters: 24 },
  { id: 'joh', num: 43, name: 'John', chapters: 21 },
  { id: 'act', num: 44, name: 'Acts', chapters: 28 },
  { id: 'rom', num: 45, name: 'Romans', chapters: 16 },
  { id: '1co', num: 46, name: '1 Corinthians', chapters: 16 },
  { id: '2co', num: 47, name: '2 Corinthians', chapters: 13 },
  { id: 'gal', num: 48, name: 'Galatians', chapters: 6 },
  { id: 'eph', num: 49, name: 'Ephesians', chapters: 6 },
  { id: 'phi', num: 50, name: 'Philippians', chapters: 4 },
  { id: 'col', num: 51, name: 'Colossians', chapters: 4 },
  { id: '1th', num: 52, name: '1 Thessalonians', chapters: 5 },
  { id: '2th', num: 53, name: '2 Thessalonians', chapters: 3 },
  { id: '1ti', num: 54, name: '1 Timothy', chapters: 6 },
  { id: '2ti', num: 55, name: '2 Timothy', chapters: 4 },
  { id: 'tit', num: 56, name: 'Titus', chapters: 3 },
  { id: 'phm', num: 57, name: 'Philemon', chapters: 1 },
  { id: 'heb', num: 58, name: 'Hebrews', chapters: 13 },
  { id: 'jas', num: 59, name: 'James', chapters: 5 },
  { id: '1pe', num: 60, name: '1 Peter', chapters: 5 },
  { id: '2pe', num: 61, name: '2 Peter', chapters: 3 },
  { id: '1jn', num: 62, name: '1 John', chapters: 5 },
  { id: '2jn', num: 63, name: '2 John', chapters: 1 },
  { id: '3jn', num: 64, name: '3 John', chapters: 1 },
  { id: 'jud', num: 65, name: 'Jude', chapters: 1 },
  { id: 'rev', num: 66, name: 'Revelation', chapters: 22 },
];

const BATCH = 16;
const MAX_RETRIES = 3;

async function fetchChapter(bookNum, chapter, attempt = 1) {
  const url = `https://bolls.life/get-text/WEB/${bookNum}/${chapter}/`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!Array.isArray(data)) throw new Error('Bad payload');
    // Normalize: sort by verse, return strings ordered by verse.
    const sorted = [...data].sort((a, b) => a.verse - b.verse);
    return sorted.map((v) => String(v.text ?? '').trim());
  } catch (e) {
    if (attempt < MAX_RETRIES) {
      await new Promise((r) => setTimeout(r, 800 * attempt));
      return fetchChapter(bookNum, chapter, attempt + 1);
    }
    throw new Error(`Failed ${bookNum}/${chapter}: ${e.message}`);
  }
}

async function runBatched(tasks, size, label) {
  const results = new Array(tasks.length);
  let done = 0;
  for (let i = 0; i < tasks.length; i += size) {
    const slice = tasks.slice(i, i + size);
    const settled = await Promise.all(
      slice.map(async ({ index, fn }) => {
        const r = await fn();
        return { index, r };
      }),
    );
    for (const { index, r } of settled) results[index] = r;
    done += slice.length;
    process.stdout.write(`\r  ${label}: ${done}/${tasks.length}`);
  }
  process.stdout.write('\n');
  return results;
}

async function main() {
  const start = Date.now();
  console.log(`Fetching WEB Bible from bolls.life into ${OUT}`);
  await mkdir(dirname(OUT), { recursive: true });

  const out = { translation: 'WEB', books: {} };

  // Build a flat task list of every chapter across every book.
  const tasks = [];
  for (const book of BOOKS) {
    out.books[book.id] = { name: book.name, num: book.num, chapters: new Array(book.chapters) };
    for (let c = 1; c <= book.chapters; c++) {
      tasks.push({
        bookId: book.id,
        bookNum: book.num,
        chapter: c,
      });
    }
  }

  console.log(`  ${BOOKS.length} books, ${tasks.length} chapters total`);
  const tagged = tasks.map((t, i) => ({
    index: i,
    fn: () => fetchChapter(t.bookNum, t.chapter),
  }));
  const results = await runBatched(tagged, BATCH, 'chapters');

  for (let i = 0; i < tasks.length; i++) {
    const t = tasks[i];
    out.books[t.bookId].chapters[t.chapter - 1] = results[i];
  }

  // Sanity check.
  let total = 0;
  for (const book of BOOKS) {
    const got = out.books[book.id].chapters.length;
    if (got !== book.chapters) {
      throw new Error(`Chapter count mismatch for ${book.name}: expected ${book.chapters}, got ${got}`);
    }
    for (let i = 0; i < got; i++) {
      if (!Array.isArray(out.books[book.id].chapters[i])) {
        throw new Error(`Missing chapter ${book.name} ${i + 1}`);
      }
    }
    total += got;
  }
  console.log(`  verified ${total} chapters`);

  const json = JSON.stringify(out);
  await writeFile(OUT, json, 'utf8');
  const sec = ((Date.now() - start) / 1000).toFixed(1);
  console.log(`Done in ${sec}s — wrote ${(json.length / 1024 / 1024).toFixed(2)} MB`);
}

main().catch((e) => {
  console.error('\nFetch failed:', e.message);
  process.exit(1);
});
