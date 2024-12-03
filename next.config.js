/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['77.37.122.81'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '77.37.122.81',
        port: '3000',
        pathname: '/uploads/**',
      },
    ],
    unoptimized: true,
  },
  output: 'standalone',
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig 