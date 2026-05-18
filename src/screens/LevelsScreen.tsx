import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { ScreenHeader } from '../components/ScreenHeader';
import { GlassCard } from '../components/GlassCard';
import { LevelBadge } from '../components/LevelBadge';
import { useTheme } from '../theme';
import { BADGES, LEVELS, getEarnedBadges, getLevelForDays } from '../data/levels';
import { useStreakStore } from '../state/store';
import { msToParts } from '../utils/time';
import type { RootStackParamList } from '../navigation/types';

export function LevelsScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const startedAt = useStreakStore((s) => s.startedAt);
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(t);
  }, []);
  const elapsed = startedAt ? now - startedAt : 0;
  const days = msToParts(elapsed).totalDays;
  const current = getLevelForDays(days);
  const earned = getEarnedBadges(days);

  return (
    <View style={{ flex: 1 }}>
      <AnimatedBackground variant="gold" intensity={0.7} />
      <ScreenHeader onBack={() => nav.goBack()} title="Your Growth Map" large subtitle="LEVELS & BADGES" />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: insets.bottom + 60,
          paddingTop: 18,
        }}
        showsVerticalScrollIndicator={false}
      >
        <GlassCard>
          <Text style={[theme.typography.overline, { color: theme.colors.textFaint }]}>
            YOU ARE HERE
          </Text>
          <Text style={[theme.typography.h1, { color: theme.colors.text, marginTop: 6 }]}>
            Level {current.id} — {current.name}
          </Text>
          <Text
            style={[
              theme.typography.body,
              { color: theme.colors.textMuted, marginTop: 8 },
            ]}
          >
            {current.description}
          </Text>
        </GlassCard>

        <Text style={[theme.typography.h2, { color: theme.colors.text, marginTop: 26, marginBottom: 10 }]}>
          The Seven Levels
        </Text>

        <View style={{ gap: 10 }}>
          {LEVELS.map((l) => {
            const reached = days >= l.threshold;
            return (
              <View
                key={l.id}
                style={[
                  styles.levelRow,
                  {
                    borderColor: reached ? l.glow : theme.colors.border,
                    backgroundColor: theme.colors.bgGlass,
                  },
                  reached && l.id === current.id && theme.shadow.glow,
                ]}
              >
                <Text
                  style={{
                    color: reached ? theme.colors.text : theme.colors.textFaint,
                    fontWeight: '800',
                    fontSize: 26,
                    width: 36,
                    textAlign: 'center',
                  }}
                >
                  {l.id}
                </Text>
                <View style={{ flex: 1, marginLeft: 14 }}>
                  <Text style={[theme.typography.bodyBold, { color: theme.colors.text }]}>
                    {l.name}
                  </Text>
                  <Text style={[theme.typography.caption, { color: theme.colors.textMuted, marginTop: 2 }]}>
                    {l.threshold === 0 ? 'Start here' : `${l.threshold}+ days`}
                  </Text>
                  <Text
                    style={[
                      theme.typography.body,
                      { color: theme.colors.textMuted, marginTop: 6, fontSize: 13 },
                    ]}
                  >
                    {l.description}
                  </Text>
                </View>
                {reached ? (
                  <Ionicons name="checkmark-circle" size={22} color={theme.colors.success} />
                ) : (
                  <Ionicons name="lock-closed" size={18} color={theme.colors.textMuted} />
                )}
              </View>
            );
          })}
        </View>

        <Text style={[theme.typography.h2, { color: theme.colors.text, marginTop: 28, marginBottom: 12 }]}>
          Badges
        </Text>
        <View style={styles.badgeGrid}>
          {BADGES.map((b) => (
            <View key={b.id} style={styles.badgeCell}>
              <LevelBadge badge={b} earned={earned.some((e) => e.id === b.id)} />
              <Text
                style={[
                  theme.typography.caption,
                  {
                    color: theme.colors.textMuted,
                    marginTop: 8,
                    textAlign: 'center',
                    maxWidth: 120,
                    lineHeight: 17,
                  },
                ]}
              >
                {b.description}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  levelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
  },
  badgeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 16,
  },
  badgeCell: { width: '48%', alignItems: 'center' },
});
