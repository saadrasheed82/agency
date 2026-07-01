"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Terminal, Menu, X, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";

const NAV_LINKS = [
  { href: "/", label: "Home", code: "00" },
  { href: "/prompts", label: "Prompts", code: "01" },
  { href: "/ai-company", label: "AI Company", code: "02" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b border-border/70 bg-black/80 backdrop-blur-xl transition-all",
        scrolled && "bg-black/95 border-neon/30"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo / brand */}
        <Link
          href="/"
          className="group flex items-center gap-2.5"
          aria-label="Saad Rashid — home"
        >
          <span className="relative flex size-8 items-center justify-center border border-neon/50 bg-neon/10 text-neon clip-corner">
            <Terminal className="size-4" />
            <span className="absolute -right-0.5 -top-0.5 size-1.5 bg-neon animate-pulse-neon" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-display text-sm font-extrabold uppercase tracking-[0.2em] text-foreground">
              Saad<span className="text-neon">.</span>Rashid
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              AI_AUTOMATION
            </span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "group relative flex items-center gap-2 px-4 py-2 font-mono text-xs uppercase tracking-[0.18em] transition-colors",
                  active
                    ? "text-neon"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <span className="text-[10px] opacity-60">{link.code}</span>
                <span className="font-sans text-sm font-semibold tracking-normal">
                  {link.label}
                </span>
                {active && (
                  <span className="absolute inset-x-3 -bottom-px h-px bg-neon glow-neon-sm" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right cluster: admin + mobile */}
        <div className="flex items-center gap-2">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="hidden border border-border/70 text-silver hover:border-neon/50 hover:text-neon hover:bg-neon/5 sm:flex"
          >
            <Link href="/login">
              <Shield className="size-3.5" />
              <span className="font-mono text-xs uppercase tracking-[0.18em]">
                Admin
              </span>
            </Link>
          </Button>

          {/* Mobile sheet */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden border border-border/70 text-foreground hover:border-neon/50 hover:text-neon"
                aria-label="Open navigation menu"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[280px] border-border/70 bg-black p-0"
            >
              <SheetTitle className="sr-only">Navigation menu</SheetTitle>
              <div className="flex h-16 items-center justify-between border-b border-border/70 px-4">
                <span className="font-display text-sm font-extrabold uppercase tracking-[0.2em]">
                  Menu<span className="text-neon">_</span>
                </span>
                <SheetClose asChild>
                  <Button variant="ghost" size="icon" aria-label="Close menu">
                    <X className="size-5" />
                  </Button>
                </SheetClose>
              </div>
              <nav className="flex flex-col p-2">
                {NAV_LINKS.map((link) => {
                  const active = isActive(link.href);
                  return (
                    <SheetClose asChild key={link.href}>
                      <Link
                        href={link.href}
                        className={cn(
                          "flex items-center justify-between border-l-2 px-4 py-4 transition-colors",
                          active
                            ? "border-neon bg-neon/5 text-neon"
                            : "border-transparent text-foreground hover:border-neon/40 hover:bg-neon/5"
                        )}
                      >
                        <span className="flex items-baseline gap-3">
                          <span className="font-mono text-[10px] text-muted-foreground">
                            {link.code}
                          </span>
                          <span className="font-sans text-sm font-semibold">
                            {link.label}
                          </span>
                        </span>
                        <span className="font-mono text-xs text-muted-foreground">
                          →
                        </span>
                      </Link>
                    </SheetClose>
                  );
                })}
                <SheetClose asChild>
                  <Link
                    href="/login"
                    className="mt-2 flex items-center gap-2 border border-border/70 px-4 py-3 font-mono text-xs uppercase tracking-[0.18em] text-silver transition-colors hover:border-neon/50 hover:text-neon"
                  >
                    <Shield className="size-3.5" />
                    Admin Access
                  </Link>
                </SheetClose>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      {/* Status strip */}
      <div className="hidden items-center gap-4 border-t border-border/50 bg-black/60 px-6 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground lg:flex">
        <span className="flex items-center gap-1.5">
          <span className="size-1.5 animate-pulse-neon bg-neon" />
          SYS_ONLINE
        </span>
        <span className="text-border">/</span>
        <span>UPTIME: 99.97%</span>
        <span className="text-border">/</span>
        <span>NODE: AUTOMATION_ENGINE</span>
        <span className="ml-auto text-silver">
          BUILD <span className="text-neon">v2.5.0</span>
        </span>
      </div>
    </header>
  );
}
