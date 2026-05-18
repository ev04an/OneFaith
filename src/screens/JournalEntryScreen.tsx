import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { ScreenHeader } from '../components/ScreenHeader';
import { GlassCard } from '../components/GlassCard';
import { GradientButton } from '../components/GradientButton';
import { MoodPicker } from '../components/MoodPicker';
import { useTheme } from '../theme';
import { useJournalStore, type JournalMood } from '../state/store';
import { EMOTIONS, type EmotionId } from '../data/emotions';
import * as haptics from '../utils/haptics';
import type { RootStackParamList } from '../navigation/types';

export function JournalEntryScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'JournalEntry'>>();
  const { entries, addEntry, updateEntry, deleteEntry } = useJournalStore();

  const existing = useMemo(
    () => (route.params?.entryId ? entries.find((e) => e.id === route.params.entryId) : undefined),
    [route.params?.entryId, entries],
  );

  const [title, setTitle] = useState(existing?.title ?? '');
  const [body, setBody] = useState(existing?.body ?? '');
  const [mood, setMood] = useState<JournalMood>(existing?.mood ?? 'okay');
  const [tags, setTags] = useState<EmotionId[]>(existing?.emotions ?? []);
  const [gratitude, setGratitude] = useState<string[]>(existing?.gratitude ?? ['', '', '']);

  useEffect(() => {
    // ensure 3 slots
    if (gratitude.length < 3) setGratitude([...gratitude, ...Array(3 - gratitude.length).fill('')]);
  }, [gratitude]);

  const onSave = () => {
    const payload = {
      title: title.trim(),
      body: body.trim(),
      mood,
      emotions: tags,
      gratitude: gratitude.map((g) => g.trim()).filter(Boolean),
    };
    if (!payload.body && !payload.title) {
      Alert.alert('Empty entry', 'Write something before saving.');
      return;
    }
    if (existing) updateEntry(existing.id, payload);
    else addEntry(payload);
    haptics.success();
    nav.goBack();
  };

  const onDelete = () => {
    if (!existing) return;
    Alert.alert('Delete entry?', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteEntry(existing.id);
          haptics.warning();
          nav.goBack();
        },
      },
    ]);
  };

  const toggleTag = (id: EmotionId) => {
    haptics.select();
    setTags((t) => (t.includes(id) ? t.filter((x) => x !== id) : [...t, id]));
  };

  return (
    <View style={{ flex: 1 }}>
      <AnimatedBackground variant="ocean" intensity={0.6} />
      <ScreenHeader
        onBack={() => nav.goBack()}
        title={existing ? 'Edit entry' : 'New entry'}
        right={
          existing ? (
            <Pressable onPress={onDelete} hitSlop={10}>
              <Ionicons name="trash-outline" size={20} color={theme.colors.danger} />
            </Pressable>
          ) : null
        }
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
        keyboardVerticalOffset={20}
      >
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 8,
            paddingBottom: insets.bottom + 120,
          }}
          showsVerticalScrollIndicator={false}
        >
          <Text style={[theme.typography.overline, { color: theme.colors.textFaint }]}>
            HOW DO YOU FEEL?
          </Text>
          <View style={{ marginTop: 10 }}>
            <MoodPicker value={mood} onChange={setMood} />
          </View>

          <GlassCard
            style={{
              marginTop: 18,
              backgroundColor: theme.colors.inputBg,
              borderColor: theme.colors.inputBorder,
            }}
          >
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="Title (optional)"
              placeholderTextColor={theme.colors.inputPlaceholder}
              selectionColor={theme.colors.primary}
              cursorColor={theme.colors.inputCaret}
              underlineColorAndroid="transparent"
              style={[
                theme.typography.h2,
                { color: theme.colors.inputText, padding: 0 },
              ]}
            />
            <TextInput
              value={body}
              onChangeText={setBody}
              placeholder="Pour it out. He listens."
              placeholderTextColor={theme.colors.inputPlaceholder}
              selectionColor={theme.colors.primary}
              cursorColor={theme.colors.inputCaret}
              underlineColorAndroid="transparent"
              multiline
              style={[
                theme.typography.body,
                {
                  color: theme.colors.inputText,
                  minHeight: 160,
                  marginTop: 12,
                  fontSize: 16,
                  lineHeight: 24,
                  textAlignVertical: 'top',
                },
              ]}
            />
          </GlassCard>

          <Text style={[theme.typography.overline, { color: theme.colors.textFaint, marginTop: 20 }]}>
            TAG EMOTIONS
          </Text>
          <View style={styles.tagWrap}>
            {EMOTIONS.map((e) => {
              const active = tags.includes(e.id);
              return (
                <Pressable
                  key={e.id}
                  onPress={() => toggleTag(e.id)}
                  style={[
                    styles.tag,
                    {
                      borderColor: active ? theme.colors.primary : theme.colors.border,
                      backgroundColor: active ? 'rgba(169,139,255,0.14)' : theme.colors.bgGlass,
                    },
                  ]}
                >
                  <Text
                    style={[
                      theme.typography.caption,
                      {
                        color: active ? theme.colors.primary : theme.colors.textMuted,
                        fontSize: 13,
                      },
                    ]}
                  >
                    {e.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={[theme.typography.overline, { color: theme.colors.textFaint, marginTop: 22 }]}>
            GRATITUDE (3)
          </Text>
          <View style={{ gap: 10, marginTop: 10 }}>
            {gratitude.map((g, i) => (
              <GlassCard
                key={i}
                padded={false}
                style={{
                  backgroundColor: theme.colors.inputBg,
                  borderColor: theme.colors.inputBorder,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', padding: 14 }}>
                  <Ionicons name="leaf-outline" size={16} color={theme.colors.success} />
                  <TextInput
                    value={g}
                    onChangeText={(v) => {
                      const copy = [...gratitude];
                      copy[i] = v;
                      setGratitude(copy);
                    }}
                    placeholder={`I’m thankful for…`}
                    placeholderTextColor={theme.colors.inputPlaceholder}
                    selectionColor={theme.colors.primary}
                    cursorColor={theme.colors.inputCaret}
                    underlineColorAndroid="transparent"
                    style={[
                      theme.typography.body,
                      { color: theme.colors.inputText, flex: 1, marginLeft: 10, padding: 0 },
                    ]}
                  />
                </View>
              </GlassCard>
            ))}
          </View>

          <View style={{ marginTop: 22 }}>
            <GradientButton
              label={existing ? 'Update entry' : 'Save entry'}
              icon="checkmark"
              full
              size="lg"
              glow
              gradient="primary"
              onPress={onSave}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  tagWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
  },
});
