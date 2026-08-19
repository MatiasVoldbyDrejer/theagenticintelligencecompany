import type { Metadata } from "next";
import { TERMS_NAME, TERMS_TEXT, TERMS_VERSION } from "@/lib/terms";

export const metadata: Metadata = {
  title: `${TERMS_NAME} - The Agentic Data Company`,
  description:
    "Terms governing use of theagenticdatacompany.com and the sample audio published on it.",
  alternates: { canonical: "/terms" },
};

/**
 * Site-wide, so deliberately not inside DatasetFrame: these terms cover the
 * whole site and the samples on it, and framing them as part of one release
 * would suggest they lapse when that release does.
 */
export default function TermsPage() {
  return (
    <div className="dataset relative z-10 min-h-dvh">
      <div className="mx-auto w-full max-w-3xl px-5 pt-16 pb-8 sm:px-8">
        <div className="space-y-3">
          <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-400">
            Version {TERMS_VERSION}
          </span>
          <h1 className="text-[40px] font-normal leading-[1.05] tracking-[-0.03em] text-zinc-900">
            {TERMS_NAME}
          </h1>
        </div>

        <div className="mt-6 overflow-hidden rounded-sm border border-zinc-200 bg-white">
          <pre className="whitespace-pre-wrap px-6 py-6 font-mono text-[13px] leading-6 text-zinc-700">
            {TERMS_TEXT}
          </pre>
        </div>
      </div>
    </div>
  );
}
