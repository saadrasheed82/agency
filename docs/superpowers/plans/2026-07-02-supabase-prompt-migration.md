# Supabase Prompt System Migration — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace Prisma + SQLite with Supabase Postgres + `supabase-js` admin client for the prompt library, keeping the custom cookie auth unchanged.

**Architecture:** Single admin client (`supabase-js` with `service_role` key) in `src/lib/db.ts` — same exported `db` shape, zero consumer changes. All DB access is server-side.

**Tech Stack:** Supabase Postgres (PG 17.6), `@supabase/supabase-js`, Next.js 15 (server components + route handlers)

## Global Constraints

- All existing imports from `@/lib/db` must continue to work with zero changes
- Custom cookie-based admin auth stays as-is
- Column names in Supabase use `snake_case` (`created_at`, `updated_at`); adapter maps to camelCase for consumers
- The `service_role` key is used server-side only — never exposed to the client
- RLS is disabled on `prompts` table — auth gated by existing cookie layer

---

### Task 1: Create prompts table in Supabase + configure environment

**Files:**
- Create: (Supabase table via MCP)
- Modify: `.env`

**Interfaces:**
- Consumes: Supabase "agency" project (`odhyfbdaeidpjoqijqab`)
- Produces: `prompts` table with columns: id (uuid PK), title, description, payload, category, created_at, updated_at

- [ ] **Step 1: Run SQL to create the prompts table**

```sql
create table if not exists public.prompts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  payload text not null,
  category text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

- [ ] **Step 2: Run SQL advisors to verify**

Use the `get_advisors` MCP tool with `type: "security"` and `type: "performance"`. Since RLS is intentionally disabled and only accessed via service_role, there should be no security warnings about missing RLS that need action (suppress warnings about RLS — it's by design).

- [ ] **Step 3: Update `.env`**

Replace the current SQLite DATABASE_URL with Supabase connection info:

```
# Supabase
SUPABASE_URL=https://odhyfbdaeidpjoqijqab.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
```

Get the service role key from the Supabase dashboard or MCP (`get_publishable_keys` — the `service_role` key, NOT the anon/publishable key).

---

### Task 2: Update dependencies

**Files:**
- Modify: `package.json`

**Interfaces:**
- Consumes: `.env` with SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY
- Produces: Clean dependency tree (Prisma removed, supabase-js added)

- [ ] **Step 1: Remove Prisma deps and add supabase-js**

```bash
bun remove @prisma/client prisma
bun add @supabase/supabase-js
```

- [ ] **Step 2: Remove Prisma scripts from package.json**

Remove these lines from the `scripts` section:
```
"db:push": "prisma db push",
"db:generate": "prisma generate",
"db:migrate": "prisma migrate dev",
"db:reset": "prisma migrate reset"
```

- [ ] **Step 3: Commit**

```bash
git add package.json .env
git commit -m "chore: swap Prisma/SQLite deps for @supabase/supabase-js"
```

---

### Task 3: Rewrite src/lib/db.ts

**Files:**
- Modify: `src/lib/db.ts`
- No consumers need changes — the exported `db` shape stays identical

**Interfaces:**
- Consumes: `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` from `process.env`
- Produces: `db` export with `db.prompt.findMany()`, `db.prompt.findUnique()`, `db.prompt.create()`, `db.prompt.delete()`, `db.prompt.count()`, `db.$disconnect()`

The adapter maps `snake_case` column names from Supabase to the `camelCase` property names that consumers expect. `createdAt` and `updatedAt` are returned as ISO strings (matching the `.toISOString()` calls already in consumers).

- [ ] **Step 1: Rewrite src/lib/db.ts**

Replace the entire file:

```typescript
import { createClient } from "@supabase/supabase-js";

function requireEnv(name: string): string {
  const val = process.env[name];
  if (!val) throw new Error(`Missing env var: ${name}`);
  return val;
}

const supabase = createClient(
  requireEnv("SUPABASE_URL"),
  requireEnv("SUPABASE_SERVICE_ROLE_KEY")
);

interface PromptRow {
  id: string;
  title: string;
  description: string;
  payload: string;
  category: string;
  created_at: string;
  updated_at: string;
}

interface Prompt {
  id: string;
  title: string;
  description: string;
  payload: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

function mapPrompt(row: PromptRow): Prompt {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    payload: row.payload,
    category: row.category,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

export const db = {
  prompt: {
    async findMany(
      opts?: { orderBy?: { createdAt?: "asc" | "desc" } }
    ): Promise<Prompt[]> {
      const ascending =
        opts?.orderBy?.createdAt === "desc" ? false : true;
      const { data, error } = await supabase
        .from("prompts")
        .select("*")
        .order("created_at", { ascending });
      if (error) throw error;
      return (data ?? []).map(mapPrompt);
    },

    async findUnique(opts: {
      where: { id: string };
    }): Promise<Prompt | null> {
      const { data, error } = await supabase
        .from("prompts")
        .select("*")
        .eq("id", opts.where.id)
        .single();
      if (error) return null;
      return mapPrompt(data as PromptRow);
    },

    async create(opts: {
      data: {
        title: string;
        description: string;
        payload: string;
        category: string;
      };
    }): Promise<Prompt> {
      const { data, error } = await supabase
        .from("prompts")
        .insert({
          title: opts.data.title,
          description: opts.data.description,
          payload: opts.data.payload,
          category: opts.data.category,
        })
        .select()
        .single();
      if (error) throw error;
      return mapPrompt(data as PromptRow);
    },

    async delete(opts: { where: { id: string } }): Promise<void> {
      const { error } = await supabase
        .from("prompts")
        .delete()
        .eq("id", opts.where.id);
      if (error) throw error;
    },

    async count(): Promise<number> {
      const { count, error } = await supabase
        .from("prompts")
        .select("*", { count: "exact", head: true });
      if (error) throw error;
      return count ?? 0;
    },
  },

  async $disconnect(): Promise<void> {
    // No-op for supabase-js (HTTP-based, no connection pool to close).
  },
};
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
bun run build 2>&1 | head -50
```

Expected: no type errors in `src/lib/db.ts`.

---

### Task 4: Rewrite seed script

**Files:**
- Modify: `src/lib/seed.ts`

**Interfaces:**
- Consumes: `db` from `@/lib/db` (same import, new implementation)
- Produces: Seeded prompts in Supabase `prompts` table

- [ ] **Step 1: Rewrite src/lib/seed.ts**

Replace the Prisma `db.$disconnect()` call with the Supabase version (still the same `db.$disconnect()` — it's now a no-op). The rest of the seed logic stays identical since `db.prompt.count()` and `db.prompt.create()` have the same interface.

Only change: remove the `$disconnect` from the `.finally()` chain since it's now a no-op, or keep it for consistency — either works. Keep it for consistency.

No code changes needed beyond what Task 3 already handled — the seed script calls `db.prompt.count()`, `db.prompt.create()`, and `db.$disconnect()`, all of which are supported by the new adapter.

- [ ] **Step 2: Run the seed script**

```bash
bun run src/lib/seed.ts
```

Expected output: "Seeded 6 prompts."

- [ ] **Step 3: Verify data in Supabase**

Use `execute_sql` to confirm:

```sql
select count(*) from prompts;
```

Expected: 6 rows.

---

### Task 5: Archive Prisma schema, clean up, verify build

**Files:**
- Archive: `prisma/schema.prisma`
- Remove: `prisma/` directory if empty after
- Verify: full `bun run build`

- [ ] **Step 1: Archive the Prisma schema**

```bash
mv prisma/schema.prisma prisma/schema.prisma.bak
```

If `prisma/` only contained the schema, remove the directory:

```bash
rmdir prisma 2>/dev/null; rm -f prisma
```

(Note: if `prisma/` has other files like migrations, leave it — only remove the schema file.)

- [ ] **Step 2: Full build verification**

```bash
bun run build
```

Expected: clean build, no Prisma-related errors.

- [ ] **Step 3: Verify dev server works**

```bash
bun run dev &
sleep 5
curl -s http://localhost:3000/prompts | head -20
```

Expected: the prompts page renders with seed data from Supabase.

- [ ] **Step 4: Commit**

```bash
git add src/lib/db.ts src/lib/seed.ts
git add -u  # tracks the prisma/ removal
git commit -m "feat: migrate prompt system from Prisma/SQLite to Supabase Postgres"
```

---

### Task 6: Verification

**Files:** (none — live testing)

- [ ] **Step 1: Confirm /prompts page loads with seed data**

Visit `http://localhost:3000/prompts` — expect 6 prompt cards from the seed data, filterable by category and searchable.

- [ ] **Step 2: Confirm admin login + CRUD works**

1. Navigate to `/admin` → redirects to `/login`
2. Login with `admin` / `#Saad#2005s`
3. Create a new prompt via the deploy form
4. Confirm it appears in the live prompts list
5. Delete the prompt via the trash button
6. Confirm it disappears

- [ ] **Step 3: Confirm prompt detail page works**

1. Click into any prompt card from `/prompts`
2. Confirm the detail page renders title, description, metadata, and full payload
3. Confirm the copy button works
4. Confirm the back link works
