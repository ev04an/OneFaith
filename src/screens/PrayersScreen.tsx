import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { GlassCard } from '../components/GlassCard';
import { useTheme } from '../theme';
import { PRAYER_CATEGORIES, PRAYERS } from '../data/prayers';
import type { RootStackParamList } from '../navigation/types';

const CATEGORY_GRADIENT: Record<string, [string, string]> = {
  anxiety: ['#5B9BE3', '#3A6EBF'],
  depression: ['#3C2C5C', '#6E5BA8'],
  healing: ['#7AE7C7', '#A98BFF'],
  strength: ['#FF8B4A', '#FF4A6A'],
  peace: ['#5AB8A0', '#A8E8D2'],
  motivation: ['#F5D58A', '#D4A24A'],
  faith: ['#5B9BE3', '#7A5BFF'],
  temptation: ['#FF8B4A', '#7A5BFF'],
  recovery: ['#7AE7C7', '#5B9BE3'],
  confidence: ['#FFD68A', '#FF8FB1'],
  forgiveness: ['#5AB8E8', '#7A5BFF'],
  hope: ['#FFD68A', '#FFB14A'],
  family: ['#FF8FB1', '#FFC59E'],
  thankfulness: ['#F5D58A', '#FFC59E'],
  discipline: ['#3A6EBF', '#1B3578'],
  addiction: ['#7A5BFF', '#FF8FB1'],
  heartbreak: ['#9B3F6A', '#E08AB0'],
  grief: ['#4A6FA5', '#7CA0D8'],
  sleep: ['#1F1750', '#5AB8E8'],
  exams: ['#5AB8E8', '#7AE7C7'],
};

const FALLBACK_GRADIENT: [string, string] = ['#7A5BFF', '#A98BFF'];

export function PrayersScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={{ flex: 1 }}>
      <AnimatedBackground variant="serenity" intensity={0.6} />
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 18,
          // Clear the floating tab bar (~96px) with comfortable breathing room
          // so the last "By need" row isn't half-hidden behind the frosted bar.
          paddingBottom: insets.bottom + 180,
          paddingHorizontal: 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[theme.typography.overline, { color: theme.colors.textFaint }]}>
          PRAYERS
        </Text>
        <Text style={[theme.typography.hero, { color: theme.colors.text, marginTop: 6 }]}>
          A quiet place
        </Text>
        <Text
          style={[
            theme.typography.heroItalic,
            { color: theme.colors.text, opacity: 0.92, marginTop: 2 },
          ]}
        >
          to lay it down.
        </Text>

        <GlassCard style={{ marginTop: 18 }}>
          <Text style={[theme.typography.body, { color: theme.colors.textMuted, fontSize: 15, lineHeight: 22 }]}>
            Choose a category. Read slowly. You don’t have to say the words perfectly — He hears between them.
          </Text>
        </GlassCard>

        <Pressable
          onPress={() => nav.navigate('PrayerIntentions')}
          style={{ marginTop: 12 }}
        >
          <GlassCard padded={18}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="hand-left" size={24} color={theme.colors.primary} />
              <View style={{ flex: 1, marginLeft: 14 }}>
                <Text style={[theme.typography.bodyBold, { color: theme.colors.text }]}>
                  Prayer Intentions
                </Text>
                <Text
                  style={[
                    theme.typography.caption,
                    { color: theme.colors.textMuted, marginTop: 2 },
                  ]}
                >
                  Submit a request, or pray for others
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={theme.colors.textFaint} />
            </View>
          </GlassCard>
        </Pressable>

        <Text style={[theme.typography.h2, { color: theme.colors.text, marginTop: 26, marginBottom: 12 }]}>
          By need
        </Text>
        {!PRAYER_CATEGORIES?.length ? (
          <GlassCard padded={20}>
            <Text style={[theme.typography.body, { color: theme.colors.text, opacity: 0.92 }]}>
              No prayers available yet.
            </Text>
          </GlassCard>
        ) : null}
        <View style={styles.grid}>
          {(PRAYER_CATEGORIES ?? []).map((c) => {
            const count = (PRAYERS ?? []).filter((p) => p.category === c.id).length;
            const stops = CATEGORY_GRADIENT[c.id] ?? FALLBACK_GRADIENT;
            return (
              <Pressable
                key={c.id}
                onPress={() => nav.navigate('PrayerCategory', { category: c.id })}
                style={styles.cell}
              >
                <LinearGradient
                  colors={stops}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[styles.tile, theme.shadow.soft]}
                >
                  <Ionicons name={c.icon as any} size={26} color="#fff" />
                  <Text style={[theme.typography.h3, { color: '#fff', marginTop: 14 }]}>
                    {c.label}
                  </Text>
                  <Text style={[theme.typography.caption, { color: 'rgba(255,255,255,0.85)', marginTop: 2 }]}>
                    {count} prayer{count === 1 ? '' : 's'}
                  </Text>
                </LinearGradient>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -6 },
  cell: { width: '50%', padding: 6 },
  tile: {
    padding: 16,
    borderRadius: 20,
    minHeight: 130,
    justifyContent: 'space-between',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.18)',
  },
});
