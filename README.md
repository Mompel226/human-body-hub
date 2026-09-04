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
| **Setup** | what everything is, and your web app URL |
| **Labs** | a row per lab: its id, its tab, **Mastery open** ☑, the message shown when it is closed, and a live count of hand-ins |
| **Students** | your Classroom rosters — name, school email, class, source course |
| **Digestion**, **Circulation**, … | a tab per lab: every hand-in, newest at the bottom |
| **Summary** | best % per student per lab, rebuilt from the menu |

Every tab is styled by the script, not by hand: a frozen dark-green header, columns wide
enough for what is in them, long text wrapped rather than clipped, the name column frozen
while you scroll right, row banding, a filter row on every sheet, and a red-amber-green
scale on the percentages. **🧪 Biology Labs ▸ Re-apply the formatting** puts it back after
any manual change. To see one class, use the filter on the *Class* column — the rosters and
the hand-ins use the same class codes.

### Setting it up

1. **Make one new Google Sheet.** The name does not matter.
2. **Copy its ID** from the address bar — `docs.google.com/spreadsheets/d/`**`THIS BIT`**`/edit`
3. **Extensions ▸ Apps Script.** Delete what is there, paste in **`Code.gs`** (below), and
   put the ID into `SHEET_ID` at the top.
4. **Add the dialog.** **+** next to *Files* ▸ **HTML** ▸ name it exactly `ClassroomImport`
   ▸ paste in **`ClassroomImport.html`** (below). Save.
5. **Switch on Google Classroom.** In the editor's **left sidebar**, next to **Services**,
   press **+** ▸ choose **Google Classroom API** ▸ **Add**. Leave the identifier as
   `Classroom`. *(Miss this and the import window says "Classroom is not defined".)*
6. **Run ▸ `setup`.** Authorise when asked — your own script, your own Sheet. It builds and
   styles every tab.
7. **Deploy ▸ New deployment ▸ Web app**, *Execute as* **Me**, *Who has access* **Anyone**.
   Deploy, copy the `/exec` URL.
8. **Paste that URL** into each lab's `js/config.js` as `submitUrl`, commit, push.

> **After any edit to the script:** Deploy ▸ Manage deployments ▸ pencil ▸ *Version: New
> version* ▸ Deploy. Editing alone changes nothing.

**If something is not working:** 🧪 Biology Labs ▸ **Check the set-up**. It tells you in one
box whether `SHEET_ID` is set, whether the Sheet opens, whether Google Classroom is switched
on and authorised, how many students are imported and how many lab tabs exist.

| What you see | What it means |
|---|---|
| `Classroom is not defined` | step 5 was skipped — add the Classroom service, then run `setup` once |
| a permission prompt on first run | expected: it is your own script, on your own Sheet and your own Classroom |
| the import window lists no courses | the account you are signed in as has no **active** Classroom courses |
| a lab's tab never appears | that lab has not handed in yet — tabs are made on the first submission |

### The three things you will actually do

**Import your classes.** 🧪 Biology Labs ▸ *Import students from Classroom…* It lists your
active courses, guesses a class code from each name, and shows how many of that class you
already have. Tick, check the codes, Import — each ticks green as it lands, and closing the
window does not stop it. Run it again whenever someone joins: students are keyed on their
school email, so it adds the new ones, moves anyone whose class changed, and never
duplicates.

**Close Mastery during a test.** Labs tab ▸ untick *Mastery open*. Every open page follows
within about two minutes and moves the student into Test mode. Tick it back afterwards, or
use *Close Mastery everywhere* in the menu. With no Sheet set up, `masteryOpen` in a lab's
`js/config.js` does the same job, one push instead of one click.

**Read the results.** Each lab tab holds a row per hand-in: when, name, class, mode, score,
%, whether it was finished, **how many checks it took**, **how many were right first time**,
and how long they had been working. Those last three are the point of Mastery —
`113/113 · 214 checks · 71 right first time` is the evidence somebody ground it out.

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

**Honest limits.** The Mastery switch is a classroom control, not security: the labs are
static sites and a determined student can work around anything the browser is told. If the
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
 *   2. Copy its ID from the address bar:
 *        docs.google.com/spreadsheets/d/ >>>THIS BIT<<< /edit
 *      and paste it into SHEET_ID below.
 *   3. Extensions ▸ Apps Script. Delete what is there, paste this file in.
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

var T_SETUP = 'Setup', T_LABS = 'Labs', T_STUDENTS = 'Students', T_SUMMARY = 'Summary';

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
    .addItem('📊  Rebuild the summary', 'rebuildSummary')
    .addItem('🎨  Re-apply the formatting', 'restyleAll')
    .addSeparator()
    .addItem('🔒  Close Mastery everywhere', 'closeMasteryAll')
    .addItem('🔓  Open Mastery everywhere', 'openMasteryAll')
    .addSeparator()
    .addItem('⚙️  Rebuild the tabs (safe — keeps your data)', 'setup')
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

    var name  = String(d.name || '').trim().slice(0, 80);
    var form  = String(d.form || '').trim().slice(0, 20);
    var mode  = String(d.mode || '').trim().slice(0, 20);
    var score = Number(d.score) || 0;
    var total = Number(d.total) || 0;

    var genuine = (_code(lab.id, name, form, score + '/' + total) === String(d.code || ''));
    var flags = [];
    if (!genuine) flags.push('CODE MISMATCH');
    if (lab.questions && total !== lab.questions) flags.push('NOT ALL QUESTIONS');
    if (d.complete === false) flags.push('PROGRESS — not finished');

    var sh = _labSheet(lab);
    sh.appendRow([
      new Date(), name, form, mode,
      score, total, total ? score / total : 0,
      d.complete === false ? 'progress' : 'complete',
      Number(d.checks) || '', Number(d.firstTime) || '', _since(d.from),
      d.code || '', genuine ? 'ok' : 'CHECK', flags.join('; '),
      _stations(d.stations)
    ]);
    _tidyLastRow(sh);
    return _text('recorded');
  } catch (err) {
    return _text('error: ' + err);
  }
}

/* ============================================================
   2. The Mastery switch, per lab
   The site asks on load, when the tab is brought back, and every few minutes.
   ============================================================ */
function doGet(e) {
  var q = (e && e.parameter) || {};
  if (q.q === 'gate') {
    var row = _labRow(String(q.app || ''));
    var body = JSON.stringify({
      masteryOpen: row ? row.open : true,
      note: row ? row.note : ''
    });
    if (q.callback) return _js(q.callback + '(' + body + ');');
    return _json(body);
  }
  return _text('Biology Labs endpoint is running. Labs: ' +
               LABS.map(function (l) { return l.id; }).join(', '));
}

function closeMasteryAll() { _setMasteryAll(false); }
function openMasteryAll()  { _setMasteryAll(true); }
function _setMasteryAll(open) {
  var sh = _sheet(T_LABS), n = Math.max(0, sh.getLastRow() - 1);
  if (n) sh.getRange(2, 4, n, 1).setValue(open);
  SpreadsheetApp.getActive().toast(open ? 'Mastery is open in every lab.'
                                        : 'Mastery is closed in every lab.', 'Biology Labs', 5);
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
    var cls = String(rows[i][2] || '').toUpperCase();
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
  _styleStudents();
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
  var rows = sh.getDataRange().getValues();
  var seen = {}, rowOf = {};
  for (var i = 1; i < rows.length; i++) {
    var em = String(rows[i][1] || '').toLowerCase();
    if (em) { seen[em] = true; rowOf[em] = i + 1; }
  }
  var add = [], skipped = 0, moved = 0, now = new Date();
  students.forEach(function (st) {
    if (st.email && seen[st.email]) {
      var r = rowOf[st.email];
      if (String(sh.getRange(r, 3).getValue()).toUpperCase() !== classCode) {
        sh.getRange(r, 3).setValue(classCode); moved++;
      }
      skipped++;
      return;
    }
    add.push([st.name, st.email, classCode, courseName, now, st.userId, courseId]);
  });
  if (add.length) {
    sh.getRange(sh.getLastRow() + 1, 1, add.length, add[0].length).setValues(add);
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
  var lines = [];
  var idOk = SHEET_ID && SHEET_ID !== 'PASTE_YOUR_SHEET_ID_HERE';
  lines.push((idOk ? '✅' : '❌') + '  SHEET_ID ' + (idOk ? 'is set' : 'is still the placeholder — paste your Sheet ID at the top of Code.gs'));

  var openOk = false;
  if (idOk) {
    try { SpreadsheetApp.openById(SHEET_ID).getName(); openOk = true; } catch (e) {}
    lines.push((openOk ? '✅' : '❌') + '  the Sheet ' + (openOk ? 'opens' : 'will not open — check the ID is the long code from the address bar'));
  }

  var clsOk = (typeof Classroom !== 'undefined' && Classroom && Classroom.Courses);
  lines.push((clsOk ? '✅' : '❌') + '  Google Classroom ' + (clsOk ? 'is switched on' :
    'is NOT switched on — left sidebar: Services ▸ + ▸ Google Classroom API ▸ Add (identifier "Classroom")'));

  var n = 0;
  if (clsOk) {
    try { n = (Classroom.Courses.list({ courseStates: ['ACTIVE'], pageSize: 5 }).courses || []).length; lines.push('✅  it can see your courses (' + n + '+ active)'); }
    catch (e) { lines.push('❌  Classroom is on but not authorised yet — Run ▸ setup once and accept the permission. (' + e + ')'); }
  }

  if (openOk) {
    var have = Math.max(0, _sheet(T_STUDENTS).getLastRow() - 1);
    lines.push('•  students imported so far: ' + have);
    var built = LABS.filter(function (l) { return SpreadsheetApp.openById(SHEET_ID).getSheetByName(l.name); }).length;
    lines.push('•  lab tabs built: ' + built + ' of ' + LABS.length);
  }

  SpreadsheetApp.getUi().alert('Biology Labs — set-up', lines.join('\n\n'), SpreadsheetApp.getUi().ButtonSet.OK);
}

/* ============================================================
   5. The tabs, and making them readable
   ============================================================ */
function setup() {
  _sheet(T_SETUP); _sheet(T_LABS); _sheet(T_STUDENTS);
  LABS.forEach(function (l) { if (l.questions) _labSheet(l); });   /* built labs get a tab now */
  _sheet(T_SUMMARY);
  restyleAll();
  SpreadsheetApp.getActive().toast('Every tab is built and styled.', 'Biology Labs', 6);
}

function restyleAll() {
  _styleSetup(); _styleLabs(); _styleStudents();
  LABS.forEach(function (l) {
    var sh = SpreadsheetApp.openById(SHEET_ID).getSheetByName(l.name);
    if (sh) _styleLab(sh);
  });
  var sum = SpreadsheetApp.openById(SHEET_ID).getSheetByName(T_SUMMARY);
  if (sum) _styleSummary(sum);
}

/* One place decides what "readable" means: a header that stands out, a frozen
   top row, columns wide enough for what is actually in them, wrapped text where
   the content is long, and a filter so any column can be narrowed to one class. */
function _dress(sh, headers, widths, opts) {
  opts = opts || {};
  var n = headers.length;
  if (sh.getMaxColumns() < n) sh.insertColumnsAfter(sh.getMaxColumns(), n - sh.getMaxColumns());
  if (sh.getMaxColumns() > n) {
    /* only ever trim empty columns to the right of the schema */
    var spare = sh.getRange(1, n + 1, sh.getMaxRows(), sh.getMaxColumns() - n);
    try { if (spare.isBlank()) sh.deleteColumns(n + 1, sh.getMaxColumns() - n); } catch (e) {}
  }

  sh.getRange(1, 1, 1, n).setValues([headers])
    .setFontWeight('bold').setFontColor('#FFFFFF').setBackground(INK)
    .setVerticalAlignment('middle').setWrap(true);
  sh.setRowHeight(1, opts.headerHeight || 34);
  sh.setFrozenRows(1);
  if (opts.freezeCols) sh.setFrozenColumns(opts.freezeCols);

  widths.forEach(function (w, i) { if (w) sh.setColumnWidth(i + 1, w); });

  var rows = Math.max(1, sh.getMaxRows() - 1);
  var body = sh.getRange(2, 1, rows, n);
  body.setVerticalAlignment('top');
  if (opts.wrapCols) opts.wrapCols.forEach(function (c) {
    sh.getRange(2, c, rows, 1).setWrap(true);
  });
  if (opts.formats) Object.keys(opts.formats).forEach(function (c) {
    sh.getRange(2, +c, rows, 1).setNumberFormat(opts.formats[c]);
  });

  /* banding, refreshed rather than stacked */
  sh.getBandings().forEach(function (b) { b.remove(); });
  if (opts.band !== false) {
    sh.getRange(1, 1, sh.getMaxRows(), n)
      .applyRowBanding(SpreadsheetApp.BandingTheme.LIGHT_GREY, true, false);
  }
  /* one filter, rebuilt so the columns always match */
  var f = sh.getFilter(); if (f) f.remove();
  if (opts.filter !== false && sh.getLastRow() > 1) sh.getRange(1, 1, sh.getLastRow(), n).createFilter();

  sh.setHiddenGridlines(true);
}

function _styleSetup() {
  var sh = _sheet(T_SETUP);
  /* Read what is already there before clearing: B7 is the one cell the teacher is
     told to fill in, and re-applying the formatting must not wipe it. */
  var url = '';
  try { url = String(sh.getRange('B7').getValue() || '').trim(); } catch (e) {}
  if (!/^https?:/i.test(url)) url = PropertiesService.getScriptProperties().getProperty('WEB_APP_URL') || '';
  if (!url) url = '(paste your /exec URL here, so you can find it again)';
  sh.clear();
  var lines = [
    ['Biology Labs — one spreadsheet for every lab', ''],
    ['', ''],
    ['What is here', 'Labs — one row per lab, and the Mastery switch for each.'],
    ['', 'Students — your Classroom rosters. 🧪 Biology Labs ▸ Import students…'],
    ['', 'One tab per lab — every hand-in, newest at the bottom. Use the filter row to pick a class.'],
    ['', 'Summary — best score per student per lab. Rebuild it from the menu.'],
    ['Web app URL', url],
    ['', ''],
    ['To close Mastery during a test', 'Labs tab ▸ untick "Mastery open" for that lab. Every open page follows within two minutes.'],
    ['To add students who joined later', '🧪 Biology Labs ▸ Import students… ▸ tick the classes ▸ Import. It adds only the new ones.'],
    ['After editing the script', 'Deploy ▸ Manage deployments ▸ pencil ▸ Version: New version ▸ Deploy.']
  ];
  sh.getRange(1, 1, lines.length, 2).setValues(lines);
  sh.getRange('A1').setFontSize(16).setFontWeight('bold').setFontColor(INK);
  sh.getRange(3, 1, lines.length - 2, 1).setFontWeight('bold').setFontColor(INK);
  sh.getRange(1, 1, lines.length, 2).setVerticalAlignment('top').setWrap(true);
  sh.setColumnWidth(1, 230); sh.setColumnWidth(2, 760);
  sh.setHiddenGridlines(true);
  sh.getBandings().forEach(function (b) { b.remove(); });
}

function _styleLabs() {
  var sh = _sheet(T_LABS);
  _dress(sh,
    ['Lab id (sent by the site)', 'Lab', 'Topic', 'Mastery open', 'Message when Mastery is closed', 'Questions', 'Hand-ins'],
    [190, 140, 210, 110, 420, 90, 90],
    { wrapCols: [5], freezeCols: 2 });
  var rows = Math.max(0, sh.getLastRow() - 1);
  if (rows) {
    sh.getRange(2, 4, rows, 1).insertCheckboxes();
    sh.getRange(2, 4, rows, 1).setHorizontalAlignment('center');
    sh.getRange(2, 6, rows, 2).setHorizontalAlignment('center');
  }
}

function _styleStudents() {
  var sh = _sheet(T_STUDENTS);
  _dress(sh,
    ['Name', 'School email', 'Class', 'Classroom course', 'Imported', 'Classroom user id', 'Course id'],
    [210, 260, 80, 260, 130, 170, 140],
    { freezeCols: 1, formats: { 5: 'dd MMM yyyy' } });
  sh.hideColumns(6, 2);                    /* the ids are needed, not looked at */
  var rows = Math.max(0, sh.getLastRow() - 1);
  if (rows) sh.getRange(2, 3, rows, 1).setHorizontalAlignment('center').setFontWeight('bold');
}

function _styleLab(sh) {
  _dress(sh,
    ['When', 'Name', 'Class', 'Mode', 'Score', 'Out of', '%', 'Finished?',
     'Checks', 'Right first time', 'Working since', 'Code', 'Code check', 'Flags', 'Per station'],
    [140, 200, 70, 90, 70, 70, 70, 100, 80, 120, 110, 120, 100, 190, 420],
    { freezeCols: 2, wrapCols: [14, 15],
      formats: { 1: 'dd MMM, HH:mm', 5: '0', 6: '0', 7: '0%' } });

  var rows = Math.max(0, sh.getLastRow() - 1);
  if (!rows) return;
  sh.getRange(2, 3, rows, 6).setHorizontalAlignment('center');
  sh.getRange(2, 8, rows, 4).setHorizontalAlignment('center');

  var rules = [];
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .setGradientMinpointWithValue('#F4C7C3', SpreadsheetApp.InterpolationType.NUMBER, '0')
    .setGradientMidpointWithValue('#FCE8B2', SpreadsheetApp.InterpolationType.NUMBER, '0.6')
    .setGradientMaxpointWithValue('#B7E1CD', SpreadsheetApp.InterpolationType.NUMBER, '1')
    .setRanges([sh.getRange(2, 7, rows, 1)]).build());
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('progress').setBackground('#FCE8B2').setFontColor('#7F6000')
    .setRanges([sh.getRange(2, 8, rows, 1)]).build());
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('complete').setBackground('#D9EAD3').setFontColor('#274E13')
    .setRanges([sh.getRange(2, 8, rows, 1)]).build());
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('CHECK').setBackground('#F4C7C3').setFontColor('#990000').setBold(true)
    .setRanges([sh.getRange(2, 13, rows, 1)]).build());
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenTextContains('MISMATCH').setBackground('#F4C7C3').setFontColor('#990000')
    .setRanges([sh.getRange(2, 14, rows, 1)]).build());
  sh.setConditionalFormatRules(rules);
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

function rebuildSummary() {
  var ss = SpreadsheetApp.openById(SHEET_ID);
  var sh = _sheet(T_SUMMARY);
  var live = LABS.filter(function (l) { return ss.getSheetByName(l.name); });

  /* name → class, from the roster, so a student who never handed in still shows */
  var out = {}, order = [];
  var st = _sheet(T_STUDENTS).getDataRange().getValues();
  for (var i = 1; i < st.length; i++) {
    var nm = String(st[i][0] || '').trim();
    if (!nm) continue;
    if (!out[nm]) { out[nm] = { cls: st[i][2] || '', best: {} }; order.push(nm); }
  }
  live.forEach(function (l) {
    var rows = ss.getSheetByName(l.name).getDataRange().getValues();
    for (var i = 1; i < rows.length; i++) {
      var nm = String(rows[i][1] || '').trim(); if (!nm) continue;
      if (!out[nm]) { out[nm] = { cls: rows[i][2] || '', best: {} }; order.push(nm); }
      var pc = Number(rows[i][6]) || 0;
      if (!(l.id in out[nm].best) || pc > out[nm].best[l.id]) out[nm].best[l.id] = pc;
    }
  });

  order.sort(function (a, b) {
    var A = out[a], B = out[b];
    return String(A.cls).localeCompare(String(B.cls)) || a.localeCompare(b);
  });

  sh.clear();
  var head = ['Name', 'Class'].concat(live.map(function (l) { return l.name; }));
  var body = order.map(function (nm) {
    return [nm, out[nm].cls].concat(live.map(function (l) {
      return (l.id in out[nm].best) ? out[nm].best[l.id] : '';
    }));
  });
  sh.getRange(1, 1, 1, head.length).setValues([head]);
  if (body.length) sh.getRange(2, 1, body.length, head.length).setValues(body);

  _dress(sh, head, [210, 70].concat(live.map(function () { return 110; })),
         { freezeCols: 2 });
  if (body.length) {
    var pct = sh.getRange(2, 3, body.length, live.length);
    pct.setNumberFormat('0%').setHorizontalAlignment('center');
    sh.setConditionalFormatRules([SpreadsheetApp.newConditionalFormatRule()
      .setGradientMinpointWithValue('#F4C7C3', SpreadsheetApp.InterpolationType.NUMBER, '0')
      .setGradientMidpointWithValue('#FCE8B2', SpreadsheetApp.InterpolationType.NUMBER, '0.6')
      .setGradientMaxpointWithValue('#B7E1CD', SpreadsheetApp.InterpolationType.NUMBER, '1')
      .setRanges([pct]).build()]);
  }
  SpreadsheetApp.getActive().toast('Summary rebuilt: ' + body.length + ' students, ' + live.length + ' lab(s).', 'Biology Labs', 5);
}
function _styleSummary(sh) { if (sh.getLastRow() > 1) sh.setFrozenRows(1); }

/* ============================================================
   6. Plumbing
   ============================================================ */
function _ss() { return SpreadsheetApp.openById(SHEET_ID); }
function _sheet(name) {
  var ss = _ss(), sh = ss.getSheetByName(name);
  if (sh) return sh;
  sh = ss.insertSheet(name);
  if (name === T_LABS) {
    sh.getRange(1, 1, 1, 7).setValues([['Lab id (sent by the site)', 'Lab', 'Topic', 'Mastery open',
                                        'Message when Mastery is closed', 'Questions', 'Hand-ins']]);
    var rows = LABS.map(function (l, i) {
      return [l.id, l.name, l.topic, true, 'Mastery is closed while the test is running.',
              l.questions || '', '=IFERROR(COUNTA(INDIRECT("\'"&B' + (i + 2) + '&"\'!B2:B")),0)'];
    });
    sh.getRange(2, 1, rows.length, 7).setValues(rows);
  } else if (name === T_STUDENTS) {
    sh.getRange(1, 1, 1, 7).setValues([['Name', 'School email', 'Class', 'Classroom course',
                                        'Imported', 'Classroom user id', 'Course id']]);
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
function _labRow(id) {
  var sh = _sheet(T_LABS), rows = sh.getDataRange().getValues();
  for (var i = 1; i < rows.length; i++) {
    if (String(rows[i][0]) === id) return { open: rows[i][3] !== false, note: String(rows[i][4] || '') };
  }
  return null;
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
