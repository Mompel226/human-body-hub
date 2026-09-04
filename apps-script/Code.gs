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
    ], {});
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
  var rows = _dress2(sh, cols, { freezeCols: 1 });
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
var HDR_AUTO = '#14572B';     /* filled in for you */
var HDR_EDIT = '#8A6A12';     /* yours to change  */
var HDR_SOON = '#4A7B60';     /* a lab that does not exist yet — readable, but clearly not live */

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

  /* headings */
  var head = sh.getRange(1, 1, 1, n);
  head.setValues([cols.map(function (c) { return (c.edit ? '✎ ' : '') + c.h; })])
      .setFontWeight('bold').setFontColor('#FFFFFF')
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
  sh.setHiddenGridlines(true);

  if (rows > 0) {
    var body = sh.getRange(2, 1, rows, n);
    body.setVerticalAlignment('middle').setFontColor('#1F2A1F');
    sh.getRange(1, 1, last, n).applyRowBanding(SpreadsheetApp.BandingTheme.LIGHT_GREY, true, false);
    sh.getRange(1, 1, last, n).createFilter();
    for (var r = 2; r <= last; r++) sh.setRowHeight(r, 22);
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
  ], { freezeCols: 2 });
}

function _styleLab(sh) {
  var rows = _dress2(sh, [
    { h:'When', w:150, fmt:'dd MMM, HH:mm', note:'When it was handed in.' },
    { h:'Name', w:200, note:'As the student typed it. If this does not match the Students tab, the dashboard will say so.' },
    { h:'Class', w:80, align:'center', note:'The class they chose when handing in.' },
    { h:'Mode', w:90, align:'center', list:['mastery', 'test'],
      note:'mastery — unlimited checks, never shown the answer.\ntest — one attempt per question.' },
    { h:'Score', w:76, align:'center', fmt:'0', note:'How many they got right.' },
    { h:'Out of', w:76, align:'center', fmt:'0', note:'How many questions the lab asked.' },
    { h:'%', w:70, align:'center', fmt:'0%', note:'Score out of the total.' },
    { h:'Finished?', w:104, align:'center', list:['complete', 'progress'],
      note:'complete — every question right (Mastery) or every question attempted (Test).\nprogress — handed in part way, to show the work so far.' },
    { h:'Checks', w:86, align:'center', fmt:'0', note:'How many times they pressed Check answer, in all. This is the evidence of grinding.' },
    { h:'Right first time', w:130, align:'center', fmt:'0', note:'How many questions they got right at the first attempt. Separates knowing it from working it out.' },
    { h:'Working since', w:120, align:'center', note:'How long before handing in they first checked anything.' },
    { h:'Code', w:120, align:'center', note:'The completion code the student saw. They can paste it into Classroom.' },
    { h:'Checked', w:90, align:'center', note:'Whether that code recomputes here. Anything that does not is in the Rejected tab instead.' },
    { h:'Flags', w:200, wrap:true, note:'Anything worth a second look.' },
    { h:'Per station', w:420, wrap:true, note:'Their score at each station, and how many checks it took there.' }
  ], { freezeCols: 2 });

  if (!rows) return;
  sh.setConditionalFormatRules([
    SpreadsheetApp.newConditionalFormatRule()
      .setGradientMinpointWithValue('#F4C7C3', SpreadsheetApp.InterpolationType.NUMBER, '0')
      .setGradientMidpointWithValue('#FDE8B4', SpreadsheetApp.InterpolationType.NUMBER, '0.6')
      .setGradientMaxpointWithValue('#B7E1CD', SpreadsheetApp.InterpolationType.NUMBER, '1')
      .setRanges([sh.getRange(2, 7, rows, 1)]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('progress')
      .setBackground('#FDE8B4').setFontColor('#7F6000')
      .setRanges([sh.getRange(2, 8, rows, 1)]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('complete')
      .setBackground('#D9EAD3').setFontColor('#274E13')
      .setRanges([sh.getRange(2, 8, rows, 1)]).build()
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
