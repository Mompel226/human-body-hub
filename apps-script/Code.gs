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

var T_SETUP = 'Setup', T_LABS = 'Labs', T_STUDENTS = 'Students', T_REJECTED = 'Rejected';

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
    _dress(sh, ['When', 'Lab', 'Name', 'Class', 'Mode', 'Score', 'Out of', 'Code',
                'Why it was refused', 'What was sent'],
           [140, 130, 180, 70, 90, 70, 70, 120, 220, 460], { wrapCols: [9, 10] });
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
    var row = _labRow(String(q.app || ''));
    var body = JSON.stringify({
      masteryOpen: row ? row.open : true,
      note: row ? row.note : ''
    });
    if (q.callback) return _js(q.callback + '(' + body + ');');
    return _json(body);
  }
  return _text('Biology Labs endpoint is running.');
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
  refreshDashboard();
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
  var old = SpreadsheetApp.openById(SHEET_ID).getSheetByName('Summary');
  if (old && old.getLastRow() < 2) SpreadsheetApp.openById(SHEET_ID).deleteSheet(old);  /* the Students tab is the summary now */
  _installButtons();
  restyleAll();
  refreshDashboard();
  SpreadsheetApp.getActive().toast('Every tab is built and styled.', 'Biology Labs', 6);
}

function restyleAll() {
  _styleSetup(); _styleLabs(); _styleStudents();
  LABS.forEach(function (l) {
    var sh = SpreadsheetApp.openById(SHEET_ID).getSheetByName(l.name);
    if (sh) _styleLab(sh);
  });
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

/* The Setup tab is where you press things. The checkboxes are buttons: tick one, it
   runs and unticks itself. (Importing needs a window, which a trigger may not open —
   that one stays on the 🧪 menu.) */
var BTN_ROW = { refresh: 13, close: 14, open: 15, restyle: 16 };
var URL_ROW = 7;

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
    ['Labs', 'one row per lab, and the switch that closes Mastery during a test.'],
    ['Digestion, Circulation, …', 'every hand-in for that lab. A tab appears the first time the lab is used.'],
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
    ['Re-apply the formatting', ''],
    ['', ''],
    ['If something looks wrong', '🧪 Biology Labs ▸ Check the set-up'],
    ['After editing the script', 'Deploy ▸ Manage deployments ▸ pencil ▸ Version: New version ▸ Deploy']
  ];
  sh.getRange(1, 1, lines.length, 2).setValues(lines);
  sh.getRange('A1').setFontSize(17).setFontWeight('bold').setFontColor(INK);
  sh.getRange('B1').setFontColor('#6B7B6F');
  sh.getRange(3, 1, lines.length - 2, 1).setFontWeight('bold').setFontColor(INK);
  sh.getRange(9, 1).setFontSize(13);
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
    .forSpreadsheet(SpreadsheetApp.openById(SHEET_ID)).onEdit().create();
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
    else if (row === BTN_ROW.restyle) restyleAll();
  } catch (err) {
    SpreadsheetApp.getActive().toast('That button failed: ' + err, 'Biology Labs', 10);
  }
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
  var head = ['Name', 'Class'].concat(LABS.map(function (l) { return l.name; }))
             .concat(['Labs started', 'Average', 'School email', 'Classroom course', 'Imported', 'Classroom user id', 'Course id']);
  var widths = [220, 72].concat(LABS.map(function () { return 96; }))
               .concat([96, 90, 250, 240, 120, 170, 140]);
  _dress(sh, head, widths, { freezeCols: 2, headerHeight: 40, formats: { 26: 'dd MMM yyyy' } });

  var L = LABS.length, first = 3, rows = Math.max(0, sh.getLastRow() - 1);

  /* the working columns are there when they are wanted and out of the way when not */
  sh.hideColumns(first + L + 2, 5);

  /* a lab that is not built yet still gets its column, greyed so it reads as "not yet" */
  LABS.forEach(function (l, i) {
    var built = !!SpreadsheetApp.openById(SHEET_ID).getSheetByName(l.name);
    sh.getRange(1, first + i).setFontColor(built ? '#FFFFFF' : '#9DB3A4')
      .setFontStyle(built ? 'normal' : 'italic')
      .setNote(l.topic + (built ? '' : '\n\nThis lab is not built yet.'));
  });

  if (!rows) return;
  sh.getRange(2, 2, rows, 1).setHorizontalAlignment('center').setFontWeight('bold');
  sh.getRange(2, first, rows, L + 2).setHorizontalAlignment('center').setNumberFormat('0%');
  sh.getRange(2, first + L, rows, 1).setNumberFormat('0');           /* labs started is a count */

  var pct = sh.getRange(2, first, rows, L);
  var avg = sh.getRange(2, first + L + 1, rows, 1);
  sh.setConditionalFormatRules([
    SpreadsheetApp.newConditionalFormatRule()
      .setGradientMinpointWithValue('#F6C7C3', SpreadsheetApp.InterpolationType.NUMBER, '0')
      .setGradientMidpointWithValue('#FDE8B4', SpreadsheetApp.InterpolationType.NUMBER, '0.6')
      .setGradientMaxpointWithValue('#B7E1CD', SpreadsheetApp.InterpolationType.NUMBER, '1')
      .setRanges([pct, avg]).build(),
    SpreadsheetApp.newConditionalFormatRule()          /* nothing handed in yet reads as empty, not as zero */
      .whenCellEmpty().setBackground('#FAFAF7')
      .setRanges([pct]).build()
  ]);
}

/* The dashboard: every student, every lab, best score so far. Written as values rather
   than formulas so the sheet stays fast and never shows #REF for a lab that does not
   exist yet — the column is simply empty until that lab hands in. */
function refreshDashboard() {
  var ss = SpreadsheetApp.openById(SHEET_ID);
  var sh = _sheet(T_STUDENTS);
  var rows = Math.max(0, sh.getLastRow() - 1);
  if (!rows) { SpreadsheetApp.getActive().toast('No students yet — import a class first.', 'Biology Labs', 5); return; }

  var names = sh.getRange(2, 1, rows, 1).getValues();
  var rowOf = {};
  names.forEach(function (r, i) { var k = _tidy(r[0]); if (k) rowOf[k] = i; });

  var L = LABS.length, first = 3;
  var grid = names.map(function () { return new Array(L + 2).fill(''); });
  var unmatched = {};

  LABS.forEach(function (lab, c) {
    var tab = ss.getSheetByName(lab.name);
    if (!tab || tab.getLastRow() < 2) return;
    var data = tab.getRange(2, 1, tab.getLastRow() - 1, 7).getValues();
    data.forEach(function (r) {
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
                   (miss.length > 4 ? '…' : '') + ' — check the spelling in the lab tab.' : ''),
    'Biology Labs', miss.length ? 12 : 5);
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
