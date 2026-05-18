import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '../theme';
import type { Holiday } from '../data/holidays';

type Props = {
  holiday: Holiday;
  onPress: () => void;
  onDismiss?: () => void;
};

export function HolidayBanner({ holiday, onPress, onDismiss }: Props) {
  const theme = useTheme();
  const shimmer = useSharedValue(0);

  useEffect(() => {
    shimmer.value = withRepeat(
      withTiming(1, { duration: 2600, easing: Easing.inOut(Easing.quad) }),
      -1,
      true,
    );
  }, [shimmer]);

  const haloStyle = useAnimatedStyle(() => ({
    opacity: 0.45 + shimmer.value * 0.35,
    transform: [{ scale: 0.95 + shimmer.value * 0.08 }],
  }));

  return (
    <Pressable onPress={onPress} style={theme.shadow.glow}>
      <LinearGradient
        colors={holiday.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.wrap,
          {
            borderRadius: theme.radius.lg,
            borderColor: 'rgba(255,255,255,0.30)',
          },
        ]}
      >
        <Animated.View style={[styles.halo, { backgroundColor: holiday.accent }, haloStyle]} />
        <View style={styles.row}>
          <Ionicons name={holiday.icon as any} size={28} color="#fff" />
          <View style={{ flex: 1 }}>
            <Text style={[theme.typography.overline, { color: '#fff', opacity: 0.85 }]}>
              {holiday.name.toUpperCase()}
            </Text>
            <Text
              numberOfLines={1}
              style={[theme.typography.h2, { color: '#fff', marginTop: 4 }]}
            >
              {holiday.greeting}
            </Text>
            <Text
              numberOfLines={2}
              style={[
                theme.typography.caption,
                { color: 'rgba(255,255,255,0.92)', marginTop: 4, fontSize: 12.5, lineHeight: 18 },
              ]}
            >
              Tap to open the {holiday.name.toLowerCase()} experience
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#fff" />
        </View>
        {onDismiss ? (
          <Pressable
            onPress={onDismiss}
            hitSlop={12}
            style={styles.dismiss}
          >
            <Ionicons name="close" size={14} color="#fff" style={{ opacity: 0.85 }} />
          </Pressable>
        ) : null}
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    padding: 16,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
  },
  halo: {
    position: 'absolute',
    top: -90,
    right: -90,
    width: 220,
    height: 220,
    borderRadius: 110,
    opacity: 0.35,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  dismiss: {
    position: 'absolute',
    top: 6,
    right: 8,
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 11,
    backgroundColor: 'rgba(0,0,0,0.18)',
  },
});
