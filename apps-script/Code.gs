/**
 * Biology Labs — one spreadsheet for every lab
 * ============================================
 * Copyright (c) 2025-2026 Daniel Mompel Riera. All rights reserved.
 *
 * What this does
 *   • Collects hand-ins from every Biology Lab into one Sheet, a tab per lab.
 *   • Imports your Google Classroom rosters, so the marks sit next to real names
 *     and classes. Re-run it whenever someone joins: it adds, never duplicates.
 *   • Keeps only your own students: a hand-in is recorded when the Google account that
 *     signed in is on your roster, and ignored when it is not. The labs are public, so
 *     anyone may use them — their work simply does not land here.
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

var T_SETUP = 'Setup', T_LABS = 'Labs', T_STUDENTS = 'Students', T_REJECTED = 'Rejected';

/* A lab's tab, described once. Every student gets a row when they are imported; the
   columns after Class stay empty until they hand in. */
var LAB_COLS = [
  { h:'Name', w:200, note:'From the Students tab. Everyone gets a row here when they are imported, whether they have handed in or not. To correct a name, correct it there.' },
  { h:'Class', w:80, align:'center', note:'From the Students tab. Move somebody between classes there and it follows them into every lab.' },
  { h:'Score', w:76, align:'center', fmt:'0', group:true, note:'Their best score in this lab. Blank means they have not handed in yet.' },
  { h:'Out of', w:76, align:'center', fmt:'0', note:'How many questions the lab asked.' },
  { h:'%', w:70, align:'center', fmt:'0%', note:'Their best score as a percentage.' },
  { h:'Finished?', w:104, align:'center', list:['complete', 'progress'],
    note:'complete — every question right.\nprogress — handed in part way, to show the work so far.' },
  { h:'Checks', w:86, align:'center', fmt:'0', group:true, note:'How many times they pressed Check answer, in all. This is the evidence of the work.' },
  { h:'Right first time', w:130, align:'center', fmt:'0', note:'How many questions they got right at the first attempt. Separates knowing it from working it out.' },
  { h:'Working since', w:120, align:'center', note:'How long before their best hand-in they first checked anything.' },
  { h:'Hand-ins', w:90, align:'center', fmt:'0', group:true, note:'How many times they have handed this lab in. A second hand-in updates the row rather than adding one.' },
  { h:'Last hand-in', w:150, fmt:'dd MMM, HH:mm', note:'When they last handed in — even if an earlier one scored higher.' },
  { h:'Code', w:120, align:'center', group:true, note:'The completion code from their best hand-in.' },
  { h:'Flags', w:190, wrap:true, note:'Anything worth a second look.' },
  { h:'Per station', w:400, wrap:true, note:'Their score at each station, and how many checks it took there.' },
  { h:'School email', w:230, hide:true, note:'What ties this row to the student. Do not edit.' }
];
var LAB_EMAIL = 15;        /* the column that ties a row to a person */

/* ---- Signing in ----------------------------------------------------------
   The labs are public web pages: anyone in the world can open one, work through it and
   press Hand in. That is the point — but their work must not land in your spreadsheet.
   So a hand-in is kept only when the Google account that signed in is on your Students
   tab. Everyone else gets their completion code on screen and nothing is written down.

   To get a CLIENT_ID (about five minutes, free):
     console.cloud.google.com ▸ pick or make a project ▸ APIs & Services ▸ Credentials
     ▸ Create credentials ▸ OAuth client ID ▸ Web application
     Authorised JavaScript origins:  https://mompel226.github.io
     Create, then copy the Client ID (it ends .apps.googleusercontent.com) into BOTH
     places: here, and googleClientId in every lab's js/config.js.

   Leave it empty and nothing is recorded at all — the labs still work, and everyone gets
   a completion code to hand in by other means.
   -------------------------------------------------------------------------- */
var CLIENT_ID = '';

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
    .addToUi();
}

/* ============================================================
   1. Receiving a hand-in
   ============================================================ */
function doPost(e) {
  try {
    var d = JSON.parse(e.postData.contents);
    var lab = _labById(String(d.app || ''));
    if (!lab) return _text('unknown lab');

    /* Only this teacher's students are recorded. Anyone else in the world who works through
       a lab and presses Hand in gets their completion code and leaves no trace here at all —
       no row, no name, no email, nowhere. */
    if (!CLIENT_ID) return _text('not recorded: sign-in is not set up');
    var who = _whoIs(d.token);
    if (!who) return _text('not recorded: not signed in');
    var student = _studentOf(who.email);
    if (!student) return _text('not recorded: not on this class list');

    var score = Number(d.score) || 0, total = Number(d.total) || 0;

    /* the code was made in the page from what it showed, so it is checked against that */
    var genuine = (_code(lab.id, String(d.name || '').trim(), String(d.form || '').trim(),
                         score + '/' + total) === String(d.code || ''));
    var wrong = [];
    if (!genuine) wrong.push('code does not match');
    if (score > total) wrong.push('score above the total');
    if (total < 0 || total > 1000) wrong.push('impossible total');
    if (wrong.length) {
      _reject(lab, [new Date(), lab.id, student.name, student.cls, score, total, d.code || '',
                    wrong.join('; '), JSON.stringify(d).slice(0, 2000)]);
      return _text('rejected: ' + wrong.join('; '));
    }

    var flags = [];
    if (lab.questions && total !== lab.questions) flags.push('NOT ALL QUESTIONS');
    if (d.complete === false) flags.push('PROGRESS — not finished');

    /* Their row is already waiting, put there when the class was imported. A hand-in fills
       it in; a second hand-in updates it rather than adding another. The count and the date
       always move, and everything else is replaced only when this attempt beat the last one,
       so a worse re-run can never wipe out a better score.
       A whole class can press Hand in within the same few seconds, so the read-then-write is
       done one at a time. _rowFor only has to make a row for somebody who joined since. */
    var lock = LockService.getScriptLock();
    try { lock.waitLock(20000); } catch (e) { return _text('busy — please press Hand in again'); }
    try {
      var sh = _labSheet(lab);
      var r = _rowFor(sh, who.email, student);
      var best = Number(sh.getRange(r, 3).getValue());
      var beaten = !(best > 0) || score > best;
      var seen = Number(sh.getRange(r, 10).getValue()) || 0;

      sh.getRange(r, 1, 1, 2).setValues([[student.name, student.cls]]);
      sh.getRange(r, 10, 1, 2).setValues([[seen + 1, new Date()]]);
      if (beaten) {
        sh.getRange(r, 3, 1, 7).setValues([[
          score, total, total ? score / total : 0,
          d.complete === false ? 'progress' : 'complete',
          Number(d.checks) || '', Number(d.firstTime) || '', _since(d.from)
        ]]);
        sh.getRange(r, 12, 1, 3).setValues([[d.code || '', flags.join('; '), _stations(d.stations)]]);
      }
      SpreadsheetApp.flush();
      return _text(beaten ? 'recorded' : 'recorded (an earlier hand-in still scores higher)');
    } finally { lock.releaseLock(); }
  } catch (err) {
    return _text('error: ' + err);
  }
}

/* Junk, and anything that does not verify, lands here instead of in a lab's tab. */
/* Who is this? Google signed the token; we ask Google to check its own signature. The
   answer is cached briefly so two hand-ins in a row do not ask twice. Anything we cannot
   stand behind comes back null. */
function _whoIs(idToken) {
  if (!CLIENT_ID || !idToken) return null;
  var cache = CacheService.getScriptCache();
  var key = 'ID_' + Utilities.base64EncodeWebSafe(
              Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, idToken)).slice(0, 40);
  var hit = cache.get(key);
  if (hit) { try { return JSON.parse(hit); } catch (e) {} }

  var res;
  try {
    res = UrlFetchApp.fetch('https://oauth2.googleapis.com/tokeninfo?id_token=' +
                            encodeURIComponent(idToken), { muteHttpExceptions: true });
  } catch (e) { return null; }
  if (res.getResponseCode() !== 200) return null;

  var t;
  try { t = JSON.parse(res.getContentText()); } catch (e) { return null; }
  if (String(t.aud) !== CLIENT_ID) return null;               /* a token for somebody else's app */
  if (Number(t.exp) * 1000 < Date.now()) return null;         /* expired */
  if (String(t.email_verified) !== 'true') return null;

  var who = { email: String(t.email || '').toLowerCase(), name: String(t.name || '') };
  cache.put(key, JSON.stringify(who), 240);
  return who;
}

/* What the roster knows about them — and whether they are on it at all. */
function _studentOf(email) {
  if (!email) return null;
  var sh = _sheet(T_STUDENTS), last = sh.getLastRow();
  if (last < 2) return null;
  var EMAIL_COL = 3 + LABS.length + 2;
  var vals = sh.getRange(2, 1, last - 1, EMAIL_COL).getValues();
  for (var i = 0; i < vals.length; i++) {
    if (String(vals[i][EMAIL_COL - 1] || '').toLowerCase() === email) {
      return { name: String(vals[i][0] || ''), cls: String(vals[i][1] || '').toUpperCase() };
    }
  }
  return null;
}

function _reject(lab, row) {
  var ss = _ss(), sh = ss.getSheetByName(T_REJECTED);
  if (!sh) {
    sh = ss.insertSheet(T_REJECTED);
    sh.getRange(1, 1, 1, 9).setValues([['When', 'Lab', 'Name', 'Class', 'Score',
                                        'Out of', 'Code', 'Why it was refused', 'What was sent']]);
    _dress2(sh, [
      { h:'When', w:150, fmt:'dd MMM, HH:mm', note:'When it arrived.' },
      { h:'Lab', w:140, note:'Which lab it claimed to come from.' },
      { h:'Name', w:190, note:'The name it carried.' },
      { h:'Class', w:80, align:'center' },
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
   2. The endpoint — a lab checks it is alive; hand-ins arrive by POST
   ============================================================ */
function doGet() {
  return _text('Biology Labs endpoint is running.');
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
     every tab that should exist exists and the whole thing is dressed. Nothing else to
     press. */
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
  /* Their names go into every lab straight away, so each tab reads as a class list with the
     marks still to come, rather than filling up only as people hand in. */
  if (add.length || moved) LABS.forEach(function (l) { _seedLab(l); });
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
  if (!lab) throw new Error('Unknown lab: ' + labId);
  var sh = _ss().getSheetByName(lab.name);
  if (!sh || sh.getLastRow() < 2) throw new Error('Nothing in the ' + lab.name + ' tab yet.');

  /* Match on school email — the same thing the hand-in was recorded against — and fall
     back to the name only for anyone Classroom gives no email for. */
  var byEmail = {}, byName = {}, page = null;
  do {
    var r = Classroom.Courses.Students.list(courseId, { pageSize: 100, pageToken: page });
    (r.students || []).forEach(function (s) {
      var em = String((s.profile || {}).emailAddress || '').toLowerCase();
      if (em) byEmail[em] = s.userId;
      byName[_tidy(s.profile.name.fullName)] = s.userId;
    });
    page = r.nextPageToken;
  } while (page);

  var rows = sh.getRange(2, 1, sh.getLastRow() - 1, LAB_COLS.length).getValues();
  var done = 0, missing = [], waiting = 0;
  rows.forEach(function (row) {
    var score = row[2];
    if (score === '' || score === null) { waiting++; return; }   /* has not handed in yet */
    var name = String(row[0] || ''), email = String(row[LAB_EMAIL - 1] || '').toLowerCase();
    var uid = byEmail[email] || byName[_tidy(name)];
    if (!uid) { missing.push(name); return; }
    var subs = Classroom.Courses.CourseWork.StudentSubmissions.list(courseId, courseWorkId, { userId: uid });
    var sub = (subs.studentSubmissions || [])[0];
    if (!sub) { missing.push(name + ' (no submission)'); return; }
    Classroom.Courses.CourseWork.StudentSubmissions.patch(
      { assignedGrade: Number(score), draftGrade: Number(score) },
      courseId, courseWorkId, sub.id, { updateMask: 'assignedGrade,draftGrade' });
    done++;
  });
  var said = 'Graded ' + done + '. Still to hand in: ' + waiting +
             '. Not matched: ' + (missing.join(', ') || 'none');
  Logger.log(said);
  return said;
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
  _sheet(T_SETUP); _sheet(T_LABS); _sheet(T_STUDENTS);
  LABS.forEach(function (l) { _seedLab(l); });     /* every lab: a tab, and a row per student */
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
  _styleSetup(); _styleLabs(); _styleStudents();
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
   actually need looking at — a low score, a refused hand-in.
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
var URL_ROW = 12;
var BTN_ROW = { refresh: 18, restyle: 19 };

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
    ['Labs', 'one row per lab: how many questions it has, and how many hand-ins it has had.'],
    ['Digestion, Circulation, …', 'every hand-in for that lab. A tab appears the first time that lab is used.'],
    ['Rejected', 'a hand-in from one of your students whose numbers did not add up.'],
    ['', ''],
    ['Only your students land here', 'a hand-in is kept when the Google account that signed in is on the Students tab. The labs are public, so anyone in the world may use them — their work is not recorded anywhere.'],
    ['', ''],
    ['Reading a heading', 'dark green = filled in for you.   ✎ amber = yours to change.   Hover any heading to see what it is for.'],
    ['', ''],
    ['Web app URL', url],
    ['', ''],
    ['Buttons', 'tick one — it runs, then unticks itself'],
    ['', ''],
    ['Import students from Classroom', 'on the 🧪 Biology Labs menu (it opens a window, so it cannot be a checkbox)'],
    ['', ''],
    ["Refresh everyone's progress", ''],
    ['Tidy up — rebuild anything missing, re-apply the formatting', ''],
    ['', ''],
    ['If something looks wrong', '🧪 Biology Labs ▸ Check the set-up'],
    ['After editing the script', 'Deploy ▸ Manage deployments ▸ pencil ▸ Version: New version ▸ Deploy']
  ];
  sh.getRange(1, 1, lines.length, 2).setValues(lines);
  sh.getRange('A1').setFontSize(17).setFontWeight('bold').setFontColor(INK);
  sh.getRange('B1').setFontColor('#6B7B6F');
  sh.getRange(3, 1, lines.length - 2, 1).setFontWeight('bold').setFontColor(INK);
  sh.getRange(14, 1).setFontSize(13);
  sh.getRange(1, 1, lines.length, 2).setVerticalAlignment('middle').setWrap(true);
  sh.setColumnWidth(1, 260); sh.setColumnWidth(2, 720); sh.setColumnWidth(3, 60);
  for (var r = 1; r <= lines.length; r++) sh.setRowHeight(r, r === 1 ? 34 : 24);

  /* the buttons */
  Object.keys(BTN_ROW).forEach(function (k) {
    var r = BTN_ROW[k];
    sh.getRange(r, 3).insertCheckboxes().setValue(false).setHorizontalAlignment('center');
    sh.getRange(r, 1, 1, 3).setBackground('#EFF5F0');
  });
  sh.getRange(BTN_ROW.refresh, 1, 2, 1).setFontColor(INK);
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
      note:'Which class they are in. Used by the filter, and shown on every hand-in.' }
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
/* The dashboard: every student, every lab, best score so far. Read straight out of each
   lab's tab, which now holds one row per student — so a name is matched by email, not by
   how it was typed. */
function refreshDashboard() {
  var sh = _sheet(T_STUDENTS);
  var rows = Math.max(0, sh.getLastRow() - 1);
  if (!rows) { _styleStudents(); return; }

  var EMAIL_COL = 3 + LABS.length + 2;
  var emails = sh.getRange(2, EMAIL_COL, rows, 1).getValues();
  var rowOf = {};
  emails.forEach(function (r, i) { var e = String(r[0] || '').toLowerCase(); if (e) rowOf[e] = i; });

  var L = LABS.length, first = 3;
  var grid = emails.map(function () { var a = []; for (var i = 0; i < L + 2; i++) a.push(''); return a; });

  LABS.forEach(function (lab, c) {
    var tab = _ss().getSheetByName(lab.name);
    if (!tab || tab.getLastRow() < 2) return;
    var n = tab.getLastRow() - 1;
    var pct = tab.getRange(2, 5, n, 1).getValues();
    var mail = tab.getRange(2, LAB_EMAIL, n, 1).getValues();
    for (var i = 0; i < n; i++) {
      var e = String(mail[i][0] || '').toLowerCase();
      if (!e || !(e in rowOf) || pct[i][0] === '') continue;
      grid[rowOf[e]][c] = Number(pct[i][0]) || 0;
    }
  });

  grid.forEach(function (row) {
    var done = 0, sum = 0;
    for (var c = 0; c < L; c++) if (row[c] !== '') { done++; sum += row[c]; }
    row[L] = done || '';
    row[L + 1] = done ? sum / done : '';
  });

  sh.getRange(2, first, rows, L + 2).setValues(grid);
  _styleStudents();
  SpreadsheetApp.getActive().toast('Progress updated for ' + rows + ' students.', 'Biology Labs', 5);
}


function _styleLabs() {
  var sh = _sheet(T_LABS);
  _dress2(sh, [
    { h:'Lab id', w:170, note:'What the lab\'s own page sends. Do not change it — it has to match js/config.js in that lab.' },
    { h:'Lab', w:130, note:'The name of this lab\'s tab in this spreadsheet.' },
    { h:'Topic', w:200, note:'Which IGCSE topic it covers.' },
    { h:'Questions', w:100, align:'center', fmt:'0', edit:true,
      note:'How many questions that lab has. Used to flag a hand-in that does not cover them all. Fill it in when a lab is built.' },
    { h:'Hand-ins', w:100, align:'center', fmt:'0', note:'How many hand-ins that lab has had. Counted for you.' }
  ], { freezeCols: 2, tab:'#6E8F7C' });
}

function _styleLab(sh) {
  var rows = _dress2(sh, LAB_COLS, { freezeCols: 2, tab:'#3D7A54' });
  if (!rows) return;
  sh.setConditionalFormatRules([
    SpreadsheetApp.newConditionalFormatRule()
      .setGradientMinpointWithValue(LOW, SpreadsheetApp.InterpolationType.NUMBER, '0')
      .setGradientMidpointWithValue(MID, SpreadsheetApp.InterpolationType.NUMBER, '0.6')
      .setGradientMaxpointWithValue(HIGH, SpreadsheetApp.InterpolationType.NUMBER, '1')
      .setRanges([sh.getRange(2, 5, rows, 1)]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('progress')
      .setBackground(MID).setFontColor('#7A5B00')
      .setRanges([sh.getRange(2, 6, rows, 1)]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('complete')
      .setBackground(HIGH).setFontColor('#265C33')
      .setRanges([sh.getRange(2, 6, rows, 1)]).build(),
    /* nobody has handed in yet: the row is a name waiting, not a bad mark */
    SpreadsheetApp.newConditionalFormatRule().whenCellEmpty()
      .setBackground('#FAFAF7')
      .setRanges([sh.getRange(2, 3, rows, 1)]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenNumberLessThan(0.4)
      .setFontColor('#A3342A').setBold(true)
      .setRanges([sh.getRange(2, 5, rows, 1)]).build()
  ]);
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
    sh.getRange(1, 1, 1, 5).setValues([['Lab id', 'Lab', 'Topic', 'Questions', 'Hand-ins']]);
    var rows = LABS.map(function (l, i) {
      return [l.id, l.name, l.topic, l.questions || '',
              '=IFERROR(COUNTA(INDIRECT("\'"&B' + (i + 2) + '&"\'!B2:B")),0)'];
    });
    sh.getRange(2, 1, rows.length, 5).setValues(rows);
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
/* A lab's tab is the class list for that lab: every student has a row from the moment
   they are imported, empty until they hand in. So you can see at a glance who has done it
   and who has not, rather than waiting for rows to appear. */
function _labSheet(lab) {
  var ss = _ss(), sh = ss.getSheetByName(lab.name);
  if (!sh) {
    sh = ss.insertSheet(lab.name);
    sh.getRange(1, 1, 1, LAB_COLS.length).setValues([LAB_COLS.map(function (c) { return c.h; })]);
  }
  return sh;
}

/* Give every student on the roster a row here, and leave the ones already present alone.
   Safe to run as often as you like — it is keyed on the school email. */
function _seedLab(lab) {
  var sh = _labSheet(lab);
  var roster = _sheet(T_STUDENTS);
  if (roster.getLastRow() < 2) return sh;
  var EMAIL_COL = 3 + LABS.length + 2;
  var people = roster.getRange(2, 1, roster.getLastRow() - 1, EMAIL_COL).getValues();

  var have = {};
  if (sh.getLastRow() > 1) {
    sh.getRange(2, LAB_EMAIL, sh.getLastRow() - 1, 1).getValues()
      .forEach(function (r, i) { var e = String(r[0] || '').toLowerCase(); if (e) have[e] = i + 2; });
  }
  var add = [];
  people.forEach(function (p) {
    var email = String(p[EMAIL_COL - 1] || '').toLowerCase();
    if (!email) return;
    if (have[email]) {                             /* already here: keep the name and class true to the roster */
      var r = have[email], cur = sh.getRange(r, 1, 1, 2).getValues()[0];
      if (cur[0] !== p[0] || cur[1] !== p[1]) sh.getRange(r, 1, 1, 2).setValues([[p[0], p[1]]]);
      return;
    }
    var row = new Array(LAB_COLS.length).fill('');
    row[0] = p[0];                 /* name  */
    row[1] = p[1];                 /* class */
    row[LAB_EMAIL - 1] = email;
    add.push(row);
  });
  if (add.length) sh.getRange(sh.getLastRow() + 1, 1, add.length, LAB_COLS.length).setValues(add);
  return sh;
}
/** "mouth 9/9 in 14 · stomach 8/9 in 21" — readable in one cell. */
/* Where this student's row is, adding one if they arrived after the last import. */
function _rowFor(sh, email, student) {
  var last = sh.getLastRow();
  if (last > 1) {
    var col = sh.getRange(2, LAB_EMAIL, last - 1, 1).getValues();
    for (var i = 0; i < col.length; i++) {
      if (String(col[i][0] || '').toLowerCase() === email) return i + 2;
    }
  }
  var row = new Array(LAB_COLS.length).fill('');
  row[0] = student.name; row[1] = student.cls; row[LAB_EMAIL - 1] = email;
  sh.getRange(last + 1, 1, 1, LAB_COLS.length).setValues([row]);
  return last + 1;
}

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
