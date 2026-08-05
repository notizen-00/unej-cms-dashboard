# Unej CMS — Admin Dashboard

SvelteKit admin app for the Unej CMS headless backend. See [`PRD.md`](./PRD.md) for full product scope — this implements Phase 1 (§9): Auth, Sites, Site Membership, News, Pages, Users, Account Sessions.

## Stack

- SvelteKit (SSR, `adapter-node`)
- Tailwind CSS v4 + hand-built shadcn-svelte-style components (`bits-ui`, `tailwind-variants`) in `src/lib/components/ui`
- `marked` + `dompurify` for sanitized client-side Markdown preview
- No client-side HTTP library — all API calls happen server-side in `load`/`actions`, forwarding the session cookie to the backend (see "Auth architecture" below)

## Getting started

```sh
pnpm install
cp .env.example .env   # set PUBLIC_API_URL if the backend isn't on localhost:3000
pnpm dev
```

`pnpm check` runs `svelte-check`. `pnpm build && pnpm preview` builds for `adapter-node` and serves it.

## Auth architecture

The admin app and the `unej-cms` API are separate origins/domains in production, so the SvelteKit **server** mediates every API call instead of the browser calling the API directly:

- `src/hooks.server.ts` calls `GET /auth/me` on every request (forwarding the `unej_cms_session` cookie) and redirects to `/login` on 401.
- `src/lib/server/api/auth.ts`'s `login()` reads the API's `Set-Cookie` response and mirrors it into the admin app's own cookie jar, so the browser only ever talks to this app's origin.
- All reads/writes live in `src/lib/server/api/*` and are called from `+page.server.ts` `load`/`actions` — never from the client.

## Backend contract assumptions

There is no OpenAPI spec on the backend (PRD §13 gap #5), so `src/lib/types.ts` is hand-maintained against PRD prose. Notably, `GET /auth/me` is assumed to return `{ ...user, siteRoles: { siteId, siteName, role }[] }` — reconcile this against the real backend response once available. Other assumptions are flagged inline in `src/lib/types.ts` and `src/lib/server/api/sites.ts`.

## Known Phase 1 limitations (by design, see PRD §9.8 / §13)

- No build status/history UI — publishing shows an optimistic toast only.
- No self-service profile edit — `PATCH /users/:id` is super_admin-only on the backend.
- `editor`/`reviewer`/`author` share identical permissions (backend doesn't distinguish them yet).
