import { TextStyle } from 'react-native';

// Premium font pairing: Fraunces (modern variable serif) for display/hero/verse
// text, Inter for everything else. Loaded at App startup via useFonts;
// fontFamily strings must match the registered font names exactly so that
// the renderer can substitute the right glyphs once fonts are ready.

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
} as const;

// Kept exported for code paths that still reference fontFamily.display etc.
const fontFamily = {
  display: F.fraunces700,
  serif: F.fraunces500,
  sans: F.inter500,
};

const baseTypography = {
  display: {
    fontFamily: F.fraunces700,
    fontSize: 42,
    lineHeight: 48,
    letterSpacing: -0.6,
  } as TextStyle,
  hero: {
    fontFamily: F.fraunces700,
    fontSize: 34,
    lineHeight: 40,
    letterSpacing: -0.4,
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
  verse: {
    fontFamily: F.fraunces500,
    fontSize: 23,
    lineHeight: 34,
    letterSpacing: 0.1,
  } as TextStyle,
  verseSmall: {
    fontFamily: F.fraunces500,
    fontSize: 18,
    lineHeight: 28,
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
    fontFamily: F.inter800,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 1.8,
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
