import Link from "next/link";
import type { DatasetSnapshot } from "@/lib/dataset";
import SampleClips from "./SampleClips";

/**
 * Two stacked halves reading as ONE card, not a card overlapping an image.
 *
 * The painterly wash is the background of the image half ALONE, so it never
 * sits behind the solid panel and never bleeds through a rounded corner as a
 * coloured fringe. The hairline stroke belongs to the solid box only, and only
 * on its top and sides — no bottom edge, so it flows straight into the image.
 * The image half is drawn borderless and full-bleed, its edges flush with the
 * box's side strokes so the two silhouettes align.
 */
export default function Hero({ dataset }: { dataset: DatasetSnapshot }) {
  const hasSamples = dataset.samples.length > 0;

  return (
    <section className="relative rounded-sm">
      <div
        className={`border-black/[0.06] bg-[var(--color-card)] px-6 py-10 sm:px-12 sm:py-12 ${
          hasSamples ? "rounded-t-sm border-x border-t" : "rounded-sm border"
        }`}
      >
        <div className="max-w-3xl">
          <div className="flex items-center gap-4">
            <h1 className="min-w-0 text-balance text-[33px] font-medium leading-[1.05] tracking-[-0.03em] text-zinc-900">
              {dataset.name}
            </h1>
            <div className="shrink-0">
              <Link
                href="/yap-1k/request"
                className="inline-flex rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
              >
                Request access
              </Link>
            </div>
          </div>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-zinc-500">{dataset.tagline}</p>
          <div className="mt-5 flex flex-wrap items-center gap-3 text-sm">
            <Link
              href="/yap-1k/license"
              className="text-zinc-700 underline decoration-zinc-300 underline-offset-4 transition-colors hover:text-zinc-900"
            >
              {dataset.license.name}
            </Link>
            <span className="text-zinc-400">Free for commercial and research use</span>
          </div>
        </div>
      </div>

      {hasSamples && (
        <div className="ds-hero overflow-hidden rounded-b-sm px-6 py-10 sm:px-12 sm:py-12">
          <div className="max-w-3xl">
            <SampleClips samples={dataset.samples} />
          </div>
        </div>
      )}
    </section>
  );
}
