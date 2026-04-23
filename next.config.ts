import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-dc10c38f379d4f969d0cee0cbb99f69c.r2.dev",
      },
    ],
  },
};

export default nextConfig;
