import React, { useEffect } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { useTheme } from '../theme';
import type { GradientKey } from '../theme/gradients';

type Props = {
  variant?: GradientKey; // optional override
  intensity?: number; // 0..1 for orb opacity
};

const { width, height } = Dimensions.get('window');

export function AnimatedBackground({ variant, intensity = 1 }: Props) {
  const { isDark, gradients, colors } = useTheme();
  const base = variant ?? (isDark ? 'cosmosDark' : 'cosmosLight');
  const stops = gradients[base] as readonly string[];

  const t = useSharedValue(0);
  useEffect(() => {
    t.value = withRepeat(withTiming(1, { duration: 14000, easing: Easing.inOut(Easing.quad) }), -1, true);
  }, [t]);

  const orb1 = useAnimatedStyle(() => {
    const x = interpolate(t.value, [0, 1], [-60, 80]);
    const y = interpolate(t.value, [0, 1], [-40, 60]);
    const scale = interpolate(t.value, [0, 1], [1, 1.15]);
    return { transform: [{ translateX: x }, { translateY: y }, { scale }] };
  });
  const orb2 = useAnimatedStyle(() => {
    const x = interpolate(t.value, [0, 1], [60, -50]);
    const y = interpolate(t.value, [0, 1], [40, -50]);
    const scale = interpolate(t.value, [0, 1], [1.1, 0.95]);
    return { transform: [{ translateX: x }, { translateY: y }, { scale }] };
  });
  const orb3 = useAnimatedStyle(() => {
    const x = interpolate(t.value, [0, 1], [-30, 30]);
    const y = interpolate(t.value, [0, 1], [80, -80]);
    return { transform: [{ translateX: x }, { translateY: y }] };
  });

  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: colors.bg }]}>
      <LinearGradient
        colors={stops as any}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
      />
      <Animated.View
        style={[
          styles.orb,
          {
            top: -120,
            left: -80,
            width: width * 0.9,
            height: width * 0.9,
            backgroundColor: colors.primarySoft,
            opacity: 0.18 * intensity,
          },
          orb1,
        ]}
      />
      <Animated.View
        style={[
          styles.orb,
          {
            top: height * 0.35,
            right: -120,
            width: width * 0.8,
            height: width * 0.8,
            backgroundColor: colors.accent,
            opacity: 0.14 * intensity,
          },
          orb2,
        ]}
      />
      <Animated.View
        style={[
          styles.orb,
          {
            bottom: -100,
            left: width * 0.2,
            width: width * 0.7,
            height: width * 0.7,
            backgroundColor: colors.accentSoft,
            opacity: 0.12 * intensity,
          },
          orb3,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  orb: {
    position: 'absolute',
    borderRadius: 9999,
  },
});
