/**
 * Shape of the baked dataset snapshot in `src/data/`.
 *
 * An Open Release is frozen by construction — its conversations are reserved
 * permanently, so every number here is a publish-time constant rather than
 * something to query at request time. The file is generated upstream and
 * committed, which is what keeps this page static and independent of any
 * running service.
 *
 * SPLIT IN TWO, and the split is load-bearing. `MeasuredSnapshot` is emitted by
 * yap-room from the release itself and is overwritten wholesale on every
 * regenerate; `Editorial` is written by hand here. Holding both in one file
 * meant a regenerate silently reverted copy edits, and it meant a copy edit
 * could put any figure it liked on the page. Neither is possible now: nothing
 * hand-written is generated, and nothing generated is hand-written.
 *
 * `metadataFields` and `fileStructure` are the delivery pipeline's own — what
 * the page documents and what the archive contains have to be the same thing.
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

/**
 * What it costs and what you may do with it - the axis the chart partitions on,
 * because "largest" is only true within the first of these.
 */
export type AccessClass = "free-commercial" | "free-noncommercial" | "paid";

export type ComparisonEntry = {
  name: string;
  hours: number;
  year: number;
  capture: string;
  license: string;
  access: AccessClass;
  /** Telephone-band, so band-limited to roughly 3.4 kHz of usable speech. */
  narrowband: boolean;
  ours?: boolean;
};

/** What every section reports its figures over, so a thin one is visible. */
export type Coverage = Record<string, { measured: number; of: number }>;

/**
 * Emitted by yap-room's `build-open-release-snapshot`. Regenerated wholesale —
 * never edit by hand, the next run will discard it.
 */
export type MeasuredSnapshot = {
  slug: string;
  stats: {
    conversations: number;
    hours: number;
    speakers: number;
    averageDurationMinutes: number;
  };
  population: {
    gender: Distribution;
    age: Distribution;
    education: Distribution;
    nativeLanguage: Distribution;
    childhoodCountry: Distribution;
  };
  /** Per-speaker delivered minutes, unsorted. Drives the contribution chart. */
  speakerMinutes: number[];
  data: {
    relationship: Distribution;
    language: Distribution;
    conversationLength: Metric;
    wordsPerConversation: Metric;
    vocabulary: {
      totalWords: number;
      uniqueWords: number | null;
      typeTokenRatio: number | null;
      wordsPerMinute: number;
    };
  };
  audio: {
    groups: { title: string; metrics: Metric[] }[];
    conformance: ConformanceCheck[];
  };
  metadataFields: MetadataField[];
  fileStructure: string;
  coverage: Coverage;
  /** Set by the placeholder generator. A true here must never reach production. */
  synthetic?: boolean;
};

/** Written by hand in `src/data/editorial.ts`. Never generated. */
export type Editorial = {
  name: string;
  tagline: string;
  description: string;
  overview: OverviewRow[];
  comparison: { note: string; datasets: ComparisonEntry[] };
  citation: { text: string; bibtex: string };
  provenance: { summary: string; points: string[] };
  quality: Prose[];
  useCases: Prose[];
  audio: {
    note: string;
    /** Keyed by the measured group title. Every emitted group needs one. */
    groupDescriptions: Record<string, string>;
    /** Keyed by the measured metric label. Optional per metric. */
    metricNotes: Record<string, string>;
  };
  samples: PairedSample[];
};

export type DatasetSnapshot = Omit<Editorial, "audio"> &
  Omit<MeasuredSnapshot, "audio" | "coverage" | "synthetic" | "slug"> & {
    slug: string;
    data: MeasuredSnapshot["data"] & {
      vocabulary: { uniqueWords: number; typeTokenRatio: number };
    };
    audio: {
      note: string;
      groups: MetricGroup[];
      conformance: ConformanceCheck[];
    };
  };
