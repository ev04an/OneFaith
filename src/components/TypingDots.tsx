import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

type Props = {
  /** Dot color (default soft blue). */
  color?: string;
  /** Dot size in px (default 6). */
  size?: number;
  /** Gap between dots (default 5). */
  gap?: number;
};

/**
 * Three premium typing dots that gently rise and fall in sequence.
 * Animation is short and runs only while this component is mounted — used
 * exclusively inside the AI "thinking" bubble, which exists for <2s per turn,
 * so the loop has no ongoing scroll cost.
 */
export function TypingDots({ color = '#5B9BE3', size = 6, gap = 5 }: Props) {
  return (
    <View style={[styles.row, { gap }]}>
      <Dot color={color} size={size} delay={0} />
      <Dot color={color} size={size} delay={140} />
      <Dot color={color} size={size} delay={280} />
    </View>
  );
}

function Dot({ color, size, delay }: { color: string; size: number; delay: number }) {
  const t = useSharedValue(0);
  useEffect(() => {
    t.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 420, easing: Easing.out(Easing.cubic) }),
          withTiming(0, { duration: 420, easing: Easing.in(Easing.cubic) }),
        ),
        -1,
        false,
      ),
    );
  }, [t, delay]);

  const anim = useAnimatedStyle(() => ({
    transform: [{ translateY: -t.value * 4 }],
    opacity: 0.5 + t.value * 0.5,
  }));

  return (
    <Animated.View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
        },
        anim,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
