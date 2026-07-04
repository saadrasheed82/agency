# API Key Auth Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Allow external callers to post prompts via Bearer token `#Saad#2005s`

**Architecture:** Extend existing `POST /api/prompts` auth guard to accept either cookie session or Bearer header. Single shared API key stored as a constant.

**Tech Stack:** Next.js 15, Supabase, TypeScript

## Global Constraints

- API key value is `"#Saad#2005s"` (matches existing admin password)
- Same POST body format: `title`, `description`, `payload`, `category`
- No new env vars, no new dependencies

---

### Task 1: Add API_KEY constant and auth helper

**Files:**
- Modify: `src/lib/auth-constants.ts`
- Modify: `src/lib/auth.ts`

**Interfaces:**
- Consumes: existing `VALID_SESSION_TOKEN`, `SESSION_COOKIE`
- Produces: `API_KEY` export, `authenticateApiRequest(request: NextRequest): boolean`

- [ ] **Step 1: Add API_KEY to auth-constants.ts**

Add after `VALID_SESSION_TOKEN`:
```ts
export const API_KEY = "#Saad#2005s";
```

- [ ] **Step 2: Add authenticateApiRequest to auth.ts**

Add import and function, re-export `API_KEY`:
```ts
import { NextRequest } from "next/server";
// add to existing exports:
export { API_KEY };

export function authenticateApiRequest(request: NextRequest): boolean {
  const header = request.headers.get("authorization") ?? "";
  const token = header.replace(/^Bearer\s+/i, "").trim();
  return token === API_KEY;
}
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/auth-constants.ts src/lib/auth.ts
git commit -m "feat: add API_KEY constant and authenticateApiRequest helper"
```

### Task 2: Update POST /api/prompts auth guard

**Files:**
- Modify: `src/app/api/prompts/route.ts`

**Interfaces:**
- Consumes: `authenticateApiRequest` from `@/lib/auth`

- [ ] **Step 1: Update import to include authenticateApiRequest**

```ts
import { isAuthenticated, authenticateApiRequest } from "@/lib/auth";
```

- [ ] **Step 2: Update auth guard in POST handler**

Change:
```ts
if (!(await isAuthenticated())) {
```
To:
```ts
if (!(await isAuthenticated()) && !authenticateApiRequest(request)) {
```

- [ ] **Step 3: Commit**

```bash
git add src/app/api/prompts/route.ts
git commit -m "feat: accept Bearer token in POST /api/prompts"
```
