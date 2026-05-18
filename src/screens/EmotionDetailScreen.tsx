import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { ScreenHeader } from '../components/ScreenHeader';
import { VerseCard } from '../components/VerseCard';
import { GlassCard } from '../components/GlassCard';
import { GradientButton } from '../components/GradientButton';
import { useTheme } from '../theme';
import { getEmotion } from '../data/emotions';
import { getVersesForEmotion } from '../data/verses';
import type { RootStackParamList } from '../navigation/types';

export function EmotionDetailScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'EmotionDetail'>>();
  const emotion = getEmotion(route.params.emotionId);
  const verses = useMemo(() => getVersesForEmotion(emotion.id), [emotion.id]);

  return (
    <View style={{ flex: 1 }}>
      <AnimatedBackground variant={emotion.gradient} />
      <ScreenHeader onBack={() => nav.goBack()} />
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: insets.bottom + 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <Ionicons name={emotion.icon as any} size={56} color={theme.colors.text} />
          <Text style={[theme.typography.overline, { color: theme.colors.textFaint, marginTop: 16 }]}>
            YOU’RE FEELING
          </Text>
          <Text style={[theme.typography.display, { color: theme.colors.text, marginTop: 4 }]}>
            {emotion.label}
          </Text>
          <Text style={[theme.typography.body, { color: theme.colors.textMuted, marginTop: 10, textAlign: 'center', maxWidth: 320 }]}>
            {emotion.blurb}. Take a slow breath. Read what He has to say.
          </Text>
        </View>

        <GlassCard style={{ marginTop: 18 }}>
          <Text style={[theme.typography.caption, { color: theme.colors.textFaint, letterSpacing: 1.4 }]}>
            A NOTE BEFORE YOU READ
          </Text>
          <Text style={[theme.typography.body, { color: theme.colors.text, marginTop: 6, fontSize: 15, lineHeight: 22 }]}>
            What you feel is real, and it is not the whole truth. Let these verses sit on top of what you’re feeling — not erase it, just hold it.
          </Text>
        </GlassCard>

        <Text
          style={[
            theme.typography.h2,
            { color: theme.colors.text, marginTop: 26, marginBottom: 12 },
          ]}
        >
          Verses for you
        </Text>

        <View style={{ gap: 14 }}>
          {verses.map((v) => (
            <VerseCard
              key={v.id}
              verse={v}
              gradient={emotion.gradient}
              compact
              onPress={() => nav.navigate('VerseDetail', { verseId: v.id })}
            />
          ))}
        </View>

        <View style={{ marginTop: 22 }}>
          <GradientButton
            label="Talk to AI Companion"
            icon="chatbubbles-outline"
            gradient="primary"
            full
            size="lg"
            glow
            onPress={() => nav.navigate('AI')}
          />
        </View>

        <View style={{ marginTop: 12 }}>
          <GradientButton
            label="Browse Prayers"
            icon="leaf-outline"
            variant="glass"
            full
            onPress={() => nav.navigate('Prayers' as any)}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center', marginTop: 8 },
});
