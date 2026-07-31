# Derma-Maze V6.2 — Security & Stability

## Security

- Disabled the public Updates admin console in the production page; it no longer loads Supabase or exposes a login form.
- Hardened the retained Updates source against stored XSS by removing inline handlers and rendering administrator-controlled text with DOM APIs.
- Changed future admin authentication to memory-only sessions (`persistSession: false`).
- Pinned the retained Supabase browser dependency to `2.111.0` instead of a floating major tag.
- Reworked update media for a private Storage bucket and short-lived signed URLs.
- Added an existing-project SQL migration that hides `created_by` from browser roles and limits public media access to published updates.
- Removed `supabase/config.js` from the production bundle and added an ignored `config.example.js` workflow.

## Stability

- Added safe local/session storage helpers with a visible warning when the browser blocks or cannot save data.
- Updated all six chapter controllers and the Drug Index to use the safe storage layer.
- Added a 2 MB backup-import limit, schema/version validation, data sanitization, caps, and rollback on write failure.
- Added cleanup of newly uploaded update images after failed database saves and cleanup of replaced images after successful saves.
- Bounded update queries instead of fetching an unlimited list.
- Unified cache-busting and application version to `6.2.0`.

## Tests added

- `python tests/static-smoke.py`
- `node tests/study-backup-smoke.cjs`

Browser automation could not be executed in the build environment because local/file navigation is blocked by policy. The release therefore includes static, syntax, path, security-assertion, and backup-import tests, but still needs a short manual browser check after deployment.

## Intentionally deferred

The six chapter engines were not merged into one shared engine. That change touches core question behavior and remains deferred until browser tests cover Study Mode, Exam Mode, Random 10, Full Exam, bookmarks, reset, language, and reload persistence.
