import Link from "next/link";
import { COPYRIGHT, FOOTER_COLUMNS } from "./nav";

/**
 * Site footer: a hairline, narrow link columns, and the copyright well below
 * them. Aligned to the dataset page's column rather than the essay's, so the
 * page it follows most often lines up with it.
 */
export default function SiteFooter() {
  return (
    <footer className="relative z-10 mt-24 font-sans sm:mt-36">
      <div className="mx-auto w-full max-w-[1180px] px-5 pb-8 sm:px-8">
        <div className="border-t border-black/10 pt-8">
          <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4 lg:grid-cols-5">
            {FOOTER_COLUMNS.map((column) => (
              <div key={column.heading}>
                <h2 className="text-[14px] leading-6 font-normal tracking-[-0.01em] text-chrome-muted">
                  {column.heading}
                </h2>
                <ul className="mt-2.5 space-y-1.5">
                  {column.links.map((link) => (
                    <li key={`${column.heading}-${link.label}`} className="leading-6">
                      <Link
                        href={link.href}
                        className="text-[14px] tracking-[-0.01em] text-chrome underline-offset-4 decoration-black/25 hover:underline"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <p className="mt-12 text-[14px] leading-6 text-chrome-muted">{COPYRIGHT}</p>
        </div>
      </div>
    </footer>
  );
}
