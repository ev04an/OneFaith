import React, { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { GlassCard } from '../components/GlassCard';
import { GradientButton } from '../components/GradientButton';
import { useTheme } from '../theme';
import { useJournalStore, type JournalEntry, type JournalMood } from '../state/store';
import { formatRelative } from '../utils/time';
import type { RootStackParamList } from '../navigation/types';

const MOOD_META: Record<JournalMood, { emoji: string; score: number; tint: string }> = {
  rough: { emoji: '😔', score: 1, tint: '#5A6E9A' },
  low: { emoji: '🙁', score: 2, tint: '#7A4A6A' },
  okay: { emoji: '😐', score: 3, tint: '#A09BC0' },
  good: { emoji: '🙂', score: 4, tint: '#5AB8A0' },
  great: { emoji: '😊', score: 5, tint: '#E8A65A' },
};

export function JournalScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const entries = useJournalStore((s) => s.entries);

  const stats = useMemo(() => {
    if (entries.length === 0) return null;
    const last30 = entries.filter((e) => Date.now() - e.createdAt < 30 * 86400000);
    const avg =
      last30.reduce((s, e) => s + MOOD_META[e.mood].score, 0) /
      Math.max(1, last30.length);
    const dist: Record<JournalMood, number> = {
      rough: 0,
      low: 0,
      okay: 0,
      good: 0,
      great: 0,
    };
    last30.forEach((e) => (dist[e.mood] += 1));
    return { avg, dist, count: last30.length, total: entries.length };
  }, [entries]);

  return (
    <View style={{ flex: 1 }}>
      <AnimatedBackground variant="ocean" intensity={0.6} />
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 18,
          paddingBottom: 160,
          paddingHorizontal: 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={[theme.typography.overline, { color: theme.colors.textFaint }]}>
              JOURNAL
            </Text>
            <Text style={[theme.typography.hero, { color: theme.colors.text, marginTop: 6 }]}>
              Write it down.{'\n'}Lay it down.
            </Text>
          </View>
        </View>

        <GradientButton
          label="New entry"
          icon="create-outline"
          gradient="primary"
          glow
          full
          size="lg"
          style={{ marginTop: 18 }}
          onPress={() => nav.navigate('JournalEntry', {})}
        />

        <Pressable
          onPress={() => nav.navigate('PrayerIntentions')}
          style={{ marginTop: 14 }}
        >
          <GlassCard padded={18}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="hand-left" size={22} color={theme.colors.primary} />
              <View style={{ flex: 1, marginLeft: 14 }}>
                <Text style={[theme.typography.bodyBold, { color: theme.colors.text }]}>
                  Prayer Intentions
                </Text>
                <Text
                  style={[
                    theme.typography.caption,
                    { color: theme.colors.textMuted, marginTop: 2 },
                  ]}
                >
                  Lift someone up · track support
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={theme.colors.textFaint} />
            </View>
          </GlassCard>
        </Pressable>

        {/* Analytics */}
        {stats ? (
          <GlassCard style={{ marginTop: 22 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={[theme.typography.overline, { color: theme.colors.textFaint, flex: 1 }]}>
                LAST 30 DAYS
              </Text>
              <Text
                style={[
                  theme.typography.caption,
                  { color: theme.colors.textMuted },
                ]}
              >
                {stats.count} entr{stats.count === 1 ? 'y' : 'ies'}
              </Text>
            </View>
            <Text
              style={[
                theme.typography.h1,
                { color: theme.colors.text, marginTop: 6, fontSize: 28 },
              ]}
            >
              Average mood: {stats.avg.toFixed(1)} / 5
            </Text>
            <View style={{ flexDirection: 'row', marginTop: 14, gap: 4, alignItems: 'flex-end' }}>
              {(Object.keys(stats.dist) as JournalMood[]).map((m) => {
                const v = stats.dist[m];
                const max = Math.max(1, ...Object.values(stats.dist));
                const h = Math.max(6, (v / max) * 72);
                return (
                  <View key={m} style={{ flex: 1, alignItems: 'center' }}>
                    <View
                      style={[
                        styles.bar,
                        { height: h, backgroundColor: MOOD_META[m].tint },
                      ]}
                    />
                    <Text style={{ fontSize: 18, marginTop: 6 }}>{MOOD_META[m].emoji}</Text>
                    <Text
                      style={[
                        theme.typography.caption,
                        { color: theme.colors.textFaint },
                      ]}
                    >
                      {v}
                    </Text>
                  </View>
                );
              })}
            </View>
          </GlassCard>
        ) : (
          <GlassCard style={{ marginTop: 22 }}>
            <Text style={[theme.typography.bodyBold, { color: theme.colors.text }]}>
              Your story starts with one sentence.
            </Text>
            <Text
              style={[theme.typography.body, { color: theme.colors.textMuted, marginTop: 6 }]}
            >
              Capture how you’re feeling, what you’re grateful for, or what you’re asking God for today.
            </Text>
          </GlassCard>
        )}

        {/* Entries */}
        <Text style={[theme.typography.h2, { color: theme.colors.text, marginTop: 28, marginBottom: 12 }]}>
          Recent entries
        </Text>

        {entries.length === 0 ? (
          <Text style={[theme.typography.body, { color: theme.colors.textMuted }]}>
            No entries yet. Tap “New entry” above to start.
          </Text>
        ) : (
          <View style={{ gap: 12 }}>
            {entries.map((e) => (
              <EntryRow
                key={e.id}
                entry={e}
                onPress={() => nav.navigate('JournalEntry', { entryId: e.id })}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function EntryRow({ entry, onPress }: { entry: JournalEntry; onPress: () => void }) {
  const theme = useTheme();
  const meta = MOOD_META[entry.mood];
  return (
    <Pressable onPress={onPress}>
      <LinearGradient
        colors={[meta.tint + '33', 'rgba(255,255,255,0.02)'] as any}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.entry,
          {
            borderColor: theme.colors.border,
            backgroundColor: theme.colors.bgGlass,
          },
          theme.shadow.soft,
        ]}
      >
        <Text style={{ fontSize: 26 }}>{meta.emoji}</Text>
        <View style={{ flex: 1 }}>
          <Text style={[theme.typography.bodyBold, { color: theme.colors.text }]} numberOfLines={1}>
            {entry.title || 'Untitled entry'}
          </Text>
          <Text
            style={[theme.typography.caption, { color: theme.colors.textFaint, marginTop: 2 }]}
          >
            {formatRelative(entry.createdAt)}
          </Text>
          <Text
            numberOfLines={2}
            style={[theme.typography.body, { color: theme.colors.textMuted, marginTop: 6, fontSize: 13 }]}
          >
            {entry.body || '—'}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={theme.colors.textFaint} />
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row', alignItems: 'flex-start' },
  bar: { width: 28, borderRadius: 8 },
  entry: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 14,
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
  },
});
