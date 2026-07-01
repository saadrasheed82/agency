import { db } from "@/lib/db";
import { PromptsExplorer } from "@/components/prompts-explorer";
import {
  SectionLabel,
  SectionHeading,
} from "@/components/ui-primitives";

export const dynamic = "force-dynamic";

export default async function PromptsPage() {
  const rows = await db.prompt.findMany({
    orderBy: { createdAt: "desc" },
  });

  const prompts = rows.map((r) => ({
    id: r.id,
    title: r.title,
    description: r.description,
    payload: r.payload,
    category: r.category,
    createdAt: r.createdAt.toISOString(),
  }));

  return (
    <>
      {/* Header */}
      <section className="relative overflow-hidden border-b border-border/70">
        <div className="pointer-events-none absolute inset-0 grid-texture opacity-50" />
        <div className="pointer-events-none absolute -left-32 top-0 size-[380px] rounded-full bg-neon/8 blur-[110px]" />
        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <SectionLabel index="// PROMPT_LIBRARY">
            ENGINEERING_ARSENAL
          </SectionLabel>
          <SectionHeading className="mt-4">
            Prompt <span className="text-neon">Library</span>
          </SectionHeading>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            A dense, battle-tested arsenal of prompts for image generation,
            video, vibe coding, and agent personas. Copy raw payloads instantly —
            expand any card to inspect the full payload in an IDE-grade viewer.
          </p>
        </div>
      </section>

      {/* Explorer */}
      <section className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <PromptsExplorer prompts={prompts} />
        </div>
      </section>
    </>
  );
}
