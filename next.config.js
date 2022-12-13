/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // If set true, double rendering in development mode (NextJS)
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com', // URL for getting alternative static pokemon images.
        port: '',
      },
    ],
  },
}

module.exports = nextConfig
