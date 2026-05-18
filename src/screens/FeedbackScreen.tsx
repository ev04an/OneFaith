import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Linking,
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
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { ScreenHeader } from '../components/ScreenHeader';
import { GlassCard } from '../components/GlassCard';
import { GradientButton } from '../components/GradientButton';
import { useTheme } from '../theme';
import { useFeedbackStore, type FeedbackKind } from '../state/store';
import type { RootStackParamList } from '../navigation/types';
import * as haptics from '../utils/haptics';

// Replace with your real address. Used for the "send to developer" option.
const DEVELOPER_EMAIL = 'evanmathew.dev@gmail.com';

const KINDS: { id: FeedbackKind; label: string; icon: string }[] = [
  { id: 'general', label: 'General', icon: 'chatbox-ellipses-outline' },
  { id: 'bug', label: 'Bug', icon: 'bug-outline' },
  { id: 'feature', label: 'Feature', icon: 'bulb-outline' },
  { id: 'praise', label: 'Praise', icon: 'heart-outline' },
];

export function FeedbackScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const add = useFeedbackStore((s) => s.add);
  const items = useFeedbackStore((s) => s.items);

  const [kind, setKind] = useState<FeedbackKind>('general');
  const [rating, setRating] = useState(0);
  const [text, setText] = useState('');
  const [anonymous, setAnonymous] = useState(true);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const submit = () => {
    if (!text.trim() && rating === 0) {
      Alert.alert('Empty feedback', 'Rate the app or write a short note before submitting.');
      return;
    }
    haptics.tap();
    add({
      kind,
      rating,
      text: text.trim(),
      anonymous,
      email: anonymous ? undefined : email.trim() || undefined,
    });
    setSubmitted(true);
    setText('');
    setRating(0);
    setEmail('');
  };

  const sendToDeveloper = async () => {
    const body = items
      .slice(0, 50)
      .map(
        (i) =>
          `${i.kind.toUpperCase()} · ${i.rating}/5 · ${new Date(i.createdAt).toISOString()}\n${i.text}${i.email ? `\nFrom: ${i.email}` : i.anonymous ? '\n(anonymous)' : ''}`,
      )
      .join('\n\n---\n\n');
    const subject = encodeURIComponent('OneFaith feedback');
    const url = `mailto:${DEVELOPER_EMAIL}?subject=${subject}&body=${encodeURIComponent(body || 'Hi Evan,\n\n')}`;
    const can = await Linking.canOpenURL(url);
    if (!can) {
      // Fall back to system share sheet.
      try {
        await Share.share({ message: body || 'Hi Evan,' });
      } catch {}
      return;
    }
    Linking.openURL(url).catch(() => {});
  };

  return (
    <View style={{ flex: 1 }}>
      <AnimatedBackground variant="primary" intensity={0.55} />
      <ScreenHeader
        onBack={() => nav.goBack()}
        title="Feedback"
        large
        subtitle="HELP US IMPROVE"
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
        keyboardVerticalOffset={20}
      >
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: theme.spacing.screen,
            paddingTop: 14,
            paddingBottom: insets.bottom + 60,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {submitted ? (
            <GlassCard padded={20} glow>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <Ionicons name="checkmark-circle" size={28} color={theme.colors.success} />
                <View style={{ flex: 1 }}>
                  <Text style={[theme.typography.h3, { color: theme.colors.text }]}>
                    Thank you
                  </Text>
                  <Text
                    style={[
                      theme.typography.body,
                      { color: theme.colors.text, opacity: 0.92, marginTop: 4 },
                    ]}
                  >
                    Your feedback was saved.
                  </Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
                <Pressable
                  onPress={() => setSubmitted(false)}
                  style={[
                    styles.secondaryBtn,
                    {
                      backgroundColor: theme.colors.bgGlass,
                      borderColor: theme.colors.borderStrong,
                    },
                  ]}
                >
                  <Text style={[theme.typography.bodyBold, { color: theme.colors.text }]}>
                    Add another
                  </Text>
                </Pressable>
                <View style={{ flex: 1 }}>
                  <GradientButton
                    label="Send to developer"
                    icon="paper-plane-outline"
                    gradient="primary"
                    full
                    onPress={sendToDeveloper}
                  />
                </View>
              </View>
            </GlassCard>
          ) : (
            <>
              <GlassCard padded={20}>
                <Text
                  style={[
                    theme.typography.bodyBold,
                    { color: theme.colors.text, fontSize: 16 },
                  ]}
                >
                  How is the app feeling so far?
                </Text>
                <View style={styles.stars}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Pressable
                      key={n}
                      onPress={() => {
                        haptics.select();
                        setRating(n);
                      }}
                      hitSlop={6}
                    >
                      <Ionicons
                        name={n <= rating ? 'star' : 'star-outline'}
                        size={32}
                        color={n <= rating ? '#F5D58A' : theme.colors.textFaint}
                      />
                    </Pressable>
                  ))}
                </View>

                <Text
                  style={[
                    theme.typography.overline,
                    { color: theme.colors.text, opacity: 0.8, marginTop: 18, marginBottom: 8 },
                  ]}
                >
                  TYPE
                </Text>
                <View style={styles.kindRow}>
                  {KINDS.map((k) => {
                    const active = k.id === kind;
                    return (
                      <Pressable
                        key={k.id}
                        onPress={() => setKind(k.id)}
                        style={[
                          styles.kindChip,
                          {
                            backgroundColor: active
                              ? theme.colors.primary
                              : theme.colors.bgGlass,
                            borderColor: theme.colors.borderStrong,
                          },
                        ]}
                      >
                        <Ionicons
                          name={k.icon as any}
                          size={14}
                          color={active ? '#fff' : theme.colors.text}
                        />
                        <Text
                          style={{
                            color: active ? '#fff' : theme.colors.text,
                            fontSize: 12.5,
                            fontWeight: '700',
                          }}
                        >
                          {k.label}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>

                <Text
                  style={[
                    theme.typography.overline,
                    { color: theme.colors.text, opacity: 0.8, marginTop: 18, marginBottom: 8 },
                  ]}
                >
                  YOUR FEEDBACK
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
                    value={text}
                    onChangeText={setText}
                    placeholder="Tell us what worked, what didn’t, or what you wish existed."
                    placeholderTextColor={theme.colors.inputPlaceholder}
                    selectionColor={theme.colors.primary}
                    cursorColor={theme.colors.inputCaret}
                    underlineColorAndroid="transparent"
                    style={[
                      theme.typography.body,
                      { color: theme.colors.inputText, minHeight: 130, padding: 0, fontSize: 15 },
                    ]}
                    multiline
                    textAlignVertical="top"
                  />
                </View>

                <Pressable
                  onPress={() => setAnonymous((v) => !v)}
                  style={styles.checkboxRow}
                >
                  <Ionicons
                    name={anonymous ? 'checkbox' : 'square-outline'}
                    size={20}
                    color={anonymous ? theme.colors.primary : theme.colors.text}
                  />
                  <Text style={[theme.typography.body, { color: theme.colors.text }]}>
                    Submit anonymously
                  </Text>
                </Pressable>

                {!anonymous ? (
                  <View
                    style={[
                      styles.inputWrap,
                      {
                        marginTop: 8,
                        backgroundColor: theme.colors.inputBg,
                        borderColor: theme.colors.inputBorder,
                      },
                    ]}
                  >
                    <TextInput
                      value={email}
                      onChangeText={setEmail}
                      placeholder="Your email (optional)"
                      placeholderTextColor={theme.colors.inputPlaceholder}
                      selectionColor={theme.colors.primary}
                      cursorColor={theme.colors.inputCaret}
                      underlineColorAndroid="transparent"
                      autoCapitalize="none"
                      keyboardType="email-address"
                      style={[
                        theme.typography.body,
                        { color: theme.colors.inputText, padding: 0, fontSize: 15 },
                      ]}
                    />
                  </View>
                ) : null}

                <View style={{ marginTop: 16 }}>
                  <GradientButton
                    label="Submit feedback"
                    icon="paper-plane-outline"
                    gradient="primary"
                    full
                    size="lg"
                    onPress={submit}
                    glow
                  />
                </View>
              </GlassCard>

              {items.length > 0 ? (
                <View style={{ marginTop: 22 }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 10,
                    }}
                  >
                    <Text
                      style={[
                        theme.typography.overline,
                        { color: theme.colors.text, opacity: 0.85 },
                      ]}
                    >
                      YOUR PAST FEEDBACK
                    </Text>
                    <Pressable onPress={sendToDeveloper} hitSlop={8}>
                      <Text
                        style={[
                          theme.typography.bodyBold,
                          { color: theme.colors.primary, fontSize: 13 },
                        ]}
                      >
                        Send to developer
                      </Text>
                    </Pressable>
                  </View>
                  <View style={{ gap: 10 }}>
                    {items.slice(0, 10).map((i) => (
                      <GlassCard key={i.id} padded={14}>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 8,
                          }}
                        >
                          <Text
                            style={[
                              theme.typography.caption,
                              { color: theme.colors.text, opacity: 0.78 },
                            ]}
                          >
                            {i.kind.toUpperCase()} ·{' '}
                            {new Date(i.createdAt).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </Text>
                          {i.rating > 0 ? (
                            <Text
                              style={[
                                theme.typography.caption,
                                { color: '#F5D58A' },
                              ]}
                            >
                              {'★'.repeat(i.rating)}
                            </Text>
                          ) : null}
                        </View>
                        {i.text ? (
                          <Text
                            style={[
                              theme.typography.body,
                              {
                                color: theme.colors.text,
                                marginTop: 6,
                                fontSize: 14.5,
                                lineHeight: 21,
                              },
                            ]}
                          >
                            {i.text}
                          </Text>
                        ) : null}
                      </GlassCard>
                    ))}
                  </View>
                </View>
              ) : null}
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  stars: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  kindRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  kindChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
  },
  inputWrap: {
    marginTop: 8,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 14,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 14,
  },
  secondaryBtn: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
