import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Share,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Animated, {
  FadeInLeft,
  FadeInRight,
  FadeInUp,
} from 'react-native-reanimated';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { ScreenHeader } from '../components/ScreenHeader';
import { AnimatedVerse } from '../components/AnimatedVerse';
import { AIAvatar } from '../components/AIAvatar';
import { TypingDots } from '../components/TypingDots';
import { ScrollToBottomFAB } from '../components/ScrollToBottomFAB';
import { useToast } from '../components/Toast';
import { useTheme } from '../theme';
import {
  useAIMemoryStore,
  useChatStore,
  useJournalStore,
  useSettingsStore,
  type ChatMessage,
} from '../state/store';
import { formatResponse, generateEncouragement } from '../utils/ai';
import type { EmotionId } from '../data/emotions';
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

// Show a timestamp under a bubble only when there's a meaningful gap since
// the previous one. Below ~4 minutes we keep the UI quiet.
const TIMESTAMP_GAP_MS = 4 * 60 * 1000;

function relativeTime(then: number): string {
  const diff = Date.now() - then;
  if (diff < 30_000) return 'Just now';
  if (diff < 60 * 60_000) return `${Math.floor(diff / 60_000)} min ago`;
  const d = new Date(then);
  return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

export function AIScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const toast = useToast();
  const messages = useChatStore((s) => s.messages);
  const push = useChatStore((s) => s.push);
  const clear = useChatStore((s) => s.clear);
  const addJournal = useJournalStore((s) => s.addEntry);
  const recordIntent = useAIMemoryStore((s) => s.recordIntent);
  const memoryEnabled = useAIMemoryStore((s) => s.enabled);
  const emotionFrequency = useAIMemoryStore((s) => s.emotionFrequency);
  const userName = useSettingsStore((s) => s.userName);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const [showPrayerCTA, setShowPrayerCTA] = useState(false);
  const [showFAB, setShowFAB] = useState(false);
  const listRef = useRef<FlatList<ChatMessage>>(null);
  // Tracks pending timeouts so we can cancel them on unmount and avoid
  // state-update-on-unmounted warnings / wasted work.
  const pendingTimeouts = useRef<Array<ReturnType<typeof setTimeout>>>([]);
  useEffect(() => {
    return () => {
      pendingTimeouts.current.forEach((id) => clearTimeout(id));
      pendingTimeouts.current = [];
    };
  }, []);

  // Only the most recent assistant message runs word-by-word reveal. Older
  // ones render statically so scrolling history stays cheap.
  const lastAssistantId =
    [...messages].reverse().find((m) => m.role === 'assistant')?.id ?? null;

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
      const id = setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 60);
      pendingTimeouts.current.push(id);
    }
  }, [messages.length]);

  const scrollToBottom = () => {
    listRef.current?.scrollToEnd({ animated: true });
  };

  const onLongPressMessage = (msg: ChatMessage) => {
    haptics.heavy();
    Alert.alert(
      msg.role === 'assistant' ? 'Companion message' : 'Your message',
      undefined,
      [
        {
          text: 'Copy text',
          onPress: async () => {
            try {
              await Clipboard.setStringAsync(msg.text);
              toast.show({ message: 'Copied to clipboard', variant: 'success' });
            } catch {
              toast.show({ message: 'Could not copy', variant: 'error' });
            }
          },
        },
        ...(msg.role === 'assistant'
          ? [
              {
                text: 'Save to journal',
                onPress: () => {
                  addJournal({
                    title: 'From my companion',
                    body: msg.text,
                    mood: 'okay',
                    emotions: [],
                    gratitude: [],
                  });
                  toast.show({ message: 'Saved to journal', variant: 'success' });
                },
              },
            ]
          : []),
        {
          text: 'Share',
          onPress: async () => {
            try {
              await Share.share({ message: msg.text });
            } catch {
              /* user cancelled */
            }
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ],
    );
  };

  const send = (text: string) => {
    const t = text.trim();
    if (!t) return;
    haptics.tap();
    push({ role: 'user', text: t });
    setInput('');
    setThinking(true);
    setShowPrayerCTA(false);
    const id = setTimeout(() => {
      const recentAssistantTexts = messages
        .filter((m) => m.role === 'assistant')
        .slice(-3)
        .map((m) => m.text);
      const recentUserTexts = messages
        .filter((m) => m.role === 'user')
        .slice(-3)
        .map((m) => m.text);

      // Pull the user's most-frequent emotion from AI memory (only when
      // memory toggle is on). Used by the engine to acknowledge recurring
      // themes — "you've been carrying anxiety for a while".
      let topMemoryEmotion: EmotionId | undefined;
      if (memoryEnabled && emotionFrequency) {
        const entries = Object.entries(emotionFrequency) as Array<[EmotionId, number]>;
        const top = entries.sort((a, b) => b[1] - a[1])[0];
        if (top && top[1] >= 3) topMemoryEmotion = top[0];
      }

      const r = generateEncouragement(t, {
        recentAssistantTexts,
        recentUserTexts,
        userName: userName.trim() || undefined,
        topMemoryEmotion,
      });
      push({ role: 'assistant', text: formatResponse(r) });
      setShowPrayerCTA(!!r.suggestPrayer);
      if (!r.crisis && (r.detectedEmotions.length || r.detectedTopics.length)) {
        recordIntent(r.detectedEmotions, r.detectedTopics);
      }
      setThinking(false);
    }, 900 + Math.random() * 700);
    pendingTimeouts.current.push(id);
  };

  return (
    <View style={{ flex: 1 }}>
      <AnimatedBackground variant="primary" intensity={0.65} />
      <ScreenHeader
        onBack={() => nav.goBack()}
        title="Companion"
        right={
          <Pressable
            onPress={() => {
              Alert.alert(
                'Clear conversation?',
                'This permanently deletes all messages with your companion.',
                [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Clear',
                    style: 'destructive',
                    onPress: () => {
                      clear();
                      toast.show({ message: 'Conversation cleared', variant: 'info' });
                    },
                  },
                ],
              );
            }}
            hitSlop={10}
          >
            <Ionicons name="refresh-outline" size={20} color={theme.colors.textMuted} />
          </Pressable>
        }
      />

      {/* Identity strip — premium 'who you're talking to' card under the header */}
      <View style={[styles.identityRow, { borderColor: theme.colors.border }]}>
        <AIAvatar size={36} pulse />
        <View style={{ marginLeft: 12, flex: 1 }}>
          <Text style={[theme.typography.bodyBold, { color: theme.colors.text, fontSize: 15 }]}>
            OneFaith Companion
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2, gap: 6 }}>
            <View style={styles.onlineDot} />
            <Text style={[styles.statusLine, { color: '#3FB47C' }]}>
              ONLINE · LISTENS WITHOUT JUDGEMENT
            </Text>
          </View>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
        keyboardVerticalOffset={20}
      >
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(m) => m.id}
          renderItem={({ item, index }) => {
            const prev = messages[index - 1];
            const showTimestamp =
              !prev || item.createdAt - prev.createdAt > TIMESTAMP_GAP_MS;
            const animateReveal =
              item.role === 'assistant' && item.id === lastAssistantId;
            return (
              <View>
                {showTimestamp ? (
                  <Text style={[styles.timestamp, { color: theme.colors.textMuted }]}>
                    {relativeTime(item.createdAt)}
                  </Text>
                ) : null}
                <Bubble
                  msg={item}
                  animateReveal={animateReveal}
                  onLongPress={() => onLongPressMessage(item)}
                />
              </View>
            );
          }}
          removeClippedSubviews
          initialNumToRender={12}
          maxToRenderPerBatch={8}
          windowSize={7}
          onScroll={(e) => {
            const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
            const distanceFromBottom =
              contentSize.height - (contentOffset.y + layoutMeasurement.height);
            const next = distanceFromBottom > 220;
            if (next !== showFAB) setShowFAB(next);
          }}
          scrollEventThrottle={120}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 10,
            paddingBottom: 16,
            gap: 10,
          }}
          ListFooterComponent={
            thinking ? (
              <Animated.View
                entering={FadeInUp.duration(280).springify().damping(15)}
                style={styles.thinkingRow}
              >
                <AIAvatar size={28} />
                <View
                  style={[
                    styles.thinking,
                    {
                      backgroundColor: theme.colors.bgGlass,
                      borderColor: theme.colors.border,
                    },
                  ]}
                >
                  <TypingDots color={theme.colors.primary} />
                </View>
              </Animated.View>
            ) : null
          }
        />

        <ScrollToBottomFAB
          visible={showFAB}
          onPress={() => {
            haptics.tap();
            scrollToBottom();
          }}
          bottom={insets.bottom + 168}
        />

        {/* Prayer CTA — only shown when the last response was emotionally appropriate */}
        {showPrayerCTA && !thinking ? (
          <Animated.View
            entering={FadeInUp.duration(260).springify().damping(15)}
            style={styles.ctaWrap}
          >
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
          </Animated.View>
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

const Bubble = React.memo(function Bubble({
  msg,
  animateReveal,
  onLongPress,
}: {
  msg: ChatMessage;
  animateReveal: boolean;
  onLongPress: () => void;
}) {
  const theme = useTheme();
  const isUser = msg.role === 'user';

  if (isUser) {
    return (
      <Animated.View
        entering={FadeInRight.duration(320).springify().damping(15)}
        style={{ alignItems: 'flex-end' }}
      >
        <Pressable onLongPress={onLongPress} delayLongPress={300}>
          <LinearGradient
            colors={['#2F5FB0', '#5B9BE3']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.userBubble, { maxWidth: '85%' }]}
          >
            {/* Premium top-gloss highlight on user bubble */}
            <LinearGradient
              pointerEvents="none"
              colors={['rgba(255,255,255,0.22)', 'rgba(255,255,255,0)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={[StyleSheet.absoluteFillObject, { borderRadius: 20, height: '55%' }]}
            />
            <Text style={[theme.typography.body, { color: '#fff', fontSize: 15, lineHeight: 22 }]}>
              {msg.text}
            </Text>
          </LinearGradient>
        </Pressable>
      </Animated.View>
    );
  }

  // Assistant bubble with avatar gutter
  return (
    <Animated.View
      entering={FadeInLeft.duration(360).springify().damping(15)}
      style={{ flexDirection: 'row', alignItems: 'flex-end', maxWidth: '92%' }}
    >
      <View style={{ marginRight: 8, marginBottom: 2 }}>
        <AIAvatar size={26} />
      </View>
      <Pressable onLongPress={onLongPress} delayLongPress={300} style={{ flex: 1 }}>
        <View
          style={[
            styles.aiBubble,
            {
              backgroundColor: theme.colors.bgGlass,
              borderColor: theme.colors.border,
            },
          ]}
        >
          {animateReveal ? (
            <AnimatedVerse
              text={msg.text}
              perWordDelay={28}
              duration={300}
              maxAnimatedWords={36}
              style={
                {
                  ...theme.typography.body,
                  color: theme.colors.text,
                  fontSize: 15,
                  lineHeight: 23,
                } as any
              }
            />
          ) : (
            <Text style={[theme.typography.body, { color: theme.colors.text, fontSize: 15, lineHeight: 23 }]}>
              {msg.text}
            </Text>
          )}
        </View>
      </Pressable>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  userBubble: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderTopRightRadius: 6,
    overflow: 'hidden',
    shadowColor: '#1B3578',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 3,
  },
  aiBubble: {
    padding: 14,
    borderRadius: 20,
    borderTopLeftRadius: 6,
    borderWidth: StyleSheet.hairlineWidth,
    alignSelf: 'flex-start',
  },
  thinkingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  thinking: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderTopLeftRadius: 6,
    borderWidth: StyleSheet.hairlineWidth,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
  },
  identityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  onlineDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#3FB47C',
  },
  statusLine: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  timestamp: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 2,
    opacity: 0.75,
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
