import type { NextConfig } from "next";

/**
 * The site is hosted on Vercel so the AI assistant's `/api/chat` route can run
 * server-side and keep the Gemini API key out of the browser.
 *
 * NEXT_PUBLIC_BASE_PATH is still honoured for hosting under a sub-path; leave it
 * empty on Vercel or a custom domain.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
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
