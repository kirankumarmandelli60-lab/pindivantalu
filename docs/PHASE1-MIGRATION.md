# Phase 1 migration notes

## Completed in this working copy

- Replaced the Supabase-backed `src/lib/data.ts` implementation with a local JSON-backed adapter that keeps the same exported async function signatures used by existing pages.
- Added a starter catalogue for eight sweets associated with Andhra Pradesh and Telangana, plus region, festival, ingredient, district, and editorial-story records.
- Marked all starter sweet records `draft_needs_source_review`. They are not yet academically verified and currently have no citations attached.
- Added a shared SVG placeholder for sweet, region, festival and story images, plus a local decorative hero image. Replace placeholders after real images are generated and reviewed.
- Fixed the navigation item typing so icon-bearing links and text-only links have a clear type boundary.
- Removed the active Supabase client and package dependency. Kept the old SQL migration under `docs/archive/` strictly for reference.
- Removed the ZIP's `.env` from this working copy and added safer ignore patterns.
- Added `npm run catalogue:check` and a GitHub Actions quality-check workflow.
- Replaced generic Bolt social-preview metadata and the Vite favicon with Pindivantalu metadata and a local icon.

## Verification performed here

- Catalogue JSON parses successfully.
- Catalogue reference validator passes: 8 food records, 6 regions, 4 festivals and 11 ingredients.
- TypeScript/TSX syntax transpilation passed for 28 source files.

## Checks still requiring a complete npm install

A full `npm ci` could not complete in the current execution environment because package downloads timed out. Therefore `npm run typecheck`, `npm run lint`, and `npm run build` are **not yet confirmed** in this copy. Run all three locally after extracting the ZIP and installing dependencies.

## Functional limits of this phase

- JSON is read-only at runtime. It does not offer a shared admin console or cross-device synchronization.
- Favorites persist in the visitor's browser via `localStorage`.
- AI chat is not implemented yet; it requires a secure server-side model endpoint.
- Real sweet photography has not been generated or approved yet.
- Starter food records require authoritative source verification, improved editorial review and accurate regional attribution before academic/public use.


## Current checks and limits

- `node scripts/validate-catalogue.mjs` passes in the provided build environment and checks required fields, duplicate IDs/slugs, related-record references, and local image paths.
- The original app's unused-import/state lint errors were cleaned up in this package. Two existing React Fast Refresh warnings may remain in the context modules.
- A fresh `npm ci`, TypeScript check, lint run, and production build could not be completed in the artifact-building environment because dependency installation could not finish. Run all four commands locally before treating this migration as verified.
- Eight starter food records are provided. They are explicitly marked for source review; this is not an exhaustive or academically verified catalogue. Generated dish photos are not included.
