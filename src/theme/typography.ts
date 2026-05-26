import { TextStyle } from 'react-native';

// Premium type system:
//  - Cormorant Garamond — editorial luxury serif (display, hero, verse). High
//    contrast, large counters, very Vogue-meets-prayer-book.
//  - Cinzel — Roman-inscription serif (overline, bibleTitle, sacred labels).
//    Tall and reverent without being ornamental.
//  - Fraunces — secondary serif fallback for body verse text.
//  - Inter — body sans for everything else (clean, neutral).
//
// Font family strings must match the names registered via useFonts() in
// App.tsx. The renderer falls back to system fonts until fonts load.

const F = {
  fraunces500: 'Fraunces_500Medium',
  fraunces600: 'Fraunces_600SemiBold',
  fraunces700: 'Fraunces_700Bold',
  fraunces800: 'Fraunces_800ExtraBold',
  inter400: 'Inter_400Regular',
  inter500: 'Inter_500Medium',
  inter600: 'Inter_600SemiBold',
  inter700: 'Inter_700Bold',
  inter800: 'Inter_800ExtraBold',
  cormorant500: 'CormorantGaramond_500Medium',
  cormorant600: 'CormorantGaramond_600SemiBold',
  cormorant700: 'CormorantGaramond_700Bold',
  cormorant500Italic: 'CormorantGaramond_500Medium_Italic',
  cormorant600Italic: 'CormorantGaramond_600SemiBold_Italic',
  cinzel500: 'Cinzel_500Medium',
  cinzel600: 'Cinzel_600SemiBold',
  cinzel700: 'Cinzel_700Bold',
} as const;

const fontFamily = {
  display: F.cormorant700,
  displayItalic: F.cormorant600Italic,
  serif: F.cormorant500,
  serifSecondary: F.fraunces500,
  sacred: F.cinzel600,
  sans: F.inter500,
};

const baseTypography = {
  display: {
    fontFamily: F.cormorant700,
    fontSize: 46,
    lineHeight: 50,
    letterSpacing: -0.8,
  } as TextStyle,
  hero: {
    fontFamily: F.cormorant700,
    fontSize: 38,
    lineHeight: 42,
    letterSpacing: -0.5,
  } as TextStyle,
  // For poetic / italic accents in heroes — "lay it down."
  heroItalic: {
    fontFamily: F.cormorant600Italic,
    fontSize: 36,
    lineHeight: 42,
    letterSpacing: -0.3,
  } as TextStyle,
  h1: {
    fontFamily: F.inter800,
    fontSize: 28,
    lineHeight: 34,
    letterSpacing: -0.2,
  } as TextStyle,
  h2: {
    fontFamily: F.inter700,
    fontSize: 22,
    lineHeight: 28,
  } as TextStyle,
  h3: {
    fontFamily: F.inter700,
    fontSize: 18,
    lineHeight: 24,
  } as TextStyle,
  // Scripture / verse body — Cormorant has elegant italic counters that read
  // like a missal page.
  verse: {
    fontFamily: F.cormorant500Italic,
    fontSize: 24,
    lineHeight: 36,
    letterSpacing: 0.1,
  } as TextStyle,
  verseSmall: {
    fontFamily: F.cormorant500Italic,
    fontSize: 19,
    lineHeight: 28,
  } as TextStyle,
  // Cinzel for biblical/sacred titles — "GENESIS", "PSALM 23", chapter labels.
  sacred: {
    fontFamily: F.cinzel600,
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: 1.2,
  } as TextStyle,
  sacredLarge: {
    fontFamily: F.cinzel700,
    fontSize: 22,
    lineHeight: 28,
    letterSpacing: 1.6,
  } as TextStyle,
  body: {
    fontFamily: F.inter500,
    fontSize: 16,
    lineHeight: 24,
  } as TextStyle,
  bodyBold: {
    fontFamily: F.inter700,
    fontSize: 16,
    lineHeight: 24,
  } as TextStyle,
  caption: {
    fontFamily: F.inter600,
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: 0.2,
  } as TextStyle,
  overline: {
    fontFamily: F.cinzel600,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 2.4,
    textTransform: 'uppercase',
  } as TextStyle,
};

export type TypographyToken = keyof typeof baseTypography;

export type FontScale = 'sm' | 'md' | 'lg';

const SCALE_MAP: Record<FontScale, number> = {
  sm: 0.93,
  md: 1.0,
  lg: 1.1,
};

export function buildTypography(scale: FontScale = 'md') {
  const factor = SCALE_MAP[scale];
  const scaled: Record<TypographyToken, TextStyle> = {} as any;
  (Object.keys(baseTypography) as TypographyToken[]).forEach((k) => {
    const s = baseTypography[k];
    scaled[k] = {
      ...s,
      fontSize: Math.round((s.fontSize ?? 14) * factor),
      lineHeight: Math.round((s.lineHeight ?? 20) * factor),
    };
  });
  return { ...scaled, fontFamily };
}

export const typography = buildTypography('md');
