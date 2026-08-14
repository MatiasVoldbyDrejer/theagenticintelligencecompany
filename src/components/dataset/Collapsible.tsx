"use client";

import { useState, type ReactNode } from "react";
import { t } from "./type";

/**
 * A section that stays shut until asked for.
 *
 * `<details>` would be less code but hides its content from in-page search and
 * from anchor links; this keeps the toggle explicit so the summary line can
 * carry the reason to open it.
 */
export default function Collapsible({
  title,
  summary,
  openLabel = "Show",
  closeLabel = "Hide",
  children,
}: {
  title: string;
  summary: string;
  openLabel?: string;
  closeLabel?: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 className={t.sectionTitle}>{title}</h2>
        <button
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="rounded-sm border border-zinc-300 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-600 transition-colors hover:border-zinc-400 hover:text-zinc-900"
        >
          {open ? closeLabel : openLabel}
        </button>
      </div>
      <p className={`mt-3 ${t.sectionIntro}`}>{summary}</p>
      {open && <div className="mt-6">{children}</div>}
    </div>
  );
}
