import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config) => {
    config.ignoreWarnings = [
      {
        module: /@supabase\/realtime-js/, // Suppress warnings from @supabase/realtime-js
      },
    ];
    return config;
  },
};

export default nextConfig;
