import React, { useEffect, useMemo } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Animated, {
  Easing,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { SoftCurves } from '../components/SoftCurves';
import { HolidayBanner } from '../components/HolidayBanner';
import { PressableScale } from '../components/PressableScale';
import { AnimatedCounter } from '../components/AnimatedCounter';
import { AnimatedVerse } from '../components/AnimatedVerse';
import { StreakRing } from '../components/StreakRing';
import { useTheme } from '../theme';
import { getVerseOfTheDay } from '../data/verses';
import { getActiveHoliday } from '../data/holidays';
import { getBibleBook } from '../data/bibleBooks';
import { useFavoritesStore, useSettingsStore, useBibleStore, useStreakStore, useSavedPrayersStore } from '../state/store';
import { msToParts } from '../utils/time';
import type { RootStackParamList } from '../navigation/types';

// Light pastel card tints (#EAF3FF, #DCEBFB, etc.) are theme-independent,
// so text on them must be too — theme.colors.text is white in dark mode and
// disappears. Titles #0F1F4B, body #3A4A63.
const CARD_TITLE = '#0F1F4B';
const CARD_BODY = '#3A4A63';

export function HomeScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const verse = useMemo(() => getVerseOfTheDay(), []);
  const activeHoliday = useMemo(() => getActiveHoliday(), []);
  const dismissedHolidays = useSettingsStore((s) => s.dismissedHolidays);
  const dismissHoliday = useSettingsStore((s) => s.dismissHoliday);
  const showHoliday =
    activeHoliday && !dismissedHolidays.includes(activeHoliday.id);

  const verseFavs = useFavoritesStore((s) => s.verses);
  const toggleVerseFav = useFavoritesStore((s) => s.toggleVerse);
  const isVerseSaved = verseFavs.includes(verse.id);

  const lastRead = useBibleStore((s) => s.lastRead);
  const lastReadBook = lastRead ? getBibleBook(lastRead.bookId) : null;

  const savedPrayers = useSavedPrayersStore((s) => s.prayers);
  const recentPrayer = savedPrayers[0] ?? null;

  const streakStartedAt = useStreakStore((s) => s.startedAt);
  const days = streakStartedAt
    ? msToParts(Date.now() - streakStartedAt).days
    : 0;

  const userName = useSettingsStore((s) => s.userName).trim();

  // Staggered intro on first mount. Three shared values run on slightly
  // delayed timelines so welcome / hero / actions cascade rather than
  // appearing in unison. No animation on subsequent renders.
  const s1 = useSharedValue(0);
  const s2 = useSharedValue(0);
  const s3 = useSharedValue(0);
  useEffect(() => {
    s1.value = withTiming(1, { duration: 500, easing: Easing.out(Easing.cubic) });
    s2.value = withDelay(120, withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) }));
    s3.value = withDelay(240, withTiming(1, { duration: 700, easing: Easing.out(Easing.cubic) }));
  }, [s1, s2, s3]);
  const headerStyle = useAnimatedStyle(() => ({
    opacity: s1.value,
    transform: [{ translateY: (1 - s1.value) * 14 }],
  }));
  const heroStyle = useAnimatedStyle(() => ({
    opacity: s2.value,
    transform: [{ translateY: (1 - s2.value) * 22 }],
  }));
  const restStyle = useAnimatedStyle(() => ({
    opacity: s3.value,
    transform: [{ translateY: (1 - s3.value) * 30 }],
  }));

  // Premium scroll parallax — hero verse card slides up slightly slower than
  // the page, fades, and gently scales down as the user scrolls. Single shared
  // value drives every transform so it stays at 60fps.
  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollY.value = e.contentOffset.y;
    },
  });
  // Translate-only parallax. Scaling a shadowed card on Android re-rasterises
  // the shadow every frame; that single change was a major source of the
  // scroll jank. Plain translateY runs purely on the compositor.
  const heroParallax = useAnimatedStyle(() => {
    const translateY = interpolate(scrollY.value, [-100, 0, 200], [-30, 0, -45]);
    const opacity = interpolate(scrollY.value, [0, 180, 280], [1, 0.85, 0.65]);
    return { transform: [{ translateY }], opacity };
  });
  const welcomeParallax = useAnimatedStyle(() => {
    const translateY = interpolate(scrollY.value, [0, 200], [0, -24]);
    const opacity = interpolate(scrollY.value, [0, 140, 220], [1, 0.7, 0.45]);
    return { transform: [{ translateY }], opacity };
  });

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 5) return 'Resting in His Grace';
    if (h < 12) return 'Good Morning';
    if (h < 18) return 'Good Afternoon';
    return 'Good Evening';
  })();
  const greetingName = userName || 'Child of God';

  return (
    <View style={{ flex: 1 }}>
      <SoftCurves />
      <Animated.ScrollView
        contentContainerStyle={{
          paddingTop:
            Math.max(insets.top, Platform.OS === 'ios' ? 54 : 24) + 12,
          paddingBottom: 160,
          paddingHorizontal: theme.spacing.screen,
        }}
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        {/* Welcome */}
        <Animated.View style={[styles.headerRow, headerStyle, welcomeParallax]}>
          <View style={{ flex: 1 }}>
            <Text
              style={[
                theme.typography.overline,
                { color: theme.colors.primary, letterSpacing: 2 },
              ]}
            >
              {greeting.toUpperCase()}
            </Text>
            <Text
              style={[
                styles.welcomeText,
                { color: theme.colors.text },
              ]}
            >
              {greetingName} ✨
            </Text>
          </View>
          <Pressable
            onPress={() => nav.navigate('Profile')}
            hitSlop={6}
            style={[
              styles.avatarBtn,
              {
                backgroundColor: theme.colors.bgGlassStrong,
                borderColor: theme.colors.borderStrong,
              },
            ]}
          >
            <Ionicons name="person-outline" size={20} color={theme.colors.primary} />
          </Pressable>
        </Animated.View>

        {/* Holiday banner */}
        {showHoliday && activeHoliday ? (
          <View style={{ marginTop: 18 }}>
            <HolidayBanner
              holiday={activeHoliday}
              onPress={() => nav.navigate('Holiday', { id: activeHoliday.id })}
              onDismiss={() => dismissHoliday(activeHoliday.id)}
            />
          </View>
        ) : null}

        {/* Daily verse hero */}
        <Animated.View style={[heroStyle, heroParallax]}>
        <Pressable
          onPress={() => nav.navigate('VerseDetail', { verseId: verse.id })}
          style={{ marginTop: 22 }}
        >
          <LinearGradient
            colors={['#5B9BE3', '#3A6EBF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.verseHero, theme.shadow.depth]}
          >
            {/* Premium top gloss — integrates with the gradient as a lit edge */}
            <LinearGradient
              pointerEvents="none"
              colors={['rgba(255,255,255,0.22)', 'rgba(255,255,255,0)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={[StyleSheet.absoluteFillObject, { borderRadius: 24, height: '55%' }]}
            />
            {/* Decorative shapes */}
            <View style={[styles.heroCircle, { top: -50, right: -30, width: 160, height: 160, opacity: 0.18 }]} />
            <View style={[styles.heroCircle, { bottom: -40, left: -20, width: 120, height: 120, opacity: 0.14 }]} />

            <View style={styles.heroHeader}>
              <Ionicons name="book" size={20} color="#FFFFFF" />
              <Text style={styles.heroEyebrow}>VERSE OF THE DAY</Text>
              <Pressable
                onPress={(e) => {
                  e.stopPropagation?.();
                  toggleVerseFav(verse.id);
                }}
                hitSlop={14}
              >
                <Ionicons
                  name={isVerseSaved ? 'bookmark' : 'bookmark-outline'}
                  size={20}
                  color="#FFFFFF"
                />
              </Pressable>
            </View>

            <View style={{ marginTop: 18 }}>
              <AnimatedVerse
                text={verse.text}
                withQuotes
                startDelay={420}
                perWordDelay={42}
                style={styles.heroVerse}
              />
            </View>
            <Text style={styles.heroRef}>— {verse.reference}</Text>
          </LinearGradient>
        </Pressable>
        </Animated.View>

        {/* Streak ring banner — signature premium element, only when there's an active streak */}
        {streakStartedAt ? (
          <Animated.View style={[restStyle, { marginTop: 22 }]}>
            <PressableScale
              onPress={() =>
                (nav as any).navigate('MainTabs', { screen: 'Recovery' })
              }
              glow
              style={[
                styles.streakBanner,
                {
                  backgroundColor: theme.colors.bgGlassStrong,
                  borderColor: theme.colors.borderStrong,
                },
                theme.shadow.softLight,
              ]}
            >
              <StreakRing days={days} target={30} size={88} stroke={9} />
              <View style={{ flex: 1, marginLeft: 18 }}>
                <Text
                  style={[
                    theme.typography.overline,
                    { color: theme.colors.primary, letterSpacing: 1.6 },
                  ]}
                >
                  CURRENT STREAK
                </Text>
                <Text
                  style={[
                    theme.typography.h2,
                    { color: theme.colors.text, marginTop: 4, fontSize: 20 },
                  ]}
                >
                  {days === 1 ? 'One day strong' : `${days} days strong`}
                </Text>
                <Text
                  style={[
                    theme.typography.caption,
                    { color: theme.colors.textMuted, marginTop: 4 },
                  ]}
                >
                  Tap to open your Recovery journey →
                </Text>
              </View>
            </PressableScale>
          </Animated.View>
        ) : null}

        {/* Action grid — mixed sizes per reference */}
        <Animated.View style={[{ marginTop: 22 }, restStyle]}>
          <Text
            style={[
              theme.typography.h2,
              { color: theme.colors.text, marginBottom: 14, fontSize: 20 },
            ]}
          >
            What would you like to do?
          </Text>
          <View style={styles.actionRow}>
            <ActionCard
              icon="sparkles"
              label="Create Prayer"
              subtitle="Personal"
              color="#5B9BE3"
              tint="#EAF3FF"
              size="tall"
              onPress={() => nav.navigate('PrayerGenerator')}
            />
            <View style={{ flex: 1, gap: 12 }}>
              <ActionCard
                icon="library"
                label="Bible"
                subtitle="Read & study"
                color="#3A6EBF"
                tint="#DCEBFB"
                size="sm"
                onPress={() =>
                  (nav as any).navigate('MainTabs', { screen: 'Bible' })
                }
              />
              <ActionCard
                icon="create"
                label="Journal"
                subtitle="Reflect"
                color="#1B3578"
                tint="#CFE3FF"
                size="sm"
                onPress={() =>
                  (nav as any).navigate('MainTabs', { screen: 'Journal' })
                }
              />
            </View>
          </View>
          <View style={[styles.actionRow, { marginTop: 12 }]}>
            <ActionCard
              icon="flame"
              label="Recovery"
              subtitle={days > 0 ? `${days} day${days === 1 ? '' : 's'} strong` : 'Start today'}
              color="#3A6EBF"
              tint="#E7F1FF"
              onPress={() =>
                (nav as any).navigate('MainTabs', { screen: 'Recovery' })
              }
            />
            <ActionCard
              icon="chatbubbles"
              label="Talk It Out"
              subtitle="Share your heart 💙"
              color="#5B9BE3"
              tint="#DCEBFB"
              onPress={() => nav.navigate('AI')}
            />
          </View>
        </Animated.View>

        {/* Verse Categories — horizontal scrolling chip cards */}
        <View style={{ marginTop: 28 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 14,
            }}
          >
            <Text
              style={[
                theme.typography.h2,
                { color: theme.colors.text, fontSize: 20 },
              ]}
            >
              Verses by category
            </Text>
            <Pressable
              onPress={() => nav.navigate('VerseCategories')}
              hitSlop={8}
            >
              <Text
                style={[
                  theme.typography.bodyBold,
                  { color: theme.colors.primary, fontSize: 13 },
                ]}
              >
                See all
              </Text>
            </Pressable>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 10 }}
          >
            <CategoryChip emoji="💪" label="Strength" tint="#FFE6D9" topicId="strength" />
            <CategoryChip emoji="😔" label="Anxiety" tint="#E6EEFE" topicId="anxiety" />
            <CategoryChip emoji="💔" label="Heartbreak" tint="#FFE2EC" topicId="heartbreak" />
            <CategoryChip emoji="✨" label="Hope" tint="#FFEFC9" topicId="hope" />
            <CategoryChip emoji="❤️‍🩹" label="Healing" tint="#E2F4ED" topicId="healing" />
            <CategoryChip emoji="🫂" label="Loneliness" tint="#E8E4F8" topicId="loneliness" />
            <CategoryChip emoji="🙏" label="Faith" tint="#DCEBFB" topicId="faith" />
            <CategoryChip emoji="☁️" label="Peace" tint="#E6F7EE" topicId="peace" />
          </ScrollView>
        </View>

        {/* Continue reading */}
        {lastRead && lastReadBook ? (
          <Pressable
            onPress={() =>
              nav.navigate('BibleReader', {
                bookId: lastRead.bookId,
                chapter: lastRead.chapter,
              })
            }
            style={{ marginTop: 22 }}
          >
            <View
              style={[
                styles.continueCard,
                {
                  backgroundColor: theme.colors.bgGlassStrong,
                  borderColor: theme.colors.borderStrong,
                },
                theme.shadow.softLight,
              ]}
            >
              <Ionicons name="play" size={24} color={theme.colors.primary} />
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    theme.typography.caption,
                    { color: theme.colors.primary, letterSpacing: 1.4 },
                  ]}
                >
                  CONTINUE READING
                </Text>
                <Text
                  style={[
                    theme.typography.bodyBold,
                    { color: theme.colors.text, marginTop: 4, fontSize: 17 },
                  ]}
                >
                  {lastReadBook.name} {lastRead.chapter}
                </Text>
                <View
                  style={[
                    styles.progressTrack,
                    { backgroundColor: theme.colors.border },
                  ]}
                >
                  <View
                    style={[
                      styles.progressFill,
                      {
                        backgroundColor: theme.colors.primary,
                        width: `${Math.min(100, Math.round((lastRead.chapter / lastReadBook.chapters) * 100))}%`,
                      },
                    ]}
                  />
                </View>
              </View>
            </View>
          </Pressable>
        ) : null}

        {/* Recent prayer / daily encouragement */}
        <View style={{ marginTop: 22 }}>
          {recentPrayer ? (
            <Pressable onPress={() => nav.navigate('SavedPrayers')}>
              <View
                style={[
                  styles.encouragementCard,
                  {
                    backgroundColor: theme.colors.bgGlassStrong,
                    borderColor: theme.colors.borderStrong,
                  },
                  theme.shadow.softLight,
                ]}
              >
                <Ionicons name="heart" size={22} color={theme.colors.primary} />
                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      theme.typography.caption,
                      { color: theme.colors.primary, letterSpacing: 1.4 },
                    ]}
                  >
                    YOUR RECENT PRAYER
                  </Text>
                  <Text
                    style={[
                      theme.typography.bodyBold,
                      { color: theme.colors.text, marginTop: 4, fontSize: 15 },
                    ]}
                    numberOfLines={1}
                  >
                    {recentPrayer.prompt}
                  </Text>
                  <Text
                    style={[
                      theme.typography.caption,
                      { color: theme.colors.textMuted, marginTop: 2 },
                    ]}
                    numberOfLines={2}
                  >
                    {recentPrayer.text.replace(/\n+/g, ' ').slice(0, 100)}…
                  </Text>
                </View>
              </View>
            </Pressable>
          ) : (
            <Pressable onPress={() => nav.navigate('Daily')}>
              <View
                style={[
                  styles.encouragementCard,
                  {
                    backgroundColor: theme.colors.bgGlassStrong,
                    borderColor: theme.colors.borderStrong,
                  },
                  theme.shadow.softLight,
                ]}
              >
                <Ionicons name="sunny" size={22} color={theme.colors.primary} />
                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      theme.typography.caption,
                      { color: theme.colors.primary, letterSpacing: 1.4 },
                    ]}
                  >
                    TODAY'S DEVOTIONAL
                  </Text>
                  <Text
                    style={[
                      theme.typography.bodyBold,
                      { color: theme.colors.text, marginTop: 4, fontSize: 15 },
                    ]}
                  >
                    Open today's reflection
                  </Text>
                  <Text
                    style={[
                      theme.typography.caption,
                      { color: theme.colors.textMuted, marginTop: 2 },
                    ]}
                    numberOfLines={2}
                  >
                    A verse, a question, a small challenge to carry with you.
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={theme.colors.textMuted} />
              </View>
            </Pressable>
          )}
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const CategoryChip = React.memo(function CategoryChip({
  emoji,
  label,
  tint,
  topicId,
}: {
  emoji: string;
  label: string;
  tint: string;
  topicId: string;
}) {
  const theme = useTheme();
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return (
    <PressableScale
      onPress={() => nav.navigate('VerseTopic', { topicId })}
      style={[
        styles.categoryChip,
        {
          backgroundColor: tint,
          borderColor: 'rgba(15,31,75,0.18)',
        },
        theme.shadow.softLight,
      ]}
    >
      <Text style={{ fontSize: 26 }}>{emoji}</Text>
      <Text
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.85}
        style={[
          theme.typography.bodyBold,
          {
            color: CARD_TITLE,
            marginTop: 8,
            fontSize: 14,
            textAlign: 'center',
            alignSelf: 'stretch',
          },
        ]}
      >
        {label}
      </Text>
    </PressableScale>
  );
});

const ActionCard = React.memo(function ActionCard({
  icon,
  label,
  subtitle,
  color,
  tint,
  size = 'md',
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  subtitle: string;
  color: string;
  tint: string;
  size?: 'tall' | 'md' | 'sm';
  onPress: () => void;
}) {
  const theme = useTheme();
  const height = size === 'tall' ? 184 : size === 'sm' ? 86 : 118;
  const horizontal = size === 'sm';

  return (
    <PressableScale
      onPress={onPress}
      style={[
        styles.actionCard,
        {
          backgroundColor: tint,
          height,
          flex: 1,
          flexDirection: horizontal ? 'row' : 'column',
          alignItems: horizontal ? 'center' : 'flex-start',
          gap: horizontal ? 12 : 0,
          padding: horizontal ? 14 : 16,
          borderColor: 'rgba(15,31,75,0.18)',
        },
        theme.shadow.softLight,
      ]}
    >
      <Ionicons
        name={icon}
        size={horizontal ? 22 : 26}
        color={color}
      />
      <View
        style={{
          flex: horizontal ? 1 : undefined,
          width: horizontal ? undefined : '100%',
          justifyContent: horizontal ? 'center' : 'flex-end',
          alignSelf: horizontal ? 'center' : 'auto',
          marginTop: horizontal ? 0 : 'auto',
        }}
      >
        <Text
          style={[
            theme.typography.bodyBold,
            {
              color: CARD_TITLE,
              fontSize: size === 'tall' ? 18 : horizontal ? 15 : 16,
            },
          ]}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.9}
        >
          {label}
        </Text>
        <Text
          style={[
            theme.typography.caption,
            {
              color: CARD_BODY,
              marginTop: 2,
              fontSize: 12,
              fontWeight: '500',
            },
          ]}
          numberOfLines={1}
        >
          {subtitle}
        </Text>
      </View>
    </PressableScale>
  );
});

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  welcomeText: {
    // Cormorant Garamond — editorial-luxury serif. Reads like the masthead
    // of a quiet morning paper, exactly the tone the greeting wants.
    fontFamily: 'CormorantGaramond_700Bold',
    fontSize: 38,
    letterSpacing: -0.5,
    marginTop: 4,
    lineHeight: 44,
  },
  avatarBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },
  verseHero: {
    borderRadius: 28,
    padding: 22,
    overflow: 'hidden',
  },
  heroCircle: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    borderRadius: 9999,
  },
  heroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  heroEyebrow: {
    // Cinzel — Roman-inscription serif. Lends gravitas to scripture labels.
    fontFamily: 'Cinzel_600SemiBold',
    color: 'rgba(255,255,255,0.94)',
    fontSize: 11,
    letterSpacing: 2.4,
    flex: 1,
  },
  heroVerse: {
    // Cormorant italic — reads like a missal page.
    fontFamily: 'CormorantGaramond_500Medium_Italic',
    color: '#FFFFFF',
    fontSize: 22,
    lineHeight: 32,
  },
  heroRef: {
    fontFamily: 'Cinzel_600SemiBold',
    color: 'rgba(255,255,255,0.92)',
    fontSize: 12.5,
    letterSpacing: 1.4,
    marginTop: 12,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionCard: {
    borderRadius: 22,
    borderWidth: StyleSheet.hairlineWidth,
    justifyContent: 'space-between',
  },
  continueCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    borderRadius: 22,
    borderWidth: StyleSheet.hairlineWidth,
  },
  progressTrack: {
    marginTop: 10,
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  encouragementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    borderRadius: 22,
    borderWidth: StyleSheet.hairlineWidth,
  },
  streakBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderRadius: 24,
    borderWidth: StyleSheet.hairlineWidth,
  },
  categoryChip: {
    width: 124,
    minHeight: 104,
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
