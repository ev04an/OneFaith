import React, { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
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

export function OnboardingScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const setHasOnboarded = useSettingsStore((s) => s.setHasOnboarded);
  const [index, setIndex] = useState(0);
  const listRef = useRef<FlatList<Slide>>(null);

  const finish = () => {
    setHasOnboarded(true);
    nav.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
  };

  const next = () => {
    if (index < SLIDES.length - 1) {
      listRef.current?.scrollToIndex({ index: index + 1, animated: true });
    } else {
      finish();
    }
  };

  const onViewable = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems[0]?.index != null) setIndex(viewableItems[0].index);
  }).current;

  return (
    <View style={{ flex: 1 }}>
      <AnimatedBackground variant={SLIDES[index].gradient} />
      <View style={{ flex: 1, paddingTop: insets.top + 16 }}>
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
          <Pressable onPress={finish} hitSlop={12}>
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
            label={index === SLIDES.length - 1 ? 'Begin Your Journey' : 'Continue'}
            iconRight="arrow-forward"
            onPress={next}
            full
            size="lg"
            glow
            gradient="primary"
          />
        </View>
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
});
