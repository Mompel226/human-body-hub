/* ============================================================
   Human Body Hub — the body in three dimensions
   The model is BodyParts3D: every organ is a separate mesh sitting
   in the coordinate frame of the MRI it was segmented from, so the
   anatomy is not arranged by hand — it is where it was measured.
   Node names are "<system>__<organ>".
   ============================================================ */
import * as THREE from 'three';
import { GLTFLoader }    from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

/* ---------- the lab register, and this browser's own progress ----------
   The same two helpers as js/hub.js: index.html is drawn by this file and plate.html by
   that one, so a change to the lab card must be made in BOTH or the two pages disagree.
   A count is never typed here — it is read from js/data/labs.js, generated from
   labs-shared/labs.json. This hub carries no marks address: it is one repository linked
   from both editions of the front door, so it shows only what this browser remembers. */
const REG_ = window.LABS_REGISTER || {}, LABS_ = REG_.labs || [], P_ = window.LabProgress;
function labFor(t) {
  const u = String(t.url || '').replace(/\/$/, '');
  return LABS_.filter(l => String(l.url || '').replace(/\/$/, '') === u)[0] || null;
}
function statOf(t) {
  const l = labFor(t);
  return (l && l.stations && l.questions) ? `${l.stations} stations · ${l.questions} questions` : (t.detail || '');
}
function progOf(t) {
  const l = labFor(t); if (!l || !P_) return '';
  const p = P_.local(l);
  if (!p.started && !p.handedIn) return '';
  return `<span class="hero__prog" title="${p.done} of ${p.total} questions answered correctly">` +
    `<span class="pbar"><span class="pbar__fill" style="width:${P_.pct(p)}%"></span></span>` +
    `<b>${P_.pct(p)}%</b><small>${p.done} of ${p.total}${p.handedIn ? ' · handed in' : ''}</small></span>`;
}



const T = window.TOPICS || [];
const BY_SYS = {}; T.forEach(t => { if (t.sys) BY_SYS[t.sys] = t; });

const GLOW = {
  coordination:0xB388FF, 'gas-exchange':0x4FC3F7, circulation:0xFF5C5C,
  digestion:0xF5A623,    excretion:0x4ADE80,      immunity:0x2DD4BF,
  reproduction:0xF472B6, respiration:0xA3E635,    drugs:0x94A3B8
};
/* what the caption calls each system's landmark */
const LANDMARK = {
  digestion:'Stomach, liver and gut', circulation:'Heart, arteries and veins',
  immunity:'Spleen and thymus',       'gas-exchange':'Lungs, airways and breathing muscles',
  respiration:'Skeletal muscle, head to foot', excretion:'Kidneys and bladder',
  coordination:'Brain and eyes',      reproduction:'Reproductive organs',
  drugs:'Carried in the blood'
};
/* Topic 15 has no organ of its own — drugs travel in the blood */
const ALSO = { drugs:'circulation' };

const REST  = { skin:0.12, skeleton:0.34, organ:1 };
const BLACK = 0x000000;

const stage   = document.getElementById('stage');
const said    = document.getElementById('said');
const loading = document.getElementById('loading');
const toastEl = document.getElementById('toast');
const IDLE = '<span class="said__name">Nine topics, one body</span>' +
             '<span class="said__note">Point at a lab — or drag the body</span>';

/* ---------------- scene ---------------- */
const renderer = new THREE.WebGLRenderer({ antialias:true, alpha:true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;
stage.appendChild(renderer.domElement);

const pmrem = new THREE.PMREMGenerator(renderer);
const scene  = new THREE.Scene();
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
const root   = new THREE.Group();
scene.add(root);

/* a cool key light in front, a warm fill behind, so organs read as solid */
scene.add(new THREE.HemisphereLight(0x9FD8EE, 0x0A141C, 0.85));
const key = new THREE.DirectionalLight(0xFFFFFF, 2.1); key.position.set(-1.4, 1.6, 2.4); scene.add(key);
const fill = new THREE.DirectionalLight(0x7FC6E8, 0.9); fill.position.set(2.2, 0.4, -1.8); scene.add(fill);
const rim  = new THREE.DirectionalLight(0xFFD9A8, 0.55); rim.position.set(0.6, -1.2, -2.2); scene.add(rim);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; controls.dampingFactor = 0.07;
/* Panning was off, so zooming in on a phone left you stuck looking at the middle of the
   body with the head and the legs out of reach. Two fingers now move the view as well as
   zoom it; one finger still turns the body. The target is kept inside a box around the
   specimen (see the loop at the bottom) so nobody can drag themselves into empty space. */
controls.enablePan = true; controls.screenSpacePanning = true;
controls.touches = { ONE: THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.DOLLY_PAN };
/* 0.3 m from the organ you zoom toward (see "zooming" below): one organ fills the view and still
   reads as itself; nearer, the model's triangles show and nothing can be told apart. It was 1.1 m
   from the middle of the body, which kept the whole trunk in view. */
controls.minDistance = 0.3; controls.maxDistance = 5.5;
controls.autoRotate = true; controls.autoRotateSpeed = 0.55;

function resize() {
  const w = stage.clientWidth, h = stage.clientHeight;
  if (!w || !h) return;
  renderer.setSize(w, h, false);
  camera.aspect = w / h; camera.updateProjectionMatrix();
}
addEventListener('resize', resize);

/* ---------------- the body ---------------- */
const bySystem = {};           // system -> [mesh]
let skin = null, bones = [], organs = [], muscles = [];

new GLTFLoader().load('assets/model/body.glb?v=4', gltf => {
  const model = gltf.scene;

  model.traverse(o => {
    if (!o.isMesh) return;
    const [system, organ] = (o.name || '').split('__');
    o.userData.system = system; o.userData.organ = organ;
    const m = o.material;
    m.roughness = 0.58; m.metalness = 0.0;
    m.emissive = new THREE.Color(0x000000);
    const ctx = system === 'context';
    o.userData.baseOpacity = ctx
      ? (organ === 'skin' ? REST.skin : REST.skeleton) : REST.organ;
    m.opacity = o.userData.baseOpacity;
    /* Only the layers meant to be see-through go in the transparent pass.
       A transparent mesh that still writes depth hides whatever is behind it,
       and the transparent pass is sorted by distance — so which parts of a
       system you could see changed as the body turned. Organs are opaque. */
    m.transparent = ctx;
    m.depthWrite  = !ctx;
    if (organ === 'skin')      { skin = o;  m.depthWrite = false; m.side = THREE.FrontSide; }
    else if (organ === 'skeleton') bones.push(o);
    else {
      organs.push(o);
      (bySystem[system] = bySystem[system] || []).push(o);
      /* muscle can be pulled off to see the organs underneath */
      if (organ.startsWith('muscle-') || organ === 'intercostals') {
        o.userData.muscle = true; muscles.push(o);
      }
    }
  });

  /* BodyParts3D is Z-up and in millimetres; stand it up, scale to metres,
     and put the origin at the middle of the body */
  model.rotation.x = -Math.PI / 2;
  root.add(model);
  const box = new THREE.Box3().setFromObject(root);
  const size = box.getSize(new THREE.Vector3());
  const mid  = box.getCenter(new THREE.Vector3());
  const s = 1.75 / size.y;
  root.scale.setScalar(s);
  root.position.set(-mid.x * s, -mid.y * s, -mid.z * s);

  camera.position.set(0, 0.12, 3.15);
  controls.target.set(0, 0, 0);
  resize();
  loading.classList.add('done');
  said.innerHTML = IDLE;
  setTimeout(startTour, 3500);
}, undefined, err => {
  loading.textContent = 'The body could not be loaded';
  console.error(err);
});

/* ---------------- lighting a system ---------------- */
let current = null;

function focusSystem(t) {
  if (current === t.id) return;
  current = t.id;
  const wanted = new Set([t.sys, ALSO[t.sys]].filter(Boolean));
  const glow = new THREE.Color(GLOW[t.sys] || 0xFFFFFF);

  organs.forEach(o => {
    const on = wanted.has(o.userData.system);
    /* a layer you switched off stays off — pointing at its lab must not
       bring it back, or it sits in front of the organs you wanted to reach */
    o.visible = o.userData.muscle ? muscleOn : true;
    const m = o.material;
    m.transparent = !on;          /* the lit system is solid, so every part of
                                     it shows from every angle */
    m.opacity     = on ? 1 : 0.06;
    m.depthWrite  = on;           /* a dimmed organ must never hide a lit one */
    o.renderOrder = on ? 2 : 0;
    m.emissive.copy(on ? glow : new THREE.Color(BLACK));
    m.emissiveIntensity = on ? 0.42 : 0;
  });
  if (skin)  { skin.visible = skinOn; skin.material.opacity = 0.035; }
  bones.forEach(b => { b.visible = boneOn; b.material.opacity = 0.07; });

  said.style.setProperty('--c', 'var(--g-' + t.sys + ')');
  said.innerHTML = '<span class="said__name">' + t.lab + '</span>' +
    '<span class="said__note">' + (LANDMARK[t.sys] || t.title) + '</span>';
}

function clearSystem() {
  current = null;
  organs.forEach(o => {
    o.visible = o.userData.muscle ? muscleOn : true;
    const m = o.material;
    m.transparent = false;
    m.opacity     = o.userData.baseOpacity;
    m.depthWrite  = true;
    o.renderOrder = 0;
    m.emissive.setHex(BLACK); m.emissiveIntensity = 0;
  });
  if (skin) { skin.visible = skinOn; skin.material.opacity = REST.skin; }
  bones.forEach(b => { b.visible = boneOn; b.material.opacity = REST.skeleton; });
  said.style.removeProperty('--c');
  said.innerHTML = IDLE;
}

/* ---------------- the paper side ---------------- */
const live   = T.filter(t => t.status === 'live' && t.url);
const queued = T.filter(t => !(t.status === 'live' && t.url));

live.forEach(t => {
  const a = document.createElement('a');
  a.className = 'hero'; a.href = t.url; a.dataset.id = t.id;
  a.style.setProperty('--c', 'var(--i-' + t.sys + ')');
  a.innerHTML =
    `<span class="hero__no">Topic ${t.no} · ${t.year}</span>` +
    `<h2 class="hero__name">${t.lab}</h2>` +
    `<p class="hero__sub">${t.title}</p>` +
    `<p class="hero__blurb">${t.blurb}</p>` +
    `<span class="hero__foot"><span class="hero__go">Open the lab</span>` +
      (statOf(t) ? `<span class="hero__stat">${statOf(t)}</span>` : '') + `</span>` + progOf(t);
  wire(a, t);
  document.getElementById('heroSlot').appendChild(a);
});

queued.forEach(t => {
  const li = document.createElement('li');
  const b  = document.createElement('button');
  b.type = 'button'; b.className = 'q__btn'; b.dataset.id = t.id;
  b.style.setProperty('--c', 'var(--i-' + t.sys + ')');
  b.innerHTML = `<span class="q__dot"></span><span class="q__no">${t.no}</span>` +
    `<span class="q__txt"><span class="q__lab">${t.lab}</span>` +
    `<span class="q__title">${t.title}</span></span>`;
  b.addEventListener('click', () => toast(t.lab + ' has not been built yet.'));
  wire(b, t);
  li.appendChild(b);
  document.getElementById('queue').appendChild(li);
});

document.getElementById('count').textContent = queued.length + ' more on the way';
said.innerHTML = IDLE;

/* Panning is on, so a student can zoom in and wander. Tapping a lab in the list puts the
   view back where it started — an explicit action, unlike the tour, which must not yank the
   camera about while somebody is looking at something. */
function homeView() {
  controls.target.set(0, 0, 0);
  camera.position.set(0, 0.12, 3.15);
}

function wire(el, t) {
  ['mouseenter','focus'].forEach(e => el.addEventListener(e, () => focusSystem(t)));
  ['mouseleave','blur'].forEach(e => el.addEventListener(e, clearSystem));
  el.addEventListener('click', homeView);      /* tapping a lab is also the way back */
}

/* ---------------- toggles ---------------- */
let skinOn = true, boneOn = true, muscleOn = true;
const tgSkin = document.getElementById('tgSkin'),
      tgBone = document.getElementById('tgBone'),
      tgMus  = document.getElementById('tgMus'),
      tgSpin = document.getElementById('tgSpin');

tgSkin.addEventListener('click', () => {
  skinOn = !skinOn; tgSkin.setAttribute('aria-pressed', skinOn);
  if (skin) { skin.visible = skinOn; skin.material.opacity = skinOn ? REST.skin : 0; }
});
tgBone.addEventListener('click', () => {
  boneOn = !boneOn; tgBone.setAttribute('aria-pressed', boneOn);
  bones.forEach(b => { b.visible = boneOn; });
});
tgMus.addEventListener('click', () => {
  muscleOn = !muscleOn; tgMus.setAttribute('aria-pressed', muscleOn);
  /* The button is the last word: hidden muscle stays hidden even while its
     own lab is lit, so it can never sit in front of the organs underneath. */
  muscles.forEach(m => { m.visible = muscleOn; });
});
let spinOn = true;            /* what the Turn button says; the loop at the bottom applies it */
tgSpin.addEventListener('click', () => {
  spinOn = !spinOn;
  tgSpin.setAttribute('aria-pressed', spinOn);
});

/* ---------------- picking: point at the body itself ---------------- */
const ray = new THREE.Raycaster(), ptr = new THREE.Vector2();
let hovered = null;

function pick(ev) {
  const r = renderer.domElement.getBoundingClientRect();
  ptr.x =  ((ev.clientX - r.left) / r.width)  * 2 - 1;
  ptr.y = -((ev.clientY - r.top)  / r.height) * 2 + 1;
  ray.setFromCamera(ptr, camera);
  const hit = ray.intersectObjects(organs.filter(o => o.visible), false)[0];
  return hit ? BY_SYS[hit.object.userData.system] : null;
}

renderer.domElement.addEventListener('pointermove', ev => {
  const t = pick(ev);
  renderer.domElement.style.cursor = t ? 'pointer' : 'grab';
  if (t && t.id !== hovered) { hovered = t.id; stopTour(20000); focusSystem(t); }
  else if (!t && hovered)    { hovered = null;  clearSystem(); }
});
renderer.domElement.addEventListener('pointerleave', () => {
  if (hovered) { hovered = null; clearSystem(); }
});
renderer.domElement.addEventListener('click', ev => {
  const t = pick(ev);
  if (!t) return;
  if (t.status === 'live' && t.url) location.href = t.url;
  else toast(t.lab + ' has not been built yet.');
});

/* ---------------- zooming: toward what you point at ----------------
   OrbitControls zooms toward the point it turns about, the middle of the body, so a pinch over
   the kidneys still went into the belly button and nothing off the middle line could be reached
   (Daniel, 4 Nov 2026). zoomToCursor moves the camera along the line through the pointer, or
   through the point between two fingers, so what is under them stays under them. Two more
   things make "close" possible:
   - At the start of each zoom the turning point moves along the line of sight to the depth of
     the organ under the pointer. The view does not move, but the camera now slows as it nears
     THAT organ and stops minDistance from it, and a drag afterwards turns the body about it.
   - The body stops turning by itself while you are close (CLOSE, in the loop at the bottom),
     or it would carry the organ out of view; it turns again once you zoom back out. */
controls.zoomToCursor = true;
const CLOSE = 2.4;            /* metres from the turning point; the opening view is 3.15 */
const cv = renderer.domElement;

function seat(x, y) {
  const r = cv.getBoundingClientRect();
  ptr.x =  ((x - r.left) / r.width)  * 2 - 1;
  ptr.y = -((y - r.top)  / r.height) * 2 + 1;
  ray.setFromCamera(ptr, camera);
  const hit = ray.intersectObjects(organs.filter(o => o.visible), false)[0];
  if (!hit) return;                       /* empty space: zoom toward the pointer as it is */
  const ahead = camera.getWorldDirection(new THREE.Vector3());
  const depth = ahead.dot(hit.point.clone().sub(camera.position));
  if (depth > controls.minDistance) controls.target.copy(camera.position).addScaledVector(ahead, depth);
}

/* A wheel, a mouse's or a trackpad's, starts a new zoom after a pause; the steps of one zoom
   keep the turning point it started with. Its speed is set here, before the controls read it:
   - A trackpad pinch arrives as a wheel with ctrlKey, its deltaY 100 × ln(how far the fingers
     parted). The controls zoom by 0.95 per 100, divided again by devicePixelRatio, so on a
     Retina Mac a whole pinch brought the body about 2 % closer. Now the body grows as the
     fingers part (fingers twice as far apart, camera twice as close), one step at most 1.5 times.
   - A mouse wheel keeps the controls' own speed, without the Retina halving; a wheel that counts
     in lines or pages (Firefox) is turned into pixels first. */
let lastWheel = 0;
addEventListener('wheel', e => {          /* on the window, so it runs before the controls */
  if (e.target !== cv) return;
  if (e.timeStamp - lastWheel > 250) seat(e.clientX, e.clientY);
  lastWheel = e.timeStamp;
  const dpr = (devicePixelRatio | 0) || 1;
  controls.zoomSpeed = e.ctrlKey
    ? dpr / -Math.log(0.95) * Math.min(1, 40 / (Math.abs(e.deltaY) || 1))
    : dpr * ([1, 16, 100][e.deltaMode] || 1);
}, { capture:true, passive:true });
/* a finger or a mouse button zooms at the controls' own speed (two fingers follow exactly) */
addEventListener('pointerdown', () => { controls.zoomSpeed = 1; }, true);

/* Two fingers on a touch screen. OrbitControls takes the point between them from pageX/pageY
   but measures the canvas with getBoundingClientRect, which leaves out scrolling: on a phone
   scrolled down the page, the zoom went toward a point that far below the fingers. So touch
   pointers carry their window position in pageX/pageY too, set here before the controls read
   them (this listener is on the window, in the capture phase). */
const fingers = new Map();
['pointerdown', 'pointermove'].forEach(type => addEventListener(type, e => {
  if (e.pointerType !== 'touch') return;
  Object.defineProperty(e, 'pageX', { value: e.clientX });
  Object.defineProperty(e, 'pageY', { value: e.clientY });
  if (type === 'pointerdown' && e.target !== cv) return;
  if (type === 'pointermove' && !fingers.has(e.pointerId)) return;
  fingers.set(e.pointerId, [e.clientX, e.clientY]);
  if (type === 'pointerdown' && fingers.size === 2) {
    const [a, b] = [...fingers.values()];
    seat((a[0] + b[0]) / 2, (a[1] + b[1]) / 2);
  }
}, true));
['pointerup', 'pointercancel'].forEach(type => addEventListener(type, e => fingers.delete(e.pointerId), true));

/* Safari on a Mac sends a trackpad pinch as "gesture" events, where other browsers send a wheel,
   so there the pinch zoomed the whole page instead of the body. Each step is passed on as the
   wheel the controls already follow. Not on a touch screen: there the fingers already arrive
   as pointers (above), and this would zoom twice. */
if (!navigator.maxTouchPoints) {
  let last = 1, pinching = false, px = 0, py = 0;
  cv.addEventListener('pointermove', e => { px = e.clientX; py = e.clientY; });
  cv.addEventListener('gesturestart', e => { e.preventDefault(); last = 1; pinching = true; });
  cv.addEventListener('gesturechange', e => {
    e.preventDefault();
    const k = e.scale / last; last = e.scale;
    if (!(k > 0) || !isFinite(k) || k === 1) return;
    /* the wheel Chrome would send for the same pinch (above) */
    cv.dispatchEvent(new WheelEvent('wheel', { deltaY: -100 * Math.log(k), ctrlKey:true, bubbles:true,
      cancelable:true, clientX: e.clientX ?? px, clientY: e.clientY ?? py }));
  });
  cv.addEventListener('gestureend', e => { e.preventDefault(); pinching = false; });
  /* if Safari also sends the pinch as wheels, those would zoom a second time */
  addEventListener('wheel', e => {
    if (pinching && e.isTrusted) { e.preventDefault(); e.stopPropagation(); }
  }, { capture:true, passive:false });
}

/* ---------------- the idle tour ---------------- */
const TOURABLE = T.filter(t => t.sys && t.sys !== 'drugs');
let tour = null, resumeT = null, ti = 0;
const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
/* Long enough to read the lab name and the topic under it without hurrying. */
const TOUR_MS = 5800;

function startTour() {
  if (still || tour || !organs.length) return;
  const step = () => { focusSystem(TOURABLE[ti % TOURABLE.length]); ti++; };
  step(); tour = setInterval(step, TOUR_MS);
}
function stopTour(wait) {
  clearInterval(tour); tour = null; clearTimeout(resumeT);
  if (!still) resumeT = setTimeout(startTour, wait);
}
['pointerdown','keydown','wheel'].forEach(e => addEventListener(e, () => {
  if (tour) { stopTour(20000); if (!hovered) clearSystem(); }
  else { clearTimeout(resumeT); resumeT = setTimeout(startTour, 20000); }
}, { passive:true }));
document.querySelectorAll('.hero,.q__btn').forEach(el =>
  el.addEventListener('mouseenter', () => stopTour(20000)));

/* ---------------- toast ---------------- */
let timer;
function toast(msg) {
  toastEl.textContent = msg; toastEl.classList.add('on');
  clearTimeout(timer); timer = setTimeout(() => toastEl.classList.remove('on'), 2600);
}

/* ---------------- draw ---------------- */
resize();
/* How far the view may wander from the body. Enough to put the head or the feet in the
   middle of the screen when zoomed in, not enough to lose the specimen altogether. */
const PAN = new THREE.Vector3(0.55, 1.05, 0.55);
renderer.setAnimationLoop(() => {
  controls.target.clamp(PAN.clone().negate(), PAN);
  controls.autoRotate = spinOn && camera.position.distanceTo(controls.target) > CLOSE;
  controls.update();
  renderer.render(scene, camera);
});
