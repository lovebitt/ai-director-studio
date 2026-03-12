/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['images.unsplash.com', 'cdn.dribbble.com'],
  },
  // 启用ES模块
  experimental: {
    esmExternals: true,
  },
};

module.exports = nextConfig;