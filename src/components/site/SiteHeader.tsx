"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV_LINKS, WORDMARK } from "./nav";

/**
 * Site bar: mark and wordmark at the left edge, text links at the right edge.
 * Full-bleed rather than aligned to a reading column, so it sits the same on the
 * 600px essay and the 1180px dataset page.
 */
export default function SiteHeader() {
  const pathname = usePathname();

  // The dataset pages carry their own bar, with the release name and the access
  // CTA on it. Standing down here is what keeps them from stacking.
  const ownBar = pathname.startsWith("/open-yap-1k");

  // The home page opens on the mark and the name at full size. Repeating both in
  // the bar at that moment reads as a duplicate, so the bar's copy waits until
  // the hero has scrolled off.
  const deferMark = pathname === "/";
  const [pastHero, setPastHero] = useState(false);

  useEffect(() => {
    if (!deferMark) return;
    const onScroll = () => setPastHero(window.scrollY > 180);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [deferMark]);

  const markShown = !deferMark || pastHero;

  // After the hooks, never before them.
  if (ownBar) return null;

  return (
    <header className="grain sticky top-0 z-50 bg-paper">
      <div className="flex h-[54px] items-center justify-between gap-6 px-4 sm:px-6">
        <Link
          href="/"
          className={`flex items-center gap-2.5 transition-opacity duration-500 ${
            markShown ? "opacity-100" : "invisible opacity-0"
          }`}
        >
          <Image src="/logo.png" alt="" width={283} height={424} className="h-[22px] w-auto" />
          {/* Never dropped, only hidden: it is the link's accessible name. */}
          <span className="sr-only font-serif text-[17px] tracking-[0.01em] text-ink sm:not-sr-only">
            {WORDMARK}
          </span>
        </Link>

        <nav aria-label="Site" className="flex items-center gap-5 sm:gap-7">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[14px] whitespace-nowrap text-chrome underline-offset-4 decoration-black/25 hover:underline"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
