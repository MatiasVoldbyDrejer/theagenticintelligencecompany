import Link from "next/link";
import type { DatasetSnapshot } from "@/lib/dataset";
import SamplePlayer from "./SamplePlayer";
import { Card } from "./Card";
import { t } from "./type";

export default function Hero({ dataset }: { dataset: DatasetSnapshot }) {
  return (
    <section className="space-y-8">
      <div className="space-y-5">
        <span className={t.eyebrow}>Open release</span>
        <h1 className="max-w-4xl text-balance text-[44px] font-normal leading-[1.03] tracking-[-0.035em] text-zinc-900 sm:text-[56px]">
          {dataset.name}
        </h1>
        <p className="max-w-2xl text-lg leading-[1.6] text-zinc-500">{dataset.tagline}</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Link
          href="/dataset/request"
          className="rounded-md bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
        >
          Request access
        </Link>
        <Link
          href="/dataset/license"
          className="rounded-md border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-50"
        >
          {dataset.license.name}
        </Link>
        <span className="text-sm text-zinc-400">Free for commercial and research use</span>
      </div>

      {dataset.samples.length > 0 ? (
        <SamplePlayer samples={dataset.samples} />
      ) : (
        <SamplePlaceholder />
      )}
    </section>
  );
}

/** Holds the player's place until clips are baked into the snapshot. */
function SamplePlaceholder() {
  return (
    <Card>
      <div className="flex items-center gap-5 px-5 py-6">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-zinc-200 text-zinc-300">
          <svg viewBox="0 0 24 24" fill="currentColor" className="ml-0.5 h-4 w-4">
            <path d="M7 4.5v15l13-7.5z" />
          </svg>
        </div>
        <div className="min-w-0 flex-1 space-y-2" aria-hidden>
          {[0, 1].map((row) => (
            <div key={row} className="flex items-center gap-3">
              <span className="w-16 shrink-0 font-mono text-[10px] uppercase tracking-[0.1em] text-zinc-300">
                {row === 0 ? "Speaker A" : "Speaker B"}
              </span>
              <div className="h-9 flex-1 rounded-sm bg-zinc-50" />
            </div>
          ))}
        </div>
        <span className="w-40 shrink-0 text-right text-[12.5px] leading-5 text-zinc-400">
          Sample clips land here
        </span>
      </div>
    </Card>
  );
}
