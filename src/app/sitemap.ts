import type { MetadataRoute } from "next";

const BASE = "https://theagenticdatacompany.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE, priority: 1 },
    { url: `${BASE}/dataset`, priority: 0.9 },
    { url: `${BASE}/dataset/license`, priority: 0.3 },
  ];
}
