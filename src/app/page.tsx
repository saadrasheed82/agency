import Link from "next/link";
import {
  ArrowRight,
  TerminalSquare,
  Cpu,
  Zap,
  GitBranch,
  Activity,
  CircleDot,
  Workflow,
  Target,
  Layers,
} from "lucide-react";
import { TerminalBox } from "@/components/terminal-box";
import { SectionLabel, SectionHeading, CornerTicks } from "@/components/ui-primitives";
import { getActiveRuntimes } from "@/lib/diagnostics";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const promptCount = await db.prompt.count().catch(() => 0);
  const runtimes = getActiveRuntimes();

  return (
    <>
      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden border-b border-border/70">
        {/* Background glows */}
        <div className="pointer-events-none absolute inset-0 grid-texture opacity-60" />
        <div className="pointer-events-none absolute -left-40 top-0 size-[480px] rounded-full bg-neon/10 blur-[120px]" />
        <div className="pointer-events-none absolute -right-32 bottom-0 size-[420px] rounded-full bg-neon/5 blur-[100px]" />

        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-12 lg:gap-8 lg:px-8 lg:py-24">
          {/* Left: copy */}
          <div className="lg:col-span-7">
            <SectionLabel index="// 00">
              AI_AUTOMATION_ENGINEER
            </SectionLabel>

            <h1 className="mt-6 font-display text-5xl font-extrabold uppercase leading-[0.92] tracking-tight sm:text-6xl lg:text-7xl">
              <span className="block text-foreground">Muhammad</span>
              <span className="block text-foreground">Saad</span>
              <span className="block text-neon text-glow-neon">Rashid</span>
            </h1>

            <p className="mt-5 max-w-xl font-display text-xl font-bold uppercase tracking-tight text-silver text-glow-silver sm:text-2xl">
              AI Automation Engineer
              <span className="text-neon"> & </span>
              AI Creative Designer
            </p>

            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Building autonomous AI systems that smash operational bottlenecks.
              Turning{" "}
              <span className="font-semibold text-silver">10-hour manual workflows</span>{" "}
              into{" "}
              <span className="font-semibold text-neon">3-minute automated engines</span>.
            </p>

            {/* Action buttons */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/ai-company"
                className="group relative inline-flex items-center justify-center gap-2 overflow-hidden border border-neon bg-neon px-6 py-3.5 font-display text-sm font-bold uppercase tracking-[0.14em] text-neon-foreground transition-all hover:glow-neon clip-corner"
              >
                <Zap className="size-4" />
                Acquire Systems
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/prompts"
                className="group inline-flex items-center justify-center gap-2 border border-silver/50 bg-transparent px-6 py-3.5 font-display text-sm font-bold uppercase tracking-[0.14em] text-silver transition-all hover:border-silver hover:bg-silver/10 clip-corner"
              >
                <TerminalSquare className="size-4" />
                Exploit Prompts
              </Link>
            </div>

            {/* Stat strip */}
            <div className="mt-10 grid grid-cols-3 gap-px overflow-hidden border border-border/70 bg-border/70 clip-corner">
              {[
                { k: "10h", v: "→ 3min", label: "WORKFLOW_COMPRESSION" },
                { k: `${promptCount}+`, v: "PROMPTS", label: "DEPLOYED_LIBRARY" },
                { k: "99.97%", v: "UPTIME", label: "AUTONOMOUS_UPTIME" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="bg-black p-4"
                >
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-display text-2xl font-extrabold text-foreground sm:text-3xl">
                      {s.k}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-neon">
                      {s.v}
                    </span>
                  </div>
                  <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: terminal diagnostic */}
          <div className="lg:col-span-5">
            <div className="mb-3 flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                {"// LIVE_SYSTEM_DIAGNOSTIC"}
              </span>
              <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-neon">
                <span className="size-1.5 animate-pulse-neon bg-neon" />
                STREAMING
              </span>
            </div>
            <TerminalBox
              title="runtime@paperclip:~$"
              prompt="> awaiting next heartbeat"
              lines={[
                { text: "$ paperclipctl status --live", tone: "muted" },
                { text: "[OK] control-plane: online", tone: "neon" },
                { text: "[OK] heartbeat-loop: 4h interval", tone: "silver" },
                { text: "[OK] budget-governance: enforced", tone: "silver" },
                { text: `[OK] agents_registered: ${runtimes.agents}`, tone: "default" },
                { text: `[OK] tasks_executed_24h: ${runtimes.tasks}`, tone: "default" },
                { text: `[OK] avg_latency: ${runtimes.latency}ms`, tone: "default" },
                { text: `[OK] budget_util: ${runtimes.budget}%`, tone: "neon" },
                { text: "[WARN] board_override: standby", tone: "silver" },
                { text: ">>> all systems nominal <<<", tone: "neon" },
              ]}
            />

            {/* Mini runtimes */}
            <div className="mt-3 grid grid-cols-2 gap-2">
              {runtimes.jobs.map((job) => (
                <div
                  key={job.name}
                  className="relative border border-border/70 bg-card/40 p-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                      {job.name}
                    </span>
                    <CircleDot
                      className={`size-3 ${job.status === "RUN" ? "text-neon" : "text-silver/50"}`}
                    />
                  </div>
                  <div className="mt-1 font-display text-lg font-bold text-foreground">
                    {job.value}
                  </div>
                  <div className="mt-2 h-1 w-full overflow-hidden bg-border/40">
                    <div
                      className="h-full bg-neon"
                      style={{ width: `${job.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ CAPABILITIES ============ */}
      <section className="border-b border-border/70">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <SectionLabel index="// 01">CAPABILITIES</SectionLabel>
              <SectionHeading className="mt-4">
                Execution <span className="text-neon">Over</span> Explanation
              </SectionHeading>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
              Not slides. Not theory. Shipped autonomous pipelines that run while
              you sleep — governed, budgeted, and auditable.
            </p>
          </div>

          <div className="mt-10 grid gap-px overflow-hidden border border-border/70 bg-border/70 md:grid-cols-3 clip-corner">
            {[
              {
                icon: Workflow,
                title: "Autonomous Pipelines",
                body: "Multi-agent orchestration with heartbeat loops, delegation, and goal ancestry tracing back to the mission.",
              },
              {
                icon: Cpu,
                title: "Runtime Agnostic",
                body: "Manages org structure, not agent logic. Works with Claude Code, Codex, OpenClaw, or raw webhooks.",
              },
              {
                icon: Target,
                title: "Budget Governance",
                body: "Atomic per-agent cost limits. Auto-pause at 100% budget. The Board retains total override authority.",
              },
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} className="relative bg-black p-6">
                <span className="flex size-10 items-center justify-center border border-neon/40 bg-neon/10 text-neon clip-corner">
                  <Icon className="size-5" />
                </span>
                <h3 className="mt-4 font-display text-lg font-bold uppercase tracking-tight text-foreground">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ PROCESS ============ */}
      <section className="border-b border-border/70">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <SectionLabel index="// 02">OPERATING_LOOP</SectionLabel>
          <SectionHeading className="mt-4">
            From <span className="text-silver">Manual</span> to{" "}
            <span className="text-neon">Autonomous</span>
          </SectionHeading>

          <div className="mt-10 grid gap-4 lg:grid-cols-4">
            {[
              {
                step: "01",
                title: "Audit",
                body: "Map the 10-hour manual workflow. Identify every handoff, bottleneck, and human-in-the-loop checkpoint.",
                icon: Activity,
              },
              {
                step: "02",
                title: "Architect",
                body: "Design the agent org chart. Assign roles, bosses, reporting lines, and budget envelopes per agent.",
                icon: Layers,
              },
              {
                step: "03",
                title: "Deploy",
                body: "Spin up the control plane. Agents wake on heartbeats, execute, delegate, and report progress.",
                icon: GitBranch,
              },
              {
                step: "04",
                title: "Govern",
                body: "The Board audits. Budgets auto-pause runaway agents. Override authority stays human, always.",
                icon: Target,
              },
            ].map(({ step, title, body, icon: Icon }, i) => (
              <div
                key={step}
                className="relative border border-border/70 bg-card/40 p-5"
              >
                <CornerTicks />
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold tracking-[0.2em] text-neon">
                    {step}
                  </span>
                  <Icon className="size-4 text-muted-foreground" />
                </div>
                <h3 className="mt-3 font-display text-base font-bold uppercase tracking-tight text-foreground">
                  {title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {body}
                </p>
                {i < 3 && (
                  <ArrowRight className="absolute -right-3 top-1/2 hidden size-4 -translate-y-1/2 text-neon/40 lg:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTA STRIP ============ */}
      <section>
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden border border-neon/40 bg-gradient-to-br from-neon/10 via-black to-black p-8 clip-corner sm:p-12">
            <div className="pointer-events-none absolute inset-0 dot-texture opacity-40" />
            <div className="relative flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
              <div>
                <SectionLabel>ACQUISITION</SectionLabel>
                <h2 className="mt-4 max-w-2xl font-display text-3xl font-extrabold uppercase leading-tight tracking-tight text-foreground sm:text-4xl">
                  Want the engine behind this?{" "}
                  <span className="text-neon text-glow-neon">
                    Acquire the systems.
                  </span>
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
                  The core IP, deployment models, and workflow architecture are
                  open for corporate acquisition.
                </p>
              </div>
              <Link
                href="/ai-company"
                className="group inline-flex shrink-0 items-center gap-2 border border-neon bg-neon px-6 py-3.5 font-display text-sm font-bold uppercase tracking-[0.14em] text-neon-foreground transition-all hover:glow-neon clip-corner"
              >
                <Zap className="size-4" />
                Discuss Acquisition
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
