// Christian holiday detection + content.
// Movable feasts use the Anonymous Gregorian computus for Easter Sunday.

export type ParticleVariant = 'snow' | 'rays' | 'candle' | 'stars' | 'embers';

export type Holiday = {
  id: string;
  name: string;
  greeting: string;
  message: string;
  verse: { reference: string; text: string };
  gradient: readonly [string, string, string];
  accent: string;
  particles: ParticleVariant;
  icon: string;
};

/** Anonymous Gregorian algorithm — returns Easter Sunday for the given year. */
function easterSunday(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const n = h + l - 7 * m + 114;
  const month = Math.floor(n / 31); // 3=March, 4=April
  const day = (n % 31) + 1;
  return new Date(year, month - 1, day);
}

function dateOnly(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function addDays(d: Date, days: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + days);
  return dateOnly(r);
}

function sameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isBetween(d: Date, start: Date, end: Date): boolean {
  const t = d.getTime();
  return t >= start.getTime() && t <= end.getTime();
}

/** First Sunday of Advent — the Sunday closest to Nov 30 (within Nov 27–Dec 3). */
function firstAdventSunday(year: number): Date {
  const nov30 = new Date(year, 10, 30);
  const dow = nov30.getDay(); // 0=Sun
  // Walk to the closest Sunday (within ±3 days of Nov 30).
  const offset = dow <= 3 ? -dow : 7 - dow;
  return dateOnly(addDays(nov30, offset));
}

const HOLIDAY_CONTENT: Record<string, Omit<Holiday, 'id'>> = {
  christmas: {
    name: 'Christmas',
    greeting: 'Merry Christmas',
    message:
      'May the peace, love, and grace of Christ fill your heart this season.\n\nYou are remembered. You are loved. You are not alone tonight.',
    verse: {
      reference: 'Luke 2:11',
      text: 'Today in the town of David a Savior has been born to you; he is the Messiah, the Lord.',
    },
    gradient: ['#3B1B4A', '#7A2942', '#D49B4E'],
    accent: '#F7DD9C',
    particles: 'snow',
    icon: 'snow-outline',
  },
  easter: {
    name: 'Easter',
    greeting: 'He is Risen — Happy Easter',
    message:
      'He is risen, just as He said.\n\nMay your heart be filled with hope, renewal, and the quiet certainty that no darkness is final.',
    verse: {
      reference: 'Matthew 28:6',
      text: 'He is not here; he has risen, just as he said. Come and see the place where he lay.',
    },
    gradient: ['#FFF7E0', '#FFD58A', '#E9A35E'],
    accent: '#FFFFFF',
    particles: 'rays',
    icon: 'sunny-outline',
  },
  goodFriday: {
    name: 'Good Friday',
    greeting: 'Blessed Good Friday',
    message:
      'Today we remember the sacrifice and the unconditional love of Christ.\n\nSit quietly. Let the weight of grace meet you here.',
    verse: {
      reference: 'John 3:16',
      text: 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.',
    },
    gradient: ['#0B0917', '#1E1632', '#3A2A55'],
    accent: '#F1C76A',
    particles: 'candle',
    icon: 'flame-outline',
  },
  palmSunday: {
    name: 'Palm Sunday',
    greeting: 'Blessed Palm Sunday',
    message:
      'A King rode in on humility, welcomed with branches and shouts of hope.\n\nMay you too welcome Him gently into the streets of your heart this week.',
    verse: {
      reference: 'Matthew 21:9',
      text: 'Hosanna to the Son of David! Blessed is he who comes in the name of the Lord! Hosanna in the highest!',
    },
    gradient: ['#1E3A2E', '#4F8C5C', '#D6B36A'],
    accent: '#F5E2A8',
    particles: 'rays',
    icon: 'leaf-outline',
  },
  ashWednesday: {
    name: 'Ash Wednesday',
    greeting: 'Blessed Ash Wednesday',
    message:
      'A season of returning begins.\n\nTurn gently — not in shame, but in honesty. The road back is shorter than you think.',
    verse: {
      reference: 'Joel 2:13',
      text: 'Rend your heart and not your garments. Return to the Lord your God, for he is gracious and compassionate, slow to anger and abounding in love.',
    },
    gradient: ['#1A1322', '#3A2E45', '#6E5B7A'],
    accent: '#C7B8D4',
    particles: 'embers',
    icon: 'moon-outline',
  },
  pentecost: {
    name: 'Pentecost',
    greeting: 'Blessed Pentecost',
    message:
      'A wind, a flame, a new tongue of courage.\n\nMay the same Spirit that moved through that upper room move quietly through you today.',
    verse: {
      reference: 'Acts 2:4',
      text: 'All of them were filled with the Holy Spirit and began to speak in other tongues as the Spirit enabled them.',
    },
    gradient: ['#3A0F1A', '#A8341E', '#FFB14A'],
    accent: '#FFD89A',
    particles: 'embers',
    icon: 'flame-outline',
  },
  newYear: {
    name: 'New Year',
    greeting: 'Happy New Year',
    message:
      'May God guide your path this year.\n\nA fresh page. Not a verdict on the last one. May this year be slower, kinder, and more honest than the one you carried in.',
    verse: {
      reference: 'Isaiah 43:19',
      text: 'See, I am doing a new thing! Now it springs up; do you not perceive it? I am making a way in the wilderness and streams in the wasteland.',
    },
    gradient: ['#0E0F2C', '#2D3A78', '#D6B36A'],
    accent: '#F5E2A8',
    particles: 'stars',
    icon: 'sparkles-outline',
  },
  advent: {
    name: 'Advent',
    greeting: 'Blessed Advent',
    message:
      'A season of quiet waiting.\n\nThe Light is coming. Light another candle in your heart and hold it steady.',
    verse: {
      reference: 'Isaiah 9:6',
      text: 'For to us a child is born, to us a son is given, and the government will be on his shoulders. And he will be called Wonderful Counselor, Mighty God, Everlasting Father, Prince of Peace.',
    },
    gradient: ['#0F0A2E', '#3B1B5A', '#C29A4A'],
    accent: '#F1C76A',
    particles: 'candle',
    icon: 'sparkles-outline',
  },
  lent: {
    name: 'Lent',
    greeting: 'Blessed Lent',
    message:
      'A long, gentle walk back.\n\nYou don’t have to give up everything to be made new — just keep the conversation honest.',
    verse: {
      reference: '2 Corinthians 5:17',
      text: 'Therefore, if anyone is in Christ, the new creation has come: The old has gone, the new is here!',
    },
    gradient: ['#1F1730', '#4A3A66', '#8A7BB8'],
    accent: '#D8CEEC',
    particles: 'candle',
    icon: 'moon-outline',
  },
};

export function getActiveHoliday(now: Date = new Date()): Holiday | null {
  const today = dateOnly(now);
  const year = today.getFullYear();
  const easter = easterSunday(year);
  const goodFriday = addDays(easter, -2);
  const palmSunday = addDays(easter, -7);
  const ashWednesday = addDays(easter, -46);
  const pentecost = addDays(easter, 49);
  const christmasStart = new Date(year, 11, 24);
  const christmasEnd = new Date(year, 11, 26);
  const newYearStart = new Date(year, 0, 1);
  const newYearEnd = new Date(year, 0, 3);
  const advent1 = firstAdventSunday(year);
  const advent4End = addDays(advent1, 27); // through Dec 24 region — capped to advent only

  // Priority order: single-day feasts first, then broad seasons.
  if (isBetween(today, christmasStart, christmasEnd)) return holiday('christmas');
  if (sameDay(today, easter)) return holiday('easter');
  if (sameDay(today, goodFriday)) return holiday('goodFriday');
  if (sameDay(today, palmSunday)) return holiday('palmSunday');
  if (sameDay(today, ashWednesday)) return holiday('ashWednesday');
  if (sameDay(today, pentecost)) return holiday('pentecost');
  if (isBetween(today, newYearStart, newYearEnd)) return holiday('newYear');

  // Seasons (after the single-day checks so a Sunday in Lent still shows Lent).
  if (isBetween(today, advent1, addDays(advent1, Math.min(27, daysBetween(advent1, christmasStart) - 1)))) {
    return holiday('advent');
  }
  if (isBetween(today, addDays(ashWednesday, 1), addDays(easter, -1))) {
    return holiday('lent');
  }

  return null;
}

export function getHolidayById(id: string): Holiday | null {
  return holiday(id);
}

function holiday(id: string): Holiday | null {
  const content = HOLIDAY_CONTENT[id];
  if (!content) return null;
  return { id, ...content };
}

function daysBetween(a: Date, b: Date): number {
  return Math.round((b.getTime() - a.getTime()) / 86400000);
}
