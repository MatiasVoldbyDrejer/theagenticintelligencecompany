import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.theagenticintelligencecompany.com" }],
        destination: "https://theagenticintelligencecompany.com/:path*",
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
