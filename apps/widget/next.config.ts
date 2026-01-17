import "@veterinary-app/env/widget";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: true,
  reactCompiler: true,
  crossOrigin:"anonymous"
};

export default nextConfig;
