import React from 'react';
import { Pressable, PressableProps } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

// Drop-in Pressable that springs to a smaller scale on press-in and back on
// press-out. Used for the cards across Home / Settings / Profile to make taps
// feel responsive without changing layout.

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type Props = PressableProps & {
  /** Scale at full press (default 0.97). */
  pressScale?: number;
};

export function PressableScale({
  pressScale = 0.97,
  onPressIn,
  onPressOut,
  style,
  children,
  ...rest
}: Props) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      {...rest}
      onPressIn={(e) => {
        scale.value = withSpring(pressScale, { damping: 14, stiffness: 280, mass: 0.6 });
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        scale.value = withSpring(1, { damping: 14, stiffness: 280, mass: 0.6 });
        onPressOut?.(e);
      }}
      style={[style as any, animStyle]}
    >
      {children}
    </AnimatedPressable>
  );
}
