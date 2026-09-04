/* ============================================================
   Biology Labs — the hub
   Reads window.TOPICS, builds the paper side, and wires it to
   the specimen. Adding a lab means editing topics.js only.
   ============================================================ */
(function () {
  'use strict';

  var T       = window.TOPICS || [];
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
        (t.detail ? '<span class="hero__stat">' + t.detail + '</span>' : '') +
      '</span>';
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
    tag.style.left = (o.left + o.width / 2 - f.left) + 'px';
    tag.style.top  = Math.max(12, o.top - f.top - 10) + 'px';   /* sit above the organ, never on it */
    tag.style.setProperty('--c', 'var(--g-' + t.sys + ')');
    tag.querySelector('.tag__pill').textContent = LANDMARK[t.sys] || t.title;
    tag.classList.add('on');
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

  function startTour() {
    if (still || tour || !svg) return;
    step(); tour = setInterval(step, 3000);
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
