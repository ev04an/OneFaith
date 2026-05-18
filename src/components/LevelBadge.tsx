import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme';
import type { Badge } from '../data/levels';

type Props = {
  badge: Badge;
  earned: boolean;
};

const TIER_ICON: Record<Badge['tier'], keyof typeof Ionicons.glyphMap> = {
  bronze: 'medal',
  silver: 'medal',
  gold: 'trophy',
  diamond: 'diamond',
  legendary: 'star',
};

// Tier color used directly on the icon — no medallion background.
const TIER_COLOR: Record<Badge['tier'], string> = {
  bronze: '#A8682E',
  silver: '#7C7C8A',
  gold: '#C18F1F',
  diamond: '#2F5FB0',
  legendary: '#B57A1C',
};

export function LevelBadge({ badge, earned }: Props) {
  const theme = useTheme();
  return (
    <View
      style={[
        styles.card,
        {
          borderColor: theme.colors.borderStrong,
          backgroundColor: theme.colors.bgGlass,
        },
        earned && theme.shadow.glowGold,
      ]}
    >
      <Ionicons
        name={TIER_ICON[badge.tier]}
        size={42}
        color={earned ? TIER_COLOR[badge.tier] : theme.colors.textFaint}
      />
      <Text
        style={[
          theme.typography.bodyBold,
          { color: earned ? theme.colors.text : theme.colors.textMuted, marginTop: 12 },
        ]}
      >
        {badge.name}
      </Text>
      <Text style={[theme.typography.caption, { color: theme.colors.textMuted, marginTop: 2 }]}>
        {badge.threshold}d
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    width: 110,
    padding: 16,
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
  },
});
