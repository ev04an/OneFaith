import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme';
import * as haptics from '../utils/haptics';

type Props = {
  icon: keyof typeof Ionicons.glyphMap;
  label?: string;
  onPress?: () => void;
  active?: boolean;
  tone?: 'default' | 'danger' | 'success';
};

export function IconChip({ icon, label, onPress, active, tone = 'default' }: Props) {
  const theme = useTheme();
  const fg =
    tone === 'danger'
      ? theme.colors.danger
      : tone === 'success'
      ? theme.colors.success
      : active
      ? theme.colors.primary
      : theme.colors.text;
  return (
    <Pressable
      onPress={() => {
        haptics.select();
        onPress?.();
      }}
      style={({ pressed }) => [
        styles.chip,
        {
          borderColor: active ? theme.colors.primary : theme.colors.border,
          backgroundColor: active ? 'rgba(169,139,255,0.10)' : theme.colors.bgGlass,
          opacity: pressed ? 0.85 : 1,
        },
      ]}
    >
      <Ionicons name={icon} size={16} color={fg} />
      {label ? (
        <Text style={[theme.typography.caption, { color: fg, fontSize: 13, letterSpacing: 0.2 }]}>
          {label}
        </Text>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
  },
});
