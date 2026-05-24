import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { useTheme } from '../theme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type Props = {
  /** Current streak in days. */
  days: number;
  /** Days at which the ring is considered "full" (default 30). */
  target?: number;
  /** Outer size in px (default 96). */
  size?: number;
  /** Stroke thickness (default 10). */
  stroke?: number;
  /** Override main label (default = `days`). */
  label?: string;
  /** Override caption (default = "DAYS"). */
  caption?: string;
};

/**
 * Premium animated progress ring used for streaks / level progress. Uses
 * react-native-svg with Reanimated's `useAnimatedProps` to drive
 * `strokeDashoffset` on the UI thread — no JS-thread layout work, so the ring
 * stays smooth even while a parent scrolls.
 *
 * One-shot: fills from 0 → progress on mount, then stays static.
 */
export function StreakRing({
  days,
  target = 30,
  size = 96,
  stroke = 10,
  label,
  caption = 'DAYS',
}: Props) {
  const theme = useTheme();
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(1, Math.max(0, days / target));

  const t = useSharedValue(0);
  useEffect(() => {
    t.value = withDelay(
      220,
      withTiming(progress, { duration: 1300, easing: Easing.out(Easing.cubic) }),
    );
  }, [t, progress]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - t.value),
  }));

  // Gradient colors chosen to match the OneFaith palette (blue → soft blue).
  const gradStart = theme.isDark ? '#9BC8F0' : '#3A7AC4';
  const gradEnd = theme.isDark ? '#5B9BE3' : '#5B9BE3';
  const trackColor = theme.isDark
    ? 'rgba(155,200,240,0.16)'
    : 'rgba(15,31,75,0.10)';

  return (
    <View style={[styles.wrap, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        <Defs>
          <LinearGradient id="streakRing" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={gradStart} />
            <Stop offset="1" stopColor={gradEnd} />
          </LinearGradient>
        </Defs>
        {/* Track */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={trackColor}
          strokeWidth={stroke}
          fill="transparent"
        />
        {/* Progress arc — rotates -90deg so it starts at 12 o'clock */}
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#streakRing)"
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="transparent"
          strokeDasharray={`${circumference} ${circumference}`}
          animatedProps={animatedProps}
          rotation={-90}
          originX={size / 2}
          originY={size / 2}
        />
      </Svg>
      <View style={styles.center} pointerEvents="none">
        <Text
          style={[
            styles.value,
            theme.typography.h2,
            { color: theme.colors.text, fontSize: size * 0.32, lineHeight: size * 0.32 },
          ]}
        >
          {label ?? days}
        </Text>
        <Text
          style={[
            styles.caption,
            { color: theme.colors.textMuted, fontSize: size * 0.105 },
          ]}
        >
          {caption}
        </Text>
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
  value: {
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  caption: {
    marginTop: 2,
    fontWeight: '700',
    letterSpacing: 2,
  },
});
