// Selectable accent palettes that override primary/accent colors at theme time.

export type AccentKey = 'sky' | 'violet' | 'ocean' | 'rose' | 'gold' | 'emerald';

type AccentSet = {
  name: string;
  dark: { primary: string; primarySoft: string; accent: string; accentSoft: string };
  light: { primary: string; primarySoft: string; accent: string; accentSoft: string };
  gradient: readonly [string, string, string];
};

export const ACCENTS: Record<AccentKey, AccentSet> = {
  sky: {
    name: 'Sky',
    dark: { primary: '#9DC8F0', primarySoft: '#7FB3E8', accent: '#BCDFFF', accentSoft: '#5B9BE3' },
    light: { primary: '#3A6EBF', primarySoft: '#5B9BE3', accent: '#1B3578', accentSoft: '#7FB3E8' },
    gradient: ['#BCDFFF', '#7FB3E8', '#3A6EBF'],
  },
  violet: {
    name: 'Violet',
    dark: { primary: '#B79DFF', primarySoft: '#8E6CFF', accent: '#FFC59E', accentSoft: '#FF9DC0' },
    light: { primary: '#6749E8', primarySoft: '#9A7FFF', accent: '#FF7A56', accentSoft: '#FF5C84' },
    gradient: ['#8E6CFF', '#B79DFF', '#FF9DC0'],
  },
  ocean: {
    name: 'Ocean',
    dark: { primary: '#7FC7FF', primarySoft: '#4FA3FF', accent: '#8FEFD2', accentSoft: '#9DD9FF' },
    light: { primary: '#1D6FCF', primarySoft: '#3D90E5', accent: '#138C72', accentSoft: '#4FA3FF' },
    gradient: ['#4FA3FF', '#7FC7FF', '#8FEFD2'],
  },
  rose: {
    name: 'Rose',
    dark: { primary: '#FF9DC0', primarySoft: '#FF6E97', accent: '#FFC59E', accentSoft: '#FFD68A' },
    light: { primary: '#C8417B', primarySoft: '#E66BA0', accent: '#D26240', accentSoft: '#E68B5C' },
    gradient: ['#FF6E97', '#FF9DC0', '#FFD68A'],
  },
  gold: {
    name: 'Gold',
    dark: { primary: '#F7DD9C', primarySoft: '#E0B461', accent: '#FFC59E', accentSoft: '#FF9DC0' },
    light: { primary: '#A06B12', primarySoft: '#C28E2C', accent: '#A85B30', accentSoft: '#C77F4F' },
    gradient: ['#E0B461', '#F7DD9C', '#FFC59E'],
  },
  emerald: {
    name: 'Emerald',
    dark: { primary: '#8FEFD2', primarySoft: '#52CBA5', accent: '#B79DFF', accentSoft: '#9DD9FF' },
    light: { primary: '#138C72', primarySoft: '#2EA079', accent: '#5A3FB5', accentSoft: '#7FC7FF' },
    gradient: ['#52CBA5', '#8FEFD2', '#7FC7FF'],
  },
};
