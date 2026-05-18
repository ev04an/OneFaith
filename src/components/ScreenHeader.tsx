import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme';

type Props = {
  title?: string;
  onBack?: () => void;
  right?: React.ReactNode;
  subtitle?: string;
  large?: boolean;
};

export function ScreenHeader({ title, onBack, right, subtitle, large }: Props) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.wrap, { paddingTop: insets.top + 10, paddingHorizontal: theme.spacing.screen }]}>
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
});
