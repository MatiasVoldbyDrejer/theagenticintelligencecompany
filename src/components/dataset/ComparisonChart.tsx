"use client";

import { Fragment, useState } from "react";
import type { AccessClass, ComparisonEntry } from "@/lib/dataset";
import { Card, CardHeader } from "./Card";
import { ACCENT, INK } from "./colors";

/**
 * Delivered hours across comparable corpora, PARTITIONED BY WHAT IT COSTS AND
 * WHAT YOU MAY DO WITH IT.
 *
 * Sorted by hours alone, this chart argued against the sentence above it: the
 * longest bar is Fisher English, at twice our size, and the reason that does not
 * refute "largest" — it is behind a licence fee that bars commercial use — was
 * visible only on hover. Grouping puts the qualifying set first and leaves the
 * reader to check the claim by looking rather than by trusting.
 *
 * The scale stays shared across groups on purpose. Fisher's bar is still twice
 * as long as ours; the chart is not hiding that, it is saying what it costs.
 *
 * One measure, so no categorical palette: colour marks emphasis (this release)
 * and every bar is directly labelled, so identity is never carried by colour.
 * Telephone-band corpora are hatched rather than given a second hue — the
 * distinction is a property of the bar, and texture survives greyscale, print
 * and colour-vision deficiency where a second hue would not.
 */

const GROUPS: { access: AccessClass; label: string }[] = [
  { access: "free-commercial", label: "Free · commercial use permitted" },
  { access: "free-noncommercial", label: "Free · non-commercial only" },
  { access: "paid", label: "Paid licence" },
];
export default function ComparisonChart({
  entries,
  note,
}: {
  entries: ComparisonEntry[];
  note: string;
}) {
  const [hover, setHover] = useState<number | null>(null);

  const max = Math.max(...entries.map((e) => e.hours), 1);
  // Flattened back into one list so hover state stays a single index and the
  // row separators keep running the full height of the card.
  const rows = GROUPS.flatMap((g) => {
    const members = entries
      .filter((e) => e.access === g.access)
      .sort((a, b) => b.hours - a.hours);
    return members.map((entry, i) => ({ entry, heading: i === 0 ? g.label : null }));
  });

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
        {rows.map(({ entry: e, heading }, i) => {
          const on = hover === i;
          const fill = e.ours ? ACCENT : INK;
          const width = Math.max((e.hours / max) * 100, 1.5);
          return (
            <Fragment key={e.name}>
              {heading && (
                <div
                  className={`font-mono text-[10px] uppercase tracking-[0.12em] text-zinc-400 ${
                    i === 0 ? "pb-2.5" : "pt-5 pb-2.5"
                  }`}
                >
                  {heading}
                </div>
              )}
            <div
              tabIndex={0}
              onPointerEnter={() => setHover(i)}
              onFocus={() => setHover(i)}
              onBlur={() => setHover(null)}
              aria-label={`${e.name}: ${e.hours.toLocaleString()} hours, ${e.year}, ${e.capture}, ${e.license}`}
              className={`relative flex items-center gap-4 py-2.5 outline-none ${
                i === rows.length - 1 || rows[i + 1]?.heading
                  ? ""
                  : "border-b border-zinc-100"
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
            </Fragment>
          );
        })}
      </div>

      <div className="border-t border-zinc-100 px-5 py-3.5">
        <p className="text-[12.5px] leading-5 text-zinc-700">{note}</p>
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
