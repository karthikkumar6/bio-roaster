type RoastTopic = {
  pattern: RegExp;
  lines: readonly string[];
};

const TOPICS: readonly RoastTopic[] = [
  {
    pattern: /\b(bharatanatyam|bharata natyam|kathak|kuchipudi|odissi|mohiniyattam|manipuri|sattriya|ballet|dancer|dancing)\b/i,
    lines: [
      "Two dance styles and no intro. Your bio did all that footwork just to stand still.",
      "Your bio has a full dance lineup, but the main act—you—is missing.",
      "All those dance steps, and this bio still hasn't moved past ‘I dance.’",
    ],
  },
  {
    pattern: /\b(creator|influencer|content creator|digital creator|youtuber|streamer)\b/i,
    lines: [
      "You call yourself a creator, but this bio has less content than a blank page.",
      "‘Content creator’ is a big title for a bio with no content.",
      "Your bio's only post-worthy thing is the word ‘creator.’",
    ],
  },
  {
    pattern: /\b(ceo|founder|entrepreneur|business owner|hustle|startup)\b/i,
    lines: [
      "Big boss title, tiny amount of info. Your bio is all pitch and no product.",
      "CEO? Your bio is the only thing you're running, and even it has no details.",
      "Your bio says founder, but it hasn't launched a single detail.",
    ],
  },
  {
    pattern: /\b(coffee|caffeine|espresso|latte|matcha|tea addict)\b/i,
    lines: [
      "Your coffee gets the main role. You get a guest spot.",
      "Your coffee order has more personality than your bio. The mug is winning.",
      "You gave coffee a full intro. You got a quick mention.",
    ],
  },
  {
    pattern: /\b(travel|traveler|traveller|wanderlust|passport|adventure|exploring)\b/i,
    lines: [
      "Your passport has stories. Your bio has the same line as every airport.",
      "‘I love travel’ is not a story. It's a boarding pass with no place to go.",
      "Your bio went around the world and came back with no details.",
    ],
  },
  {
    pattern: /\b(gym|fitness|workout|lifting|bodybuilding|personal trainer)\b/i,
    lines: [
      "You lift weights, but this bio can't lift its own weight.",
      "Your gym habit is strong. This bio needs a spotter.",
      "This bio is all flex and no facts. Put it on a rest day.",
    ],
  },
  {
    pattern: /\b(foodie|food lover|food blogger|chef|baking|cooking)\b/i,
    lines: [
      "Your bio says foodie, then serves plain toast.",
      "Your food takes are spicy. This bio is plain rice.",
      "Food got the intro. Your bio needs a second course: you.",
    ],
  },
  {
    pattern: /\b(dog mom|dog dad|cat mom|cat dad|pet parent|dog lover|cat lover)\b/i,
    lines: [
      "Your pet is the star. You're the phone holder in this story.",
      "Your pet has a better bio than you. Give them the account.",
      "This bio is a fan page for your pet. At least one of you has fans.",
    ],
  },
  {
    pattern: /\b(student|college|university|class of \d{2,4}|grad student)\b/i,
    lines: [
      "Your school got a shout-out. Your bio forgot to say one thing about you.",
      "This bio reads like a school ID that asked for a day off.",
      "All we learned is where you study. What a plot twist.",
    ],
  },
];

const CLICHÉ_LINES = [
  "‘Living my best life’ sounds like a show title. Too bad the plot never showed up.",
  "‘Good vibes only’ is a slogan. Your bio needs a punchline.",
  "‘Dream big’ belongs on a mug. Your bio needs its own idea.",
  "‘Main character energy’—but your bio forgot the plot.",
];

const CREATOR_LIFE_ROASTS = [
  "Creator with no content? Your bio is an empty menu with a five-star sign. ‘Living my best life’ is the title; the show never started.",
  "You call yourself a creator, but your bio is a blank page. ‘Living my best life’ sounds like a show that got canceled after the trailer.",
];

const SHORT_BIO_LINES = [
  "Three words, zero clues. Your bio is playing hide-and-seek.",
  "Your bio is so short the joke had to do the intro.",
  "This bio said the bare minimum and still ran out of words.",
];

const LONG_BIO_LINES = [
  "Your bio has a lot of words and no point. Impressive.",
  "I read the whole thing and still need an intro.",
  "Your bio took the long way to say very little.",
];

const EMOJI_LINES = [
  "The emojis are carrying this bio. Give them a break.",
  "Your emojis have more to say than your words. Let them write the bio.",
  "So many emojis, and none say who you are.",
];

const FORMAT_LINES = [
  "You used all those lines and still left out the point.",
  "Those dividers are doing more work than the bio.",
  "Every word has its own line. None has a point.",
];

const GENERAL_LINES = [
  "This bio is so vague it could belong to the person next to you.",
  "Your bio says ‘I'm interesting’ without giving one example.",
  "This bio is the written version of ‘I'm fine.’ Very clear.",
  "I came to meet you, but your bio left a blank name tag.",
];

function pick<T>(items: readonly T[], seed: string): T {
  let hash = 2_166_136_261;
  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 16_777_619);
  }
  return items[(hash >>> 0) % items.length];
}

function pickDifferent(items: readonly string[], seed: string, avoid: string): string {
  const choices = items.filter((item) => item !== avoid);
  return pick(choices.length ? choices : items, seed);
}

/** Generate a playful roast entirely in the browser from local rules and templates. */
export function generateLocalRoast(bio: string, variation = 0): string {
  const text = bio.trim();
  const lower = text.toLocaleLowerCase();
  const seed = `${text}:${variation}`;

  if (/\b(creator|influencer|content creator|digital creator|youtuber|streamer)\b/i.test(lower)
    && /living my best life/i.test(lower)) {
    return pick(CREATOR_LIFE_ROASTS, `${seed}:creator-life`);
  }

  const topic = TOPICS.find(({ pattern }) => pattern.test(lower));
  let mainLine = topic ? pick(topic.lines, `${seed}:topic`) : pick(GENERAL_LINES, `${seed}:general`);

  const cliche = CLICHÉ_LINES.find((line) => {
    const phrase = line.match(/‘([^’]+)’/)?.[1];
    return phrase ? lower.includes(phrase.toLocaleLowerCase()) : false;
  });
  if (cliche && !topic) mainLine = cliche;

  const wordCount = text.split(/\s+/u).filter(Boolean).length;
  const lineCount = text.split(/\r?\n/u).filter((line) => line.trim()).length;
  const emojiCount = Array.from(text.matchAll(/[\p{Extended_Pictographic}\uFE0F]/gu)).length;
  const dividerCount = (text.match(/[|•·]/gu) ?? []).length;
  let closer: string;

  if (emojiCount >= 3) {
    closer = pick(EMOJI_LINES, `${seed}:emoji`);
  } else if (dividerCount >= 3) {
    closer = pick(FORMAT_LINES, `${seed}:format`);
  } else if (wordCount <= 5 || lineCount >= 3) {
    closer = pick(SHORT_BIO_LINES, `${seed}:short`);
  } else if (wordCount >= 45) {
    closer = pick(LONG_BIO_LINES, `${seed}:long`);
  } else if (cliche && topic) {
    closer = cliche;
  } else {
    closer = pick(GENERAL_LINES, `${seed}:closer`);
  }

  if (closer === mainLine) {
    closer = pickDifferent(GENERAL_LINES, `${seed}:fallback`, mainLine);
  }

  return `${mainLine} ${closer}`;
}
