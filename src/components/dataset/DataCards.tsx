import type { DatasetSnapshot } from "@/lib/dataset";
import BarDistribution from "./BarDistribution";
import HistogramChart from "./HistogramChart";
import { Section, VocabularyCard } from "./Sections";

export default function DataCards({ data }: { data: DatasetSnapshot["data"] }) {
  return (
    <Section
      id="conversation-statistics"
      title="Conversation statistics"
      intro="Per-conversation properties. Relationship is self-reported by the speaker who invited their partner and ships as meta.json:relationship. Language is the BCP-47 tag assigned to the conversation. Word counts are token counts over the delivered ASR transcripts, both speakers combined."
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
