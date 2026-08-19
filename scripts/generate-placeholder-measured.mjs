// Generates a stand-in for src/data/open-release.measured.json.
//
//   node scripts/generate-placeholder-measured.mjs src/data/open-release.measured.json
//
// PLACEHOLDER. Every figure here is synthetic — shaped to be realistic so the
// page can be designed against it, but invented. It emits the same shape as the
// real emitter, `apps/web/scripts/build-open-release-snapshot.ts` in yap-room,
// so replacing this file's output with that one is a copy and nothing else.
//
// `synthetic: true` rides along in the output and is what stops these numbers
// being mistaken for measurements: the build logs a warning for as long as it
// is set. Delete this script once the release's own backfills are complete.
//
// Deterministic (fixed LCG seed), so re-running produces no diff.
import { writeFileSync } from 'node:fs';

// Checkout holding the built @yaproom/domain package, for the delivery schema.
const YAPROOM_ROOT = process.env.YAPROOM_ROOT ?? '/Users/mvd/Projects/yap-room';

let seed = 20260814;
const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
const gauss = () => {
  let u = 0, v = 0;
  while (u === 0) u = rnd();
  while (v === 0) v = rnd();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
};

const BINS = 18;

/** Sample n draws from `draw`, clamp to [lo,hi], return bins + percentiles. */
function metric(label, unit, draw, lo, hi, { decimals = 1, n = 3400 } = {}) {
  const xs = [];
  for (let i = 0; i < n; i++) xs.push(Math.min(hi, Math.max(lo, draw())));
  const bins = new Array(BINS).fill(0);
  for (const x of xs) {
    const i = Math.min(BINS - 1, Math.floor(((x - lo) / (hi - lo)) * BINS));
    bins[i]++;
  }
  const sorted = [...xs].sort((a, b) => a - b);
  const q = (p) => sorted[Math.floor(p * (sorted.length - 1))];
  const r = (x) => Number(x.toFixed(decimals));
  return {
    label, unit,
    p5: r(q(0.05)), p50: r(q(0.5)), p95: r(q(0.95)),
    bins, binMin: lo, binMax: hi, decimals,
  };
}

const normal = (mu, sd) => () => mu + gauss() * sd;
const logNormal = (mu, sd) => () => Math.exp(mu + gauss() * sd);

const SLUG = 'open-yap-1k';
const CONVERSATIONS = 14286;

// Per-speaker delivered minutes. A fairness-ordered greedy with a 30 h cap
// saturates the heaviest contributors and takes everything the long tail has,
// so the shape is a flat plateau at the cap followed by a steep decay.
const CAP = 30 * 60;
const speakerMinutes = [];
for (let i = 0; i < 26; i++) speakerMinutes.push(CAP);
for (let i = 0; i < 231; i++) {
  speakerMinutes.push(Math.max(4, Math.round(Math.exp(5.5 - i * 0.019 + gauss() * 0.45))));
}
const totalMinutes = speakerMinutes.reduce((a, b) => a + b, 0);
const HOURS = Math.round(totalMinutes / 60);
const TOTAL_WORDS = Math.round(HOURS * 9040);
const UNIQUE_WORDS = 118420;

/** Full coverage, because a synthetic corpus is measured everywhere by
 *  construction. `synthetic` is the flag that matters here, not this. */
const full = (n) => ({ measured: n, of: n });

const measured = {
  slug: SLUG,
  synthetic: true,
  stats: {
    conversations: CONVERSATIONS,
    hours: HOURS,
    speakers: speakerMinutes.length,
    averageDurationMinutes: Number((totalMinutes / CONVERSATIONS).toFixed(1)),
  },
  population: {
    gender: { Female: 132, Male: 118, 'Non-binary': 7 },
    age: { 'Under 25': 61, '25–34': 88, '35–44': 54, '45–54': 33, '55+': 21 },
    education: { Primary: 9, Secondary: 47, Vocational: 38, Bachelor: 92, Master: 58, PhD: 13 },
    nativeLanguage: {
      English: 171, Spanish: 21, German: 13, French: 11, Hindi: 9,
      Portuguese: 8, Tagalog: 6, Polish: 5, Danish: 5, Other: 8,
    },
    childhoodCountry: {
      'United States': 96, 'United Kingdom': 44, Canada: 21, Australia: 18,
      India: 14, Ireland: 11, Nigeria: 9, 'South Africa': 8, Philippines: 7,
      Germany: 6, Other: 23,
    },
  },
  speakerMinutes,
  data: {
    relationship: {
      Friends: 5218, 'Romantic partners': 3106, Family: 2744,
      Colleagues: 1612, Acquaintances: 1093, Other: 513,
    },
    language: { English: CONVERSATIONS },
    conversationLength: metric('Conversation length', 'min', logNormal(1.29, 0.62), 0, 25, {
      n: CONVERSATIONS,
    }),
    wordsPerConversation: metric('Words per conversation', 'words', logNormal(6.39, 0.62), 0, 3500, {
      decimals: 0, n: CONVERSATIONS,
    }),
    vocabulary: {
      totalWords: TOTAL_WORDS,
      uniqueWords: UNIQUE_WORDS,
      typeTokenRatio: Number((UNIQUE_WORDS / TOTAL_WORDS).toFixed(5)),
      wordsPerMinute: 151,
    },
  },
  audio: {
    groups: [
      {
        title: 'Signal',
        metrics: [
          metric('Effective bandwidth', 'kHz', normal(21.1, 1.9), 12, 24),
          metric('Speech SNR', 'dB', normal(47.6, 9.4), 15, 70),
          metric('Noise floor', 'dBFS', normal(-67.1, 7.8), -90, -45),
          metric('Integrated loudness', 'LUFS', normal(-23.3, 3.4), -34, -14),
          metric('True peak', 'dBTP', normal(-5.2, 3.1), -20, 0),
        ],
      },
      {
        title: 'Conversational dynamics',
        metrics: [
          metric('Overlap', '% of voiced time', logNormal(1.72, 0.72), 0, 25),
          metric('Turn-taking gap', 'ms', logNormal(5.3, 0.78), 0, 2000, { decimals: 0 }),
          metric('Speech dominance', 'share to speaker A', normal(0.5, 0.11), 0.1, 0.9, { decimals: 2 }),
          metric('Speaking rate', 'words/min', normal(151, 26), 70, 240, { decimals: 0 }),
        ],
      },
    ],
    conformance: [
      { check: 'Track pairs sharing a common timeline anchor', threshold: 'required', passRate: 1 },
      { check: 'Conversations with word-level transcripts', threshold: 'both speakers', passRate: 1 },
      { check: 'Tracks with zero clipped samples', threshold: '< 0.01% of samples at full scale', passRate: 0.9963 },
      { check: 'Tracks above the speech SNR floor', threshold: '>= 30 dB', passRate: 0.9618 },
      { check: 'Tracks with full-band content', threshold: 'bandwidth >= 8.0 kHz', passRate: 0.9907 },
      { check: 'Conversations with both channels live', threshold: 'no dead channel', passRate: 1 },
      { check: 'Conversations carrying measurable overlap', threshold: '>= 1% of speech time', passRate: 0.9812 },
    ],
  },
  coverage: {
    population: full(speakerMinutes.length),
    conversationLength: full(CONVERSATIONS),
    relationship: full(CONVERSATIONS),
    wordsPerConversation: full(CONVERSATIONS),
    vocabulary: full(CONVERSATIONS * 2),
    audio: full(CONVERSATIONS),
    loudness: full(CONVERSATIONS * 2),
    speakingRate: full(CONVERSATIONS * 2),
  },
};

// The schema and archive tree are the delivery pipeline's, not this page's —
// pulled from the built domain package so the two can never disagree. The real
// emitter reads the same constant.
const domain = await import(`${YAPROOM_ROOT}/packages/domain/dist/index.js`);
measured.metadataFields = domain.DATASET_METADATA_FIELDS;
const files = Array.from(new Set(domain.DATASET_METADATA_FIELDS.map((f) => f.file)));
measured.fileStructure = [
  `${SLUG}/`,
  ...files.filter((f) => !f.includes('/')).map((f) => `  ${f}`),
  '  LICENSE.txt',
  '  conv_a1b2c3d4e5f6/',
  '    speaker_a.flac   (or .wav)',
  '    speaker_b.flac   (or .wav)',
  ...files
    .filter((f) => f.includes('/'))
    .map((f) => f.slice(f.indexOf('/') + 1))
    .flatMap((f) => (f.includes('<a|b>') ? ['a', 'b'].map((s) => f.replace('<a|b>', s)) : [f]))
    .map((f) => `    ${f}`),
  '  conv_7f3e9d014a6c/',
  '    ...',
].join('\n');

const out = process.argv[2];
// Em dashes are normalised to hyphens across the whole file, including the
// field descriptions imported above — those come from the packaging package and
// would otherwise reintroduce one on every run. En dashes are left alone; they
// carry ranges (25–34).
writeFileSync(out, `${JSON.stringify(measured, null, 2).replaceAll('—', '-')}\n`);
console.log(`wrote ${out} (SYNTHETIC)`);
console.log(`  hours=${measured.stats.hours} convs=${CONVERSATIONS} speakers=${speakerMinutes.length}`);
