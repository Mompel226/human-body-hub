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
global.CacheService = { getScriptCache: () => ({ put: () => {}, get: () => null }) };
global.ContentService = { createTextOutput: t => ({ setMimeType: () => t }), MimeType: { TEXT: 1, JSON: 2, JAVASCRIPT: 3 } };
global.HtmlService = { createHtmlOutputFromFile: () => ({ setWidth: () => ({ setHeight: () => ({}) }) }) };
global.ScriptApp = { getProjectTriggers: () => [], newTrigger: () => ({ forSpreadsheet: () => ({ onEdit: () => ({ create: () => {} }) }) }) };
global.Logger = { log: m => log('log: ' + m) };
global.Classroom = undefined;                    /* as it is before the service is added */

eval(fs.readFileSync(process.argv[2] || 'apps-script/Code.gs', 'utf8'));

function run(label, fn) {
  try { fn(); console.log('  ok   ' + label); return true; }
  catch (e) { console.log('  FAIL ' + label + '  →  ' + e.message); return false; }
}
let ok = true;
console.log('— with an empty spreadsheet —');
ok &= run('onOpen', () => onOpen());
ok &= run('setup / Tidy up', () => setup());
ok &= run('refreshDashboard', () => refreshDashboard());
ok &= run('checkSetup (Classroom off)', () => checkSetup());
ok &= run('doGet gate', () => doGet({ parameter: { q: 'gate', app: 'digestion-lab', cls: '9A' } }));
ok &= run('doGet plain', () => doGet({}));
ok &= run('button: refresh', () => onButtonTicked({ range: ss.getSheetByName('Setup').getRange(BTN_ROW.refresh, 3) }));
ok &= run('button: close mastery', () => onButtonTicked({ range: ss.getSheetByName('Setup').getRange(BTN_ROW.close, 3) }));

console.log('— with students and a hand-in —');
ok &= run('import two students', () => _upsertStudents(
  [{ name: 'Ana Lee', email: 'ana@x.kr', userId: 'u1' }, { name: 'Bo Kim', email: 'bo@x.kr', userId: 'u2' }], '9A', 'Y9 Biology', 'c1'));
ok &= run('a hand-in arrives', () => doPost({ postData: { contents: JSON.stringify({
  app: 'digestion-lab', name: 'Ana Lee', form: '9A', mode: 'mastery', score: 113, total: 113,
  complete: true, checks: 214, firstTime: 71, code: _code('digestion-lab', 'Ana Lee', '9A', '113/113'),
  from: new Date(Date.now() - 3 * 864e5).toISOString(), stations: { mouth: '8/8 in 11' } }) } }));
ok &= run('a forged hand-in is rejected', () => doPost({ postData: { contents: JSON.stringify({
  app: 'digestion-lab', name: 'Nobody', form: '9A', mode: 'mastery', score: 999, total: 113, code: 'DL-XXXX-YYYY' }) } }));
ok &= run('setup again (idempotent)', () => setup());
ok &= run('refreshDashboard with data', () => refreshDashboard());
ok &= run('gate for a class', () => doGet({ parameter: { q: 'gate', app: 'digestion-lab', cls: '9A', callback: 'cb' } }));

console.log('\ntabs built: ' + ss.sheets.map(s => s.name).join(', '));
const st = ss.getSheetByName('Students');
console.log('Students: ' + (st.getLastRow() - 1) + ' rows × ' + st.getLastColumn() + ' cols');
const dg = ss.getSheetByName('Digestion');
console.log('Digestion: ' + (dg ? dg.getLastRow() - 1 : 0) + ' hand-in(s)');
const rj = ss.getSheetByName('Rejected');
console.log('Rejected:  ' + (rj ? rj.getLastRow() - 1 : 0) + ' row(s)');
process.exit(ok ? 0 : 1);
