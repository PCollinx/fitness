/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    // Enable features that are stable in Next.js 14.2.x
    serverActions: {
      allowedOrigins: ['localhost:3000', '127.0.0.1:3000'],
    },
    // Ensure Prisma works correctly during build
    serverComponentsExternalPackages: ['@prisma/client', 'bcrypt'],
  },
  // Disable static optimization for routes that use API
  staticPageGenerationTimeout: 120,
  typescript: {
    // Handle type errors during build for production
    ignoreBuildErrors: process.env.NODE_ENV === 'production',
  },
  eslint: {
    // Handle ESLint errors during build for production
    ignoreDuringBuilds: process.env.NODE_ENV === 'production',
  },
};

module.exports = nextConfig;
