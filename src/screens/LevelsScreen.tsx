import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp, FadeIn } from 'react-native-reanimated';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { ScreenHeader } from '../components/ScreenHeader';
import { GlassCard } from '../components/GlassCard';
import { LevelBadge } from '../components/LevelBadge';
import { ShimmerOverlay } from '../components/ShimmerOverlay';
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
        <Animated.View entering={FadeInUp.duration(620).springify().damping(14)}>
        <GlassCard depth glowSoft style={{ overflow: 'hidden' }}>
          <ShimmerOverlay delay={700} duration={1900} stripeWidth={150} />
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
        </Animated.View>

        <Animated.Text
          entering={FadeInUp.duration(500).delay(160).springify().damping(14)}
          style={[theme.typography.h2, { color: theme.colors.text, marginTop: 26, marginBottom: 10 }]}
        >
          The Seven Levels
        </Animated.Text>

        <View style={{ gap: 10 }}>
          {LEVELS.map((l, i) => {
            const reached = days >= l.threshold;
            return (
              <Animated.View
                key={l.id}
                entering={FadeInUp.duration(500).delay(220 + i * 70).springify().damping(14)}
                style={[
                  styles.levelRow,
                  {
                    borderColor: reached ? l.glow : theme.colors.border,
                    backgroundColor: theme.colors.bgGlass,
                    overflow: 'hidden',
                  },
                  reached && l.id === current.id && theme.shadow.glow,
                ]}
              >
                {reached && l.id === current.id ? (
                  <ShimmerOverlay delay={1100 + i * 80} duration={1800} stripeWidth={120} />
                ) : null}
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
              </Animated.View>
            );
          })}
        </View>

        <Animated.Text
          entering={FadeInUp.duration(500).delay(720).springify().damping(14)}
          style={[theme.typography.h2, { color: theme.colors.text, marginTop: 28, marginBottom: 12 }]}
        >
          Badges
        </Animated.Text>
        <View style={styles.badgeGrid}>
          {BADGES.map((b, i) => {
            const isEarned = earned.some((e) => e.id === b.id);
            return (
              <Animated.View
                key={b.id}
                entering={FadeInUp.duration(500).delay(800 + i * 90).springify().damping(14)}
                style={[styles.badgeCell, { overflow: 'hidden', borderRadius: 18 }]}
              >
                <View style={{ position: 'relative' }}>
                  <LevelBadge badge={b} earned={isEarned} />
                  {isEarned ? (
                    <ShimmerOverlay
                      delay={1400 + i * 120}
                      duration={1900}
                      stripeWidth={90}
                      color="rgba(255,255,255,0.42)"
                    />
                  ) : null}
                </View>
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
              </Animated.View>
            );
          })}
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
