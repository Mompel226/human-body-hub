# Linking a lab back to the hub

The hub links **out** to every live lab on its own — that comes from `url` in
`js/topics.js` and needs nothing at the lab's end.

For a lab to link **back**, add one line to that lab's `index.html`, inside
`.hdr__stats` and before the "How to use" button — one level up, to this shelf.
It reuses the labs' `.hbtn` class, so no CSS changes are needed:

```html
<a class="hbtn" href="https://nlcsbiology.com/human-body-hub/"
   title="The human body: every body topic, and this lab">← The body</a>
```

and end the footer with the shelf, then the front door:

```html
One of the <a href="https://nlcsbiology.com/human-body-hub/">Human Body</a> labs ·
<a href="https://nlcsbiology.com/biology-hub/">Biology Hub</a>
```

**The Circulation Lab is the example** (`circulation-lab/index.html`); the
Digestion Lab follows it too (since 30 Sep 2026).

Remember the two rules the lab repositories run on: never bump `version.txt` or
the `?v=` stamps by hand — the lab's own `node tools/build.mjs` writes them — and
never copy `stations.master.js` into the repo.

## Why this is written down rather than applied from here

Each lab is a separate repository, often with its own session working on it. Two
agents committing to one repo at the same time is how you get a rejected push
that looks like a permissions failure. So the change is written down here, and
made from whichever session owns that lab.
