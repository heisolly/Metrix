import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    domains: ["supabase.co", "github.com"],
  },
};

export default nextConfig;
