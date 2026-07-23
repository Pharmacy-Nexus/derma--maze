# Derma-Maze Website

A static bilingual dermatology pharmacotherapy companion built for GitHub Pages.

## Project structure

- Root HTML files keep stable public URLs and SEO links.
- `css/` contains global, page, and chapter styles.
- `js/` contains shared logic, page scripts, and chapter controllers.
- `data/` contains question-bank data separated by chapter.
- `assets/` contains icons, social-preview images, and chapter images.
- `supabase/` contains the Updates/Admin configuration and database setup.
- `docs/` contains deployment and maintenance notes.

## Deployment

Upload the **contents of this folder** to the repository root and enable GitHub Pages from the `main` branch and `/ (root)` directory.

Do not publish a Supabase `service_role` key. Only the public/publishable key belongs in `supabase/config.js`, with Row Level Security enabled.

## Drug Index

The new `drugs.html` page is a searchable bilingual index. Its records live in `data/drugs/drugs.js`, its interactions in `js/pages/drugs.js`, and its styles in `css/pages/drugs.css`. The V3 index contains a first-pass set of 44 drug names and 71 dermatology-related dosage forms, organized by chapter. Egyptian availability remains a separate pending field until dated market verification. The page does not publish dosing, treatment protocols, diagnostic content, or the book’s protected educational details.

## Drug Index V4

The Drug Index now imports the complete user-provided master list: 236 named mentions normalized into 211 searchable records. See `docs/DRUG-INDEX-V4-NOTES.md` for normalization and review rules.


## V5 brand update
- Unified navy and muted-gold design system.
- Added animated maze loading screen.
- Redesigned home page around printed-book sales and companion-platform value.
- Removed Updates and Shipping & Returns from public navigation and sitemap.
- Clarified that no PDF edition is available.
