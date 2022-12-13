/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // If set true, double rendering in development mode (NextJS)
  swcMinify: true,
  images: {
    domains: ["raw.githubusercontent.com"]
  },
}

module.exports = nextConfig
