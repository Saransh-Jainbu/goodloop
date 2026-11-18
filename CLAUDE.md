# GoodLoop: Context for AI Assistants

Read this before changing anything. It applies to every team member's AI tool (Claude Code, Cursor, Copilot, etc.). Full team rules live in `../WORK_SPLIT.md`.

## Project idea
GoodLoop is a volunteering discovery platform (CSET400C Capstone). Volunteers browse and filter local opportunities and register interest. Organisers create and manage listings and review who registered. Admins approve organiser accounts and remove inappropriate listings. The MVP is small on purpose: do not add features beyond it.

## MVP scope
| ID | Requirement | Owner |
|---|---|---|
| FR1 | Browse opportunities, view event details | Anousha |
| FR2 | Organisers create and update listings (title, description, date, location, cause) | Aditya |
| FR3 | Filter listings by date, cause, location | Anousha |
| FR4 | Users register interest; organisers review registrations | Samaksh (user side), Aditya (organiser view) |
| FR5 | Admin reviews organiser accounts, removes listings | Saransh |
| O4 | Lightweight relevance ordering (later) | Samaksh |
| - | Map (Leaflet + OpenStreetMap) | Samaksh |
| - | Setup, auth, DB, layout, deployment | Saransh |

## Stack (fixed; don't change without telling the team)
Next.js 15 App Router + TypeScript, PostgreSQL on **Neon** + Prisma 6 (multi-file schema in `prisma/schema/`), Auth.js v5 (credentials, JWT sessions, `role` on user: `USER | ORGANISER | ADMIN`), deployed on **Vercel**, Tailwind 3 + shadcn/ui, react-leaflet, zod, date-fns, **pnpm**.
Server Actions for writes, server components for reads. No separate backend.

## The core rule: one owner per file
**Only edit files in the area of the person you are working for.** Ask the user "who am I working for?" if it isn't clear. Ownership:

| Path | Owner |
|---|---|
| `prisma/schema/base.prisma`, `user.prisma`, `prisma/seed.ts` | Saransh |
| `prisma/schema/event.prisma`, `src/features/events/`, `src/app/organiser/` | Aditya |
| `prisma/schema/registration.prisma`, `src/features/map/`, `src/features/registrations/`, `src/app/me/` | Samaksh |
| `src/app/events/`, `src/features/discovery/` | Anousha |
| Everything else (`layout.tsx`, `page.tsx`, `(auth)/`, `admin/`, `features/auth|admin`, `components/ui`, `lib/`, `config/nav.ts`, `middleware.ts`, `package.json`, lockfile, `.env.example`, CODEOWNERS) | Saransh |

If a task needs a change in someone else's file, **don't make it**. Tell the user to ask the owner (message or GitHub issue), and meanwhile code against the agreed contract below.

## Contracts between areas (import these; never reimplement)
| Exported by | Thing | Used by |
|---|---|---|
| Aditya | `Event` type, `CAUSES` (`features/events/types.ts`) | Everyone |
| Anousha | `getEvents(filters)`, `getEventById(id)` (`features/discovery/queries.ts`) | Aditya |
| Samaksh | `<EventsMap events={Event[]} />`, `<LocationPicker value onChange />`, `<RegisterButton eventId />` | Anousha, Aditya |
| Samaksh | `getRegistrationsForEvent(eventId)`, `getMyRegistrations()`, later `rankEvents(events, user)` | Aditya, Anousha |
| Saransh | `auth()`, `getCurrentUser()`, `requireRole(role)`, `requireApprovedOrganiser()` (`lib/session.ts`) | Everyone |
| Saransh | shadcn components in `components/ui` | Everyone |

Stub versions already exist so everything compiles; owners replace the internals but **keep the signatures**. Build against fake data until the real version lands.

## Conventions
- **Never edit `package.json` or `pnpm-lock.yaml`.** Need a new package? Ask Saransh.
- **Neon:** `DATABASE_URL` is the pooled string (runtime), `DIRECT_URL` the direct one (migrations); both are required in `.env`. Each dev works on their own Neon branch; never run migrations or `db:seed` against the shared/production branch from a feature branch. Never paste connection strings into code, issues or chat.
- **Vercel:** `main` auto-deploys to production; PRs get preview deployments. Production runs `prisma migrate deploy` via `vercel-build`, so always commit generated migration folders and keep `main` building. Env vars are managed in Vercel by Saransh; add new ones to `.env.example` and tell him. Don't add `vercel.json` or change build scripts without asking.
- **Prisma:** only change your own `.prisma` file. Run `pnpm db:migrate --name <what>` after rebasing on `main`. Never edit existing migration folders.
- **Auth/permissions:** enforce on the server (`requireRole`, ownership checks in actions). Middleware is only a first gate. Organisers can only modify their own events; organisers must be `APPROVED` before creating listings.
- **Validation:** every Server Action validates input with zod before touching the DB.
- **Leaflet** needs the browser: load map components with `next/dynamic({ ssr: false })` from a client component and import `leaflet/dist/leaflet.css`.
- **Filters** live in URL search params (shareable links). In Next 15, `searchParams` and `params` are Promises: `await` them.
- Use `@/` import alias, `cn()` from `@/lib/utils`, shadcn components over custom ones. Handle empty, loading and error states; layouts must work on mobile.
- Never commit `.env*` or secrets. Don't hardcode credentials.

## Git workflow
Branch per task named `name/short-task`; PRs only into `main` (1 approval, squash merge); keep PRs under ~300 lines; before a PR run `git fetch && git rebase origin/main`, then `pnpm lint && pnpm typecheck && pnpm build`. Don't push to `main` directly. On a lockfile conflict take `main`'s version and run `pnpm install`.

## PR format
Use `.github/pull_request_template.md`: what and why, requirement ID, changes, screenshots for UI, and the checklist. CI (`.github/workflows/ci.yml`) must pass: prisma validate, lint, typecheck, build. Don't merge or ask to merge a red PR.

## Commands
`pnpm dev` · `pnpm lint` · `pnpm typecheck` · `pnpm build` · `pnpm db:migrate` · `pnpm db:seed` · `pnpm db:studio`

## How an AI should behave here
1. Confirm which owner's area the task is in; stay inside it.
2. Prefer the simplest MVP-level solution. Don't add libraries, abstractions, roles or features not listed above.
3. Reuse contracts and existing components; don't duplicate another owner's logic.
4. Keep PRs small and focused; explain anything that touches a contract signature.
5. If a request conflicts with these rules (editing a file you don't own, adding a dependency), say so and suggest the proper route instead of doing it.
