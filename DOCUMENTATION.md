# EstateCore ERP — Frontend Documentation

Next.js (App Router) + TypeScript, shadcn/ui + Tailwind, pnpm. Consumes Laravel
backend API (`/api/v1`). Properties module = reference implementation — all
other modules copy its pattern.

Backend: **done** (auth, properties, employees, clients, inquiries, leases,
sales — tested in Postman). Roles: `admin` / `agent` / `client`. Property
`type`/`status` auto-update via lease/sale creation. `client_id`/`agent_id`
always derived server-side — never trust frontend-sent IDs.

No NextAuth, no localStorage for auth — everything through `src/app/api/auth/*`
route handlers, httpOnly cookies. No react-hook-form/zod — shadcn `Field` only.

---

## 1. Project Structure

```
estatecore-frontend/
├── src/
│   ├── app/                     # Route wrappers only (thin, no logic)
│   │   ├── api/
│   │   │   └── auth/               # Route handlers: login, logout, refresh
│   │   ├── (dashboard)/
│   │   │   └── dashboard/
│   │   │       ├── properties/
│   │   │       │   ├── page.tsx            → imports PropertiesListSection
│   │   │       │   ├── create/page.tsx     → imports PropertyCreateSection
│   │   │       │   ├── [id]/page.tsx       → imports PropertyDetailSection
│   │   │       │   └── [id]/edit/page.tsx  → imports PropertyEditSection
│   │   │       ├── users/               # merged Clients + Employees (tabs)
│   │   │       │   ├── page.tsx            → imports UsersListSection
│   │   │       │   ├── create/page.tsx     → imports UserCreateSection
│   │   │       │   ├── [id]/page.tsx       → imports UserDetailSection
│   │   │       │   └── [id]/edit/page.tsx  → imports UserEditSection
│   │   │       ├── inquiries/           # (to build — same pattern)
│   │   │       ├── leases/              # (to build — same pattern)
│   │   │       └── sales/               # (to build — same pattern)
│   │   └── (portal)/                # Client-only pages, top navbar, no sidebar
│   ├── views/                  # All actual UI logic lives here
│   │   └── properties/
│   │       ├── PropertiesList.tsx     (component: PropertiesListSection)
│   │       ├── PropertyCreate.tsx     (component: PropertyCreateSection)
│   │       ├── PropertyDetail.tsx     (component: PropertyDetailSection)
│   │       └── PropertyEdit.tsx       (component: PropertyEditSection)
│   ├── store/
│   │   └── auth.ts             # Zustand auth store
│   ├── lib/
│   │   ├── formatters.ts       # formatCurrency (LKR), formatDate
│   │   └── constants.ts        # statusVariant, PAGE_SIZE
│   └── components/             # Shared UI (Sidebar, Navbar, Breadcrumb, etc.)
├── proxy.ts                    # Route guard: redirect-if-no-token, role redirect
└── package.json
```

**Naming note:** file names are just `{Module}{Action}.tsx` (no `View`/`Section`
suffix on the file). The **component exported inside** uses `Section`
(e.g. file `PropertiesList.tsx` exports `PropertiesListSection`).

**Rule:** `app/` files are wrappers only. Example:

```tsx
// src/app/(dashboard)/dashboard/properties/page.tsx
import PropertiesListSection from "@/views/properties/PropertiesList";

export default function Page() {
  return <PropertiesListSection />;
}
```

All real logic, state, and markup goes in `src/views/{module}/`.

---

## 2. Routing Pattern (per module)

Every module gets 4 routes, no exceptions:

| Route                              | File name                    | Component export         | Purpose            |
|--------------------------------------|-------------------------------|-----------------------------|---------------------|
| `/dashboard/{module}`                | `{Module}List.tsx`        | `{Module}ListSection`        | Table + filters + Add button |
| `/dashboard/{module}/create`          | `{Module}Create.tsx`      | `{Module}CreateSection`      | Create form         |
| `/dashboard/{module}/[id]`            | `{Module}Detail.tsx`      | `{Module}DetailSection`      | Read-only detail     |
| `/dashboard/{module}/[id]/edit`       | `{Module}Edit.tsx`        | `{Module}EditSection`        | Edit form (separate route, not `?edit=`) |

Reference: Properties module implements all 4 already — copy structure exactly.

---

## 3. Auth Flow

1. Login form posts to `src/app/api/auth/login/route.ts`.
2. Route handler calls Laravel `/api/v1/login`, gets Sanctum token.
3. Route handler sets httpOnly cookies: `token`, `role`.
4. `proxy.ts` checks cookies on every request:
   - No token → redirect to `/login`.
   - Role mismatch for route group → redirect to allowed area.
5. `AuthInitializer` (mounted in root layout) hydrates Zustand `store/auth.ts`
   on app load, reading role/user from cookie-backed session endpoint.

Client components read auth state from `store/auth.ts`, never read cookies directly.

---

## 4. Layouts

- **Dashboard layout** (`(dashboard)/layout.tsx`): shadcn `Sidebar`
  (collapsible, icon mode, dual logo — wide + icon versions) + top navbar with
  auto-generated breadcrumb (derived from `pathname`).
- **Portal layout** (`(portal)/layout.tsx`): top navbar only, no sidebar.
  Used for client-role pages.

---

## 5. Shared Utilities

**`src/lib/formatters.ts`**
- `formatCurrency(value)` → LKR format
- `formatDate(value)` → consistent date display

**`src/lib/constants.ts`**
```ts
export const statusVariant: Record<string, string> = {
  available: "bg-green-100 text-green-800",
  rented: "bg-amber-100 text-amber-800",
  sold: "bg-red-100 text-red-800",
};

export const PAGE_SIZE = 10;
```
- `statusVariant` — Tailwind class map per status, used on Badge
- `PAGE_SIZE` — shared pagination size for all list tables
- Shared across all modules — do not redefine locally per module.

---

## 6. Properties Module (Reference Implementation)

Properties is fully built with mock data and is the template every other
module must copy. Structure below — replicate exactly for Clients, Employees,
Inquiries, Leases, Sales.

### 6.1 PropertiesList.tsx → `PropertiesListSection`
- Table of properties (shadcn `Table`), paginated using `PAGE_SIZE`
- Filters: type (sale/rent), status (available/sold/rented)
- "Add Property" button — top right corner
- Row click → `/dashboard/properties/[id]`
- Status shown as Badge using `statusVariant`

### 6.2 PropertyCreate.tsx → `PropertyCreateSection`
- Form built with shadcn `Field` components
- `React.SyntheticEvent<HTMLFormElement>` for submit handler (not deprecated `FormEvent`)
- On submit (currently mock) → redirect to detail page

### 6.3 PropertyDetail.tsx → `PropertyDetailSection`
- Read-only display of a single property
- Edit button → `/dashboard/properties/[id]/edit`

### 6.4 PropertyEdit.tsx → `PropertyEditSection`
- Same form as Create, pre-filled with existing data
- Separate route, not a query-param toggle on detail page

**Note:** Properties UI is currently wired to mock data, not the live API.
API connection happens after all module UIs are complete (project lead's task).

---

## 7. Module Build Status

| Module     | Status              |
|------------|----------------------|
| Properties | ✅ Built (mock data)  |
| Users (Clients + Employees) | 🔲 To build (see §8 for pattern) |
| Inquiries  | 🔲 To build (see §9)  |
| Leases     | 🔲 To build (see §10) |
| Sales      | 🔲 To build (see §11) |
| Dashboard overview | 🔲 Pending         |
| Portal pages        | 🔲 Pending         |
| API integration      | 🔲 Pending (after all UIs done) |

---

## 8. Users Module (merged Clients + Employees)

No separate `/clients` or `/employees` routes — one `/users` module, tabs on top.

- `/dashboard/users` — table with tabs: **All | Clients | Employees**
  (`UsersListSection`)
- `/dashboard/users/create` — create form (`UserCreateSection`)
- `/dashboard/users/[id]` — detail (`UserDetailSection`)
- `/dashboard/users/[id]/edit` — edit form (`UserEditSection`)

**Backend has no `/users` endpoint** — still two separate ones:
`GET /clients` and `GET /employees`. So on the frontend:

- Fetch both, tag each row `type: 'client' | 'employee'` (backend doesn't
  return this — add it client-side when merging), combine into one array
- Tabs filter the merged array client-side — not separate API calls per tab
- Table columns adapt based on active tab (client fields ≠ employee fields)
- "Add User" button top-right, **admin only** — routes to
  `/dashboard/users/create?type=client` or `?type=employee`
- Create hits different endpoints depending on type: clients via
  `POST /auth/register`, employees via `POST /auth/register-agent`
  (admin only) — no unified create endpoint
- Edit/Delete hit `/clients/{id}` or `/employees/{id}` based on row type
- Detail page renders `ClientDetail` or `EmployeeDetail` sub-component based
  on type — not one universal schema
- Profile page (`/profile`) deferred until main modules are done

Backend `/users` endpoint work (real unified endpoint) is a possible future
task — not required for this assignment.

---

## 9. Inquiries Module

Follows exact Properties pattern (list/create/detail/edit, `{Module}{Action}.tsx`
files, `Section` component exports, `statusVariant` badges, `PAGE_SIZE`
pagination). Diffs from Properties below.

- Route: `/dashboard/inquiries`
- List: client column + property column + message + status badge
  (`pending` / `responded`)
- **No delete/edit form for client role** — client can only create
  (`POST /inquiries`), agent/admin respond via edit (`PUT /inquiries/{id}`,
  status only — no full edit form, just a status action)
- Create form: client only, just `property_id` (select from available
  properties) + `message` textarea — `client_id` never sent, backend derives it
- Inquiries do **not** change property status — no side effects to show in UI

---

## 10. Leases Module

Same Properties pattern. Diffs below.

- Route: `/dashboard/leases`
- List: property + client + start/end date + monthly rent + status
  (`active` / `expired`)
- Create form: admin/agent only — property select (filter to `type: rent`,
  `status: available` only), client select, start date, end date, monthly rent
- Edit: admin only, status field only (`active` → `expired`) — not a full
  field edit form
- Show a small inline note on create/edit that changing status affects the
  linked property's status (active→rented, expired→available) — mirrors
  backend's Lease Status Flow

---

## 11. Sales Module

Same Properties pattern. Diffs below.

- Route: `/dashboard/sales`
- List: property + client + sale price + sale date
- Create form: admin/agent only — property select (filter to `type: sale`,
  `status: available` only), client select, sale price, sale date
- **No edit route** — sales are immutable once created, only delete
  (admin only). Skip building `/dashboard/sales/[id]/edit`.
- Delete reverts property status to `available` — fine to just note this in
  a confirm-delete dialog copy, no extra UI needed

---

## 12. Conventions Checklist (for every new module PR)

- [ ] Files in `src/views/{module}/`, file name `{Module}{Action}.tsx` (no suffix)
- [ ] Exported component name uses `Section` suffix (e.g. `PropertyCreateSection`)
- [ ] `src/app/(dashboard)/dashboard/{module}/...` — route files thin wrappers only
- [ ] 4 routes: list, create, `[id]`, `[id]/edit` (skip edit route only where
      backend has no update endpoint — e.g. Sales)
- [ ] Uses `formatters.ts` (`formatCurrency`, `formatDate`) and
      `constants.ts` (`statusVariant`, `PAGE_SIZE`), no local duplicates
- [ ] Forms use shadcn `Field`, submit handler typed as
      `React.SyntheticEvent<HTMLFormElement>`
- [ ] Add button top-right on list view, admin-only where applicable
- [ ] Mock data only — no API calls yet
- [ ] PR references the GitHub issue, closes it via `Closes #N`