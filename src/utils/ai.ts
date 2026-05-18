// Companion engine. Multi-signal intent detection + varied, emotion-specific
// responses. Tracks (lightly) what was said recently so it can naturally
// suggest prayer without spamming the user. Stateless interface — the caller
// passes a short tail of past assistant messages so we can avoid repetition.

import { VERSES, getVersesForEmotion, getVersesForTopic, type Verse } from '../data/verses';
import { EMOTIONS, type Emotion, type EmotionId } from '../data/emotions';
import { AFFIRMATIONS } from '../data/affirmations';
import { PRAYERS, type Prayer, type PrayerCategory } from '../data/prayers';
import type { Topic } from '../data/topics';

/* ─────────────────────────── Intent detection ─────────────────────────── */

type Severity = 'high' | 'medium' | 'low';

type Intent = {
  emotions: EmotionId[];
  topics: Topic[];
  severity: Severity;
  isCrisis: boolean;
  isThankful: boolean;
  primary:
    | 'anxiety'
    | 'fear'
    | 'sadness'
    | 'depression'
    | 'heartbreak'
    | 'loneliness'
    | 'anger'
    | 'guilt'
    | 'addiction'
    | 'grief'
    | 'unmotivated'
    | 'overthinking'
    | 'thankfulness'
    | 'general';
};

const EMOTION_KEYWORDS: Record<EmotionId, string[]> = {
  sad: ['sad', 'sadness', 'down', 'crying', 'tears', 'low', 'blue', 'hurt', 'bad day'],
  depressed: ['depress', 'numb', 'empty', 'hollow', 'dark', 'nothing matters', 'cant feel'],
  lonely: ['lonely', 'alone', 'isolat', 'no one', 'nobody', 'left out', 'no friends'],
  heartbroken: ['heartbroken', 'breakup', 'broke up', 'left me', 'lost her', 'lost him', 'dumped', 'ex '],
  angry: ['angry', 'anger', 'furious', 'rage', 'mad', 'hate', 'pissed', 'resent'],
  anxious: ['anx', 'panic', 'worry', 'worried', 'nervous', 'on edge', 'restless'],
  fearful: ['afraid', 'fear', 'scared', 'terrified', 'frightened'],
  stressed: ['stress', 'overwhelm', 'too much', 'burned out', 'exhaust', 'drained'],
  unmotivated: ['unmotiv', 'lazy', 'cant start', 'stuck', 'procrast', 'no energy', 'no will'],
  overthinking: ['overthink', 'spiral', 'cant stop thinking', 'racing thoughts', 'ruminat'],
  guilty: ['guilt', 'shame', 'ashamed', 'failed', 'mess up', 'messed up', 'regret'],
  hopeless: ['hopeless', 'pointless', 'no point', 'give up', 'whats the point', 'no future'],
  happy: ['happy', 'joy', 'good day', 'great day', 'amazing day', 'excited'],
  thankful: ['thank', 'grateful', 'gratitude', 'blessed', 'appreciate'],
  hopeful: ['hopeful', 'optimistic', 'looking forward', 'excited about'],
  peaceful: ['peace', 'calm', 'still', 'quiet inside'],
};

const TOPIC_KEYWORDS: Partial<Record<Topic, string[]>> = {
  addiction: ['addict', 'relapse', 'porn', 'drink', 'drug', 'gambling', 'binge'],
  temptation: ['temptation', 'tempted', 'urge', 'craving', 'pull', 'wanting to'],
  forgiveness: ['forgive', 'forgiveness', 'sorry', 'sin', 'pardon'],
  grief: ['died', 'death', 'loss', 'lost', 'grief', 'miss them', 'gone', 'funeral'],
  healing: ['heal', 'healing', 'wound', 'sick', 'illness', 'recover'],
  exams: ['exam', 'test', 'study', 'school', 'college', 'university', 'final', 'grade'],
  // No trailing spaces — those prevent matches at the end of a sentence.
  family: ['family', 'parent', 'parents', 'mom', 'mum', 'mother', 'dad', 'father', 'sister', 'brother', 'kids', 'son', 'daughter', 'husband', 'wife'],
  friendship: ['friend', 'friendship', 'bestie', 'buddy'],
  love: ['in love', 'relationship', 'boyfriend', 'girlfriend', 'partner'],
  failure: ['failed', 'failure', 'failing', 'screwed up', 'messed up'],
  success: ['promotion', 'got the job', 'succeeded', 'won', 'achieved'],
  sleep: ['sleep', 'cant sleep', 'insomnia', 'tired', 'rest', 'bedtime'],
  burnout: ['burnt out', 'burned out', 'burnout', 'exhausted', 'drained'],
  identity: ['who am i', 'identity', 'worth', 'enough', 'good enough'],
  selfWorth: ['worthless', 'no good', 'useless', 'unloved', 'unlovable'],
  doubt: ['doubt', 'doubting', 'not sure if god', 'is god real'],
  spiritualWarfare: ['spiritual attack', 'enemy', 'devil', 'darkness'],
  purpose: ['purpose', 'meaning', 'why am i here', 'calling'],
  recovery: ['recovery', 'getting better', 'on the mend'],
  patience: ['waiting', 'wait', 'patient', 'how long'],
  faith: ['faith', 'believe', 'trust god'],
  thankfulness: ['blessed', 'gratitude', 'grateful'],
};

const CRISIS_PATTERNS = [
  /\bsuicide\b/,
  /\bkill\s*myself\b/,
  /\bend\s+(my\s+)?life\b/,
  /\bnot\s+want\s+to\s+live\b/,
  /\bself[\s-]?harm\b/,
  /\bhurt\s+myself\b/,
];

// Profanity check. We keep this list short and only flag standalone uses of
// strong words so legitimate mentions ("damaged", "passion") aren't caught.
// Crisis and self-directed phrases (handled above) take precedence.
const PROFANITY_PATTERNS = [
  /\b(fuck|fucking|fucker)\b/i,
  /\b(shit|shitty|bullshit)\b/i,
  /\b(bitch|bitches|bitchy)\b/i,
  /\b(asshole|assholes|dickhead)\b/i,
  /\b(cunt|twat)\b/i,
  /\b(motherfucker|motherfucking)\b/i,
  /\bf[\*\W_]ck/i,
  /\bs[\*\W_]+t\b/i,
];

// Capability requests we don't (yet) support — distinguished from purely
// off-topic questions so we can give a clearer "work in progress" reply.
const FEATURE_REQUEST_PATTERNS = [
  /\b(remind|reminder|alarm|wake me)\b/,
  /\b(play|stream|put on)\s+(music|song|worship|audio|playlist)\b/,
  /\b(call|phone|text|message)\s+(someone|my|the)\b/,
  /\b(remember|memorize|save|note down)\s+(my|that|this)\b/,
  /\b(book|schedule|reserve|appointment)\b/,
  /\b(can you|could you)\s+(.*?)\s+(for me|please)/,
  /\b(download|export|share|upload)\b/,
];

const PROFANITY_REPLY = "Let's keep our conversation respectful and positive.";
const UNKNOWN_REPLY = "I'm still improving and learning. I may not understand this yet.";
const FEATURE_REPLY = 'This feature is still a work in progress.';

// Common texting / informal abbreviations expanded before intent detection so
// "can u pray for my dad" reaches the same code path as "can you pray for my
// dad".
const ABBREVIATIONS: Array<[RegExp, string]> = [
  [/\bu\b/gi, 'you'],
  [/\bur\b/gi, 'your'],
  [/\bpls\b/gi, 'please'],
  [/\bplz\b/gi, 'please'],
  [/\bplease\s+plz\b/gi, 'please'],
  [/\bwud\b/gi, 'would'],
  [/\bwat\b/gi, 'what'],
  [/\bcuz\b/gi, 'because'],
  [/\bppl\b/gi, 'people'],
  [/\btmrw\b/gi, 'tomorrow'],
  [/\btnite\b/gi, 'tonight'],
  [/\bcudnt\b/gi, "couldn't"],
  [/\bidk\b/gi, "i don't know"],
];

function normalizeInput(input: string): string {
  let t = input;
  for (const [re, repl] of ABBREVIATIONS) t = t.replace(re, repl);
  return t;
}

// "pray for", "pray over", "could you pray", "say a prayer for", etc.
const PRAYER_REQUEST_PATTERNS = [
  /\b(can|could|would|will)\s+you\s+pray\b/i,
  /\bpray\s+(?:for|over|with)\b/i,
  /\bsay\s+(?:a\s+)?prayer\b/i,
  /\bi\s+need\s+(?:a\s+)?prayer\b/i,
  /\bplease\s+pray\b/i,
  /\blift\s+\w+\s+up\s+in\s+prayer\b/i,
  /\bprayer\s+for\b/i,
];

export function isPrayerRequest(input: string): boolean {
  const t = normalizeInput(input);
  return PRAYER_REQUEST_PATTERNS.some((re) => re.test(t));
}

/** Pull the subject of a prayer request out of the input — "my dad", "you",
 *  "our family", a name, etc. Adjusts pronouns so the prayer reads naturally
 *  back to the user ("my dad" → "your dad", "me" → "you"). */
function extractPrayerSubject(input: string): string {
  const t = normalizeInput(input).toLowerCase();
  let m = t.match(/\bpray(?:er)?\s+(?:for|over|with)\s+([^.!?,;]+)/i);
  if (!m) m = t.match(/\bpray\s+(?:that|about)\s+([^.!?]+)/i);
  if (!m) return 'you';
  let subject = m[1].trim();
  // Strip trailing politeness/timing words.
  subject = subject
    .replace(/\s+(please|tonight|today|right now|now)$/i, '')
    .trim();
  if (!subject) return 'you';
  if (subject === 'me' || subject === 'myself' || subject === 'i') return 'you';
  // First-person possessives become second-person so the prayer addresses the
  // user about *their* loved one.
  subject = subject.replace(/^my\s+/, 'your ');
  subject = subject.replace(/^our\s+/, 'your ');
  if (subject.length > 70) subject = subject.slice(0, 70).trim() + '…';
  return subject;
}

const INTERCESSION_VERSES = [
  {
    reference: 'Numbers 6:24-26',
    text: 'The Lord bless you and keep you; the Lord make his face shine on you and be gracious to you; the Lord turn his face toward you and give you peace.',
  },
  {
    reference: 'Philippians 4:6-7',
    text: 'Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God. And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus.',
  },
  {
    reference: 'Isaiah 41:10',
    text: 'So do not fear, for I am with you; do not be dismayed, for I am your God. I will strengthen you and help you; I will uphold you with my righteous right hand.',
  },
  {
    reference: 'Psalm 91:11',
    text: 'For he will command his angels concerning you to guard you in all your ways.',
  },
  {
    reference: 'James 5:16',
    text: 'Pray for each other so that you may be healed. The prayer of a righteous person is powerful and effective.',
  },
];

function buildIntercession(
  subject: string,
  seed: number,
): { acknowledgment: string; prayer: string; verse: { text: string; reference: string } } {
  const isUser = subject === 'you';
  const acknowledgment = isUser
    ? "Of course. Let's pray together right now."
    : `Of course — let's bring ${subject} to God.`;
  const prayer = isUser
    ? `Father, I come before You holding the heart of the one praying right now. You see them exactly where they are tonight — what they came here carrying, what they have not been able to say out loud. Meet them in it. Strengthen them. Comfort them. Quiet what is loud and heal what is hurting. Remind them they are not alone — that You are nearer than the air in their lungs.`
    : `Father, I lift up ${subject} to You. You know them by name and love them more than any of us ever could. Wherever they are today — whatever burden, whatever hope, whatever fear they cannot speak — meet them there. Strengthen them in body and spirit. Surround them with Your peace. Soften the hard places, brighten the dark ones, and draw them close to You.`;
  const verse = INTERCESSION_VERSES[Math.abs(seed) % INTERCESSION_VERSES.length];
  return { acknowledgment, prayer, verse };
}

const OUT_OF_SCOPE_PATTERNS = [
  /\b(code|coding|program|programming|debug|javascript|python|java|c\+\+|html|css|api|sql|algorithm|compile|function|variable|array|object|loop|syntax|server|database)\b/,
  /\b(weather|forecast|temperature|humidity|rain today)\b/,
  /\b(recipe|cook|cooking|ingredient|bake|baking)\b/,
  /\b(math|equation|calculate|solve|integral|derivative|geometry|algebra)\b/,
  /\b(translate|translation|language learning|spanish|french|german)\b/,
  /\b(stock|crypto|bitcoin|investment|trading|portfolio)\b/,
  /\b(news|politics|election|president|sports score|game result)\b/,
  /\b(movie|tv show|netflix|game review|video game|gaming|anime)\b/,
  /\b(joke|riddle|trivia|fun fact)\b/,
  /\b(book a flight|hotel|directions|map|gps|navigation)\b/,
];

const IN_SCOPE_TERMS = [
  'god', 'jesus', 'christ', 'lord', 'pray', 'prayer', 'faith', 'bible', 'verse', 'scripture',
  'holy', 'spirit', 'soul', 'grace', 'mercy', 'sin', 'church', 'worship', 'heaven',
  'feel', 'feeling', 'felt', 'heart', 'cry', 'tired', 'hurt', 'pain', 'broken',
  'love', 'family', 'friend', 'relationship', 'mom', 'dad', 'parent', 'sister', 'brother',
  'recover', 'healing', 'heal', 'sober', 'addict', 'urge', 'relapse', 'craving',
  'discipline', 'habit', 'streak', 'goal', 'motivat', 'purpose', 'better',
  'help', 'support', 'need', 'want', 'thank', 'thanks', 'sorry', 'forgive',
  'hi', 'hello', 'hey', 'morning', 'evening', 'night', 'today',
];

function detectIntent(text: string): Intent {
  const t = text.toLowerCase();
  const emotions: EmotionId[] = [];
  for (const id of Object.keys(EMOTION_KEYWORDS) as EmotionId[]) {
    if (EMOTION_KEYWORDS[id].some((kw) => t.includes(kw))) emotions.push(id);
  }
  const topics: Topic[] = [];
  for (const id of Object.keys(TOPIC_KEYWORDS) as Topic[]) {
    if ((TOPIC_KEYWORDS[id] ?? []).some((kw) => t.includes(kw))) topics.push(id);
  }

  const intensifiers = ['really', 'so ', 'very', 'extremely', 'completely', 'totally', 'cant', "can't", 'never'];
  const hits = intensifiers.reduce((s, w) => (t.includes(w) ? s + 1 : s), 0);
  const isCrisis = CRISIS_PATTERNS.some((re) => re.test(t));
  const severity: Severity = isCrisis ? 'high' : hits >= 2 ? 'high' : hits === 1 ? 'medium' : 'low';

  let primary: Intent['primary'] = 'general';
  if (topics.includes('addiction') || topics.includes('temptation')) primary = 'addiction';
  else if (topics.includes('grief')) primary = 'grief';
  else if (emotions.includes('heartbroken')) primary = 'heartbreak';
  else if (emotions.includes('anxious') || emotions.includes('overthinking')) primary = 'anxiety';
  else if (emotions.includes('fearful')) primary = 'fear';
  else if (emotions.includes('depressed')) primary = 'depression';
  else if (emotions.includes('lonely')) primary = 'loneliness';
  else if (emotions.includes('angry')) primary = 'anger';
  else if (emotions.includes('guilty')) primary = 'guilt';
  else if (emotions.includes('unmotivated')) primary = 'unmotivated';
  else if (emotions.includes('sad') || emotions.includes('hopeless')) primary = 'sadness';
  else if (emotions.includes('thankful') || topics.includes('thankfulness')) primary = 'thankfulness';

  return {
    emotions,
    topics,
    severity,
    isCrisis,
    isThankful: primary === 'thankfulness',
    primary,
  };
}

export function isOutOfScope(input: string): boolean {
  const t = input.toLowerCase();
  if (t.trim().split(/\s+/).length < 3) return false;
  const matchesOOS = OUT_OF_SCOPE_PATTERNS.some((re) => re.test(t));
  if (!matchesOOS) return false;
  return !IN_SCOPE_TERMS.some((term) => t.includes(term));
}

export function isProfane(input: string): boolean {
  return PROFANITY_PATTERNS.some((re) => re.test(input));
}

export function isFeatureRequest(input: string): boolean {
  const t = input.toLowerCase();
  return FEATURE_REQUEST_PATTERNS.some((re) => re.test(t));
}

/* ───────────────────── Empathetic response building ───────────────────── */

type ToneVariants = {
  openers: string[];
  bodies: string[];
  followUps: string[];
};

// Each primary intent gets its own pool. Openers are short and sympathetic;
// bodies are 1-2 sentences of grounded comfort; follow-ups are gentle
// invitations (sometimes asking the user something back).
const TONE: Record<Intent['primary'], ToneVariants> = {
  anxiety: {
    openers: [
      'That sounds really heavy. Anxiety can feel like the air around you got tighter.',
      'I hear you. A racing mind is its own kind of exhausting.',
      'It makes sense that you’re feeling this — the world doesn’t always slow down with us.',
      'Anxiety can feel like a thousand small voices at once. You don’t have to listen to them all.',
      'That tightness you’re describing is real. Let’s take one breath together.',
    ],
    bodies: [
      'You don’t have to solve everything tonight. Just the next ten minutes. Then the ten after that.',
      'Try this: name three things you can see, two you can touch, one you’re thankful for. Anxiety hates being grounded.',
      'Whatever the worst-case is playing in your head right now — it is one possibility, not the only one. God already knows the others.',
      'You are not what your thoughts say about you. You are who Christ says you are.',
    ],
    followUps: [
      'Would you like me to create a prayer for you to carry into the next hour? ✝️',
      'If you want, I can put words to this in a prayer for you. Would that help?',
      'Want us to lay this down in a prayer together?',
    ],
  },
  fear: {
    openers: [
      'Uncertainty can feel overwhelming, especially when so many things feel unclear.',
      'Fear has a way of making everything feel bigger than it is. I’m glad you said it out loud.',
      'I’m here. Whatever you’re facing, you’re not facing it alone.',
      'That kind of fear is real, and it doesn’t make you weak — it makes you honest.',
    ],
    bodies: [
      'You were not given a spirit of fear, but of power, love, and a sound mind. That is in you already.',
      'God already knows what tomorrow holds. He goes ahead of you into it.',
      'You only have to walk through this one step at a time. The valley has an end.',
      'Courage isn’t the absence of fear. It’s faith that takes the next small step anyway.',
    ],
    followUps: [
      'Would you like me to create a prayer for what you’re afraid of? ✝️',
      'Want us to bring this fear to God together in a prayer?',
      'If it helps, I can write a prayer for you to hold onto.',
    ],
  },
  heartbreak: {
    openers: [
      'That sounds painful, and heartbreak can feel incredibly heavy. You don’t have to carry everything by yourself. I’m here with you.',
      'I’m so sorry. Heartbreak is its own kind of grief — your whole body feels it.',
      'That kind of hurt is real. Don’t let anyone — including yourself — rush you through it.',
      'I’m sitting with you in this. There’s no clock on what you’re feeling.',
    ],
    bodies: [
      'God is near to the brokenhearted. Not at a distance — close, and patient, and unhurried.',
      'Every tear is counted. None of this is lost on Him.',
      'You don’t have to be okay to be loved. He has you, exactly as you are tonight.',
      'Healing rarely comes in straight lines. Some days will surprise you. Most won’t. Both are okay.',
    ],
    followUps: [
      'Would you like me to create a prayer for this hurt? ✝️',
      'Want me to put what you’re feeling into a prayer you can return to?',
      'If you’d like, we can bring this heart-pain to God together.',
    ],
  },
  loneliness: {
    openers: [
      'Loneliness is one of the heaviest weights, especially when you’re surrounded by people who don’t see you.',
      'I’m sorry — feeling unseen hurts in a way few things do.',
      'That ache is real. Being lonely isn’t the same as being unloved, but tonight it can feel that way.',
    ],
    bodies: [
      'You are not alone, even when it feels that way. There is no room in the universe that is empty of Him.',
      'God knows your name. He calls you His. That belonging doesn’t flicker.',
      'He sets the lonely in families. He hasn’t forgotten about you.',
    ],
    followUps: [
      'Would you like me to create a prayer for you tonight? ✝️',
      'Want us to bring this loneliness to God in a prayer?',
    ],
  },
  sadness: {
    openers: [
      'A bad day can sit on your chest like a weight. I’m glad you said something.',
      'That sounds hard. You don’t have to dress it up — say it as it is.',
      'I hear you. Some days are just heavier than others.',
      'I’m really glad you came here. You don’t have to perform anything with me.',
    ],
    bodies: [
      'Weeping may stay for the night, but joy comes in the morning. The night is real, and so is the morning.',
      'Your sadness isn’t a failure of faith. It’s the honest weight of being human in a broken world.',
      'God doesn’t avoid your sadness — He draws closer to it. He’s near tonight, even if it doesn’t feel like it.',
    ],
    followUps: [
      'Would you like me to create a prayer for tonight? ✝️',
      'Want us to bring this day to God together?',
    ],
  },
  depression: {
    openers: [
      'That kind of weight is so hard to describe, and I’m sorry you’re carrying it.',
      'I hear you. Sometimes everything just feels far away.',
      'Thank you for being honest with me. That itself is brave.',
      'I’m not going to rush past what you just said. Stay with me.',
    ],
    bodies: [
      'God is near to the brokenhearted. Close, patient, and not asking you to perform anything tonight.',
      'You don’t have to feel better to be loved by Him. Just stay close. The light comes back.',
      'Even small steps tonight count as worship. Drinking water. Going to bed. None of it is too small for Him to see.',
    ],
    followUps: [
      'Would you like me to create a prayer for tonight? ✝️',
      'If it helps, I can write you a prayer to hold onto.',
    ],
  },
  anger: {
    openers: [
      'Anger usually means something mattered. I’m glad you said it out loud instead of swallowing it.',
      'That sounds like a lot to be carrying. It’s okay to be angry — it’s information, not a sin.',
      'I hear you. Anger that gets ignored doesn’t go away — it just goes underground.',
    ],
    bodies: [
      'Be slow. Slow your breath, slow your tongue. The most powerful response is rarely the loudest.',
      'Let God handle the justice. Your job is to keep your hands soft and your tongue slow.',
      'You can be angry without sinning. Don’t let the sun go down on it.',
    ],
    followUps: [
      'Would you like to bring this anger to God in a prayer? ✝️',
      'Want me to put words to this in a prayer for you?',
    ],
  },
  guilt: {
    openers: [
      'Carrying guilt is exhausting. I’m glad you didn’t bury it.',
      'I hear the weight in what you said. Shame is one of the heaviest things a person can carry alone.',
      'You don’t have to perform repentance with me. Just tell me what it really is.',
    ],
    bodies: [
      'The guilt has a shelf life, and it has already expired in His eyes. He doesn’t want you to crawl — He wants you back at the table.',
      'There is no condemnation for those who are in Christ. None. Not less. None.',
      'East is from west. That is the distance He has placed between you and what you did.',
    ],
    followUps: [
      'Would you like me to write you a prayer of confession and freedom? ✝️',
      'Want us to lay this down together?',
    ],
  },
  addiction: {
    openers: [
      'I hear how loud the pull is right now. The fact that you came here instead of giving in is already a small win.',
      'I’m not going to lecture you. You know. Let’s just walk through this hour together.',
      'Reaching out in the middle of the pull is one of the bravest things you can do.',
    ],
    bodies: [
      'You don’t have to win the war tonight. Just the next ten minutes. Then the ten after that. That’s how this gets walked through.',
      'God already drew the map of the way of escape. Look up — He’s shown you the door before.',
      'The wave will pass. It always does. And you will still be you on the other side.',
    ],
    followUps: [
      'Would you like me to create a prayer for right now, in this moment? ✝️',
      'Want us to bring this craving to God before we do anything else?',
    ],
  },
  grief: {
    openers: [
      'I’m so sorry. Grief is love with nowhere to land — it hurts because it was real.',
      'There’s no rushing this, and I’m not going to. I’ll sit here with you.',
      'I hear you. Missing someone is its own kind of weight.',
    ],
    bodies: [
      'God is close to the brokenhearted. He counts every tear — none are wasted on Him.',
      'You don’t have to be okay. You just have to be here, and you are.',
      'Some days the loss will surprise you. That’s not regression — that’s love still doing its work.',
    ],
    followUps: [
      'Would you like me to write you a prayer for tonight? ✝️',
      'Want us to bring this grief to God together?',
    ],
  },
  unmotivated: {
    openers: [
      'That stalled-out feeling is real. It’s not laziness — it’s usually fear or exhaustion underneath.',
      'I hear you. Sometimes the thing you should do feels heavier than it is.',
      'I get it. The hardest part of momentum is starting.',
    ],
    bodies: [
      'You don’t need a dramatic turnaround. You need one small next step taken in the right direction.',
      'Waiting on God is not idleness. It’s how new strength enters tired bones.',
      'A small obedience today is worth more than a perfect plan tomorrow.',
    ],
    followUps: [
      'Want me to create a prayer to ask for strength for the next small step?',
      'Would a prayer for renewed energy help right now? ✝️',
    ],
  },
  overthinking: {
    openers: [
      'A spiraling mind is exhausting. I’m glad you slowed down enough to come here.',
      'Overthinking is loud. You don’t have to be at the mercy of every thought.',
      'I hear you. The same loop, over and over — it’s draining.',
    ],
    bodies: [
      'You can take a thought captive. One at a time. You are not what your loudest thought says about you.',
      'Peace is not the absence of thought. It’s a mind anchored on the right Thing while everything else spins.',
      'Try filling your mind instead of trying to empty it. Choose well what you give your attention to.',
    ],
    followUps: [
      'Want me to write you a prayer to quiet the loop?',
      'Would you like a prayer for stillness right now? ✝️',
    ],
  },
  thankfulness: {
    openers: [
      'That makes me smile. Thank you for naming it out loud — gratitude grows when you do that.',
      'Beautiful. Noticing the good is its own kind of worship.',
      'I love that you said that. Keep tracing the good gifts back to the Giver.',
    ],
    bodies: [
      'Every good gift comes from above. Trace it back — you’ll keep ending up at the same Person.',
      'In everything give thanks, not for everything. Gratitude is a posture, not a denial of what is hard.',
      'Joy multiplies when it’s shared. Pass it on today if you can.',
    ],
    followUps: [
      'Want me to write you a short prayer of thanksgiving?',
    ],
  },
  general: {
    openers: [
      'I’m glad you came here. You don’t have to explain it perfectly — just say what’s true.',
      'I’m here. Tell me what’s on your heart.',
      'Whatever brought you here, I’m glad you came. No pressure to perform.',
      'I’m listening. Take your time.',
    ],
    bodies: [
      'You are not behind. You are not too much. You are exactly where grace meets you.',
      'God is not far off. He’s closer than the air in your lungs tonight.',
      'Sometimes faith is just showing up. You did that by being here.',
    ],
    followUps: [
      'Would you like me to create a prayer for you?',
      'If you’d like, we can write a prayer together.',
    ],
  },
};

const OUT_OF_SCOPE_REPLIES = [UNKNOWN_REPLY];

const CRISIS_REPLY =
  `I’m really worried about you right now, and what you said matters. Please reach out to someone trained to help tonight — you don’t have to do this alone.\n\n• If you’re in immediate danger, call your local emergency number.\n• U.S./Canada: call or text 988 (Suicide & Crisis Lifeline).\n• U.K. & Ireland: Samaritans — call 116 123.\n• International list: findahelpline.com\n\nYou are loved. You are wanted. The God who made you knows your name, and there are people ready to sit with you through this hour. Please reach out.`;

function pickDistinct<T>(arr: T[], seed: number, avoid: Set<string> = new Set()): T {
  const filtered = arr.filter((x) => !avoid.has(String(x)));
  const pool = filtered.length > 0 ? filtered : arr;
  return pool[Math.abs(seed) % pool.length];
}

function hash(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = (h * 33) ^ s.charCodeAt(i);
  return h | 0;
}

/** Pick the best verse to anchor the reply on. */
function pickVerse(intent: Intent, seed: number): Verse {
  const pool: Verse[] = [];
  for (const t of intent.topics) pool.push(...getVersesForTopic(t));
  for (const e of intent.emotions) pool.push(...getVersesForEmotion(e));
  const list = pool.length ? pool : VERSES;
  const unique = Array.from(new Map(list.map((v) => [v.id, v])).values());
  return unique[Math.abs(seed) % unique.length];
}

/** Pick a related prayer if there is a clean category match. */
function pickPrayer(intent: Intent, seed: number): Prayer | null {
  const map: Record<string, PrayerCategory> = {
    addiction: 'addiction',
    temptation: 'addiction',
    forgiveness: 'forgiveness',
    grief: 'grief',
    heartbreak: 'heartbreak',
    exams: 'exams',
    family: 'family',
    healing: 'healing',
    sleep: 'sleep',
    anxiety: 'anxiety',
  };
  for (const t of intent.topics) {
    const cat = map[t as string];
    if (!cat) continue;
    const matches = PRAYERS.filter((p) => p.category === cat);
    if (matches.length) return matches[Math.abs(seed) % matches.length];
  }
  const emap: Partial<Record<EmotionId, PrayerCategory>> = {
    anxious: 'anxiety',
    overthinking: 'anxiety',
    depressed: 'depression',
    sad: 'depression',
    heartbroken: 'heartbreak',
    lonely: 'peace',
    fearful: 'peace',
    stressed: 'peace',
    unmotivated: 'motivation',
    guilty: 'forgiveness',
    hopeless: 'strength',
    thankful: 'thankfulness',
  };
  for (const e of intent.emotions) {
    const cat = emap[e];
    if (!cat) continue;
    const matches = PRAYERS.filter((p) => p.category === cat);
    if (matches.length) return matches[Math.abs(seed) % matches.length];
  }
  return null;
}

/* ───────────────────────────── Public API ─────────────────────────────── */

export type AIResponse = {
  opener: string;
  body: string;
  /** A short scripture line to anchor the reply, or null to omit (varies). */
  verseLine: string | null;
  verse: Verse;
  prayer: Prayer | null;
  /** "Would you like me to create a prayer..." invitation, or null. */
  prayerSuggestion: string | null;
  closer: string | null;
  emotion: Emotion | null;
  /** When true, render a "Create a prayer" action button below the bubble. */
  suggestPrayer: boolean;
  fallback?: boolean;
  crisis?: boolean;
  /** Detected emotions in this input — exposed so the caller can record them
   *  into AI memory when the user has memory enabled. */
  detectedEmotions: EmotionId[];
  detectedTopics: Topic[];
};

export type GenerateOptions = {
  /** Last few assistant message texts, used to avoid repeating and to
   *  cool down the prayer-suggestion cadence (do not ask every turn). */
  recentAssistantTexts?: string[];
};

export function generateEncouragement(
  input: string,
  opts: GenerateOptions = {},
): AIResponse {
  // Normalize abbreviations first so all downstream detection sees expanded
  // text. ("can u pray for my dad" → "can you pray for my dad")
  const normalized = normalizeInput(input);
  const seed = Math.abs(hash(normalized + (opts.recentAssistantTexts?.length ?? 0)));
  const intent = detectIntent(normalized);
  const isCrisis = intent.isCrisis;

  // Crisis takes priority over everything else.
  if (isCrisis) {
    return {
      opener: '',
      body: CRISIS_REPLY,
      verseLine: null,
      verse: VERSES.find((v) => v.id === 'ps-34-18') ?? VERSES[0],
      prayer: null,
      prayerSuggestion: null,
      closer: null,
      emotion: null,
      suggestPrayer: false,
      crisis: true,
      detectedEmotions: intent.emotions,
      detectedTopics: intent.topics,
    };
  }

  // Direct prayer request — generate an actual intercessory prayer instead
  // of a generic empathetic response. Runs before profanity / scope checks
  // so "could you pray for my mum" never accidentally falls through.
  if (isPrayerRequest(normalized)) {
    const subject = extractPrayerSubject(normalized);
    const { acknowledgment, prayer, verse } = buildIntercession(subject, seed);
    return {
      opener: acknowledgment,
      body: prayer,
      verseLine: `"${verse.text}" — ${verse.reference}`,
      verse: VERSES[seed % VERSES.length],
      prayer: null,
      prayerSuggestion: null,
      closer: "In Jesus' name I pray, Amen.",
      emotion: null,
      suggestPrayer: false,
      detectedEmotions: intent.emotions,
      detectedTopics: intent.topics,
    };
  }

  if (isProfane(normalized)) {
    return {
      opener: '',
      body: PROFANITY_REPLY,
      verseLine: null,
      verse: VERSES[seed % VERSES.length],
      prayer: null,
      prayerSuggestion: null,
      closer: null,
      emotion: null,
      suggestPrayer: false,
      fallback: true,
      detectedEmotions: intent.emotions,
      detectedTopics: intent.topics,
    };
  }

  if (isFeatureRequest(normalized)) {
    return {
      opener: '',
      body: FEATURE_REPLY,
      verseLine: null,
      verse: VERSES[seed % VERSES.length],
      prayer: null,
      prayerSuggestion: null,
      closer: null,
      emotion: null,
      suggestPrayer: false,
      fallback: true,
      detectedEmotions: intent.emotions,
      detectedTopics: intent.topics,
    };
  }

  if (isOutOfScope(normalized)) {
    return {
      opener: '',
      body: UNKNOWN_REPLY,
      verseLine: null,
      verse: VERSES[seed % VERSES.length],
      prayer: null,
      prayerSuggestion: null,
      closer: null,
      emotion: null,
      suggestPrayer: false,
      fallback: true,
      detectedEmotions: intent.emotions,
      detectedTopics: intent.topics,
    };
  }

  const tone = TONE[intent.primary];
  const recent = new Set(opts.recentAssistantTexts ?? []);

  const opener = pickDistinct(tone.openers, seed, recent);
  const body = pickDistinct(tone.bodies, seed + 17, recent);

  // Only sometimes include the verse line — keeps the reply conversational.
  // High-severity always include verse; low-severity sometimes skip.
  const includeVerseLine =
    intent.severity === 'high' || (seed & 1) === 0 || intent.primary === 'thankfulness';

  const verse = pickVerse(intent, seed + 31);
  const verseLine = includeVerseLine
    ? `"${verse.text}" — ${verse.reference}`
    : null;

  const prayer = pickPrayer(intent, seed + 47);

  // Prayer suggestion: only when there's a clear emotion AND the recent
  // history doesn't already include one. Skip on thankfulness / general /
  // first-greeting cases unless emotion is strong.
  const recentlySuggestedPrayer = (opts.recentAssistantTexts ?? []).some((m) =>
    /create a prayer|write you a prayer|pray about this together|prayer for you tonight|put words to this in a prayer/i.test(m),
  );
  const emotionalEnough =
    intent.primary !== 'general' &&
    intent.primary !== 'thankfulness' &&
    (intent.severity !== 'low' || intent.emotions.length > 0);
  const shouldSuggest = emotionalEnough && !recentlySuggestedPrayer;

  const prayerSuggestion = shouldSuggest
    ? pickDistinct(tone.followUps, seed + 67, recent)
    : null;

  // If we're suggesting a prayer, skip the affirmation closer (less clutter).
  // Otherwise, ~half the time include a soft closer.
  const includeCloser = !shouldSuggest && (seed & 2) === 0;
  const closer = includeCloser
    ? pickDistinct(AFFIRMATIONS, seed + 89, recent)
    : null;

  const primaryEmotion = intent.emotions[0]
    ? EMOTIONS.find((e) => e.id === intent.emotions[0]) ?? null
    : null;

  return {
    opener,
    body,
    verseLine,
    verse,
    prayer,
    prayerSuggestion,
    closer,
    emotion: primaryEmotion,
    suggestPrayer: shouldSuggest,
    detectedEmotions: intent.emotions,
    detectedTopics: intent.topics,
  };
}

/** Compose the final message text for the chat bubble. */
export function formatResponse(r: AIResponse): string {
  if (r.fallback || r.crisis) return r.body;
  const parts: string[] = [];
  if (r.opener) parts.push(r.opener);
  parts.push(r.body);
  if (r.verseLine) parts.push(r.verseLine);
  if (r.prayerSuggestion) parts.push(r.prayerSuggestion);
  if (r.closer) parts.push(r.closer);
  return parts.join('\n\n');
}
