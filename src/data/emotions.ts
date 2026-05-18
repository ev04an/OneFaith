import type { GradientKey } from '../theme/gradients';

export type EmotionId =
  | 'sad'
  | 'depressed'
  | 'lonely'
  | 'heartbroken'
  | 'angry'
  | 'anxious'
  | 'fearful'
  | 'stressed'
  | 'unmotivated'
  | 'overthinking'
  | 'guilty'
  | 'hopeless'
  | 'happy'
  | 'thankful'
  | 'hopeful'
  | 'peaceful';

export type Emotion = {
  id: EmotionId;
  label: string;
  icon: string; // Ionicons name
  gradient: GradientKey;
  blurb: string;
};

export const EMOTIONS: Emotion[] = [
  { id: 'sad', label: 'Sad', icon: 'rainy-outline', gradient: 'sad', blurb: 'Comfort for grieving hearts' },
  { id: 'depressed', label: 'Depressed', icon: 'cloud-outline', gradient: 'depressed', blurb: 'Light in the darkness' },
  { id: 'lonely', label: 'Lonely', icon: 'person-outline', gradient: 'lonely', blurb: 'You are never alone' },
  { id: 'heartbroken', label: 'Heartbroken', icon: 'heart-dislike-outline', gradient: 'heartbroken', blurb: 'Healing for broken hearts' },
  { id: 'angry', label: 'Angry', icon: 'flame-outline', gradient: 'angry', blurb: 'Peace beyond the storm' },
  { id: 'anxious', label: 'Anxious', icon: 'pulse-outline', gradient: 'anxious', blurb: 'Stillness for restless minds' },
  { id: 'fearful', label: 'Fearful', icon: 'shield-outline', gradient: 'fearful', blurb: 'Courage from above' },
  { id: 'stressed', label: 'Stressed', icon: 'leaf-outline', gradient: 'stressed', blurb: 'Rest for the weary' },
  { id: 'unmotivated', label: 'Unmotivated', icon: 'battery-half-outline', gradient: 'unmotivated', blurb: 'Strength to begin again' },
  { id: 'overthinking', label: 'Overthinking', icon: 'sync-outline', gradient: 'overthinking', blurb: 'Quiet for a busy mind' },
  { id: 'guilty', label: 'Guilty', icon: 'water-outline', gradient: 'guilty', blurb: 'Mercy that washes clean' },
  { id: 'hopeless', label: 'Hopeless', icon: 'cloudy-night-outline', gradient: 'hopeless', blurb: 'A flicker becomes a flame' },
  { id: 'happy', label: 'Happy', icon: 'sunny-outline', gradient: 'happy', blurb: 'Joy multiplied' },
  { id: 'thankful', label: 'Thankful', icon: 'gift-outline', gradient: 'thankful', blurb: 'A heart of gratitude' },
  { id: 'hopeful', label: 'Hopeful', icon: 'sparkles-outline', gradient: 'hopeful', blurb: 'Eyes lifted upward' },
  { id: 'peaceful', label: 'Peaceful', icon: 'flower-outline', gradient: 'peaceful', blurb: 'Stillness that runs deep' },
];

export const getEmotion = (id: EmotionId): Emotion =>
  EMOTIONS.find((e) => e.id === id) ?? EMOTIONS[0];
