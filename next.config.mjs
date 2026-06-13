/** @type {import('next').NextConfig} */

// Sub-path the app is served under. Set NEXT_PUBLIC_BASE_PATH="" to run at root.
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "/grains";

const nextConfig = {
  reactCompiler: true,
  ...(BASE_PATH ? { basePath: BASE_PATH } : {}),
};

export default nextConfig;
