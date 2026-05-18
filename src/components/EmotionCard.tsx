import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { useTheme } from '../theme';
import type { Emotion } from '../data/emotions';
import * as haptics from '../utils/haptics';

type Props = {
  emotion: Emotion;
  onPress?: () => void;
  delay?: number;
};

export function EmotionCard({ emotion, onPress, delay = 0 }: Props) {
  const theme = useTheme();
  const stops = theme.gradients[emotion.gradient] as readonly string[];

  const float = useSharedValue(0);
  const press = useSharedValue(0);
  const intro = useSharedValue(0);

  useEffect(() => {
    intro.value = withTiming(1, {
      duration: 600,
      easing: Easing.out(Easing.cubic),
    });
    float.value = withRepeat(
      withTiming(1, { duration: 3200 + delay, easing: Easing.inOut(Easing.quad) }),
      -1,
      true,
    );
  }, [delay, float, intro]);

  const floatStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: -2 + float.value * -4 },
      { scale: 1 - press.value * 0.06 },
    ],
    opacity: 0.5 + intro.value * 0.5,
  }));

  return (
    <Animated.View style={[styles.wrap, floatStyle]}>
      <Pressable
        onPress={() => {
          haptics.select();
          onPress?.();
        }}
        onPressIn={() => (press.value = withSpring(1, { damping: 10, stiffness: 200 }))}
        onPressOut={() => (press.value = withSpring(0, { damping: 10, stiffness: 200 }))}
        style={({ pressed }) => [styles.pressable, pressed && { opacity: 0.95 }]}
      >
        <LinearGradient
          colors={stops as any}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.gradient,
            { borderRadius: theme.radius.lg, borderColor: 'rgba(255,255,255,0.18)' },
            theme.shadow.soft,
          ]}
        >
          <Ionicons name={emotion.icon as any} size={30} color="#fff" />
          <Text style={[theme.typography.h3, styles.label]}>{emotion.label}</Text>
          <Text numberOfLines={1} style={[theme.typography.caption, styles.blurb]}>
            {emotion.blurb}
          </Text>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1 },
  pressable: { flex: 1 },
  gradient: {
    flex: 1,
    minHeight: 130,
    padding: 14,
    borderWidth: StyleSheet.hairlineWidth,
    justifyContent: 'space-between',
  },
  label: { color: '#fff', marginTop: 10 },
  blurb: { color: 'rgba(255,255,255,0.94)', marginTop: 4 },
});
