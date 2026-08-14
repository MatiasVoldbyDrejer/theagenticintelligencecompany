import type { DatasetSnapshot } from "@/lib/dataset";
import BarDistribution from "./BarDistribution";
import HistogramChart from "./HistogramChart";
import { Section, VocabularyCard } from "./Sections";

export default function DataCards({ data }: { data: DatasetSnapshot["data"] }) {
  return (
    <Section
      id="data"
      title="The conversations"
      intro="What the recordings are, rather than how they sound. Relationship is self-reported by the speaker who invited their partner; language is the BCP-47 tag on the conversation; word counts come from the delivered transcripts."
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <BarDistribution
          title="Relationship between speakers"
          data={data.relationship}
          unit="conversations"
        />
        <BarDistribution title="Spoken language" data={data.language} unit="conversations" />
        <HistogramChart
          metric={data.conversationLength}
          title="Conversation length"
          height="h-32"
          aside={<span className="font-mono text-[11px] text-zinc-400">minutes</span>}
        />
        <HistogramChart
          metric={data.wordsPerConversation}
          title="Words per conversation"
          height="h-32"
          format="compact"
          aside={<span className="font-mono text-[11px] text-zinc-400">words</span>}
        />
      </div>

      <div className="pt-2">
        <VocabularyCard vocabulary={data.vocabulary} />
      </div>
    </Section>
  );
}
