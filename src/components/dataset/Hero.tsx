import Link from "next/link";
import type { DatasetSnapshot } from "@/lib/dataset";
import SampleClips from "./SampleClips";
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
          className="rounded-md border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-100"
        >
          {dataset.license.name}
        </Link>
        <span className="text-sm text-zinc-400">Free for commercial and research use</span>
      </div>

      {dataset.samples.length > 0 && <SampleClips samples={dataset.samples} />}
    </section>
  );
}

