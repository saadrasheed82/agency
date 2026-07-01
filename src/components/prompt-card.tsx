"use client";

import * as React from "react";
import {
  Copy,
  Check,
  ChevronDown,
  Hash,
  Terminal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CodeBlock } from "@/components/code-block";
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
  const [expanded, setExpanded] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const category = isPromptCategory(prompt.category)
    ? prompt.category
    : "Vibe Coding";
  const meta = CATEGORY_META[category];

  const copy = React.useCallback(async () => {
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
  }, [prompt.payload]);

  return (
    <div
      className={cn(
        "group relative flex flex-col border bg-card/60 transition-all",
        expanded
          ? "border-neon/50 glow-neon-sm"
          : "border-border/70 hover:border-neon/40"
      )}
    >
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

      {/* Title + description */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex-1 px-4 text-left"
        aria-expanded={expanded}
      >
        <h3 className="font-display text-lg font-bold uppercase tracking-tight text-foreground group-hover:text-neon">
          {prompt.title}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {prompt.description}
        </p>
      </button>

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
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className={cn(
            "flex size-9 items-center justify-center border border-border/70 text-muted-foreground transition-all hover:border-neon/50 hover:text-neon",
            expanded && "rotate-180 border-neon/50 text-neon"
          )}
          aria-label={expanded ? "Collapse prompt payload" : "Expand prompt payload"}
        >
          <ChevronDown className="size-4" />
        </button>
      </div>

      {/* Expandable payload */}
      {expanded && (
        <div className="border-t border-border/60 bg-black/40 p-4">
          <div className="mb-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            <Terminal className="size-3 text-neon" />
            raw_payload.txt
          </div>
          <CodeBlock code={prompt.payload} filename="raw_payload.txt" />
        </div>
      )}
    </div>
  );
}
