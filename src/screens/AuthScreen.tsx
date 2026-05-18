import React, { useState } from 'react';
import {
  ActivityIndicator,
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
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { GradientButton } from '../components/GradientButton';
import { ScreenHeader } from '../components/ScreenHeader';
import { useTheme } from '../theme';
import { useAuthStore } from '../state/auth';
import * as haptics from '../utils/haptics';
import type { RootStackParamList } from '../navigation/types';

type Mode = 'signin' | 'signup' | 'reset';

export function AuthScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const signIn = useAuthStore((s) => s.signIn);
  const signUp = useAuthStore((s) => s.signUp);
  const sendPasswordReset = useAuthStore((s) => s.sendPasswordReset);

  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const trimmedEmail = email.trim();
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail);
  const validPassword = password.length >= 6;
  const canSubmit =
    !busy &&
    validEmail &&
    (mode === 'reset' ? true : validPassword);

  const goBack = () => {
    if (nav.canGoBack()) nav.goBack();
    else nav.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
  };

  const submit = async () => {
    if (!canSubmit) return;
    haptics.tap();
    setBusy(true);
    setError(null);
    setInfo(null);
    try {
      if (mode === 'signin') {
        const res = await signIn(trimmedEmail, password);
        if (!res.ok) {
          setError(res.error);
        } else {
          haptics.success();
          goBack();
        }
      } else if (mode === 'signup') {
        const res = await signUp(trimmedEmail, password);
        if (!res.ok) {
          setError(res.error);
        } else if (res.needsConfirmation) {
          haptics.success();
          setInfo(
            `We sent a confirmation link to ${trimmedEmail}. Tap it to verify, then come back to sign in.`,
          );
          setMode('signin');
          setPassword('');
        } else {
          haptics.success();
          goBack();
        }
      } else {
        const res = await sendPasswordReset(trimmedEmail);
        if (!res.ok) {
          setError(res.error);
        } else {
          haptics.success();
          setInfo(
            `If an account exists for ${trimmedEmail}, we sent a reset link. Check your inbox.`,
          );
          setMode('signin');
        }
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const switchMode = (next: Mode) => {
    haptics.select();
    setMode(next);
    setError(null);
    setInfo(null);
  };

  const title =
    mode === 'signin'
      ? 'Welcome back'
      : mode === 'signup'
      ? 'Create your account'
      : 'Reset password';
  const subtitle =
    mode === 'signin'
      ? 'Sign in to keep your journey synced.'
      : mode === 'signup'
      ? 'A free account so your journey is yours, on any device.'
      : 'Enter the email tied to your account.';
  const submitLabel =
    mode === 'signin' ? 'Sign in' : mode === 'signup' ? 'Create account' : 'Send reset link';

  return (
    <View style={{ flex: 1 }}>
      <AnimatedBackground variant="primary" intensity={0.6} />
      <ScreenHeader onBack={goBack} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={insets.top + 40}
      >
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: theme.spacing.screen,
            paddingTop: theme.spacing.lg,
            paddingBottom: insets.bottom + 40,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={[theme.typography.overline, { color: theme.colors.textMuted }]}>
            ONEFAITH ACCOUNT
          </Text>
          <Text style={[theme.typography.hero, { color: theme.colors.text, marginTop: 6 }]}>
            {title}
          </Text>
          <Text
            style={[
              theme.typography.body,
              { color: theme.colors.textMuted, marginTop: 10, lineHeight: 22 },
            ]}
          >
            {subtitle}
          </Text>

          {mode !== 'reset' ? (
            <View
              style={[
                styles.tabs,
                {
                  borderColor: theme.colors.borderStrong,
                  backgroundColor: theme.isDark
                    ? 'rgba(0,0,0,0.25)'
                    : 'rgba(255,255,255,0.55)',
                  marginTop: 22,
                },
              ]}
            >
              <TabBtn
                label="Sign in"
                active={mode === 'signin'}
                onPress={() => switchMode('signin')}
              />
              <TabBtn
                label="Sign up"
                active={mode === 'signup'}
                onPress={() => switchMode('signup')}
              />
            </View>
          ) : null}

          <View style={{ marginTop: 18 }}>
            <FieldLabel>Email</FieldLabel>
            <View
              style={[
                styles.field,
                {
                  backgroundColor: theme.colors.inputBg,
                  borderColor: theme.colors.inputBorder,
                },
              ]}
            >
              <Ionicons
                name="mail-outline"
                size={18}
                color={theme.colors.inputPlaceholder}
                style={{ marginRight: 10 }}
              />
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                placeholderTextColor={theme.colors.inputPlaceholder}
                selectionColor={theme.colors.primary}
                cursorColor={theme.colors.inputCaret}
                underlineColorAndroid="transparent"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
                textContentType="emailAddress"
                style={[styles.input, { color: theme.colors.inputText }]}
                editable={!busy}
              />
            </View>

            {mode !== 'reset' ? (
              <>
                <FieldLabel style={{ marginTop: 14 }}>Password</FieldLabel>
                <View
                  style={[
                    styles.field,
                    {
                      backgroundColor: theme.colors.inputBg,
                      borderColor: theme.colors.inputBorder,
                    },
                  ]}
                >
                  <Ionicons
                    name="lock-closed-outline"
                    size={18}
                    color={theme.colors.inputPlaceholder}
                    style={{ marginRight: 10 }}
                  />
                  <TextInput
                    value={password}
                    onChangeText={setPassword}
                    placeholder={mode === 'signup' ? 'At least 6 characters' : 'Your password'}
                    placeholderTextColor={theme.colors.inputPlaceholder}
                    selectionColor={theme.colors.primary}
                    cursorColor={theme.colors.inputCaret}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                    textContentType={mode === 'signup' ? 'newPassword' : 'password'}
                    secureTextEntry={!showPassword}
                    style={[styles.input, { color: theme.colors.inputText }]}
                    editable={!busy}
                  />
                  <Pressable
                    onPress={() => setShowPassword((v) => !v)}
                    hitSlop={10}
                    disabled={busy}
                  >
                    <Ionicons
                      name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={18}
                      color={theme.colors.inputPlaceholder}
                    />
                  </Pressable>
                </View>
              </>
            ) : null}

            {error ? (
              <Text
                style={[
                  theme.typography.caption,
                  { color: theme.colors.danger, marginTop: 14, lineHeight: 18 },
                ]}
              >
                {error}
              </Text>
            ) : null}
            {info ? (
              <Text
                style={[
                  theme.typography.caption,
                  { color: theme.colors.primary, marginTop: 14, lineHeight: 18 },
                ]}
              >
                {info}
              </Text>
            ) : null}

            <View style={{ marginTop: 22 }}>
              <GradientButton
                label={busy ? 'Signing in…' : submitLabel}
                onPress={submit}
                full
                size="lg"
                glow
                gradient="primary"
                disabled={!canSubmit}
                iconRight={busy ? undefined : 'arrow-forward'}
              />
              {busy ? (
                <View style={styles.spinner} pointerEvents="none">
                  <ActivityIndicator size="small" color="#FFFFFF" />
                </View>
              ) : null}
            </View>

            {mode === 'signin' ? (
              <Pressable
                onPress={() => switchMode('reset')}
                hitSlop={8}
                style={{ marginTop: 16, alignSelf: 'center' }}
              >
                <Text
                  style={[
                    theme.typography.caption,
                    { color: theme.colors.primary, fontWeight: '600' },
                  ]}
                >
                  Forgot password?
                </Text>
              </Pressable>
            ) : null}

            {mode === 'reset' ? (
              <Pressable
                onPress={() => switchMode('signin')}
                hitSlop={8}
                style={{ marginTop: 16, alignSelf: 'center' }}
              >
                <Text
                  style={[
                    theme.typography.caption,
                    { color: theme.colors.primary, fontWeight: '600' },
                  ]}
                >
                  Back to sign in
                </Text>
              </Pressable>
            ) : null}
          </View>

          <Pressable
            onPress={goBack}
            hitSlop={8}
            style={{ marginTop: 28, alignSelf: 'center' }}
          >
            <Text
              style={[
                theme.typography.caption,
                { color: theme.colors.textMuted },
              ]}
            >
              Continue without an account
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

function TabBtn({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  const theme = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.tab,
        active && { backgroundColor: theme.colors.primary },
      ]}
    >
      <Text
        style={{
          color: active ? '#fff' : theme.colors.textMuted,
          fontSize: 14,
          fontWeight: '700',
          letterSpacing: 0.3,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function FieldLabel({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: any;
}) {
  const theme = useTheme();
  return (
    <Text
      style={[
        theme.typography.caption,
        {
          color: theme.colors.textMuted,
          letterSpacing: 0.6,
          marginBottom: 8,
          textTransform: 'uppercase',
          fontWeight: '700',
          fontSize: 11,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  tabs: {
    flexDirection: 'row',
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 11,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 14 : 4,
  },
  input: {
    flex: 1,
    fontSize: 15,
    paddingVertical: Platform.OS === 'ios' ? 0 : 12,
  },
  spinner: {
    position: 'absolute',
    right: 26,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
});
