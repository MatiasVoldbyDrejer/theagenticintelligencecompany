export type SiteLink = { label: string; href: string };

export const WORDMARK = "The Agentic Data Company";

export const COPYRIGHT = `${WORDMARK} © 2026`;

export const NAV_LINKS: SiteLink[] = [{ label: "Open Yap 1K", href: "/open-yap-1k" }];

export const FOOTER_COLUMNS: { heading: string; links: SiteLink[] }[] = [
  {
    heading: "Company",
    links: [
      { label: "About", href: "/" },
      { label: "Contact", href: "mailto:matias@theagenticdatacompany.com" },
    ],
  },
  {
    heading: "Public Datasets",
    links: [{ label: "Open Yap 1K", href: "/open-yap-1k" }],
  },
];
