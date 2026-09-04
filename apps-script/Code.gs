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

function getBatchImportData() {
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
