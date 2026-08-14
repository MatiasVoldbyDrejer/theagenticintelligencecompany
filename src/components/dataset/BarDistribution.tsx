"use client";

import { useMemo, useState } from "react";
import type { Distribution } from "@/lib/dataset";
import { Card, CardHeader } from "./Card";
import { ACCENT, INK } from "./colors";

const OTHER = "Other";

/**
 * Category shares as a hairline measure with a caliper end-tick — a precise
 * measurement rather than a progress bar.
 *
 * Single series, so no legend: the row label names it. Every value is printed
 * on its row, which makes the hover layer an enhancement (it adds rank and
 * cumulative share) rather than the only way to read the chart.
 */
export default function BarDistribution({
  title,
  data,
  orderedKeys,
  labels,
  unit = "speakers",
  maxRows,
}: {
  title: string;
  data: Distribution;
  /** Fixed display order. Omit to sort by value, descending. */
  orderedKeys?: string[];
  labels?: Record<string, string>;
  /** What one count means, shown in the tooltip. */
  unit?: string;
  /** Roll everything past this into a trailing "Other" row. */
  maxRows?: number;
}) {
  const [hover, setHover] = useState<number | null>(null);

  const entries = useMemo(() => {
    if (orderedKeys) {
      return orderedKeys.map((k) => [k, data[k] ?? 0] as const).filter(([, v]) => v > 0);
    }

    // An "Other" already in the data is a bucket, not a category: it sinks to
    // the bottom regardless of size, and any rolled-up tail merges INTO it
    // rather than becoming a second row of the same name.
    const named = Object.entries(data).filter(([k]) => k !== OTHER);
    named.sort(([, a], [, b]) => b - a);
    let other = data[OTHER] ?? 0;

    let head = named;
    if (maxRows) {
      const keep = other > 0 || named.length > maxRows ? maxRows - 1 : maxRows;
      if (named.length > keep) {
        head = named.slice(0, keep);
        other += named.slice(keep).reduce((sum, [, v]) => sum + v, 0);
      }
    }

    const rows = head.filter(([, v]) => v > 0).map(([k, v]) => [k, v] as const);
    return other > 0 ? [...rows, [OTHER, other] as const] : rows;
  }, [data, orderedKeys, maxRows]);

  const total = entries.reduce((sum, [, v]) => sum + v, 0);
  const max = Math.max(...entries.map(([, v]) => v), 1);

  let running = 0;
  const cumulative = entries.map(([, v]) => (running += v));

  return (
    <Card>
      <CardHeader
        title={title}
        aside={
          <span className="font-mono text-[11px] tabular-nums text-zinc-400">
            {total.toLocaleString()}
          </span>
        }
      />
      <div className="px-5 py-2.5" onPointerLeave={() => setHover(null)}>
        {entries.map(([key, value], i) => {
          const label = labels?.[key] ?? key;
          const share = total > 0 ? value / total : 0;
          // Never let a non-zero category vanish; a 2% floor keeps the caliper visible.
          const width = Math.max((value / max) * 100, 2);
          const on = hover === i;
          return (
            <div
              key={key}
              tabIndex={0}
              onPointerEnter={() => setHover(i)}
              onFocus={() => setHover(i)}
              onBlur={() => setHover(null)}
              aria-label={`${label}: ${value.toLocaleString()} ${unit}, ${(share * 100).toFixed(1)}%`}
              className={`relative flex items-center gap-4 py-2.5 outline-none ${
                i === entries.length - 1 ? "" : "border-b border-zinc-100"
              }`}
            >
              <span
                className={`w-28 shrink-0 truncate text-sm transition-colors ${
                  on ? "text-zinc-900" : "text-zinc-500"
                }`}
                title={label}
              >
                {label}
              </span>

              <div className="relative h-2 flex-1" aria-hidden>
                <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-zinc-200" />
                <div
                  className="absolute left-0 top-1/2 h-[3px] -translate-y-1/2 transition-colors"
                  style={{ width: `${width}%`, background: on ? ACCENT : INK }}
                />
                <div
                  className="absolute top-1/2 h-2 w-px -translate-y-1/2 transition-colors"
                  style={{ left: `${width}%`, background: on ? ACCENT : INK }}
                />
              </div>

              <span className="w-12 shrink-0 text-right font-mono text-[13px] tabular-nums text-zinc-900">
                {value.toLocaleString()}
              </span>
              <span className="w-10 shrink-0 text-right font-mono text-[12px] tabular-nums text-zinc-400">
                {(share * 100).toFixed(share < 1 ? 1 : 0)}%
              </span>

              {on && (
                // The top row has no space above it inside the card, so its
                // tooltip flips below rather than clipping out of the frame.
                <div
                  className={`pointer-events-none absolute right-0 z-20 whitespace-nowrap rounded-md border border-zinc-800 bg-zinc-900 px-2.5 py-1.5 text-right ${
                    i === 0 ? "top-full translate-y-1" : "-top-1 -translate-y-full"
                  }`}
                >
                  <div className="font-mono text-[11px] tabular-nums text-zinc-50">
                    {value.toLocaleString()} {unit} · {(share * 100).toFixed(1)}%
                  </div>
                  <div className="font-mono text-[10px] tabular-nums text-zinc-400">
                    rank {i + 1} of {entries.length} · top {i + 1} ={" "}
                    {((cumulative[i] / total) * 100).toFixed(1)}%
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
