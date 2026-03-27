import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";

/*
  TEMPUS MAGNIFICUS — Watch Assembly / Disassembly
  ─────────────────────────────────────────────────
  Every part of the clock has its own "exploded" offset
  position. Scroll drives each part from exploded → assembled,
  with staggered easing so they snap into place one by one.

  Scroll up   → parts scatter apart (disassemble)
  Scroll down → parts fly together (assemble)

  Three scenes:
    0–38%  Wall Clock
    33–72% Tower Clock
    66–100% Floral Clock
*/

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,600&family=Josefin+Sans:wght@100;300;400&family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;1,6..96,300;1,6..96,600&display=swap');`;

const C = {
  bg:       "#04030a",
  gold:     "#d4a843",
  goldPale: "#f0d080",
  goldDim:  "#6a5020",
  copper:   "#b06a2a",
  cream:    "#f2ead8",
  creamDim: "#7a6a50",
  tealGlow: "#20c0b0",
};

/* ── Material helpers ── */
const M = {
  brass:   (r=0.38,m=0.92) => new THREE.MeshStandardMaterial({ color:0xc89830, roughness:r, metalness:m }),
  brassD:  ()              => new THREE.MeshStandardMaterial({ color:0x8a5c0e, roughness:0.55, metalness:0.80 }),
  darkMet: ()              => new THREE.MeshStandardMaterial({ color:0x1a1208, roughness:0.88, metalness:0.18 }),
  face:    ()              => new THREE.MeshStandardMaterial({ color:0x060408, roughness:0.95, metalness:0.02 }),
  glass:   ()              => new THREE.MeshStandardMaterial({ color:0xaaccdd, roughness:0.04, metalness:0.08, transparent:true, opacity:0.18 }),
  hand:    (c=0xd4b030)    => new THREE.MeshStandardMaterial({ color:c, roughness:0.32, metalness:0.94 }),
  second:  ()              => new THREE.MeshStandardMaterial({ color:0x9a1a00, roughness:0.28, metalness:0.80 }),
  leaf:    ()              => new THREE.MeshStandardMaterial({ color:0x2a4a10, roughness:0.88, metalness:0.05 }),
  petal:   (c)             => new THREE.MeshStandardMaterial({ color:c, roughness:0.72, metalness:0.12 }),
  stone:   ()              => new THREE.MeshStandardMaterial({ color:0x1c1610, roughness:0.96, metalness:0.03 }),
  glow:    (c,i=0.5)       => new THREE.MeshStandardMaterial({ color:c, roughness:0.45, metalness:0.1, emissive:new THREE.Color(c), emissiveIntensity:i }),
};

/* ══════════════════════════════════════════════════════
   ASSEMBLY PART
   Each mesh knows its final position and an exploded offset.
   update(p) where p=0 is fully scattered, p=1 is assembled.
══════════════════════════════════════════════════════ */
class AssemblyPart {
  constructor(mesh, explodedOffset, explodedRot, delay) {
    this.mesh = mesh;
    this.finalPos = mesh.position.clone();
    this.finalRot = new THREE.Euler(mesh.rotation.x, mesh.rotation.y, mesh.rotation.z);
    this.explodedOffset = explodedOffset.clone();
    this.explodedRot    = explodedRot ? new THREE.Euler(explodedRot.x, explodedRot.y, explodedRot.z) : new THREE.Euler();
    this.delay = delay;
  }

  update(p) {
    // Each part has a staggered arrival window
    const span = 0.58;
    const start = this.delay * (1 - span);
    const local = Math.min(1, Math.max(0, (p - start) / span));
    const e = easeSpring(local);

    this.mesh.position.set(
      this.finalPos.x + this.explodedOffset.x * (1 - e),
      this.finalPos.y + this.explodedOffset.y * (1 - e),
      this.finalPos.z + this.explodedOffset.z * (1 - e),
    );
    this.mesh.rotation.set(
      this.finalRot.x + this.explodedRot.x * (1 - e),
      this.finalRot.y + this.explodedRot.y * (1 - e),
      this.finalRot.z + this.explodedRot.z * (1 - e),
    );
  }
}

/* Spring-like ease: fast approach, slight deceleration */
function easeSpring(t) {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  return 1 - Math.pow(1 - t, 2.8) * (1 + t * 0.9);
}

/* Deterministic scatter so re-renders are stable */
function makeScatter(seed, range, zRange) {
  const s = Math.sin(seed * 9301 + 49297) * 0.5 + 0.5;
  const s2 = Math.sin(seed * 6271 + 2341) * 0.5 + 0.5;
  const s3 = Math.sin(seed * 3491 + 7183) * 0.5 + 0.5;
  return new THREE.Vector3(
    (s - 0.5) * range * 2,
    (s2 - 0.5) * range * 2,
    (s3 - 0.5) * zRange * 2 - zRange,
  );
}
function makeScatterRot(seed, range) {
  const s = Math.sin(seed * 1231 + 4567) * 0.5 + 0.5;
  const s2 = Math.sin(seed * 8761 + 1234) * 0.5 + 0.5;
  const s3 = Math.sin(seed * 2341 + 8765) * 0.5 + 0.5;
  return new THREE.Euler((s-0.5)*range, (s2-0.5)*range, (s3-0.5)*range);
}

/* ══════════════════════════════════════════════════════
   CLOCK BUILDERS — return { group, parts }
══════════════════════════════════════════════════════ */
function buildWallClock() {
  const group = new THREE.Group();
  const parts = [];
  let idx = 0;
  const maxDelay = 0.44;

  const addPart = (mesh, sr, zr) => {
    group.add(mesh);
    const delay = (idx / 90) * maxDelay;
    parts.push(new AssemblyPart(
      mesh,
      makeScatter(idx, sr, zr),
      makeScatterRot(idx, Math.PI * 0.6),
      delay
    ));
    idx++;
    return mesh;
  };

  /* Outer bezel */
  addPart(new THREE.Mesh(new THREE.TorusGeometry(2.18,0.26,24,96), M.brass()), 4, 2);
  /* Decorative rings */
  addPart(new THREE.Mesh(new THREE.TorusGeometry(1.90,0.055,8,72), M.brassD()), 3.5, 1.5);
  addPart(new THREE.Mesh(new THREE.TorusGeometry(1.72,0.03,8,64), M.brassD()), 3, 1.5);

  /* Face disk */
  const face = new THREE.Mesh(new THREE.CylinderGeometry(1.88,1.88,0.09,64), M.face());
  face.rotation.x = Math.PI / 2;
  face.position.z = -0.04;
  addPart(face, 2, 4);

  /* Dial spokes */
  for (let i = 0; i < 8; i++) {
    const spoke = new THREE.Mesh(new THREE.BoxGeometry(0.018,1.58,0.02), M.brassD());
    spoke.rotation.z = -(i / 8) * Math.PI * 2;
    addPart(spoke, 4, 3);
  }

  /* 60 tick marks */
  for (let i = 0; i < 60; i++) {
    const maj = i % 5 === 0;
    const tick = new THREE.Mesh(
      new THREE.BoxGeometry(maj ? 0.05 : 0.022, maj ? 0.32 : 0.13, 0.04),
      M.brass(maj ? 0.38 : 0.55, maj ? 0.88 : 0.72)
    );
    const a = (i / 60) * Math.PI * 2;
    tick.position.set(Math.sin(a) * 1.66, Math.cos(a) * 1.66, 0.07);
    tick.rotation.z = -a;
    addPart(tick, 5, 2);
  }

  /* 12 hour markers */
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    const gem = new THREE.Mesh(new THREE.OctahedronGeometry(0.075), M.brass(0.18, 0.98));
    gem.position.set(Math.sin(a) * 1.50, Math.cos(a) * 1.50, 0.10);
    gem.rotation.y = a;
    addPart(gem, 6, 2);
  }

  /* Hour hand */
  const hourH = new THREE.Mesh(new THREE.BoxGeometry(0.10,1.05,0.055), M.hand());
  hourH.position.set(0, 0.42, 0.12);
  addPart(hourH, 3, 5);

  /* Minute hand */
  const minH = new THREE.Mesh(new THREE.BoxGeometry(0.065,1.46,0.05), M.hand(0xc08020));
  minH.rotation.z = 0.9;
  minH.position.set(Math.sin(0.9)*0.6, Math.cos(0.9)*0.6, 0.13);
  addPart(minH, 3, 5);

  /* Second hand */
  const secH = new THREE.Mesh(new THREE.BoxGeometry(0.025,1.78,0.035), M.second());
  secH.rotation.z = 2.4;
  secH.position.set(Math.sin(2.4)*0.72, Math.cos(2.4)*0.72, 0.15);
  addPart(secH, 3, 5);

  /* Centre cap */
  const cap = new THREE.Mesh(new THREE.SphereGeometry(0.12,14,14), M.brass(0.14, 1.0));
  cap.position.z = 0.17;
  addPart(cap, 2, 6);

  /* Glass cover — slides in from front, last */
  const gl = new THREE.Mesh(new THREE.CylinderGeometry(1.88,1.88,0.03,64), M.glass());
  gl.rotation.x = Math.PI / 2;
  gl.position.z = 0.15;
  group.add(gl);
  parts.push(new AssemblyPart(gl, new THREE.Vector3(0,0,6), new THREE.Euler(), maxDelay));

  return { group, parts };
}

function buildTowerClock() {
  const group = new THREE.Group();
  const parts = [];
  let idx = 0;
  const maxDelay = 0.44;

  const addPart = (mesh, sr, zr) => {
    group.add(mesh);
    const delay = (idx / 70) * maxDelay;
    parts.push(new AssemblyPart(mesh, makeScatter(idx + 100, sr, zr), makeScatterRot(idx + 100, Math.PI * 0.5), delay));
    idx++;
    return mesh;
  };

  /* Base plinth first */
  const base = new THREE.Mesh(new THREE.BoxGeometry(2.0,0.25,1.05), M.stone());
  base.position.y = -3.8;
  addPart(base, 3, 2);

  const step = new THREE.Mesh(new THREE.BoxGeometry(2.3,0.14,1.2), M.brassD());
  step.position.y = -3.97;
  addPart(step, 3, 2);

  /* Tower body */
  const body = new THREE.Mesh(new THREE.BoxGeometry(1.5,5.0,0.75), M.stone());
  body.position.y = -1.3;
  addPart(body, 3, 3);

  /* Stone course lines */
  for (let y = -4; y <= 1; y += 0.7) {
    const band = new THREE.Mesh(new THREE.BoxGeometry(1.52,0.05,0.77), M.darkMet());
    band.position.y = y;
    addPart(band, 4, 2);
  }

  /* Brass corner pillars */
  for (const [x, z] of [[-0.76,0.38],[0.76,0.38],[-0.76,-0.38],[0.76,-0.38]]) {
    const p = new THREE.Mesh(new THREE.CylinderGeometry(0.055,0.055,5.0,8), M.brassD());
    p.position.set(x, -1.3, z);
    addPart(p, 5, 3);
  }

  /* Windows */
  for (const x of [-0.3, 0.3]) {
    for (const y of [-0.2,-1.1,-2.0]) {
      const win = new THREE.Mesh(new THREE.BoxGeometry(0.24,0.36,0.08), M.glow(0xc07000, 0.55));
      win.material.transparent = true;
      win.material.opacity = 0.55;
      win.position.set(x, y, 0.4);
      addPart(win, 6, 3);
    }
  }

  /* Battlements */
  for (const x of [-0.54,-0.27,0,0.27,0.54]) {
    const b = new THREE.Mesh(new THREE.BoxGeometry(0.22,0.34,0.82), M.stone());
    b.position.set(x, 1.3, 0);
    addPart(b, 4, 4);
  }

  const spireBase = new THREE.Mesh(new THREE.BoxGeometry(1.6,0.25,0.82), M.stone());
  spireBase.position.y = 1.3;
  addPart(spireBase, 3, 3);

  const spire = new THREE.Mesh(new THREE.ConeGeometry(0.74,2.5,4), M.darkMet());
  spire.rotation.y = Math.PI / 4;
  spire.position.y = 2.65;
  addPart(spire, 4, 6);

  const ball = new THREE.Mesh(new THREE.SphereGeometry(0.14,12,12), M.brass(0.18, 0.98));
  ball.position.y = 3.95;
  addPart(ball, 3, 8);

  const fY = 0.8;
  const fring = new THREE.Mesh(new THREE.TorusGeometry(0.76,0.11,14,52), M.brass(0.38, 0.88));
  fring.position.set(0, fY, 0.4);
  addPart(fring, 5, 4);

  const fd = new THREE.Mesh(new THREE.CylinderGeometry(0.75,0.75,0.05,50), M.face());
  fd.rotation.x = Math.PI / 2;
  fd.position.set(0, fY, 0.39);
  addPart(fd, 4, 3);

  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    const t = new THREE.Mesh(new THREE.BoxGeometry(0.04,0.18,0.04), M.brass(0.45, 0.85));
    t.position.set(Math.sin(a)*0.60, fY + Math.cos(a)*0.60, 0.46);
    t.rotation.z = -a;
    addPart(t, 5, 3);
  }

  const th = new THREE.Mesh(new THREE.BoxGeometry(0.065,0.48,0.04), M.hand());
  th.position.set(-0.1, fY + 0.17, 0.48);
  th.rotation.z = 0.4;
  addPart(th, 4, 5);

  const tm = new THREE.Mesh(new THREE.BoxGeometry(0.045,0.62,0.04), M.hand(0xc09020));
  tm.position.set(0.15, fY + 0.24, 0.48);
  tm.rotation.z = -0.5;
  addPart(tm, 4, 5);

  return { group, parts };
}

function buildFloralClock() {
  const group = new THREE.Group();
  const parts = [];
  let idx = 0;
  const maxDelay = 0.44;

  const addPart = (mesh, sr, zr) => {
    group.add(mesh);
    const delay = (idx / 65) * maxDelay;
    parts.push(new AssemblyPart(mesh, makeScatter(idx + 200, sr, zr), makeScatterRot(idx + 200, Math.PI * 0.7), delay));
    idx++;
    return mesh;
  };

  const petalCols = [0xc06020,0x9a4418,0xb85510,0xd4691e,0xcd7832,0xb07012,0xd4860a,0xa05010];

  for (let i = 0; i < 14; i++) {
    const a = (i / 14) * Math.PI * 2;
    const petal = new THREE.Mesh(new THREE.CapsuleGeometry(0.24,0.95,5,14), M.petal(petalCols[i % petalCols.length]));
    petal.position.set(Math.sin(a)*2.35, Math.cos(a)*2.35, -0.1);
    petal.rotation.z = -a;
    petal.rotation.x = 0.18;
    addPart(petal, 7, 3);
  }

  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2 + Math.PI / 10;
    const p = new THREE.Mesh(new THREE.CapsuleGeometry(0.16,0.58,4,10), M.brass(0.48, 0.55));
    p.position.set(Math.sin(a)*1.42, Math.cos(a)*1.42, 0.02);
    p.rotation.z = -a;
    p.rotation.x = 0.12;
    addPart(p, 6, 3);
  }

  for (let i = 0; i < 7; i++) {
    const a = (i / 7) * Math.PI * 2 + 0.2;
    const l = new THREE.Mesh(new THREE.CapsuleGeometry(0.09,0.65,4,8), M.leaf());
    l.position.set(Math.sin(a)*2.75, Math.cos(a)*2.75, -0.22);
    l.rotation.z = -a + 0.35;
    l.rotation.x = 0.28;
    addPart(l, 7, 3);
  }

  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    const curve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(Math.sin(a)*0.95, Math.cos(a)*0.95, 0),
      new THREE.Vector3(Math.sin(a+0.7)*1.7, Math.cos(a+0.7)*1.7, 0.1),
      new THREE.Vector3(Math.sin(a+1.2)*2.1, Math.cos(a+1.2)*2.1, -0.05)
    );
    addPart(new THREE.Mesh(new THREE.TubeGeometry(curve,14,0.03,7,false), M.leaf()), 5, 2);
  }

  const fring = new THREE.Mesh(new THREE.TorusGeometry(0.92,0.13,14,52), M.brass(0.32, 0.92));
  fring.position.z = 0.12;
  addPart(fring, 4, 4);

  const fi = new THREE.Mesh(new THREE.TorusGeometry(0.76,0.04,8,44), M.brassD());
  fi.position.z = 0.14;
  addPart(fi, 3, 3);

  const fd = new THREE.Mesh(new THREE.CylinderGeometry(0.91,0.91,0.06,50), M.face());
  fd.rotation.x = Math.PI / 2;
  fd.position.z = 0.10;
  addPart(fd, 3, 4);

  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    const t = new THREE.Mesh(new THREE.BoxGeometry(0.033,0.13,0.033), M.brass(0.38, 0.90));
    t.position.set(Math.sin(a)*0.72, Math.cos(a)*0.72, 0.16);
    t.rotation.z = -a;
    addPart(t, 5, 3);
  }

  const hh = new THREE.Mesh(new THREE.BoxGeometry(0.058,0.55,0.04), M.hand());
  hh.position.set(0.09, 0.19, 0.19);
  hh.rotation.z = -0.3;
  addPart(hh, 4, 5);

  const mh = new THREE.Mesh(new THREE.BoxGeometry(0.04,0.73,0.04), M.hand(0xc09020));
  mh.position.set(-0.13, 0.27, 0.19);
  mh.rotation.z = 0.5;
  addPart(mh, 4, 5);

  const cj = new THREE.Mesh(new THREE.SphereGeometry(0.10,14,14), M.brass(0.12, 1.0));
  cj.position.z = 0.22;
  addPart(cj, 2, 6);

  return { group, parts };
}

/* ══════════════════════════════════════════════════════
   SCENE
══════════════════════════════════════════════════════ */
class ClockScene {
  constructor(canvas, isMobile) {
    this.canvas = canvas;
    this.mobile = isMobile;
    this.scroll = 0;
    this._t    = 0;
    this._last = Date.now();
    this.init();
  }

  init() {
    const w = this.canvas.offsetWidth, h = this.canvas.offsetHeight;
    const dpr = Math.min(window.devicePixelRatio, this.mobile ? 1.5 : 2);

    this.renderer = new THREE.WebGLRenderer({ canvas:this.canvas, antialias:!this.mobile, alpha:true });
    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(dpr);
    this.renderer.shadowMap.enabled = false;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.3;

    this.scene  = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(38, w/h, 0.1, 120);
    this.camera.position.set(0, 0, this.mobile ? 11 : 8.5);

    /* Lighting */
    this.scene.add(new THREE.AmbientLight(0x201810, 0.65));
    const key = new THREE.DirectionalLight(0xffd060, 2.8); key.position.set(5,7,6); this.scene.add(key);
    const fill = new THREE.DirectionalLight(0xd46a06, 0.75); fill.position.set(-6,2,3); this.scene.add(fill);
    const rim = new THREE.DirectionalLight(0x20c0b0, 0.55); rim.position.set(0,-5,-3); this.scene.add(rim);
    this.wLight = new THREE.PointLight(0xff8800, 2.4, 16); this.wLight.position.set(3,3,5); this.scene.add(this.wLight);
    this.tLight = new THREE.PointLight(0x20c0b0, 0.9, 12); this.tLight.position.set(-4,-2,3); this.scene.add(this.tLight);

    /* Clocks */
    const w1 = buildWallClock();
    const w2 = buildTowerClock();
    const w3 = buildFloralClock();
    this.clocks = [
      { group:w1.group, parts:w1.parts },
      { group:w2.group, parts:w2.parts },
      { group:w3.group, parts:w3.parts },
    ];
    this.clocks.forEach(c => { c.group.visible = false; this.scene.add(c.group); });

    /* Particles */
    const count = this.mobile ? 100 : 220;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i*3]   = (Math.sin(i*9301)*0.5+0.5 - 0.5) * 22;
      pos[i*3+1] = (Math.sin(i*6271)*0.5+0.5 - 0.5) * 16;
      pos[i*3+2] = (Math.sin(i*3491)*0.5+0.5 - 0.5) * 12 - 2;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos,3));
    this.dust = new THREE.Points(geo, new THREE.PointsMaterial({ color:0xd4a830, size:0.055, transparent:true, opacity:0.40, sizeAttenuation:true }));
    this.scene.add(this.dust);

    this.animate();
  }

  setScroll(p) { this.scroll = p; }

  animate() {
    this.animId = requestAnimationFrame(() => this.animate());
    const now = Date.now();
    const dt  = Math.min((now - this._last) / 1000, 0.05);
    this._t  += dt; this._last = now;
    const t = this._t, p = this.scroll;

    /*
      Clock windows (scroll 0–1):
        Clock 0 (wall):   assemble 0.00–0.22, hold, disassemble 0.28–0.38
        Clock 1 (tower):  assemble 0.33–0.55, hold, disassemble 0.62–0.72
        Clock 2 (floral): assemble 0.66–0.88, hold 0.88–1.0 (never disassembles)
    */
    const windows = [
      { ai:0.00, af:0.22, di:0.28, df:0.38 },
      { ai:0.33, af:0.55, di:0.62, df:0.72 },
      { ai:0.66, af:0.88, di:1.10, df:1.20 },
    ];

    this.clocks.forEach((c, i) => {
      const w = windows[i];
      let lp = 0;
      if (p < w.ai)       lp = 0;
      else if (p < w.af)  lp = (p - w.ai) / (w.af - w.ai);
      else if (p < w.di)  lp = 1;
      else if (p < w.df)  lp = 1 - (p - w.di) / (w.df - w.di);
      else                lp = 0;

      c.group.visible = lp > 0.001;
      if (!c.group.visible) return;

      c.parts.forEach(part => part.update(lp));

      /* Gentle idle sway once fully assembled */
      if (lp > 0.97) {
        c.group.rotation.y = Math.sin(t * 0.18) * 0.10;
        c.group.rotation.x = Math.sin(t * 0.22) * 0.05;
      } else {
        c.group.rotation.y *= 0.92;
        c.group.rotation.x *= 0.92;
      }
    });

    /* Camera drift */
    const cx = Math.sin(t*0.11)*0.5;
    const cy = Math.cos(t*0.09)*0.3 - p*0.4;
    const cz = (this.mobile ? 11 : 8.5) - p*0.8;
    this.camera.position.lerp(new THREE.Vector3(cx, cy, cz), 0.028);
    this.camera.lookAt(0, p*-0.2, 0);

    /* Particles */
    this.dust.rotation.y = t * 0.014;
    this.dust.rotation.x = t * 0.008;
    this.dust.material.opacity = 0.28 + Math.sin(t*0.55)*0.10;

    /* Lights */
    this.wLight.intensity = 2.0 + Math.sin(t*1.85)*0.55;
    this.wLight.position.x = Math.sin(t*0.3)*4.5;
    this.wLight.position.y = Math.cos(t*0.22)*3.5 + 2;
    this.tLight.intensity  = 0.6 + Math.sin(t*0.7+1)*0.3;

    this.renderer.render(this.scene, this.camera);
  }

  resize() {
    const w = this.canvas.offsetWidth, h = this.canvas.offsetHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  }

  destroy() {
    cancelAnimationFrame(this.animId);
    this.renderer.dispose();
  }
}

/* ══════════════════════════════════════════════════════
   REACT CANVAS
══════════════════════════════════════════════════════ */
function ThreeCanvas({ scrollProgress }) {
  const ref = useRef(null);
  const sceneRef = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    const mobile = window.innerWidth < 768;
    sceneRef.current = new ClockScene(ref.current, mobile);
    const onResize = () => sceneRef.current?.resize();
    window.addEventListener('resize', onResize);
    return () => { window.removeEventListener('resize', onResize); sceneRef.current?.destroy(); };
  }, []);

  useEffect(() => { sceneRef.current?.setScroll(scrollProgress); }, [scrollProgress]);

  return <canvas ref={ref} style={{ width:'100%', height:'100%', display:'block' }} />;
}

/* ══════════════════════════════════════════════════════
   UI COMPONENTS
══════════════════════════════════════════════════════ */
function VisReveal({ children, delay=0, style={} }) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if(e.isIntersecting) setVis(true); }, { threshold:0.15 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ opacity:vis?1:0, transform:vis?'none':'translateY(24px)', transition:`opacity 0.9s ease ${delay}s, transform 1.1s cubic-bezier(0.16,1,0.3,1) ${delay}s`, ...style }}>
      {children}
    </div>
  );
}

function GoldRule({ delay=0 }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:'0.7rem', margin:'1.5rem 0', opacity:0, animation:`fadeIn 0.8s ease ${delay}s forwards` }}>
      <div style={{ flex:1, height:'1px', background:`linear-gradient(to right,transparent,${C.goldDim})` }} />
      {[0,1,2].map(i => <div key={i} style={{ width:4,height:4,background:i===1?C.gold:C.goldDim,transform:'rotate(45deg)' }} />)}
      <div style={{ flex:1, height:'1px', background:`linear-gradient(to left,transparent,${C.goldDim})` }} />
    </div>
  );
}

function AssemblyIndicator({ progress }) {
  const ws = [
    { ai:0.00, af:0.22, di:0.28, df:0.38, label:'I' },
    { ai:0.33, af:0.55, di:0.62, df:0.72, label:'II' },
    { ai:0.66, af:0.88, di:1.10, df:1.20, label:'III' },
  ];
  return (
    <div style={{ position:'fixed', right:'clamp(0.8rem,2.5vw,2.2rem)', top:'50%', transform:'translateY(-50%)', zIndex:100, display:'flex', flexDirection:'column', gap:'0.7rem', alignItems:'center' }}>
      {ws.map((w, i) => {
        let lp = 0;
        if (progress >= w.ai && progress < w.af) lp = (progress-w.ai)/(w.af-w.ai);
        else if (progress >= w.af && progress <= w.di) lp = 1;
        const active = progress >= w.ai && progress <= w.df;
        const r=12, circ=2*Math.PI*r;
        return (
          <div key={i} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'3px' }}>
            <svg width="32" height="32" viewBox="0 0 32 32">
              <circle cx="16" cy="16" r={r} fill="none" stroke="rgba(212,168,67,0.1)" strokeWidth="1.5" />
              <circle cx="16" cy="16" r={r} fill="none" stroke={active?C.gold:C.goldDim} strokeWidth={active?2:1}
                strokeDasharray={circ} strokeDashoffset={circ*(1-lp)}
                strokeLinecap="round" transform="rotate(-90 16 16)"
                style={{ transition:'stroke-dashoffset 0.25s linear' }}
              />
            </svg>
            <span style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:'0.42rem', letterSpacing:'0.15em', color:active?C.gold:'rgba(212,168,67,0.2)' }}>{w.label}</span>
          </div>
        );
      })}
    </div>
  );
}

function StageLabel({ progress }) {
  const stages = [
    { range:[0.00,0.38], label:'WALL CLOCK', sub:'Grand Meridian — No. IV' },
    { range:[0.33,0.72], label:'TOWER CLOCK', sub:'The Sentinel — No. XII' },
    { range:[0.66,1.00], label:'FLORAL CLOCK', sub:'Jardine Bloom — No. VIII' },
  ];
  const active = stages.filter(s => progress >= s.range[0] && progress <= s.range[1]).pop();
  if (!active) return null;
  const local = (progress - active.range[0]) / (active.range[1] - active.range[0]);
  const fade  = local < 0.12 ? local/0.12 : local > 0.88 ? (1-local)/0.12 : 1;
  return (
    <div style={{ position:'absolute', bottom:'clamp(2rem,5vw,3.5rem)', left:'50%', transform:'translateX(-50%)', textAlign:'center', opacity:fade, transition:'opacity 0.4s', pointerEvents:'none', whiteSpace:'nowrap' }}>
      <p style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:'clamp(0.52rem,1.1vw,0.65rem)', letterSpacing:'0.48em', color:C.goldDim, marginBottom:'0.3rem' }}>{active.label}</p>
      <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(0.82rem,1.5vw,1.02rem)', color:C.creamDim, fontStyle:'italic' }}>{active.sub}</p>
    </div>
  );
}

const SECTIONS = [
  { range:[0.22,0.36], tag:'THE WALL COLLECTION', title:'Grand Meridian',
    body:'Hand-gilded bezels and slow-beat pendulum movements. Each piece assembled by a single horologist over forty days.',
    specs:['Swiss lever escapement','Hand-engraved dial','25-year guarantee','Bespoke sizing'], accent:C.gold },
  { range:[0.55,0.68], tag:'THE TOWER COLLECTION', title:'The Sentinel',
    body:'Monumental time for civic spaces and heritage estates. Cast iron cases with brass complications weighing 42 kilograms.',
    specs:['Westminster chime','Cast iron & brass','Heights to 4.2m','Bespoke commission'], accent:C.tealGlow },
  { range:[0.88,1.00], tag:'THE FLORAL COLLECTION', title:'Jardine Bloom',
    body:'Bronze petals cast from live botanical specimens. No two flowers are alike. The pinnacle of horological sculpture.',
    specs:['Lost-wax bronze casting','Botanical moulds','Weather-resistant patina','Artisan signed'], accent:C.copper },
];

function InfoCards({ progress }) {
  return (
    <>
      {SECTIONS.map(({ range,tag,title,body,specs,accent }, i) => {
        const local = Math.max(0,Math.min(1,(progress-range[0])/(range[1]-range[0])));
        const fade  = local < 0.18 ? local/0.18 : local > 0.82 ? (1-local)/0.18 : 1;
        return (
          <div key={i} style={{ position:'absolute', right:0, top:'50%', transform:`translateY(calc(-50% + ${(1-fade)*40}px))`, width:'clamp(260px,33vw,390px)', opacity:fade, transition:'opacity 0.35s, transform 0.45s cubic-bezier(0.16,1,0.3,1)', pointerEvents:fade>0.1?'all':'none', margin:'0 clamp(0.8rem,3vw,3rem)' }}>
            <div style={{ background:'rgba(4,3,10,0.90)', border:`1px solid ${accent}33`, padding:'clamp(1.2rem,2.5vw,2.2rem)', backdropFilter:'blur(14px)', position:'relative', overflow:'hidden' }}>
              <div style={{ position:'absolute', top:0, left:0, right:0, height:'2px', background:`linear-gradient(to right,transparent,${accent},transparent)` }} />
              <p style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:'0.5rem', letterSpacing:'0.4em', color:C.goldDim, marginBottom:'0.8rem' }}>{tag}</p>
              <h3 style={{ fontFamily:"'Bodoni Moda',serif", fontSize:'clamp(1.5rem,2.8vw,2.1rem)', color:C.cream, fontWeight:400, fontStyle:'italic', lineHeight:1.1, marginBottom:'0.25rem' }}>{title}</h3>
              <div style={{ height:'1px', background:`linear-gradient(to right,${accent}55,transparent)`, margin:'1rem 0' }} />
              <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'0.93rem', color:C.creamDim, fontStyle:'italic', lineHeight:1.85, marginBottom:'1.3rem' }}>{body}</p>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.35rem 0.6rem', marginBottom:'1.4rem' }}>
                {specs.map(s => (
                  <div key={s} style={{ display:'flex', alignItems:'center', gap:'0.45rem' }}>
                    <div style={{ width:3,height:3,background:accent,transform:'rotate(45deg)',flexShrink:0 }} />
                    <span style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:'0.48rem', letterSpacing:'0.07em', color:C.goldDim }}>{s}</span>
                  </div>
                ))}
              </div>
              <div style={{ height:'1px', background:`linear-gradient(to right,${accent}44,transparent)`, marginBottom:'1.2rem' }} />
              <button style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:'0.5rem', letterSpacing:'0.22em', color:accent, background:'transparent', border:`1px solid ${accent}44`, padding:'0.6rem 1.4rem', cursor:'pointer', width:'100%', transition:'background 0.3s' }}
                onMouseEnter={e => e.currentTarget.style.background = accent+'18'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >EXPLORE COLLECTION →</button>
            </div>
          </div>
        );
      })}
    </>
  );
}

function HeroSection({ progress }) {
  const fade = Math.max(0, 1 - progress * 5);
  return (
    <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', padding:'0 clamp(1.5rem,8vw,7rem)', pointerEvents:'none', opacity:fade }}>
      <div style={{ maxWidth:540 }}>
        <div style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:'clamp(0.5rem,1.1vw,0.6rem)', letterSpacing:'0.55em', color:C.goldDim, marginBottom:'1.1rem', animation:'slideUp 1s ease 0.3s both' }}>EST. MDCCCXLVII · MASTERS OF TIME</div>
        <h1 style={{ fontFamily:"'Bodoni Moda',serif", fontSize:'clamp(3rem,6.5vw,6rem)', color:C.cream, fontWeight:400, lineHeight:1.0, fontStyle:'italic', animation:'slideUp 1s ease 0.55s both', marginBottom:'0.25rem' }}>
          <span style={{ display:'block', color:C.goldPale }}>Tempus</span>
          <span style={{ display:'block', fontSize:'68%', fontStyle:'normal', fontWeight:300, letterSpacing:'0.14em', color:C.creamDim }}>MAGNIFICUS</span>
        </h1>
        <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(0.95rem,1.7vw,1.15rem)', color:C.creamDim, lineHeight:1.9, fontStyle:'italic', animation:'slideUp 1s ease 0.8s both', marginBottom:'2rem', maxWidth:400 }}>
          Watch each timepiece assemble before your eyes.<br />Scroll to unveil the craft.
        </p>
        <div style={{ display:'flex', flexWrap:'wrap', gap:'0.85rem', animation:'slideUp 1s ease 1.0s both', pointerEvents:'all' }}>
          <button className="btn-primary">VIEW COLLECTION</button>
          <button className="btn-ghost">OUR HERITAGE</button>
        </div>
        <div style={{ marginTop:'2.5rem', display:'flex', alignItems:'center', gap:'0.75rem', animation:'slideUp 1s ease 1.25s both', opacity:0.45 }}>
          <div style={{ width:'1px', height:'40px', background:`linear-gradient(to bottom,${C.gold},transparent)` }} />
          <span style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:'0.5rem', letterSpacing:'0.3em', color:C.goldDim }}>SCROLL TO ASSEMBLE</span>
        </div>
      </div>
    </div>
  );
}

function Marquee() {
  const items = ['WALL CLOCKS','TOWER CLOCKS','FLORAL CLOCKS','HANDCRAFTED SINCE 1847','HEIRLOOM PRECISION','BESPOKE COMMISSIONS'];
  return (
    <div style={{ overflow:'hidden', borderTop:`1px solid rgba(212,168,67,0.12)`, borderBottom:`1px solid rgba(212,168,67,0.12)`, padding:'0.75rem 0', background:'#020108' }}>
      <div style={{ display:'flex', animation:'marquee 28s linear infinite', gap:'4rem', width:'max-content' }}>
        {[...items,...items].map((t,i) => (
          <span key={i} style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:'0.56rem', letterSpacing:'0.3em', color:'#2a1e08', whiteSpace:'nowrap' }}>
            <span style={{ color:C.goldDim, marginRight:'0.9rem' }}>◆</span>{t}
          </span>
        ))}
      </div>
    </div>
  );
}

function BottomCTA() {
  const stats = [['175+','YEARS OF CRAFT'],['6,400+','CLOCKS PLACED'],['34','COUNTRIES'],['3','COLLECTIONS']];
  return (
    <>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(120px,1fr))', background:'#04030a' }}>
        {stats.map(([v,l],i) => (
          <VisReveal key={l} delay={i*0.09}>
            <div style={{ padding:'2.5rem 1.5rem', textAlign:'center', borderRight:i<stats.length-1?`1px solid rgba(212,168,67,0.08)`:'none', borderBottom:`1px solid rgba(212,168,67,0.08)` }}>
              <div style={{ fontFamily:"'Bodoni Moda',serif", fontSize:'clamp(2.2rem,3.8vw,3.2rem)', color:C.gold, fontWeight:400, lineHeight:1 }}>{v}</div>
              <div style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:'0.48rem', letterSpacing:'0.2em', color:C.goldDim, marginTop:'0.5rem' }}>{l}</div>
            </div>
          </VisReveal>
        ))}
      </div>

      <section style={{ background:'radial-gradient(ellipse at 30% 0%,#100a20 0%,#04030a 60%)', padding:'clamp(4rem,9vw,9rem) 2rem clamp(4rem,7vw,7rem)', position:'relative', overflow:'hidden' }}>
        {[{top:'2rem',left:'2rem'},{top:'2rem',right:'2rem'},{bottom:'2rem',left:'2rem'},{bottom:'2rem',right:'2rem'}].map((pos,i) => (
          <div key={i} style={{ position:'absolute',...pos,width:28,height:28,borderTop:i<2?`1px solid ${C.goldDim}`:'none',borderBottom:i>=2?`1px solid ${C.goldDim}`:'none',borderLeft:i%2===0?`1px solid ${C.goldDim}`:'none',borderRight:i%2!==0?`1px solid ${C.goldDim}`:'none',opacity:0.5 }} />
        ))}
        <div style={{ maxWidth:680, margin:'0 auto', textAlign:'center' }}>
          <VisReveal><p style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:'0.54rem', letterSpacing:'0.5em', color:C.goldDim, marginBottom:'1.4rem' }}>COMMISSION YOUR TIMEPIECE</p></VisReveal>
          <VisReveal delay={0.15}>
            <h2 style={{ fontFamily:"'Bodoni Moda',serif", fontSize:'clamp(2rem,4.8vw,4.2rem)', color:C.cream, fontWeight:400, fontStyle:'italic', lineHeight:1.1, marginBottom:'1rem' }}>
              Every great room deserves<br />a <em style={{ color:C.goldPale }}>timeless</em> centrepiece
            </h2>
          </VisReveal>
          <VisReveal delay={0.3}>
            <GoldRule delay={0.3} />
            <p style={{ fontFamily:"'Cormorant Garamond',serif", color:C.creamDim, fontSize:'clamp(0.93rem,1.5vw,1.08rem)', lineHeight:1.95, fontStyle:'italic', marginBottom:'2.6rem' }}>
              Our master horologists collaborate with architects, curators, and private collectors to create bespoke clocks that will outlast every generation that inherits them.
            </p>
          </VisReveal>
          <VisReveal delay={0.45}>
            <button className="btn-primary" style={{ pointerEvents:'all' }}>BEGIN YOUR COMMISSION</button>
          </VisReveal>
          <VisReveal delay={0.65}>
            <GoldRule delay={0.65} />
            <p style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:'0.46rem', letterSpacing:'0.4em', color:'#201608' }}>TEMPUS MAGNIFICUS · MASTERS OF TIME · EST. MDCCCXLVII</p>
          </VisReveal>
        </div>
      </section>
    </>
  );
}

/* ══════════════════════════════════════════════════════
   ROOT
══════════════════════════════════════════════════════ */
export default function ClockScroll3D() {
  const scrollRef = useRef(null);
  const [progress, setProgress] = useState(0);

  const onScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const scrollable = el.offsetHeight - window.innerHeight;
    setProgress(Math.min(1, Math.max(0, -rect.top / scrollable)));
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', onScroll, { passive:true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [onScroll]);

  return (
    <>
      <style>{`
        ${FONTS}
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        html { scroll-behavior:smooth; }
        body { background:${C.bg}; overflow-x:hidden; }
        @keyframes slideUp { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:none} }
        @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
        @keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        .btn-primary {
          font-family:'Josefin Sans',sans-serif; font-size:0.58rem; letter-spacing:0.28em;
          background:${C.gold}; color:#04030a; border:none; padding:0.9rem 2.2rem;
          cursor:pointer; transition:opacity 0.25s,transform 0.25s,box-shadow 0.25s;
        }
        .btn-primary:hover { opacity:0.85; transform:translateY(-2px); box-shadow:0 8px 28px rgba(212,168,67,0.32); }
        .btn-ghost {
          font-family:'Josefin Sans',sans-serif; font-size:0.58rem; letter-spacing:0.28em;
          color:${C.gold}; background:transparent; border:1px solid ${C.goldDim}; padding:0.9rem 2.2rem;
          cursor:pointer; transition:background 0.3s,transform 0.25s;
        }
        .btn-ghost:hover { background:rgba(212,168,67,0.08); transform:translateY(-2px); }
        @media(max-width:640px){ .btn-primary,.btn-ghost{width:100%;text-align:center;} }
      `}</style>

      <AssemblyIndicator progress={progress} />

      <div ref={scrollRef} style={{ height:'550vh', position:'relative' }}>
        <div style={{ position:'sticky', top:0, height:'100vh', width:'100%', overflow:'hidden', background:'radial-gradient(ellipse at 25% 30%,#100a1e 0%,#04030a 55%,#060200 100%)' }}>

          <div style={{ position:'absolute', inset:0 }}>
            <ThreeCanvas scrollProgress={progress} />
          </div>

          {/* Vignettes */}
          <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse 78% 78% at 50% 50%,transparent 30%,rgba(4,3,10,0.62) 100%)', pointerEvents:'none' }} />
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(to right,rgba(4,3,10,0.4) 0%,transparent 35%,transparent 65%,rgba(4,3,10,0.4) 100%)', pointerEvents:'none' }} />
          <div style={{ position:'absolute', bottom:'8%', left:'4%', width:'28vw', height:'28vw', borderRadius:'50%', background:'radial-gradient(circle,rgba(32,192,176,0.07) 0%,transparent 70%)', pointerEvents:'none' }} />

          <HeroSection progress={progress} />
          <InfoCards progress={progress} />
          <StageLabel progress={progress} />

          {/* Nav */}
          <nav style={{ position:'absolute', top:0, left:0, right:0, padding:'clamp(1rem,2.5vw,1.8rem) clamp(1.5rem,6vw,5rem)', display:'flex', justifyContent:'space-between', alignItems:'center', background:'linear-gradient(to bottom,rgba(4,3,10,0.88),transparent)', zIndex:10 }}>
            <div>
              <div style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:'clamp(0.68rem,1.4vw,0.88rem)', letterSpacing:'0.35em', color:C.cream, fontWeight:300 }}>TEMPUS</div>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'0.6rem', color:C.goldDim, letterSpacing:'0.22em', fontStyle:'italic' }}>Magnificus</div>
            </div>
            <div style={{ display:'flex', gap:'clamp(1rem,3vw,2.5rem)' }}>
              {['Collection','Heritage','Bespoke','Contact'].map(item => (
                <a key={item} href="#" style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:'clamp(0.44rem,0.95vw,0.54rem)', letterSpacing:'0.2em', color:C.goldDim, textDecoration:'none', transition:'color 0.3s' }}
                  onMouseEnter={e => e.currentTarget.style.color = C.gold}
                  onMouseLeave={e => e.currentTarget.style.color = C.goldDim}
                >{item.toUpperCase()}</a>
              ))}
            </div>
          </nav>

          <div style={{ position:'absolute', bottom:'2rem', left:'50%', transform:'translateX(-50%)', textAlign:'center', opacity:Math.max(0,1-progress*9), pointerEvents:'none', display:'flex', flexDirection:'column', alignItems:'center', gap:'0.4rem' }}>
            <span style={{ fontFamily:"'Josefin Sans',sans-serif", fontSize:'0.46rem', letterSpacing:'0.3em', color:C.goldDim }}>SCROLL TO ASSEMBLE</span>
            <div style={{ width:'1px', height:'30px', background:`linear-gradient(to bottom,${C.gold},transparent)`, animation:'fadeIn 2s ease infinite alternate' }} />
          </div>
        </div>
      </div>

      <Marquee />
      <BottomCTA />
    </>
  );
}