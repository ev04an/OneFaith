import React, { useEffect, useRef, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
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
import { AnimatedBackground } from '../components/AnimatedBackground';
import { ScreenHeader } from '../components/ScreenHeader';
import { useTheme } from '../theme';
import { useAIMemoryStore, useChatStore, type ChatMessage } from '../state/store';
import { formatResponse, generateEncouragement } from '../utils/ai';
import * as haptics from '../utils/haptics';
import type { RootStackParamList } from '../navigation/types';

const PROMPTS = [
  'I feel anxious tonight.',
  'I just want to give up.',
  'I keep relapsing.',
  'I’m thankful but tired.',
  'I’m angry at someone I love.',
  'I feel completely alone.',
];

export function AIScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const messages = useChatStore((s) => s.messages);
  const push = useChatStore((s) => s.push);
  const clear = useChatStore((s) => s.clear);
  const recordIntent = useAIMemoryStore((s) => s.recordIntent);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const [showPrayerCTA, setShowPrayerCTA] = useState(false);
  const listRef = useRef<FlatList<ChatMessage>>(null);

  useEffect(() => {
    if (messages.length === 0) {
      push({
        role: 'assistant',
        text: 'Hi — I’m here for you.\n\nTell me what’s on your heart. No need to choose the perfect words; just say what’s true.',
      });
    }
  }, [messages.length, push]);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 60);
    }
  }, [messages.length]);

  const send = (text: string) => {
    const t = text.trim();
    if (!t) return;
    haptics.tap();
    push({ role: 'user', text: t });
    setInput('');
    setThinking(true);
    setShowPrayerCTA(false);
    setTimeout(() => {
      const recentAssistantTexts = messages
        .filter((m) => m.role === 'assistant')
        .slice(-3)
        .map((m) => m.text);
      const r = generateEncouragement(t, { recentAssistantTexts });
      push({ role: 'assistant', text: formatResponse(r) });
      setShowPrayerCTA(!!r.suggestPrayer);
      // Record into AI memory (no-op when memory toggle is off).
      if (!r.crisis && (r.detectedEmotions.length || r.detectedTopics.length)) {
        recordIntent(r.detectedEmotions, r.detectedTopics);
      }
      setThinking(false);
    }, 900 + Math.random() * 700);
  };

  return (
    <View style={{ flex: 1 }}>
      <AnimatedBackground variant="primary" intensity={0.65} />
      <ScreenHeader
        onBack={() => nav.goBack()}
        title="Companion"
        right={
          <Pressable onPress={clear} hitSlop={10}>
            <Ionicons name="refresh-outline" size={20} color={theme.colors.textMuted} />
          </Pressable>
        }
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
        keyboardVerticalOffset={20}
      >
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(m) => m.id}
          renderItem={({ item }) => <Bubble msg={item} />}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 10,
            paddingBottom: 16,
            gap: 10,
          }}
          ListFooterComponent={
            thinking ? (
              <View
                style={[
                  styles.thinking,
                  {
                    backgroundColor: theme.colors.bgGlass,
                    borderColor: theme.colors.border,
                  },
                ]}
              >
                <Text style={[theme.typography.body, { color: theme.colors.textMuted }]}>
                  Listening…
                </Text>
              </View>
            ) : null
          }
        />

        {/* Prayer CTA — only shown when the last response was emotionally appropriate */}
        {showPrayerCTA && !thinking ? (
          <View style={styles.ctaWrap}>
            <Pressable
              onPress={() => {
                haptics.tap();
                setShowPrayerCTA(false);
                nav.navigate('PrayerGenerator');
              }}
              style={({ pressed }) => [
                styles.ctaBtn,
                {
                  backgroundColor: theme.colors.primary,
                  opacity: pressed ? 0.85 : 1,
                },
              ]}
            >
              <Ionicons name="sparkles" size={16} color="#FFFFFF" />
              <Text style={styles.ctaLabel}>Create a prayer</Text>
            </Pressable>
            <Pressable
              onPress={() => setShowPrayerCTA(false)}
              hitSlop={8}
              style={styles.ctaDismiss}
            >
              <Text style={[theme.typography.caption, { color: theme.colors.textMuted }]}>
                Not now
              </Text>
            </Pressable>
          </View>
        ) : null}

        {/* Suggestion chips */}
        <View style={styles.chipRow}>
          <FlatList
            data={PROMPTS}
            keyExtractor={(p) => p}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 18, gap: 8 }}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => send(item)}
                style={[
                  styles.chip,
                  { backgroundColor: theme.colors.bgGlass, borderColor: theme.colors.border },
                ]}
              >
                <Text
                  style={[theme.typography.caption, { color: theme.colors.text, fontSize: 13 }]}
                >
                  {item}
                </Text>
              </Pressable>
            )}
          />
        </View>

        <View style={[styles.inputRow, { paddingBottom: insets.bottom + 10 }]}>
          <View
            style={[
              styles.inputWrap,
              { backgroundColor: theme.colors.inputBg, borderColor: theme.colors.inputBorder },
            ]}
          >
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="What’s on your heart?"
              placeholderTextColor={theme.colors.inputPlaceholder}
              selectionColor={theme.colors.primary}
              cursorColor={theme.colors.inputCaret}
              underlineColorAndroid="transparent"
              style={[
                theme.typography.body,
                { color: theme.colors.inputText, flex: 1, padding: 0, fontSize: 15 },
              ]}
              onSubmitEditing={() => send(input)}
              returnKeyType="send"
              multiline
            />
          </View>
          <Pressable onPress={() => send(input)} disabled={!input.trim()}>
            <LinearGradient
              colors={['#2F5FB0', '#5B9BE3']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[
                styles.sendBtn,
                {
                  opacity: input.trim() ? 1 : 0.5,
                },
              ]}
            >
              <Ionicons name="send" size={18} color="#fff" />
            </LinearGradient>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

function Bubble({ msg }: { msg: ChatMessage }) {
  const theme = useTheme();
  const isUser = msg.role === 'user';
  if (isUser) {
    return (
      <View style={{ alignItems: 'flex-end' }}>
        <LinearGradient
          colors={['#2F5FB0', '#5B9BE3']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.userBubble, { maxWidth: '85%' }]}
        >
          <Text style={[theme.typography.body, { color: '#fff', fontSize: 15, lineHeight: 22 }]}>
            {msg.text}
          </Text>
        </LinearGradient>
      </View>
    );
  }
  return (
    <View
      style={[
        styles.aiBubble,
        {
          backgroundColor: theme.colors.bgGlass,
          borderColor: theme.colors.border,
          maxWidth: '92%',
        },
      ]}
    >
      <Text style={[theme.typography.body, { color: theme.colors.text, fontSize: 15, lineHeight: 23 }]}>
        {msg.text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  userBubble: { paddingVertical: 12, paddingHorizontal: 16, borderRadius: 20, borderTopRightRadius: 6 },
  aiBubble: {
    padding: 14,
    borderRadius: 20,
    borderTopLeftRadius: 6,
    borderWidth: StyleSheet.hairlineWidth,
    alignSelf: 'flex-start',
  },
  thinking: {
    alignSelf: 'flex-start',
    padding: 12,
    borderRadius: 20,
    borderTopLeftRadius: 6,
    borderWidth: StyleSheet.hairlineWidth,
  },
  ctaWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 6,
  },
  ctaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
  },
  ctaLabel: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13.5,
  },
  ctaDismiss: {
    paddingHorizontal: 6,
    paddingVertical: 8,
  },
  chipRow: { paddingVertical: 8 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  inputWrap: {
    flex: 1,
    borderRadius: 22,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 48,
    justifyContent: 'center',
  },
  sendBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
