import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Defs, LinearGradient as SvgGradient, Stop } from 'react-native-svg';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '../theme';
import { msToParts, pad } from '../utils/time';
import { getLevelForDays, getNextLevel } from '../data/levels';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type Props = {
  ms: number;
  size?: number;
  running: boolean;
};

export function StreakTimer({ ms, size = 280, running }: Props) {
  const theme = useTheme();
  const parts = msToParts(ms);
  const level = getLevelForDays(parts.totalDays);
  const next = getNextLevel(parts.totalDays);

  // Progress to next level (or full ring if maxed)
  const progress = next
    ? Math.min(
        1,
        (parts.totalDays - level.threshold) /
          Math.max(1, next.threshold - level.threshold),
      )
    : 1;

  const stroke = 14;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;

  // Pulsing glow
  const pulse = useSharedValue(0);
  useEffect(() => {
    if (running) {
      pulse.value = withRepeat(
        withTiming(1, { duration: 2400, easing: Easing.inOut(Easing.quad) }),
        -1,
        true,
      );
    } else {
      pulse.value = 0;
    }
  }, [pulse, running]);

  const glowStyle = useAnimatedStyle(() => ({
    opacity: 0.4 + pulse.value * 0.5,
    transform: [{ scale: 1 + pulse.value * 0.04 }],
  }));

  // Tick so the seconds re-render — driven by parent owning `ms`.

  return (
    <View style={[styles.wrap, { width: size, height: size }]}>
      <Animated.View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFill,
          { borderRadius: size / 2 },
          glowStyle,
        ]}
      >
        <LinearGradient
          colors={['rgba(91,155,227,0.35)', 'rgba(124,176,228,0.05)']}
          style={[StyleSheet.absoluteFill, { borderRadius: size / 2 }]}
        />
      </Animated.View>
      <Svg width={size} height={size}>
        <Defs>
          <SvgGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#FF8B4A" />
            <Stop offset="0.5" stopColor="#FF4A6A" />
            <Stop offset="1" stopColor="#5B9BE3" />
          </SvgGradient>
        </Defs>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={theme.colors.border}
          strokeWidth={stroke}
          fill="transparent"
        />
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="url(#ringGrad)"
          strokeWidth={stroke}
          fill="transparent"
          strokeDasharray={`${c} ${c}`}
          strokeDashoffset={c * (1 - progress)}
          strokeLinecap="round"
          rotation={-90}
          originX={size / 2}
          originY={size / 2}
        />
      </Svg>
      <View style={styles.center}>
        <Text style={[theme.typography.overline, { color: theme.colors.textFaint }]}>
          {running ? level.name : 'TAP BEGIN'}
        </Text>
        <Text style={[styles.days, { color: theme.colors.text }]}>{parts.days}</Text>
        <Text style={[theme.typography.caption, { color: theme.colors.textMuted }]}>
          {parts.days === 1 ? 'DAY' : 'DAYS'}
        </Text>
        <Text style={[styles.time, { color: theme.colors.text }]}>
          {pad(parts.hours)}:{pad(parts.minutes)}:{pad(parts.seconds)}
        </Text>
        {next ? (
          <Text
            style={[
              theme.typography.caption,
              { color: theme.colors.textFaint, marginTop: 4 },
            ]}
          >
            {next.threshold - parts.totalDays}d to {next.name}
          </Text>
        ) : (
          <Text
            style={[
              theme.typography.caption,
              { color: theme.colors.gold, marginTop: 4 },
            ]}
          >
            Unbreakable
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  days: {
    // Cormorant Garamond — luxe display feel. The streak count is the hero
    // number on this screen and deserves the most refined glyph in the system.
    fontFamily: 'CormorantGaramond_700Bold',
    fontSize: 84,
    lineHeight: 88,
    letterSpacing: -3,
    marginTop: 2,
  },
  time: {
    fontFamily: 'Inter_700Bold',
    fontSize: 22,
    letterSpacing: 2,
    marginTop: 8,
    fontVariant: ['tabular-nums'],
  },
});
