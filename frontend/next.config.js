/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  images: {
    domains: [
      'images-na.ssl-images-amazon.com',
      'images.unsplash.com',
      'localhost',
      'r2.1k-cdn.com',
      '1k-cdn.com',
      'api.dicebear.com',
      'books.google.com',
      'books.googleusercontent.com',
      'books.googleusercontent.com.tr',
      'books.google.com.tr'
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8080/api/:path*', // Backend portun 8080 ise!
      },
    ];
  },
};

module.exports = nextConfig; 