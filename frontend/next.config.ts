import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/admin/login',
        destination: '/login',
        permanent: true,
      },
      {
        source: '/trainer/login',
        destination: '/login',
        permanent: true,
      },
      {
        source: '/member/login',
        destination: '/login',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
