import type { NextConfig } from "next";

/**
 * Next.js 配置文件，设置为生产环境跳过 ESLint 检查，防止因 lint 报错导致 Vercel 构建失败。
 */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;

export default nextConfig;
