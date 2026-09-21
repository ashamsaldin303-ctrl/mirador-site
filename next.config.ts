import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /* No ignoreBuildErrors / ignoreDuringBuilds — gate silencers are
     review-blocking defects (full-stack-agent-playground §10.4, §13-6). */
  reactStrictMode: true,
};

export default nextConfig;
