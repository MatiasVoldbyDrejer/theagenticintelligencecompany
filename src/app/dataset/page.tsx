import type { Metadata } from "next";
import snapshot from "@/data/open-release.json";
import type { DatasetSnapshot } from "@/lib/dataset";
import Access from "@/components/dataset/Access";
import AudioMetrics from "@/components/dataset/AudioMetrics";
import Conformance from "@/components/dataset/Conformance";
import DataOverview from "@/components/dataset/DataOverview";
import DatasetFrame from "@/components/dataset/DatasetFrame";
import FileStructure from "@/components/dataset/FileStructure";
import Hero from "@/components/dataset/Hero";
import MetadataSchema from "@/components/dataset/MetadataSchema";
import Population from "@/components/dataset/Population";
import StatsRow from "@/components/dataset/StatsRow";

const dataset = snapshot as DatasetSnapshot;

export const metadata: Metadata = {
  title: `${dataset.name} — The Agentic Data Company`,
  description: dataset.tagline,
  alternates: { canonical: "/dataset" },
  openGraph: {
    title: `${dataset.name} — The Agentic Data Company`,
    description: dataset.tagline,
    url: "/dataset",
    siteName: "The Agentic Data Company",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${dataset.name} — The Agentic Data Company`,
    description: dataset.tagline,
  },
};

export default function DatasetPage() {
  return (
    <DatasetFrame datasetName={dataset.name} showRail>
      <Hero dataset={dataset} />
      <StatsRow stats={dataset.stats} />
      <DataOverview description={dataset.description} rows={dataset.overview} />
      <AudioMetrics groups={dataset.audio.groups} />
      <Conformance checks={dataset.audio.conformance} />
      <Population
        demographics={dataset.demographics}
        speakerMinutes={dataset.speakerMinutes}
      />
      <MetadataSchema fields={dataset.metadataFields} />
      <FileStructure tree={dataset.fileStructure} />
      <Access license={dataset.license} />
    </DatasetFrame>
  );
}
