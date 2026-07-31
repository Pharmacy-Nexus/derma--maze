# Derma-Maze Website

A bilingual static companion platform for the printed **Derma-Maze Volume 1: Pharmacotherapy of Dermatology** book.

## Stack

- HTML5
- CSS
- Vanilla JavaScript
- No framework, package manager, or build step
- GitHub Pages deployment
- Optional paused Supabase Updates/Admin feature

## Main folders

- `assets/` — icons, social previews, book previews, and chapter images
- `css/` — global, theme, page, and chapter styles
- `data/` — question banks and drug-index records
- `js/` — shared runtime, study tracking, page logic, and chapter controllers
- `tests/` — static, storage, and content-integrity checks
- `tools/` — small release maintenance tools
- `docs/` — current instructions and historical release notes
- `supabase/` — paused Updates/Admin setup and security migration files

## Current release

**V6.3.2 — Production Cleanup**

This release keeps the existing product behavior and scientific content while preparing a cleaner base for upcoming content changes.

## Run checks

Python and Node.js are required for the local checks. From the project root:

```bash
python tests/run-all.py
```

The checks cover JavaScript syntax, local file references, paused admin security assertions, study-backup validation, 675 questions, and 211 drug-index records.

There is still no browser automation suite. Before publishing, complete the manual checklist in `docs/PRODUCTION-CHECKLIST.md`.

## Editing content

Read `docs/CONTENT-EDITING-GUIDE.md` before changing questions, statistics, images, or drug records. Change one chapter at a time and rerun the full checks after every batch.

## Deployment

Upload the contents of this folder to the repository root and enable GitHub Pages from the `main` branch and `/ (root)` directory.

Do not publish a Supabase `service_role` key. `supabase/config.js` is intentionally ignored. The Updates and Admin pages remain paused and do not load Supabase in production.

## Sales activation

The WhatsApp order action remains disabled until final sales details are added in:

```text
js/core/site-config.js
```
