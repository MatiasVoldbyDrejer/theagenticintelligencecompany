import type { ConformanceCheck } from "@/lib/dataset";
import { t } from "./type";

/**
 * Pass rates against stated thresholds. This is the section that answers "how
 * much of this survives my filtering" directly, so the excluded share is shown
 * next to the pass rate rather than left to be subtracted.
 */
export default function Conformance({ checks }: { checks: ConformanceCheck[] }) {
  return (
    <section id="conformance" className="scroll-mt-24 space-y-4">
      <h2 className={t.sectionTitle}>Conformance</h2>
      <p className={t.sectionIntro}>
        Every check runs over the full release on each build, and the report ships inside the
        archive so the numbers below can be reproduced from the files themselves.
      </p>

      <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
        <div className="flex items-center gap-5 border-b border-zinc-100 px-5 py-2.5">
          <span className={`flex-1 ${t.eyebrow}`}>Check</span>
          <span className={`hidden w-40 shrink-0 sm:block ${t.eyebrow}`}>Threshold</span>
          <span className={`w-24 shrink-0 text-right ${t.eyebrow}`}>Pass</span>
          <span className={`hidden w-20 shrink-0 text-right sm:block ${t.eyebrow}`}>Excluded</span>
        </div>

        {checks.map((c, i) => {
          const excluded = 1 - c.passRate;
          return (
            <div
              key={c.check}
              className={`flex items-center gap-5 px-5 py-3.5 ${
                i > 0 ? "border-t border-zinc-100" : ""
              }`}
            >
              <span className="min-w-0 flex-1 text-sm text-zinc-900">{c.check}</span>
              <span className="hidden w-40 shrink-0 font-mono text-[12px] text-zinc-500 sm:block">
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
      </div>
    </section>
  );
}
