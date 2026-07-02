# Supabase Prompt System — Migration Design

## Overview

Replace Prisma + SQLite with Supabase Postgres + `supabase-js` client for the prompt
library CRUD system. The custom cookie-based admin auth stays as-is.

## Architecture

```
[Route Handlers / Server Components]
  → import { db } from "@/lib/db"
    → Supabase Admin Client (service_role key)
      → "agency" Supabase project Postgres
```

All DB access is server-side. The `@/lib/db` export keeps the same interface so
every consumer (API routes, server components, seed script) requires zero changes.

## Database

### Table: `prompts`

| Column       | Type              | Constraints                        |
| ------------ | ----------------- | ---------------------------------- |
| `id`         | `uuid`            | PK default `gen_random_uuid()`     |
| `title`      | `text`            | NOT NULL                           |
| `description`| `text`            | NOT NULL                           |
| `payload`    | `text`            | NOT NULL                           |
| `category`   | `text`            | NOT NULL                           |
| `created_at` | `timestamptz`     | NOT NULL default `now()`           |
| `updated_at` | `timestamptz`     | NOT NULL default `now()`           |

### RLS

Disabled on `prompts` — access is gated entirely by the existing admin cookie auth
in the API route layer. The `service_role` key bypasses RLS by default.

## Files Changed

| File | Action | Reason |
|------|--------|--------|
| `src/lib/db.ts` | Rewrite | Swap Prisma calls for supabase-js admin client |
| `prisma/schema.prisma` | Archive | No longer needed |
| `.env` | Update | Replace `DATABASE_URL` with Supabase connection vars |
| `package.json` | Update | Remove Prisma deps, add `@supabase/supabase-js` |
| `src/lib/seed.ts` | Rewrite | Use Supabase client instead of Prisma |

## db.ts API (unchanged surface)

```ts
import { db } from "@/lib/db";

// All existing call-sites use these shapes:
db.prompt.findMany({ orderBy: { createdAt: "desc" } });
db.prompt.create({ data: { title, description, payload, category } });
db.prompt.delete({ where: { id } });
db.prompt.findUnique({ where: { id } });
db.prompt.count();
db.$disconnect();
```

The replacement adapts these to `supabase-js`:
- `findMany` → `supabase.from("prompts").select("*").order("created_at", { ascending: false })`
- `create` → `supabase.from("prompts").insert({ ... }).select().single()`
- `delete` → `supabase.from("prompts").delete().eq("id", id)`
- `findUnique` → `supabase.from("prompts").select("*").eq("id", id).single()`
- `count` → `supabase.from("prompts").select("*", { count: "exact", head: true })`

## Seed Script

The seed (`src/lib/seed.ts`) replaces its Prisma writes with the Supabase client,
keeping the exact same seed data and skip-if-exists logic.

## Verification

1. Create the `prompts` table in the "agency" Supabase project (`execute_sql`)
2. Run advisors to check for issues
3. Run the seed script → confirm prompts appear in the database
4. Start the dev server → confirm `/prompts` renders prompts from Supabase
5. Test admin deploy + delete via `/admin` → confirm writes persist
