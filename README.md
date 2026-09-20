# Campus Hub

A single-page campus utility site with three working features. No build step, no dependencies — one HTML file.

## Features

**01 — Event discovery**
List of upcoming events with name, date, time and venue. Free-text search across name, venue and organiser, category filters (Cultural, Technical, Academic, Sports, Social), and a details view for each event.

**02 — Campus directory**
Searchable list of campus locations. Each entry shows its building/block and a short description. Filter by Academic, Food, Hostel, Administration, Recreation.

**03 — Lost & found**
Create a Lost or Found post with item name, description, location and contact. Browse all posts, search them, filter between Lost and Found (or just the unresolved ones), and mark an item as returned. Posts persist in the browser via `localStorage`.

## Run it locally

Open `index.html` in a browser. That's it.

Or serve it:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Put it on GitHub

```bash
git init
git add .
git commit -m "Campus Hub: events, directory, lost & found"
git branch -M main
git remote add origin https://github.com/<your-username>/campus-hub.git
git push -u origin main
```

## Host it on GitHub Pages

1. In the repo, go to **Settings → Pages**.
2. Under *Source*, choose **Deploy from a branch**.
3. Branch: `main`, folder: `/ (root)`. Save.
4. After a minute the site is live at `https://<your-username>.github.io/campus-hub/`.

## Editing the content

All data lives in `index.html` inside the script block:

- `EVENTS` — the event list. Dates are `YYYY-MM-DD`; categories are picked up automatically, so adding a new one adds a new filter chip.
- `PLACES` — the directory entries. Category must be one of the five in `DIR_CATS`.
- `SEED` — the example lost & found posts shown before anyone posts anything.

## Notes

- Lost & found data is per-browser. Clearing site data clears the posts. Swapping `loadPosts`/`savePosts` for `fetch` calls is the only change needed to put it on a real backend.
- Works down to mobile widths, keyboard navigable, respects reduced-motion.
