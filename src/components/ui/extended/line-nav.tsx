"use client";

import { motion, useReducedMotion } from "motion/react";
import { type CSSProperties, type MouseEvent, type Ref, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export interface LineNavItem {
  title: string;
  href: string;
}

export interface LineNavProps {
  className?: string;
  items: LineNavItem[];
  activeHref?: string;
  label?: string;
  scrollActiveIntoView?: boolean;
  onItemClick?: (item: LineNavItem, event: MouseEvent<HTMLAnchorElement>) => void;
}

const LINE_NAV_SPRING = {
  type: "spring" as const,
  stiffness: 200,
  damping: 20,
};

const lineVariants = {
  normal: { width: 24 },
  active: { width: 40 },
  hover: { width: 40 },
};

export function LineNav({
  className,
  items,
  activeHref,
  label = "Line navigation",
  scrollActiveIntoView = true,
  onItemClick,
}: LineNavProps) {
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const reduceMotion = useReducedMotion() === true;

  useEffect(() => {
    if (!scrollActiveIntoView) return;
    const activeIndex = items.findIndex((item) => item.href === activeHref);
    if (activeIndex < 0) return;
    itemRefs.current[activeIndex]?.scrollIntoView({ block: "center" });
  }, [activeHref, items, scrollActiveIntoView]);

  return (
    <nav
      aria-label={label}
      className={cn("group/nav relative flex flex-col items-end gap-2 py-5.25", className)}
      style={{ "--line-nav-width": "24px" } as CSSProperties}
    >
      <div
        className={cn(
          "invisible pointer-events-none absolute right-full top-1/2 z-50 -mr-2 w-60 max-w-[calc(100vw-2rem)] max-h-[min(24rem,calc(100vh-8rem))] -translate-y-1/2 scale-95 overflow-y-auto rounded-xl border bg-background/95 p-1.5 opacity-0 shadow-lg backdrop-blur-xl transition-[opacity,transform,visibility] duration-150 ease-out no-scrollbar",
          "group-hover/nav:visible group-hover/nav:pointer-events-auto group-hover/nav:scale-100 group-hover/nav:opacity-100",
          "group-focus-within/nav:visible group-focus-within/nav:pointer-events-auto group-focus-within/nav:scale-100 group-focus-within/nav:opacity-100"
        )}
      >
        {items.map((item) => {
          const active = item.href === activeHref;
          return (
            <a
              key={`panel-${item.href}`}
              href={item.href}
              aria-current={active ? "page" : undefined}
              onClick={(event) => onItemClick?.(item, event)}
              className={cn(
                "block truncate rounded-lg px-2.5 py-2 text-sm transition-colors duration-150 ease-out",
                active
                  ? "bg-accent text-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              {item.title}
            </a>
          );
        })}
      </div>
      {items.map((item, index) => (
        <LineNavEntry
          key={item.href}
          ref={(element) => {
            itemRefs.current[index] = element;
          }}
          title={item.title}
          href={item.href}
          active={item.href === activeHref}
          isLast={index === items.length - 1}
          reduceMotion={reduceMotion}
          onClick={onItemClick}
        />
      ))}
    </nav>
  );
}

interface LineNavEntryProps extends LineNavItem {
  active: boolean;
  isLast: boolean;
  reduceMotion: boolean;
  onClick?: (item: LineNavItem, event: MouseEvent<HTMLAnchorElement>) => void;
  ref?: Ref<HTMLAnchorElement>;
}

function LineNavEntry({
  title,
  href,
  active,
  isLast,
  reduceMotion,
  onClick,
  ref,
}: LineNavEntryProps) {
  const item = { title, href };
  const transition = reduceMotion ? { duration: 0 } : LINE_NAV_SPRING;

  return (
    <>
      <motion.a
        ref={ref}
        href={href}
        aria-label={title}
        aria-current={active ? "page" : undefined}
        initial={false}
        animate={active ? "active" : "normal"}
        whileHover="hover"
        onClick={(event) => onClick?.(item, event)}
        className="group relative flex h-px items-center gap-3 after:absolute after:top-1/2 after:left-0 after:size-full after:-translate-y-1/2 after:p-3.5 focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-ring"
      >
        <motion.span
          aria-hidden="true"
          variants={lineVariants}
          transition={transition}
          className="block h-px shrink-0 bg-foreground/20 transition-[background-color] duration-150 ease-out group-hover:bg-foreground group-aria-[current=page]:bg-foreground"
        />
      </motion.a>
      {!isLast ? (
        <>
          <span aria-hidden="true" className="block h-px w-(--line-nav-width) bg-foreground/20" />
          <span aria-hidden="true" className="block h-px w-(--line-nav-width) bg-foreground/20" />
        </>
      ) : null}
    </>
  );
}
