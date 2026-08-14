import type { DatasetSnapshot } from "@/lib/dataset";
import BarDistribution from "./BarDistribution";
import SpeakerContribution from "./SpeakerContribution";
import { Section } from "./Sections";

const AGE_ORDER = ["Under 25", "25–34", "35–44", "45–54", "55+"];
const EDUCATION_ORDER = ["Primary", "Secondary", "Vocational", "Bachelor", "Master", "PhD"];

export default function Population({
  population,
  speakerMinutes,
}: {
  population: DatasetSnapshot["population"];
  speakerMinutes: number[];
}) {
  return (
    <Section
      id="population"
      title="Population"
      intro="Self-reported at sign-up, before any recording, and never inferred from the audio. Counts are speakers — the contribution chart at the end shows how the hours themselves are spread across them."
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <BarDistribution title="Gender" data={population.gender} />
        <BarDistribution title="Age" data={population.age} orderedKeys={AGE_ORDER} />
        <BarDistribution
          title="Education"
          data={population.education}
          orderedKeys={EDUCATION_ORDER}
        />
        <BarDistribution title="Native language" data={population.nativeLanguage} maxRows={8} />
        <BarDistribution title="Birth country" data={population.birthCountry} maxRows={9} />
      </div>

      <div className="pt-6">
        <SpeakerContribution minutes={speakerMinutes} />
      </div>
    </Section>
  );
}
