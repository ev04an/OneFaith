import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { ScreenHeader } from '../components/ScreenHeader';
import { GlassCard } from '../components/GlassCard';
import { DropCap } from '../components/DropCap';
import { SacredCorners } from '../components/SacredCorners';
import { GradientButton } from '../components/GradientButton';
import { IconChip } from '../components/IconChip';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../theme';
import { getVerseById } from '../data/verses';
import { useFavoritesStore } from '../state/store';
import { shareText, copyText } from '../utils/share';
import * as haptics from '../utils/haptics';
import type { RootStackParamList } from '../navigation/types';

export function VerseDetailScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'VerseDetail'>>();
  const verse = getVerseById(route.params.verseId);
  const isFav = useFavoritesStore((s) => verse && s.verses.includes(verse.id));
  const toggle = useFavoritesStore((s) => s.toggleVerse);

  if (!verse) {
    return (
      <View style={{ flex: 1 }}>
        <AnimatedBackground />
        <ScreenHeader onBack={() => nav.goBack()} title="Verse" />
        <Text style={{ color: theme.colors.text, padding: 24 }}>Verse not found.</Text>
      </View>
    );
  }

  const onShare = () => {
    haptics.tap();
    shareText(`“${verse.text}”\n— ${verse.reference}\n\nShared from OneFaith`);
  };
  const onCopy = () => {
    haptics.tap();
    copyText(`“${verse.text}” — ${verse.reference}`);
  };
  const onSave = () => {
    haptics.success();
    toggle(verse.id);
  };

  return (
    <View style={{ flex: 1 }}>
      <AnimatedBackground variant="primary" intensity={0.85} />
      <ScreenHeader onBack={() => nav.goBack()} />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: insets.bottom + 60,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.hero, theme.shadow.soft]}>
          <LinearGradient
            colors={['#7A5BFF', '#A98BFF', '#FF8FB1']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.heroGradient, { borderRadius: theme.radius.xl }]}
          >
            <View style={styles.refPill}>
              <Ionicons name="book-outline" size={12} color="#fff" />
              <Text style={styles.refText}>{verse.reference}</Text>
            </View>
            <Text style={styles.verseText}>“{verse.text}”</Text>
            {/* Manuscript-frame gold corners on the hero */}
            <SacredCorners color="#F7DD9C" inset={12} size={22} opacity={0.85} />
          </LinearGradient>
        </View>

        <GlassCard style={{ marginTop: 18 }}>
          <Text style={[theme.typography.overline, { color: theme.colors.textFaint }]}>
            REFLECTION
          </Text>
          <View style={{ marginTop: 12 }}>
            <DropCap
              capSize={62}
              bodyStyle={{
                ...theme.typography.body,
                color: theme.colors.text,
                fontSize: 16,
                lineHeight: 25,
              }}
            >
              {verse.reflection}
            </DropCap>
          </View>
        </GlassCard>

        <View style={styles.chipRow}>
          <IconChip
            icon={isFav ? 'bookmark' : 'bookmark-outline'}
            label={isFav ? 'Saved' : 'Save'}
            active={!!isFav}
            onPress={onSave}
          />
          <IconChip icon="share-outline" label="Share" onPress={onShare} />
          <IconChip icon="copy-outline" label="Copy" onPress={onCopy} />
        </View>

        <View style={{ marginTop: 18 }}>
          <GradientButton
            label="Pray about this"
            icon="leaf-outline"
            full
            size="lg"
            gradient="serenity"
            onPress={() => nav.navigate('Prayers' as any)}
          />
        </View>
        <View style={{ marginTop: 10 }}>
          <GradientButton
            label="Write in journal"
            icon="create-outline"
            variant="glass"
            full
            onPress={() => nav.navigate('JournalEntry', {})}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { marginTop: 8 },
  heroGradient: {
    padding: 24,
    minHeight: 320,
    justifyContent: 'flex-end',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  refPill: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  refText: {
    fontFamily: 'Cinzel_600SemiBold',
    color: '#fff',
    fontSize: 12,
    letterSpacing: 1.4,
  },
  verseText: {
    // Cormorant italic — reads like a hand-set psalter.
    fontFamily: 'CormorantGaramond_500Medium_Italic',
    color: '#fff',
    fontSize: 28,
    lineHeight: 40,
    marginTop: 18,
  },
  chipRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
    flexWrap: 'wrap',
  },
});
