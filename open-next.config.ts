import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

// Blog posts are SSG (MDX compiled at build). Serve the prerendered pages from the
// Worker's own static assets — no R2/KV, no extra cost, no revalidation needed.
export default {
  ...defineCloudflareConfig({ incrementalCache: staticAssetsIncrementalCache }),
  // Run Next directly instead of OpenNext's default `pnpm build`, so our `build`
  // script can be `opennextjs-cloudflare build` (what Cloudflare CI runs) without
  // recursing. Standalone output is still forced by OpenNext (NEXT_PRIVATE_STANDALONE).
  buildCommand: "node scripts/gen-blog-data.mjs && npx next build",
};
