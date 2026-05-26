import React, { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { ScreenHeader } from '../components/ScreenHeader';
import { GlassCard } from '../components/GlassCard';
import { OrnamentDivider } from '../components/OrnamentDivider';
import { useTheme } from '../theme';
import {
  BIBLE_BOOKS,
  NEW_TESTAMENT,
  OLD_TESTAMENT,
  getBibleBook,
} from '../data/bibleBooks';
import { searchBible, type SearchHit } from '../data/bible';
import { useBibleStore } from '../state/store';
import type { RootStackParamList } from '../navigation/types';

export function BibleScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [tab, setTab] = useState<'books' | 'search' | 'bookmarks'>('books');
  const [query, setQuery] = useState('');
  const lastRead = useBibleStore((s) => s.lastRead);
  const recents = useBibleStore((s) => s.recents);
  const bookmarks = useBibleStore((s) => s.bookmarks);

  const searchResults = useMemo<SearchHit[]>(() => {
    if (tab !== 'search' || query.trim().length < 3) return [];
    return searchBible(query, 60);
  }, [tab, query]);

  const goToBook = (bookId: string) => {
    nav.navigate('BibleBook', { bookId });
  };

  const goToChapter = (bookId: string, chapter: number, verse?: number) => {
    nav.navigate('BibleReader', { bookId, chapter, verse });
  };

  return (
    <View style={{ flex: 1 }}>
      <AnimatedBackground variant="primary" intensity={0.55} />
      <ScreenHeader
        title="Bible"
        large
        subtitle="WEB · WORLD ENGLISH BIBLE"
      />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: theme.spacing.screen,
          paddingTop: 14,
          // 78 floating tab bar + ~18 bottom inset + breathing room — last row
          // should not sit under the tab bar's frosted shelf.
          paddingBottom: insets.bottom + 180,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Continue reading */}
        {lastRead ? (
          <Pressable onPress={() => goToChapter(lastRead.bookId, lastRead.chapter)}>
            <GlassCard padded={18} glow>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="book" size={24} color={theme.colors.primary} />
                <View style={{ flex: 1, marginLeft: 14 }}>
                  <Text
                    style={[
                      theme.typography.caption,
                      { color: theme.colors.textMuted },
                    ]}
                  >
                    CONTINUE READING
                  </Text>
                  <Text
                    style={[theme.typography.h2, { color: theme.colors.text, marginTop: 2 }]}
                  >
                    {getBibleBook(lastRead.bookId)?.name ?? '—'} {lastRead.chapter}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={theme.colors.textFaint} />
              </View>
            </GlassCard>
          </Pressable>
        ) : null}

        {/* Verses by category shortcut */}
        <Pressable
          onPress={() => nav.navigate('VerseCategories')}
          style={{ marginTop: 18 }}
        >
          <GlassCard padded={18}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="apps" size={24} color={theme.colors.primary} />
              <View style={{ flex: 1, marginLeft: 14 }}>
                <Text style={[theme.typography.bodyBold, { color: theme.colors.text }]}>
                  Verses by Category
                </Text>
                <Text
                  style={[
                    theme.typography.caption,
                    { color: theme.colors.textMuted, marginTop: 2 },
                  ]}
                >
                  Strength · Hope · Healing · Peace · 15+ more
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={theme.colors.textFaint} />
            </View>
          </GlassCard>
        </Pressable>

        {/* Tab bar */}
        <View style={[styles.tabBar, { marginTop: 18 }]}>
          {(['books', 'search', 'bookmarks'] as const).map((id) => {
            const active = tab === id;
            return (
              <Pressable
                key={id}
                onPress={() => setTab(id)}
                style={[
                  styles.tab,
                  {
                    backgroundColor: active
                      ? theme.colors.primary
                      : theme.colors.bgGlass,
                    borderColor: theme.colors.borderStrong,
                  },
                ]}
              >
                <Text
                  style={{
                    color: active ? '#fff' : theme.colors.text,
                    fontWeight: '700',
                    fontSize: 13,
                    letterSpacing: 0.4,
                  }}
                >
                  {id === 'books' ? 'Books' : id === 'search' ? 'Search' : 'Bookmarks'}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {tab === 'books' ? (
          <View style={{ marginTop: 18 }}>
            <Text
              style={[
                theme.typography.overline,
                { color: theme.colors.text, opacity: 0.78, marginBottom: 10 },
              ]}
            >
              OLD TESTAMENT
            </Text>
            <BookGrid books={OLD_TESTAMENT} onPick={goToBook} />

            {/* Cross ornament marks the seam where the Old Covenant meets
                the New — the most meaningful "passage break" in this screen. */}
            <OrnamentDivider variant="cross" spacing={22} />

            <Text
              style={[
                theme.typography.overline,
                { color: theme.colors.text, opacity: 0.78, marginBottom: 10 },
              ]}
            >
              NEW TESTAMENT
            </Text>
            <BookGrid books={NEW_TESTAMENT} onPick={goToBook} />

            {recents.length ? (
              <View style={{ marginTop: 24 }}>
                <Text
                  style={[
                    theme.typography.overline,
                    { color: theme.colors.text, opacity: 0.78, marginBottom: 10 },
                  ]}
                >
                  RECENTLY VIEWED
                </Text>
                <View style={{ gap: 8 }}>
                  {recents.slice(0, 6).map((r) => (
                    <Pressable
                      key={`${r.bookId}-${r.chapter}-${r.ts}`}
                      onPress={() => goToChapter(r.bookId, r.chapter)}
                    >
                      <GlassCard padded={false}>
                        <View style={styles.rowItem}>
                          <Ionicons
                            name="time-outline"
                            size={18}
                            color={theme.colors.text}
                            style={{ opacity: 0.8 }}
                          />
                          <Text
                            style={[
                              theme.typography.bodyBold,
                              { color: theme.colors.text, flex: 1 },
                            ]}
                          >
                            {getBibleBook(r.bookId)?.name ?? '—'} {r.chapter}
                          </Text>
                          <Ionicons
                            name="chevron-forward"
                            size={18}
                            color={theme.colors.text}
                            style={{ opacity: 0.6 }}
                          />
                        </View>
                      </GlassCard>
                    </Pressable>
                  ))}
                </View>
              </View>
            ) : null}
          </View>
        ) : null}

        {tab === 'search' ? (
          <View style={{ marginTop: 18 }}>
            <View
              style={[
                styles.searchWrap,
                {
                  backgroundColor: theme.colors.inputBg,
                  borderColor: theme.colors.inputBorder,
                },
              ]}
            >
              <Ionicons name="search" size={18} color={theme.colors.inputPlaceholder} />
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Search the Bible…"
                placeholderTextColor={theme.colors.inputPlaceholder}
                selectionColor={theme.colors.primary}
                cursorColor={theme.colors.inputCaret}
                underlineColorAndroid="transparent"
                style={[
                  theme.typography.body,
                  { color: theme.colors.inputText, flex: 1, padding: 0, fontSize: 15 },
                ]}
                autoCorrect={false}
                autoCapitalize="none"
              />
              {query ? (
                <Pressable onPress={() => setQuery('')} hitSlop={10}>
                  <Ionicons name="close-circle" size={18} color={theme.colors.text} style={{ opacity: 0.55 }} />
                </Pressable>
              ) : null}
            </View>
            {query.trim().length < 3 ? (
              <Text
                style={[
                  theme.typography.caption,
                  {
                    color: theme.colors.text,
                    opacity: 0.7,
                    textAlign: 'center',
                    marginTop: 16,
                  },
                ]}
              >
                Type at least 3 characters.
              </Text>
            ) : searchResults.length === 0 ? (
              <Text
                style={[
                  theme.typography.caption,
                  {
                    color: theme.colors.text,
                    opacity: 0.7,
                    textAlign: 'center',
                    marginTop: 16,
                  },
                ]}
              >
                No matches.
              </Text>
            ) : (
              <View style={{ marginTop: 14, gap: 8 }}>
                {searchResults.map((h, i) => (
                  <Pressable
                    key={`${h.bookId}-${h.chapter}-${h.verse}-${i}`}
                    onPress={() => goToChapter(h.bookId, h.chapter, h.verse)}
                  >
                    <GlassCard padded={14}>
                      <Text
                        style={[
                          theme.typography.caption,
                          { color: theme.colors.text, opacity: 0.78 },
                        ]}
                      >
                        {h.bookName.toUpperCase()} {h.chapter}:{h.verse}
                      </Text>
                      <Text
                        style={[
                          theme.typography.body,
                          { color: theme.colors.text, marginTop: 4, fontSize: 14.5, lineHeight: 22 },
                        ]}
                        numberOfLines={3}
                      >
                        {h.text}
                      </Text>
                    </GlassCard>
                  </Pressable>
                ))}
              </View>
            )}
          </View>
        ) : null}

        {tab === 'bookmarks' ? (
          <View style={{ marginTop: 18 }}>
            {bookmarks.length === 0 ? (
              <Text
                style={[
                  theme.typography.caption,
                  {
                    color: theme.colors.text,
                    opacity: 0.7,
                    textAlign: 'center',
                    marginTop: 20,
                  },
                ]}
              >
                No bookmarks yet. Tap a verse while reading to save it.
              </Text>
            ) : (
              <View style={{ gap: 8 }}>
                {bookmarks.map((b) => (
                  <Pressable
                    key={b.id}
                    onPress={() => goToChapter(b.bookId, b.chapter, b.verse)}
                  >
                    <GlassCard padded={14}>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Ionicons
                          name="bookmark"
                          size={18}
                          color={theme.colors.primary}
                        />
                        <Text
                          style={[
                            theme.typography.bodyBold,
                            { color: theme.colors.text, marginLeft: 10, flex: 1 },
                          ]}
                        >
                          {getBibleBook(b.bookId)?.name} {b.chapter}
                          {b.verse ? `:${b.verse}` : ''}
                        </Text>
                        <Ionicons
                          name="chevron-forward"
                          size={16}
                          color={theme.colors.text}
                          style={{ opacity: 0.6 }}
                        />
                      </View>
                      {b.label ? (
                        <Text
                          style={[
                            theme.typography.caption,
                            { color: theme.colors.text, opacity: 0.78, marginTop: 4 },
                          ]}
                        >
                          {b.label}
                        </Text>
                      ) : null}
                    </GlassCard>
                  </Pressable>
                ))}
              </View>
            )}
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}

function BookGrid({
  books,
  onPick,
}: {
  books: typeof BIBLE_BOOKS;
  onPick: (id: string) => void;
}) {
  const { width: screenWidth } = useWindowDimensions();
  const cellWidth = Math.floor((screenWidth - 20 * 2 - 10 * 2) / 3);
  return (
    <View style={styles.grid}>
      {books.map((b) => (
        <BookCell key={b.id} book={b} cellWidth={cellWidth} onPick={onPick} />
      ))}
    </View>
  );
}

// Memoized so each of the 66 book cells only re-renders when its own props
// change — prevents scroll-time re-renders of unrelated cells.
const BookCell = React.memo(function BookCell({
  book,
  cellWidth,
  onPick,
}: {
  book: typeof BIBLE_BOOKS[number];
  cellWidth: number;
  onPick: (id: string) => void;
}) {
  const theme = useTheme();
  return (
    <Pressable
      onPress={() => onPick(book.id)}
      style={[
        styles.bookCell,
        {
          width: cellWidth,
          backgroundColor: theme.colors.bgGlass,
          borderColor: theme.colors.borderStrong,
        },
      ]}
    >
      <Text
        numberOfLines={2}
        style={{
          // Cinzel for biblical book names — Roman-inscription gravitas.
          fontFamily: 'Cinzel_600SemiBold',
          color: theme.colors.text,
          fontSize: 13,
          letterSpacing: 0.6,
          textAlign: 'center',
        }}
      >
        {book.name}
      </Text>
      <Text
        style={{
          fontFamily: 'Inter_500Medium',
          color: theme.colors.text,
          opacity: 0.65,
          fontSize: 11,
          marginTop: 4,
          letterSpacing: 0.8,
        }}
      >
        {book.chapters} ch
      </Text>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  tabBar: { flexDirection: 'row', gap: 8 },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  bookCell: {
    // width is set dynamically in BookGrid via useWindowDimensions for
    // pixel-perfect 3-column layout that also reflows on rotation.
    minHeight: 90,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 12,
    borderWidth: StyleSheet.hairlineWidth,
  },
  rowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
  },
});
