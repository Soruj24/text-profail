import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  transpilePackages: ["@langchain/core", "@langchain/community", "langchain"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "zod/v3": path.resolve(process.cwd(), "node_modules/zod/v3/index.js"),
    };
    return config;
  },
};

export default nextConfig;
