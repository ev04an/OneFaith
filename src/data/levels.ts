export type Level = {
  id: number;
  name: string;
  threshold: number; // days to reach this level
  description: string;
  glow: string; // hex color
};

export const LEVELS: Level[] = [
  { id: 1, name: 'Beginner', threshold: 0, description: 'The first day is the bravest.', glow: '#5B9BE3' },
  { id: 2, name: 'Self-Control', threshold: 3, description: 'You are choosing differently.', glow: '#7AE7C7' },
  { id: 3, name: 'Discipline', threshold: 7, description: 'A week of faithful steps.', glow: '#7CA0D8' },
  { id: 4, name: 'Focused Mind', threshold: 21, description: 'Your mind is forming new patterns.', glow: '#FFB58A' },
  { id: 5, name: 'Spiritual Warrior', threshold: 60, description: 'You fight with light, not fear.', glow: '#E55A6E' },
  { id: 6, name: 'Mastery', threshold: 180, description: 'Mastery is just consistency in disguise.', glow: '#F5D58A' },
  { id: 7, name: 'Unbreakable', threshold: 365, description: 'A year. A new person. The same God.', glow: '#FFFFFF' },
];

export type Badge = {
  id: string;
  name: string;
  threshold: number;
  tier: 'bronze' | 'silver' | 'gold' | 'diamond' | 'legendary';
  description: string;
  glow: string;
};

export const BADGES: Badge[] = [
  { id: 'day-1', name: 'First Light', threshold: 1, tier: 'bronze', description: 'You showed up. That is everything.', glow: '#CD7F32' },
  { id: 'day-7', name: 'A Steady Week', threshold: 7, tier: 'silver', description: 'Seven days of choosing yourself.', glow: '#C0C0C0' },
  { id: 'day-30', name: 'A New Rhythm', threshold: 30, tier: 'gold', description: 'A month — long enough to feel different.', glow: '#F5D58A' },
  { id: 'day-100', name: 'Crystal Clarity', threshold: 100, tier: 'diamond', description: '100 days. A new horizon.', glow: '#B9F2FF' },
  { id: 'day-365', name: 'Legendary', threshold: 365, tier: 'legendary', description: 'One full year. You are a different person.', glow: '#FFD68A' },
];

export const getLevelForDays = (days: number): Level => {
  let current = LEVELS[0];
  for (const l of LEVELS) {
    if (days >= l.threshold) current = l;
  }
  return current;
};

export const getNextLevel = (days: number): Level | null => {
  for (const l of LEVELS) {
    if (days < l.threshold) return l;
  }
  return null;
};

export const getEarnedBadges = (days: number): Badge[] =>
  BADGES.filter((b) => days >= b.threshold);

export const getNextBadge = (days: number): Badge | null =>
  BADGES.find((b) => days < b.threshold) ?? null;
