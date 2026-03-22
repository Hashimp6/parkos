import { useState, useEffect, useRef } from "react";

const DEMO = {
  name: "Arjun Menon", firstName: "Arjun", lastName: "Menon",
  role: "Full‑Stack Engineer", tagline: "I BUILD\nTHINGS\nPEOPLE\nLOVE.",
  about: "7 years turning complex problems into fast, beautiful web products. I care equally about architecture and aesthetics — from the database to the last animation.",
  email: "arjun.menon@gmail.com", phone: "+91 98765 43210", place: "Kochi, Kerala",
  profilePhoto: "https://i.pravatar.cc/1200?img=68",
  qualification: "B.Tech CS · NIT Calicut", cv: "/cv.pdf",
  skills: ["React","Node.js","TypeScript","MongoDB","GraphQL","Docker","AWS","Figma","Python","Redis","Next.js","PostgreSQL"],
  services: [
    { heading: "Product Engineering", description: "End-to-end web apps, obsessively optimised from architecture to deployment." },
    { heading: "Interface Design", description: "Interfaces that feel inevitable — every pixel earned, every motion purposeful." },
    { heading: "API & Backend", description: "Scalable REST & GraphQL systems with clean domain logic and room to grow." },
    { heading: "Cloud & DevOps", description: "Containerised, automated infrastructure on AWS & GCP that just works." },
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
    { title: "DevBoard", description: "Real-time dev dashboard — GitHub, Jira & Slack unified.", link: "#", year: "2024", idx: "01" },
    { title: "ShopSphere", description: "Multi-tenant e-commerce with live inventory & payments.", link: "#", year: "2023", idx: "02" },
    { title: "AIResume", description: "AI resume scorer & rewriter. 2,000+ users in month one.", link: "#", year: "2023", idx: "03" },
    { title: "NoteStack", description: "Collaborative markdown workspace with real-time sync.", link: null, year: "2022", idx: "04" },
  ],
  socials: [{ linkedin:"https://linkedin.com", github:"https://github.com", twitter:"https://twitter.com", website:"https://arjunmenon.dev" }],
  lookingVacancy: ["Full-Stack Engineer","Frontend Lead","Technical Co-founder"],
};


/* ══════════ STYLES ══════════════════════════════════════════ */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Unbounded:wght@400;700;900&family=Instrument+Sans:ital,wght@0,400;0,500;0,600;1,400&display=swap');

  :root {
    --w:   #f8f8f5;
    --ink: #0c0c0a;
    --lime:#b8f724;
    --lime2:#d4ff3a;
    --mid: #6b6b60;
    --border: rgba(12,12,10,.1);
  }

  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  html{scroll-behavior:smooth}
  body{background:var(--w);color:var(--ink);font-family:'Instrument Sans',sans-serif;-webkit-font-smoothing:antialiased;overflow-x:hidden;cursor:none}
  a{color:inherit;text-decoration:none}
  img{display:block;max-width:100%}

  /* CURSOR */
  #cd{position:fixed;z-index:9999;pointer-events:none;width:10px;height:10px;border-radius:50%;background:var(--lime);transform:translate(-50%,-50%);mix-blend-mode:multiply;transition:width .15s,height .15s}
  #cr{position:fixed;z-index:9998;pointer-events:none;width:34px;height:34px;border-radius:50%;border:1.5px solid rgba(12,12,10,.35);transform:translate(-50%,-50%);transition:width .2s,height .2s,border-color .2s}
  body.hov #cd{width:16px;height:16px}
  body.hov #cr{width:50px;height:50px;border-color:var(--lime)}

  /* NAV */
  .nav{position:fixed;top:0;left:0;right:0;z-index:700;height:64px;display:flex;align-items:center;justify-content:space-between;padding:0 clamp(1.5rem,5vw,5rem);transition:background .35s,border .35s}
  .nav.s{background:rgba(248,248,245,.92);backdrop-filter:blur(16px);border-bottom:1px solid var(--border)}
  .nlogo{font-family:'Unbounded',sans-serif;font-size:1.05rem;font-weight:900;cursor:none;letter-spacing:-.02em;color:var(--ink)}
  .nlogo span{color:var(--lime);background:var(--ink);padding:0 4px;border-radius:3px}
  .nlinks{display:flex;gap:2rem;align-items:center;list-style:none}
  .nlk{font-size:.72rem;font-weight:600;letter-spacing:.12em;text-transform:uppercase;background:none;border:none;cursor:none;color:var(--mid);transition:color .18s;padding:3px 0}
  .nlk:hover{color:var(--ink)}
  .ncv{padding:8px 20px;background:var(--ink);color:var(--w);border:none;border-radius:4px;font-family:'Instrument Sans',sans-serif;font-size:.72rem;font-weight:600;letter-spacing:.1em;text-transform:uppercase;cursor:none;transition:background .2s}
  .ncv:hover{background:var(--lime);color:var(--ink)}

  /* HERO ── full-viewport, circular photo as focal point */
  .hero{
    min-height:100vh;position:relative;overflow:hidden;
    display:flex;align-items:center;
    padding:80px clamp(1.5rem,5vw,5rem) 60px;
    background:var(--w);
  }
  /* BIG outlined background text */
  .hero-ghost{
    position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);
    font-family:'Unbounded',sans-serif;font-size:clamp(8rem,20vw,22rem);font-weight:900;
    color:transparent;-webkit-text-stroke:1px rgba(12,12,10,.05);
    white-space:nowrap;pointer-events:none;user-select:none;letter-spacing:-.04em;
    line-height:1;
  }
  .hero-inner{
    max-width:1300px;margin:0 auto;width:100%;
    display:grid;grid-template-columns:1fr 480px 1fr;
    gap:2rem;align-items:center;position:relative;z-index:2;
  }
  /* left text */
  .hero-left{display:flex;flex-direction:column;gap:0}
  .hero-intro{font-size:.72rem;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:var(--mid);margin-bottom:1.8rem;display:flex;align-items:center;gap:.6rem}
  .hero-intro-dot{width:7px;height:7px;border-radius:50%;background:#22c55e;box-shadow:0 0 0 3px rgba(34,197,94,.2);animation:pulse 2s infinite}
  .hero-name-left{font-family:'Unbounded',sans-serif;font-size:clamp(3rem,6vw,5.5rem);font-weight:900;line-height:.88;letter-spacing:-.04em;color:var(--ink)}
  /* right text */
  .hero-right{display:flex;flex-direction:column;align-items:flex-end;text-align:right}
  .hero-name-right{font-family:'Unbounded',sans-serif;font-size:clamp(3rem,6vw,5.5rem);font-weight:900;line-height:.88;letter-spacing:-.04em;color:transparent;-webkit-text-stroke:2px var(--ink)}
  .hero-tagline-r{font-family:'Unbounded',sans-serif;font-size:clamp(1.4rem,2.5vw,2.2rem);font-weight:900;color:var(--ink);line-height:.9;letter-spacing:-.04em;margin-top:2rem}
  .hero-tagline-r em{font-style:normal;color:var(--ink);background:var(--lime);padding:2px 6px}
  /* CIRCLE PHOTO */
  .hero-circle-wrap{position:relative;display:flex;align-items:center;justify-content:center}
  .hero-circle{
    width:clamp(280px,35vw,440px);height:clamp(280px,35vw,440px);
    border-radius:50%;overflow:hidden;
    border:3px solid var(--ink);
    position:relative;flex-shrink:0;
    box-shadow:12px 12px 0 var(--ink);
  }
  .hero-circle img{width:100%;height:100%;object-fit:cover;object-position:center top}
  /* lime orbit ring */
  .orbit{
    position:absolute;
    width:calc(clamp(280px,35vw,440px) + 60px);
    height:calc(clamp(280px,35vw,440px) + 60px);
    border-radius:50%;border:1.5px dashed rgba(12,12,10,.12);
    animation:spin 18s linear infinite;
    pointer-events:none;
  }
  .orbit-dot{position:absolute;top:-5px;left:50%;transform:translateX(-50%);width:10px;height:10px;border-radius:50%;background:var(--lime);border:2px solid var(--ink)}
  /* badge on circle */
  .circle-badge{
    position:absolute;bottom:-1rem;right:-1rem;
    background:var(--lime);color:var(--ink);
    border:2px solid var(--ink);border-radius:4px;
    padding:.7rem 1rem;text-align:center;
    box-shadow:4px 4px 0 var(--ink);
  }
  .circle-badge-n{font-family:'Unbounded',sans-serif;font-size:1.8rem;font-weight:900;line-height:1;letter-spacing:-.04em}
  .circle-badge-l{font-size:.58rem;font-weight:600;letter-spacing:.14em;text-transform:uppercase;margin-top:2px}
  /* below hero */
  .hero-bottom{
    position:absolute;bottom:0;left:0;right:0;
    border-top:1px solid var(--border);
    display:grid;grid-template-columns:repeat(3,1fr);
  }
  .hb-item{padding:1.4rem clamp(1.5rem,5vw,5rem);border-right:1px solid var(--border);display:flex;align-items:center;gap:1rem}
  .hb-item:last-child{border-right:none}
  .hb-n{font-family:'Unbounded',sans-serif;font-size:1.8rem;font-weight:900;color:var(--ink);letter-spacing:-.04em;line-height:1}
  .hb-l{font-size:.65rem;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:var(--mid)}

  /* REVEAL */
  .rv{opacity:0;transform:translateY(32px);transition:opacity .75s cubic-bezier(.16,1,.3,1),transform .75s cubic-bezier(.16,1,.3,1)}
  .rv.on{opacity:1;transform:none}
  .d1{transition-delay:.1s}.d2{transition-delay:.2s}.d3{transition-delay:.3s}.d4{transition-delay:.4s}

  /* MARQUEE */
  .mq-wrap{overflow:hidden;background:var(--ink);padding:18px 0}
  .mq-t{display:flex;animation:mq 22s linear infinite;white-space:nowrap}
  .mq-item{display:inline-flex;align-items:center;gap:1.2rem;padding:0 2rem;font-family:'Unbounded',sans-serif;font-size:.9rem;font-weight:700;color:rgba(248,248,245,.18);letter-spacing:.04em}
  .mq-item span{color:var(--lime);font-size:.5rem}
  @keyframes mq{from{transform:translateX(0)}to{transform:translateX(-50%)}}

  /* SECTIONS */
  .sec{padding:100px clamp(1.5rem,5vw,5rem);position:relative}
  .sec-inner{max-width:1200px;margin:0 auto}
  .sec-label{font-size:.65rem;font-weight:600;letter-spacing:.24em;text-transform:uppercase;color:var(--mid);margin-bottom:.8rem;display:flex;align-items:center;gap:.8rem}
  .sec-label::before{content:'';width:24px;height:2px;background:var(--lime);display:inline-block}
  .sec-h{font-family:'Unbounded',sans-serif;font-size:clamp(2.4rem,5vw,4rem);font-weight:900;line-height:.88;letter-spacing:-.04em;color:var(--ink);margin-bottom:5rem}
  .sec-h em{font-style:normal;background:var(--lime);padding:0 6px}

  /* SERVICES — big list */
  .svc-list{display:flex;flex-direction:column;border-top:2px solid var(--ink)}
  .svc-row{display:grid;grid-template-columns:60px 1fr 1fr 48px;gap:2rem;align-items:center;padding:2rem 0;border-bottom:2px solid var(--ink);transition:background .2s;cursor:default;position:relative}
  .svc-row:hover{background:var(--lime);margin:0 -5vw;padding-left:5vw;padding-right:5vw}
  .svc-row:hover .svc-arrow{opacity:1;transform:rotate(-45deg)}
  .svc-idx{font-family:'Unbounded',sans-serif;font-size:1rem;font-weight:900;color:var(--ink);opacity:.25;letter-spacing:-.02em}
  .svc-h{font-family:'Unbounded',sans-serif;font-size:clamp(1.1rem,2.2vw,1.6rem);font-weight:900;color:var(--ink);letter-spacing:-.03em}
  .svc-d{font-size:.9rem;color:var(--mid);line-height:1.65;font-weight:400}
  .svc-arrow{width:32px;height:32px;border:2px solid var(--ink);border-radius:50%;display:flex;align-items:center;justify-content:center;color:var(--ink);opacity:0;transition:all .25s}

  /* SKILLS */
  .skills-wrap{display:flex;flex-wrap:wrap;gap:10px}
  .sk{
    padding:10px 22px;border:2px solid var(--ink);border-radius:3px;
    font-family:'Instrument Sans',sans-serif;font-size:.85rem;font-weight:600;color:var(--ink);
    background:transparent;transition:all .2s;cursor:default;
    box-shadow:3px 3px 0 var(--ink);
  }
  .sk:hover{background:var(--lime);transform:translate(-2px,-2px);box-shadow:5px 5px 0 var(--ink)}

  /* PROJECTS — stacked list with large numbers */
  .proj-list{display:flex;flex-direction:column;border-top:2px solid var(--ink)}
  .proj-item{display:grid;grid-template-columns:120px 1fr auto;gap:2.5rem;align-items:center;padding:2.5rem 0;border-bottom:2px solid var(--ink);transition:background .2s;cursor:default;position:relative}
  .proj-item:hover{background:var(--ink);margin:0 -5vw;padding-left:5vw;padding-right:5vw}
  .proj-item:hover .proj-title,.proj-item:hover .proj-year{color:var(--w)}
  .proj-item:hover .proj-desc{color:rgba(248,248,245,.55)}
  .proj-item:hover .proj-arrow{border-color:var(--lime);color:var(--lime)}
  .proj-num{font-family:'Unbounded',sans-serif;font-size:3.5rem;font-weight:900;color:rgba(12,12,10,.07);letter-spacing:-.04em;line-height:1;transition:color .2s}
  .proj-item:hover .proj-num{color:rgba(248,248,245,.07)}
  .proj-body{display:flex;flex-direction:column;gap:.5rem}
  .proj-title-row{display:flex;align-items:center;gap:1.2rem}
  .proj-title{font-family:'Unbounded',sans-serif;font-size:clamp(1.2rem,2.5vw,1.8rem);font-weight:900;color:var(--ink);letter-spacing:-.03em;transition:color .2s}
  .proj-year{font-size:.68rem;font-weight:600;letter-spacing:.14em;color:var(--mid);text-transform:uppercase;transition:color .2s}
  .proj-desc{font-size:.9rem;color:var(--mid);line-height:1.6;transition:color .2s}
  .proj-arrow{width:44px;height:44px;border:2px solid var(--ink);border-radius:50%;display:flex;align-items:center;justify-content:center;color:var(--ink);flex-shrink:0;transition:all .25s}
  .proj-arrow:hover{background:var(--lime);border-color:var(--ink)}

  /* JOURNEY — two col clean */
  .j-grid{display:grid;grid-template-columns:1fr 1fr;gap:5rem}
  .j-head{font-family:'Unbounded',sans-serif;font-size:.65rem;font-weight:900;letter-spacing:.2em;text-transform:uppercase;color:var(--mid);padding-bottom:1rem;border-bottom:2px solid var(--ink);margin-bottom:0}
  .exp-row{padding:1.6rem 0;border-bottom:2px solid var(--border);display:flex;justify-content:space-between;align-items:flex-start;gap:1rem}
  .exp-row:last-child{border-bottom:none}
  .exp-role{font-family:'Unbounded',sans-serif;font-size:.95rem;font-weight:900;letter-spacing:-.02em;color:var(--ink);margin-bottom:.25rem}
  .exp-co{font-size:.82rem;color:var(--mid);font-weight:400}
  .exp-date{font-size:.68rem;font-weight:600;color:var(--mid);white-space:nowrap;text-align:right;flex-shrink:0;padding-top:3px;letter-spacing:.06em;line-height:1.7}
  .edu-card{padding:1.5rem;border:2px solid var(--ink);margin-bottom:6px;transition:background .2s;box-shadow:4px 4px 0 var(--ink)}
  .edu-card:hover{background:var(--lime)}
  .edu-deg{font-family:'Unbounded',sans-serif;font-size:.9rem;font-weight:900;letter-spacing:-.02em;color:var(--ink);margin-bottom:.25rem}
  .edu-inst{font-size:.8rem;color:var(--mid);margin-bottom:.7rem}
  .edu-tags{display:flex;gap:6px;flex-wrap:wrap}
  .edu-tag{font-size:.65rem;font-weight:600;padding:3px 10px;border:2px solid var(--ink);letter-spacing:.06em}

  /* CONTACT — big centered */
  .contact-sec{background:var(--ink);padding:100px clamp(1.5rem,5vw,5rem)}
  .contact-inner{max-width:1200px;margin:0 auto;text-align:center}
  .contact-big{font-family:'Unbounded',sans-serif;font-size:clamp(3rem,9vw,8rem);font-weight:900;line-height:.85;letter-spacing:-.05em;color:var(--w);margin-bottom:3rem}
  .contact-big em{font-style:normal;color:var(--lime)}
  .contact-fields{display:flex;justify-content:center;gap:4rem;flex-wrap:wrap;margin-bottom:3rem;padding-bottom:3rem;border-bottom:1px solid rgba(248,248,245,.07)}
  .cf-l{font-size:.62rem;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:rgba(248,248,245,.3);margin-bottom:.35rem}
  .cf-v{font-family:'Unbounded',sans-serif;font-size:clamp(.9rem,2vw,1.3rem);font-weight:900;color:var(--w);letter-spacing:-.02em;transition:color .2s}
  .cf-v:hover{color:var(--lime)}
  .soc-row{display:flex;justify-content:center;gap:10px;flex-wrap:wrap}
  .soc-b{display:inline-flex;align-items:center;gap:.5rem;padding:10px 22px;border:2px solid rgba(248,248,245,.12);color:rgba(248,248,245,.4);font-size:.75rem;font-weight:600;letter-spacing:.08em;text-transform:uppercase;border-radius:4px;transition:all .2s}
  .soc-b:hover{border-color:var(--lime);color:var(--lime)}
  .vacancy-row{display:flex;justify-content:center;gap:8px;flex-wrap:wrap;margin-top:2rem}
  .vac{padding:6px 16px;border:1px solid rgba(184,247,36,.2);color:var(--lime);font-size:.7rem;font-weight:600;letter-spacing:.1em;text-transform:uppercase;border-radius:3px}

  /* FOOTER */
  .foot{border-top:1px solid rgba(248,248,245,.07);padding:1.4rem clamp(1.5rem,5vw,5rem);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:.8rem;background:var(--ink)}
  .foot p{font-size:.62rem;color:rgba(248,248,245,.18);letter-spacing:.1em;font-weight:500}

  /* RESPONSIVE */
  @media(max-width:960px){
    .hero-inner{grid-template-columns:1fr !important}
    .hero-right{align-items:flex-start !important;text-align:left !important;margin-top:2rem}
    .hero-circle-wrap{justify-content:center}
    .hero-bottom{grid-template-columns:1fr 1fr 1fr !important}
    .j-grid{grid-template-columns:1fr !important;gap:3rem !important}
    .svc-row{grid-template-columns:40px 1fr !important}
    .svc-d{display:none}
    .svc-arrow{display:none}
    .proj-item{grid-template-columns:80px 1fr auto !important}
  }
  @media(max-width:640px){
    .desk-nav{display:none !important}
    .mob-ham{display:flex !important}
    .hero-bottom{grid-template-columns:1fr 1fr !important}
    .hb-item:last-child{display:none}
    .proj-item{grid-template-columns:1fr auto !important}
    .proj-num{display:none}
  }

  @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
  @keyframes pulse{0%,100%{box-shadow:0 0 0 3px rgba(34,197,94,.2)}50%{box-shadow:0 0 0 7px rgba(34,197,94,.05)}}
`;

/* ── CURSOR ─────────────────────────────────────────────── */
function Cursor() {
  const dot = useRef(null), ring = useRef(null);
  const rp = useRef({x:-200,y:-200}), mp = useRef({x:-200,y:-200});
  useEffect(() => {
    const mv = e => { mp.current = {x:e.clientX,y:e.clientY}; };
    window.addEventListener("mousemove", mv);
    let raf;
    const tick = () => {
      rp.current.x += (mp.current.x - rp.current.x) * .11;
      rp.current.y += (mp.current.y - rp.current.y) * .11;
      if (dot.current) { dot.current.style.left = mp.current.x+"px"; dot.current.style.top = mp.current.y+"px"; }
      if (ring.current) { ring.current.style.left = rp.current.x+"px"; ring.current.style.top = rp.current.y+"px"; }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const over = e => { if (e.target.closest("button,a,[data-hover]")) document.body.classList.add("hov"); };
    const out = () => document.body.classList.remove("hov");
    document.addEventListener("mouseover", over);
    document.addEventListener("mouseout", out);
    return () => { window.removeEventListener("mousemove", mv); cancelAnimationFrame(raf); document.removeEventListener("mouseover", over); document.removeEventListener("mouseout", out); };
  }, []);
  return (<><div id="cd" ref={dot}/><div id="cr" ref={ring}/></>);
}

/* ── REVEAL ─────────────────────────────────────────────── */
function useReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("on"); }), {threshold:.1});
    document.querySelectorAll(".rv").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  });
}

/* ── COUNTER ─────────────────────────────────────────────── */
function Ctr({to, suffix=""}) {
  const [v,setV] = useState(0); const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return; obs.disconnect();
      let c=0; const id = setInterval(() => { c=Math.min(c+Math.ceil(to/40),to); setV(c); if(c>=to) clearInterval(id); },28);
    },{threshold:.5});
    if(ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  },[to]);
  return <span ref={ref}>{v}{suffix}</span>;
}

/* ── NAV ────────────────────────────────────────────────── */
function Nav({ D }){
  const [s,setS] = useState(false), [open,setOpen] = useState(false);
  useEffect(() => { const h = () => setS(window.scrollY>40); window.addEventListener("scroll",h); return ()=>window.removeEventListener("scroll",h); },[]);
  const go = id => { setOpen(false); document.getElementById(id)?.scrollIntoView({behavior:"smooth"}); };
  const links = [D.services?.length&&["services","Services"],D.projects?.length&&["projects","Work"],(D.experience?.length||D.education?.length)&&["journey","Journey"],["contact","Contact"]].filter(Boolean);
  return (
    <nav className={`nav${s?" s":""}`}>
      <div className="nlogo" onClick={()=>go("hero")}>{D.firstName}<span>.</span></div>
      <ul className="nlinks desk-nav" style={{display:"flex",gap:"2rem",listStyle:"none",alignItems:"center"}}>
        {links.map(([id,lbl])=><li key={id}><button className="nlk" onClick={()=>go(id)}>{lbl}</button></li>)}
        {D.cv&&<li><button className="ncv" onClick={()=>window.open(D.cv)}>CV ↓</button></li>}
      </ul>
      <button className="mob-ham" onClick={()=>setOpen(o=>!o)} style={{display:"none",background:"none",border:"none",cursor:"none",flexDirection:"column",gap:5}}>
        {[0,1,2].map(i=><span key={i} style={{display:"block",width:22,height:2,background:"var(--ink)",transition:"all .25s",transform:open&&i===0?"translateY(7px) rotate(45deg)":open&&i===2?"translateY(-7px) rotate(-45deg)":open&&i===1?"scaleX(0)":"none"}}/>)}
      </button>
      {open&&(
        <div style={{position:"absolute",top:64,left:0,right:0,background:"var(--w)",borderBottom:"2px solid var(--ink)",padding:"1rem 1.5rem 2rem"}}>
          {links.map(([id,lbl])=><button key={id} onClick={()=>go(id)} style={{display:"block",width:"100%",textAlign:"left",background:"none",border:"none",borderBottom:"2px solid var(--border)",cursor:"none",padding:"14px 0",fontFamily:"'Unbounded',sans-serif",fontWeight:900,fontSize:"1.2rem",color:"var(--ink)"}}>{lbl}</button>)}
        </div>
      )}
    </nav>
  );
}

/* ── HERO ────────────────────────────────────────────────── */
function Hero({ D, expYrs }) {
  const [inn,setInn] = useState(false);
  const circleRef = useRef(null);
  useEffect(()=>{ setTimeout(()=>setInn(true),80); },[]);

  // scroll parallax on circle
  useEffect(()=>{
    const h = () => {
      if (!circleRef.current) return;
      const y = window.scrollY;
      circleRef.current.style.transform = `translateY(${y*.18}px)`;
    };
    window.addEventListener("scroll",h);
    return ()=>window.removeEventListener("scroll",h);
  },[]);

  const a = (d=0) => ({opacity:inn?1:0,transform:inn?"none":"translateY(30px)",transition:`opacity .9s cubic-bezier(.16,1,.3,1) ${d}ms,transform .9s cubic-bezier(.16,1,.3,1) ${d}ms`});

  return (
    <section id="hero" className="hero">
      {/* ghost bg text */}
      <div className="hero-ghost" aria-hidden="true">{D.firstName}</div>

      <div className="hero-inner">
        {/* LEFT */}
        <div className="hero-left">
          <div className="hero-intro" style={a(0)}>
            <div className="hero-intro-dot"/>
            {D.role}
          </div>
          <div className="hero-name-left" style={a(120)}>
            {D.firstName}<br/>
            <span style={{WebkitTextStroke:"2.5px var(--ink)",color:"transparent"}}>{D.lastName}</span>
          </div>
          {D.about && (
            <p style={{fontSize:"1rem",fontWeight:400,color:"var(--mid)",lineHeight:1.75,maxWidth:340,marginTop:"2.5rem",...a(250)}}>{D.about}</p>
          )}
          <div style={{display:"flex",gap:"1rem",marginTop:"2.5rem",flexWrap:"wrap",...a(360)}}>
            <button onClick={()=>document.getElementById("contact")?.scrollIntoView({behavior:"smooth"})} style={{padding:"13px 28px",background:"var(--ink)",color:"var(--w)",border:"2px solid var(--ink)",fontFamily:"'Unbounded',sans-serif",fontWeight:900,fontSize:".72rem",letterSpacing:".06em",cursor:"none",borderRadius:"3px",boxShadow:"4px 4px 0 var(--lime)",transition:"all .2s"}}
              onMouseEnter={e=>{e.currentTarget.style.background="var(--lime)";e.currentTarget.style.color="var(--ink)";e.currentTarget.style.borderColor="var(--ink)"}}
              onMouseLeave={e=>{e.currentTarget.style.background="var(--ink)";e.currentTarget.style.color="var(--w)";e.currentTarget.style.borderColor="var(--ink)"}}
            >LET'S TALK →</button>
            {D.cv&&<a href={D.cv} style={{padding:"13px 28px",border:"2px solid var(--ink)",fontFamily:"'Unbounded',sans-serif",fontWeight:900,fontSize:".72rem",letterSpacing:".06em",cursor:"none",borderRadius:"3px",color:"var(--ink)",boxShadow:"4px 4px 0 var(--border)",transition:"box-shadow .2s"}}
              onMouseEnter={e=>e.currentTarget.style.boxShadow="4px 4px 0 var(--ink)"}
              onMouseLeave={e=>e.currentTarget.style.boxShadow="4px 4px 0 var(--border)"}
            >CV ↓</a>}
          </div>
        </div>

        {/* CIRCLE PHOTO */}
        {D.profilePhoto && (
          <div className="hero-circle-wrap" ref={circleRef}>
            <div className="orbit"><div className="orbit-dot"/></div>
            <div className="hero-circle">
              <img src={D.profilePhoto} alt={D.name}/>
            </div>
            {D.qualification&&(
              <div className="circle-badge">
                <div className="circle-badge-n">{expYrs}+</div>
                <div className="circle-badge-l">years</div>
              </div>
            )}
          </div>
        )}

        {/* RIGHT */}
        <div className="hero-right" style={a(200)}>
          <div className="hero-name-right">{D.firstName}<br/>{D.lastName}</div>
          <div className="hero-tagline-r" style={{marginTop:"2.5rem"}}>
            {D.tagline?.split("\n").map((l,i)=>(
              <span key={i} style={{display:"block"}}>{i===3?<em>{l}</em>:l}</span>
            ))}
          </div>
          {D.place&&<p style={{marginTop:"2rem",fontSize:".72rem",fontWeight:600,letterSpacing:".18em",textTransform:"uppercase",color:"var(--mid)"}}>{D.place}</p>}
        </div>
      </div>

      {/* bottom stats bar */}
      <div className="hero-bottom">
        {[[expYrs,"Yrs Exp."],[D.projects?.length||4,"Projects"],[D.skills?.length||12,"Skills"]].map(([n,l])=>(
          <div key={l} className="hb-item">
            <div className="hb-n"><Ctr to={n}/>+</div>
            <div className="hb-l">{l}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── MARQUEE ─────────────────────────────────────────────── */
function Marquee({ D }) {
  const items = D.skills?.length ? [...D.skills,...D.skills,...D.skills,...D.skills] : [];
  return (
    <div className="mq-wrap">
      <div className="mq-t">
        {items.map((sk,i)=><span key={i} className="mq-item">{sk}<span>◆</span></span>)}
      </div>
    </div>
  );
}

/* ── SERVICES ────────────────────────────────────────────── */
function Services({ D }) {
  if (!D.services?.length) return null;
  return (
    <section id="services" className="sec" style={{background:"var(--w)"}}>
      <div className="sec-inner">
        <div className="rv"><div className="sec-label">What I offer</div><h2 className="sec-h">Services &<br/><em>Expertise</em></h2></div>
        <div className="svc-list rv d1">
          {D.services.map((sv,i)=>(
            <div key={i} className="svc-row">
              <div className="svc-idx">0{i+1}</div>
              <div className="svc-h">{sv.heading}</div>
              <div className="svc-d">{sv.description}</div>
              <div className="svc-arrow"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M7 17L17 7M7 7h10v10"/></svg></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── SKILLS ──────────────────────────────────────────────── */
function Skills({ D }) {
  if (!D.skills?.length) return null;
  return (
    <section className="sec" style={{background:"#f0f0ed",paddingTop:60,paddingBottom:60}}>
      <div className="sec-inner">
        <div className="rv sec-label" style={{marginBottom:"1.5rem"}}>Technologies</div>
        <div className="skills-wrap rv d1">
          {D.skills.map((sk,i)=><span key={i} className={`sk rv d${Math.min(i%4+1,4)}`}>{sk}</span>)}
        </div>
      </div>
    </section>
  );
}

/* ── PROJECTS ────────────────────────────────────────────── */
function Projects({ D }) {
  if (!D.projects?.length) return null;
  return (
    <section id="projects" className="sec" style={{background:"var(--w)"}}>
      <div className="sec-inner">
        <div className="rv"><div className="sec-label">Portfolio</div><h2 className="sec-h">Selected<br/><em>Work</em></h2></div>
        <div className="proj-list rv d1">
          {D.projects.map((p,i)=>(
            <div key={i} className="proj-item">
              <div className="proj-num">{p.idx}</div>
              <div className="proj-body">
                <div className="proj-title-row">
                  <div className="proj-title">{p.title}</div>
                  <div className="proj-year">{p.year}</div>
                </div>
                <div className="proj-desc">{p.description}</div>
              </div>
              {p.link
                ? <a href={p.link} target="_blank" rel="noreferrer" className="proj-arrow"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M7 17L17 7M7 7h10v10"/></svg></a>
                : <div className="proj-arrow" style={{opacity:.2,cursor:"default"}}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M7 17L17 7M7 7h10v10"/></svg></div>
              }
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── JOURNEY ─────────────────────────────────────────────── */
function Journey({ D, fmt }) {
  const hE=D.experience?.length>0, hD=D.education?.length>0;
  if (!hE&&!hD) return null;
  return (
    <section id="journey" className="sec" style={{background:"#f0f0ed"}}>
      <div className="sec-inner">
        <div className="rv"><div className="sec-label">Background</div><h2 className="sec-h">My<br/><em>Journey</em></h2></div>
        <div className="j-grid">
          {hE&&(
            <div className="rv d1">
              <div className="j-head">Work Experience</div>
              {D.experience.map((e,i)=>(
                <div key={i} className="exp-row">
                  <div><div className="exp-role">{e.jobTitle}</div><div className="exp-co">{e.company}</div></div>
                  <div className="exp-date">{fmt(e.startDate)}<br/>—<br/>{fmt(e.endDate)}</div>
                </div>
              ))}
            </div>
          )}
          {hD&&(
            <div className="rv d2">
              <div className="j-head">Education</div>
              {D.education.map((e,i)=>(
                <div key={i} className="edu-card">
                  <div className="edu-deg">{e.education}</div>
                  <div className="edu-inst">{e.institution}</div>
                  <div className="edu-tags">
                    {e.year&&<span className="edu-tag">{e.year}</span>}
                    {e.percentage&&<span className="edu-tag">{e.percentage}</span>}
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

/* ── CONTACT ─────────────────────────────────────────────── */
function Contact({ D, soc }) {
  return (
    <section id="contact" className="contact-sec">
      <div className="contact-inner rv">
        <div className="contact-big">Let's build<br/>something<br/><em>great.</em></div>
        <div className="contact-fields">
          {D.email&&<div><div className="cf-l">Email</div><a href={`mailto:${D.email}`} className="cf-v" style={{display:"block"}}>{D.email}</a></div>}
          {D.phone&&<div><div className="cf-l">Phone</div><a href={`tel:${D.phone}`} className="cf-v" style={{display:"block"}}>{D.phone}</a></div>}
          {D.place&&<div><div className="cf-l">Location</div><div className="cf-v" style={{color:"rgba(248,248,245,.35)",cursor:"default"}}>{D.place}</div></div>}
        </div>
        <div className="soc-row">
          {soc.linkedin&&<a href={soc.linkedin} target="_blank" rel="noreferrer" className="soc-b">LinkedIn</a>}
          {soc.github&&<a href={soc.github} target="_blank" rel="noreferrer" className="soc-b">GitHub</a>}
          {soc.twitter&&<a href={soc.twitter} target="_blank" rel="noreferrer" className="soc-b">Twitter</a>}
          {soc.website&&<a href={soc.website} target="_blank" rel="noreferrer" className="soc-b">Website</a>}
        </div>
        {D.lookingVacancy?.length>0&&(
          <div className="vacancy-row">{D.lookingVacancy.map((v,i)=><span key={i} className="vac">{v}</span>)}</div>
        )}
      </div>
    </section>
  );
}

/* ── APP ─────────────────────────────────────────────────── */
export default function Profile9({ data }) {

  const D = data || DEMO||{};
  const soc = D.socials?.[0] || {};

  const fmt = d =>
    !d ? "Now" :
    new Date(d).toLocaleDateString("en-US",{month:"short",year:"numeric"});

  const expYrs =
    D.experience?.length
      ? new Date().getFullYear() -
        new Date(D.experience[D.experience.length-1].startDate).getFullYear()
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
<p>© {new Date().getFullYear()} {D.name}</p>
<p>{D.place}</p>
    </>
  );
}