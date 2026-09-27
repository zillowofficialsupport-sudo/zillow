# Villow

Villow is a React real-estate listings app backed by Supabase Auth and Postgres, with ImageKit for new photo uploads and Cloudflare Pages for hosting.

## Local frontend

1. Create a Supabase project and apply `supabase/schema.sql` in the Supabase SQL Editor.
2. Optionally apply `supabase/seed.sql` for five test properties and `supabase/legacy_seed.sql` for the 18 checked-in legacy listing fixtures.
3. Copy `frontend/.env.example` to `frontend/.env.local` and fill in the Supabase URL/anon key and ImageKit public key/URL endpoint.
4. From `frontend`, run `npm install` and `npm start`.

The ImageKit signed-upload route is a Cloudflare Pages Function, so local photo uploads require `wrangler pages dev` with the required function variables. See `SUPABASE_MIGRATION.md` for deployment settings and secrets.

After importing the legacy fixture rows, `frontend/scripts/migrate-legacy-photos.mjs` can copy their public S3 fixture images to ImageKit. It requires a Supabase service-role key and ImageKit credentials and must only be run in a trusted environment.

## Cloudflare Pages

Set the Pages project root to `frontend`, build command to `npm run build`, and output directory to `build`. Configure the frontend variables from `frontend/.env.example`, plus server-side `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and the `IMAGEKIT_PRIVATE_KEY` secret for the Pages Function.

Never expose a Supabase service-role key or ImageKit private key in frontend environment variables.

## Existing account and media data

The SQL fixtures preserve the 18 demo listing records from the former Rails seed file. Their sample photos currently reference the original public S3 fixture URLs. New uploads use ImageKit. Live database users, favorites, listings, and Active Storage files are not automatically copied by these fixture scripts; migrate and verify that hosted data before shutting down its source. Supabase Auth password migration also requires an account migration/reset strategy.
