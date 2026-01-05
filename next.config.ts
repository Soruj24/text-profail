import type { NextConfig } from "next";

import path from "path";

const nextConfig: NextConfig = {
  transpilePackages: ["@langchain/core", "@langchain/community", "langchain", "zod"],
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
      "zod/v4/core": path.resolve(process.cwd(), "node_modules/zod/v4/core/index.js"),
    };
    return config;
  },
};

export default nextConfig;
