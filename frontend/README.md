# FindCare Frontend

Next.js (App Router) + Tailwind CSS v4 frontend for FindCare.

## Run

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Structure

```
app/                 Routes, layouts, global styles and design tokens
  (marketing)/       Public landing page
components/
  brand/             Logo, avatars
  landing/           Landing page sections
  layout/            Navbar, footer, mobile menu
  ui/                Reusable primitives (Button, Card, Container)
lib/
  site.ts            Site-wide constants
  utils.ts           Helpers (cn)
```
