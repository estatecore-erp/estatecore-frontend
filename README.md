# EstateCore ERP — Frontend

Next.js (App Router) + TypeScript frontend for EstateCore ERP.
See `DOCUMENTATION.md` for architecture, conventions, module patterns.

---

## Requirements

- Node.js 18.18+ (LTS recommended)
- pnpm (`npm install -g pnpm`)
- Backend running locally (`estatecore-backend`) — see its README for setup.
  Backend is done (Laravel + MySQL, Sanctum auth, `/api/v1`, roles
  admin/agent/client) — frontend just needs it running to connect later.

---

## Setup

```bash
git clone <estatecore-frontend-repo-url>
cd estatecore-frontend
pnpm install
```

### Environment variables

Copy example env file:

```bash
cp .env.example .env.local
```

`.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

Point this to wherever the Laravel backend is running.

### Run dev server

```bash
pnpm dev
```

App runs at `http://localhost:3000`.

---

## Scripts

| Command      | What it does                 |
| ------------ | ---------------------------- |
| `pnpm dev`   | Start dev server (turbopack) |
| `pnpm build` | Production build             |
| `pnpm start` | Run production build         |
| `pnpm lint`  | ESLint check                 |

---

## Project Structure (quick view)

```
app/(dashboard)/dashboard/{module}/  → route wrappers only (thin)
src/views/{module}/                  → actual UI, file {Module}{Action}.tsx
                                         (exported component: {Module}{Action}Section)
src/store/      → Zustand global state (auth.ts)
src/lib/        → formatters.ts (formatCurrency, formatDate)
                   constants.ts (statusVariant, PAGE_SIZE)
src/components/ → shared UI (Sidebar, Navbar, Breadcrumb)
proxy.ts        → auth/role route guard (Next 16 middleware rename)
```

Full details, conventions, module checklist → `DOCUMENTATION.md`.

---

## Auth Notes

- Token + role stored in httpOnly cookies (set via `app/api/auth/*` route
  handlers) — not localStorage, not NextAuth.
- `proxy.ts` redirects unauthenticated users to `/login`, and redirects by
  role for restricted route groups.
- On login, backend issues a Sanctum token; route handler stores it in the
  cookie, frontend never touches raw token client-side.

---

## Current Status

- Properties module: list/create/detail/edit built (mock data)
- Layouts (dashboard sidebar, portal navbar): done
- Clients, Employees, Inquiries, Leases, Sales: in progress (follow Properties
  pattern — see `DOCUMENTATION.md` §6)
- API integration: pending, done after all module UIs complete

---

## Branching

- Feature branches: `feat/{module-name}` off `dev`
- One GitHub issue per module, referencing Properties views as pattern
- Conventional commits (`feat:`, `fix:`, `chore:` etc)
- PRs close issues via `Closes #N`

---

## Documentation

- [Frontend Documentation](DOCUMENTATION.md)

## Contact

[![Email](https://skillicons.dev/icons?i=gmail)](mailto:dev.sasmitha@gmail.com)
