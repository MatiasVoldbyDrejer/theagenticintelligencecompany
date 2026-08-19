import type { ReactNode } from "react";

/** A 4px corner and a hairline border on the warm Card surface — no shadow.
 *  `bg-white` is remapped to that surface by the `.dataset` block. */
export function Card({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`rounded-sm border border-zinc-200 bg-white ${className}`}>{children}</div>
  );
}

export function CardHeader({ title, aside }: { title: string; aside?: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-zinc-100 px-5 py-3.5">
      <h3 className="text-sm font-medium text-zinc-900">{title}</h3>
      {aside}
    </div>
  );
}

/** Mono chip, mirroring the portal Badge's `mono` variant. */
export function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-md border border-zinc-200 bg-zinc-50 px-2 py-0.5 font-mono text-xs text-zinc-700">
      {children}
    </span>
  );
}
