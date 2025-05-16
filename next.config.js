// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
//   webpack: config => {
//     config.externals.push('pino-pretty', 'lokijs', 'encoding')
//     return config
//   },
// };

// module.exports = nextConfig;


/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: config => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    return config;
  },
  // Prevent server-side rendering for packages that use browser-specific APIs
  transpilePackages: ['lottie-web', 'lottie-react', '@selfxyz/qrcode'],
};

module.exports = nextConfig;