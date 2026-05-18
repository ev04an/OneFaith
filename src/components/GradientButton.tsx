import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useTheme } from '../theme';
import type { GradientKey } from '../theme/gradients';
import * as haptics from '../utils/haptics';

type Props = {
  label: string;
  onPress?: () => void;
  gradient?: GradientKey;
  icon?: keyof typeof Ionicons.glyphMap;
  iconRight?: keyof typeof Ionicons.glyphMap;
  variant?: 'solid' | 'ghost' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  full?: boolean;
  disabled?: boolean;
  glow?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
};

export function GradientButton({
  label,
  onPress,
  gradient = 'primary',
  icon,
  iconRight,
  variant = 'solid',
  size = 'md',
  full,
  disabled,
  glow,
  style,
  textStyle,
}: Props) {
  const theme = useTheme();
  const stops =
    gradient === 'primary'
      ? (theme.accentGradient as readonly string[])
      : (theme.gradients[gradient] as readonly string[]);
  const press = useSharedValue(0);

  const pad =
    size === 'sm'
      ? { paddingVertical: 10, paddingHorizontal: 16 }
      : size === 'lg'
      ? { paddingVertical: 18, paddingHorizontal: 28 }
      : { paddingVertical: 14, paddingHorizontal: 22 };
  const font: TextStyle =
    size === 'sm'
      ? { ...theme.typography.bodyBold, fontSize: 13 }
      : size === 'lg'
      ? { ...theme.typography.h3, fontSize: 17 }
      : theme.typography.bodyBold;

  const aStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 - press.value * 0.04 }],
    opacity: disabled ? 0.5 : 1,
  }));

  const handlePressIn = () => {
    press.value = withSpring(1, { damping: 12, stiffness: 220 });
  };
  const handlePressOut = () => {
    press.value = withSpring(0, { damping: 12, stiffness: 220 });
  };
  const handlePress = () => {
    if (disabled) return;
    haptics.tap();
    onPress?.();
  };

  const radius = theme.radius.pill;
  const containerBase: ViewStyle = {
    borderRadius: radius,
    overflow: 'hidden',
    alignSelf: full ? 'stretch' : 'flex-start',
    ...(glow ? theme.shadow.glow : null),
  };

  if (variant === 'ghost') {
    return (
      <Animated.View style={[containerBase, aStyle, style]}>
        <Pressable
          onPress={handlePress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={disabled}
          style={[
            pad,
            {
              borderRadius: radius,
              borderWidth: 1,
              borderColor: theme.colors.borderStrong,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            },
          ]}
        >
          {icon && <Ionicons name={icon} size={18} color={theme.colors.text} />}
          <Text style={[font, { color: theme.colors.text }, textStyle]}>{label}</Text>
          {iconRight && <Ionicons name={iconRight} size={18} color={theme.colors.text} />}
        </Pressable>
      </Animated.View>
    );
  }

  if (variant === 'glass') {
    return (
      <Animated.View style={[containerBase, aStyle, style]}>
        <Pressable
          onPress={handlePress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={disabled}
          style={[
            pad,
            {
              borderRadius: radius,
              backgroundColor: theme.colors.bgGlassStrong,
              borderWidth: 1,
              borderColor: theme.colors.border,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            },
          ]}
        >
          {icon && <Ionicons name={icon} size={18} color={theme.colors.text} />}
          <Text style={[font, { color: theme.colors.text }, textStyle]}>{label}</Text>
          {iconRight && <Ionicons name={iconRight} size={18} color={theme.colors.text} />}
        </Pressable>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={[containerBase, aStyle, style]}>
      <Pressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
      >
        <LinearGradient
          colors={stops as any}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            pad,
            {
              borderRadius: radius,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            },
          ]}
        >
          {icon && <Ionicons name={icon} size={18} color="#fff" />}
          <Text style={[font, { color: '#fff' }, textStyle]}>{label}</Text>
          {iconRight && <Ionicons name={iconRight} size={18} color="#fff" />}
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
}
