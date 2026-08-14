import type { DatasetSnapshot, Prose } from "@/lib/dataset";
import { Card } from "./Card";
import { t } from "./type";

/** Section wrapper: anchor, heading, optional intro. */
export function Section({
  id,
  title,
  intro,
  children,
}: {
  id: string;
  title: string;
  intro?: string;
  children?: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 space-y-4">
      <h2 className={t.sectionTitle}>{title}</h2>
      {intro &&
        intro.split("\n\n").map((para) => (
          <p key={para.slice(0, 40)} className={t.sectionIntro}>
            {para}
          </p>
        ))}
      {children}
    </section>
  );
}

/** Numbered prose blocks — capture method, QA, intended use. */
export function ProseGrid({ items, numbered }: { items: Prose[]; numbered?: boolean }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {items.map((p, i) => (
        <Card key={p.title} className="p-5">
          <div className="flex items-baseline gap-2.5">
            {numbered && (
              <span className="font-mono text-[11px] tabular-nums text-zinc-300">
                {String(i + 1).padStart(2, "0")}
              </span>
            )}
            <h3 className="text-sm font-medium text-zinc-900">{p.title}</h3>
          </div>
          <p className="mt-2 text-[13px] leading-6 text-zinc-500">{p.body}</p>
        </Card>
      ))}
    </div>
  );
}

export function Provenance({ provenance }: { provenance: DatasetSnapshot["provenance"] }) {
  return (
    <Section id="provenance" title="Provenance" intro={provenance.summary}>
      <Card>
        <ul className="px-5 py-2">
          {provenance.points.map((point, i) => (
            <li
              key={point}
              className={`flex items-start gap-3 py-3 text-[13.5px] leading-6 text-zinc-600 ${
                i === provenance.points.length - 1 ? "" : "border-b border-zinc-100"
              }`}
            >
              <span aria-hidden className="mt-3 h-px w-3 shrink-0 bg-zinc-300" />
              {point}
            </li>
          ))}
        </ul>
      </Card>
    </Section>
  );
}

/** Four figures about the corpus vocabulary — scalars, so no chart. */
export function VocabularyCard({
  vocabulary,
}: {
  vocabulary: DatasetSnapshot["data"]["vocabulary"];
}) {
  const figures = [
    { label: "Unique words", value: vocabulary.uniqueWords.toLocaleString() },
    { label: "Total words", value: `${(vocabulary.totalWords / 1e6).toFixed(1)}M` },
    { label: "Type-token ratio", value: vocabulary.typeTokenRatio.toFixed(4) },
    { label: "Speaking rate", value: `${vocabulary.wordsPerMinute} wpm` },
  ];
  return (
    <Card>
      <div className="grid grid-cols-2 divide-x divide-y divide-zinc-100">
        {figures.map((f) => (
          <div key={f.label} className="flex flex-col gap-1.5 px-5 py-5">
            <span className={t.eyebrow}>{f.label}</span>
            <span className="font-mono text-xl font-medium leading-none tabular-nums text-zinc-900">
              {f.value}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}

/**
 * What the corpus does not do.
 *
 * Numbered and given the same weight as every other section: a reader
 * evaluating a corpus needs this to decide whether it fits, and finding it out
 * later costs more than reading it here.
 */
export function Limitations({ limitations }: { limitations: string[] }) {
  return (
    <Section
      id="limitations"
      title="Limitations"
      intro="Known constraints on what this corpus can support, and what has not been verified."
    >
      <Card>
        <ol className="px-5 py-2">
          {limitations.map((item, i) => (
            <li
              key={item.slice(0, 40)}
              className={`flex items-start gap-4 py-3.5 ${
                i === limitations.length - 1 ? "" : "border-b border-zinc-100"
              }`}
            >
              <span className="mt-0.5 shrink-0 font-mono text-[11px] tabular-nums text-zinc-300">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-[13.5px] leading-6 text-zinc-600">{item}</span>
            </li>
          ))}
        </ol>
      </Card>
    </Section>
  );
}
