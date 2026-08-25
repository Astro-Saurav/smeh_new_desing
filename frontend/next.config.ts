import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    middlewareClientMaxBodySize: '100mb',
    serverActions: {
      bodySizeLimit: '100mb',
    },
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'manavrachna.edu.in',
        port: '',
        pathname: '/**',
      },
      // Azure Blob Storage — where uploaded news images are stored
      {
        protocol: 'https',
        hostname: 'smehstorage01.blob.core.windows.net',
        port: '',
        pathname: '/**',
      },
      // Allow any external image URL (CDN, pixabay, etc.) for flexibility
      {
        protocol: 'https',
        hostname: '**',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/explore',
        destination: '/',
      },
      {
        source: '/explore/:path*',
        destination: '/student-projects/:path*',
      },
      // Proxy API requests to backend during local development or production VPS
      {
        source: '/api/:path*',
        destination: process.env.INTERNAL_API_URL 
          ? `${process.env.INTERNAL_API_URL}/api/:path*`
          : (process.env.BACKEND_URL ? `${process.env.BACKEND_URL}/api/:path*` : 'http://127.0.0.1:8080/api/:path*'),
      },
      // Proxy uploads to backend during local development or production VPS
      {
        source: '/uploads/:path*',
        destination: process.env.INTERNAL_API_URL 
          ? `${process.env.INTERNAL_API_URL}/uploads/:path*`
          : (process.env.BACKEND_URL ? `${process.env.BACKEND_URL}/uploads/:path*` : 'http://127.0.0.1:8080/uploads/:path*'),
      },
    ]
  },
}

export default nextConfig
