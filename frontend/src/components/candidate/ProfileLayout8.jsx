import { useState, useEffect, useRef, useCallback } from "react";

const DEMO = {
  name: "Alex Smith",
  email: "alex@example.com",
  phone: "+1 (555) 234-5678",
  place: "San Francisco, CA",
  profilePhoto: "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-profiles/avatar-1.webp",
  cv: "",
  about: "I craft fast, accessible, and beautiful web experiences. Passionate about clean code, thoughtful UI, and turning complex problems into elegant solutions at the intersection of design and engineering.",
  tagline: "Frontend Developer",
  qualification: "B.Sc. Computer Science",
  services: [
    { heading: "UI Development", description: "Pixel-perfect interfaces built with React, Tailwind, and modern CSS that feel alive." },
    { heading: "Performance", description: "Lighthouse in the green. Lazy-loading, code-splitting, edge delivery at scale." },
    { heading: "Design Systems", description: "Scalable component libraries with Storybook, tokens, and clean Figma handoffs." },
    { heading: "API Integration", description: "REST & GraphQL wiring, caching strategies, real-time WebSocket features." },
  ],
  skills: ["React", "TypeScript", "Node.js", "Tailwind CSS", "GraphQL", "Figma", "Next.js", "PostgreSQL", "AWS", "Docker"],
  education: [
    { education: "B.Sc. Computer Science", institution: "Stanford University", year: 2018, percentage: "3.9 GPA" },
    { education: "High School Diploma", institution: "Lincoln High School", year: 2014, percentage: "95%" },
  ],
  experience: [
    { jobTitle: "Senior Frontend Engineer", company: "Stripe", startDate: "2021-06-01", endDate: null },
    { jobTitle: "Frontend Developer", company: "Figma", startDate: "2019-02-01", endDate: "2021-05-31" },
    { jobTitle: "Junior Developer", company: "Agency X", startDate: "2018-08-01", endDate: "2019-01-31" },
  ],
  lookingVacancy: ["Senior Frontend Engineer", "Tech Lead", "UI Architect"],
};


/* ── STYLES ─────────────────────────────────────────────── */
const STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,700;0,800;1,700&display=swap');
  @import url('https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@800,700&display=swap');

  :root {
    --bg: #05070f;
    --bg2: #080c18;
    --glass: rgba(255,255,255,.04);
    --glass-border: rgba(255,255,255,.08);
    --cyan: #22d3ee;
    --cyan2: #06b6d4;
    --blue: #3b82f6;
    --text: #e2e8f0;
    --muted: rgba(226,232,240,.45);
    --r: 20px;
  }

  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
  html { scroll-behavior:smooth; }
  body { background:var(--bg); color:var(--text); font-family:'Plus Jakarta Sans',sans-serif; -webkit-font-smoothing:antialiased; overflow-x:hidden; cursor:none; }
  a { color:inherit; text-decoration:none; }
  img { display:block; max-width:100%; }

  /* CURSOR */
  #cur-dot  { position:fixed; z-index:9999; pointer-events:none; width:6px; height:6px; border-radius:50%; background:var(--cyan); transform:translate(-50%,-50%); transition:width .2s,height .2s; mix-blend-mode:screen; }
  #cur-ring { position:fixed; z-index:9998; pointer-events:none; width:38px; height:38px; border-radius:50%; border:1px solid rgba(34,211,238,.4); transform:translate(-50%,-50%); }
  body.hovering #cur-dot  { width:14px; height:14px; }
  body.hovering #cur-ring { width:54px; height:54px; border-color:rgba(34,211,238,.7); }

  /* BLOB CURSOR GLOW */
  #blob { position:fixed; z-index:0; pointer-events:none; width:600px; height:600px; border-radius:50%; background:radial-gradient(circle, rgba(34,211,238,.07) 0%, transparent 70%); transform:translate(-50%,-50%); transition:left .8s cubic-bezier(.16,1,.3,1), top .8s cubic-bezier(.16,1,.3,1); }

  /* NAV */
  .nav { position:fixed; top:0; left:0; right:0; z-index:700; height:70px; display:flex; align-items:center; justify-content:space-between; padding:0 clamp(1.2rem,4vw,4rem); transition:all .4s; }
  .nav.solid { background:rgba(5,7,15,.85); backdrop-filter:blur(24px); border-bottom:1px solid var(--glass-border); }
  .nav-logo { font-family:'Cabinet Grotesk',sans-serif; font-size:1.4rem; font-weight:800; cursor:pointer; background:linear-gradient(135deg,#fff 30%,var(--cyan)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
  .nav-links { display:flex; gap:2rem; align-items:center; list-style:none; }
  .nav-btn { font-family:'Plus Jakarta Sans',sans-serif; font-size:.78rem; font-weight:600; letter-spacing:.1em; text-transform:uppercase; background:none; border:none; cursor:none; color:var(--muted); transition:color .2s; padding:2px 0; }
  .nav-btn:hover { color:var(--cyan); }
  .nav-cv { padding:9px 22px; background:linear-gradient(135deg,var(--cyan2),var(--blue)); border-radius:50px; font-size:.75rem; font-weight:700; letter-spacing:.08em; text-transform:uppercase; color:#fff; border:none; cursor:none; transition:opacity .2s,transform .2s; box-shadow:0 0 20px rgba(34,211,238,.25); }
  .nav-cv:hover { opacity:.9; transform:translateY(-1px); }

  /* HERO */
  .hero { position:relative; min-height:100vh; display:flex; align-items:flex-end; overflow:hidden; }
  .hero-bg { position:absolute; inset:0; z-index:0; }
  .hero-img { position:absolute; inset:0; object-fit:cover; object-position:center top; width:100%; height:100%; filter:brightness(.45) saturate(1.2); }
  .hero-gradient { position:absolute; inset:0; background:linear-gradient(to bottom, rgba(5,7,15,.2) 0%, rgba(5,7,15,.1) 30%, rgba(5,7,15,.7) 70%, rgba(5,7,15,1) 100%); }
  .hero-gradient2 { position:absolute; inset:0; background:radial-gradient(ellipse at 70% 40%, rgba(34,211,238,.12) 0%, transparent 60%); }
  .hero-noise { position:absolute; inset:0; opacity:.03; background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); }

  /* hero content */
  .hero-content { position:relative; z-index:2; width:100%; padding:0 clamp(1.2rem,4vw,4rem) 80px; max-width:1300px; margin:0 auto; }
  .hero-eyebrow { display:inline-flex; align-items:center; gap:.7rem; padding:7px 16px; background:var(--glass); border:1px solid var(--glass-border); border-radius:50px; backdrop-filter:blur(12px); margin-bottom:2rem; }
  .hero-eyebrow-dot { width:7px; height:7px; border-radius:50%; background:#22c55e; box-shadow:0 0 8px #22c55e; animation:blink 2s infinite; }
  .hero-eyebrow-text { font-size:.72rem; font-weight:600; letter-spacing:.14em; text-transform:uppercase; color:rgba(226,232,240,.6); }
  .hero-name { font-family:'Cabinet Grotesk',sans-serif; font-size:clamp(4rem,11vw,10rem); font-weight:800; line-height:.85; letter-spacing:-.04em; margin-bottom:2rem; }
  .hero-name-1 { display:block; color:#fff; }
  .hero-name-2 { display:block; background:linear-gradient(135deg, var(--cyan) 0%, var(--blue) 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
  .hero-tagline { font-size:clamp(1rem,2vw,1.3rem); color:rgba(226,232,240,.65); font-weight:400; line-height:1.6; max-width:500px; margin-bottom:3rem; white-space:pre-line; }
  .hero-actions { display:flex; gap:1rem; flex-wrap:wrap; margin-bottom:4rem; }
  .btn-glow { display:inline-flex; align-items:center; gap:.6rem; padding:15px 34px; background:linear-gradient(135deg,var(--cyan2),var(--blue)); border:none; border-radius:50px; font-family:'Plus Jakarta Sans',sans-serif; font-weight:700; font-size:.88rem; letter-spacing:.05em; color:#fff; cursor:none; transition:all .3s; box-shadow:0 0 30px rgba(34,211,238,.3); }
  .btn-glow:hover { box-shadow:0 0 50px rgba(34,211,238,.5); transform:translateY(-2px); }
  .btn-glass { display:inline-flex; align-items:center; gap:.6rem; padding:14px 32px; background:var(--glass); border:1px solid var(--glass-border); border-radius:50px; font-family:'Plus Jakarta Sans',sans-serif; font-weight:600; font-size:.88rem; color:var(--text); cursor:none; transition:all .3s; backdrop-filter:blur(12px); }
  .btn-glass:hover { border-color:rgba(34,211,238,.4); color:var(--cyan); }

  /* hero bottom meta */
  .hero-meta { display:flex; gap:3rem; flex-wrap:wrap; }
  .hero-stat { }
  .hero-stat-n { font-family:'Cabinet Grotesk',sans-serif; font-size:2.2rem; font-weight:800; background:linear-gradient(135deg,#fff,var(--cyan)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; line-height:1; }
  .hero-stat-l { font-size:.7rem; font-weight:600; letter-spacing:.14em; text-transform:uppercase; color:var(--muted); margin-top:3px; }

  /* FLOATING PHOTO CARD */
  .photo-float { position:absolute; right:clamp(1.2rem,6vw,6rem); bottom:80px; z-index:3; }
  .photo-float-inner { width:clamp(180px,18vw,260px); aspect-ratio:3/4; border-radius:24px; overflow:hidden; border:1px solid rgba(34,211,238,.2); box-shadow:0 30px 80px rgba(0,0,0,.6), 0 0 60px rgba(34,211,238,.1); position:relative; }
  .photo-float-inner img { width:100%; height:100%; object-fit:cover; object-position:center top; }
  .photo-float-inner::before { content:''; position:absolute; inset:0; background:linear-gradient(to bottom, transparent 50%, rgba(5,7,15,.6)); z-index:1; }
  .photo-float-tag { position:absolute; bottom:1rem; left:1rem; right:1rem; z-index:2; }
  .photo-float-tag p { font-size:.68rem; font-weight:600; letter-spacing:.1em; text-transform:uppercase; color:var(--cyan); margin:0; }
  .photo-float-tag h3 { font-family:'Cabinet Grotesk',sans-serif; font-size:1.05rem; font-weight:800; color:#fff; margin:2px 0 0; }

  /* SECTIONS */
  .sec { padding:110px clamp(1.2rem,4vw,4rem); position:relative; z-index:1; }
  .sec-inner { max-width:1200px; margin:0 auto; }
  .sec-label { font-size:.7rem; font-weight:700; letter-spacing:.22em; text-transform:uppercase; color:var(--cyan); margin-bottom:.7rem; display:flex; align-items:center; gap:.7rem; }
  .sec-label::before { content:''; width:30px; height:1px; background:var(--cyan); display:inline-block; }
  .sec-h { font-family:'Cabinet Grotesk',sans-serif; font-size:clamp(2.4rem,5vw,4rem); font-weight:800; line-height:.92; letter-spacing:-.03em; color:#fff; margin-bottom:5rem; }
  .sec-h em { font-style:italic; background:linear-gradient(135deg,var(--cyan),var(--blue)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }

  /* REVEAL */
  .rv { opacity:0; transform:translateY(40px); transition:opacity .8s cubic-bezier(.16,1,.3,1), transform .8s cubic-bezier(.16,1,.3,1); }
  .rv.on { opacity:1; transform:none; }
  .rv.d1 { transition-delay:.1s; } .rv.d2 { transition-delay:.2s; } .rv.d3 { transition-delay:.3s; } .rv.d4 { transition-delay:.4s; }

  /* SKILLS TICKER */
  .ticker-wrap { overflow:hidden; padding:20px 0; border-top:1px solid var(--glass-border); border-bottom:1px solid var(--glass-border); background:rgba(255,255,255,.015); }
  .ticker-track { display:flex; animation:ticker 30s linear infinite; white-space:nowrap; }
  .ticker-item { display:inline-flex; align-items:center; gap:1.5rem; padding:0 2.5rem; font-family:'Cabinet Grotesk',sans-serif; font-size:1.1rem; font-weight:700; letter-spacing:.04em; color:rgba(255,255,255,.15); }
  .ticker-sep { color:var(--cyan); font-size:.5rem; opacity:.7; }
  @keyframes ticker { from{transform:translateX(0)} to{transform:translateX(-50%)} }

  /* SERVICES */
  .svc-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(260px,1fr)); gap:1.5px; background:var(--glass-border); border-radius:var(--r); overflow:hidden; }
  .svc-card { background:var(--bg2); padding:2.5rem 2.2rem; position:relative; overflow:hidden; transition:background .3s; cursor:default; }
  .svc-card::after { content:''; position:absolute; inset:0; background:radial-gradient(circle at 50% 0%, rgba(34,211,238,.07) 0%, transparent 70%); opacity:0; transition:opacity .3s; }
  .svc-card:hover { background:rgba(34,211,238,.03); }
  .svc-card:hover::after { opacity:1; }
  .svc-card:hover .svc-icon { color:var(--cyan); text-shadow:0 0 20px var(--cyan); }
  .svc-icon { font-size:2.2rem; color:rgba(255,255,255,.1); margin-bottom:1.5rem; display:block; transition:color .3s,text-shadow .3s; }
  .svc-title { font-family:'Cabinet Grotesk',sans-serif; font-size:1.25rem; font-weight:800; color:#fff; margin-bottom:.7rem; letter-spacing:-.01em; }
  .svc-desc { font-size:.85rem; color:var(--muted); line-height:1.75; }

  /* SKILLS */
  .skill-pill { padding:9px 20px; border:1px solid var(--glass-border); border-radius:50px; font-size:.82rem; font-weight:600; color:var(--muted); background:var(--glass); cursor:default; transition:all .25s; display:inline-block; }
  .skill-pill:hover { border-color:var(--cyan); color:var(--cyan); background:rgba(34,211,238,.06); box-shadow:0 0 16px rgba(34,211,238,.12); }

  /* PROJECTS */
  .proj-grid { display:grid; grid-template-columns:1fr 1fr; gap:1.5px; background:var(--glass-border); border-radius:var(--r); overflow:hidden; }
  .proj-card { background:var(--bg2); padding:2.8rem; position:relative; overflow:hidden; cursor:default; transition:background .3s; }
  .proj-card::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; background:linear-gradient(90deg,transparent,var(--proj-color,var(--cyan)),transparent); transform:scaleX(0); transition:transform .4s ease; }
  .proj-card:hover { background:rgba(255,255,255,.025); }
  .proj-card:hover::before { transform:scaleX(1); }
  .proj-num { font-family:'Cabinet Grotesk',sans-serif; font-size:4rem; font-weight:800; color:rgba(255,255,255,.04); position:absolute; top:1.5rem; right:1.8rem; line-height:1; transition:color .3s; }
  .proj-card:hover .proj-num { color:rgba(255,255,255,.07); }
  .proj-year { font-size:.68rem; font-weight:700; letter-spacing:.16em; text-transform:uppercase; color:var(--muted); margin-bottom:1rem; }
  .proj-title { font-family:'Cabinet Grotesk',sans-serif; font-size:1.7rem; font-weight:800; color:#fff; letter-spacing:-.02em; margin-bottom:.8rem; transition:color .3s; }
  .proj-card:hover .proj-title { color:var(--proj-color,var(--cyan)); }
  .proj-desc { font-size:.88rem; color:var(--muted); line-height:1.7; margin-bottom:1.5rem; }
  .proj-link { display:inline-flex; align-items:center; gap:.5rem; font-size:.78rem; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:var(--muted); transition:color .2s,gap .2s; }
  .proj-link:hover { color:var(--cyan); gap:.8rem; }

  /* JOURNEY */
  .journey-grid { display:grid; grid-template-columns:1fr 1fr; gap:4rem; }
  .j-label { font-size:.7rem; font-weight:700; letter-spacing:.2em; text-transform:uppercase; color:var(--cyan); margin-bottom:2rem; padding-bottom:1rem; border-bottom:1px solid var(--glass-border); }
  .exp-item { padding:1.5rem 0; border-bottom:1px solid var(--glass-border); display:flex; justify-content:space-between; gap:1rem; }
  .exp-item:last-child { border-bottom:none; }
  .exp-role { font-family:'Cabinet Grotesk',sans-serif; font-size:1.08rem; font-weight:800; color:#fff; letter-spacing:-.01em; margin-bottom:.25rem; }
  .exp-co { font-size:.82rem; color:var(--muted); }
  .exp-date { font-size:.7rem; color:var(--cyan); white-space:nowrap; flex-shrink:0; text-align:right; padding-top:3px; font-weight:600; }
  .edu-card { padding:1.6rem; background:var(--glass); border:1px solid var(--glass-border); border-radius:14px; margin-bottom:8px; transition:border-color .25s; }
  .edu-card:hover { border-color:rgba(34,211,238,.25); }
  .edu-deg { font-family:'Cabinet Grotesk',sans-serif; font-size:1.05rem; font-weight:800; color:#fff; margin-bottom:.25rem; }
  .edu-inst { font-size:.82rem; color:var(--muted); margin-bottom:.8rem; }
  .edu-badge { display:inline-block; padding:3px 12px; border:1px solid var(--glass-border); border-radius:50px; font-size:.68rem; font-weight:600; color:var(--cyan); margin-right:6px; }

  /* CONTACT */
  .contact-wrap { display:grid; grid-template-columns:1fr 1fr; gap:3px; background:var(--glass-border); border-radius:var(--r); overflow:hidden; }
  .contact-l { background:linear-gradient(145deg, rgba(34,211,238,.12) 0%, rgba(59,130,246,.08) 100%); border:1px solid rgba(34,211,238,.12); border-radius:0; padding:4rem; display:flex; flex-direction:column; gap:2.5rem; }
  .contact-big { font-family:'Cabinet Grotesk',sans-serif; font-size:clamp(2.5rem,4.5vw,3.8rem); font-weight:800; color:#fff; line-height:.92; letter-spacing:-.04em; }
  .contact-big em { font-style:italic; background:linear-gradient(135deg,var(--cyan),var(--blue)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
  .contact-sub { font-size:.95rem; color:var(--muted); line-height:1.75; }
  .contact-r { background:var(--bg2); padding:4rem; display:flex; flex-direction:column; justify-content:space-between; }
  .c-item { margin-bottom:2rem; }
  .c-lbl { font-size:.65rem; font-weight:700; letter-spacing:.18em; text-transform:uppercase; color:var(--muted); margin-bottom:.35rem; }
  .c-val { font-family:'Cabinet Grotesk',sans-serif; font-size:1.4rem; font-weight:800; color:#fff; transition:color .2s; letter-spacing:-.02em; }
  .c-val:hover { color:var(--cyan); }
  .soc-row { display:flex; gap:8px; flex-wrap:wrap; }
  .soc-btn { display:inline-flex; align-items:center; gap:.5rem; padding:9px 18px; background:var(--glass); border:1px solid var(--glass-border); border-radius:50px; font-size:.75rem; font-weight:600; color:var(--muted); transition:all .2s; }
  .soc-btn:hover { border-color:var(--cyan); color:var(--cyan); background:rgba(34,211,238,.06); }
  .vacancy-tag { display:inline-block; padding:6px 16px; border:1px solid rgba(34,211,238,.2); border-radius:50px; font-size:.72rem; font-weight:600; color:var(--cyan); margin:0 6px 6px 0; }

  /* FOOTER */
  .footer { padding:1.8rem clamp(1.2rem,4vw,4rem); border-top:1px solid var(--glass-border); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:.8rem; }
  .footer p { font-size:.68rem; color:rgba(226,232,240,.2); letter-spacing:.08em; font-weight:500; }

  /* RESPONSIVE */
  @media(max-width:900px) {
    .photo-float { display:none; }
    .proj-grid { grid-template-columns:1fr !important; }
    .journey-grid { grid-template-columns:1fr !important; gap:3rem !important; }
    .contact-wrap { grid-template-columns:1fr !important; }
  }
  @media(max-width:640px) {
    .desk-nav { display:none !important; }
    .mob-btn { display:flex !important; }
    .hero-name { font-size:clamp(3.2rem,14vw,6rem) !important; }
  }

  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.3} }
  @keyframes heroIn { from{opacity:0;transform:translateY(60px)} to{opacity:1;transform:none} }
  @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
  .photo-float-inner { animation:float 7s ease-in-out infinite; }

  /* GRID LINES subtle bg */
  body::before { content:''; position:fixed; inset:0; z-index:0; background-image:linear-gradient(rgba(255,255,255,.012) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.012) 1px,transparent 1px); background-size:80px 80px; pointer-events:none; }
`;

/* ── CURSOR ── */
function Cursor() {
  const dot = useRef(null), ring = useRef(null);
  const rp = useRef({ x: -200, y: -200 }), mp = useRef({ x: -200, y: -200 });
  const blob = useRef(null);
  useEffect(() => {
    const mv = e => { mp.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener("mousemove", mv);
    let raf;
    const tick = () => {
      rp.current.x += (mp.current.x - rp.current.x) * .1;
      rp.current.y += (mp.current.y - rp.current.y) * .1;
      if (dot.current) { dot.current.style.left = mp.current.x + "px"; dot.current.style.top = mp.current.y + "px"; }
      if (ring.current) { ring.current.style.left = rp.current.x + "px"; ring.current.style.top = rp.current.y + "px"; }
      if (blob.current) { blob.current.style.left = rp.current.x + "px"; blob.current.style.top = rp.current.y + "px"; }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const over = e => { if (e.target.matches("button,a,[data-hover]")) document.body.classList.add("hovering"); };
    const out  = () => document.body.classList.remove("hovering");
    document.addEventListener("mouseover", over);
    document.addEventListener("mouseout", out);
    return () => { window.removeEventListener("mousemove", mv); cancelAnimationFrame(raf); document.removeEventListener("mouseover", over); document.removeEventListener("mouseout", out); };
  }, []);
  return (
    <>
      <div id="blob" ref={blob} />
      <div id="cur-dot" ref={dot} />
      <div id="cur-ring" ref={ring} />
    </>
  );
}

/* ── REVEAL HOOK ── */
function useReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("on"); }), { threshold: .1 });
    document.querySelectorAll(".rv").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  });
}

/* ── NAV ── */
function Nav({ D }) {
  const [solid, setSolid] = useState(false);
  const [mob, setMob] = useState(false);
  useEffect(() => { const h = () => setSolid(window.scrollY > 50); window.addEventListener("scroll", h); return () => window.removeEventListener("scroll", h); }, []);
  const go = id => { setMob(false); document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); };
  return (
    <nav className={`nav${solid ? " solid" : ""}`}>
      <div className="nav-logo" onClick={() => go("hero")}>{D.firstName}<span style={{ opacity: .5 }}> {D.lastName}</span></div>
      <ul className="nav-links desk-nav" style={{ display: "flex", gap: "2rem", listStyle: "none", alignItems: "center" }}>
        {[D.services?.length && ["services","Services"], D.projects?.length && ["projects","Work"], ["journey","Journey"], ["contact","Contact"]].filter(Boolean).map(([id,lbl]) => (
          <li key={id}><button className="nav-btn" onClick={() => go(id)}>{lbl}</button></li>
        ))}
        {D.cv && <li><button className="nav-cv" onClick={() => window.open(D.cv)}>Download CV</button></li>}
      </ul>
      <button className="mob-btn" onClick={() => setMob(o=>!o)} style={{ display:"none", background:"none", border:"none", cursor:"none", flexDirection:"column", gap:5 }}>
        {[0,1,2].map(i => <span key={i} style={{ display:"block", width:22, height:1.5, background:"#fff", transition:"all .25s", transform: mob&&i===0?"translateY(6.5px) rotate(45deg)":mob&&i===2?"translateY(-6.5px) rotate(-45deg)":mob&&i===1?"scaleX(0)":"none" }}/>)}
      </button>
      {mob && (
        <div style={{ position:"absolute", top:70, left:0, right:0, background:"rgba(5,7,15,.97)", backdropFilter:"blur(20px)", borderBottom:"1px solid var(--glass-border)", padding:"1.2rem clamp(1.2rem,4vw,4rem) 2rem" }}>
          {[["services","Services"],["projects","Work"],["journey","Journey"],["contact","Contact"]].map(([id,lbl]) => (
            <button key={id} onClick={() => go(id)} style={{ display:"block", width:"100%", textAlign:"left", background:"none", border:"none", borderBottom:"1px solid var(--glass-border)", cursor:"none", padding:"14px 0", fontFamily:"'Cabinet Grotesk',sans-serif", fontSize:"1.3rem", fontWeight:800, color:"#fff" }}>{lbl}</button>
          ))}
        </div>
      )}
    </nav>
  );
}

/* ── HERO ── */
function Hero({ D, expYrs }) {
  const [in_, setIn] = useState(false);
  useEffect(() => { setTimeout(() => setIn(true), 80); }, []);
  const anim = (d=0) => ({ opacity: in_?1:0, transform: in_?"none":"translateY(50px)", transition: `opacity 1s cubic-bezier(.16,1,.3,1) ${d}ms, transform 1s cubic-bezier(.16,1,.3,1) ${d}ms` });
  return (
    <section id="hero" className="hero">
      <div className="hero-bg">
        {D.profilePhoto && <img className="hero-img" src={D.profilePhoto} alt="" />}
        <div className="hero-gradient"/>
        <div className="hero-gradient2"/>
        <div className="hero-noise"/>
      </div>

      {/* floating photo card */}
      {D.profilePhoto && (
        <div className="photo-float" style={anim(600)}>
          <div className="photo-float-inner">
            <img src={D.profilePhoto} alt={D.name} style={{ objectPosition: "center top" }}/>
            <div className="photo-float-tag">
              <p>{D.role}</p>
              <h3>{D.name}</h3>
            </div>
          </div>
        </div>
      )}

      <div className="hero-content">
        <div style={anim(0)}>
          <div className="hero-eyebrow">
            <div className="hero-eyebrow-dot"/>
            <span className="hero-eyebrow-text">Available for projects</span>
          </div>
        </div>
        <h1 className="hero-name" style={anim(100)}>
          <span className="hero-name-1">{D.firstName}</span>
          <span className="hero-name-2">{D.lastName}</span>
        </h1>
        {D.tagline && <p className="hero-tagline" style={anim(250)}>{D.tagline}</p>}
        <div className="hero-actions" style={anim(350)}>
          <button className="btn-glow" onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior:"smooth" })}>
            Let's talk <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
          {D.cv && <a href={D.cv} className="btn-glass">Download CV</a>}
        </div>
        <div className="hero-meta" style={anim(450)}>
          {[[expYrs,"Years Exp."],[D.projects?.length||4,"Projects"],[D.skills?.length||12,"Technologies"]].map(([n,l]) => (
            <div key={l} className="hero-stat">
              <div className="hero-stat-n">{n}+</div>
              <div className="hero-stat-l">{l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── SERVICES ── */
function Services({ D }){
  if (!D.services?.length) return null;
  return (
    <section id="services" className="sec" style={{ background:"var(--bg2)" }}>
      <div className="sec-inner">
        <div className="rv"><div className="sec-label">What I offer</div><h2 className="sec-h">Services &<br/><em>Expertise</em></h2></div>
        <div className="svc-grid rv d1">
          {D.services.map((sv,i) => (
            <div key={i} className="svc-card">
              <span className="svc-icon">{sv.icon}</span>
              <div className="svc-title">{sv.heading}</div>
              <div className="svc-desc">{sv.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── SKILLS ── */
function Skills({ D }){
  if (!D.skills?.length) return null;
  return (
    <>
      <div className="ticker-wrap">
        <div className="ticker-track">
          {[...D.skills,...D.skills,...D.skills,...D.skills].map((sk,i) => (
            <span key={i} className="ticker-item">{sk}<span className="ticker-sep">◆</span></span>
          ))}
        </div>
      </div>
      <section className="sec" style={{ background:"var(--bg)", paddingTop:80, paddingBottom:80 }}>
        <div className="sec-inner">
          <div className="rv" style={{ display:"flex", flexWrap:"wrap", gap:10 }}>
            {D.skills.map((sk,i) => <span key={i} className={`skill-pill rv d${Math.min(i%4+1,4)}`}>{sk}</span>)}
          </div>
        </div>
      </section>
    </>
  );
}

/* ── PROJECTS ── */
function Projects({ D }) {
  if (!D.projects?.length) return null;
  return (
    <section id="projects" className="sec" style={{ background:"var(--bg2)" }}>
      <div className="sec-inner">
        <div className="rv"><div className="sec-label">Portfolio</div><h2 className="sec-h">Selected<br/><em>Work</em></h2></div>
        <div className="proj-grid rv d1">
          {D.projects.map((p,i) => (
            <div key={i} className="proj-card" style={{ "--proj-color": p.color }}>
              <div className="proj-num">0{i+1}</div>
              <div className="proj-year">{p.year}</div>
              <div className="proj-title">{p.title}</div>
              <div className="proj-desc">{p.description}</div>
              {p.link
                ? <a href={p.link} className="proj-link">View project <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M7 17L17 7M7 7h10v10"/></svg></a>
                : <span className="proj-link" style={{ opacity:.3 }}>Private</span>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── JOURNEY ── */
function Journey({ D, fmt }){
  const hE = D.experience?.length > 0, hD = D.education?.length > 0;
  if (!hE && !hD) return null;
  return (
    <section id="journey" className="sec" style={{ background:"var(--bg)" }}>
      <div className="sec-inner">
        <div className="rv"><div className="sec-label">Background</div><h2 className="sec-h">My<br/><em>Journey</em></h2></div>
        <div className="journey-grid">
          {hE && (
            <div className="rv d1">
              <div className="j-label">Work Experience</div>
              {D.experience.map((e,i) => (
                <div key={i} className="exp-item">
                  <div><div className="exp-role">{e.jobTitle}</div><div className="exp-co">{e.company}</div></div>
                  <div className="exp-date">{fmt(e.startDate)}<br/>—<br/>{fmt(e.endDate)}</div>
                </div>
              ))}
            </div>
          )}
          {hD && (
            <div className="rv d2">
              <div className="j-label">Education</div>
              {D.education.map((e,i) => (
                <div key={i} className="edu-card">
                  <div className="edu-deg">{e.education}</div>
                  <div className="edu-inst">{e.institution}</div>
                  <div>
                    {e.year && <span className="edu-badge">{e.year}</span>}
                    {e.percentage && <span className="edu-badge">{e.percentage}</span>}
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

/* ── CONTACT ── */
function Contact({ D, soc }){
  return (
    <section id="contact" className="sec" style={{ background:"var(--bg2)" }}>
      <div className="sec-inner">
        <div className="contact-wrap rv">
          <div className="contact-l">
            <div>
              <div className="contact-big">Let's build<br/>something<br/><em>remarkable.</em></div>
              <div className="contact-sub" style={{ marginTop:"1.5rem" }}>Open to new projects, roles, and conversations. I respond within 24 hours.</div>
            </div>
            {D.lookingVacancy?.length > 0 && (
              <div>
                <div style={{ fontSize:".68rem", fontWeight:700, letterSpacing:".18em", textTransform:"uppercase", color:"var(--muted)", marginBottom:".8rem" }}>Currently open to</div>
                <div>{D.lookingVacancy.map((v,i) => <span key={i} className="vacancy-tag">{v}</span>)}</div>
              </div>
            )}
          </div>
          <div className="contact-r">
            <div>
              {D.email && <div className="c-item"><div className="c-lbl">Email</div><a href={`mailto:${D.email}`} className="c-val" style={{ display:"block" }}>{D.email}</a></div>}
              {D.phone && <div className="c-item"><div className="c-lbl">Phone</div><a href={`tel:${D.phone}`} className="c-val" style={{ display:"block" }}>{D.phone}</a></div>}
              {D.place && <div className="c-item"><div className="c-lbl">Location</div><div className="c-val" style={{ fontSize:"1.1rem", color:"var(--muted)" }}>{D.place}</div></div>}
            </div>
            <div>
              <div style={{ fontSize:".65rem", fontWeight:700, letterSpacing:".18em", textTransform:"uppercase", color:"var(--muted)", marginBottom:"1rem" }}>Find me on</div>
              <div className="soc-row">
                {soc.linkedin && <a href={soc.linkedin} target="_blank" rel="noreferrer" className="soc-btn">LinkedIn</a>}
                {soc.github && <a href={soc.github} target="_blank" rel="noreferrer" className="soc-btn">GitHub</a>}
                {soc.twitter && <a href={soc.twitter} target="_blank" rel="noreferrer" className="soc-btn">Twitter</a>}
                {soc.website && <a href={soc.website} target="_blank" rel="noreferrer" className="soc-btn">Website</a>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── APP ── */
export default function Profile8({ data }) {

  const D = data ||DEMO|| {};
  const soc = D.socials?.[0] || {};

  const fmt = d =>
    !d
      ? "Present"
      : new Date(d).toLocaleDateString("en-US", {
          month: "short",
          year: "numeric"
        });

  const expYrs =
    D.experience?.length
      ? new Date().getFullYear() -
        new Date(D.experience[D.experience.length - 1].startDate).getFullYear()
      : 0;

  useReveal();
  return (
    <>
      <style>{STYLE}</style>
      <Cursor />
      <Nav D={D} />
<Hero D={D} expYrs={expYrs} />
<Services D={D} />
<Skills D={D} />
<Projects D={D} />
<Journey D={D} fmt={fmt} />
<Contact D={D} soc={soc} />
      <footer className="footer">
        <p>© {new Date().getFullYear()} {D.name} — All rights reserved</p>
        <p>{D.place} · Built with precision</p>
      </footer>
    </>
  );
}