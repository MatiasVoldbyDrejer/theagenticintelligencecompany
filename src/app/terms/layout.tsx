import type { ReactNode } from "react";

/**
 * The page wears the dataset theme, so the surface has to move with it - see
 * the same file under open-yap-1k for why the root token rather than the
 * wrapper.
 */
export default function TermsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <style>{":root{--color-paper:#f7f7f4}"}</style>
      {children}
    </>
  );
}
