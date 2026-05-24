import React, { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  ViewToken,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
import { GradientButton } from '../components/GradientButton';
import { useTheme } from '../theme';
import { useSettingsStore } from '../state/store';
import type { RootStackParamList } from '../navigation/types';
import type { GradientKey } from '../theme/gradients';

const { width } = Dimensions.get('window');

type Slide = {
  eyebrow: string;
  title: string;
  body: string;
  icon: keyof typeof Ionicons.glyphMap;
  gradient: GradientKey;
};

const SLIDES: Slide[] = [
  {
    eyebrow: 'WELCOME',
    title: 'Find peace,\nwhatever you’re feeling.',
    body: 'OneFaith meets you where you are — sad, anxious, hopeful, healing — and points you to a verse, a prayer, and a next step.',
    icon: 'sparkles-outline',
    gradient: 'primary',
  },
  {
    eyebrow: 'EMOTIONS',
    title: 'Pick how you feel.\nLet scripture answer.',
    body: 'Sixteen emotional doorways. Each one opens to verses, reflections, and prayers chosen for what you’re carrying right now.',
    icon: 'heart-circle-outline',
    gradient: 'serenity',
  },
  {
    eyebrow: 'RECOVERY',
    title: 'Build streaks.\nBecome unbreakable.',
    body: 'A live streak timer, badges, and seven levels of growth — for anyone fighting an addiction, a habit, or just the daily pull toward less.',
    icon: 'flame-outline',
    gradient: 'fire',
  },
  {
    eyebrow: 'BEGIN',
    title: 'You don’t have to\nfeel ready. Just begin.',
    body: 'A small step today is enough. We’ll be here every day for the next one.',
    icon: 'leaf-outline',
    gradient: 'gold',
  },
];

type Phase = 'slides' | 'name';

export function OnboardingScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const setHasOnboarded = useSettingsStore((s) => s.setHasOnboarded);
  const setUserName = useSettingsStore((s) => s.setUserName);
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>('slides');
  const [name, setName] = useState('');
  const listRef = useRef<FlatList<Slide>>(null);

  const finish = (capturedName?: string) => {
    const trimmed = (capturedName ?? '').trim();
    if (trimmed) setUserName(trimmed);
    setHasOnboarded(true);
    nav.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
  };

  // Skip button bypasses both slides and the name step.
  const skip = () => finish();

  const next = () => {
    if (index < SLIDES.length - 1) {
      listRef.current?.scrollToIndex({ index: index + 1, animated: true });
    } else {
      // Last slide → go to the name capture step.
      setPhase('name');
    }
  };

  const onViewable = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems[0]?.index != null) setIndex(viewableItems[0].index);
  }).current;

  const activeGradient: GradientKey =
    phase === 'name' ? 'primary' : SLIDES[index].gradient;

  return (
    <View style={{ flex: 1 }}>
      <AnimatedBackground variant={activeGradient} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={20}
      >
        <View style={{ flex: 1, paddingTop: insets.top + 16 }}>
          {phase === 'slides' ? (
            <>
              <View style={styles.topRow}>
                <View style={styles.dots}>
                  {SLIDES.map((_, i) => (
                    <View
                      key={i}
                      style={[
                        styles.dot,
                        {
                          width: i === index ? 24 : 8,
                          backgroundColor:
                            i === index ? theme.colors.text : theme.colors.borderStrong,
                        },
                      ]}
                    />
                  ))}
                </View>
                <Pressable onPress={skip} hitSlop={12}>
                  <Text style={[theme.typography.bodyBold, { color: theme.colors.textMuted }]}>
                    Skip
                  </Text>
                </Pressable>
              </View>

              <FlatList
                ref={listRef}
                data={SLIDES}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={(_, i) => String(i)}
                renderItem={({ item, index: i }) => (
                  <SlideView slide={item} active={i === index} />
                )}
                onViewableItemsChanged={onViewable}
                viewabilityConfig={{ itemVisiblePercentThreshold: 60 }}
              />

              <View style={[styles.footer, { paddingBottom: insets.bottom + 18 }]}>
                <GradientButton
                  label={index === SLIDES.length - 1 ? 'Almost there' : 'Continue'}
                  iconRight="arrow-forward"
                  onPress={next}
                  full
                  size="lg"
                  glow
                  gradient="primary"
                />
              </View>
            </>
          ) : (
            <NameStep
              name={name}
              setName={setName}
              onSubmit={() => finish(name)}
              onSkip={() => finish()}
              insets={insets}
            />
          )}
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

function NameStep({
  name,
  setName,
  onSubmit,
  onSkip,
  insets,
}: {
  name: string;
  setName: (v: string) => void;
  onSubmit: () => void;
  onSkip: () => void;
  insets: { bottom: number };
}) {
  const theme = useTheme();
  const intro = useSharedValue(0);
  const halo = useSharedValue(0);

  useEffect(() => {
    intro.value = withDelay(120, withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) }));
    halo.value = withRepeat(
      withTiming(1, { duration: 3500, easing: Easing.inOut(Easing.quad) }),
      -1,
      true,
    );
  }, [halo, intro]);

  const haloStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + halo.value * 0.08 }],
    opacity: 0.4 + halo.value * 0.4,
  }));
  const fadeStyle = useAnimatedStyle(() => ({
    opacity: intro.value,
    transform: [{ translateY: (1 - intro.value) * 16 }],
  }));

  return (
    <View style={{ flex: 1, paddingHorizontal: 28 }}>
      <View style={styles.iconWrap}>
        <Animated.View
          style={[
            styles.halo,
            { backgroundColor: theme.colors.primary },
            haloStyle,
          ]}
        />
        <View
          style={[
            styles.iconCircle,
            {
              borderColor: theme.colors.borderStrong,
              backgroundColor: theme.colors.bgGlassStrong,
            },
          ]}
        >
          <Ionicons name="person-outline" size={56} color={theme.colors.text} />
        </View>
      </View>

      <Animated.View style={[{ marginTop: 36 }, fadeStyle]}>
        <Text style={[theme.typography.overline, { color: theme.colors.textMuted, textAlign: 'center' }]}>
          ONE LAST THING
        </Text>
        <Text
          style={[
            theme.typography.display,
            { color: theme.colors.text, textAlign: 'center', marginTop: 12, fontSize: 36, lineHeight: 42 },
          ]}
        >
          What should we{'\n'}call you?
        </Text>
        <Text
          style={[
            theme.typography.body,
            {
              color: theme.colors.textMuted,
              textAlign: 'center',
              marginTop: 14,
              fontSize: 15,
              lineHeight: 22,
            },
          ]}
        >
          We'll greet you by name every time you open the app. You can always change it later in Settings.
        </Text>

        <View
          style={[
            styles.nameField,
            {
              backgroundColor: theme.colors.inputBg,
              borderColor: theme.colors.inputBorder,
              marginTop: 28,
            },
          ]}
        >
          <Ionicons
            name="happy-outline"
            size={20}
            color={theme.colors.inputPlaceholder}
            style={{ marginRight: 10 }}
          />
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Your first name"
            placeholderTextColor={theme.colors.inputPlaceholder}
            selectionColor={theme.colors.primary}
            cursorColor={theme.colors.inputCaret}
            underlineColorAndroid="transparent"
            autoCapitalize="words"
            autoCorrect={false}
            maxLength={40}
            returnKeyType="done"
            onSubmitEditing={onSubmit}
            style={[
              theme.typography.body,
              { color: theme.colors.inputText, flex: 1, padding: 0, fontSize: 16 },
            ]}
          />
        </View>
      </Animated.View>

      <View style={{ flex: 1 }} />

      <View style={[styles.footer, { paddingBottom: insets.bottom + 18 }]}>
        <GradientButton
          label="Begin Your Journey"
          iconRight="arrow-forward"
          onPress={onSubmit}
          full
          size="lg"
          glow
          gradient="primary"
        />
        <Pressable onPress={onSkip} hitSlop={10} style={{ marginTop: 14, alignSelf: 'center' }}>
          <Text style={[theme.typography.bodyBold, { color: theme.colors.textMuted }]}>
            Continue as Child of God
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

function SlideView({ slide, active }: { slide: Slide; active: boolean }) {
  const theme = useTheme();
  const intro = useSharedValue(0);
  const halo = useSharedValue(0);

  useEffect(() => {
    intro.value = withDelay(120, withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) }));
    halo.value = withRepeat(
      withTiming(1, { duration: 3500, easing: Easing.inOut(Easing.quad) }),
      -1,
      true,
    );
  }, [active, halo, intro]);

  const haloStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + halo.value * 0.08 }],
    opacity: 0.4 + halo.value * 0.4,
  }));
  const textStyle = useAnimatedStyle(() => ({
    opacity: intro.value,
    transform: [{ translateY: (1 - intro.value) * 16 }],
  }));

  return (
    <View style={{ width, paddingHorizontal: 28 }}>
      <View style={styles.iconWrap}>
        <Animated.View
          style={[
            styles.halo,
            { backgroundColor: theme.colors.primary },
            haloStyle,
          ]}
        />
        <View
          style={[
            styles.iconCircle,
            {
              borderColor: theme.colors.borderStrong,
              backgroundColor: theme.colors.bgGlassStrong,
            },
          ]}
        >
          <Ionicons name={slide.icon} size={56} color={theme.colors.text} />
        </View>
      </View>

      <Animated.View style={[{ marginTop: 36 }, textStyle]}>
        <Text style={[theme.typography.overline, { color: theme.colors.textMuted, textAlign: 'center' }]}>
          {slide.eyebrow}
        </Text>
        <Text
          style={[
            theme.typography.display,
            { color: theme.colors.text, textAlign: 'center', marginTop: 12 },
          ]}
        >
          {slide.title}
        </Text>
        <Text
          style={[
            theme.typography.body,
            {
              color: theme.colors.textMuted,
              textAlign: 'center',
              marginTop: 16,
              fontSize: 16,
              lineHeight: 24,
            },
          ]}
        >
          {slide.body}
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 6,
    paddingBottom: 12,
  },
  dots: { flexDirection: 'row', gap: 6 },
  dot: { height: 8, borderRadius: 4 },
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  halo: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
  },
  iconCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  nameField: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 16 : 6,
  },
});
