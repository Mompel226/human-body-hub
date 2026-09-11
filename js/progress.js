/* ============================================================
   progress.js — how a student is doing, everywhere.
   SHARED: labs-shared/progress.js is the source; each hub's build copies it in.

   Every app is served from one origin, mompel226.github.io, so a lab's record in
   localStorage is readable by every hub. This file is the ONLY thing that knows how
   to read it, so a hub never has to know a lab's internals — add a lab to
   labs-shared/labs.json and it appears everywhere, with no hub changed.

   A lab keeps, under the key named in the register (NOT always <id>.v2 — the
   Classification Lab uses .v1):
     { <stationId>: { done:{i:true}, tried:{i:true}, per:{i:n}, one:{i:true}, sig, first } }
   and, once handed in, <id>.submitted = { name, form, code, at, sent }.

   Nothing here writes to a lab's record. Read only.
   ============================================================ */
(function (global) {
  'use strict';

  function read(key) {
    try { var raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : null; }
    catch (e) { return null; }        /* private window, or site data blocked */
  }

  /* What a student has done in one lab, from their own browser. */
  function local(lab) {
    var rec = read(lab.store), sub = read(lab.id + '.submitted');
    var out = { id: lab.id, done: 0, tried: 0, stations: 0, checks: 0,
                total: lab.questions || 0, ofStations: lab.stations || 0,
                started: false, handedIn: !!(sub && sub.code), at: sub && sub.at || null,
                source: 'this browser' };
    if (!rec || typeof rec !== 'object') { out.source = sub ? 'handed in' : 'not started'; return out; }
    Object.keys(rec).forEach(function (id) {
      var r = rec[id];
      if (!r || typeof r !== 'object' || !r.done) return;
      var n = 0, t = 0;
      Object.keys(r.done).forEach(function (k) { if (r.done[k]) n++; });
      Object.keys(r.tried || {}).forEach(function (k) { if (r.tried[k]) t++; });
      Object.keys(r.per || {}).forEach(function (k) { out.checks += r.per[k]; });
      out.done += n; out.tried += t;
      if (n || t) out.stations++;
    });
    out.started = out.done > 0 || out.tried > 0;
    return out;
  }

  /* The sheet knows only what was handed in, and only for a signed-in student. It is the
     backup, not the live state: a student's browser is normally ahead of it. So take
     whichever is further on, and never let a lower server score erase local work. */
  function merge(here, there) {
    if (!there) return here;
    var out = {}; for (var k in here) out[k] = here[k];
    out.handedIn = here.handedIn || !!there.handedIn;
    out.at = there.at || here.at;
    if ((there.done || 0) > (here.done || 0)) {
      out.done = there.done;
      out.total = there.total || here.total;
      out.checks = Math.max(here.checks || 0, there.checks || 0);
      out.started = true;
      out.source = 'restored from your teacher’s records';
    } else if (!here.started && there.handedIn) {
      out.source = 'restored from your teacher’s records';
    }
    return out;
  }

  /* Every lab in the register, then the same figures per shelf and overall. */
  function all(labs, server) {
    var byLab = {}, byShelf = {}, whole = { done: 0, total: 0, labs: 0, started: 0, handedIn: 0 };
    (labs || []).forEach(function (lab) {
      if (lab.status && lab.status !== 'live') return;
      var p = merge(local(lab), server && server[lab.id]);
      byLab[lab.id] = p;
      var s = byShelf[lab.shelf] || (byShelf[lab.shelf] = { done: 0, total: 0, labs: 0, started: 0, handedIn: 0 });
      [s, whole].forEach(function (acc) {
        acc.done += p.done; acc.total += p.total; acc.labs++;
        if (p.started) acc.started++;
        if (p.handedIn) acc.handedIn++;
      });
    });
    return { byLab: byLab, byShelf: byShelf, whole: whole };
  }

  function pct(p) { return p && p.total ? Math.round(100 * p.done / p.total) : 0; }

  /* Is anything worth showing at all? A student who has never opened a lab should not be
     shown a row of zeros — say nothing instead. */
  function any(res) { return !!(res && res.whole && (res.whole.started || res.whole.handedIn)); }

  global.LabProgress = { local: local, merge: merge, all: all, pct: pct, any: any, read: read };
})(this);
