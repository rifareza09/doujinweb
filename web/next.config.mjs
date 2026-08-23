/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'amz-ch.desu.pics' },
      { protocol: 'https', hostname: 'doujin.desu.xxx' },
      { protocol: 'https', hostname: 'nekopoi.care' },
      { protocol: 'https', hostname: '**.nekopoi.care' },
      { protocol: 'https', hostname: '**.desu.xxx' },
      { protocol: 'https', hostname: '**.desu.pics' },
    ],
  },
};

export default nextConfig;
