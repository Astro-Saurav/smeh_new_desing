import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
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
    ];
  },
};

export default nextConfig;