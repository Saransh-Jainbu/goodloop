# GoodLoop: Project Report (Mid-Evaluation Submission)

**Course:** CSET400C Capstone  
**Team:** Saransh (setup, auth, admin, registrations, maps, design system, deployment) · Aditya (events and organiser side) · Anousha (discovery and event pages) · Samaksh (not contributing for now; his areas moved to Saransh)  
**Live prototype:** https://goodloop-pi.vercel.app  
**Source code:** https://github.com/Saransh-Jainbu/goodloop (MIT licensed)  
**Last updated:** 19 November 2026

> **How to read this report.** GoodLoop is described as it will be at the final evaluation: the **MVP, which is built, deployed and tested**, plus the **organisations platform, which is designed, planned and broken into issues but not yet built**. Every table and diagram marks which is which. Planned items use the word **Planned**; in diagrams they have dashed borders. Nothing marked Planned is claimed to work today.

## Report checklist

| Required parameter | Section |
|---|---|
| Finalized system requirements | 2 |
| System architecture and design | 3 |
| Use-case diagram and appropriate UML, DFD or flow diagrams | 4 |
| Database or data design | 5 |
| Module or component design | 6 |
| Technology implementation | 7 |
| Working MVP, prototype or equivalent proof of concept | 8 |
| Test cases and initial validation | 9 |
| User or stakeholder feedback | 10 |
| Updated risk analysis | 11 |
| Performance or accuracy results | 12 |
| Screenshots or demo evidence | 14 (and Appendix B for planned screens) |
| Statement of work completed and work remaining | 13 |

---

## 1. Project overview

GoodLoop is a web platform, in the spirit of Luma but built for **social good**, where people discover and join local volunteering and welfare activities: blood-donation camps, food and clothes drives, clean-ups, teaching sessions and other community work.

**Problem.** Local welfare drives are advertised through scattered chat groups and posters. Volunteers cannot easily find them, organisers cannot tell how many people will show up, and the groups behind them have no shared place to recruit, announce and talk to their members.

**What GoodLoop becomes.** Two layers on one platform:

1. **Discovery and registration (built).** Volunteers browse, search, filter and map events, then register interest. Approved organisers publish and manage events and see who registered. Admins moderate.
2. **Organisations (planned).** Welfare groups create an organisation with a public profile. People join it (openly, by request or by invite). Organisation admins post announcements, members chat in a members-only channel, and events and drives live under the organisation, with goals and volunteer hours. Platform admins verify organisations and moderate content.

**Status at this submission.** Layer 1 is complete, live and tested. Layer 2 has a reviewed plan (`docs/PLAN_ORGANISATIONS.md`), a permission model, a data model and 36 sized, owned issues with acceptance criteria. Work on it starts after the team confirms the scope.

> **Scope note.** The cause list in the database is `ENVIRONMENT, EDUCATION, HEALTH, COMMUNITY, ANIMALS, OTHER`. Blood donation maps to HEALTH and food and clothes drives to COMMUNITY. Dedicated welfare categories and drive goals (for example "200 units of blood collected") are planned (issue #93).

---

## 2. Finalized system requirements

### 2.1 Stakeholders and roles

There are **two separate role systems**, so a person can be, for example, a platform Volunteer and also an Admin of one organisation and a Member of another.

| Role | Level | Status | Description |
|---|---|---|---|
| **Volunteer** (`USER`) | Platform | Built | Browses, filters and registers interest in events; manages registrations and profile |
| **Organiser** (`ORGANISER`) | Platform | Built | An individual approved by a platform admin; publishes and manages independent events and sees registrations |
| **Admin** (`ADMIN`) | Platform | Built | Approves organisers, removes events, sees platform stats and users. Will also verify organisations and handle reports |
| **Owner** | Organisation | Planned | Creates the organisation; transfers ownership or archives it |
| **Admin** | Organisation | Planned | Manages members, settings, join requests and announcements |
| **Organiser** | Organisation | Planned (proposed) | Creates and manages the organisation's events and sees their registrations; cannot manage members or settings |
| **Moderator** | Organisation | Planned | Moderates chat: delete messages, mute and ban from chat |
| **Member** | Organisation | Planned | Joins, reads announcements, chats, registers for the organisation's events |

Organisation roles form a ladder (Member < Moderator < Organiser < Admin < Owner): each role includes everything below it, so one helper, `requireOrgRole(orgId, minRole)`, can enforce permissions everywhere.

### 2.2 Functional requirements

**MVP (all built and live)**

| ID | Requirement | Status |
|---|---|---|
| FR1 | Browse opportunities and view event details (with map, add-to-calendar, copy link) | Built |
| FR2 | Organisers create, update, publish, cancel, duplicate and delete listings | Built |
| FR3 | Search and filter by keyword, cause, date range and location; sort soonest, newest or recommended; paginate; all in the URL | Built |
| FR4 | Volunteers register interest and cancel; organisers review, export and manage registrations | Built |
| FR5 | Admin approves or rejects organisers, removes events, sees platform stats and searches users | Built |
| FR6 | Sign-up, login, role-based access, profile (name, password) | Built |
| MAP | Events on an OpenStreetMap map with popups; click-to-pin location picker | Built, verified in a real browser |
| O4 | Relevance ordering ("Recommended") from the user's past registrations | Built |
| SEO | Search-engine metadata, sitemap, robots.txt, share image | Built |

**Organisations platform (planned; issue numbers in section 13)**

| ID | Requirement | Phase |
|---|---|---|
| FR7 | Any signed-in user can create an organisation; it stays hidden until a platform admin verifies it | 1 |
| FR8 | Public organisation profile and a searchable directory (by cause and location) | 1 |
| FR9 | Membership: join an open organisation, request to join, or join by invite link; leave; remove and ban members | 1 |
| FR10 | Organisation roles and member management; transfer ownership; archive | 1 |
| FR11 | Events belong to an organisation; org admins and organisers manage them; independent events keep working | 1 |
| FR12 | Announcements: post, edit, pin and delete; members see them on the organisation page and in a feed | 2 |
| FR13 | Notifications: in-app bell and list (announcements, join decisions, role changes, new events); email later | 2, 5 |
| FR14 | Members-only chat per organisation with moderation (delete, mute, ban, report), rate limits and unread counts | 3 |
| FR15 | Platform admin verifies, rejects and suspends organisations; reports queue; audit log; privacy controls | 4 |
| FR16 | Welfare extras: drives with goals and progress, volunteer hours and attendance, organisation analytics | 5 |

### 2.3 Non-functional requirements

| Area | Requirement | Status |
|---|---|---|
| Security | Passwords hashed (bcrypt); permissions enforced on the server for every action, not only in the UI; every input validated with zod; ownership checks on every write; no secrets in the repository | Met for the MVP; to be extended by the permission matrix tests |
| Privacy | Organisation admins see members' names and emails, so this is disclosed before joining; members can hide from public lists; account deletion anonymises chat messages | Planned (issue #91) |
| Usability and accessibility | Responsive, mobile first; labelled controls; skip link; reduced motion respected; WCAG AA colour contrast; automated audit with zero findings | Met and measured (section 9) |
| Performance | Page time to first byte well under 1 second; chat messages appear within about 5 seconds | Met for the MVP (section 12); chat target to be measured |
| Maintainability | One owner per area, small PRs, CI on every PR, code review | Met |
| Testability | Unit tests in CI; database-backed permission tests against a separate test branch | Unit tests built; permission tests planned (#63, #65) |
| Deployability | `main` deploys automatically; schema changes are committed migrations | Met |

### 2.4 Design decisions

| Decision | Status |
|---|---|
| Any signed-in user can create an organisation, pending admin verification | Agreed (issue #62: project owner and Anousha) |
| Join policy is set per organisation: Open, Request to join, or Invite only | Agreed (#62) |
| One members-only chat channel per organisation; polling transport first | Agreed (#62) |
| In-app notifications first, email later | Agreed (#62) |
| The platform `ORGANISER` role stays alongside organisations; existing events keep working | Agreed (#62) |
| All phases of the plan are in scope (there is ample time) | Agreed (#62) |
| An extra organisation-level "Organiser" role (event lead) between Moderator and Admin | **Proposed**; questions posted on #62, awaiting Anousha and Aditya |
| Org organisers publish under a verified organisation without needing separate platform-organiser approval | **Proposed**; awaiting answers on #62 |
| Chapters (parent and child organisations) | Deferred to a later phase |

### 2.5 Out of scope
Payments, direct messages, recurring events, ratings, a machine-learning recommender, and native mobile apps.

---

## 3. System architecture and design

GoodLoop is a single Next.js application with no separate backend. Server components read data, Server Actions perform writes, and everything talks to one PostgreSQL database. Dashed boxes are planned additions.

```mermaid
flowchart LR
    B[Browser] -->|HTTPS| M
    subgraph VC[Vercel: Next.js 15 App Router]
        M[Middleware: first gate by role]
        SC[Server components: reads]
        SA[Server Actions: writes, zod validation, permission checks]
        AU[Auth.js v5: credentials + JWT]
        PH["Permission helpers: requireRole, requireOrgRole"]:::planned
        CH["Chat API: list / send / delete, polled every 3-5 s"]:::planned
        NT["Notification fan-out on write"]:::planned
    end
    SC -->|Prisma 6| N[(Neon PostgreSQL)]
    SA -->|Prisma 6| N
    AU --> N
    PH --> N
    CH --> N
    NT --> N
    B -->|map tiles| OSM[OpenStreetMap]
    NT -.->|later| EM["Email provider (Resend)"]:::planned
    classDef planned stroke-dasharray: 5 5,stroke:#0f8a5f,fill:#ecfdf5,color:#064e3b;
```

### 3.1 Key design decisions

**Built**
- **Server-side authorization.** Middleware redirects early, but every Server Action re-checks the role and ownership, so a forged request cannot bypass the UI. This was tested by replaying forged requests (section 9).
- **JWT sessions** carry the user id and role, so role checks need no database round trip. The navbar reads the user's name from the database so profile edits show immediately.
- **Public discovery shows only published events;** drafts and cancelled events stay hidden. The organiser's email never reaches the page.
- **Filters live in URL search params,** so any search is a shareable link.
- **Maps load only in the browser** (Leaflet through `next/dynamic` with SSR off).
- **Pooled and direct database connections:** the app uses Neon's pooled string, migrations use the direct one.

**Planned (organisations)**
- **One permission layer.** `requireOrgRole(orgId, minRole)` and its helpers are the only place organisation roles are checked, mirroring `requireRole` for platform roles. Server actions never check roles inline, and every cell of the permission matrix (Appendix A) becomes a test.
- **Chat over polling, behind a small contract.** Vercel serverless functions cannot hold WebSocket connections. The chat uses short polling (every 3 to 5 seconds, only while the tab is visible) behind a transport-agnostic contract (`listMessages`, `sendMessage`, `deleteMessage`), so the transport can move to a managed real-time service (Pusher or Ably) later without changing the UI.
- **Notifications on write.** Announcements, join decisions and role changes create notification rows with one batched insert per fan-out. The navbar bell reads them.
- **Verification gate.** New organisations are hidden until a platform admin verifies them, the same idea as approving organiser accounts today. This is the main spam control.
- **Backward compatibility.** `Event.organisationId` is nullable, so independent events keep working; all schema changes are additive.

---

## 4. Use-case, UML, DFD and flow diagrams

### 4.1 Use-case diagram (final system)

Dashed items are planned.

```mermaid
flowchart LR
    V([Volunteer])
    O([Platform Organiser])
    OM([Organisation member / admin])
    A([Platform Admin])
    subgraph GoodLoop
        UC1(Sign up / log in / edit profile)
        UC2(Browse, search, filter and map events)
        UC3(Register interest / cancel / my registrations)
        UC4(Create, publish, cancel, duplicate events)
        UC5(View, manage and export registrations)
        UC6(Approve or reject organisers)
        UC7(Remove events; view stats and users)
        UC8("Create an organisation"):::planned
        UC9("Browse organisations and join / request / use invite"):::planned
        UC10("Manage members, roles, requests, settings"):::planned
        UC11("Post announcements; see member feed"):::planned
        UC12("Chat with members; moderate chat"):::planned
        UC13("Receive notifications"):::planned
        UC14("Verify or suspend organisations; handle reports"):::planned
        UC15("Record hours and drive progress"):::planned
    end
    V --> UC1 & UC2 & UC3 & UC8 & UC9 & UC13
    O --> UC1 & UC4 & UC5
    OM --> UC9 & UC10 & UC11 & UC12 & UC13 & UC15
    A --> UC1 & UC6 & UC7 & UC14
    classDef planned stroke-dasharray: 5 5,stroke:#0f8a5f,fill:#ecfdf5,color:#064e3b;
```

### 4.2 Data-flow diagram, level 0 (context)

```mermaid
flowchart LR
    V([Volunteer]) -- requests --> S((GoodLoop))
    S -- events, status, messages --> V
    O([Organiser / Org admin]) -- events, announcements --> S
    S -- registrations, requests --> O
    A([Platform admin]) -- approvals, moderation --> S
    S -- queues, stats --> A
    S <--> D[(Neon PostgreSQL)]
    S -- map tiles --> T[OpenStreetMap]
```

### 4.3 Data-flow diagram, level 1

```mermaid
flowchart LR
    U([Users]) --> P1[1. Authenticate and manage profile]
    P1 <--> DB1[(User)]
    U --> P2[2. Discover events]
    P2 <--> DB2[(Event)]
    U --> P3[3. Register interest]
    P3 --> DB3[(Registration)]
    U --> P4[4. Manage events]
    P4 --> DB2
    U --> P5[5. Moderate: platform admin]
    P5 --> DB1
    P5 --> DB2
    DB3 --> P4
    U --> P6["6. Organisations and membership"]:::planned
    P6 <--> DB4[(Organisation, Member, Invite)]:::planned
    U --> P7["7. Announcements and notifications"]:::planned
    P7 <--> DB5[(Announcement, Notification)]:::planned
    U --> P8["8. Chat"]:::planned
    P8 <--> DB6[(Message, ChatRead)]:::planned
    P5 --> DB7[(Report, AuditLog)]:::planned
    DB4 --> P4
    classDef planned stroke-dasharray: 5 5,stroke:#0f8a5f,fill:#ecfdf5,color:#064e3b;
```

### 4.4 Sequence diagram: organiser approval (built)

```mermaid
sequenceDiagram
    actor O as Organiser
    actor A as Admin
    participant App as GoodLoop
    participant DB as Neon
    O->>App: Sign up as organiser
    App->>DB: create User(role=ORGANISER, status=PENDING)
    A->>App: Open /admin
    App->>DB: list organisers
    A->>App: Approve (Server Action)
    App->>App: requireRole(ADMIN)
    App->>DB: status = APPROVED
    O->>App: Create event (allowed only when APPROVED)
```

### 4.5 Sequence diagram: register interest (built)

```mermaid
sequenceDiagram
    actor V as Volunteer
    participant App as GoodLoop
    participant DB as Neon
    V->>App: Open event page
    App->>DB: published event? capacity? already registered?
    App-->>V: Register / Registered + Cancel / Full / Ended / Log in
    V->>App: Register interest (Server Action)
    App->>App: signed in? not own event? not ended? not full?
    App->>DB: create Registration (unique user + event)
    App-->>V: "You're registered" (spots taken updates)
```

### 4.6 Sequence diagram: create and verify an organisation, then join (planned)

```mermaid
sequenceDiagram
    actor U as User
    actor PA as Platform admin
    actor M as Another user
    participant App as GoodLoop
    participant DB as Neon
    U->>App: Create organisation (zod-validated)
    App->>DB: Organisation(status=PENDING) + Member(role=OWNER)
    PA->>App: Verify (requireRole ADMIN)
    App->>DB: status = VERIFIED
    App->>DB: Notification to owner
    M->>App: Open /orgs/slug and press Join or Request
    App->>App: policy OPEN? REQUEST? INVITE_ONLY? banned?
    App->>DB: Member(ACTIVE) or Member(PENDING)
    U->>App: Approve request (requireOrgRole ADMIN)
    App->>DB: Member ACTIVE + Notification
```

### 4.7 Sequence diagram: announcement and chat (planned)

```mermaid
sequenceDiagram
    actor AD as Org admin
    actor M1 as Member A
    actor M2 as Member B
    participant App as GoodLoop
    participant DB as Neon
    AD->>App: Post announcement (requireOrgRole ADMIN)
    App->>DB: Announcement + one batched insert of Notifications
    M1->>App: Open app
    App-->>M1: Bell shows 1 unread
    M1->>App: sendMessage (ACTIVE member, rate limit, 1-1000 chars)
    App->>DB: Message
    loop every 3-5 s while the tab is visible
        M2->>App: listMessages(after = last id)
        App->>DB: indexed query on (org, time)
        App-->>M2: new messages
    end
```

### 4.8 State diagrams

Event status (built) and organisation and membership lifecycles (planned):

```mermaid
stateDiagram-v2
    [*] --> DRAFT
    DRAFT --> PUBLISHED: publish
    PUBLISHED --> DRAFT: unpublish
    PUBLISHED --> CANCELLED: cancel
    CANCELLED --> DRAFT: restore
```

```mermaid
stateDiagram-v2
    [*] --> PENDING: organisation created
    PENDING --> VERIFIED: platform admin verifies
    PENDING --> REJECTED: platform admin rejects
    VERIFIED --> SUSPENDED: platform admin suspends
    SUSPENDED --> VERIFIED: reinstated
    VERIFIED --> ARCHIVED: owner archives
```

```mermaid
stateDiagram-v2
    [*] --> PENDING: request to join
    [*] --> ACTIVE: open join or invite
    PENDING --> ACTIVE: admin approves
    PENDING --> [*]: denied or cancelled
    ACTIVE --> BANNED: admin or moderator bans
    ACTIVE --> [*]: leaves or removed
    BANNED --> ACTIVE: unbanned
```

### 4.9 Flow diagram: user journeys (final)

```mermaid
flowchart TD
    L[Landing page] --> E[Browse /events]
    E --> F[Search, filter, sort]
    F --> D[Open event page]
    D --> R{Logged in?}
    R -- No --> S[Sign up / log in]
    S --> D
    R -- Yes --> G[Register interest]
    G --> M[My registrations]
    L --> OR["Browse organisations"]:::planned
    OR --> OP["Organisation profile"]:::planned
    OP --> J["Join / request / invite"]:::planned
    J --> OA["Announcements, events, chat"]:::planned
    OA --> D
    classDef planned stroke-dasharray: 5 5,stroke:#0f8a5f,fill:#ecfdf5,color:#064e3b;
```

---

## 5. Database and data design

PostgreSQL on **Neon**, accessed through **Prisma 6** with a multi-file schema (`prisma/schema/`), one file per area. The first diagram is what exists today, with two migrations applied (`init`, `event`). The second diagram is the planned organisations model; none of it exists yet.

**Built (live today)**

```mermaid
erDiagram
    User ||--o{ Event : "creates (organiser)"
    User ||--o{ Registration : makes
    Event ||--o{ Registration : receives
    User ||--o{ Account : has
    User ||--o{ Session : has

    User {
        string id PK
        string email UK
        string passwordHash
        Role role "USER | ORGANISER | ADMIN"
        OrganiserStatus organiserStatus "NONE | PENDING | APPROVED | REJECTED"
        datetime createdAt
    }
    Event {
        string id PK
        string title
        string description
        Cause cause
        datetime startsAt
        datetime endsAt
        string address
        float lat
        float lng
        int capacity
        EventStatus status "DRAFT | PUBLISHED | CANCELLED"
        string organiserId FK
    }
    Registration {
        string id PK
        string userId FK
        string eventId FK
        datetime createdAt
    }
```

**Planned (organisations; all additive)**

*Core: organisations, members, invites and events*

```mermaid
erDiagram
    User ||--o{ OrganisationMember : "belongs to"
    Organisation ||--o{ OrganisationMember : has
    Organisation ||--o{ Invite : issues
    Organisation ||--o{ Event : "owns (optional)"

    Organisation {
        string id PK
        string slug UK
        string name
        JoinPolicy joinPolicy "OPEN | REQUEST | INVITE_ONLY"
        Visibility visibility "PUBLIC | PRIVATE"
        OrgStatus status "PENDING | VERIFIED | REJECTED | SUSPENDED | ARCHIVED"
        string createdById FK
    }
    OrganisationMember {
        string orgId FK
        string userId FK
        OrgRole role "OWNER | ADMIN | ORGANISER | MODERATOR | MEMBER"
        MemberStatus status "ACTIVE | PENDING | BANNED"
        datetime mutedUntil
    }
    Invite {
        string token UK
        string orgId FK
        OrgRole role
        datetime expiresAt
        int maxUses
    }
    Event {
        string id PK
        string organisationId FK "new, nullable"
    }
```

*Engagement: announcements, chat and notifications*

```mermaid
erDiagram
    Organisation ||--o{ Announcement : posts
    Organisation ||--o{ Message : "chat"
    User ||--o{ Notification : receives
    User ||--o{ Message : writes

    Announcement {
        string id PK
        string orgId FK
        string authorId FK
        string title
        boolean pinned
    }
    Message {
        string id PK
        string orgId FK
        string authorId FK
        string body
        datetime deletedAt
    }
    Notification {
        string id PK
        string userId FK
        NotifType type
        json payload
        datetime readAt
    }
```

*Moderation: reports and audit log*

```mermaid
erDiagram
    User ||--o{ Report : files
    Organisation ||--o{ AuditLog : records

    Report {
        string id PK
        string reporterId FK
        ReportTarget targetType "ORG | MESSAGE | ANNOUNCEMENT | USER"
        ReportStatus status "OPEN | RESOLVED | DISMISSED"
    }
    AuditLog {
        string id PK
        string actorId FK
        string orgId FK
        string action
        json metadata
    }
```

Also planned: `ChatRead (orgId, userId, lastReadAt)` for unread counts.

**Integrity and design rules**
- `Registration` has a unique pair `(userId, eventId)`, so nobody registers twice; deleting a user or event cascades. Cancelling deletes the row.
- Planned: `OrganisationMember` is unique on `(orgId, userId)`; the last Owner cannot be demoted or removed; banned and pending members never count as members; message deletion is a soft delete so moderation history is kept; read notifications are deleted after 60 days.
- **Migrations** are committed folders applied with `prisma migrate deploy` on each production deploy. Two are live. The `event` migration was rewritten to be safe on tables that already contain rows. All organisation changes will be additive, so existing events and users are untouched.
- **Seed data:** one admin, one demo organiser and 8 demo events covering blood donation, food and clothes drives, a river clean-up, tutoring, animal care, tree planting and a senior health check-up. The seed is idempotent, never changes an existing account's password, and every demo description is marked "(Demo listing)".
- **Privacy by design (planned):** the member list can be hidden; joining shows what organisation admins can see; account deletion removes memberships and registrations and anonymises messages; data export as JSON.

---

## 6. Module and component design

| Module | Path | Status | Responsibility |
|---|---|---|---|
| Auth and profile | `src/features/auth`, `src/lib/auth*.ts`, `src/app/me/profile` | Built | Sign-up and login, Auth.js config, JWT with role; edit name and change password |
| Session helpers | `src/lib/session.ts` | Built | `getCurrentUser()`, `requireRole()`, `requireApprovedOrganiser()` |
| Route protection | `src/middleware.ts` | Built | Redirects by role for `/admin`, `/organiser`, `/me` |
| Admin | `src/features/admin`, `src/app/admin` | Built | Stats, organiser approval, event removal, user search |
| Discovery | `src/features/discovery`, `src/app/events` | Built | Search, filters, sort, ranking, pagination, event page, calendar download |
| Events and organiser area | `src/features/events`, `src/app/organiser` | Built | Event CRUD, status, duplicate, dashboard, roster, CSV export (formula-injection safe) |
| Registrations | `src/features/registrations`, `src/app/me` | Built | Register and cancel, `RegisterButton`, `rankEvents`, My registrations (upcoming and past tabs) |
| Map | `src/features/map` | Built | Events map with popups; click-to-pin picker (Leaflet, browser only) |
| Design system and landing | `src/components`, `src/app/globals.css` | Built | Theme, navbar with mobile and user menus, logo, 404, error and loading pages, landing page |
| SEO | `src/app/robots.ts`, `sitemap.ts`, `opengraph-image.tsx`, `src/lib/site.ts` | Built | Metadata, sitemap, robots, share image, structured data |
| Organisation permissions | `src/lib/org-permissions.ts` | Planned | `requireOrgMember`, `requireOrgRole`, role ladder, table-driven tests |
| Organisations | `src/features/organisations`, `src/app/orgs`, `src/app/invite` | Planned | Create, profile, directory, join and requests, invites, member management, settings |
| Announcements and feed | `src/features/announcements` | Planned | Post, pin, edit, delete; member feed |
| Notifications | `src/features/notifications` | Planned | Fan-out helper, bell, notification list |
| Chat | `src/features/chat` | Planned | Contract, actions, polling UI, moderation, rate limits, unread counts |
| Platform moderation | `src/features/admin` (extended) | Planned | Verify and suspend organisations, reports queue, audit log |

**Route inventory**

| Built | Planned |
|---|---|
| `/`, `/events`, `/events/[id]`, `/events/[id]/ics`, `/login`, `/signup`, `/me`, `/me/profile`, `/organiser`, `/organiser/new`, `/organiser/[id]/edit`, `/organiser/[id]/registrations`, `/admin`, `/robots.txt`, `/sitemap.xml`, `/opengraph-image` | `/orgs`, `/orgs/new`, `/orgs/[slug]`, `/orgs/[slug]/chat`, `/orgs/[slug]/manage/{members,requests,settings}`, `/invite/[token]`, `/me/organisations`, `/feed`, `/notifications` |

**Contracts.** Each area exports fixed signatures (for example `getEvents(filters)`, `rankEvents(events, user)`, `<RegisterButton eventId />`, and in future `requireOrgRole`) so modules plug together and owners can change internals without breaking others. The ownership table is in `CLAUDE.md` and `.github/CODEOWNERS`.

---

## 7. Technology implementation

| Layer | Technology | Why |
|---|---|---|
| Framework | Next.js 15 (App Router) and TypeScript | Server components and Server Actions give one codebase for UI and backend; strong typing |
| UI | Tailwind CSS 3, shadcn/ui, lucide icons, Inter and Plus Jakarta Sans, raw WebGL on the landing page | Fast, consistent, accessible components with no extra runtime |
| Database | PostgreSQL on Neon, Prisma 6 | Relational integrity for registrations and memberships; serverless Postgres with branching |
| Auth | Auth.js v5, credentials provider, JWT sessions, bcrypt | Simple, no external identity dependency |
| Validation | zod on every Server Action | One schema for runtime validation and types |
| Maps | Leaflet, react-leaflet, OpenStreetMap | Free, no API key |
| Testing | Vitest (unit), scripted end-to-end checks, Playwright (screenshots) | See section 9 |
| Hosting | Vercel, automatic deploys from `main`, a preview per PR | Zero-ops deployment |
| CI | GitHub Actions: prisma validate, lint, typecheck, unit tests, build | Blocks a merge on failure |
| Planned | Resend (email), a managed real-time service (Pusher or Ably) only if polling proves too slow | Both optional and isolated behind small contracts |

**Engineering process.** Branch per task, pull requests into `main` only with squash merge, branch protection (a review, code-owner review and the required CI check), CODEOWNERS per area, a pull request template with a checklist, written code reviews of teammates' PRs, GitHub issues, milestones and a project board. The repository is public under the MIT License. Part of the code was written with AI assistance (documented in `CLAUDE.md`); every change goes through the same review, tests and CI as hand-written code.

**Codebase size (19 November 2026):** 98 source files and about 5,100 lines of TypeScript and TSX in `src`, 2 database migrations, 18 unit tests.

---

## 8. Working MVP and prototype

The prototype is **live** at https://goodloop-pi.vercel.app, connected to the production Neon database, and redeploys on every merge to `main`. Screenshots of each screen below are in section 14.

| Area | What works today |
|---|---|
| Landing page | Animated hero, features, how it works, trust section, call to action (screenshots 1, 2) |
| Accounts | Sign-up as volunteer or organiser; login with role redirects; organisers start pending; profile with name and password change (7, 8, 14, 15) |
| Discovery | Keyword search, cause, date and location filters, sort (soonest, newest, recommended), pagination; real map with popups; event page with spots left, add-to-calendar and copy link (3 to 6, 20) |
| Registration | Register and cancel from the event page, capacity and ended-event rules, My registrations with upcoming and past tabs (12, 13) |
| Organiser area | Dashboard with stats, create and edit with a map pin, publish, unpublish, cancel, duplicate, delete with confirmation, volunteer roster with CSV export, pending and rejected screens (16, 17, 21, 18) |
| Admin | Platform stats, approve or reject organisers, remove events, user search (19) |
| Platform | Responsive layout with mobile menu, accessible navigation, 404, error and loading pages, SEO metadata, sitemap and a share image (9 to 11) |
| Data | 8 seeded demo events, two migrations applied, rotated demo-account passwords |

**Not built yet:** everything in the Planned rows of sections 2, 5 and 6 (organisations, membership, announcements, notifications, chat, platform moderation of organisations, drives and volunteer hours).

---

## 9. Test cases and initial validation

### 9.1 Automated checks (run on every pull request)
`prisma validate`, ESLint, TypeScript typecheck, **18 unit tests** (Vitest) and `next build`. All pass on `main`. Unit tests cover the ranking function (10), the CSV formula-injection guard (3) and the discovery queries (5). The ranking code was deliberately broken twice (ignoring cause affinity, and not pushing registered events last), and each break made exactly the matching test fail, so these tests do not pass vacuously. A pull request also gets a Vercel preview build.

### 9.2 Scripted end-to-end and validation results

These ran against the real Neon database and the live site, with throwaway accounts and events that were deleted afterwards. The scripts are throwaway and are not committed; converting them into repository tests is the first task of the next phase (#63).

| Suite | Result | What it covered |
|---|---|---|
| Core flows (live site) | 54 of 55 | Public pages, filters, anonymous redirects, seeded logins, wrong password, sign-up and its rejections, role access, pending organiser blocked, admin approval, organiser create, edit and delete, replayed requests from another organiser denied, status kept on edit, admin removing an event |
| Registration and maps | 25 of 25 | Register, double registration, My registrations, roster visible only to the event's organiser, another user cannot cancel, organiser cannot register for own event, full and ended events, drafts hidden |
| Discovery from the database | 7 of 7 plus leak checks | Only published events; every filter; empty state; draft and cancelled pages leak nothing |
| Admin stats and profile | 20 of 20 | Stat cards match database counts; user search; profile and password rules; new password works and the old one does not |
| Recommended sort | 14 of 14 | Registered event goes last, same-cause event moves from position 7 to 1, signed-out and no-history users get soonest order, filters and paging unaffected |
| Navbar and design, tabs, registration smoke | 25 checks | Navbar for each role, mobile menu control, skip link, 404, tab behaviour, register and cancel after the redesign |
| Search-engine readiness | 23 of 23 | Title, description, Open Graph and Twitter tags, canonical link, structured data, robots rules, sitemap contents, share image is a 1200 by 630 PNG |
| Password rotation (live) | 5 of 5 | New passwords log in, old defaults are rejected |
| Accessibility audit (live, 11 pages) | **0 findings** (17 at the first run) | Language, title, one h1, heading order, landmarks, duplicate ids, ARIA references, form labels, button and link names |
| Browser screenshots (Chromium) | 21 captured | Every screen in section 14 rendered in a real browser, including maps with tiles and popups |

About 170 scripted checks passed in total. **One known minor failure:** an unknown event id shows the "not found" page but returns HTTP 200 instead of 404 (the page streams before the not-found is raised).

**Colour contrast (WCAG AA needs 4.5 to 1):** body text 16.8, muted text 5.4, white on primary 5.0, primary text 4.8, white on destructive 4.9. All pass.

### 9.3 Security validation
The strongest evidence is the authorization bug found in code review of PR #58 and its fix:
- **Reproduced on `main`:** an organiser sent a forged request that deleted another organiser's registration.
- **After the fix (PR #111):** the same forged request is blocked, the other registration survives, and a legitimate removal of one's own volunteer still works.
- A related spreadsheet formula-injection hole in the CSV export (a volunteer could register with the name `=HYPERLINK(...)`) was fixed and covered by tests.
- A repository-wide scan found no secrets or credentials in tracked files or history; default passwords were removed from the repo and rotated in production.

### 9.4 Defects found and fixed

| Finding | Found by | Status |
|---|---|---|
| Empty `AUTH_SECRET` and a malformed `AUTH_URL` broke authentication in production | Validation | Fixed |
| Editing a draft or cancelled event silently republished it | Review of PR #33 | Fixed |
| Migration added required columns without defaults (unsafe on non-empty tables) | Review of PR #33 and Copilot | Fixed |
| Teammates' commits were blocked from deploying on the free plan | Merge of PR #33 | Fixed (repository made public) |
| `declineRegistration` deleted by id without checking the event | Review of PR #58 | Fixed and verified (#111) |
| CSV export open to formula injection | Review of PR #58 | Fixed (#111) |
| Default passwords in the public README and live | Review | Removed and rotated (#103) |
| Navbar ARIA reference, duplicate logo ids, heading levels | Accessibility audit | Fixed (#106, #110, #111) |

### 9.5 Test plan for the organisations phase
- **Permission matrix tests:** a table-driven test for every role by action cell in Appendix A (14 actions across 7 columns), run against a dedicated Neon test branch that tests refuse to run against production (#63, #65).
- **Server Action tests:** allowed role, denied roles, logged-out users, banned and pending members, duplicate actions and the last-owner rule.
- **Chat:** non-members cannot list or send, deleted messages never leak their body, rate limit rejects floods, pagination is stable.
- **Load check:** measure the polling endpoint with a realistic number of concurrent members before declaring phase 3 done.
- **Manual end-to-end run** recorded in each phase's pull request, and the accessibility audit re-run on every new page.

### 9.6 Not yet tested
Behaviour on real phones and other browsers, concurrent registrations at the capacity limit (capacity is checked just before inserting, so two simultaneous registrations could exceed it by one), time-zone handling of event times, and keyboard and screen-reader behaviour (only the static audit was done).

---

## 10. User and stakeholder feedback

**Not collected yet.** The product has not been put in front of real volunteers or organisers, and this report does not claim any feedback. Planned before the final evaluation:
- a walkthrough with 5 to 8 volunteers (students and local NGO contacts) on a task script: find an event, filter it, register, find an organisation and join it;
- interviews with 1 or 2 organisers of blood-donation or food drives about how they run sign-ups and announcements today, and whether organisation profiles, announcements and chat match their needs;
- a short feedback form (ease of use, missing features), summarised in the final report.

Feedback will also be used to confirm which organisation features matter most.

---

## 11. Updated risk analysis

| Risk | Likelihood | Impact | Mitigation and current status |
|---|---|---|---|
| Permission bugs in the new organisation actions (the largest technical risk) | Medium | High | One set of helpers, table-driven matrix tests, replayed-request tests, review focused on ownership checks. A real bug of this kind was already found and fixed in the MVP |
| Chat abuse and spam | Medium | High | Organisation verification, members-only chat, rate limits, moderation tools, reports, audit log (phases 3 and 4) |
| Privacy of member data | Medium | High | Disclosure before joining, option to hide from lists, account deletion, data export (#91) |
| Polling load on the database and free-tier limits | Medium | Medium | Poll only while the tab is visible, indexed queries, small pages; load check before sign-off; managed real-time service as a fallback |
| Scope growth (about 36 new tasks) | Medium | Medium | Independent, demoable phases; team sign-off recorded on #62; phases 1 and 2 are the must-have core |
| A team member is not contributing | Medium | Medium | Samaksh's areas were reassigned and built; issue owners can be rebalanced; sizes are visible on the board |
| Open role-hierarchy decision (org-level Organiser, relationship to platform organisers) | Medium | Medium | Questions posted on #62; the permission matrix is written so one more role is a small change |
| Local development and tests ran against the production database | Medium | High | **Open.** A separate Neon dev and test branch is being set up; tests will refuse to run against production |
| A database password was pasted into chat during setup | Medium | High | **Open.** Rotate the credential; never commit `.env*` (the history was scanned and is clean) |
| Misconfigured environment variables break production | Medium | High | Occurred twice and was fixed. `.env.example` documents them; the live site is re-checked after each change |
| Code written with AI assistance may contain subtle defects | Medium | Medium | Same review, tests and CI as hand-written code; reviews have already caught real defects |
| Licensing and ownership (the MIT license needs every contributor's agreement; the university may have IP rules) | Low | Medium | Confirm with all contributors and check the course policy before relying on it |
| Fake or abusive listings | Medium | High | Admin approval of organisers; organisation verification; admin removal; reports queue |
| Free-tier limits (Neon, Vercel) | Low | Medium | Usage is low; monitor |

---

## 12. Performance and accuracy results

Measured with `curl` against the live site on 19 November 2026 from one location, three samples each. These are indicative, not a load test.

| Page | Status | Time to first byte | Total time (average) | Size |
|---|---|---|---|---|
| `/` (landing) | 200 | 0.39 to 0.44 s | 0.47 s | 106 KB |
| `/events` | 200 | 0.31 to 0.40 s | 0.47 s | 93 KB |
| `/events?sort=recommended` | 200 | 0.31 to 0.39 s | 0.43 s | 94 KB |
| `/events/<id>` | 200 | 0.34 to 0.57 s | 0.48 s | 46 KB |
| `/login` | 200 | 0.31 to 0.40 s | 0.36 s | 22 KB |
| `/sitemap.xml` | 200 | 0.39 to 0.40 s | 0.40 s | 1 KB |

- **Targets:** time to first byte under 1 second (met on every page).
- **Bundle sizes** from the production build: 103 KB of JavaScript shared by all pages, and between 103 and 122 KB first-load JavaScript per route.
- **Rendering:** the landing shader runs at half resolution, pauses off-screen and shows a static frame for visitors who prefer reduced motion.
- **Ranking accuracy:** there is no machine-learning component. The "Recommended" sort is a deterministic score (how soon, how often the user registered for that cause, distance when known) with 10 unit tests and a 14-check end-to-end run; no user study has been done.
- **Chat (planned), estimate not yet measured:** with polling every 4 seconds, 200 members chatting at once is about 50 requests per second against an indexed query on `(organisation, time)`. This will be load-checked before phase 3 is closed, and a managed real-time service is the fallback.
- **Not yet measured:** database query latency under load, Lighthouse scores and real-device performance.

---

## 13. Statement of work

### 13.1 Completed
- **Foundation:** repository, CI with unit tests, pull request template, CODEOWNERS, branch protection, MIT license, public repository, project board and milestones.
- **Platform:** Next.js app, role-based middleware, design system with navbar and mobile menu, logo and favicon, accessible 404, error and loading pages, SEO (metadata, sitemap, robots, share image).
- **Data:** Neon database, two migrations, idempotent seed with demo events.
- **Accounts:** sign-up, login, roles, organiser approval, profile and password change; no default passwords.
- **Discovery (FR1, FR3, O4):** search, filters, sort including Recommended, pagination, event page, calendar download, real database queries.
- **Registration (FR4):** register and cancel, capacity and ended rules, My registrations with tabs.
- **Organiser area (FR2, FR4):** event CRUD, status, duplicate, dashboard, roster with safe CSV export.
- **Maps:** events map with popups and click-to-pin picker.
- **Admin (FR5):** organisers, event removal, stats, user search.
- **Quality:** about 170 scripted checks, 18 unit tests, a security bug reproduced and fixed, an accessibility audit down to zero findings, written reviews of teammates' PRs.
- **Planning:** the organisations plan (roles, permission matrix, data model, phases) and 36 sized issues with acceptance criteria, grouped in six milestones and linked under epic #61.
- **Production deployment** on Vercel with automatic deploys, verified end to end.

### 13.2 Team contributions (pull requests merged into `main`)

| Member | Merged PRs | Main contributions |
|---|---|---|
| Saransh | 16 | Setup and deployment, auth and profile, admin, registrations, maps, design system, landing page, seed, tests, SEO, security and accessibility fixes, plan and report |
| Aditya | 3 | Event model, organiser dashboard and forms, event status and duplication, roster and CSV export, security and accessibility fixes (#33, #58, #111) |
| Anousha | 3 | Discovery UI, search, sort, pagination, event page redesign, calendar download, Recommended sort (#31, #102, #110) |
| Samaksh | 0 | No contributions so far; his areas were reassigned and built |

### 13.3 Remaining for the final evaluation

**MVP follow-ups**

| Item | Issue | Owner |
|---|---|---|
| Keyboard and screen-reader accessibility checks | #45 | Saransh |
| Per-event page titles, share cards and structured data | #112 | Anousha |
| Create a separate Neon dev and test branch; rotate the database credential | new | Saransh |
| Database-backed automated tests (permissions, actions) | #63 | Saransh |
| User feedback sessions (section 10) and Lighthouse and load measurements (section 12) | new | Team |
| Real-browser checks of phone layouts | new | Team |
| Unknown event ids should return HTTP 404 | new | Anousha |

**Organisations platform.** Defined in `docs/PLAN_ORGANISATIONS.md` and tracked as epic #61. Each phase can be demonstrated on its own. Sizes are S about a day, M a few days, L a week or more.

| Phase | Deliverable | Issues | Size |
|---|---|---|---|
| 0 | Team sign-off on scope; automated test setup | #62, #63 | 1 S, 1 M |
| 1 | Organisations and membership: schema, permission helpers, create, profile, directory, join and requests, invites, member management, settings, org-owned events, migration of existing data, My organisations | #64 to #76 | 3 S, 9 M, 1 L |
| 2 | Announcements, member feed, notifications (bell and list) | #77 to #81 | 5 M |
| 3 | Members-only chat: contract, actions, polling UI, moderation, rate limits, unread counts | #82 to #87 | 2 S, 2 M, 2 L |
| 4 | Verify and suspend organisations, reports queue, audit log, privacy, accessibility pass | #88 to #92 | 2 S, 3 M |
| 5 | Welfare extras: drives with goals, volunteer hours, email, analytics, final documentation | #93 to #97 | 1 S, 2 M, 2 L |

Total: 36 issues (9 S, 22 M, 5 L). Suggested owners: Saransh for the schema, permissions, chat, notifications and moderation; Anousha for the organisation pages and feed; Aditya for member management, settings, org-owned events, announcements UI, drives, hours and analytics. Phases 1 and 2 are the must-have core, and chat follows once those are stable.

**Definition of done for each phase:** all its issues closed with acceptance criteria met, permission tests passing in CI, a manual end-to-end run recorded in the pull request, the accessibility audit re-run, and the report and diagrams updated (#97).

---

## 14. Screenshots and demo evidence

All screenshots were captured from the live site with headless Chromium on 19 November 2026. The admin screenshot is cropped above the user list so no private email addresses appear. Counts on the admin and roster screens include one throwaway demo volunteer that was deleted after capture.

**Public pages**

![1. Landing page hero](screenshots/01-landing.png)
*1. Landing page: hero with a live product preview and the causes strip.*

![2. Landing page features](screenshots/02-landing-features.png)
*2. Landing page: features and how it works.*

![3. Events list](screenshots/03-events-list.png)
*3. `/events`: search, filters, sort and event cards.*

![4. Events map](screenshots/04-events-map.png)
*4. `/events`: every event on an OpenStreetMap map.*

![5. Filtered events](screenshots/05-events-filtered.png)
*5. Filters in the URL (`?cause=HEALTH`), a shareable link.*

![6. Event page](screenshots/06-event-detail.png)
*6. Event page: details, spots left, register button, organiser card, add to calendar and copy link.*

![20. Map popup](screenshots/20-map-popup.png)
*20. Map popup showing cause, linked title, date and address.*

![7. Sign-up](screenshots/07-signup.png)
*7. Sign-up page.*

![8. Login](screenshots/08-login.png)
*8. Login page.*

![9. Not found](screenshots/09-not-found.png)
*9. Custom 404 page.*

**Mobile**

![10. Mobile menu](screenshots/10-mobile-menu.png)
*10. Mobile navigation menu.*

![11. Mobile events](screenshots/11-mobile-events.png)
*11. Events list on a phone-sized screen.*

**Volunteer**

![12. Registered](screenshots/12-event-registered.png)
*12. After registering: "You're registered", cancel option and spots taken.*

![13. My registrations](screenshots/13-my-registrations.png)
*13. My registrations with upcoming and past tabs.*

![14. Profile](screenshots/14-profile.png)
*14. Profile: edit name and change password.*

![15. User menu](screenshots/15-user-menu.png)
*15. User menu showing name, role and sign out.*

**Organiser**

![16. Organiser dashboard](screenshots/16-organiser-dashboard.png)
*16. Organiser dashboard with stats and event cards.*

![17. Create event](screenshots/17-create-event.png)
*17. Create event form.*

![21. Location picker](screenshots/21-location-picker.png)
*21. Click-to-pin location picker with the chosen coordinates.*

![18. Roster](screenshots/18-event-roster.png)
*18. Volunteer roster with CSV export and remove controls.*

**Admin**

![19. Admin panel](screenshots/19-admin-panel.png)
*19. Admin panel: platform stats, organiser approval and event removal (user list cropped).*

**Other evidence**
- Live site: https://goodloop-pi.vercel.app
- Source, pull request history, reviews and CI runs: https://github.com/Saransh-Jainbu/goodloop
- Issue tracker, milestones and the organisations epic: https://github.com/Saransh-Jainbu/goodloop/issues/61
- Plan and design for the next phase: `docs/PLAN_ORGANISATIONS.md`

**Still to add by the submitter (these need a login that only the team has):** a green CI run on a pull request, the Vercel deployment "Ready" page, the Neon console tables, and the project board.

**Suggested demo script (5 minutes):** landing page, then sign up as a volunteer and register for an event, see it in My registrations, log in as the organiser to publish an event and view its roster, log in as admin to approve an organiser and view stats, and finish by showing the organisations plan and the issue board.

---

## Appendix A: Permission matrix (planned organisations)

The specification for the permission tests. "Org Organiser" is the proposed extra role (section 2.4).

| Action | Visitor | Member | Moderator | Org Organiser | Org Admin | Owner | Platform admin |
|---|---|---|---|---|---|---|---|
| View a public, verified organisation | yes | yes | yes | yes | yes | yes | yes |
| Join (policy Open) or request (policy Request) | log in first | n/a | n/a | n/a | n/a | n/a | n/a |
| Read announcements | public orgs only | yes | yes | yes | yes | yes | yes |
| Read and send chat | no | yes | yes | yes | yes | yes | read only, for moderation |
| Report content | no | yes | yes | yes | yes | yes | yes |
| Delete any chat message, mute, ban from chat | no | no | yes | yes | yes | yes | yes |
| Create and manage the organisation's events and see registrations | no | no | no | yes | yes | yes | no |
| Post, edit, pin announcements | no | no | no | no | yes | yes | no |
| Approve join requests, manage invites | no | no | no | no | yes | yes | no |
| Change member roles (up to Organiser) | no | no | no | no | yes | yes | no |
| Create Org Admins | no | no | no | no | no | yes | no |
| Edit organisation settings | no | no | no | no | yes | yes | no |
| Transfer ownership, archive the organisation | no | no | no | no | no | yes | no |
| Verify, reject, suspend an organisation | no | no | no | no | no | no | yes |

Rules: the last Owner cannot be demoted, removed or banned; nobody changes their own role; banned and pending people never count as members; a moderator cannot act on an admin or owner.

## Appendix B: Planned screens (wireframes)

These are low-fidelity sketches of how the planned screens will look, not screenshots.

**Organisation profile (`/orgs/[slug]`)**
```
+--------------------------------------------------------------+
| [logo]  City Blood Bank Volunteers        VERIFIED   [ Join ]|
| Health  Delhi   |  128 members  |  6 upcoming events         |
+--------------------------------------------------------------+
| About | Events | Announcements | Chat (members only)         |
|--------------------------------------------------------------|
| PINNED  Monthly blood camp moved to Saturday ...             |
| Upcoming: Blood Donation Camp - Sat 9:00 - 40 spots left     |
+--------------------------------------------------------------+
```

**Chat (`/orgs/[slug]/chat`)**
```
+--------------------------------------------------------------+
| City Blood Bank Volunteers - Chat              unread: 0     |
|--------------------------------------------------------------|
|  Today                                                       |
|  Priya   Anyone bringing water bottles?            10:02     |
|  Rahul   I can, bringing 20.                       10:04     |
|  [new messages v]                                            |
|--------------------------------------------------------------|
| [ Type a message ...                         ]  [ Send ]     |
+--------------------------------------------------------------+
   (Moderators see: delete, mute, ban on each message)
```

**Manage members (`/orgs/[slug]/manage/members`)**
```
+--------------------------------------------------------------+
| Members (128)   [ search ]          Requests (3)  Invites    |
|--------------------------------------------------------------|
| Name        Role           Joined       Actions              |
| Asha        Owner          Jan 2026     (owner)              |
| Rahul       Organiser      Feb 2026     [Role v] [Remove]    |
| Priya       Member         Mar 2026     [Role v] [Ban]       |
+--------------------------------------------------------------+
```
