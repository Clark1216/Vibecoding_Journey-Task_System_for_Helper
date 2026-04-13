# Helper Daily Task Log Web App

A mobile-friendly web app for logging daily household tasks completed by your domestic helper, including optional photo proof for each task.

## Features
- Add tasks with date, task name, and optional notes.
- Take or upload a photo per task (`accept="image/*"` + camera-friendly input).
- Preview selected photo before saving.
- View task history sorted by newest date first.
- Data is saved automatically in browser `localStorage`.
- Clear all logged tasks when needed.

## Run locally
Because this is a static app, you can open `index.html` directly in a browser.

Or run a simple local web server:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000` from phone or desktop on the same network.

## Files
- `index.html` – layout and UI.
- `styles.css` – styling.
- `app.js` – task logic, image processing, and storage.

## Notes
- Photos are compressed client-side before saving to reduce storage use.
- Since storage uses browser `localStorage`, data stays on that device/browser unless exported or synced with a backend.

## Next upgrades (optional)
- Add user login and cloud sync (e.g., Firebase/Supabase).
- Export logs to CSV for monthly reviews.
- Add per-task edit/delete actions.
