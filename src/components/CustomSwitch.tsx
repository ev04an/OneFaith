import React, { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useTheme } from '../theme';
import * as haptics from '../utils/haptics';

type Props = {
  value: boolean;
  onValueChange: (v: boolean) => void;
  disabled?: boolean;
};

const TRACK_WIDTH = 52;
const TRACK_HEIGHT = 31;
const THUMB_SIZE = 27;
const THUMB_PAD = 2;
const THUMB_TRAVEL = TRACK_WIDTH - THUMB_SIZE - THUMB_PAD * 2;

/**
 * Premium spring-driven toggle to replace the native RN Switch (which looks
 * generic on Android and stops short of the polish the rest of the app
 * carries). UI-thread animation only — track tint, thumb position, and a
 * tiny squish/stretch all animate from a single shared value.
 */
export function CustomSwitch({ value, onValueChange, disabled }: Props) {
  const theme = useTheme();
  const t = useSharedValue(value ? 1 : 0);

  useEffect(() => {
    t.value = withSpring(value ? 1 : 0, {
      damping: 18,
      stiffness: 260,
      mass: 0.6,
    });
  }, [value, t]);

  const thumbStyle = useAnimatedStyle(() => {
    const translateX = interpolate(t.value, [0, 1], [0, THUMB_TRAVEL]);
    // Subtle squish at mid-transition gives the thumb a sense of inertia.
    const scaleX = interpolate(t.value, [0, 0.5, 1], [1, 1.08, 1]);
    return {
      transform: [{ translateX }, { scaleX }],
    };
  });
  const onTintStyle = useAnimatedStyle(() => ({ opacity: t.value }));

  const handlePress = () => {
    if (disabled) return;
    haptics.select();
    onValueChange(!value);
  };

  return (
    <Pressable
      onPress={handlePress}
      hitSlop={6}
      style={[
        styles.track,
        {
          backgroundColor: theme.isDark
            ? 'rgba(155,200,240,0.18)'
            : 'rgba(15,31,75,0.14)',
          opacity: disabled ? 0.55 : 1,
        },
      ]}
    >
      {/* ON tint — fades up as value goes true */}
      <Animated.View style={[StyleSheet.absoluteFillObject, onTintStyle]}>
        <LinearGradient
          colors={['#3A7AC4', '#5B9BE3']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[StyleSheet.absoluteFillObject, { borderRadius: TRACK_HEIGHT / 2 }]}
        />
      </Animated.View>

      {/* Thumb */}
      <Animated.View style={[styles.thumb, thumbStyle]}>
        <View style={styles.thumbInner} />
        {/* Thumb top-gloss for a lit, dimensional feel */}
        <LinearGradient
          pointerEvents="none"
          colors={['rgba(255,255,255,0.65)', 'rgba(255,255,255,0)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={[StyleSheet.absoluteFillObject, { borderRadius: THUMB_SIZE / 2, height: '55%' }]}
        />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    width: TRACK_WIDTH,
    height: TRACK_HEIGHT,
    borderRadius: TRACK_HEIGHT / 2,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  thumb: {
    position: 'absolute',
    left: THUMB_PAD,
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  thumbInner: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: THUMB_SIZE / 2,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,31,75,0.10)',
  },
});
