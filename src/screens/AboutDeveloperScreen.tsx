import React, { useEffect } from 'react';
import { Alert, Linking, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { ScreenHeader } from '../components/ScreenHeader';
import { GlassCard } from '../components/GlassCard';
import { GradientButton } from '../components/GradientButton';
import { useTheme } from '../theme';
import { copyText } from '../utils/share';
import * as haptics from '../utils/haptics';
import type { RootStackParamList } from '../navigation/types';

const UPI_ID = 'evan.mathew04-3@okhdfcbank';
const UPI_LINK = `upi://pay?pa=${encodeURIComponent(UPI_ID)}&pn=${encodeURIComponent(
  'Evan Mathew Abraham',
)}&cu=INR`;

const VERSE = {
  text: '“For I know the plans I have for you,” declares the Lord, “plans to prosper you and not to harm you, plans to give you hope and a future.”',
  ref: 'Jeremiah 29:11',
};

const MESSAGE =
  'This app was created with the goal of helping people strengthen their faith, find peace during difficult moments, and build a closer relationship with God through prayer, scripture, encouragement, and reflection. My hope is that this space becomes a source of comfort, peace, and spiritual growth for everyone who uses it.';

async function openLink(url: string, label: string) {
  try {
    const supported = await Linking.canOpenURL(url);
    if (!supported && url.startsWith('upi://')) {
      Alert.alert(
        'No UPI app installed',
        'Install a UPI app like GPay, PhonePe, or Paytm to use this option.',
      );
      return;
    }
    await Linking.openURL(url);
  } catch {
    Alert.alert('Could not open link', `Tried to open ${label}.`);
  }
}

export function AboutDeveloperScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const halo = useSharedValue(0);
  const drift = useSharedValue(0);
  const fade = useSharedValue(0);

  useEffect(() => {
    halo.value = withRepeat(
      withTiming(1, { duration: 3600, easing: Easing.inOut(Easing.quad) }),
      -1,
      true,
    );
    drift.value = withRepeat(
      withTiming(1, { duration: 5200, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );
    fade.value = withDelay(120, withTiming(1, { duration: 700 }));
  }, [drift, fade, halo]);

  const haloStyle = useAnimatedStyle(() => ({
    opacity: 0.45 + halo.value * 0.45,
    transform: [{ scale: 1 + halo.value * 0.08 }],
  }));
  const crossStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -2 + drift.value * 4 }],
  }));
  const fadeStyle = useAnimatedStyle(() => ({
    opacity: fade.value,
    transform: [{ translateY: (1 - fade.value) * 12 }],
  }));

  return (
    <View style={{ flex: 1 }}>
      <AnimatedBackground variant="primary" intensity={0.85} />
      <ScreenHeader onBack={() => nav.goBack()} title="About" />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: theme.spacing.screen,
          paddingTop: theme.spacing.lg,
          paddingBottom: insets.bottom + 80,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero cross */}
        <View style={styles.heroWrap}>
          <Animated.View
            style={[
              styles.halo,
              { backgroundColor: theme.colors.primary },
              haloStyle,
            ]}
          />
          <Animated.View style={[styles.crossWrap, crossStyle]}>
            <LinearGradient
              colors={theme.accentGradient as any}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.crossVertical, theme.shadow.glow]}
            />
            <LinearGradient
              colors={theme.accentGradient as any}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.crossHorizontal}
            />
          </Animated.View>
        </View>

        <Animated.View style={fadeStyle}>
          {/* Opening verse */}
          <View style={{ marginTop: theme.spacing.xl }}>
            <LinearGradient
              colors={theme.accentGradient as any}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[
                styles.quoteCard,
                { borderRadius: theme.radius.xl },
                theme.shadow.soft,
              ]}
            >
              <Ionicons name="leaf-outline" size={22} color="#fff" />
              <Text
                style={[
                  theme.typography.verse,
                  { color: '#fff', marginTop: 14, fontSize: 21, lineHeight: 31 },
                ]}
              >
                {VERSE.text}
              </Text>
              <Text
                style={[
                  theme.typography.caption,
                  {
                    color: 'rgba(255,255,255,0.92)',
                    marginTop: 14,
                    letterSpacing: 1,
                    fontSize: 13,
                  },
                ]}
              >
                — {VERSE.ref}
              </Text>
            </LinearGradient>
          </View>

          {/* Mission letter */}
          <GlassCard style={{ marginTop: theme.spacing.md }} padded={22}>
            <View style={styles.letterHeader}>
              <Ionicons name="mail-open-outline" size={18} color={theme.colors.primary} />
              <Text
                style={[
                  theme.typography.overline,
                  { color: theme.colors.text, opacity: 0.85, marginLeft: 8 },
                ]}
              >
                A LETTER FROM ME
              </Text>
            </View>
            <Text
              style={[
                theme.typography.body,
                {
                  color: theme.colors.text,
                  marginTop: 14,
                  fontSize: 16.5,
                  lineHeight: 27,
                },
              ]}
            >
              {MESSAGE}
            </Text>
            <Text
              style={[
                theme.typography.verseSmall,
                {
                  color: theme.colors.primary,
                  marginTop: 20,
                  fontStyle: 'italic',
                },
              ]}
            >
              — Evan Mathew Abraham
            </Text>
          </GlassCard>

          {/* Support the app */}
          <View style={{ marginTop: theme.spacing.xl }}>
            <View style={styles.supportHeader}>
              <Text style={[theme.typography.h2, { color: theme.colors.text }]}>
                Support the app
              </Text>
              <Ionicons name="heart" size={22} color="#FF6B8A" />
            </View>
            <Text
              style={[
                theme.typography.body,
                {
                  color: theme.colors.textMuted,
                  marginTop: 8,
                  fontSize: 14.5,
                  lineHeight: 22,
                },
              ]}
            >
              If OneFaith has been a blessing, you can support its development with any amount via UPI.
            </Text>

            <GlassCard style={{ marginTop: 16 }} padded={20}>
              <Text
                style={[
                  theme.typography.overline,
                  { color: theme.colors.textMuted, letterSpacing: 1.2 },
                ]}
              >
                UPI ID
              </Text>
              <Text
                selectable
                numberOfLines={1}
                adjustsFontSizeToFit
                style={[
                  theme.typography.h3,
                  {
                    color: theme.colors.text,
                    marginTop: 6,
                    fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace' }),
                  },
                ]}
              >
                {UPI_ID}
              </Text>
              <View style={{ flexDirection: 'row', gap: 10, marginTop: 18 }}>
                <View style={{ flex: 1 }}>
                  <GradientButton
                    label="Copy UPI"
                    icon="copy-outline"
                    variant="glass"
                    full
                    onPress={async () => {
                      haptics.tap();
                      await copyText(UPI_ID);
                      Alert.alert('Copied', 'UPI ID copied to clipboard.');
                    }}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <GradientButton
                    label="Open UPI app"
                    icon="qr-code-outline"
                    gradient="primary"
                    glow
                    full
                    onPress={() => openLink(UPI_LINK, 'UPI')}
                  />
                </View>
              </View>
            </GlassCard>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <View
              style={[styles.divider, { backgroundColor: theme.colors.borderStrong }]}
            />
            <Text
              style={[
                theme.typography.overline,
                {
                  color: theme.colors.text,
                  opacity: 0.78,
                  letterSpacing: 2.4,
                  textAlign: 'center',
                  fontSize: 11,
                },
              ]}
            >
              MADE WITH FAITH AND PURPOSE
            </Text>
            <View
              style={[styles.divider, { backgroundColor: theme.colors.borderStrong }]}
            />
          </View>
          <Text
            style={[
              theme.typography.caption,
              {
                color: theme.colors.text,
                opacity: 0.7,
                textAlign: 'center',
                marginTop: 12,
                fontSize: 13,
              },
            ]}
          >
            OneFaith • v1.0
          </Text>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  heroWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 28,
    paddingBottom: 12,
  },
  halo: {
    position: 'absolute',
    top: 14,
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  crossWrap: {
    width: 120,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
  },
  crossVertical: {
    position: 'absolute',
    width: 20,
    height: 140,
    borderRadius: 10,
  },
  crossHorizontal: {
    position: 'absolute',
    top: 38,
    width: 78,
    height: 20,
    borderRadius: 10,
  },
  letterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quoteCard: {
    padding: 24,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.24)',
  },
  supportHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 30,
  },
  divider: { flex: 1, height: StyleSheet.hairlineWidth },
});
