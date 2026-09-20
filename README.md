# Campus Hub

A single-page campus utility site with three working features: event discovery, a searchable campus directory, and a **shared** lost and found board backed by a Netlify Function.

## Features

**01 — Event discovery**
Upcoming events with name, date, time and venue. Free-text search across title, venue and organiser, category filters, and a details view per event.

**02 — Campus directory**
34 campus locations across Academic, Food, Hostel, Administration and Recreation. Each entry shows its building or block and a summary of what it houses. Search matches names, blocks and abbreviations (SJT, TT, GDN, SMV, CDMM, CBMR).

**03 — Lost & found (shared across all visitors)**
Reports are stored server-side in Netlify Blobs through a Netlify Function, so anyone who opens the deployed site sees and adds to the same board. Create a Lost or Found report with item, description, location and contact; search it, filter by Lost / Found / Unresolved, and mark an item resolved.

If the API is unreachable — for example when `index.html` is opened directly from disk — the board falls back to this browser's local storage and says so in the status pill, so the feature still demonstrates without a server.

## Project structure

```
index.html                       the entire front end
netlify/functions/lostfound.mjs  GET / POST / PATCH  →  /api/lostfound
package.json                     declares @netlify/blobs
netlify.toml                     publish dir + functions dir
```

## Deploying to Netlify

Push the repo and connect it in Netlify, or drag the folder into the Netlify dashboard.

- **Build command:** leave empty
- **Publish directory:** `.`
- **Functions directory:** `netlify/functions` (already set in `netlify.toml`)

Netlify installs `@netlify/blobs` from `package.json` automatically and provisions the blob store on first write. No environment variables, no database, no signup beyond Netlify itself.

Verify the backend after deploy by opening `https://<your-site>.netlify.app/api/lostfound` — it should return JSON with a `posts` array.

## Running it locally

For the shared board to work locally you need the Netlify CLI, because the API route is a function:

```bash
npm install
npm install -g netlify-cli
netlify dev          # serves the site and /api/lostfound together
```

Opening `index.html` directly also works — it just runs in offline mode.

## Editing the content

All data lives in `index.html`:

- `EVENTS` — dates are `YYYY-MM-DD`; categories generate the filter chips automatically, so a new category needs no other change.
- `PLACES` — category must be one of the five in `DIR_CATS`.
- `SEED` in `netlify/functions/lostfound.mjs` — the starter reports shown before anyone posts.

## Notes

- Posts are capped at 500 and fields are length-limited and sanitised server-side.
- The board refreshes every 60 seconds while the tab is visible.
- There is no authentication: anyone with the URL can post or resolve a report. That is intentional for a campus board, but worth mentioning if you are asked about it.
- Responsive to mobile, keyboard navigable, and fully respects `prefers-reduced-motion`.
