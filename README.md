# nabinkhair.com.np

> Portfolio and MDX blog for [nabinkhair.com.np](https://nabinkhair.com.np).

[![Live](https://img.shields.io/badge/live-nabinkhair.com.np-000?labelColor=000&color=fff)](https://nabinkhair.com.np)
[![Blog](https://img.shields.io/badge/blog-/blog-000?labelColor=000&color=fff)](https://nabinkhair.com.np/blog)
![Next.js](https://img.shields.io/badge/Next.js_16-000?logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_4-38B2AC?logo=tailwindcss&logoColor=white)
![MDX](https://img.shields.io/badge/MDX-FCB32C?logo=mdx&logoColor=black)

---

## What this is

A personal site built to feel like a product — not a theme with my name dropped in.

- **No CMS.** Blog posts are MDX files. Portfolio content is typed TypeScript constants.
- **Static-first.** Pages pre-render where possible; the GitHub graph is the only live API call.
- **Structural grid UI.** Hatch gutters, dashed section rules, quiet chrome. Layout density over decoration.

## Highlights

| Area          | Details                                                                                     |
| ------------- | ------------------------------------------------------------------------------------------- |
| **Blog**      | Shiki code blocks, Mermaid diagrams, reading time, floating TOC, RSS at `/feed.xml`         |
| **Portfolio** | Expandable experience/projects timelines, stack grid, templates, contribution graph         |
| **UX**        | Scroll-morphing header, dark/light/system theme, keyboard shortcuts, reduced-motion support |
| **SEO**       | JSON-LD, per-post OG images, sitemap, robots                                                |

## Stack

Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · shadcn/ui · Motion · Biome · Vercel

## Quick start

```bash
pnpm install
cp .env.example .env.local   # optional — see below
pnpm dev                     # http://localhost:4000
```

```bash
pnpm build      # production build
pnpm lint       # biome check
pnpm typecheck  # tsc
```

**Env (optional)**

| Variable       | Purpose                                                                                    |
| -------------- | ------------------------------------------------------------------------------------------ |
| `GITHUB_TOKEN` | PAT with `read:user` — powers the 12-month contribution graph. Site works fine without it. |

## Where content lives

Forking or adapting? Edit these — nothing else required.

| Path                              | Content                 |
| --------------------------------- | ----------------------- |
| `blog-content/*.mdx`              | Blog posts              |
| `src/dev-constants/details.ts`    | Bio, socials, education |
| `src/dev-constants/experience.ts` | Work history            |
| `src/dev-constants/projects.ts`   | Projects                |
| `src/dev-constants/stack.ts`      | Tech stack              |
| `src/dev-constants/templates.ts`  | Template cards          |

New blog post → add an `.mdx` file with `title`, `description`, `date`, and optional `image` in frontmatter. It shows up on `/blog` and in the RSS feed automatically.

## Keyboard shortcuts

| Key       | Action       |
| --------- | ------------ |
| `H`       | Home         |
| `B`       | Blog         |
| `E`       | Email        |
| `R`       | Resume       |
| `G` → `H` | GitHub       |
| `D`       | Toggle theme |

Disabled while typing in inputs.

---

[Nabin Khair](https://nabinkhair.com.np) · [GitHub](https://github.com/nabinkhair42) · [LinkedIn](https://www.linkedin.com/in/nabinkhair42/)
