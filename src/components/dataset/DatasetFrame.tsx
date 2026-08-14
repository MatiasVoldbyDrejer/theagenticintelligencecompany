import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import SectionRail from "./SectionRail";

/**
 * Frame for the dataset pages: a hairline top bar that keeps the access CTA
 * reachable from anywhere on a long page, a reading column, and a section rail
 * on wide screens.
 *
 * Deliberately not the home page's 600px essay column — this surface is dense
 * measured data, and a narrow measure would force every table and chart to
 * scroll sideways.
 */
export default function DatasetFrame({
  datasetName,
  // The rail tracks anchors that exist only on the dataset page itself, and the
  // top-bar CTA is pointless on the request page. Both are opt-in so a sub-page
  // can never render navigation to sections it does not have.
  showRail = false,
  showCta = true,
  children,
}: {
  datasetName: string;
  showRail?: boolean;
  showCta?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="dataset relative z-10 min-h-dvh">
      <header className="sticky top-0 z-30 border-b border-zinc-200/80 bg-[var(--color-bg)]/85 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-[1180px] items-center justify-between gap-4 px-5 sm:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <Link href="/" className="shrink-0">
              <Image
                src="/logo.png"
                alt="The Agentic Data Company"
                width={283}
                height={424}
                className="h-6 w-auto"
              />
            </Link>
            <span aria-hidden className="h-4 w-px shrink-0 bg-zinc-300" />
            <span className="truncate font-mono text-[12px] tracking-tight text-zinc-500">
              {datasetName}
            </span>
          </div>
          {showCta && (
            <Link
              href="/yap-1k/request"
              className="shrink-0 rounded-md bg-zinc-900 px-3.5 py-1.5 text-[13px] font-medium text-white transition-colors hover:bg-zinc-800"
            >
              Request access
            </Link>
          )}
        </div>
      </header>

      <div className="mx-auto w-full max-w-[1180px] px-5 pb-32 pt-10 sm:px-8">
        <div className="flex gap-14">
          <main className="min-w-0 flex-1 space-y-16 md:space-y-20">{children}</main>
          {showRail && (
            <aside className="hidden w-40 shrink-0 xl:block">
              <SectionRail />
            </aside>
          )}
        </div>
      </div>

      <footer className="border-t border-zinc-200">
        <div className="mx-auto flex max-w-[1180px] flex-col gap-2 px-5 py-8 text-[13px] text-zinc-400 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <span>The Agentic Data Company</span>
          <Link href="/" className="transition-colors hover:text-zinc-600">
            Back to the home page
          </Link>
        </div>
      </footer>
    </div>
  );
}
