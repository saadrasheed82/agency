# API Key Auth for Prompt Submission

**Date:** 2026-07-04

## Overview

Allow an external caller to submit prompts via the existing `POST /api/prompts` endpoint using a Bearer token API key, without needing a browser-based admin session.

## Approach

Extend the existing auth check in `POST /api/prompts` to accept **either** the cookie-based admin session **or** a valid Bearer token. No separate endpoint, no middleware — minimal, one-file change.

## Changes

### 1. `src/lib/auth-constants.ts`

- Add `API_KEY` constant with value `"#Saad#2005s"`
- Export it

### 2. `src/lib/auth.ts`

- Add a new function `authenticateApiRequest(request: NextRequest): boolean`
  - Reads the `Authorization` header
  - Strips the `"Bearer "` prefix
  - Compares the remainder against `API_KEY`
- Re-export `API_KEY`

### 3. `src/app/api/prompts/route.ts`

- Change the auth guard in the `POST` handler from:
  ```ts
  if (!(await isAuthenticated())) { ... }
  ```
  to:
  ```ts
  if (!(await isAuthenticated()) && !authenticateApiRequest(request)) { ... }
  ```

That's the entire change. The GET handler remains open (no auth).

## Request Format

```http
POST /api/prompts
Authorization: Bearer #Saad#2005s
Content-Type: application/json

{
  "title": "...",
  "description": "...",
  "payload": "...",
  "category": "Image Prompts"
}
```

Categories: `Image Prompts`, `Video Prompts`, `Vibe Coding`, `Agent Persona`.

## Non-goals

- No rate limiting, key rotation, or key database
- No separate endpoint
- No new environment variables or config

## Files Changed

| File | Change |
|------|--------|
| `src/lib/auth-constants.ts` | Add `API_KEY` export |
| `src/lib/auth.ts` | Add `authenticateApiRequest()`, re-export `API_KEY` |
| `src/app/api/prompts/route.ts` | Update auth guard |
