import matter from "gray-matter";
import type { MDXRemoteProps } from "next-mdx-remote/rsc";
import readingTime from "reading-time";
import rehypePrettyCode from "rehype-pretty-code";
import remarkGfm from "remark-gfm";
import { createHighlighter } from "shiki";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";
import blogData from "@/generated/blog-data.json";
import { transformers } from "@/lib/markdown/highlight-code";

// Markdown bundled at build (blog-content/*.mdx -> JSON) so posts render at request
// time without filesystem access — Cloudflare Workers have no runtime fs.
const posts = blogData as Record<string, string>;

export interface BlogFrontmatter {
  title: string;
  description: string;
  developer: string;
  date: string;
  updatedDate?: string;
  image: string;
  published?: boolean;
  tags?: string[];
}

export interface BlogPost {
  slug: string;
  frontmatter: BlogFrontmatter;
  content: string;
  readingTime: string;
}

export const mdxOptions = {
  mdxOptions: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      [
        rehypePrettyCode,
        {
          theme: {
            dark: "github-dark-default",
            light: "github-light-default",
          },
          keepBackground: false,
          transformers,
          // Workers forbid runtime WASM; use shiki's pure-JS regex engine.
          getHighlighter: (options: Parameters<typeof createHighlighter>[0]) =>
            createHighlighter({ ...options, engine: createJavaScriptRegexEngine() }),
        },
      ],
    ],
  },
} satisfies NonNullable<MDXRemoteProps["options"]>;

export function getAllBlogSlugs(): string[] {
  return Object.keys(posts);
}

export function getBlogPostBySlug(slug: string): BlogPost | null {
  const fileContents = posts[slug];
  if (!fileContents) {
    return null;
  }

  const { data, content } = matter(fileContents);
  const readingTimeResult = readingTime(content);

  return {
    slug,
    frontmatter: data as BlogFrontmatter,
    content,
    readingTime: readingTimeResult.text,
  };
}

export function getAllBlogPosts(): BlogPost[] {
  const slugs = getAllBlogSlugs();
  const posts = slugs
    .map((slug) => getBlogPostBySlug(slug))
    .filter((post): post is BlogPost => post !== null)
    .filter((post) => post.frontmatter.published !== false)
    .sort((a, b) => {
      const dateA = new Date(a.frontmatter.date).getTime();
      const dateB = new Date(b.frontmatter.date).getTime();
      return dateB - dateA;
    });

  return posts;
}
