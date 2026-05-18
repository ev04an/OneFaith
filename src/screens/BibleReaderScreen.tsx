import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { ScreenHeader } from '../components/ScreenHeader';
import { GlassCard } from '../components/GlassCard';
import { GradientButton } from '../components/GradientButton';
import { PilgrimLoader } from '../components/PilgrimLoader';
import { useTheme } from '../theme';
import {
  getChapter,
  getNextChapter,
  getPreviousChapter,
  BIBLE_TRANSLATION,
} from '../data/bible';
import { getBibleBook } from '../data/bibleBooks';
import { useBibleStore, type BibleHighlight } from '../state/store';
import type { RootStackParamList } from '../navigation/types';
import * as haptics from '../utils/haptics';

type Props = NativeStackScreenProps<RootStackParamList, 'BibleReader'>;

const loaderStyles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 60,
  },
});

const HIGHLIGHT_COLORS: { id: BibleHighlight['color']; bg: string; ring: string }[] = [
  { id: 'gold', bg: 'rgba(245,213,138,0.32)', ring: '#F5D58A' },
  { id: 'pink', bg: 'rgba(255,143,177,0.32)', ring: '#FF8FB1' },
  { id: 'mint', bg: 'rgba(122,231,199,0.32)', ring: '#7AE7C7' },
  { id: 'sky', bg: 'rgba(90,184,232,0.32)', ring: '#5AB8E8' },
];

export function BibleReaderScreen(_props: Props) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const route = useRoute<Props['route']>();
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { bookId, chapter, verse } = route.params;
  const book = getBibleBook(bookId);
  const verses = useMemo(() => getChapter(bookId, chapter) ?? [], [bookId, chapter]);

  const scrollRef = useRef<ScrollView>(null);
  const verseLayouts = useRef<Record<number, number>>({});

  const setLastRead = useBibleStore((s) => s.setLastRead);
  const pushRecent = useBibleStore((s) => s.pushRecent);
  const toggleHighlight = useBibleStore((s) => s.toggleHighlight);
  const toggleBookmark = useBibleStore((s) => s.toggleBookmark);
  const upsertNote = useBibleStore((s) => s.upsertNote);
  const highlights = useBibleStore((s) => s.highlights);
  const notes = useBibleStore((s) => s.notes);
  const bookmarks = useBibleStore((s) => s.bookmarks);

  const [selectedVerse, setSelectedVerse] = useState<number | null>(null);
  const [showNote, setShowNote] = useState(false);
  const [noteDraft, setNoteDraft] = useState('');

  // Brief loading state on chapter entry / switch so the PilgrimLoader has a
  // chance to be seen. Resets when the user navigates to a different chapter.
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setIsLoading(true);
    const t = setTimeout(() => setIsLoading(false), 550);
    return () => clearTimeout(t);
  }, [bookId, chapter]);

  useEffect(() => {
    setLastRead(bookId, chapter);
    pushRecent(bookId, chapter);
  }, [bookId, chapter, setLastRead, pushRecent]);

  // Scroll to a specific verse if requested.
  useEffect(() => {
    if (!verse) return;
    const t = setTimeout(() => {
      const y = verseLayouts.current[verse];
      if (y != null) scrollRef.current?.scrollTo({ y: Math.max(0, y - 80), animated: true });
    }, 220);
    return () => clearTimeout(t);
  }, [verse, verses]);

  const goTo = (target: { bookId: string; chapter: number } | null) => {
    if (!target) return;
    haptics.select();
    nav.replace('BibleReader', target);
  };

  const onLongPressVerse = (v: number) => {
    haptics.tap();
    setSelectedVerse(v);
  };

  const onSetHighlight = (color: BibleHighlight['color']) => {
    if (selectedVerse == null) return;
    toggleHighlight(bookId, chapter, selectedVerse, color);
    setSelectedVerse(null);
  };

  const onAddBookmark = () => {
    if (selectedVerse == null) return;
    toggleBookmark(bookId, chapter, selectedVerse);
    setSelectedVerse(null);
  };

  const onShareVerse = async () => {
    if (selectedVerse == null) return;
    const t = verses[selectedVerse - 1];
    try {
      await Share.share({
        message: `“${t}”\n— ${book?.name ?? bookId} ${chapter}:${selectedVerse} (${BIBLE_TRANSLATION})`,
      });
    } catch {}
    setSelectedVerse(null);
  };

  const onOpenNote = () => {
    if (selectedVerse == null) return;
    const key = `${bookId}-${chapter}-${selectedVerse}`;
    const existing = notes.find((n) => n.id === key);
    setNoteDraft(existing?.note ?? '');
    setShowNote(true);
  };

  const onSaveNote = () => {
    if (selectedVerse == null) return;
    upsertNote(bookId, chapter, selectedVerse, noteDraft);
    setShowNote(false);
    setSelectedVerse(null);
  };

  const prev = getPreviousChapter(bookId, chapter);
  const next = getNextChapter(bookId, chapter);

  const highlightMap = useMemo(() => {
    const m = new Map<number, BibleHighlight['color']>();
    for (const h of highlights) {
      if (h.bookId === bookId && h.chapter === chapter) m.set(h.verse, h.color);
    }
    return m;
  }, [highlights, bookId, chapter]);

  const bookmarkSet = useMemo(() => {
    const s = new Set<number>();
    for (const b of bookmarks) {
      if (b.bookId === bookId && b.chapter === chapter && b.verse) s.add(b.verse);
    }
    return s;
  }, [bookmarks, bookId, chapter]);

  const noteSet = useMemo(() => {
    const s = new Set<number>();
    for (const n of notes) {
      if (n.bookId === bookId && n.chapter === chapter) s.add(n.verse);
    }
    return s;
  }, [notes, bookId, chapter]);

  if (!book) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Book not found</Text>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={{ flex: 1 }}>
        <AnimatedBackground variant="primary" intensity={0.5} />
        <ScreenHeader
          onBack={() => nav.goBack()}
          title={`${book.name} ${chapter}`}
        />
        <View style={loaderStyles.center}>
          <PilgrimLoader size={88} color={theme.colors.text} />
          <Text
            style={[
              theme.typography.caption,
              {
                color: theme.colors.textMuted,
                marginTop: 22,
                letterSpacing: 1.2,
              },
            ]}
          >
            OPENING {book.name.toUpperCase()} {chapter}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <AnimatedBackground variant="primary" intensity={0.5} />
      <ScreenHeader
        onBack={() => nav.goBack()}
        title={`${book.name} ${chapter}`}
      />
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={{
          paddingHorizontal: theme.spacing.screen,
          paddingTop: 8,
          paddingBottom: insets.bottom + 120,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Text
          style={[
            theme.typography.overline,
            { color: theme.colors.text, opacity: 0.78, marginBottom: 4 },
          ]}
        >
          {BIBLE_TRANSLATION} · CHAPTER {chapter}
        </Text>

        <GlassCard padded={20} strong>
          {verses.map((v, i) => {
            const num = i + 1;
            const isHighlighted = highlightMap.has(num);
            const hColor = isHighlighted ? highlightMap.get(num)! : null;
            const hStyle = hColor ? HIGHLIGHT_COLORS.find((c) => c.id === hColor) : null;
            return (
              <Pressable
                key={num}
                onPress={() => setSelectedVerse(num === selectedVerse ? null : num)}
                onLongPress={() => onLongPressVerse(num)}
                onLayout={(e) => {
                  verseLayouts.current[num] = e.nativeEvent.layout.y;
                }}
                style={[
                  styles.verseRow,
                  hStyle && { backgroundColor: hStyle.bg, borderRadius: 6 },
                  selectedVerse === num && {
                    backgroundColor: theme.isDark
                      ? 'rgba(201,182,255,0.18)'
                      : 'rgba(90,63,224,0.10)',
                    borderRadius: 6,
                  },
                ]}
              >
                <Text style={[theme.typography.verse, { color: theme.colors.text }]}>
                  <Text style={[styles.verseNum, { color: theme.colors.primary }]}>
                    {num}{' '}
                  </Text>
                  {v}
                  {bookmarkSet.has(num) ? (
                    <Text style={{ color: theme.colors.primary }}>{'  '}🔖</Text>
                  ) : null}
                  {noteSet.has(num) ? (
                    <Text style={{ color: theme.colors.primary }}>{'  '}🗒️</Text>
                  ) : null}
                </Text>
              </Pressable>
            );
          })}
        </GlassCard>

        {/* Chapter nav */}
        <View style={styles.navRow}>
          <Pressable
            onPress={() => goTo(prev)}
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
            onPress={() => goTo(next)}
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

      {/* Verse action toolbar */}
      {selectedVerse != null ? (
        <View
          style={[
            styles.toolbar,
            {
              bottom: insets.bottom + 18,
              backgroundColor: theme.colors.bgGlassStrong,
              borderColor: theme.colors.borderStrong,
            },
          ]}
        >
          <Text
            style={[
              theme.typography.caption,
              { color: theme.colors.text, opacity: 0.85 },
            ]}
          >
            {book.abbrev} {chapter}:{selectedVerse}
          </Text>
          <View style={styles.toolbarRow}>
            {HIGHLIGHT_COLORS.map((c) => (
              <Pressable
                key={c.id}
                onPress={() => onSetHighlight(c.id)}
                style={[
                  styles.colorSwatch,
                  { backgroundColor: c.bg, borderColor: c.ring },
                ]}
              />
            ))}
            <Pressable onPress={onAddBookmark} style={styles.toolbarBtn}>
              <Ionicons
                name={bookmarkSet.has(selectedVerse) ? 'bookmark' : 'bookmark-outline'}
                size={20}
                color={theme.colors.text}
              />
            </Pressable>
            <Pressable onPress={onOpenNote} style={styles.toolbarBtn}>
              <Ionicons
                name={noteSet.has(selectedVerse) ? 'create' : 'create-outline'}
                size={20}
                color={theme.colors.text}
              />
            </Pressable>
            <Pressable onPress={onShareVerse} style={styles.toolbarBtn}>
              <Ionicons name="share-outline" size={20} color={theme.colors.text} />
            </Pressable>
            <Pressable onPress={() => setSelectedVerse(null)} style={styles.toolbarBtn}>
              <Ionicons name="close" size={20} color={theme.colors.text} />
            </Pressable>
          </View>
        </View>
      ) : null}

      {/* Note editor modal */}
      <Modal
        visible={showNote}
        transparent
        animationType="fade"
        onRequestClose={() => setShowNote(false)}
      >
        <View style={styles.modalBackdrop}>
          <View
            style={[
              styles.modalCard,
              {
                backgroundColor: theme.colors.bgElevated,
                borderColor: theme.colors.borderStrong,
              },
            ]}
          >
            <Text
              style={[
                theme.typography.h3,
                { color: theme.colors.text, marginBottom: 6 },
              ]}
            >
              {book.abbrev} {chapter}:{selectedVerse}
            </Text>
            <Text
              style={[
                theme.typography.caption,
                { color: theme.colors.text, opacity: 0.78, marginBottom: 10 },
              ]}
            >
              Add a note to this verse
            </Text>
            <TextInput
              value={noteDraft}
              onChangeText={setNoteDraft}
              placeholder="What is this verse saying to you?"
              placeholderTextColor={theme.colors.inputPlaceholder}
              selectionColor={theme.colors.primary}
              cursorColor={theme.colors.inputCaret}
              underlineColorAndroid="transparent"
              style={[
                theme.typography.body,
                {
                  color: theme.colors.inputText,
                  minHeight: 120,
                  borderRadius: 14,
                  padding: 14,
                  backgroundColor: theme.colors.inputBg,
                  borderWidth: StyleSheet.hairlineWidth,
                  borderColor: theme.colors.inputBorder,
                },
              ]}
              multiline
              textAlignVertical="top"
            />
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
              <Pressable
                onPress={() => setShowNote(false)}
                style={[
                  styles.modalBtn,
                  {
                    backgroundColor: theme.colors.bgGlass,
                    borderColor: theme.colors.borderStrong,
                  },
                ]}
              >
                <Text style={[theme.typography.bodyBold, { color: theme.colors.text }]}>
                  Cancel
                </Text>
              </Pressable>
              <View style={{ flex: 1 }}>
                <GradientButton
                  label="Save note"
                  icon="checkmark-circle-outline"
                  full
                  gradient="primary"
                  onPress={onSaveNote}
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  verseRow: {
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  verseNum: {
    fontSize: 12,
    fontWeight: '800',
  },
  navRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
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
  toolbar: {
    position: 'absolute',
    left: 16,
    right: 16,
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 12,
    gap: 8,
  },
  toolbarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  colorSwatch: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
  },
  toolbarBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    borderRadius: 22,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 20,
  },
  modalBtn: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
