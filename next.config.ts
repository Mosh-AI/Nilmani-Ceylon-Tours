import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  allowedDevOrigins: ["192.168.1.9", "localhost", "127.0.0.1", "172.31.121.3"],
  images: {
    // Avoid dev-time optimizer timeouts on slow/offline remote assets.
    unoptimized: process.env.NODE_ENV === "development",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "img.rocket.new",
      },
    ],
  },
};

export default nextConfig;
