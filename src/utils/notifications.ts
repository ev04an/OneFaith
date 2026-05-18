// Local scheduled notification system. Daily morning verse, evening prayer
// reminder, plus a streak nudge. Uses expo-notifications' scheduled triggers,
// re-scheduled whenever settings change. No remote push.
//
// Everything here is defensive: any failure (missing permission, Expo Go
// limitations, transient native errors) is swallowed and logged in dev only,
// so notification setup can never bubble an error to the user on launch.
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { VERSES } from '../data/verses';

const MORNING_ID_PREFIX = 'morning-verse';
const EVENING_ID_PREFIX = 'evening-prayer';
const STREAK_ID_PREFIX = 'streak-nudge';

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
];

const EVENING_LINES = [
  'Lay the day down. He keeps watch.',
  'You don’t have to fix it tonight. Rest is faithful too.',
  'Whatever today held, His mercy is new tomorrow.',
  'Cast your worries. He cares for you. — 1 Peter 5:7',
  'Sleep in peace. You are kept.',
];

const STREAK_LINES = [
  'You’ve come this far. Keep going.',
  'Small, faithful steps. He sees every one.',
  'Today is one more rep of becoming who He’s making you.',
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
    await Notifications.setNotificationChannelAsync('default', {
      name: 'OneFaith',
      importance: Notifications.AndroidImportance.DEFAULT,
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

function pick<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length];
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

// Called whenever settings change. Never prompts for permission, never throws.
// If permission isn't granted, simply skips scheduling — the app continues
// loading normally and the toggle in Settings remains the source of truth.
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

    const seedDay = Math.floor(Date.now() / 86_400_000);

    if (
      cfg.morningEnabled &&
      !isQuiet(cfg.morningHour, cfg.quietStart, cfg.quietEnd)
    ) {
      const v = pick(VERSES, seedDay);
      await safeSchedule({
        identifier: `${MORNING_ID_PREFIX}-${cfg.morningHour}`,
        content: {
          title: pick(MORNING_LINES, seedDay),
          body: `“${truncate(v.text, 140)}” — ${v.reference}`,
          data: { type: 'morning', verseId: v.id },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour: cfg.morningHour,
          minute: 0,
        },
      });
    }

    if (
      cfg.eveningEnabled &&
      !isQuiet(cfg.eveningHour, cfg.quietStart, cfg.quietEnd)
    ) {
      await safeSchedule({
        identifier: `${EVENING_ID_PREFIX}-${cfg.eveningHour}`,
        content: {
          title: 'A moment with God',
          body: pick(EVENING_LINES, seedDay + 1),
          data: { type: 'evening' },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour: cfg.eveningHour,
          minute: 0,
        },
      });
    }

    if (cfg.streakEnabled) {
      const hour = 15;
      if (!isQuiet(hour, cfg.quietStart, cfg.quietEnd)) {
        await safeSchedule({
          identifier: `${STREAK_ID_PREFIX}-${hour}`,
          content: {
            title: 'Keep going',
            body: pick(STREAK_LINES, seedDay + 2),
            data: { type: 'streak' },
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DAILY,
            hour,
            minute: 30,
          },
        });
      }
    }
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
