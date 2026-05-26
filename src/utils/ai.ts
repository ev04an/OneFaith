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
  sad: [
    'sad', 'sadness', 'sadly', 'down', 'low', 'blue', 'hurt', 'hurting', 'bad day',
    'crying', 'tears', 'tearing up', 'weeping', 'in tears',
    'gloomy', 'mope', 'moping', 'melancholy', 'heartsick', 'rough day', 'tough day',
    'heavy heart', 'bummed', 'feeling off', 'feeling bad', 'not okay', 'not ok',
  ],
  depressed: [
    'depress', 'depresd', 'depresion', 'depressing',
    'numb', 'empty', 'hollow', 'void', 'dark inside', 'darkness',
    'nothing matters', 'cant feel', "can't feel", 'no feeling', 'no joy',
    'flat', 'lifeless', 'soulless', 'shutdown', 'shut down', 'cant get up', "can't get up",
    'in a hole', 'in the pit', 'rock bottom',
  ],
  lonely: [
    'lonely', 'loneliness', 'alone', 'all alone', 'so alone', 'feel alone',
    'isolat', 'isolated', 'isolating', 'cut off',
    'no one', 'noone', 'nobody', 'no body', 'left out', 'unwanted',
    'no friends', 'no one cares', 'forgotten', 'invisible', 'unseen',
    'by myself', 'on my own', 'theres no one', "there's no one",
  ],
  heartbroken: [
    'heartbroken', 'heartbreak', 'broken heart', 'broke my heart',
    'breakup', 'break up', 'broke up', 'broken up',
    'left me', 'she left', 'he left', 'dumped me', 'dumped', 'got dumped',
    'lost her', 'lost him', 'lost my girl', 'lost my boy', 'lost the love',
    'ex ', 'my ex', 'rejected', 'rejection',
  ],
  angry: [
    'angry', 'anger', 'angered', 'furious', 'fuming', 'enraged', 'rage', 'raging',
    'mad', 'so mad', 'pissed', 'pissed off', 'piss off',
    'hate', 'hating', 'resent', 'resentment', 'resentful',
    'irritated', 'annoyed', 'fed up', 'sick of', 'tired of',
    'wanna scream', 'want to scream', 'losing it', 'lose it',
  ],
  anxious: [
    'anx', 'anxious', 'anxiety', 'anxoius', 'anciuos',
    'panic', 'panicking', 'panicky', 'panic attack',
    'worry', 'worries', 'worried', 'worrying',
    'nervous', 'nerves', 'on edge', 'edgy', 'restless', 'jittery', 'jumpy',
    'butterflies', 'knot in my stomach', 'cant breathe', "can't breathe",
    'heart racing', 'heart pounding', 'sweating', 'tense', 'tight chest',
  ],
  fearful: [
    'afraid', 'fear', 'fearful', 'fears', 'scared', 'so scared',
    'terrified', 'frightened', 'freaked out', 'freaking out',
    'spooked', 'shaken', 'shook',
    'what if', 'what ifs', 'worst case', 'worst-case',
  ],
  stressed: [
    'stress', 'stressed', 'stressing', 'stressful',
    'overwhelm', 'overwhelmed', 'overwhelming',
    'too much', 'cant handle', "can't handle", 'cant cope', "can't cope",
    'burned out', 'burnt out', 'burning out', 'burnout',
    'exhaust', 'exhausted', 'drained', 'spent', 'wiped',
    'pressure', 'under pressure', 'a lot going on', 'so much to do',
  ],
  unmotivated: [
    'unmotiv', 'unmotivated', 'no motivation', 'lost motivation',
    'lazy', 'feeling lazy',
    'cant start', "can't start", 'cant begin', 'stuck', 'frozen',
    'procrast', 'procrastinating', 'procrastinated',
    'no energy', 'no will', 'no drive', 'no ambition',
    'dont feel like', "don't feel like", 'dont wanna', "don't wanna",
    'cant bring myself', "can't bring myself",
  ],
  overthinking: [
    'overthink', 'over thinking', 'overthinking', 'over-thinking',
    'spiral', 'spiraling', 'spiralling',
    'cant stop thinking', "can't stop thinking", 'cant stop',
    'racing thoughts', 'mind racing', 'mind wont stop', "mind won't stop",
    'ruminat', 'ruminating', 'rumination',
    'replay', 'replaying', 'loop', 'looping', 'thoughts loop',
    'analysis paralysis',
  ],
  guilty: [
    'guilt', 'guilty', 'shame', 'shamed', 'ashamed',
    'failed', 'i failed', 'i let', 'let them down', 'let everyone down',
    'mess up', 'messed up', 'messed it up', 'screwed up',
    'regret', 'regrets', 'regretting',
    'my fault', 'all my fault', 'i blame myself', 'kicking myself',
    'shouldnt have', "shouldn't have", 'wish i hadnt', "wish i hadn't",
  ],
  hopeless: [
    'hopeless', 'no hope', 'lost hope',
    'pointless', 'no point', 'whats the point', "what's the point",
    'give up', 'giving up', 'gave up',
    'no future', 'no way out', 'no way forward', 'cant see a way',
    'nothing will change', 'never gets better',
  ],
  happy: [
    'happy', 'happier', 'happiness', 'joy', 'joyful', 'joyous',
    'good day', 'great day', 'amazing day', 'best day', 'wonderful day',
    'excited', 'excitement', 'thrilled', 'pumped', 'stoked',
    'feeling good', 'feeling great', 'on top of the world', 'on cloud nine',
    'smiling', 'grinning',
  ],
  thankful: [
    'thank', 'thanks', 'thankful', 'thanksgiving',
    'grateful', 'gratitude', 'gratefulness',
    'blessed', 'blessing', 'feel blessed', 'count my blessings',
    'appreciate', 'appreciated', 'appreciation',
    'lucky', 'fortunate',
  ],
  hopeful: [
    'hopeful', 'hope', 'i hope', 'have hope',
    'optimistic', 'optimism',
    'looking forward', 'excited about', 'cant wait', "can't wait",
    'things will get better', 'getting better', 'on the up',
  ],
  peaceful: [
    'peace', 'peaceful', 'at peace',
    'calm', 'calming', 'calmer',
    'still', 'stillness', 'quiet', 'quiet inside', 'silence',
    'centered', 'grounded', 'settled', 'rest in', 'resting in',
  ],
};

const TOPIC_KEYWORDS: Partial<Record<Topic, string[]>> = {
  addiction: [
    'addict', 'addicted', 'addiction', 'addictive',
    'relapse', 'relapsed', 'relapsing',
    'porn', 'pornography', 'lust', 'lusting',
    'drink', 'drinking', 'alcohol', 'alcoholic', 'drunk', 'wasted',
    'drug', 'drugs', 'high', 'getting high', 'using',
    'gambling', 'gambled', 'bet', 'betting',
    'binge', 'binging', 'binged',
    'smoking', 'cigarette', 'vape', 'vaping',
    'sober', 'sobriety', 'clean',
  ],
  temptation: [
    'temptation', 'temptations', 'tempted', 'tempting',
    'urge', 'urges', 'craving', 'cravings', 'crave',
    'pull', 'pulled toward', 'pulling me', 'want to so bad',
    'wanting to', 'wanna do', 'wanna use', 'wanna drink',
  ],
  forgiveness: [
    'forgive', 'forgiven', 'forgiving', 'forgiveness',
    'sorry', 'so sorry', 'apologize', 'apology',
    'sin', 'sinned', 'sinning', 'sinful',
    'pardon', 'mercy', 'absolution',
    'cant forgive', "can't forgive",
  ],
  grief: [
    'died', 'dead', 'death', 'passed away', 'passed', 'gone',
    'loss', 'lost him', 'lost her', 'lost them', 'lost my',
    'grief', 'grieving', 'mourning', 'mourn',
    'miss them', 'miss him', 'miss her', 'missing them',
    'funeral', 'burial', 'cremation',
    'cant believe theyre gone', "can't believe they're gone",
  ],
  healing: [
    'heal', 'healed', 'healing', 'healer',
    'wound', 'wounded', 'wounds',
    'sick', 'sickness', 'illness', 'ill', 'unwell',
    'recover', 'recovery', 'recovering',
    'cancer', 'tumor', 'diagnosis', 'diagnosed', 'hospital',
    'in pain', 'chronic', 'condition', 'disease',
  ],
  exams: [
    'exam', 'exams', 'examination',
    'test', 'tests', 'testing',
    'study', 'studying', 'studied', 'cant focus on study',
    'school', 'college', 'university', 'campus',
    'final', 'finals', 'mid-term', 'midterm',
    'grade', 'grades', 'gpa', 'cgpa', 'marks',
    'assignment', 'project', 'thesis', 'viva', 'placement', 'interview',
  ],
  family: [
    // Generic family terms.
    'family', 'fam', 'fammy', 'household', 'relative', 'relatives', 'kin',

    // Mother — every common short / affectionate / regional form.
    'mother', 'mom', 'moms', 'mommy', 'momma', 'mama', 'mamma',
    'mum', 'mums', 'mummy', 'mumma', 'mumsy',
    'mami', 'mamacita', 'mami ',
    'maa', 'mata', 'amma', 'ammi', 'ammachi',

    // Father — every common short / affectionate / regional form.
    'father', 'dad', 'dads', 'daddy', 'dada',
    'papa', 'pappa', 'papi', 'papito',
    'pop ', 'pops', 'popsie',
    'baba', 'bappa', 'abba', 'appa', 'appachan',

    // Siblings.
    'brother', 'brothers', 'bro', 'bros', 'bruh', 'brotha',
    'sister', 'sisters', 'sis ', 'sisy', 'sissy', 'sista',
    'sibling', 'siblings',
    'chechi', 'chettan',
    'twin', 'twins', 'twinnie',
    'step-brother', 'stepbrother', 'step-sister', 'stepsister',
    'half-brother', 'half-sister',

    // Children.
    'son', 'sons', 'sonny', 'sonny boy',
    'daughter', 'daughters',
    'kid', 'kids', 'kiddo', 'kiddos',
    'child', 'children',
    'baby', 'babies', 'little one', 'lil one',
    'firstborn', 'newborn',

    // Spouse / partner.
    'husband', 'hubby', 'hubs',
    'wife', 'wifey', 'missus', 'missis',
    'spouse',
    'fiance', 'fiancee', 'fiancé', 'fiancée',

    // Grandparents — exhaustive.
    'grandmother', 'grandma', 'grandmas', 'gramma', 'grammy',
    'granny', 'grandy',
    'nana', 'nanna', 'nanny', 'nanay',
    'mema', 'meemaw', 'mimi', 'gigi', 'gram',
    'nona', 'nonna', 'oma',
    'abuela', 'lola',
    'dadi', 'naani',

    'grandfather', 'grandpa', 'grandpas',
    'granddad', 'grandad', 'gramps', 'grampa', 'grampy',
    'grandpop', 'pop-pop', 'popop', 'papaw', 'pawpaw',
    'opa', 'nonno', 'abuelo', 'lolo',
    'dada ', 'nana ',

    // Aunts / uncles.
    'aunt', 'aunts', 'auntie', 'aunty', 'auntee',
    'uncle', 'uncles',
    'tio', 'tia',
    'chacha', 'mausa', 'bua', 'masi', 'mami',

    // Cousins / nieces / nephews.
    'cousin', 'cousins', 'cuzzo', 'cuzzin',
    'niece', 'nieces',
    'nephew', 'nephews',

    // In-laws.
    'in-law', 'in-laws', 'in law', 'in laws',
    'mother-in-law', 'mother in law',
    'father-in-law', 'father in law',
    'sister-in-law', 'sister in law',
    'brother-in-law', 'brother in law',
    'son-in-law', 'daughter-in-law',

    // Step / foster.
    'stepmom', 'step-mom', 'step mom',
    'stepdad', 'step-dad', 'step dad',
    'stepson', 'stepdaughter',
    'foster mom', 'foster dad', 'foster parent', 'foster family',
    'adopted', 'adoptive',

    // Godparents.
    'godfather', 'godmother', 'godparent', 'godson', 'goddaughter',
  ],
  friendship: [
    'friend', 'friends', 'friendship',
    'bestie', 'best friend', 'bff', 'buddy', 'buddies', 'mate', 'mates',
    'pal', 'pals', 'fellow',
  ],
  love: [
    'in love', 'falling in love',
    'relationship', 'dating', 'date',
    'boyfriend', 'bf', 'girlfriend', 'gf',
    'partner', 'spouse', 'crush',
  ],
  failure: [
    'failed', 'failing', 'failure', 'failures',
    'screwed up', 'messed up', 'blew it', 'tanked',
    'didnt make it', "didn't make it", 'didnt pass', "didn't pass",
    'rejected', 'denied', 'turned down',
  ],
  success: [
    'promotion', 'got promoted', 'promoted',
    'got the job', 'landed the job', 'hired',
    'succeeded', 'won', 'win', 'winning',
    'achieved', 'accomplished', 'passed',
    'i did it',
  ],
  sleep: [
    'sleep', 'sleeping', 'asleep', 'cant sleep', "can't sleep",
    'insomnia', 'insomniac', 'awake all night',
    'tired', 'sleepy', 'drowsy',
    'rest', 'resting',
    'bedtime', 'going to bed', 'in bed',
    'nightmare', 'bad dreams',
  ],
  burnout: [
    'burnt out', 'burned out', 'burning out', 'burnout',
    'exhausted', 'completely drained', 'no fuel left', 'running on empty',
    'cant keep going', "can't keep going",
  ],
  identity: [
    'who am i', 'who i am', 'identity',
    'worth', 'my worth', 'self worth', 'self-worth',
    'enough', 'good enough', 'not enough',
    'know myself', 'finding myself',
  ],
  selfWorth: [
    'worthless', 'no good', 'useless', 'pointless',
    'unloved', 'unlovable', 'cant be loved', "can't be loved",
    'nobody wants me', 'no one wants me',
    'a burden', 'better off without me',
  ],
  doubt: [
    'doubt', 'doubts', 'doubting',
    'not sure if god', 'is god real', 'does god exist', 'god isnt real', "god isn't real",
    'lost my faith', 'losing faith', 'crisis of faith',
    'questioning', 'why does god',
  ],
  spiritualWarfare: [
    'spiritual attack', 'spiritual warfare',
    'enemy', 'the enemy',
    'devil', 'satan', 'demon', 'demonic', 'oppression',
    'darkness', 'dark forces', 'evil',
  ],
  purpose: [
    'purpose', 'my purpose', 'find my purpose',
    'meaning', 'meaning of life',
    'why am i here', 'why do i exist',
    'calling', 'my calling', 'destiny', 'plan for me',
  ],
  recovery: [
    'recovery', 'recovering', 'on the mend',
    'getting better', 'doing better',
    'streak', 'days clean', 'days sober',
  ],
  patience: [
    'waiting', 'wait', 'waited',
    'patient', 'patience', 'impatient',
    'how long', 'when will', 'taking forever', 'takes so long',
  ],
  faith: [
    'faith', 'my faith', 'have faith',
    'believe', 'believing', 'belief',
    'trust god', 'trust in god', 'trusting god',
  ],
  thankfulness: [
    'blessed', 'gratitude', 'grateful', 'thanksgiving',
  ],
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
  // Pronouns / common short forms
  [/\bu\b/gi, 'you'],
  [/\bur\b/gi, 'your'],
  [/\byr\b/gi, 'your'],
  [/\bya\b/gi, 'you'],
  [/\bim\b/gi, "i'm"],
  [/\bdont\b/gi, "don't"],
  [/\bcant\b/gi, "can't"],
  [/\bwont\b/gi, "won't"],
  [/\bisnt\b/gi, "isn't"],
  [/\bdoesnt\b/gi, "doesn't"],
  [/\bwouldnt\b/gi, "wouldn't"],
  [/\bcouldnt\b/gi, "couldn't"],
  [/\bcudnt\b/gi, "couldn't"],
  [/\bshouldnt\b/gi, "shouldn't"],
  [/\bhavent\b/gi, "haven't"],
  [/\bthats\b/gi, "that's"],
  [/\bwhats\b/gi, "what's"],
  [/\bwheres\b/gi, "where's"],
  [/\bwhos\b/gi, "who's"],
  [/\bhes\b/gi, "he's"],
  [/\bshes\b/gi, "she's"],
  [/\btheyre\b/gi, "they're"],
  [/\byouve\b/gi, "you've"],
  [/\byoure\b/gi, "you're"],
  [/\bive\b/gi, "i've"],
  [/\bid\b/gi, "i'd"],
  [/\bill\b/gi, "i'll"],
  // Texting / slang
  [/\bpls\b/gi, 'please'],
  [/\bplz\b/gi, 'please'],
  [/\bplease\s+plz\b/gi, 'please'],
  [/\bwud\b/gi, 'would'],
  [/\bcud\b/gi, 'could'],
  [/\bshud\b/gi, 'should'],
  [/\bwat\b/gi, 'what'],
  [/\bwen\b/gi, 'when'],
  [/\bwhy\b/gi, 'why'],
  [/\bcuz\b/gi, 'because'],
  [/\bcoz\b/gi, 'because'],
  [/\bbcoz\b/gi, 'because'],
  [/\bppl\b/gi, 'people'],
  [/\bsmth\b/gi, 'something'],
  [/\bsthn\b/gi, 'something'],
  [/\bnthn\b/gi, 'nothing'],
  [/\bany1\b/gi, 'anyone'],
  [/\bevry1\b/gi, 'everyone'],
  [/\btmrw\b/gi, 'tomorrow'],
  [/\btmrrw\b/gi, 'tomorrow'],
  [/\btmr\b/gi, 'tomorrow'],
  [/\btnite\b/gi, 'tonight'],
  [/\b2nite\b/gi, 'tonight'],
  [/\b2day\b/gi, 'today'],
  [/\b2morrow\b/gi, 'tomorrow'],
  [/\bidk\b/gi, "i don't know"],
  [/\bidc\b/gi, "i don't care"],
  [/\bafaik\b/gi, 'as far as i know'],
  [/\bbtw\b/gi, 'by the way'],
  [/\bnvm\b/gi, 'never mind'],
  [/\bsry\b/gi, 'sorry'],
  [/\bthx\b/gi, 'thanks'],
  [/\bthnks\b/gi, 'thanks'],
  [/\bty\b/gi, 'thank you'],
  [/\bnp\b/gi, 'no problem'],
  // Common typos for emotional words
  [/\banxoius\b/gi, 'anxious'],
  [/\banxiuos\b/gi, 'anxious'],
  [/\banciuos\b/gi, 'anxious'],
  [/\bdepresd\b/gi, 'depressed'],
  [/\bdepresion\b/gi, 'depression'],
  [/\btierd\b/gi, 'tired'],
  [/\btryin\b/gi, 'trying'],
  // Typos around common prayer-request words.
  [/\bpary\b/gi, 'pray'],
  [/\bprey\b/gi, 'pray'],
  [/\bfro\b/gi, 'for'],
  [/\bovr\b/gi, 'over'],
  [/\bgrandy\b/gi, 'granny'],
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

// Words that signal concern when paired with a family/friend mention.
// "my granny is sick" matches; "my dad called me" doesn't.
const CONCERN_WORDS = [
  // Health
  'sick', 'ill', 'unwell', 'dying', 'died', 'cancer', 'tumor', 'tumour',
  'hospital', 'hospitalized', 'hospitalised', 'icu', 'surgery', 'operation',
  'diagnosed', 'diagnosis', 'chemo', 'chemotherapy', 'radiation',
  'stroke', 'heart attack', 'pneumonia', 'covid', 'fever',
  'paralyzed', 'paralysed', 'coma', 'critical condition',
  // Emotional / spiritual
  'struggling', 'hurting', 'in pain', 'suffering', 'going through',
  'depressed', 'addicted', 'addiction', 'relapse', 'relapsed',
  'lonely', 'broken', 'heartbroken', 'shattered', 'lost faith',
  'losing faith', 'losing hope', 'hopeless',
  // Life events
  'lost his job', 'lost her job', 'lost their job', 'fired',
  'divorced', 'divorcing', 'getting divorced',
  'broke up', 'broken up', 'left them',
  'in trouble', 'in jail', 'arrested',
  // Death / loss adjacent
  'passed away', 'passed', 'gone',
];

// Family / friend nouns the user is likely talking about when saying "my X".
// Used to extract a subject for soft intercession.
const RELATION_WORDS = [
  'granny', 'gran', 'nana', 'nanna', 'nanny', 'grandma', 'grandmother',
  'grandpa', 'grandfather', 'granddad', 'grandad', 'gramps',
  'ammachi', 'appachan', 'dadi', 'naani',
  'mom', 'mommy', 'mum', 'mummy', 'mother', 'momma', 'mama', 'mamma',
  'maa', 'amma', 'ammi', 'mami',
  'dad', 'daddy', 'father', 'papa', 'pappa', 'pop', 'pops',
  'baba', 'bappa', 'abba', 'appa',
  'brother', 'bro', 'sister', 'sis', 'sibling', 'twin',
  'son', 'sonny', 'daughter', 'kid', 'kiddo', 'child', 'baby',
  'husband', 'hubby', 'wife', 'wifey', 'spouse',
  'fiance', 'fiancee', 'fiancé', 'fiancée',
  'aunt', 'auntie', 'aunty', 'uncle', 'cousin', 'niece', 'nephew',
  'friend', 'bestie', 'best friend', 'buddy',
  'boyfriend', 'girlfriend', 'partner',
  'family', 'parents', 'kids', 'siblings',
  'chacha', 'mausa', 'bua', 'masi', 'chechi', 'chettan',
];

// Detects implicit intercession requests like "my granny is sick" or "my dad
// is going through a hard time" — situations where the user isn't asking for
// prayer explicitly but is clearly bringing a loved one's distress to the
// conversation. Returns the relative phrase to address ("your granny") or
// null when no implied request was found.
function detectImpliedIntercession(input: string): string | null {
  const t = normalizeInput(input).toLowerCase();

  // Need at least one family/friend mention preceded by "my", "our", or "for".
  const possessiveMatch = t.match(
    new RegExp(`\\b(?:my|our|for\\s+my|for\\s+our)\\s+(${RELATION_WORDS.join('|')})\\b`, 'i'),
  );
  if (!possessiveMatch) return null;

  // Need at least one concern word somewhere in the message.
  const hasConcern = CONCERN_WORDS.some((w) => t.includes(w));
  if (!hasConcern) return null;

  const relation = possessiveMatch[1];
  // Convert to second-person so the prayer reads back to the user about
  // *their* loved one: "my granny" → "your granny".
  return `your ${relation}`;
}

// Acknowledgment specifically for implied intercession — softer than the
// explicit "of course let's pray" since the user didn't directly ask.
function buildImpliedAcknowledgment(subject: string, seed: number): string {
  const pool = [
    `I'm so sorry. Carrying worry for ${subject} is its own kind of weight. Let me bring them to God with you right now.`,
    `That's a lot to be carrying. Let's pause and lift ${subject} up to Him together.`,
    `I hear how heavy this is. Let me pray for ${subject} with you.`,
    `I'm sitting with you in this. Let's bring ${subject} before God.`,
  ];
  return pool[Math.abs(seed) % pool.length];
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

// Relation words that carry implicit gender. Used to pick natural pronouns
// in intercessory prayers — "I lift up your dad to You. You know him by name"
// reads far better than "...You know them by name."
const MASCULINE_RELATIONS = new Set([
  'dad', 'daddy', 'father', 'papa', 'pappa', 'pop', 'pops',
  'baba', 'bappa', 'abba', 'appa', 'appachan',
  'grandpa', 'grandfather', 'granddad', 'grandad', 'gramps', 'grampa',
  'papaw', 'pawpaw', 'opa', 'nonno', 'abuelo', 'lolo',
  'brother', 'bro', 'stepbrother', 'half-brother',
  'son', 'sonny', 'grandson', 'stepson',
  'husband', 'hubby', 'boyfriend', 'fiance', 'fiancé',
  'uncle', 'nephew',
  'godfather', 'godson',
]);
const FEMININE_RELATIONS = new Set([
  'mom', 'mommy', 'mum', 'mummy', 'mother', 'momma', 'mama', 'mamma',
  'maa', 'amma', 'ammi', 'ammachi',
  'grandma', 'grandmother', 'granny', 'nana', 'nanna', 'gramma', 'grammy',
  'meemaw', 'mimi', 'gigi', 'gram', 'oma', 'nonna', 'abuela', 'lola',
  'dadi', 'naani',
  'sister', 'sis', 'stepsister', 'half-sister', 'chechi',
  'daughter', 'granddaughter', 'stepdaughter',
  'wife', 'wifey', 'girlfriend', 'fiancee', 'fiancée',
  'aunt', 'auntie', 'aunty', 'niece',
  'godmother', 'goddaughter',
]);

type Pronouns = { they: string; them: string; their: string; They: string; Them: string; Their: string };

function resolvePronouns(subject: string): Pronouns {
  // Look at the last word of the subject — for phrases like "your dad",
  // "your big brother", "your beautiful granny" — the noun is the head.
  const head = subject
    .toLowerCase()
    .replace(/[^a-z\s-]/g, '')
    .trim()
    .split(/\s+/)
    .pop() ?? '';
  if (MASCULINE_RELATIONS.has(head)) {
    return { they: 'he', them: 'him', their: 'his', They: 'He', Them: 'Him', Their: 'His' };
  }
  if (FEMININE_RELATIONS.has(head)) {
    return { they: 'she', them: 'her', their: 'her', They: 'She', Them: 'Her', Their: 'Her' };
  }
  return { they: 'they', them: 'them', their: 'their', They: 'They', Them: 'Them', Their: 'Their' };
}

function buildIntercession(
  subject: string,
  seed: number,
): { acknowledgment: string; prayer: string; verse: { text: string; reference: string } } {
  const isUser = subject === 'you';
  const acknowledgment = isUser
    ? "Of course. Let's pray together right now."
    : `Of course — let's bring ${subject} to God.`;
  const p = resolvePronouns(subject);
  const prayer = isUser
    ? `Father, I come before You holding the heart of the one praying right now. You see them exactly where they are tonight — what they came here carrying, what they have not been able to say out loud. Meet them in it. Strengthen them. Comfort them. Quiet what is loud and heal what is hurting. Remind them they are not alone — that You are nearer than the air in their lungs.`
    : `Father, I lift up ${subject} to You. You know ${p.them} by name and love ${p.them} more than any of us ever could. Wherever ${p.they} ${p.they === 'they' ? 'are' : 'is'} today — whatever burden, whatever hope, whatever fear ${p.they} cannot speak — meet ${p.them} there. Strengthen ${p.them} in body and spirit. Surround ${p.them} with Your peace. Soften the hard places, brighten the dark ones, and draw ${p.them} close to You.`;
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
  /** User's preferred name (from Settings → Profile). Used to personalize
   *  openers — "I hear you, Evan" instead of generic empathy. Empty / undefined
   *  falls back to nameless phrasing. */
  userName?: string;
  /** Recent user-message snippets, used for pronoun resolution ("him/her"
   *  → previously named person) and to detect repeated topics. */
  recentUserTexts?: string[];
  /** The user's most-frequent emotion from their AI memory store. When the
   *  same theme has come up repeatedly, the assistant gently acknowledges
   *  the pattern ("You've been carrying this for a while"). */
  topMemoryEmotion?: EmotionId;
};

/** Inject the user's name into an opener naturally. Uses heuristics to
 *  insert the name at a place that flows ("I hear you. → I hear you, Evan.")
 *  without making every line feel scripted. Returns the original opener if
 *  no name was provided or the line doesn't lend itself to personalization. */
function personalizeOpener(opener: string, name?: string, seed: number = 0): string {
  if (!name || !opener) return opener;
  const safe = name.trim().split(/\s+/)[0]; // first name only
  if (!safe || safe.length > 24) return opener;

  // Roll a die — only personalize ~60% of the time so it doesn't feel robotic.
  if ((Math.abs(seed) % 10) > 5) return opener;

  // Common natural insertion points.
  const patterns: Array<[RegExp, string]> = [
    [/^I hear you\./, `I hear you, ${safe}.`],
    [/^I'm here\./, `I'm here, ${safe}.`],
    [/^I'm here\b/, `I'm here, ${safe},`],
    [/^Stay with me\./, `Stay with me, ${safe}.`],
    [/^I'm listening\./, `I'm listening, ${safe}.`],
    [/^Thank you for being honest with me\./, `Thank you for being honest with me, ${safe}.`],
    [/^Take your time\./, `Take your time, ${safe}.`],
    [/^I'm sitting with you in this\./, `I'm sitting with you, ${safe}.`],
    [/^I'm so sorry\./, `I'm so sorry, ${safe}.`],
    [/^I'm glad you said something\./, `I'm glad you said something, ${safe}.`],
    [/^I'm glad you came here\./, `${safe}, I'm glad you came here.`],
    [/^I'm really glad you came here\./, `${safe}, I'm really glad you came here.`],
  ];
  for (const [re, repl] of patterns) {
    if (re.test(opener)) return opener.replace(re, repl);
  }
  // Generic prefix fallback — only if the opener starts with a short phrase.
  if (opener.length < 220 && /^[A-Z][a-z]/.test(opener)) {
    return `${safe}, ${opener.charAt(0).toLowerCase()}${opener.slice(1)}`;
  }
  return opener;
}

/** When the user has frequently talked about the same emotion, the
 *  companion gently acknowledges the pattern. Returns a sentence to
 *  prepend to the body, or null. */
function memoryAwareHint(
  topMemoryEmotion: EmotionId | undefined,
  current: EmotionId[],
  seed: number,
): string | null {
  if (!topMemoryEmotion) return null;
  // Only acknowledge if the same theme came up *this* message too —
  // otherwise it'd feel like the assistant is changing the subject.
  if (!current.includes(topMemoryEmotion)) return null;
  // Roll the dice — not every message gets the callback.
  if ((Math.abs(seed) % 4) !== 0) return null;
  const friendly: Partial<Record<EmotionId, string>> = {
    anxious: "You've been carrying anxiety for a while now. I see it. It's not just tonight.",
    sad: "This sadness has come up before for you. I'm not glossing over that.",
    depressed: "I know this weight has been a long visitor. You don't have to apologize for it.",
    lonely: "Loneliness has been coming up for you. I want you to know I'm still listening.",
    heartbroken: "This hurt's been with you. Healing isn't a deadline.",
    angry: "Anger's been a regular guest lately. Let's not just push it down again.",
    overthinking: "Your mind has been doing this loop a while. We can name it tonight.",
    guilty: "Guilt has been heavy on you. It doesn't have to stay this long.",
    hopeless: "I know hope has felt far off recently. I'm here in the meantime.",
    stressed: "You've been stretched thin for a while. That matters.",
    fearful: "Fear's been around the edges for you. I haven't forgotten that.",
    unmotivated: "Stuck has been the word for a while. I see you still showing up.",
  };
  return friendly[topMemoryEmotion] ?? null;
}

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

  // Implied intercession — the user said something like "my granny is sick"
  // without explicitly asking for prayer. Treat it as a natural prayer moment
  // and lead with intercession + offer comfort.
  const impliedSubject = detectImpliedIntercession(normalized);
  if (impliedSubject) {
    const acknowledgment = buildImpliedAcknowledgment(impliedSubject, seed);
    const { prayer, verse } = buildIntercession(impliedSubject, seed + 5);
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

  const rawOpener = pickDistinct(tone.openers, seed, recent);
  const opener = personalizeOpener(rawOpener, opts.userName, seed);

  // Memory-aware: gently acknowledge recurring themes when the same emotion
  // shows up again. Prepended to the body. Skipped for thankfulness/general.
  const memoryHint =
    intent.primary !== 'thankfulness' && intent.primary !== 'general'
      ? memoryAwareHint(opts.topMemoryEmotion, intent.emotions, seed + 9)
      : null;
  const rawBody = pickDistinct(tone.bodies, seed + 17, recent);
  const body = memoryHint ? `${memoryHint}\n\n${rawBody}` : rawBody;

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
