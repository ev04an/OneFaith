import React, { useEffect } from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

type Props = ViewProps & {
  /** Width of the shine stripe in px. Default 120. */
  stripeWidth?: number;
  /** Total sweep duration in ms. Default 1600. */
  duration?: number;
  /** Delay before first sweep starts in ms. Default 400. */
  delay?: number;
  /** Loop with a pause between sweeps. Default false (one-shot on mount). */
  loop?: boolean;
  /** Gap between sweeps when looping. Default 3200ms. */
  loopGap?: number;
  /** Stripe color. Default soft white. */
  color?: string;
};

// Drop a `<ShimmerOverlay />` inside any `View` with `overflow: hidden` and
// it will sweep a soft diagonal glint across that view's surface. Used to add
// premium feel to cards and hero numbers without re-rendering the text or
// requiring MaskedView. All animation runs on the UI thread via Reanimated.
export function ShimmerOverlay({
  stripeWidth = 120,
  duration = 1600,
  delay = 400,
  loop = false,
  loopGap = 3200,
  color = 'rgba(255,255,255,0.32)',
  style,
  ...rest
}: Props) {
  const t = useSharedValue(0);

  useEffect(() => {
    const sweep = withTiming(1, { duration, easing: Easing.inOut(Easing.cubic) });
    if (loop) {
      t.value = withDelay(
        delay,
        withRepeat(
          withSequence(
            sweep,
            withTiming(1, { duration: loopGap }),
            withTiming(0, { duration: 0 }),
          ),
          -1,
          false,
        ),
      );
    } else {
      t.value = withDelay(delay, sweep);
    }
  }, [t, duration, delay, loop, loopGap]);

  const aStyle = useAnimatedStyle(() => {
    // Sweep from -stripeWidth to width+stripeWidth via a normalized 0..1 value
    return {
      transform: [
        { translateX: -stripeWidth + t.value * (1200 + stripeWidth * 2) },
        { rotateZ: '14deg' },
      ],
      opacity: t.value < 0.02 || t.value > 0.98 ? 0 : 1,
    };
  });

  return (
    <View
      pointerEvents="none"
      style={[StyleSheet.absoluteFillObject, style]}
      {...rest}
    >
      <Animated.View
        style={[
          {
            position: 'absolute',
            top: -40,
            bottom: -40,
            left: 0,
            width: stripeWidth,
          },
          aStyle,
        ]}
      >
        <LinearGradient
          colors={['transparent', color, 'transparent'] as any}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
}
