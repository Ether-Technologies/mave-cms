const nextConfig = {
  distDir: ".next",
  output: "standalone",
  eslint: {
    dirs: ["."],
    ignoreDuringBuilds: true,
  },
  images: {
    dangerouslyAllowSVG: true,
    domains: [
      "mave-cms.vercel.app",
      "res.cloudinary.com",
      "mave.ethertech.ltd",
    ],
    unoptimized: true,
  },
};

module.exports = nextConfig;
