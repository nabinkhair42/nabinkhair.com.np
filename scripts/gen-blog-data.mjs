// Bundles blog-content/*.mdx into src/generated/blog-data.json, which mdx.ts imports
// statically so post content ships in the deploy bundle (no runtime fs needed).
// Runs before `next build` and `next dev`; regenerate by re-running either.
import fs from "node:fs";
import path from "node:path";

const dir = path.join(process.cwd(), "blog-content");
const out = path.join(process.cwd(), "src/generated/blog-data.json");

const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith(".mdx")) : [];
const data = {};
for (const f of files) {
  data[f.replace(/\.mdx$/, "")] = fs.readFileSync(path.join(dir, f), "utf8");
}

fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, `${JSON.stringify(data, null, 0)}\n`);
console.log(`gen-blog-data: ${files.length} posts -> ${path.relative(process.cwd(), out)}`);
