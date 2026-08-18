import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    // The sample audio is for listening on the page, not for indexing. The
    // real bar is X-Robots-Tag in next.config.ts, which applies to crawlers
    // that never read robots.txt; this states the same intent where a
    // well-behaved one looks first.
    rules: { userAgent: "*", allow: "/", disallow: "/samples/" },
    host: "https://theagenticdatacompany.com",
  };
}
