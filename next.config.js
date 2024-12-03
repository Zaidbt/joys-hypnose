/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['77.37.122.81'],
    unoptimized: true,
  },
  output: 'standalone',
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig 