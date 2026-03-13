/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // 禁用严格模式以支持Socket.IO
  swcMinify: true,
  images: {
    unoptimized: true, // Vercel需要这个配置
  },
  // 允许从外部API获取数据
  async rewrites() {
    return [
      {
        source: '/api/socket/:path*',
        destination: '/api/socket/:path*',
      },
    ];
  },
};

module.exports = nextConfig;