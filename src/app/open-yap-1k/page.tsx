import type { Metadata } from "next";
import { dataset } from "@/data/snapshot";
import Access from "@/components/dataset/Access";
import AudioMetrics from "@/components/dataset/AudioMetrics";
import Citation from "@/components/dataset/Citation";
import ComparisonChart from "@/components/dataset/ComparisonChart";
import DataCards from "@/components/dataset/DataCards";
import DataOverview from "@/components/dataset/DataOverview";
import DatasetFrame from "@/components/dataset/DatasetFrame";
import FileStructure from "@/components/dataset/FileStructure";
import Hero from "@/components/dataset/Hero";
import MetadataSchema from "@/components/dataset/MetadataSchema";
import Population from "@/components/dataset/Population";
import { ProseGrid, Provenance, IconColumns, Section } from "@/components/dataset/Sections";
import StatsRow from "@/components/dataset/StatsRow";


/**
 * The claim is deliberately narrow - publicly available, licensed for commercial
 * use, natural two-speaker English - because that is the form a reader can check
 * against the table directly beneath it. Larger corpora exist and each fails one
 * of those three; the grounds are in the chart's own note.
 */
const COMPARISON_INTRO = `${dataset.name} is the largest publicly available dataset of natural two-speaker English conversation, licensed for commercial use. Scientific progress is a collective effort, and we believe we’ll most effectively advance it by collaborating with the wider community of researchers and builders.`;

export const metadata: Metadata = {
  title: `${dataset.name} - The Agentic Data Company`,
  description: dataset.tagline,
  alternates: { canonical: "/open-yap-1k" },
  openGraph: {
    title: `${dataset.name} - The Agentic Data Company`,
    description: dataset.tagline,
    url: "/open-yap-1k",
    siteName: "The Agentic Data Company",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${dataset.name} - The Agentic Data Company`,
    description: dataset.tagline,
  },
};

export default function DatasetPage() {
  return (
    <DatasetFrame datasetName={dataset.name} showRail>
      <Hero dataset={dataset} />

      <StatsRow stats={dataset.stats} />

      <DataOverview description={dataset.description} rows={dataset.overview} />

      <Section id="intended-use" title="Intended use">
        <IconColumns items={dataset.useCases} />
      </Section>

      <Population population={dataset.population} speakerMinutes={dataset.speakerMinutes} />

      <DataCards data={dataset.data} />

      <AudioMetrics
        groups={dataset.audio.groups}
        conformance={dataset.audio.conformance}
        note={dataset.audio.note}
      />

      <Section
        id="quality-assurance"
        title="Quality assurance"
        intro="Three checks run before a conversation is eligible for delivery. A conversation that fails any of them is excluded from the release rather than shipped flagged."
      >
        <ProseGrid items={dataset.quality} numbered />
      </Section>

      <Provenance provenance={dataset.provenance} />

      <MetadataSchema fields={dataset.metadataFields} />

      <FileStructure tree={dataset.fileStructure} />

      <Section id="comparison" title="Comparable datasets" intro={COMPARISON_INTRO}>
        <ComparisonChart
          entries={dataset.comparison.datasets}
          note={dataset.comparison.note}
        />
      </Section>

      <Citation citation={dataset.citation} />

      <Access />
    </DatasetFrame>
  );
}
