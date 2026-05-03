"use client";

import { useEffect, useState } from "react";

type Item = { id: string; label: string };

export function TableOfContents({ items }: { items: Item[] }) {
  const [active, setActive] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const offset = 120;
    const update = () => {
      let current = items[0]?.id ?? "";
      for (const { id } of items) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top - offset <= 0) current = id;
      }
      setActive(current);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [items]);

  return (
    <nav aria-label="Contents" className="font-sans">
      <p className="mb-[14px] text-[11px] uppercase tracking-[0.14em] text-black/40">
        Contents
      </p>
      <ul className="space-y-[2px] text-[13.5px] leading-[1.4]">
        {items.map(({ id, label }) => {
          const isActive = active === id;
          return (
            <li key={id}>
              <a
                href={`#${id}`}
                className={`relative block border-l py-[6px] pl-[14px] transition-colors duration-200 ${
                  isActive
                    ? "border-black text-black"
                    : "border-black/10 text-black/45 hover:text-black/75"
                }`}
              >
                {label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
