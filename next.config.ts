import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["xztufxnnsjywieznjljw.supabase.co"], // Tambahkan domain Supabase Anda di sini
  },
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
