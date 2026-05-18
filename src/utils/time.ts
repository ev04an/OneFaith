export type StreakParts = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalDays: number;
};

export function msToParts(ms: number): StreakParts {
  const safe = Math.max(0, ms);
  const totalSeconds = Math.floor(safe / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { days, hours, minutes, seconds, totalDays: days };
}

export function pad(n: number, width = 2): string {
  const s = String(n);
  return s.length >= width ? s : '0'.repeat(width - s.length) + s;
}

export function formatRelative(ts: number): string {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  const date = new Date(ts);
  return date.toLocaleDateString();
}

export function formatLongDuration(ms: number): string {
  const { days, hours, minutes } = msToParts(ms);
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}
