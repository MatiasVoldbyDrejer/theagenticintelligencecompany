/**
 * Shape of the baked dataset snapshot in `src/data/`.
 *
 * An Open Release is frozen by construction — its conversations are reserved
 * permanently, so every number here is a publish-time constant rather than
 * something to query at request time. The file is generated upstream and
 * committed, which is what keeps this page static and independent of any
 * running service.
 *
 * `metadataFields` and `fileStructure` are copied from the delivery pipeline's
 * own definitions, not re-described here — what the page documents and what the
 * archive contains have to be the same thing.
 */

export type OverviewRow = {
  detail: string;
  value: string;
  /** Render the value as a mono chip rather than plain text. */
  chip?: boolean;
  /** Renders as `value` to `valueExtra` — for ranges. */
  valueExtra?: string;
  suffix?: string;
  note?: string;
};

export type MetadataField = {
  /** Archive-relative path of the file this field ships in. */
  file: string;
  field: string;
  description: string;
};

export type Distribution = Record<string, number>;

/**
 * One measured quantity across the corpus. `bins` are counts over equal-width
 * buckets spanning [binMin, binMax] — a shape, not a lookup — and the
 * percentiles carry the actual claim.
 */
export type Metric = {
  label: string;
  unit: string;
  p5: number;
  p50: number;
  p95: number;
  bins: number[];
  binMin: number;
  binMax: number;
  /** Precision for the percentile readout. */
  decimals?: number;
  note?: string;
};

export type MetricGroup = {
  title: string;
  description: string;
  metrics: Metric[];
};

/** A pass-rate against a stated threshold, expressed over delivered hours. */
export type ConformanceCheck = {
  check: string;
  threshold: string;
  passRate: number;
};

/** Absolute-amplitude peak envelope for one track, plus its length. */
export type PeaksData = { peaks: number[]; duration: number };

export type PairedSample = {
  conversationId: string;
  language: string | null;
  speakerA: { src: string; durationSeconds: number | null };
  speakerB: { src: string; durationSeconds: number | null };
  /** Baked, so the waveforms paint without decoding audio in the browser. */
  peaks: { a: PeaksData; b: PeaksData };
};

export type UseIcon = "duplex" | "diarization" | "understanding";

export type Prose = { title: string; body: string; icon?: UseIcon };

export type ComparisonEntry = {
  name: string;
  hours: number;
  year: number;
  capture: string;
  license: string;
  /** Telephone-band, so band-limited to roughly 3.4 kHz of usable speech. */
  narrowband: boolean;
  ours?: boolean;
};

export type DatasetSnapshot = {
  /** Placeholder until the release is named — swap here and in the page route. */
  name: string;
  tagline: string;
  description: string;
  license: { name: string; summary: string };
  stats: {
    conversations: number;
    hours: number;
    speakers: number;
    averageDurationMinutes: number;
  };
  overview: OverviewRow[];
  comparison: { note: string; datasets: ComparisonEntry[] };
  data: {
    relationship: Distribution;
    language: Distribution;
    conversationLength: Metric;
    wordsPerConversation: Metric;
    vocabulary: {
      totalWords: number;
      uniqueWords: number;
      typeTokenRatio: number;
      wordsPerMinute: number;
    };
  };
  population: {
    gender: Distribution;
    age: Distribution;
    education: Distribution;
    nativeLanguage: Distribution;
    birthCountry: Distribution;
  };
  /** Per-speaker delivered minutes, unsorted. Drives the contribution chart. */
  speakerMinutes: number[];
  provenance: { summary: string; points: string[] };
  quality: Prose[];
  useCases: Prose[];
  audio: {
    note: string;
    groups: MetricGroup[];
    conformance: ConformanceCheck[];
  };
  samples: PairedSample[];
  metadataFields: MetadataField[];
  fileStructure: string;
};
