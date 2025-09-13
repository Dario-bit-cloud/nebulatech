import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Rimossa configurazione 'output: export' per permettere API routes
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  experimental: {
    esmExternals: true
  }
};

export default nextConfig;
