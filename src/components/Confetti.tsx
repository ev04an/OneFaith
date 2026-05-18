import React, { useEffect } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

const COLORS = ['#FFD68A', '#FF8FB1', '#A98BFF', '#7AE7C7', '#FF8B4A', '#7CA0D8'];

function Piece({ delay, x, color }: { delay: number; x: number; color: string }) {
  const t = useSharedValue(0);
  const rot = useSharedValue(0);
  useEffect(() => {
    t.value = withDelay(delay, withTiming(1, { duration: 2200, easing: Easing.out(Easing.cubic) }));
    rot.value = withDelay(delay, withTiming(8, { duration: 2200 }));
  }, [delay, rot, t]);
  const style = useAnimatedStyle(() => ({
    transform: [
      { translateY: t.value * (height + 80) },
      { translateX: Math.sin(t.value * 6) * 30 },
      { rotateZ: `${rot.value * 360}deg` },
    ],
    opacity: 1 - t.value * 0.7,
  }));
  return (
    <Animated.View
      style={[
        styles.piece,
        { left: x, backgroundColor: color },
        style,
      ]}
    />
  );
}

export function Confetti({ active }: { active: boolean }) {
  if (!active) return null;
  const pieces = Array.from({ length: 36 }).map((_, i) => ({
    key: `${i}-${Date.now()}`,
    delay: (i % 9) * 80,
    x: (i * 37) % (width - 12),
    color: COLORS[i % COLORS.length],
  }));
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {pieces.map((p) => (
        <Piece key={p.key} delay={p.delay} x={p.x} color={p.color} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  piece: {
    position: 'absolute',
    top: -20,
    width: 8,
    height: 12,
    borderRadius: 2,
  },
});
