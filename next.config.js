/** @type {import('next').NextConfig} */
const withNextIntl = require("next-intl/plugin")("./i18n.config.ts");

const nextConfig = {
  reactStrictMode: true,
  env: {
    _next_intl_trailing_slash: "false",
  },
};

module.exports = withNextIntl(nextConfig);
