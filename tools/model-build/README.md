# Rebuilding the 3D body

`manifest.py` is the anatomy: every structure listed by its FMA identifier,
grouped into the nine IGCSE systems. Edit that to change what the body contains.

To rebuild `assets/model/body.glb`:

1. `pip install trimesh fast-simplification`
2. Download the meshes named in the manifest from the BodyParts3D mirror into
   a `stl/` folder beside these scripts:
   `https://raw.githubusercontent.com/Kevin-Mattheus-Moerman/BodyParts3D/main/assets/BodyParts3D_data/stl/<FMAID>.stl`
3. `python3 build_glb.py` — decimates each organ to its triangle budget, colours
   it, and writes `body.glb` plus `body_manifest.json`.
4. Copy `body.glb` into `assets/model/`.

`stl_named.json` maps every available mesh id to its anatomical name;
`stl_index.json` gives file sizes. `resolve.py` expands a composite structure
(e.g. "heart") into the individual meshes that make it up.
