import { useState, useEffect, useRef } from "react";

const D = {
  name: "Arjun Menon", firstName: "Arjun", lastName: "Menon",
  role: "Full‑Stack Engineer",
  tagline: "Building digital products people love.",
  about: "7+ years crafting fast, beautiful web experiences. I care as much about architecture as aesthetics — every layer, every pixel.",
  email: "arjun.menon@gmail.com", phone: "+91 98765 43210", place: "Kochi, Kerala",
  profilePhoto: "https://i.pravatar.cc/900?img=68",
  qualification: "B.Tech CS · NIT Calicut", cv: "/cv.pdf",
  skills: ["React","Node.js","TypeScript","MongoDB","GraphQL","Docker","AWS","Figma","Python","Redis","Next.js","PostgreSQL"],
  services: [
    { heading: "Product Engineering", description: "End-to-end web apps — from architecture to deployment, obsessively optimised.", emoji: "⚡" },
    { heading: "Interface Design", description: "Every pixel earned, every animation purposeful. UIs that feel inevitable.", emoji: "◈" },
    { heading: "API & Backend", description: "Scalable REST & GraphQL systems with clean domain logic.", emoji: "🔗" },
    { heading: "Cloud & DevOps", description: "Containerised, automated infrastructure on AWS & GCP.", emoji: "☁" },
  ],
  experience: [
    { jobTitle: "Senior Frontend Engineer", company: "Infosys Ltd.", startDate: "2022-06-01", endDate: null },
    { jobTitle: "Full‑Stack Developer", company: "Zoho Corporation", startDate: "2019-08-01", endDate: "2022-05-31" },
    { jobTitle: "Junior Developer", company: "TCS", startDate: "2017-07-01", endDate: "2019-07-31" },
  ],
  education: [
    { education: "B.Tech — Computer Science", institution: "NIT Calicut", year: 2017, percentage: "8.7 CGPA" },
    { education: "Higher Secondary", institution: "St. Joseph's HSS", year: 2013, percentage: "94%" },
  ],
  projects: [
    { title: "DevBoard", description: "Real-time dev dashboard unifying GitHub, Jira & Slack.", link: "#", year: "2024", emoji: "📊" },
    { title: "ShopSphere", description: "Multi-tenant e-commerce with live inventory & Stripe.", link: "#", year: "2023", emoji: "🛒" },
    { title: "AIResume", description: "AI resume scorer & rewriter. 2K+ users in month one.", link: "#", year: "2023", emoji: "🤖" },
    { title: "NoteStack", description: "Collaborative markdown workspace, real-time sync.", link: null, year: "2022", emoji: "📝" },
  ],
  socials: [{ linkedin:"https://linkedin.com", github:"https://github.com", twitter:"https://twitter.com", website:"https://arjunmenon.dev" }],
  lookingVacancy: ["Full-Stack Eng","Frontend Lead","Co-founder"],
};

const soc = D.socials?.[0] || {};
const fmt = d => !d ? "Present" : new Date(d).toLocaleDateString("en-US",{month:"short",year:"numeric"});
const expYrs = D.experience?.length ? new Date().getFullYear() - new Date(D.experience[D.experience.length-1].startDate).getFullYear() : 7;

/* ══════════════ TYPEWRITER ══════════════════════════════ */
function Typewriter({ text, speed = 48 }) {
  const [display, setDisplay] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      setDisplay(text.slice(0, i + 1));
      i++;
      if (i >= text.length) { clearInterval(id); setDone(true); }
    }, speed);
    return () => clearInterval(id);
  }, [text]);
  return (
    <span>
      {display}
      {!done && <span style={{ borderRight: "3px solid #FF4D4D", marginLeft: 2, animation: "blink-cur .7s step-end infinite" }}>&nbsp;</span>}
    </span>
  );
}

/* ══════════════ COUNTER ═════════════════════════════════ */
function Counter({ to }) {
  const [v, setV] = useState(0); const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return; obs.disconnect();
      let c = 0;
      const id = setInterval(() => { c = Math.min(c + Math.ceil(to / 40), to); setV(c); if (c >= to) clearInterval(id); }, 28);
    }, { threshold: .5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [to]);
  return <span ref={ref}>{v}</span>;
}

/* ══════════════ REVEAL HOOK ═════════════════════════════ */
function useReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("rv-on"); }), { threshold: .1 });
    document.querySelectorAll(".rv").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  });
}

/* ══════════════ CURSOR ══════════════════════════════════ */
function Cursor() {
  const dot = useRef(null), ring = useRef(null);
  const rp = useRef({ x: -300, y: -300 }), mp = useRef({ x: -300, y: -300 });
  useEffect(() => {
    const mv = e => { mp.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener("mousemove", mv);
    let raf;
    const tick = () => {
      rp.current.x += (mp.current.x - rp.current.x) * .12;
      rp.current.y += (mp.current.y - rp.current.y) * .12;
      if (dot.current) { dot.current.style.left = mp.current.x + "px"; dot.current.style.top = mp.current.y + "px"; }
      if (ring.current) { ring.current.style.left = rp.current.x + "px"; ring.current.style.top = rp.current.y + "px"; }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const over = e => { if (e.target.closest("a,button,[data-h]")) document.body.classList.add("hov"); };
    const out = () => document.body.classList.remove("hov");
    document.addEventListener("mouseover", over);
    document.addEventListener("mouseout", out);
    return () => { window.removeEventListener("mousemove", mv); cancelAnimationFrame(raf); document.removeEventListener("mouseover", over); document.removeEventListener("mouseout", out); };
  }, []);
  return (<><div id="cd" ref={dot} /><div id="cr" ref={ring} /></>);
}

/* ══════════════ STYLES ══════════════════════════════════ */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap');

  :root {
    --bg:    #F5F4F0;
    --white: #FFFFFF;
    --ink:   #0F0F0E;
    --coral: #FF4D4D;
    --coral-light: #FFECEC;
    --mid:   #7A7A72;
    --border:#E2E0D8;
  }

  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
  html { scroll-behavior:smooth; }
  body { background:var(--bg); color:var(--ink); font-family:'Space Grotesk',sans-serif; -webkit-font-smoothing:antialiased; overflow-x:hidden; cursor:none; }
  a { color:inherit; text-decoration:none; }
  img { display:block; max-width:100%; }

  /* CURSOR */
  #cd { position:fixed; z-index:9999; pointer-events:none; width:8px; height:8px; border-radius:50%; background:var(--coral); transform:translate(-50%,-50%); }
  #cr { position:fixed; z-index:9998; pointer-events:none; width:32px; height:32px; border-radius:50%; border:1.5px solid rgba(255,77,77,.45); transform:translate(-50%,-50%); transition:width .18s,height .18s; }
  body.hov #cr { width:48px; height:48px; border-color:var(--coral); }

  /* REVEAL */
  .rv { opacity:0; transform:translateY(30px); transition:opacity .7s cubic-bezier(.16,1,.3,1), transform .7s cubic-bezier(.16,1,.3,1); }
  .rv.rv-on { opacity:1; transform:none; }
  .rd1{transition-delay:.07s}.rd2{transition-delay:.14s}.rd3{transition-delay:.21s}.rd4{transition-delay:.28s}

  /* NAV */
  .nav { position:fixed; top:0; inset-inline:0; z-index:700; height:64px; display:flex; align-items:center; justify-content:space-between; padding:0 clamp(1rem,4vw,3.5rem); transition:background .3s,box-shadow .3s; }
  .nav.inked { background:rgba(245,244,240,.92); backdrop-filter:blur(18px); box-shadow:0 1px 0 var(--border); }
  .nlogo { font-family:'Space Mono',monospace; font-size:1.1rem; font-weight:700; cursor:none; letter-spacing:-.02em; display:flex; align-items:center; gap:6px; }
  .nlogo-badge { background:var(--coral); color:#fff; font-size:.6rem; font-weight:700; padding:2px 7px; border-radius:3px; letter-spacing:.06em; text-transform:uppercase; }
  .nlinks { display:flex; gap:2rem; align-items:center; list-style:none; }
  .nlk { font-size:.78rem; font-weight:600; letter-spacing:.06em; background:none; border:none; cursor:none; color:var(--mid); transition:color .18s; }
  .nlk:hover { color:var(--coral); }
  .nav-cta { padding:9px 22px; background:var(--ink); color:#fff; border:none; border-radius:6px; font-family:'Space Grotesk',sans-serif; font-size:.78rem; font-weight:700; cursor:none; transition:background .2s,transform .15s; letter-spacing:.04em; }
  .nav-cta:hover { background:var(--coral); transform:translateY(-1px); }

  /* ══ HERO BENTO ══ */
  .hero-bento {
    max-width:1280px; margin:0 auto;
    padding:90px clamp(1rem,4vw,3.5rem) 40px;
    display:grid;
    grid-template-columns: 1.1fr 0.9fr;
    grid-template-rows: auto auto;
    gap:14px;
  }

  /* Card base */
  .card { background:var(--white); border-radius:20px; border:1px solid var(--border); overflow:hidden; position:relative; }

  /* ── CARD A: big intro text ── */
  .card-a {
    grid-column:1; grid-row:1;
    padding:2.8rem 3rem;
    display:flex; flex-direction:column; justify-content:space-between;
    min-height:340px;
  }
  .card-a-eyebrow { display:flex; align-items:center; gap:.7rem; margin-bottom:2rem; }
  .avail-pill { display:inline-flex; align-items:center; gap:.5rem; padding:6px 14px; background:var(--coral-light); border-radius:50px; font-size:.7rem; font-weight:700; color:var(--coral); letter-spacing:.06em; text-transform:uppercase; }
  .avail-dot { width:6px; height:6px; border-radius:50%; background:#22c55e; box-shadow:0 0 0 3px rgba(34,197,94,.2); animation:pulse 2s infinite; }
  .card-a-name { font-family:'Space Mono',monospace; font-size:clamp(2.6rem,5vw,4.4rem); font-weight:700; line-height:.9; letter-spacing:-.04em; color:var(--ink); margin-bottom:1.6rem; }
  .card-a-name .stroke { -webkit-text-stroke:2px var(--ink); color:transparent; }
  .card-a-tagline { font-size:1.05rem; font-weight:400; color:var(--mid); line-height:1.7; font-family:'Space Mono',monospace; min-height:1.7em; margin-bottom:2rem; }
  .card-a-actions { display:flex; gap:.8rem; flex-wrap:wrap; }
  .btn-coral { display:inline-flex; align-items:center; gap:.5rem; padding:12px 26px; background:var(--coral); color:#fff; border:none; border-radius:8px; font-family:'Space Grotesk',sans-serif; font-weight:700; font-size:.86rem; cursor:none; letter-spacing:.03em; transition:transform .2s,box-shadow .2s; box-shadow:0 4px 16px rgba(255,77,77,.3); }
  .btn-coral:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(255,77,77,.4); }
  .btn-ghost { display:inline-flex; align-items:center; gap:.5rem; padding:12px 26px; background:transparent; color:var(--ink); border:1.5px solid var(--border); border-radius:8px; font-family:'Space Grotesk',sans-serif; font-weight:700; font-size:.86rem; cursor:none; transition:border-color .2s,color .2s; }
  .btn-ghost:hover { border-color:var(--ink); }

  /* ── CARD B: profile photo ── */
  .card-b {
    grid-column:2; grid-row:1 / 3;
    min-height:500px; position:relative;
    background:var(--ink);
  }
  .card-b img { width:100%; height:100%; object-fit:cover; object-position:center top; display:block; filter:contrast(1.05) saturate(1.1); }
  .card-b-overlay { position:absolute; inset:0; background:linear-gradient(to top, rgba(15,15,14,.7) 0%, transparent 50%); }
  .card-b-bottom { position:absolute; bottom:0; left:0; right:0; padding:2rem; }
  .card-b-role { font-family:'Space Mono',monospace; font-size:.65rem; font-weight:700; letter-spacing:.18em; text-transform:uppercase; color:rgba(255,255,255,.45); margin-bottom:.35rem; }
  .card-b-name { font-family:'Space Mono',monospace; font-size:1.5rem; font-weight:700; color:#fff; letter-spacing:-.02em; }
  /* coral accent stripe on left */
  .card-b::before { content:''; position:absolute; left:0; top:0; bottom:0; width:4px; background:var(--coral); z-index:2; }
  /* sticker chip */
  .card-b-sticker { position:absolute; top:1.4rem; right:1.4rem; background:var(--coral); color:#fff; border-radius:10px; padding:.8rem 1rem; text-align:center; z-index:3; transform:rotate(3deg); box-shadow:4px 4px 0 rgba(0,0,0,.25); }
  .sticker-n { font-family:'Space Mono',monospace; font-size:1.8rem; font-weight:700; line-height:1; letter-spacing:-.04em; }
  .sticker-l { font-size:.58rem; font-weight:700; letter-spacing:.1em; text-transform:uppercase; opacity:.8; margin-top:1px; }

  /* ── CARD C: stats strip ── */
  .card-c {
    grid-column:1; grid-row:2;
    padding:1.8rem 2.5rem;
    display:flex; align-items:center; gap:0;
    background:var(--ink);
  }
  .stat-item { flex:1; text-align:center; }
  .stat-item + .stat-item { border-left:1px solid rgba(255,255,255,.1); }
  .stat-n { font-family:'Space Mono',monospace; font-size:2.2rem; font-weight:700; color:#fff; line-height:1; letter-spacing:-.04em; }
  .stat-n span { color:var(--coral); }
  .stat-l { font-size:.62rem; font-weight:600; letter-spacing:.16em; text-transform:uppercase; color:rgba(255,255,255,.35); margin-top:.35rem; }

  /* ══ SECTION SHARED ══ */
  .section { padding:60px clamp(1rem,4vw,3.5rem); }
  .section-inner { max-width:1280px; margin:0 auto; }
  .s-label { display:inline-flex; align-items:center; gap:.5rem; font-size:.65rem; font-weight:700; letter-spacing:.2em; text-transform:uppercase; color:var(--coral); margin-bottom:.7rem; }
  .s-label::before { content:''; width:18px; height:2px; background:var(--coral); }
  .s-title { font-family:'Space Mono',monospace; font-size:clamp(2rem,4vw,3rem); font-weight:700; letter-spacing:-.04em; line-height:.9; color:var(--ink); margin-bottom:3.5rem; }
  .s-title em { font-style:normal; color:var(--coral); }

  /* ══ SERVICES: horizontal list cards ══ */
  .svc-bento { display:grid; grid-template-columns:repeat(2,1fr); gap:12px; }
  .svc-card { background:var(--white); border:1px solid var(--border); border-radius:16px; padding:2rem; transition:all .22s cubic-bezier(.34,1.56,.64,1); cursor:default; }
  .svc-card:hover { transform:translateY(-5px); box-shadow:0 12px 36px rgba(0,0,0,.07); border-color:var(--coral); }
  .svc-card:hover .svc-emoji { transform:scale(1.3) rotate(10deg); }
  .svc-emoji { font-size:2rem; display:block; margin-bottom:1rem; transition:transform .3s cubic-bezier(.34,1.56,.64,1); }
  .svc-h { font-family:'Space Mono',monospace; font-size:1rem; font-weight:700; color:var(--ink); margin-bottom:.5rem; letter-spacing:-.01em; }
  .svc-d { font-size:.84rem; font-weight:400; color:var(--mid); line-height:1.65; }

  /* ══ SKILLS ══ */
  .skills-wrap { display:flex; flex-wrap:wrap; gap:9px; }
  .sk { padding:9px 20px; border:1.5px solid var(--border); border-radius:8px; font-size:.82rem; font-weight:600; color:var(--ink); background:var(--white); cursor:default; transition:all .2s; font-family:'Space Mono',monospace; letter-spacing:.02em; }
  .sk:hover { border-color:var(--coral); color:var(--coral); background:var(--coral-light); transform:translateY(-3px); }

  /* ══ PROJECTS: masonry feel ══ */
  .proj-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:12px; }
  .proj-card { background:var(--white); border:1px solid var(--border); border-radius:16px; padding:2rem; display:flex; flex-direction:column; gap:.9rem; transition:all .22s; cursor:default; position:relative; overflow:hidden; }
  .proj-card::after { content:''; position:absolute; inset:0; border-radius:16px; border:2px solid var(--coral); opacity:0; transition:opacity .22s; pointer-events:none; }
  .proj-card:hover { transform:translateY(-5px); box-shadow:0 16px 40px rgba(0,0,0,.08); }
  .proj-card:hover::after { opacity:1; }
  .proj-top-row { display:flex; justify-content:space-between; align-items:flex-start; }
  .proj-emoji { font-size:1.9rem; }
  .proj-year-chip { font-size:.62rem; font-weight:700; letter-spacing:.1em; text-transform:uppercase; background:var(--bg); border:1px solid var(--border); border-radius:5px; padding:3px 9px; color:var(--mid); font-family:'Space Mono',monospace; }
  .proj-h { font-family:'Space Mono',monospace; font-size:1.2rem; font-weight:700; color:var(--ink); letter-spacing:-.02em; }
  .proj-d { font-size:.84rem; color:var(--mid); line-height:1.62; flex:1; }
  .proj-link { display:inline-flex; align-items:center; gap:.4rem; font-size:.72rem; font-weight:700; color:var(--coral); letter-spacing:.06em; text-transform:uppercase; transition:gap .2s; }
  .proj-link:hover { gap:.7rem; }
  .proj-link.dead { color:rgba(122,122,114,.3); cursor:default; pointer-events:none; }

  /* ══ JOURNEY ══ */
  .journey-grid { display:grid; grid-template-columns:1fr 1fr; gap:4rem; }
  .j-head { font-size:.62rem; font-weight:700; letter-spacing:.2em; text-transform:uppercase; color:var(--mid); padding-bottom:1rem; border-bottom:2px solid var(--border); margin-bottom:0; font-family:'Space Mono',monospace; }
  .exp-row { padding:1.4rem 0; border-bottom:1px solid var(--border); display:flex; justify-content:space-between; align-items:flex-start; gap:1rem; }
  .exp-row:last-child { border-bottom:none; }
  .exp-role { font-family:'Space Mono',monospace; font-size:.92rem; font-weight:700; color:var(--ink); margin-bottom:.2rem; letter-spacing:-.01em; }
  .exp-co { font-size:.78rem; color:var(--mid); }
  .exp-date { font-size:.65rem; font-weight:700; color:var(--coral); white-space:nowrap; text-align:right; flex-shrink:0; padding-top:3px; line-height:1.7; font-family:'Space Mono',monospace; }
  .edu-card { padding:1.3rem 1.5rem; border:1.5px solid var(--border); border-radius:12px; margin-bottom:8px; transition:all .22s; cursor:default; border-left:3px solid var(--coral); }
  .edu-card:hover { transform:translateX(4px); box-shadow:0 6px 20px rgba(0,0,0,.06); }
  .edu-deg { font-family:'Space Mono',monospace; font-size:.9rem; font-weight:700; color:var(--ink); margin-bottom:.2rem; }
  .edu-inst { font-size:.78rem; color:var(--mid); margin-bottom:.6rem; }
  .edu-tags { display:flex; gap:6px; flex-wrap:wrap; }
  .edu-tag { font-size:.62rem; font-weight:700; padding:3px 10px; background:var(--coral-light); color:var(--coral); border-radius:5px; font-family:'Space Mono',monospace; }

  /* ══ CONTACT BENTO ══ */
  .contact-grid { display:grid; grid-template-columns:1.2fr 0.8fr; gap:12px; }
  .contact-main { background:var(--ink); border-radius:20px; padding:3.5rem; position:relative; overflow:hidden; }
  .contact-main::before { content:''; position:absolute; top:-100px; right:-100px; width:350px; height:350px; border-radius:50%; background:rgba(255,77,77,.07); }
  .contact-big { font-family:'Space Mono',monospace; font-size:clamp(2.2rem,4.5vw,3.5rem); font-weight:700; color:#fff; line-height:.88; letter-spacing:-.04em; margin-bottom:1.5rem; }
  .contact-big em { font-style:normal; color:var(--coral); }
  .contact-sub { font-size:.92rem; color:rgba(255,255,255,.5); line-height:1.65; margin-bottom:2.5rem; }
  .soc-row { display:flex; gap:8px; flex-wrap:wrap; }
  .soc-b { padding:9px 18px; background:rgba(255,255,255,.07); border:1px solid rgba(255,255,255,.1); border-radius:8px; font-size:.72rem; font-weight:700; color:rgba(255,255,255,.5); letter-spacing:.06em; transition:all .18s; }
  .soc-b:hover { background:rgba(255,77,77,.15); border-color:rgba(255,77,77,.4); color:var(--coral); }
  .contact-side { display:flex; flex-direction:column; gap:12px; }
  .contact-item { background:var(--white); border:1px solid var(--border); border-radius:16px; padding:1.6rem 2rem; transition:all .22s; }
  .contact-item:hover { border-color:var(--coral); transform:translateY(-2px); }
  .ci-l { font-size:.6rem; font-weight:700; letter-spacing:.18em; text-transform:uppercase; color:var(--mid); margin-bottom:.3rem; font-family:'Space Mono',monospace; }
  .ci-v { font-family:'Space Mono',monospace; font-size:1rem; font-weight:700; color:var(--ink); transition:color .18s; display:block; }
  .ci-v:hover { color:var(--coral); }

  /* VACANCY TAGS */
  .vac-row { display:flex; flex-wrap:wrap; gap:7px; margin-top:1.5rem; }
  .vac { padding:6px 13px; border:1px solid rgba(255,77,77,.25); border-radius:6px; font-size:.65rem; font-weight:700; color:rgba(255,77,77,.8); letter-spacing:.08em; text-transform:uppercase; font-family:'Space Mono',monospace; }

  /* FOOT */
  .foot { padding:1.4rem clamp(1rem,4vw,3.5rem); border-top:1px solid var(--border); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:.8rem; max-width:1280px; margin:0 auto; }
  .foot p { font-size:.65rem; font-weight:600; color:rgba(15,15,14,.3); letter-spacing:.08em; font-family:'Space Mono',monospace; }

  /* MARQUEE */
  .mq { overflow:hidden; background:var(--coral); padding:14px 0; }
  .mq-t { display:flex; animation:mq-anim 20s linear infinite; white-space:nowrap; }
  .mq-i { display:inline-flex; align-items:center; gap:1.2rem; padding:0 1.6rem; font-family:'Space Mono',monospace; font-size:.9rem; font-weight:700; color:rgba(255,255,255,.5); letter-spacing:.06em; }
  .mq-i span { color:rgba(255,255,255,.2); }

  /* MOBILE */
  @media(max-width:960px) {
    .hero-bento { grid-template-columns:1fr !important; }
    .card-b { grid-row:auto !important; min-height:280px; max-height:380px; }
    .journey-grid { grid-template-columns:1fr !important; gap:2.5rem !important; }
    .svc-bento { grid-template-columns:1fr !important; }
    .contact-grid { grid-template-columns:1fr !important; }
  }
  @media(max-width:640px) {
    .desk-nav { display:none !important; }
    .mob-ham { display:flex !important; }
  }

  @keyframes pulse { 0%,100%{box-shadow:0 0 0 3px rgba(34,197,94,.2)} 50%{box-shadow:0 0 0 6px rgba(34,197,94,.05)} }
  @keyframes mq-anim { from{transform:translateX(0)} to{transform:translateX(-50%)} }
  @keyframes blink-cur { 0%,100%{opacity:1} 50%{opacity:0} }
  @keyframes pop-in { from{opacity:0;transform:scale(.7) rotate(-8deg)} to{opacity:1;transform:scale(1) rotate(0)} }
`;

/* ══════════════ NAV ═════════════════════════════════════ */
function Nav() {
  const [s, setS] = useState(false), [open, setOpen] = useState(false);
  useEffect(() => { const h = () => setS(window.scrollY > 50); window.addEventListener("scroll", h); return () => window.removeEventListener("scroll", h); }, []);
  const go = id => { setOpen(false); document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); };
  const links = [
    D.services?.length && ["services", "Services"],
    D.projects?.length && ["projects", "Work"],
    (D.experience?.length || D.education?.length) && ["journey", "Journey"],
    ["contact", "Contact"],
  ].filter(Boolean);
  return (
    <nav className={`nav${s ? " inked" : ""}`}>
      <div className="nlogo" onClick={() => go("hero")}>
        {D.firstName}.<span className="nlogo-badge">dev</span>
      </div>
      <ul className="nlinks desk-nav" style={{ display: "flex", gap: "2rem", listStyle: "none", alignItems: "center" }}>
        {links.map(([id, lbl]) => <li key={id}><button className="nlk" onClick={() => go(id)}>{lbl}</button></li>)}
        {D.cv && <li><button className="nav-cta" onClick={() => window.open(D.cv)}>Download CV</button></li>}
      </ul>
      <button className="mob-ham" onClick={() => setOpen(o => !o)} style={{ display: "none", background: "none", border: "none", cursor: "none", flexDirection: "column", gap: 5 }}>
        {[0, 1, 2].map(i => <span key={i} style={{ display: "block", width: 22, height: 2, background: "var(--ink)", borderRadius: 2, transition: "all .25s", transform: open && i === 0 ? "translateY(7px) rotate(45deg)" : open && i === 2 ? "translateY(-7px) rotate(-45deg)" : open && i === 1 ? "scaleX(0)" : "none" }} />)}
      </button>
      {open && (
        <div style={{ position: "absolute", top: 64, left: 0, right: 0, background: "#fff", borderBottom: "1px solid var(--border)", padding: "1rem 1.5rem 2rem", boxShadow: "0 8px 30px rgba(0,0,0,.08)" }}>
          {links.map(([id, lbl]) => <button key={id} onClick={() => go(id)} style={{ display: "block", width: "100%", textAlign: "left", background: "none", border: "none", borderBottom: "1px solid var(--border)", cursor: "none", padding: "13px 0", fontFamily: "'Space Mono',monospace", fontWeight: 700, fontSize: "1.1rem", color: "var(--ink)" }}>{lbl}</button>)}
        </div>
      )}
    </nav>
  );
}

/* ══════════════ HERO ════════════════════════════════════ */
function Hero() {
  const [inn, setInn] = useState(false);
  useEffect(() => { setTimeout(() => setInn(true), 100); }, []);
  const a = (d = 0) => ({ opacity: inn ? 1 : 0, transform: inn ? "none" : "translateY(22px)", transition: `opacity .85s cubic-bezier(.16,1,.3,1) ${d}ms, transform .85s cubic-bezier(.16,1,.3,1) ${d}ms` });

  return (
    <div id="hero" className="hero-bento">
      {/* CARD A — intro */}
      <div className="card card-a" style={a(0)}>
        <div>
          <div className="card-a-eyebrow">
            <div className="avail-pill"><div className="avail-dot" /> Available for work</div>
          </div>
          <div className="card-a-name">
            {D.firstName}<br />
            <span className="stroke">{D.lastName}</span>
          </div>
          <p className="card-a-tagline">
            <Typewriter text={D.tagline} speed={52} />
          </p>
          {D.about && <p style={{ fontSize: ".9rem", color: "var(--mid)", lineHeight: 1.7, marginBottom: "1.8rem", maxWidth: 440 }}>{D.about}</p>}
        </div>
        <div className="card-a-actions">
          <button className="btn-coral" onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}>
            Get in touch →
          </button>
          {D.cv && <a href={D.cv} className="btn-ghost">Download CV</a>}
        </div>
      </div>

      {/* CARD B — photo */}
      {D.profilePhoto && (
        <div className="card card-b" style={{ ...a(120), gridRow: "1 / 3" }}>
          <img src={D.profilePhoto} alt={D.name} />
          <div className="card-b-overlay" />
          <div className="card-b-sticker">
            <div className="sticker-n">{expYrs}+</div>
            <div className="sticker-l">Years</div>
          </div>
          <div className="card-b-bottom">
            <div className="card-b-role">{D.role}</div>
            <div className="card-b-name">{D.name}</div>
          </div>
        </div>
      )}

      {/* CARD C — stats */}
      <div className="card card-c" style={a(200)}>
        {[[expYrs, "Exp. Years"], [D.projects?.length || 4, "Projects"], [D.skills?.length || 12, "Skills"]].map(([n, l]) => (
          <div key={l} className="stat-item">
            <div className="stat-n"><Counter to={n} /><span>+</span></div>
            <div className="stat-l">{l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════ MARQUEE ═════════════════════════════════ */
function Marquee() {
  const items = D.skills?.length ? [...D.skills, ...D.skills, ...D.skills, ...D.skills] : [];
  return (
    <div className="mq">
      <div className="mq-t">
        {items.map((sk, i) => <span key={i} className="mq-i">{sk}<span>◆</span></span>)}
      </div>
    </div>
  );
}

/* ══════════════ SERVICES ════════════════════════════════ */
function Services() {
  if (!D.services?.length) return null;
  return (
    <section id="services" className="section" style={{ background: "var(--bg)" }}>
      <div className="section-inner">
        <div className="rv">
          <div className="s-label">What I offer</div>
          <h2 className="s-title">Services &<br /><em>Expertise</em></h2>
        </div>
        <div className="svc-bento rv rd1">
          {D.services.map((sv, i) => (
            <div key={i} className={`svc-card rv rd${i + 1}`}>
              <span className="svc-emoji">{sv.emoji}</span>
              <div className="svc-h">{sv.heading}</div>
              <div className="svc-d">{sv.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════ SKILLS ══════════════════════════════════ */
function Skills() {
  if (!D.skills?.length) return null;
  return (
    <section className="section" style={{ background: "var(--white)", paddingTop: 50, paddingBottom: 50 }}>
      <div className="section-inner">
        <div className="s-label rv" style={{ marginBottom: "1.4rem" }}>Tech Stack</div>
        <div className="skills-wrap rv rd1">
          {D.skills.map((sk, i) => <span key={i} className={`sk rv rd${Math.min(i % 4 + 1, 4)}`}>{sk}</span>)}
        </div>
      </div>
    </section>
  );
}

/* ══════════════ PROJECTS ════════════════════════════════ */
function Projects() {
  if (!D.projects?.length) return null;
  return (
    <section id="projects" className="section" style={{ background: "var(--bg)" }}>
      <div className="section-inner">
        <div className="rv">
          <div className="s-label">Portfolio</div>
          <h2 className="s-title">Selected<br /><em>Work</em></h2>
        </div>
        <div className="proj-grid rv rd1">
          {D.projects.map((p, i) => (
            <div key={i} className="proj-card">
              <div className="proj-top-row">
                <span className="proj-emoji">{p.emoji}</span>
                <span className="proj-year-chip">{p.year}</span>
              </div>
              <div className="proj-h">{p.title}</div>
              <div className="proj-d">{p.description}</div>
              {p.link
                ? <a href={p.link} target="_blank" rel="noreferrer" className="proj-link">View <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M7 17L17 7M7 7h10v10" /></svg></a>
                : <span className="proj-link dead">Private 🔒</span>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════ JOURNEY ═════════════════════════════════ */
function Journey() {
  const hE = D.experience?.length > 0, hD = D.education?.length > 0;
  if (!hE && !hD) return null;
  return (
    <section id="journey" className="section" style={{ background: "var(--white)" }}>
      <div className="section-inner">
        <div className="rv">
          <div className="s-label">Background</div>
          <h2 className="s-title">My<br /><em>Journey</em></h2>
        </div>
        <div className="journey-grid">
          {hE && (
            <div className="rv rd1">
              <div className="j-head">Work Experience</div>
              {D.experience.map((e, i) => (
                <div key={i} className="exp-row">
                  <div>
                    <div className="exp-role">{e.jobTitle}</div>
                    <div className="exp-co">{e.company}</div>
                  </div>
                  <div className="exp-date">{fmt(e.startDate)}<br />—<br />{fmt(e.endDate)}</div>
                </div>
              ))}
            </div>
          )}
          {hD && (
            <div className="rv rd2">
              <div className="j-head">Education</div>
              {D.education.map((e, i) => (
                <div key={i} className="edu-card">
                  <div className="edu-deg">{e.education}</div>
                  <div className="edu-inst">{e.institution}</div>
                  <div className="edu-tags">
                    {e.year && <span className="edu-tag">{e.year}</span>}
                    {e.percentage && <span className="edu-tag">{e.percentage}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ══════════════ CONTACT ═════════════════════════════════ */
function Contact() {
  return (
    <section id="contact" className="section" style={{ background: "var(--bg)" }}>
      <div className="section-inner">
        <div className="rv">
          <div className="s-label">Get in touch</div>
          <h2 className="s-title">Let's<br /><em>Connect</em></h2>
        </div>
        <div className="contact-grid rv rd1">
          <div className="contact-main">
            <div className="contact-big">Let's build<br />something<br /><em>great.</em></div>
            <div className="contact-sub">Open to projects, roles & collabs. I reply within 24 hours.</div>
            <div className="soc-row">
              {soc.linkedin && <a href={soc.linkedin} target="_blank" rel="noreferrer" className="soc-b">LinkedIn</a>}
              {soc.github && <a href={soc.github} target="_blank" rel="noreferrer" className="soc-b">GitHub</a>}
              {soc.twitter && <a href={soc.twitter} target="_blank" rel="noreferrer" className="soc-b">Twitter</a>}
              {soc.website && <a href={soc.website} target="_blank" rel="noreferrer" className="soc-b">Website</a>}
            </div>
            {D.lookingVacancy?.length > 0 && (
              <div className="vac-row">
                {D.lookingVacancy.map((v, i) => <span key={i} className="vac">{v}</span>)}
              </div>
            )}
          </div>
          <div className="contact-side">
            {D.email && (
              <div className="contact-item">
                <div className="ci-l">Email</div>
                <a href={`mailto:${D.email}`} className="ci-v">{D.email}</a>
              </div>
            )}
            {D.phone && (
              <div className="contact-item">
                <div className="ci-l">Phone</div>
                <a href={`tel:${D.phone}`} className="ci-v">{D.phone}</a>
              </div>
            )}
            {D.place && (
              <div className="contact-item">
                <div className="ci-l">Location</div>
                <div className="ci-v" style={{ cursor: "default", opacity: .6 }}>{D.place}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════ APP ═════════════════════════════════════ */
export default function Profile11() {
  useReveal();
  return (
    <>
      <style>{CSS}</style>
      <Cursor />
      <Nav />
      <Hero />
      <Marquee />
      <Services />
      <Skills />
      <Projects />
      <Journey />
      <Contact />
      <footer style={{ background: "var(--bg)" }}>
        <div className="foot">
          <p>© {new Date().getFullYear()} {D.name} — All rights reserved</p>
          <p>{D.place}</p>
        </div>
      </footer>
    </>
  );
}