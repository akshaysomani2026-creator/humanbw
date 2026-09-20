import { getStore } from "@netlify/blobs";

/**
 * Shared Lost & Found store.
 * Every visitor to the deployed site reads and writes the same list.
 *
 *   GET    /api/lostfound          -> { posts: [...] }
 *   POST   /api/lostfound          -> create a post   { kind, item, place, desc, contact }
 *   PATCH  /api/lostfound          -> toggle resolved { id }
 *
 * Data lives in Netlify Blobs, which requires no setup beyond deploying the site.
 */

const KEY = "posts";
const MAX_POSTS = 500;

const SEED = [
  {
    id: "s1", kind: "found", item: "Set of keys on a red lanyard",
    place: "Technology Tower, basement corridor",
    desc: "Three keys and a cupboard key. Handed in at the seminar hall entrance.",
    contact: "lostandfound@campus.edu", at: Date.now() - 864e5 * 2, done: false
  },
  {
    id: "s2", kind: "lost", item: "Casio FX-991EX calculator",
    place: "SJT 301",
    desc: "Register number written inside the cover in black marker.",
    contact: "student@campus.edu", at: Date.now() - 864e5, done: false
  },
  {
    id: "s3", kind: "found", item: "Blue ID card holder",
    place: "Main Gate food court",
    desc: "Contains a library card and a bus pass. Held at the food court counter.",
    contact: "lostandfound@campus.edu", at: Date.now() - 864e5 * 4, done: false
  }
];

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" }
  });

const clean = (v, max) => String(v ?? "").replace(/\s+/g, " ").trim().slice(0, max);

export default async (req) => {
  // Strong consistency so a new post is visible immediately after it is created.
  const store = getStore({ name: "lostfound", consistency: "strong" });

  const read = async () => {
    const stored = await store.get(KEY, { type: "json" });
    return Array.isArray(stored) ? stored : SEED;
  };

  try {
    if (req.method === "GET") {
      return json({ posts: await read() });
    }

    if (req.method === "POST") {
      const body = await req.json();
      const item = clean(body.item, 120);
      const place = clean(body.place, 120);

      if (!item || !place) {
        return json({ error: "An item name and a location are required." }, 400);
      }

      const post = {
        id: "p" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
        kind: body.kind === "found" ? "found" : "lost",
        item,
        place,
        desc: clean(body.desc, 400),
        contact: clean(body.contact, 120),
        at: Date.now(),
        done: false
      };

      const posts = [post, ...(await read())].slice(0, MAX_POSTS);
      await store.setJSON(KEY, posts);
      return json({ posts, created: post.id }, 201);
    }

    if (req.method === "PATCH") {
      const { id } = await req.json();
      const posts = await read();
      const target = posts.find((p) => p.id === id);

      if (!target) return json({ error: "That post no longer exists." }, 404);

      target.done = !target.done;
      await store.setJSON(KEY, posts);
      return json({ posts });
    }

    return json({ error: "Method not allowed." }, 405);
  } catch (err) {
    return json({ error: "The lost and found service is unavailable.", detail: String(err) }, 500);
  }
};

export const config = { path: "/api/lostfound" };
