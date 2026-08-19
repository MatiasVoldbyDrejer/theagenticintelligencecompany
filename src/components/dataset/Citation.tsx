import type { DatasetSnapshot } from "@/lib/dataset";
import CopyButton from "./CopyButton";
import { Card } from "./Card";
import { Section } from "./Sections";
import { t } from "./type";

/**
 * The reference a paper should carry, in both forms a reader needs: the prose
 * line for a reference list, and BibTeX to paste. The agreement asks for
 * attribution, so the exact string it asks for belongs on the page rather than
 * left to each author to compose.
 */
export default function Citation({ citation }: { citation: DatasetSnapshot["citation"] }) {
  return (
    <Section
      id="citation"
      title="Citation"
      intro="Published work using this dataset should cite it as below. The version field identifies which build was used; it changes when a rebuild changes what recipients receive."
    >
      <Card className="overflow-hidden">
        <div className="border-b border-zinc-100 px-5 py-4">
          <div className={t.eyebrow}>Reference</div>
          <p className="mt-2 text-[13.5px] leading-6 text-zinc-700">{citation.text}</p>
        </div>
      </Card>

      <div className="overflow-hidden rounded-sm border border-zinc-800 bg-zinc-950 text-zinc-100">
        <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-2">
          <span className="font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-zinc-500">
            BibTeX
          </span>
          <CopyButton text={citation.bibtex} />
        </div>
        <pre className="overflow-x-auto px-4 py-4 font-mono text-[13px] leading-6">
          {citation.bibtex}
        </pre>
      </div>
    </Section>
  );
}
