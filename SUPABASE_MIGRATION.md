# Supabase, ImageKit, and Cloudflare Pages

The React frontend uses Supabase Auth and Supabase Postgres for authentication, listings, search, and favorites. Listing images upload to ImageKit through a signed Cloudflare Pages Function. The Rails runtime has been removed from this repository.

## Setup

1. Create a Supabase project and run [`supabase/schema.sql`](supabase/schema.sql) in its SQL editor.
2. Run [`supabase/legacy_seed.sql`](supabase/legacy_seed.sql) to import the 18 checked-in legacy demo listings and their original S3 fixture URLs.
3. Run [`supabase/seed.sql`](supabase/seed.sql) to add five additional public test listings.
4. Configure Supabase email authentication.
5. Create an ImageKit account and configure `IMAGEKIT_PRIVATE_KEY` as a Cloudflare Pages Function secret.
6. Copy `frontend/.env.example` values into local frontend environment variables and Cloudflare Pages build variables. Also configure `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `IMAGEKIT_PRIVATE_KEY` for the Pages Function.
7. Set the frontend project root to `frontend`, build command to `npm run build`, and output directory to `build`.

## Move the legacy fixture photos into ImageKit

After applying `schema.sql` and `legacy_seed.sql`, run this trusted-machine-only script from the `frontend` directory. It downloads each unique public S3 fixture image once, uploads it to ImageKit, and updates all matching `listing_photos` rows.

```bash
SUPABASE_URL=https://your-project.supabase.co \
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key \
IMAGEKIT_PUBLIC_KEY=your-imagekit-public-key \
IMAGEKIT_PRIVATE_KEY=your-imagekit-private-key \
node scripts/migrate-legacy-photos.mjs
```

The script needs the Supabase service-role key to update fixture photo rows. Do not use or store that key in the frontend or Cloudflare build variables.

## Frontend variables

```text
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key
REACT_APP_IMAGEKIT_PUBLIC_KEY=your-imagekit-public-key
REACT_APP_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your-id
REACT_APP_GOOGLE_API_KEY=your-google-maps-key
```

The Supabase anon key is intended for browser use and is constrained by Row Level Security. Never put the Supabase service-role key or ImageKit private key in a `REACT_APP_` variable. Configure `IMAGEKIT_PRIVATE_KEY` only as a server-side Pages Function secret. The function validates the Supabase bearer token before signing uploads.

## Verification and migration caveats

- `/api/imagekit-auth` is a Cloudflare Pages Function; it will not run with the plain Create React App dev server. Local image uploads need `wrangler pages dev` or deployment to Pages.
- Demo rows have no owner and are public fixtures. Newly created listings use the authenticated Supabase user as owner.
- The SQL fixture export does not include live production records, user accounts, favorites, or the contents of the former Active Storage service. It only carries checked-in demo listings and public fixture photo URLs. Live user migration needs an account reset/import plan; the included photo script only handles the checked-in public S3 fixtures.
- Deployment and end-to-end verification still require real Supabase, ImageKit, and Cloudflare credentials.
