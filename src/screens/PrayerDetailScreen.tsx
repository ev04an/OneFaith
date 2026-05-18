import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { ScreenHeader } from '../components/ScreenHeader';
import { IconChip } from '../components/IconChip';
import { GradientButton } from '../components/GradientButton';
import { useTheme } from '../theme';
import { getPrayerById } from '../data/prayers';
import { useFavoritesStore } from '../state/store';
import { shareText, copyText } from '../utils/share';
import * as haptics from '../utils/haptics';
import type { RootStackParamList } from '../navigation/types';

export function PrayerDetailScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'PrayerDetail'>>();
  const prayer = getPrayerById(route.params.prayerId);
  const saved = useFavoritesStore((s) => prayer && s.prayers.includes(prayer.id));
  const toggle = useFavoritesStore((s) => s.togglePrayer);

  if (!prayer) {
    return (
      <View style={{ flex: 1 }}>
        <AnimatedBackground />
        <ScreenHeader onBack={() => nav.goBack()} title="Prayer" />
        <Text style={{ color: theme.colors.text, padding: 24 }}>Prayer not found.</Text>
      </View>
    );
  }

  const stops = (theme.gradients[prayer.gradient] ?? theme.gradients.primary) as readonly string[];

  return (
    <View style={{ flex: 1 }}>
      <AnimatedBackground variant="serenity" intensity={0.8} />
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
            colors={stops as any}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroGradient}
          >
            <Ionicons name={prayer.icon as any} size={36} color="#fff" />
            <Text style={[theme.typography.h1, { color: '#fff', marginTop: 18 }]}>
              {prayer.title}
            </Text>
          </LinearGradient>
        </View>

        <View style={{ marginTop: 22, paddingHorizontal: 4 }}>
          <Text style={[theme.typography.verse, { color: theme.colors.text }]}>
            {prayer.text}
          </Text>
        </View>

        <View style={styles.chipRow}>
          <IconChip
            icon={saved ? 'bookmark' : 'bookmark-outline'}
            label={saved ? 'Saved' : 'Save'}
            active={!!saved}
            onPress={() => {
              haptics.success();
              toggle(prayer.id);
            }}
          />
          <IconChip
            icon="share-outline"
            label="Share"
            onPress={() => shareText(`${prayer.title}\n\n${prayer.text}\n\nFrom OneFaith`)}
          />
          <IconChip
            icon="copy-outline"
            label="Copy"
            onPress={() => copyText(`${prayer.title}\n\n${prayer.text}`)}
          />
        </View>

        <View style={{ marginTop: 22 }}>
          <GradientButton
            label="Reflect in journal"
            icon="create-outline"
            full
            size="lg"
            gradient="primary"
            glow
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
    padding: 22,
    borderRadius: 28,
    minHeight: 180,
    justifyContent: 'flex-end',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  chipRow: { flexDirection: 'row', gap: 10, marginTop: 16, flexWrap: 'wrap' },
});
