"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface TerminalLine {
  text: string;
  tone?: "neon" | "silver" | "muted" | "danger" | "default";
}

/**
 * TerminalBox — a raw, terminal-style diagnostic panel with a live typed feed.
 * Renders a window chrome (dots + title), an optional live ticker, and lines.
 */
export function TerminalBox({
  title = "sys@automation-engine:~$",
  lines,
  live = true,
  className,
  prompt,
  children,
}: {
  title?: string;
  lines?: TerminalLine[];
  live?: boolean;
  className?: string;
  prompt?: string;
  children?: React.ReactNode;
}) {
  const [visible, setVisible] = React.useState<number>(live ? 0 : (lines?.length ?? 0));

  React.useEffect(() => {
    if (!live || !lines?.length) return;
    setVisible(0);
    let i = 0;
    const interval = setInterval(() => {
      i += 1;
      setVisible(i);
      if (i >= lines.length) clearInterval(interval);
    }, 380);
    return () => clearInterval(interval);
  }, [live, lines]);

  return (
    <div
      className={cn(
        "relative overflow-hidden border border-border/80 bg-[oklch(0.08_0.004_60)] clip-corner",
        className
      )}
    >
      {/* Window chrome */}
      <div className="flex items-center justify-between border-b border-border/70 bg-black/60 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-destructive/70" />
          <span className="size-2.5 rounded-full bg-silver/40" />
          <span className="size-2.5 rounded-full bg-neon/70" />
        </div>
        <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
          {title}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-neon/70">
          ● REC
        </span>
      </div>

      {/* Body */}
      <div className="scanlines relative p-4 font-mono text-xs leading-relaxed text-foreground/90 sm:text-[13px]">
        {lines?.slice(0, visible).map((line, i) => (
          <TerminalLineRow key={i} line={line} />
        ))}
        {children}
        {prompt && (
          <div className="mt-1 flex items-center gap-2">
            <span className="text-neon">{prompt}</span>
            <span className="cursor-blink" />
          </div>
        )}
      </div>
    </div>
  );
}

function TerminalLineRow({ line }: { line: TerminalLine }) {
  const toneClass =
    line.tone === "neon"
      ? "text-neon"
      : line.tone === "silver"
      ? "text-silver"
      : line.tone === "muted"
      ? "text-muted-foreground"
      : line.tone === "danger"
      ? "text-destructive"
      : "text-foreground/90";

  return (
    <div className="flex gap-2">
      <span className="select-none text-muted-foreground/60">›</span>
      <span className={cn("whitespace-pre-wrap break-words", toneClass)}>
        {line.text}
      </span>
    </div>
  );
}
