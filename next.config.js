const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/api";
const mediaUrl = process.env.NEXT_PUBLIC_MEDIA_URL || "http://127.0.0.1:8000";

function getOrigin(url) {
  try {
    return new URL(url).origin;
  } catch {
    return url;
  }
}

const apiOrigin = getOrigin(apiBaseUrl);
const mediaOrigin = getOrigin(mediaUrl);

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
              "img-src 'self' data: blob: https: " + mediaOrigin,
              "media-src 'self' data: blob: https://videos.pexels.com https://images.pexels.com",
              "connect-src 'self' https: " + apiOrigin + " " + mediaOrigin,
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
