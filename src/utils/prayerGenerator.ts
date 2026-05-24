// Personalized prayer generator. Takes free-text input describing how the
// user feels or what they need prayer for, returns a multi-paragraph prayer
// with relevant scripture. Template-based with intent routing — same surface
// as the AI engine, swappable for a real LLM later.
//
// V2: Massively expanded vocabulary, abbreviation normalization,
// userName support, and compound-focus blending (e.g. "for my dad who is
// sick" generates a family + healing prayer rather than picking just one).

import { getVersesForEmotion, getVersesForTopic, VERSES, type Verse } from '../data/verses';
import type { EmotionId } from './../data/emotions';
import type { Topic } from '../data/topics';

type Focus =
  | 'anxiety'
  | 'fear'
  | 'grief'
  | 'heartbreak'
  | 'addiction'
  | 'exams'
  | 'healing'
  | 'family'
  | 'sleep'
  | 'motivation'
  | 'forgiveness'
  | 'thankfulness'
  | 'general';

type Intent = {
  emotions: EmotionId[];
  topics: Topic[];
  primary: Focus;
  secondary: Focus | null;
};

/* ─────────────────────── Normalization & vocabulary ─────────────────────── */

const ABBREVIATIONS: Array<[RegExp, string]> = [
  [/\bu\b/gi, 'you'],
  [/\bur\b/gi, 'your'],
  [/\bim\b/gi, "i'm"],
  [/\bdont\b/gi, "don't"],
  [/\bcant\b/gi, "can't"],
  [/\bpls\b/gi, 'please'],
  [/\bplz\b/gi, 'please'],
  [/\bwud\b/gi, 'would'],
  [/\bcuz\b/gi, 'because'],
  [/\bppl\b/gi, 'people'],
  [/\btmrw\b/gi, 'tomorrow'],
  [/\btnite\b/gi, 'tonight'],
  [/\banxoius\b/gi, 'anxious'],
  [/\banxiuos\b/gi, 'anxious'],
  [/\bdepresd\b/gi, 'depressed'],
  [/\bpary\b/gi, 'pray'],
  [/\bprey\b/gi, 'pray'],
  [/\bfro\b/gi, 'for'],
  [/\bovr\b/gi, 'over'],
];

function normalize(input: string): string {
  let t = input.toLowerCase();
  for (const [re, repl] of ABBREVIATIONS) t = t.replace(re, repl);
  return t;
}

const EMOTION_KEYWORDS: Record<EmotionId, string[]> = {
  sad: ['sad', 'down', 'low', 'blue', 'hurt', 'bad day', 'crying', 'tears', 'gloomy', 'heartsick'],
  depressed: ['depress', 'numb', 'empty', 'hollow', 'dark inside', 'nothing matters', 'cant feel', "can't feel"],
  lonely: ['lonely', 'alone', 'no one', 'nobody', 'isolat', 'left out', 'no friends', 'unwanted'],
  heartbroken: ['heartbroken', 'heartbreak', 'breakup', 'broke up', 'left me', 'dumped', 'lost her', 'lost him'],
  angry: ['angry', 'anger', 'mad', 'rage', 'furious', 'hate', 'resent', 'fed up', 'pissed'],
  anxious: ['anx', 'panic', 'worry', 'worried', 'nervous', 'on edge', 'restless', 'cant breathe', 'heart racing'],
  fearful: ['afraid', 'fear', 'scared', 'terrified', 'frightened', 'what if'],
  stressed: ['stress', 'overwhelm', 'too much', 'burned out', 'exhaust', 'drained', 'pressure'],
  unmotivated: ['unmotiv', 'stuck', 'lazy', 'no energy', 'cant start', "can't start", 'procrast'],
  overthinking: ['overthink', 'spiral', 'racing thoughts', 'cant stop thinking', "can't stop thinking", 'ruminat'],
  guilty: ['guilt', 'shame', 'ashamed', 'regret', 'failed', 'mess up', 'messed up', 'my fault'],
  hopeless: ['hopeless', 'no point', 'give up', 'pointless', 'no future', 'no way out'],
  happy: ['happy', 'joy', 'good day', 'great day', 'amazing', 'excited', 'thrilled'],
  thankful: ['thank', 'grateful', 'gratitude', 'blessed', 'appreciate'],
  hopeful: ['hopeful', 'optimistic', 'looking forward', 'cant wait', "can't wait"],
  peaceful: ['peace', 'calm', 'still', 'centered', 'grounded'],
};

const TOPIC_KEYWORDS: Partial<Record<Topic, string[]>> = {
  addiction: ['addict', 'relapse', 'porn', 'drink', 'drinking', 'alcohol', 'drug', 'craving', 'urge', 'sober', 'sobriety', 'clean', 'binge'],
  grief: ['died', 'dead', 'death', 'passed away', 'loss', 'lost him', 'lost her', 'miss them', 'gone', 'funeral', 'grief', 'grieving'],
  heartbreak: ['heartbroken', 'breakup', 'broke up', 'left me', 'dumped'],
  forgiveness: ['forgive', 'sorry', 'sin', 'pardon', 'mercy'],
  exams: ['exam', 'test', 'study', 'school', 'college', 'university', 'final', 'gpa', 'grade', 'placement', 'interview', 'viva'],
  family: [
    'family', 'fam', 'relative', 'relatives', 'household', 'kin',
    // Mother
    'mother', 'mom', 'mommy', 'momma', 'mama', 'mamma',
    'mum', 'mummy', 'mumma',
    'mami', 'maa', 'amma', 'ammi', 'ammachi',
    // Father
    'father', 'dad', 'daddy', 'dada',
    'papa', 'pappa', 'papi',
    'pops', 'baba', 'bappa', 'abba', 'appa', 'appachan',
    // Siblings
    'brother', 'bro', 'brothers', 'bruh',
    'sister', 'sis ', 'sissy', 'sisters',
    'sibling', 'siblings', 'twin', 'twins',
    'chechi', 'chettan',
    'stepbrother', 'stepsister', 'step-brother', 'step-sister',
    // Children
    'son', 'sons', 'sonny',
    'daughter', 'daughters',
    'child', 'children', 'kid', 'kids', 'kiddo',
    'baby', 'babies', 'newborn',
    // Spouse
    'husband', 'hubby', 'wife', 'wifey', 'spouse',
    'fiance', 'fiancee', 'fiancé', 'fiancée',
    // Grandparents
    'grandma', 'grandmother', 'gramma', 'grammy',
    'granny', 'grandy', 'nana', 'nanna', 'nan ', 'nanny',
    'mema', 'meemaw', 'mimi', 'gigi', 'gram',
    'oma', 'nona', 'nonna', 'abuela', 'lola',
    'dadi', 'naani',
    'grandpa', 'grandfather', 'granddad', 'grandad',
    'gramps', 'grampa', 'grampy', 'grandpop',
    'pop-pop', 'papaw', 'pawpaw',
    'opa', 'nonno', 'abuelo', 'lolo',
    // Aunts / uncles
    'aunt', 'auntie', 'aunty', 'uncle', 'tio', 'tia',
    'chacha', 'mausa', 'bua', 'masi',
    // Cousins / nieces / nephews
    'cousin', 'cousins', 'niece', 'nephew',
    // In-laws
    'in-law', 'in-laws', 'in law', 'in laws',
    'mother-in-law', 'father-in-law',
    'sister-in-law', 'brother-in-law',
    // Step / foster / godparents
    'stepmom', 'step-mom', 'stepdad', 'step-dad',
    'foster mom', 'foster dad', 'foster parent',
    'godfather', 'godmother', 'godparent',
    'adopted', 'adoptive',
  ],
  sleep: ['sleep', 'cant sleep', "can't sleep", 'insomnia', 'bedtime', 'rest', 'nightmare'],
  healing: ['heal', 'wound', 'sick', 'illness', 'recover', 'cancer', 'hospital', 'pain', 'chronic', 'disease'],
  motivation: ['motivat', 'discipline', 'goal', 'stuck', 'lazy'],
  thankfulness: ['blessed', 'grateful'],
};

function detect(input: string): Intent {
  const t = normalize(input);
  const emotions: EmotionId[] = [];
  for (const id of Object.keys(EMOTION_KEYWORDS) as EmotionId[]) {
    if (EMOTION_KEYWORDS[id].some((kw) => t.includes(kw))) emotions.push(id);
  }
  const topics: Topic[] = [];
  for (const id of Object.keys(TOPIC_KEYWORDS) as Topic[]) {
    if ((TOPIC_KEYWORDS[id] ?? []).some((kw) => t.includes(kw))) topics.push(id);
  }

  // Priority order — first match wins for the *primary* focus.
  const candidates: Focus[] = [];
  if (topics.includes('addiction')) candidates.push('addiction');
  if (topics.includes('grief')) candidates.push('grief');
  if (topics.includes('heartbreak') || emotions.includes('heartbroken')) candidates.push('heartbreak');
  if (topics.includes('exams')) candidates.push('exams');
  if (topics.includes('healing')) candidates.push('healing');
  if (topics.includes('family')) candidates.push('family');
  if (topics.includes('sleep')) candidates.push('sleep');
  if (topics.includes('forgiveness') || emotions.includes('guilty')) candidates.push('forgiveness');
  if (emotions.includes('thankful') || topics.includes('thankfulness')) candidates.push('thankfulness');
  if (emotions.includes('anxious') || emotions.includes('overthinking')) candidates.push('anxiety');
  if (emotions.includes('fearful')) candidates.push('fear');
  if (emotions.includes('unmotivated')) candidates.push('motivation');

  const primary: Focus = candidates[0] ?? 'general';
  // Secondary focus: pick the next candidate if distinct (used for blended
  // prayers like "for my dad who is sick" → family + healing).
  const secondary: Focus | null = candidates.find((c) => c !== primary) ?? null;

  return { emotions, topics, primary, secondary };
}

/* ────────────────────────────── Templates ───────────────────────────────── */

const OPENINGS = [
  'Father,',
  'Lord,',
  'Heavenly Father,',
  'God of all comfort,',
  'Abba Father,',
  'Gracious God,',
  'Lord Jesus,',
  'Father in heaven,',
];

const CLOSING = 'In Jesus’ name I pray, Amen.';

type Block = (input: string, name?: string) => string;

const BODY_BY_FOCUS: Record<Focus, Block> = {
  anxiety: (_, name) =>
    `${name ? `I come to You as ${name}, and m` : 'M'}y mind is racing tonight. I'm carrying things You never asked me to carry. I bring You every worry — the small ones I'm embarrassed by and the loud ones I cannot name.

Quiet the storm inside me. Steady my breath. Replace each anxious thought with one true thing about who You are. Let Your peace, which surpasses understanding, guard my heart and my thoughts in You.`,

  fear: (_, name) =>
    `${name ? `I am ${name}, and I am afraid.` : "I'm afraid,"} The fear is making everything feel bigger than it is. Remind me whose I am. Remind me that You did not give me a spirit of fear, but of power, love, and a sound mind.

Walk through this valley with me. Hold my hand tonight when courage feels far away.`,

  grief: (_, name) =>
    `${name ? `${name} comes to You with a hollow heart` : 'My heart is hollow'} in the shape of who I've lost. The world feels wrong without them in it.

You are near to the brokenhearted. You count every tear. Carry me through the hours I cannot pray on my own. Hold the parts of me that are still in pieces, and hold the one I love, too. Thank You for the days I had with them.`,

  heartbreak: (_, name) =>
    `${name ? `${name}'s heart is splintered,` : 'My heart is splintered,'} and I'm asking You to do what only You can. Bind up what is broken. Free me from what was never mine to keep. Heal the deep places that words cannot reach.

Make me softer, not harder, through this. Let me come out of this season more like Jesus, not more closed off.`,

  addiction: (_, name) =>
    `${name ? `You know ${name} by name, and You know exactly what I'm fighting.` : "You know exactly what I'm fighting."} You know how loud the pull feels right now and how many times I've tried.

Give me strength for today — just today. Show me the way of escape You promised. Surround me with people who will hold me up. Cut off the paths back into what was killing me. Heal the deeper wound underneath the wanting.`,

  exams: (_, name) =>
    `${name ? `I am ${name}, and I've` : "I've"} studied as best I could. Now I need a clear mind and a steady heart. Bring back to me what I've learned. Quiet the panic.

Remind me that my worth is not a grade on a page. Whatever the result, I am still wholly Yours. I commit this work to You, and trust You with the outcome.`,

  healing: (_, name) =>
    `${name ? `You see ${name} and every ache I carry.` : 'You are the One who binds up wounds — the visible and the invisible.'} I bring You every part of me that aches.

Touch the body You made. Mend what is broken. Restore what has been worn down. Where the healing is slow, give me patience. Where it is uncertain, give me trust.`,

  family: (_, name) =>
    `${name ? `${name} comes to You for the people You've placed in my life.` : 'I lift up the people You have placed in my life.'} Protect them today. Where there is tension, send peace. Where there is distance, send a way back. Where there is illness, send healing.

Make our home a place where Your name is welcomed. Soften the words we use. Strengthen the bonds we've built together.`,

  sleep: (_, name) =>
    `The day is over and ${name ? name : 'I'} ${name ? 'is' : 'am'} laying it down. I close my eyes in Your safety.

Quiet my body. Quiet my mind. Give me sleep that is real — the kind You give to those You love. You keep watch when I cannot. I will wake again because You hold the night and the morning.`,

  motivation: (_, name) =>
    `${name ? `${name} has` : "I've"} been stalled. The thing I should do feels heavier than it is, and I've been hiding from it.

Move me — not with shame, but with grace. Help me take one small step today as worship. Renew my strength like the eagle. Let me run and not be weary, walk and not faint.`,

  forgiveness: (_, name) =>
    `${name ? `${name} comes to You having fallen short.` : "I've fallen short."} You know exactly how, and so do I. I'm not going to dress it up.

Forgive me. Wash me. Make me clean — not just covered, but truly new. And help me forgive those who have wounded me, the way You have forgiven me. Free me from carrying what was never mine to keep.`,

  thankfulness: (_, name) =>
    `${name ? `${name} wants to begin` : 'I want to begin'} by saying thank You. For the air in my lungs and the people around the table. For the unanswered prayers and the answered ones I forgot to celebrate.

Make my heart grateful, my hands generous, my mouth quick with kind words and slow with complaint. Let gratitude be the soundtrack of my day.`,

  general: (input, name) =>
    `${name ? `${name} brings` : 'I bring'} You what I'm carrying tonight${input.trim() ? ` — especially what I named to You: "${input.trim().slice(0, 160)}"` : ''}.

Meet me here. Quiet what is loud. Strengthen what is weak. Heal what is broken. Lead me one step further into who You are making me to be.`,
};

/* ──────────────────────────────── Public ────────────────────────────────── */

export type GeneratePrayerOptions = {
  /** User's display name (from Settings → Profile). Woven into the prayer
   *  text where it flows naturally; falls back to "I/me" if unset. */
  userName?: string;
};

export type GeneratedPrayer = {
  text: string;
  verse: Verse;
  focus: Focus;
  secondaryFocus: Focus | null;
};

export function generatePrayer(
  input: string,
  seed?: number,
  opts: GeneratePrayerOptions = {},
): GeneratedPrayer {
  const intent = detect(input);
  const s = typeof seed === 'number' ? seed : hash(input + Date.now());
  const opening = OPENINGS[Math.abs(s) % OPENINGS.length];
  const name = opts.userName?.trim() || undefined;

  // Primary body, always rendered.
  const primaryBody = BODY_BY_FOCUS[intent.primary](input, name);

  // If a distinct secondary focus exists, append a short blended bridge
  // ("And as I lift this up, I also bring You…") then the secondary body.
  let body = primaryBody;
  if (intent.secondary && intent.secondary !== intent.primary) {
    const bridge = pickBridge(intent.secondary, s + 11);
    const secondaryBody = BODY_BY_FOCUS[intent.secondary](input, name);
    body = `${primaryBody}\n\n${bridge}\n\n${secondaryBody}`;
  }

  // Pull a verse aligned to focus + emotions + topics.
  let versePool: Verse[] = [];
  for (const t of intent.topics) versePool.push(...getVersesForTopic(t));
  for (const e of intent.emotions) versePool.push(...getVersesForEmotion(e));
  if (!versePool.length) versePool = VERSES;
  const unique = Array.from(new Map(versePool.map((v) => [v.id, v])).values());
  const verse = unique[Math.abs(s) % unique.length];

  const text = `${opening}\n${body}\n\nYour Word reminds me:\n“${verse.text}”\n— ${verse.reference}\n\n${CLOSING}`;
  return {
    text,
    verse,
    focus: intent.primary,
    secondaryFocus: intent.secondary,
  };
}

function pickBridge(secondary: Focus, seed: number): string {
  const bridges: Record<Focus, string[]> = {
    healing: [
      'And as I lay this down, I also bring You the body and the pain underneath it.',
      'And while I pray, I ask You to touch what hurts in me — body and soul.',
    ],
    family: [
      'And I lift up the people closest to me — bind us together in Your love.',
      'And while we are here, I bring You the family You gave me.',
    ],
    addiction: [
      'And You know what I am fighting. Strengthen me today, just today.',
      'And cut off the path back into what was killing me.',
    ],
    grief: [
      'And I bring You the one I have lost. Hold them, and hold me.',
      'And I lay down the grief I have been carrying alone.',
    ],
    heartbreak: [
      'And I bring You the heart-pain that words cannot reach.',
      'And bind up what is broken in me.',
    ],
    forgiveness: [
      'And forgive me where I have fallen. Make me clean.',
      'And free me from carrying what was never mine to keep.',
    ],
    anxiety: [
      'And quiet the storm in my mind.',
      'And replace each anxious thought with one true thing about You.',
    ],
    fear: [
      'And remind me whose I am — that I was not given a spirit of fear.',
      'And walk with me through what I am afraid of.',
    ],
    sleep: [
      'And give me sleep that is real tonight.',
      'And let me rest in Your safety.',
    ],
    motivation: [
      'And move me, not with shame but with grace.',
      'And help me take one small step today as worship.',
    ],
    thankfulness: [
      'And make my heart grateful through it all.',
      'And let gratitude be the soundtrack of my day.',
    ],
    exams: [
      'And steady my heart and mind for what is ahead.',
      'And remind me my worth is not a grade.',
    ],
    general: [
      'And meet me in this exactly as I am.',
      'And lead me one step further into who You are making me to be.',
    ],
  };
  const pool = bridges[secondary] ?? bridges.general;
  return pool[Math.abs(seed) % pool.length];
}

function hash(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = (h * 33) ^ s.charCodeAt(i);
  return h | 0;
}
