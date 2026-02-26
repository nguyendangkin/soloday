import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    formats: ["image/webp", "image/avif"],
    unoptimized: true, // Required for static export
  },
  // Security headers should be configured on hosting platform
  // (Vercel: vercel.json, Netlify: _headers, nginx: server config)
};

export default nextConfig;
