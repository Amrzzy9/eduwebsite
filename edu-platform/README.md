# منصة تعليمية (React + Vite + Supabase)
## Supabase
1. Create a project. Run `supabase/migrations/001_core.sql` then `002_admin_video_progress.sql` in the SQL editor.
2. Auth > Providers: enable Email (and email confirmation if wanted).
3. Make an admin: `update profiles set role='admin' where id='<uuid>';` (SQL editor only).
## Env (`.env`): VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY (anon key only; never the service-role key).
## Cloudflare Pages (free)
Connect Git repo > Framework: Vite/React > Build command `npm run build` > Output `dist` > add the two env vars > Deploy.
No `404.html` exists, so Cloudflare serves `index.html` for unknown paths (SPA mode) and refresh works.
## GitHub Pages (optional)
Repo Settings > Pages > Source: GitHub Actions; add the two secrets; run the "GitHub Pages" workflow (it sets the base path and copies 404.html).
## Notes
Static hosting does not provide the database, auth or video storage. Host videos elsewhere and paste `video_url` or `embed_url` on a lesson.
Paid lesson video URLs are protected only by RLS on the lessons row; for stronger protection use signed URLs from your video provider via a server function (not built).
