import type { EmotionId } from './emotions';
import type { Topic } from './topics';

export type Verse = {
  id: string;
  reference: string;
  text: string;
  reflection: string;
  emotions: EmotionId[];
  topics?: Topic[];
};

// Translation: World English Bible (public domain). Reflections by OneFaith.
export const VERSES: Verse[] = [
  // ─── SADNESS / DEPRESSION / GRIEF ────────────────────────────────────
  {
    id: 'ps-34-18',
    reference: 'Psalm 34:18',
    text: 'Yahweh is near to those who have a broken heart, and saves those who have a crushed spirit.',
    reflection:
      'God doesn’t stand at a distance when you ache. He draws closer. Your tears are not a sign of weakness — they are a doorway He walks through.',
    emotions: ['sad', 'heartbroken', 'depressed'],
    topics: ['sadness', 'depression', 'heartbreak', 'grief', 'healing'],
  },
  {
    id: 'ps-30-5',
    reference: 'Psalm 30:5',
    text: 'Weeping may stay for the night, but joy comes in the morning.',
    reflection:
      'Night is real and night is long. But morning is not optional in God’s economy. It is coming.',
    emotions: ['depressed', 'sad', 'hopeless'],
    topics: ['sadness', 'depression', 'grief', 'hopelessness'],
  },
  {
    id: 'ps-42-11',
    reference: 'Psalm 42:11',
    text: 'Why are you in despair, my soul? Why are you disturbed within me? Hope in God! For I shall still praise him.',
    reflection:
      'Even the psalmist had days like yours. The remedy he found was not pretending to feel better — it was speaking truth to his own soul.',
    emotions: ['depressed', 'hopeless', 'sad'],
    topics: ['depression', 'hopelessness', 'sadness'],
  },
  {
    id: 'ps-40-1',
    reference: 'Psalm 40:1-2',
    text: 'I waited patiently for Yahweh. He turned to me, and heard my cry. He brought me up also out of a horrible pit, out of the miry clay. He set my feet on a rock.',
    reflection:
      'The miry clay is real. So is the rock under your feet that you cannot yet see. Waiting is not nothing — it is the place where rescue begins.',
    emotions: ['depressed', 'hopeless', 'sad'],
    topics: ['depression', 'hopelessness', 'patience', 'healing'],
  },
  {
    id: '2cor-1-3',
    reference: '2 Corinthians 1:3-4',
    text: 'Blessed be the God and Father of our Lord Jesus Christ, the Father of mercies and God of all comfort, who comforts us in all our affliction.',
    reflection:
      'God is not the source of your pain. He is the source of the comfort that will outlast it.',
    emotions: ['depressed', 'sad', 'heartbroken'],
    topics: ['depression', 'grief', 'heartbreak', 'healing'],
  },
  {
    id: 'rom-8-18',
    reference: 'Romans 8:18',
    text: 'For I consider that the sufferings of this present time are not worthy to be compared with the glory which will be revealed toward us.',
    reflection:
      'Today’s pain is real, but it is not the whole story. There is a glory ahead that will make this season feel like a small chapter.',
    emotions: ['sad', 'hopeless', 'depressed'],
    topics: ['sadness', 'hopelessness', 'hope'],
  },
  {
    id: 'rev-21-4',
    reference: 'Revelation 21:4',
    text: 'He will wipe away every tear from their eyes. Death will be no more; neither will there be mourning, nor crying, nor pain any more.',
    reflection:
      'There is coming a day when the very things crushing you now will be impossible. Hold on. The end of the story is good.',
    emotions: ['sad', 'heartbroken', 'hopeless'],
    topics: ['sadness', 'grief', 'heartbreak', 'hope'],
  },
  {
    id: 'mt-5-4',
    reference: 'Matthew 5:4',
    text: 'Blessed are those who mourn, for they shall be comforted.',
    reflection:
      'Grief is not the absence of blessing. It is the place where a particular kind of comfort comes to find you.',
    emotions: ['sad', 'heartbroken', 'depressed'],
    topics: ['grief', 'sadness', 'heartbreak'],
  },
  {
    id: 'jn-16-22',
    reference: 'John 16:22',
    text: 'Therefore you now have sorrow, but I will see you again, and your heart will rejoice, and no one will take your joy away from you.',
    reflection:
      'Sorrow has a shelf life. Joy that comes from Him does not.',
    emotions: ['sad', 'heartbroken', 'hopeless'],
    topics: ['sadness', 'grief', 'hope'],
  },
  {
    id: 'ps-23-4',
    reference: 'Psalm 23:4',
    text: 'Even though I walk through the valley of the shadow of death, I will fear no evil, for you are with me. Your rod and your staff, they comfort me.',
    reflection:
      'You walk through the valley — you don’t live there. And you walk through it with company.',
    emotions: ['fearful', 'sad'],
    topics: ['fear', 'grief', 'sadness', 'peace'],
  },

  // ─── HEARTBREAK ──────────────────────────────────────────────────────
  {
    id: 'ps-147-3',
    reference: 'Psalm 147:3',
    text: 'He heals the broken in heart, and binds up their wounds.',
    reflection:
      'God doesn’t avoid the broken pieces — He gathers them. He doesn’t patch over the wound — He binds it carefully.',
    emotions: ['heartbroken', 'sad'],
    topics: ['heartbreak', 'healing', 'grief'],
  },
  {
    id: 'isa-61-1',
    reference: 'Isaiah 61:1',
    text: 'Yahweh has anointed me to preach good news to the humble. He has sent me to bind up the brokenhearted.',
    reflection:
      'Jesus claimed this verse over Himself in His first sermon. Binding up the brokenhearted is not a side project — it is His mission.',
    emotions: ['heartbroken', 'sad', 'hopeless'],
    topics: ['heartbreak', 'healing', 'purpose'],
  },
  {
    id: 'ps-56-8',
    reference: 'Psalm 56:8',
    text: 'You count my wanderings. You put my tears into your container. Aren’t they in your book?',
    reflection:
      'Every tear matters enough to be remembered. Nothing you have cried has been lost on Him.',
    emotions: ['heartbroken', 'sad'],
    topics: ['heartbreak', 'grief', 'love'],
  },
  {
    id: 'jn-14-1',
    reference: 'John 14:1',
    text: 'Don’t let your heart be troubled. Believe in God. Believe also in me.',
    reflection:
      'A gentle command from the most gentle voice. Belief is a place where troubled hearts can come to rest.',
    emotions: ['heartbroken', 'anxious', 'fearful'],
    topics: ['heartbreak', 'anxiety', 'peace', 'faith'],
  },

  // ─── ANXIETY / OVERTHINKING / STRESS ─────────────────────────────────
  {
    id: 'phil-4-6',
    reference: 'Philippians 4:6-7',
    text: 'In nothing be anxious, but in everything, by prayer and petition with thanksgiving, let your requests be made known to God. And the peace of God, which surpasses all understanding, will guard your hearts and your thoughts in Christ Jesus.',
    reflection:
      'Anxiety wants every detail of your attention. Prayer is the transfer protocol — moving each detail from your shoulders to His.',
    emotions: ['anxious', 'stressed', 'overthinking', 'fearful'],
    topics: ['anxiety', 'overthinking', 'stress', 'peace'],
  },
  {
    id: '1pet-5-7',
    reference: '1 Peter 5:7',
    text: 'Casting all your worries on him, because he cares for you.',
    reflection:
      'Casting — not setting down gently. Throw it. He is strong enough to catch it, and He cares enough to want it from you.',
    emotions: ['anxious', 'stressed', 'fearful'],
    topics: ['anxiety', 'stress', 'fear'],
  },
  {
    id: 'mt-6-34',
    reference: 'Matthew 6:34',
    text: 'Therefore don’t be anxious for tomorrow, for tomorrow will be anxious for itself. Each day’s own evil is sufficient.',
    reflection:
      'You only have to live today. Tomorrow’s grace is reserved for tomorrow.',
    emotions: ['anxious', 'overthinking', 'stressed'],
    topics: ['anxiety', 'overthinking', 'stress'],
  },
  {
    id: 'ps-94-19',
    reference: 'Psalm 94:19',
    text: 'In the multitude of my thoughts within me, your comforts delight my soul.',
    reflection:
      'Even in the swarm of your thoughts, there is room for comfort. He delights to bring it.',
    emotions: ['anxious', 'overthinking'],
    topics: ['anxiety', 'overthinking', 'peace'],
  },
  {
    id: 'jn-14-27',
    reference: 'John 14:27',
    text: 'Peace I leave with you. My peace I give to you; not as the world gives, give I to you. Don’t let your heart be troubled, neither let it be fearful.',
    reflection:
      'The world’s peace evaporates with circumstance. His peace is given as an inheritance, deeper than your weather.',
    emotions: ['anxious', 'fearful', 'peaceful'],
    topics: ['anxiety', 'fear', 'peace'],
  },
  {
    id: '2cor-10-5',
    reference: '2 Corinthians 10:5',
    text: 'Throwing down imaginations, and every high thing that is exalted against the knowledge of God, and bringing every thought into captivity to the obedience of Christ.',
    reflection:
      'You are not at the mercy of your thoughts. You can take them captive, one at a time, and place them where they belong.',
    emotions: ['overthinking', 'anxious'],
    topics: ['overthinking', 'anxiety', 'spiritualWarfare'],
  },
  {
    id: 'isa-26-3',
    reference: 'Isaiah 26:3',
    text: 'You will keep whoever’s mind is steadfast in perfect peace, because he trusts in you.',
    reflection:
      'Peace is not the absence of thought. It is a mind anchored on the right thing, even while everything else spins.',
    emotions: ['overthinking', 'anxious', 'peaceful'],
    topics: ['overthinking', 'anxiety', 'peace', 'faith'],
  },
  {
    id: 'phil-4-8',
    reference: 'Philippians 4:8',
    text: 'Whatever things are true, whatever things are honorable, whatever things are just, whatever things are pure, whatever things are lovely — think about these things.',
    reflection:
      'You can’t empty your mind. But you can fill it. Choose well.',
    emotions: ['overthinking', 'anxious'],
    topics: ['overthinking', 'discipline'],
  },
  {
    id: 'ps-139-23',
    reference: 'Psalm 139:23-24',
    text: 'Search me, God, and know my heart. Try me, and know my thoughts. See if there is any wicked way in me, and lead me in the everlasting way.',
    reflection:
      'Hand your tangled thoughts to the One who can untangle them. He searches not to condemn but to lead.',
    emotions: ['overthinking', 'guilty'],
    topics: ['overthinking', 'guilt'],
  },
  {
    id: 'mt-6-25',
    reference: 'Matthew 6:25-26',
    text: 'Don’t be anxious for your life: what you will eat, or what you will drink… Behold the birds of the sky… your heavenly Father feeds them. Aren’t you of much more value than they?',
    reflection:
      'Look at how He provides for the smallest things. You are not small to Him.',
    emotions: ['anxious'],
    topics: ['anxiety', 'selfWorth', 'faith'],
  },
  {
    id: 'lk-12-25',
    reference: 'Luke 12:25-26',
    text: 'Which of you by being anxious can add a cubit to his height? If then you aren’t able to do even the least things, why are you anxious about the rest?',
    reflection:
      'Worry doesn’t change tomorrow. It just steals today. Set it down.',
    emotions: ['anxious', 'overthinking'],
    topics: ['anxiety', 'overthinking'],
  },

  // ─── STRESS / BURNOUT / REST ─────────────────────────────────────────
  {
    id: 'mt-11-28',
    reference: 'Matthew 11:28',
    text: 'Come to me, all you who labor and are heavily burdened, and I will give you rest.',
    reflection:
      'The invitation is open. You don’t need to clean yourself up first. Just come — burdens and all — and let Him carry what you cannot.',
    emotions: ['stressed', 'sad', 'unmotivated', 'depressed'],
    topics: ['stress', 'burnout', 'sleep'],
  },
  {
    id: 'mt-11-29',
    reference: 'Matthew 11:29-30',
    text: 'Take my yoke upon you and learn from me, for I am gentle and humble in heart; and you will find rest for your souls.',
    reflection:
      'A yoke shared with Jesus weighs less than a life carried alone. The math doesn’t make sense — it just works.',
    emotions: ['stressed', 'unmotivated'],
    topics: ['stress', 'burnout', 'discipline'],
  },
  {
    id: 'ps-46-10',
    reference: 'Psalm 46:10',
    text: 'Be still, and know that I am God.',
    reflection:
      'Stillness is the assignment. Knowing is the result. You don’t have to manage everything to know He is God.',
    emotions: ['stressed', 'anxious', 'overthinking', 'peaceful'],
    topics: ['stress', 'peace', 'anxiety'],
  },
  {
    id: 'prov-3-5',
    reference: 'Proverbs 3:5-6',
    text: 'Trust in Yahweh with all your heart, and don’t lean on your own understanding. In all your ways acknowledge him, and he will make your paths straight.',
    reflection:
      'You don’t need to understand the whole road. You need to trust the One leading you down it.',
    emotions: ['stressed', 'anxious', 'overthinking'],
    topics: ['stress', 'faith', 'purpose'],
  },
  {
    id: 'ex-14-14',
    reference: 'Exodus 14:14',
    text: 'Yahweh will fight for you, and you shall be still.',
    reflection:
      'Your job today might be smaller than you think. Be still. He is already in motion.',
    emotions: ['stressed', 'fearful'],
    topics: ['stress', 'spiritualWarfare', 'peace'],
  },
  {
    id: 'mk-6-31',
    reference: 'Mark 6:31',
    text: 'Come away into a deserted place, and rest awhile.',
    reflection:
      'Even Jesus called His disciples away to rest. Rest is not laziness — it is obedience.',
    emotions: ['stressed', 'unmotivated'],
    topics: ['burnout', 'sleep', 'stress'],
  },
  {
    id: 'gen-2-2',
    reference: 'Genesis 2:2',
    text: 'On the seventh day God finished his work which he had made; and he rested on the seventh day from all his work which he had made.',
    reflection:
      'Rest is written into the very design of the world. You are allowed to stop.',
    emotions: ['stressed', 'unmotivated'],
    topics: ['burnout', 'sleep', 'stress'],
  },
  {
    id: 'ps-127-2',
    reference: 'Psalm 127:2',
    text: 'It is vain for you to rise up early, to stay up late, eating the bread of toil; for he gives sleep to his loved ones.',
    reflection:
      'You don’t earn His love by being exhausted. Sleep is a gift He hands to those He calls His.',
    emotions: ['stressed', 'unmotivated'],
    topics: ['sleep', 'burnout', 'stress'],
  },
  {
    id: 'ps-4-8',
    reference: 'Psalm 4:8',
    text: 'In peace I will both lay myself down and sleep, for you, Yahweh alone, make me live in safety.',
    reflection:
      'Sleep is an act of trust. You can lay it down tonight.',
    emotions: ['peaceful'],
    topics: ['sleep', 'peace'],
  },
  {
    id: 'prov-3-24',
    reference: 'Proverbs 3:24',
    text: 'When you lie down, you will not be afraid. Yes, you will lie down, and your sleep will be sweet.',
    reflection:
      'Sweet sleep is a gift God gives to those who place their lives in His hands.',
    emotions: ['peaceful', 'fearful'],
    topics: ['sleep', 'peace', 'fear'],
  },

  // ─── FEAR ─────────────────────────────────────────────────────────────
  {
    id: 'isa-41-10',
    reference: 'Isaiah 41:10',
    text: 'Don’t you be afraid, for I am with you. Don’t be dismayed, for I am your God. I will strengthen you. I will help you. I will uphold you with the right hand of my righteousness.',
    reflection:
      'Four promises in one breath: presence, strength, help, and a steady hand. Whatever you face today, you do not face it alone.',
    emotions: ['fearful', 'anxious', 'sad', 'hopeless'],
    topics: ['fear', 'anxiety', 'strength', 'hope'],
  },
  {
    id: '2tim-1-7',
    reference: '2 Timothy 1:7',
    text: 'For God didn’t give us a spirit of fear, but of power, love, and self-control.',
    reflection:
      'Fear is not from God. Power, love, and self-control are — and they were given to you, already, in seed form.',
    emotions: ['fearful', 'anxious'],
    topics: ['fear', 'identity', 'discipline'],
  },
  {
    id: 'ps-27-1',
    reference: 'Psalm 27:1',
    text: 'Yahweh is my light and my salvation. Whom shall I fear? Yahweh is the strength of my life. Of whom shall I be afraid?',
    reflection:
      'Fear shrinks when you ask it the right question: in light of who God is, who exactly is bigger than Him?',
    emotions: ['fearful'],
    topics: ['fear', 'strength', 'identity'],
  },
  {
    id: 'isa-43-1',
    reference: 'Isaiah 43:1',
    text: 'Don’t be afraid, for I have redeemed you. I have called you by your name. You are mine.',
    reflection:
      'He knows your name. He calls you His. Fear cannot survive being held that closely.',
    emotions: ['fearful', 'lonely'],
    topics: ['fear', 'identity', 'loneliness', 'selfWorth'],
  },
  {
    id: 'josh-1-9',
    reference: 'Joshua 1:9',
    text: 'Haven’t I commanded you? Be strong and courageous. Don’t be afraid. Don’t be dismayed, for Yahweh your God is with you wherever you go.',
    reflection:
      'Courage isn’t the absence of fear. It is faith that takes the next step anyway, because of who walks with you.',
    emotions: ['fearful'],
    topics: ['fear', 'strength', 'faith', 'confidence'],
  },
  {
    id: 'ps-56-3',
    reference: 'Psalm 56:3',
    text: 'When I am afraid, I will put my trust in you.',
    reflection:
      'Fear and faith can occupy the same heart. Faith just wins by deciding what to do.',
    emotions: ['fearful', 'anxious'],
    topics: ['fear', 'faith'],
  },
  {
    id: 'rom-8-15',
    reference: 'Romans 8:15',
    text: 'For you didn’t receive the spirit of bondage again to fear, but you received the Spirit of adoption, by whom we cry, “Abba! Father!”',
    reflection:
      'You are not God’s servant who hopes He’s in a good mood. You are His child. Different posture entirely.',
    emotions: ['fearful'],
    topics: ['fear', 'identity', 'love'],
  },

  // ─── LONELINESS ──────────────────────────────────────────────────────
  {
    id: 'deut-31-6',
    reference: 'Deuteronomy 31:6',
    text: 'Be strong and courageous. Don’t be afraid or scared of them; for Yahweh your God himself is who goes with you. He will not fail you nor forsake you.',
    reflection:
      'You may feel alone, but you are not. The same God who led His people through the wilderness walks every step of yours.',
    emotions: ['lonely', 'fearful', 'anxious'],
    topics: ['loneliness', 'fear', 'strength'],
  },
  {
    id: 'heb-13-5',
    reference: 'Hebrews 13:5',
    text: 'I will in no way leave you, neither will I in any way forsake you.',
    reflection:
      'Two negatives stacked for emphasis. He will not — under any circumstance, in any season — walk away from you.',
    emotions: ['lonely', 'fearful'],
    topics: ['loneliness', 'fear', 'love'],
  },
  {
    id: 'ps-68-6',
    reference: 'Psalm 68:6',
    text: 'God sets the lonely in families.',
    reflection:
      'Loneliness is not your destination. God is in the business of bringing belonging where there was none.',
    emotions: ['lonely'],
    topics: ['loneliness', 'family', 'friendship'],
  },
  {
    id: 'mt-28-20',
    reference: 'Matthew 28:20',
    text: 'Behold, I am with you always, even to the end of the age.',
    reflection:
      'The last words Jesus spoke before ascending. He left them — and you — with a promise of unbroken presence.',
    emotions: ['lonely', 'fearful', 'anxious'],
    topics: ['loneliness', 'fear'],
  },
  {
    id: 'ps-25-16',
    reference: 'Psalm 25:16',
    text: 'Turn to me, and have mercy on me, for I am desolate and afflicted.',
    reflection:
      'Even desolation is not a place beyond prayer. He turns toward those who turn toward Him.',
    emotions: ['lonely', 'sad'],
    topics: ['loneliness', 'sadness'],
  },
  {
    id: 'ps-139-7',
    reference: 'Psalm 139:7-8',
    text: 'Where could I go from your Spirit? Or where could I flee from your presence? If I ascend up into heaven, you are there. If I make my bed in Sheol, behold, you are there!',
    reflection:
      'There is no room in the universe that is empty of Him. Wherever you are tonight, He is closer than the air in your lungs.',
    emotions: ['lonely', 'fearful'],
    topics: ['loneliness', 'fear', 'faith'],
  },

  // ─── ANGER ───────────────────────────────────────────────────────────
  {
    id: 'eph-4-26',
    reference: 'Ephesians 4:26',
    text: 'Be angry, and don’t sin. Don’t let the sun go down on your wrath.',
    reflection:
      'Anger isn’t the sin. What you do with it is the question. Don’t let it bed down in you overnight.',
    emotions: ['angry'],
    topics: ['anger', 'discipline'],
  },
  {
    id: 'jas-1-19',
    reference: 'James 1:19-20',
    text: 'Let every man be swift to hear, slow to speak, and slow to anger; for the anger of man doesn’t produce the righteousness of God.',
    reflection:
      'Slow is the operative word. Slow your breath, slow your tongue, slow your hand. Speed serves anger; slowness starves it.',
    emotions: ['angry', 'stressed'],
    topics: ['anger', 'patience', 'discipline'],
  },
  {
    id: 'prov-15-1',
    reference: 'Proverbs 15:1',
    text: 'A gentle answer turns away wrath, but a harsh word stirs up anger.',
    reflection:
      'The most powerful response is rarely the loudest. Gentleness is not weakness — it is wisdom under control.',
    emotions: ['angry'],
    topics: ['anger', 'discipline'],
  },
  {
    id: 'ps-37-8',
    reference: 'Psalm 37:8',
    text: 'Cease from anger, and forsake wrath. Don’t fret; it leads only to evildoing.',
    reflection:
      'Letting go of anger is an act of trust — that God will handle what you cannot, more justly than you ever could.',
    emotions: ['angry'],
    topics: ['anger', 'forgiveness'],
  },
  {
    id: 'prov-29-11',
    reference: 'Proverbs 29:11',
    text: 'A fool vents all of his anger, but a wise man brings himself under control.',
    reflection:
      'Anger is the smoke. Wisdom is the hand that opens the window.',
    emotions: ['angry'],
    topics: ['anger', 'discipline'],
  },

  // ─── GUILT / FORGIVENESS ─────────────────────────────────────────────
  {
    id: '1jn-1-9',
    reference: '1 John 1:9',
    text: 'If we confess our sins, he is faithful and righteous to forgive us the sins and to cleanse us from all unrighteousness.',
    reflection:
      'Confession is not groveling. It is honesty. And honesty meets a faithfulness that already planned to forgive.',
    emotions: ['guilty', 'hopeless'],
    topics: ['guilt', 'forgiveness'],
  },
  {
    id: 'ps-103-12',
    reference: 'Psalm 103:12',
    text: 'As far as the east is from the west, so far has he removed our transgressions from us.',
    reflection:
      'East and west never meet. That is the distance He has placed between you and what you’ve done.',
    emotions: ['guilty'],
    topics: ['guilt', 'forgiveness'],
  },
  {
    id: 'rom-8-1',
    reference: 'Romans 8:1',
    text: 'There is therefore now no condemnation to those who are in Christ Jesus.',
    reflection:
      'No condemnation. Not less condemnation. Not deserved condemnation. None.',
    emotions: ['guilty', 'hopeless'],
    topics: ['guilt', 'identity', 'forgiveness'],
  },
  {
    id: 'isa-1-18',
    reference: 'Isaiah 1:18',
    text: 'Though your sins are as scarlet, they shall be as white as snow. Though they are red like crimson, they shall be as wool.',
    reflection:
      'The color of your worst day is not the color of your future. He specializes in this kind of laundry.',
    emotions: ['guilty', 'hopeless'],
    topics: ['guilt', 'forgiveness', 'identity'],
  },
  {
    id: 'mic-7-19',
    reference: 'Micah 7:19',
    text: 'He will again have compassion on us. He will tread our iniquities under foot; and you will cast all their sins into the depths of the sea.',
    reflection:
      'Buried in the deep — He doesn’t go fishing for what He has forgiven.',
    emotions: ['guilty'],
    topics: ['guilt', 'forgiveness'],
  },
  {
    id: 'mt-6-14',
    reference: 'Matthew 6:14',
    text: 'For if you forgive men their trespasses, your heavenly Father will also forgive you.',
    reflection:
      'Forgiving someone else is rarely about them. It’s about freeing your own hands to receive.',
    emotions: ['angry', 'guilty'],
    topics: ['forgiveness', 'anger'],
  },
  {
    id: 'col-3-13',
    reference: 'Colossians 3:13',
    text: 'Bearing with one another, and forgiving each other, if any man has a complaint against any; even as Christ forgave you, so you also do.',
    reflection:
      'The measure isn’t fairness. The measure is the grace already poured over you.',
    emotions: ['angry', 'guilty'],
    topics: ['forgiveness', 'love'],
  },
  {
    id: 'eph-4-32',
    reference: 'Ephesians 4:32',
    text: 'And be kind to one another, tender hearted, forgiving each other, just as God also in Christ forgave you.',
    reflection:
      'Kindness, tenderness, forgiveness — three doors out of bitterness.',
    emotions: ['angry'],
    topics: ['forgiveness', 'love', 'family'],
  },

  // ─── HOPELESSNESS / HOPE ─────────────────────────────────────────────
  {
    id: 'jer-29-11',
    reference: 'Jeremiah 29:11',
    text: 'For I know the thoughts that I think toward you, says Yahweh, thoughts of peace, and not of evil, to give you hope and a future.',
    reflection:
      'God’s thoughts toward you today are good ones. He is not done writing your story.',
    emotions: ['hopeless', 'depressed', 'sad'],
    topics: ['hope', 'purpose', 'hopelessness'],
  },
  {
    id: 'rom-15-13',
    reference: 'Romans 15:13',
    text: 'Now may the God of hope fill you with all joy and peace in believing, that you may abound in hope, in the power of the Holy Spirit.',
    reflection:
      'Hope is not something you generate. It is poured in. Open your hands.',
    emotions: ['hopeless', 'sad'],
    topics: ['hope', 'peace'],
  },
  {
    id: 'lam-3-22',
    reference: 'Lamentations 3:22-23',
    text: 'It is because of Yahweh’s loving kindnesses that we are not consumed, because his compassion doesn’t fail. They are new every morning. Great is your faithfulness.',
    reflection:
      'Yesterday’s mercy isn’t today’s ration. Each morning, a fresh supply.',
    emotions: ['hopeless', 'depressed', 'thankful'],
    topics: ['hope', 'thankfulness', 'faith'],
  },
  {
    id: 'rom-5-5',
    reference: 'Romans 5:5',
    text: 'Hope doesn’t disappoint us, because God’s love has been poured out into our hearts through the Holy Spirit who was given to us.',
    reflection:
      'The hope God gives is not wishful thinking. It is the overflow of love already inside you.',
    emotions: ['hopeless', 'sad'],
    topics: ['hope', 'love'],
  },
  {
    id: 'rom-8-28',
    reference: 'Romans 8:28',
    text: 'We know that all things work together for good for those who love God, for those who are called according to his purpose.',
    reflection:
      'Not every individual thing is good. But all of it, woven together, becomes good in His hands.',
    emotions: ['hopeful', 'hopeless'],
    topics: ['hope', 'purpose', 'faith'],
  },
  {
    id: 'heb-11-1',
    reference: 'Hebrews 11:1',
    text: 'Now faith is assurance of things hoped for, proof of things not seen.',
    reflection:
      'Faith is hope with weight. It can hold things you haven’t seen yet.',
    emotions: ['hopeful'],
    topics: ['faith', 'hope'],
  },
  {
    id: 'ps-71-14',
    reference: 'Psalm 71:14',
    text: 'But I will always hope, and will add to all of your praise.',
    reflection:
      'Hope is a decision before it is a feeling. Keep choosing it.',
    emotions: ['hopeful'],
    topics: ['hope', 'discipline'],
  },
  {
    id: 'mic-7-7',
    reference: 'Micah 7:7',
    text: 'But as for me, I will look to Yahweh. I will wait for the God of my salvation. My God will hear me.',
    reflection:
      'Look up. Wait. Be heard. Three small disciplines that rebuild a hopeful soul.',
    emotions: ['hopeful'],
    topics: ['hope', 'patience', 'faith'],
  },

  // ─── MOTIVATION / DISCIPLINE / PURPOSE ───────────────────────────────
  {
    id: 'phil-4-13',
    reference: 'Philippians 4:13',
    text: 'I can do all things through Christ who strengthens me.',
    reflection:
      'Not because you are strong. Because He is — and His strength is on offer for the next small step.',
    emotions: ['unmotivated', 'hopeless'],
    topics: ['motivation', 'strength', 'confidence'],
  },
  {
    id: 'isa-40-31',
    reference: 'Isaiah 40:31',
    text: 'But those who wait for Yahweh will renew their strength. They will mount up with wings like eagles. They will run, and not be weary. They will walk, and not faint.',
    reflection:
      'Waiting is not idleness. It is the way new strength enters tired bones.',
    emotions: ['unmotivated', 'stressed', 'hopeless'],
    topics: ['motivation', 'patience', 'strength', 'burnout'],
  },
  {
    id: 'gal-6-9',
    reference: 'Galatians 6:9',
    text: 'Let’s not be weary in doing good, for we will reap in due season, if we don’t give up.',
    reflection:
      'Faithfulness is small, repeated, unglamorous, and worth it. The harvest is real even when the seed feels lost.',
    emotions: ['unmotivated', 'hopeless'],
    topics: ['discipline', 'patience', 'motivation'],
  },
  {
    id: 'col-3-23',
    reference: 'Colossians 3:23',
    text: 'Whatever you do, work heartily, as for the Lord, and not for men.',
    reflection:
      'A different audience changes the energy. Today’s small task is worship if you let it be.',
    emotions: ['unmotivated'],
    topics: ['discipline', 'purpose', 'motivation'],
  },
  {
    id: '1cor-9-25',
    reference: '1 Corinthians 9:25',
    text: 'Every man who strives in the games exercises self-control in all things. Now they do it to receive a corruptible crown, but we an incorruptible.',
    reflection:
      'You are training for something that lasts. Tiny disciplines are coins in an eternal account.',
    emotions: ['unmotivated'],
    topics: ['discipline', 'recovery'],
  },
  {
    id: 'heb-12-1',
    reference: 'Hebrews 12:1',
    text: 'Let’s lay aside every weight and the sin which so easily entangles us, and let’s run with perseverance the race that is set before us.',
    reflection:
      'You don’t have to carry everything to the finish line. Set down what is slowing you. Then run.',
    emotions: ['unmotivated', 'guilty'],
    topics: ['discipline', 'motivation', 'recovery'],
  },
  {
    id: 'heb-12-11',
    reference: 'Hebrews 12:11',
    text: 'All chastening seems for the present to be not joyous but grievous; yet afterward it yields the peaceful fruit of righteousness to those who have been exercised by it.',
    reflection:
      'Discipline hurts in the middle. But its fruit is peace — and you’ll thank yourself for not quitting.',
    emotions: ['unmotivated'],
    topics: ['discipline', 'recovery'],
  },
  {
    id: 'eph-2-10',
    reference: 'Ephesians 2:10',
    text: 'For we are his workmanship, created in Christ Jesus for good works, which God prepared before that we would walk in them.',
    reflection:
      'You are not an accident. The works in front of you today were prepared with you in mind.',
    emotions: ['unmotivated'],
    topics: ['purpose', 'identity', 'selfWorth'],
  },
  {
    id: 'jer-1-5',
    reference: 'Jeremiah 1:5',
    text: 'Before I formed you in the womb, I knew you. Before you were born, I sanctified you.',
    reflection:
      'You were known before you were knowable. That is the kind of love at the root of who you are.',
    emotions: ['lonely'],
    topics: ['identity', 'selfWorth', 'purpose'],
  },
  {
    id: 'ps-139-14',
    reference: 'Psalm 139:14',
    text: 'I will give thanks to you, for I am fearfully and wonderfully made. Your works are wonderful. My soul knows that very well.',
    reflection:
      'You are not a draft. You are a finished thought of God’s, still being unfolded.',
    emotions: ['lonely', 'hopeless'],
    topics: ['identity', 'selfWorth', 'thankfulness'],
  },

  // ─── HEALING ─────────────────────────────────────────────────────────
  {
    id: 'jer-17-14',
    reference: 'Jeremiah 17:14',
    text: 'Heal me, O Yahweh, and I shall be healed. Save me, and I shall be saved; for you are my praise.',
    reflection:
      'The petition is simple. The trust under it is everything.',
    emotions: ['sad', 'heartbroken'],
    topics: ['healing'],
  },
  {
    id: 'ps-30-2',
    reference: 'Psalm 30:2',
    text: 'Yahweh my God, I cried to you, and you have healed me.',
    reflection:
      'The cry is not unanswered. It is the very thing that draws the healing close.',
    emotions: ['sad', 'heartbroken'],
    topics: ['healing'],
  },
  {
    id: 'isa-53-5',
    reference: 'Isaiah 53:5',
    text: 'He was pierced for our transgressions. He was crushed for our iniquities. The punishment that brought our peace was on him; and by his wounds we are healed.',
    reflection:
      'The price was paid before you knew it needed to be. Healing is your inheritance, not your achievement.',
    emotions: ['guilty', 'heartbroken'],
    topics: ['healing', 'forgiveness'],
  },
  {
    id: 'jas-5-16',
    reference: 'James 5:16',
    text: 'Confess your offenses to one another, and pray for one another, that you may be healed. The insistent prayer of a righteous person is powerfully effective.',
    reflection:
      'Healing often comes through the brave act of being known by another believer.',
    emotions: ['guilty'],
    topics: ['healing', 'friendship'],
  },
  {
    id: 'ps-103-3',
    reference: 'Psalm 103:3',
    text: 'Who forgives all your sins, who heals all your diseases.',
    reflection:
      'Forgiveness and healing — two sides of one mercy, both freely given.',
    emotions: ['guilty'],
    topics: ['healing', 'forgiveness'],
  },

  // ─── ADDICTION / TEMPTATION / RECOVERY ───────────────────────────────
  {
    id: '1cor-10-13',
    reference: '1 Corinthians 10:13',
    text: 'No temptation has taken you except what is common to man. God is faithful, who will not allow you to be tempted above what you are able, but will with the temptation also make the way of escape, that you may be able to endure it.',
    reflection:
      'Every temptation has a back door. Look up — He has already drawn the map.',
    emotions: ['guilty'],
    topics: ['temptation', 'addiction', 'recovery'],
  },
  {
    id: 'jas-4-7',
    reference: 'James 4:7',
    text: 'Be subject therefore to God. But resist the devil, and he will flee from you.',
    reflection:
      'Submission first, resistance second. The order matters. You don’t fight alone.',
    emotions: ['guilty'],
    topics: ['temptation', 'spiritualWarfare', 'addiction'],
  },
  {
    id: 'rom-6-14',
    reference: 'Romans 6:14',
    text: 'For sin will not have dominion over you, for you are not under law, but under grace.',
    reflection:
      'Sin is not your boss anymore. Grace is.',
    emotions: ['guilty'],
    topics: ['addiction', 'recovery', 'identity'],
  },
  {
    id: 'rom-7-24',
    reference: 'Romans 7:24-25',
    text: 'What a wretched man I am! Who will deliver me out of the body of this death? I thank God through Jesus Christ, our Lord!',
    reflection:
      'Even Paul wrestled. Even Paul had an answer: not “I will,” but “He will.”',
    emotions: ['guilty', 'hopeless'],
    topics: ['addiction', 'recovery'],
  },
  {
    id: '2cor-12-9',
    reference: '2 Corinthians 12:9',
    text: 'He has said to me, “My grace is sufficient for you, for my power is made perfect in weakness.”',
    reflection:
      'Your weakness is not disqualification. It is the very place where His power gets to show off.',
    emotions: ['guilty', 'unmotivated'],
    topics: ['addiction', 'recovery', 'strength'],
  },
  {
    id: 'gal-5-1',
    reference: 'Galatians 5:1',
    text: 'Stand firm therefore in the liberty by which Christ has made us free, and don’t be entangled again with a yoke of bondage.',
    reflection:
      'Freedom is not something you’re working toward. It is something you’re standing in.',
    emotions: ['guilty'],
    topics: ['addiction', 'recovery', 'identity'],
  },
  {
    id: 'eph-6-12',
    reference: 'Ephesians 6:12',
    text: 'For our wrestling is not against flesh and blood, but against the principalities, against the powers… against the spiritual forces of wickedness in the heavenly places.',
    reflection:
      'The real fight isn’t with people. Knowing this changes how you swing.',
    emotions: ['angry', 'fearful'],
    topics: ['spiritualWarfare'],
  },
  {
    id: 'eph-6-13',
    reference: 'Ephesians 6:13',
    text: 'Therefore put on the whole armor of God, that you may be able to withstand in the evil day, and having done all, to stand.',
    reflection:
      'You are not naked in this fight. You have armor. Put it on.',
    emotions: ['fearful'],
    topics: ['spiritualWarfare', 'strength'],
  },
  {
    id: '1pet-5-8',
    reference: '1 Peter 5:8-9',
    text: 'Be sober and self-controlled. Be watchful. Your adversary, the devil, walks around like a roaring lion, seeking whom he may devour. Withstand him steadfast in your faith.',
    reflection:
      'A roar is loud, but a lion that is fled-from is a lion that flees back.',
    emotions: ['fearful', 'anxious'],
    topics: ['spiritualWarfare', 'temptation'],
  },

  // ─── PEACE / SLEEP ───────────────────────────────────────────────────
  {
    id: 'num-6-24',
    reference: 'Numbers 6:24-26',
    text: 'Yahweh bless you, and keep you. Yahweh make his face to shine on you, and be gracious to you. Yahweh lift up his face toward you, and give you peace.',
    reflection:
      'An ancient blessing meant for you today. Receive it slowly.',
    emotions: ['peaceful'],
    topics: ['peace'],
  },
  {
    id: 'col-3-15',
    reference: 'Colossians 3:15',
    text: 'And let the peace of God rule in your hearts… and be thankful.',
    reflection:
      'Peace and thankfulness are travel companions. Where one shows up, the other follows.',
    emotions: ['thankful', 'peaceful'],
    topics: ['peace', 'thankfulness'],
  },
  {
    id: 'gal-5-22',
    reference: 'Galatians 5:22-23',
    text: 'The fruit of the Spirit is love, joy, peace, patience, kindness, goodness, faith, gentleness, and self-control.',
    reflection:
      'These don’t grow by force. They grow by abiding. Stay close. The fruit will follow.',
    emotions: ['peaceful'],
    topics: ['peace', 'patience', 'love', 'discipline'],
  },

  // ─── HAPPY / THANKFUL ────────────────────────────────────────────────
  {
    id: 'ps-118-24',
    reference: 'Psalm 118:24',
    text: 'This is the day that Yahweh has made. We will rejoice and be glad in it!',
    reflection:
      'Today was custom-made. Don’t spend it longing for another one.',
    emotions: ['happy', 'thankful', 'peaceful'],
    topics: ['thankfulness', 'hope'],
  },
  {
    id: 'neh-8-10',
    reference: 'Nehemiah 8:10',
    text: 'The joy of Yahweh is your strength.',
    reflection:
      'Joy is not a soft feeling. It is the muscle behind everything you do well.',
    emotions: ['happy', 'thankful'],
    topics: ['thankfulness', 'strength'],
  },
  {
    id: 'ps-16-11',
    reference: 'Psalm 16:11',
    text: 'You will show me the path of life. In your presence is fullness of joy. In your right hand there are pleasures forever more.',
    reflection:
      'Fullness — not partial joy. He is generous with this.',
    emotions: ['happy', 'thankful'],
    topics: ['thankfulness', 'purpose'],
  },
  {
    id: 'jn-15-11',
    reference: 'John 15:11',
    text: 'I have spoken these things to you, that my joy may remain in you, and that your joy may be made full.',
    reflection:
      'His joy is not a trickle. It is meant to fill you up to the brim.',
    emotions: ['happy', 'hopeful'],
    topics: ['thankfulness', 'hope'],
  },
  {
    id: '1thes-5-18',
    reference: '1 Thessalonians 5:18',
    text: 'In everything give thanks, for this is the will of God in Christ Jesus toward you.',
    reflection:
      'In everything, not for everything. Gratitude is a posture, not a denial of what is hard.',
    emotions: ['thankful'],
    topics: ['thankfulness'],
  },
  {
    id: 'ps-100-4',
    reference: 'Psalm 100:4',
    text: 'Enter into his gates with thanksgiving, into his courts with praise.',
    reflection:
      'Thanksgiving is a door. Step through it and you’ll find yourself closer than you started.',
    emotions: ['thankful', 'happy'],
    topics: ['thankfulness'],
  },
  {
    id: 'jas-1-17',
    reference: 'James 1:17',
    text: 'Every good gift and every perfect gift is from above, coming down from the Father of lights, with whom can be no variation, nor turning shadow.',
    reflection:
      'Trace any good thing in your day back to its source. You’ll keep ending up at the same Person.',
    emotions: ['thankful', 'happy'],
    topics: ['thankfulness'],
  },

  // ─── IDENTITY / SELF-WORTH ───────────────────────────────────────────
  {
    id: '2cor-5-17',
    reference: '2 Corinthians 5:17',
    text: 'Therefore if anyone is in Christ, he is a new creation. The old things have passed away. Behold, all things have become new.',
    reflection:
      'You are not your worst day. You are who Christ has made new in you.',
    emotions: ['guilty', 'hopeless'],
    topics: ['identity', 'selfWorth', 'forgiveness'],
  },
  {
    id: 'eph-1-4',
    reference: 'Ephesians 1:4-5',
    text: 'He chose us in him before the foundation of the world… having predestined us for adoption as children through Jesus Christ.',
    reflection:
      'You were wanted before the world existed. That is the depth of your belonging.',
    emotions: ['lonely'],
    topics: ['identity', 'selfWorth', 'love'],
  },
  {
    id: '1pet-2-9',
    reference: '1 Peter 2:9',
    text: 'But you are a chosen race, a royal priesthood, a holy nation, a people for God’s own possession.',
    reflection:
      'Four titles in one verse. None of them are small. All of them are yours.',
    emotions: ['lonely', 'hopeless'],
    topics: ['identity', 'selfWorth'],
  },
  {
    id: 'gal-2-20',
    reference: 'Galatians 2:20',
    text: 'I have been crucified with Christ, and it is no longer I who live, but Christ lives in me.',
    reflection:
      'Your old self isn’t in charge. The Christ alive in you is.',
    emotions: ['guilty'],
    topics: ['identity', 'recovery'],
  },
  {
    id: 'jn-1-12',
    reference: 'John 1:12',
    text: 'But as many as received him, to them he gave the right to become God’s children, to those who believe in his name.',
    reflection:
      'Not a servant. Not a stranger. A child, with the right of access.',
    emotions: ['lonely'],
    topics: ['identity', 'love'],
  },

  // ─── DOUBT / FAITH ───────────────────────────────────────────────────
  {
    id: 'mk-9-24',
    reference: 'Mark 9:24',
    text: 'I believe. Help my unbelief!',
    reflection:
      'A father’s honest prayer, and Jesus answered it. Doubt does not disqualify your faith — it gives it a place to grow.',
    emotions: ['hopeless'],
    topics: ['doubt', 'faith'],
  },
  {
    id: 'jas-1-6',
    reference: 'James 1:6',
    text: 'But let him ask in faith, without any doubting, for he who doubts is like a wave of the sea, driven by the wind and tossed.',
    reflection:
      'Faith is the anchor. Ask boldly. He gives generously.',
    emotions: ['anxious'],
    topics: ['doubt', 'faith'],
  },
  {
    id: 'heb-11-6',
    reference: 'Hebrews 11:6',
    text: 'Without faith it is impossible to be well pleasing to him, for he who comes to God must believe that he exists, and that he is a rewarder of those who seek him.',
    reflection:
      'Seek Him honestly, doubts and all. The seeking is itself faith.',
    emotions: ['hopeless'],
    topics: ['faith', 'doubt'],
  },
  {
    id: 'mt-17-20',
    reference: 'Matthew 17:20',
    text: 'If you have faith as a grain of mustard seed… nothing will be impossible for you.',
    reflection:
      'A mustard seed is enough. The size of your faith matters less than the size of the One you’ve placed it in.',
    emotions: ['hopeless'],
    topics: ['faith', 'doubt'],
  },

  // ─── LOVE / FRIENDSHIP / FAMILY ──────────────────────────────────────
  {
    id: '1cor-13-4',
    reference: '1 Corinthians 13:4-7',
    text: 'Love is patient and is kind. Love doesn’t envy. Love doesn’t brag, is not proud, doesn’t behave itself inappropriately, doesn’t seek its own way, is not provoked, takes no account of evil; doesn’t rejoice in unrighteousness, but rejoices with the truth; bears all things, believes all things, hopes all things, endures all things.',
    reflection:
      'Read this slowly with your own name in place of "love." Wherever it doesn’t fit yet — that’s where the Spirit is still working.',
    emotions: ['peaceful'],
    topics: ['love', 'patience', 'family', 'friendship'],
  },
  {
    id: '1jn-4-19',
    reference: '1 John 4:19',
    text: 'We love him, because he first loved us.',
    reflection:
      'You are not generating love from yourself. You are returning it.',
    emotions: ['peaceful', 'thankful'],
    topics: ['love'],
  },
  {
    id: 'rom-8-38',
    reference: 'Romans 8:38-39',
    text: 'I am persuaded that neither death, nor life, nor angels, nor principalities, nor things present, nor things to come, nor powers, nor height, nor depth, nor any other created thing will be able to separate us from God’s love.',
    reflection:
      'Nothing on the list. Not your worst day, not your worst self. Nothing.',
    emotions: ['lonely', 'guilty'],
    topics: ['love', 'identity'],
  },
  {
    id: 'prov-17-17',
    reference: 'Proverbs 17:17',
    text: 'A friend loves at all times; and a brother is born for adversity.',
    reflection:
      'Real friends don’t evaporate when the weather changes. Be that for someone today.',
    emotions: ['lonely'],
    topics: ['friendship', 'love'],
  },
  {
    id: 'prov-27-17',
    reference: 'Proverbs 27:17',
    text: 'Iron sharpens iron; so a man sharpens his friend’s countenance.',
    reflection:
      'Sharpening hurts a little. The right friendships make you better without breaking you.',
    emotions: ['lonely'],
    topics: ['friendship'],
  },
  {
    id: 'ecc-4-9',
    reference: 'Ecclesiastes 4:9-10',
    text: 'Two are better than one, because they have a good reward for their labor. For if they fall, the one will lift up his fellow.',
    reflection:
      'Don’t walk this alone if you don’t have to. There is a particular reward reserved for the walked-together life.',
    emotions: ['lonely'],
    topics: ['friendship', 'family'],
  },
  {
    id: 'josh-24-15',
    reference: 'Joshua 24:15',
    text: 'As for me and my house, we will serve Yahweh.',
    reflection:
      'A family’s direction begins with one person’s decision. Be that person.',
    emotions: ['hopeful'],
    topics: ['family', 'discipline'],
  },
  {
    id: 'eph-5-25',
    reference: 'Ephesians 5:25',
    text: 'Husbands, love your wives, even as Christ also loved the assembly, and gave himself up for it.',
    reflection:
      'The standard for marital love is sacrificial, not transactional.',
    emotions: ['peaceful'],
    topics: ['family', 'love'],
  },
  {
    id: 'eph-6-1',
    reference: 'Ephesians 6:1-4',
    text: 'Children, obey your parents in the Lord, for this is right… You fathers, don’t provoke your children to wrath, but nurture them in the discipline and instruction of the Lord.',
    reflection:
      'Honor flows both directions. Tenderness is not a weakness in parenting — it is the assignment.',
    emotions: ['peaceful'],
    topics: ['family'],
  },

  // ─── EXAMS / STUDIES / FAILURE / SUCCESS ─────────────────────────────
  {
    id: 'prov-2-6',
    reference: 'Proverbs 2:6',
    text: 'For Yahweh gives wisdom. Out of his mouth comes knowledge and understanding.',
    reflection:
      'You don’t generate wisdom on your own. Ask Him for it before you open the book.',
    emotions: ['anxious'],
    topics: ['exams', 'discipline', 'success'],
  },
  {
    id: 'jas-1-5',
    reference: 'James 1:5',
    text: 'If any of you lacks wisdom, let him ask of God, who gives to all liberally and without reproach.',
    reflection:
      'No shame in asking. He gives generously and without keeping score.',
    emotions: ['anxious'],
    topics: ['exams', 'doubt', 'purpose'],
  },
  {
    id: 'prov-16-3',
    reference: 'Proverbs 16:3',
    text: 'Commit your deeds to Yahweh, and your plans shall succeed.',
    reflection:
      'Commit the work first. Outcomes are downstream of devotion.',
    emotions: ['anxious'],
    topics: ['exams', 'success', 'purpose'],
  },
  {
    id: 'col-3-2',
    reference: 'Colossians 3:2',
    text: 'Set your mind on the things that are above, not on the things that are on the earth.',
    reflection:
      'The score on the test is not the score on your life. Both matter — but in their proper order.',
    emotions: ['anxious', 'stressed'],
    topics: ['exams', 'success'],
  },
  {
    id: 'prov-24-16',
    reference: 'Proverbs 24:16',
    text: 'For a righteous man falls seven times and rises up again, but the wicked are overthrown by calamity.',
    reflection:
      'Falling is not failing. Staying down is. Get back up.',
    emotions: ['hopeless', 'unmotivated'],
    topics: ['failure', 'recovery', 'discipline'],
  },
  {
    id: 'phil-3-13',
    reference: 'Philippians 3:13-14',
    text: 'Forgetting the things which are behind, and stretching forward to the things which are before, I press on toward the goal.',
    reflection:
      'The past doesn’t get a vote on your future. Stretch forward.',
    emotions: ['hopeless', 'unmotivated'],
    topics: ['failure', 'motivation', 'recovery'],
  },
  {
    id: 'mic-7-8',
    reference: 'Micah 7:8',
    text: 'Don’t rejoice against me, my enemy. When I fall, I will arise.',
    reflection:
      'Falls are not finals. The next chapter is "I will arise."',
    emotions: ['hopeless'],
    topics: ['failure', 'recovery'],
  },
  {
    id: 'deut-8-18',
    reference: 'Deuteronomy 8:18',
    text: 'But you shall remember Yahweh your God, for it is he who gives you power to get wealth.',
    reflection:
      'When success comes, remember the One who handed you the strength.',
    emotions: ['happy', 'thankful'],
    topics: ['success', 'thankfulness'],
  },
  {
    id: 'ps-127-1',
    reference: 'Psalm 127:1',
    text: 'Unless Yahweh builds the house, they who build it labor in vain.',
    reflection:
      'All accomplishment without Him is sand. With Him, even the small things stand.',
    emotions: ['stressed'],
    topics: ['success', 'purpose'],
  },

  // ─── PATIENCE ────────────────────────────────────────────────────────
  {
    id: 'ps-37-7',
    reference: 'Psalm 37:7',
    text: 'Rest in Yahweh, and wait patiently for him.',
    reflection:
      'Waiting is not lost time. It is where rest does its slow, holy work.',
    emotions: ['stressed', 'anxious'],
    topics: ['patience', 'peace'],
  },
  {
    id: 'ecc-3-1',
    reference: 'Ecclesiastes 3:1',
    text: 'For everything there is a season, and a time for every purpose under heaven.',
    reflection:
      'You are not behind. You are in your season. Different seasons require different things of you.',
    emotions: ['unmotivated'],
    topics: ['patience', 'purpose', 'hope'],
  },
  {
    id: 'rom-5-3',
    reference: 'Romans 5:3-4',
    text: 'We also rejoice in our sufferings, knowing that suffering produces perseverance; and perseverance, proven character; and proven character, hope.',
    reflection:
      'Hardship is not wasted on the patient soul. It is the soil from which character grows.',
    emotions: ['stressed'],
    topics: ['patience', 'hope', 'discipline'],
  },
  {
    id: 'jas-1-3',
    reference: 'James 1:3-4',
    text: 'The testing of your faith produces endurance. Let endurance have its perfect work, that you may be perfect and complete, lacking in nothing.',
    reflection:
      'Endurance is doing its perfect work. Don’t interrupt it.',
    emotions: ['stressed'],
    topics: ['patience', 'faith'],
  },

  // ─── CONFIDENCE / SELF-WORTH (extra) ─────────────────────────────────
  {
    id: 'heb-4-16',
    reference: 'Hebrews 4:16',
    text: 'Let’s therefore draw near with boldness to the throne of grace, that we may receive mercy and may find grace for help in time of need.',
    reflection:
      'You are not interrupting Him. You are invited.',
    emotions: ['fearful', 'guilty'],
    topics: ['confidence', 'faith'],
  },
  {
    id: 'rom-8-31',
    reference: 'Romans 8:31',
    text: 'If God is for us, who can be against us?',
    reflection:
      'Count the votes. The only one that matters is already in your favor.',
    emotions: ['fearful'],
    topics: ['confidence', 'identity'],
  },

  // ─── HEARTBROKEN extras ──────────────────────────────────────────────
  {
    id: 'ps-34-17',
    reference: 'Psalm 34:17',
    text: 'The righteous cry, and Yahweh hears, and delivers them out of all their troubles.',
    reflection:
      'No cry is filed away unread. He hears, and He moves.',
    emotions: ['sad', 'heartbroken'],
    topics: ['heartbreak', 'grief'],
  },
];

export const getVersesForEmotion = (id: EmotionId): Verse[] =>
  VERSES.filter((v) => v.emotions.includes(id));

export const getVersesForTopic = (id: Topic): Verse[] =>
  VERSES.filter((v) => v.topics?.includes(id));

export const getVerseById = (id: string): Verse | undefined =>
  VERSES.find((v) => v.id === id);

// Daily verse pool — rotates by day of year
const DAILY_POOL_IDS = [
  'isa-41-10',
  'ps-46-10',
  'phil-4-6',
  'jer-29-11',
  'mt-11-28',
  'ps-23-4',
  'rom-8-28',
  'isa-40-31',
  'phil-4-13',
  'lam-3-22',
  'ps-34-18',
  '2tim-1-7',
  'jn-14-27',
  'prov-3-5',
  'ps-118-24',
  'num-6-24',
  'ps-30-5',
  'rom-15-13',
  'mt-6-34',
  'isa-43-1',
  '1pet-5-7',
  'rom-8-1',
  '1jn-1-9',
  'heb-13-5',
  'ps-147-3',
  'isa-26-3',
  'col-3-15',
  'ps-16-11',
  'ex-14-14',
  '2cor-1-3',
  'rev-21-4',
  '2cor-5-17',
  'rom-8-38',
  '2cor-12-9',
  'josh-1-9',
  'eph-2-10',
  'ps-139-14',
  'mic-7-7',
  'prov-3-5',
  'heb-11-1',
];

export const getVerseOfTheDay = (date: Date = new Date()): Verse => {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  const id = DAILY_POOL_IDS[dayOfYear % DAILY_POOL_IDS.length];
  return getVerseById(id) ?? VERSES[0];
};
