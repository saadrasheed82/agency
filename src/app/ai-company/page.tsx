import Link from "next/link";
import {
  ArrowRight,
  Zap,
  Network,
  HeartPulse,
  ShieldCheck,
  Boxes,
  Building2,
  Crown,
  Cpu,
  Megaphone,
  FileText,
  Terminal,
} from "lucide-react";
import { TerminalBox } from "@/components/terminal-box";
import {
  SectionLabel,
  SectionHeading,
  CornerTicks,
} from "@/components/ui-primitives";

export default function AICompanyPage() {
  return (
    <>
      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden border-b border-border/70">
        <div className="pointer-events-none absolute inset-0 grid-texture opacity-50" />
        <div className="pointer-events-none absolute -right-32 top-10 size-[420px] rounded-full bg-neon/10 blur-[120px]" />

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <SectionLabel index="// PAPERCLIP_OS">
            OPEN_SOURCE_CONTROL_PLANE
          </SectionLabel>

          <h1 className="mt-6 max-w-4xl font-display text-4xl font-extrabold uppercase leading-[0.95] tracking-tight sm:text-5xl lg:text-6xl">
            Paperclip:{" "}
            <span className="text-silver">Open-Source Orchestration</span> for{" "}
            <span className="text-neon text-glow-neon">
              Zero-Human Companies.
            </span>
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            A control plane that manages organizational structure — not
            individual agent logic. Define roles, reporting lines, budgets, and
            heartbeats. Let agents execute, delegate, and report. The Board stays
            human.
          </p>

          <div className="mt-8 flex flex-wrap gap-2 font-mono text-[10px] uppercase tracking-[0.18em]">
            {[
              "OPEN_SOURCE",
              "RUNTIME_AGNOSTIC",
              "BUDGET_ENFORCED",
              "HEARTBEAT_DRIVEN",
              "BOARD_OVERRIDE",
            ].map((tag) => (
              <span
                key={tag}
                className="border border-border/70 bg-black/50 px-3 py-1.5 text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ============ ARCHITECTURE TEARDOWN ============ */}
      <section className="border-b border-border/70">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <SectionLabel index="// 01">ARCHITECTURE_TEARDOWN</SectionLabel>
              <SectionHeading className="mt-4">
                The Control{" "}
                <span className="text-neon">Plane</span>
              </SectionHeading>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
              Four structural pillars. No magic — just strict hierarchy,
              cadenced execution, bulletproof cost controls, and stack-agnostic
              wiring.
            </p>
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-2">
            <ArchitectureCard
              index="01"
              icon={Network}
              title="Org Chart Structure"
              accent
            >
              <p>
                A strict hierarchical framework where every agent has a
                designated <span className="text-neon">role</span>,{" "}
                <span className="text-neon">boss</span>,{" "}
                <span className="text-neon">reporting line</span>, and{" "}
                <span className="text-neon">goal ancestry</span> — tracing every
                sub-task back to the company&apos;s core mission.
              </p>
              <OrgChartPreview />
            </ArchitectureCard>

            <ArchitectureCard
              index="02"
              icon={HeartPulse}
              title="Heartbeat Loop"
            >
              <p>
                Agents wake up on designated{" "}
                <span className="text-neon">intervals</span> to execute,
                delegate, and report progress — entirely avoiding infinite
                looping and context wastage.
              </p>
              <HeartbeatTimeline />
            </ArchitectureCard>

            <ArchitectureCard
              index="03"
              icon={ShieldCheck}
              title="Budget & Governance"
            >
              <p>
                Bulletproof cost controls per agent.{" "}
                <span className="text-neon">Atomic task limits</span> force
                agents to auto-pause at 100% budget. The{" "}
                <span className="text-silver">Board (Human)</span> retains total
                override authority, hire approvals, and system auditing.
              </p>
              <BudgetBars />
            </ArchitectureCard>

            <ArchitectureCard
              index="04"
              icon={Boxes}
              title="Runtime Agnostic"
              accent
            >
              <p>
                Manages organizational structures,{" "}
                <span className="text-neon">not individual agent logic</span>.
                Works out of the box with any stack.
              </p>
              <RuntimeBadges />
            </ArchitectureCard>
          </div>
        </div>
      </section>

      {/* ============ TERMINAL DEMO ============ */}
      <section className="border-b border-border/70">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <SectionLabel index="// 02">LIVE_TRACE</SectionLabel>
          <SectionHeading className="mt-4">
            A Heartbeat, <span className="text-neon">Traced</span>
          </SectionHeading>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Watch an agent wake, execute, delegate, and report — then sleep until
            the next interval. No infinite loops. No context bleed.
          </p>

          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            <TerminalBox
              title="paperclipctl trace --agent=mercury"
              lines={[
                { text: "[04:00:00] HEARTBEAT: mercury woke", tone: "muted" },
                { text: "[04:00:01] EXEC: scan_inbox()", tone: "silver" },
                { text: "[04:00:03] → 3 new messages", tone: "default" },
                { text: "[04:00:04] DELEGATE: engineer@1", tone: "neon" },
                { text: "[04:00:06] REPORT: drafted 3 replies", tone: "silver" },
                { text: "[04:00:07] BUDGET: 18/100 used", tone: "default" },
                { text: "[04:00:08] SLEEP: next @ 08:00", tone: "muted" },
                { text: ">>> heartbeat complete, no loop <<<", tone: "neon" },
              ]}
            />
            <TerminalBox
              title="paperclipctl trace --agent=argus"
              lines={[
                { text: "[04:30:00] HEARTBEAT: argus woke", tone: "muted" },
                { text: "[04:30:01] EXEC: bun run test", tone: "silver" },
                { text: "[04:30:42] → 1 failure detected", tone: "danger" },
                { text: "[04:30:44] TRIAGE: auth/session.spec.ts", tone: "silver" },
                { text: "[04:30:51] FIX: isolated, <20 lines", tone: "default" },
                { text: "[04:31:02] ISSUE: skipped (auto-fix)", tone: "neon" },
                { text: "[04:31:03] REPORT: BUILD_OK", tone: "silver" },
                { text: "[04:31:04] SLEEP: next @ 05:00", tone: "muted" },
              ]}
            />
          </div>
        </div>
      </section>

      {/* ============ ACQUISITION ============ */}
      <section>
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden border border-neon/50 bg-gradient-to-br from-neon/15 via-black to-black p-8 clip-corner sm:p-12 lg:p-16">
            <div className="pointer-events-none absolute inset-0 dot-texture opacity-40" />
            <div className="pointer-events-none absolute -right-20 -top-20 size-[360px] rounded-full bg-neon/15 blur-[100px]" />

            <div className="relative grid gap-10 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-7">
                <SectionLabel>ACQUISITION_TARGET</SectionLabel>
                <h2 className="mt-5 font-display text-3xl font-extrabold uppercase leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                  The Core IP Is{" "}
                  <span className="text-neon text-glow-neon">
                    Open For Acquisition.
                  </span>
                </h2>
                <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
                  The control plane, custom deployment models, and the full
                  workflow architecture are available for corporate acquisition.
                  Bring it in-house and run your own zero-human company.
                </p>

                <ul className="mt-6 space-y-2.5">
                  {[
                    "Full Paperclip control-plane source + deployment tooling",
                    "Org-chart schema, heartbeat scheduler, budget governor",
                    "Custom agent templates + onboarding runbooks",
                    "Architecture whitepaper + transfer session",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 text-sm text-foreground/90"
                    >
                      <span className="mt-1.5 size-1.5 shrink-0 bg-neon" />
                      {item}
                    </li>
                  ))}
                </ul>

                <a
                  href="mailto:acquisition@example.com?subject=Paperclip%20Acquisition"
                  className="group mt-8 inline-flex items-center gap-2 border border-neon bg-neon px-7 py-4 font-display text-sm font-bold uppercase tracking-[0.14em] text-neon-foreground transition-all hover:glow-neon clip-corner"
                >
                  <Zap className="size-4" />
                  Discuss Acquisition
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </a>
              </div>

              {/* Acquisition dossier card */}
              <div className="lg:col-span-5">
                <div className="relative border border-border/70 bg-black/60 p-6">
                  <CornerTicks />
                  <div className="flex items-center justify-between border-b border-border/60 pb-3">
                    <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-neon">
                      <Terminal className="size-3" />
                      dossier.json
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                      CONFIDENTIAL
                    </span>
                  </div>
                  <dl className="mt-4 space-y-3 font-mono text-xs">
                    {[
                      ["target", "paperclip-os"],
                      ["type", "IP + ARCHITECTURE"],
                      ["stack", "runtime_agnostic"],
                      ["agents_supported", "unlimited"],
                      ["governance", "board_override"],
                      ["license", "negotiable"],
                      ["status", "OPEN"],
                    ].map(([k, v]) => (
                      <div key={k} className="flex items-center justify-between gap-4">
                        <dt className="text-muted-foreground">{k}:</dt>
                        <dd className="text-right font-bold text-silver">{v}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/* ---------- Sub-components ---------- */

function ArchitectureCard({
  index,
  icon: Icon,
  title,
  children,
  accent,
}: {
  index: string;
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <div
      className={`relative flex flex-col border bg-card/40 p-6 transition-colors ${
        accent
          ? "border-neon/40 hover:border-neon/70"
          : "border-border/70 hover:border-neon/40"
      }`}
    >
      <CornerTicks />
      <div className="flex items-center justify-between">
        <span
          className={`flex size-11 items-center justify-center border clip-corner ${
            accent
              ? "border-neon/50 bg-neon/10 text-neon"
              : "border-border/70 bg-black/50 text-silver"
          }`}
        >
          <Icon className="size-5" />
        </span>
        <span className="font-mono text-3xl font-extrabold text-border/80">
          {index}
        </span>
      </div>
      <h3 className="mt-5 font-display text-xl font-bold uppercase tracking-tight text-foreground">
        {title}
      </h3>
      <div className="mt-2.5 flex-1 space-y-4 text-sm leading-relaxed text-muted-foreground">
        {children}
      </div>
    </div>
  );
}

function OrgNode({
  icon: Icon,
  label,
  sub,
  top,
}: {
  icon: React.ElementType;
  label: string;
  sub: string;
  top?: boolean;
}) {
  return (
    <div
      className={`flex flex-col items-center gap-1 border px-3 py-2 text-center ${
        top
          ? "border-neon/60 bg-neon/10 text-neon"
          : "border-border/70 bg-black/50 text-foreground"
      }`}
    >
      <Icon className={`size-3.5 ${top ? "text-neon" : "text-silver"}`} />
      <span className="font-mono text-[10px] font-bold uppercase tracking-[0.1em]">
        {label}
      </span>
      <span className="font-mono text-[8px] uppercase tracking-[0.12em] text-muted-foreground">
        {sub}
      </span>
    </div>
  );
}

function OrgChartPreview() {
  return (
    <div className="border border-border/60 bg-black/40 p-4">
      <div className="flex flex-col items-center gap-3">
        <OrgNode icon={Crown} label="BOARD" sub="human override" top />
        <div className="h-4 w-px bg-neon/50" />
        <OrgNode icon={Building2} label="CEO_AGENT" sub="mission owner" />
        <div className="h-3 w-px bg-border" />
        <div className="grid w-full grid-cols-3 gap-2">
          <OrgNode icon={Megaphone} label="BD" sub="mercury" />
          <OrgNode icon={Cpu} label="ENG" sub="forge" />
          <OrgNode icon={FileText} label="QA" sub="argus" />
        </div>
        <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
          ↑ goal ancestry traces every task to BOARD mission
        </div>
      </div>
    </div>
  );
}

function HeartbeatTimeline() {
  const events = [
    { t: "00:00", label: "WAKE", tone: "neon" },
    { t: "00:01", label: "EXEC", tone: "silver" },
    { t: "00:04", label: "DELEGATE", tone: "silver" },
    { t: "00:06", label: "REPORT", tone: "silver" },
    { t: "00:08", label: "SLEEP", tone: "muted" },
  ];
  return (
    <div className="border border-border/60 bg-black/40 p-4">
      <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
        <span>interval: 4h</span>
        <span className="text-neon">no infinite loop</span>
      </div>
      <div className="mt-4 flex items-center">
        {events.map((e, i) => (
          <div key={e.label} className="flex flex-1 items-center">
            <div className="flex flex-col items-center gap-1.5">
              <span
                className={`size-2.5 ${
                  e.tone === "neon"
                    ? "bg-neon"
                    : e.tone === "silver"
                    ? "bg-silver/70"
                    : "bg-muted-foreground/50"
                }`}
              />
              <span className="font-mono text-[9px] font-bold uppercase tracking-[0.1em] text-foreground">
                {e.label}
              </span>
              <span className="font-mono text-[8px] text-muted-foreground">
                {e.t}
              </span>
            </div>
            {i < events.length - 1 && (
              <div className="mx-1 h-px flex-1 bg-border/60" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function BudgetBars() {
  const agents = [
    { name: "mercury", used: 18, status: "OK" },
    { name: "forge", used: 64, status: "OK" },
    { name: "argus", used: 88, status: "WARN" },
    { name: "rogue", used: 100, status: "PAUSED" },
  ];
  const color = (u: number) =>
    u >= 100 ? "bg-destructive" : u >= 85 ? "bg-neon" : "bg-silver/60";
  return (
    <div className="space-y-2.5 border border-border/60 bg-black/40 p-4">
      {agents.map((a) => (
        <div key={a.name}>
          <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.14em]">
            <span className="text-foreground">{a.name}</span>
            <span
              className={
                a.status === "PAUSED"
                  ? "text-destructive"
                  : a.status === "WARN"
                  ? "text-neon"
                  : "text-muted-foreground"
              }
            >
              {a.used}% · {a.status}
            </span>
          </div>
          <div className="mt-1 h-1.5 w-full overflow-hidden bg-border/40">
            <div className={`h-full ${color(a.used)}`} style={{ width: `${a.used}%` }} />
          </div>
        </div>
      ))}
      <div className="pt-1 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
        BOARD_OVERRIDE: active — hire approvals + audits retained
      </div>
    </div>
  );
}

function RuntimeBadges() {
  const runtimes = [
    { name: "Claude Code", icon: Terminal },
    { name: "OpenClaw", icon: Boxes },
    { name: "Codex", icon: Cpu },
    { name: "Raw Webhooks", icon: Network },
  ];
  return (
    <div className="border border-border/60 bg-black/40 p-4">
      <div className="grid grid-cols-2 gap-2">
        {runtimes.map(({ name, icon: Icon }) => (
          <div
            key={name}
            className="flex items-center gap-2 border border-border/70 bg-black/40 px-3 py-2.5"
          >
            <Icon className="size-3.5 text-neon" />
            <span className="font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-foreground">
              {name}
            </span>
          </div>
        ))}
      </div>
      <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
        manages ORG_STRUCTURE — never individual agent logic
      </p>
    </div>
  );
}
