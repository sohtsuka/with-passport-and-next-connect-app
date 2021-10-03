/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  // see: https://nextjs.org/docs/api-reference/next.config.js/custom-webpack-config
  // see: https://webpack.js.org/configuration/watch/
  /**
   * @param {import('webpack').Configuration} config
   * @returns {import('webpack').Configuration}
   */
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Workaround for Docker for Windows
    if (dev) {
      config.watchOptions = {
        aggregateTimeout: 200,
        poll: 1000,
        ignored: /node_modules/,
      };
    }
    // Important: return the modified config
    return config
  },
}
