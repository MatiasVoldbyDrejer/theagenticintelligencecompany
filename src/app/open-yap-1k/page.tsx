import type { Metadata } from "next";
import snapshot from "@/data/open-release.json";
import type { DatasetSnapshot } from "@/lib/dataset";
import Access from "@/components/dataset/Access";
import AudioMetrics from "@/components/dataset/AudioMetrics";
import ComparisonChart from "@/components/dataset/ComparisonChart";
import DataCards from "@/components/dataset/DataCards";
import DataOverview from "@/components/dataset/DataOverview";
import DatasetFrame from "@/components/dataset/DatasetFrame";
import FileStructure from "@/components/dataset/FileStructure";
import Hero from "@/components/dataset/Hero";
import MetadataSchema from "@/components/dataset/MetadataSchema";
import Population from "@/components/dataset/Population";
import { ProseGrid, Provenance, RuledColumns, Section } from "@/components/dataset/Sections";
import StatsRow from "@/components/dataset/StatsRow";

const dataset = snapshot as DatasetSnapshot;

export const metadata: Metadata = {
  title: `${dataset.name} — The Agentic Data Company`,
  description: dataset.tagline,
  alternates: { canonical: "/open-yap-1k" },
  openGraph: {
    title: `${dataset.name} — The Agentic Data Company`,
    description: dataset.tagline,
    url: "/open-yap-1k",
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

      <Population population={dataset.population} speakerMinutes={dataset.speakerMinutes} />

      <DataCards data={dataset.data} />

      <Section
        id="quality-assurance"
        title="Quality assurance"
        intro="Three checks run before a conversation is eligible for delivery. A conversation that fails any of them is excluded from the release rather than shipped flagged."
      >
        <ProseGrid items={dataset.quality} numbered />
      </Section>

      <Section id="intended-use" title="Intended use">
        <RuledColumns items={dataset.useCases} />
      </Section>

      <Section
        id="comparison"
        title="Comparable corpora"
        intro="Where this release sits among English conversational speech corpora by documented hours. Entries differ in recording structure and licence; both are given per row."
      >
        <ComparisonChart
          entries={dataset.comparison.datasets}
          note={dataset.comparison.note}
        />
      </Section>

      <Provenance provenance={dataset.provenance} />

      <MetadataSchema fields={dataset.metadataFields} />

      <FileStructure tree={dataset.fileStructure} />

      <AudioMetrics
        groups={dataset.audio.groups}
        conformance={dataset.audio.conformance}
        note={dataset.audio.note}
      />

      <Access license={dataset.license} />
    </DatasetFrame>
  );
}
