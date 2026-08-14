"use client";

import { useState } from "react";
import type { ComparisonEntry } from "@/lib/dataset";
import { Card, CardHeader } from "./Card";

const INK = "#18181b";
const ACCENT = "#7c6bb0";

/**
 * Delivered hours across comparable corpora.
 *
 * One measure, so no categorical palette: colour marks emphasis (this release)
 * and every bar is directly labelled, so identity is never carried by colour.
 * Telephone-band corpora are hatched rather than given a second hue — the
 * distinction is a property of the bar, and texture survives greyscale, print
 * and colour-vision deficiency where a second hue would not.
 */
export default function ComparisonChart({
  entries,
  note,
  source,
}: {
  entries: ComparisonEntry[];
  note: string;
  source: string;
}) {
  const [hover, setHover] = useState<number | null>(null);

  const sorted = [...entries].sort((a, b) => b.hours - a.hours);
  const max = Math.max(...sorted.map((e) => e.hours), 1);

  return (
    <Card>
      <CardHeader
        title="Delivered hours"
        aside={
          <div className="flex items-center gap-4">
            <Key label="Wideband" hatched={false} />
            <Key label="Telephone band" hatched />
          </div>
        }
      />

      <div className="px-5 py-4" onPointerLeave={() => setHover(null)}>
        {sorted.map((e, i) => {
          const on = hover === i;
          const fill = e.ours ? ACCENT : INK;
          const width = Math.max((e.hours / max) * 100, 1.5);
          return (
            <div
              key={e.name}
              tabIndex={0}
              onPointerEnter={() => setHover(i)}
              onFocus={() => setHover(i)}
              onBlur={() => setHover(null)}
              aria-label={`${e.name}: ${e.hours.toLocaleString()} hours, ${e.year}, ${e.capture}, ${e.license}`}
              className={`relative flex items-center gap-4 py-2.5 outline-none ${
                i === sorted.length - 1 ? "" : "border-b border-zinc-100"
              }`}
            >
              <span
                className={`w-44 shrink-0 truncate text-[13px] ${
                  e.ours ? "font-medium text-zinc-900" : on ? "text-zinc-900" : "text-zinc-500"
                }`}
                title={e.name}
              >
                {e.name}
              </span>

              <div className="relative h-4 flex-1" aria-hidden>
                <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-zinc-100" />
                <div
                  className="absolute left-0 top-1/2 h-3 -translate-y-1/2 rounded-r-[2px] transition-opacity"
                  style={{
                    width: `${width}%`,
                    background: e.narrowband
                      ? `repeating-linear-gradient(135deg, ${fill} 0 2px, transparent 2px 5px)`
                      : fill,
                    // Hatched fills read lighter than solid at the same colour,
                    // so give them a hairline so short bars stay findable.
                    boxShadow: e.narrowband ? `inset 0 0 0 1px ${fill}33` : undefined,
                    opacity: hover === null || on ? 1 : 0.6,
                  }}
                />
              </div>

              <span
                className={`w-16 shrink-0 text-right font-mono text-[13px] tabular-nums ${
                  e.ours ? "text-zinc-900" : "text-zinc-500"
                }`}
              >
                {e.hours.toLocaleString()}
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
                    {e.hours.toLocaleString()} h · {e.year}
                  </div>
                  <div className="font-mono text-[10px] text-zinc-400">
                    {e.capture} · {e.license}
                    {e.narrowband ? " · telephone band" : ""}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="space-y-1.5 border-t border-zinc-100 px-5 py-3.5">
        <p className="text-[12.5px] leading-5 text-zinc-500">{note}</p>
        <p className="text-[11.5px] leading-5 text-zinc-400">{source}</p>
      </div>
    </Card>
  );
}

function Key({ label, hatched }: { label: string; hatched: boolean }) {
  return (
    <span className="flex items-center gap-1.5">
      <span
        aria-hidden
        className="h-2.5 w-4 rounded-[1px]"
        style={{
          background: hatched
            ? `repeating-linear-gradient(135deg, ${INK} 0 2px, transparent 2px 5px)`
            : INK,
          boxShadow: hatched ? `inset 0 0 0 1px ${INK}33` : undefined,
        }}
      />
      <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-zinc-400">
        {label}
      </span>
    </span>
  );
}
