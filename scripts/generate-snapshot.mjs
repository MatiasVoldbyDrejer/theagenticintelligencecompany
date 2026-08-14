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

const NAME = 'Open Yap 1K';
// Archive root follows the name, so the tree and the heading cannot disagree.
const SLUG = NAME.toLowerCase().replace(/[^a-z0-9]+/g, '-');
const SPEAKERS = speakerMinutes.length;

const conversationLength = metric(
  'Conversation length',
  'min',
  logNormal(1.29, 0.62),
  0,
  25,
  { n: CONVERSATIONS, note: 'Speakers end the call when the conversation ends; nothing is padded to a target length.' },
);

const snapshot = {
  name: NAME,
  tagline: 'Channel-separated English natural two-speaker conversations',
  description: [
    `${NAME} is a dataset of channel-separated English natural two-speaker conversations collected through The Agentic Data Company\u2019s platform. Conversations are between friends, family, partners, and colleagues. The conversations were recorded in diverse, real-world conditions, and microphones and environments vary across sessions. Each speaker\u2019s microphone is captured locally as uncompressed 16-bit PCM at 48 kHz.`,

    'The dataset is intended for conversational/S2S, diarization, and audio understanding. It is released publicly to support research and integration into third-party products by downstream developers.',
  ].join('\n\n'),
  captureMethod: {
    summary:
      'Speakers hear each other over a WebRTC connection. The delivered audio does not come from that connection: each client captures its own microphone locally as 16-bit PCM at the sample rate the device reports, and uploads that file whole.',
    points: [
      {
        title: 'The call stream is not the source',
        body: 'The WebRTC stream is Opus-compressed and exists only so the two speakers can hear each other. Delivered files come from a separate local capture path on each client and never pass through that codec.',
      },
      {
        title: 'Native-rate capture, no upsampling',
        body: 'Each client writes 16-bit PCM at the rate the device reports. This release is delivered at 48 kHz; conversations captured below 48 kHz are excluded rather than resampled upward. Effective bandwidth is reported per track under Audio metrics so the claim is checkable against the files.',
      },
      {
        title: 'One mono file per speaker',
        body: 'Each speaker is a separate mono file. The pair is aligned to a common start reference and truncated to an identical sample count. Overlap and turn transitions are therefore measured from two independent signals, not estimated from a mixture.',
      },
      {
        title: 'Capture-side processing disabled',
        body: 'getUserMedia is requested with noiseSuppression and autoGainControl off. Echo cancellation is off by default; where the browser or OS applied it anyway, the per-track echo_cancellation field records that, and the resulting gating is quantified under Audio metrics.',
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
    speakers: SPEAKERS,
    averageDurationMinutes: Number(((totalMinutes / CONVERSATIONS)).toFixed(1)),
  },
  overview: [
    { detail: 'Speakers per recording', value: '2' },
    { detail: 'Channels', value: 'Dual (one file per speaker)' },
    { detail: 'Audio format', value: '.flac / .wav', chip: true },
    { detail: 'Sample rate', value: '48 kHz', chip: true },
    { detail: 'Bit depth', value: '16-bit PCM', chip: true },
    { detail: 'Languages', value: 'English (en)' },
    { detail: 'Metadata format', value: '.json', chip: true, note: 'UTF-8' },
    { detail: 'Transcription type', value: 'ASR, word-level with timings' },
    { detail: 'Transcription engine', value: 'Deepgram Nova-3', chip: true },
    { detail: 'Licensing', value: 'Free, under a data use agreement' },
  ],
  comparison: {
    note: 'English conversational speech corpora commonly used as reference points, by documented hours. Structure differs across entries — AMI is multi-party, DailyTalk is acted, SpokenWOZ is task-oriented — see the capture column. Telephone-band corpora carry roughly 3.4 kHz of usable speech regardless of the container they ship in, so hours are not directly comparable across the two groups.',
    datasets: [
      { name: 'Fisher English', hours: 2000, year: 2004, capture: 'Telephone', license: 'LDC paid', narrowband: true },
      { name: NAME, hours: HOURS, year: 2026, capture: 'Remote, per-speaker', license: 'Free, DUA', narrowband: false, ours: true },
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
    conversationLength,
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
      'All audio was recorded on our own platform. No part of the corpus is scraped, licensed from a third party, or synthesised.',
    points: [
      'Speakers register, give explicit consent before their first recording, and are paid for their time.',
      'Consent is recorded per speaker and can be withdrawn; withdrawal ends further use of that speaker’s data.',
      'Demographics are self-reported at registration, before any recording, and are never inferred from audio.',
      'Speaker and conversation identifiers are pseudonymous and stable within the release. Names, contact details and account identifiers are not included.',
    ],
  },
  quality: [
    {
      title: 'Human review',
      body: 'A reviewer listens to each conversation and records language proficiency, an accent classification, and ratings for naturalness and expressivity. Conversations judged to be read or performed rather than spontaneous are rejected and not delivered.',
    },
    {
      title: 'Track alignment',
      body: 'Both tracks are trimmed to a common start reference and equalised to an identical sample count. Pairs that cannot be aligned — either track missing a recorder-start anchor — are excluded from the release rather than shipped approximately aligned.',
    },
    {
      title: 'Transcript screening',
      body: 'Every transcript is passed through an LLM screen for personally identifying information and for content-policy violations. Flagged conversations are withheld pending human adjudication and are not delivered until cleared.',
    },
  ],
  useCases: [
    {
      title: 'Full-duplex and speech-to-speech',
      body: 'Both sides exist as independent signals on one timeline, so at any sample index the model has what one speaker produced and what they were hearing at that instant. Half-duplex targets can be derived from this; the reverse is not possible from a mixed recording.',
    },
    {
      title: 'Diarization and turn segmentation',
      body: 'Speaker attribution follows from the recording setup rather than from annotation: each speaker was captured on a separate microphone in a separate room. Residual cross-talk is quantified under Audio metrics, and is the limit on how clean those labels are.',
    },
    {
      title: 'Audio understanding',
      body: 'Unprompted conversation with word-level transcripts and timings, a self-reported relationship label per conversation, and self-reported speaker demographics. Topic tags and a generated summary ship per conversation in meta.json.',
    },
  ],
  audio: {
    note: 'Each figure is computed per track on the delivered files and ships in conv_<id>/metrics.json, so every distribution below can be recomputed from the archive. Percentiles are over conversations and unweighted by duration.',
    groups: [
      {
        title: 'Signal',
        description:
          'Computed from the delivered bytes, not from the capture settings requested at record time.',
        metrics: [
          metric('Effective bandwidth', 'kHz', normal(21.1, 1.9), 12, 24, {
            note: 'Frequency below which 99% of spectral energy falls, over voiced frames. Separates a native 48 kHz capture from a lower-rate source carrying a 48 kHz header: an upsampled track collapses toward its original Nyquist limit.',
          }),
          metric('Noise floor', 'dBFS', normal(-67.1, 7.8), -90, -45, {
            note: '10th-percentile short-term RMS over non-voiced frames.',
          }),
          metric('Integrated loudness', 'LUFS', normal(-23.3, 3.4), -34, -14, {
            note: 'ITU-R BS.1770 integrated loudness over the whole track. Audio is delivered un-normalised; this is reported so a target level can be applied without probing every file.',
          }),
          metric('True peak', 'dBTP', normal(-5.2, 3.1), -20, 0, {
            note: 'Maximum inter-sample peak, 4x oversampled. Values at 0 dBTP indicate a track at clipping risk.',
          }),
        ],
      },
      {
        title: 'Channel separation',
        description:
          'Two microphones in two rooms, so each track should carry one speaker. These quantify how far that holds.',
        metrics: [
          metric('Inter-channel correlation', 'Pearson r', logNormal(-4.5, 0.9), 0, 0.08, {
            decimals: 3,
            note: 'Pearson correlation between the two tracks over frames where exactly one speaker is voiced. Higher values mean the partner is more audible in this track; this is the bound on how clean speaker labels derived from the setup can be.',
          }),
          metric('Echo-canceller gating', '% of partner speech', logNormal(-0.4, 1.1), 0, 10, {
            note: 'Share of frames in which this track sits at digital silence while the partner track is voiced. Non-zero values indicate an echo canceller was active despite the capture request and suppressed the near-end microphone during partner speech.',
          }),
        ],
      },
      {
        title: 'Conversational dynamics',
        description:
          'Derived from the two independent signals rather than estimated from a mixture.',
        metrics: [
          metric('Overlap', '% of voiced time', logNormal(1.72, 0.72), 0, 25, {
            note: 'Share of voiced time in which both tracks are simultaneously voiced. Reported separately from the turn-taking gap: a mixed-channel recording cannot distinguish this from a single speaker.',
          }),
          metric('Turn-taking gap', 'ms', logNormal(5.3, 0.78), 0, 2000, {
            decimals: 0,
            note: 'Median silence between one speaker’s last voiced frame and the other’s first, per conversation. Non-negative by construction; simultaneous speech is counted under Overlap, not as a negative gap. Ships as turn_taking_gap_ms.',
          }),
          metric('Speech dominance', 'share to speaker A', normal(0.5, 0.11), 0.1, 0.9, {
            decimals: 2,
            note: 'Speaker A’s share of the conversation’s total transcript words. 0.5 is an even split. Ships as speech_dominance.',
          }),
          metric('Speaking rate', 'words/min', normal(151, 26), 70, 240, {
            decimals: 0,
            note: 'Transcript words per minute of voiced time, per speaker. Ships as avg_wpm.',
          }),
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
  `${SLUG}/`,
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
