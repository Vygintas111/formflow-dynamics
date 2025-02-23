/** @type {import('next').NextConfig} */
const withNextIntl = require("next-intl/plugin")("./i18n.config.ts");

const nextConfig = {
  reactStrictMode: true,
  // Remove any experimental features that might interfere with hybrid rendering
};

module.exports = withNextIntl(nextConfig);
