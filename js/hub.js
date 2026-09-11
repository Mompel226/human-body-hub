/* ============================================================
   Human Body Hub — the shelf
   Reads window.TOPICS, builds the paper side, and wires it to
   the specimen. Adding a lab means editing topics.js only.
   ============================================================ */
(function () {
  'use strict';

  var T       = window.TOPICS || [];

  /* ---------- the lab register, and this browser's own progress ----------
     WHICH labs exist and how big they are lives in js/data/labs.js, generated from
     labs-shared/labs.json by tools/stamp.mjs. HOW to read a lab's record lives in
     js/progress.js, shared with every hub. So a count is never typed here: it is read from
     the register, and it follows a lab when that lab grows. Before this, "13 stations ·
     113 questions" sat in topics.js for days after the Digestion Lab reached 14 and 123.

     This hub carries no marks address and must not: it is ONE repository, linked from both
     the NLCS and the open edition of the front door. It shows only what this browser
     remembers. Signing in, and bringing handed-in work back from a teacher's spreadsheet,
     belongs to the front door, where each school sets its own address in js/local.js. */
  var REG = window.LABS_REGISTER || {}, LABS = REG.labs || [], P = window.LabProgress;

  function labFor(t) {
    var u = String(t.url || '').replace(/\/$/, '');
    for (var i = 0; i < LABS.length; i++)
      if (String(LABS[i].url || '').replace(/\/$/, '') === u) return LABS[i];
    return null;
  }
  function statOf(t) {                      /* "14 stations · 123 questions", from the register */
    var l = labFor(t);
    if (l && l.stations && l.questions) return l.stations + ' stations · ' + l.questions + ' questions';
    return t.detail || '';
  }
  function progOf(t) {                      /* '' until this browser has opened the lab */
    var l = labFor(t); if (!l || !P) return '';
    var p = P.local(l);
    if (!p.started && !p.handedIn) return '';
    return '<span class="hero__prog" title="' + p.done + ' of ' + p.total + ' questions answered correctly">' +
      '<span class="pbar"><span class="pbar__fill" style="width:' + P.pct(p) + '%"></span></span>' +
      '<b>' + P.pct(p) + '%</b><small>' + p.done + ' of ' + p.total +
      (p.handedIn ? ' · handed in' : '') + '</small></span>';
  }
  var frame   = document.getElementById('frame');
  var tag     = document.getElementById('tag');
  var said    = document.getElementById('said');
  var toastEl = document.getElementById('toast');
  var svg     = document.querySelector('#frame svg');

  /* The label names everything that lights up, not just the anchor — otherwise
     a second organ glowing (the thyroid with the brain, say) looks like a bug. */
  var LANDMARK = {
    digestion:'Stomach, liver and gut',   circulation:'Heart and blood vessels',
    immunity:'Spleen and lymph nodes',    'gas-exchange':'Lungs and airways',
    respiration:'Skeletal muscle',        excretion:'Kidneys and bladder',
    coordination:'Brain and thyroid gland', reproduction:'Uterus and ovaries',
    drugs:'Carried in the blood'
  };

  var IDLE = '<span class="said__name">Nine topics, one body</span>' +
             '<span class="said__note">Point at a lab — or at an organ</span>';

  /* ---------- 1. the paper side ---------- */
  var live   = T.filter(function (t) { return t.status === 'live' && t.url; });
  var queued = T.filter(function (t) { return !(t.status === 'live' && t.url); });

  live.forEach(function (t) {
    var a = document.createElement('a');
    a.className = 'hero';
    a.href = t.url;
    a.dataset.id = t.id;
    a.style.setProperty('--c', 'var(--i-' + t.sys + ')');
    a.innerHTML =
      '<span class="hero__no">Topic ' + t.no + ' · ' + t.year + '</span>' +
      '<h2 class="hero__name">' + t.lab + '</h2>' +
      '<p class="hero__sub">' + t.title + '</p>' +
      '<p class="hero__blurb">' + t.blurb + '</p>' +
      '<span class="hero__foot"><span class="hero__go">Open the lab</span>' +
        (statOf(t) ? '<span class="hero__stat">' + statOf(t) + '</span>' : '') +
      '</span>' + progOf(t);
    wire(a, t);
    document.getElementById('heroSlot').appendChild(a);
  });

  var queueEl = document.getElementById('queue');
  queued.forEach(function (t) {
    var li  = document.createElement('li');
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'q__btn';
    btn.dataset.id = t.id;
    btn.style.setProperty('--c', 'var(--i-' + t.sys + ')');
    btn.innerHTML =
      '<span class="q__dot"></span>' +
      '<span class="q__no">' + t.no + '</span>' +
      '<span class="q__txt"><span class="q__lab">' + t.lab + '</span>' +
      '<span class="q__title">' + t.title + '</span></span>';
    btn.addEventListener('click', function () { toast(t.lab + ' has not been built yet.'); });
    wire(btn, t);
    li.appendChild(btn);
    queueEl.appendChild(li);
  });

  document.getElementById('count').textContent = queued.length + ' more on the way';
  said.innerHTML = IDLE;

  function wire(el, t) {
    ['mouseenter', 'focus'].forEach(function (e) { el.addEventListener(e, function () { focus(t); }); });
    ['mouseleave', 'blur'].forEach(function (e) { el.addEventListener(e, clear); });
  }

  /* ---------- 2. the specimen ---------- */
  if (svg) {
    svg.querySelectorAll('[data-sys]').forEach(function (el) {
      el.style.setProperty('--c', 'var(--g-' + el.dataset.sys + ')');
    });
    addHotspots();
  } else {
    toast('The anatomical plate is missing — run tools/inline-plate.py.');
  }

  /* Where an organ really sits, in the plate's own coordinates.
     getBBox() reports a shape before its transform is applied, so a mirrored
     organ — the muscles, the veins — reported a position off the left of the
     plate, and its hotspot could never be reached. Going out to the rendered
     rectangle and back through the screen matrix gives the true position. */
  function userSpaceBox(el) {
    var m = svg.getScreenCTM();
    if (!m) return el.getBBox();
    var inv = m.inverse(), r = el.getBoundingClientRect();
    var a = svg.createSVGPoint(), b = svg.createSVGPoint();
    a.x = r.left;  a.y = r.top;
    b.x = r.right; b.y = r.bottom;
    a = a.matrixTransform(inv); b = b.matrixTransform(inv);
    return { x: Math.min(a.x, b.x), y: Math.min(a.y, b.y),
             width: Math.abs(b.x - a.x), height: Math.abs(b.y - a.y) };
  }

  /* a clickable disc over each landmark, small ones on top */
  function addHotspots() {
    var vb = svg.viewBox.baseVal;
    T.filter(function (t) { return t.anchor && svg.querySelector('#' + t.anchor); })
      .map(function (t) {
        var b = userSpaceBox(svg.querySelector('#' + t.anchor));
        return { t: t, b: b, area: b.width * b.height };
      })
      .sort(function (a, z) { return z.area - a.area; })
      .forEach(function (m) {
        var r  = Math.max(34, Math.min(m.b.width, m.b.height) * 0.44);
        /* an organ that runs off the edge of the crop still needs a target
           the pointer can actually reach, so clamp the disc into view */
        var cx = Math.min(Math.max(m.b.x + m.b.width / 2,  vb.x + r * 0.6),
                          vb.x + vb.width  - r * 0.6);
        var cy = Math.min(Math.max(m.b.y + m.b.height / 2, vb.y + r * 0.6),
                          vb.y + vb.height - r * 0.6);
        var c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        c.setAttribute('cx', cx);
        c.setAttribute('cy', cy);
        c.setAttribute('r', r);
        c.setAttribute('class', 'hotspot');
        c.setAttribute('tabindex', '0');
        c.setAttribute('role', 'link');
        c.innerHTML = '<title>' + m.t.lab + ' — ' + m.t.title + '</title>';
        ['mouseenter', 'focus'].forEach(function (e) {
          c.addEventListener(e, function () { focus(m.t); });
        });
        ['mouseleave', 'blur'].forEach(function (e) { c.addEventListener(e, clear); });
        c.addEventListener('click', function () { go(m.t); });
        c.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(m.t); }
        });
        svg.appendChild(c);
      });
  }

  function go(t) {
    if (t.status === 'live' && t.url) window.location.href = t.url;
    else toast(t.lab + ' has not been built yet.');
  }

  /* ---------- 3. lighting one system ---------- */
  var current = null;

  function focus(t) {
    if (current === t.id) return;
    current = t.id;
    clearMarks();

    if (svg && t.sys) {
      svg.dataset.focus = t.sys;
      svg.querySelectorAll('[data-sys="' + t.sys + '"],[data-sys2="' + t.sys + '"]')
         .forEach(function (el) { el.classList.add('is-on'); });
      pinTag(t);
    }
    document.querySelectorAll('[data-id="' + t.id + '"]').forEach(function (el) {
      el.classList.add('is-hot');
    });

    said.style.setProperty('--c', 'var(--g-' + t.sys + ')');
    said.innerHTML =
      '<span class="said__name">' + t.lab + '</span>' +
      '<span class="said__note">Topic ' + t.no + ' · ' + t.title + '</span>';
  }

  /* the little label that sits on the organ itself */
  function pinTag(t) {
    var el = t.anchor && svg.querySelector('#' + t.anchor);
    if (!el) { tag.classList.remove('on'); return; }
    var o = el.getBoundingClientRect(), f = frame.getBoundingClientRect();
    tag.style.setProperty('--c', 'var(--g-' + t.sys + ')');
    tag.querySelector('.tag__pill').textContent = LANDMARK[t.sys] || t.title;
    tag.classList.remove('tag--side');
    tag.classList.add('on');

    /* Above the organ is where it belongs — clear of what it names. But an organ near the
       top of the plate, the brain or the thyroid, leaves no room there: the label was
       pushed off the top of the frame and landed on the "specimen · human · anterior"
       caption above it. When there is no room above, it goes beside the head instead. */
    var h = tag.offsetHeight || 26, w = tag.offsetWidth || 130;
    var above = o.top - f.top - 10;
    if (above - h >= 4) {
      tag.style.left = (o.left + o.width / 2 - f.left) + 'px';
      tag.style.top  = above + 'px';
      return;
    }
    tag.classList.add('tag--side');
    var left = o.right - f.left + 12;                 /* beside the head, on its right */
    left = Math.min(left, f.width - 8 - w);           /* but never off the edge of the plate */
    tag.style.left = Math.max(8, left) + 'px';
    tag.style.top  = (o.top + o.height / 2 - f.top) + 'px';
  }

  function clear() {
    current = null;
    clearMarks();
    said.style.removeProperty('--c');
    said.innerHTML = IDLE;
  }

  function clearMarks() {
    if (svg) {
      delete svg.dataset.focus;
      svg.querySelectorAll('.is-on').forEach(function (e) { e.classList.remove('is-on'); });
    }
    tag.classList.remove('on');
    document.querySelectorAll('.is-hot').forEach(function (e) { e.classList.remove('is-hot'); });
  }

  /* ---------- 4. the idle tour ----------
     Left alone, the plate walks the systems by itself, so anyone
     glancing at the screen sees what the body does. Any touch stops
     it; it picks up again after a long pause. */
  var tour = null, resume = null, i = 0;
  var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var TOURABLE = T.filter(function (t) { return t.sys && t.anchor; });
  /* Long enough to read the lab name AND the topic under it without hurrying — these are
     Year 10 and 11 students on a phone, glancing, not speed-reading. Three seconds was the
     length of the fade plus about one line. */
  var TOUR_MS = 5800;

  function startTour() {
    if (still || tour || !svg) return;
    step(); tour = setInterval(step, TOUR_MS);
  }
  function step() { focus(TOURABLE[i % TOURABLE.length]); i++; }
  function stopTour(wait) {
    clearInterval(tour); tour = null; clearTimeout(resume);
    if (!still) resume = setTimeout(startTour, wait);
  }
  ['pointerdown', 'pointermove', 'keydown', 'wheel'].forEach(function (e) {
    window.addEventListener(e, function () {
      if (tour) {
        stopTour(16000);
        /* only drop the highlight if the pointer has not landed on
           something that is asking for one — otherwise this would
           undo the hover the student just made */
        if (!document.querySelector('.hero:hover,.q__btn:hover,.hotspot:hover')) clear();
      } else {
        clearTimeout(resume); resume = setTimeout(startTour, 16000);
      }
    }, { passive: true });
  });
  setTimeout(startTour, 4000);

  /* ---------- 5. toast ---------- */
  var timer;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('on');
    clearTimeout(timer);
    timer = setTimeout(function () { toastEl.classList.remove('on'); }, 2600);
  }
})();
