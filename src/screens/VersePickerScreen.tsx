import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import type {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { SoftCurves } from '../components/SoftCurves';
import { ScreenHeader } from '../components/ScreenHeader';
import { useTheme } from '../theme';
import { getBibleBook } from '../data/bibleBooks';
import { getChapter, getNextChapter, getPreviousChapter } from '../data/bible';
import { useBibleStore } from '../state/store';
import type { RootStackParamList } from '../navigation/types';
import * as haptics from '../utils/haptics';

type Props = NativeStackScreenProps<RootStackParamList, 'VersePicker'>;

export function VersePickerScreen(_props: Props) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const route = useRoute<Props['route']>();
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const { bookId, chapter } = route.params;
  const book = getBibleBook(bookId);
  const verses = getChapter(bookId, chapter) ?? [];
  const bookmarks = useBibleStore((s) => s.bookmarks);
  const lastRead = useBibleStore((s) => s.lastRead);

  const bookmarkedVerses = new Set(
    bookmarks
      .filter((b) => b.bookId === bookId && b.chapter === chapter && b.verse)
      .map((b) => b.verse as number),
  );

  if (!book) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Book not found</Text>
      </View>
    );
  }

  const prev = getPreviousChapter(bookId, chapter);
  const next = getNextChapter(bookId, chapter);

  const goToVerse = (verse: number) => {
    haptics.select();
    nav.navigate('BibleReader', { bookId, chapter, verse });
  };

  const readWholeChapter = () => {
    haptics.select();
    nav.navigate('BibleReader', { bookId, chapter });
  };

  return (
    <View style={{ flex: 1 }}>
      <SoftCurves />
      <ScreenHeader
        onBack={() => nav.goBack()}
        title={`${book.name} ${chapter}`}
      />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: theme.spacing.screen,
          paddingTop: 8,
          paddingBottom: insets.bottom + 40,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Text
          style={[
            theme.typography.overline,
            { color: theme.colors.primary, letterSpacing: 2 },
          ]}
        >
          CHAPTER {chapter}
        </Text>
        <Text
          style={[
            theme.typography.hero,
            { color: theme.colors.text, marginTop: 4, fontSize: 32 },
          ]}
        >
          {book.name} {chapter}
        </Text>
        <Text
          style={[
            theme.typography.body,
            { color: theme.colors.textMuted, marginTop: 6 },
          ]}
        >
          {verses.length} verse{verses.length === 1 ? '' : 's'}
        </Text>

        {/* Read whole chapter CTA */}
        <Pressable
          onPress={readWholeChapter}
          style={[
            styles.readAllCard,
            { backgroundColor: theme.colors.primary },
            theme.shadow.soft,
          ]}
        >
          <View style={{ flex: 1 }}>
            <Text
              style={{
                color: '#FFFFFF',
                fontSize: 11,
                fontWeight: '700',
                letterSpacing: 1.6,
                opacity: 0.9,
              }}
            >
              READ CHAPTER
            </Text>
            <Text
              style={{
                color: '#FFFFFF',
                fontSize: 17,
                fontWeight: '700',
                marginTop: 4,
              }}
            >
              Start from verse 1
            </Text>
          </View>
          <View style={styles.readAllIcon}>
            <Ionicons name="play" size={18} color={theme.colors.primary} />
          </View>
        </Pressable>

        <Text
          style={[
            theme.typography.overline,
            {
              color: theme.colors.text,
              opacity: 0.85,
              marginTop: 28,
              marginBottom: 12,
            },
          ]}
        >
          OR JUMP TO A VERSE
        </Text>

        <View style={styles.grid}>
          {verses.map((_, i) => {
            const v = i + 1;
            const hasBookmark = bookmarkedVerses.has(v);
            return (
              <Pressable
                key={v}
                onPress={() => goToVerse(v)}
                style={[
                  styles.chip,
                  {
                    backgroundColor: theme.colors.bgGlassStrong,
                    borderColor: theme.colors.borderStrong,
                  },
                ]}
              >
                <Text
                  style={{
                    color: theme.colors.text,
                    fontWeight: '700',
                    fontSize: 15,
                  }}
                >
                  {v}
                </Text>
                {hasBookmark ? (
                  <Ionicons
                    name="bookmark"
                    size={10}
                    color={theme.colors.primary}
                    style={{ position: 'absolute', top: 6, right: 8 }}
                  />
                ) : null}
              </Pressable>
            );
          })}
        </View>

        {/* Chapter navigation */}
        <View style={styles.navRow}>
          <Pressable
            onPress={() =>
              prev && nav.replace('VersePicker', prev)
            }
            disabled={!prev}
            style={[
              styles.navBtn,
              {
                backgroundColor: theme.colors.bgGlass,
                borderColor: theme.colors.borderStrong,
                opacity: prev ? 1 : 0.4,
              },
            ]}
          >
            <Ionicons name="chevron-back" size={18} color={theme.colors.text} />
            <Text style={[theme.typography.bodyBold, { color: theme.colors.text }]}>
              {prev ? `${getBibleBook(prev.bookId)?.abbrev} ${prev.chapter}` : '—'}
            </Text>
          </Pressable>
          <Pressable
            onPress={() =>
              next && nav.replace('VersePicker', next)
            }
            disabled={!next}
            style={[
              styles.navBtn,
              {
                backgroundColor: theme.colors.bgGlass,
                borderColor: theme.colors.borderStrong,
                opacity: next ? 1 : 0.4,
                justifyContent: 'flex-end',
              },
            ]}
          >
            <Text style={[theme.typography.bodyBold, { color: theme.colors.text }]}>
              {next ? `${getBibleBook(next.bookId)?.abbrev} ${next.chapter}` : '—'}
            </Text>
            <Ionicons name="chevron-forward" size={18} color={theme.colors.text} />
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  readAllCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 18,
    borderRadius: 22,
    marginTop: 20,
  },
  readAllIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    width: 60,
    height: 60,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },
  navRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 24,
  },
  navBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
  },
});
