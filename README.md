<div align="center">

<h1>🫀 &nbsp;Human Body Hub</h1>

**Nine topics inside one body — Cambridge IGCSE Biology 0610.**

Point at a lab and its organs light up where they really sit. Open the lab and work through the
topic with questions that mark themselves.

[![Open the site](https://img.shields.io/badge/▶_Open_the_site-0969DA?style=for-the-badge&logoColor=white)](https://nlcsbiology.com/human-body-hub/)
[![Light version](https://img.shields.io/badge/Light_version-218BFF?style=for-the-badge&logoColor=white)](https://nlcsbiology.com/human-body-hub/plate.html)

![IGCSE Biology 0610](https://img.shields.io/badge/IGCSE_Biology-0610-3D7A54)
![No sign-up](https://img.shields.io/badge/students-no_sign--up_needed-6FA287)

by **Dr Daniel Mompel Riera** · NLCS Jeju

</div>

![The hub: a body reconstructed from MRI, with the gas exchange system lit](docs/img/hub-3d.png)

---

## Where this sits

One **shelf** of the [Biology Hub](https://nlcsbiology.com/biology-hub/), the front door to
every Biology app here. A student goes front door → this shelf → a lab. The link at the top of
the page goes back up.

| # | Topic | Lab | |
|:--:|-------|-----|:--:|
| 7 | Human nutrition | [**Digestion Lab**](https://nlcsbiology.com/digestion-lab/) | 🟢 live |
| 9 | Transport in animals | Circulation Lab | ⚪ soon |
| 10 | Diseases and immunity | Immunity Lab | ⚪ soon |
| 11 | Gas exchange in humans | Gas Exchange Lab | ⚪ soon |
| 12 | Respiration | Respiration Lab | ⚪ soon |
| 13 | Excretion in humans | Excretion Lab | ⚪ soon |
| 14 | Coordination and response | Coordination Lab | ⚪ soon |
| 15 | Drugs | Drugs & AMR Lab | ⚪ soon |
| 16 | Reproduction | Reproduction Lab | ⚪ soon |

## For your students

Send them the link. No account, no sign-up, no install, nothing to pay — on a phone, a
Chromebook or a school PC.

> [!TIP]
> **Want their scores in a spreadsheet of your own?**
> That is set up once, for every lab at the same time, and it is explained in the main hub:
> **[Would you like to see how your students are doing?](https://github.com/Mompel226/biology-hub#-would-you-like-to-see-how-your-students-are-doing)**
> The script and the class-import window live there too.

## What is on the page

**The 3D body** — `index.html` — reconstructed from a real MRI scan. Turn it, zoom, and peel
back skin, skeleton and muscle to reach what lies underneath. 6 MB.

**The flat plate** — `plate.html` — the same nine topics on an anatomical drawing, a few hundred
kilobytes, for a slow connection or an old device.

Left alone, the plate tours the systems by itself, so anyone glancing at the screen sees what
the body does.

## For developers

Static files, no build step, no framework.

- **`js/topics.js` is the register** — the only file to edit when a lab is finished. Give the
  topic a `url`, change `status` to `live`, done. Each entry carries the organ system to light
  (`sys`) and the organ a label points at (`anchor`).
- `js/hub.js` reads it and wires the paper side to the specimen. `js/body3d.js` renders the
  3D body; `plate.html` holds the inlined SVG (`tools/inline-plate.py` puts it there).
- `css/hub.css` is the whole style. `docs/BUILD-NOTES.md` has the detail, and
  `docs/link-back.md` is the recipe for a lab's link back up here.

Bump `version.txt` **and** every `?v=` stamp together — the stamps are the real cache key.

## Sources and licences

The body is reconstructed from **[BodyParts3D](https://dbarchive.biosciencedbc.jp/en/bodyparts3d/desc.html)**,
© The Database Center for Life Science, licensed under
[CC Attribution-Share Alike 2.1 Japan](https://creativecommons.org/licenses/by-sa/2.1/jp/deed.en).
Anatomical art from [Servier Medical Art](https://smart.servier.com/), CC BY 4.0. Type: Fraunces,
IBM Plex Mono and Inter, all open licences.

Made by **Dr Daniel Mompel Riera** · Biology, NLCS Jeju ·
[dmompelriera@nlcsjeju.kr](mailto:dmompelriera@nlcsjeju.kr)
