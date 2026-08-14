"use client";

import { useMemo, useState } from "react";
import { t } from "./type";
import { ACCENT, INK } from "./colors";

const pct = (x: number) => `${(x * 100).toFixed(1)}%`;
const round1 = (x: number) => Math.round(x * 10) / 10;

function fmtDur(minutes: number): string {
  if (minutes >= 60) return `${round1(minutes / 60)} h`;
  if (minutes >= 1) return `${round1(minutes)} min`;
  return `${Math.round(minutes * 60)} s`;
}

/**
 * Descending per-speaker hours — the shape that shows whether a corpus is a
 * handful of voices padded out or a genuine population. The plateau on the left
 * is the per-speaker cap doing its job.
 */
export default function SpeakerContribution({ minutes }: { minutes: number[] }) {
  const [hover, setHover] = useState<number | null>(null);

  const sorted = useMemo(() => [...minutes].sort((a, b) => b - a), [minutes]);
  const cum = useMemo(() => {
    const out: number[] = [];
    let run = 0;
    for (const v of sorted) {
      run += v;
      out.push(run);
    }
    return out;
  }, [sorted]);

  const n = sorted.length;
  if (n === 0) return null;

  const total = cum[n - 1] || 1;
  const max = sorted[0] || 1;
  const top1Share = (sorted[0] ?? 0) / total;
  const top10Share = (cum[Math.min(9, n - 1)] ?? 0) / total;
  const active = hover !== null ? sorted[hover] : null;
  const tipLeft = hover !== null ? Math.min(95, Math.max(5, ((hover + 0.5) / n) * 100)) : 0;

  return (
    <div className="space-y-4">
      <div className="flex items-baseline justify-between">
        <h3 className={t.cardTitle}>Speaker contribution</h3>
        <span className="font-mono text-[11px] tabular-nums text-zinc-400">n={n}</span>
      </div>

      <div className="rounded-lg border border-zinc-200 bg-white p-5 sm:p-6">
        <div className="mb-6 flex gap-10">
          <Stat label="Top contributor" value={pct(top1Share)} />
          <Stat label="Top 10 contributors" value={pct(top10Share)} />
        </div>

        {/* Tooltip lane — reserved so nothing clips above the bars. */}
        <div className="relative mb-1 h-11">
          {hover !== null && active !== null && (
            <div
              className="pointer-events-none absolute bottom-0 flex -translate-x-1/2 flex-col items-center whitespace-nowrap rounded-md border border-zinc-800 bg-zinc-900 px-2.5 py-1.5 text-center"
              style={{ left: `${tipLeft}%` }}
            >
              <span className="font-mono text-[11px] tabular-nums text-zinc-50">
                #{hover + 1} · {fmtDur(active)} · {pct(active / total)}
              </span>
              <span className="font-mono text-[10px] tabular-nums text-zinc-400">
                top {hover + 1} = {pct(cum[hover] / total)} of all hours
              </span>
            </div>
          )}
        </div>

        {/* Measured chart: faint gridlines + baseline axis + flat bars. */}
        <div className="relative">
          {[0.25, 0.5, 0.75].map((g) => (
            <div
              key={g}
              aria-hidden
              className="pointer-events-none absolute inset-x-0 h-px bg-zinc-100"
              style={{ bottom: `${g * 100}%` }}
            />
          ))}
          <div
            className="relative flex h-44 items-end gap-px border-b border-zinc-300"
            onPointerLeave={() => setHover(null)}
          >
            {sorted.map((v, i) => (
              <div
                key={i}
                className="flex h-full min-w-0 flex-1 items-end"
                onPointerEnter={() => setHover(i)}
              >
                <div
                  className="w-full transition-colors"
                  style={{
                    height: `${(v / max) * 100}%`,
                    background: hover === i ? ACCENT : INK,
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className={t.eyebrow}>{label}</div>
      <div className={`mt-1 ${t.statValue}`}>{value}</div>
    </div>
  );
}
