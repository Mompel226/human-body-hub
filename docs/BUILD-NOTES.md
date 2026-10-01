# Human Body Hub — the shelf

One shelf of the Biology Hub: topics 7 and 9–16 of IGCSE 0610 on the human body.

The screen is one surface, split in two: on the left the specimen lies on a dark
slab so a lit organ actually glows; on the right it dissolves into paper, where
the reading happens. Point at a lab and its system lights up in the body with the
organ named; point at an organ and the lab it belongs to lights up. Left alone,
the plate tours the nine systems by itself. It all fits on one screen.

**Live:** https://nlcsbiology.com/human-body-hub/ — the 3D body at the root,
the flat plate at `/plate.html`.

---

## Adding a lab

In this repository, edit **`js/topics.js`**: give the topic a `url` and set
`status: 'live'` (its `detail` is only a fallback — the size comes from the register):

```js
{ id:'circulation', no:9, year:'Y10', side:'l', sys:'circulation', anchor:'o-heart',
  title:'Transport in animals', lab:'Circulation Lab',
  blurb:'…',
  status:'live', url:'https://nlcsbiology.com/circulation-lab/' },
```

- `sys` is the system that lights up on the plate.
- `anchor` is the organ that gets lit and labelled (`o-heart`, `o-lungs`,
  `o-stomach`, `o-liver`, `o-brain`, `o-urinary`, `o-spleen`, `o-muscles`,
  `o-veins`, `o-uterus`, `o-intestines`, `o-pancreas`, `o-gallbladder`,
  `o-trachea`, `o-larynx`, `o-thyroid`, `o-lymph-neck`, `o-lymph-axilla`).
- `side` is unused in the current layout, but harmless — leave it.

Each system has **two** colours in `css/hub.css`: `--g-<system>` is the glow on
the dark side, `--i-<system>` is the same hue made readable on paper. Add both.
All nine systems have theirs already. A new SYSTEM (not a new organ) also needs a
`LANDMARK` entry in `js/hub.js`, and `LANDMARK` and `GLOW` entries in `js/body3d.js`;
a new anchor organ needs only its `o-<organ>` id in `body.svg`.

Outside this repository, a new lab also needs:

1. its row in `labs-shared/labs.json` — the lab's own build writes its station and
   question counts there; then `node tools/stamp.mjs` here copies it in;
2. on the front door (biology-hub `js/shelves.js`): the shelf door's `detail`
   ("2 labs open · 7 being built") and an entry in `open`, then that repository's
   `tools/deploy.mjs`;
3. a row in the labs script's `LABS` (biology-hub `apps-script/Code.gs`), which
   Daniel pastes;
4. the sitemap (`root-site/sitemap.xml`) and `PUBLISHED` in the workspace's
   `tools/status.mjs`.

---

## The anatomical plate

`assets/anatomy/body.svg` is the specimen: a real anatomical plate, not a
drawing of one. Every organ carries `data-sys` (its system) and an
`id` of `o-<organ>`, so CSS can light one system and dim the rest.

The plate is **inlined into `plate.html`** (between its `PLATE:START` and
`PLATE:END` markers) so that page works even when it is opened straight from the
file system, with no web server. `index.html` is the 3D body and has no plate.
After editing `body.svg`, the plate in `plate.html` has to be replaced with it.
`tools/inline-plate.py` was written to do that, but it still opens `index.html`,
finds no markers and stops (a known fault, not yet fixed): until it is pointed at
`plate.html`, copy the new SVG between the markers by hand, then run
`node tools/stamp.mjs`.

Organ paintings live in `assets/anatomy/organs/` as separate PNGs, positioned
by the SVG at their true anatomical coordinates.

### Sources and licences
- Body, skeleton, vessels and organ paintings adapted from
  **Mikael Häggström, *Human body diagrams*** (Wikimedia Commons, **CC0** —
  public domain, no attribution required, credited anyway).
- Uterus, ovaries and fallopian tubes from **Servier Medical Art**
  (**CC BY 4.0** — attribution required, and it is in the page footer).

Keep the footer credit if you add more Servier art.

---

## Publishing

The hub is a plain static site. Before every push run `node tools/stamp.mjs`: it
writes every `?v=` in `index.html` and `plate.html`, and `version.txt`, from one
value (leaving `body.glb?v=` alone: re-downloading 9 MB on every deploy is not
free), and copies in `labs-shared/labs.json` and `progress.js`. Never bump the
stamps by hand. It is published from the **`human-body-hub`** repository, `main`
branch, by GitHub Pages:

- `nlcsbiology.com/human-body-hub/` → this hub
- `nlcsbiology.com/digestion-lab/` → topic 7, the first lab
- `nlcsbiology.com/circulation-lab/` → topic 9
- `nlcsbiology.com/<next-lab>/` → each one after that

Each lab is its own repository. They are linked by absolute URL in both
directions — `url` in `js/topics.js` going out, and one line in each lab's
header coming back (`docs/link-back.md`) — so nothing here has to know where a
lab lives beyond that one field.

---

## Files

```
index.html                the front door: the 3D body
plate.html                the light version: the flat anatomical plate,
                          inlined so it also opens from the file system
css/hub.css               design tokens, the plate treatment, the index
js/topics.js              the topic register (see Adding a lab)
js/hub.js                 plate.html: list, hotspots, lighting, pinned label, idle tour
js/body3d.js              index.html: the 3D scene, picking, lighting, idle tour
js/progress.js            GENERATED by tools/stamp.mjs: a copy of labs-shared/progress.js
js/data/labs.js, .json    GENERATED by tools/stamp.mjs from labs-shared/labs.json
assets/model/body.glb     the MRI body: 42 organ groups plus skin and skeleton
assets/model/body_manifest.json  what build_glb.py put in it (no page reads it)
.nojekyll                 stops GitHub Pages running the files through Jekyll
assets/anatomy/body.svg   the specimen (source of the inlined plate)
assets/anatomy/organs/    the organ paintings
tools/stamp.mjs           the step before every push (see Publishing)
tools/inline-plate.py     meant to re-inline body.svg into plate.html (see The anatomical plate)
tools/model-build/        rebuilds body.glb (its README has the steps)

README.md                 the front page
docs/link-back.md         the one line that points a lab back here
```

### The marks spreadsheet is not here any more

It collects **every** lab, not this shelf's, so it moved to the main hub on 7 September 2026:
`Code.gs`, `ClassroomImport.html` and the `gastest.js` harness now live in
[**biology-hub**](https://github.com/Mompel226/biology-hub) (and its open twin,
[igcse-biology-hub](https://github.com/Mompel226/igcse-biology-hub)), with the whole set-up
guide in that repository's README. Nothing about it remains here.

`tools/sync-readme.mjs` went with it — it kept a copy of the script pasted inside this README
in step with the real file, and that copy is gone: the guide links to the files instead.

---

## The 3D body (`index.html` — the front door)

A second, heavier landing page: the same nine topics on a body reconstructed
from MRI, which you can turn and look inside.

**It needs to be served over http** (GitHub Pages, or the local preview server).
It cannot be opened by double-clicking the file, because browsers block module
scripts and model loading from `file://`. `plate.html` can.

### Where the body comes from
`assets/model/body.glb` (8.9 MB, about 516,000 triangles, 42 organ groups plus
skin and skeleton) is built
from **BodyParts3D v3.0** — 3D models segmented from a real full-body MRI by
the Database Center for Life Science in Japan. Every organ is a separate mesh
and they all share one coordinate frame, so nothing is positioned by hand: each
organ sits where it was measured in the body it came from.

Rebuild it with `tools/model-build/` (steps in its README: `manifest.py`,
`build_glb.py`); `manifest.py` lists every structure by its FMA identifier, so
the selection can be checked against the Foundational Model of Anatomy rather
than taken on trust.

### Accuracy checks that were run
- **Laterality**: liver, gall bladder and right lung on the body's right;
  stomach, spleen, heart and left lung on the left; trachea, pancreas and
  bladder on the midline. 13 of 14 as expected — the fourteenth, the descending
  aorta, sits ~12 mm left of the midline, which is correct anatomy.
- **Vertical order**: brain → heart → liver → kidney → bladder → testis, strictly
  descending.
- **Facing**: sternum anterior to the thoracic vertebrae, so the body faces the
  camera rather than being reversed.

### What this dataset does not contain
- **It is a male body.** There are no ovaries, uterus or oviducts, so Topic 16
  shows the male reproductive system only. The flat plate (`plate.html`) has
  the female organs (from Servier).
- **No spinal cord** — only the central canal, which would be misleading to
  label as the cord, so it is left out. Topic 14 shows brain, eyes, optic
  nerves, pituitary and adrenal glands.
- **No lymph nodes or tonsils** — Topic 10 shows the spleen and thymus.
- The meshes carry no textures. Surface colour is authored in `build_glb.py`
  and lit in the browser.

### Licence — read this before publishing
BodyParts3D is **CC Attribution-ShareAlike 2.1 Japan**. Two obligations:
1. The credit line in the page footer must stay.
2. ShareAlike: `body.glb` is a derivative, so if you publish it you are
   licensing that model onward under the same terms. That covers the model
   file, not the rest of the site.
