import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cloud Agent / CVM preview proxies and local aliases need Next dev assets.
  allowedDevOrigins: [
    "127.0.0.1",
    "localhost",
    "0.0.0.0",
    "p-3000-pod-4j3me3px2nf6nmuldygsplmljy-41f8574bb5aa04e0474a-us4.agent.cvm.dev",
    "*.agent.cvm.dev",
  ],
  // Preserve the product AGENTS.md in this repo.
  agentRules: false,
};

export default nextConfig;
