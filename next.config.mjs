/** @type {import('next').NextConfig} */

// Content-Security-Policy. `unsafe-inline` is required because Next.js injects
// inline hydration/runtime scripts and styles in the App Router without a nonce.
// Tighten further with a nonce-based middleware if stricter CSP is needed.
const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https: http:",
  "font-src 'self' data:",
  "connect-src 'self' https: http:",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests"
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload"
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(self), browsing-topics=()"
  }
];

const backendMediaOrigin = (
  process.env.BACKEND_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "https://api.cabzii.in"
).replace(/\/$/, "");

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  productionBrowserSourceMaps: false,
  async rewrites() {
    return [
      {
        source: "/uploads/:path*",
        destination: `${backendMediaOrigin}/uploads/:path*`
      }
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" }
    ]
  },
  experimental: {
    // Next 14.2 still injects lucide-react into this list. Do not add more barrels.
    optimizePackageImports: []
  },
  webpack(config, { dev, isServer }) {
    if (dev && !isServer) {
      // If the graph has no async chunks, webpack emits `u() { return undefined }`
      // and any leftover chunk load becomes GET /_next/undefined.
      config.output.chunkFilename = "static/chunks/[name].js";
      config.plugins.push({
        apply(compiler) {
          compiler.hooks.thisCompilation.tap("cabzii-undef-chunk", (compilation) => {
            compilation.hooks.processAssets.tap(
              {
                name: "cabzii-undef-chunk",
                stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE_INLINE
              },
              () => {
                for (const filename of Object.keys(compilation.assets)) {
                  if (!filename.replace(/\\/g, "/").endsWith("chunks/webpack.js")) continue;
                  const src = compilation.assets[filename].source();
                  if (typeof src !== "string" || !src.includes("__webpack_require__.e = function(chunkId)")) {
                    continue;
                  }
                  const next = src
                    .replace(
                      "__webpack_require__.e = function(chunkId) {",
                      "__webpack_require__.e = function(chunkId) { if (typeof __webpack_require__.u === \"function\" && !__webpack_require__.u(chunkId)) return Promise.resolve();"
                    )
                    .replace(
                      "__webpack_require__.f.j = function(chunkId, promises) {",
                      "__webpack_require__.f.j = function(chunkId, promises) { if (typeof __webpack_require__.u === \"function\" && !__webpack_require__.u(chunkId)) { installedChunks[chunkId] = 0; return; }"
                    )
                    .replace(
                      "originalFactory.call(this, moduleObject, moduleExports, webpackRequire);",
                      "if (typeof originalFactory === \"function\") { originalFactory.call(this, moduleObject, moduleExports, webpackRequire); } else { console.error(\"CABZII_MISSING_FACTORY\", moduleObject && moduleObject.id); }"
                    );
                  if (next !== src) {
                    compilation.updateAsset(filename, new compiler.webpack.sources.RawSource(next));
                  }
                }
              }
            );
          });
        }
      });
    }
    return config;
  },
  async headers() {
    const isDev = process.env.NODE_ENV !== "production";
    const staticCache = isDev
      ? "no-store, must-revalidate"
      : "public, max-age=31536000, immutable";

    return [
      {
        source: "/:path*",
        headers: securityHeaders
      },
      {
        // Long-lived caching for the service worker is undesirable; keep it fresh.
        source: "/sw.js",
        headers: [
          { key: "Cache-Control", value: "public, max-age=0, must-revalidate" },
          { key: "Service-Worker-Allowed", value: "/" }
        ]
      },
      {
        source: "/images/:path*",
        headers: [{ key: "Cache-Control", value: isDev ? "no-store" : "public, max-age=31536000, immutable" }]
      },
      {
        source: "/_next/static/:path*",
        headers: [{ key: "Cache-Control", value: staticCache }]
      }
    ];
  }
};

export default nextConfig;
