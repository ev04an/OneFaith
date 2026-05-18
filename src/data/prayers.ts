export type PrayerCategory =
  | 'anxiety'
  | 'depression'
  | 'healing'
  | 'strength'
  | 'peace'
  | 'motivation'
  | 'forgiveness'
  | 'addiction'
  | 'temptation'
  | 'recovery'
  | 'confidence'
  | 'sleep'
  | 'family'
  | 'exams'
  | 'heartbreak'
  | 'grief'
  | 'thankfulness'
  | 'faith'
  | 'hope'
  | 'discipline';

export type Prayer = {
  id: string;
  category: PrayerCategory;
  title: string;
  text: string;
  icon: string;
  gradient:
    | 'anxious'
    | 'depressed'
    | 'peaceful'
    | 'hopeful'
    | 'serenity'
    | 'primary'
    | 'gold'
    | 'fire'
    | 'ocean'
    | 'heartbroken'
    | 'sad'
    | 'happy';
};

export const PRAYER_CATEGORIES: { id: PrayerCategory; label: string; icon: string }[] = [
  { id: 'anxiety', label: 'Anxiety', icon: 'pulse-outline' },
  { id: 'healing', label: 'Healing', icon: 'medkit-outline' },
  { id: 'strength', label: 'Strength', icon: 'barbell-outline' },
  { id: 'depression', label: 'Depression', icon: 'cloud-outline' },
  { id: 'peace', label: 'Peace', icon: 'flower-outline' },
  { id: 'motivation', label: 'Motivation', icon: 'flash-outline' },
  { id: 'faith', label: 'Faith', icon: 'rocket-outline' },
  { id: 'temptation', label: 'Temptation', icon: 'shield-half-outline' },
  { id: 'recovery', label: 'Recovery', icon: 'leaf-outline' },
  { id: 'confidence', label: 'Confidence', icon: 'sparkles-outline' },
  { id: 'forgiveness', label: 'Forgiveness', icon: 'water-outline' },
  { id: 'hope', label: 'Hope', icon: 'sunny-outline' },
  { id: 'family', label: 'Family', icon: 'home-outline' },
  { id: 'thankfulness', label: 'Gratitude', icon: 'gift-outline' },
  { id: 'discipline', label: 'Discipline', icon: 'compass-outline' },
  { id: 'addiction', label: 'Addiction Recovery', icon: 'shield-checkmark-outline' },
  { id: 'heartbreak', label: 'Heartbreak', icon: 'heart-dislike-outline' },
  { id: 'grief', label: 'Grief', icon: 'flower-outline' },
  { id: 'sleep', label: 'Sleep', icon: 'bed-outline' },
  { id: 'exams', label: 'Exams & Studies', icon: 'school-outline' },
];

export const PRAYERS: Prayer[] = [
  // ── Anxiety (3) ────────────────────────────────────────────────────
  {
    id: 'pray-anxiety-1',
    category: 'anxiety',
    title: 'A Prayer for an Anxious Heart',
    icon: 'pulse-outline',
    gradient: 'anxious',
    text: `Father,
My mind is racing and my chest is tight. I feel pulled in a hundred directions and unable to land anywhere.

I bring You every worry — the small ones I’m embarrassed by and the big ones I can’t even name. I lay them down, one by one, and I ask You to carry what I cannot.

Quiet the storm inside me. Steady my breath. Remind me that nothing I am facing is bigger than You. Let Your peace — the kind the world cannot give — guard my heart and my thoughts today.

In Jesus’ name, Amen.`,
  },
  {
    id: 'pray-anxiety-2',
    category: 'anxiety',
    title: 'When Anxiety Wakes Me at Night',
    icon: 'moon-outline',
    gradient: 'anxious',
    text: `God,
The thoughts are loud and the night feels long. My body won’t settle and my mind keeps replaying the same circles.

Reach into this room. Slow my breath. Replace each anxious thought with one true thing about who You are — that You are good, that You see me, that nothing in tomorrow is unmet by You.

I trust You with the hours between now and the morning. Amen.`,
  },
  {
    id: 'pray-anxiety-3',
    category: 'anxiety',
    title: 'A Prayer for a Quieter Mind',
    icon: 'leaf-outline',
    gradient: 'serenity',
    text: `Lord,
I’ve been carrying tomorrow as if it were already here. I’m sorry.

Help me come back to today. To this breath. To this room. To Your nearness, which is closer than my next thought.

Take my list. Take the worst-case scenarios I keep auditioning. Replace them with a quiet trust that You already know the way through.

In Jesus’ name, Amen.`,
  },

  // ── Depression (3) ─────────────────────────────────────────────────
  {
    id: 'pray-depression-1',
    category: 'depression',
    title: 'A Prayer in the Darkness',
    icon: 'cloud-outline',
    gradient: 'depressed',
    text: `God,
The light feels far away. I’m tired in a way sleep doesn’t fix. I’m not sure I have the words today — and I trust that You hear me anyway.

Be near to me in this. Not far off and bright, but close and patient. Sit with me in the dark until I can see again.

Hold me until morning comes — and when it does, give me one small reason to believe You are still good.

I love You, even from here. Amen.`,
  },
  {
    id: 'pray-depression-2',
    category: 'depression',
    title: 'When the Weight Is Too Much',
    icon: 'cloudy-outline',
    gradient: 'depressed',
    text: `Father,
I’m underwater. Even small things feel impossible today. I don’t want to perform faith — I just need to be honest with You.

You said You are near to the brokenhearted. I’m taking You at Your word. Come close. Bring just enough light for the next hour. I will take it.

Thank You for not requiring me to feel better in order to come to You. Amen.`,
  },
  {
    id: 'pray-depression-3',
    category: 'depression',
    title: 'A Prayer for One Small Step',
    icon: 'walk-outline',
    gradient: 'depressed',
    text: `Lord,
I don’t need a dramatic turnaround tonight. I just need to take the next breath, the next sip of water, the next small step.

Be the strength I cannot summon on my own. Carry me where my legs can’t. Whisper truth into my mind when the lies are loud.

You have not forgotten me. You are not done with me. Amen.`,
  },

  // ── Heartbreak (3) ─────────────────────────────────────────────────
  {
    id: 'pray-heartbreak-1',
    category: 'heartbreak',
    title: 'A Prayer During Heartbreak',
    icon: 'heart-dislike-outline',
    gradient: 'heartbroken',
    text: `Father,
My heart is splintered. The person, the loss, the future I imagined — it’s all sitting on top of me. I don’t know how to hold it.

You bind up the brokenhearted. You count every tear. Don’t let me waste this pain trying to numb it. Walk me through it slowly.

Heal what is mine to heal. Free me from what was never mine to keep. Make me softer, not harder, on the other side of this.

In Jesus’ tender name, Amen.`,
  },
  {
    id: 'pray-heartbreak-2',
    category: 'heartbreak',
    title: 'A Prayer for the Long Nights',
    icon: 'moon-outline',
    gradient: 'heartbroken',
    text: `Lord,
The nights are the hardest part. The room is too quiet and my mind is too loud.

Be the One who fills the empty space tonight. Steady my breath when the missing rises. Remind me that I am not a project to be fixed — I am a child being held.

I will sleep tonight because You are awake. Amen.`,
  },
  {
    id: 'pray-heartbreak-3',
    category: 'heartbreak',
    title: 'A Prayer to Let Go',
    icon: 'water-outline',
    gradient: 'heartbroken',
    text: `God,
I’ve been clutching what You’ve already asked me to release.

Open my hands. Not all at once — finger by finger if You have to. Free me from the story I keep replaying. Free me from the version of the future that isn’t coming.

Give me a new imagination. Make room in me for what You are already preparing. Amen.`,
  },

  // ── Grief (3) ──────────────────────────────────────────────────────
  {
    id: 'pray-grief-1',
    category: 'grief',
    title: 'A Prayer in Grief',
    icon: 'flower-outline',
    gradient: 'sad',
    text: `God,
I miss them. The world is the wrong shape without them in it.

I don’t need You to explain it. I just need You to be near.

Thank You for the days I had. Thank You for the love that hurts because it was real. Carry me through the days my faith feels thin. Hold the parts of me that are still in pieces.

I love You. Hold them, too. Amen.`,
  },
  {
    id: 'pray-grief-2',
    category: 'grief',
    title: 'A Prayer for Bad Days',
    icon: 'rainy-outline',
    gradient: 'sad',
    text: `Father,
Today the grief came back without warning. A song. A smell. A memory I wasn’t expecting.

I’m not regressing. I’m loving them still. Help me let it pass through me without drowning me.

Hold me in this wave. Walk me back to shore when it’s done. Thank You for not asking me to be over them. Amen.`,
  },
  {
    id: 'pray-grief-3',
    category: 'grief',
    title: 'A Prayer for the Ones Left Behind',
    icon: 'people-outline',
    gradient: 'sad',
    text: `Lord,
I lift up everyone who is missing them with me tonight. The ones who weep loudly and the ones who weep alone.

Find them. Comfort them in the language only You speak to their hearts.

Bind us closer through this loss, not further apart. Amen.`,
  },

  // ── Healing (3) ────────────────────────────────────────────────────
  {
    id: 'pray-healing-1',
    category: 'healing',
    title: 'A Prayer for Healing',
    icon: 'medkit-outline',
    gradient: 'serenity',
    text: `Lord,
You are the One who binds up wounds — the visible and the invisible. I bring You every part of me that aches.

Touch the body You made. Mend what is broken. Restore what has been worn down.

And where healing is slow, give me patience. Where it is uncertain, give me trust. Where it is incomplete, remind me that I am still wholly Yours.

In Jesus’ name, Amen.`,
  },
  {
    id: 'pray-healing-2',
    category: 'healing',
    title: 'A Prayer for Inner Healing',
    icon: 'leaf-outline',
    gradient: 'serenity',
    text: `Father,
There are wounds in me no one can see. Words spoken over me. Things I lived through. Beliefs I formed about myself when I was too young to fight back.

Come into those places. Speak truer words. Untangle the lies. Replace shame with belovedness, fear with trust, performance with rest.

I want to be whole — not by my striving, but by Your healing hand. Amen.`,
  },
  {
    id: 'pray-healing-3',
    category: 'healing',
    title: 'A Prayer for Someone I Love',
    icon: 'heart-outline',
    gradient: 'serenity',
    text: `God,
I bring You someone I love who is suffering. You know their name. You know exactly where it hurts.

Lay Your hand on them tonight. Restore what has been worn down. Strengthen the doctors, the medicines, the small daily things.

Where I can be Your hands and feet to them, give me courage to show up. Amen.`,
  },

  // ── Strength (3) ───────────────────────────────────────────────────
  {
    id: 'pray-strength-1',
    category: 'strength',
    title: 'A Prayer for Strength',
    icon: 'barbell-outline',
    gradient: 'fire',
    text: `Father,
I’m running low. The road has been longer than I expected, and I’m not sure I have enough left for what’s next.

Be my strength today. Not in dramatic measure — just enough for the next step. And then the one after that.

Renew me like the eagle. Let me run and not be weary. Let me walk and not faint. I am leaning on You. Amen.`,
  },
  {
    id: 'pray-strength-2',
    category: 'strength',
    title: 'A Prayer When I’m Worn Out',
    icon: 'flash-outline',
    gradient: 'fire',
    text: `Lord,
I’m worn out in a way no nap can fix. The weight isn’t one thing — it’s the constant carrying of many small things.

Take some of it from my shoulders tonight. Remind me what is mine to carry and what was never mine to begin with.

Make Your strength perfect in my weakness. Amen.`,
  },
  {
    id: 'pray-strength-3',
    category: 'strength',
    title: 'A Prayer Before a Hard Thing',
    icon: 'rocket-outline',
    gradient: 'fire',
    text: `God,
I have a hard thing in front of me, and I’d rather avoid it than walk into it.

Give me courage that isn’t the absence of fear, but trust that takes the next step anyway. Steady my voice. Soften my heart. Sharpen my mind.

Go before me. Walk with me. Catch me. Amen.`,
  },

  // ── Peace (3) ──────────────────────────────────────────────────────
  {
    id: 'pray-peace-1',
    category: 'peace',
    title: 'A Prayer for Peace',
    icon: 'flower-outline',
    gradient: 'peaceful',
    text: `God of all peace,
The noise is loud — outside and inside. I’m asking You for the kind of stillness that doesn’t depend on my circumstances.

Settle my soul. Quiet my body. Slow the wheels of my mind. Remind me that You are in control even when nothing in me feels in control.

Let Your peace rule me today, the way a king rules a kingdom — fully, gently, unrivaled. Amen.`,
  },
  {
    id: 'pray-peace-2',
    category: 'peace',
    title: 'A Prayer to Be Still',
    icon: 'leaf-outline',
    gradient: 'peaceful',
    text: `Father,
I’ve been moving too fast to hear You. Slow me down.

Bring me back to the simple things: my breath, this moment, Your nearness. Let me be still long enough to know that You are God.

I don’t have to fix everything tonight. You are not in a hurry. Help me match Your pace. Amen.`,
  },
  {
    id: 'pray-peace-3',
    category: 'peace',
    title: 'A Prayer for a Restless World',
    icon: 'globe-outline',
    gradient: 'peaceful',
    text: `Lord,
The world is loud and the news is heavy. Bring peace where there is conflict. Bring rest where there is exhaustion. Bring You where there is fear.

Start with my own heart. Make me an instrument of Your peace — slow to anger, quick to mercy, patient with the ones who differ from me. Amen.`,
  },

  // ── Motivation (3) ─────────────────────────────────────────────────
  {
    id: 'pray-motivation-1',
    category: 'motivation',
    title: 'A Prayer to Begin Again',
    icon: 'flash-outline',
    gradient: 'gold',
    text: `Lord,
I’ve been stalled. The thing I should do feels heavier than it is, and I’ve been avoiding it.

Move me. Not with shame, but with purpose. Help me take one small action today as worship — knowing You see, and that small obedience is never small to You.

I lift my eyes. I take the first step. I trust You with the rest. Amen.`,
  },
  {
    id: 'pray-motivation-2',
    category: 'motivation',
    title: 'A Prayer for the Long Haul',
    icon: 'hourglass-outline',
    gradient: 'gold',
    text: `Father,
I started this with energy and faith. Now I’m tired and tempted to quit.

Give me a second wind. Remind me why I started. Strip away the parts that were performance and keep the parts that were love.

Let me finish what You called me to — not perfectly, but faithfully. Amen.`,
  },
  {
    id: 'pray-motivation-3',
    category: 'motivation',
    title: 'A Prayer for Today’s Work',
    icon: 'briefcase-outline',
    gradient: 'gold',
    text: `God,
Whatever today asks of me — the small, the boring, the difficult — I want to do it as for You.

Quiet the voice in me that performs for people. Sharpen the voice that serves out of love.

Let my hands be useful today. Let my words build instead of tear. Let my work be a quiet kind of worship. Amen.`,
  },

  // ── Forgiveness (3) ────────────────────────────────────────────────
  {
    id: 'pray-forgiveness-1',
    category: 'forgiveness',
    title: 'A Prayer for a Clean Heart',
    icon: 'water-outline',
    gradient: 'ocean',
    text: `Merciful Father,
I’ve fallen short. You know exactly how, and so do I. I’m not going to dress it up.

Forgive me. Wash me. Make me clean — not just covered, but truly new.

And help me forgive those who have wounded me, the way You have forgiven me. Free me from carrying what was never mine to keep.

In Jesus, who paid for all of this, Amen.`,
  },
  {
    id: 'pray-forgiveness-2',
    category: 'forgiveness',
    title: 'A Prayer to Forgive Someone',
    icon: 'hand-left-outline',
    gradient: 'ocean',
    text: `Lord,
You know who I’m struggling to forgive. You know what they did. You know how much it cost me.

I’m not pretending it didn’t happen. I’m asking You to take the weight of it out of my hands.

Soften my heart toward them, even if from a distance. Free me, regardless of what they choose to do. Justice belongs to You. Amen.`,
  },
  {
    id: 'pray-forgiveness-3',
    category: 'forgiveness',
    title: 'A Prayer to Forgive Myself',
    icon: 'sparkles-outline',
    gradient: 'ocean',
    text: `Father,
You have already forgiven me, but I keep picking the verdict back up.

Help me lay it down. There is no condemnation for those who are in Christ. Let that truth land somewhere deeper than my regret.

Free me to walk forward — softer, wiser, and more graceful with others because of how You have been graceful with me. Amen.`,
  },

  // ── Addiction Recovery (3) ─────────────────────────────────────────
  {
    id: 'pray-addiction-1',
    category: 'addiction',
    title: 'A Prayer for Recovery',
    icon: 'shield-checkmark-outline',
    gradient: 'primary',
    text: `Father,
You know what I’m fighting. You know how many times I’ve tried, and how many times I’ve fallen. You know how badly I want to be free.

Today, give me strength for today. Just today. Help me say no to what is killing me and yes to what gives life.

Surround me with people who will hold me up. Cut off the paths that lead me back. Heal the wounds underneath the wanting.

I am Yours. Walk me out of this, one day at a time. Amen.`,
  },
  {
    id: 'pray-addiction-2',
    category: 'addiction',
    title: 'A Prayer After a Fall',
    icon: 'leaf-outline',
    gradient: 'primary',
    text: `Lord,
I fell again, and I’m sitting in the silence after it.

Don’t let the shame win. The voice telling me I’m hopeless isn’t Yours. Your voice is asking me to come home.

I’m here. I’m starting over today, not because I deserve it, but because Your mercies are new every morning. Amen.`,
  },
  {
    id: 'pray-addiction-3',
    category: 'addiction',
    title: 'A Prayer for the Long Road',
    icon: 'compass-outline',
    gradient: 'primary',
    text: `God,
This isn’t a sprint, and I keep wishing it was.

Give me patience for the slow rebuilding. Give me eyes to see the small wins — the day I said no, the friend I called, the moment I prayed instead of acted.

Form me into someone who doesn’t just stop a thing, but becomes someone new. Amen.`,
  },

  // ── Temptation (3) ─────────────────────────────────────────────────
  {
    id: 'pray-temptation-1',
    category: 'temptation',
    title: 'When Temptation Is Loud',
    icon: 'flash-off-outline',
    gradient: 'fire',
    text: `God,
The pull is loud right now and I don’t feel strong. The voice is whispering that just this once won’t matter.

You promised a way of escape. I’m asking for it. Show me the door right now. Give me a second wind. Send me a person, a verse, a wall.

I am not powerless because You are not absent. Help me wait out the wave. Amen.`,
  },
  {
    id: 'pray-temptation-2',
    category: 'temptation',
    title: 'A Prayer for Clean Eyes',
    icon: 'eye-outline',
    gradient: 'fire',
    text: `Father,
Help me with what I look at, what I scroll past, what I let into me.

Make my eyes quick to look away from what poisons me. Make them slower to take in beauty, kindness, the small graces of the day.

What I look at long enough, I become. Let me become like You. Amen.`,
  },
  {
    id: 'pray-temptation-3',
    category: 'temptation',
    title: 'A Prayer for the Next Ten Minutes',
    icon: 'timer-outline',
    gradient: 'fire',
    text: `Lord,
I’m not going to ask You for forever right now. Just the next ten minutes.

Be louder than the craving. Be closer than the urge. Be more real than the voice telling me to do it.

The wave will pass. It always does. Walk me to the other side of it. Amen.`,
  },

  // ── Recovery (3) ───────────────────────────────────────────────────
  {
    id: 'pray-recovery-1',
    category: 'recovery',
    title: 'A Prayer for the Rebuilding',
    icon: 'leaf-outline',
    gradient: 'serenity',
    text: `Father,
I’m in the slow work of becoming new. Some days I see it. Most days I don’t.

Don’t let me confuse slowness with absence. You are working, even when I cannot trace it.

Rebuild me in the quiet — beneath what people see, where only You and I are looking. Amen.`,
  },
  {
    id: 'pray-recovery-2',
    category: 'recovery',
    title: 'A Prayer for One Day at a Time',
    icon: 'calendar-outline',
    gradient: 'serenity',
    text: `Lord,
I keep wanting to skip ahead. Just today, please.

Just today, keep my hands from what hurts me. Just today, keep my eyes on what heals me. Just today, give me what I need to stay close to You.

Tomorrow’s grace is for tomorrow. I trust You with it. Amen.`,
  },
  {
    id: 'pray-recovery-3',
    category: 'recovery',
    title: 'A Prayer for the Old Wounds',
    icon: 'bandage-outline',
    gradient: 'serenity',
    text: `God,
You know the wounds underneath the things I do. The reasons I reach for what numbs me.

Don’t just stop my behavior — heal the why. Be present in the original hurt. Speak truer words over me than the lies I’ve been believing.

Make me whole, not just sober. Amen.`,
  },

  // ── Confidence (3) ─────────────────────────────────────────────────
  {
    id: 'pray-confidence-1',
    category: 'confidence',
    title: 'A Prayer for Confidence',
    icon: 'sparkles-outline',
    gradient: 'gold',
    text: `God,
I’ve been believing small things about myself. That I’m not enough. That I’ll mess this up. That I’m not the one for this.

Replace those voices with Yours. Remind me that I am Your workmanship, called by name, equipped on purpose.

Let me walk into today not with arrogance, but with quiet certainty — that the One who started this work in me will finish it. Amen.`,
  },
  {
    id: 'pray-confidence-2',
    category: 'confidence',
    title: 'A Prayer to Stop Comparing',
    icon: 'people-outline',
    gradient: 'gold',
    text: `Father,
I’ve been measuring myself against everyone else, and losing every time.

Lift my eyes. Help me run my own race, in my own lane, at the pace You set.

You did not call me to be them. You called me to be me — fully, deeply, in You. That is enough. Amen.`,
  },
  {
    id: 'pray-confidence-3',
    category: 'confidence',
    title: 'A Prayer Before I Walk In',
    icon: 'walk-outline',
    gradient: 'gold',
    text: `Lord,
I’m about to walk into something that intimidates me.

Steady me. Take the panic out of my chest. Replace the imposter voice with Your gentle truth: I am loved, I am sent, I am held.

Whatever happens in the next hour, I am still wholly Yours. Amen.`,
  },

  // ── Sleep (3) ──────────────────────────────────────────────────────
  {
    id: 'pray-sleep-1',
    category: 'sleep',
    title: 'A Prayer Before Sleep',
    icon: 'bed-outline',
    gradient: 'primary',
    text: `Father,
The day is over. The list of unfinished things is long, and I’m laying it down.

Take what I’ve done and what I’ve left undone, and weave it into something good.

Quiet my body. Quiet my mind. Give me sleep that is real — the kind You give to those You love. I will wake again because You hold the night and the morning.

In Jesus’ name, Amen.`,
  },
  {
    id: 'pray-sleep-2',
    category: 'sleep',
    title: 'When I Can’t Sleep',
    icon: 'moon-outline',
    gradient: 'primary',
    text: `Lord,
It’s late and my body won’t settle. My mind keeps replaying things.

Take the loop. Give me Your peace, which surpasses understanding.

Sit with me until I drift. You hold the night. I don’t have to. Amen.`,
  },
  {
    id: 'pray-sleep-3',
    category: 'sleep',
    title: 'A Prayer for the Ones I Love',
    icon: 'heart-outline',
    gradient: 'primary',
    text: `God,
Before I sleep, I bring You the people I love by name.

Cover them tonight. Send rest where there is worry, comfort where there is grief, peace where there is conflict.

Hold the ones I cannot reach. Carry the ones I cannot help. Amen.`,
  },

  // ── Family (3) ─────────────────────────────────────────────────────
  {
    id: 'pray-family-1',
    category: 'family',
    title: 'A Prayer for My Family',
    icon: 'home-outline',
    gradient: 'happy',
    text: `Lord,
You set the lonely in families, and You have set me in mine.

Protect every person I love today. Where there is tension, send peace. Where there is distance, send a phone call. Where there is illness, send healing.

Make our home a place where Your name is welcomed and where each person is fully seen. Heal the things we’ve avoided. Strengthen the things we’ve built together.

In Jesus’ name, Amen.`,
  },
  {
    id: 'pray-family-2',
    category: 'family',
    title: 'A Prayer for the Hard Conversations',
    icon: 'chatbubbles-outline',
    gradient: 'happy',
    text: `Father,
There’s a conversation I’ve been avoiding with someone in my family.

Give me the right moment. Soften both our hearts before we speak. Help me listen as much as I want to be heard.

Let truth come out wrapped in love, not weaponized. Amen.`,
  },
  {
    id: 'pray-family-3',
    category: 'family',
    title: 'A Prayer for the Generations',
    icon: 'leaf-outline',
    gradient: 'happy',
    text: `God,
You are the God of my fathers and my mothers. You will be the God of whoever comes after me.

Break the patterns in our family that have hurt us. Carry forward the ones that have blessed us.

Let me be a turning point — a person who chose grace, again and again, and passed it on. Amen.`,
  },

  // ── Exams & Studies (3) ────────────────────────────────────────────
  {
    id: 'pray-exams-1',
    category: 'exams',
    title: 'A Prayer Before an Exam',
    icon: 'school-outline',
    gradient: 'hopeful',
    text: `Father,
I’ve studied as best I could. Now I need a clear mind and a steady heart.

Bring back to me what I’ve learned. Quiet the panic. Let me remember the truth that my worth is not a number on a page.

Whatever the result, I am still Yours. Help me to do my best, and to leave the rest in Your hands.

In Jesus’ name, Amen.`,
  },
  {
    id: 'pray-exams-2',
    category: 'exams',
    title: 'A Prayer for the Long Study Days',
    icon: 'book-outline',
    gradient: 'hopeful',
    text: `Lord,
The hours are long and the material is dense. Give me focus and stamina.

Sharpen my mind. Let what I read stay. Let what I practice take root.

Send breaks at the right times. Send rest at the end. Remind me that my discipline today is a small kind of worship. Amen.`,
  },
  {
    id: 'pray-exams-3',
    category: 'exams',
    title: 'A Prayer After Results',
    icon: 'ribbon-outline',
    gradient: 'hopeful',
    text: `God,
I got the result, and now I’m sitting with it.

If it’s less than I hoped, remind me that one number is not my story. Comfort the disappointment. Help me try again with humility.

If it’s more than I expected, keep my heart soft. Let me celebrate without comparing. Thank You for every help I didn’t see. Amen.`,
  },

  // ── Gratitude / Thankfulness (3) ───────────────────────────────────
  {
    id: 'pray-thankfulness-1',
    category: 'thankfulness',
    title: 'A Prayer of Thankfulness',
    icon: 'gift-outline',
    gradient: 'happy',
    text: `Father,
I want to start by saying thank You.

Thank You for the air in my lungs and the people around the table. Thank You for the unanswered prayers and the answered ones I forgot to celebrate. Thank You for letting me wake up today — that alone is grace.

Make my heart grateful. Make my hands generous. Make my mouth quick with kind words and slow with complaints.

I love You. Amen.`,
  },
  {
    id: 'pray-thankfulness-2',
    category: 'thankfulness',
    title: 'A Prayer for Small Mercies',
    icon: 'flower-outline',
    gradient: 'happy',
    text: `Lord,
Thank You for the small kindnesses I almost missed today.

The cup of coffee. The text from a friend. The moment of quiet between things. The smile I didn’t expect.

Train my eyes to see the way You are always quietly giving. Amen.`,
  },
  {
    id: 'pray-thankfulness-3',
    category: 'thankfulness',
    title: 'A Prayer Even in the Hard',
    icon: 'sunny-outline',
    gradient: 'happy',
    text: `God,
This isn’t my easiest season. But I want to give thanks anyway — not for everything, but in everything.

Thank You that You haven’t left me. Thank You that this is not the end of my story. Thank You that gratitude reorders my heart even when nothing else has changed.

I lift my hands tonight, tired but thankful. Amen.`,
  },

  // ── Faith (3) ──────────────────────────────────────────────────────
  {
    id: 'pray-faith-1',
    category: 'faith',
    title: 'A Prayer to Trust Again',
    icon: 'rocket-outline',
    gradient: 'primary',
    text: `Father,
My faith is small tonight. I’ve been let down, and trusting again feels risky.

Take the mustard seed I have and grow it. Show me the parts of You I can lean on — Your goodness, Your faithfulness, Your nearness — even if everything else is still a mystery.

I believe. Help my unbelief. Amen.`,
  },
  {
    id: 'pray-faith-2',
    category: 'faith',
    title: 'A Prayer in the Waiting',
    icon: 'hourglass-outline',
    gradient: 'primary',
    text: `Lord,
The answer hasn’t come. The door I’ve been knocking on is still closed.

Keep my faith soft in the waiting. Don’t let me become bitter or impatient or numb.

You are doing things I cannot see. Help me trust the process even when I can’t trace the outcome. Amen.`,
  },
  {
    id: 'pray-faith-3',
    category: 'faith',
    title: 'A Prayer When Faith Feels Quiet',
    icon: 'leaf-outline',
    gradient: 'primary',
    text: `God,
I haven’t felt You in a while. The fire has gone quieter.

Don’t let me confuse silence with absence. Some of Your closest work is done in the quiet.

Meet me in the ordinary today. Show me Your faithfulness in the small things until the bigger things come back into view. Amen.`,
  },

  // ── Hope (3) ───────────────────────────────────────────────────────
  {
    id: 'pray-hope-1',
    category: 'hope',
    title: 'A Prayer for Fresh Hope',
    icon: 'sunny-outline',
    gradient: 'hopeful',
    text: `Father,
Hope feels far away tonight. The same problems are still in front of me.

Be the God of hope to me again. Pour in what I cannot generate. Let me lift my eyes from the storm to the One who walks across the water.

You are not done. Neither am I. Amen.`,
  },
  {
    id: 'pray-hope-2',
    category: 'hope',
    title: 'A Prayer for a New Season',
    icon: 'leaf-outline',
    gradient: 'hopeful',
    text: `Lord,
I’ve been in the same chapter for a long time. I’m ready for the next one, and I’m a little afraid of it.

Open the next door at the right time. Give me eyes to see it when it comes. Give me courage to step through.

You are doing a new thing. I want to perceive it. Amen.`,
  },
  {
    id: 'pray-hope-3',
    category: 'hope',
    title: 'A Prayer When I Want to Give Up',
    icon: 'umbrella-outline',
    gradient: 'hopeful',
    text: `God,
I’ve been tempted to give up on this. On myself. On You, even.

Don’t let me. Catch me before I fall too far. Remind me that hope doesn’t disappoint, because it’s rooted in Your love, not my circumstances.

Just one more day of trust. Amen.`,
  },

  // ── Discipline (3) ─────────────────────────────────────────────────
  {
    id: 'pray-discipline-1',
    category: 'discipline',
    title: 'A Prayer for Faithfulness in Small Things',
    icon: 'compass-outline',
    gradient: 'gold',
    text: `Father,
I want to be faithful in the unglamorous things — the early mornings, the daily reading, the unseen prayers.

Help me build a quiet life that pleases You. Let me trust that small obedience over a long time is the way Your kingdom usually grows.

Steady my hand. Repeat my heart. Amen.`,
  },
  {
    id: 'pray-discipline-2',
    category: 'discipline',
    title: 'A Prayer to Break a Habit',
    icon: 'reload-outline',
    gradient: 'gold',
    text: `Lord,
You know the habit I want to break. The thing I keep doing that I keep regretting.

Strengthen me at the moment of decision, not just after. Show me the trigger before the action. Give me a better thing to reach for in its place.

Build something new in me. Amen.`,
  },
  {
    id: 'pray-discipline-3',
    category: 'discipline',
    title: 'A Prayer for the Things I Don’t Want to Do',
    icon: 'fitness-outline',
    gradient: 'gold',
    text: `God,
There are things I should do today that I don’t want to do.

Give me obedience that doesn’t wait for the feeling. Help me do the next right thing as worship.

You don’t love me less when I’m undisciplined. But You love me too much to leave me there. Move me forward. Amen.`,
  },
];

export const getPrayersByCategory = (cat: PrayerCategory): Prayer[] =>
  PRAYERS.filter((p) => p.category === cat);

export const getPrayerById = (id: string): Prayer | undefined =>
  PRAYERS.find((p) => p.id === id);
