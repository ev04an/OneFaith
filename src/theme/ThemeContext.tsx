import React, { createContext, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { palette, type ColorScheme, type ThemeColors } from './palette';
import { gradients } from './gradients';
import { buildTypography, type FontScale } from './typography';
import { spacing, radius, shadow } from './spacing';
import { ACCENTS, type AccentKey } from './accents';
import { useSettingsStore } from '../state/store';

export type Theme = {
  scheme: ColorScheme;
  colors: ThemeColors;
  gradients: typeof gradients;
  typography: ReturnType<typeof buildTypography>;
  spacing: typeof spacing;
  radius: typeof radius;
  shadow: typeof shadow;
  isDark: boolean;
  accentKey: AccentKey;
  accentGradient: readonly [string, string, string];
  fontScale: FontScale;
};

const ThemeContext = createContext<Theme | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const preference = useSettingsStore((s) => s.themePreference);
  const accentKey = useSettingsStore((s) => s.accentKey);
  const fontScale = useSettingsStore((s) => s.fontScale);

  const scheme: ColorScheme = useMemo(() => {
    if (preference === 'system') return systemScheme === 'light' ? 'light' : 'dark';
    return preference;
  }, [preference, systemScheme]);

  const value = useMemo<Theme>(() => {
    const base = palette[scheme];
    const accent = ACCENTS[accentKey][scheme];
    return {
      scheme,
      colors: { ...base, ...accent },
      gradients,
      typography: buildTypography(fontScale),
      spacing,
      radius,
      shadow,
      isDark: scheme === 'dark',
      accentKey,
      accentGradient: ACCENTS[accentKey].gradient,
      fontScale,
    };
  }, [scheme, accentKey, fontScale]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): Theme {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
