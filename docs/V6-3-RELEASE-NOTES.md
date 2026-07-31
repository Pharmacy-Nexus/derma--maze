# Derma-Maze V6.3 — production cleanup

## Purpose

V6.3 prepares a stable base for upcoming content edits. It deliberately avoids changes to question wording, answer keys, scientific content, study behavior, and sales logic.

## Runtime cleanup

- Renamed versioned runtime files to stable semantic names:
  - `css/production-v6.css` → `css/theme.css`
  - `css/home-motion-v6-1.css` → `css/pages/home-motion.css`
  - `js/pages/home-motion-v6-1.js` → `js/pages/home-motion.js`
- Updated cache-busting references and site version to `6.3.2`.
- Removed unnecessary JavaScript from the 404 page and paused Updates, Admin, and Shipping pages.
- Removed the study tracker from legal/information pages where it had no active function.
- Added `.editorconfig` for consistent UTF-8 and line endings.

## Maintenance cleanup

- Moved historical implementation notes into `docs/archive/`.
- Added a current documentation index and content-editing guide.
- Added a version-bump helper for future releases.

## Test coverage added

`tests/content-integrity.cjs` validates:

- 675 question records.
- 211 drug-index records.
- Unique question IDs inside each chapter.
- Topic and chapter totals.
- Question types and difficulties.
- Four unique answer options and valid answer keys.
- Arabic and English content fields.
- Local image references and accepted embedded images.
- Drug IDs, forms, book locations, and required bilingual labels.

Run all checks with:

```bash
python tests/run-all.py
```

## Not changed

- Scientific content.
- Question answers or explanations.
- Chapter study/exam logic.
- Dashboard behavior.
- Notes, progress, favorites, or backup format.
- Drug-index scientific scope.
- Book animation or visual design.
