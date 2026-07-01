"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * CodeBlock — IDE-style dark code panel with line numbers + instant copy.
 */
export function CodeBlock({
  code,
  language = "txt",
  className,
  maxHeight = "24rem",
  filename,
}: {
  code: string;
  language?: string;
  className?: string;
  maxHeight?: string;
  filename?: string;
}) {
  const [copied, setCopied] = React.useState(false);

  const copy = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      // Fallback for restricted clipboard environments.
      const ta = document.createElement("textarea");
      ta.value = code;
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
  }, [code]);

  const lines = React.useMemo(() => code.replace(/\n$/, "").split("\n"), [code]);

  return (
    <div
      className={cn(
        "relative overflow-hidden border border-border/70 bg-[oklch(0.06_0.004_60)] clip-corner",
        className
      )}
    >
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-border/60 bg-black/50 px-3 py-2">
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          <span className="size-2 bg-neon/70" />
          <span>{filename ?? language}</span>
        </div>
        <button
          type="button"
          onClick={copy}
          className={cn(
            "flex items-center gap-1.5 border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] transition-all clip-corner",
            copied
              ? "border-neon bg-neon/15 text-neon"
              : "border-border/70 text-muted-foreground hover:border-neon/50 hover:text-neon"
          )}
          aria-label={copied ? "Copied to clipboard" : "Copy to clipboard"}
        >
          {copied ? (
            <>
              <Check className="size-3" /> COPIED
            </>
          ) : (
            <>
              <Copy className="size-3" /> COPY
            </>
          )}
        </button>
      </div>

      {/* Code body */}
      <div
        className="scroll-neon overflow-auto"
        style={{ maxHeight }}
      >
        <pre className="min-w-full p-0 font-mono text-[12.5px] leading-[1.65]">
          <code className="block">
            {lines.map((ln, i) => (
              <div
                key={i}
                className="flex hover:bg-neon/[0.03]"
              >
                <span className="sticky left-0 w-10 shrink-0 select-none border-r border-border/40 bg-[oklch(0.06_0.004_60)] px-2 text-right text-muted-foreground/50">
                  {i + 1}
                </span>
                <span className="whitespace-pre-wrap break-words px-4 text-foreground/90">
                  {ln || " "}
                </span>
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}
