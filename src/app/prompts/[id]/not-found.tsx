import Link from "next/link";
import { Terminal, ArrowLeft, AlertTriangle } from "lucide-react";
import { SectionLabel, SectionHeading } from "@/components/ui-primitives";

export default function NotFound() {
  return (
    <section className="relative flex-1 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 grid-texture opacity-50" />
      <div className="pointer-events-none absolute left-1/2 top-20 size-[420px] -translate-x-1/2 rounded-full bg-destructive/10 blur-[120px]" />

      <div className="relative mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center sm:px-6 lg:py-32">
        <SectionLabel index="// ERR_404">
          <span className="flex items-center gap-1.5">
            <AlertTriangle className="size-3" />
            RESOURCE_NOT_FOUND
          </span>
        </SectionLabel>

        <h1 className="mt-6 font-display text-7xl font-extrabold uppercase tracking-tight text-neon text-glow-neon sm:text-8xl">
          404
        </h1>

        <SectionHeading className="mt-2 text-2xl sm:text-3xl">
          Signal <span className="text-neon">Lost</span>
        </SectionHeading>

        <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
          The requested resource returned void. It may have been purged,
          relocated, or never existed in this control plane.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/prompts"
            className="group inline-flex items-center justify-center gap-2 border border-neon bg-neon px-6 py-3.5 font-display text-sm font-bold uppercase tracking-[0.14em] text-neon-foreground transition-all hover:glow-neon clip-corner"
          >
            <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
            BACK TO LIBRARY
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 border border-silver/50 bg-transparent px-6 py-3.5 font-display text-sm font-bold uppercase tracking-[0.14em] text-silver transition-all hover:border-silver hover:bg-silver/10 clip-corner"
          >
            <Terminal className="size-4" />
            HOME
          </Link>
        </div>
      </div>
    </section>
  );
}
