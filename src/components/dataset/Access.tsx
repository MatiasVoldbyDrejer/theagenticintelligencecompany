import Link from "next/link";
import type { DatasetSnapshot } from "@/lib/dataset";
import { LICENSE_PERMITTED, LICENSE_PROHIBITED } from "@/lib/license";
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

export default function Access({ license }: { license: DatasetSnapshot["license"] }) {
  return (
    <section id="access" className="scroll-mt-24 space-y-4">
      <h2 className={t.sectionTitle}>Access</h2>
      <p className={t.sectionIntro}>
        This is a public release: it is not licensed exclusively, anyone may request it, and it
        is free for both commercial and research use. It is not a public download — access is
        granted per recipient under a data use agreement. Review is not a competitive
        assessment. Access is granted to anyone who can say who they are and what they intend
        to use the corpus for, and who accepts the terms.
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {STEPS.map((s, i) => (
          <div key={s.title} className="rounded-sm border border-zinc-200 bg-white p-5">
            <div className="flex items-baseline gap-2.5">
              <span className="font-mono text-[11px] tabular-nums text-zinc-700">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className={t.cardTitle}>{s.title}</h3>
            </div>
            <p className="mt-2 text-[13px] leading-5 text-zinc-700">{s.body}</p>
          </div>
        ))}
      </div>

      <div className="rounded-sm border border-zinc-200 bg-white">
        <div className="border-b border-zinc-100 px-5 py-3.5">
          <h3 className={t.cardTitle}>Use under the agreement</h3>
        </div>
        <div className="grid grid-cols-1 divide-y divide-zinc-100 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
          <UseList label="Permitted" items={LICENSE_PERMITTED} />
          <UseList label="Not permitted" items={LICENSE_PROHIBITED} />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 pt-2">
        <Link
          href="/open-yap-1k/request"
          className="rounded-md bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
        >
          Request access
        </Link>
        <Link
          href="/open-yap-1k/license"
          className="text-sm text-zinc-500 underline decoration-zinc-300 underline-offset-4 transition-colors hover:text-zinc-900"
        >
          Read the {license.name}
        </Link>
      </div>
    </section>
  );
}

/** Half of the licence summary. The label carries permitted vs not, so the rows
 *  need no marker of their own beyond the shared rule. */
function UseList({ label, items }: { label: string; items: readonly string[] }) {
  return (
    <div className="px-5 py-4">
      <div className={t.eyebrow}>{label}</div>
      <ul className="mt-3">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2.5 py-1.5 text-[13.5px] leading-6 text-zinc-700">
            <span aria-hidden className="mt-2.5 h-px w-3 shrink-0 bg-zinc-300" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
