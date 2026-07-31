# V6.2 manual browser smoke check

Run this after uploading the full-site ZIP and using a hard refresh.

1. Open Home, Drug Index, Dashboard, and all six chapter pages at 100% zoom.
2. In one chapter, answer a question, bookmark it, reload the page, and confirm both persist.
3. Block or clear site storage once and confirm the site does not freeze; when storage is unavailable it should show a warning.
4. Create, edit, and delete a note in Dashboard.
5. Export a backup, import it again, then try a non-Derma-Maze JSON file and a file larger than 2 MB.
6. Confirm `updates.html`, `shipping-returns.html`, and `admin-updates.html` show paused/disabled pages.
7. Confirm no `supabase/config.js` is present in the deployed repository while Updates is paused.
8. Check mobile navigation, language switching, Random 10, Full Exam, image dialogs, and the Home book animation.
