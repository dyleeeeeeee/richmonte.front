/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [],
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
  // Optimize for SEO
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
};

export default nextConfig;
