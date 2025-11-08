import type { NextConfig } from 'next';

// Mitigate Windows EPERM lock on .next/trace by moving distDir (avoid the default .next path)
const nextConfig: NextConfig = {
  distDir: '.next_build',
};

export default nextConfig;
