import React, { useEffect, useState } from 'react';
import { LogBox } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

// Keep the native splash visible until fonts + persisted stores are ready, so
// the transition from splash to the app is a smooth fade rather than a flash.
SplashScreen.preventAutoHideAsync().catch(() => {});

// In Expo Go on Android, expo-notifications prints a yellow warning on every
// launch about remote-push functionality being removed in SDK 53. We don't use
// remote push (only local scheduled notifications), so this warning is noise.
// It only ever appears in dev — production builds are unaffected.
LogBox.ignoreLogs([
  /expo-notifications.*remote.*Expo Go/i,
  /expo-notifications.*Android Push/i,
  /`expo-notifications` functionality is not fully supported in Expo Go/i,
]);
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  useFonts as useFraunces,
  Fraunces_500Medium,
  Fraunces_600SemiBold,
  Fraunces_700Bold,
  Fraunces_800ExtraBold,
} from '@expo-google-fonts/fraunces';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
} from '@expo-google-fonts/inter';
import { ThemeProvider, useTheme } from './src/theme';
import { RootNavigator } from './src/navigation/RootNavigator';
import {
  useSettingsStore,
  useStreakStore,
  useFavoritesStore,
  useJournalStore,
  useChatStore,
  useSavedPrayersStore,
  useBibleStore,
  useFeedbackStore,
  usePrayerIntentionsStore,
  useAIMemoryStore,
} from './src/state/store';
import {
  hasNotificationPermission,
  requestNotificationPermission,
  rescheduleAll,
} from './src/utils/notifications';
import { ToastProvider } from './src/components/Toast';
import { useAuthStore } from './src/state/auth';

function useHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    const stores = [
      useSettingsStore,
      useStreakStore,
      useFavoritesStore,
      useJournalStore,
      useChatStore,
      useSavedPrayersStore,
      useBibleStore,
      useFeedbackStore,
      usePrayerIntentionsStore,
      useAIMemoryStore,
    ];
    let pending = stores.length;
    const unsubs: Array<() => void> = [];
    const done = () => {
      pending -= 1;
      if (pending <= 0) setHydrated(true);
    };
    stores.forEach((s) => {
      if (s.persist.hasHydrated()) done();
      else unsubs.push(s.persist.onFinishHydration(done));
    });
    return () => unsubs.forEach((u) => u());
  }, []);
  return hydrated;
}

function AuthInitializer() {
  const init = useAuthStore((s) => s.init);
  useEffect(() => {
    init().catch(() => {});
  }, [init]);
  return null;
}

function NotificationScheduler() {
  const enabled = useSettingsStore((s) => s.notificationsEnabled);
  const morning = useSettingsStore((s) => s.morningVerseEnabled);
  const evening = useSettingsStore((s) => s.eveningPrayerEnabled);
  const streak = useSettingsStore((s) => s.streakReminderEnabled);
  const morningHour = useSettingsStore((s) => s.morningHour);
  const eveningHour = useSettingsStore((s) => s.eveningHour);
  const quietStart = useSettingsStore((s) => s.quietStart);
  const quietEnd = useSettingsStore((s) => s.quietEnd);
  const permAsked = useSettingsStore((s) => s.notificationPermissionAsked);
  const setPermAsked = useSettingsStore((s) => s.setNotificationPermissionAsked);

  useEffect(() => {
    (async () => {
      // First-launch flow: if notifications are enabled by default but the OS
      // permission was never requested (Android 13+ requires runtime grant for
      // POST_NOTIFICATIONS), prompt the user once. Without this, the Settings
      // toggle looks ON but no reminders ever fire because permission is
      // implicitly denied.
      if (enabled && !permAsked) {
        const already = await hasNotificationPermission();
        if (!already) {
          await requestNotificationPermission().catch(() => {});
        }
        setPermAsked(true);
      }
      rescheduleAll({
        enabled,
        morningEnabled: morning,
        eveningEnabled: evening,
        streakEnabled: streak,
        morningHour,
        eveningHour,
        quietStart,
        quietEnd,
      }).catch(() => {});
    })();
  }, [
    enabled,
    morning,
    evening,
    streak,
    morningHour,
    eveningHour,
    quietStart,
    quietEnd,
    permAsked,
    setPermAsked,
  ]);

  return null;
}

function Inner() {
  const theme = useTheme();
  const hydrated = useHydrated();
  const [fontsLoaded] = useFraunces({
    Fraunces_500Medium,
    Fraunces_600SemiBold,
    Fraunces_700Bold,
    Fraunces_800ExtraBold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });
  const ready = hydrated && fontsLoaded;

  const intro = useSharedValue(0);
  useEffect(() => {
    if (ready) {
      SplashScreen.hideAsync().catch(() => {});
      intro.value = withTiming(1, {
        duration: 600,
        easing: Easing.out(Easing.cubic),
      });
    }
  }, [ready, intro]);

  const introStyle = useAnimatedStyle(() => ({
    opacity: intro.value,
    transform: [{ scale: 0.985 + intro.value * 0.015 }],
  }));

  if (!ready) {
    // Keep this empty — the native splash is still visible. Once `ready` is
    // true, the splash hides and the content below fades in.
    return null;
  }

  return (
    <Animated.View style={[{ flex: 1 }, introStyle]}>
      <StatusBar style={theme.isDark ? 'light' : 'dark'} />
      <AuthInitializer />
      <NotificationScheduler />
      <ToastProvider>
        <RootNavigator />
      </ToastProvider>
    </Animated.View>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <Inner />
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
