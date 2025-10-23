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
  outputFileTracingIncludes: {
    '/api/**/*': ['./node_modules/.prisma/client/**/*'],
  },
  // Ensure Prisma client is bundled correctly for serverless (moved from experimental in Next 16)
  serverExternalPackages: ['@prisma/client', '@prisma/engines', 'prisma'],
  // Empty turbopack config to silence warning
  turbopack: {}
}

export default nextConfig
