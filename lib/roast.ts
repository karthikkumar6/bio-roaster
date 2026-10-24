type Topic = {
  name: string;
  pattern: RegExp;
  angles: readonly string[];
};

const TOPICS: readonly Topic[] = [
  {
    name: "dance",
    pattern: /\b(bharatanatyam|bharata natyam|kathak|kuchipudi|odissi|mohiniyattam|manipuri|sattriya|ballet|dancer|dancing)\b/giu,
    angles: [
      "You listed {terms} like a show poster, then forgot to introduce yourself.",
      "Your bio has room for {terms}, but tells us nothing else about you.",
      "All those moves in {terms}, and your bio still can't take one step past the labels.",
    ],
  },
  {
    name: "creator",
    pattern: /\b(content creator|digital creator|creator|influencer|youtuber|streamer)\b/giu,
    angles: [
      "You call yourself {term}, but your bio has less detail than a blank post.",
      "Your bio puts {term} in the headline and leaves the actual content out.",
      "You gave yourself the title {term}; your bio is still waiting for the first episode.",
    ],
  },
  {
    name: "business",
    pattern: /\b(ceo|founder|entrepreneur|business owner|hustle|startup)\b/giu,
    angles: [
      "You put {term} on your bio like a job title, then gave us no details about the work.",
      "Your bio says {term}, but even the pitch deck has more personality.",
      "Big title: {term}. Tiny intro. This bio needs to launch some actual information.",
    ],
  },
  {
    name: "coffee",
    pattern: /\b(coffee|caffeine|espresso|latte|matcha|tea addict)\b/giu,
    angles: [
      "Your bio gives {term} a starring role and leaves you as the cup holder.",
      "You told us about {term}; the person drinking it is still a mystery.",
      "Your {term} order has a better introduction than you do.",
    ],
  },
  {
    name: "travel",
    pattern: /\b(travel|traveler|traveller|wanderlust|passport|adventure|exploring)\b/giu,
    angles: [
      "You mention {term}, but this bio has fewer details than a blank boarding pass.",
      "Your bio says {term} and still doesn't tell us where your story is going.",
      "You packed {term} into the intro, but left your personality at home.",
    ],
  },
  {
    name: "fitness",
    pattern: /\b(gym|fitness|workout|lifting|bodybuilding|personal trainer)\b/giu,
    angles: [
      "You put {term} in the bio, but this intro still needs a little work.",
      "Your bio is flexing {term} without showing us anything else.",
      "You told us about {term}; this bio could use a spotter for the rest.",
    ],
  },
  {
    name: "food",
    pattern: /\b(foodie|food lover|food blogger|chef|baking|cooking)\b/giu,
    angles: [
      "Your bio serves up {term}, but forgot to put you on the menu.",
      "You gave {term} the full intro. Your own story got left in the kitchen.",
      "Your bio says {term}, then serves us the plainest intro on the menu.",
    ],
  },
  {
    name: "pets",
    pattern: /\b(dog mom|dog dad|cat mom|cat dad|pet parent|dog lover|cat lover)\b/giu,
    angles: [
      "Your bio introduces {term} like the star. You got the assistant role.",
      "Your {term} sounds lovely. Shame this bio forgot to introduce you too.",
      "This bio gives {term} top billing. You're still waiting in the credits.",
    ],
  },
  {
    name: "student",
    pattern: /\b(student|college|university|class of \d{2,4}|grad student)\b/giu,
    angles: [
      "Your bio mentions {term}, but forgot to tell us anything beyond the school part.",
      "You put {term} in the intro. This bio still needs a subject about you.",
      "Your bio gives us {term}, like a student ID with no personality section.",
    ],
  },
];

const CLICHÉS = [
  { pattern: /\bliving my best life\b/i, phrase: "living my best life", joke: "The title's doing all the work; the plot never showed up." },
  { pattern: /\bgood vibes only\b/i, phrase: "good vibes only", joke: "That's a slogan, not a personality. Give us one real detail." },
  { pattern: /\bdream big\b/i, phrase: "dream big", joke: "That belongs on a mug. Your bio needs an idea of its own." },
  { pattern: /\bmain character energy\b/i, phrase: "main character energy", joke: "Bold claim for a bio with no plot." },
  { pattern: /\bjust\s+(a\s+)?(girl|boy|person)\s+(who\s+)?loves?\b/i, phrase: "just someone who loves", joke: "You stopped before the interesting part." },
];

const GENERAL_ANGLES = [
  "Your bio says {phrase} like that's the whole story. We need at least one more chapter.",
  "You wrote {phrase} and called it an introduction. Even a name tag gives us more to go on.",
  "{phrase} is doing all the work here. Your bio should probably help out.",
  "Your bio leads with {phrase}, then leaves us to make up the rest. That's a lot of homework for one sentence.",
];

const SHORT_CLOSERS = [
  "That's less a bio and more a clue with a character limit.",
  "You used fewer words than the loading screen. Give us one actual detail.",
  "Short bio, huge mystery. Even a fortune cookie says more about itself.",
];

const LONG_CLOSERS = [
  "A lot of words, and somehow the main point is still hiding.",
  "This bio took the scenic route and still missed the introduction.",
  "You gave us the extended cut, but the plot is still missing.",
];

const MEDIUM_CLOSERS = [
  "I know what you like; I still don't know what you're like.",
  "You're a list of interests with the person edited out.",
  "One real detail about you would help this intro find a pulse.",
  "This tells us what you enjoy, not who we should follow.",
];

const TOPIC_CLOSERS: Record<string, readonly string[]> = {
  dance: ["That's a class list, not an introduction.", "We got the dance styles; the dancer is still a mystery."],
  creator: ["A title isn't a reason to follow you. Give us a clue what you make.", "We know the label, but not what your content is about."],
  business: ["Big title. Now tell us what you actually build.", "This reads like a job title with the details left out."],
  coffee: ["Your drink has a personality; your intro needs one too.", "We know your order, not the person holding the cup."],
  travel: ["That's a travel tag, not a story. Give us one place or moment.", "We got the theme, but not one trip worth telling."],
  fitness: ["That's a workout label; the person behind it is still missing.", "Your routine is clear. Your bio needs a personal detail."],
  food: ["Your taste in food is clear; your taste in introductions needs work.", "We got the menu, but not the person who ordered it."],
  pets: ["Your pet gets a mention, but where's the human bio?", "We know who the real star is. You're still in the credits."],
  student: ["Your school is clear; your own story needs a line.", "This tells us where you study, not who you are."],
};

const EMOJI_CLOSERS = [
  "The emojis are doing all the talking. Let your words have a turn.",
  "Your emojis have a full conversation going. Shame the bio didn't join in.",
  "That's a lot of emoji backup for a bio with so little to say.",
];

const FORMAT_CLOSERS = [
  "All those lines and dividers, and the point is still missing.",
  "The layout has more structure than the introduction.",
  "Your dividers are working harder than the actual bio.",
];

function hash(value: string): number {
  let result = 2_166_136_261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16_777_619);
  }
  return result >>> 0;
}

function pick<T>(items: readonly T[], seed: string, variation: number): T {
  const base = hash(seed) % items.length;
  // A fixed text seed plus this offset makes “Roast again” rotate predictably.
  return items[(base + variation) % items.length];
}

function cleanPhrase(value: string, limit = 58): string {
  const cleaned = value
    .replace(/https?:\/\/\S+|www\.\S+/giu, "")
    .replace(/[\w.+-]+@[\w.-]+\.[a-z]{2,}/giu, "")
    .replace(/@[\w.]+/gu, "")
    .replace(/[\p{Extended_Pictographic}\uFE0F]/gu, "")
    .replace(/[|•·]+/gu, " ")
    .replace(/\s+/gu, " ")
    .replace(/^[\s\p{P}\p{S}]+|[\s\p{P}\p{S}]+$/gu, "")
    .trim();

  if (cleaned.length <= limit) return cleaned;
  const shortened = cleaned.slice(0, limit - 1);
  const lastSpace = shortened.lastIndexOf(" ");
  return `${shortened.slice(0, lastSpace > limit / 2 ? lastSpace : shortened.length).trimEnd()}…`;
}

function phrasesFrom(text: string): string[] {
  return text
    .split(/[\r\n|•·;]+/u)
    .map((part) => cleanPhrase(part))
    .filter((part) => /[\p{L}\p{N}]/u.test(part));
}

function topicMatches(text: string): Array<{ topic: Topic; terms: string[] }> {
  return TOPICS.flatMap((topic) => {
    const terms = Array.from(text.matchAll(topic.pattern), (match) => match[0]);
    const specificTerms = topic.name === "dance"
      ? terms.filter((term) => !/^(dancer|dancing)$/iu.test(term))
      : terms;
    const usableTerms = specificTerms.length ? specificTerms : terms;
    return usableTerms.length ? [{ topic, terms: usableTerms }] : [];
  });
}

/** Generate a playful, bio-specific roast entirely in the browser with local rules. */
export function generateLocalRoast(bio: string, variation = 0): string {
  const text = bio.trim();
  const variationIndex = Math.max(0, Math.floor(variation));

  if (/^(please\s+)?roast\s+(me|my\s+bio)[.!\s]*$/iu.test(text)) {
    const directRoasts = [
      "You wrote ‘roast me’ and left the bio blank. Even your introduction asked someone else to do the work.",
      "‘Roast me’ is the whole bio? Great, even your personality outsourced the introduction.",
      "You put ‘roast me’ where your bio should be. That's not a bio; it's a help wanted ad for a personality.",
    ];
    return pick(directRoasts, text.toLocaleLowerCase(), variationIndex);
  }

  const phrases = phrasesFrom(text);
  const topics = topicMatches(text);
  const clichés = CLICHÉS.filter(({ pattern }) => pattern.test(text));
  const seed = text.toLocaleLowerCase();
  const selectedTopic = topics.length ? pick(topics, seed, variationIndex) : undefined;

  let lead: string;
  if (selectedTopic) {
    const names = selectedTopic.terms.map((term) => `‘${cleanPhrase(term, 32)}’`);
    const term = names.length > 1
      ? `${names.slice(0, -1).join(", ")} and ${names.at(-1)}`
      : names[0];
    lead = pick(selectedTopic.topic.angles, seed, variationIndex).replaceAll("{terms}", term).replaceAll("{term}", term);
  } else {
    const phrase = phrases[0] ?? "this bio";
    lead = pick(GENERAL_ANGLES, seed, variationIndex).replaceAll("{phrase}", `‘${phrase}’`);
  }

  let closer: string;
  if (clichés.length) {
    const selectedCliché = pick(clichés, `${seed}:cliche`, variationIndex);
    closer = selectedCliché.joke;
    const otherPhrase = phrases.slice(1).find((phrase) => !selectedCliché.pattern.test(phrase));
    if (otherPhrase) closer += ` And ‘${otherPhrase}’ still doesn't tell us much about you.`;
  } else {
    const wordCount = text.split(/\s+/u).filter(Boolean).length;
    const nonEmptyLines = text.split(/\r?\n/u).filter((line) => line.trim()).length;
    const emojiCount = Array.from(text.matchAll(/[\p{Extended_Pictographic}\uFE0F]/gu)).length;
    const dividerCount = (text.match(/[|•·]/gu) ?? []).length;

    if (emojiCount >= 3) {
      closer = pick(EMOJI_CLOSERS, seed, variationIndex);
    } else if (dividerCount >= 3) {
      closer = pick(FORMAT_CLOSERS, seed, variationIndex);
    } else if (selectedTopic) {
      closer = pick(TOPIC_CLOSERS[selectedTopic.topic.name], seed, variationIndex);
    } else if (wordCount <= 5 || nonEmptyLines >= 3) {
      closer = pick(SHORT_CLOSERS, seed, variationIndex);
    } else if (wordCount >= 35) {
      closer = pick(LONG_CLOSERS, seed, variationIndex);
    } else if (phrases.length > 1) {
      const extraPhrase = phrases[1];
      closer = `You listed ‘${extraPhrase}’ too, like a second label would make this a full introduction.`;
    } else {
      closer = pick(MEDIUM_CLOSERS, seed, variationIndex);
    }
  }

  return `${lead} ${closer}`;
}
