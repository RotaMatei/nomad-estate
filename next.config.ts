import type { NextConfig } from 'next';

// Use default .next on Vercel to ensure deployment detection works
const isVercel = !!process.env.VERCEL;
const nextConfig: NextConfig = isVercel
  ? {}
  : {
      // Local/dev: mitigate Windows EPERM lock on .next/trace by moving distDir
      distDir: '.next_build',
    };

export default nextConfig;
