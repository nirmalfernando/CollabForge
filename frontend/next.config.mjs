/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com", // For placeholder images
        port: "",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost", // For local development images
        port: "3000",
        pathname: "/**",
      },
    ],
    unoptimized: true,
  },
};

export default nextConfig;
