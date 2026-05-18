import React, { useMemo } from 'react';
import { Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { SoftCurves } from '../components/SoftCurves';
import { ScreenHeader } from '../components/ScreenHeader';
import { useTheme } from '../theme';
import { getVersesForTopic, type Verse } from '../data/verses';
import { getTopicMeta, type Topic } from '../data/topics';
import { useFavoritesStore } from '../state/store';
import type { RootStackParamList } from '../navigation/types';
import * as haptics from '../utils/haptics';

type Props = NativeStackScreenProps<RootStackParamList, 'VerseTopic'>;

export function VerseTopicScreen(_props: Props) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const route = useRoute<Props['route']>();
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const topic = getTopicMeta(route.params.topicId as Topic);
  const verses = useMemo(() => getVersesForTopic(topic.id), [topic.id]);
  const verseFavs = useFavoritesStore((s) => s.verses);
  const toggleVerseFav = useFavoritesStore((s) => s.toggleVerse);

  const onShare = async (v: Verse) => {
    haptics.tap();
    try {
      await Share.share({
        message: `"${v.text}"\n— ${v.reference}`,
      });
    } catch {}
  };

  return (
    <View style={{ flex: 1 }}>
      <SoftCurves />
      <ScreenHeader
        onBack={() => nav.goBack()}
        title={topic.label}
        large
        subtitle={topic.hook.toUpperCase()}
      />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: theme.spacing.screen,
          paddingTop: 14,
          paddingBottom: insets.bottom + 40,
        }}
        showsVerticalScrollIndicator={false}
      >
        {verses.length === 0 ? (
          <Text
            style={[
              theme.typography.body,
              {
                color: theme.colors.text,
                opacity: 0.85,
                textAlign: 'center',
                marginTop: 28,
              },
            ]}
          >
            No verses tagged for this topic yet.
          </Text>
        ) : null}

        <View style={{ gap: 14 }}>
          {verses.map((v) => {
            const saved = verseFavs.includes(v.id);
            return (
              <View
                key={v.id}
                style={[
                  styles.card,
                  {
                    backgroundColor: theme.colors.bgGlassStrong,
                    borderColor: theme.colors.borderStrong,
                  },
                  theme.shadow.softLight,
                ]}
              >
                <Pressable onPress={() => nav.navigate('VerseDetail', { verseId: v.id })}>
                  <View style={styles.headerRow}>
                    <View
                      style={[
                        styles.refPill,
                        { backgroundColor: theme.colors.primary },
                      ]}
                    >
                      <Ionicons name="book" size={11} color="#FFFFFF" />
                      <Text style={styles.refText}>{v.reference}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', gap: 4 }}>
                      <Pressable
                        onPress={() => {
                          haptics.select();
                          toggleVerseFav(v.id);
                        }}
                        hitSlop={8}
                        style={styles.actionBtn}
                      >
                        <Ionicons
                          name={saved ? 'bookmark' : 'bookmark-outline'}
                          size={18}
                          color={saved ? theme.colors.primary : theme.colors.text}
                        />
                      </Pressable>
                      <Pressable
                        onPress={() => onShare(v)}
                        hitSlop={8}
                        style={styles.actionBtn}
                      >
                        <Ionicons
                          name="share-outline"
                          size={18}
                          color={theme.colors.text}
                        />
                      </Pressable>
                    </View>
                  </View>
                  <Text
                    style={[
                      styles.verseText,
                      { color: theme.colors.text },
                    ]}
                  >
                    "{v.text}"
                  </Text>
                  {v.reflection ? (
                    <Text
                      style={[
                        styles.reflection,
                        { color: theme.colors.textMuted },
                      ]}
                    >
                      {v.reflection}
                    </Text>
                  ) : null}
                </Pressable>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 18,
    borderRadius: 22,
    borderWidth: StyleSheet.hairlineWidth,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  refPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 999,
  },
  refText: {
    color: '#FFFFFF',
    fontSize: 11.5,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  actionBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verseText: {
    marginTop: 12,
    fontSize: 17,
    lineHeight: 27,
    fontWeight: '500',
  },
  reflection: {
    marginTop: 12,
    fontSize: 14,
    lineHeight: 22,
    fontStyle: 'italic',
  },
});
