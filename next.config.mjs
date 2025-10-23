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
  // Ensure Prisma client is bundled correctly for serverless
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'prisma']
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Exclude Prisma engines from webpack bundling
      config.externals.push('_http_common')
    }
    return config
  }
}

export default nextConfig
