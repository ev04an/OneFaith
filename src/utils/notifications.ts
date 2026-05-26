// Local scheduled notification system. Daily morning verse, evening prayer
// reminder, plus a streak nudge. Uses expo-notifications' scheduled triggers,
// re-scheduled whenever settings change. No remote push.
//
// Everything here is defensive: any failure (missing permission, Expo Go
// limitations, transient native errors) is swallowed and logged in dev only,
// so notification setup can never bubble an error to the user on launch.
//
// Daily-rotation design
// ─────────────────────
// Earlier this file used a single `DAILY` trigger per slot. That trigger
// fires the SAME pre-recorded content every day until rescheduled — so users
// saw the exact same verse + line forever, even though we picked from a list
// at schedule time. The fix is to enqueue N individual dated notifications
// (`SchedulableTriggerInputTypes.DATE`) covering the next two weeks. Each one
// is seeded by its own target day, so morning notifications cycle through
// verses and copy lines naturally.
//
// The queue is refreshed every time settings change OR the app launches
// (NotificationScheduler in App.tsx runs `rescheduleAll` on every mount), so
// in practice the queue never runs out — opening the app re-fills the next
// 14 days. If a user doesn't open the app for two weeks, notifications quiet
// down. That's a reasonable safety valve, not a bug.
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { VERSES } from '../data/verses';

const MORNING_ID_PREFIX = 'morning-verse';
const EVENING_ID_PREFIX = 'evening-prayer';
const STREAK_ID_PREFIX = 'streak-nudge';

// Number of days to pre-schedule. iOS caps total scheduled notifications at
// 64 per app — three slots × 14 days = 42, well under the cap. Each app
// launch refreshes this queue, so a real user almost never empties it.
const SCHEDULE_AHEAD_DAYS = 14;

const MORNING_LINES = [
  'God is with you today. Stay strong.',
  'A new day, a new mercy. He goes before you.',
  'Lift your eyes. The Maker of mornings is for you.',
  'One small step today is enough.',
  'You are loved before you do anything. Breathe that in.',
  'Did you read the Bible today?',
  'God is watching over you.',
  'Take a moment to pray today.',
  'God’s grace is with you.',
  'You are stronger than your struggles.',
  'Spend a few minutes with God’s word today.',
  'Trust God’s timing.',
  'Remember: you are never alone.',
  'His mercies are new this morning.',
  'You don’t walk into today alone.',
  'Today does not have to be perfect to be holy.',
  'Begin the day with a quiet word to God.',
  'You are seen. You are kept. You are loved.',
  'A small prayer is still a prayer.',
  'Let your first thought be gratitude.',
  'God already knows what today will ask of you.',
  'Be gentle with yourself. He is.',
  'Strength for today, hope for tomorrow.',
  'Whatever comes, He will help you carry it.',
  'You are exactly where He can meet you.',
  'Open your hands. Receive grace.',
  'Today is a gift, not a test.',
  'He is not done with you yet.',
  'Choose one good thing. Then breathe.',
  'You belong to Him today.',
  'Let your soul exhale.',
  'There is room for joy today, even small.',
];

const EVENING_LINES = [
  'Lay the day down. He keeps watch.',
  'You don’t have to fix it tonight. Rest is faithful too.',
  'Whatever today held, His mercy is new tomorrow.',
  'Cast your worries. He cares for you. — 1 Peter 5:7',
  'Sleep in peace. You are kept.',
  'Hand the day over. Sleep is an act of trust.',
  'It is finished, even if it is unfinished.',
  'The Lord will give you sleep that He loves. — Psalm 127:2',
  'You did more good today than you remember.',
  'Soft heart. Quiet mind. Steady hope.',
  'Let go of the day. Hold on to Him.',
  'Tomorrow’s grace is already on its way.',
  'Be still and know that He is God. — Psalm 46:10',
  'The same God who carried you today will keep you tonight.',
  'Forgive the day. Forgive yourself.',
  'Lay your head down with gratitude.',
  'He never sleeps so you can.',
  'A quiet evening prayer is a gift to your soul.',
  'You are loved at the end of the day too.',
  'Light a candle of thanks before you sleep.',
  'The Maker of the stars is watching over you.',
  'Rest is holy. Take it.',
];

const STREAK_LINES = [
  'You’ve come this far. Keep going.',
  'Small, faithful steps. He sees every one.',
  'Today is one more rep of becoming who He’s making you.',
  'Look how far you’ve come. He’s with you for the next step.',
  'One day at a time. That’s exactly enough.',
  'Faithfulness is just showing up again.',
  'You are not who you were. Keep going.',
  'Your past does not get to write your future.',
  'Every day clean is a quiet kind of worship.',
  'Stay the course. He is with you in it.',
  'Grace for what’s past. Strength for what’s next.',
  'The middle is the hardest. You’re doing the work.',
  'He sees you choosing well, even when no one else does.',
  'Tomorrow’s freedom is built today.',
  'You are loved on day 1 and day 1000.',
];

function warn(label: string, err: unknown) {
  if (__DEV__) {
    // eslint-disable-next-line no-console
    console.warn(`[notifications] ${label}:`, err);
  }
}

// setNotificationHandler is a side effect at module load. Wrap it so a failure
// here can't crash the JS bundle on startup.
try {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
} catch (e) {
  warn('setNotificationHandler', e);
}

export type ScheduleConfig = {
  enabled: boolean;
  morningEnabled: boolean;
  eveningEnabled: boolean;
  streakEnabled: boolean;
  morningHour: number; // 0..23
  eveningHour: number;
  quietStart: number; // hour
  quietEnd: number;
};

export async function ensureChannel(): Promise<void> {
  if (Platform.OS !== 'android') return;
  try {
    // HIGH importance — needed so daily reminders show as heads-up and aren't
    // silently bucketed by Android's adaptive notifications. DEFAULT was being
    // suppressed on some devices.
    await Notifications.setNotificationChannelAsync('default', {
      name: 'OneFaith',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 120, 60, 120],
      lightColor: '#5B9BE3',
      sound: undefined,
    });
  } catch (e) {
    warn('ensureChannel', e);
  }
}

// Read-only permission check. Never prompts. Safe to call any time.
export async function hasNotificationPermission(): Promise<boolean> {
  try {
    const settings = await Notifications.getPermissionsAsync();
    if (settings.granted) return true;
    if (settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL) {
      return true;
    }
    return false;
  } catch (e) {
    warn('getPermissionsAsync', e);
    return false;
  }
}

// Explicit prompt — only call from a user-initiated action (Settings toggle).
// Never called as a side effect of app launch.
export async function requestNotificationPermission(): Promise<boolean> {
  try {
    if (await hasNotificationPermission()) return true;
    const req = await Notifications.requestPermissionsAsync({
      ios: {
        allowAlert: true,
        allowBadge: false,
        allowSound: false,
      },
    });
    return (
      req.granted ||
      req.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL
    );
  } catch (e) {
    warn('requestPermissionsAsync', e);
    return false;
  }
}

function isQuiet(hour: number, start: number, end: number): boolean {
  if (start === end) return false;
  if (start < end) return hour >= start && hour < end;
  return hour >= start || hour < end; // wraps midnight
}

function pick<T>(arr: readonly T[], seed: number): T {
  // Modulo on a positive seed; the arrays are small so collisions across
  // adjacent days are intentional — the user sees the same line at most every
  // arr.length days. Verses pool has 100+ entries, so morning verses feel
  // distinct day-to-day.
  return arr[((seed % arr.length) + arr.length) % arr.length];
}

// Build a Date that fires at `hour:minute` on `daysFromToday`. If that time has
// already passed today (daysFromToday === 0), returns null so we skip it
// instead of scheduling in the past (expo-notifications would either fire
// immediately or reject the schedule).
function buildTriggerDate(
  daysFromToday: number,
  hour: number,
  minute: number,
): Date | null {
  const d = new Date();
  d.setDate(d.getDate() + daysFromToday);
  d.setHours(hour, minute, 0, 0);
  if (d.getTime() <= Date.now() + 60_000) return null;
  return d;
}

async function safeCancelByPrefix(prefix: string): Promise<void> {
  try {
    const all = await Notifications.getAllScheduledNotificationsAsync();
    await Promise.all(
      all
        .filter((n) => (n.identifier ?? '').startsWith(prefix))
        .map((n) =>
          Notifications.cancelScheduledNotificationAsync(n.identifier).catch((e) =>
            warn('cancelScheduledNotificationAsync', e),
          ),
        ),
    );
  } catch (e) {
    warn('cancelByPrefix', e);
  }
}

async function safeSchedule(
  request: Notifications.NotificationRequestInput,
): Promise<void> {
  try {
    await Notifications.scheduleNotificationAsync(request);
  } catch (e) {
    warn('scheduleNotificationAsync', e);
  }
}

// Schedule a dated notification N days from today at hour:minute. Skips if
// the build date is null (already past) or in quiet hours.
async function scheduleAtFutureDay(opts: {
  idPrefix: string;
  daysFromToday: number;
  hour: number;
  minute: number;
  title: string;
  body: string;
  data?: Record<string, unknown>;
  quietStart: number;
  quietEnd: number;
}): Promise<void> {
  if (isQuiet(opts.hour, opts.quietStart, opts.quietEnd)) return;
  const date = buildTriggerDate(opts.daysFromToday, opts.hour, opts.minute);
  if (!date) return;
  const dayKey = Math.floor(date.getTime() / 86_400_000);
  await safeSchedule({
    identifier: `${opts.idPrefix}-${dayKey}-${opts.hour}`,
    content: {
      title: opts.title,
      body: opts.body,
      data: opts.data,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date,
    },
  });
}

// Called whenever settings change OR the app launches. Cancels every previously
// scheduled morning / evening / streak notification, then enqueues a fresh
// 14-day queue with content rotated by each day's date seed. Different verse
// every morning, different line every evening, different nudge every afternoon.
export async function rescheduleAll(cfg: ScheduleConfig): Promise<void> {
  try {
    await ensureChannel();

    await Promise.all([
      safeCancelByPrefix(MORNING_ID_PREFIX),
      safeCancelByPrefix(EVENING_ID_PREFIX),
      safeCancelByPrefix(STREAK_ID_PREFIX),
    ]);

    if (!cfg.enabled) return;

    const granted = await hasNotificationPermission();
    if (!granted) return;

    // Build the queue sequentially-but-concurrently. Each day's content is
    // seeded by that day's epoch-day number, so the rotation is deterministic
    // — the same Tuesday next month will have the same verse-and-line as a
    // Tuesday last month, which gives a gentle "I've seen this one before"
    // feel without the same-thing-every-day boredom.
    const tasks: Promise<void>[] = [];

    for (let offset = 0; offset < SCHEDULE_AHEAD_DAYS; offset++) {
      const morningDate = buildTriggerDate(offset, cfg.morningHour, 0);
      const eveningDate = buildTriggerDate(offset, cfg.eveningHour, 0);
      const streakDate = buildTriggerDate(offset, 15, 30);

      // Seed each slot independently so morning/evening/streak rotations aren't
      // locked in lockstep (otherwise they'd all roll over together each day).
      const morningSeed = morningDate
        ? Math.floor(morningDate.getTime() / 86_400_000)
        : 0;
      const eveningSeed = eveningDate
        ? Math.floor(eveningDate.getTime() / 86_400_000) + 17
        : 0;
      const streakSeed = streakDate
        ? Math.floor(streakDate.getTime() / 86_400_000) + 41
        : 0;

      if (cfg.morningEnabled && morningDate) {
        const verse = pick(VERSES, morningSeed);
        tasks.push(
          scheduleAtFutureDay({
            idPrefix: MORNING_ID_PREFIX,
            daysFromToday: offset,
            hour: cfg.morningHour,
            minute: 0,
            title: pick(MORNING_LINES, morningSeed),
            body: `“${truncate(verse.text, 140)}” — ${verse.reference}`,
            data: { type: 'morning', verseId: verse.id },
            quietStart: cfg.quietStart,
            quietEnd: cfg.quietEnd,
          }),
        );
      }

      if (cfg.eveningEnabled && eveningDate) {
        tasks.push(
          scheduleAtFutureDay({
            idPrefix: EVENING_ID_PREFIX,
            daysFromToday: offset,
            hour: cfg.eveningHour,
            minute: 0,
            title: 'A moment with God',
            body: pick(EVENING_LINES, eveningSeed),
            data: { type: 'evening' },
            quietStart: cfg.quietStart,
            quietEnd: cfg.quietEnd,
          }),
        );
      }

      if (cfg.streakEnabled && streakDate) {
        tasks.push(
          scheduleAtFutureDay({
            idPrefix: STREAK_ID_PREFIX,
            daysFromToday: offset,
            hour: 15,
            minute: 30,
            title: 'Keep going',
            body: pick(STREAK_LINES, streakSeed),
            data: { type: 'streak' },
            quietStart: cfg.quietStart,
            quietEnd: cfg.quietEnd,
          }),
        );
      }
    }

    await Promise.all(tasks);
  } catch (e) {
    warn('rescheduleAll', e);
  }
}

function truncate(s: string, max: number): string {
  return s.length > max ? s.slice(0, max - 1) + '…' : s;
}

export async function cancelAll(): Promise<void> {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (e) {
    warn('cancelAll', e);
  }
}
