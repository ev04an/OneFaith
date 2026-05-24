import React, { useEffect } from 'react';
import { Platform, StyleSheet, View, Dimensions } from 'react-native';
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

// Android's GPU compositor struggles with large overlapping semi-transparent
// orbs. We keep the gradient + a single cheap drifting light beam on every
// platform, and only enable the heavier glowing orbs on iOS.
const ANIMATE_ORBS = Platform.OS === 'ios';

export function AnimatedBackground({ variant, intensity = 1 }: Props) {
  const { isDark, gradients, colors } = useTheme();
  const base = variant ?? (isDark ? 'cosmosDark' : 'cosmosLight');
  const stops = gradients[base] as readonly string[];

  // Drift timeline drives the iOS orbs only. The beam below is static — a
  // continuously-animating translateX on every screen was the single biggest
  // scroll-cost contributor across the app. Keeping the beam visually present
  // as a tilted highlight gradient is enough premium atmosphere without
  // burning frame budget while you scroll.
  const t = useSharedValue(0);
  useEffect(() => {
    if (!ANIMATE_ORBS) return;
    t.value = withRepeat(
      withTiming(1, { duration: 18000, easing: Easing.inOut(Easing.quad) }),
      -1,
      true,
    );
  }, [t]);

  const orb1 = useAnimatedStyle(() => {
    if (!ANIMATE_ORBS) return {};
    const x = interpolate(t.value, [0, 1], [-60, 80]);
    const y = interpolate(t.value, [0, 1], [-40, 60]);
    const scale = interpolate(t.value, [0, 1], [1, 1.15]);
    return { transform: [{ translateX: x }, { translateY: y }, { scale }] };
  });
  const orb2 = useAnimatedStyle(() => {
    if (!ANIMATE_ORBS) return {};
    const x = interpolate(t.value, [0, 1], [60, -50]);
    const y = interpolate(t.value, [0, 1], [40, -50]);
    const scale = interpolate(t.value, [0, 1], [1.1, 0.95]);
    return { transform: [{ translateX: x }, { translateY: y }, { scale }] };
  });

  const beamColors = isDark
    ? (['transparent', 'rgba(155,200,240,0.55)', 'transparent'] as const)
    : (['transparent', 'rgba(91,155,227,0.32)', 'transparent'] as const);

  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: colors.bg }]}>
      <LinearGradient
        colors={stops as any}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
      />

      {/* Static tilted light beam — premium atmosphere with zero ongoing cost */}
      <View
        style={[
          styles.beam,
          {
            top: -height * 0.1,
            left: width / 2 - width * 0.35,
            width: width * 0.7,
            height: height * 1.2,
            opacity: 0.18 * intensity,
            transform: [{ rotateZ: '4deg' }],
          },
        ]}
      >
        <LinearGradient
          colors={beamColors as any}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      </View>

      {ANIMATE_ORBS ? (
        <>
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
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  orb: {
    position: 'absolute',
    borderRadius: 9999,
  },
  beam: {
    position: 'absolute',
    overflow: 'hidden',
  },
});
