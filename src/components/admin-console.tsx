"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Rocket,
  Loader2,
  CheckCircle2,
  Trash2,
  Terminal,
  Hash,
  Plus,
  LogOut,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CornerTicks } from "@/components/ui-primitives";
import {
  PROMPT_CATEGORIES,
  CATEGORY_META,
  isPromptCategory,
} from "@/lib/prompts";

interface Prompt {
  id: string;
  title: string;
  description: string;
  payload: string;
  category: string;
  createdAt: string;
}

export function AdminConsole({ initialPrompts }: { initialPrompts: Prompt[] }) {
  const router = useRouter();
  const [prompts, setPrompts] = React.useState(initialPrompts);

  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [payload, setPayload] = React.useState("");
  const [category, setCategory] = React.useState<string>(PROMPT_CATEGORIES[0]);

  const [loading, setLoading] = React.useState(false);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);
  const [log, setLog] = React.useState<string[]>([
    "[admin] console online",
    "[admin] awaiting deploy command...",
  ]);

  const pushLog = (line: string) =>
    setLog((prev) => [...prev, line].slice(-7));

  const flashSuccess = (msg: string) => {
    setSuccess(msg);
    window.setTimeout(() => setSuccess(null), 3200);
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !description.trim() || !payload.trim()) {
      setError("All fields are required.");
      return;
    }
    if (!isPromptCategory(category)) {
      setError("Invalid category.");
      return;
    }

    setLoading(true);
    pushLog(`[deploy] pushing: "${title.trim().slice(0, 30)}..."`);

    try {
      const res = await fetch("/api/prompts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          payload,
          category,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        pushLog(`[deploy] REJECTED: ${data.error ?? "unknown"}`);
        setError(data.error ?? "Deploy failed.");
        setLoading(false);
        return;
      }

      pushLog("[deploy] OK: prompt live");
      setPrompts((prev) => [
        {
          id: data.id,
          title: data.title,
          description: data.description,
          payload: data.payload,
          category: data.category,
          createdAt: data.createdAt,
        },
        ...prev,
      ]);
      flashSuccess(`DEPLOYED: "${data.title}" is now live on /prompts.`);

      // Reset form.
      setTitle("");
      setDescription("");
      setPayload("");
      setCategory(PROMPT_CATEGORIES[0]);
      router.refresh();
    } catch {
      pushLog("[deploy] ERR: network failure");
      setError("Network error. Retry.");
    } finally {
      setLoading(false);
    }
  }

  async function onDelete(id: string, title: string) {
    setDeletingId(id);
    pushLog(`[delete] purging: "${title.slice(0, 24)}..."`);
    try {
      const res = await fetch(`/api/prompts/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        pushLog(`[delete] REJECTED: ${data.error ?? "unknown"}`);
        setError(data.error ?? "Delete failed.");
        return;
      }
      setPrompts((prev) => prev.filter((p) => p.id !== id));
      pushLog("[delete] OK: prompt purged");
      flashSuccess(`PURGED: "${title}" removed.`);
      router.refresh();
    } catch {
      pushLog("[delete] ERR: network failure");
      setError("Network error. Retry.");
    } finally {
      setDeletingId(null);
    }
  }

  async function onLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      {/* Deploy form */}
      <div className="lg:col-span-3">
        <div className="relative border border-border/70 bg-card/40 p-6 clip-corner sm:p-7">
          <CornerTicks />
          <div className="flex items-center justify-between border-b border-border/60 pb-4">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center border border-neon/50 bg-neon/10 text-neon clip-corner">
                <Rocket className="size-5" />
              </span>
              <div>
                <h2 className="font-display text-lg font-extrabold uppercase tracking-tight text-foreground">
                  Deploy Prompt
                </h2>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  INSTANT_PUBLISH_TO_LIBRARY
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onLogout}
              className="flex items-center gap-1.5 border border-border/70 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground transition-all hover:border-destructive/50 hover:text-destructive"
            >
              <LogOut className="size-3" />
              EXIT
            </button>
          </div>

          <form onSubmit={onSubmit} className="mt-5 space-y-4">
            {/* Title */}
            <Field label="PROMPT_TITLE" required>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={120}
                disabled={loading}
                placeholder="e.g. Cinematic Product Hero — Neon Noir"
                className="h-11 w-full border border-border/70 bg-black/60 px-3 font-sans text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-neon/50 focus:outline-none focus:ring-1 focus:ring-neon/30 disabled:opacity-50"
              />
              <CharCount value={title} max={120} />
            </Field>

            {/* Description */}
            <Field label="SHORT_DESCRIPTION" required>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={200}
                disabled={loading}
                placeholder="One-line summary of what this prompt does."
                className="h-11 w-full border border-border/70 bg-black/60 px-3 font-sans text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-neon/50 focus:outline-none focus:ring-1 focus:ring-neon/30 disabled:opacity-50"
              />
              <CharCount value={description} max={200} />
            </Field>

            {/* Category */}
            <Field label="CATEGORY" required>
              <div className="flex flex-wrap gap-2">
                {PROMPT_CATEGORIES.map((cat) => {
                  const active = category === cat;
                  const meta = CATEGORY_META[cat];
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      disabled={loading}
                      className={cn(
                        "flex items-center gap-1.5 border px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] transition-all disabled:opacity-50",
                        active
                          ? "border-neon bg-neon/15 text-neon"
                          : "border-border/70 text-muted-foreground hover:border-neon/40 hover:text-foreground"
                      )}
                    >
                      <span className="opacity-60">{meta.code}</span>
                      {cat}
                    </button>
                  );
                })}
              </div>
            </Field>

            {/* Payload */}
            <Field label="RAW_PROMPT_PAYLOAD" required>
              <div className="relative">
                <textarea
                  value={payload}
                  onChange={(e) => setPayload(e.target.value)}
                  rows={9}
                  disabled={loading}
                  placeholder={"Paste the full raw prompt here...\n\nYou are a senior...\nSTYLE: ...\nOUTPUT: ..."}
                  className="scroll-neon min-h-[180px] w-full resize-y border border-border/70 bg-black/60 p-3 font-mono text-[12.5px] leading-relaxed text-foreground placeholder:text-muted-foreground/40 focus:border-neon/50 focus:outline-none focus:ring-1 focus:ring-neon/30 disabled:opacity-50"
                />
                <span className="pointer-events-none absolute right-2 top-2 font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground/50">
                  {payload.length} chars
                </span>
              </div>
            </Field>

            {/* Error */}
            {error && (
              <div className="border border-destructive/50 bg-destructive/10 px-3 py-2.5 font-mono text-xs text-destructive">
                ERR: {error}
              </div>
            )}

            {/* Success */}
            {success && (
              <div className="flex items-center gap-2 border border-neon/50 bg-neon/10 px-3 py-2.5">
                <CheckCircle2 className="size-4 shrink-0 text-neon" />
                <span className="font-mono text-xs text-neon">{success}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="group flex h-12 w-full items-center justify-center gap-2 border border-neon bg-neon font-display text-sm font-bold uppercase tracking-[0.14em] text-neon-foreground transition-all hover:glow-neon disabled:cursor-not-allowed disabled:opacity-60 clip-corner"
            >
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  DEPLOYING...
                </>
              ) : (
                <>
                  <Plus className="size-4" />
                  DEPLOY PROMPT
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Side: console log + existing prompts */}
      <div className="space-y-6 lg:col-span-2">
        {/* Console log */}
        <div className="relative overflow-hidden border border-border/80 bg-[oklch(0.08_0.004_60)] clip-corner">
          <div className="flex items-center justify-between border-b border-border/70 bg-black/60 px-4 py-2.5">
            <div className="flex items-center gap-2">
              <span className="size-2.5 rounded-full bg-destructive/70" />
              <span className="size-2.5 rounded-full bg-silver/40" />
              <span className="size-2.5 rounded-full bg-neon/70" />
            </div>
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
              admin@console:~$
            </span>
            <Terminal className="size-3.5 text-neon/70" />
          </div>
          <div className="scanlines relative max-h-56 overflow-y-auto scroll-neon p-4 font-mono text-xs leading-relaxed">
            {log.map((line, i) => (
              <div key={i} className="flex gap-2">
                <span className="select-none text-muted-foreground/60">›</span>
                <span
                  className={cn(
                    "whitespace-pre-wrap break-words",
                    line.includes("REJECTED") || line.includes("ERR")
                      ? "text-destructive"
                      : line.includes("OK")
                      ? "text-neon"
                      : "text-foreground/90"
                  )}
                >
                  {line}
                </span>
              </div>
            ))}
            <div className="mt-1 flex items-center gap-2">
              <span className="text-neon">$</span>
              <span className="cursor-blink" />
            </div>
          </div>
        </div>

        {/* Existing prompts */}
        <div className="border border-border/70 bg-card/40">
          <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
            <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-foreground">
              <Hash className="size-3.5 text-neon" />
              LIVE PROMPTS
              <span className="text-muted-foreground">[{prompts.length}]</span>
            </span>
            <button
              type="button"
              onClick={() => router.refresh()}
              className="flex items-center gap-1.5 border border-border/70 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground transition-all hover:border-neon/50 hover:text-neon"
            >
              <RefreshCw className="size-3" />
              SYNC
            </button>
          </div>
          <div className="scroll-neon max-h-96 overflow-y-auto divide-y divide-border/50">
            {prompts.length === 0 ? (
              <div className="p-6 text-center font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
                {"// NO_PROMPTS_DEPLOYED"}
              </div>
            ) : (
              prompts.map((p) => {
                const meta = isPromptCategory(p.category)
                  ? CATEGORY_META[p.category]
                  : CATEGORY_META["Vibe Coding"];
                return (
                  <div
                    key={p.id}
                    className="group flex items-start justify-between gap-3 p-3 transition-colors hover:bg-neon/[0.03]"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "font-mono text-[9px] uppercase tracking-[0.16em]",
                            meta.accent
                          )}
                        >
                          {meta.code}
                        </span>
                        <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
                          {new Date(p.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "2-digit",
                          })}
                        </span>
                      </div>
                      <h4 className="mt-0.5 truncate font-display text-sm font-bold uppercase tracking-tight text-foreground group-hover:text-neon">
                        {p.title}
                      </h4>
                      <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                        {p.description}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onDelete(p.id, p.title)}
                      disabled={deletingId === p.id}
                      className="flex size-8 shrink-0 items-center justify-center border border-border/70 text-muted-foreground transition-all hover:border-destructive/50 hover:text-destructive disabled:opacity-50"
                      aria-label={`Delete prompt ${p.title}`}
                    >
                      {deletingId === p.id ? (
                        <Loader2 className="size-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="size-3.5" />
                      )}
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        {required && <span className="text-neon">*</span>}
        {label}
      </label>
      {children}
    </div>
  );
}

function CharCount({ value, max }: { value: string; max: number }) {
  return (
    <div className="mt-1 text-right font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground/60">
      {value.length}/{max}
    </div>
  );
}
