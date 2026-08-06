import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: { formats: ["image/avif", "image/webp"] },
  devIndicators: false,
  poweredByHeader: false,
};

export default nextConfig;
