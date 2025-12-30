/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'wellibuy.com'],
    formats: ['image/webp', 'image/avif'],
  },
  // Mobil optimizasyon
  // experimental: {
  //   optimizeCss: true,
  // },
  // API yönlendirmeleri
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5000/api/:path*',
      },
    ];
  },
}

module.exports = nextConfig
