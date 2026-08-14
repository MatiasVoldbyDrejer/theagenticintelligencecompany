import type { Metadata } from "next";
import snapshot from "@/data/open-release.json";
import type { DatasetSnapshot } from "@/lib/dataset";
import DatasetFrame from "@/components/dataset/DatasetFrame";
import { t } from "@/components/dataset/type";
import RequestForm from "./RequestForm";

const dataset = snapshot as DatasetSnapshot;

export const metadata: Metadata = {
  title: `Request access to ${dataset.name}`,
  description: `Request free access to ${dataset.name} for commercial or research use.`,
  alternates: { canonical: "/open-yap-1k/request" },
  robots: { index: false, follow: true },
};

export default function RequestAccessPage() {
  return (
    <DatasetFrame datasetName={dataset.name} showCta={false}>
      <div className="max-w-2xl space-y-8">
        <div className="space-y-4">
          <h1 className="text-[40px] font-normal leading-[1.05] tracking-[-0.03em] text-zinc-900">
            Request access
          </h1>
          <p className={t.sectionIntro}>
            {dataset.name} is free for commercial and research use. We read every request and
            reply either way, usually within a few working days.
          </p>
        </div>
        <RequestForm />
      </div>
    </DatasetFrame>
  );
}
