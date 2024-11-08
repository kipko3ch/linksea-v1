/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  trailingSlash: false,
  output: 'export',
  images: {
    unoptimized: true,
    domains: ['bxxpzwzqjrspygvyiwqw.supabase.co'],
  },
}

module.exports = nextConfig 