import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme';
import type { Verse } from '../data/verses';
import type { GradientKey } from '../theme/gradients';

type Props = {
  verse: Verse;
  gradient?: GradientKey;
  compact?: boolean;
  onPress?: () => void;
  trailing?: React.ReactNode;
};

export function VerseCard({ verse, gradient = 'primary', compact, onPress, trailing }: Props) {
  const theme = useTheme();
  const stops = theme.gradients[gradient] as readonly string[];

  return (
    <Pressable onPress={onPress} disabled={!onPress} style={[styles.wrap, theme.shadow.soft]}>
      <LinearGradient
        colors={stops as any}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.bg, { borderRadius: theme.radius.lg }]}
      >
        <View style={styles.headerRow}>
          <View style={styles.refPill}>
            <Ionicons name="book-outline" size={12} color="#fff" />
            <Text style={styles.refText}>{verse.reference}</Text>
          </View>
          {trailing}
        </View>
        <Text
          style={[
            theme.typography.verse,
            styles.text,
            compact && { fontSize: 17, lineHeight: 26 },
          ]}
          numberOfLines={compact ? 4 : undefined}
        >
          “{verse.text}”
        </Text>
        {!compact && verse.reflection ? (
          <Text style={[theme.typography.body, styles.reflection]}>{verse.reflection}</Text>
        ) : null}
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { borderRadius: 22 },
  bg: { padding: 20, borderWidth: StyleSheet.hairlineWidth, borderColor: 'rgba(255,255,255,0.16)' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  refPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  refText: { color: '#fff', fontSize: 12, fontWeight: '700', letterSpacing: 0.4 },
  text: { color: '#fff', marginTop: 14 },
  reflection: { color: 'rgba(255,255,255,0.95)', marginTop: 14, fontSize: 14.5, lineHeight: 22 },
});
