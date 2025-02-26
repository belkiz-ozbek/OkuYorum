import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      'images-na.ssl-images-amazon.com',
      'images.unsplash.com',
      'localhost',
      'r2.1k-cdn.com',
      '1k-cdn.com'
    ],
  },
};

export default nextConfig;
