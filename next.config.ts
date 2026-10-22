import type { NextConfig } from "next";

/**
 * The site ships as a static export so it can be hosted on GitHub Pages (or any
 * static host). On GitHub Pages it lives under `/<repo>`, so the deploy workflow
 * sets NEXT_PUBLIC_BASE_PATH; locally it stays empty.
 *
 * Cache Components / Partial Prefetching are intentionally off: they rely on a
 * server (PPR) and Next.js refuses to combine them with `output: "export"`.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  reactStrictMode: true,
  poweredByHeader: false,
  images: { unoptimized: true },
  experimental: {
    agentFeedback: true,
  },
};

export default nextConfig;
