"use client";

import * as React from "react";
import { Search, Filter, Terminal, Hash } from "lucide-react";
import { cn } from "@/lib/utils";
import { PromptCard, type Prompt } from "@/components/prompt-card";
import { PROMPT_CATEGORIES, CATEGORY_META } from "@/lib/prompts";
import { CornerTicks } from "@/components/ui-primitives";

type FilterValue = "ALL" | (typeof PROMPT_CATEGORIES)[number];

export function PromptsExplorer({ prompts }: { prompts: Prompt[] }) {
  const [filter, setFilter] = React.useState<FilterValue>("ALL");
  const [query, setQuery] = React.useState("");

  const filtered = React.useMemo(() => {
    return prompts.filter((p) => {
      const matchesCat = filter === "ALL" || p.category === filter;
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q);
      return matchesCat && matchesQuery;
    });
  }, [prompts, filter, query]);

  const counts = React.useMemo(() => {
    const c: Record<string, number> = { ALL: prompts.length };
    for (const cat of PROMPT_CATEGORIES) {
      c[cat] = prompts.filter((p) => p.category === cat).length;
    }
    return c;
  }, [prompts]);

  const filterOptions: { value: FilterValue; label: string }[] = [
    { value: "ALL", label: "All" },
    ...PROMPT_CATEGORIES.map((c) => ({ value: c, label: c })),
  ];

  return (
    <div>
      {/* Control bar */}
      <div className="relative border border-border/70 bg-card/40 p-4 clip-corner">
        <CornerTicks />
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Search */}
          <div className="relative flex-1 lg:max-w-md">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="grep prompt_library..."
              className="h-10 w-full border border-border/70 bg-black/60 pl-10 pr-3 font-mono text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-neon/50 focus:outline-none focus:ring-1 focus:ring-neon/30"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="mr-1 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              <Filter className="size-3" />
              FILTER:
            </span>
            {filterOptions.map((opt) => {
              const active = filter === opt.value;
              const code =
                opt.value === "ALL"
                  ? "ALL"
                  : CATEGORY_META[opt.value as (typeof PROMPT_CATEGORIES)[number]]
                      .code;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setFilter(opt.value)}
                  className={cn(
                    "flex items-center gap-1.5 border px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] transition-all",
                    active
                      ? "border-neon bg-neon/15 text-neon"
                      : "border-border/70 text-muted-foreground hover:border-neon/40 hover:text-foreground"
                  )}
                >
                  <span className="opacity-60">{code}</span>
                  {opt.label}
                  <span className="opacity-50">[{counts[opt.value] ?? 0}]</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Results meta */}
      <div className="mt-4 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Terminal className="size-3 text-neon" />
          {filtered.length} / {prompts.length} ENTRIES
        </span>
        <span className="flex items-center gap-1.5">
          <Hash className="size-3" />
          click card to open full prompt
        </span>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="mt-6 border border-dashed border-border/70 bg-black/40 p-12 text-center">
          <p className="font-mono text-sm uppercase tracking-[0.16em] text-muted-foreground">
            {"// NO_MATCHING_PROMPTS"}
          </p>
          <p className="mt-2 text-xs text-muted-foreground/70">
            Try a different filter or search term.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <PromptCard key={p.id} prompt={p} />
          ))}
        </div>
      )}
    </div>
  );
}
