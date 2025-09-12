import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export',
  trailingSlash: true,
  outputFileTracingRoot: __dirname,
  images: {
    unoptimized: true
  },
  // Disabilita le funzionalità server-side per l'export statico
  experimental: {
    esmExternals: true
  }
};

export default nextConfig;
