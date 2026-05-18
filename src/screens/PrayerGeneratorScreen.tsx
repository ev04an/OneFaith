import React, { useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Speech from 'expo-speech';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { SoftCurves } from '../components/SoftCurves';
import { ScreenHeader } from '../components/ScreenHeader';
import { useTheme } from '../theme';
import { generatePrayer, type GeneratedPrayer } from '../utils/prayerGenerator';
import { useSavedPrayersStore, useJournalStore } from '../state/store';
import * as haptics from '../utils/haptics';
import type { RootStackParamList } from '../navigation/types';

type MoodId =
  | 'anxiety'
  | 'gratitude'
  | 'peace'
  | 'healing'
  | 'strength'
  | 'hope'
  | 'guidance'
  | 'forgiveness';

const MOODS: { id: MoodId; label: string; icon: keyof typeof import('@expo/vector-icons').Ionicons.glyphMap; tint: string; iconColor: string }[] = [
  { id: 'anxiety', label: 'Anxiety', icon: 'pulse-outline', tint: '#DCEBFB', iconColor: '#3A6EBF' },
  { id: 'gratitude', label: 'Gratitude', icon: 'gift-outline', tint: '#FFF1D6', iconColor: '#C28E2C' },
  { id: 'peace', label: 'Peace', icon: 'flower-outline', tint: '#E8F5EE', iconColor: '#1E8F66' },
  { id: 'healing', label: 'Healing', icon: 'leaf-outline', tint: '#E0F4EE', iconColor: '#138C72' },
  { id: 'strength', label: 'Strength', icon: 'barbell-outline', tint: '#FFE7DE', iconColor: '#C04A2D' },
  { id: 'hope', label: 'Hope', icon: 'sunny-outline', tint: '#FFEFC2', iconColor: '#B07D1F' },
  { id: 'guidance', label: 'Guidance', icon: 'compass-outline', tint: '#E0EBFB', iconColor: '#1B3578' },
  { id: 'forgiveness', label: 'Forgiveness', icon: 'water-outline', tint: '#E1F0FE', iconColor: '#5B9BE3' },
];

const MOOD_PROMPTS: Record<MoodId, string> = {
  anxiety: 'I’m feeling anxious and overwhelmed. I need Your peace.',
  gratitude: 'I want to say thank You today for everything You’ve done.',
  peace: 'My heart feels restless. I’m asking You for peace.',
  healing: 'I need healing — in my body, my mind, and my spirit.',
  strength: 'I feel weak. Strengthen me for what’s ahead.',
  hope: 'I need hope. Lift my eyes to You.',
  guidance: 'Lord, guide me. I don’t know what step to take next.',
  forgiveness: 'I’ve fallen short. Wash me clean and help me forgive others, too.',
};

export function PrayerGeneratorScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [mood, setMood] = useState<MoodId | null>(null);
  const [intention, setIntention] = useState('');
  const [generated, setGenerated] = useState<GeneratedPrayer | null>(null);
  const [generating, setGenerating] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [journalSaved, setJournalSaved] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const seedRef = useRef(0);
  const addSaved = useSavedPrayersStore((s) => s.add);
  const addJournal = useJournalStore((s) => s.addEntry);

  useEffect(() => {
    return () => {
      Speech.stop().catch(() => {});
    };
  }, []);

  const fade = useSharedValue(0);
  useEffect(() => {
    if (generated) {
      fade.value = 0;
      fade.value = withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) });
    }
  }, [generated, fade]);
  const fadeStyle = useAnimatedStyle(() => ({
    opacity: fade.value,
    transform: [{ translateY: (1 - fade.value) * 16 }],
  }));

  const buildPrompt = (): string => {
    const moodLine = mood ? MOOD_PROMPTS[mood] : '';
    const intent = intention.trim();
    if (moodLine && intent) return `${moodLine}\n\n${intent}`;
    return moodLine || intent || 'A prayer for today.';
  };

  const run = () => {
    haptics.tap();
    setGenerating(true);
    setSavedId(null);
    setJournalSaved(false);
    Speech.stop().catch(() => {});
    setSpeaking(false);
    setTimeout(() => {
      seedRef.current = seedRef.current + 1;
      const prompt = buildPrompt();
      const result = generatePrayer(prompt, Date.now() + seedRef.current);
      setGenerated(result);
      setGenerating(false);
    }, 700 + Math.random() * 500);
  };

  const regenerate = () => run();

  const onSave = () => {
    if (!generated) return;
    haptics.tap();
    const promptLabel = mood
      ? MOODS.find((m) => m.id === mood)?.label ?? 'Prayer'
      : intention.trim() || 'A personal prayer';
    const id = addSaved({
      text: generated.text,
      prompt: promptLabel,
      verseRef: generated.verse.reference,
    });
    setSavedId(id);
  };

  const onAddToJournal = () => {
    if (!generated) return;
    haptics.tap();
    const title =
      (mood ? `Prayer · ${MOODS.find((m) => m.id === mood)?.label}` : 'A prayer') +
      ` (${new Date().toLocaleDateString()})`;
    addJournal({
      title,
      body: `${generated.text}\n\n— ${generated.verse.reference}`,
      mood: 'good',
      emotions: [],
      gratitude: [],
    });
    setJournalSaved(true);
  };

  const onShare = async () => {
    if (!generated) return;
    haptics.tap();
    try {
      await Share.share({ message: generated.text });
    } catch {}
  };

  const onSpeak = async () => {
    if (!generated) return;
    if (speaking) {
      await Speech.stop().catch(() => {});
      setSpeaking(false);
      return;
    }
    haptics.tap();
    setSpeaking(true);
    Speech.speak(generated.text.replace(/[“”"]/g, ''), {
      rate: 0.92,
      pitch: 1.0,
      onDone: () => setSpeaking(false),
      onStopped: () => setSpeaking(false),
      onError: () => setSpeaking(false),
    });
  };

  const canGenerate = !!mood || intention.trim().length > 0;

  return (
    <View style={{ flex: 1 }}>
      <SoftCurves />
      <ScreenHeader onBack={() => nav.goBack()} title="Create Prayer" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
        keyboardVerticalOffset={20}
      >
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: theme.spacing.screen,
            paddingTop: 8,
            paddingBottom: insets.bottom + 40,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Title card */}
          <LinearGradient
            colors={['#5B9BE3', '#3A6EBF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.titleCard, theme.shadow.soft]}
          >
            <View style={[styles.titleCircle, { top: -50, right: -30, width: 160, height: 160, opacity: 0.18 }]} />
            <View style={[styles.titleCircle, { bottom: -36, left: -16, width: 110, height: 110, opacity: 0.14 }]} />
            <Ionicons name="sparkles" size={24} color="#FFFFFF" />
            <Text style={styles.titleHeading}>Create Prayer ✨</Text>
            <Text style={styles.titleSub}>
              Choose how you’re feeling and we’ll shape a prayer just for you.
            </Text>
          </LinearGradient>

          {/* Mood grid */}
          <Text
            style={[
              theme.typography.overline,
              { color: theme.colors.textMuted, marginTop: 24, marginBottom: 12 },
            ]}
          >
            HOW ARE YOU FEELING?
          </Text>
          <View style={styles.moodGrid}>
            {MOODS.map((m) => {
              const active = mood === m.id;
              return (
                <Pressable
                  key={m.id}
                  onPress={() => {
                    haptics.select();
                    setMood(active ? null : m.id);
                  }}
                  style={[
                    styles.moodCard,
                    {
                      backgroundColor: active ? theme.colors.primary : m.tint,
                      borderColor: active ? theme.colors.primary : theme.colors.borderStrong,
                      shadowColor: active ? theme.colors.primary : '#000',
                      shadowOpacity: active ? 0.32 : 0.06,
                      shadowRadius: active ? 18 : 6,
                      shadowOffset: { width: 0, height: 6 },
                      elevation: active ? 6 : 2,
                    },
                  ]}
                >
                  <Ionicons
                    name={m.icon}
                    size={24}
                    color={active ? '#FFFFFF' : m.iconColor}
                  />
                  <Text
                    style={{
                      // Pastel mood card backgrounds are theme-independent, so
                      // text must be too — theme.colors.text is white in dark
                      // mode and would disappear on the light pastel.
                      color: active ? '#FFFFFF' : '#0F1F4B',
                      fontWeight: '700',
                      fontSize: 13.5,
                      marginTop: 8,
                    }}
                  >
                    {m.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Intention card */}
          <Text
            style={[
              theme.typography.overline,
              { color: theme.colors.textMuted, marginTop: 24, marginBottom: 12 },
            ]}
          >
            WHAT WOULD YOU LIKE TO PRAY FOR?
          </Text>
          <View
            style={[
              styles.intentionCard,
              {
                backgroundColor: theme.colors.inputBg,
                borderColor: theme.colors.inputBorder,
              },
              theme.shadow.softLight,
            ]}
          >
            <TextInput
              value={intention}
              onChangeText={setIntention}
              placeholder="Optional — add a specific intention or message."
              placeholderTextColor={theme.colors.inputPlaceholder}
              selectionColor={theme.colors.primary}
              cursorColor={theme.colors.inputCaret}
              underlineColorAndroid="transparent"
              style={[
                theme.typography.body,
                {
                  color: theme.colors.inputText,
                  minHeight: 96,
                  padding: 0,
                  fontSize: 15.5,
                  lineHeight: 23,
                },
              ]}
              multiline
              textAlignVertical="top"
            />
          </View>

          {/* Create button */}
          <Pressable
            onPress={run}
            disabled={!canGenerate || generating}
            style={{ marginTop: 18 }}
          >
            <LinearGradient
              colors={['#5B9BE3', '#3A6EBF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[
                styles.createBtn,
                theme.shadow.glow,
                (!canGenerate || generating) && { opacity: 0.55 },
              ]}
            >
              <Ionicons
                name={generating ? 'hourglass-outline' : 'sparkles'}
                size={20}
                color="#FFFFFF"
              />
              <Text style={styles.createBtnLabel}>
                {generating ? 'Creating…' : generated ? 'Create another' : 'Create Prayer'}
              </Text>
            </LinearGradient>
          </Pressable>

          {/* Generated prayer card */}
          {generated ? (
            <Animated.View style={[{ marginTop: 22 }, fadeStyle]}>
              <View
                style={[
                  styles.resultCard,
                  {
                    backgroundColor: theme.colors.bgElevated,
                    borderColor: theme.colors.borderStrong,
                  },
                  theme.shadow.soft,
                ]}
              >
                <View
                  style={[
                    styles.resultRibbon,
                    { backgroundColor: theme.colors.primary },
                  ]}
                />
                <View style={styles.resultHeader}>
                  <Ionicons name="leaf" size={20} color={theme.colors.primary} />
                  <Text
                    style={[
                      theme.typography.overline,
                      { color: theme.colors.primary, letterSpacing: 2, flex: 1 },
                    ]}
                  >
                    A PRAYER FOR YOU
                  </Text>
                </View>
                <Text
                  selectable
                  style={[
                    styles.resultText,
                    { color: theme.colors.text },
                  ]}
                >
                  {generated.text}
                </Text>

                <View style={styles.actionGrid}>
                  <ActionPill
                    icon={savedId ? 'bookmark' : 'bookmark-outline'}
                    label={savedId ? 'Saved' : 'Save'}
                    onPress={onSave}
                  />
                  <ActionPill
                    icon="refresh-outline"
                    label="Regenerate"
                    onPress={regenerate}
                  />
                  <ActionPill
                    icon={speaking ? 'pause-circle-outline' : 'volume-medium-outline'}
                    label={speaking ? 'Stop' : 'Read aloud'}
                    onPress={onSpeak}
                  />
                  <ActionPill
                    icon="share-outline"
                    label="Share"
                    onPress={onShare}
                  />
                  <ActionPill
                    icon={journalSaved ? 'checkmark-circle' : 'book-outline'}
                    label={journalSaved ? 'In Journal' : 'Add to Journal'}
                    onPress={onAddToJournal}
                  />
                </View>
              </View>

              <Pressable
                onPress={() => nav.navigate('VerseDetail', { verseId: generated.verse.id })}
                style={{ marginTop: 14 }}
              >
                <View
                  style={[
                    styles.verseRow,
                    {
                      backgroundColor: theme.colors.bgGlassStrong,
                      borderColor: theme.colors.borderStrong,
                    },
                    theme.shadow.softLight,
                  ]}
                >
                  <Ionicons name="book" size={22} color={theme.colors.primary} />
                  <View style={{ flex: 1 }}>
                    <Text
                      style={[
                        theme.typography.caption,
                        { color: theme.colors.primary, letterSpacing: 1.4 },
                      ]}
                    >
                      OPEN VERSE
                    </Text>
                    <Text
                      style={[
                        theme.typography.bodyBold,
                        { color: theme.colors.text, marginTop: 2 },
                      ]}
                    >
                      {generated.verse.reference}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={theme.colors.textMuted} />
                </View>
              </Pressable>
            </Animated.View>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

function ActionPill({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof import('@expo/vector-icons').Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}) {
  const theme = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.actionPill,
        {
          backgroundColor: theme.colors.bgGlassStrong,
          borderColor: theme.colors.borderStrong,
        },
      ]}
    >
      <Ionicons name={icon} size={15} color={theme.colors.primary} />
      <Text
        style={{
          color: theme.colors.text,
          fontWeight: '700',
          fontSize: 12.5,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  titleCard: {
    marginTop: 8,
    padding: 24,
    borderRadius: 28,
    overflow: 'hidden',
  },
  titleCircle: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    borderRadius: 9999,
  },
  titleHeading: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.3,
    marginTop: 14,
  },
  titleSub: {
    color: 'rgba(255,255,255,0.94)',
    fontSize: 14.5,
    lineHeight: 22,
    marginTop: 8,
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  moodCard: {
    width: '47%',
    padding: 14,
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
  },
  intentionCard: {
    padding: 18,
    borderRadius: 22,
    borderWidth: StyleSheet.hairlineWidth,
  },
  createBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
    borderRadius: 22,
  },
  createBtnLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  resultCard: {
    padding: 22,
    borderRadius: 26,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  resultRibbon: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 5,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 4,
  },
  resultText: {
    marginTop: 14,
    fontSize: 16,
    lineHeight: 26,
    fontWeight: '500',
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 18,
  },
  actionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
  },
  verseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 14,
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
  },
});
