/* ============================================================
   Biology Labs — the body in three dimensions
   The model is BodyParts3D: every organ is a separate mesh sitting
   in the coordinate frame of the MRI it was segmented from, so the
   anatomy is not arranged by hand — it is where it was measured.
   Node names are "<system>__<organ>".
   ============================================================ */
import * as THREE from 'three';
import { GLTFLoader }    from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

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
controls.enablePan = false; controls.minDistance = 1.1; controls.maxDistance = 5.5;
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
      (t.detail ? `<span class="hero__stat">${t.detail}</span>` : '') + `</span>`;
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

function wire(el, t) {
  ['mouseenter','focus'].forEach(e => el.addEventListener(e, () => focusSystem(t)));
  ['mouseleave','blur'].forEach(e => el.addEventListener(e, clearSystem));
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
tgSpin.addEventListener('click', () => {
  controls.autoRotate = !controls.autoRotate;
  tgSpin.setAttribute('aria-pressed', controls.autoRotate);
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

/* ---------------- the idle tour ---------------- */
const TOURABLE = T.filter(t => t.sys && t.sys !== 'drugs');
let tour = null, resumeT = null, ti = 0;
const still = matchMedia('(prefers-reduced-motion: reduce)').matches;

function startTour() {
  if (still || tour || !organs.length) return;
  const step = () => { focusSystem(TOURABLE[ti % TOURABLE.length]); ti++; };
  step(); tour = setInterval(step, 3200);
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
renderer.setAnimationLoop(() => { controls.update(); renderer.render(scene, camera); });
