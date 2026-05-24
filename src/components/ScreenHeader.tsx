import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../theme';

type Props = {
  title?: string;
  onBack?: () => void;
  right?: React.ReactNode;
  subtitle?: string;
  large?: boolean;
};

// Premium header treatment. iOS gets a real frosted blur (cheap on the GPU
// thanks to native UIVisualEffectView); Android gets a static gradient band
// because the equivalent BlurView is a fullscreen software effect and would
// drag every screen below 60fps.
export function ScreenHeader({ title, onBack, right, subtitle, large }: Props) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const tint = theme.isDark ? 'dark' : 'light';
  const androidScrim = theme.isDark
    ? (['rgba(8,16,40,0.78)', 'rgba(8,16,40,0.20)', 'rgba(8,16,40,0)'] as const)
    : (['rgba(255,255,255,0.88)', 'rgba(255,255,255,0.35)', 'rgba(255,255,255,0)'] as const);

  const headerHeight =
    insets.top + 10 + (large ? 78 : 50);

  return (
    <View style={{ position: 'relative' }}>
      {/* Backdrop */}
      <View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFillObject,
          { height: headerHeight + 18, overflow: 'hidden' },
        ]}
      >
        {Platform.OS === 'ios' ? (
          <BlurView intensity={42} tint={tint} style={StyleSheet.absoluteFillObject} />
        ) : (
          <View
            style={[
              StyleSheet.absoluteFillObject,
              {
                backgroundColor: theme.isDark
                  ? 'rgba(8,16,40,0.55)'
                  : 'rgba(255,255,255,0.72)',
              },
            ]}
          />
        )}
        <LinearGradient
          colors={androidScrim as any}
          locations={[0, 0.7, 1]}
          style={StyleSheet.absoluteFillObject}
        />
        {/* Hairline bottom edge — the premium 'glass shelf' divider */}
        <View
          style={[
            styles.hairline,
            {
              top: headerHeight + 12,
              backgroundColor: theme.isDark
                ? 'rgba(155,200,240,0.16)'
                : 'rgba(15,31,75,0.10)',
            },
          ]}
        />
      </View>

      <View
        style={[
          styles.wrap,
          { paddingTop: insets.top + 10, paddingHorizontal: theme.spacing.screen },
        ]}
      >
        <View style={styles.row}>
          {onBack ? (
            <Pressable
              onPress={onBack}
              hitSlop={12}
              style={[
                styles.iconBtn,
                {
                  borderColor: theme.colors.borderStrong,
                  backgroundColor: theme.colors.bgGlassStrong,
                },
              ]}
            >
              <Ionicons name="chevron-back" size={20} color={theme.colors.text} />
            </Pressable>
          ) : (
            <View style={{ width: 40 }} />
          )}
          <View style={{ flex: 1, alignItems: 'center', paddingHorizontal: 8 }}>
            {title && !large ? (
              <Text
                numberOfLines={1}
                style={[theme.typography.h3, { color: theme.colors.text }]}
              >
                {title}
              </Text>
            ) : null}
          </View>
          <View style={{ width: 40, alignItems: 'flex-end' }}>{right}</View>
        </View>
        {large && title ? (
          <View style={{ marginTop: 14 }}>
            {subtitle ? (
              <Text style={[theme.typography.overline, { color: theme.colors.textMuted }]}>
                {subtitle}
              </Text>
            ) : null}
            <Text style={[theme.typography.hero, { color: theme.colors.text, marginTop: 6 }]}>
              {title}
            </Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingBottom: 6 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },
  hairline: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: StyleSheet.hairlineWidth,
  },
});
