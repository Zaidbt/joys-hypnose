/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '77.37.122.81',
        port: '3000',
        pathname: '/**',
      },
    ],
  },
  output: 'standalone',
  outputFileTracing: true,
  distDir: '.next',
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: '/public/uploads/:path*',
      },
    ];
  },
}

module.exports = nextConfig 