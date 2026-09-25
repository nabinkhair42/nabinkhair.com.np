"use client";

import { useReducedMotion } from "motion/react";
import { type MouseEvent, useEffect, useMemo, useState } from "react";
import { LineNav, type LineNavItem } from "@/components/ui/extended/line-nav";

function slugify(text: string): string {
  return text.trim().replace(/\s+/g, "-").replace(/'/g, "").replace(/\?/g, "").toLowerCase();
}

type Heading = { text: string; slug: string };
type Section = Heading & { children: Heading[] };

function extractSections(content: string): Section[] {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const sections: Section[] = [];
  let current: Section | null = null;

  for (const match of content.matchAll(headingRegex)) {
    const depth = match[1].length;
    const text = match[2].replace(/[*_`[\]()]/g, "").trim();
    const slug = slugify(text);

    if (depth === 2) {
      current = { text, slug, children: [] };
      sections.push(current);
    } else if (current) {
      current.children.push({ text, slug });
    } else {
      current = { text, slug, children: [] };
      sections.push(current);
    }
  }

  return sections;
}

function useActiveHeading(slugs: string[]) {
  const [active, setActive] = useState<string | null>(null);
  const key = slugs.join("|");

  useEffect(() => {
    if (slugs.length === 0) return;
    const elements = slugs
      .map((slug) => document.getElementById(slug))
      .filter((element): element is HTMLElement => element !== null);
    if (elements.length === 0) return;

    const update = () => {
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
        setActive(elements[elements.length - 1].id);
        return;
      }
      const trigger = window.innerHeight * 0.25;
      let next: string | null = null;
      for (const element of elements) {
        if (element.getBoundingClientRect().top <= trigger) next = element.id;
        else break;
      }
      setActive(
        next ?? elements.find((element) => element.getBoundingClientRect().bottom > 0)?.id ?? null
      );
    };

    update();
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        update();
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [key]);

  return active;
}

interface TableOfContentsProps {
  content: string;
}

export const TableOfContents = ({ content }: TableOfContentsProps) => {
  const sections = useMemo(() => extractSections(content), [content]);
  const items = useMemo<LineNavItem[]>(
    () =>
      sections.flatMap((section) => [
        { title: section.text, href: `#${section.slug}` },
        ...section.children.map((child) => ({ title: child.text, href: `#${child.slug}` })),
      ]),
    [sections]
  );
  const slugs = useMemo(() => items.map((item) => item.href.slice(1)), [items]);
  const activeSlug = useActiveHeading(slugs);
  const reduceMotion = useReducedMotion();

  if (items.length < 2) return null;

  const handleSelect = (item: LineNavItem, event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const id = item.href.slice(1);
    const element = document.getElementById(id);
    if (!element) return;
    element.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    window.history.replaceState(null, "", `#${id}`);
  };

  return (
    <LineNav
      label="Table of contents"
      items={items}
      activeHref={activeSlug ? `#${activeSlug}` : undefined}
      scrollActiveIntoView={false}
      onItemClick={handleSelect}
      className="fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 lg:flex"
    />
  );
};
