Notes Page — Manual Test Plan

Created: 2025-11-27

Purpose: Verify the modernized `note.html` works correctly across common flows.

Quick setup
- Open `note.html` in a browser (double-click or serve via simple static server).
- Open browser DevTools Console to watch for JS errors.

Test cases
1) Add a new note (no image)
   - Click `New Note`.
   - Fill `Title`, `Content`, select `Category`.
   - Click `Save Note`.
   - Expected: Note appears in grid with chosen title/content/category and fallback SVG background.

2) Add a new note with image
   - Click `New Note`.
   - Fill fields and choose an image file in `Image` input.
   - Save.
   - Expected: Note shows uploaded image as background/preview.

3) Edit an existing note
   - Click the `Edit` action on a note.
   - Modal opens pre-filled.
   - Change title/content and click `Update Note`.
   - Expected: Note updates in grid; localStorage updated.

4) Inline edit
   - Click a note title or content directly (they are editable).
   - Modify text, then click outside (blur).
   - Expected: Edits persist; refresh page and changes remain.

5) Delete a note
   - Click `Delete` action; confirm.
   - Expected: Note removed; localStorage updated.

6) Pin / Star
   - Click `Pin` and `Star` buttons on a note.
   - Expected: UI updates (icons reflect state); pinned notes appear first in the grid.

7) Search & Filter
   - Use search input to find notes by title/content.
   - Use category filter to narrow by category.
   - Expected: Grid updates accordingly.

8) Drag & Drop reorder
   - Drag a note card and drop onto another position.
   - Expected: Order updates immediately; refresh preserves order.

9) Modal image preview
   - Choose an image in the add/edit modal.
   - Expected: `noteImagePreview` shows the selected image before saving.

10) Persistence & cross-tab sync
   - Open `note.html` in two tabs.
   - Make changes in one tab; verify other tab updates on localStorage `storage` event (may require manual refresh in some browsers).

Diagnostics
- If something fails: open DevTools Console, capture the first JS error stack, and provide steps to reproduce.

Notes
- LocalStorage keys: `fitlife_notes` (notes), `fitlife_settings` (settings).
- Uploaded images are stored as data URLs in localStorage; large images may increase storage usage.

Restore guidance
- Backups created in `backups/notes-backup-2025-11-27_0001/` — `note.html.bak`, `script.js.bak`, `style.css.bak`.
- To restore, overwrite original files with `.bak` contents and reload page.
