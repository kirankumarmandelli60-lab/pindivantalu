# Regional sweets catalogue and image research

## What is here

- `indian-regional-sweets.json`: a starter research catalogue grouped by Indian state/union territory.
- `../scripts/find-sweet-images.mjs` (repository path: `scripts/find-sweet-images.mjs`): searches Wikimedia Commons for possible images and captures source URLs and license/attribution metadata.
- `.github/workflows/image-research.yml`: runs on demand and weekly; its output is downloadable as a GitHub Actions artifact named `pindivantalu-image-candidates`.

## Run it manually

1. Open the repository's **Actions** tab.
2. Select **Regional Sweet Image Research**.
3. Choose **Run workflow**.
4. Open the completed run and download the `pindivantalu-image-candidates` artifact.

Run locally with Node.js 20 or newer:

```sh
node scripts/find-sweet-images.mjs
```

## Important quality and rights checks

Image results are candidates only. Before an image appears on the public site, check that it actually depicts the named sweet, that the license permits the intended use, and that any attribution/share-alike requirements are satisfied. Keep the source page and attribution with each approved image. Do not treat search ranking as proof of accuracy or permission.

The starter catalogue is not a claim to contain every sweet made in India. Regional dishes have many spellings, community-specific versions and disputed origins. Add entries with reliable regional sources and review uncertain entries before publishing.

## Next integration step

The live website currently reads food records from Supabase. This research JSON does not automatically change the public catalogue. To publish records safely, map approved entries to the existing Supabase `foods`, `categories`, `regions`, and join-table schema, then import them with a controlled, idempotent script. Image candidate metadata should be retained for credit and license auditing.
