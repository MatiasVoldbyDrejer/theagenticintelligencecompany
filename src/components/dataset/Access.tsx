import Link from "next/link";
import type { DatasetSnapshot } from "@/lib/dataset";
import { t } from "./type";

const STEPS = [
  {
    title: "Request",
    body: "Tell us who you are, what you are building, and how the audio will be used.",
  },
  {
    title: "Review",
    body: "We read every request. Expect a reply within a few working days, either way.",
  },
  {
    title: "Delivery",
    body: "Approved recipients get a portal account and either a direct download or delivery into their own S3 bucket.",
  },
];

const ASKS = [
  "Your name and role",
  "The company or institution you are affiliated with",
  "Your organizational or institutional email address",
  "Whether the use is commercial or research",
  "How the dataset will be used",
  "Agreement to the data use terms",
];

export default function Access({ license }: { license: DatasetSnapshot["license"] }) {
  return (
    <section id="access" className="scroll-mt-24 space-y-4">
      <h2 className={t.sectionTitle}>Access</h2>
      <p className={t.sectionIntro}>
        The release is free, for commercial and research use alike. It is not a public download:
        access is granted per recipient under a data use agreement, because the speakers who
        recorded it consented on the basis that their audio stays with identified, accountable
        counterparties.
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {STEPS.map((s, i) => (
          <div key={s.title} className="rounded-sm border border-zinc-200 bg-white p-5">
            <div className="flex items-baseline gap-2.5">
              <span className="font-mono text-[11px] tabular-nums text-zinc-300">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className={t.cardTitle}>{s.title}</h3>
            </div>
            <p className="mt-2 text-[13px] leading-5 text-zinc-500">{s.body}</p>
          </div>
        ))}
      </div>

      <div className="rounded-sm border border-zinc-200 bg-white">
        <div className="border-b border-zinc-100 px-5 py-3.5">
          <h3 className={t.cardTitle}>What the form asks for</h3>
        </div>
        <ul className="grid grid-cols-1 gap-x-8 px-5 py-4 sm:grid-cols-2">
          {ASKS.map((a) => (
            <li key={a} className="flex items-start gap-2.5 py-1.5 text-sm text-zinc-600">
              <span aria-hidden className="mt-2 h-px w-3 shrink-0 bg-zinc-300" />
              {a}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-wrap items-center gap-4 pt-2">
        <Link
          href="/dataset/request"
          className="rounded-sm bg-zinc-900 px-5 py-2.5 text-sm font-medium text-zinc-50 transition-colors hover:bg-zinc-700"
        >
          Request access
        </Link>
        <Link
          href="/dataset/license"
          className="text-sm text-zinc-500 underline decoration-zinc-300 underline-offset-4 transition-colors hover:text-zinc-900"
        >
          Read the {license.name}
        </Link>
      </div>
    </section>
  );
}
