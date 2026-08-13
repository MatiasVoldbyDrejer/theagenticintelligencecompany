import type { DatasetSnapshot } from "@/lib/dataset";
import SpeakerContribution from "./SpeakerContribution";
import { t } from "./type";

type Dist = Record<string, number>;

const AGE_ORDER = ["Under 25", "25–34", "35–44", "45–54", "55+"];
const EDUCATION_ORDER = ["primary", "secondary", "vocational", "bachelor", "master", "phd"];
// The card asks one question — "Native English?" — so the two buckets read as
// Yes/No. Fixed order keeps Yes on top whichever way the split falls.
const NATIVE_ORDER = ["Native English", "Non-native English"];
const NATIVE_LABELS = { "Native English": "Yes", "Non-native English": "No" };

export default function Population({
  demographics,
  speakerMinutes,
}: {
  demographics: DatasetSnapshot["demographics"];
  speakerMinutes: number[];
}) {
  return (
    <section id="population" className="scroll-mt-24 space-y-4">
      <h2 className={t.sectionTitle}>Population</h2>
      <p className={t.sectionIntro}>
        Self-reported at sign-up, before any recording. Counts are speakers, not hours — the
        contribution chart underneath shows how the hours themselves are spread across them.
      </p>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <DistroCard title="Gender" data={demographics.gender} />
        <DistroCard title="Age" data={demographics.age} orderedKeys={AGE_ORDER} />
        <DistroCard title="Education" data={demographics.education} orderedKeys={EDUCATION_ORDER} />
        <DistroCard
          title="Native English"
          data={demographics.nativeEnglish}
          orderedKeys={NATIVE_ORDER}
          labels={NATIVE_LABELS}
        />
      </div>

      <div className="pt-6">
        <SpeakerContribution minutes={speakerMinutes} />
      </div>
    </section>
  );
}

function DistroCard({
  title,
  data,
  orderedKeys,
  labels,
}: {
  title: string;
  data: Dist;
  orderedKeys?: string[];
  /** Display names for the raw distribution keys; unmapped keys show as-is. */
  labels?: Record<string, string>;
}) {
  const entries = orderedKeys
    ? orderedKeys.map((k) => [k, data[k] ?? 0] as const).filter(([, v]) => v > 0)
    : Object.entries(data).sort(([, a], [, b]) => b - a);

  const total = entries.reduce((sum, [, v]) => sum + v, 0);
  const max = Math.max(...entries.map(([, v]) => v), 1);

  return (
    <div className="rounded-sm border border-zinc-200 bg-white">
      <div className="flex items-baseline border-b border-zinc-100 px-5 py-3.5">
        <h3 className={t.cardTitle}>{title}</h3>
      </div>
      <div className="px-5 py-2.5">
        {entries.map(([label, value], i) => (
          <Row
            key={label}
            label={labels?.[label] ?? label}
            value={value}
            frac={value / max}
            pct={total > 0 ? value / total : 0}
            last={i === entries.length - 1}
          />
        ))}
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  frac,
  pct,
  last,
}: {
  label: string;
  value: number;
  frac: number;
  pct: number;
  last: boolean;
}) {
  // Never let a non-zero category vanish; a 2% floor keeps the caliper visible.
  const width = Math.max(frac * 100, 2);
  return (
    <div className={`flex items-center gap-4 py-2.5 ${last ? "" : "border-b border-zinc-100"}`}>
      <span className="w-24 shrink-0 truncate text-sm capitalize text-zinc-500">{label}</span>
      {/* The measure: a hairline rail, a flat near-black fill, and a caliper
          end-tick that reads as a precise measurement rather than a progress bar. */}
      <div className="relative h-2 flex-1" aria-hidden>
        <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-zinc-200" />
        <div
          className="absolute left-0 top-1/2 h-[3px] -translate-y-1/2 bg-zinc-900"
          style={{ width: `${width}%` }}
        />
        <div
          className="absolute top-1/2 h-2 w-px -translate-y-1/2 bg-zinc-900"
          style={{ left: `${width}%` }}
        />
      </div>
      <span className="w-8 shrink-0 text-right font-mono text-[13px] tabular-nums text-zinc-900">
        {value}
      </span>
      <span className="w-9 shrink-0 text-right font-mono text-[12px] tabular-nums text-zinc-400">
        {Math.round(pct * 100)}%
      </span>
    </div>
  );
}
