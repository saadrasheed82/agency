"use client";

import * as React from "react";
import Link from "next/link";
import { Copy, Check, Hash, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { CATEGORY_META, isPromptCategory } from "@/lib/prompts";
import { CornerTicks } from "@/components/ui-primitives";

export interface Prompt {
  id: string;
  title: string;
  description: string;
  payload: string;
  category: string;
  createdAt: string;
}

export function PromptCard({ prompt }: { prompt: Prompt }) {
  const [copied, setCopied] = React.useState(false);

  const category = isPromptCategory(prompt.category)
    ? prompt.category
    : "Vibe Coding";
  const meta = CATEGORY_META[category];

  const copy = React.useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      try {
        await navigator.clipboard.writeText(prompt.payload);
      } catch {
        const ta = document.createElement("textarea");
        ta.value = prompt.payload;
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
    },
    [prompt.payload]
  );

  return (
    <div className="group relative flex flex-col border border-border/70 bg-card/60 transition-all hover:border-neon/40 hover:bg-card/80">
      <CornerTicks />

      {/* Header */}
      <div className="flex items-start justify-between gap-3 p-4">
        <div className="flex items-center gap-2">
          <span className="flex size-6 items-center justify-center border border-neon/40 bg-neon/10 text-neon">
            <Hash className="size-3" />
          </span>
          <span
            className={cn(
              "font-mono text-[10px] uppercase tracking-[0.2em]",
              meta.accent
            )}
          >
            {meta.code} · {category}
          </span>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
          {new Date(prompt.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
          })}
        </span>
      </div>

      {/* Title + description — clickable link to detail page */}
      <Link
        href={`/prompts/${prompt.id}`}
        className="flex-1 px-4 text-left"
        aria-label={`Open prompt: ${prompt.title}`}
      >
        <h3 className="font-display text-lg font-bold uppercase tracking-tight text-foreground group-hover:text-neon">
          {prompt.title}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {prompt.description}
        </p>
      </Link>

      {/* Actions */}
      <div className="flex items-center gap-2 p-4 pt-3">
        <button
          type="button"
          onClick={copy}
          className={cn(
            "flex flex-1 items-center justify-center gap-1.5 border px-3 py-2 font-mono text-[11px] uppercase tracking-[0.16em] transition-all clip-corner",
            copied
              ? "border-neon bg-neon text-neon-foreground"
              : "border-neon/50 bg-neon/10 text-neon hover:bg-neon hover:text-neon-foreground"
          )}
        >
          {copied ? (
            <>
              <Check className="size-3.5" /> COPIED
            </>
          ) : (
            <>
              <Copy className="size-3.5" /> COPY PROMPT
            </>
          )}
        </button>
        <Link
          href={`/prompts/${prompt.id}`}
          className="group/btn flex items-center justify-center gap-1.5 border border-border/70 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground transition-all hover:border-neon/50 hover:text-neon"
          aria-label={`View prompt details: ${prompt.title}`}
        >
          OPEN
          <ArrowUpRight className="size-3.5 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
        </Link>
      </div>
    </div>
  );
}
