// Loads the bundled WEB Bible JSON (assets/bible.json) and exposes typed
// helpers for the reader. The JSON shape is produced by scripts/fetch-bible.mjs.

import { BIBLE_BOOKS, getBibleBook } from './bibleBooks';

// Direct require — JSON is bundled by Metro at build time.
// Shape: { translation: 'WEB', books: { [id]: { name, num, chapters: string[][] } } }
// eslint-disable-next-line @typescript-eslint/no-var-requires
const BIBLE_DATA = require('../../assets/bible.json') as {
  translation: string;
  books: Record<string, { name: string; num: number; chapters: string[][] }>;
};

export const BIBLE_TRANSLATION = BIBLE_DATA.translation ?? 'WEB';

export function getChapter(bookId: string, chapter: number): string[] | null {
  const entry = BIBLE_DATA.books[bookId];
  if (!entry) return null;
  if (chapter < 1 || chapter > entry.chapters.length) return null;
  return entry.chapters[chapter - 1] ?? null;
}

export function getVerse(bookId: string, chapter: number, verse: number): string | null {
  const c = getChapter(bookId, chapter);
  if (!c) return null;
  return c[verse - 1] ?? null;
}

export function getBookChapters(bookId: string): number {
  return BIBLE_DATA.books[bookId]?.chapters.length ?? 0;
}

export function getNextChapter(
  bookId: string,
  chapter: number,
): { bookId: string; chapter: number } | null {
  const book = getBibleBook(bookId);
  if (!book) return null;
  if (chapter < book.chapters) return { bookId, chapter: chapter + 1 };
  // Move to next book chapter 1.
  const idx = BIBLE_BOOKS.findIndex((b) => b.id === bookId);
  const next = BIBLE_BOOKS[idx + 1];
  return next ? { bookId: next.id, chapter: 1 } : null;
}

export function getPreviousChapter(
  bookId: string,
  chapter: number,
): { bookId: string; chapter: number } | null {
  if (chapter > 1) return { bookId, chapter: chapter - 1 };
  const idx = BIBLE_BOOKS.findIndex((b) => b.id === bookId);
  const prev = BIBLE_BOOKS[idx - 1];
  return prev ? { bookId: prev.id, chapter: prev.chapters } : null;
}

export type SearchHit = {
  bookId: string;
  bookName: string;
  chapter: number;
  verse: number;
  text: string;
};

/** Simple case-insensitive substring search across all verses. Capped. */
export function searchBible(query: string, limit = 80): SearchHit[] {
  const q = query.trim().toLowerCase();
  if (q.length < 3) return [];
  const hits: SearchHit[] = [];
  for (const book of BIBLE_BOOKS) {
    const entry = BIBLE_DATA.books[book.id];
    if (!entry) continue;
    for (let c = 0; c < entry.chapters.length; c++) {
      const verses = entry.chapters[c];
      for (let v = 0; v < verses.length; v++) {
        if (verses[v].toLowerCase().includes(q)) {
          hits.push({
            bookId: book.id,
            bookName: book.name,
            chapter: c + 1,
            verse: v + 1,
            text: verses[v],
          });
          if (hits.length >= limit) return hits;
        }
      }
    }
  }
  return hits;
}
