"use client";

import { useState, type ReactNode } from "react";
import type { Metric } from "@/lib/dataset";
import { Card, CardHeader } from "./Card";
import { t } from "./type";

const ACCENT = "#7c6bb0";

/**
 * A binned distribution as hoverable columns.
 *
 * Each bar is its own hit target and carries the range it covers, its count and
 * its share — the p5/p50/p95 strip underneath keeps the headline claim readable
 * without hovering at all.
 */
export default function HistogramChart({
  metric,
  title,
  aside,
  // A formatter function cannot cross the server/client boundary, so the axis
  // style is named rather than passed in.
  format = "plain",
  height = "h-40",
}: {
  metric: Metric;
  title: string;
  aside?: ReactNode;
  /** "compact" abbreviates thousands (1.2k) for large-magnitude axes. */
  format?: "plain" | "compact";
  height?: string;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const { bins, binMin, binMax, p50, decimals = 1 } = metric;

  const total = bins.reduce((a, b) => a + b, 0);
  const max = Math.max(...bins, 1);
  const step = (binMax - binMin) / bins.length;
  const edge = (v: number) =>
    format === "compact" && Math.abs(v) >= 1000
      ? `${(v / 1000).toFixed(1)}k`
      : String(Number(v.toFixed(decimals)));
  const medianPct = ((p50 - binMin) / (binMax - binMin)) * 100;

  return (
    <Card>
      <CardHeader title={title} aside={aside} />
      <div className="px-5 pb-4 pt-5">
        {/* Tooltip lane — reserved so nothing clips above the columns. */}
        <div className="relative mb-1 h-11">
          {hover !== null && (
            <div
              className="pointer-events-none absolute bottom-0 flex -translate-x-1/2 flex-col items-center whitespace-nowrap rounded-md border border-zinc-800 bg-zinc-900 px-2.5 py-1.5 text-center"
              style={{
                left: `${Math.min(92, Math.max(8, ((hover + 0.5) / bins.length) * 100))}%`,
              }}
            >
              <span className="font-mono text-[11px] tabular-nums text-zinc-50">
                {edge(binMin + hover * step)}–{edge(binMin + (hover + 1) * step)} {metric.unit}
              </span>
              <span className="font-mono text-[10px] tabular-nums text-zinc-400">
                {bins[hover].toLocaleString()} ·{" "}
                {total > 0 ? ((bins[hover] / total) * 100).toFixed(1) : "0.0"}%
              </span>
            </div>
          )}
        </div>

        <div className="relative">
          {[0.25, 0.5, 0.75].map((g) => (
            <div
              key={g}
              aria-hidden
              className="pointer-events-none absolute inset-x-0 h-px bg-zinc-100"
              style={{ bottom: `${g * 100}%` }}
            />
          ))}
          {/* Median caliper, drawn over the columns so it reads as a measurement
              laid across the shape rather than a bar of its own. */}
          <div
            aria-hidden
            className="pointer-events-none absolute top-0 z-10 h-full w-px"
            style={{ left: `${medianPct}%`, background: ACCENT }}
          />
          <div
            className={`relative flex ${height} items-end gap-[3px] border-b border-zinc-300`}
            onPointerLeave={() => setHover(null)}
          >
            {bins.map((count, i) => {
              const on = hover === i;
              return (
                <div
                  key={i}
                  tabIndex={0}
                  onPointerEnter={() => setHover(i)}
                  onFocus={() => setHover(i)}
                  onBlur={() => setHover(null)}
                  aria-label={`${edge(binMin + i * step)} to ${edge(binMin + (i + 1) * step)} ${metric.unit}: ${count}`}
                  className="flex h-full min-w-0 flex-1 items-end outline-none"
                >
                  <div
                    className="w-full rounded-t-[2px] transition-colors"
                    style={{
                      // A populated bin never disappears — a 2px stub still reads
                      // as "some", where 0 height would read as "none".
                      height: count === 0 ? 0 : `max(2px, ${(count / max) * 100}%)`,
                      background: on ? ACCENT : "#18181b",
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-1.5 flex justify-between font-mono text-[10px] tabular-nums text-zinc-400">
          <span>{edge(binMin)}</span>
          <span>
            {edge(binMax)} {metric.unit}
          </span>
        </div>

        <div className="mt-3 flex items-baseline gap-6 border-t border-zinc-100 pt-3">
          <Percentile label="p5" value={edge(metric.p5)} />
          <Percentile label="p50" value={edge(metric.p50)} strong />
          <Percentile label="p95" value={edge(metric.p95)} />
        </div>

        {metric.note && (
          <p className="mt-3 text-[12.5px] leading-5 text-zinc-400">{metric.note}</p>
        )}
      </div>
    </Card>
  );
}

function Percentile({
  label,
  value,
  strong,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div>
      <div className={t.eyebrow}>{label}</div>
      <div
        className={`mt-1 font-mono tabular-nums ${
          strong ? "text-lg text-zinc-900" : "text-sm text-zinc-500"
        }`}
      >
        {value}
      </div>
    </div>
  );
}
