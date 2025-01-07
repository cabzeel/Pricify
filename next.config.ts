import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'm.media-amazon.com',
        pathname: '/**', // Allows all paths under m.media-amazon.com
      },
    ],
  },
};

export default nextConfig;
