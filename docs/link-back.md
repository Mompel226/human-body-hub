# Linking a lab back to the hub

The hub links **out** to every live lab on its own — that comes from `url` in
`js/topics.js` and needs nothing at the lab's end.

For a lab to link **back**, add one line to that lab's `index.html`, inside
`.hdr__stats` and before the "How to use" button. It reuses the Digestion Lab's
existing `.hbtn` class, so no CSS changes are needed:

```html
<a class="hbtn" href="https://mompel226.github.io/human-body-hub/"
   title="All of the Biology Labs">← All labs</a>
```

**Done in `digestion-lab`** (in the header, and again in the footer line "One of
the Biology Labs"). This page is the recipe for the next lab.

Remember the two rules the lab repositories run on: bump `version.txt` and the
`?v=` stamps in the same commit, and never copy `stations.master.js` into the
repo.

## Why this is written down rather than applied from here

Each lab is a separate repository, often with its own session working on it. Two
agents committing to one repo at the same time is how you get a rejected push
that looks like a permissions failure. So the change is written down here, and
made from whichever session owns that lab.
