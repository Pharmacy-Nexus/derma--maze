# Updates system (currently disabled in production)

The public Updates page and the admin console are intentionally disabled in the production HTML files.
Their hardened source files remain in the repository for a future reactivation.

## New Supabase project

1. Create a Supabase project.
2. Run `setup.sql` in SQL Editor.
3. Create the admin user in Authentication.
4. Add the user's UUID to `update_admins` as shown at the end of `setup.sql`.
5. Copy `config.example.js` to `config.js` and add the project URL and publishable key.
6. Restore `admin-updates-template.txt` as `admin-updates.html` only when the feature is ready.

## Existing Supabase project

1. Back up `derma_updates` and the `updates-media` bucket.
2. Run `security-hardening-v6-2.sql` once.
3. Use the current frontend scripts included with this release.

## Security notes

- Never place a `service_role` key in browser code.
- The admin session is memory-only (`persistSession: false`). Closing/reloading the page requires a new login.
- The media bucket is private. Published media is delivered through short-lived signed URLs.
- Draft images are not publicly readable.
- Database records store Storage object paths rather than public URLs.
- `created_by` is not granted to browser roles.
