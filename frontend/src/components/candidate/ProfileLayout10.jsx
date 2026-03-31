import { useState, useEffect, useRef } from "react";

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

/* ══ STYLES ═══════════════════════════════════════════════════ */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,700;12..96,800&family=Nunito:ital,wght@0,400;0,600;0,700;1,700&display=swap');

  :root {
    --white: #ffffff;
    --off:   #f7f7f5;
    --ink:   #111110;
    --v:     #7C3AED;
    --vl:    #EDE9FE;
    --vm:    #DDD6FE;
    --mid:   #6b6b65;
    --r:     18px;
  }

  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
  html { scroll-behavior:smooth; }
  body { background:var(--white); color:var(--ink); font-family:'Nunito',sans-serif; -webkit-font-smoothing:antialiased; overflow-x:hidden; cursor:none; }
  a { color:inherit; text-decoration:none; }
  img { display:block; max-width:100%; }

  /* ── CUSTOM CURSOR ── */
  #cd { position:fixed; z-index:9999; pointer-events:none; width:12px; height:12px; border-radius:50%; background:var(--v); transform:translate(-50%,-50%); transition:width .2s,height .2s,border-radius .2s; }
  #cr { position:fixed; z-index:9998; pointer-events:none; width:36px; height:36px; border-radius:50%; border:2px solid var(--v); transform:translate(-50%,-50%); opacity:.5; }
  body.hov #cd { width:40px; height:40px; border-radius:4px; background:var(--v); opacity:.15; }
  body.hov #cr { width:40px; height:40px; border-radius:4px; opacity:0; }

  /* ── NAV ── */
  .nav { position:fixed; top:0; left:0; right:0; z-index:800; height:68px; display:flex; align-items:center; justify-content:space-between; padding:0 clamp(1.2rem,5vw,4rem); transition:all .3s; }
  .nav.s { background:rgba(255,255,255,.9); backdrop-filter:blur(16px); box-shadow:0 1px 0 rgba(0,0,0,.06); }
  .nlogo { font-family:'Bricolage Grotesque',sans-serif; font-size:1.3rem; font-weight:800; cursor:none; color:var(--ink); display:flex; align-items:center; gap:.3rem; }
  .nlogo-dot { width:10px; height:10px; border-radius:50%; background:var(--v); display:inline-block; animation:bop 1.8s ease-in-out infinite; }
  .nlinks { display:flex; gap:1.8rem; align-items:center; list-style:none; }
  .nlk { font-size:.82rem; font-weight:700; background:none; border:none; cursor:none; color:var(--mid); transition:color .18s; padding:4px 0; letter-spacing:.01em; }
  .nlk:hover { color:var(--v); }
  .ncv { padding:9px 22px; background:var(--v); color:#fff; border:none; border-radius:50px; font-family:'Nunito',sans-serif; font-size:.78rem; font-weight:800; cursor:none; transition:transform .2s,box-shadow .2s; box-shadow:0 4px 14px rgba(124,58,237,.3); }
  .ncv:hover { transform:translateY(-2px) rotate(-1deg); box-shadow:0 8px 22px rgba(124,58,237,.4); }

  /* ── HERO ── */
  .hero { min-height:100vh; background:var(--white); padding:100px clamp(1.2rem,5vw,4rem) 80px; position:relative; overflow:hidden; display:flex; align-items:center; }

  /* big wavy bg letters */
  .hero-ghost { position:absolute; top:50%; left:50%; transform:translate(-50%,-54%); font-family:'Bricolage Grotesque',sans-serif; font-weight:800; font-size:clamp(10rem,28vw,30rem); color:transparent; -webkit-text-stroke:2px rgba(124,58,237,.05); pointer-events:none; user-select:none; white-space:nowrap; letter-spacing:-.05em; line-height:1; }

  .hero-inner { max-width:1240px; margin:0 auto; width:100%; display:grid; grid-template-columns:1fr auto 1fr; gap:3rem; align-items:center; position:relative; z-index:2; }

  /* PHOTO CIRCLE with spinning text */
  .photo-ring-wrap { position:relative; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .spinning-text { position:absolute; width:clamp(320px,38vw,480px); height:clamp(320px,38vw,480px); animation:spin 14s linear infinite; }
  .spinning-text text { font-family:'Bricolage Grotesque',sans-serif; font-size:13px; font-weight:700; fill:var(--v); letter-spacing:4px; text-transform:uppercase; }
  .photo-circle { width:clamp(230px,28vw,360px); height:clamp(230px,28vw,360px); border-radius:50%; overflow:hidden; border:4px solid var(--ink); box-shadow:8px 8px 0 var(--v); flex-shrink:0; position:relative; z-index:1; }
  .photo-circle img { width:100%; height:100%; object-fit:cover; object-position:center top; }

  /* hero left / right text */
  .hero-text-l { display:flex; flex-direction:column; gap:1.2rem; }
  .hero-tag { display:inline-flex; align-items:center; gap:.5rem; padding:6px 14px; background:var(--vl); border-radius:50px; font-size:.72rem; font-weight:800; color:var(--v); letter-spacing:.06em; text-transform:uppercase; width:fit-content; }
  .hero-tag-dot { width:6px; height:6px; border-radius:50%; background:#22c55e; animation:bop 1.5s ease-in-out infinite; }
  .hero-h1-l { font-family:'Bricolage Grotesque',sans-serif; font-size:clamp(2.8rem,5.5vw,5rem); font-weight:800; line-height:.88; letter-spacing:-.04em; color:var(--ink); }
  .hero-h1-l .pop { color:var(--v); }
  .hero-sub-l { font-size:1rem; font-weight:600; color:var(--mid); line-height:1.65; max-width:320px; }
  .hero-btns { display:flex; gap:.8rem; flex-wrap:wrap; }
  .btn-main { display:inline-flex; align-items:center; gap:.5rem; padding:13px 28px; background:var(--v); color:#fff; border:2px solid var(--v); border-radius:50px; font-family:'Nunito',sans-serif; font-weight:800; font-size:.88rem; cursor:none; transition:transform .2s,box-shadow .2s; box-shadow:0 6px 20px rgba(124,58,237,.3); }
  .btn-main:hover { transform:translateY(-3px) rotate(-.5deg); box-shadow:0 12px 28px rgba(124,58,237,.4); }
  .btn-out { display:inline-flex; align-items:center; gap:.5rem; padding:13px 28px; background:#fff; color:var(--ink); border:2px solid var(--ink); border-radius:50px; font-family:'Nunito',sans-serif; font-weight:800; font-size:.88rem; cursor:none; transition:all .2s; }
  .btn-out:hover { background:var(--ink); color:#fff; transform:translateY(-2px); }

  .hero-text-r { display:flex; flex-direction:column; align-items:flex-start; gap:1.4rem; }
  .hero-h1-r { font-family:'Bricolage Grotesque',sans-serif; font-size:clamp(2.8rem,5.5vw,5rem); font-weight:800; line-height:.88; letter-spacing:-.04em; color:transparent; -webkit-text-stroke:2.5px var(--ink); }
  .hero-meta { display:flex; flex-direction:column; gap:.6rem; }
  .hero-meta-item { display:flex; align-items:center; gap:.55rem; font-size:.82rem; font-weight:700; color:var(--mid); }
  .hero-meta-item svg { color:var(--v); flex-shrink:0; }

  /* stats row */
  .hero-stats { display:flex; gap:2.5rem; padding-top:2rem; border-top:2px dashed rgba(124,58,237,.2); margin-top:.5rem; }
  .hs-n { font-family:'Bricolage Grotesque',sans-serif; font-size:2rem; font-weight:800; color:var(--ink); line-height:1; }
  .hs-n span { color:var(--v); }
  .hs-l { font-size:.65rem; font-weight:800; letter-spacing:.14em; text-transform:uppercase; color:var(--mid); }

  /* ── REVEAL ── */
  .rv { opacity:0; transform:translateY(28px); transition:opacity .7s cubic-bezier(.16,1,.3,1),transform .7s cubic-bezier(.16,1,.3,1); }
  .rv.on { opacity:1; transform:none; }
  .d1{transition-delay:.08s}.d2{transition-delay:.16s}.d3{transition-delay:.24s}.d4{transition-delay:.32s}.d5{transition-delay:.4s}

  /* ── WAVY DIVIDER ── */
  .wave-div { width:100%; overflow:hidden; line-height:0; }
  .wave-div svg { display:block; width:100%; }

  /* ── SECTION ── */
  .sec { padding:90px clamp(1.2rem,5vw,4rem); position:relative; }
  .sec-inner { max-width:1200px; margin:0 auto; }
  .sec-eyebrow { display:inline-flex; align-items:center; gap:.6rem; padding:5px 14px; background:var(--vl); border-radius:50px; font-size:.7rem; font-weight:800; color:var(--v); letter-spacing:.1em; text-transform:uppercase; margin-bottom:1rem; transform:rotate(-1.5deg); display:inline-flex; width:fit-content; }
  .sec-h { font-family:'Bricolage Grotesque',sans-serif; font-size:clamp(2.2rem,4.5vw,3.6rem); font-weight:800; line-height:.92; letter-spacing:-.04em; color:var(--ink); margin-bottom:3.5rem; }
  .sec-h .pop { color:var(--v); position:relative; display:inline-block; }
  .sec-h .pop::after { content:''; position:absolute; left:0; right:0; bottom:-4px; height:4px; background:var(--v); border-radius:2px; }

  /* ── WOBBLY CARD ── */
  @keyframes wobble { 0%,100%{border-radius:62% 38% 46% 54%/60% 44% 56% 40%} 50%{border-radius:42% 58% 60% 40%/54% 48% 52% 46%} }
  .wcard { background:#fff; border:2.5px solid var(--ink); border-radius:20px; padding:2rem; box-shadow:5px 5px 0 var(--v); transition:transform .25s cubic-bezier(.34,1.56,.64,1),box-shadow .25s; cursor:default; position:relative; }
  .wcard:hover { transform:translateY(-6px) rotate(.5deg); box-shadow:8px 10px 0 var(--v); }
  .wcard-emoji { font-size:2.2rem; margin-bottom:1rem; display:block; transition:transform .3s; }
  .wcard:hover .wcard-emoji { transform:rotate(12deg) scale(1.2); }
  .wcard-h { font-family:'Bricolage Grotesque',sans-serif; font-size:1.2rem; font-weight:800; color:var(--ink); margin-bottom:.6rem; letter-spacing:-.02em; }
  .wcard-d { font-size:.88rem; font-weight:600; color:var(--mid); line-height:1.65; }

  /* ── SKILLS ── */
  .skill-cloud { display:flex; flex-wrap:wrap; gap:10px; }
  .skill-tag { padding:9px 20px; font-family:'Nunito',sans-serif; font-size:.85rem; font-weight:800; border:2px solid var(--ink); border-radius:50px; background:#fff; color:var(--ink); cursor:default; transition:all .22s cubic-bezier(.34,1.56,.64,1); box-shadow:3px 3px 0 var(--ink); }
  .skill-tag:hover { background:var(--v); color:#fff; border-color:var(--v); transform:translateY(-4px) scale(1.05); box-shadow:4px 6px 0 var(--ink); }

  /* ── PROJECTS ── */
  .proj-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(260px,1fr)); gap:1.2rem; }
  .proj-card { background:#fff; border:2.5px solid var(--ink); border-radius:18px; padding:2rem; box-shadow:5px 5px 0 var(--ink); transition:all .25s cubic-bezier(.34,1.56,.64,1); cursor:default; display:flex; flex-direction:column; gap:1rem; position:relative; overflow:hidden; }
  .proj-card::before { content:''; position:absolute; top:0; left:0; right:0; height:4px; background:var(--v); transform:scaleX(0); transition:transform .3s; transform-origin:left; }
  .proj-card:hover { transform:translateY(-8px) rotate(-.4deg); box-shadow:8px 10px 0 var(--v); }
  .proj-card:hover::before { transform:scaleX(1); }
  .proj-emoji { font-size:2rem; }
  .proj-top { display:flex; justify-content:space-between; align-items:flex-start; }
  .proj-year-tag { font-size:.65rem; font-weight:800; letter-spacing:.1em; color:var(--v); background:var(--vl); padding:3px 10px; border-radius:50px; }
  .proj-h { font-family:'Bricolage Grotesque',sans-serif; font-size:1.3rem; font-weight:800; color:var(--ink); letter-spacing:-.02em; }
  .proj-d { font-size:.85rem; font-weight:600; color:var(--mid); line-height:1.6; flex:1; }
  .proj-link-btn { display:inline-flex; align-items:center; gap:.4rem; font-size:.75rem; font-weight:800; color:var(--v); letter-spacing:.06em; text-transform:uppercase; transition:gap .2s; }
  .proj-link-btn:hover { gap:.7rem; }
  .proj-link-btn.dead { color:rgba(107,107,101,.3); cursor:default; }

  /* ── JOURNEY ── */
  .journey-cols { display:grid; grid-template-columns:1fr 1fr; gap:4rem; }
  .j-section-label { font-size:.68rem; font-weight:800; letter-spacing:.2em; text-transform:uppercase; color:var(--v); padding-bottom:1rem; border-bottom:2px dashed rgba(124,58,237,.25); margin-bottom:0; }
  .exp-item { padding:1.4rem 0; border-bottom:2px dashed rgba(0,0,0,.06); display:flex; justify-content:space-between; align-items:flex-start; gap:1rem; transition:background .2s; border-radius:8px; }
  .exp-item:last-child { border-bottom:none; }
  .exp-role { font-family:'Bricolage Grotesque',sans-serif; font-size:1rem; font-weight:800; color:var(--ink); margin-bottom:.2rem; letter-spacing:-.01em; }
  .exp-co { font-size:.8rem; font-weight:700; color:var(--mid); }
  .exp-dates { font-size:.68rem; font-weight:800; color:var(--v); white-space:nowrap; text-align:right; flex-shrink:0; padding-top:3px; line-height:1.7; }
  .edu-card { padding:1.4rem; border:2.5px solid var(--ink); border-radius:14px; margin-bottom:8px; box-shadow:3px 3px 0 var(--v); transition:transform .25s cubic-bezier(.34,1.56,.64,1); cursor:default; }
  .edu-card:hover { transform:translateX(5px) rotate(.3deg); }
  .edu-deg { font-family:'Bricolage Grotesque',sans-serif; font-size:.98rem; font-weight:800; color:var(--ink); margin-bottom:.2rem; }
  .edu-inst { font-size:.8rem; font-weight:700; color:var(--mid); margin-bottom:.7rem; }
  .edu-chips { display:flex; gap:6px; flex-wrap:wrap; }
  .edu-chip { font-size:.65rem; font-weight:800; padding:3px 12px; background:var(--vl); color:var(--v); border-radius:50px; border:1.5px solid var(--vm); }

  /* ── CONTACT ── */
  .contact-box { background:var(--v); border-radius:28px; padding:clamp(2.5rem,6vw,5rem); display:grid; grid-template-columns:1fr 1fr; gap:4rem; align-items:center; position:relative; overflow:hidden; }
  .contact-box::before { content:''; position:absolute; top:-80px; right:-80px; width:300px; height:300px; border-radius:50%; background:rgba(255,255,255,.06); pointer-events:none; }
  .contact-box::after { content:''; position:absolute; bottom:-60px; left:-60px; width:220px; height:220px; border-radius:50%; background:rgba(255,255,255,.04); pointer-events:none; }
  .contact-big { font-family:'Bricolage Grotesque',sans-serif; font-size:clamp(2.5rem,5vw,4rem); font-weight:800; color:#fff; line-height:.9; letter-spacing:-.04em; margin-bottom:1.5rem; }
  .contact-big em { font-style:italic; }
  .contact-sub { font-size:1rem; font-weight:600; color:rgba(255,255,255,.7); line-height:1.6; margin-bottom:2rem; }
  .contact-right { display:flex; flex-direction:column; gap:1.5rem; }
  .cf-item { background:rgba(255,255,255,.1); border:1.5px solid rgba(255,255,255,.2); border-radius:14px; padding:1.2rem 1.6rem; transition:background .2s; }
  .cf-item:hover { background:rgba(255,255,255,.18); }
  .cf-l { font-size:.62rem; font-weight:800; letter-spacing:.18em; text-transform:uppercase; color:rgba(255,255,255,.55); margin-bottom:.3rem; }
  .cf-v { font-family:'Bricolage Grotesque',sans-serif; font-size:1.15rem; font-weight:800; color:#fff; letter-spacing:-.02em; transition:color .2s; display:block; }
  .cf-v:hover { color:rgba(255,255,255,.75); }
  .soc-strip { display:flex; gap:8px; flex-wrap:wrap; margin-top:.5rem; }
  .soc-b { padding:8px 18px; background:rgba(255,255,255,.1); border:1.5px solid rgba(255,255,255,.2); border-radius:50px; font-size:.75rem; font-weight:800; color:rgba(255,255,255,.7); transition:all .2s; }
  .soc-b:hover { background:rgba(255,255,255,.25); color:#fff; }

  /* ── FOOTER ── */
  .foot { padding:1.6rem clamp(1.2rem,5vw,4rem); border-top:2px dashed rgba(0,0,0,.08); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:.8rem; }
  .foot p { font-size:.72rem; font-weight:700; color:rgba(17,17,16,.35); letter-spacing:.04em; }

  /* ── MARQUEE ── */
  .mq { overflow:hidden; background:var(--ink); padding:16px 0; }
  .mq-t { display:flex; animation:mq 22s linear infinite; white-space:nowrap; }
  .mq-i { display:inline-flex; align-items:center; gap:1.2rem; padding:0 1.8rem; font-family:'Bricolage Grotesque',sans-serif; font-size:1rem; font-weight:800; color:rgba(255,255,255,.2); letter-spacing:.04em; }
  .mq-i span { color:var(--v); font-size:.55rem; }

  /* ── RESPONSIVE ── */
  @media(max-width:880px) {
    .hero-inner { grid-template-columns:1fr !important; }
    .hero-text-r { display:none !important; }
    .photo-ring-wrap { order:-1; }
    .journey-cols { grid-template-columns:1fr !important; gap:2.5rem !important; }
    .contact-box { grid-template-columns:1fr !important; }
  }
  @media(max-width:640px) {
    .desk-nav { display:none !important; }
    .mob-ham { display:flex !important; }
  }

  @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes bop { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
  @keyframes mq { from{transform:translateX(0)} to{transform:translateX(-50%)} }
  @keyframes pop-in { 0%{opacity:0;transform:scale(.6) rotate(-8deg)} 70%{transform:scale(1.05) rotate(1deg)} 100%{opacity:1;transform:scale(1) rotate(0deg)} }
  @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
  .photo-circle { animation:float 5s ease-in-out infinite; }
`;

/* ── CURSOR ─────────────────────────────── */
function Cursor() {
  const dot = useRef(null), ring = useRef(null);
  const rp = useRef({x:-300,y:-300}), mp = useRef({x:-300,y:-300});
  useEffect(() => {
    const mv = e => { mp.current = {x:e.clientX, y:e.clientY}; };
    window.addEventListener("mousemove", mv);
    let raf;
    const tick = () => {
      rp.current.x += (mp.current.x - rp.current.x) * .12;
      rp.current.y += (mp.current.y - rp.current.y) * .12;
      if (dot.current) { dot.current.style.left = mp.current.x+"px"; dot.current.style.top = mp.current.y+"px"; }
      if (ring.current) { ring.current.style.left = rp.current.x+"px"; ring.current.style.top = rp.current.y+"px"; }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const over = e => { if (e.target.closest("button,a,input,[data-hover]")) document.body.classList.add("hov"); };
    const out = () => document.body.classList.remove("hov");
    document.addEventListener("mouseover", over);
    document.addEventListener("mouseout", out);
    return () => { window.removeEventListener("mousemove", mv); cancelAnimationFrame(raf); document.removeEventListener("mouseover", over); document.removeEventListener("mouseout", out); };
  }, []);
  return (<><div id="cd" ref={dot}/><div id="cr" ref={ring}/></>);
}

/* ── REVEAL ─────────────────────────────── */
function useReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("on"); }), {threshold:.1});
    document.querySelectorAll(".rv").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  });
}

/* ── COUNTER ─────────────────────────────── */
function Ctr({to, suffix=""}) {
  const [v, setV] = useState(0); const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return; obs.disconnect();
      let c = 0;
      const id = setInterval(() => { c = Math.min(c + Math.ceil(to/40), to); setV(c); if (c >= to) clearInterval(id); }, 28);
    }, {threshold:.5});
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [to]);
  return <span ref={ref}>{v}{suffix}</span>;
}

/* ── NAV ─────────────────────────────────── */
function Nav({ D }){
  const [s, setS] = useState(false), [open, setOpen] = useState(false);
  useEffect(() => { const h = () => setS(window.scrollY > 50); window.addEventListener("scroll", h); return () => window.removeEventListener("scroll", h); }, []);
  const go = id => { setOpen(false); document.getElementById(id)?.scrollIntoView({behavior:"smooth"}); };
  const links = [
    D.services?.length && ["services","Services"],
    D.projects?.length && ["projects","Work"],
    (D.experience?.length || D.education?.length) && ["journey","Journey"],
    ["contact","Contact"],
  ].filter(Boolean);
  return (
    <nav className={`nav${s?" s":""}`}>
      <div className="nlogo" onClick={() => go("hero")}>
        <div className="nlogo-dot"/>
        {D.firstName}<span style={{color:"var(--v)"}}>.</span>
      </div>
      <ul className="nlinks desk-nav" style={{display:"flex",gap:"1.8rem",listStyle:"none",alignItems:"center"}}>
        {links.map(([id,lbl]) => <li key={id}><button className="nlk" onClick={() => go(id)}>{lbl}</button></li>)}
        {D.cv && <li><button className="ncv" onClick={() => window.open(D.cv)}>CV ↓</button></li>}
      </ul>
      <button className="mob-ham" onClick={() => setOpen(o=>!o)} style={{display:"none",background:"none",border:"none",cursor:"none",flexDirection:"column",gap:5}}>
        {[0,1,2].map(i => <span key={i} style={{display:"block",width:22,height:2.5,background:"var(--ink)",borderRadius:2,transition:"all .25s",transform:open&&i===0?"translateY(7.5px) rotate(45deg)":open&&i===2?"translateY(-7.5px) rotate(-45deg)":open&&i===1?"scaleX(0)":"none"}}/>)}
      </button>
      {open && (
        <div style={{position:"absolute",top:68,left:0,right:0,background:"#fff",borderBottom:"2px solid var(--ink)",padding:"1rem 1.5rem 2rem",boxShadow:"0 8px 30px rgba(0,0,0,.1)"}}>
          {links.map(([id,lbl]) => <button key={id} onClick={() => go(id)} style={{display:"block",width:"100%",textAlign:"left",background:"none",border:"none",borderBottom:"2px dashed rgba(0,0,0,.08)",cursor:"none",padding:"13px 0",fontFamily:"'Bricolage Grotesque',sans-serif",fontWeight:800,fontSize:"1.2rem",color:"var(--ink)"}}>{lbl}</button>)}
        </div>
      )}
    </nav>
  );
}

/* ── HERO ────────────────────────────────── */
function Hero({ D, expYrs }) {
  const [inn, setInn] = useState(false);
  useEffect(() => { setTimeout(() => setInn(true), 100); }, []);
  const a = (d=0) => ({opacity:inn?1:0, transform:inn?"none":"translateY(24px)", transition:`opacity .8s cubic-bezier(.16,1,.3,1) ${d}ms, transform .8s cubic-bezier(.16,1,.3,1) ${d}ms`});

  const ringText = "Available for Work  ✦  Open to Projects  ✦  Let's Build  ✦  ";
  const repeated = ringText.repeat(3);

  return (
    <section id="hero" className="hero">
      <div className="hero-ghost" aria-hidden>{D.firstName}</div>

      <div className="hero-inner">
        {/* LEFT */}
        <div className="hero-text-l">
          <div style={a(0)}>
            <div className="hero-tag"><div className="hero-tag-dot"/> {D.role}</div>
          </div>
          <h1 className="hero-h1-l" style={a(100)}>
            <span>{D.firstName}</span><br/>
            <span className="pop">{D.lastName}</span>
          </h1>
          <p className="hero-sub-l" style={a(200)}>{D.about}</p>
          <div className="hero-btns" style={a(300)}>
            <button className="btn-main" onClick={() => document.getElementById("contact")?.scrollIntoView({behavior:"smooth"})}>
              Say hello 👋
            </button>
            {D.cv && <a href={D.cv} className="btn-out">Get my CV</a>}
          </div>
          <div className="hero-stats" style={a(400)}>
            {[[expYrs,"Yrs Exp."],[D.projects?.length||4,"Projects"],[D.skills?.length||12,"Skills"]].map(([n,l]) => (
              <div key={l}>
                <div className="hs-n"><Ctr to={n}/><span>+</span></div>
                <div className="hs-l">{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CIRCLE PHOTO */}
        {D.profilePhoto && (
          <div className="photo-ring-wrap" style={a(150)}>
            <svg className="spinning-text" viewBox="0 0 480 480">
              <defs>
                <path id="circle-path" d="M 240,240 m -195,0 a 195,195 0 1,1 390,0 a 195,195 0 1,1 -390,0"/>
              </defs>
              <text>
                <textPath href="#circle-path">{repeated}</textPath>
              </text>
            </svg>
            <div className="photo-circle">
              <img src={D.profilePhoto} alt={D.name}/>
            </div>
          </div>
        )}

        {/* RIGHT */}
        <div className="hero-text-r" style={a(200)}>
          <div className="hero-h1-r">{D.firstName}<br/>{D.lastName}</div>
          <div className="hero-meta">
            {D.place && (
              <div className="hero-meta-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                {D.place}
              </div>
            )}
            {D.email && (
              <div className="hero-meta-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7"/></svg>
                {D.email}
              </div>
            )}
            {D.qualification && (
              <div className="hero-meta-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                {D.qualification}
              </div>
            )}
          </div>
          {D.lookingVacancy?.length > 0 && (
            <div style={{display:"flex",flexWrap:"wrap",gap:6,marginTop:".5rem"}}>
              {D.lookingVacancy.map((v,i) => (
                <span key={i} style={{padding:"5px 12px",background:"var(--vl)",border:"1.5px solid var(--vm)",borderRadius:"50px",fontSize:".72rem",fontWeight:800,color:"var(--v)"}}>{v}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ── MARQUEE ─────────────────────────────── */
function Marquee({ D }) {
  const items = D.skills?.length ? [...D.skills,...D.skills,...D.skills,...D.skills] : [];
  return (
    <div className="mq">
      <div className="mq-t">
        {items.map((sk,i) => <span key={i} className="mq-i">{sk}<span>◆</span></span>)}
      </div>
    </div>
  );
}

/* ── SERVICES ─────────────────────────────── */
function Services({ D }) {
  if (!D.services?.length) return null;
  return (
    <section id="services" className="sec" style={{background:"var(--off)"}}>
      <div className="sec-inner">
        <div className="rv">
          <div className="sec-eyebrow">✦ What I offer</div>
          <h2 className="sec-h">Services &<br/><span className="pop">Expertise</span></h2>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(250px,1fr))",gap:"1.2rem"}} className="rv d1">
          {D.services.map((sv,i) => (
            <div key={i} className={`wcard rv d${i+1}`}>
              <span className="wcard-emoji">{sv.emoji}</span>
              <div className="wcard-h">{sv.heading}</div>
              <div className="wcard-d">{sv.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── SKILLS ──────────────────────────────── */
function Skills({ D }) {
  if (!D.skills?.length) return null;
  return (
    <section className="sec" style={{background:"#fff",paddingTop:60,paddingBottom:60}}>
      <div className="sec-inner">
        <div className="rv sec-eyebrow" style={{marginBottom:"1.5rem"}}>✦ My tech stack</div>
        <div className="skill-cloud rv d1">
          {D.skills.map((sk,i) => <span key={i} className={`skill-tag rv d${Math.min(i%5+1,5)}`}>{sk}</span>)}
        </div>
      </div>
    </section>
  );
}

/* ── PROJECTS ─────────────────────────────── */
function Projects({ D }) {
  if (!D.projects?.length) return null;
  return (
    <section id="projects" className="sec" style={{background:"var(--off)"}}>
      <div className="sec-inner">
        <div className="rv">
          <div className="sec-eyebrow">✦ Portfolio</div>
          <h2 className="sec-h">Selected<br/><span className="pop">Work</span></h2>
        </div>
        <div className="proj-grid rv d1">
          {D.projects.map((p,i) => (
            <div key={i} className="proj-card">
              <div className="proj-top">
                <span className="proj-emoji">{p.emoji}</span>
                <span className="proj-year-tag">{p.year}</span>
              </div>
              <div className="proj-h">{p.title}</div>
              <div className="proj-d">{p.description}</div>
              {p.link
                ? <a href={p.link} target="_blank" rel="noreferrer" className="proj-link-btn">View project <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M7 17L17 7M7 7h10v10"/></svg></a>
                : <span className="proj-link-btn dead">Private 🔒</span>
              }
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── JOURNEY ──────────────────────────────── */
function Journey({ D, fmt }){
  const hE = D.experience?.length > 0, hD = D.education?.length > 0;
  if (!hE && !hD) return null;
  return (
    <section id="journey" className="sec" style={{background:"#fff"}}>
      <div className="sec-inner">
        <div className="rv">
          <div className="sec-eyebrow">✦ Background</div>
          <h2 className="sec-h">My<br/><span className="pop">Journey</span></h2>
        </div>
        <div className="journey-cols">
          {hE && (
            <div className="rv d1">
              <div className="j-section-label">Work Experience</div>
              {D.experience.map((e,i) => (
                <div key={i} className="exp-item">
                  <div>
                    <div className="exp-role">{e.jobTitle}</div>
                    <div className="exp-co">{e.company}</div>
                  </div>
                  {/* <div className="exp-dates">{fmt(e.startDate)}<br/>—<br/>{fmt(e.endDate)}</div> */}
                </div>
              ))}
            </div>
          )}
          {hD && (
            <div className="rv d2">
              <div className="j-section-label">Education</div>
              {D.education.map((e,i) => (
                <div key={i} className="edu-card">
                  <div className="edu-deg">{e.education}</div>
                  <div className="edu-inst">{e.institution}</div>
                  <div className="edu-chips">
                    {e.year && <span className="edu-chip">{e.year}</span>}
                    {e.percentage && <span className="edu-chip">{e.percentage}</span>}
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

/* ── CONTACT ──────────────────────────────── */
function Contact({ D, soc }) {
  return (
    <section id="contact" className="sec" style={{background:"var(--off)"}}>
      <div className="sec-inner">
        <div className="contact-box rv">
          <div>
            <div className="contact-big">Let's build<br/><em>something</em><br/>amazing! 🚀</div>
            <div className="contact-sub">Open to projects, roles & collabs.<br/>I reply fast — promise. ⚡</div>
            <div className="soc-strip">
              {soc.linkedin && <a href={soc.linkedin} target="_blank" rel="noreferrer" className="soc-b">LinkedIn</a>}
              {soc.github && <a href={soc.github} target="_blank" rel="noreferrer" className="soc-b">GitHub</a>}
              {soc.twitter && <a href={soc.twitter} target="_blank" rel="noreferrer" className="soc-b">Twitter</a>}
              {soc.website && <a href={soc.website} target="_blank" rel="noreferrer" className="soc-b">Website</a>}
            </div>
          </div>
          <div className="contact-right">
            {D.email && (
              <div className="cf-item">
                <div className="cf-l">Email me</div>
                <a href={`mailto:${D.email}`} className="cf-v">{D.email}</a>
              </div>
            )}
            {D.phone && (
              <div className="cf-item">
                <div className="cf-l">Call me</div>
                <a href={`tel:${D.phone}`} className="cf-v">{D.phone}</a>
              </div>
            )}
            {D.place && (
              <div className="cf-item">
                <div className="cf-l">Based in</div>
                <div className="cf-v" style={{cursor:"default",opacity:.6}}>{D.place} 📍</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── APP ─────────────────────────────────── */
export default function Profile10({ data }) {

  const D = data ||DEMO|| {};
  const soc = D.socials?.[0] || {};

  const fmt = d =>
    !d
      ? "  "
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
      <style>{CSS}</style>
      <Cursor/>
      <Nav D={D}/>
<Hero D={D} expYrs={expYrs}/>
<Marquee D={D}/>
<Services D={D}/>
<Skills D={D}/>
<Projects D={D}/>
<Journey D={D} fmt={fmt}/>
<Contact D={D} soc={soc}/>
<footer className="foot">
  <p>© {new Date().getFullYear()} {D.name} — Made with ❤️</p>
  <p>{D.place} 🌏</p>
</footer>
    </>
  );
}