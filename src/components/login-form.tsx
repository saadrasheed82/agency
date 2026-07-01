"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Shield,
  Lock,
  User,
  Terminal,
  AlertTriangle,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CornerTicks } from "@/components/ui-primitives";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/admin";

  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [show, setShow] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [log, setLog] = React.useState<string[]>([
    "[boot] secure shell initialized",
    "[auth] awaiting credentials...",
  ]);

  const pushLog = (line: string) =>
    setLog((prev) => [...prev, line].slice(-6));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    pushLog(`[auth] verifying: ${username || "<empty>"} ...`);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        pushLog(`[auth] DENIED: ${data.error ?? "unknown"}`);
        setError(data.error ?? "Login failed.");
        setLoading(false);
        return;
      }

      pushLog("[auth] OK: session established");
      pushLog("[route] → /admin");
      // Small delay so the user sees the success log.
      setTimeout(() => router.push(from), 450);
    } catch {
      pushLog("[auth] ERR: network failure");
      setError("Network error. Retry.");
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Form panel */}
      <div className="relative border border-border/70 bg-card/40 p-6 clip-corner sm:p-8">
        <CornerTicks />
        <div className="flex items-center gap-3 border-b border-border/60 pb-4">
          <span className="flex size-10 items-center justify-center border border-neon/50 bg-neon/10 text-neon clip-corner">
            <Shield className="size-5" />
          </span>
          <div>
            <h2 className="font-display text-lg font-extrabold uppercase tracking-tight text-foreground">
              Admin Access
            </h2>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              AUTHENTICATE_TO_DEPLOY
            </p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          {/* Username */}
          <div>
            <label
              htmlFor="username"
              className="mb-1.5 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground"
            >
              <User className="size-3 text-neon" />
              OPERATOR_ID
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading}
              placeholder="admin"
              className="h-11 w-full border border-border/70 bg-black/60 px-3 font-mono text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-neon/50 focus:outline-none focus:ring-1 focus:ring-neon/30 disabled:opacity-50"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="mb-1.5 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground"
            >
              <Lock className="size-3 text-neon" />
              ACCESS_KEY
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={show ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                placeholder="••••••••••"
                className="h-11 w-full border border-border/70 bg-black/60 px-3 pr-20 font-mono text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-neon/50 focus:outline-none focus:ring-1 focus:ring-neon/30 disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 border border-border/70 bg-black/60 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:border-neon/50 hover:text-neon"
                tabIndex={-1}
              >
                {show ? "HIDE" : "SHOW"}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-2 border border-destructive/50 bg-destructive/10 px-3 py-2.5">
              <AlertTriangle className="mt-0.5 size-4 shrink-0 text-destructive" />
              <span className="font-mono text-xs text-destructive">{error}</span>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={cn(
              "group flex h-12 w-full items-center justify-center gap-2 border border-neon bg-neon font-display text-sm font-bold uppercase tracking-[0.14em] text-neon-foreground transition-all hover:glow-neon disabled:cursor-not-allowed disabled:opacity-60 clip-corner"
            )}
          >
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                AUTHENTICATING...
              </>
            ) : (
              <>
                <Terminal className="size-4" />
                GRANT ACCESS
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </form>

        <p className="mt-4 font-mono text-[9px] uppercase leading-relaxed tracking-[0.14em] text-muted-foreground/60">
          {"// RESTRICTED. Unauthorized access is logged and traced. The Board"}
          {"retains override authority."}
        </p>
      </div>

      {/* Terminal log panel */}
      <div className="relative overflow-hidden border border-border/80 bg-[oklch(0.08_0.004_60)] clip-corner">
        <div className="flex items-center justify-between border-b border-border/70 bg-black/60 px-4 py-2.5">
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-destructive/70" />
            <span className="size-2.5 rounded-full bg-silver/40" />
            <span className="size-2.5 rounded-full bg-neon/70" />
          </div>
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
            secure@auth:~$
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-neon/70">
            ● LIVE
          </span>
        </div>
        <div className="scanlines relative p-4 font-mono text-xs leading-relaxed">
          {log.map((line, i) => (
            <div key={i} className="flex gap-2">
              <span className="select-none text-muted-foreground/60">›</span>
              <span
                className={cn(
                  "whitespace-pre-wrap break-words",
                  line.includes("DENIED") || line.includes("ERR")
                    ? "text-destructive"
                    : line.includes("OK") || line.includes("→")
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

        <div className="border-t border-border/60 bg-black/40 p-4">
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            SYSTEM_BRIEF
          </div>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground/80">
            Authenticated operators gain access to the prompt deployment
            console. Submit new prompts to the public library instantly — title,
            description, raw payload, and category.
          </p>
        </div>
      </div>
    </div>
  );
}
