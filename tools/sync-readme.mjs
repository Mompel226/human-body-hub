/* ============================================================
   sync-readme.mjs — keeps the copy-paste blocks in README.md identical to the
   real files in apps-script/.

     node tools/sync-readme.mjs          write the blocks, report what changed
     node tools/sync-readme.mjs --check  change nothing, exit 1 if they differ

   The README is how the spreadsheet is installed: you copy those two blocks
   into the Apps Script editor. A block that has drifted from the file installs
   a script that has never been run against the harness — which is how a menu
   ends up naming a function that is not there.

   Each block is found by the <summary> line above it, never by line number.
   ============================================================ */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const README = resolve(REPO, 'README.md');
const check = process.argv.includes('--check');

const BLOCKS = [
  { file: 'apps-script/Code.gs',              fence: 'javascript', marker: '<b>Code.gs</b>' },
  { file: 'apps-script/ClassroomImport.html', fence: 'html',       marker: '<b>ClassroomImport.html</b>' }
];

let lines = readFileSync(README, 'utf8').split('\n');
let changed = [], stale = [];

for (const b of BLOCKS) {
  const at = lines.findIndex(l => l.includes(b.marker));
  if (at < 0) { console.error('✗  no <summary> in the README carrying ' + b.marker); process.exit(2); }
  const open = lines.findIndex((l, i) => i > at && l.trim() === '```' + b.fence);
  if (open < 0) { console.error('✗  no ```' + b.fence + ' block under ' + b.marker); process.exit(2); }
  const close = lines.findIndex((l, i) => i > open && l.trim() === '```');
  if (close < 0) { console.error('✗  unterminated block under ' + b.marker); process.exit(2); }

  const want = readFileSync(resolve(REPO, b.file), 'utf8').replace(/\n+$/, '').split('\n');
  const have = lines.slice(open + 1, close);
  if (have.join('\n') === want.join('\n')) continue;

  stale.push(b.file);
  if (!check) {
    lines = [...lines.slice(0, open + 1), ...want, ...lines.slice(close)];
    changed.push(b.file + '  (' + have.length + ' → ' + want.length + ' lines)');
  }
}

if (check) {
  if (stale.length) {
    console.error('✗  the README is out of date with: ' + stale.join(', '));
    console.error('   run:  node tools/sync-readme.mjs');
    process.exit(1);
  }
  console.log('✓  README blocks match apps-script/');
} else if (changed.length) {
  writeFileSync(README, lines.join('\n'));
  changed.forEach(c => console.log('✓  updated  ' + c));
} else {
  console.log('✓  already in step');
}
