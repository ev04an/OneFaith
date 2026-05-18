import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { SoftCurves } from '../components/SoftCurves';
import { ScreenHeader } from '../components/ScreenHeader';
import { useTheme } from '../theme';
import { getBibleBook } from '../data/bibleBooks';
import { useBibleStore } from '../state/store';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'BibleBook'>;

export function BibleBookScreen(_props: Props) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const route = useRoute<Props['route']>();
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const book = getBibleBook(route.params.bookId);
  const bookmarks = useBibleStore((s) => s.bookmarks);
  const lastRead = useBibleStore((s) => s.lastRead);

  if (!book) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Book not found</Text>
      </View>
    );
  }

  const chapters = Array.from({ length: book.chapters }, (_, i) => i + 1);
  const bookmarkedChapters = new Set(
    bookmarks.filter((b) => b.bookId === book.id).map((b) => b.chapter),
  );

  const continueFromHere =
    lastRead?.bookId === book.id ? lastRead.chapter : null;

  return (
    <View style={{ flex: 1 }}>
      <SoftCurves />
      <ScreenHeader onBack={() => nav.goBack()} title={book.name} />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: theme.spacing.screen,
          paddingTop: 8,
          paddingBottom: insets.bottom + 40,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ marginTop: 6 }}>
          <Text
            style={[
              theme.typography.overline,
              { color: theme.colors.primary, letterSpacing: 2 },
            ]}
          >
            {book.testament === 'OT' ? 'OLD TESTAMENT' : 'NEW TESTAMENT'}
          </Text>
          <Text
            style={[
              theme.typography.hero,
              { color: theme.colors.text, marginTop: 4, fontSize: 36 },
            ]}
          >
            {book.name}
          </Text>
          <Text
            style={[
              theme.typography.body,
              { color: theme.colors.textMuted, marginTop: 6 },
            ]}
          >
            {book.chapters} chapter{book.chapters === 1 ? '' : 's'}
          </Text>
        </View>

        {continueFromHere ? (
          <Pressable
            onPress={() =>
              nav.navigate('BibleReader', { bookId: book.id, chapter: continueFromHere })
            }
            style={[
              styles.continueCard,
              { backgroundColor: theme.colors.primary },
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
                CONTINUE
              </Text>
              <Text
                style={{
                  color: '#FFFFFF',
                  fontSize: 18,
                  fontWeight: '700',
                  marginTop: 4,
                }}
              >
                {book.name} {continueFromHere}
              </Text>
            </View>
            <View style={styles.continueIcon}>
              <Ionicons name="play" size={18} color={theme.colors.primary} />
            </View>
          </Pressable>
        ) : null}

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
          SELECT CHAPTER
        </Text>

        <View style={styles.grid}>
          {chapters.map((c) => {
            const hasBookmark = bookmarkedChapters.has(c);
            const isLast = continueFromHere === c;
            return (
              <Pressable
                key={c}
                onPress={() =>
                  nav.navigate('VersePicker', { bookId: book.id, chapter: c })
                }
                style={[
                  styles.chip,
                  {
                    backgroundColor: isLast
                      ? theme.colors.primary
                      : theme.colors.bgGlassStrong,
                    borderColor: theme.colors.borderStrong,
                  },
                ]}
              >
                <Text
                  style={{
                    color: isLast ? '#FFFFFF' : theme.colors.text,
                    fontWeight: '700',
                    fontSize: 16,
                  }}
                >
                  {c}
                </Text>
                {hasBookmark ? (
                  <Ionicons
                    name="bookmark"
                    size={10}
                    color={isLast ? '#FFFFFF' : theme.colors.primary}
                    style={{ position: 'absolute', top: 6, right: 8 }}
                  />
                ) : null}
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  continueCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 18,
    borderRadius: 22,
    marginTop: 20,
    shadowColor: '#3A6EBF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.32,
    shadowRadius: 20,
    elevation: 6,
  },
  continueIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
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
    width: 64,
    height: 64,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },
});
