/**
 * The type scale for the dataset pages. TWO families only — Geist Sans for
 * prose, Geist Mono for every number — on one warm-grey ink scale:
 *   zinc-900 primary · zinc-700 body · zinc-500 muted · zinc-400 faint
 */
export const t = {
  sectionTitle: "text-2xl font-normal text-zinc-900",

  /** Card sub-heading. Medium, NOT semibold — a small card title must never
   *  look heavier than the larger section titles above it. */
  cardTitle: "text-sm font-medium text-zinc-900",

  statValue:
    "font-mono text-2xl font-medium leading-none tabular-nums text-zinc-900",

  /** The ONE tracked-uppercase label style on this surface. */
  eyebrow:
    "font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-zinc-400",

  sectionIntro: "text-sm leading-6 text-zinc-700",
} as const;
