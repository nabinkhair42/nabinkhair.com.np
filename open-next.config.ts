import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// No ISR / "use cache" in this app (blog is SSG via generateStaticParams, the
// s-maxage values are plain CDN cache headers), so no incremental cache / R2.
export default defineCloudflareConfig();
