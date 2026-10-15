import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// No ISR / "use cache" in this app (blog is SSG via generateStaticParams, the
// s-maxage values are plain CDN cache headers), so no incremental cache / R2.
export default {
  ...defineCloudflareConfig(),
  // Run Next directly instead of OpenNext's default `pnpm build`, so our `build`
  // script can be `opennextjs-cloudflare build` (what Cloudflare CI runs) without
  // recursing. Standalone output is still forced by OpenNext (NEXT_PRIVATE_STANDALONE).
  buildCommand: "npx next build",
};
