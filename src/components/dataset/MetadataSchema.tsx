import type { MetadataField } from "@/lib/dataset";
import CopyButton from "./CopyButton";
import { t } from "./type";

/**
 * Group fields under the archive file they ship in, preserving first-seen order
 * for both the files and the fields within each — so the panel reads top to
 * bottom exactly like the file tree. This is what ties a claimed field to the
 * file a recipient will actually find it in.
 */
function groupByFile(fields: MetadataField[]): { file: string; fields: MetadataField[] }[] {
  const groups: { file: string; fields: MetadataField[] }[] = [];
  const byFile = new Map<string, MetadataField[]>();
  for (const f of fields) {
    let bucket = byFile.get(f.file);
    if (!bucket) {
      bucket = [];
      byFile.set(f.file, bucket);
      groups.push({ file: f.file, fields: bucket });
    }
    bucket.push(f);
  }
  return groups;
}

export default function MetadataSchema({ fields }: { fields: MetadataField[] }) {
  const groups = groupByFile(fields);
  const asText = groups
    .map((g) => `${g.file}\n` + g.fields.map((f) => `  ${f.field}: ${f.description}`).join("\n"))
    .join("\n\n");

  return (
    <section id="metadata" className="scroll-mt-24 space-y-4">
      <h2 className={t.sectionTitle}>Metadata</h2>
      <p className={t.sectionIntro}>
        What ships alongside the audio, and which file each field lives in.
      </p>

      <div className="overflow-hidden rounded-sm border border-zinc-800 bg-zinc-900 text-zinc-100">
        <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-2">
          <span className="font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-zinc-500">
            Schema
          </span>
          <CopyButton text={asText} />
        </div>
        <pre className="overflow-x-auto px-4 py-4 font-mono text-[12.5px] leading-6">
          {groups.map((g, i) => (
            <div key={g.file} className={i > 0 ? "mt-4" : undefined}>
              {/* The real archive path this block documents — a recipient maps
                  each field to the exact file it ships in. */}
              <div className="text-emerald-300/90">{g.file}</div>
              {g.fields.map((f) => (
                <div key={f.field} className="whitespace-pre-wrap">
                  <span className="text-zinc-50">{"  "}{f.field}</span>
                  <span className="text-zinc-500">: {f.description}</span>
                </div>
              ))}
            </div>
          ))}
        </pre>
      </div>
    </section>
  );
}
