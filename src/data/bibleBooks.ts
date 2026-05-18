// Bible book metadata. Book numbers (1..66) match bolls.life's WEB ordering.
// Chapter counts are well-known canonical constants for the Protestant 66-book canon.

export type Testament = 'OT' | 'NT';

export type BibleBook = {
  id: string; // short slug, used in storage keys
  num: number; // 1-based canonical order
  name: string;
  abbrev: string;
  testament: Testament;
  chapters: number;
};

export const BIBLE_BOOKS: BibleBook[] = [
  // Old Testament
  { id: 'gen', num: 1, name: 'Genesis', abbrev: 'Gen', testament: 'OT', chapters: 50 },
  { id: 'exo', num: 2, name: 'Exodus', abbrev: 'Exo', testament: 'OT', chapters: 40 },
  { id: 'lev', num: 3, name: 'Leviticus', abbrev: 'Lev', testament: 'OT', chapters: 27 },
  { id: 'num', num: 4, name: 'Numbers', abbrev: 'Num', testament: 'OT', chapters: 36 },
  { id: 'deu', num: 5, name: 'Deuteronomy', abbrev: 'Deut', testament: 'OT', chapters: 34 },
  { id: 'jos', num: 6, name: 'Joshua', abbrev: 'Josh', testament: 'OT', chapters: 24 },
  { id: 'jdg', num: 7, name: 'Judges', abbrev: 'Judg', testament: 'OT', chapters: 21 },
  { id: 'rut', num: 8, name: 'Ruth', abbrev: 'Ruth', testament: 'OT', chapters: 4 },
  { id: '1sa', num: 9, name: '1 Samuel', abbrev: '1 Sam', testament: 'OT', chapters: 31 },
  { id: '2sa', num: 10, name: '2 Samuel', abbrev: '2 Sam', testament: 'OT', chapters: 24 },
  { id: '1ki', num: 11, name: '1 Kings', abbrev: '1 Kgs', testament: 'OT', chapters: 22 },
  { id: '2ki', num: 12, name: '2 Kings', abbrev: '2 Kgs', testament: 'OT', chapters: 25 },
  { id: '1ch', num: 13, name: '1 Chronicles', abbrev: '1 Chr', testament: 'OT', chapters: 29 },
  { id: '2ch', num: 14, name: '2 Chronicles', abbrev: '2 Chr', testament: 'OT', chapters: 36 },
  { id: 'ezr', num: 15, name: 'Ezra', abbrev: 'Ezra', testament: 'OT', chapters: 10 },
  { id: 'neh', num: 16, name: 'Nehemiah', abbrev: 'Neh', testament: 'OT', chapters: 13 },
  { id: 'est', num: 17, name: 'Esther', abbrev: 'Esth', testament: 'OT', chapters: 10 },
  { id: 'job', num: 18, name: 'Job', abbrev: 'Job', testament: 'OT', chapters: 42 },
  { id: 'psa', num: 19, name: 'Psalms', abbrev: 'Ps', testament: 'OT', chapters: 150 },
  { id: 'pro', num: 20, name: 'Proverbs', abbrev: 'Prov', testament: 'OT', chapters: 31 },
  { id: 'ecc', num: 21, name: 'Ecclesiastes', abbrev: 'Eccl', testament: 'OT', chapters: 12 },
  { id: 'sos', num: 22, name: 'Song of Solomon', abbrev: 'Song', testament: 'OT', chapters: 8 },
  { id: 'isa', num: 23, name: 'Isaiah', abbrev: 'Isa', testament: 'OT', chapters: 66 },
  { id: 'jer', num: 24, name: 'Jeremiah', abbrev: 'Jer', testament: 'OT', chapters: 52 },
  { id: 'lam', num: 25, name: 'Lamentations', abbrev: 'Lam', testament: 'OT', chapters: 5 },
  { id: 'eze', num: 26, name: 'Ezekiel', abbrev: 'Ezek', testament: 'OT', chapters: 48 },
  { id: 'dan', num: 27, name: 'Daniel', abbrev: 'Dan', testament: 'OT', chapters: 12 },
  { id: 'hos', num: 28, name: 'Hosea', abbrev: 'Hos', testament: 'OT', chapters: 14 },
  { id: 'joe', num: 29, name: 'Joel', abbrev: 'Joel', testament: 'OT', chapters: 3 },
  { id: 'amo', num: 30, name: 'Amos', abbrev: 'Amos', testament: 'OT', chapters: 9 },
  { id: 'oba', num: 31, name: 'Obadiah', abbrev: 'Obad', testament: 'OT', chapters: 1 },
  { id: 'jon', num: 32, name: 'Jonah', abbrev: 'Jonah', testament: 'OT', chapters: 4 },
  { id: 'mic', num: 33, name: 'Micah', abbrev: 'Mic', testament: 'OT', chapters: 7 },
  { id: 'nah', num: 34, name: 'Nahum', abbrev: 'Nah', testament: 'OT', chapters: 3 },
  { id: 'hab', num: 35, name: 'Habakkuk', abbrev: 'Hab', testament: 'OT', chapters: 3 },
  { id: 'zep', num: 36, name: 'Zephaniah', abbrev: 'Zeph', testament: 'OT', chapters: 3 },
  { id: 'hag', num: 37, name: 'Haggai', abbrev: 'Hag', testament: 'OT', chapters: 2 },
  { id: 'zec', num: 38, name: 'Zechariah', abbrev: 'Zech', testament: 'OT', chapters: 14 },
  { id: 'mal', num: 39, name: 'Malachi', abbrev: 'Mal', testament: 'OT', chapters: 4 },
  // New Testament
  { id: 'mat', num: 40, name: 'Matthew', abbrev: 'Matt', testament: 'NT', chapters: 28 },
  { id: 'mar', num: 41, name: 'Mark', abbrev: 'Mark', testament: 'NT', chapters: 16 },
  { id: 'luk', num: 42, name: 'Luke', abbrev: 'Luke', testament: 'NT', chapters: 24 },
  { id: 'joh', num: 43, name: 'John', abbrev: 'John', testament: 'NT', chapters: 21 },
  { id: 'act', num: 44, name: 'Acts', abbrev: 'Acts', testament: 'NT', chapters: 28 },
  { id: 'rom', num: 45, name: 'Romans', abbrev: 'Rom', testament: 'NT', chapters: 16 },
  { id: '1co', num: 46, name: '1 Corinthians', abbrev: '1 Cor', testament: 'NT', chapters: 16 },
  { id: '2co', num: 47, name: '2 Corinthians', abbrev: '2 Cor', testament: 'NT', chapters: 13 },
  { id: 'gal', num: 48, name: 'Galatians', abbrev: 'Gal', testament: 'NT', chapters: 6 },
  { id: 'eph', num: 49, name: 'Ephesians', abbrev: 'Eph', testament: 'NT', chapters: 6 },
  { id: 'phi', num: 50, name: 'Philippians', abbrev: 'Phil', testament: 'NT', chapters: 4 },
  { id: 'col', num: 51, name: 'Colossians', abbrev: 'Col', testament: 'NT', chapters: 4 },
  { id: '1th', num: 52, name: '1 Thessalonians', abbrev: '1 Thess', testament: 'NT', chapters: 5 },
  { id: '2th', num: 53, name: '2 Thessalonians', abbrev: '2 Thess', testament: 'NT', chapters: 3 },
  { id: '1ti', num: 54, name: '1 Timothy', abbrev: '1 Tim', testament: 'NT', chapters: 6 },
  { id: '2ti', num: 55, name: '2 Timothy', abbrev: '2 Tim', testament: 'NT', chapters: 4 },
  { id: 'tit', num: 56, name: 'Titus', abbrev: 'Titus', testament: 'NT', chapters: 3 },
  { id: 'phm', num: 57, name: 'Philemon', abbrev: 'Phlm', testament: 'NT', chapters: 1 },
  { id: 'heb', num: 58, name: 'Hebrews', abbrev: 'Heb', testament: 'NT', chapters: 13 },
  { id: 'jas', num: 59, name: 'James', abbrev: 'Jas', testament: 'NT', chapters: 5 },
  { id: '1pe', num: 60, name: '1 Peter', abbrev: '1 Pet', testament: 'NT', chapters: 5 },
  { id: '2pe', num: 61, name: '2 Peter', abbrev: '2 Pet', testament: 'NT', chapters: 3 },
  { id: '1jn', num: 62, name: '1 John', abbrev: '1 John', testament: 'NT', chapters: 5 },
  { id: '2jn', num: 63, name: '2 John', abbrev: '2 John', testament: 'NT', chapters: 1 },
  { id: '3jn', num: 64, name: '3 John', abbrev: '3 John', testament: 'NT', chapters: 1 },
  { id: 'jud', num: 65, name: 'Jude', abbrev: 'Jude', testament: 'NT', chapters: 1 },
  { id: 'rev', num: 66, name: 'Revelation', abbrev: 'Rev', testament: 'NT', chapters: 22 },
];

export const OLD_TESTAMENT: BibleBook[] = BIBLE_BOOKS.filter((b) => b.testament === 'OT');
export const NEW_TESTAMENT: BibleBook[] = BIBLE_BOOKS.filter((b) => b.testament === 'NT');

export const getBibleBook = (id: string): BibleBook | undefined =>
  BIBLE_BOOKS.find((b) => b.id === id);
