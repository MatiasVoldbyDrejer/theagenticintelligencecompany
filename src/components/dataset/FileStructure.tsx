import CopyButton from "./CopyButton";
import { t } from "./type";

export default function FileStructure({ tree }: { tree: string }) {
  return (
    <section id="files" className="scroll-mt-24 space-y-4">
      <h2 className={t.sectionTitle}>File structure</h2>
      <p className={t.sectionIntro}>
        The layout every archive follows. Conversation directories are flat and self-contained: each holds both audio tracks, both transcripts, per-speaker metadata and per-conversation metrics, so any subset can be taken and used without the rest.
      </p>

      <div className="overflow-hidden rounded-sm border border-zinc-800 bg-zinc-950 text-zinc-100">
        <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-2">
          <span className="font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-zinc-500">
            text
          </span>
          <CopyButton text={tree} />
        </div>
        <pre className="overflow-x-auto px-4 py-4 font-mono text-[13px] leading-6">{tree}</pre>
      </div>
    </section>
  );
}
