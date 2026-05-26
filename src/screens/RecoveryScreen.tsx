import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Animated, { FadeInUp, FadeIn } from 'react-native-reanimated';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { GlassCard } from '../components/GlassCard';
import { GradientButton } from '../components/GradientButton';
import { StreakTimer } from '../components/StreakTimer';
import { LevelBadge } from '../components/LevelBadge';
import { Confetti } from '../components/Confetti';
import { ShimmerOverlay } from '../components/ShimmerOverlay';
import { AnimatedCounter } from '../components/AnimatedCounter';
import { useTheme } from '../theme';
import { useStreakStore } from '../state/store';
import { msToParts, formatLongDuration } from '../utils/time';
import { BADGES, getEarnedBadges, getLevelForDays, getNextLevel } from '../data/levels';
import { getRandomAffirmation } from '../data/affirmations';
import * as haptics from '../utils/haptics';
import type { RootStackParamList } from '../navigation/types';

export function RecoveryScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const startedAt = useStreakStore((s) => s.startedAt);
  const longestMs = useStreakStore((s) => s.longestMs);
  const totalResets = useStreakStore((s) => s.totalResets);
  const start = useStreakStore((s) => s.start);
  const reset = useStreakStore((s) => s.reset);

  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const running = startedAt != null;
  const elapsed = startedAt ? now - startedAt : 0;
  const days = msToParts(elapsed).totalDays;
  const level = getLevelForDays(days);
  const nextLevel = getNextLevel(days);
  const earned = getEarnedBadges(days);
  const [showConfetti, setShowConfetti] = useState(false);
  const affirmation = useMemo(() => getRandomAffirmation(now / 60000), [Math.floor(now / 60000)]);

  // Confetti on level up — track last level seen in local state
  const [lastLevel, setLastLevel] = useState(level.id);
  useEffect(() => {
    if (level.id > lastLevel && running) {
      setShowConfetti(true);
      haptics.success();
      setTimeout(() => setShowConfetti(false), 2400);
    }
    setLastLevel(level.id);
  }, [level.id, lastLevel, running]);

  const handleBegin = () => {
    haptics.success();
    start();
  };

  const showRecoveryInfo = () => {
    haptics.select();
    Alert.alert(
      'About Recovery',
      'Recovery helps you track your progress and count the number of days you remain addiction-free. It encourages consistency and lets you see your growth journey over time.',
      [{ text: 'Got it' }],
    );
  };

  const handleRelapse = () => {
    Alert.alert(
      'Are you sure?',
      'You don’t have to reset. If you’ve slipped, you’re still loved, and the next minute is yours to choose.\n\nReset only if you want to start a fresh streak.',
      [
        { text: 'Keep going', style: 'cancel' },
        {
          text: 'Reset streak',
          style: 'destructive',
          onPress: () => {
            haptics.warning();
            reset();
          },
        },
      ],
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <AnimatedBackground variant="fire" intensity={running ? 1 : 0.6} />
      <Confetti active={showConfetti} />
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 24,
          paddingBottom: 160,
          paddingHorizontal: 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text style={[theme.typography.overline, { color: theme.colors.textFaint }]}>
                RECOVERY JOURNEY
              </Text>
              <Pressable onPress={showRecoveryInfo} hitSlop={10}>
                <Ionicons
                  name="information-circle-outline"
                  size={16}
                  color={theme.colors.textFaint}
                />
              </Pressable>
            </View>
            <Text
              style={[
                running ? theme.typography.h1 : theme.typography.heroItalic,
                {
                  color: theme.colors.text,
                  marginTop: running ? 4 : 6,
                  fontSize: running ? undefined : 30,
                  lineHeight: running ? undefined : 36,
                },
              ]}
            >
              {running ? level.name : 'Begin again, today.'}
            </Text>
          </View>
          <Pressable
            onPress={() => nav.navigate('Levels')}
            hitSlop={10}
            style={[
              styles.iconBtn,
              { borderColor: theme.colors.border, backgroundColor: theme.colors.bgGlass },
            ]}
          >
            <Ionicons name="ribbon-outline" size={20} color={theme.colors.text} />
          </Pressable>
        </View>

        <Animated.View
          entering={FadeIn.duration(700)}
          style={{ alignItems: 'center', marginTop: 24 }}
        >
          {/* When the streak hasn't started yet, the inner ring shows
              "TAP BEGIN" — wire that up so tapping the ring itself starts
              the streak (the gradient button below still works too). */}
          {running ? (
            <StreakTimer ms={elapsed} running={running} />
          ) : (
            <Pressable onPress={handleBegin} hitSlop={6}>
              <StreakTimer ms={elapsed} running={running} />
            </Pressable>
          )}
        </Animated.View>

        {/* Affirmation under timer */}
        <Animated.Text
          entering={FadeInUp.duration(600).delay(180).springify().damping(14)}
          style={[
            theme.typography.verse,
            {
              color: theme.colors.text,
              textAlign: 'center',
              marginTop: 18,
              paddingHorizontal: 20,
              fontSize: 18,
              lineHeight: 26,
            },
          ]}
        >
          “{affirmation}”
        </Animated.Text>

        {/* CTA */}
        <View style={{ marginTop: 24, alignItems: 'center' }}>
          {!running ? (
            <GradientButton
              label="Begin My Streak"
              icon="flame-outline"
              size="lg"
              glow
              gradient="fire"
              onPress={handleBegin}
            />
          ) : (
            <Pressable onPress={handleRelapse} style={[styles.relapseWrap, theme.shadow.soft]}>
              <LinearGradient
                colors={['rgba(255,143,168,0.18)', 'rgba(255,74,106,0.10)']}
                style={styles.relapseInner}
              >
                <Ionicons name="refresh-circle-outline" size={20} color={theme.colors.danger} />
                <Text style={[theme.typography.bodyBold, { color: theme.colors.text }]}>
                  I Relapsed — Reset Streak
                </Text>
              </LinearGradient>
            </Pressable>
          )}
        </View>

        {/* Stats row */}
        <Animated.View
          entering={FadeInUp.duration(600).delay(260).springify().damping(14)}
          style={[styles.statsRow, { marginTop: 28 }]}
        >
          <StatCard
            icon="flame-outline"
            label="Current"
            numericValue={days}
            valueSuffix="d"
            tone="#FF8B4A"
          />
          <StatCard
            icon="trophy-outline"
            label="Longest"
            value={formatLongDuration(longestMs)}
            tone="#F5D58A"
          />
          <StatCard
            icon="refresh-outline"
            label="Resets"
            numericValue={totalResets}
            tone={theme.colors.primary}
          />
        </Animated.View>

        {/* Level card */}
        {running && (
          <Animated.View entering={FadeInUp.duration(700).delay(340).springify().damping(14)}>
          <GlassCard glowSoft depth style={{ marginTop: 20, overflow: 'hidden' }}>
            <ShimmerOverlay delay={900} duration={1800} stripeWidth={140} />
            <Text style={[theme.typography.overline, { color: theme.colors.textFaint }]}>
              CURRENT LEVEL
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
              <View
                style={[
                  styles.levelDot,
                  { backgroundColor: level.glow, shadowColor: level.glow },
                  theme.shadow.glow,
                ]}
              />
              <Text style={[theme.typography.h2, { color: theme.colors.text, marginLeft: 10 }]}>
                {level.name}
              </Text>
              <View style={{ flex: 1 }} />
              <Text style={[theme.typography.caption, { color: theme.colors.textFaint }]}>
                LV {level.id}
              </Text>
            </View>
            <Text
              style={[
                theme.typography.body,
                { color: theme.colors.textMuted, marginTop: 8 },
              ]}
            >
              {level.description}
            </Text>
            {nextLevel ? (
              <View style={{ marginTop: 14 }}>
                <View style={[styles.progressTrack, { backgroundColor: theme.colors.border }]}>
                  <LinearGradient
                    colors={['#FF8B4A', '#FF4A6A', '#5B9BE3']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[
                      styles.progressFill,
                      {
                        width: `${Math.min(
                          100,
                          ((days - level.threshold) /
                            Math.max(1, nextLevel.threshold - level.threshold)) *
                            100,
                        )}%`,
                      },
                    ]}
                  />
                </View>
                <Text
                  style={[
                    theme.typography.caption,
                    { color: theme.colors.textMuted, marginTop: 8 },
                  ]}
                >
                  {nextLevel.threshold - days} day{nextLevel.threshold - days === 1 ? '' : 's'} to{' '}
                  <Text style={{ color: theme.colors.text }}>{nextLevel.name}</Text>
                </Text>
              </View>
            ) : null}
          </GlassCard>
          </Animated.View>
        )}

        {/* Badges preview */}
        <Animated.View
          entering={FadeInUp.duration(700).delay(420).springify().damping(14)}
          style={{ marginTop: 22 }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={[theme.typography.h2, { color: theme.colors.text, flex: 1 }]}>
              Milestones
            </Text>
            <Pressable onPress={() => nav.navigate('Levels')} hitSlop={10}>
              <Text style={[theme.typography.bodyBold, { color: theme.colors.primary }]}>
                See all
              </Text>
            </Pressable>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 10, marginTop: 12, paddingRight: 18 }}
          >
            {BADGES.map((b, i) => (
              <Animated.View
                key={b.id}
                entering={FadeInUp.duration(500).delay(500 + i * 80).springify().damping(14)}
              >
                <LevelBadge badge={b} earned={earned.some((e) => e.id === b.id)} />
              </Animated.View>
            ))}
          </ScrollView>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

function StatCard({
  icon,
  label,
  value,
  numericValue,
  valueSuffix,
  tone,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
  /** When provided, the value will smoothly count up from 0 to this number. */
  numericValue?: number;
  valueSuffix?: string;
  tone: string;
}) {
  const theme = useTheme();
  const valueStyle = [theme.typography.h2, { color: theme.colors.text, marginTop: 8 }];
  return (
    <GlassCard padded glowSoft style={{ flex: 1, overflow: 'hidden' }}>
      <Ionicons name={icon} size={18} color={tone} />
      {typeof numericValue === 'number' ? (
        <AnimatedCounter value={numericValue} suffix={valueSuffix ?? ''} style={valueStyle as any} />
      ) : (
        <Text style={valueStyle}>{value}</Text>
      )}
      <Text style={[theme.typography.caption, { color: theme.colors.textFaint, marginTop: 2 }]}>
        {label.toUpperCase()}
      </Text>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },
  relapseWrap: {
    borderRadius: 999,
    overflow: 'hidden',
  },
  relapseInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,143,168,0.45)',
  },
  statsRow: { flexDirection: 'row', gap: 10 },
  levelDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', borderRadius: 4 },
});
