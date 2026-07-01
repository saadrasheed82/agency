import { Suspense } from "react";
import { ShieldAlert } from "lucide-react";
import { LoginForm } from "@/components/login-form";
import { SectionLabel, SectionHeading } from "@/components/ui-primitives";

export const metadata = {
  title: "Admin Access — Saad Rashid",
};

export default function LoginPage() {
  return (
    <section className="relative flex-1 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 grid-texture opacity-50" />
      <div className="pointer-events-none absolute left-1/2 top-0 size-[520px] -translate-x-1/2 rounded-full bg-neon/8 blur-[130px]" />

      <div className="relative mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="mb-10 text-center">
          <div className="flex justify-center">
            <SectionLabel index="// AUTH_GATE">
              <span className="flex items-center gap-1.5">
                <ShieldAlert className="size-3" />
                RESTRICTED_ZONE
              </span>
            </SectionLabel>
          </div>
          <SectionHeading className="mt-5 text-center">
            Secure <span className="text-neon">Access</span> Terminal
          </SectionHeading>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
            Operator authentication required. Credentials verified against the
            hardened access list. All attempts are logged.
          </p>
        </div>

        <Suspense
          fallback={
            <div className="border border-border/70 bg-card/40 p-12 text-center font-mono text-sm uppercase tracking-[0.16em] text-muted-foreground">
              [boot] initializing secure shell...
            </div>
          }
        >
          <LoginForm />
        </Suspense>
      </div>
    </section>
  );
}
