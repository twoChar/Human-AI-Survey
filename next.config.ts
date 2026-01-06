import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/Human-AI-Survey',
  assetPrefix: '/Human-AI-Survey',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
