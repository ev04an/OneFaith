// Topical tags for verses. Independent of the 16-emotion grid so verses can
// be retrieved both ways: "I feel sad" -> emotion-based, "exam tomorrow" ->
// topic-based. Each topic has a label, icon, and short hook used by the
// Topics browser screen.

export type Topic =
  | 'sadness'
  | 'depression'
  | 'anxiety'
  | 'fear'
  | 'loneliness'
  | 'overthinking'
  | 'stress'
  | 'anger'
  | 'heartbreak'
  | 'addiction'
  | 'temptation'
  | 'healing'
  | 'grief'
  | 'guilt'
  | 'hopelessness'
  | 'motivation'
  | 'discipline'
  | 'confidence'
  | 'peace'
  | 'forgiveness'
  | 'faith'
  | 'spiritualWarfare'
  | 'strength'
  | 'patience'
  | 'purpose'
  | 'love'
  | 'friendship'
  | 'family'
  | 'exams'
  | 'failure'
  | 'success'
  | 'selfWorth'
  | 'identity'
  | 'doubt'
  | 'burnout'
  | 'recovery'
  | 'sleep'
  | 'thankfulness'
  | 'hope';

export type TopicMeta = {
  id: Topic;
  label: string;
  icon: string; // Ionicons name
  hook: string; // short one-line description
};

export const TOPICS: TopicMeta[] = [
  { id: 'sadness', label: 'Sadness', icon: 'rainy-outline', hook: 'Comfort for tender hearts' },
  { id: 'depression', label: 'Depression', icon: 'cloud-outline', hook: 'Light when the day feels heavy' },
  { id: 'anxiety', label: 'Anxiety', icon: 'pulse-outline', hook: 'Stillness for a racing mind' },
  { id: 'fear', label: 'Fear', icon: 'shield-outline', hook: 'Courage that comes from above' },
  { id: 'loneliness', label: 'Loneliness', icon: 'person-outline', hook: 'You are not alone in this' },
  { id: 'overthinking', label: 'Overthinking', icon: 'sync-outline', hook: 'Quieting the spiral' },
  { id: 'stress', label: 'Stress', icon: 'leaf-outline', hook: 'Rest for weary shoulders' },
  { id: 'anger', label: 'Anger', icon: 'flame-outline', hook: 'Peace beyond the storm' },
  { id: 'heartbreak', label: 'Heartbreak', icon: 'heart-dislike-outline', hook: 'Mending for shattered hearts' },
  { id: 'addiction', label: 'Addiction', icon: 'shield-checkmark-outline', hook: 'Freedom, one day at a time' },
  { id: 'temptation', label: 'Temptation', icon: 'flash-off-outline', hook: 'A way of escape' },
  { id: 'healing', label: 'Healing', icon: 'medkit-outline', hook: 'For every kind of wound' },
  { id: 'grief', label: 'Grief', icon: 'flower-outline', hook: 'Love that grief cannot erase' },
  { id: 'guilt', label: 'Guilt', icon: 'water-outline', hook: 'A clean slate, freely given' },
  { id: 'hopelessness', label: 'Hopelessness', icon: 'cloudy-night-outline', hook: 'A flicker becomes a flame' },
  { id: 'motivation', label: 'Motivation', icon: 'flash-outline', hook: 'Strength to begin again' },
  { id: 'discipline', label: 'Discipline', icon: 'compass-outline', hook: 'Quiet faithfulness over time' },
  { id: 'confidence', label: 'Confidence', icon: 'sparkles-outline', hook: 'Standing tall in who He made you' },
  { id: 'peace', label: 'Peace', icon: 'flower-outline', hook: 'Stillness that runs deep' },
  { id: 'forgiveness', label: 'Forgiveness', icon: 'hand-left-outline', hook: 'Setting captives free — including you' },
  { id: 'faith', label: 'Faith', icon: 'rocket-outline', hook: 'Assurance of what is unseen' },
  { id: 'spiritualWarfare', label: 'Spiritual Warfare', icon: 'shield-half-outline', hook: 'You are not fighting alone' },
  { id: 'strength', label: 'Strength', icon: 'barbell-outline', hook: 'Power in your weakness' },
  { id: 'patience', label: 'Patience', icon: 'hourglass-outline', hook: 'Trusting the slow work' },
  { id: 'purpose', label: 'Purpose', icon: 'navigate-outline', hook: 'You were made on purpose' },
  { id: 'love', label: 'Love', icon: 'heart-outline', hook: 'The love that holds all things' },
  { id: 'friendship', label: 'Friendship', icon: 'people-outline', hook: 'For those who walk beside us' },
  { id: 'family', label: 'Family', icon: 'home-outline', hook: 'Tender prayers for the home' },
  { id: 'exams', label: 'Exams & Studies', icon: 'school-outline', hook: 'Peace before the test' },
  { id: 'failure', label: 'Failure', icon: 'reload-outline', hook: 'Falls that lead to risings' },
  { id: 'success', label: 'Success', icon: 'trophy-outline', hook: 'Staying grateful at the top' },
  { id: 'selfWorth', label: 'Self-Worth', icon: 'ribbon-outline', hook: 'Beloved by name' },
  { id: 'identity', label: 'Identity in Christ', icon: 'finger-print-outline', hook: 'Who you really are' },
  { id: 'doubt', label: 'Doubt', icon: 'help-circle-outline', hook: 'Honest questions, gentle answers' },
  { id: 'burnout', label: 'Burnout', icon: 'battery-charging-outline', hook: 'Restoration for the worn-out soul' },
  { id: 'recovery', label: 'Recovery', icon: 'leaf-outline', hook: 'A long, gentle walk home' },
  { id: 'sleep', label: 'Sleep & Rest', icon: 'moon-outline', hook: 'Lay your head down in peace' },
  { id: 'thankfulness', label: 'Thankfulness', icon: 'gift-outline', hook: 'A heart of gratitude' },
  { id: 'hope', label: 'Hope', icon: 'sparkles-outline', hook: 'Eyes lifted upward' },
];

export const getTopicMeta = (id: Topic): TopicMeta =>
  TOPICS.find((t) => t.id === id) ?? TOPICS[0];
