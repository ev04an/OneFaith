import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme';

type Props = {
  eyebrow?: string;
  title: string;
  action?: { label: string; onPress: () => void };
};

export function SectionHeader({ eyebrow, title, action }: Props) {
  const { typography, colors, spacing } = useTheme();
  return (
    <View style={[styles.wrap, { marginBottom: spacing.md }]}>
      <View style={{ flex: 1 }}>
        {eyebrow ? (
          <Text style={[typography.overline, { color: colors.textMuted }]}>{eyebrow}</Text>
        ) : null}
        <Text style={[typography.h1, { color: colors.text, marginTop: eyebrow ? 6 : 0 }]}>
          {title}
        </Text>
      </View>
      {action ? (
        <Pressable onPress={action.onPress} style={styles.action} hitSlop={10}>
          <Text style={[typography.bodyBold, { color: colors.primary }]}>{action.label}</Text>
          <Ionicons name="chevron-forward" size={16} color={colors.primary} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'flex-end' },
  action: { flexDirection: 'row', alignItems: 'center', gap: 2 },
});
