/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
  },
  serverExternalPackages: ['axios'],
  // Temporarily disable Turbopack to avoid manifest issues
  // You can enable it later once the issue is resolved
  // experimental: {
  //   turbo: {
  //     resolveAlias: {},
  //   },
  // },
  reactStrictMode: false,
};

export default nextConfig;
