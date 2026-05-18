import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { ScreenHeader } from '../components/ScreenHeader';
import { VerseCard } from '../components/VerseCard';
import { GlassCard } from '../components/GlassCard';
import { useTheme } from '../theme';
import { useFavoritesStore } from '../state/store';
import { getVerseById } from '../data/verses';
import { getPrayerById } from '../data/prayers';
import { Ionicons } from '@expo/vector-icons';
import type { RootStackParamList } from '../navigation/types';

type Tab = 'verses' | 'prayers' | 'affirmations';

export function FavoritesScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const verses = useFavoritesStore((s) => s.verses);
  const prayers = useFavoritesStore((s) => s.prayers);
  const affirmations = useFavoritesStore((s) => s.affirmations);
  const [tab, setTab] = useState<Tab>('verses');

  return (
    <View style={{ flex: 1 }}>
      <AnimatedBackground variant="primary" intensity={0.7} />
      <ScreenHeader onBack={() => nav.goBack()} title="Favorites" large subtitle="SAVED" />

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 18,
          paddingBottom: insets.bottom + 60,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.tabs}>
          {(['verses', 'prayers', 'affirmations'] as Tab[]).map((t) => (
            <Pressable
              key={t}
              onPress={() => setTab(t)}
              style={[
                styles.tab,
                {
                  backgroundColor: tab === t ? theme.colors.primary : 'transparent',
                  borderColor: tab === t ? theme.colors.primary : theme.colors.border,
                },
              ]}
            >
              <Text
                style={[
                  theme.typography.caption,
                  {
                    color: tab === t ? '#fff' : theme.colors.textMuted,
                    fontSize: 13,
                    textTransform: 'capitalize',
                  },
                ]}
              >
                {t}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={{ marginTop: 18, gap: 14 }}>
          {tab === 'verses' &&
            (verses.length === 0 ? (
              <Empty
                icon="bookmark-outline"
                text="No saved verses yet. Tap the bookmark on a verse to keep it here."
              />
            ) : (
              verses
                .map((id) => getVerseById(id))
                .filter((v): v is NonNullable<typeof v> => !!v)
                .map((v) => (
                  <VerseCard
                    key={v.id}
                    verse={v}
                    compact
                    onPress={() => nav.navigate('VerseDetail', { verseId: v.id })}
                  />
                ))
            ))}

          {tab === 'prayers' &&
            (prayers.length === 0 ? (
              <Empty icon="leaf-outline" text="No saved prayers yet." />
            ) : (
              prayers
                .map((id) => getPrayerById(id))
                .filter((p): p is NonNullable<typeof p> => !!p)
                .map((p) => (
                  <Pressable
                    key={p.id}
                    onPress={() => nav.navigate('PrayerDetail', { prayerId: p.id })}
                  >
                    <GlassCard>
                      <Text style={[theme.typography.bodyBold, { color: theme.colors.text }]}>
                        {p.title}
                      </Text>
                      <Text
                        numberOfLines={2}
                        style={[
                          theme.typography.body,
                          { color: theme.colors.textMuted, marginTop: 6 },
                        ]}
                      >
                        {p.text.replace(/\n+/g, ' ').slice(0, 140)}…
                      </Text>
                    </GlassCard>
                  </Pressable>
                ))
            ))}

          {tab === 'affirmations' &&
            (affirmations.length === 0 ? (
              <Empty icon="sparkles-outline" text="No saved affirmations yet." />
            ) : (
              affirmations.map((a, i) => (
                <GlassCard key={i}>
                  <Text style={[theme.typography.verse, { color: theme.colors.text }]}>“{a}”</Text>
                </GlassCard>
              ))
            ))}
        </View>
      </ScrollView>
    </View>
  );
}

function Empty({ icon, text }: { icon: keyof typeof Ionicons.glyphMap; text: string }) {
  const theme = useTheme();
  return (
    <GlassCard padded>
      <View style={{ alignItems: 'center', paddingVertical: 18 }}>
        <Ionicons name={icon} size={28} color={theme.colors.textFaint} />
        <Text
          style={[
            theme.typography.body,
            { color: theme.colors.textMuted, marginTop: 10, textAlign: 'center' },
          ]}
        >
          {text}
        </Text>
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  tabs: { flexDirection: 'row', gap: 8 },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
  },
});
