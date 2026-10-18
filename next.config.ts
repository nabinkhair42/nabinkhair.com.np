import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],

  // Images served as-is (no runtime optimizer). Drop this to use Next's
  // image optimization on a host that supports it.
  images: { unoptimized: true },

  async headers() {
    return [
      {
        // Advertise Accept negotiation for caches; markdown responses also set this
        // explicitly in the route handler (authoritative for text/markdown).
        source: "/:path*",
        headers: [{ key: "Vary", value: "Accept" }],
      },
    ];
  },

  async redirects() {
    return [
      // Strip legacy Blogger ?m= parameter
      {
        source: "/:path*",
        has: [{ type: "query", key: "m" }],
        destination: "/:path*",
        permanent: true,
      },
      // Old Blogger date-based post URLs (e.g., /2023/01/some-post.html)
      {
        source: "/:year(\\d{4})/:month(\\d{2})/:slug.html",
        destination: "/blog",
        permanent: true,
      },
      // Old Blogger static page URLs (e.g., /p/random-image-generator.html)
      {
        source: "/p/:slug.html",
        destination: "/",
        permanent: true,
      },
      // Blogger RSS/Atom feed URLs
      {
        source: "/feeds/:path*",
        destination: "/feed.xml",
        permanent: true,
      },
      // Blogger search/label pages
      {
        source: "/search/:path*",
        destination: "/blog",
        permanent: true,
      },
      // Blogger root .html pages (e.g., /some-page.html)
      {
        source: "/:slug(.*)\\.html",
        destination: "/",
        permanent: true,
      },
      // Catch favicon.ico requests from old Blogger setup
      {
        source: "/favicon.ico",
        destination: "/icon.png",
        permanent: true,
      },
      // --- GSC 404 cleanup: old routes that no longer exist ---
      // Old standalone pages → home
      { source: "/about", destination: "/", permanent: true },
      { source: "/contact", destination: "/", permanent: true },
      { source: "/projects", destination: "/", permanent: true },
      { source: "/background-images", destination: "/", permanent: true },
      { source: "/en-US", destination: "/", permanent: true },
      // Old/phantom blog slugs that never existed or were removed → blog index
      { source: "/blog/ui-ux-guide", destination: "/blog", permanent: true },
      {
        source: "/blog/introducing-civen-ai",
        destination: "/blog",
        permanent: true,
      },
      {
        source: "/blog/brutalist-minimalism-architectural-web-design",
        destination: "/blog",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
