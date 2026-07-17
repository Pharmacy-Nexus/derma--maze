# Updates Admin Setup

1. Create a Supabase project.
2. Run `setup.sql` in the Supabase SQL Editor.
3. Create the administrator account in Authentication.
4. Add the administrator UUID to the `update_admins` table as described in `setup.sql`.
5. Put the project URL and public/publishable key in `config.js`.

Never place the `service_role` key in this website. The admin page is intentionally not listed in navigation or the sitemap, but real protection comes from Supabase Auth and Row Level Security.
