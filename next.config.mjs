/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  reactStrictMode: false,
  images: {
    unoptimized: true,
    domains: [],
    // domains: ['localhost'],
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


