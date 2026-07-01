import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Hash,
  Terminal,
  Calendar,
  FileText,
  ChevronRight,
} from "lucide-react";
import { db } from "@/lib/db";
import { CodeBlock } from "@/components/code-block";
import { CopyPromptButton } from "@/components/copy-prompt-button";
import {
  SectionLabel,
  SectionHeading,
  CornerTicks,
} from "@/components/ui-primitives";
import { CATEGORY_META, isPromptCategory } from "@/lib/prompts";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const prompt = await db.prompt.findUnique({ where: { id } });
  if (!prompt) return { title: "Prompt Not Found — Saad Rashid" };
  return {
    title: `${prompt.title} — Saad Rashid`,
    description: prompt.description,
  };
}

export default async function PromptDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const prompt = await db.prompt.findUnique({ where: { id } });

  if (!prompt) {
    notFound();
  }

  const category = isPromptCategory(prompt.category)
    ? prompt.category
    : "Vibe Coding";
  const meta = CATEGORY_META[category];
  const createdAt = new Date(prompt.createdAt);

  return (
    <>
      {/* Breadcrumb / back bar */}
      <section className="border-b border-border/70 bg-black/40">
        <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6 lg:px-8">
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground"
          >
            <Link
              href="/"
              className="transition-colors hover:text-neon"
            >
              HOME
            </Link>
            <ChevronRight className="size-3" />
            <Link
              href="/prompts"
              className="transition-colors hover:text-neon"
            >
              PROMPTS
            </Link>
            <ChevronRight className="size-3" />
            <span className="text-neon">{meta.code}</span>
          </nav>
        </div>
      </section>

      {/* Header */}
      <section className="relative overflow-hidden border-b border-border/70">
        <div className="pointer-events-none absolute inset-0 grid-texture opacity-50" />
        <div className="pointer-events-none absolute -right-32 top-0 size-[420px] rounded-full bg-neon/8 blur-[120px]" />

        <div className="relative mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <Link
            href="/prompts"
            className="group inline-flex items-center gap-2 border border-border/70 bg-black/50 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground transition-all hover:border-neon/50 hover:text-neon clip-corner"
          >
            <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
            BACK TO LIBRARY
          </Link>

          <div className="mt-6 flex flex-wrap items-center gap-2.5">
            <SectionLabel index={`// ${meta.code}`}>
              {category}
            </SectionLabel>
            <span className="flex items-center gap-1.5 border border-border/70 bg-black/50 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              <Calendar className="size-3 text-neon" />
              {createdAt.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "2-digit",
              })}
            </span>
          </div>

          <SectionHeading className="mt-5 text-3xl sm:text-4xl lg:text-5xl">
            {prompt.title}
          </SectionHeading>

          <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {prompt.description}
          </p>
        </div>
      </section>

      {/* Payload */}
      <section className="flex-1">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="mb-3 flex items-center justify-between">
            <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              <Terminal className="size-3 text-neon" />
              RAW_PROMPT_PAYLOAD
            </span>
            <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              <FileText className="size-3" />
              {prompt.payload.length} CHARS
            </span>
          </div>

          <div className="relative">
            <CornerTicks />
            <CodeBlock
              code={prompt.payload}
              filename="raw_payload.txt"
              maxHeight="40rem"
            />
          </div>

          {/* Action bar */}
          <div className="mt-6 flex flex-col items-stretch gap-3 border border-border/70 bg-card/40 p-4 clip-corner sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2.5">
              <span className="flex size-9 items-center justify-center border border-neon/40 bg-neon/10 text-neon clip-corner">
                <Hash className="size-4" />
              </span>
              <div>
                <div className="font-display text-sm font-bold uppercase tracking-tight text-foreground">
                  {prompt.title}
                </div>
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  {meta.code} · {category}
                </div>
              </div>
            </div>
            <CopyPromptButton payload={prompt.payload} />
          </div>

          {/* Footer nav */}
          <div className="mt-8 flex justify-center">
            <Link
              href="/prompts"
              className="group inline-flex items-center gap-2 border border-silver/50 bg-transparent px-6 py-3 font-display text-sm font-bold uppercase tracking-[0.14em] text-silver transition-all hover:border-silver hover:bg-silver/10 clip-corner"
            >
              <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
              RETURN TO LIBRARY
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
