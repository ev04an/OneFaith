import React, { memo } from 'react';
import { Pressable, PressableProps, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

// Drop-in Pressable that springs to a smaller scale on press-in and back on
// press-out. Used for cards across Home / Settings / Profile to make taps feel
// responsive without changing layout. Memoized so scrolling parents don't
// re-render every child.
//
// Optional `glow` adds a momentary glow ring around the press target — gives
// premium tactile feedback on important actions (verse hero, action cards).

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type Props = PressableProps & {
  /** Scale at full press (default 0.97). */
  pressScale?: number;
  /** Show a momentary glow ring when pressed. Default false. */
  glow?: boolean;
  /** Glow tint (default soft blue). */
  glowColor?: string;
};

function PressableScaleInner({
  pressScale = 0.97,
  glow = false,
  glowColor = 'rgba(91,155,227,0.55)',
  onPressIn,
  onPressOut,
  style,
  children,
  ...rest
}: Props) {
  const scale = useSharedValue(1);
  const glowOpacity = useSharedValue(0);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  return (
    <View style={{ position: 'relative' }}>
      {glow ? (
        <Animated.View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFillObject,
            styles.glow,
            { shadowColor: glowColor },
            glowStyle,
          ]}
        />
      ) : null}
      <AnimatedPressable
        {...rest}
        onPressIn={(e) => {
          scale.value = withSpring(pressScale, { damping: 14, stiffness: 280, mass: 0.6 });
          if (glow) {
            glowOpacity.value = withTiming(1, { duration: 140 });
          }
          onPressIn?.(e);
        }}
        onPressOut={(e) => {
          scale.value = withSpring(1, { damping: 14, stiffness: 280, mass: 0.6 });
          if (glow) {
            glowOpacity.value = withTiming(0, { duration: 280 });
          }
          onPressOut?.(e);
        }}
        style={[style as any, animStyle]}
      >
        {children}
      </AnimatedPressable>
    </View>
  );
}

export const PressableScale = memo(PressableScaleInner);

const styles = StyleSheet.create({
  glow: {
    borderRadius: 22,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 18,
    elevation: 0, // glow on Android is carried by the shadow tint; elevation 0
                  // prevents promoting the glow layer to a separate compositor
                  // layer just to render a brief animation.
  },
});
