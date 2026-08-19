import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * The sample audio is served for on-page listening only (see /terms). None of
   * this prevents a determined save - audio a browser can play is audio a
   * listener can keep, and nothing short of DRM changes that, which would be
   * absurd for a preview clip.
   *
   * What it does prevent is the passive case: a crawler indexing the mp3s and
   * turning them into a search result that hands them out with no terms
   * attached. That is the realistic route to misuse, and it is worth closing.
   */
  async headers() {
    return [
      {
        source: "/samples/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
          { key: "Content-Disposition", value: "inline" },
        ],
      },
    ];
  },

  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.theagenticdatacompany.com" }],
        destination: "https://theagenticdatacompany.com/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [
          { type: "host", value: "(www\\.)?theagenticintelligencecompany\\.com" },
        ],
        destination: "https://theagenticdatacompany.com/:path*",
        permanent: true,
      },
      {
        source: "/podcast",
        destination:
          "https://thetrench.notion.site/Podcast-Overview-355b45222a3c808bbd16c3e06e2e7013?source=copy_link",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
