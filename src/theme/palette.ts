export type ThemeColors = {
  bg: string;
  bgElevated: string;
  bgGlass: string;
  bgGlassStrong: string;
  border: string;
  borderStrong: string;
  text: string;
  textMuted: string;
  textFaint: string;
  primary: string;
  primarySoft: string;
  accent: string;
  accentSoft: string;
  gold: string;
  success: string;
  danger: string;
  overlay: string;
  // Input-specific tokens. Inputs use these instead of bgGlass/text so we can
  // guarantee a solid, high-contrast field regardless of what the rest of the
  // screen is doing with translucency.
  inputBg: string;
  inputText: string;
  inputPlaceholder: string;
  inputBorder: string;
  inputCaret: string;
};

// Blue meditation-app palette. Light is the canonical experience (calm,
// minimal, white-to-sky-blue). Dark mode is a deep navy night-sky variant.
export const palette: { dark: ThemeColors; light: ThemeColors } = {
  dark: {
    bg: '#06122E',
    bgElevated: '#0E1E48',
    // Opaque card surfaces in dark mode too — translucent values let the
    // background orbs bleed through and create the illusion of an inner box.
    bgGlass: '#0E1E48',
    bgGlassStrong: '#162E66',
    border: 'rgba(255,255,255,0.08)',
    borderStrong: 'rgba(255,255,255,0.14)',
    text: '#FFFFFF',
    textMuted: '#E6EEFC',
    textFaint: '#BFD0EE',
    primary: '#9DC8F0',
    primarySoft: '#7FB3E8',
    accent: '#BCDFFF',
    accentSoft: '#5B9BE3',
    gold: '#F7DD9C',
    success: '#8FEFD2',
    danger: '#FF9AB3',
    overlay: 'rgba(0,0,0,0.55)',
    inputBg: 'rgba(255,255,255,0.10)',
    inputText: '#FFFFFF',
    inputPlaceholder: 'rgba(255,255,255,0.58)',
    inputBorder: 'rgba(255,255,255,0.32)',
    inputCaret: '#FFFFFF',
  },
  light: {
    bg: '#F5F8FD',
    bgElevated: '#FFFFFF',
    // Fully opaque white card surfaces. Solid bg means there's no second
    // visible layer behind any card — what you see is one clean surface.
    bgGlass: '#FFFFFF',
    bgGlassStrong: '#FFFFFF',
    border: 'rgba(15,31,75,0.08)',
    borderStrong: 'rgba(15,31,75,0.12)',
    // Per the readability spec: dark navy for titles, mid navy-gray for body,
    // medium gray for secondary. Used directly (no opacity dilution).
    text: '#0F1F4B',
    textMuted: '#3A4A63',
    textFaint: '#5E6A7D',
    primary: '#2F5FB0',
    primarySoft: '#5B9BE3',
    accent: '#142C66',
    accentSoft: '#7FB3E8',
    gold: '#8C5E0F',
    success: '#157752',
    danger: '#A8243F',
    overlay: 'rgba(255,255,255,0.55)',
    // Inputs sit on a fully opaque white background so text never blends into
    // the glassmorphic card behind them. Placeholder is the spec's medium
    // gray (#7A8599).
    inputBg: '#FFFFFF',
    inputText: '#0F1F4B',
    inputPlaceholder: '#7A8599',
    inputBorder: 'rgba(15,31,75,0.20)',
    inputCaret: '#0F1F4B',
  },
};

export type ColorScheme = keyof typeof palette;
