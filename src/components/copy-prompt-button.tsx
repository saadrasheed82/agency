"use client";

import * as React from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Standalone copy-to-clipboard button used on the prompt detail page.
 */
export function CopyPromptButton({
  payload,
  className,
}: {
  payload: string;
  className?: string;
}) {
  const [copied, setCopied] = React.useState(false);

  const copy = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(payload);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = payload;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
      } catch {
        /* noop */
      }
      document.body.removeChild(ta);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }, [payload]);

  return (
    <button
      type="button"
      onClick={copy}
      className={cn(
        "group flex items-center justify-center gap-2 border px-6 py-3.5 font-display text-sm font-bold uppercase tracking-[0.14em] transition-all clip-corner",
        copied
          ? "border-neon bg-neon text-neon-foreground"
          : "border-neon bg-neon text-neon-foreground hover:glow-neon",
        className
      )}
    >
      {copied ? (
        <>
          <Check className="size-4" /> COPIED TO CLIPBOARD
        </>
      ) : (
        <>
          <Copy className="size-4" /> COPY PROMPT
        </>
      )}
    </button>
  );
}
