import React, { useEffect } from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  interpolate,
} from 'react-native-reanimated';

type Props = ViewProps & {
  /** Diameter of the orb in pixels. Default 220. */
  size?: number;
  /** Tint color (CSS rgb / hex). Default soft sky blue. */
  color?: string;
  /** Peak opacity for the pulse. Default 0.45. */
  intensity?: number;
  /** Disable animation (renders a static orb). */
  static?: boolean;
};

// Soft animated radial glow used behind hero numbers / focal icons. Renders as
// a single big circular View with a shadow underneath — no second visible
// rectangle, no nested box. Pulses gently between two opacity values.
export function GlowOrb({
  size = 220,
  color = 'rgba(127, 179, 232, 0.65)',
  intensity = 0.45,
  static: isStatic = false,
  style,
  children,
  ...rest
}: Props) {
  const t = useSharedValue(0);
  useEffect(() => {
    if (isStatic) return;
    t.value = withRepeat(
      withTiming(1, { duration: 3200, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );
  }, [t, isStatic]);

  const orbStyle = useAnimatedStyle(() => {
    if (isStatic) return { opacity: intensity, transform: [{ scale: 1 }] };
    const op = interpolate(t.value, [0, 1], [intensity * 0.55, intensity]);
    const scale = interpolate(t.value, [0, 1], [0.92, 1.05]);
    return { opacity: op, transform: [{ scale }] };
  });

  return (
    <View style={[styles.wrap, style]} {...rest}>
      <Animated.View
        pointerEvents="none"
        style={[
          {
            position: 'absolute',
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: color,
            shadowColor: color,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.9,
            shadowRadius: size * 0.35,
            elevation: 14,
            // Soften the hard circle into a halo via overflow clip + an
            // inner gradient is not possible without expo-linear-gradient,
            // so we lean on the platform shadow which gives a natural glow.
          },
          orbStyle,
        ]}
      />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
