/** @type {import('next').NextConfig} */
const nextConfig = {
  // Next 16 no longer supports configuring `swcMinify` or `eslint` here.
  // Manage linting behavior via your lint scripts or CI, and minification via build tooling.
  typescript: {
    // Keep the developer convenience flag—consider removing for production builds.
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
