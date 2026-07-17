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
