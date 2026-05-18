// Personalized prayer generator. Takes free-text input describing how the
// user feels or what they need prayer for, returns a multi-paragraph prayer
// with relevant scripture. Template-based with intent routing — same surface
// as the AI engine, swappable for a real LLM later.

import { getVersesForEmotion, getVersesForTopic, VERSES, type Verse } from '../data/verses';
import type { EmotionId } from './../data/emotions';
import type { Topic } from '../data/topics';

type Intent = {
  emotions: EmotionId[];
  topics: Topic[];
  focus: 'anxiety' | 'fear' | 'grief' | 'heartbreak' | 'addiction' | 'exams' | 'healing' | 'family' | 'sleep' | 'motivation' | 'forgiveness' | 'thankfulness' | 'general';
};

const EMOTION_KEYWORDS: Record<EmotionId, string[]> = {
  sad: ['sad', 'sadness', 'down', 'low'],
  depressed: ['depress', 'numb', 'empty', 'hollow'],
  lonely: ['lonely', 'alone', 'no one'],
  heartbroken: ['heartbroken', 'breakup', 'broke up', 'left me'],
  angry: ['angry', 'anger', 'rage', 'mad', 'hate', 'resent'],
  anxious: ['anx', 'panic', 'worry', 'nervous'],
  fearful: ['afraid', 'fear', 'scared', 'terrified'],
  stressed: ['stress', 'overwhelm', 'too much', 'burned out'],
  unmotivated: ['unmotiv', 'stuck', 'lazy', 'no energy'],
  overthinking: ['overthink', 'spiral', 'racing'],
  guilty: ['guilt', 'shame', 'ashamed', 'regret'],
  hopeless: ['hopeless', 'no point', 'give up'],
  happy: ['happy', 'joy', 'good day'],
  thankful: ['thank', 'grateful', 'gratitude', 'blessed'],
  hopeful: ['hopeful', 'optimistic'],
  peaceful: ['peace', 'calm'],
};

const TOPIC_KEYWORDS: Partial<Record<Topic, string[]>> = {
  addiction: ['addict', 'relapse', 'porn', 'drink', 'drug', 'craving', 'urge'],
  grief: ['died', 'death', 'loss', 'miss them', 'gone', 'funeral'],
  heartbreak: ['heartbroken', 'breakup', 'broke up'],
  forgiveness: ['forgive', 'sorry', 'sin'],
  exams: ['exam', 'test', 'study', 'school', 'college', 'final'],
  family: ['family', 'parent', 'mom', 'dad', 'sister', 'brother', 'kids', 'son', 'daughter'],
  sleep: ['sleep', 'cant sleep', 'insomnia', 'bedtime', 'rest'],
  healing: ['heal', 'wound', 'sick', 'illness'],
  motivation: ['motivat', 'discipline', 'goal'],
  thankfulness: ['blessed', 'grateful'],
};

function detect(input: string): Intent {
  const t = input.toLowerCase();
  const emotions: EmotionId[] = [];
  for (const id of Object.keys(EMOTION_KEYWORDS) as EmotionId[]) {
    if (EMOTION_KEYWORDS[id].some((kw) => t.includes(kw))) emotions.push(id);
  }
  const topics: Topic[] = [];
  for (const id of Object.keys(TOPIC_KEYWORDS) as Topic[]) {
    if ((TOPIC_KEYWORDS[id] ?? []).some((kw) => t.includes(kw))) topics.push(id);
  }
  let focus: Intent['focus'] = 'general';
  if (topics.includes('addiction')) focus = 'addiction';
  else if (topics.includes('grief')) focus = 'grief';
  else if (topics.includes('heartbreak') || emotions.includes('heartbroken')) focus = 'heartbreak';
  else if (topics.includes('exams')) focus = 'exams';
  else if (topics.includes('healing')) focus = 'healing';
  else if (topics.includes('family')) focus = 'family';
  else if (topics.includes('sleep')) focus = 'sleep';
  else if (topics.includes('forgiveness') || emotions.includes('guilty')) focus = 'forgiveness';
  else if (emotions.includes('thankful') || topics.includes('thankfulness')) focus = 'thankfulness';
  else if (emotions.includes('anxious') || emotions.includes('overthinking')) focus = 'anxiety';
  else if (emotions.includes('fearful')) focus = 'fear';
  else if (emotions.includes('unmotivated')) focus = 'motivation';
  return { emotions, topics, focus };
}

const OPENINGS = [
  'Father,',
  'Lord,',
  'Heavenly Father,',
  'God of all comfort,',
  'Abba Father,',
];

// Consistent ending across every generated prayer.
const CLOSING = 'In Jesus’ name I pray, Amen.';

type Block = (input: string) => string;

const BODY_BY_FOCUS: Record<Intent['focus'], Block> = {
  anxiety: () =>
    `My mind is racing tonight, and I’m carrying things You never asked me to carry. I bring You every worry — the small ones I’m embarrassed by and the loud ones I cannot name.

Quiet the storm inside me. Steady my breath. Replace each anxious thought with one true thing about who You are. Let Your peace, which surpasses understanding, guard my heart and my thoughts in You.`,

  fear: () =>
    `I’m afraid, and the fear is making everything feel bigger than it is. Remind me whose I am. Remind me that You did not give me a spirit of fear, but of power, love, and a sound mind.

Walk through this valley with me. Hold my hand tonight when courage feels far away.`,

  grief: () =>
    `My heart is hollow in the shape of who I’ve lost. The world feels wrong without them in it.

You are near to the brokenhearted. You count every tear. Carry me through the hours I cannot pray on my own. Hold the parts of me that are still in pieces, and hold the one I love, too. Thank You for the days I had with them.`,

  heartbreak: () =>
    `My heart is splintered, and I’m asking You to do what only You can. Bind up what is broken. Free me from what was never mine to keep. Heal the deep places that words cannot reach.

Make me softer, not harder, through this. Let me come out of this season more like Jesus, not more closed off.`,

  addiction: () =>
    `You know exactly what I’m fighting. You know how loud the pull feels right now and how many times I’ve tried.

Give me strength for today — just today. Show me the way of escape You promised. Surround me with people who will hold me up. Cut off the paths back into what was killing me. Heal the deeper wound underneath the wanting.`,

  exams: () =>
    `I’ve studied as best I could. Now I need a clear mind and a steady heart. Bring back to me what I’ve learned. Quiet the panic.

Remind me that my worth is not a grade on a page. Whatever the result, I am still wholly Yours. I commit this work to You, and trust You with the outcome.`,

  healing: () =>
    `You are the One who binds up wounds — the visible and the invisible. I bring You every part of me that aches.

Touch the body You made. Mend what is broken. Restore what has been worn down. Where the healing is slow, give me patience. Where it is uncertain, give me trust.`,

  family: () =>
    `I lift up the people You have placed in my life. Protect them today. Where there is tension, send peace. Where there is distance, send a way back. Where there is illness, send healing.

Make our home a place where Your name is welcomed. Soften the words we use. Strengthen the bonds we’ve built together.`,

  sleep: () =>
    `The day is over and I’m laying it down. I close my eyes in Your safety.

Quiet my body. Quiet my mind. Give me sleep that is real — the kind You give to those You love. You keep watch when I cannot. I will wake again because You hold the night and the morning.`,

  motivation: () =>
    `I’ve been stalled. The thing I should do feels heavier than it is, and I’ve been hiding from it.

Move me — not with shame, but with grace. Help me take one small step today as worship. Renew my strength like the eagle. Let me run and not be weary, walk and not faint.`,

  forgiveness: () =>
    `I’ve fallen short. You know exactly how, and so do I. I’m not going to dress it up.

Forgive me. Wash me. Make me clean — not just covered, but truly new. And help me forgive those who have wounded me, the way You have forgiven me. Free me from carrying what was never mine to keep.`,

  thankfulness: () =>
    `I want to begin by saying thank You. For the air in my lungs and the people around the table. For the unanswered prayers and the answered ones I forgot to celebrate.

Make my heart grateful, my hands generous, my mouth quick with kind words and slow with complaint. Let gratitude be the soundtrack of my day.`,

  general: (input) =>
    `I bring You what I’m carrying tonight${input.trim() ? ` — especially what I named to You: "${input.trim().slice(0, 160)}"` : ''}.

Meet me here. Quiet what is loud. Strengthen what is weak. Heal what is broken. Lead me one step further into who You are making me to be.`,
};

export type GeneratedPrayer = {
  text: string;
  verse: Verse;
  focus: Intent['focus'];
};

export function generatePrayer(input: string, seed?: number): GeneratedPrayer {
  const intent = detect(input);
  const s = typeof seed === 'number' ? seed : hash(input + Date.now());
  const opening = OPENINGS[s % OPENINGS.length];
  const body = BODY_BY_FOCUS[intent.focus](input);

  // Pull a verse aligned to focus.
  let versePool: Verse[] = [];
  for (const t of intent.topics) versePool.push(...getVersesForTopic(t));
  for (const e of intent.emotions) versePool.push(...getVersesForEmotion(e));
  if (!versePool.length) versePool = VERSES;
  const unique = Array.from(new Map(versePool.map((v) => [v.id, v])).values());
  const verse = unique[s % unique.length];

  const text = `${opening}\n${body}\n\nYour Word reminds me:\n“${verse.text}”\n— ${verse.reference}\n\n${CLOSING}`;
  return { text, verse, focus: intent.focus };
}

function hash(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = (h * 33) ^ s.charCodeAt(i);
  return h | 0;
}
