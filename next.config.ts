import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Inline the variant at build time. Vercel build-env values do not exist at
  // runtime, so anything rendered per request (route handlers, /search) would
  // otherwise silently fall back to v1 inside a v2 deployment.
  env: {
    STORE_VERSION: process.env.STORE_VERSION ?? "v1",
    BREAK_MODE: process.env.BREAK_MODE ?? "selectors",
    BUILD_TIME: process.env.BUILD_TIME ?? new Date().toISOString(),
  },
  // Lets two dev servers (v1 and v2) run side by side locally. Unset in production.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  images: {
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
  },
  async headers() {
    return [
      {
        source: "/version.json",
        headers: [{ key: "Cache-Control", value: "no-store" }],
      },
    ];
  },
};

export default nextConfig;
