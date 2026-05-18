# One Faith

A Christian faith-based mobile app designed to help users grow spiritually and stay consistent in recovery through prayer, Bible reading, journaling, AI companionship, reminders, and progress tracking.

> Built with React Native + Expo. Premium glassmorphism UI, opt-in cloud sync via Supabase, fully offline-capable for the Bible reader, journal, and prayer library.

---

## ✨ Features

- **Recovery streak tracking** — live timer (days · hours · minutes · seconds), 7 levels of growth (Beginner → Unbreakable), 5 milestone badges (Bronze → Legendary), confetti on level-up, and a supportive relapse-reset flow.
- **Prayer generation** — Generate personalized prayers tuned to your current mood (anxiety, gratitude, peace, healing, strength, hope, guidance, forgiveness) plus a free-form intention field. Every prayer ends with *"In Jesus' name I pray, Amen."*
- **Prayer intentions** — Submit a request for someone you're carrying, then watch (and contribute to) the prayer count as others lift it up. Anonymous toggle, optional name, and long-press to delete.
- **Bible reading** — Offline World English Bible (~31,000 verses), book-by-book navigation, in-place highlighting in four colors, notes, bookmarks, full-text search, and "continue reading" memory.
- **AI companion** — Local, on-device conversational engine with intent-aware empathy across 13+ emotional and topical paths. Handles crisis safety, profanity, scope limits, *and* direct prayer requests like "can you pray for my dad" with proper intercessory responses.
- **Journal** — Mood-tagged entries with 5-emoji mood picker, emotion tags, gratitude prompts, and a 30-day mood-distribution chart. Local, private, never leaves your device unless you opt in to sync.
- **Daily Christian reminders** — Random rotating morning verse, evening prayer, and streak-nudge notifications. 13+ message variants, quiet-hours support, opt-in permission flow that never prompts on launch.
- **Personalized greetings** — *Good Morning, James* / *Welcome back, Sarah* — or a gentle *Child of God* fallback when no name is set. Auto-rotating greeting based on time of day.
- **Levels & badges** — 7-tier progression with descriptions, glow colors, and a horizontally scrollable medallion shelf showing earned vs. locked badges.
- **Christian holiday greetings** — Auto-detected banners on the home screen for Christmas, Easter, Good Friday, Palm Sunday, Pentecost, New Year, Advent, Lent, and Ash Wednesday — each with themed gradients, particles, a verse, and a one-tap dismiss.
- **Recovery progress** — Stats grid covering current streak, longest streak, total resets, and journal entry count, plus a progress bar to the next level threshold.

---

## 📷 Screenshots

> Drop screenshots into `assets/screenshots/` and they'll show up here.

| Home | Recovery | Bible Reader |
|---|---|---|
| _coming soon_ | _coming soon_ | _coming soon_ |

| Prayer Generator | AI Companion | Journal |
|---|---|---|
| _coming soon_ | _coming soon_ | _coming soon_ |

---

## 🛠️ Tech Stack

| Layer | Tech |
|---|---|
| **App framework** | [Expo SDK 54](https://docs.expo.dev/) · [React Native 0.81](https://reactnative.dev/) · [TypeScript 5.9](https://www.typescriptlang.org/) |
| **Navigation** | [React Navigation 7](https://reactnavigation.org/) (native stack + bottom tabs) |
| **State** | [Zustand 4](https://github.com/pmndrs/zustand) + AsyncStorage persistence |
| **Animation** | [React Native Reanimated 3](https://docs.swmansion.com/react-native-reanimated/) |
| **UI primitives** | [expo-linear-gradient](https://docs.expo.dev/versions/latest/sdk/linear-gradient/) · [expo-blur](https://docs.expo.dev/versions/latest/sdk/blur-view/) · [react-native-svg](https://github.com/software-mansion/react-native-svg) |
| **Auth (optional)** | [Supabase](https://supabase.com/) (email + password) |
| **Notifications** | [expo-notifications](https://docs.expo.dev/versions/latest/sdk/notifications/) — local scheduled |
| **Speech / TTS** | [expo-speech](https://docs.expo.dev/versions/latest/sdk/speech/) |
| **Haptics** | [expo-haptics](https://docs.expo.dev/versions/latest/sdk/haptics/) |
| **Typography** | [Fraunces](https://fonts.google.com/specimen/Fraunces) (display) + [Inter](https://fonts.google.com/specimen/Inter) (body) |
| **Scripture** | [World English Bible](https://worldenglish.bible/) (public domain) |

---

## 🚀 Installation

### Prerequisites
- **Node.js 18+** — <https://nodejs.org/>
- **Git** — <https://git-scm.com/>
- **Expo Go** app on your phone, *or* an iOS Simulator / Android Emulator

### Clone & install

```bash
git clone https://github.com/<your-username>/onefaith.git
cd onefaith
npm install
```

### Configure Supabase (optional — only needed for sign-in)

Sign-in is fully optional. The app works end-to-end offline; auth just enables future cross-device sync. If you want to enable it:

1. Create a free Supabase project at <https://supabase.com>
2. Project Settings → API → copy your **Project URL** and **anon public key**
3. Create a `.env` file in the project root (this file is gitignored):

   ```env
   EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJ...your-anon-key...
   ```

4. In the Supabase dashboard → Authentication → URL Configuration → add `onefaith://auth/reset` to the redirect URLs

See `SUPABASE_SETUP.md` for a more detailed walkthrough.

### Run

```bash
npx expo start -c
```

Press `i` for iOS Simulator, `a` for Android Emulator, or scan the QR code with the Expo Go app on your phone.

---

## 📁 Folder Structure

```
onefaith/
├── App.tsx                       # Root provider stack + font / hydration gates
├── index.ts                      # Expo entry
├── app.json                      # Expo config (icons, splash, scheme, plugins)
├── babel.config.js
├── tsconfig.json
├── package.json
├── SUPABASE_SETUP.md             # Cloud-auth setup walkthrough
│
├── assets/                       # App icon, adaptive icon, splash, Bible data
│   ├── icon.png
│   ├── adaptive-icon.png
│   ├── splash-icon.png
│   ├── favicon.png
│   └── bible.json                # Offline World English Bible (~31K verses)
│
├── scripts/                      # One-off generators (icon, fetch Bible)
│   ├── generate-icon.mjs
│   └── fetch-bible.mjs
│
└── src/
    ├── theme/                    # Palette, gradients, typography, spacing, accents
    │   ├── palette.ts
    │   ├── gradients.ts
    │   ├── typography.ts
    │   ├── spacing.ts
    │   ├── accents.ts
    │   └── ThemeContext.tsx
    │
    ├── components/               # Reusable building blocks
    │   ├── GlassCard.tsx
    │   ├── GradientButton.tsx
    │   ├── PressableScale.tsx
    │   ├── AnimatedBackground.tsx
    │   ├── SoftCurves.tsx
    │   ├── StreakTimer.tsx
    │   ├── LevelBadge.tsx
    │   ├── MoodPicker.tsx
    │   ├── EmotionCard.tsx
    │   ├── VerseCard.tsx
    │   ├── PilgrimLoader.tsx
    │   ├── HolidayBanner.tsx
    │   ├── HolidayParticles.tsx
    │   ├── Confetti.tsx
    │   └── ScreenHeader.tsx
    │
    ├── data/                     # Static content
    │   ├── verses.ts             # Curated verses tagged by emotion/topic
    │   ├── prayers.ts            # 9 categories of prayers
    │   ├── levels.ts             # Streak levels + badges
    │   ├── affirmations.ts
    │   ├── emotions.ts           # 16 emotion definitions
    │   ├── topics.ts
    │   ├── ambient.ts
    │   ├── holidays.ts           # Christian holiday detection
    │   ├── bible.ts              # Bible reader helpers
    │   └── bibleBooks.ts
    │
    ├── state/                    # Persisted Zustand stores
    │   ├── store.ts              # settings · streak · favorites · journal · chat
    │   │                         # · savedPrayers · feedback · bible · prayerIntentions · AI memory
    │   ├── auth.ts               # Supabase session store + friendly error mapping
    │   └── storage.ts            # AsyncStorage adapter
    │
    ├── utils/                    # Pure helpers
    │   ├── ai.ts                 # Local AI companion engine
    │   ├── prayerGenerator.ts    # Personalized prayer composer
    │   ├── notifications.ts      # Safe scheduled-notification layer
    │   ├── time.ts
    │   ├── share.ts
    │   └── haptics.ts
    │
    ├── lib/
    │   └── supabase.ts           # Supabase client (env-var driven, never crashes if unconfigured)
    │
    ├── navigation/
    │   ├── RootNavigator.tsx
    │   ├── Tabs.tsx
    │   └── types.ts
    │
    └── screens/                  # 25+ screens
        ├── OnboardingScreen.tsx
        ├── HomeScreen.tsx
        ├── EmotionDetailScreen.tsx
        ├── VerseDetailScreen.tsx
        ├── VerseCategoriesScreen.tsx
        ├── VerseTopicScreen.tsx
        ├── VersePickerScreen.tsx
        ├── BibleScreen.tsx
        ├── BibleBookScreen.tsx
        ├── BibleReaderScreen.tsx
        ├── RecoveryScreen.tsx
        ├── LevelsScreen.tsx
        ├── PrayersScreen.tsx
        ├── PrayerCategoryScreen.tsx
        ├── PrayerDetailScreen.tsx
        ├── PrayerGeneratorScreen.tsx
        ├── PrayerIntentionsScreen.tsx
        ├── SavedPrayersScreen.tsx
        ├── JournalScreen.tsx
        ├── JournalEntryScreen.tsx
        ├── AIScreen.tsx
        ├── DailyScreen.tsx
        ├── FavoritesScreen.tsx
        ├── HolidayScreen.tsx
        ├── ProfileScreen.tsx
        ├── SettingsScreen.tsx
        ├── FeedbackScreen.tsx
        ├── AboutDeveloperScreen.tsx
        └── AuthScreen.tsx
```

---

## 🔭 Future Improvements

- **Cloud sync of journal, favorites, streak, and prayer intentions** via Supabase (auth is wired; per-store sync is the next pass).
- **Google / Apple sign-in** alongside email + password.
- **Password-reset deep-link handler** that lands users directly on a "set new password" screen inside the app.
- **Ambient scene audio** — wire `expo-av` to the visual breathing companions for soft worship/instrumental loops.
- **Verse-of-the-day share cards** — render to image via `react-native-view-shot` for one-tap social posting.
- **Real LLM for the AI companion** — swap the local template engine for the Claude API (Haiku for low-latency replies, Sonnet for longer guidance) with prompt caching.
- **Biometric lock** — wire `expo-local-authentication` to the existing Settings toggle.
- **More translations** — currently World English Bible; plan to add Berean Standard Bible (also public domain) as a user-selectable option.
- **Custom app-store assets** — feature graphic, App Store / Play Store screenshots, marketing copy.

---

## 📜 License

Personal project by **Evan Mathew Abraham**. Scripture content is the **World English Bible (public domain)**. All original prayers, reflections, and code are © 2026 Evan Mathew Abraham.

---

## 📬 Contact

- **Email** — [evan.mathew04@gmail.com](mailto:evan.mathew04@gmail.com)
- **GitHub** — [@ev04an](https://github.com/ev04an)
- **LinkedIn** — [evan-mathew-abraham](https://www.linkedin.com/in/evan-mathew-abraham-0587a2179/)
