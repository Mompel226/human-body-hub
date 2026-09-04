# Linking a lab back to the hub

The hub already links **out** to every live lab — that comes from `url` in
`js/topics.js` and needs nothing at the lab's end.

For a lab to link **back**, add one line to that lab's `index.html`. It reuses the
Digestion Lab's existing `.hbtn` class, so no CSS changes are needed:

```html
<a class="hbtn" href="https://mompel226.github.io/IGCSE-revision-app/"
   title="Back to all the labs">← All labs</a>
```

In `digestion-lab/index.html` it goes inside `.hdr__stats`, immediately before the
"How to use" button:

```html
    <button class="hbtn" id="btnHelp">…</button>   ← put the line above this one
```

Remember the two rules that repository runs on: bump `version.txt` and the `?v=`
stamps in the same commit, and never copy `stations.master.js` into the repo.

## Why this is not applied automatically

`digestion-lab` is a separate repository with its own session working on it. Two
agents committing to one repo at the same time is how you get a rejected push that
looks like a permissions failure. So the change is written down here rather than
made from this side.
