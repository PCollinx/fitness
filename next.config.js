/** @type {import('next').NextConfig} */
const path = require("path");

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    // Enable features that are stable in Next.js 14.2.x
    serverActions: {
      allowedOrigins: ["localhost:3000", "127.0.0.1:3000"],
    },
    // Ensure Prisma works correctly during build
    serverComponentsExternalPackages: ["@prisma/client", "bcrypt"],
  },
  // Configure external image domains
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Disable static optimization for routes that use API
  staticPageGenerationTimeout: 120,
  typescript: {
    // Handle type errors during build for production
    ignoreBuildErrors: process.env.NODE_ENV === "production",
  },
  eslint: {
    // Handle ESLint errors during build for production
    ignoreDuringBuilds: process.env.NODE_ENV === "production",
  },
  // Configure webpack to resolve path aliases
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname),
    };
    return config;
  },
};

module.exports = nextConfig;
