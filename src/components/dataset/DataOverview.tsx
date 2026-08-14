import type { OverviewRow } from "@/lib/dataset";
import { Card, Chip } from "./Card";
import { Section } from "./Sections";

export default function DataOverview({ rows }: { rows: OverviewRow[] }) {
  return (
    <Section
      id="detail"
      title="Specification"
      intro="Delivered format and the parameters it was produced under."
    >
      <Card className="overflow-hidden">
        <table className="w-full border-collapse text-sm">
          <tbody>
            {rows.map((row, i) => (
              // Keyed by index: rows are free-form, so `detail` is neither
              // unique nor guaranteed present, and the table never reorders.
              <tr key={i} className={i > 0 ? "border-t border-zinc-100" : undefined}>
                <td className="w-[280px] px-5 py-3 align-top text-zinc-500">{row.detail}</td>
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
      </Card>
    </Section>
  );
}

function Value({ chip, children }: { chip?: boolean; children: string }) {
  if (!chip) return <span className="text-zinc-900">{children}</span>;
  return <Chip>{children}</Chip>;
}
