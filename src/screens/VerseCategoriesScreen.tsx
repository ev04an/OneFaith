import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SoftCurves } from '../components/SoftCurves';
import { ScreenHeader } from '../components/ScreenHeader';
import { useTheme } from '../theme';
import { getVersesForTopic } from '../data/verses';
import type { Topic, TopicMeta } from '../data/topics';
import { TOPICS } from '../data/topics';
import type { RootStackParamList } from '../navigation/types';

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

const TINT: Partial<Record<Topic, { bg: string; iconBg: string }>> = {
  strength: { bg: '#FFE6D9', iconBg: '#FF8B4A' },
  heartbreak: { bg: '#FFE2EC', iconBg: '#E08AB0' },
  anxiety: { bg: '#E6EEFE', iconBg: '#5B9BE3' },
  hope: { bg: '#FFEFC9', iconBg: '#E0B461' },
  healing: { bg: '#E2F4ED', iconBg: '#2EA079' },
  loneliness: { bg: '#E8E4F8', iconBg: '#8A7BD8' },
  fear: { bg: '#E6EBF5', iconBg: '#5C70A0' },
  depression: { bg: '#DDE3F0', iconBg: '#4A5A85' },
  faith: { bg: '#DCEBFB', iconBg: '#3A6EBF' },
  love: { bg: '#FFE2EC', iconBg: '#FF7AA1' },
  forgiveness: { bg: '#E0F0FE', iconBg: '#5B9BE3' },
  motivation: { bg: '#FFEAD6', iconBg: '#E0B461' },
  thankfulness: { bg: '#FFF1D6', iconBg: '#D4A24A' },
  peace: { bg: '#E6F7EE', iconBg: '#52CBA5' },
  purpose: { bg: '#E0EBFB', iconBg: '#1B3578' },
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
            const tint = TINT[t.id] ?? { bg: '#E6EEFE', iconBg: '#3A6EBF' };
            const emoji = EMOJI[t.id] ?? '✝️';
            return (
              <Pressable
                key={t.id}
                onPress={() => nav.navigate('VerseTopic', { topicId: t.id })}
                style={[
                  styles.card,
                  {
                    backgroundColor: tint.bg,
                    borderColor: theme.colors.borderStrong,
                  },
                  theme.shadow.softLight,
                ]}
              >
                <View
                  style={[
                    styles.cardIcon,
                    { backgroundColor: tint.iconBg },
                  ]}
                >
                  <Ionicons name={t.icon as any} size={18} color="#FFFFFF" />
                </View>
                <Text style={styles.emoji}>{emoji}</Text>
                <Text
                  style={[
                    theme.typography.bodyBold,
                    {
                      color: theme.colors.text,
                      marginTop: 10,
                      fontSize: 15,
                    },
                  ]}
                >
                  {t.label}
                </Text>
                <Text
                  style={[
                    theme.typography.caption,
                    {
                      color: theme.colors.textMuted,
                      marginTop: 2,
                      fontSize: 12,
                    },
                  ]}
                >
                  {count} verse{count === 1 ? '' : 's'}
                </Text>
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
    padding: 14,
    borderRadius: 22,
    borderWidth: StyleSheet.hairlineWidth,
    minHeight: 132,
    justifyContent: 'space-between',
  },
  cardIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 22,
    marginTop: 8,
  },
});
