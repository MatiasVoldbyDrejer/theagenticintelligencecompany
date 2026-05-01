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
    ];
  },
};

export default nextConfig;
