import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { ScreenHeader } from '../components/ScreenHeader';
import { GlassCard } from '../components/GlassCard';
import { VerseCard } from '../components/VerseCard';
import { GradientButton } from '../components/GradientButton';
import { useTheme } from '../theme';
import { getVerseOfTheDay } from '../data/verses';
import { getAffirmationOfTheHour } from '../data/affirmations';
import { useJournalStore } from '../state/store';
import type { RootStackParamList } from '../navigation/types';
import * as haptics from '../utils/haptics';

const REFLECTIONS = [
  'Where did you notice grace today, even in a small way?',
  'What is one fear you can hand over to God right now?',
  'Who could you encourage today with a single message?',
  'What lie about yourself have you been believing lately?',
  'What does rest look like for you this week — and what is in the way of it?',
  'In what area of your life are you tempted to take control instead of trusting?',
  'What is the most honest thing you could say to God right now?',
  'When did you last feel truly seen? What helped that happen?',
];

const CHALLENGES = [
  'Pray for one person today before you do anything else.',
  'Spend 5 minutes in silence with no phone, no music, no input.',
  'Send a kind, unsolicited message to someone you love.',
  'Forgive one person in your heart, even if you say nothing.',
  'Write down 3 things you are grateful for before bed.',
  'Ask God for one specific thing today — and watch for the answer.',
  'Resist one urge today as a small act of worship.',
  'Apologize for something you’ve been avoiding.',
];

function indexFor(date: Date, list: { length: number }): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const day = Math.floor((date.getTime() - start.getTime()) / 86400000);
  return day % list.length;
}

export function DailyScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const today = useMemo(() => new Date(), []);

  const verse = useMemo(() => getVerseOfTheDay(today), [today]);
  const affirmation = useMemo(() => getAffirmationOfTheHour(), []);
  const reflection = REFLECTIONS[indexFor(today, REFLECTIONS)];
  const challenge = CHALLENGES[indexFor(today, CHALLENGES)];

  const [gratitude, setGratitude] = useState('');
  const addEntry = useJournalStore((s) => s.addEntry);
  const [saved, setSaved] = useState(false);

  const saveGratitude = () => {
    const items = gratitude
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    if (!items.length) return;
    haptics.tap();
    addEntry({
      title: 'Daily gratitude',
      body: items.map((g) => `• ${g}`).join('\n'),
      mood: 'good',
      emotions: ['thankful'],
      gratitude: items,
    });
    setSaved(true);
  };

  const dateStr = today.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <View style={{ flex: 1 }}>
      <AnimatedBackground variant="primary" intensity={0.55} />
      <ScreenHeader
        onBack={() => nav.goBack()}
        title="Today"
        large
        subtitle={dateStr.toUpperCase()}
      />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: theme.spacing.screen,
          paddingTop: 12,
          paddingBottom: insets.bottom + 60,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Verse of the day */}
        <Text
          style={[
            theme.typography.overline,
            { color: theme.colors.text, opacity: 0.78, marginBottom: 10 },
          ]}
        >
          VERSE OF THE DAY
        </Text>
        <VerseCard
          verse={verse}
          gradient="primary"
          onPress={() => nav.navigate('VerseDetail', { verseId: verse.id })}
        />

        {/* Devotional reflection */}
        <View style={{ marginTop: 22 }}>
          <Text
            style={[
              theme.typography.overline,
              { color: theme.colors.text, opacity: 0.78, marginBottom: 10 },
            ]}
          >
            REFLECTION
          </Text>
          <GlassCard padded={18}>
            <Text
              style={[
                theme.typography.body,
                { color: theme.colors.text, fontSize: 16, lineHeight: 25 },
              ]}
            >
              {reflection}
            </Text>
          </GlassCard>
        </View>

        {/* Challenge */}
        <View style={{ marginTop: 22 }}>
          <Text
            style={[
              theme.typography.overline,
              { color: theme.colors.text, opacity: 0.78, marginBottom: 10 },
            ]}
          >
            DAILY CHALLENGE
          </Text>
          <GlassCard padded={18}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="flame" size={24} color="#E0B461" />
              <Text
                style={[
                  theme.typography.body,
                  { color: theme.colors.text, marginLeft: 14, flex: 1, fontSize: 15.5, lineHeight: 22 },
                ]}
              >
                {challenge}
              </Text>
            </View>
          </GlassCard>
        </View>

        {/* Affirmation */}
        <View style={{ marginTop: 22 }}>
          <Text
            style={[
              theme.typography.overline,
              { color: theme.colors.text, opacity: 0.78, marginBottom: 10 },
            ]}
          >
            AFFIRMATION
          </Text>
          <GlassCard padded={18}>
            <Text
              style={[
                theme.typography.bodyBold,
                { color: theme.colors.text, fontSize: 16, lineHeight: 24 },
              ]}
            >
              {affirmation}
            </Text>
          </GlassCard>
        </View>

        {/* Gratitude */}
        <View style={{ marginTop: 22 }}>
          <Text
            style={[
              theme.typography.overline,
              { color: theme.colors.text, opacity: 0.78, marginBottom: 10 },
            ]}
          >
            GRATITUDE
          </Text>
          <GlassCard padded={18}>
            <Text
              style={[
                theme.typography.body,
                { color: theme.colors.text, opacity: 0.92, fontSize: 14.5 },
              ]}
            >
              Three things you are thankful for today (one per line):
            </Text>
            <View
              style={[
                styles.inputWrap,
                {
                  backgroundColor: theme.colors.inputBg,
                  borderColor: theme.colors.inputBorder,
                },
              ]}
            >
              <TextInput
                value={gratitude}
                onChangeText={setGratitude}
                placeholder={'A warm meal.\nA quiet morning.\nA friend who texted.'}
                placeholderTextColor={theme.colors.inputPlaceholder}
                selectionColor={theme.colors.primary}
                cursorColor={theme.colors.inputCaret}
                underlineColorAndroid="transparent"
                style={[
                  theme.typography.body,
                  { color: theme.colors.inputText, minHeight: 100, padding: 0, fontSize: 15 },
                ]}
                multiline
                textAlignVertical="top"
              />
            </View>
            <View style={{ marginTop: 12 }}>
              <GradientButton
                label={saved ? 'Saved to journal' : 'Save to journal'}
                icon={saved ? 'checkmark-circle' : 'save-outline'}
                gradient="gold"
                full
                size="md"
                onPress={saveGratitude}
                disabled={saved || !gratitude.trim()}
              />
            </View>
          </GlassCard>
        </View>

        {/* Prayer + AI shortcuts */}
        <View style={{ marginTop: 22, flexDirection: 'row', gap: 12 }}>
          <Pressable
            onPress={() => nav.navigate('PrayerGenerator')}
            style={[
              styles.shortcut,
              {
                backgroundColor: theme.colors.bgGlass,
                borderColor: theme.colors.borderStrong,
              },
            ]}
          >
            <Ionicons name="sparkles" size={20} color={theme.colors.primary} />
            <Text style={[theme.typography.bodyBold, { color: theme.colors.text, marginTop: 8 }]}>
              Generate a prayer
            </Text>
            <Text
              style={[
                theme.typography.caption,
                { color: theme.colors.text, opacity: 0.78, marginTop: 4 },
              ]}
            >
              Personalized for today
            </Text>
          </Pressable>
          <Pressable
            onPress={() => nav.navigate('AI')}
            style={[
              styles.shortcut,
              {
                backgroundColor: theme.colors.bgGlass,
                borderColor: theme.colors.borderStrong,
              },
            ]}
          >
            <Ionicons name="chatbubbles" size={20} color={theme.colors.primary} />
            <Text style={[theme.typography.bodyBold, { color: theme.colors.text, marginTop: 8 }]}>
              Talk it out
            </Text>
            <Text
              style={[
                theme.typography.caption,
                { color: theme.colors.text, opacity: 0.78, marginTop: 4 },
              ]}
            >
              Encouragement & verses
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  inputWrap: {
    marginTop: 12,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 14,
  },
  shortcut: {
    flex: 1,
    padding: 16,
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
  },
});
