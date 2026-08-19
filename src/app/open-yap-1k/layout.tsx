import type { ReactNode } from "react";

/**
 * These pages sit on the vendor portal's bone rather than the essay's paper.
 *
 * The surface has to be set here rather than on the page's own wrapper: the
 * footer is a sibling of the page, not a descendant, and the two tones are
 * close enough that a mismatch reads as a seam rather than as an obvious error.
 * Painting it once, on the root, also leaves the grain intact across the whole
 * route - see `.dataset` in globals.css, which deliberately has no background.
 *
 * Must stay in step with `--color-bg` inside `.dataset`.
 *
 * A `:root:has(.dataset)` rule in the stylesheet would be the same idea without
 * the tag, but Lightning CSS drops it at the configured browser targets.
 */
export default function OpenReleaseLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <style>{":root{--color-paper:#f7f7f4}"}</style>
      {children}
    </>
  );
}
