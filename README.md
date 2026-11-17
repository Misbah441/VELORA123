# Small Vendor Support Platform

A platform to support street vendors and local small businesses in India — built with **Next.js 14**, **TypeScript**, **Tailwind CSS**, and **Supabase**.

> [!NOTE]
> **Demo mode**: All pages render with demo/static data out of the box. Supabase credentials are only required for real authentication and live database reads/writes.

---

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Backend / Auth | Supabase (PostgreSQL + Auth + Storage) |
| Icons | lucide-react |
| Utilities | clsx, tailwind-merge |

---

## Setup

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd buildathon
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   Then open `.env.local` and fill in your Supabase project credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

4. **Run the database migration** *(skip for demo mode)*
   Open `src/lib/supabase/migrations/001_initial_schema.sql` in your Supabase SQL Editor and run it.

5. **Start the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

---

## Route Map

### Public Routes

| Route | Description |
|---|---|
| `/` | Home — locality selector, search, categories, shop cards |
| `/shops` | Shop directory with filters |
| `/shops/[slug]` | Shop detail page |
| `/products/[id]` | Product detail |
| `/surplus` | Public surplus listings |
| `/saved` | Device-local saved shops |
| `/reservation/[token]` | Reservation tracking |

### Auth Routes

| Route | Description |
|---|---|
| `/vendor/sign-in` | Vendor sign-in |
| `/vendor/register` | New vendor registration |
| `/vendor/reset-password` | Password reset |

### Onboarding

| Route | Description |
|---|---|
| `/vendor/onboarding` | Multi-step onboarding wizard |

### Vendor Workspace (authenticated)

| Route | Description |
|---|---|
| `/vendor` | Dashboard |
| `/vendor/book` | Daily Business Book (ledger) |
| `/vendor/surplus` | Surplus listing management |
| `/vendor/shop` | Shop management |
| `/vendor/buy-together` | BuyTogether (collective purchasing) |
| `/vendor/support` | Vendor Rights & Support |
| `/vendor/reservations` | Reservation management |
| `/vendor/enquiries` | Customer enquiries |
| `/vendor/notifications` | Notifications |
| `/vendor/settings` | Account & shop settings |

---

## Project Structure

```
src/
├── app/
│   ├── (public)/          # Public-facing routes with public layout
│   │   ├── layout.tsx
│   │   ├── page.tsx       # Home / discovery
│   │   ├── shops/
│   │   ├── products/
│   │   ├── surplus/
│   │   ├── saved/
│   │   └── reservation/
│   └── vendor/            # Vendor workspace
│       ├── layout.tsx     # Vendor layout with sidebar nav
│       ├── (auth-only)/   # Minimal centered layout for auth pages
│       ├── page.tsx       # Dashboard
│       ├── sign-in/
│       ├── register/
│       ├── reset-password/
│       ├── onboarding/
│       ├── book/
│       ├── shop/
│       ├── surplus/
│       ├── buy-together/
│       ├── support/
│       ├── reservations/
│       ├── enquiries/
│       ├── notifications/
│       └── settings/
├── components/
│   ├── layout/            # Navbars, Footer
│   └── ui/                # Design system components (Button, Badge, Input, Select, Card…)
└── lib/
    ├── supabase/          # Supabase client helpers, types, migrations
    └── utils.ts           # cn() helper (clsx + twMerge)
```

---

## Design System

Design tokens are defined as CSS custom properties in `globals.css` and mirrored in `tailwind.config.ts`.

| Token | Value |
|---|---|
| Background | `#FAF8F2` |
| Surface | `#FFFFFF` |
| Primary | `#174C3C` |
| Primary hover | `#103B2E` |
| Main text | `#202923` |
| Secondary text | `#53615A` |
| Muted surface | `#E8F0E9` |
| Accent surface | `#FFF1D6` |
| Accent text | `#7A4700` |
| Danger | `#B42318` |
| Information | `#245B78` |
| Divider | `#D6DED7` |

Font: **Inter** + **Noto Sans Malayalam** (Google Fonts).  
Spacing rhythm: 8px. Minimum touch target: 44px. Tabular figures for monetary values.
"# VELORA" 
"# velora123" 
