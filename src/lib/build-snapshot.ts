import type {
  Coverage,
  DatasetSnapshot,
  Distribution,
  Editorial,
  MeasuredSnapshot,
  Metric,
} from "./dataset";

/**
 * Joins the generated half to the hand-written half, and refuses anything that
 * would render as a confident figure without being one.
 *
 * This runs at module scope in a server component, so every `fail` below stops
 * the build rather than shipping a page with a blank card or a `NaN` on it. The
 * old `snapshot as DatasetSnapshot` cast checked none of this: a renamed field
 * arrived as `undefined` and surfaced as a crash inside `.toLocaleString()`,
 * three components deep, at request time.
 */

/** Below this share of the corpus, a figure is not evidence of anything. */
const MIN_COVERAGE = 0.9;

function fail(what: string): never {
  throw new Error(`dataset snapshot: ${what}`);
}

function requireDistribution(d: Distribution | undefined, name: string): Distribution {
  if (!d || Object.keys(d).length === 0) fail(`${name} is empty`);
  for (const [k, v] of Object.entries(d)) {
    if (!Number.isFinite(v) || v < 0) fail(`${name}["${k}"] is ${v}`);
  }
  return d;
}

function requireMetric(m: Metric | undefined, name: string): Metric {
  if (!m) fail(`${name} is missing`);
  if (!Array.isArray(m.bins) || m.bins.length === 0) fail(`${name} has no bins`);
  if (m.bins.some((b) => !Number.isFinite(b) || b < 0)) fail(`${name} has a bad bin count`);
  // Out-of-order percentiles mean the emitter sorted or sampled wrongly, and
  // the caliper on the chart would render inside out rather than error.
  if (!(m.p5 <= m.p50 && m.p50 <= m.p95)) {
    fail(`${name} percentiles are out of order (${m.p5} / ${m.p50} / ${m.p95})`);
  }
  if (!(m.binMin < m.binMax)) fail(`${name} has an empty bin range`);
  return m;
}

function assertCoverage(coverage: Coverage): void {
  const thin = Object.entries(coverage)
    .filter(([, { measured, of }]) => of === 0 || measured / of < MIN_COVERAGE)
    .map(([section, { measured, of }]) => `${section} (${measured}/${of})`);
  if (thin.length > 0) {
    fail(
      `under-covered sections: ${thin.join(", ")}. Re-run the emitter once the ` +
        `upstream backfills have caught up — publishing these would state a ` +
        `figure measured over a fraction of the corpus as if it covered all of it`,
    );
  }
}

export function buildSnapshot(measured: MeasuredSnapshot, editorial: Editorial): DatasetSnapshot {
  if (!measured?.stats) fail("measured file has no stats — is it the emitter's output?");
  assertCoverage(measured.coverage ?? {});

  const { stats } = measured;
  for (const key of ["conversations", "hours", "speakers", "averageDurationMinutes"] as const) {
    if (!Number.isFinite(stats[key]) || stats[key] <= 0) fail(`stats.${key} is ${stats[key]}`);
  }

  requireDistribution(measured.population?.gender, "population.gender");
  requireDistribution(measured.population?.age, "population.age");
  requireDistribution(measured.population?.education, "population.education");
  requireDistribution(measured.population?.nativeLanguage, "population.nativeLanguage");
  requireDistribution(measured.population?.childhoodCountry, "population.childhoodCountry");
  requireDistribution(measured.data?.relationship, "data.relationship");
  requireDistribution(measured.data?.language, "data.language");
  requireMetric(measured.data?.conversationLength, "data.conversationLength");
  requireMetric(measured.data?.wordsPerConversation, "data.wordsPerConversation");

  if (!measured.speakerMinutes?.length) fail("speakerMinutes is empty");

  const vocab = measured.data?.vocabulary;
  // Null means the emitter ran with --skip-vocab. The card has no way to say
  // "not measured", so the snapshot is rejected rather than rendered blank.
  if (vocab?.uniqueWords == null || vocab.typeTokenRatio == null) {
    fail("data.vocabulary.uniqueWords is not measured — re-run the emitter without --skip-vocab");
  }

  for (const check of measured.audio?.conformance ?? []) {
    if (!(check.passRate >= 0 && check.passRate <= 1)) {
      fail(`conformance "${check.check}" has passRate ${check.passRate}`);
    }
  }

  // A group the emitter produces but nobody has written copy for would render
  // as a heading over a gap, so it is a missing-copy error rather than a blank.
  const groups = (measured.audio?.groups ?? []).map((group) => {
    const description = editorial.audio.groupDescriptions[group.title];
    if (!description) fail(`no editorial description for audio group "${group.title}"`);
    return {
      title: group.title,
      description,
      metrics: group.metrics.map((metric) => {
        requireMetric(metric, `audio metric "${metric.label}"`);
        const note = editorial.audio.metricNotes[metric.label];
        return note ? { ...metric, note } : metric;
      }),
    };
  });
  if (groups.length === 0) fail("audio has no metric groups");

  return {
    ...editorial,
    slug: measured.slug,
    stats,
    population: measured.population,
    speakerMinutes: measured.speakerMinutes,
    data: {
      ...measured.data,
      vocabulary: {
        ...vocab,
        uniqueWords: vocab.uniqueWords,
        typeTokenRatio: vocab.typeTokenRatio,
      },
    },
    metadataFields: measured.metadataFields,
    fileStructure: measured.fileStructure,
    audio: {
      note: editorial.audio.note,
      groups,
      conformance: measured.audio.conformance,
    },
  };
}
