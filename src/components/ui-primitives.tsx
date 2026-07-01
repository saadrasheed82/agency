import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

/**
 * SectionLabel — terminal-style category tag with neon accent.
 */
export function SectionLabel({
  children,
  className,
  index,
}: {
  children: React.ReactNode;
  className?: string;
  index?: string;
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 border border-neon/40 bg-neon/5 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.25em] text-neon clip-corner",
        className
      )}
    >
      {index && <span className="opacity-60">{index}</span>}
      <ChevronRight className="size-3" />
      <span>{children}</span>
    </div>
  );
}

/**
 * SectionHeading — heavy display heading with metallic silver + neon slash.
 */
export function SectionHeading({
  children,
  className,
  as: Comp = "h2",
}: {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}) {
  return (
    <Comp
      className={cn(
        "font-display font-extrabold uppercase tracking-tight text-foreground",
        "text-3xl sm:text-4xl lg:text-5xl",
        className
      )}
    >
      {children}
    </Comp>
  );
}

/**
 * CornerTicks — decorative bracket corners for technical card frames.
 */
export function CornerTicks({ className }: { className?: string }) {
  return (
    <>
      <span
        className={cn(
          "pointer-events-none absolute left-0 top-0 size-3 border-l border-t border-neon/60",
          className
        )}
      />
      <span
        className={cn(
          "pointer-events-none absolute right-0 top-0 size-3 border-r border-t border-neon/60",
          className
        )}
      />
      <span
        className={cn(
          "pointer-events-none absolute bottom-0 left-0 size-3 border-b border-l border-neon/60",
          className
        )}
      />
      <span
        className={cn(
          "pointer-events-none absolute bottom-0 right-0 size-3 border-b border-r border-neon/60",
          className
        )}
      />
    </>
  );
}
