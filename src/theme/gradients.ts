export const gradients = {
  // Cinematic background gradients
  cosmosDark: ['#06122E', '#0E1E48', '#1B3578'] as const,
  cosmosLight: ['#FFFFFF', '#EAF3FF', '#CFE3FF'] as const,
  skyLight: ['#FFFFFF', '#EAF3FF', '#BCDFFF'] as const,
  skyDeep: ['#3A6EBF', '#5B9BE3', '#BCDFFF'] as const,

  // Emotion-tied gradients (16 emotions)
  sad: ['#4A6FA5', '#7CA0D8'] as const,
  depressed: ['#3C2C5C', '#6E5BA8'] as const,
  lonely: ['#5A6E9A', '#8FA8D8'] as const,
  heartbroken: ['#9B3F6A', '#E08AB0'] as const,
  angry: ['#B83A4A', '#F08070'] as const,
  anxious: ['#6E5BB0', '#A98BFF'] as const,
  fearful: ['#3A4566', '#7A86B5'] as const,
  stressed: ['#A65A40', '#F2A57A'] as const,
  unmotivated: ['#5C5870', '#A09BC0'] as const,
  overthinking: ['#4A3E7A', '#8A7BD8'] as const,
  guilty: ['#7A4A6A', '#C28AB0'] as const,
  hopeless: ['#3C3850', '#6E6A90'] as const,
  happy: ['#E8A65A', '#FFD68A'] as const,
  thankful: ['#D6864A', '#FFC58A'] as const,
  hopeful: ['#5AA8C2', '#9BE0E8'] as const,
  peaceful: ['#5AB8A0', '#A8E8D2'] as const,

  // Premium accent gradients
  primary: ['#5B9BE3', '#7FB3E8', '#BCDFFF'] as const,
  gold: ['#F5D58A', '#D4A24A'] as const,
  fire: ['#FF8B4A', '#FF4A6A'] as const,
  ocean: ['#3A6EBF', '#5B9BE3'] as const,
  serenity: ['#7FB3E8', '#BCDFFF'] as const,
  glass: ['rgba(255,255,255,0.10)', 'rgba(255,255,255,0.02)'] as const,
} as const;

export type GradientKey = keyof typeof gradients;
