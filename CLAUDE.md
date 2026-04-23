# CLAUDE.md

> Orientation file for AI assistants working on this repo. Read this first.

## What this project is

`oleoa` is Leonardo's personal portfolio website. It has two halves:

1. **Public landing** — a single-page editorial site at `/` with sections Hero → Sobre (about + tech stack) → Trabalhos (selected work) → Experimentos → Contato. Featured projects open as case-study pages at `/work/[slug]`.
2. **Private dashboard** — `/dashboard`, a small CMS where Leonardo edits the tech stacks and projects rendered on the public page.

Portfolio content (projects, stacks) is stored in **Neon Postgres** and rendered with **Server Components**. Stack logos and project covers live on **Cloudflare R2**. Auth.js v5 (Credentials + JWT, with users in Postgres) gates the dashboard; everything else is public.

Two projects live as their own routes rather than being linked out to: an interactive chess board and a "living calendar" life-weeks visualization.

## Tech stack

From [package.json](package.json):

- **Next.js `15.3.4`** (App Router) on **React `19.0.0`**
- **TypeScript `5`**, strict mode ([tsconfig.json](tsconfig.json))
- **Tailwind CSS `v4`** via `@tailwindcss/postcss` — v4 is CSS-first, there is **no `tailwind.config.*`**; theme tokens live in [app/globals.css](app/globals.css) inside `@theme`
- **shadcn/ui** ("new-york" style, `neutral` base) on Radix primitives — see [components.json](components.json), components in [components/ui/](components/ui/)
- **Neon Postgres** via **`@neondatabase/serverless 1.1.0`** — `neon()` HTTP tag for one-shot reads, `Pool` for transactions. No ORM; raw SQL in [db/queries.ts](db/queries.ts).
- **Cloudflare R2** via **`@aws-sdk/client-s3`** — S3-compatible bucket for stack logos and project covers. Helpers in [lib/storage.ts](lib/storage.ts).
- **Auth.js v5 `next-auth@beta`** with `bcryptjs` for password hashing — auth. Single user in the `users` Postgres table. Middleware-gated `/dashboard(.*)` via the `authorized` callback; **every Server Action also re-checks `auth()`** (defense in depth — a bypass via direct action POST returns "Unauthorized").
- **TanStack Table `8.21.3`** — dashboard project list
- **`cmdk`** — command palette used to pick stacks when editing a project
- `lucide-react`, `date-fns`, `tw-animate-css`
- Package manager: **npm** (no pnpm/bun lockfile)
- **No test framework configured**; `next lint` is the only gate

## Scripts

Defined in [package.json](package.json):

```
npm run dev         # next dev
npm run build       # next build
npm run start       # next start
npm run lint        # next lint
npm run seed:user   # node --env-file=.env.local --import tsx db/seed-user.ts
                    # usage: npm run seed:user -- --email <email> --password <pwd> [--name <n>]
```

There is **no separate backend dev server** — Postgres lives in Neon's cloud, R2 lives in Cloudflare. Just `npm run dev`.

## Directory map

- [app/](app/) — App Router routes plus a non-route [app/sections/](app/sections/) folder with the landing-page sections (`Hero`, `Sobre`, `Trabalhos`, `Experimentos`, `Contato`)
- [app/work/[slug]/](app/work/) — case-study page (Server Component, async)
- [app/dashboard/](app/dashboard/) — the CMS: server-rendered [page.tsx](app/dashboard/page.tsx), client managers, dialogs, TanStack columns, and **all Server Actions** in [app/dashboard/actions.ts](app/dashboard/actions.ts)
- [app/projects/chess/](app/projects/chess/) — interactive chess
- [app/projects/calendar/[[...slug]]/](app/projects/calendar/) — living-calendar with optional catch-all slug
- [components/editorial/](components/editorial/) — editorial-style primitives (`PageFrame`, `SectionHeader`, `Chip`, `Callout`, `EditorialButton`)
- [components/ui/](components/ui/) — shadcn primitives
- [components/LivingCalendar.tsx](components/LivingCalendar.tsx) — life-weeks viz
- [db/](db/) — backend layer: [schema.sql](db/schema.sql) (canonical Postgres schema), [client.ts](db/client.ts) (`sql` HTTP tag + `pool()` for tx), [queries.ts](db/queries.ts) (read-only async functions), [types.ts](db/types.ts) (`Stack`, `Project`, `ProjectNavEntry`)
- [lib/storage.ts](lib/storage.ts) — `uploadImage(file, prefix)` + `deleteImage(url)` against R2
- [lib/utils.ts](lib/utils.ts) — `cn()` (clsx + tailwind-merge) and `toTitleCase()`
- [public/stacks/](public/stacks/) — legacy SVG tech icons; live logos now come from R2
- [auth.ts](auth.ts) — Auth.js v5 config (Credentials provider with bcryptjs lookup against `users`)
- [auth.config.ts](auth.config.ts) — edge-safe shared config (no Node-only deps; consumed by middleware)
- [middleware.ts](middleware.ts) — Auth.js route guard wired to `auth.config.ts#authorized`
- [app/api/auth/[...nextauth]/route.ts](app/api/auth/[...nextauth]/route.ts) — re-exports Auth.js handlers
- [app/sign-in/](app/sign-in/) — custom sign-in page (server) + form (client) using `useActionState`
- [app/actions/auth.ts](app/actions/auth.ts) — `signInAction` (form-state action) and `signOutAction` (used by `PageFrame`)

## Routes at a glance

| Route | Purpose | Access |
|-------|---------|--------|
| `/` | Landing: Hero → Sobre → Trabalhos → Experimentos → Contato | public |
| `/work/[slug]` | Case-study page for featured projects (async Server Component, prerendered on demand) | public |
| `/sign-in` | Email + password form for the dashboard | public (form) |
| `/dashboard` | CMS for stacks + projects | Auth.js-protected (redirects to `/sign-in`) |
| `/projects/chess` | Interactive chess demo | public |
| `/projects/calendar/[[...slug]]` | Life-weeks visualization; slug encodes birthday / years-to-live / `notion` embed flag (e.g. `/projects/calendar/2005-12-24/80/notion`) | public |

## Data model (Postgres)

From [db/schema.sql](db/schema.sql):

```sql
users          (id uuid PK, email, password_hash, name,
                created_at, updated_at)
                -- UNIQUE INDEX on lower(email)
stacks         (id uuid PK, name, href, image_url, created_at)
projects       (id uuid PK, name, description, link, source,
                slug, client, role, year, cover_url,
                summary, problem, approach, outcome,
                featured, display_order, created_at, updated_at)
project_stacks (project_id → projects, stack_id → stacks, position,
                PRIMARY KEY (project_id, stack_id))
```

- **Junction table `project_stacks`** with explicit `position` column for stack order inside a project. `ON DELETE CASCADE` on both FKs cleans up on stack/project delete. Composite PK enforces "no duplicate stacks per project".
- **`display_order`** instead of `order` (reserved word in SQL). Queries alias it back to `"order"` so the TS shape matches the historical model.
- **`UNIQUE (slug) WHERE slug IS NOT NULL`** — partial unique index; null slugs are allowed for non-featured projects.
- **Field naming bridge** between SQL and TS: queries in [db/queries.ts](db/queries.ts) alias `id AS "_id"`, `image_url AS image`, `cover_url AS cover`, `display_order AS "order"` so consumers see the same field names that existed under Convex.

## Read / write patterns

**Reads (public + dashboard pages)** — all in Server Components:
- [app/page.tsx](app/page.tsx) → `Promise.all([listStacks(), listProjects()])` and passes as props.
- [app/work/[slug]/page.tsx](app/work/[slug]/page.tsx) → `getProjectBySlug(slug)` + `listFeaturedNav()` for prev/next.
- [app/dashboard/page.tsx](app/dashboard/page.tsx) → same pre-fetch, then passes props to client managers.
- `listProjects` and `getProjectBySlug` use a SQL subquery with `json_agg` to return each project's stacks pre-joined and ordered by `position`. No N+1.

**Writes (dashboard only)** — Server Actions in [app/dashboard/actions.ts](app/dashboard/actions.ts), each starting with `requireAuth()`:
- Project: `addProject`, `updateProject`, `deleteProject`, `setProjectCover` (FormData), `removeProjectCover`, `addStackToProject`, `removeStackFromProject`.
- Stack: `createStack`, `updateStack` (FormData optional), `deleteStack`.
- File uploads ride on `FormData` straight to the action — no separate upload endpoint. Old R2 blobs are deleted on cover/logo replacement to avoid orphans.
- Each action calls `revalidatePath("/")` (and `\`/work/${slug}\`` when the slug is known). Client components additionally call `router.refresh()` after the action returns.

## Auth wiring

- **Auth.js v5 (`next-auth@beta`)** with **Credentials provider** + **JWT** session strategy. Single user lives in `users`; password hash via `bcryptjs`.
- **Split config**: [auth.config.ts](auth.config.ts) (edge-safe — only `authorized` callback + sign-in page) is consumed by [middleware.ts](middleware.ts). [auth.ts](auth.ts) wires the Credentials provider (uses `bcryptjs` + Neon `sql`) and exports `auth`, `handlers`, `signIn`, `signOut`. The route handler at [app/api/auth/[...nextauth]/route.ts](app/api/auth/[...nextauth]/route.ts) re-exports `GET, POST` from `@/auth`.
- [middleware.ts](middleware.ts) runs `NextAuth(authConfig)` and protects `/dashboard(.*)` via the `authorized` callback (`!!auth?.user`). Unauthenticated visits to `/dashboard` redirect to `/sign-in`.
- **Layout has no auth provider** — Auth.js v5 doesn't need a React provider for server-side `auth()`. If a Client Component ever needs `useSession()`, wrap that subtree only with `<SessionProvider>` from `next-auth/react`.
- **Sign-in form** is a Client Component using `useActionState` calling `signInAction` from [app/actions/auth.ts](app/actions/auth.ts). Server-side that action calls `signIn("credentials", { email, password, redirectTo: "/dashboard" })` and translates `CredentialsSignin` errors to a UI message.
- **Sign-out** uses `signOutAction` from the same file inside a `<form action={...}>` in [PageFrame](components/editorial/PageFrame.tsx).
- **`PageFrame` is a Client Component** (it uses `usePathname`). Each Server Component caller does `await auth()` and passes `session={…}` — PageFrame uses it to conditionally render the dashboard link and the avatar/sign-out button.
- **Server Actions re-check `auth()`** from `@/auth` via `requireAuth()` in [app/dashboard/actions.ts](app/dashboard/actions.ts). Without this, a logged-out client could POST to action endpoints directly — middleware doesn't reliably gate Server Action POSTs.
- **Seed the user**: `npm run seed:user -- --email <email> --password <pwd> [--name <n>]`. Idempotent: runs `INSERT … ON CONFLICT (lower(email)) DO UPDATE SET password_hash = EXCLUDED.password_hash`.

## Styling system

- Tailwind v4 with OKLch tokens defined as CSS variables in [app/globals.css](app/globals.css). Light values in `:root`, dark values in `.dark`, wired via `@custom-variant dark (&:is(.dark *))`.
- **Dark-mode tokens exist but no toggle is wired up in the UI** — nothing ever adds the `.dark` class.
- Editorial typography uses `display`, `mono`, `mono-label`, `drop-cap`, `reading` utility classes defined in `globals.css`.
- Compose classes with `cn()` from [lib/utils.ts](lib/utils.ts).

## Environment variables

Required (dev values currently live in [.env.local](.env.local)):

- `AUTH_SECRET` — Auth.js JWT/cookie encryption key (generate with `openssl rand -base64 32` or `npx auth secret`)
- `DATABASE_URL` — Neon connection string (`postgresql://…?sslmode=require&channel_binding=require`)
- `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME` — Cloudflare R2 credentials (server-only)
- `NEXT_PUBLIC_R2_PUBLIC_URL` — public bucket URL used to construct image URLs and the `next.config.ts` `remotePatterns` host

## Gotchas / things worth knowing before editing

- **No real-time updates anymore.** Convex's `useQuery` re-ran on data changes; the Postgres setup uses `revalidatePath` + `router.refresh()`. Two browser tabs editing the dashboard simultaneously will only see each other's changes after a manual refresh. Fine for a single-author CMS.
- **Tailwind v4 has no JS config.** Any theme extensions — e.g. the custom `grid-cols-48` used by [components/LivingCalendar.tsx](components/LivingCalendar.tsx) — go in `@theme` inside [app/globals.css](app/globals.css).
- **Auth0 / Clerk / Convex appear in older commits but have been fully replaced** (Auth0/Clerk → Auth.js v5 + Neon `users` table, Convex → Neon + R2). Don't reintroduce them.
- **Stack logos and project covers use `<img>`, not `next/image`** (R2 URLs). The R2 hostname is whitelisted in `next.config.ts` `images.remotePatterns`, so `next/image` would also work — switch case-by-case if blur/optimization is wanted.
- **`/work/[slug]` is dynamic on demand** (`ƒ`); add `generateStaticParams()` if you want it prerendered.
- **`/` is statically prerendered** (`○`) at build time; it picks up changes only after a Server Action calls `revalidatePath("/")`.
- **No CI, no `vercel.json`, no tests.** `next lint` is the only automated check.

## Running the project

```
npm install
npm run dev
```

Dashboard access requires a user in the `users` table — seed one with `npm run seed:user -- --email <email> --password <pwd>` and then sign in at `/sign-in`.
