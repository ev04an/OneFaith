export const AFFIRMATIONS: string[] = [
  'You are stronger than your temptations.',
  'God is with you in this struggle.',
  'Progress matters more than perfection.',
  'One step at a time. That is enough.',
  'You were made for more than this craving.',
  'The grace that began this work will finish it.',
  'Today’s no is tomorrow’s freedom.',
  'You are not alone in this fight.',
  'Your past does not define your next step.',
  'Every breath is a chance to begin again.',
  'Discipline is love for your future self.',
  'Small obedience is not small.',
  'You are being remade — slowly, surely.',
  'Peace is closer than you think.',
  'The valley is not your home.',
  'You are loved at exactly this moment.',
  'Stillness is strength.',
  'Hope is a muscle. You are training it.',
  'You belong to someone good.',
  'There is light on the other side of this.',
  'Your name is written. You are known.',
  'Today, you choose freedom.',
  'You are not your worst day.',
  'Mercy is new this morning.',
];

export const getRandomAffirmation = (seed?: number): string => {
  if (seed !== undefined) {
    const idx = Math.floor(Math.abs(seed)) % AFFIRMATIONS.length;
    return AFFIRMATIONS[idx];
  }
  return AFFIRMATIONS[Math.floor(Math.random() * AFFIRMATIONS.length)];
};

export const getAffirmationOfTheHour = (): string => {
  const now = new Date();
  const seed = now.getDate() * 24 + now.getHours();
  return getRandomAffirmation(seed);
};
