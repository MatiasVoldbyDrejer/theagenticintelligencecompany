import type { DatasetSnapshot } from "@/lib/dataset";
import SamplePlayer from "./SamplePlayer";
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
        <a
          href="#access"
          className="rounded-sm bg-zinc-900 px-5 py-2.5 text-sm font-medium text-zinc-50 transition-colors hover:bg-zinc-700"
        >
          Request access
        </a>
        <a
          href="#access"
          className="rounded-sm border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-400 hover:text-zinc-900"
        >
          {dataset.license.name}
        </a>
        <span className="text-sm text-zinc-400">Free for commercial and research use</span>
      </div>

      {dataset.samples.length > 0 && <SamplePlayer samples={dataset.samples} />}
    </section>
  );
}
