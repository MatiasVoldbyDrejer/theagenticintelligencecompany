import type { OverviewRow } from "@/lib/dataset";
import { t } from "./type";

export default function DataOverview({
  description,
  rows,
}: {
  description: string;
  rows: OverviewRow[];
}) {
  return (
    <section id="overview" className="scroll-mt-24 space-y-4">
      <h2 className={t.sectionTitle}>What is in the release</h2>
      <p className="max-w-3xl text-[15px] leading-7 text-zinc-600">{description}</p>

      <div className="overflow-hidden rounded-sm border border-zinc-200 bg-white">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-zinc-200">
              <th className={`w-[260px] px-5 py-3 text-left ${t.eyebrow}`}>Detail</th>
              <th className={`px-5 py-3 text-left ${t.eyebrow}`}>Value</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              // Keyed by index: rows are free-form, so `detail` is neither
              // unique nor guaranteed present, and the table never reorders.
              <tr key={i} className={i > 0 ? "border-t border-zinc-100" : undefined}>
                <td className="px-5 py-3 align-top text-zinc-500">{row.detail}</td>
                <td className="px-5 py-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Value chip={row.chip}>{row.value}</Value>
                    {row.valueExtra && (
                      <>
                        <span className="text-xs text-zinc-400">to</span>
                        <Value chip={row.chip}>{row.valueExtra}</Value>
                      </>
                    )}
                    {row.suffix && (
                      <span className="font-mono text-[13px] text-zinc-700">{row.suffix}</span>
                    )}
                    {row.note && <span className="text-xs text-zinc-400">{row.note}</span>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Value({ chip, children }: { chip?: boolean; children: string }) {
  if (!chip) return <span className="text-zinc-900">{children}</span>;
  return (
    <span className="rounded-sm border border-zinc-200 bg-zinc-50 px-1.5 py-0.5 font-mono text-[12.5px] tabular-nums text-zinc-800">
      {children}
    </span>
  );
}
