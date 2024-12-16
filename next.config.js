/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    domains: [
      '77.37.122.81', 
      'joyshypnose-therapies.com',
      'www.joyshypnose-therapies.com',
      'fonts.gstatic.com',
      'fonts.googleapis.com'
    ],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '77.37.122.81',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'joyshypnose-therapies.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.joyshypnose-therapies.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'fonts.gstatic.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'fonts.googleapis.com',
        pathname: '/**',
      }
    ],
  },
  output: 'standalone',
  outputFileTracing: true,
  distDir: '.next',
  experimental: {
    outputFileTracingExcludes: {
      '*': [
        'node_modules/@swc/core-linux-x64-gnu',
        'node_modules/@swc/core-linux-x64-musl',
        'node_modules/@esbuild/linux-x64',
      ],
    },
  },
  swcMinify: true,
  env: {
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || 'https://www.joyshypnose-therapies.com'
  },
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: '/public/uploads/:path*',
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/favicon.ico',
        headers: [
          {
            key: 'Content-Type',
            value: 'image/x-icon'
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ],
      },
      {
        source: '/favicon-16x16.png',
        headers: [
          {
            key: 'Content-Type',
            value: 'image/png'
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ],
      },
      {
        source: '/icon.png',
        headers: [
          {
            key: 'Content-Type',
            value: 'image/png'
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ],
      },
      {
        source: '/apple-icon.png',
        headers: [
          {
            key: 'Content-Type',
            value: 'image/png'
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ],
      },
      {
        source: '/uploads/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
          {
            key: 'Expires',
            value: '0',
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET',
          },
        ],
      },
      {
        source: '/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*'
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET'
          }
        ]
      }
    ];
  },
}

module.exports = nextConfig; 