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


/* ══ CSS ══════════════════════════════════════════════════════════ */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Syne:wght@700;800&display=swap');

  :root {
    --bg:    #050f0a;
    --mint:  #00e5a0;
    --mint2: #00c47a;
    --glow:  rgba(0,229,160,.18);
    --glass: rgba(255,255,255,.05);
    --glass-b: rgba(255,255,255,.09);
    --glass-hover: rgba(255,255,255,.09);
    --text:  #e8f5ef;
    --muted: rgba(232,245,239,.45);
    --r: 22px;
  }

  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  html{scroll-behavior:smooth}
  body{background:var(--bg);color:var(--text);font-family:'Outfit',sans-serif;-webkit-font-smoothing:antialiased;overflow-x:hidden;cursor:none}
  a{color:inherit;text-decoration:none}
  img{display:block;max-width:100%}

  /* ── MESH BG ── */
  #mesh{position:fixed;inset:0;z-index:0;pointer-events:none;overflow:hidden}
  .orb{position:absolute;border-radius:50%;filter:blur(80px);opacity:.55;animation:drift linear infinite}
  .orb1{width:700px;height:700px;background:radial-gradient(circle,#004d2e,transparent 70%);top:-200px;left:-200px;animation-duration:22s}
  .orb2{width:600px;height:600px;background:radial-gradient(circle,#001a10,transparent 70%);bottom:-150px;right:-150px;animation-duration:27s;animation-direction:reverse}
  .orb3{width:450px;height:450px;background:radial-gradient(circle,rgba(0,229,160,.12),transparent 70%);top:40%;left:55%;animation-duration:18s;animation-delay:-9s}
  .orb4{width:350px;height:350px;background:radial-gradient(circle,#003320,transparent 70%);top:20%;right:10%;animation-duration:32s;animation-delay:-6s}
  @keyframes drift{
    0%  {transform:translate(0,0) scale(1)}
    25% {transform:translate(60px,-40px) scale(1.08)}
    50% {transform:translate(-30px,60px) scale(.95)}
    75% {transform:translate(50px,30px) scale(1.05)}
    100%{transform:translate(0,0) scale(1)}
  }

  /* grain */
  body::after{content:'';position:fixed;inset:0;z-index:1;pointer-events:none;opacity:.025;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E");background-size:200px}

  /* ── CURSOR ── */
  #cd{position:fixed;z-index:9999;pointer-events:none;width:8px;height:8px;border-radius:50%;background:var(--mint);transform:translate(-50%,-50%);mix-blend-mode:screen}
  #cr{position:fixed;z-index:9998;pointer-events:none;width:34px;height:34px;border-radius:50%;border:1px solid rgba(0,229,160,.4);transform:translate(-50%,-50%);transition:width .18s,height .18s,border-color .18s}
  body.hov #cr{width:50px;height:50px;border-color:var(--mint)}

  /* ── GLASS CARD ── */
  .glass{
    background:var(--glass);
    backdrop-filter:blur(22px) saturate(1.4);
    -webkit-backdrop-filter:blur(22px) saturate(1.4);
    border:1px solid var(--glass-b);
    border-radius:var(--r);
    transition:background .25s,border-color .25s,transform .25s;
  }
  .glass:hover{background:var(--glass-hover);border-color:rgba(0,229,160,.2)}

  /* ── NAV ── */
  .nav{position:fixed;top:0;left:0;right:0;z-index:700;height:68px;display:flex;align-items:center;justify-content:space-between;padding:0 clamp(1.2rem,5vw,4.5rem);transition:all .35s}
  .nav.s{background:rgba(5,15,10,.7);backdrop-filter:blur(20px);border-bottom:1px solid rgba(255,255,255,.06)}
  .nlogo{font-family:'Syne',sans-serif;font-size:1.2rem;font-weight:800;cursor:none;color:var(--text);letter-spacing:-.01em}
  .nlogo em{font-style:normal;color:var(--mint)}
  .nlinks{display:flex;gap:2.2rem;align-items:center;list-style:none}
  .nlk{font-size:.75rem;font-weight:600;letter-spacing:.1em;text-transform:uppercase;background:none;border:none;cursor:none;color:var(--muted);transition:color .18s}
  .nlk:hover{color:var(--mint)}
  .nav-btn{padding:9px 22px;background:rgba(0,229,160,.12);border:1px solid rgba(0,229,160,.3);border-radius:50px;font-family:'Outfit',sans-serif;font-size:.75rem;font-weight:700;cursor:none;color:var(--mint);transition:all .2s;letter-spacing:.08em}
  .nav-btn:hover{background:rgba(0,229,160,.22);box-shadow:0 0 20px rgba(0,229,160,.2)}

  /* ── REVEAL ── */
  .rv{opacity:0;transform:translateY(28px);transition:opacity .75s cubic-bezier(.16,1,.3,1),transform .75s cubic-bezier(.16,1,.3,1)}
  .rv.on{opacity:1;transform:none}
  .d1{transition-delay:.08s}.d2{transition-delay:.16s}.d3{transition-delay:.24s}.d4{transition-delay:.32s}

  /* ── HERO ── */
  .hero{position:relative;z-index:2;min-height:100vh;display:flex;align-items:center;padding:90px clamp(1.2rem,5vw,4.5rem) 60px}
  .hero-inner{max-width:1240px;margin:0 auto;width:100%;display:grid;grid-template-columns:1fr 420px;gap:3.5rem;align-items:center}

  /* left */
  .hero-badge{display:inline-flex;align-items:center;gap:.55rem;padding:7px 16px;background:rgba(0,229,160,.08);border:1px solid rgba(0,229,160,.2);border-radius:50px;margin-bottom:2rem;backdrop-filter:blur(10px)}
  .badge-dot{width:7px;height:7px;border-radius:50%;background:#22c55e;box-shadow:0 0 0 3px rgba(34,197,94,.2);animation:pulse 2s infinite}
  .badge-txt{font-size:.7rem;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:rgba(0,229,160,.8)}
  .hero-name{font-family:'Syne',sans-serif;font-size:clamp(3.5rem,7.5vw,7rem);font-weight:800;line-height:.85;letter-spacing:-.04em;color:var(--text);margin-bottom:1.5rem}
  .hero-name .outline{color:transparent;-webkit-text-stroke:2px var(--mint)}
  .hero-tagline{font-size:1.05rem;font-weight:400;color:var(--muted);line-height:1.75;max-width:480px;margin-bottom:2.8rem}
  .hero-btns{display:flex;gap:1rem;flex-wrap:wrap;margin-bottom:3.5rem}
  .btn-mint{display:inline-flex;align-items:center;gap:.55rem;padding:14px 30px;background:linear-gradient(135deg,var(--mint),var(--mint2));border:none;border-radius:50px;font-family:'Outfit',sans-serif;font-weight:700;font-size:.9rem;color:var(--bg);cursor:none;transition:all .25s;box-shadow:0 0 30px rgba(0,229,160,.25),0 4px 16px rgba(0,0,0,.2)}
  .btn-mint:hover{transform:translateY(-2px);box-shadow:0 0 50px rgba(0,229,160,.4),0 8px 24px rgba(0,0,0,.3)}
  .btn-gl{display:inline-flex;align-items:center;gap:.55rem;padding:14px 30px;background:var(--glass);border:1px solid var(--glass-b);border-radius:50px;font-family:'Outfit',sans-serif;font-weight:600;font-size:.9rem;color:var(--text);cursor:none;transition:all .25s;backdrop-filter:blur(10px)}
  .btn-gl:hover{border-color:rgba(0,229,160,.3);color:var(--mint)}
  .hero-stats{display:flex;gap:2.5rem;padding-top:2.5rem;border-top:1px solid rgba(255,255,255,.07)}
  .hs-n{font-family:'Syne',sans-serif;font-size:2.2rem;font-weight:800;color:var(--text);line-height:1;letter-spacing:-.04em}
  .hs-n span{color:var(--mint)}
  .hs-l{font-size:.65rem;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:var(--muted);margin-top:4px}

  /* ── HERO PHOTO CARD ── */
  .hero-photo-card{
    position:relative;
    border-radius:28px;
    overflow:hidden;
    border:1px solid rgba(0,229,160,.15);
    box-shadow:0 0 80px rgba(0,229,160,.08),0 40px 80px rgba(0,0,0,.5);
  }
  .hero-photo-card img{width:100%;aspect-ratio:3/4;object-fit:cover;object-position:center top;display:block;filter:brightness(.9) saturate(1.15)}
  /* green tint overlay */
  .hero-photo-card::before{content:'';position:absolute;inset:0;background:linear-gradient(160deg,rgba(0,77,46,.3) 0%,transparent 50%,rgba(0,0,0,.4) 100%);z-index:1}
  /* glass info strip at bottom */
  .photo-info{position:absolute;bottom:1.2rem;left:1.2rem;right:1.2rem;z-index:2;background:rgba(5,15,10,.5);backdrop-filter:blur(18px);border:1px solid rgba(0,229,160,.15);border-radius:14px;padding:1.1rem 1.4rem;display:flex;justify-content:space-between;align-items:center}
  .photo-info-name{font-family:'Syne',sans-serif;font-size:1rem;font-weight:800;color:#fff;letter-spacing:-.01em}
  .photo-info-role{font-size:.65rem;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:rgba(0,229,160,.7);margin-top:2px}
  .photo-info-yrs{font-family:'Syne',sans-serif;font-size:1.8rem;font-weight:800;color:var(--mint);line-height:1;letter-spacing:-.04em}
  .photo-info-yrs-l{font-size:.6rem;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:var(--muted);text-align:right;margin-top:2px}
  /* corner glow */
  .hero-photo-card::after{content:'';position:absolute;top:-40px;right:-40px;width:180px;height:180px;border-radius:50%;background:radial-gradient(circle,rgba(0,229,160,.18),transparent 70%);z-index:0}

  /* ── TICKER ── */
  .ticker{overflow:hidden;position:relative;z-index:2;padding:18px 0;border-top:1px solid rgba(255,255,255,.05);border-bottom:1px solid rgba(255,255,255,.05);background:rgba(255,255,255,.02)}
  .ticker-t{display:flex;animation:tk 28s linear infinite;white-space:nowrap}
  .ticker-i{display:inline-flex;align-items:center;gap:1.4rem;padding:0 2rem;font-family:'Syne',sans-serif;font-size:1rem;font-weight:700;color:rgba(255,255,255,.12);letter-spacing:.06em}
  .ticker-i span{color:var(--mint);font-size:.5rem}
  @keyframes tk{from{transform:translateX(0)}to{transform:translateX(-50%)}}

  /* ── SECTION ── */
  .sec{padding:100px clamp(1.2rem,5vw,4.5rem);position:relative;z-index:2}
  .sec-inner{max-width:1200px;margin:0 auto}
  .sec-label{font-size:.65rem;font-weight:700;letter-spacing:.24em;text-transform:uppercase;color:var(--mint);margin-bottom:.8rem;display:flex;align-items:center;gap:.7rem}
  .sec-label::before{content:'';width:22px;height:1px;background:var(--mint)}
  .sec-h{font-family:'Syne',sans-serif;font-size:clamp(2.2rem,4.5vw,3.6rem);font-weight:800;line-height:.9;letter-spacing:-.04em;color:var(--text);margin-bottom:4rem}
  .sec-h em{font-style:italic;color:var(--mint)}

  /* ── SERVICES ── */
  .svc-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:14px}
  .svc-card{padding:2.2rem;cursor:default}
  .svc-icon{font-size:2rem;margin-bottom:1.3rem;display:block;color:var(--mint);transition:transform .3s cubic-bezier(.34,1.56,.64,1)}
  .svc-card:hover .svc-icon{transform:scale(1.3) rotate(10deg)}
  .svc-h{font-family:'Syne',sans-serif;font-size:1.1rem;font-weight:800;color:var(--text);margin-bottom:.55rem;letter-spacing:-.01em}
  .svc-d{font-size:.86rem;color:var(--muted);line-height:1.68}

  /* ── SKILLS ── */
  .sk-wrap{display:flex;flex-wrap:wrap;gap:10px}
  .sk{padding:9px 20px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:50px;font-size:.82rem;font-weight:500;color:var(--muted);cursor:default;transition:all .22s;backdrop-filter:blur(8px)}
  .sk:hover{background:rgba(0,229,160,.1);border-color:rgba(0,229,160,.35);color:var(--mint);box-shadow:0 0 16px rgba(0,229,160,.1)}

  /* ── PROJECTS ── */
  .proj-list{display:flex;flex-direction:column;gap:1px;border-radius:var(--r);overflow:hidden;border:1px solid rgba(255,255,255,.07)}
  .proj-row{display:grid;grid-template-columns:auto 1fr auto;gap:2rem;align-items:center;padding:2rem 2.5rem;background:rgba(255,255,255,.03);border-bottom:1px solid rgba(255,255,255,.05);transition:background .22s,padding .25s;cursor:default;position:relative}
  .proj-row:last-child{border-bottom:none}
  .proj-row:hover{background:rgba(0,229,160,.05);padding-left:3rem}
  .proj-num{font-family:'Syne',sans-serif;font-size:1.6rem;font-weight:800;color:rgba(255,255,255,.07);line-height:1;transition:color .22s;letter-spacing:-.04em}
  .proj-row:hover .proj-num{color:rgba(0,229,160,.25)}
  .proj-title{font-family:'Syne',sans-serif;font-size:1.2rem;font-weight:800;color:var(--text);letter-spacing:-.02em;margin-bottom:.3rem;transition:color .22s}
  .proj-row:hover .proj-title{color:var(--mint)}
  .proj-desc{font-size:.86rem;color:var(--muted);line-height:1.6}
  .proj-meta{display:flex;align-items:center;gap:.8rem;flex-shrink:0}
  .proj-year{font-size:.65rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--muted)}
  .proj-arrow{width:40px;height:40px;border-radius:50%;border:1px solid rgba(255,255,255,.1);display:flex;align-items:center;justify-content:center;color:var(--muted);transition:all .22s;flex-shrink:0}
  .proj-row:hover .proj-arrow{border-color:var(--mint);color:var(--mint);transform:rotate(-45deg);background:rgba(0,229,160,.08)}

  /* ── JOURNEY ── */
  .j-grid{display:grid;grid-template-columns:1fr 1fr;gap:4rem}
  .j-label{font-size:.62rem;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:var(--muted);padding-bottom:1rem;border-bottom:1px solid rgba(255,255,255,.07);margin-bottom:0}
  .exp-item{padding:1.5rem 0;border-bottom:1px solid rgba(255,255,255,.05);display:flex;justify-content:space-between;align-items:flex-start;gap:1rem}
  .exp-item:last-child{border-bottom:none}
  .exp-role{font-family:'Syne',sans-serif;font-size:1rem;font-weight:800;color:var(--text);margin-bottom:.22rem;letter-spacing:-.01em}
  .exp-co{font-size:.8rem;color:var(--muted)}
  .exp-date{font-size:.65rem;font-weight:700;color:var(--mint);white-space:nowrap;text-align:right;flex-shrink:0;padding-top:3px;line-height:1.75}
  .edu-card{padding:1.4rem 1.6rem;margin-bottom:10px;cursor:default}
  .edu-card:hover{border-color:rgba(0,229,160,.3) !important}
  .edu-deg{font-family:'Syne',sans-serif;font-size:.95rem;font-weight:800;color:var(--text);margin-bottom:.22rem}
  .edu-inst{font-size:.8rem;color:var(--muted);margin-bottom:.7rem}
  .edu-chips{display:flex;gap:7px;flex-wrap:wrap}
  .edu-chip{font-size:.62rem;font-weight:700;padding:3px 11px;background:rgba(0,229,160,.1);color:var(--mint);border:1px solid rgba(0,229,160,.2);border-radius:50px;letter-spacing:.06em}

  /* ── CONTACT ── */
  .contact-wrap{display:grid;grid-template-columns:1fr 1fr;gap:14px}
  .contact-l{padding:3.5rem;display:flex;flex-direction:column;justify-content:space-between;gap:2rem;position:relative;overflow:hidden}
  .contact-l::before{content:'';position:absolute;top:-80px;right:-80px;width:280px;height:280px;border-radius:50%;background:radial-gradient(circle,rgba(0,229,160,.1),transparent 70%);pointer-events:none}
  .contact-big{font-family:'Syne',sans-serif;font-size:clamp(2.2rem,4vw,3.2rem);font-weight:800;color:var(--text);line-height:.9;letter-spacing:-.04em}
  .contact-big em{font-style:italic;color:var(--mint)}
  .contact-sub{font-size:.95rem;color:var(--muted);line-height:1.7}
  .soc-strip{display:flex;gap:8px;flex-wrap:wrap}
  .soc-b{padding:9px 18px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.09);border-radius:50px;font-size:.72rem;font-weight:600;color:var(--muted);letter-spacing:.06em;transition:all .2s;backdrop-filter:blur(8px)}
  .soc-b:hover{border-color:rgba(0,229,160,.35);color:var(--mint);background:rgba(0,229,160,.08)}
  .contact-r{padding:3rem;display:flex;flex-direction:column;gap:1rem}
  .ci{padding:1.3rem 1.6rem;cursor:default}
  .ci-l{font-size:.6rem;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:var(--muted);margin-bottom:.35rem}
  .ci-v{font-family:'Syne',sans-serif;font-size:1.1rem;font-weight:800;color:var(--text);letter-spacing:-.01em;transition:color .18s;display:block}
  .ci-v:hover{color:var(--mint)}
  .vac-row{display:flex;flex-wrap:wrap;gap:7px}
  .vac{padding:5px 13px;border:1px solid rgba(0,229,160,.2);border-radius:50px;font-size:.65rem;font-weight:700;color:rgba(0,229,160,.7);letter-spacing:.08em;text-transform:uppercase}

  /* FOOTER */
  .foot{padding:1.6rem clamp(1.2rem,5vw,4.5rem);border-top:1px solid rgba(255,255,255,.05);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:.8rem;position:relative;z-index:2}
  .foot p{font-size:.65rem;color:rgba(255,255,255,.18);letter-spacing:.1em;font-weight:500}

  /* RESPONSIVE */
  @media(max-width:900px){
    .hero-inner{grid-template-columns:1fr !important}
    .hero-photo-card{max-height:380px}
    .hero-photo-card img{aspect-ratio:auto;height:380px}
    .j-grid{grid-template-columns:1fr !important;gap:2.5rem !important}
    .contact-wrap{grid-template-columns:1fr !important}
    .proj-row{grid-template-columns:1fr auto !important}
    .proj-num{display:none}
  }
  @media(max-width:640px){
    .desk-nav{display:none !important}
    .mob-ham{display:flex !important}
  }

  @keyframes pulse{0%,100%{box-shadow:0 0 0 3px rgba(34,197,94,.2)}50%{box-shadow:0 0 0 6px rgba(34,197,94,.05)}}
`;

/* ── MESH BG ─────────────────────────────── */
function MeshBg() {
  return (
    <div id="mesh">
      <div className="orb orb1"/>
      <div className="orb orb2"/>
      <div className="orb orb3"/>
      <div className="orb orb4"/>
    </div>
  );
}

/* ── CURSOR ─────────────────────────────── */
function Cursor() {
  const dot = useRef(null), ring = useRef(null);
  const rp = useRef({x:-200,y:-200}), mp = useRef({x:-200,y:-200});
  useEffect(() => {
    const mv = e => { mp.current = {x:e.clientX,y:e.clientY}; };
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
    const over = e => { if (e.target.closest("a,button,[data-h]")) document.body.classList.add("hov"); };
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
function Ctr({to}) {
  const [v,setV] = useState(0); const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return; obs.disconnect();
      let c=0; const id = setInterval(()=>{ c=Math.min(c+Math.ceil(to/40),to); setV(c); if(c>=to) clearInterval(id); },28);
    },{threshold:.5});
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  },[to]);
  return <span ref={ref}>{v}</span>;
}

/* ── NAV ─────────────────────────────────── */
function Nav({ D })  {
  const [s,setS] = useState(false), [open,setOpen] = useState(false);
  useEffect(()=>{ const h=()=>setS(window.scrollY>50); window.addEventListener("scroll",h); return()=>window.removeEventListener("scroll",h); },[]);
  const go = id => { setOpen(false); document.getElementById(id)?.scrollIntoView({behavior:"smooth"}); };
  const links = [D.services?.length&&["services","Services"],D.projects?.length&&["projects","Work"],(D.experience?.length||D.education?.length)&&["journey","Journey"],["contact","Contact"]].filter(Boolean);
  return (
    <nav className={`nav${s?" s":""}`}>
      <div className="nlogo" onClick={()=>go("hero")}>{D.firstName}<em>.</em></div>
      <ul className="nlinks desk-nav" style={{display:"flex",gap:"2rem",listStyle:"none",alignItems:"center"}}>
        {links.map(([id,lbl])=><li key={id}><button className="nlk" onClick={()=>go(id)}>{lbl}</button></li>)}
        {D.cv&&<li><button className="nav-btn" onClick={()=>window.open(D.cv)}>CV ↓</button></li>}
      </ul>
      <button className="mob-ham" onClick={()=>setOpen(o=>!o)} style={{display:"none",background:"none",border:"none",cursor:"none",flexDirection:"column",gap:5}}>
        {[0,1,2].map(i=><span key={i} style={{display:"block",width:22,height:1.5,background:"#fff",transition:"all .25s",transform:open&&i===0?"translateY(6.5px) rotate(45deg)":open&&i===2?"translateY(-6.5px) rotate(-45deg)":open&&i===1?"scaleX(0)":"none"}}/>)}
      </button>
      {open&&(
        <div style={{position:"absolute",top:68,left:0,right:0,background:"rgba(5,15,10,.97)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(255,255,255,.06)",padding:"1rem 1.5rem 2rem"}}>
          {links.map(([id,lbl])=><button key={id} onClick={()=>go(id)} style={{display:"block",width:"100%",textAlign:"left",background:"none",border:"none",borderBottom:"1px solid rgba(255,255,255,.06)",cursor:"none",padding:"14px 0",fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"1.2rem",color:"#fff"}}>{lbl}</button>)}
        </div>
      )}
    </nav>
  );
}

/* ── HERO ─────────────────────────────────── */
function Hero({ D, expYrs }){
  const [inn,setInn] = useState(false);
  useEffect(()=>{ setTimeout(()=>setInn(true),100); },[]);
  const a = (d=0) => ({opacity:inn?1:0,transform:inn?"none":"translateY(28px)",transition:`opacity .9s cubic-bezier(.16,1,.3,1) ${d}ms,transform .9s cubic-bezier(.16,1,.3,1) ${d}ms`});

  return (
    <section id="hero" className="hero">
      <div className="hero-inner">
        {/* LEFT TEXT */}
        <div>
          <div style={a(0)}>
            
          </div>
          <h1 className="hero-name" style={a(100)}>
            <span style={{display:"block"}}>{D.firstName}</span>
            <span className="outline" style={{display:"block"}}>{D.lastName}</span>
          </h1>
          {D.tagline && <p className="hero-tagline" style={a(220)}>{D.tagline}</p>}
          <div className="hero-btns" style={a(320)}>
            <button className="btn-mint" onClick={()=>document.getElementById("contact")?.scrollIntoView({behavior:"smooth"})}>
              Get in touch
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
            {D.cv&&<a href={D.cv} className="btn-gl">Download CV</a>}
          </div>
          <div className="hero-stats" style={a(420)}>
            {[[expYrs,"Yrs Exp."],[D.projects?.length||4,"Projects"],[D.skills?.length||12,"Skills"]].map(([n,l])=>(
              <div key={l}>
                <div className="hs-n"><Ctr to={n}/><span>+</span></div>
                <div className="hs-l">{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* PHOTO CARD */}
        {D.profilePhoto && (
          <div style={a(160)}>
            <div className="hero-photo-card">
              <img src={D.profilePhoto} alt={D.name}/>
              <div style={{position:"absolute",inset:0,background:"linear-gradient(160deg,rgba(0,77,46,.3) 0%,transparent 50%,rgba(0,0,0,.45) 100%)",zIndex:1}}/>
              <div className="photo-info">
                <div>
                  <div className="photo-info-name">{D.name}</div>
                  {D.qualification&&<div className="photo-info-role">{D.qualification}</div>}
                </div>
                <div style={{textAlign:"right"}}>
                  <div className="photo-info-yrs">{expYrs}+</div>
                  <div className="photo-info-yrs-l">years</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/* ── TICKER ─────────────────────────────── */
function Ticker({ D }) {
  const items = D.skills?.length ? [...D.skills,...D.skills,...D.skills,...D.skills] : [];
  return (
    <div className="ticker" style={{position:"relative",zIndex:2}}>
      <div className="ticker-t">
        {items.map((sk,i)=><span key={i} className="ticker-i">{sk}<span>◆</span></span>)}
      </div>
    </div>
  );
}

/* ── SERVICES ─────────────────────────────── */
function Services({ D })  {
  if (!D.services?.length) return null;
  return (
    <section id="services" className="sec">
      <div className="sec-inner">
        <div className="rv">
          <div className="sec-label">What I offer</div>
          <h2 className="sec-h">Services &<br/><em>Expertise</em></h2>
        </div>
        <div className="svc-grid rv d1">
          {D.services.map((sv,i)=>(
            <div key={i} className={`glass svc-card rv d${i+1}`}>
              <span className="svc-icon">{sv.icon}</span>
              <div className="svc-h">{sv.heading}</div>
              <div className="svc-d">{sv.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── SKILLS ───────────────────────────────── */
function Skills({ D })  {
  if (!D.skills?.length) return null;
  return (
    <section className="sec" style={{paddingTop:40,paddingBottom:60}}>
      <div className="sec-inner">
        <div className="sec-label rv" style={{marginBottom:"1.4rem"}}>Tech Stack</div>
        <div className="sk-wrap rv d1">
          {D.skills.map((sk,i)=><span key={i} className={`sk rv d${Math.min(i%4+1,4)}`}>{sk}</span>)}
        </div>
      </div>
    </section>
  );
}

/* ── PROJECTS ─────────────────────────────── */
function Projects({ D })  {
  if (!D.projects?.length) return null;
  return (
    <section id="projects" className="sec">
      <div className="sec-inner">
        <div className="rv">
          <div className="sec-label">Portfolio</div>
          <h2 className="sec-h">Selected<br/><em>Work</em></h2>
        </div>
        <div className="proj-list rv d1">
          {D.projects.map((p,i)=>(
            <div key={i} className="proj-row">
              <div className="proj-num">0{i+1}</div>
              <div>
                <div className="proj-title">{p.title}</div>
                <div className="proj-desc">{p.description}</div>
              </div>
              <div className="proj-meta">
                <span className="proj-year">{p.year}</span>
                {p.link
                  ? <a href={p.link} target="_blank" rel="noreferrer" className="proj-arrow"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M7 17L17 7M7 7h10v10"/></svg></a>
                  : <div className="proj-arrow" style={{opacity:.25}}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M7 17L17 7M7 7h10v10"/></svg></div>
                }
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── JOURNEY ──────────────────────────────── */
function Journey({ D, fmt }){
  const hE=D.experience?.length>0, hD=D.education?.length>0;
  if (!hE&&!hD) return null;
  return (
    <section id="journey" className="sec">
      <div className="sec-inner">
        <div className="rv">
          <div className="sec-label">Background</div>
          <h2 className="sec-h">My<br/><em>Journey</em></h2>
        </div>
        <div className="j-grid">
          {hE&&(
            <div className="rv d1">
              <div className="j-label">Work Experience</div>
              {D.experience.map((e,i)=>(
                <div key={i} className="exp-item">
                  <div><div className="exp-role">{e.jobTitle}</div><div className="exp-co">{e.company}</div></div>
                  {/* <div className="exp-date">{fmt(e.startDate)}<br/>—<br/>{fmt(e.endDate)}</div> */}
                </div>
              ))}
            </div>
          )}
          {hD&&(
            <div className="rv d2">
              <div className="j-label">Education</div>
              {D.education.map((e,i)=>(
                <div key={i} className={`glass edu-card`} style={{border:"1px solid rgba(0,229,160,.1)"}}>
                  <div className="edu-deg">{e.education}</div>
                  <div className="edu-inst">{e.institution}</div>
                  <div className="edu-chips">
                    {e.year&&<span className="edu-chip">{e.year}</span>}
                    {e.percentage&&<span className="edu-chip">{e.percentage}</span>}
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
    <section id="contact" className="sec">
      <div className="sec-inner">
        <div className="rv">
          <div className="sec-label">Get in touch</div>
          <h2 className="sec-h">Let's<br/><em>Connect</em></h2>
        </div>
        <div className="contact-wrap rv d1">
          <div className="glass contact-l">
            <div>
              <div className="contact-big">Ready to build<br/>something<br/><em>remarkable?</em></div>
              <div className="contact-sub" style={{marginTop:"1.4rem"}}>Open to new projects, roles & conversations. I respond within 24 hours.</div>
            </div>
            {D.lookingVacancy?.length>0&&(
              <div>
                <div style={{fontSize:".6rem",fontWeight:700,letterSpacing:".18em",textTransform:"uppercase",color:"var(--muted)",marginBottom:".7rem"}}>Open to</div>
                <div className="vac-row">{D.lookingVacancy.map((v,i)=><span key={i} className="vac">{v}</span>)}</div>
              </div>
            )}
            <div className="soc-strip">
              {soc.linkedin&&<a href={soc.linkedin} target="_blank" rel="noreferrer" className="soc-b">LinkedIn</a>}
              {soc.github&&<a href={soc.github} target="_blank" rel="noreferrer" className="soc-b">GitHub</a>}
              {soc.twitter&&<a href={soc.twitter} target="_blank" rel="noreferrer" className="soc-b">Twitter</a>}
              {soc.website&&<a href={soc.website} target="_blank" rel="noreferrer" className="soc-b">Website</a>}
            </div>
          </div>
          <div className="contact-r">
            {D.email&&<div className="glass ci"><div className="ci-l">Email</div><a href={`mailto:${D.email}`} className="ci-v">{D.email}</a></div>}
            {D.phone&&<div className="glass ci"><div className="ci-l">Phone</div><a href={`tel:${D.phone}`} className="ci-v">{D.phone}</a></div>}
            {D.place&&<div className="glass ci"><div className="ci-l">Location</div><div className="ci-v" style={{opacity:.55,cursor:"default"}}>{D.place}</div></div>}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── APP ─────────────────────────────────── */
export default function Profile12({ data }) {

  const D = data ||DEMO|| {};

  const soc = D.socials?.[0] || {};

  const fmt = d =>
    !d
      ? " "
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
      <MeshBg/>
      <Cursor/>

      <Nav D={D}/>
      <Hero D={D} expYrs={expYrs}/>
      <Ticker D={D}/>
      <Services D={D}/>
      <Skills D={D}/>
      <Projects D={D}/>
      <Journey D={D} fmt={fmt}/>
      <Contact D={D} soc={soc}/>

      <footer className="foot">
        <p>© {new Date().getFullYear()} {D.name} — All rights reserved</p>
        <p>{D.place}</p>
      </footer>
    </>
  );
}