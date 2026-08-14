import type { DatasetSnapshot } from "@/lib/dataset";
import { t } from "./type";

export default function StatsRow({ stats }: { stats: DatasetSnapshot["stats"] }) {
  const cards = [
    { label: "Hours of audio", value: stats.hours.toLocaleString() },
    { label: "Conversations", value: stats.conversations.toLocaleString() },
    { label: "Unique speakers", value: stats.speakers.toLocaleString() },
    { label: "Avg. duration", value: `${stats.averageDurationMinutes} min` },
  ];
  return (
    <div className="overflow-hidden rounded-sm border border-zinc-200 bg-white">
      <div className="grid grid-cols-2 divide-x divide-y divide-zinc-100 sm:grid-cols-4 sm:divide-y-0">
        {cards.map((c) => (
          <div key={c.label} className="flex flex-col gap-1.5 px-5 py-5">
            <span className={t.eyebrow}>{c.label}</span>
            <span className={t.statValue}>{c.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
