# CLAUDE.md

> Orientation file for AI assistants working on this repo. Read this first.

## What this project is

`oleoa` is Leonardo's personal portfolio website. It has two halves:

1. **Public landing** — a single-page editorial site at `/` with sections Hero → Sobre (about + tech stack) → Trabalhos (selected work) → Experimentos → Contato.
2. **Private dashboard** — `/dashboard`, a small CMS where Leonardo edits the stacks, clients, and projects rendered on the public page.

Portfolio content (projects, stacks, clients) is stored in **Supabase Postgres** (accessed via `@supabase/supabase-js` with the service role key) and rendered with **Server Components**. Stack logos and project covers live on **Cloudflare R2**. Auth.js v5 (Credentials + JWT, with users in the Postgres `users` table) gates the dashboard; everything else is public.

Two projects live as their own routes rather than being linked out to: an interactive chess board and a "living calendar" life-weeks visualization.

## Tech stack

From [package.json](package.json):

- **Next.js `15.3.4`** (App Router) on **React `19.0.0`**
- **TypeScript `5`**, strict mode ([tsconfig.json](tsconfig.json))
- **Tailwind CSS `v4`** via `@tailwindcss/postcss` — v4 is CSS-first, there is **no `tailwind.config.*`**; theme tokens live in [app/globals.css](app/globals.css) inside `@theme`
- **shadcn/ui** ("new-york" style, `neutral` base) on Radix primitives — see [components.json](components.json), components in [components/ui/](components/ui/)
- **Supabase Postgres** via **`@supabase/supabase-js`** — server-side client in [db/client.ts](db/client.ts) built with the **service role key**, which bypasses RLS. RLS is enabled on every `public` table with **no policies** (see [db/schema.sql](db/schema.sql)), so a leaked anon/publishable key would read nothing. Reads use PostgREST's nested-relation syntax (`project_stacks(position, stacks(...))`) and row reordering uses SQL functions `reorder_projects` / `reorder_project_todos` / `reorder_project_links` invoked via `supabase.rpc()`. No ORM.
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

There is **no separate backend dev server** — Postgres lives in Supabase's cloud, R2 lives in Cloudflare. Just `npm run dev`.

## Directory map

- [app/](app/) — App Router routes plus a non-route [app/sections/](app/sections/) folder with the landing-page sections (`Hero`, `Sobre`, `Trabalhos`, `Experimentos`, `Contato`)
- [app/dashboard/](app/dashboard/) — the CMS: server-rendered [page.tsx](app/dashboard/page.tsx), client managers (projects / stacks / clients), dialogs, TanStack columns, sidebar, and **all Server Actions** in [app/dashboard/actions.ts](app/dashboard/actions.ts)
- [app/projects/chess/](app/projects/chess/) — interactive chess
- [app/projects/calendar/[[...slug]]/](app/projects/calendar/) — living-calendar with optional catch-all slug
- [components/editorial/](components/editorial/) — editorial-style primitives (`PageFrame`, `SectionHeader`, `Chip`, `Callout`, `EditorialButton`)
- [components/ui/](components/ui/) — shadcn primitives
- [components/LivingCalendar.tsx](components/LivingCalendar.tsx) — life-weeks viz
- [db/](db/) — backend layer: [schema.sql](db/schema.sql) (canonical Supabase Postgres schema — tables, indexes, `updated_at` triggers, reorder RPCs, RLS flags), [client.ts](db/client.ts) (lazy `supabase()` singleton built with the service role key), [queries.ts](db/queries.ts) (read-only async functions), [types.ts](db/types.ts) (`Stack`, `Client`, `Project`, `ProjectDetail`, `ProjectTodo`, `ProjectLink`, enums)
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
clients        (id uuid PK, name, avatar_url, email, company, notes,
                created_at, updated_at)
projects       (id uuid PK, name, description,
                position,
                type   text CHECK type   IN ('personal','commercial')       DEFAULT 'personal',
                status text CHECK status IN ('active','complete','paused')  DEFAULT 'active',
                is_public boolean DEFAULT true,
                link, source, year,
                client_id        uuid → clients ON DELETE SET NULL,
                budget_amount    numeric(12,2),
                budget_currency  currencies (enum: 'BRL','USD','EUR') DEFAULT 'BRL',
                budget_status    text CHECK IN ('pending','partial','paid','none') DEFAULT 'pending',
                created_at, updated_at)
project_stacks (project_id → projects, stack_id → stacks, position,
                PRIMARY KEY (project_id, stack_id))
project_todos  (id uuid PK, project_id → projects, title, done, position,
                created_at, updated_at)
project_links  (id uuid PK, project_id → projects, label, url, kind, position,
                created_at)
```

- **`currencies` enum** (`BRL`/`USD`/`EUR`) is the type of `projects.budget_currency`. `projects.type`, `projects.status`, `projects.budget_status` are `text CHECK` constraints, not enums.
- **Junction `project_stacks`** has a composite PK `(project_id, stack_id)` + explicit `position` for display order. `ON DELETE CASCADE` on both FKs.
- **`project_todos` and `project_links`** cascade-delete with their parent project. Each has its own `position` column for ordering inside a project.
- **`updated_at` triggers** keep timestamps fresh on `users`, `clients`, `projects`, `project_todos` without touching call sites.
- **Reorder RPCs** — `reorder_projects(ids uuid[])`, `reorder_project_todos(p_project_id uuid, ids uuid[])`, `reorder_project_links(p_project_id uuid, ids uuid[])` — atomic reorderings called from Server Actions via `supabase.rpc(...)`. `SECURITY INVOKER`, not definer.
- **RLS is ON with no policies on every public table.** App access uses the service role key (bypasses RLS). If an anon/publishable key ever leaks to the browser, it reads nothing.
- **TS field-name bridge** — [db/queries.ts](db/queries.ts) maps PostgREST rows to TS shapes where `id → _id`, `image_url → image`, `avatar_url → avatar` (see [db/types.ts](db/types.ts)). SQL columns use `snake_case`; TS uses `_id` / camelCase.

## Read / write patterns

**Reads (public + dashboard pages)** — all in Server Components, going through [db/queries.ts](db/queries.ts):
- [app/page.tsx](app/page.tsx) → fetches stacks + public projects, passes as props.
- [app/dashboard/page.tsx](app/dashboard/page.tsx) → fetches the full dashboard dataset (projects + clients + stacks + todos), passes to client managers.
- Project queries use PostgREST's nested selects (`project_stacks(position, stacks(...))`, optionally `clients(...)` and `project_todos(done)`) so stacks/clients/todo counts come back in a single round-trip. No N+1.

**Writes (dashboard only)** — Server Actions in [app/dashboard/actions.ts](app/dashboard/actions.ts), each starting with `requireAuth()` and going through `supabase()`:
- Project: `addProject`, `updateProject`, `deleteProject`, `setProjectCover` (FormData), `removeProjectCover`, `addStackToProject`, `removeStackFromProject`, plus reorder via `reorder_projects` RPC.
- Stack: `createStack`, `updateStack` (FormData optional), `deleteStack`.
- Client: create / update / delete on the `clients` table.
- Todos + links: CRUD + reorder via the corresponding `reorder_project_todos` / `reorder_project_links` RPCs.
- File uploads ride on `FormData` straight to the action — no separate upload endpoint. Old R2 blobs are deleted on cover/logo replacement to avoid orphans.
- Each action calls `revalidatePath("/")` (and any dashboard path that needs refreshing). Client components additionally call `router.refresh()` after the action returns.

## Auth wiring

- **Auth.js v5 (`next-auth@beta`)** with **Credentials provider** + **JWT** session strategy. Single user lives in `users`; password hash via `bcryptjs`.
- **Split config**: [auth.config.ts](auth.config.ts) (edge-safe — only `authorized` callback + sign-in page) is consumed by [middleware.ts](middleware.ts). [auth.ts](auth.ts) wires the Credentials provider — `authorize` looks up the user via `supabase().from("users").select(...).ilike("email", ...)` and verifies the bcrypt hash — and exports `auth`, `handlers`, `signIn`, `signOut`. The route handler at [app/api/auth/[...nextauth]/route.ts](app/api/auth/[...nextauth]/route.ts) re-exports `GET, POST` from `@/auth`.
- [middleware.ts](middleware.ts) runs `NextAuth(authConfig)` and protects `/dashboard(.*)` via the `authorized` callback (`!!auth?.user`). Unauthenticated visits to `/dashboard` redirect to `/sign-in`.
- **Layout has no auth provider** — Auth.js v5 doesn't need a React provider for server-side `auth()`. If a Client Component ever needs `useSession()`, wrap that subtree only with `<SessionProvider>` from `next-auth/react`.
- **Sign-in form** is a Client Component using `useActionState` calling `signInAction` from [app/actions/auth.ts](app/actions/auth.ts). Server-side that action calls `signIn("credentials", { email, password, redirectTo: "/dashboard" })` and translates `CredentialsSignin` errors to a UI message.
- **Sign-out** uses `signOutAction` from the same file inside a `<form action={...}>` in [PageFrame](components/editorial/PageFrame.tsx).
- **`PageFrame` is a Client Component** (it uses `usePathname`). Each Server Component caller does `await auth()` and passes `session={…}` — PageFrame uses it to conditionally render the dashboard link and the avatar/sign-out button.
- **Server Actions re-check `auth()`** from `@/auth` via `requireAuth()` in [app/dashboard/actions.ts](app/dashboard/actions.ts). Without this, a logged-out client could POST to action endpoints directly — middleware doesn't reliably gate Server Action POSTs.
- **Seed the user**: `npm run seed:user -- --email <email> --password <pwd> [--name <n>]`. Idempotent: `supabase().from("users").upsert({ email, password_hash, name }, { onConflict: "email" })`.

## Styling system

- Tailwind v4 with OKLch tokens defined as CSS variables in [app/globals.css](app/globals.css). Light values in `:root`, dark values in `.dark`, wired via `@custom-variant dark (&:is(.dark *))`.
- **Dark-mode tokens exist but no toggle is wired up in the UI** — nothing ever adds the `.dark` class.
- Editorial typography uses `display`, `mono`, `mono-label`, `drop-cap`, `reading` utility classes defined in `globals.css`.
- Compose classes with `cn()` from [lib/utils.ts](lib/utils.ts).

## Environment variables

Required (dev values currently live in [.env.local](.env.local)):

- `AUTH_SECRET` — Auth.js JWT/cookie encryption key (generate with `openssl rand -base64 32` or `npx auth secret`)
- `NEXT_PUBLIC_SUPABASE_URL` — `https://<project-ref>.supabase.co` (this repo's Supabase project ref lives in [.mcp.json](.mcp.json))
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` — Supabase publishable key (`sb_publishable_…`). Safe in the browser; **currently unused by app code** (no client-side Supabase client exists), kept for future use.
- `SUPABASE_SERVICE_ROLE_KEY` — Supabase service role JWT. **Server-only.** Used by [db/client.ts](db/client.ts) to bypass RLS; read by `auth.ts`, `db/queries.ts`, every Server Action, and `db/seed-user.ts`. App throws at import time if missing.
- `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME` — Cloudflare R2 credentials (server-only)
- `NEXT_PUBLIC_R2_PUBLIC_URL` — public bucket URL used to construct image URLs and the `next.config.ts` `remotePatterns` host

## Gotchas / things worth knowing before editing

- **No real-time updates.** The Postgres setup uses `revalidatePath` + `router.refresh()`. Two browser tabs editing the dashboard simultaneously will only see each other's changes after a manual refresh. Fine for a single-author CMS.
- **Tailwind v4 has no JS config.** Any theme extensions — e.g. the custom `grid-cols-48` used by [components/LivingCalendar.tsx](components/LivingCalendar.tsx) — go in `@theme` inside [app/globals.css](app/globals.css).
- **Auth0 / Clerk / Convex / Neon all appear in older commits but have been fully replaced** (Auth0/Clerk → Auth.js v5 + `users` Postgres table, Convex → Neon → Supabase + R2). Don't reintroduce them.
- **All DB access goes through the service role key** — there is no anon/publishable Supabase client in this app today. If you add one, keep write paths on the service role side and be mindful that RLS has no policies, so the anon key would read nothing without new policies.
- **Stack logos and project covers use `<img>`, not `next/image`** (R2 URLs). The R2 hostname is whitelisted in `next.config.ts` `images.remotePatterns`, so `next/image` would also work — switch case-by-case if blur/optimization is wanted.
- **`/` is statically prerendered** (`○`) at build time; it picks up changes only after a Server Action calls `revalidatePath("/")`.
- **`db/migrate_data.sql` is a one-shot migration snapshot** (Neon → Supabase export from 2026-04-24) kept in-repo for reference. Don't apply it to the live DB again; it's idempotent (ON CONFLICT DO NOTHING) but the data is already there.
- **No CI, no `vercel.json`, no tests.** `next lint` is the only automated check.

## Running the project

```
npm install
npm run dev
```

Dashboard access requires a user in the `users` table — seed one with `npm run seed:user -- --email <email> --password <pwd>` and then sign in at `/sign-in`.
