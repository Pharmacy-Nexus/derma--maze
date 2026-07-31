# Derma-Maze V6.2 — Security and stability changes

## Production behavior changes

- The Updates page remains paused.
- The Updates admin console is now a disabled production page and does not load Supabase.
- When the admin source is reactivated, login sessions are memory-only and do not survive a reload.
- Update media is stored in a private bucket and is shown through signed URLs.
- Draft media is no longer publicly readable.
- Backup imports are limited to 2 MB and validated before any local data is changed.
- Failed backup imports roll back to the previous local data.
- If browser storage is blocked/full, the site shows a visible warning instead of silently failing.

## Supabase action required

Existing Supabase projects must run `supabase/security-hardening-v6-2.sql` before reactivating Updates.

## Deferred change

The six chapter question engines remain separate. Consolidating them into one shared engine is a high-risk behavior refactor and was intentionally deferred until automated chapter tests cover all modes.
