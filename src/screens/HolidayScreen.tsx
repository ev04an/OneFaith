import React, { useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '../theme';
import { HolidayParticles } from '../components/HolidayParticles';
import { GradientButton } from '../components/GradientButton';
import { getHolidayById } from '../data/holidays';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Holiday'>;

export function HolidayScreen(_props: Props) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const route = useRoute<Props['route']>();
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const holiday = getHolidayById(route.params.id);

  // Fade-in choreography.
  const introBanner = useSharedValue(0);
  const introTitle = useSharedValue(0);
  const introVerse = useSharedValue(0);
  const introCta = useSharedValue(0);

  useEffect(() => {
    introBanner.value = withTiming(1, { duration: 700, easing: Easing.out(Easing.cubic) });
    introTitle.value = withDelay(220, withTiming(1, { duration: 700, easing: Easing.out(Easing.cubic) }));
    introVerse.value = withDelay(520, withTiming(1, { duration: 700, easing: Easing.out(Easing.cubic) }));
    introCta.value = withDelay(900, withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) }));
  }, [introBanner, introTitle, introVerse, introCta]);

  const bannerStyle = useAnimatedStyle(() => ({
    opacity: introBanner.value,
    transform: [{ translateY: (1 - introBanner.value) * 14 }],
  }));
  const titleStyle = useAnimatedStyle(() => ({
    opacity: introTitle.value,
    transform: [{ translateY: (1 - introTitle.value) * 18 }],
  }));
  const verseStyle = useAnimatedStyle(() => ({
    opacity: introVerse.value,
    transform: [{ translateY: (1 - introVerse.value) * 20 }],
  }));
  const ctaStyle = useAnimatedStyle(() => ({
    opacity: introCta.value,
    transform: [{ translateY: (1 - introCta.value) * 18 }],
  }));

  if (!holiday) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.colors.bg, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={[theme.typography.body, { color: theme.colors.text }]}>
          Holiday not found.
        </Text>
        <Pressable onPress={() => nav.goBack()} style={{ marginTop: 14 }}>
          <Text style={[theme.typography.bodyBold, { color: theme.colors.primary }]}>Close</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={holiday.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <HolidayParticles variant={holiday.particles} color={holiday.accent} />

      {/* Bottom darkening for text readability */}
      <LinearGradient
        pointerEvents="none"
        colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.45)']}
        start={{ x: 0.5, y: 0.3 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <Pressable
        onPress={() => nav.goBack()}
        hitSlop={12}
        style={[styles.close, { top: insets.top + 14 }]}
      >
        <Ionicons name="close" size={22} color="#fff" />
      </Pressable>

      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingTop: insets.top + 70,
          paddingBottom: insets.bottom + 30,
          paddingHorizontal: 28,
          justifyContent: 'center',
        }}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.eyebrowWrap, bannerStyle]}>
          <Ionicons name={holiday.icon as any} size={28} color="#fff" />
          <Text style={[styles.eyebrow]}>
            {holiday.name.toUpperCase()}
          </Text>
        </Animated.View>

        <Animated.View style={titleStyle}>
          <Text style={styles.greeting}>{holiday.greeting}</Text>
          <Text style={styles.message}>{holiday.message}</Text>
        </Animated.View>

        <Animated.View
          style={[
            styles.verseCard,
            { borderColor: 'rgba(255,255,255,0.32)' },
            verseStyle,
          ]}
        >
          <View
            pointerEvents="none"
            style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(255,255,255,0.10)' }]}
          />
          <Text style={[styles.verseRef]}>{holiday.verse.reference}</Text>
          <Text style={styles.verseText}>“{holiday.verse.text}”</Text>
        </Animated.View>

        <Animated.View style={[{ marginTop: 32 }, ctaStyle]}>
          <GradientButton
            label="Continue"
            full
            size="lg"
            gradient="primary"
            onPress={() => nav.goBack()}
          />
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  close: {
    position: 'absolute',
    right: 18,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.32)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.30)',
    zIndex: 10,
  },
  eyebrowWrap: {
    alignItems: 'center',
    gap: 14,
  },
  eyebrow: {
    color: '#FFFFFF',
    opacity: 0.9,
    letterSpacing: 2.4,
    fontSize: 11,
    fontWeight: '800',
  },
  greeting: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 40,
    lineHeight: 46,
    fontWeight: '700',
    marginTop: 22,
    letterSpacing: -0.5,
  },
  message: {
    color: 'rgba(255,255,255,0.94)',
    textAlign: 'center',
    fontSize: 16.5,
    lineHeight: 25,
    marginTop: 18,
    fontWeight: '500',
  },
  verseCard: {
    marginTop: 32,
    padding: 22,
    borderRadius: 22,
    borderWidth: 1,
    overflow: 'hidden',
  },
  verseRef: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.8,
    textTransform: 'uppercase',
  },
  verseText: {
    color: '#FFFFFF',
    fontSize: 18,
    lineHeight: 28,
    marginTop: 10,
    fontWeight: '500',
    fontStyle: 'italic',
  },
});
