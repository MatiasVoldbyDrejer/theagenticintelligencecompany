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
      id="speaker-demographics"
      title="Speaker demographics"
      intro="All fields self-reported at registration, before any recording, and never inferred from audio. Counts are speakers, not hours or conversations; the contribution chart at the end shows how delivered hours distribute across them."
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
        {/* Odd card out: full width rather than left alone beside a gap, and it
            has the longest tail so the extra room is not wasted. */}
        <div className="lg:col-span-2">
          <BarDistribution
            title="Childhood country"
            data={population.childhoodCountry}
            maxRows={10}
          />
        </div>
      </div>

      <div className="pt-6">
        <SpeakerContribution minutes={speakerMinutes} />
      </div>
    </Section>
  );
}
