import type { DatasetSnapshot, Prose } from "@/lib/dataset";
import { Card } from "./Card";
import UseIconMark from "./UseIcons";
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

/** Numbered prose blocks in filled cards. */
export function ProseGrid({ items, numbered }: { items: Prose[]; numbered?: boolean }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {items.map((p, i) => (
        <Card key={p.title} className="p-5">
          <div className="flex items-baseline gap-2.5">
            {numbered && (
              <span className="font-mono text-[11px] tabular-nums text-zinc-700">
                {String(i + 1).padStart(2, "0")}
              </span>
            )}
            <h3 className="text-sm font-medium text-zinc-900">{p.title}</h3>
          </div>
          <p className="mt-2 text-[13px] leading-6 text-zinc-700">{p.body}</p>
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
              className={`flex items-start gap-3 py-3 text-[13.5px] leading-6 text-zinc-700 ${
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
 * Prose as columns on the canvas, ruled at the top.
 *
 * Deliberately not the card grid: this sits below one, and a second grid of
 * filled cards would read as more of the same list rather than a different kind
 * of statement. No fill, no border box, no ordinals — a glyph opens each column.
 */
export function IconColumns({ items }: { items: Prose[] }) {
  return (
    <div className="grid grid-cols-1 gap-x-10 gap-y-8 md:grid-cols-3">
      {items.map((p) => (
        <div key={p.title}>
          {p.icon && <UseIconMark name={p.icon} />}
          <h3 className="mt-3.5 text-[15px] font-medium leading-snug text-zinc-900">{p.title}</h3>
          <p className="mt-1.5 text-[13px] leading-6 text-zinc-700">{p.body}</p>
        </div>
      ))}
    </div>
  );
}
