import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { MDXRemoteProps } from "next-mdx-remote/rsc";
import readingTime from "reading-time";
import rehypePrettyCode from "rehype-pretty-code";
import remarkGfm from "remark-gfm";
import { transformers } from "@/lib/markdown/highlight-code";

const contentDir = path.join(process.cwd(), "blog-content");
const posts: Record<string, string> = fs.existsSync(contentDir)
  ? Object.fromEntries(
      fs
        .readdirSync(contentDir)
        .filter((f) => f.endsWith(".mdx"))
        .map((f) => [f.slice(0, -4), fs.readFileSync(path.join(contentDir, f), "utf8")])
    )
  : {};

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
