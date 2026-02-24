/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/storage/uploads/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
        pathname: "/storage/uploads/**",
      },
      {
        protocol: "https",
        hostname: "admin.chimnchurri.com",
        pathname: "/storage/uploads/**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/v1/frontend/:path*",
        destination: `${process.env.NEXT_PUBLIC_BASE_URL || "https://admin.chimnchurri.com"}/api/v1/frontend/:path*`,
      },
    ];
  },
  /* config options here */
  reactCompiler: true,
};

export default nextConfig;
