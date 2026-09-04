# Biology Labs — the hub

The landing page for the IGCSE Biology revision labs.

The screen is one surface, split in two: on the left the specimen lies on a dark
slab so a lit organ actually glows; on the right it dissolves into paper, where
the reading happens. Point at a lab and its system lights up in the body with the
organ named; point at an organ and the lab it belongs to lights up. Left alone,
the plate tours the nine systems by itself. It all fits on one screen.

**Live:** not published yet — see *Publishing* below.

---

## Adding a lab

Edit **`js/topics.js`**. Nothing else. Give the topic a `url` and set
`status: 'live'`:

```js
{ id:'circulation', no:9, year:'Y10', side:'l', sys:'circulation', anchor:'o-heart',
  title:'Transport in animals', lab:'Circulation Lab',
  blurb:'…',
  status:'live', url:'https://mompel226.github.io/circulation-lab/' },
```

- `sys` is the system that lights up on the plate.
- `anchor` is the organ that gets lit and labelled (`o-heart`, `o-lungs`,
  `o-stomach`, `o-liver`, `o-brain`, `o-urinary`, `o-spleen`, `o-muscles`,
  `o-veins`, `o-uterus`, `o-intestines`, `o-pancreas`, `o-gallbladder`,
  `o-trachea`, `o-larynx`, `o-thyroid`, `o-lymph-neck`, `o-lymph-axilla`).
- `side` is unused in the current layout, but harmless — leave it.

Each system has **two** colours in `css/hub.css`: `--g-<system>` is the glow on
the dark side, `--i-<system>` is the same hue made readable on paper. Add both.
If the anchor is a new organ, give it a display name in the `LANDMARK` map in
`js/hub.js` so the pinned label reads properly.

---

## The anatomical plate

`assets/anatomy/body.svg` is the specimen: a real anatomical plate, not a
drawing of one. Every organ carries `data-sys` (its system) and an
`id` of `o-<organ>`, so CSS can light one system and dim the rest.

The plate is **inlined into `index.html`** so the page works even when it is
opened straight from the file system, with no web server. After editing
`body.svg`, run:

```
python3 tools/inline-plate.py
```

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

The hub is a plain static site — no build step beyond `inline-plate.py`.

Put this folder in its own GitHub repository and turn on GitHub Pages. Since
the labs already live at `mompel226.github.io/digestion-lab/`, the repository
should be named **`mompel226.github.io`**, which serves the hub at the root:

- `mompel226.github.io` → this hub
- `mompel226.github.io/digestion-lab/` → the first lab
- `mompel226.github.io/<next-lab>/` → each one after that

Any other repository name works too; the labs are linked by absolute URL, so
nothing breaks.

---

## Files

```
index.html                the front door: the 3D body
plate.html                the light version: the flat anatomical plate,
                          inlined so it also opens from the file system
css/hub.css               design tokens, the plate treatment, the index
js/topics.js              THE TOPIC REGISTER — the file you edit
js/hub.js                 plate.html: list, hotspots, lighting, pinned label, idle tour
js/body3d.js              index.html: the 3D scene, picking, lighting, idle tour
assets/model/body.glb     the MRI body, 40 organ groups
.nojekyll                 stops GitHub Pages running the files through Jekyll
assets/anatomy/body.svg   the specimen (source of the inlined plate)
assets/anatomy/organs/    the organ paintings
tools/inline-plate.py     re-inlines body.svg into index.html
```

---

## The 3D body (`index.html` — the front door)

A second, heavier landing page: the same nine topics on a body reconstructed
from MRI, which you can turn and look inside.

**It needs to be served over http** (GitHub Pages, or the local preview server).
It cannot be opened by double-clicking the file, because browsers block module
scripts and model loading from `file://`. `plate.html` can.

### Where the body comes from
`assets/model/body.glb` (6.2 MB, 345,000 triangles, 40 organ groups) is built
from **BodyParts3D v3.0** — 3D models segmented from a real full-body MRI by
the Database Center for Life Science in Japan. Every organ is a separate mesh
and they all share one coordinate frame, so nothing is positioned by hand: each
organ sits where it was measured in the body it came from.

Rebuild it with the scripts in the scratch pipeline (`manifest.py`,
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
  shows the male reproductive system only. The flat plate on `index.html` has
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
