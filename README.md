<div align="center">

# Biology Labs

**Interactive revision for Cambridge IGCSE Biology 0610 — the human body.**

Nine topics live inside one body. Point at a lab and its organs light up where they
really sit; open the lab and work through the topic with questions that mark themselves.

by **Dr Daniel Mompel Riera** · NLCS Jeju

[**→ Open the site**](https://mompel226.github.io/IGCSE-revision-app/) &nbsp;·&nbsp;
[Light version](https://mompel226.github.io/IGCSE-revision-app/plate.html) &nbsp;·&nbsp;
[Digestion Lab](https://mompel226.github.io/digestion-lab/)

</div>

---

![The hub: a body reconstructed from MRI, with the gas exchange system lit](docs/img/hub-3d.png)

The front door is a **human body reconstructed from MRI**. Drag it to turn it, scroll to
zoom, and peel the skin, skeleton and muscle away to reach what lies underneath.
A layer you switch off stays off — pointing at its own lab will not bring it
back, so it can never sit between you and the organ you are trying to click. Point at a lab on the right and that system
lights up in the body; point at an organ and its lab lights up in the list. Left alone,
it walks through the nine systems by itself.

---

## The light version

Not every student is on a fast connection, and the 3D page pulls 6 MB. So there is a
second front door: the same nine topics on a flat anatomical plate, 1.5 MB, which loads
instantly and even works opened straight from a memory stick.

![The light version: a flat anatomical plate with the circulatory system lit](docs/img/hub-plate.png)

The two pages link to each other, so nobody gets stuck on the heavy one.

---

## The nine topics

| # | Topic | Lab | Lights up |
|---|-------|-----|-----------|
| 7 | Human nutrition | **Digestion Lab** — [live](https://mompel226.github.io/digestion-lab/) | stomach, liver, gall bladder, pancreas, the whole gut |
| 9 | Transport in animals | Circulation Lab | heart and valves, the coronary vessels, aorta, venae cavae, pulmonary vessels, carotids, jugulars, subclavians, the gut and liver arteries, and the iliac tree into the legs |
| 10 | Diseases and immunity | Immunity Lab | spleen, thymus |
| 11 | Gas exchange in humans | Gas Exchange Lab | trachea, bronchi, all five lung lobes, diaphragm, intercostal muscles |
| 12 | Respiration | Respiration Lab | skeletal muscle head to foot — where a student can feel it |
| 13 | Excretion in humans | Excretion Lab | kidneys, ureters, bladder, renal vessels |
| 14 | Coordination and response | Coordination Lab | brain, eyes, optic nerves, pituitary, adrenals |
| 15 | Drugs | Drugs & AMR Lab | the bloodstream that carries them |
| 16 | Reproduction | Reproduction Lab | reproductive organs |

One is built. The other eight are on the way.

---

## The anatomy is measured, not drawn

The body is **BodyParts3D** — organs segmented from a real full-body MRI by the Database
Center for Life Science in Japan. Every organ is a separate mesh sharing the scanner's
coordinate frame, so nothing is placed by hand: each one sits where it was measured.
Structures are chosen by FMA identifier, listed in
[`tools/model-build/manifest.py`](tools/model-build/manifest.py).

<details>
<summary>The checks that were run, and what the dataset does not contain</summary>

**Checks that were run before shipping**

- **Laterality** — the left/right convention was derived from the two meshes whose names
  settle it, then 14 structures were tested. Liver, gall bladder and right lung on the
  body's right; stomach, spleen, heart and left lung on the left; trachea, pancreas and
  bladder on the midline. Thirteen as expected; the fourteenth, the descending aorta,
  came out 12 mm left of the midline — which is correct anatomy, not an error.
- **Vertical order** — brain → heart → liver → kidney → bladder → testis, strictly descending.
- **Facing** — sternum anterior to the thoracic vertebrae, so the body faces the viewer
  rather than being mirrored.

**What the dataset does not contain**, stated plainly rather than faked:

- It is a **male body** — no ovaries, uterus or oviducts. Topic 16 shows the male organs
  in 3D; the flat plate carries the female ones.
- **The vessels stop at the trunk.** There is no femoral, brachial, popliteal,
  axillary, radial, ulnar or tibial artery in the dataset — the segmentation
  covered the trunk only. Circulation therefore runs from the jaw to the top of
  the thigh and no further. The cut ends are capped so they read as stumps
  rather than open pipes, but the limb vasculature cannot be conjured up.
  There is no hepatic portal vein either, though the splenic and mesenteric
  veins that feed it are present.
- **Almost no nervous system.** This is the dataset's biggest gap. Searching all 937
  meshes turns up two optic nerves and the central canal of the spinal cord — and
  nothing else. No spinal cord, no peripheral nerves, no plexuses, no ganglia. The
  canal is left out rather than labelled as the cord, which would mislead. Topic 14
  therefore shows brain, eyes, optic nerves, pituitary and adrenal glands. Nerves
  would have to come from a different source.
- **No lymph nodes or tonsils** — Topic 10 shows spleen and thymus.

</details>

---

## Adding a lab

Edit **one file**: [`js/topics.js`](js/topics.js). Give the topic a `url`, set
`status: 'live'`, done — both pages pick it up.

```js
{ id:'circulation', no:9, year:'Y10', sys:'circulation', anchor:'o-heart',
  title:'Transport in animals', lab:'Circulation Lab',
  blurb:'Double circulation, the heart, blood vessels and what blood carries.',
  status:'live', url:'https://mompel226.github.io/circulation-lab/' },
```

Each lab is its own repository and its own site. The hub is the signpost.

## The marks spreadsheet

One Google Sheet collects **every** lab. A tab per lab, your Google Classroom rosters
beside them, and the switch that closes Mastery during a test — one script, one
deployment, one URL pasted into every lab's `js/config.js`.

You do not need to know any Apps Script: make a Sheet, paste the two files below in,
run `setup`, deploy. Five minutes, once, for all nine labs.

| Tab | What is in it |
|---|---|
| **Setup** | what everything is, your web app URL, and the buttons — tick one, it runs and unticks itself |
| **Mastery** | the switch: a row per class, a column per lab, a checkbox in each. Untick one box and that class gets Test only, in that lab |
| **Labs** | a row per lab: the message shown when Mastery is closed, how many questions it has, and a live count of hand-ins |
| **Students** | the dashboard: every student, their class, and their best score in **every lab** — the nine columns are there from the start, empty until that lab is used |
| **Digestion**, **Circulation**, … | a tab per lab: every hand-in, newest at the bottom |
| **Rejected** | anything that did not add up — a wrong code, an impossible score — kept out of the real tabs, with the reason |

**Checked before it ships.** `tools/gastest.js` runs the whole script against a stand-in for
Google Sheets — `node tools/gastest.js apps-script/Code.gs`. It cannot tell you whether the
sheet looks nice, but it runs every menu item, every button, an import, a hand-in, a forged
hand-in and the gate, and fails on anything undefined or out of bounds. That is the class of
fault that had been reaching Daniel.

**You should not have to guess what anything is.** Every tab is described column by column in
one place in the script, and the look follows from that:

* **Hover any heading** and it tells you what that column is for.
* **Dark green heading** — filled in for you. **Amber heading with a ✎** — yours to change.
  Nothing else needs touching.
* Headings never wrap: each column is at least as wide as its own title.
* Where the answer is one of a few, the cell is a **dropdown** — the class list, `mastery`/`test`,
  `complete`/`progress`.
* Formatting stops at the last row that has something in it, so an empty sheet looks empty
  rather than a thousand striped blank rows.
* Frozen headings, the name and class frozen while you scroll right, and a filter row on
  every sheet.
* **Muted by default, strong colour only where something needs looking at.** Percentages get
  a soft wash rather than a traffic light; a score under 40% goes red and bold; a refused
  hand-in and a closed Mastery box are the loudest things on screen. One typeface, one size,
  no gridlines — banding and spacing carry the structure, with a hairline where one group of
  columns ends and the next begins.
* Tabs are colour-coded along the bottom: the dashboard and lab tabs green, the Mastery grid
  amber, Rejected red.

**Importing a class does all of this for you** — it creates any tab that is missing, gives every
new class its row in the Mastery grid, refreshes the dashboard and dresses the lot. There is
nothing to press afterwards. **🧪 Biology Labs ▸ Tidy up** does the same on demand, if you have
been rearranging things by hand.

### Setting it up

1. **Make one new Google Sheet.** The name does not matter.
2. **From that Sheet: Extensions ▸ Apps Script.** Delete what is there and paste in
   **`Code.gs`** (below). **You do not need to paste any id** — the script sits inside the
   Sheet, so it works out which one it is the first time you run it, and remembers.
   *(`SHEET_ID` at the top is only for a stand-alone script, or to point it at another Sheet.)*
3. **Add the dialog.** **+** next to *Files* ▸ **HTML** ▸ name it exactly `ClassroomImport`
   ▸ paste in **`ClassroomImport.html`** (below). Save.
4. **Switch on Google Classroom.** In the editor's **left sidebar**, next to **Services**,
   press **+** ▸ choose **Google Classroom API** ▸ **Add**. Leave the identifier as
   `Classroom`. *(Miss this and the import window says "Classroom is not defined".)*
5. **Run ▸ `setup`.** Authorise when asked — your own script, your own Sheet. It builds and
   styles every tab.
6. **Deploy ▸ New deployment ▸ Web app**, *Execute as* **Me**, *Who has access* **Anyone**.
   Deploy, copy the `/exec` URL. *(“Anyone” sounds alarming — see below for what it does and
   does not open up. It is the only setting that works, and it does not share your Sheet.)*
7. **Paste that URL** into each lab's `js/config.js` as `submitUrl`, commit, push.

> **After any edit to the script:** Deploy ▸ Manage deployments ▸ pencil ▸ *Version: New
> version* ▸ Deploy. Editing alone changes nothing.

**If something is not working:** 🧪 Biology Labs ▸ **Check the set-up**. It tells you in one
box whether `SHEET_ID` is set, whether the Sheet opens, whether Google Classroom is switched
on and authorised, how many students are imported and how many lab tabs exist.

| What you see | What it means |
|---|---|
| `Illegal spreadsheet id or key: PASTE_YOUR_SHEET_ID_HERE` | the **deployment** is an older snapshot than the editor. Deploy ▸ Manage deployments ▸ ✏️ ▸ *Version: New version* ▸ Deploy. Use the pencil, not "New deployment", to keep the same URL |
| `Classroom is not defined` | the Classroom service was not added — left sidebar: Services ▸ + ▸ Google Classroom API ▸ Add, then run `setup` once |
| a permission prompt on first run | expected: it is your own script, on your own Sheet and your own Classroom |
| the import window lists no courses | the account you are signed in as has no **active** Classroom courses |
| a lab's tab never appears | that lab has not handed in yet — tabs are made on the first submission |

### The three things you will actually do

**Import your classes.** 🧪 Biology Labs ▸ *Import students from Classroom…* It lists your
active courses, guesses a class code from each name, and shows how many of that class you
already have. Tick, check the codes, Import — each ticks green as it lands, and closing the
window does not stop it. When it finishes it builds and formats the whole spreadsheet, so
after your first import there is nothing else to set up. Run it again whenever someone joins: students are keyed on their
school email, so it adds the new ones, moves anyone whose class changed, and never
duplicates.

**Close Mastery for one class.** The **Mastery** tab is a grid: a row per class — plus
`(everyone)` for any class not listed — and a column per lab. Untick **9A × Digestion** and 9A
gets Test only in that lab, while 9B and 9C carry on with their homework. A class row beats
`(everyone)`, so the usual pattern is: leave `(everyone)` ticked, untick the one class that is
sitting the test, tick it back at the end. Classes appear in the grid as soon as you import
them, and *Close Mastery everywhere* in the menu is there for the whole-year case.

Every open page follows within about two minutes.

> **How a page knows which class it is.** It asks. Three ways, in the order they happen: the
> link you hand out (`…/digestion-lab/?class=9A` — set one per class in Classroom and nobody
> is ever asked), the class they choose when they hand in, or a one-question picker. The
> picker only appears when a test is actually running for some class and that page still does
> not know whose it is — so a student who has never said which class they are in cannot slip
> past a closure by staying quiet.

With no Sheet set up at all, `masteryOpen` in a lab's `js/config.js` closes Mastery for
everyone, one push instead of one click.

**See how everyone is doing.** The **Students** tab is the dashboard: a row per student,
their class, and their best score in each of the nine labs, red through amber to green. All
nine columns are there from the start — a lab that does not exist yet is simply an empty
column with a greyed heading. Filter the *Class* column to see one class; the name and class
stay put when you scroll across. It refreshes when you import, and any time from the button
or the menu.

Each lab's own tab holds the detail: a row per hand-in — when, name, class, mode, score, %,
whether it was finished, **how many checks it took**, **how many were right first time**, and
how long they had been working. Those last three are the point of Mastery:
`113/113 · 214 checks · 71 right first time` is the evidence somebody ground it out.

> A hand-in is matched to a student **by name**. If someone types their name differently from
> the way it appears in Classroom, the refresh says so and names them, rather than guessing.

### What is on the menu

| 🧪 Biology Labs ▸ | What it does |
|---|---|
| **Import students from Classroom…** | the main one. Adds new students, and finishes by building and formatting everything |
| **Check the set-up** | is the Sheet found, is Classroom switched on and authorised, how much is in here |
| **Refresh everyone's progress** | re-reads the lab tabs into the dashboard |
| **Tidy up** | rebuild anything missing and re-apply the formatting. The same as Run ▸ `setup` |
| **Close / Open Mastery everywhere** | every class, every lab, in one go. For one class, use the Mastery grid |

The first four also sit as tick-box buttons on the **Setup** tab, except the import — that
one opens a window, which a spreadsheet button is not allowed to do.

### Marks into Google Classroom

Classroom only lets a script grade work that **the same script created** — an assignment made
by hand in the Classroom UI cannot be graded through the API. So either set an assignment that
asks for the completion code the lab shows (no setup), or let the script make the assignment
and push the marks:

```javascript
createAssignmentFor('digestion-lab', 'YOUR_COURSE_ID')                 // once
pushGradesFor('digestion-lab', 'YOUR_COURSE_ID', 'THE_COURSEWORK_ID')  // after a test
```

`pushGradesFor` takes each student's best score from that lab's tab and matches on name
against the class list. A name it cannot match is left alone and listed in the log.

### “Who has access: Anyone” — what that really means

It has to be *Anyone*, because the labs are ordinary web pages with no login: the student's
browser posts to the script as a stranger. *Anyone with a Google Account* makes the browser
follow a sign-in redirect instead, and the hand-in never arrives.

What it does **not** do is share your spreadsheet. Nobody gets access to the Sheet, to
Classroom, or to your Drive. The URL exposes exactly two things:

* a **GET** that answers one question — is Mastery open? — and nothing else;
* a **POST** that can add one row to a lab tab.

So the worst somebody can do with the URL is put rubbish rows in a sheet you own, which you
can delete. They cannot read a single mark.

Three things keep that in check:

* **Anything that does not add up is quarantined.** A wrong completion code, a score above
  the total, an impossible total, a missing name — the row goes to a **Rejected** tab with
  the reason, never into a lab's tab. The lab tabs stay trustworthy.
* **A shared word, if you want one.** Set `SUBMIT_TOKEN` at the top of `Code.gs` and the same
  word as `submitToken` in each lab's `js/config.js`. Posts without it are refused. Be
  straight about what this buys: `config.js` ships with the site, so a student who reads the
  source can find the word. It stops someone who merely has the URL, not someone determined.
* **A forged row usually looks forged.** The metadata gives it away — 113/113 in 113 checks,
  0 right first time, "0 min" since starting. Sort by *Checks* and the odd one stands out.

If you would rather not run any of it, leave `submitUrl` empty: students get their completion
code on screen to paste into Classroom, and nothing is posted anywhere.

**The other honest limits.** The Mastery switch is a classroom control, not security: the labs
are static sites and a determined student can work around anything the browser is told. If the
Sheet cannot be reached, a lab keeps the last answer it had. And the only way to make a test
genuinely un-grindable is different questions in the test.

### The two files to paste

<details>
<summary><b>Code.gs</b> — the whole script (also at <a href="apps-script/Code.gs">apps-script/Code.gs</a>)</summary>

```javascript
/**
 * Biology Labs — one spreadsheet for every lab
 * ============================================
 * Copyright (c) 2025-2026 Daniel Mompel Riera. All rights reserved.
 *
 * What this does
 *   • Collects hand-ins from every Biology Lab into one Sheet, a tab per lab.
 *   • Imports your Google Classroom rosters, so the marks sit next to real names
 *     and classes. Re-run it whenever someone joins: it adds, never duplicates.
 *   • Serves each lab's "Mastery open" switch, so you can close Mastery during a
 *     test from a checkbox here, with no redeploy of the site.
 *   • Formats every tab so it is readable: nothing truncated, nothing too narrow,
 *     frozen headers, filters, banding. Re-apply it any time from the menu.
 *
 * SET UP  (five minutes, once, for all nine labs)
 *   1. Make one new Google Sheet. The name does not matter.
 *   2. From that Sheet: Extensions ▸ Apps Script. Delete what is there, paste this file in.
 *      You do NOT need to paste any id: the script is inside the Sheet, so it works out
 *      which one it is the first time you run it, and remembers.
 *      Then + (next to Files) ▸ HTML ▸ name it exactly  ClassroomImport
 *      and paste apps-script/ClassroomImport.html into it. Save.
 *   4. Services (+) ▸ Classroom ▸ Add.        (needed for the roster import)
 *   5. Run ▸ setup. Authorise when asked. It builds and styles every tab.
 *   6. Deploy ▸ New deployment ▸ Web app
 *        Execute as:      Me
 *        Who has access:  Anyone
 *      Deploy, copy the /exec URL, and paste it into each lab's js/config.js
 *      as submitUrl. One URL, all labs.
 *
 * AFTER ANY EDIT to this file: Deploy ▸ Manage deployments ▸ pencil ▸
 * Version: New version ▸ Deploy. Editing alone changes nothing.
 */

var SHEET_ID = 'PASTE_YOUR_SHEET_ID_HERE';

/* Every lab that can hand in. `id` is what the site sends as `app`; `tab` is the
   tab it is written to. Add a row here (or in the Labs tab) as each lab is built. */
var LABS = [
  { id:'digestion-lab',     name:'Digestion',        topic:'7 · Human nutrition',       questions:113 },
  { id:'circulation-lab',   name:'Circulation',      topic:'9 · Transport in animals',  questions:0 },
  { id:'immunity-lab',      name:'Immunity',         topic:'10 · Diseases and immunity',questions:0 },
  { id:'gas-exchange-lab',  name:'Gas exchange',     topic:'11 · Gas exchange',         questions:0 },
  { id:'respiration-lab',   name:'Respiration',      topic:'12 · Respiration',          questions:0 },
  { id:'excretion-lab',     name:'Excretion',        topic:'13 · Excretion',            questions:0 },
  { id:'coordination-lab',  name:'Coordination',     topic:'14 · Coordination',         questions:0 },
  { id:'drugs-lab',         name:'Drugs & AMR',      topic:'15 · Drugs',                questions:0 },
  { id:'reproduction-lab',  name:'Reproduction',     topic:'16 · Reproduction',         questions:0 }
];

var T_SETUP = 'Setup', T_LABS = 'Labs', T_STUDENTS = 'Students', T_REJECTED = 'Rejected', T_MASTERY = 'Mastery';
var EVERYONE = '(everyone)';

/* Optional. Leave '' and anyone who finds the URL can post a row. Set a word here AND the
   same word as `submitToken` in each lab's js/config.js, and a post without it is refused.
   The labs are public sites, so the word is readable by anyone who looks at config.js — it
   stops drive-by posting to a URL somebody stumbled on, not a student who reads the source. */
var SUBMIT_TOKEN = '';

/* House colours, so the Sheet looks like the labs it collects. */
var INK = '#14572B', INK_SOFT = '#E4EFE7', LINE = '#C9D8CD', WARN = '#B8860B', BAD = '#B03A2E';

/* ============================================================
   The menu
   ============================================================ */
function onOpen() {
  SpreadsheetApp.getUi().createMenu('🧪 Biology Labs')
    .addItem('🎓  Import students from Classroom…', 'showClassroomImport')
    .addItem('🩺  Check the set-up', 'checkSetup')
    .addSeparator()
    .addItem('📊  Refresh everyone\'s progress', 'refreshDashboard')
    .addItem('🎨  Tidy up  (rebuild anything missing, re-apply the formatting)', 'setup')
    .addSeparator()
    .addItem('🔒  Close Mastery everywhere', 'closeMasteryAll')
    .addItem('🔓  Open Mastery everywhere', 'openMasteryAll')
    .addToUi();
}

/* ============================================================
   1. Receiving a hand-in
   ============================================================ */
function doPost(e) {
  try {
    var d = JSON.parse(e.postData.contents);
    var lab = _labById(String(d.app || ''));
    if (!lab) return _text('unknown lab: ' + d.app);
    if (SUBMIT_TOKEN && String(d.token || '') !== SUBMIT_TOKEN) return _text('refused');

    var name  = String(d.name || '').trim().slice(0, 80);
    var form  = String(d.form || '').trim().slice(0, 20);
    var mode  = String(d.mode || '').trim().slice(0, 20);
    var score = Number(d.score) || 0;
    var total = Number(d.total) || 0;

    var genuine = (_code(lab.id, name, form, score + '/' + total) === String(d.code || ''));
    var flags = [];
    if (lab.questions && total !== lab.questions) flags.push('NOT ALL QUESTIONS');
    if (d.complete === false) flags.push('PROGRESS — not finished');

    /* Anything that does not add up is kept, but not among the real work: a wrong
       completion code, a score above the total, or numbers outside what the lab can
       produce goes to the Rejected tab where you can look at it and delete it. */
    var wrong = [];
    if (!genuine) wrong.push('code does not match');
    if (score > total) wrong.push('score above the total');
    if (total < 0 || total > 1000) wrong.push('impossible total');
    if (name.length < 2) wrong.push('no name');
    if (wrong.length) {
      _reject(lab, [new Date(), lab.id, name, form, mode, score, total, d.code || '',
                    wrong.join('; '), JSON.stringify(d).slice(0, 2000)]);
      return _text('rejected: ' + wrong.join('; '));
    }

    var sh = _labSheet(lab);
    sh.appendRow([
      new Date(), name, form, mode,
      score, total, total ? score / total : 0,
      d.complete === false ? 'progress' : 'complete',
      Number(d.checks) || '', Number(d.firstTime) || '', _since(d.from),
      d.code || '', 'ok', flags.join('; '),
      _stations(d.stations)
    ]);
    _tidyLastRow(sh);
    return _text('recorded');
  } catch (err) {
    return _text('error: ' + err);
  }
}

/* Junk, and anything that does not verify, lands here instead of in a lab's tab. */
function _reject(lab, row) {
  var ss = _ss(), sh = ss.getSheetByName(T_REJECTED);
  if (!sh) {
    sh = ss.insertSheet(T_REJECTED);
    sh.getRange(1, 1, 1, 10).setValues([['When', 'Lab', 'Name', 'Class', 'Mode', 'Score',
                                         'Out of', 'Code', 'Why it was refused', 'What was sent']]);
    _dress2(sh, [
      { h:'When', w:150, fmt:'dd MMM, HH:mm', note:'When it arrived.' },
      { h:'Lab', w:140, note:'Which lab it claimed to come from.' },
      { h:'Name', w:190, note:'The name it carried.' },
      { h:'Class', w:80, align:'center' },
      { h:'Mode', w:90, align:'center' },
      { h:'Score', w:76, align:'center', fmt:'0' },
      { h:'Out of', w:76, align:'center', fmt:'0' },
      { h:'Code', w:120, align:'center' },
      { h:'Why it was refused', w:240, wrap:true, note:'What did not add up. These never reach a lab\'s tab.' },
      { h:'What was sent', w:460, wrap:true, note:'The whole message, in case you want to look.' }
    ], { tab:'#A3342A' });
  }
  sh.appendRow(row);
}

/* ============================================================
   2. The Mastery switch, per lab
   The site asks on load, when the tab is brought back, and every few minutes.
   ============================================================ */
function doGet(e) {
  var q = (e && e.parameter) || {};
  if (q.q === 'gate') {
    var g = _gateFor(String(q.app || ''), String(q.cls || '').trim().toUpperCase());
    var body = JSON.stringify(g);
    if (q.callback) return _js(q.callback + '(' + body + ');');
    return _json(body);
  }
  return _text('Biology Labs endpoint is running.');
}

/* Mastery is open or closed per class, per lab — one class can be sitting a test while
   the rest are doing homework. The Mastery tab is that grid; the (everyone) row is the
   default for any class not listed.

   If a class is not known (the page has not been told which class the reader is in) and
   some class is closed for this lab, the answer is "closed, and ask them which class they
   are in" — otherwise closing 9A would be undone by a 9A student who never said so. */
function _gateFor(labId, cls) {
  var lab = _labById(labId);
  if (!lab) return { masteryOpen: true, note: '', needClass: false };
  var sh = _sheet(T_MASTERY);
  var vals = sh.getDataRange().getValues();
  if (vals.length < 2) return { masteryOpen: true, note: _noteFor(labId), needClass: false };

  var col = -1;
  for (var c = 1; c < vals[0].length; c++) if (String(vals[0][c]) === lab.name) { col = c; break; }
  if (col < 0) return { masteryOpen: true, note: _noteFor(labId), needClass: false };

  var everyone = true, mine = null, anyClosed = false;
  for (var r = 1; r < vals.length; r++) {
    var who = String(vals[r][0] || '').trim();
    var open = vals[r][col] !== false;
    if (who === EVERYONE) everyone = open;
    else if (who) {
      if (!open) anyClosed = true;
      if (cls && who.toUpperCase() === cls) mine = open;
    }
  }
  if (mine !== null) return { masteryOpen: mine, note: _noteFor(labId), needClass: false };
  if (!cls && anyClosed) return { masteryOpen: false, note: _noteFor(labId), needClass: true };
  return { masteryOpen: everyone, note: _noteFor(labId), needClass: false };
}
function _noteFor(labId) {
  var rows = _sheet(T_LABS).getDataRange().getValues();
  for (var i = 1; i < rows.length; i++) if (String(rows[i][0]) === labId) return String(rows[i][3] || '');
  return '';
}

function closeMasteryAll() { _setMasteryAll(false); }
function openMasteryAll()  { _setMasteryAll(true); }
function _setMasteryAll(open) {
  var sh = _masterySheet(), rows = sh.getLastRow() - 1, cols = LABS.length;
  if (rows > 0) sh.getRange(2, 2, rows, cols).setValue(open);
  SpreadsheetApp.getActive().toast(
    open ? 'Mastery is open for every class, in every lab.'
         : 'Mastery is closed for every class, in every lab.', 'Biology Labs', 5);
}

/* The grid: a row per class (plus (everyone)), a column per lab, a checkbox in each.
   Classes appear here as soon as they are imported. */
function _masterySheet() {
  var ss = _ss(), sh = ss.getSheetByName(T_MASTERY);
  if (!sh) {
    sh = ss.insertSheet(T_MASTERY);
    sh.getRange(1, 1, 1, 1 + LABS.length)
      .setValues([['Class'].concat(LABS.map(function (l) { return l.name; }))]);
    sh.getRange(2, 1).setValue(EVERYONE);
    sh.getRange(2, 2, 1, LABS.length).insertCheckboxes().setValue(true);
  }
  /* add any class that has appeared since */
  var have = {}, last = sh.getLastRow();
  if (last > 1) sh.getRange(2, 1, last - 1, 1).getValues().forEach(function (r) {
    have[String(r[0] || '').trim().toUpperCase()] = true;
  });
  var add = _classList().filter(function (c) { return !have[c]; });
  if (add.length) {
    var at = sh.getLastRow() + 1;
    sh.getRange(at, 1, add.length, 1).setValues(add.map(function (c) { return [c]; }));
    sh.getRange(at, 2, add.length, LABS.length).insertCheckboxes().setValue(true);
  }
  return sh;
}

function _styleMastery() {
  var sh = _masterySheet();
  var built = {};
  LABS.forEach(function (l) { built[l.id] = !!_ss().getSheetByName(l.name); });
  var cols = [{ h:'Class', w:130, bold:true,
    note:'One row per class, and (everyone) for any class not listed. Classes appear here when you import them.' }];
  LABS.forEach(function (l) {
    cols.push({ h:l.name, w:_wide(l.name, 108), align:'center',
      head: built[l.id] ? HDR_AUTO : HDR_SOON, edit:true,
      note:'Ticked — Mastery is open for that class in ' + l.name + '.\nUnticked — that class gets Test only, and is told why.\n\nA class row wins over (everyone).' });
  });
  var rows = _dress2(sh, cols, { freezeCols: 1, tab:'#8A6A12' });
  if (!rows) return;
  sh.getRange(2, 2, rows, LABS.length).insertCheckboxes();
  sh.getRange(2, 1, 1, 1 + LABS.length).setBackground('#EFF5F0').setFontWeight('bold');
  sh.setConditionalFormatRules([
    SpreadsheetApp.newConditionalFormatRule().whenFormulaSatisfied('=B2=FALSE')
      .setBackground('#FCE8E6')
      .setRanges([sh.getRange(2, 2, rows, LABS.length)]).build()
  ]);
}

/* ============================================================
   3. Importing the rosters from Google Classroom
   The dialog is ClassroomImport.html. It fires one long-running call and polls
   for progress, so closing the window does not interrupt the import.
   ============================================================ */
function showClassroomImport() {
  var html = HtmlService.createHtmlOutputFromFile('ClassroomImport')
    .setWidth(880).setHeight(560);
  SpreadsheetApp.getUi().showModalDialog(html, 'Import students from Google Classroom');
}

/* "Classroom is not defined" is the advanced service not being switched on. Say so in
   words a teacher can act on, rather than letting a ReferenceError reach the dialog. */
function _needClassroom() {
  if (typeof Classroom !== 'undefined' && Classroom && Classroom.Courses) return;
  throw new Error(
    'Google Classroom is not switched on in this script yet. In the Apps Script editor, ' +
    'in the left sidebar: Services  ▸  + (Add a service)  ▸  Google Classroom API  ▸  Add. ' +
    'Leave the identifier as "Classroom". Then Run ▸ setup once to authorise the new ' +
    'permission, and open this window again.');
}

function getBatchImportData() {
  _needClassroom();
  var courses = [], page = null;
  do {
    var r = Classroom.Courses.list({ courseStates: ['ACTIVE'], pageSize: 100, pageToken: page });
    (r.courses || []).forEach(function (c) {
      courses.push({
        id: c.id,
        name: c.name || '',
        section: c.section || '',
        display: (c.name || '') + (c.section ? ' · ' + c.section : ''),
        autoClassCode: _guessClass(c.name + ' ' + (c.section || ''))
      });
    });
    page = r.nextPageToken;
  } while (page);

  courses.sort(function (a, b) { return a.display.localeCompare(b.display); });

  /* how many students each class already has here, so the dialog can say so */
  var have = {}, rows = _sheet(T_STUDENTS).getDataRange().getValues();
  for (var i = 1; i < rows.length; i++) {
    var cls = String(rows[i][1] || '').toUpperCase();
    if (cls) have[cls] = (have[cls] || 0) + 1;
  }
  return { courses: courses, have: have };
}

function executeBatchImportAll(sels, jobId) {
  _needClassroom();
  var results = [];
  sels.forEach(function (s) { results.push({ status: 'pending' }); });
  _publish(jobId, results, false);

  sels.forEach(function (s, i) {
    try {
      var students = [], page = null;
      do {
        var r = Classroom.Courses.Students.list(s.courseId, { pageSize: 100, pageToken: page });
        (r.students || []).forEach(function (st) {
          students.push({
            name: st.profile.name.fullName,
            email: (st.profile.emailAddress || '').toLowerCase(),
            userId: st.userId
          });
        });
        page = r.nextPageToken;
      } while (page);

      if (!students.length) results[i] = { status: 'empty', added: 0, skipped: 0 };
      else results[i] = _upsertStudents(students, s.classCode, s.courseName, s.courseId);
    } catch (err) {
      results[i] = { status: 'error', error: String(err).slice(0, 120) };
    }
    _publish(jobId, results, false);
  });

  _publish(jobId, results, true);
  /* An import is the first thing anyone does, so it leaves the spreadsheet finished:
     every tab that should exist exists, every class has its row in the Mastery grid,
     and the whole thing is dressed. Nothing else to press. */
  _buildAndStyle();
  return results;
}

function getBatchImportProgress(jobId) {
  var raw = CacheService.getScriptCache().get('BATCH_IMPORT_' + jobId);
  return raw ? JSON.parse(raw) : null;
}
function _publish(jobId, results, done) {
  try {
    CacheService.getScriptCache().put('BATCH_IMPORT_' + jobId,
      JSON.stringify({ results: results, done: done }), 600);
  } catch (e) {}
}

/* Add the ones we do not have; update the class of the ones we do. Never duplicates:
   the key is the school email. */
function _upsertStudents(students, classCode, courseName, courseId) {
  var sh = _sheet(T_STUDENTS);
  var EMAIL_COL = 3 + LABS.length + 2;                  /* Name, Class, the labs, started, average, then email */
  var rows = sh.getDataRange().getValues();
  var seen = {}, rowOf = {};
  for (var i = 1; i < rows.length; i++) {
    var em = String(rows[i][EMAIL_COL - 1] || '').toLowerCase();
    if (em) { seen[em] = true; rowOf[em] = i + 1; }
  }
  var add = [], skipped = 0, moved = 0, now = new Date();
  students.forEach(function (st) {
    if (st.email && seen[st.email]) {
      var r = rowOf[st.email];
      if (String(sh.getRange(r, 2).getValue()).toUpperCase() !== classCode) {
        sh.getRange(r, 2).setValue(classCode); moved++;
      }
      skipped++;
      return;
    }
    add.push([st.name, classCode, st.email, courseName, now, st.userId, courseId]);
  });
  if (add.length) {
    var at = sh.getLastRow() + 1;
    sh.getRange(at, 1, add.length, 2).setValues(add.map(function (a) { return [a[0], a[1]]; }));
    sh.getRange(at, EMAIL_COL, add.length, 5).setValues(add.map(function (a) { return a.slice(2); }));
  }
  return { status: 'success', added: add.length, skipped: skipped, moved: moved };
}

/* "Y9 Biology · 9A" → "9A";  "10 Set 2" → "10"; falls back to '' so the dialog asks. */
function _guessClass(s) {
  var t = String(s || '').toUpperCase();
  var m = t.match(/\b(1[0-3]|[7-9])\s*([A-Z])\b/);        /* 9A, 10 B */
  if (m) return m[1] + m[2];
  m = t.match(/\bY(?:EAR)?\s*(1[0-3]|[7-9])\b/);          /* Y9, Year 10 */
  if (m) return m[1];
  return '';
}

/* ============================================================
   4. Marks into Google Classroom
   Classroom only lets a script grade work that the same script created, so the
   assignment has to be made from here. One per lab; the id is kept in Labs.
   ============================================================ */
function createAssignmentFor(labId, courseId) {
  _needClassroom();
  var lab = _labById(labId);
  if (!lab) throw new Error('Unknown lab: ' + labId);
  var work = Classroom.Courses.CourseWork.create({
    title: lab.name + ' Lab — Topic ' + lab.topic.split(' ')[0],
    description: 'Work through every station in the lab, then hand in.',
    materials: [{ link: { url: 'https://mompel226.github.io/' + lab.id + '/' } }],
    workType: 'ASSIGNMENT', state: 'PUBLISHED',
    maxPoints: lab.questions || 100
  }, courseId);
  Logger.log('Created "' + work.title + '" in course ' + courseId + ' — id ' + work.id);
  return work.id;
}

function pushGradesFor(labId, courseId, courseWorkId) {
  _needClassroom();
  var lab = _labById(labId);
  var roster = {}, page = null;
  do {
    var r = Classroom.Courses.Students.list(courseId, { pageSize: 100, pageToken: page });
    (r.students || []).forEach(function (s) { roster[_tidy(s.profile.name.fullName)] = s.userId; });
    page = r.nextPageToken;
  } while (page);

  var rows = _labSheet(lab).getDataRange().getValues(), best = {};
  for (var i = 1; i < rows.length; i++) {
    var n = _tidy(rows[i][1]), sc = Number(rows[i][4]) || 0;
    if (n && (!(n in best) || sc > best[n])) best[n] = sc;
  }
  var done = 0, missing = [];
  Object.keys(best).forEach(function (n) {
    var uid = roster[n];
    if (!uid) { missing.push(n); return; }
    var subs = Classroom.Courses.CourseWork.StudentSubmissions.list(courseId, courseWorkId, { userId: uid });
    var sub = (subs.studentSubmissions || [])[0];
    if (!sub) { missing.push(n + ' (no submission)'); return; }
    Classroom.Courses.CourseWork.StudentSubmissions.patch(
      { assignedGrade: best[n], draftGrade: best[n] },
      courseId, courseWorkId, sub.id, { updateMask: 'assignedGrade,draftGrade' });
    done++;
  });
  Logger.log('Graded ' + done + '. Not matched: ' + (missing.join(', ') || 'none'));
}

/* Tells you, in one box, which of the five set-up steps are done. */
function checkSetup() {
  var lines = [], id = '', src = '';
  try {
    id = _sheetId();
    src = (SHEET_ID && SHEET_ID !== 'PASTE_YOUR_SHEET_ID_HERE') ? 'from SHEET_ID at the top of Code.gs'
        : 'worked out from this Sheet and remembered — you do not need to paste it';
    lines.push('✅  spreadsheet: ' + src);
  } catch (e) {
    lines.push('❌  ' + e.message);
  }

  var openOk = false, name = '';
  if (id) {
    try { name = SpreadsheetApp.openById(id).getName(); openOk = true; } catch (e) {}
    lines.push((openOk ? '✅' : '❌') + '  ' + (openOk ? 'it opens: “' + name + '”' : 'that id will not open'));
  }

  var clsOk = (typeof Classroom !== 'undefined' && Classroom && Classroom.Courses);
  lines.push((clsOk ? '✅' : '❌') + '  Google Classroom ' + (clsOk ? 'is switched on' :
    'is NOT switched on — left sidebar: Services ▸ + ▸ Google Classroom API ▸ Add (identifier "Classroom")'));
  if (clsOk) {
    try { var n = (Classroom.Courses.list({ courseStates: ['ACTIVE'], pageSize: 5 }).courses || []).length;
          lines.push('✅  it can see your courses (' + n + '+ active)'); }
    catch (e) { lines.push('❌  Classroom is on but not authorised — Run ▸ setup once and accept. (' + e + ')'); }
  }

  if (openOk) {
    lines.push('•  students imported: ' + Math.max(0, _sheet(T_STUDENTS).getLastRow() - 1));
    var built = LABS.filter(function (l) { return _ss().getSheetByName(l.name); }).length;
    lines.push('•  lab tabs so far: ' + built + ' of ' + LABS.length);
  }
  lines.push('');
  lines.push('Remember: editing this script changes nothing until Deploy ▸ Manage deployments ▸ pencil ▸ New version ▸ Deploy.');

  SpreadsheetApp.getUi().alert('Biology Labs — set-up', lines.join('\n\n'), SpreadsheetApp.getUi().ButtonSet.OK);
}

/* ============================================================
   5. The tabs, and making them readable
   ============================================================ */
/* Everything the spreadsheet needs, in the right order. Safe to run at any time: it
   creates only what is missing and never touches what is in the cells. Both the menu's
   Tidy up and the end of an import call this, so importing a class leaves the whole
   spreadsheet built, dressed and up to date — there is nothing else to press. */
function _buildAndStyle() {
  _sheet(T_SETUP); _sheet(T_LABS); _sheet(T_STUDENTS); _masterySheet();
  LABS.forEach(function (l) { if (l.questions) _labSheet(l); });   /* built labs get a tab now */
  var gone = _ss().getSheetByName('Summary');
  if (gone && gone.getLastRow() < 2) _ss().deleteSheet(gone);      /* the Students tab is the summary now */
  _installButtons();
  restyleAll();
  refreshDashboard();
}

function setup() {
  _buildAndStyle();
  SpreadsheetApp.getActive().toast('Every tab is built and styled.', 'Biology Labs', 6);
}

function restyleAll() {
  _styleSetup(); _styleLabs(); _styleStudents(); _styleMastery();
  LABS.forEach(function (l) {
    var sh = _ss().getSheetByName(l.name);
    if (sh) _styleLab(sh);
  });
}

/* ------------------------------------------------------------
   One place decides what a tab looks like.

   Each column is described once — its heading, what it is for, whether it is filled
   in for you or yours to edit — and everything else follows from that: a width that
   never makes a heading wrap, a hover note so nobody has to guess what a column is,
   a dropdown wherever the answer is one of a few, and formatting that stops at the
   last row with something in it rather than painting a thousand empty ones.

   COL = { h:heading, w:width, note:hover, fmt:number format, align:, wrap:true,
           edit:true (yours to change), list:[dropdown options], hide:true }
   ------------------------------------------------------------ */
/* The palette. Ordinary numbers stay quiet; strong colour is kept for the few things that
   actually need looking at — a low score, a refused hand-in, a class whose Mastery is shut.
   (Dashboard convention: a muted base, high contrast reserved for the exception.) */
var HDR_AUTO = '#14572B';     /* filled in for you */
var HDR_EDIT = '#8A6A12';     /* yours to change  */
var HDR_SOON = '#5C8A72';     /* a lab that does not exist yet */
var BAND_A   = '#FFFFFF';
var BAND_B   = '#F4F8F5';     /* the faintest green, so banding guides the eye without shouting */
var RULE     = '#D6E2DA';     /* the line between one group of columns and the next */
var LOW      = '#F7D9D5';
var MID      = '#FBEED2';
var HIGH     = '#DDEBDD';
var FONT     = 'Inter';

/* Wide enough that the heading never breaks across two lines. */
function _wide(text, min) {
  var px = Math.ceil(String(text).length * 7.4) + 26;
  return Math.max(min || 64, px);
}

function _dress2(sh, cols, opts) {
  opts = opts || {};
  var n = cols.length;
  if (sh.getMaxColumns() < n) sh.insertColumnsAfter(sh.getMaxColumns(), n - sh.getMaxColumns());
  if (sh.getMaxColumns() > n) {
    var spare = sh.getRange(1, n + 1, sh.getMaxRows(), sh.getMaxColumns() - n);
    try { if (spare.isBlank()) sh.deleteColumns(n + 1, sh.getMaxColumns() - n); } catch (e) {}
  }

  /* one typeface, one size, everywhere */
  sh.getRange(1, 1, sh.getMaxRows(), n).setFontFamily(FONT).setFontSize(10);

  /* headings */
  var head = sh.getRange(1, 1, 1, n);
  head.setValues([cols.map(function (c) { return (c.edit ? '✎ ' : '') + c.h; })])
      .setFontWeight('bold').setFontColor('#FFFFFF').setFontSize(10)
      .setVerticalAlignment('middle').setHorizontalAlignment('left')
      .setWrap(false);
  cols.forEach(function (c, i) {
    var cell = sh.getRange(1, i + 1);
    cell.setBackground(c.head || (c.edit ? HDR_EDIT : HDR_AUTO));
    cell.setNote((c.note || '') + (c.edit ? '\n\nYou can change this.' : '\n\nFilled in for you.'));
    sh.setColumnWidth(i + 1, c.w || _wide((c.edit ? '  ' : '') + c.h));
  });
  sh.setRowHeight(1, 30);
  sh.setFrozenRows(1);
  if (opts.freezeCols) sh.setFrozenColumns(opts.freezeCols);

  /* only the rows that have something in them get dressed */
  var last = Math.max(1, sh.getLastRow());
  var rows = last - 1;
  if (sh.getMaxRows() > last + 6) {
    try { sh.deleteRows(last + 7, sh.getMaxRows() - last - 6); } catch (e) {}
  }

  sh.getBandings().forEach(function (b) { b.remove(); });
  var f = sh.getFilter(); if (f) f.remove();
  sh.setHiddenGridlines(true);          /* banding and spacing do this job better than a grid */

  if (rows > 0) {
    var body = sh.getRange(2, 1, rows, n);
    body.setVerticalAlignment('middle').setFontColor('#26332A');
    var band = sh.getRange(1, 1, last, n)
      .applyRowBanding(SpreadsheetApp.BandingTheme.LIGHT_GREY, true, false);
    try { band.setHeaderRowColor(HDR_AUTO).setFirstRowColor(BAND_A).setSecondRowColor(BAND_B); } catch (e) {}
    sh.getRange(1, 1, last, n).createFilter();
    for (var r = 2; r <= last; r++) sh.setRowHeight(r, 24);

    /* a hairline where one group of columns ends and the next begins */
    cols.forEach(function (c, i) {
      if (!c.group) return;
      sh.getRange(1, i + 1, last, 1)
        .setBorder(null, true, null, null, null, null, RULE, SpreadsheetApp.BorderStyle.SOLID);
    });
  }

  cols.forEach(function (c, i) {
    if (c.hide) sh.hideColumns(i + 1);
    if (!rows) return;
    var col = sh.getRange(2, i + 1, rows, 1);
    if (c.fmt) col.setNumberFormat(c.fmt);
    if (c.align) col.setHorizontalAlignment(c.align);
    if (c.wrap) col.setWrap(true);
    if (c.bold) col.setFontWeight('bold');
    if (c.list && c.list.length) {
      col.setDataValidation(SpreadsheetApp.newDataValidation()
        .requireValueInList(c.list, true).setAllowInvalid(true)
        .setHelpText('One of: ' + c.list.join(', ')).build());
    } else {
      col.setDataValidation(null);
    }
  });
  if (opts.tab) { try { sh.setTabColor(opts.tab); } catch (e) {} }
  return rows;
}

/* the classes actually in use, for the dropdowns */
function _classList() {
  var sh = _ss().getSheetByName(T_STUDENTS);
  var out = {}, list = [];
  if (sh && sh.getLastRow() > 1) {
    sh.getRange(2, 2, sh.getLastRow() - 1, 1).getValues().forEach(function (r) {
      var v = String(r[0] || '').trim().toUpperCase();
      if (v && !out[v]) { out[v] = 1; list.push(v); }
    });
  }
  list.sort();
  return list;
}

/* The Setup tab is where you press things: the checkboxes are buttons — tick one and it
   runs, then unticks itself. These two constants are the rows those things are written
   on, and must match the `lines` array inside _styleSetup. */
var URL_ROW = 11;
var BTN_ROW = { refresh: 17, close: 18, open: 19, restyle: 20 };

function _styleSetup() {
  var sh = _sheet(T_SETUP);
  var url = '';
  try { url = String(sh.getRange(URL_ROW, 2).getValue() || '').trim(); } catch (e) {}
  if (!/^https?:/i.test(url)) url = PropertiesService.getScriptProperties().getProperty('WEB_APP_URL') || '';
  if (!url) url = '(paste your /exec URL here, so you can find it again)';
  sh.clear();
  sh.getBandings().forEach(function (b) { b.remove(); });

  var lines = [
    ['Biology Labs', 'one spreadsheet for every lab'],
    ['', ''],
    ['Students', 'every student, every lab, best score so far. Filter the Class column to see one class.'],
    ['Mastery', 'the switch, per class and per lab. Untick a box and that class gets Test only.'],
    ['Labs', 'one row per lab: the message shown when Mastery is closed, and how many questions it has.'],
    ['Digestion, Circulation, …', 'every hand-in for that lab. A tab appears the first time the lab is used.'],
    ['Rejected', 'anything that did not add up, kept out of the real tabs.'],
    ['', ''],
    ['Reading a heading', 'dark green = filled in for you.   ✎ amber = yours to change.   Hover any heading to see what it is for.'],
    ['', ''],
    ['Web app URL', url],
    ['', ''],
    ['Buttons', 'tick one — it runs, then unticks itself'],
    ['', ''],
    ['Import students from Classroom', 'on the 🧪 Biology Labs menu (it opens a window, so it cannot be a checkbox)'],
    ['', ''],
    ['Refresh everyone\'s progress', ''],
    ['Close Mastery in every lab', ''],
    ['Open Mastery in every lab', ''],
    ['Tidy up — rebuild anything missing, re-apply the formatting', ''],
    ['', ''],
    ['If something looks wrong', '🧪 Biology Labs ▸ Check the set-up'],
    ['After editing the script', 'Deploy ▸ Manage deployments ▸ pencil ▸ Version: New version ▸ Deploy']
  ];
  sh.getRange(1, 1, lines.length, 2).setValues(lines);
  sh.getRange('A1').setFontSize(17).setFontWeight('bold').setFontColor(INK);
  sh.getRange('B1').setFontColor('#6B7B6F');
  sh.getRange(3, 1, lines.length - 2, 1).setFontWeight('bold').setFontColor(INK);
  sh.getRange(13, 1).setFontSize(13);
  sh.getRange(1, 1, lines.length, 2).setVerticalAlignment('middle').setWrap(true);
  sh.setColumnWidth(1, 260); sh.setColumnWidth(2, 720); sh.setColumnWidth(3, 60);
  for (var r = 1; r <= lines.length; r++) sh.setRowHeight(r, r === 1 ? 34 : 24);

  /* the buttons */
  Object.keys(BTN_ROW).forEach(function (k) {
    var r = BTN_ROW[k];
    sh.getRange(r, 3).insertCheckboxes().setValue(false).setHorizontalAlignment('center');
    sh.getRange(r, 1, 1, 3).setBackground('#EFF5F0');
  });
  sh.getRange(BTN_ROW.refresh, 1, 4, 1).setFontColor(INK);
  sh.setHiddenGridlines(true);
}

/* Ticking a button runs it. Installed by setup(); a simple onEdit could not do this. */
function _installButtons() {
  var have = ScriptApp.getProjectTriggers().some(function (t) {
    return t.getHandlerFunction() === 'onButtonTicked';
  });
  if (have) return;
  ScriptApp.newTrigger('onButtonTicked')
    .forSpreadsheet(_ss()).onEdit().create();
}

function onButtonTicked(e) {
  try {
    if (!e || !e.range) return;
    var sh = e.range.getSheet();
    if (sh.getName() !== T_SETUP || e.range.getColumn() !== 3) return;
    if (e.range.getValue() !== true) return;
    var row = e.range.getRow();
    e.range.setValue(false);
    if (row === BTN_ROW.refresh) refreshDashboard();
    else if (row === BTN_ROW.close) closeMasteryAll();
    else if (row === BTN_ROW.open) openMasteryAll();
    else if (row === BTN_ROW.restyle) setup();
  } catch (err) {
    SpreadsheetApp.getActive().toast('That button failed: ' + err, 'Biology Labs', 10);
  }
}

function _styleStudents() {
  var sh = _sheet(T_STUDENTS);
  var built = {};
  LABS.forEach(function (l) { built[l.id] = !!_ss().getSheetByName(l.name); });

  var cols = [
    { h:'Name', w:210, edit:true,
      note:'The student, as Google Classroom spells it. A hand-in is matched to this by name, so correct a spelling here if a hand-in did not find its student.' },
    { h:'Class', w:88, align:'center', bold:true, edit:true, list:_classList(),
      note:'Which class they are in. Used by the filter, by the Mastery grid, and written into every hand-in.' }
  ];
  LABS.forEach(function (l, i) {
    cols.push({ h:l.name, w:_wide(l.name, 108), align:'center', fmt:'0%', group: i === 0,
                head: built[l.id] ? HDR_AUTO : HDR_SOON,
                note:'Topic ' + l.topic + '.\n\nTheir best score in this lab so far.' +
                     (built[l.id] ? '' : '\n\nThis lab is not built yet, so the column stays empty.') });
  });
  cols.push({ h:'Labs started', w:112, align:'center', fmt:'0', group:true,
              note:'How many of the nine labs they have handed in at least once.' });
  cols.push({ h:'Average', w:94, align:'center', fmt:'0%', bold:true,
              note:'The average of the labs they have started. Labs they have not touched are not counted against them.' });
  cols.push({ h:'School email', w:240, hide:true, note:'From Classroom. This is what stops a student being imported twice.' });
  cols.push({ h:'Classroom course', w:230, hide:true, note:'The course they were imported from.' });
  cols.push({ h:'Imported', w:110, fmt:'dd MMM yyyy', hide:true, note:'When they were first imported.' });
  cols.push({ h:'Classroom user id', w:160, hide:true, note:'Needed to push marks back into Classroom.' });
  cols.push({ h:'Course id', w:140, hide:true, note:'Needed to push marks back into Classroom.' });

  var rows = _dress2(sh, cols, { freezeCols: 2, tab:'#14572B' });
  if (!rows) return;

  var first = 3, L = LABS.length;
  var rules = [
    SpreadsheetApp.newConditionalFormatRule()
      .setGradientMinpointWithValue(LOW, SpreadsheetApp.InterpolationType.NUMBER, '0')
      .setGradientMidpointWithValue(MID, SpreadsheetApp.InterpolationType.NUMBER, '0.6')
      .setGradientMaxpointWithValue(HIGH, SpreadsheetApp.InterpolationType.NUMBER, '1')
      .setRanges([sh.getRange(2, first, rows, L), sh.getRange(2, first + L + 1, rows, 1)]).build()
  ];
  LABS.forEach(function (l, i) {
    if (built[l.id]) return;
    rules.push(SpreadsheetApp.newConditionalFormatRule().whenCellEmpty()
      .setBackground('#F2F2EF').setRanges([sh.getRange(2, first + i, rows, 1)]).build());
  });
  sh.setConditionalFormatRules(rules);
}

/* The dashboard: every student, every lab, best score so far. Written as values rather than
   formulas, so nothing shows #REF for a lab that has no tab yet — the column is simply empty
   until that lab is used. */
function refreshDashboard() {
  var sh = _sheet(T_STUDENTS);
  var rows = Math.max(0, sh.getLastRow() - 1);
  if (!rows) { _styleStudents(); return; }

  var names = sh.getRange(2, 1, rows, 1).getValues();
  var rowOf = {};
  names.forEach(function (r, i) { var k = _tidy(r[0]); if (k) rowOf[k] = i; });

  var L = LABS.length, first = 3;
  var grid = names.map(function () { var a = []; for (var i = 0; i < L + 2; i++) a.push(''); return a; });
  var unmatched = {};

  LABS.forEach(function (lab, c) {
    var tab = _ss().getSheetByName(lab.name);
    if (!tab || tab.getLastRow() < 2) return;
    tab.getRange(2, 1, tab.getLastRow() - 1, 7).getValues().forEach(function (r) {
      var k = _tidy(r[1]); if (!k) return;
      var pc = Number(r[6]) || 0;
      if (!(k in rowOf)) { unmatched[r[1]] = true; return; }
      var i = rowOf[k];
      if (grid[i][c] === '' || pc > grid[i][c]) grid[i][c] = pc;
    });
  });

  grid.forEach(function (row) {
    var done = 0, sum = 0;
    for (var c = 0; c < L; c++) if (row[c] !== '') { done++; sum += row[c]; }
    row[L] = done || '';
    row[L + 1] = done ? sum / done : '';
  });

  sh.getRange(2, first, rows, L + 2).setValues(grid);
  _styleStudents();

  var miss = Object.keys(unmatched);
  SpreadsheetApp.getActive().toast(
    'Progress updated for ' + rows + ' students.' +
    (miss.length ? '  ' + miss.length + ' hand-in name(s) matched nobody: ' + miss.slice(0, 4).join(', ') +
                   (miss.length > 4 ? '…' : '') + ' — check the spelling.' : ''),
    'Biology Labs', miss.length ? 12 : 5);
}


function _styleLabs() {
  var sh = _sheet(T_LABS);
  _dress2(sh, [
    { h:'Lab id', w:170, note:'What the lab\'s own page sends. Do not change it — it has to match js/config.js in that lab.' },
    { h:'Lab', w:130, note:'The name of this lab\'s tab in this spreadsheet.' },
    { h:'Topic', w:200, note:'Which IGCSE topic it covers.' },
    { h:'Message when Mastery is closed', w:380, wrap:true, edit:true,
      note:'What a student sees when Mastery is closed. Say something human — "Mastery is closed, this is your test".' },
    { h:'Questions', w:100, align:'center', fmt:'0', edit:true,
      note:'How many questions that lab has. Used to flag a hand-in that does not cover them all. Fill it in when a lab is built.' },
    { h:'Hand-ins', w:100, align:'center', fmt:'0', note:'How many hand-ins that lab has had. Counted for you.' }
  ], { freezeCols: 2, tab:'#6E8F7C' });
}

function _styleLab(sh) {
  var rows = _dress2(sh, [
    { h:'When', w:150, fmt:'dd MMM, HH:mm', note:'When it was handed in.' },
    { h:'Name', w:200, note:'As the student typed it. If this does not match the Students tab, the dashboard will say so.' },
    { h:'Class', w:80, align:'center', note:'The class they chose when handing in.' },
    { h:'Mode', w:90, align:'center', list:['mastery', 'test'],
      note:'mastery — unlimited checks, never shown the answer.\ntest — one attempt per question.' },
    { h:'Score', w:76, align:'center', fmt:'0', group:true, note:'How many they got right.' },
    { h:'Out of', w:76, align:'center', fmt:'0', note:'How many questions the lab asked.' },
    { h:'%', w:70, align:'center', fmt:'0%', note:'Score out of the total.' },
    { h:'Finished?', w:104, align:'center', list:['complete', 'progress'],
      note:'complete — every question right (Mastery) or every question attempted (Test).\nprogress — handed in part way, to show the work so far.' },
    { h:'Checks', w:86, align:'center', fmt:'0', group:true, note:'How many times they pressed Check answer, in all. This is the evidence of grinding.' },
    { h:'Right first time', w:130, align:'center', fmt:'0', note:'How many questions they got right at the first attempt. Separates knowing it from working it out.' },
    { h:'Working since', w:120, align:'center', note:'How long before handing in they first checked anything.' },
    { h:'Code', w:120, align:'center', group:true, note:'The completion code the student saw. They can paste it into Classroom.' },
    { h:'Checked', w:90, align:'center', note:'Whether that code recomputes here. Anything that does not is in the Rejected tab instead.' },
    { h:'Flags', w:200, wrap:true, note:'Anything worth a second look.' },
    { h:'Per station', w:420, wrap:true, note:'Their score at each station, and how many checks it took there.' }
  ], { freezeCols: 2, tab:'#3D7A54' });

  if (!rows) return;
  sh.setConditionalFormatRules([
    SpreadsheetApp.newConditionalFormatRule()
      .setGradientMinpointWithValue(LOW, SpreadsheetApp.InterpolationType.NUMBER, '0')
      .setGradientMidpointWithValue(MID, SpreadsheetApp.InterpolationType.NUMBER, '0.6')
      .setGradientMaxpointWithValue(HIGH, SpreadsheetApp.InterpolationType.NUMBER, '1')
      .setRanges([sh.getRange(2, 7, rows, 1)]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('progress')
      .setBackground(MID).setFontColor('#7A5B00')
      .setRanges([sh.getRange(2, 8, rows, 1)]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('complete')
      .setBackground(HIGH).setFontColor('#265C33')
      .setRanges([sh.getRange(2, 8, rows, 1)]).build(),
    /* the one thing that should shout: a hand-in that says nothing was got right */
    SpreadsheetApp.newConditionalFormatRule().whenNumberLessThan(0.4)
      .setFontColor('#A3342A').setBold(true)
      .setRanges([sh.getRange(2, 7, rows, 1)]).build()
  ]);
}

/* A row should not be a mile high, and the filter should exist without being rebuilt
   on every hand-in — thirty students submitting at once is thirty rebuilds otherwise. */
function _tidyLastRow(sh) {
  var r = sh.getLastRow();
  if (r > 1) sh.setRowHeight(r, 21);
  if (!sh.getFilter() && r > 1) {
    try { sh.getRange(1, 1, r, 15).createFilter(); } catch (e) {}
  }
}


/* ============================================================
   6. Plumbing
   ============================================================ */
/* Which spreadsheet this is.
   If the script lives inside the Sheet (Extensions ▸ Apps Script), it works this out on
   its own the first time you run anything from the Sheet, and remembers it — so pasting a
   fresh copy of this file never breaks the deployment. SHEET_ID is only needed for a
   stand-alone script, or to point it at a different Sheet. */
function _sheetId() {
  if (SHEET_ID && SHEET_ID !== 'PASTE_YOUR_SHEET_ID_HERE') return SHEET_ID;
  var props = PropertiesService.getScriptProperties();
  var kept = props.getProperty('SHEET_ID');
  if (kept) return kept;
  var active = SpreadsheetApp.getActiveSpreadsheet();      /* null in a web app; set from the Sheet */
  if (active) { props.setProperty('SHEET_ID', active.getId()); return active.getId(); }
  throw new Error('This script does not know which spreadsheet to use. Open the Sheet and run ' +
                  '🧪 Biology Labs ▸ Check the set-up once — that remembers it — then Deploy ▸ ' +
                  'Manage deployments ▸ pencil ▸ New version ▸ Deploy.');
}
function _ss() { return SpreadsheetApp.openById(_sheetId()); }
function _sheet(name) {
  var ss = _ss(), sh = ss.getSheetByName(name);
  if (sh) return sh;
  sh = ss.insertSheet(name);
  if (name === T_LABS) {
    sh.getRange(1, 1, 1, 6).setValues([['Lab id', 'Lab', 'Topic',
                                        'Message when Mastery is closed', 'Questions', 'Hand-ins']]);
    var rows = LABS.map(function (l, i) {
      return [l.id, l.name, l.topic, 'Mastery is closed — this is your test.',
              l.questions || '', '=IFERROR(COUNTA(INDIRECT("\'"&B' + (i + 2) + '&"\'!B2:B")),0)'];
    });
    sh.getRange(2, 1, rows.length, 6).setValues(rows);
  } else if (name === T_STUDENTS) {
    var head = ['Name', 'Class'].concat(LABS.map(function (l) { return l.name; }))
               .concat(['Labs started', 'Average', 'School email', 'Classroom course',
                        'Imported', 'Classroom user id', 'Course id']);
    sh.getRange(1, 1, 1, head.length).setValues([head]);
  }
  return sh;
}
function _labById(id) {
  for (var i = 0; i < LABS.length; i++) if (LABS[i].id === id) return LABS[i];
  return null;
}
function _labSheet(lab) {
  var ss = _ss(), sh = ss.getSheetByName(lab.name);
  if (!sh) {
    sh = ss.insertSheet(lab.name);
    sh.getRange(1, 1, 1, 15).setValues([['When', 'Name', 'Class', 'Mode', 'Score', 'Out of', '%',
      'Finished?', 'Checks', 'Right first time', 'Working since', 'Code', 'Code check', 'Flags', 'Per station']]);
    _styleLab(sh);
  }
  return sh;
}
/** "mouth 9/9 in 14 · stomach 8/9 in 21" — readable in one cell. */
function _stations(o) {
  if (!o || typeof o !== 'object') return '';
  return Object.keys(o).map(function (k) { return k + ' ' + o[k]; }).join(' · ');
}
/** "40 min" / "6 h" / "3 days" since the first question was checked. */
function _since(iso) {
  if (!iso) return '';
  var then = new Date(iso);
  if (isNaN(then)) return '';
  var mins = Math.round((new Date() - then) / 60000);
  if (mins < 90) return mins + ' min';
  if (mins < 60 * 36) return Math.round(mins / 60) + ' h';
  return Math.round(mins / 1440) + ' days';
}
/** Must stay identical to completionCode() in each lab's js/app.js. The lab's own id
    is part of the recipe, so a code from one lab cannot be pasted into another. */
function _code(labId, name, form, score) {
  var raw = String(name).trim().toLowerCase() + '|' + form + '|' + score + '|' + labId;
  var s1 = 0, s2 = 0;
  for (var i = 0; i < raw.length; i++) {
    s1 = (s1 * 31 + raw.charCodeAt(i)) >>> 0;
    s2 = (s2 ^ (s1 + i)) >>> 0;
  }
  var A = 'ACDEFGHJKLMNPQRTUVWXY3479';
  function chunk(n) {
    var o = '';
    for (var i = 0; i < 4; i++) { o += A.charAt(n % A.length); n = Math.floor(n / A.length); }
    return o;
  }
  return 'DL-' + chunk(s1) + '-' + chunk(s2);
}
function _tidy(s) { return String(s || '').toLowerCase().replace(/[^a-z ]/g, '').replace(/\s+/g, ' ').trim(); }
function _text(m) { return ContentService.createTextOutput(m).setMimeType(ContentService.MimeType.TEXT); }
function _json(m) { return ContentService.createTextOutput(m).setMimeType(ContentService.MimeType.JSON); }
function _js(m)   { return ContentService.createTextOutput(m).setMimeType(ContentService.MimeType.JAVASCRIPT); }
```

</details>

<details>
<summary><b>ClassroomImport.html</b> — the import dialog (also at <a href="apps-script/ClassroomImport.html">apps-script/ClassroomImport.html</a>)</summary>

```html
<!--
  Biology Labs — import students from Google Classroom
  Copyright (c) 2025-2026 Daniel Mompel Riera. All rights reserved.

  The flow is the one Daniel already uses in the Assessment Reflection System, and
  for the same reasons: ONE long-running server call does the work, and the dialog
  polls a cached progress record alongside it. So each class ticks green as it
  finishes, and closing this window does not interrupt the import — Apps Script
  never learns that the client went away.
-->
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0d1117; color: #c9d1d9; padding: 16px; font-size: 13px; }
h2 { font-size: 15px; color: #e6edf3; margin-bottom: 4px; }
.subtitle { color: #8b949e; font-size: 12px; margin-bottom: 14px; }
table { width: 100%; border-collapse: collapse; }
th { text-align: left; font-size: 11px; color: #8b949e; text-transform: uppercase; letter-spacing: .04em; padding: 6px 8px; border-bottom: 1px solid #30363d; white-space: nowrap; }
td { padding: 5px 8px; border-bottom: 1px solid #21262d; vertical-align: middle; }
tr.row:hover { background: #161b22; }
tr.row.selected { background: #0d1926; }
.cb { width: 16px; height: 16px; accent-color: #58a6ff; cursor: pointer; }
input[type="text"] { background: #161b22; border: 1px solid #30363d; border-radius: 4px; color: #e6edf3; padding: 4px 8px; font-size: 12px; width: 72px; }
input[type="text"]:focus { border-color: #58a6ff; outline: none; }
input[type="text"].err { border-color: #f85149; }
.badge { font-size: 10px; padding: 1px 6px; border-radius: 3px; margin-left: 6px; }
.badge-have { background: #23863633; color: #3fb950; }
.badge-dup  { background: #f8514933; color: #f85149; }
.status { font-size: 12px; white-space: nowrap; min-width: 130px; }
.status .spin { display: inline-block; animation: spin .8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.btn { padding: 8px 20px; border: none; border-radius: 6px; font-size: 13px; font-weight: 600; cursor: pointer; transition: background .15s; }
.btn-primary { background: #238636; color: #fff; }
.btn-primary:hover:not(:disabled) { background: #2ea043; }
.btn-primary:disabled { opacity: .4; cursor: not-allowed; }
.btn-close { background: #21262d; color: #c9d1d9; }
.btn-close:hover { background: #30363d; }
.bar { display: flex; justify-content: space-between; align-items: center; margin-top: 14px; }
.bar .count { color: #8b949e; font-size: 12px; }
.loading { text-align: center; padding: 40px; color: #8b949e; }
.summary { margin-top: 12px; padding: 10px 14px; background: #161b22; border-radius: 6px; font-size: 12px; color: #8b949e; line-height: 1.6; }
.course-name { color: #e6edf3; max-width: 320px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; display: inline-block; vertical-align: bottom; }
.section { color: #8b949e; font-size: 11px; }
</style>
</head>
<body>
<h2>Import students from Google Classroom</h2>
<div class="subtitle" id="subtitle">Loading courses…</div>

<div id="content"><div class="loading">Fetching your Google Classroom courses…</div></div>

<div class="bar" id="bar" style="display:none">
  <span class="count" id="sel-count">0 selected</span>
  <div style="display:flex;gap:8px">
    <button class="btn btn-close" onclick="google.script.host.close()">Cancel</button>
    <button class="btn btn-primary" id="btn-import" disabled onclick="startImport()">Import selected</button>
  </div>
</div>

<script>
var DATA = null;
var importing = false;

google.script.run
  .withSuccessHandler(function (d) { DATA = d; render(); })
  .withFailureHandler(function (e) {
    document.getElementById('content').innerHTML =
      '<div class="loading" style="color:#f85149">Could not load your courses: ' + esc(e.message) + '</div>';
  })
  .getBatchImportData();

function esc(s) { var d = document.createElement('span'); d.textContent = s; return d.innerHTML; }

function render() {
  if (!DATA || !DATA.courses.length) {
    document.getElementById('content').innerHTML = '<div class="loading">No active courses found.</div>';
    return;
  }
  document.getElementById('subtitle').textContent =
    DATA.courses.length + ' active course(s). Tick the ones to import, check the class code, then Import. ' +
    'Students already here are skipped, so you can re-run this whenever someone joins.';
  document.getElementById('bar').style.display = '';

  var html = '<table><thead><tr>' +
    '<th style="width:28px"><input type="checkbox" class="cb" id="cb-all" onchange="toggleAll(this.checked)"></th>' +
    '<th style="width:28px">#</th>' +
    '<th>Course</th>' +
    '<th style="width:96px">Class code</th>' +
    '<th>Status</th>' +
    '</tr></thead><tbody>';

  DATA.courses.forEach(function (c, i) {
    html += '<tr class="row" id="row-' + i + '">' +
      '<td><input type="checkbox" class="cb" id="cb-' + i + '" onchange="updateUI()"></td>' +
      '<td style="color:#8b949e">' + (i + 1) + '</td>' +
      '<td><span class="course-name">' + esc(c.name) + '</span>' +
        (c.section ? ' <span class="section">' + esc(c.section) + '</span>' : '') +
        '<span id="badge-' + i + '"></span></td>' +
      '<td><input type="text" id="cc-' + i + '" value="' + esc(c.autoClassCode) + '" ' +
        'oninput="updateUI()" placeholder="e.g. 9A"' + (c.autoClassCode ? '' : ' class="err"') + '></td>' +
      '<td class="status" id="st-' + i + '">—</td>' +
    '</tr>';
  });
  html += '</tbody></table>';
  document.getElementById('content').innerHTML = html;
  updateUI();
}

function toggleAll(checked) {
  DATA.courses.forEach(function (_, i) { document.getElementById('cb-' + i).checked = checked; });
  updateUI();
}

function getSelections() {
  var sels = [];
  DATA.courses.forEach(function (c, i) {
    if (!document.getElementById('cb-' + i).checked) return;
    sels.push({
      idx: i,
      courseId: c.id,
      classCode: document.getElementById('cc-' + i).value.trim().toUpperCase(),
      courseName: c.display
    });
  });
  return sels;
}

function updateUI() {
  if (importing) return;
  var sels = getSelections();
  document.getElementById('sel-count').textContent = sels.length + ' selected';

  DATA.courses.forEach(function (_, i) {
    document.getElementById('badge-' + i).innerHTML = '';
    var cc = document.getElementById('cc-' + i);
    cc.classList.toggle('err', document.getElementById('cb-' + i).checked && !cc.value.trim());
  });

  var byCode = {}, hasEmpty = false;
  sels.forEach(function (s) {
    if (!s.classCode) { hasEmpty = true; return; }
    var have = DATA.have[s.classCode];
    if (have) document.getElementById('badge-' + s.idx).innerHTML =
      '<span class="badge badge-have" title="Already in the Students tab — they will be skipped">' + have + ' already</span>';
    (byCode[s.classCode] = byCode[s.classCode] || []).push(s.idx);
  });
  Object.keys(byCode).forEach(function (code) {
    if (byCode[code].length > 1) byCode[code].forEach(function (idx) {
      document.getElementById('badge-' + idx).innerHTML =
        '<span class="badge badge-dup" title="Two courses share this class code — their students will be merged into one class">merge</span>';
    });
  });

  document.getElementById('btn-import').disabled = sels.length === 0 || hasEmpty;
}

/* ── the import: one long call, progress polled alongside it ── */
var POLL_INTERVAL_MS = 1500;
var pollHandle = null;
var pollFinished = false;

function startImport() {
  var sels = getSelections();
  if (!sels.length) return;
  importing = true;
  pollFinished = false;
  var btn = document.getElementById('btn-import');
  btn.disabled = true;
  btn.textContent = 'Importing ' + sels.length + ' class(es)…';
  Array.prototype.forEach.call(document.querySelectorAll('.cb, input[type="text"]'), function (el) { el.disabled = true; });

  sels.forEach(function (s, i) {
    var st = document.getElementById('st-' + s.idx);
    if (st) st.innerHTML = '<span class="spin">⏳</span> Queued (' + (i + 1) + '/' + sels.length + ')';
    var row = document.getElementById('row-' + s.idx);
    if (row) row.classList.add('selected');
  });

  document.getElementById('bar').insertAdjacentHTML('afterbegin',
    '<div id="close-hint" style="font-size:11px;color:#8b949e;margin-bottom:6px">' +
    'You can close this window — the import keeps running. Re-open the sheet to see the result.</div>');

  var jobId = 'batch_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);

  google.script.run
    .withSuccessHandler(function (results) {
      stopPolling();
      applyResults(sels, results);
      if (!pollFinished) showFinalSummary(sels);
      pollFinished = true;
    })
    .withFailureHandler(function (err) {
      /* The call can fail after the server actually finished — a network blip on
         the way back. Ask the cache once more before calling anything failed. */
      stopPolling();
      google.script.run
        .withSuccessHandler(function (p) {
          if (p && Array.isArray(p.results)) applyResults(sels, p.results);
          finalizeAfterError(sels, err);
        })
        .withFailureHandler(function () { finalizeAfterError(sels, err); })
        .getBatchImportProgress(jobId);
    })
    .executeBatchImportAll(sels, jobId);

  startPolling(jobId, sels);
}

function startPolling(jobId, sels) {
  if (pollHandle) clearInterval(pollHandle);
  pollHandle = setInterval(function () {
    google.script.run
      .withSuccessHandler(function (p) {
        if (!p) return;
        applyResults(sels, p.results);
        if (p.done) {
          stopPolling();
          if (!pollFinished) showFinalSummary(sels);
          pollFinished = true;
        }
      })
      .withFailureHandler(function () { /* one poll failed; try the next */ })
      .getBatchImportProgress(jobId);
  }, POLL_INTERVAL_MS);
}
function stopPolling() { if (pollHandle) { clearInterval(pollHandle); pollHandle = null; } }

function applyResults(sels, results) {
  if (!Array.isArray(results)) return;
  results.forEach(function (r, i) {
    var s = sels[i];
    if (!s || !r || r.status === 'pending') return;
    var key = r.status + ':' + (r.added || 0) + ':' + (r.skipped || 0) + ':' + (r.error || '');
    if (s._renderedKey === key) return;
    s._renderedKey = key; s._result = r;
    var st = document.getElementById('st-' + s.idx);
    if (!st) return;
    if (r.status === 'success') {
      st.innerHTML = '<span style="color:#3fb950">✅ ' + r.added + ' added</span>' +
        (r.skipped ? ' <span style="color:#8b949e">(' + r.skipped + ' already here)</span>' : '') +
        (r.moved ? ' <span style="color:#d29922">(' + r.moved + ' moved class)</span>' : '');
    } else if (r.status === 'empty') {
      st.innerHTML = '<span style="color:#d29922">⚠ No students in that course</span>';
    } else {
      st.innerHTML = '<span style="color:#f85149">❌ ' + esc(r.error || 'Error').substring(0, 60) + '</span>';
    }
  });
}

function finalizeAfterError(sels, err) {
  if (pollFinished) return;
  sels.forEach(function (s) {
    if (s._result) return;
    s._result = { status: 'error', error: (err && err.message) || 'Server error' };
    var st = document.getElementById('st-' + s.idx);
    if (st) st.innerHTML = '<span style="color:#f85149">❌ ' + esc((err && err.message) || 'Error').substring(0, 60) + '</span>';
  });
  showFinalSummary(sels);
  pollFinished = true;
}

function showFinalSummary(sels) {
  importing = false;
  var ok = 0, fail = 0, added = 0, skipped = 0;
  sels.forEach(function (s) {
    var r = s._result || {};
    if (r.status === 'success') { ok++; added += (r.added || 0); skipped += (r.skipped || 0); }
    else if (r.status !== 'empty') fail++;
  });
  var hint = document.getElementById('close-hint'); if (hint) hint.remove();
  document.getElementById('bar').innerHTML =
    '<div class="summary">' +
      '<strong>' + ok + '</strong> class(es) imported. ' +
      '<strong>' + added + '</strong> student(s) added' +
      (skipped ? ', ' + skipped + ' already here' : '') + '.' +
      (fail ? ' <span style="color:#f85149">' + fail + ' failed.</span>' : '') +
    '</div>' +
    '<button class="btn btn-close" style="margin-top:10px" onclick="google.script.host.close()">Close</button>';
}
</script>
</body>
</html>
```

</details>

---

---

## Layout

```
index.html                the front door — the 3D body
plate.html                the light version — the flat anatomical plate
js/topics.js              THE TOPIC REGISTER — the only file you edit to add a lab
js/body3d.js              the 3D scene: loading, lighting, picking, idle tour
js/hub.js                 the flat plate: hotspots, lighting, pinned labels, idle tour
css/hub.css               design tokens, both layouts, both colour sets
assets/model/body.glb     the MRI body — 40 organ groups, 345k triangles, 6.2 MB
assets/anatomy/           the flat plate and its organ paintings
tools/model-build/        rebuild the 3D body from BodyParts3D
tools/inline-plate.py     re-inline the flat plate into plate.html
docs/BUILD-NOTES.md       the long-form notes
```

**Running it locally.** `plate.html` opens by double-clicking. `index.html` does not —
browsers block module scripts and model loading from `file://` — so serve the folder:

```bash
python3 -m http.server 8744
```

---

## Sources and licences

| What | Source | Licence |
|------|--------|---------|
| The 3D body | [BodyParts3D](https://dbarchive.biosciencedbc.jp/en/bodyparts3d/desc.html), © The Database Center for Life Science | **CC BY-SA 2.1 Japan** |
| The flat plate | [M. Häggström, *Human body diagrams*](https://commons.wikimedia.org/wiki/Human_body_diagrams) | CC0 (public domain) |
| Uterus and ovaries | [Servier Medical Art](https://smart.servier.com) | CC BY 4.0 |
| 3D rendering | [three.js](https://threejs.org) | MIT |

> **ShareAlike applies to the body model.** `assets/model/body.glb` is a derivative of
> BodyParts3D, so publishing it licenses that file onward under CC BY-SA 2.1 Japan. The
> credit line in the page footer is part of that obligation — please keep it.

---

## Who made this

**Dr Daniel Mompel Riera** — Biology, North London Collegiate School Jeju.

Built for his Year 10 and 11 IGCSE Biology classes. Questions, corrections, or if
you'd like to use it with your own students, please get in touch:
**[dmompelriera@nlcsjeju.kr](mailto:dmompelriera@nlcsjeju.kr)**

© Dr Daniel Mompel Riera. The anatomical source material is licensed as set out
above; the site itself — its design, its writing and its questions — is his work.
