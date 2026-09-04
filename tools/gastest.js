/* A fake Google Sheets, just real enough to run the script and catch what would throw.
   It does not check that the sheet LOOKS right — it checks that every call exists, every
   name resolves, and every range is in bounds. That is what has been breaking. */
const fs = require('fs');
const calls = [];
function log(m) { calls.push(m); }

class Range {
  constructor(sheet, r, c, nr, nc) {
    Object.assign(this, { sheet, r, c, nr: nr || 1, nc: nc || 1 });
    if (r < 1 || c < 1) throw new Error(`getRange out of bounds: row ${r} col ${c} on "${sheet.name}"`);
  }
  setValues(v) {
    if (!Array.isArray(v) || v.length !== this.nr) throw new Error(`setValues: expected ${this.nr} rows, got ${v && v.length} on "${this.sheet.name}"`);
    if (v[0].length !== this.nc) throw new Error(`setValues: expected ${this.nc} cols, got ${v[0].length} on "${this.sheet.name}" at r${this.r}c${this.c}`);
    for (let i = 0; i < this.nr; i++) for (let j = 0; j < this.nc; j++) this.sheet.put(this.r + i, this.c + j, v[i][j]);
    return this;
  }
  setValue(x) { for (let i = 0; i < this.nr; i++) for (let j = 0; j < this.nc; j++) this.sheet.put(this.r + i, this.c + j, x); return this; }
  getValues() {
    const out = [];
    for (let i = 0; i < this.nr; i++) { const row = []; for (let j = 0; j < this.nc; j++) row.push(this.sheet.get(this.r + i, this.c + j)); out.push(row); }
    return out;
  }
  getValue() { return this.sheet.get(this.r, this.c); }
  isBlank() { return this.getValues().every(r => r.every(v => v === '' || v == null)); }
  getRow() { return this.r; } getColumn() { return this.c; }
  getSheet() { return this.sheet; }
  setNote(t) { if (typeof t !== 'string') throw new Error('setNote wants a string'); return this; }
  setDataValidation() { return this; }
  insertCheckboxes() { return this; }
  createFilter() { if (this.sheet._filter) throw new Error(`two filters on "${this.sheet.name}"`); this.sheet._filter = true; return {}; }
  applyRowBanding() { this.sheet._bandings.push({});
    const b = { remove: () => {} };
    for (const m of ['setHeaderRowColor','setFirstRowColor','setSecondRowColor','setFooterRowColor']) b[m] = () => b;
    return b; }
  clearDataValidations() { return this; }
}
for (const m of ['setFontWeight','setFontColor','setBackground','setVerticalAlignment','setHorizontalAlignment',
                 'setWrap','setNumberFormat','setFontSize','setFontStyle','setBorder','clearFormat',
                 'setFontFamily','setHorizontalAlignments','merge','clear'])
  Range.prototype[m] = function () { return this; };

class Sheet {
  constructor(ss, name) { this.ss = ss; this.name = name; this.cells = new Map(); this.maxR = 1000; this.maxC = 26; this._bandings = []; this._filter = false; this._rules = []; }
  key(r, c) { return r + ':' + c; }
  put(r, c, v) {
    if (r > this.maxR || c > this.maxC) throw new Error(`write outside the sheet "${this.name}": r${r} c${c} (max ${this.maxR}x${this.maxC})`);
    this.cells.set(this.key(r, c), v);
  }
  get(r, c) { const v = this.cells.get(this.key(r, c)); return v === undefined ? '' : v; }
  getName() { return this.name; }
  getRange(a, b, c, d) {
    if (typeof a === 'string') { const m = /^([A-Z]+)(\d+)(?::([A-Z]+)(\d+))?$/.exec(a); if (!m) throw new Error('bad A1: ' + a);
      const col = s => s.split('').reduce((n, ch) => n * 26 + ch.charCodeAt(0) - 64, 0);
      const r1 = +m[2], c1 = col(m[1]); const r2 = m[4] ? +m[4] : r1, c2 = m[3] ? col(m[3]) : c1;
      return new Range(this, r1, c1, r2 - r1 + 1, c2 - c1 + 1); }
    return new Range(this, a, b, c, d);
  }
  getDataRange() { return new Range(this, 1, 1, Math.max(1, this.getLastRow()), Math.max(1, this.getLastColumn())); }
  getLastRow() { let m = 0; for (const k of this.cells.keys()) m = Math.max(m, +k.split(':')[0]); return m; }
  getLastColumn() { let m = 0; for (const k of this.cells.keys()) m = Math.max(m, +k.split(':')[1]); return m; }
  getMaxRows() { return this.maxR; } getMaxColumns() { return this.maxC; }
  insertColumnsAfter(a, n) { this.maxC += n; return this; }
  deleteColumns(at, n) { if (at + n - 1 > this.maxC) throw new Error(`deleteColumns past the end on "${this.name}"`); this.maxC -= n; return this; }
  deleteRows(at, n) { if (at + n - 1 > this.maxR) throw new Error(`deleteRows past the end on "${this.name}"`); this.maxR -= n; return this; }
  appendRow(v) { const r = this.getLastRow() + 1; if (r > this.maxR) this.maxR = r; v.forEach((x, i) => this.put(r, i + 1, x)); return this; }
  getBandings() { return this._bandings.map(() => ({ remove: () => {} })); }
  getFilter() { return this._filter ? { remove: () => { this._filter = false; } } : null; }
  setConditionalFormatRules(rs) { if (!Array.isArray(rs)) throw new Error('rules must be an array'); this._rules = rs; return this; }
  hideColumns(c, n) { if (c > this.maxC) throw new Error(`hideColumns past the end on "${this.name}"`); return this; }
  clear() { this.cells.clear(); return this; }
}
for (const m of ['setColumnWidth','setRowHeight','setFrozenRows','setFrozenColumns','setHiddenGridlines','activate','setTabColor'])
  Sheet.prototype[m] = function () { return this; };

class SS {
  constructor() { this.sheets = []; }
  getName() { return 'Test sheet'; }
  getId() { return 'FAKE_SHEET_ID'; }
  getSheetByName(n) { return this.sheets.find(s => s.name === n) || null; }
  insertSheet(n) { const s = new Sheet(this, n); this.sheets.push(s); return s; }
  deleteSheet(s) { this.sheets = this.sheets.filter(x => x !== s); }
  toast() {}
}
const ss = new SS();

global.SpreadsheetApp = {
  flush: () => {},
  openById: () => ss, getActive: () => ss, getActiveSpreadsheet: () => ss,
  getUi: () => ({ createMenu: () => { const m = { addItem: () => m, addSeparator: () => m, addToUi: () => {} }; return m; },
                  alert: (a, b) => log('alert: ' + String(b).slice(0, 60)), ButtonSet: { OK: 1 } }),
  newDataValidation: () => { const d = { requireValueInList: () => d, setAllowInvalid: () => d, setHelpText: () => d, build: () => ({}) }; return d; },
  newConditionalFormatRule: () => { const r = new Proxy({}, { get: (t, k) => k === 'build' ? () => ({}) : () => r }); return r; },
  BandingTheme: { LIGHT_GREY: 'grey' }, InterpolationType: { NUMBER: 'n' },
  BorderStyle: { SOLID: 'solid', SOLID_THICK: 'thick', DOTTED: 'dotted' }
};
const props = new Map();
global.PropertiesService = { getScriptProperties: () => ({ getProperty: k => props.get(k) || null, setProperty: (k, v) => props.set(k, v) }) };
global.CacheService = { getScriptCache: () => ({ put: () => {}, get: () => null }) };  /* never a hit, so each call re-verifies */
global.ContentService = { createTextOutput: t => ({ setMimeType: () => t }), MimeType: { TEXT: 1, JSON: 2, JAVASCRIPT: 3 } };
global.HtmlService = { createHtmlOutputFromFile: () => ({ setWidth: () => ({ setHeight: () => ({}) }) }) };
global.ScriptApp = { getProjectTriggers: () => [], newTrigger: () => ({ forSpreadsheet: () => ({ onEdit: () => ({ create: () => {} }) }) }) };
global.LockService = { getScriptLock: () => ({ waitLock: () => true, releaseLock: () => {} }) };
global.Logger = { log: m => log('log: ' + m) };
global.Classroom = undefined;                    /* as it is before the service is added */
global.TOKEN_EMAIL = 'ana@x.kr';
global.UrlFetchApp = { fetch: () => ({ getResponseCode: () => 200,
  getContentText: () => JSON.stringify({ aud: 'CID', exp: Math.floor(Date.now()/1000)+3600,
                                         email_verified: 'true', email: TOKEN_EMAIL, name: 'A Person' }) }) };
global.Utilities = { base64EncodeWebSafe: b => 'b64' + String(b).length,
                     computeDigest: (a, t) => String(t), DigestAlgorithm: { SHA_256: 1 } };

eval(fs.readFileSync(process.argv[2] || 'apps-script/Code.gs', 'utf8'));

function run(label, fn) {
  try { fn(); console.log('  ok   ' + label); return true; }
  catch (e) { console.log('  FAIL ' + label + '  →  ' + e.message); return false; }
}
let ok = true;
/* Everything that reaches a function by NAME rather than by calling it: the menu items,
   and every google.script.run call in the dialog. Apps Script only finds out these are
   wrong when a human clicks — "Script function not found" — so they are checked here. */
console.log('— names reached by string —');
const SRC = fs.readFileSync(process.argv[2] || 'apps-script/Code.gs', 'utf8');
const HTML = fs.readFileSync('apps-script/ClassroomImport.html', 'utf8');
const defined = n => new RegExp('^function\\s+' + n + '\\s*\\(', 'm').test(SRC);

ok &= run('every menu item points at a function that exists', () => {
  const named = [...SRC.matchAll(/\.addItem\(\s*'(?:[^'\\]|\\.)*'\s*,\s*'([^']+)'/g)].map(m => m[1]);
  if (!named.length) throw new Error('no menu items found — has the menu moved?');
  const missing = named.filter(n => !defined(n));
  if (missing.length) throw new Error('the menu names nothing: ' + missing.join(', '));
});
ok &= run('every google.script.run call in the window exists', () => {
  if (!/google\.script\.run/.test(HTML)) throw new Error('the window calls nothing at all — has it been gutted?');
  /* the chain is written one call per line, so the server call is a line-leading .name( */
  const named = [...new Set([...HTML.matchAll(/^\s*\.\s*([A-Za-z_$][\w$]*)\s*\(/gm)].map(m => m[1]))]
    .filter(n => !['withSuccessHandler', 'withFailureHandler', 'withUserObject'].includes(n));
  if (!named.length) throw new Error('found no server calls to check');
  const missing = named.filter(n => !defined(n));
  if (missing.length) throw new Error('the window calls nothing named: ' + missing.join(', '));
});
ok &= run('the window file the script opens is really there', () => {
  const m = SRC.match(/createHtmlOutputFromFile\('([^']+)'\)/);
  if (!m) throw new Error('nothing opens the import window at all');
  if (!fs.existsSync('apps-script/' + m[1] + '.html')) throw new Error('no such file: ' + m[1] + '.html');
});

console.log('— with an empty spreadsheet —');
ok &= run('onOpen', () => onOpen());
ok &= run('setup / Tidy up', () => setup());
ok &= run('refreshDashboard', () => refreshDashboard());
ok &= run('checkSetup (Classroom off)', () => checkSetup());
ok &= run('doGet', () => doGet({}));
ok &= run('button: refresh', () => onButtonTicked({ range: ss.getSheetByName('Setup').getRange(BTN_ROW.refresh, 3) }));
ok &= run('button: tidy up', () => onButtonTicked({ range: ss.getSheetByName('Setup').getRange(BTN_ROW.restyle, 3) }));

console.log('— importing a class —');
ok &= run('import two students', () => _upsertStudents(
  [{ name: 'Ana Lee', email: 'ana@x.kr', userId: 'u1' }, { name: 'Bo Kim', email: 'bo@x.kr', userId: 'u2' }], '9A', 'Y9 Biology', 'c1'));
ok &= run('every lab has a tab', () => {
  LABS.forEach(l => { if (!ss.getSheetByName(l.name)) throw new Error('no tab for ' + l.name); });
});
ok &= run('every student is waiting in every lab, with no marks', () => {
  LABS.forEach(l => {
    const sh = ss.getSheetByName(l.name);
    if (sh.getLastRow() !== 3) throw new Error(l.name + ' has ' + (sh.getLastRow() - 1) + ' rows, wanted 2');
    const v = sh.getRange(2, 1, 2, LAB_COLS.length).getValues();
    if (v[0][0] !== 'Ana Lee' || v[0][1] !== '9A') throw new Error(l.name + ': the name and class are not there');
    if (v[0][LAB_EMAIL - 1] !== 'ana@x.kr') throw new Error(l.name + ': no email to key on');
    if (v[0][2] !== '' || v[0][4] !== '') throw new Error(l.name + ': a mark appeared before anyone handed in');
  });
});
ok &= run('importing twice does not double anybody up', () => {
  _upsertStudents([{ name: 'Ana Lee', email: 'ana@x.kr', userId: 'u1' }], '9A', 'Y9 Biology', 'c1');
  const sh = ss.getSheetByName('Digestion');
  if (sh.getLastRow() !== 3) throw new Error('now ' + (sh.getLastRow() - 1) + ' rows');
});

console.log('— handing in —');
CLIENT_ID = 'CID';
const hand = (o) => String(doPost({ postData: { contents: JSON.stringify(Object.assign({
  app: 'digestion-lab', name: 'Ana Lee', form: '9A', token: 'tok', complete: true,
  from: new Date(Date.now() - 3 * 864e5).toISOString(), stations: { mouth: '8/8 in 11' } }, o)) } }));
const anaRow = () => ss.getSheetByName('Digestion').getRange(2, 1, 1, LAB_COLS.length).getValues()[0];

ok &= run('a hand-in fills the row that was waiting', () => {
  const out = hand({ score: 90, total: 113, checks: 214, firstTime: 71, code: _code('digestion-lab', 'Ana Lee', '9A', '90/113') });
  if (!/^recorded/.test(out)) throw new Error(out);
  const sh = ss.getSheetByName('Digestion');
  if (sh.getLastRow() !== 3) throw new Error('a row was added instead of filled');
  const r = anaRow();
  if (r[2] !== 90 || r[3] !== 113) throw new Error('score not written: ' + r.slice(2, 5));
  if (Math.abs(r[4] - 90 / 113) > 1e-9) throw new Error('percentage wrong: ' + r[4]);
  if (r[5] !== 'complete') throw new Error('finished flag wrong: ' + r[5]);
  if (r[9] !== 1) throw new Error('hand-ins should read 1, reads ' + r[9]);
  if (!(r[10] instanceof Date)) throw new Error('no date on the hand-in');
});
ok &= run('nobody else was touched', () => {
  const bo = ss.getSheetByName('Digestion').getRange(3, 1, 1, LAB_COLS.length).getValues()[0];
  if (bo[0] !== 'Bo Kim' || bo[2] !== '') throw new Error('Bo Kim was written over');
});
ok &= run('a worse second go keeps the better score but still counts', () => {
  const was = anaRow()[10];
  const out = hand({ score: 40, total: 113, checks: 300, firstTime: 20, code: _code('digestion-lab', 'Ana Lee', '9A', '40/113') });
  const r = anaRow();
  if (r[2] !== 90) throw new Error('a worse run overwrote the best score: ' + r[2]);
  if (r[6] !== 214) throw new Error('the rest of the worse run leaked in');
  if (r[9] !== 2) throw new Error('hand-ins should read 2, reads ' + r[9]);
  if (!(r[10] >= was)) throw new Error('the date did not move');
  if (!/higher/.test(out)) throw new Error('should say an earlier one still scores higher: ' + out);
});
ok &= run('a better go replaces it', () => {
  hand({ score: 113, total: 113, checks: 118, firstTime: 99, code: _code('digestion-lab', 'Ana Lee', '9A', '113/113') });
  const r = anaRow();
  if (r[2] !== 113 || r[6] !== 118 || r[7] !== 99) throw new Error('the better run was not kept: ' + r.slice(2, 8));
  if (r[9] !== 3) throw new Error('hand-ins should read 3, reads ' + r[9]);
});
ok &= run('handing in part-way through says so', () => {
  TOKEN_EMAIL = 'bo@x.kr';
  hand({ name: 'Bo Kim', score: 20, total: 40, complete: false, code: _code('digestion-lab', 'Bo Kim', '9A', '20/40') });
  TOKEN_EMAIL = 'ana@x.kr';
  const bo = ss.getSheetByName('Digestion').getRange(3, 1, 1, LAB_COLS.length).getValues()[0];
  if (bo[5] !== 'progress') throw new Error('not marked as in progress: ' + bo[5]);
  if (!/NOT ALL QUESTIONS|PROGRESS/.test(bo[12])) throw new Error('no flag raised: ' + bo[12]);
});
ok &= run('a student who joined after the import gets a row', () => {
  _upsertStudents([{ name: 'Chae Won', email: 'chae@x.kr', userId: 'u3' }], '9A', 'Y9 Biology', 'c1');
  TOKEN_EMAIL = 'chae@x.kr';
  hand({ name: 'Chae Won', score: 50, total: 113, code: _code('digestion-lab', 'Chae Won', '9A', '50/113') });
  TOKEN_EMAIL = 'ana@x.kr';
  const sh = ss.getSheetByName('Digestion');
  if (sh.getLastRow() !== 4) throw new Error('rows: ' + (sh.getLastRow() - 1));
  if (sh.getRange(4, 1).getValue() !== 'Chae Won') throw new Error('not the new student');
});

console.log('— who is turned away —');
ok &= run('somebody not on the roster leaves no trace', () => {
  TOKEN_EMAIL = 'stranger@elsewhere.com';
  const before = ss.getSheetByName('Digestion').getLastRow();
  const rejBefore = ss.getSheetByName('Rejected') ? ss.getSheetByName('Rejected').getLastRow() : 0;
  const out = hand({ name: 'A Stranger', score: 113, total: 113, code: _code('digestion-lab', 'A Stranger', '9A', '113/113') });
  TOKEN_EMAIL = 'ana@x.kr';
  if (!/not on this class list/.test(out)) throw new Error('should have been turned away: ' + out);
  if (ss.getSheetByName('Digestion').getLastRow() !== before) throw new Error('a stranger was recorded');
  const rej = ss.getSheetByName('Rejected');
  if (rej && rej.getLastRow() !== rejBefore) throw new Error('a stranger left a trace in Rejected');
  const all = ss.getSheetByName('Digestion').getRange(1, 1, before, LAB_COLS.length).getValues();
  if (JSON.stringify(all).indexOf('stranger') >= 0) throw new Error('the stranger is written somewhere');
});
ok &= run('an unsigned hand-in leaves no trace', () => {
  const before = ss.getSheetByName('Digestion').getLastRow();
  const out = String(doPost({ postData: { contents: JSON.stringify({ app: 'digestion-lab', name: 'X', score: 1, total: 113 }) } }));
  if (!/not signed in/.test(out)) throw new Error(out);
  if (ss.getSheetByName('Digestion').getLastRow() !== before) throw new Error('recorded anyway');
});
ok &= run('a student with a broken code is quarantined, not marked', () => {
  const rej = ss.getSheetByName('Rejected') ? ss.getSheetByName('Rejected').getLastRow() : 0;
  const best = anaRow()[2];
  hand({ score: 999, total: 113, code: 'DL-XX-YY' });
  if (ss.getSheetByName('Rejected').getLastRow() <= rej) throw new Error('not quarantined');
  if (anaRow()[2] !== best) throw new Error('a rejected hand-in still changed the mark');
});
ok &= run('a hand-in for a lab that does not exist is ignored', () => {
  const out = String(doPost({ postData: { contents: JSON.stringify({ app: 'not-a-lab', score: 1, total: 1, token: 'tok' }) } }));
  if (!/unknown lab/.test(out)) throw new Error(out);
});

console.log('— and afterwards —');
ok &= run('the dashboard shows the marks', () => {
  refreshDashboard();
  const sh = ss.getSheetByName('Students');
  const row = sh.getRange(2, 1, 1, 3 + LABS.length + 2).getValues()[0];
  if (row[0] !== 'Ana Lee') throw new Error('wrong student first');
  if (Math.abs(row[2] - 1) > 1e-9) throw new Error("Ana's digestion mark is " + row[2]);
  if (row[3] !== '') throw new Error('a lab nobody has done shows a mark');
  if (row[2 + LABS.length] !== 1) throw new Error('labs-done count is ' + row[2 + LABS.length]);
});
ok &= run('tidy up leaves every mark alone', () => {
  const before = JSON.stringify(ss.getSheetByName('Digestion').getRange(1, 1, 4, LAB_COLS.length).getValues());
  setup();
  const after = JSON.stringify(ss.getSheetByName('Digestion').getRange(1, 1, 4, LAB_COLS.length).getValues());
  if (before !== after) throw new Error('Tidy up changed the data');
});
ok &= run('refreshDashboard twice running is the same', () => {
  refreshDashboard();
  const a = JSON.stringify(ss.getSheetByName('Students').getRange(2, 1, 3, 3 + LABS.length + 2).getValues());
  refreshDashboard();
  const b = JSON.stringify(ss.getSheetByName('Students').getRange(2, 1, 3, 3 + LABS.length + 2).getValues());
  if (a !== b) throw new Error('it drifts each time it runs');
});

console.log('\ntabs built: ' + ss.sheets.map(s => s.name).join(', '));
const st = ss.getSheetByName('Students');
console.log('Students: ' + (st.getLastRow() - 1) + ' rows × ' + st.getLastColumn() + ' cols');
const dg = ss.getSheetByName('Digestion');
const filled = dg ? dg.getRange(2, 3, dg.getLastRow() - 1, 1).getValues().filter(r => r[0] !== '').length : 0;
console.log('Digestion: ' + (dg ? dg.getLastRow() - 1 : 0) + ' student(s), ' + filled + ' handed in');
const rj = ss.getSheetByName('Rejected');
console.log('Rejected:  ' + (rj ? rj.getLastRow() - 1 : 0) + ' row(s)');
process.exit(ok ? 0 : 1);
