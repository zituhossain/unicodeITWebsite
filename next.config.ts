import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",

  allowedDevOrigins: ["100.115.124.38", "192.168.1.249", "192.168.1.37"],

  images: {
    formats: ["image/avif", "image/webp"],
  },

  devIndicators: false,
  poweredByHeader: false,

  // Explicitly use Turbopack in Next.js 16.
  turbopack: {},
};

export default nextConfig;
