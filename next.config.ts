import type { NextConfig } from "next";

// COP-1 (prompt-4 R5): deploy-time guard — the build FAILS when the public
// origin is unset. canonical/hreflang/OG/JSON-LD all render against
// NEXT_PUBLIC_SITE_URL (venue.siteUrl()); an unset origin would silently
// produce broken absolute URLs. PLACEHOLDER policy default: see .env.example
// (https://mirador.example — never claimed deployed; swap = one env var at
// deployment).
if (!process.env.NEXT_PUBLIC_SITE_URL) {
  throw new Error(
    "[COP-1] NEXT_PUBLIC_SITE_URL is unset — refusing to build against an unknown origin. " +
      "Set it (see .env.example · PLACEHOLDER policy: https://mirador.example).",
  );
}

// SEC-1 (prompt-4 R5): the four live security headers.
// CSP note: 'unsafe-inline' on script-src is required by Next.js's inline
// Flight bootstrap (<script>self.__next_f.push…</script> — per-page payloads,
// not hashable); style-src 'unsafe-inline' covers React inline style
// attributes. Nonce-based strict CSP is documented as the deploy-pre
// follow-up (needs proxy nonce wiring). frame-ancestors 'none' + X-Frame-
// Options DENY double-guard clickjacking; XCTO nosniff; Referrer-Policy
// strict-origin-when-cross-origin (origin-only on cross-origin egress).
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    // PRF-3 (prompt-4 R6/P-023): AVIF actually served — the optimizer's
    // preferred output format for responsive sources (gallery tiles, menu
    // plates, 404 poster); the pre-graded AVIF ladder masters (hero/journey/
    // story/skyline) bypass the optimizer via the per-image custom loader
    // (src/lib/image-loader.ts) and serve rung files directly (E53).
    formats: ["image/avif"],
  },
  /* No ignoreBuildErrors / ignoreDuringBuilds — gate silencers are
     review-blocking defects (full-stack-agent-playground §10.4, §13-6). */
  reactStrictMode: true,
  poweredByHeader: false, // SEC-1: X-Powered-By removed
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: CSP },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Content-Type-Options", value: "nosniff" },
        ],
      },
    ];
  },
};

export default nextConfig;
