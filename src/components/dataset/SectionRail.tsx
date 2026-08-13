"use client";

import { useEffect, useState } from "react";
import { SECTIONS } from "./sections";

/**
 * Sticky section index. The page is long and every section is a different kind
 * of evidence, so the rail doubles as a table of contents for what is on offer.
 *
 * Active section is the last one whose top has passed the trigger line, rather
 * than whichever is most visible — a short section sandwiched between two long
 * ones would otherwise never light up.
 */
export default function SectionRail() {
  const [active, setActive] = useState<string>(SECTIONS[0].id);

  useEffect(() => {
    function onScroll() {
      const trigger = window.innerHeight * 0.25;
      let current: string = SECTIONS[0].id;
      for (const s of SECTIONS) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= trigger) current = s.id;
      }
      setActive(current);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className="sticky top-28">
      <ul className="space-y-0.5 border-l border-zinc-200">
        {SECTIONS.map((s) => {
          const on = s.id === active;
          return (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className={`-ml-px block border-l py-1.5 pl-4 font-mono text-[11px] uppercase tracking-[0.12em] transition-colors ${
                  on
                    ? "border-zinc-900 text-zinc-900"
                    : "border-transparent text-zinc-400 hover:text-zinc-600"
                }`}
              >
                {s.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
