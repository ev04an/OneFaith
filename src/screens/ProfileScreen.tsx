import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { GlassCard } from '../components/GlassCard';
import { useTheme } from '../theme';
import { PressableScale } from '../components/PressableScale';
import { useStreakStore, useFavoritesStore, useJournalStore } from '../state/store';
import { useAuthStore } from '../state/auth';
import { msToParts, formatLongDuration } from '../utils/time';
import type { RootStackParamList } from '../navigation/types';

export function ProfileScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const startedAt = useStreakStore((s) => s.startedAt);
  const longestMs = useStreakStore((s) => s.longestMs);
  const totalResets = useStreakStore((s) => s.totalResets);
  const verses = useFavoritesStore((s) => s.verses);
  const prayers = useFavoritesStore((s) => s.prayers);
  const entries = useJournalStore((s) => s.entries);
  const user = useAuthStore((s) => s.user);
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(t);
  }, []);
  const days = startedAt ? msToParts(now - startedAt).totalDays : 0;

  return (
    <View style={{ flex: 1 }}>
      <AnimatedBackground variant="primary" intensity={0.6} />
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 14,
          paddingBottom: 120,
          paddingHorizontal: theme.spacing.screen,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          onPress={() => nav.canGoBack() && nav.goBack()}
          hitSlop={10}
          style={[
            styles.backBtn,
            {
              borderColor: theme.colors.borderStrong,
              backgroundColor: theme.colors.bgGlassStrong,
            },
          ]}
        >
          <Ionicons name="chevron-back" size={20} color={theme.colors.text} />
        </Pressable>
        <Text style={[theme.typography.overline, { color: theme.colors.text, opacity: 0.85, marginTop: 14 }]}>
          PROFILE
        </Text>
        <Text style={[theme.typography.hero, { color: theme.colors.text, marginTop: 6 }]}>
          Your journey
        </Text>

        {/* Profile header card */}
        <Pressable
          onPress={() => (user ? null : nav.navigate('Auth'))}
          disabled={!!user}
        >
          <GlassCard style={{ marginTop: 20 }} padded={24} glow>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <LinearGradient
                colors={['#2F5FB0', '#5B9BE3']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.avatar, theme.shadow.glow]}
              >
                <Ionicons
                  name={user ? 'person' : 'log-in-outline'}
                  size={34}
                  color="#fff"
                />
              </LinearGradient>
              <View style={{ marginLeft: 18, flex: 1 }}>
                <Text
                  numberOfLines={1}
                  style={[theme.typography.h1, { color: theme.colors.text }]}
                >
                  {user ? 'Signed in' : 'You'}
                </Text>
                <Text
                  numberOfLines={1}
                  style={[
                    theme.typography.body,
                    { color: theme.colors.text, opacity: 0.92, marginTop: 6 },
                  ]}
                >
                  {user?.email ?? 'Local profile'}
                </Text>
                <Text
                  style={[
                    theme.typography.caption,
                    { color: theme.colors.text, opacity: 0.72, marginTop: 4 },
                  ]}
                >
                  {user ? 'Synced to your account' : 'Tap to sign in or create an account'}
                </Text>
              </View>
              {user ? null : (
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={theme.colors.text}
                  style={{ opacity: 0.7 }}
                />
              )}
            </View>
          </GlassCard>
        </Pressable>

        {/* Stats */}
        <View style={[styles.stats, { marginTop: 16 }]}>
          <Stat icon="flame" label="Current streak" value={`${days}d`} tone="#FF8B4A" />
          <Stat icon="trophy" label="Longest" value={formatLongDuration(longestMs)} tone="#E0B461" />
        </View>
        <View style={[styles.stats, { marginTop: 12 }]}>
          <Stat icon="refresh" label="Resets" value={String(totalResets)} tone={theme.colors.primary} />
          <Stat icon="book" label="Journal" value={String(entries.length)} tone="#2EA079" />
        </View>

        <Text
          style={[theme.typography.overline, { color: theme.colors.text, opacity: 0.85, marginTop: 28 }]}
        >
          QUICK ACTIONS
        </Text>

        <GlassCard padded={false} style={{ marginTop: 12 }}>
          <GroupRow
            icon="sunny-outline"
            label="Today"
            value="Daily devotional & gratitude"
            onPress={() => nav.navigate('Daily')}
            first
          />
          <GroupRow
            icon="book-outline"
            label="Bible"
            value="World English Bible · offline"
            onPress={() => (nav as any).navigate('MainTabs', { screen: 'Bible' })}
          />
          <GroupRow
            icon="sparkles-outline"
            label="Create Prayer"
            value="Personalized for you"
            onPress={() => nav.navigate('PrayerGenerator')}
          />
          <GroupRow
            icon="bookmark-outline"
            label="Favorites"
            value={`${verses.length + prayers.length} saved`}
            onPress={() => nav.navigate('Favorites')}
          />
          <GroupRow
            icon="ribbon-outline"
            label="Levels & badges"
            value="View progress"
            onPress={() => nav.navigate('Levels')}
          />
          <GroupRow
            icon="chatbubbles-outline"
            label="Companion"
            value="Talk it out"
            onPress={() => nav.navigate('AI')}
          />
          <GroupRow
            icon="heart-outline"
            label="Saved prayers"
            value="Your collection"
            onPress={() => nav.navigate('SavedPrayers')}
          />
          <GroupRow
            icon="chatbox-ellipses-outline"
            label="Feedback & Survey"
            value="Help us improve"
            onPress={() => nav.navigate('Feedback')}
          />
          <GroupRow
            icon="information-circle-outline"
            label="About the developer"
            value="Support me · Evan Mathew Abraham"
            onPress={() => nav.navigate('AboutDeveloper')}
          />
          <GroupRow
            icon="settings-outline"
            label="Settings"
            value="Appearance, notifications, privacy"
            onPress={() => nav.navigate('Settings')}
            last
          />
        </GlassCard>
      </ScrollView>
    </View>
  );
}

function Stat({
  icon,
  label,
  value,
  tone,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  tone: string;
}) {
  const theme = useTheme();
  return (
    <GlassCard padded={18} style={{ flex: 1, alignItems: 'center' }}>
      <Ionicons name={icon} size={26} color={tone} />
      <Text
        numberOfLines={1}
        adjustsFontSizeToFit
        style={[
          theme.typography.h1,
          { color: theme.colors.text, marginTop: 10, textAlign: 'center' },
        ]}
      >
        {value}
      </Text>
      <Text
        numberOfLines={1}
        style={[
          theme.typography.caption,
          {
            color: theme.colors.textMuted,
            marginTop: 6,
            fontSize: 12,
            letterSpacing: 0.6,
            textAlign: 'center',
          },
        ]}
      >
        {label.toUpperCase()}
      </Text>
    </GlassCard>
  );
}

function GroupRow({
  icon,
  label,
  value,
  onPress,
  first,
  last,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  onPress: () => void;
  first?: boolean;
  last?: boolean;
}) {
  const theme = useTheme();
  return (
    <>
      {!first ? (
        <View
          style={{
            height: StyleSheet.hairlineWidth,
            backgroundColor: theme.colors.border,
            marginLeft: 52,
          }}
        />
      ) : null}
      <PressableScale onPress={onPress}>
        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16 }}>
          <Ionicons name={icon} size={22} color={theme.colors.primary} />
          <View style={{ flex: 1, marginLeft: 14 }}>
            <Text style={[theme.typography.bodyBold, { color: theme.colors.text }]}>
              {label}
            </Text>
            <Text
              style={[
                theme.typography.caption,
                {
                  color: theme.colors.textMuted,
                  marginTop: 4,
                  fontSize: 12.5,
                },
              ]}
            >
              {value}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={theme.colors.textFaint} />
        </View>
      </PressableScale>
    </>
  );
}

const styles = StyleSheet.create({
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stats: { flexDirection: 'row', gap: 12 },
});
