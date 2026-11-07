"use client";

import { useHotkey } from "@tanstack/react-hotkeys";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { DeveloperDetails } from "@/dev-constants/details";
import { isTypingInField } from "@/lib/hotkeys";
import { githubUrl } from "@/lib/site";

export const HotKeyProvider = ({ children }: { children: React.ReactNode }) => {
  const { setTheme, resolvedTheme } = useTheme();
  const router = useRouter();

  useHotkey("B", () => {
    if (isTypingInField()) return;
    router.push("/blog");
  });

  useHotkey("K", () => {
    if (isTypingInField()) return;
    router.push("/bookmarks");
  });

  useHotkey("H", () => {
    if (isTypingInField()) return;
    router.push("/");
  });

  useHotkey(["G", "H"], () => {
    if (isTypingInField()) return;
    window.open(githubUrl, "_blank", "noopener,noreferrer");
  });

  useHotkey("E", () => {
    if (isTypingInField()) return;
    window.location.href = `mailto:${DeveloperDetails.email}`;
  });

  useHotkey("R", () => {
    if (isTypingInField()) return;
    window.open(DeveloperDetails.resume, "_blank", "noopener,noreferrer");
  });

  useHotkey("D", () => {
    if (isTypingInField()) return;
    setTheme(resolvedTheme === "light" ? "dark" : "light");
  });

  return <>{children}</>;
};
