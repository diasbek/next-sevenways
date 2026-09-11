// @ts-check
// Plain JS so Hostinger (glibc < 2.29) can load config without native SWC.

const PROD_SITE = "https://sevenways.uz";
const siteUrl = PROD_SITE;

/**
 * @param {string} url
 */
function siteOrigin(url) {
  try {
    return new URL(url).origin;
  } catch {
    return PROD_SITE;
  }
}

/** Mirror of `isIndexableDeployment` — keep inline; next.config cannot use `@/` imports. */
function isIndexableDeployment() {
  if (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== "production") {
    return false;
  }
  if (process.env.NODE_ENV === "development") return false;
  return true;
}

const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
];

const denyFramingHeader = { key: "X-Frame-Options", value: "DENY" };
const denyFramingCspHeader = {
  key: "Content-Security-Policy",
  value: "frame-ancestors 'none'",
};

const noindexRobotsHeader = {
  key: "X-Robots-Tag",
  value: "noindex, nofollow, noarchive",
};

const indexable = isIndexableDeployment();

/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  reactStrictMode: true,
  experimental: {
    cpus: 2,
    webpackMemoryOptimizations: true,
    optimizePackageImports: ["lucide-react"],
    serverActions: {
      bodySizeLimit: "1mb",
      allowedOrigins: [
        siteOrigin(siteUrl),
        "sevenways.uz",
        "www.sevenways.uz",
        "localhost:3000",
        "127.0.0.1:3000",
      ],
    },
  },
  outputFileTracingExcludes: {
    "*": [
      "node_modules/@swc/core-linux-x64-gnu",
      "node_modules/@swc/core-linux-x64-musl",
      "node_modules/@esbuild/linux-x64",
      "node_modules/webpack",
      "node_modules/terser",
    ],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  async rewrites() {
    const supabaseUrl = process.env.SUPABASE_URL || "";
    if (!supabaseUrl) return [];
    return [
      {
        source: "/media/:path*",
        destination: `${supabaseUrl.replace(/\/$/, "")}/storage/v1/object/public/sevenways-media/:path*`,
      },
    ];
  },
  async headers() {
    const common = [...securityHeaders, denyFramingHeader, denyFramingCspHeader];
    /** @type {import('next').NextConfig['headers']} */
    const rules = [
      {
        source: "/(.*)",
        headers: indexable ? common : [...common, noindexRobotsHeader],
      },
      {
        source: "/dashboard/:path*",
        headers: [...common, noindexRobotsHeader],
      },
      {
        source: "/api/:path*",
        headers: [...common, noindexRobotsHeader],
      },
    ];
    return rules;
  },
};

export default nextConfig;
