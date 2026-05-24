import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme';
import { AnimatedVerse } from './AnimatedVerse';
import type { Verse } from '../data/verses';
import type { GradientKey } from '../theme/gradients';

type Props = {
  verse: Verse;
  gradient?: GradientKey;
  compact?: boolean;
  onPress?: () => void;
  trailing?: React.ReactNode;
  /** When true, the verse text reveals word-by-word on mount. Default true. */
  animateReveal?: boolean;
};

export function VerseCard({
  verse,
  gradient = 'primary',
  compact,
  onPress,
  trailing,
  animateReveal = true,
}: Props) {
  const theme = useTheme();
  const stops = theme.gradients[gradient] as readonly string[];

  const verseStyle = [
    theme.typography.verse,
    styles.text,
    compact && { fontSize: 17, lineHeight: 26 },
  ].filter(Boolean) as any;

  return (
    <Pressable onPress={onPress} disabled={!onPress} style={[styles.wrap, theme.shadow.soft]}>
      <LinearGradient
        colors={stops as any}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.bg, { borderRadius: theme.radius.lg }]}
      >
        {/* Premium top gloss — a thin lit edge for depth */}
        <LinearGradient
          pointerEvents="none"
          colors={['rgba(255,255,255,0.22)', 'rgba(255,255,255,0)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={[StyleSheet.absoluteFillObject, { borderRadius: theme.radius.lg, height: '55%' }]}
        />
        <View style={styles.headerRow}>
          <View style={styles.refPill}>
            <Ionicons name="book-outline" size={12} color="#fff" />
            <Text style={styles.refText}>{verse.reference}</Text>
          </View>
          {trailing}
        </View>
        {animateReveal && !compact ? (
          <View style={{ marginTop: 14 }}>
            <AnimatedVerse
              text={verse.text}
              withQuotes
              startDelay={120}
              style={verseStyle}
            />
          </View>
        ) : (
          <Text
            style={verseStyle}
            numberOfLines={compact ? 4 : undefined}
          >
            “{verse.text}”
          </Text>
        )}
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
