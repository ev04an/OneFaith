import type { EmotionId } from '../data/emotions';
import type { PrayerCategory } from '../data/prayers';

export type RootStackParamList = {
  Onboarding: undefined;
  MainTabs: undefined;
  EmotionDetail: { emotionId: EmotionId };
  VerseDetail: { verseId: string };
  PrayerDetail: { prayerId: string };
  PrayerCategory: { category: PrayerCategory };
  JournalEntry: { entryId?: string };
  Favorites: undefined;
  AI: undefined;
  Settings: undefined;
  Levels: undefined;
  Holiday: { id: string };
  AboutDeveloper: undefined;
  BibleBook: { bookId: string };
  VersePicker: { bookId: string; chapter: number };
  BibleReader: { bookId: string; chapter: number; verse?: number };
  VerseCategories: undefined;
  VerseTopic: { topicId: string };
  PrayerGenerator: undefined;
  Daily: undefined;
  SavedPrayers: undefined;
  Profile: undefined;
  Feedback: undefined;
  Auth: undefined;
  PrayerIntentions: undefined;
};

export type TabsParamList = {
  Home: undefined;
  Recovery: undefined;
  Prayers: undefined;
  Journal: undefined;
  Bible: undefined;
};
