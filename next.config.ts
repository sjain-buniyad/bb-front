// import type { NextConfig } from "next";

const nextConfig = {
  allowedDevOrigins: ["103.133.214.253"],
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:3000/:path*",
      },
    ];
  },
};

module.exports = nextConfig;

// export default nextConfig;
