import React, { useEffect } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

type Props = {
  visible: boolean;
  onPress: () => void;
  /** Distance from the bottom of the screen in px (default 100). */
  bottom?: number;
};

/**
 * Soft floating action button that pops up when the user has scrolled away
 * from the latest message. Springs in/out via two shared values (scale +
 * opacity) on the UI thread.
 */
export function ScrollToBottomFAB({ visible, onPress, bottom = 100 }: Props) {
  const t = useSharedValue(0);
  useEffect(() => {
    if (visible) {
      t.value = withSpring(1, { damping: 14, stiffness: 240, mass: 0.6 });
    } else {
      t.value = withTiming(0, { duration: 180 });
    }
  }, [visible, t]);

  const animStyle = useAnimatedStyle(() => ({
    opacity: t.value,
    transform: [{ scale: 0.7 + t.value * 0.3 }, { translateY: (1 - t.value) * 6 }],
  }));

  return (
    <Animated.View
      pointerEvents={visible ? 'auto' : 'none'}
      style={[styles.wrap, { bottom }, animStyle]}
    >
      <Pressable onPress={onPress} hitSlop={6} style={styles.btn}>
        <LinearGradient
          colors={['#5B9BE3', '#3A6EBF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <Ionicons name="arrow-down" size={18} color="#FFFFFF" />
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    right: 22,
    shadowColor: '#0F1F4B',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 14,
    elevation: 6,
  },
  btn: {
    borderRadius: 22,
    overflow: 'hidden',
  },
  gradient: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
