# Derma-Maze V6 Production Checklist

## Implemented
- Unified navy/gold production palette loaded after every legacy stylesheet.
- Removed the remaining green/cyan cast from the Home chapter rail and Drug Index sections.
- Added Study Dashboard with overall progress, chapter progress, daily target, streak, continue studying, notes, backup/import, and local reset.
- Added chapter note drawer and direct Dashboard shortcut to all chapter pages.
- Added Home live study preview.
- Added local JSON backup/export and import.
- Added a custom 404 page.
- Normalized canonical URLs, sitemap, and robots paths to the lowercase GitHub Pages repository path.
- Kept Updates and Shipping/Returns disabled and excluded from the sitemap.

## Required before sales launch
1. Open `js/core/site-config.js`.
2. Set `order.enabled` to `true`.
3. Add the real WhatsApp number in international format without `+` or spaces.
4. Review the Arabic and English order messages.
5. Confirm price, delivery scope, payment method, and final public contact details.
6. Test the order button on a real phone.

## Deployment
Upload all files inside this release to the repository root. Do not upload the containing folder itself.

After deployment, test at 100% browser zoom:
- `/index.html`
- `/drugs.html`
- `/dashboard.html`
- one chapter page
- mobile navigation
- notes save/delete
- backup export/import
- order button after enabling the real sales configuration
