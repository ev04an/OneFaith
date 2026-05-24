import React from 'react';
import {
  Alert,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { ScreenHeader } from '../components/ScreenHeader';
import { GlassCard } from '../components/GlassCard';
import { GradientButton } from '../components/GradientButton';
import { CustomSwitch } from '../components/CustomSwitch';
import { useTheme } from '../theme';
import { ACCENTS, type AccentKey } from '../theme/accents';
import type { FontScale } from '../theme/typography';
import {
  useSettingsStore,
  useStreakStore,
  useFavoritesStore,
  useJournalStore,
  useChatStore,
} from '../state/store';
import { PressableScale } from '../components/PressableScale';
import { useAuthStore } from '../state/auth';
import { useAIMemoryStore } from '../state/store';
import {
  hasNotificationPermission,
  requestNotificationPermission,
} from '../utils/notifications';
import * as haptics from '../utils/haptics';
import type { RootStackParamList } from '../navigation/types';

export function SettingsScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const settings = useSettingsStore();
  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);
  const memoryEnabled = useAIMemoryStore((s) => s.enabled);
  const setMemoryEnabled = useAIMemoryStore((s) => s.setEnabled);
  const clearMemory = useAIMemoryStore((s) => s.clear);

  const confirmClearMemory = () => {
    Alert.alert(
      'Clear AI memory?',
      'OneFaith will forget the emotions and topics it has learned about you. Your journal, favorites, and chat history are not affected.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear memory',
          style: 'destructive',
          onPress: () => clearMemory(),
        },
      ],
    );
  };

  const confirmSignOut = () => {
    Alert.alert('Sign out?', 'You can sign back in any time.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign out',
        style: 'destructive',
        onPress: () => {
          signOut().catch(() => {});
        },
      },
    ]);
  };

  const toggleNotifications = async (next: boolean) => {
    if (!next) {
      settings.setNotificationsEnabled(false);
      return;
    }
    const already = await hasNotificationPermission();
    if (already) {
      settings.setNotificationsEnabled(true);
      return;
    }
    const granted = await requestNotificationPermission();
    if (granted) {
      settings.setNotificationsEnabled(true);
    } else {
      Alert.alert(
        'Notifications are off',
        'Enable notifications for OneFaith in your phone settings to receive daily reminders.',
        [{ text: 'OK' }],
      );
    }
  };

  const wipe = () => {
    Alert.alert(
      'Reset all app data?',
      'This will erase your streak, journal entries, favorites, and conversation history. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Erase everything',
          style: 'destructive',
          onPress: () => {
            useStreakStore.setState({ startedAt: null, longestMs: 0, totalResets: 0, history: [] });
            useFavoritesStore.setState({ verses: [], prayers: [], affirmations: [] });
            useJournalStore.setState({ entries: [] });
            useChatStore.setState({ messages: [] });
          },
        },
      ],
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <AnimatedBackground intensity={0.55} />
      <ScreenHeader onBack={() => nav.goBack()} title="Settings" large subtitle="APP" />

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: theme.spacing.screen,
          paddingTop: theme.spacing.lg,
          paddingBottom: insets.bottom + 60,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Account */}
        <Section title="ACCOUNT">
          <GlassCard padded={false}>
            {user ? (
              <>
                <LinkRow
                  icon="person-circle-outline"
                  label="Signed in"
                  value={user.email ?? 'OneFaith account'}
                />
                <Divider />
                <PressableScale onPress={confirmSignOut}>
                  <View style={styles.flatRow}>
                    <Ionicons name="log-out-outline" size={22} color={theme.colors.danger} />
                    <Text
                      style={[
                        theme.typography.bodyBold,
                        {
                          color: theme.colors.danger,
                          fontSize: 15,
                          flex: 1,
                          marginLeft: theme.spacing.md,
                        },
                      ]}
                    >
                      Sign out
                    </Text>
                  </View>
                </PressableScale>
              </>
            ) : (
              <LinkRow
                icon="log-in-outline"
                label="Sign in or create an account"
                value="Keep your journey synced across devices"
                onPress={() => nav.navigate('Auth')}
              />
            )}
          </GlassCard>
        </Section>

        {/* Profile */}
        <Section title="PROFILE">
          <GlassCard>
            <Text
              style={[
                theme.typography.bodyBold,
                { color: theme.colors.text, fontSize: 16 },
              ]}
            >
              Display name
            </Text>
            <Text
              style={[
                theme.typography.caption,
                { color: theme.colors.textMuted, marginTop: 4, marginBottom: 10 },
              ]}
            >
              Used in greetings. Leave blank to be greeted as "Child of God".
            </Text>
            <View
              style={[
                styles.profileField,
                {
                  backgroundColor: theme.colors.inputBg,
                  borderColor: theme.colors.inputBorder,
                },
              ]}
            >
              <TextInput
                value={settings.userName}
                onChangeText={settings.setUserName}
                placeholder="Your first name"
                placeholderTextColor={theme.colors.inputPlaceholder}
                selectionColor={theme.colors.primary}
                cursorColor={theme.colors.inputCaret}
                underlineColorAndroid="transparent"
                autoCorrect={false}
                autoCapitalize="words"
                maxLength={40}
                style={[
                  theme.typography.body,
                  { color: theme.colors.inputText, padding: 0, fontSize: 15 },
                ]}
              />
            </View>

            <Text
              style={[
                theme.typography.bodyBold,
                { color: theme.colors.text, fontSize: 16, marginTop: 18 },
              ]}
            >
              Username
            </Text>
            <Text
              style={[
                theme.typography.caption,
                { color: theme.colors.textMuted, marginTop: 4, marginBottom: 10 },
              ]}
            >
              Optional handle for your profile card.
            </Text>
            <View
              style={[
                styles.profileField,
                {
                  backgroundColor: theme.colors.inputBg,
                  borderColor: theme.colors.inputBorder,
                },
              ]}
            >
              <TextInput
                value={settings.userUsername}
                onChangeText={settings.setUserUsername}
                placeholder="@yourhandle"
                placeholderTextColor={theme.colors.inputPlaceholder}
                selectionColor={theme.colors.primary}
                cursorColor={theme.colors.inputCaret}
                underlineColorAndroid="transparent"
                autoCorrect={false}
                autoCapitalize="none"
                maxLength={30}
                style={[
                  theme.typography.body,
                  { color: theme.colors.inputText, padding: 0, fontSize: 15 },
                ]}
              />
            </View>
          </GlassCard>
        </Section>

        {/* Theme */}
        <Section title="APPEARANCE">
          <GlassCard>
            <Text
              style={[
                theme.typography.bodyBold,
                { color: theme.colors.text, fontSize: 16, marginBottom: 12 },
              ]}
            >
              Theme
            </Text>
            <SegRow
              options={[
                { id: 'system', label: 'System', icon: 'phone-portrait-outline' },
                { id: 'light', label: 'Light', icon: 'sunny-outline' },
                { id: 'dark', label: 'Dark', icon: 'moon-outline' },
              ]}
              value={settings.themePreference}
              onChange={(v) => {
                haptics.select();
                settings.setThemePreference(v as any);
              }}
            />
          </GlassCard>

          <GlassCard style={{ marginTop: theme.spacing.md }}>
            <Text
              style={[
                theme.typography.bodyBold,
                { color: theme.colors.text, fontSize: 16, marginBottom: 4 },
              ]}
            >
              Accent color
            </Text>
            <Text
              style={[
                theme.typography.caption,
                { color: theme.colors.textMuted, marginBottom: 14 },
              ]}
            >
              Used for highlights, buttons, and glows.
            </Text>
            <AccentPicker
              value={settings.accentKey}
              onChange={(v) => {
                haptics.select();
                settings.setAccentKey(v);
              }}
            />
          </GlassCard>

          <GlassCard style={{ marginTop: theme.spacing.md }}>
            <Text
              style={[
                theme.typography.bodyBold,
                { color: theme.colors.text, fontSize: 16, marginBottom: 12 },
              ]}
            >
              Font size
            </Text>
            <SegRow
              options={[
                { id: 'sm', label: 'Small' },
                { id: 'md', label: 'Default' },
                { id: 'lg', label: 'Large' },
              ]}
              value={settings.fontScale}
              onChange={(v) => {
                haptics.select();
                settings.setFontScale(v as FontScale);
              }}
            />
          </GlassCard>
        </Section>

        {/* Experience */}
        <Section title="EXPERIENCE">
          <GlassCard padded={false}>
            <ToggleRow
              icon="phone-portrait-outline"
              label="Haptic feedback"
              value={settings.hapticsEnabled}
              onChange={settings.setHapticsEnabled}
            />
          </GlassCard>
        </Section>

        {/* Notifications */}
        <Section title="NOTIFICATIONS">
          <GlassCard padded={false}>
            <ToggleRow
              icon="notifications-outline"
              label="Daily reminders"
              sub="Gentle, scheduled encouragement"
              value={settings.notificationsEnabled}
              onChange={(v) => {
                toggleNotifications(v).catch(() => {});
              }}
            />
            {settings.notificationsEnabled ? (
              <>
                <Divider />
                <ToggleRow
                  icon="sunny-outline"
                  label="Morning verse"
                  sub={`Daily at ${formatHour(settings.morningHour)}`}
                  value={settings.morningVerseEnabled}
                  onChange={settings.setMorningVerseEnabled}
                />
                <Divider />
                <ToggleRow
                  icon="moon-outline"
                  label="Evening prayer"
                  sub={`Daily at ${formatHour(settings.eveningHour)}`}
                  value={settings.eveningPrayerEnabled}
                  onChange={settings.setEveningPrayerEnabled}
                />
                <Divider />
                <ToggleRow
                  icon="flame-outline"
                  label="Streak nudge"
                  sub="A small midday encouragement"
                  value={settings.streakReminderEnabled}
                  onChange={settings.setStreakReminderEnabled}
                />
              </>
            ) : null}
          </GlassCard>
          {settings.notificationsEnabled ? (
            <>
              <GlassCard>
                <Text
                  style={[
                    theme.typography.bodyBold,
                    { color: theme.colors.text, marginBottom: 10 },
                  ]}
                >
                  Times
                </Text>
                <HourPickerRow
                  label="Morning at"
                  value={settings.morningHour}
                  onChange={settings.setMorningHour}
                />
                <View style={{ height: 10 }} />
                <HourPickerRow
                  label="Evening at"
                  value={settings.eveningHour}
                  onChange={settings.setEveningHour}
                />
                <View style={{ height: 16 }} />
                <Text
                  style={[
                    theme.typography.caption,
                    { color: theme.colors.text, opacity: 0.78 },
                  ]}
                >
                  Quiet hours (no notifications between)
                </Text>
                <View style={{ flexDirection: 'row', gap: 10, marginTop: 8 }}>
                  <View style={{ flex: 1 }}>
                    <HourPickerRow
                      label="From"
                      value={settings.quietStart}
                      onChange={settings.setQuietStart}
                      compact
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <HourPickerRow
                      label="To"
                      value={settings.quietEnd}
                      onChange={settings.setQuietEnd}
                      compact
                    />
                  </View>
                </View>
              </GlassCard>
            </>
          ) : null}
        </Section>

        {/* AI Companion */}
        <Section title="AI COMPANION">
          <GlassCard padded={false}>
            <ToggleRow
              icon="sparkles-outline"
              label="AI memory"
              sub="Lets the companion remember the emotions and topics you talk about, so it can respond more personally."
              value={memoryEnabled}
              onChange={(v) => {
                haptics.select();
                setMemoryEnabled(v);
              }}
            />
            <Divider />
            <LinkRow
              icon="trash-outline"
              label="Clear AI memory"
              value="Reset everything OneFaith has learned"
              onPress={confirmClearMemory}
            />
          </GlassCard>
        </Section>

        {/* Privacy */}
        <Section title="PRIVACY">
          <GlassCard padded={false}>
            <ToggleRow
              icon="finger-print-outline"
              label="Biometric lock"
              sub="Require Face / Touch ID to open the app"
              value={settings.biometricLock}
              onChange={settings.setBiometricLock}
            />
          </GlassCard>
        </Section>

        {/* About */}
        <Section title="ABOUT">
          <GlassCard padded={false}>
            <LinkRow
              icon="person-circle-outline"
              label="About the developer"
              value="Evan Mathew Abraham"
              onPress={() => nav.navigate('AboutDeveloper')}
            />
            <Divider />
            <LinkRow
              icon="book-outline"
              label="Scripture translation"
              value="World English Bible (public domain)"
            />
            <Divider />
            <LinkRow
              icon="shield-checkmark-outline"
              label="Privacy Policy"
              value="How we handle your data"
              onPress={() => {
                Linking.openURL('https://onefaith-app.netlify.app/privacy.html').catch(() => {});
              }}
            />
            <Divider />
            <LinkRow
              icon="document-text-outline"
              label="Terms of Use"
              value="The rules of the road"
              onPress={() => {
                Linking.openURL('https://onefaith-app.netlify.app/terms.html').catch(() => {});
              }}
            />
          </GlassCard>
        </Section>

        <View style={{ marginTop: theme.spacing.lg }}>
          <GradientButton
            label="Erase all data"
            icon="trash-outline"
            gradient="fire"
            full
            onPress={wipe}
          />
        </View>

        <Text
          style={[
            theme.typography.caption,
            {
              color: theme.colors.textMuted,
              textAlign: 'center',
              marginTop: theme.spacing.xl,
            },
          ]}
        >
          OneFaith v1.0 — Made with faith and purpose.
        </Text>
      </ScrollView>
    </View>
  );
}

/* -------------------------------- Helpers -------------------------------- */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const theme = useTheme();
  return (
    <View style={{ marginBottom: theme.spacing.xl }}>
      <Text
        style={[
          theme.typography.overline,
          { color: theme.colors.textMuted, marginBottom: 12 },
        ]}
      >
        {title}
      </Text>
      <View style={{ gap: theme.spacing.md }}>{children}</View>
    </View>
  );
}

function Divider() {
  const theme = useTheme();
  return (
    <View
      style={{
        height: StyleSheet.hairlineWidth,
        backgroundColor: theme.colors.border,
        marginLeft: 54,
      }}
    />
  );
}

function ToggleRow({
  icon,
  label,
  sub,
  value,
  onChange,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  sub?: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  const theme = useTheme();
  return (
    <View style={styles.flatRow}>
      <Ionicons name={icon} size={22} color={theme.colors.primary} />
      <View style={{ flex: 1, marginLeft: theme.spacing.md }}>
        <Text
          style={[
            theme.typography.bodyBold,
            { color: theme.colors.text, fontSize: 15 },
          ]}
        >
          {label}
        </Text>
        {sub ? (
          <Text
            style={[
              theme.typography.caption,
              { color: theme.colors.textMuted, marginTop: 3, fontSize: 12 },
            ]}
          >
            {sub}
          </Text>
        ) : null}
      </View>
      <CustomSwitch
        value={value}
        onValueChange={onChange}
      />
    </View>
  );
}

function LinkRow({
  icon,
  label,
  value,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  onPress?: () => void;
}) {
  const theme = useTheme();
  const body = (
    <View style={styles.flatRow}>
      <Ionicons name={icon} size={22} color={theme.colors.primary} />
      <View style={{ flex: 1, marginLeft: theme.spacing.md }}>
        <Text
          style={[
            theme.typography.bodyBold,
            { color: theme.colors.text, fontSize: 15 },
          ]}
        >
          {label}
        </Text>
        <Text
          style={[
            theme.typography.caption,
            { color: theme.colors.textMuted, marginTop: 3, fontSize: 12 },
          ]}
        >
          {value}
        </Text>
      </View>
      {onPress ? (
        <Ionicons name="chevron-forward" size={18} color={theme.colors.textFaint} />
      ) : null}
    </View>
  );
  if (!onPress) return body;
  return <PressableScale onPress={onPress}>{body}</PressableScale>;
}

function SegRow<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { id: T; label: string; icon?: keyof typeof Ionicons.glyphMap }[];
  value: T;
  onChange: (v: T) => void;
}) {
  const theme = useTheme();
  return (
    <View
      style={[
        styles.segGroup,
        {
          borderColor: theme.colors.borderStrong,
          backgroundColor: theme.isDark ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.45)',
        },
      ]}
    >
      {options.map((o) => {
        const active = o.id === value;
        return (
          <Pressable
            key={o.id}
            onPress={() => onChange(o.id)}
            style={[
              styles.seg,
              active && {
                backgroundColor: theme.colors.primary,
              },
            ]}
          >
            {o.icon ? (
              <Ionicons
                name={o.icon}
                size={14}
                color={active ? '#fff' : theme.colors.textMuted}
                style={{ marginRight: 6 }}
              />
            ) : null}
            <Text
              style={{
                color: active ? '#fff' : theme.colors.textMuted,
                fontSize: 13,
                fontWeight: '700',
                letterSpacing: 0.3,
              }}
            >
              {o.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function AccentPicker({
  value,
  onChange,
}: {
  value: AccentKey;
  onChange: (v: AccentKey) => void;
}) {
  const keys = Object.keys(ACCENTS) as AccentKey[];
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
      {keys.map((k) => (
        <AccentSwatch key={k} accent={k} active={k === value} onPress={() => onChange(k)} />
      ))}
    </View>
  );
}

function AccentSwatch({
  accent,
  active,
  onPress,
}: {
  accent: AccentKey;
  active: boolean;
  onPress: () => void;
}) {
  const theme = useTheme();
  const stops = ACCENTS[accent].gradient;
  const scale = useSharedValue(active ? 1 : 0);
  React.useEffect(() => {
    scale.value = withSpring(active ? 1 : 0, { damping: 14, stiffness: 220 });
  }, [active, scale]);
  const ringStyle = useAnimatedStyle(() => ({ opacity: scale.value, transform: [{ scale: 0.95 + scale.value * 0.08 }] }));
  return (
    <Pressable onPress={onPress} style={{ alignItems: 'center', width: 60 }}>
      <View style={styles.swatchWrap}>
        <Animated.View
          style={[
            styles.swatchRing,
            { borderColor: theme.colors.text },
            ringStyle,
          ]}
        />
        <LinearGradient
          colors={stops as any}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.swatch, active && theme.shadow.glow]}
        />
      </View>
      <Text
        style={[
          theme.typography.caption,
          { color: active ? theme.colors.text : theme.colors.textMuted, marginTop: 8, fontSize: 12 },
        ]}
      >
        {ACCENTS[accent].name}
      </Text>
    </Pressable>
  );
}

function formatHour(h: number): string {
  const period = h >= 12 ? 'PM' : 'AM';
  const hr = h % 12 === 0 ? 12 : h % 12;
  return `${hr}:00 ${period}`;
}

function HourPickerRow({
  label,
  value,
  onChange,
  compact,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  compact?: boolean;
}) {
  const theme = useTheme();
  const dec = () => onChange((value + 23) % 24);
  const inc = () => onChange((value + 1) % 24);
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      {!compact ? (
        <Text
          style={[
            theme.typography.body,
            { color: theme.colors.text, opacity: 0.92, flex: 1 },
          ]}
        >
          {label}
        </Text>
      ) : null}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 0,
          borderRadius: 999,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: theme.colors.borderStrong,
          backgroundColor: theme.colors.bgGlass,
          paddingHorizontal: 4,
        }}
      >
        <Pressable onPress={dec} hitSlop={8} style={{ padding: 8 }}>
          <Ionicons name="remove" size={16} color={theme.colors.text} />
        </Pressable>
        <Text
          style={[
            theme.typography.bodyBold,
            { color: theme.colors.text, minWidth: 78, textAlign: 'center' },
          ]}
        >
          {formatHour(value)}
        </Text>
        <Pressable onPress={inc} hitSlop={8} style={{ padding: 8 }}>
          <Ionicons name="add" size={16} color={theme.colors.text} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  profileField: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 12 : 4,
  },
  segGroup: {
    flexDirection: 'row',
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
    padding: 4,
  },
  seg: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderRadius: 999,
  },
  swatchWrap: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  swatch: {
    width: 38,
    height: 38,
    borderRadius: 19,
  },
  swatchRing: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
  },
});
