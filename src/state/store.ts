import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { zustandStorage } from './storage';
import type { EmotionId } from '../data/emotions';
import type { AccentKey } from '../theme/accents';
import type { FontScale } from '../theme/typography';

/* ----------------------------- Settings store ----------------------------- */

export type ThemePreference = 'system' | 'light' | 'dark';

type SettingsState = {
  hasOnboarded: boolean;
  themePreference: ThemePreference;
  accentKey: AccentKey;
  fontScale: FontScale;
  notificationsEnabled: boolean;
  morningVerseEnabled: boolean;
  eveningPrayerEnabled: boolean;
  streakReminderEnabled: boolean;
  morningHour: number; // 0..23
  eveningHour: number;
  quietStart: number;
  quietEnd: number;
  hapticsEnabled: boolean;
  biometricLock: boolean;
  dismissedHolidays: string[];
  /** Optional display name used in greetings. Empty string = use default. */
  userName: string;
  /** Optional handle, mostly cosmetic for the profile card. */
  userUsername: string;
  setHasOnboarded: (v: boolean) => void;
  setThemePreference: (v: ThemePreference) => void;
  setAccentKey: (v: AccentKey) => void;
  setFontScale: (v: FontScale) => void;
  setNotificationsEnabled: (v: boolean) => void;
  setMorningVerseEnabled: (v: boolean) => void;
  setEveningPrayerEnabled: (v: boolean) => void;
  setStreakReminderEnabled: (v: boolean) => void;
  setMorningHour: (v: number) => void;
  setEveningHour: (v: number) => void;
  setQuietStart: (v: number) => void;
  setQuietEnd: (v: number) => void;
  setHapticsEnabled: (v: boolean) => void;
  setBiometricLock: (v: boolean) => void;
  dismissHoliday: (id: string) => void;
  setUserName: (v: string) => void;
  setUserUsername: (v: string) => void;
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      hasOnboarded: false,
      themePreference: 'system',
      accentKey: 'sky',
      fontScale: 'md',
      notificationsEnabled: true,
      morningVerseEnabled: true,
      eveningPrayerEnabled: true,
      streakReminderEnabled: false,
      morningHour: 8,
      eveningHour: 21,
      quietStart: 22,
      quietEnd: 7,
      hapticsEnabled: true,
      biometricLock: false,
      dismissedHolidays: [],
      userName: '',
      userUsername: '',
      setHasOnboarded: (v) => set({ hasOnboarded: v }),
      setThemePreference: (v) => set({ themePreference: v }),
      setAccentKey: (v) => set({ accentKey: v }),
      setFontScale: (v) => set({ fontScale: v }),
      setNotificationsEnabled: (v) => set({ notificationsEnabled: v }),
      setMorningVerseEnabled: (v) => set({ morningVerseEnabled: v }),
      setEveningPrayerEnabled: (v) => set({ eveningPrayerEnabled: v }),
      setStreakReminderEnabled: (v) => set({ streakReminderEnabled: v }),
      setMorningHour: (v) => set({ morningHour: v }),
      setEveningHour: (v) => set({ eveningHour: v }),
      setQuietStart: (v) => set({ quietStart: v }),
      setQuietEnd: (v) => set({ quietEnd: v }),
      setHapticsEnabled: (v) => set({ hapticsEnabled: v }),
      setBiometricLock: (v) => set({ biometricLock: v }),
      dismissHoliday: (id) =>
        set((s) => ({
          dismissedHolidays: s.dismissedHolidays.includes(id)
            ? s.dismissedHolidays
            : [...s.dismissedHolidays, id],
        })),
      setUserName: (v) => set({ userName: v.slice(0, 40) }),
      setUserUsername: (v) => set({ userUsername: v.slice(0, 30) }),
    }),
    {
      name: 'onefaith-settings',
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);

/* ----------------------------- Favorites store ---------------------------- */

type FavoritesState = {
  verses: string[]; // verse ids
  prayers: string[]; // prayer ids
  affirmations: string[];
  toggleVerse: (id: string) => void;
  togglePrayer: (id: string) => void;
  toggleAffirmation: (text: string) => void;
  isVerseFavorite: (id: string) => boolean;
  isPrayerFavorite: (id: string) => boolean;
};

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      verses: [],
      prayers: [],
      affirmations: [],
      toggleVerse: (id) =>
        set((s) => ({
          verses: s.verses.includes(id) ? s.verses.filter((x) => x !== id) : [...s.verses, id],
        })),
      togglePrayer: (id) =>
        set((s) => ({
          prayers: s.prayers.includes(id) ? s.prayers.filter((x) => x !== id) : [...s.prayers, id],
        })),
      toggleAffirmation: (text) =>
        set((s) => ({
          affirmations: s.affirmations.includes(text)
            ? s.affirmations.filter((x) => x !== text)
            : [...s.affirmations, text],
        })),
      isVerseFavorite: (id) => get().verses.includes(id),
      isPrayerFavorite: (id) => get().prayers.includes(id),
    }),
    {
      name: 'onefaith-favorites',
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);

/* ------------------------------ Streak store ------------------------------ */

export type StreakSession = {
  startedAt: number; // epoch ms
  endedAt: number; // epoch ms
  durationMs: number;
};

type StreakState = {
  startedAt: number | null; // null = not yet started
  longestMs: number;
  totalResets: number;
  history: StreakSession[];
  start: () => void;
  reset: () => void;
  currentMs: () => number; // helper
};

export const useStreakStore = create<StreakState>()(
  persist(
    (set, get) => ({
      startedAt: null,
      longestMs: 0,
      totalResets: 0,
      history: [],
      start: () => set({ startedAt: Date.now() }),
      reset: () => {
        const { startedAt, history, longestMs, totalResets } = get();
        const now = Date.now();
        if (startedAt) {
          const durationMs = Math.max(0, now - startedAt);
          set({
            startedAt: now,
            longestMs: Math.max(longestMs, durationMs),
            totalResets: totalResets + 1,
            history: [
              ...history,
              { startedAt, endedAt: now, durationMs },
            ].slice(-50),
          });
        } else {
          set({ startedAt: now });
        }
      },
      currentMs: () => {
        const s = get().startedAt;
        return s ? Date.now() - s : 0;
      },
    }),
    {
      name: 'onefaith-streak',
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);

/* ------------------------------ Journal store ----------------------------- */

export type JournalMood =
  | 'rough'
  | 'low'
  | 'okay'
  | 'good'
  | 'great';

export type JournalEntry = {
  id: string;
  createdAt: number;
  title: string;
  body: string;
  mood: JournalMood;
  emotions: EmotionId[];
  gratitude: string[]; // optional gratitude items
};

type JournalState = {
  entries: JournalEntry[];
  addEntry: (e: Omit<JournalEntry, 'id' | 'createdAt'>) => string;
  updateEntry: (id: string, patch: Partial<JournalEntry>) => void;
  deleteEntry: (id: string) => void;
};

export const useJournalStore = create<JournalState>()(
  persist(
    (set) => ({
      entries: [],
      addEntry: (e) => {
        const id = `j-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
        set((s) => ({
          entries: [{ id, createdAt: Date.now(), ...e }, ...s.entries],
        }));
        return id;
      },
      updateEntry: (id, patch) =>
        set((s) => ({
          entries: s.entries.map((e) => (e.id === id ? { ...e, ...patch } : e)),
        })),
      deleteEntry: (id) =>
        set((s) => ({ entries: s.entries.filter((e) => e.id !== id) })),
    }),
    {
      name: 'onefaith-journal',
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);

/* ---------------------------- AI chat (local) ----------------------------- */

export type SavedPrayer = {
  id: string;
  text: string;
  prompt: string;
  verseRef: string;
  createdAt: number;
};

type SavedPrayersState = {
  prayers: SavedPrayer[];
  add: (p: Omit<SavedPrayer, 'id' | 'createdAt'>) => string;
  remove: (id: string) => void;
  clear: () => void;
};

export const useSavedPrayersStore = create<SavedPrayersState>()(
  persist(
    (set) => ({
      prayers: [],
      add: (p) => {
        const id = `pr-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
        set((s) => ({
          prayers: [{ id, createdAt: Date.now(), ...p }, ...s.prayers].slice(0, 100),
        }));
        return id;
      },
      remove: (id) =>
        set((s) => ({ prayers: s.prayers.filter((p) => p.id !== id) })),
      clear: () => set({ prayers: [] }),
    }),
    {
      name: 'onefaith-saved-prayers',
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);

/* ------------------------------ AI memory -------------------------------- */

// Lightweight, opt-in personalization. We never store raw user messages — only
// aggregate counts and a couple of small slices so the companion can adapt:
//   - emotionFrequency: how often each emotion has come up
//   - topicFrequency: how often each topic has come up
//   - favoriteVerses / favoritePrayers: pulled from the user's saves
//   - recentEmotionIds: last few emotions, newest first (for non-repetition)
// Everything respects `enabled`; if false the store is treated as empty.

type AIMemoryState = {
  enabled: boolean;
  emotionFrequency: Record<string, number>;
  topicFrequency: Record<string, number>;
  recentEmotionIds: string[];
  totalChats: number;
  setEnabled: (v: boolean) => void;
  recordIntent: (emotionIds: string[], topicIds: string[]) => void;
  clear: () => void;
};

const EMPTY_MEMORY = {
  emotionFrequency: {},
  topicFrequency: {},
  recentEmotionIds: [],
  totalChats: 0,
};

export const useAIMemoryStore = create<AIMemoryState>()(
  persist(
    (set, get) => ({
      enabled: true,
      ...EMPTY_MEMORY,
      setEnabled: (v) => set({ enabled: v }),
      recordIntent: (emotionIds, topicIds) => {
        if (!get().enabled) return;
        set((s) => {
          const ef = { ...s.emotionFrequency };
          emotionIds.forEach((e) => (ef[e] = (ef[e] ?? 0) + 1));
          const tf = { ...s.topicFrequency };
          topicIds.forEach((t) => (tf[t] = (tf[t] ?? 0) + 1));
          const nextRecent = [
            ...emotionIds,
            ...s.recentEmotionIds.filter((id) => !emotionIds.includes(id)),
          ].slice(0, 10);
          return {
            emotionFrequency: ef,
            topicFrequency: tf,
            recentEmotionIds: nextRecent,
            totalChats: s.totalChats + 1,
          };
        });
      },
      clear: () => set({ ...EMPTY_MEMORY }),
    }),
    {
      name: 'onefaith-ai-memory',
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);

/* -------------------------- Prayer Intentions ---------------------------- */

export type PrayerIntention = {
  id: string;
  title: string;
  body: string;
  name?: string;
  anonymous: boolean;
  prayCount: number;
  createdAt: number;
};

type PrayerIntentionsState = {
  intentions: PrayerIntention[];
  /** Intention IDs the current user has already prayed for. */
  prayedFor: string[];
  add: (p: Omit<PrayerIntention, 'id' | 'createdAt' | 'prayCount'>) => string;
  remove: (id: string) => void;
  /** Returns true when the prayer was newly recorded, false if the user has
   *  already prayed for this intention before. */
  prayFor: (id: string) => boolean;
  hasPrayed: (id: string) => boolean;
  clear: () => void;
};

export const usePrayerIntentionsStore = create<PrayerIntentionsState>()(
  persist(
    (set, get) => ({
      intentions: [],
      prayedFor: [],
      add: (p) => {
        const id = `pi-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
        set((s) => ({
          intentions: [
            { id, createdAt: Date.now(), prayCount: 0, ...p },
            ...s.intentions,
          ].slice(0, 200),
        }));
        return id;
      },
      remove: (id) =>
        set((s) => ({
          intentions: s.intentions.filter((i) => i.id !== id),
          prayedFor: s.prayedFor.filter((p) => p !== id),
        })),
      prayFor: (id) => {
        if (get().prayedFor.includes(id)) return false;
        set((s) => ({
          intentions: s.intentions.map((i) =>
            i.id === id ? { ...i, prayCount: i.prayCount + 1 } : i,
          ),
          prayedFor: [...s.prayedFor, id],
        }));
        return true;
      },
      hasPrayed: (id) => get().prayedFor.includes(id),
      clear: () => set({ intentions: [], prayedFor: [] }),
    }),
    {
      name: 'onefaith-prayer-intentions',
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);

/* -------------------------- Feedback store ------------------------------- */

export type FeedbackKind = 'general' | 'bug' | 'feature' | 'praise';

export type Feedback = {
  id: string;
  kind: FeedbackKind;
  rating: number; // 0..5
  text: string;
  anonymous: boolean;
  email?: string;
  createdAt: number;
};

type FeedbackState = {
  items: Feedback[];
  add: (f: Omit<Feedback, 'id' | 'createdAt'>) => string;
  remove: (id: string) => void;
  clear: () => void;
};

export const useFeedbackStore = create<FeedbackState>()(
  persist(
    (set) => ({
      items: [],
      add: (f) => {
        const id = `fb-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
        set((s) => ({ items: [{ id, createdAt: Date.now(), ...f }, ...s.items] }));
        return id;
      },
      remove: (id) =>
        set((s) => ({ items: s.items.filter((x) => x.id !== id) })),
      clear: () => set({ items: [] }),
    }),
    {
      name: 'onefaith-feedback',
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);

/* -------------------------- Bible reader store ---------------------------- */

export type BibleHighlight = {
  id: string; // `${bookId}-${chapter}-${verse}`
  bookId: string;
  chapter: number;
  verse: number;
  color: 'gold' | 'pink' | 'mint' | 'sky';
  createdAt: number;
};

export type BibleNote = {
  id: string;
  bookId: string;
  chapter: number;
  verse: number;
  note: string;
  createdAt: number;
};

export type BibleBookmark = {
  id: string;
  bookId: string;
  chapter: number;
  verse?: number;
  label?: string;
  createdAt: number;
};

type BibleState = {
  lastRead: { bookId: string; chapter: number } | null;
  highlights: BibleHighlight[];
  notes: BibleNote[];
  bookmarks: BibleBookmark[];
  recents: { bookId: string; chapter: number; ts: number }[]; // chronological
  setLastRead: (bookId: string, chapter: number) => void;
  toggleHighlight: (bookId: string, chapter: number, verse: number, color: BibleHighlight['color']) => void;
  upsertNote: (bookId: string, chapter: number, verse: number, note: string) => void;
  deleteNote: (id: string) => void;
  toggleBookmark: (bookId: string, chapter: number, verse?: number, label?: string) => void;
  pushRecent: (bookId: string, chapter: number) => void;
};

export const useBibleStore = create<BibleState>()(
  persist(
    (set) => ({
      lastRead: null,
      highlights: [],
      notes: [],
      bookmarks: [],
      recents: [],
      setLastRead: (bookId, chapter) => set({ lastRead: { bookId, chapter } }),
      toggleHighlight: (bookId, chapter, verse, color) =>
        set((s) => {
          const key = `${bookId}-${chapter}-${verse}`;
          const existing = s.highlights.find((h) => h.id === key);
          if (existing && existing.color === color) {
            return { highlights: s.highlights.filter((h) => h.id !== key) };
          }
          const without = s.highlights.filter((h) => h.id !== key);
          return {
            highlights: [
              ...without,
              { id: key, bookId, chapter, verse, color, createdAt: Date.now() },
            ],
          };
        }),
      upsertNote: (bookId, chapter, verse, note) =>
        set((s) => {
          const key = `${bookId}-${chapter}-${verse}`;
          const without = s.notes.filter((n) => n.id !== key);
          if (!note.trim()) return { notes: without };
          return {
            notes: [
              ...without,
              { id: key, bookId, chapter, verse, note: note.trim(), createdAt: Date.now() },
            ],
          };
        }),
      deleteNote: (id) =>
        set((s) => ({ notes: s.notes.filter((n) => n.id !== id) })),
      toggleBookmark: (bookId, chapter, verse, label) =>
        set((s) => {
          const key = `${bookId}-${chapter}-${verse ?? 0}`;
          const exists = s.bookmarks.find((b) => b.id === key);
          if (exists) return { bookmarks: s.bookmarks.filter((b) => b.id !== key) };
          return {
            bookmarks: [
              ...s.bookmarks,
              { id: key, bookId, chapter, verse, label, createdAt: Date.now() },
            ],
          };
        }),
      pushRecent: (bookId, chapter) =>
        set((s) => {
          const filtered = s.recents.filter(
            (r) => !(r.bookId === bookId && r.chapter === chapter),
          );
          return {
            recents: [{ bookId, chapter, ts: Date.now() }, ...filtered].slice(0, 25),
          };
        }),
    }),
    {
      name: 'onefaith-bible',
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  createdAt: number;
};

type ChatState = {
  messages: ChatMessage[];
  push: (m: Omit<ChatMessage, 'id' | 'createdAt'>) => void;
  clear: () => void;
};

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      messages: [],
      push: (m) =>
        set((s) => ({
          messages: [
            ...s.messages,
            { id: `m-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, createdAt: Date.now(), ...m },
          ].slice(-100),
        })),
      clear: () => set({ messages: [] }),
    }),
    {
      name: 'onefaith-chat',
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);
