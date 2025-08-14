
const withNextIntl = require('next-intl/plugin')();

/** @type {import('next').NextConfig} */
const nextConfig = {
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
        hostname: 'seth.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

module.exports = withNextIntl(nextConfig);
