import React, { useEffect } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

type Props = {
  /** Diameter in px (default 28). */
  size?: number;
  /** When true, a soft halo breathes around the avatar. iOS-only by default
   *  because each repeating animation costs Android compositor budget. */
  pulse?: boolean;
};

/**
 * Premium AI companion avatar. Gradient ring + sparkles glyph. Optional
 * breathing halo used on the "online" indicator in the chat header — kept
 * iOS-only because every continuous animation slightly raises Android
 * compositor cost, and we have a strict no-scroll-lag rule.
 */
export function AIAvatar({ size = 28, pulse = false }: Props) {
  const t = useSharedValue(0);
  const animate = pulse && Platform.OS === 'ios';

  useEffect(() => {
    if (!animate) return;
    t.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 1500, easing: Easing.inOut(Easing.quad) }),
      ),
      -1,
      false,
    );
  }, [t, animate]);

  const haloStyle = useAnimatedStyle(() => ({
    opacity: animate ? 0.25 + t.value * 0.35 : 0.35,
    transform: [{ scale: animate ? 1 + t.value * 0.18 : 1.05 }],
  }));

  return (
    <View style={[styles.wrap, { width: size, height: size }]}>
      {pulse ? (
        <Animated.View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFillObject,
            {
              borderRadius: size,
              backgroundColor: 'rgba(91,155,227,0.45)',
            },
            haloStyle,
          ]}
        />
      ) : null}
      <View style={[styles.coreShadow, { width: size, height: size, borderRadius: size / 2 }]}>
        <LinearGradient
          colors={['#5B9BE3', '#2F5FB0']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.core, { width: size, height: size, borderRadius: size / 2 }]}
        >
          {/* Top gloss for a lit, dimensional read */}
          <LinearGradient
            pointerEvents="none"
            colors={['rgba(255,255,255,0.45)', 'rgba(255,255,255,0)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={[StyleSheet.absoluteFillObject, { borderRadius: size / 2, height: '55%' }]}
          />
          <Ionicons name="sparkles" size={size * 0.5} color="#FFFFFF" />
        </LinearGradient>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  coreShadow: {
    shadowColor: '#3A6EBF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 4,
  },
  core: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
