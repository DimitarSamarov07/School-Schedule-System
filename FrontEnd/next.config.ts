import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/csrf-token",
        destination: "http://localhost:1343/csrf-token",
      },
      {
        source: "/api/:path*",
        destination: "http://localhost:1343/api/:path*",
      },
    ];
  },
};

export default nextConfig;