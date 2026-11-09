# Pindivantalu

Pindivantalu is a bilingual English–Telugu food-heritage catalogue focused on traditional sweets and their regional, festival, and ingredient associations.

## Current architecture

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS.
- **Data source:** version-controlled JSON at `src/data/catalogue.json`.
- **Favorites:** browser `localStorage`.
- **Images:** local assets under `public/images/`; the current sweet illustration is a placeholder.
- **Legacy schema:** `docs/archive/legacy-supabase-schema.sql` is retained for reference only. This application no longer imports or connects to Supabase.

The JSON catalogue is an interim, no-account data source. It is suitable for local development and a static showcase, but it does not support shared edits or cross-device user accounts. A hosted PostgreSQL backend and server-side API can be added later without changing the page components if the `src/lib/data.ts` interface is preserved.

## Requirements

- Node.js 20 or newer
- npm

## Run locally

```bash
npm ci
npm run dev
```

Vite will print a local development URL in the terminal.

## Quality checks

```bash
npm run typecheck
npm run lint
npm run build
```

## Catalogue editing

Edit `src/data/catalogue.json`. Food records use `category_slug`, `region_slugs`, `festival_slugs`, `ingredient_slugs`, and `source_ids` to link to related entries. The data layer in `src/lib/data.ts` resolves these slugs into the types already consumed by the UI.

The current records are starter content and have `draft_needs_source_review` verification status. Validate regional and cultural claims, obtain reliable sources, and attach source records before presenting the catalogue as academically verified.

## Images

Actual sweet photographs have not yet been generated or approved. Records temporarily point to `/images/sweet-placeholder.svg`. Replace each entry with a correct, approved image path after checking the depicted dish, usage permissions, attribution requirements, and accessible alt text.

## AI chat and production deployment

AI chat is not implemented in this starter migration. To add it safely, call the language model from a server-side endpoint; never place a privileged API key in public frontend code. A proper shared database and backend endpoint will also be needed for catalogue administration or synchronized user data.
