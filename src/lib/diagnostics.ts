/**
 * Mock active-runtimes data for the home page terminal diagnostic box.
 * Pure presentation — emphasizes execution and technical strength.
 */

export interface RuntimeJob {
  name: string;
  value: string;
  pct: number;
  status: "RUN" | "IDLE";
}

export interface RuntimeSnapshot {
  agents: number;
  tasks: number;
  latency: number;
  budget: number;
  jobs: RuntimeJob[];
}

export function getActiveRuntimes(): RuntimeSnapshot {
  return {
    agents: 14,
    tasks: 1287,
    latency: 12,
    budget: 63,
    jobs: [
      { name: "lead-gen", value: "RUN", pct: 82, status: "RUN" },
      { name: "qa-sentry", value: "RUN", pct: 47, status: "RUN" },
      { name: "outreach", value: "RUN", pct: 91, status: "RUN" },
      { name: "reporting", value: "IDLE", pct: 0, status: "IDLE" },
    ],
  };
}
