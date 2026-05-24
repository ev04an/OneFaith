import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SoftCurves } from '../components/SoftCurves';
import { ScreenHeader } from '../components/ScreenHeader';
import { useTheme } from '../theme';
import { getVersesForTopic } from '../data/verses';
import type { Topic, TopicMeta } from '../data/topics';
import { TOPICS } from '../data/topics';
import type { RootStackParamList } from '../navigation/types';

// Pastel card tints are theme-independent (always light), so text on them
// must be too — theme.colors.text is white in dark mode and would disappear.
const CARD_TITLE = '#0F1F4B';
const CARD_BODY = '#3A4A63';

// Curated 15 most-relevant verse categories per user spec, in display order.
const FEATURED_TOPIC_IDS: Topic[] = [
  'strength',
  'heartbreak',
  'anxiety',
  'hope',
  'healing',
  'loneliness',
  'fear',
  'depression',
  'faith',
  'love',
  'forgiveness',
  'motivation',
  'thankfulness',
  'peace',
  'purpose',
];

const EMOJI: Partial<Record<Topic, string>> = {
  strength: '💪',
  heartbreak: '💔',
  anxiety: '😔',
  hope: '✨',
  healing: '❤️‍🩹',
  loneliness: '🫂',
  fear: '🕊️',
  depression: '🌧️',
  faith: '🙏',
  love: '💗',
  forgiveness: '🕊️',
  motivation: '🔥',
  thankfulness: '🌿',
  peace: '☁️',
  purpose: '🧭',
};

// Deeper pastel tints — readable for dark text, more visible than the
// previous near-white tones.
const TINT: Partial<Record<Topic, string>> = {
  strength: '#FFD0B5',
  heartbreak: '#FFCEDD',
  anxiety: '#CFDEFB',
  hope: '#FFE3A1',
  healing: '#C5EBDB',
  loneliness: '#D5CFEF',
  fear: '#C8D4E8',
  depression: '#BBC6E0',
  faith: '#B8D4F4',
  love: '#FFC8DC',
  forgiveness: '#C5DFF7',
  motivation: '#FFD9B3',
  thankfulness: '#F9DEA8',
  peace: '#C8EBD7',
  purpose: '#BFD3F1',
};

export function VerseCategoriesScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const topics: TopicMeta[] = FEATURED_TOPIC_IDS.map(
    (id) => TOPICS.find((t) => t.id === id)!,
  ).filter(Boolean);

  return (
    <View style={{ flex: 1 }}>
      <SoftCurves />
      <ScreenHeader
        onBack={() => nav.goBack()}
        title="Verses by Category"
        large
        subtitle="FIND WHAT YOUR HEART NEEDS"
      />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: theme.spacing.screen,
          paddingTop: 14,
          paddingBottom: insets.bottom + 40,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.grid}>
          {topics.map((t) => {
            const count = getVersesForTopic(t.id).length;
            const bg = TINT[t.id] ?? '#CFE3FF';
            const emoji = EMOJI[t.id] ?? '✝️';
            return (
              <Pressable
                key={t.id}
                onPress={() => nav.navigate('VerseTopic', { topicId: t.id })}
                style={[
                  styles.card,
                  {
                    backgroundColor: bg,
                    borderColor: 'rgba(15,31,75,0.12)',
                  },
                  theme.shadow.softLight,
                ]}
              >
                <Text style={styles.emoji}>{emoji}</Text>
                <View>
                  <Text style={styles.cardTitle}>{t.label}</Text>
                  <Text style={styles.cardBody}>
                    {count} verse{count === 1 ? '' : 's'}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  card: {
    width: '47.5%',
    padding: 16,
    borderRadius: 22,
    borderWidth: StyleSheet.hairlineWidth,
    minHeight: 138,
    justifyContent: 'space-between',
  },
  emoji: {
    fontSize: 32,
  },
  cardTitle: {
    color: CARD_TITLE,
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: -0.1,
  },
  cardBody: {
    color: CARD_BODY,
    fontSize: 12.5,
    fontWeight: '500',
    marginTop: 3,
  },
});
