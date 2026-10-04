import type { NextConfig } from 'next';
import { OPTIMISED_IMAGE_HOSTS } from './lib/image-hosts.mjs';

const shared: NextConfig = {
  images: {
    remotePatterns: OPTIMISED_IMAGE_HOSTS.map((hostname) => ({ protocol: 'https' as const, hostname })),
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    // `radix-ui` is one umbrella package: without this every primitive ships to every route that imports one of them.
    optimizePackageImports: ['radix-ui', 'recharts'],
  },
};

// Use default .next on Vercel to ensure deployment detection works
const isVercel = !!process.env.VERCEL;
const nextConfig: NextConfig = isVercel
  ? shared
  : {
      ...shared,
      // Local/dev: mitigate Windows EPERM lock on .next/trace by moving distDir
      distDir: '.next_build',
    };

export default nextConfig;
