import type { Metadata } from "next";
import snapshot from "@/data/open-release.json";
import type { DatasetSnapshot } from "@/lib/dataset";
import DatasetFrame from "@/components/dataset/DatasetFrame";
import { t } from "@/components/dataset/type";
import { LICENSE_NAME, LICENSE_TEXT, LICENSE_VERSION } from "@/lib/license";

const dataset = snapshot as DatasetSnapshot;

export const metadata: Metadata = {
  title: `${LICENSE_NAME} — ${dataset.name}`,
  description: `Terms governing access to ${dataset.name}.`,
  alternates: { canonical: "/open-yap-1k/license" },
};

/**
 * The agreement lives at a stable URL and is rendered verbatim from the same
 * constant the intake route hashes, so an acceptance record and the page a
 * requester read can never drift apart.
 */
export default function LicensePage() {
  return (
    <DatasetFrame datasetName={dataset.name}>
      <div className="max-w-3xl space-y-6">
        <div className="space-y-3">
          <span className={t.eyebrow}>Version {LICENSE_VERSION}</span>
          <h1 className="text-[40px] font-normal leading-[1.05] tracking-[-0.03em] text-zinc-900">
            {LICENSE_NAME}
          </h1>
        </div>

        <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-[13px] leading-6 text-amber-900">
          Placeholder text. These are not the final terms and carry no legal effect.
        </div>

        <div className="overflow-hidden rounded-sm border border-zinc-200 bg-white">
          <pre className="overflow-x-auto px-6 py-6 font-mono text-[13px] leading-6 text-zinc-700">
            {LICENSE_TEXT}
          </pre>
        </div>
      </div>
    </DatasetFrame>
  );
}
