import type { Metric, MetricGroup } from "@/lib/dataset";
import { t } from "./type";

/**
 * The measured character of the audio, group by group.
 *
 * Every figure is a distribution rather than a mean. A lab's real question is
 * not "how good is this on average" but "how much of it survives my filtering",
 * and a single number cannot answer that — so each metric shows its shape and
 * its 5th/50th/95th percentiles, and the conformance table underneath states
 * pass rates against explicit thresholds.
 */
export default function AudioMetrics({ groups }: { groups: MetricGroup[] }) {
  return (
    <section id="audio" className="scroll-mt-24 space-y-4">
      <h2 className={t.sectionTitle}>Audio metrics</h2>
      <p className={t.sectionIntro}>
        Recomputed from the delivered files rather than from capture settings, so every figure
        below describes the bytes an approved recipient receives. Percentiles are over
        conversations and distributions are unweighted; the{" "}
        <span className="text-[#7c6bb0]">tick</span> on each shape marks the median.
      </p>

      <div className="space-y-10 pt-2">
        {groups.map((group) => (
          <div key={group.title} className="space-y-3">
            <div className="space-y-1.5">
              <h3 className="text-[17px] font-medium text-zinc-900">{group.title}</h3>
              <p className="max-w-3xl text-[13.5px] leading-6 text-zinc-500">
                {group.description}
              </p>
            </div>

            <div className="overflow-hidden rounded-sm border border-zinc-200 bg-white">
              <div className="flex items-center gap-5 border-b border-zinc-100 px-5 py-2.5">
                <span className={`flex-1 ${t.eyebrow}`}>Metric</span>
                <span className={`hidden w-[260px] shrink-0 sm:block ${t.eyebrow}`}>
                  Distribution
                </span>
                <span className={`w-14 shrink-0 text-right ${t.eyebrow}`}>p5</span>
                <span className={`w-14 shrink-0 text-right ${t.eyebrow}`}>p50</span>
                <span className={`w-14 shrink-0 text-right ${t.eyebrow}`}>p95</span>
              </div>
              {group.metrics.map((m, i) => (
                <MetricRow key={m.label} metric={m} first={i === 0} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function MetricRow({ metric, first }: { metric: Metric; first: boolean }) {
  const d = metric.decimals ?? 1;
  const fmt = (x: number) => x.toFixed(d);

  return (
    <div className={`px-5 py-4 ${first ? "" : "border-t border-zinc-100"}`}>
      <div className="flex items-center gap-5">
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm text-zinc-900">{metric.label}</div>
          <div className="font-mono text-[11px] text-zinc-400">{metric.unit}</div>
        </div>

        <div className="hidden w-[260px] shrink-0 sm:block">
          <Histogram metric={metric} />
        </div>

        <span className="w-14 shrink-0 text-right font-mono text-[12px] tabular-nums text-zinc-400">
          {fmt(metric.p5)}
        </span>
        <span className="w-14 shrink-0 text-right font-mono text-[15px] tabular-nums text-zinc-900">
          {fmt(metric.p50)}
        </span>
        <span className="w-14 shrink-0 text-right font-mono text-[12px] tabular-nums text-zinc-400">
          {fmt(metric.p95)}
        </span>
      </div>

      {metric.note && (
        <p className="mt-2.5 max-w-3xl text-[12.5px] leading-5 text-zinc-400">{metric.note}</p>
      )}
    </div>
  );
}

/**
 * Bin counts as bars on a hairline baseline, with a caliper tick at the median
 * — the same measured vocabulary as the demographics readout, so a histogram
 * and a category share read as one system.
 */
function Histogram({ metric }: { metric: Metric }) {
  const { bins, binMin, binMax, p50 } = metric;
  const max = Math.max(...bins, 1);
  const w = bins.length * 4;
  const h = 34;
  // Bars stop short of the top so the median tick clears the tallest one and
  // reads as a caliper laid over the shape rather than a bar of its own.
  const barSpace = h - 6;
  const medianX = ((p50 - binMin) / (binMax - binMin)) * w;

  return (
    <div>
      <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="h-9 w-full" aria-hidden>
        {bins.map((count, i) => {
          // Never let a populated bin vanish — a 1px stub still reads as "some".
          const barH = count === 0 ? 0 : Math.max(1, (count / max) * barSpace);
          return (
            <rect
              key={i}
              x={i * 4}
              y={h - barH}
              width={3}
              height={barH}
              fill="#18181b"
              opacity={0.82}
            />
          );
        })}
        <line x1={0} y1={h} x2={w} y2={h} stroke="#d4d4d8" strokeWidth={1} />
        <line x1={medianX} y1={0} x2={medianX} y2={h} stroke="#7c6bb0" strokeWidth={1} />
      </svg>
      <div className="flex justify-between font-mono text-[10px] tabular-nums text-zinc-400">
        <span>{binMin}</span>
        <span>{binMax}</span>
      </div>
    </div>
  );
}
