"use client";

import type { ConformanceCheck, Metric, MetricGroup } from "@/lib/dataset";
import Collapsible from "./Collapsible";
import HistogramChart from "./HistogramChart";
import { Card } from "./Card";
import { t } from "./type";

/**
 * The measured character of the audio, kept shut by default.
 *
 * Every figure is a distribution rather than a mean: the question a lab is
 * actually asking is not "how good is this on average" but "how much of it
 * survives my filtering", and an average cannot answer that. The conformance
 * table states pass rates against explicit thresholds, with the excluded share
 * next to each rather than left to be subtracted.
 */
export default function AudioMetrics({
  groups,
  conformance,
  note,
}: {
  groups: MetricGroup[];
  conformance: ConformanceCheck[];
  note: string;
}) {
  const total = groups.reduce((n, g) => n + g.metrics.length, 0);

  return (
    <section id="metrics" className="scroll-mt-24">
      <Collapsible
        title="Audio metrics"
        summary={`${total} measured quantities and ${conformance.length} conformance checks, each as a distribution over the delivered files. ${note}`}
        openLabel="Show metrics"
        closeLabel="Hide metrics"
      >
        <div className="space-y-12">
          {groups.map((group) => (
            <div key={group.title} className="space-y-4">
              <div className="space-y-1.5">
                <h3 className="text-[17px] font-medium text-zinc-900">{group.title}</h3>
                <p className="text-[13.5px] leading-6 text-zinc-700">
                  {group.description}
                </p>
              </div>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {group.metrics.map((m) => (
                  <HistogramChart
                    key={m.label}
                    metric={m}
                    title={m.label}
                    height="h-28"
                    aside={<Unit metric={m} />}
                  />
                ))}
              </div>
            </div>
          ))}

          <div className="space-y-4">
            <h3 className="text-[17px] font-medium text-zinc-900">Conformance</h3>
            <Card>
              <div className="flex items-center gap-5 border-b border-zinc-100 px-5 py-2.5">
                <span className={`flex-1 ${t.eyebrow}`}>Check</span>
                <span className={`hidden w-44 shrink-0 sm:block ${t.eyebrow}`}>Threshold</span>
                <span className={`w-24 shrink-0 text-right ${t.eyebrow}`}>Pass</span>
                <span className={`hidden w-20 shrink-0 text-right sm:block ${t.eyebrow}`}>
                  Excluded
                </span>
              </div>
              {conformance.map((c, i) => {
                const excluded = 1 - c.passRate;
                return (
                  <div
                    key={c.check}
                    className={`flex items-center gap-5 px-5 py-3.5 ${
                      i > 0 ? "border-t border-zinc-100" : ""
                    }`}
                  >
                    <span className="min-w-0 flex-1 text-sm text-zinc-900">{c.check}</span>
                    <span className="hidden w-44 shrink-0 font-mono text-[12px] text-zinc-500 sm:block">
                      {c.threshold}
                    </span>
                    <span className="w-24 shrink-0 text-right font-mono text-[14px] tabular-nums text-zinc-900">
                      {(c.passRate * 100).toFixed(2)}%
                    </span>
                    <span className="hidden w-20 shrink-0 text-right font-mono text-[12px] tabular-nums text-zinc-400 sm:block">
                      {excluded === 0 ? "—" : `${(excluded * 100).toFixed(2)}%`}
                    </span>
                  </div>
                );
              })}
            </Card>
          </div>
        </div>
      </Collapsible>
    </section>
  );
}

function Unit({ metric }: { metric: Metric }) {
  return <span className="font-mono text-[11px] text-zinc-400">{metric.unit}</span>;
}
