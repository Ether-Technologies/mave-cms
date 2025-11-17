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
      "videos.pexels.com",
      "images.pexels.com"
    ],
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https:",
              "media-src 'self' data: blob: https://videos.pexels.com https://images.pexels.com",
              "connect-src 'self' https:",
              "font-src 'self' data:",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'"
            ].join('; ')
          }
        ]
      }
    ]
  }
};

module.exports = nextConfig;
