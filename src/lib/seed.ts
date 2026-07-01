/**
 * Seed the Prompt table with an initial engineering prompt library.
 * Run with: bun run src/lib/seed.ts
 */
import { db } from "@/lib/db";

const SEED_PROMPTS = [
  {
    title: "Cinematic Product Hero — Neon Noir",
    description:
      "Generates a high-contrast product hero shot with dramatic neon rim lighting, dark backdrop, and macro detail. Optimized for Sora/Midjourney v6.",
    category: "Image Prompts",
    payload: `You are a senior commercial cinematographer. Render a hero product shot of [PRODUCT].

STYLE: neon-noir, ultra-high contrast, deep blacks (#0A0A0A), single hard rim light in electric orange (#FF6B00), volumetric haze, shallow depth of field (f/1.4), macro texture detail, 85mm lens.

COMPOSITION: product centered-left, rule of thirds, negative space right for copy. Reflective floor with subtle grid. No text, no watermark.

OUTPUT: 8K, photoreal, cinematic color grade, film grain 12%.

NEGATIVE: clutter, oversaturation, flat lighting, cartoon, low-res.`,
  },
  {
    title: "Autonomous Outreach Agent — Persona",
    description:
      "Defines a relentless but polite cold-outreach agent persona with strict tone guardrails, fallback scripts, and reporting cadence.",
    category: "Agent Persona",
    payload: `ROLE: You are "Mercury", an autonomous business development agent.

CORE MISSION: Identify qualified leads, initiate contact, and book discovery calls — without ever sounding robotic or desperate.

OPERATING CONSTRAINTS:
- Tone: confident, concise, value-first. Max 3 sentences per message.
- Never beg. Never use "just following up" more than once per 14 days.
- Hard stop: if a prospect says "stop", mark DO_NOT_CONTACT and exit.

HEARTBEAT: every 4 hours — scan inbox, draft replies, log status.

REPORT FORMAT (end of day):
[LEADS_CONTACTED] n
[REPLIES_RECEIVED] n
[CALLS_BOOKED] n
[BLOCKED] n

DELEGATION RULE: if technical question detected, hand off to "Engineer" agent with full context thread.`,
  },
  {
    title: "Vibe-Coded SaaS Landing — Single Prompt",
    description:
      "One-shot prompt that scaffolds a complete dark-mode SaaS landing page with hero, features, pricing, and FAQ sections.",
    category: "Vibe Coding",
    payload: `Build a complete, responsive landing page in Next.js (App Router) + Tailwind + TypeScript.

REQUIREMENTS:
- Dark theme, pure black bg, neon accent (orange #FF6B00), Geist font.
- Sticky navbar, hero with H1 + sub + 2 CTAs, 3-col feature grid, pricing table (3 tiers), FAQ accordion, footer.
- Framer Motion entrance animations (stagger).
- Mobile-first, razor-sharp at 375px.
- shadcn/ui components only (Button, Card, Accordion).

OUTPUT: single page.tsx + one data file. No external CSS. No images — use lucide icons.`,
  },
  {
    title: "Explainer Video — 30s Tech Bumper",
    description:
      "Script + shot-list prompt for a punchy 30-second tech product bumper. Pacing, VO, and on-screen text included.",
    category: "Video Prompts",
    payload: `Create a 30-second explainer bumper for [PRODUCT].

ACT 1 (0-5s): HOOK — fast montage of the problem in 3 cuts. VO: "Manual work is killing your edge." On-screen: red counter ticking up.

ACT 2 (5-18s): SOLUTION — reveal product UI in motion, neon accent highlights. VO: "[PRODUCT] automates it in 3 minutes." On-screen stats animate in.

ACT 3 (18-26s): PROOF — 3 customer logos + metric callouts. VO: "Trusted by teams shipping 10x faster."

ACT 4 (26-30s): CTA — logo lockup + URL. VO: "Ship faster. [URL]."

STYLE: dark UI, orange accents, hard cuts, 120fps screen capture, subtle glitch transitions. Sound: pulsing synth, 128bpm.`,
  },
  {
    title: "Brand Mark — Industrial Brutalist Logo",
    description:
      "Generates a heavy, industrial logo lockup with monospace wordmark and a sharp geometric icon. Print + digital ready.",
    category: "Image Prompts",
    payload: `Design a brutalist logo for [BRAND_NAME].

ICON: single geometric mark, heavy stroke, asymmetric clip corner, no gradients. Must read at 16px.

WORDMARK: condensed monospace, all-caps, tight tracking (-0.04em), weight 800.

PALETTE: black #000, electric orange #FF6B00, metallic silver #C8C8CC.

DELIVERABLES: full lockup, icon-only, wordmark-only, mono variant.

MOOD: engineering, precision, zero-BS. Think industrial control panel meets modern dev tool.`,
  },
  {
    title: "QA Sentry Agent — Persona",
    description:
      "Autonomous quality-assurance agent that runs test suites, triages failures, and opens issues with full repro context.",
    category: "Agent Persona",
    payload: `ROLE: You are "Argus", an autonomous QA sentry.

MISSION: keep the build green. Run the test suite, triage every failure, and file reproducible issues.

WORKFLOW:
1. On heartbeat (every 30 min): run \`bun run test\`.
2. If green → log "BUILD_OK" and sleep.
3. If red → for each failing test:
   a. Capture stack trace + last commit touching the file.
   b. Attempt a 1-shot fix only if change is < 20 lines AND isolated.
   c. If fix risky → open GitHub issue with repro steps, expected vs actual, and suggested owner.
4. Never force-push. Never close an issue you didn't open.

REPORT (on failure): [FAILED_TESTS] n | [AUTO_FIXED] n | [ISSUES_FILED] n | [OWNERS_NOTIFIED] n

ESCALATION: 3 consecutive red builds → page the human "Board" with a summary.`,
  },
];

async function main() {
  console.log("Seeding prompts...");
  const count = await db.prompt.count();
  if (count > 0) {
    console.log(`Prompts already exist (${count}). Skipping seed.`);
    return;
  }
  for (const p of SEED_PROMPTS) {
    await db.prompt.create({ data: p });
  }
  console.log(`Seeded ${SEED_PROMPTS.length} prompts.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
