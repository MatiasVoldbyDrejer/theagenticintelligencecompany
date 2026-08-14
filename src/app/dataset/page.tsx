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
import { ProseGrid, Provenance, Section } from "@/components/dataset/Sections";
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

      <Section id="corpus" title="Corpus" intro={dataset.description} />

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

      <Section id="capture" title="Recording method" intro={dataset.captureMethod.summary}>
        <ProseGrid items={dataset.captureMethod.points} numbered />
      </Section>

      <DataOverview rows={dataset.overview} />

      <DataCards data={dataset.data} />

      <Population population={dataset.population} speakerMinutes={dataset.speakerMinutes} />

      <Section
        id="quality"
        title="Validation"
        intro="Three checks run before a conversation is eligible for delivery. A conversation that fails any of them is excluded from the release rather than shipped flagged."
      >
        <ProseGrid items={dataset.quality} numbered />
      </Section>

      <Section
        id="use-cases"
        title="Supported tasks"
        intro="Tasks the structure of this data supports, and the property of the recording that makes each one possible."
      >
        <ProseGrid items={dataset.useCases} />
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
