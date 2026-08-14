// Generates src/data/open-release.json.
//
//   node scripts/generate-snapshot.mjs src/data/open-release.json
//
// PLACEHOLDER GENERATOR. Every corpus figure below is synthetic — shaped to be
// realistic so the page can be designed against it, but invented. The real one
// belongs upstream in the pipeline that owns the release, reading the same
// aggregates the vendor portal reports so the two can never disagree.
//
// What is NOT invented is the delivery schema and the archive tree at the
// bottom: those are read from the packaging package, so what this page
// documents and what the archive contains stay the same thing.
//
// Deterministic (fixed LCG seed), so re-running produces no diff.
import { readFileSync, writeFileSync } from 'node:fs';

// Checkout holding the built @yaproom/domain package.
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
function metric(label, unit, draw, lo, hi, { decimals = 1, n = 3400, note } = {}) {
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
    ...(note ? { note } : {}),
  };
}

const normal = (mu, sd) => () => mu + gauss() * sd;
const logNormal = (mu, sd) => () => Math.exp(mu + gauss() * sd);

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

const snapshot = {
  name: 'Open Corpus 1K',
  tagline:
    'One thousand hours of unscripted conversation between people who already know each other, each speaker on a separate uncompressed track.',
  description:
    'Unscripted conversations between two speakers. Every speaker chooses their own partner — a friend, a family member, someone they already know — so the talk carries the shorthand, interruption and ease of a real relationship rather than the politeness of two strangers assigned to each other. No topics are given and no script is followed. Both people record from home, on their own devices, in their own rooms.',
  captureMethod: {
    summary:
      'Speakers connect over WebRTC so they can hear each other, but the call audio is never the dataset. Each side is captured locally as uncompressed PCM at the microphone’s native rate and uploaded whole, so what ships is the original capture rather than what survived transmission.',
    points: [
      {
        title: 'The call is not the recording',
        body: 'WebRTC carries Opus-compressed audio so the two people can hold a conversation. The delivered files come from a separate local pipeline on each machine and never pass through that codec.',
      },
      {
        title: 'Captured at the microphone’s native rate',
        body: 'Audio is written as 16-bit PCM at whatever rate the device captured, then resampled once, on our side, to the release rate. Nothing is upsampled to make a header look better than the signal.',
      },
      {
        title: 'One file per speaker, never mixed',
        body: 'Each side is a separate mono track. The two are aligned to a shared timeline and equalised to an identical sample count, so overlap and turn-taking are measurable rather than inferred.',
      },
      {
        title: 'Processing kept off',
        body: 'Noise suppression and automatic gain control are disabled at capture, and echo cancellation is off by default so simultaneous speech survives instead of being gated away.',
      },
    ],
  },
  license: {
    name: 'Placeholder Data Use Agreement v0',
    summary:
      'Free for commercial and research use under a signed data use agreement. No redistribution, no re-identification, deletion on notice.',
  },
  stats: {
    conversations: CONVERSATIONS,
    hours: HOURS,
    speakers: speakerMinutes.length,
    averageDurationMinutes: Number(((totalMinutes / CONVERSATIONS)).toFixed(1)),
  },
  overview: [
    { detail: 'Speakers per recording', value: '2' },
    { detail: 'Channels', value: 'Stem-separated (one file per speaker)' },
    { detail: 'Audio format', value: '.flac / .wav', chip: true },
    { detail: 'Sample rate', value: '48 kHz', chip: true, note: 'native capture' },
    { detail: 'Bit depth', value: '16-bit PCM', chip: true },
    { detail: 'Languages', value: 'English (en)' },
    { detail: 'Metadata format', value: '.json', chip: true, note: 'UTF-8' },
    { detail: 'Transcription type', value: 'ASR, word-level with timings' },
    { detail: 'Transcription engine', value: 'Deepgram Nova-3', chip: true },
    { detail: 'Conversation topics', value: 'None assigned' },
    { detail: 'Recording environment', value: 'Home, speaker’s own device' },
    { detail: 'Per-speaker cap', value: '30 h', chip: true, note: 'no single voice dominates' },
    { detail: 'Licensing', value: 'Free, under a data use agreement' },
  ],
  comparison: {
    note: 'English two-speaker conversational corpora, by delivered hours. Telephone-band corpora are band-limited to roughly 3.4 kHz of usable speech regardless of their container.',
    source: 'Hours as catalogued by fullduplex.ai/datasets and the corpora’s own documentation.',
    datasets: [
      { name: 'Fisher English', hours: 2000, year: 2004, capture: 'Telephone', license: 'LDC paid', narrowband: true },
      { name: 'Open Corpus 1K', hours: HOURS, year: 2026, capture: 'Remote, per-speaker', license: 'Free, DUA', narrowband: false, ours: true },
      { name: 'CANDOR', hours: 850, year: 2023, capture: 'Video chat', license: 'CC-BY-NC-4.0', narrowband: false },
      { name: 'otoSpeech full-duplex', hours: 280, year: 2026, capture: 'Two-speaker', license: 'CC-BY-4.0', narrowband: false },
      { name: 'Switchboard-1', hours: 260, year: 1993, capture: 'Telephone', license: 'LDC paid', narrowband: true },
      { name: 'SpokenWOZ', hours: 249, year: 2023, capture: 'Task-oriented', license: 'CC-BY-NC-4.0', narrowband: true },
      { name: 'CALLHOME', hours: 120, year: 1996, capture: 'Telephone', license: 'LDC paid', narrowband: true },
      { name: 'AMI Meeting Corpus', hours: 100, year: 2006, capture: 'In-person meetings', license: 'CC-BY-4.0', narrowband: false },
      { name: 'CALLFRIEND', hours: 60, year: 1996, capture: 'Telephone', license: 'LDC paid', narrowband: true },
      { name: 'DailyTalk', hours: 20, year: 2022, capture: 'Acted dialogue', license: 'CC-BY-NC-SA-4.0', narrowband: false },
    ],
  },
  data: {
    relationship: {
      Friends: 5218,
      Partner: 3106,
      Family: 2744,
      Colleagues: 1612,
      Acquaintances: 1093,
      Other: 513,
    },
    language: {
      'en-US': 7412,
      'en-GB': 3086,
      'en-AU': 1174,
      'en-CA': 968,
      'en-IN': 811,
      'en-IE': 431,
      'en-NZ': 246,
      'en-ZA': 158,
    },
    conversationLength: metric(
      'Conversation length',
      'min',
      logNormal(1.29, 0.62),
      0,
      25,
      { n: CONVERSATIONS, note: 'Speakers end the call when the conversation ends; nothing is padded to a target length.' },
    ),
    wordsPerConversation: metric(
      'Words per conversation',
      'words',
      logNormal(6.39, 0.62),
      0,
      3500,
      { decimals: 0, n: CONVERSATIONS },
    ),
    vocabulary: {
      totalWords: TOTAL_WORDS,
      uniqueWords: 118420,
      typeTokenRatio: Number((118420 / TOTAL_WORDS).toFixed(5)),
      wordsPerMinute: 151,
    },
  },
  population: {
    gender: { Female: 132, Male: 118, 'Non-binary': 7 },
    age: { 'Under 25': 61, '25–34': 88, '35–44': 54, '45–54': 33, '55+': 21 },
    education: { Primary: 9, Secondary: 47, Vocational: 38, Bachelor: 92, Master: 58, PhD: 13 },
    nativeLanguage: {
      English: 171,
      Spanish: 21,
      German: 13,
      French: 11,
      Hindi: 9,
      Portuguese: 8,
      Tagalog: 6,
      Polish: 5,
      Danish: 5,
      Other: 8,
    },
    birthCountry: {
      'United States': 96,
      'United Kingdom': 44,
      Canada: 21,
      Australia: 18,
      India: 14,
      Ireland: 11,
      Nigeria: 9,
      'South Africa': 8,
      Philippines: 7,
      Germany: 6,
      Other: 23,
    },
  },
  speakerMinutes,
  provenance: {
    summary:
      'Every hour is recorded on our own platform. Nothing is scraped, licensed in from a third party, or synthesised.',
    points: [
      'Speakers sign up, consent explicitly before their first recording, and are paid for their time.',
      'Consent is tracked per speaker and can be withdrawn, which stops all further use of that speaker’s data.',
      'Demographics are self-reported at sign-up, before any recording, and never inferred from the audio.',
      'Speaker and conversation identifiers in the archive are pseudonymous and stable across the release.',
    ],
  },
  quality: [
    {
      title: 'Human linguistic review',
      body: 'A reviewer listens to each conversation and rates language proficiency, classifies accent, and judges how natural and expressive the exchange is. Recordings that read as performed rather than spoken do not ship.',
    },
    {
      title: 'Technical alignment',
      body: 'The two tracks are trimmed against each other and equalised to an identical sample count, so both sides of a conversation sit on one timeline and stay sample-accurate end to end.',
    },
    {
      title: 'Content and safety screening',
      body: 'An LLM pass over every transcript flags personally identifying information and screens content against moderation policy before a conversation becomes eligible for delivery.',
    },
  ],
  useCases: [
    {
      title: 'Conversational and speech-to-speech models',
      body: 'Separate tracks on a shared timeline give a full-duplex target: what each speaker said, when, and what the other was doing at that moment.',
    },
    {
      title: 'Diarization and turn segmentation',
      body: 'Speaker labels are ground truth rather than an estimate, because each speaker was recorded on their own microphone in their own room.',
    },
    {
      title: 'Audio understanding',
      body: 'Unprompted conversation between people who know each other, with word-level transcripts, relationship labels and self-reported speaker demographics.',
    },
  ],
  audio: {
    note: 'Every figure is measured per track on the delivered files and ships inside the archive, so each one can be recomputed from the bytes you receive.',
    groups: [
      {
        title: 'Signal',
        description:
          'Measured from the delivered bytes rather than the capture settings we asked for.',
        metrics: [
          metric('Effective bandwidth', 'kHz', normal(21.1, 1.9), 12, 24, {
            note: 'Highest frequency carrying real energy. The check that separates a genuine 48 kHz capture from a 48 kHz header written over an upsampled source.',
          }),
          metric('Noise floor', 'dBFS', normal(-67.1, 7.8), -90, -45),
          metric('Integrated loudness', 'LUFS', normal(-23.3, 3.4), -34, -14, {
            note: 'Audio ships un-normalised. Loudness is measured and reported so you can normalise to your own target without probing every file.',
          }),
          metric('True peak', 'dBTP', normal(-5.2, 3.1), -20, 0),
        ],
      },
      {
        title: 'Channel separation',
        description:
          'Two microphones in two rooms, so a speaker’s track should carry that speaker alone.',
        metrics: [
          metric('Echo-canceller gating', '% of partner speech', logNormal(-0.4, 1.1), 0, 10, {
            note: 'Share of the partner’s speech during which this microphone went to digital silence. Low values mean simultaneous speech survived capture.',
          }),
          metric('Inter-channel correlation', 'Pearson r', logNormal(-4.5, 0.9), 0, 0.08, {
            decimals: 3,
            note: 'Residual bleed of the partner into this track, over aligned speech regions.',
          }),
        ],
      },
      {
        title: 'Conversational dynamics',
        description:
          'Derived from the two independent tracks, so overlap is measured rather than inferred from one mixed channel.',
        metrics: [
          metric('Turn-taking gap', 'ms', normal(196, 430), -800, 1600, {
            decimals: 0,
            note: 'Median gap between one speaker stopping and the other starting. Negative values are overlapping turn transitions.',
          }),
          metric('Speech dominance', 'share to speaker A', normal(0.5, 0.11), 0.1, 0.9, {
            decimals: 2,
            note: '0.5 is an even split of spoken words between the two speakers.',
          }),
          metric('Speaking rate', 'words/min', normal(151, 26), 70, 240, { decimals: 0 }),
        ],
      },
    ],
    conformance: [
      { check: 'Track pairs with identical sample counts', threshold: 'exact', passRate: 1 },
      { check: 'Track pairs sharing a common timeline anchor', threshold: 'required', passRate: 1 },
      { check: 'Tracks with zero clipped samples', threshold: '0 samples at full scale', passRate: 0.9963 },
      { check: 'Tracks with full-band content', threshold: 'bandwidth ≥ 16 kHz', passRate: 0.9907 },
      { check: 'Track pairs within cross-talk bound', threshold: 'r ≤ 0.10', passRate: 0.9781 },
      { check: 'Conversations with word-level transcripts', threshold: 'both speakers', passRate: 1 },
      { check: 'Conversations passing content screening', threshold: 'required', passRate: 1 },
    ],
  },
  // PLACEHOLDER audio, from scripts/generate-placeholder-sample.mjs. Replace
  // with real cut clips; the player renders nothing when this is empty.
  samples: [JSON.parse(readFileSync('src/data/placeholder-sample.json', 'utf8'))],
};

// The schema and archive tree are the delivery pipeline's, not this page's —
// pulled from the built domain package so the two can never disagree.
const domain = await import(`${YAPROOM_ROOT}/packages/domain/dist/index.js`);
snapshot.metadataFields = domain.DATASET_METADATA_FIELDS;
snapshot.fileStructure = [
  'open-corpus-1k/',
  '  manifest.json',
  '  LICENSE.txt',
  '  conv_a1b2c3d4e5f6/',
  '    meta.json',
  '    speaker_a.flac   (or .wav)',
  '    speaker_b.flac   (or .wav)',
  '    speaker_a_meta.json',
  '    speaker_b_meta.json',
  '    speaker_a_transcript.json',
  '    speaker_b_transcript.json',
  '  conv_7f3e9d014a6c/',
  '    ...',
].join('\n');

const out = process.argv[2];
writeFileSync(out, JSON.stringify(snapshot, null, 2) + '\n');
console.log(`wrote ${out}
  hours=${snapshot.stats.hours} convs=${snapshot.stats.conversations} speakers=${snapshot.stats.speakers} avg=${snapshot.stats.averageDurationMinutes}min
  words=${TOTAL_WORDS.toLocaleString()} unique=118,420`);
console.log(`  length p50=${snapshot.data.conversationLength.p50}min  words/conv p50=${snapshot.data.wordsPerConversation.p50}`);
for (const g of snapshot.audio.groups) {
  for (const m of g.metrics) console.log(`  ${m.label}: ${m.p5} / ${m.p50} / ${m.p95} ${m.unit}`);
}
