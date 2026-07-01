import Link from "next/link";
import { Github, Linkedin, Twitter, Terminal } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border/70 bg-black">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="flex items-center gap-3">
            <span className="flex size-7 items-center justify-center border border-neon/50 bg-neon/10 text-neon clip-corner">
              <Terminal className="size-3.5" />
            </span>
            <div className="flex flex-col">
              <span className="font-display text-sm font-extrabold uppercase tracking-[0.18em]">
                Muhammad Saad Rashid
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                AI_AUTOMATION_ENGINEER
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
            <Link
              href="/"
              className="transition-colors hover:text-neon"
            >
              Home
            </Link>
            <Link
              href="/prompts"
              className="transition-colors hover:text-neon"
            >
              Prompts
            </Link>
            <Link
              href="/ai-company"
              className="transition-colors hover:text-neon"
            >
              AI Company
            </Link>
            <Link
              href="/login"
              className="transition-colors hover:text-neon"
            >
              Admin
            </Link>
          </div>

          <div className="flex items-center gap-2">
            {[
              { Icon: Github, label: "GitHub" },
              { Icon: Linkedin, label: "LinkedIn" },
              { Icon: Twitter, label: "Twitter" },
            ].map(({ Icon, label }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="flex size-8 items-center justify-center border border-border/70 text-muted-foreground transition-all hover:border-neon/50 hover:text-neon hover:bg-neon/5"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-6 flex flex-col items-start justify-between gap-2 border-t border-border/50 pt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground sm:flex-row sm:items-center">
          <span>
            © {new Date().getFullYear()} M.SAAD.RASHID // ALL_SYSTEMS_OPERATIONAL
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-1.5 animate-pulse-neon bg-neon" />
            ENGINE_RUNNING // LATENCY 12ms
          </span>
        </div>
      </div>
    </footer>
  );
}
