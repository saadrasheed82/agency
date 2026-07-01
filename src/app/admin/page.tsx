import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";
import { AdminConsole } from "@/components/admin-console";
import {
  SectionLabel,
  SectionHeading,
} from "@/components/ui-primitives";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  // Defense-in-depth: middleware already gates /admin, but verify server-side.
  if (!(await isAuthenticated())) {
    redirect("/login?from=/admin");
  }

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
    <section className="relative flex-1 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 grid-texture opacity-50" />
      <div className="pointer-events-none absolute -right-32 top-0 size-[420px] rounded-full bg-neon/8 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mb-8 flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <SectionLabel index="// ADMIN">
              <span className="flex items-center gap-1.5">
                <span className="size-1.5 animate-pulse-neon bg-neon" />
                SESSION_ACTIVE
              </span>
            </SectionLabel>
            <SectionHeading className="mt-4">
              Deployment <span className="text-neon">Console</span>
            </SectionHeading>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
              Instantly deploy new prompts to the public library. Submissions
              write to the server state and flash a confirmation on success.
            </p>
          </div>
        </div>

        <AdminConsole initialPrompts={prompts} />
      </div>
    </section>
  );
}
