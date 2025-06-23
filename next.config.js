const createNextIntlPlugin = require('next-intl/plugin');
const withNextIntl = createNextIntlPlugin('./src/i18n.js');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: process.env.WP_IMAGES_URL,
        port: '',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: process.env.WP_IMAGES_URL,
        port: '',
        pathname: '/**'
      }
    ],
  },
  experimental: {
    // Vous pouvez décommenter ces lignes si nécessaire
    // esmExternals: 'loose',
    // optimizeCss: true,
  },
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization.splitChunks.cacheGroups = {
        ...config.optimization.splitChunks.cacheGroups,
        commons: {
          name: 'commons',
          chunks: 'all',
          minChunks: 2,
        },
      };
    }

    config.performance = {
      ...config.performance,
      maxAssetSize: 1000000,
    };

    config.experiments = { ...config.experiments, topLevelAwait: true };

    return config;
  },
};


// Appliquez withNextIntl à la configuration complète
module.exports = withNextIntl(nextConfig);