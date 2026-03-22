import { useState, useEffect, useRef, useCallback } from "react";

/* ══════════════════════════════════════════════════════════
   DATA  —  replace with your API response
══════════════════════════════════════════════════════════ */

const DEMO =  {
  name: "Arjun Menon",
  firstName: "Arjun",
  lastName: "Menon",
  role: "Full‑Stack Engineer",
  tagline: "I build products people love.",
  about: "7+ years crafting digital experiences at the intersection of engineering and design. I turn complex problems into elegant, performant solutions — from pixel to production.",
  email: "arjun.menon@gmail.com",
  phone: "+91 98765 43210",
  place: "Kochi, Kerala",
  profilePhoto: "https://i.pravatar.cc/900?img=68",
  qualification: "B.Tech CS · NIT Calicut",
  cv: "/cv.pdf",
  skills: ["React","Node.js","TypeScript","MongoDB","GraphQL","Docker","AWS","Figma","Python","Redis","Next.js","PostgreSQL"],
  services: [
    { heading: "Product Engineering", description: "End-to-end web applications built with obsessive attention to performance, scalability, and maintainability." },
    { heading: "Interface Design", description: "Pixel-perfect interfaces that feel inevitable. Every micro-interaction earned, every animation purposeful." },
    { heading: "API Architecture", description: "REST & GraphQL APIs with clean domain logic, robust auth, and built-in room to grow." },
    { heading: "Cloud & DevOps", description: "Production infrastructure that just works — CI/CD, containers, AWS & GCP deployments." },
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
    { title: "DevBoard", description: "Real-time developer dashboard aggregating GitHub, Jira & Slack. Adopted by 3 product teams.", link: "#", year: "2024" },
    { title: "ShopSphere", description: "Multi-tenant e-commerce with live inventory sync and Stripe/Razorpay integration.", link: "#", year: "2023" },
    { title: "AIResume", description: "AI-powered resume scorer and rewriter optimised for ATS. 2,000+ users in month one.", link: "#", year: "2023" },
    { title: "NoteStack", description: "Collaborative markdown workspace with real-time sync and full version history.", link: null, year: "2022" },
  ],
  socials: [{ linkedin:"https://linkedin.com", github:"https://github.com", twitter:"https://twitter.com", website:"https://arjunmenon.dev" }],
  lookingVacancy: ["Full-Stack Engineer","Frontend Lead","Technical Co-founder"],
};

function fmtD(d){ if(!d) return "Now"; return new Date(d).toLocaleDateString("en-US",{month:"short",year:"numeric"}); }

/* ══════════════════════════════════════════════════════════
   GLOBAL CSS
══════════════════════════════════════════════════════════ */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500;600&family=DM+Mono:ital,wght@0,400;1,400&display=swap');

  :root {
    --bg: #050508;
    --surface: rgba(255,255,255,.045);
    --border: rgba(255,255,255,.09);
    --accent: #00f5c8;
    --accent2: #7b5ea7;
    --text: #e8e6f0;
    --muted: rgba(232,230,240,.45);
    --r: 14px;
  }

  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
  html { scroll-behavior:smooth; }
  body { background:var(--bg); color:var(--text); font-family:'Outfit',sans-serif; -webkit-font-smoothing:antialiased; overflow-x:hidden; cursor:none; }
  a { color:inherit; text-decoration:none; }
  img { display:block; max-width:100%; }

  /* CURSOR */
  #cur { position:fixed; width:10px; height:10px; border-radius:50%; background:var(--accent); pointer-events:none; z-index:9999; transform:translate(-50%,-50%); transition:transform .1s; mix-blend-mode:screen; }
  #cur-ring { position:fixed; width:36px; height:36px; border-radius:50%; border:1.5px solid rgba(0,245,200,.4); pointer-events:none; z-index:9998; transform:translate(-50%,-50%); transition:left .12s ease,top .12s ease,width .2s,height .2s; }
  body:hover #cur { transform:translate(-50%,-50%) scale(1); }

  /* CANVAS */
  #stars { position:fixed; inset:0; z-index:0; pointer-events:none; }

  /* NAV */
  .nav { position:fixed; top:0; left:0; right:0; z-index:500; padding:0 clamp(1.5rem,4vw,4rem); height:66px; display:flex; align-items:center; justify-content:space-between; transition:background .4s,border .4s; }
  .nav.scrolled { background:rgba(5,5,8,.85); backdrop-filter:blur(20px); border-bottom:1px solid var(--border); }
  .nav-logo { font-family:'Bebas Neue',sans-serif; font-size:1.7rem; letter-spacing:.06em; color:var(--accent); line-height:1; }
  .nav-links { display:flex; gap:2rem; align-items:center; list-style:none; }
  .nav-links a { font-size:.8rem; font-weight:500; letter-spacing:.1em; text-transform:uppercase; color:var(--muted); transition:color .2s; position:relative; }
  .nav-links a::after { content:''; position:absolute; bottom:-3px; left:0; width:0; height:1px; background:var(--accent); transition:width .25s; }
  .nav-links a:hover, .nav-links a.on { color:var(--accent); }
  .nav-links a.on::after, .nav-links a:hover::after { width:100%; }
  .nav-cv { padding:8px 20px; border:1px solid var(--accent); border-radius:50px; font-size:.75rem; font-weight:600; letter-spacing:.1em; text-transform:uppercase; color:var(--accent); transition:all .2s; }
  .nav-cv:hover { background:var(--accent); color:#050508; }

  /* HERO */
  .hero { min-height:100vh; display:flex; align-items:center; position:relative; z-index:1; padding:80px clamp(1.5rem,4vw,4rem) 60px; overflow:hidden; }
  .hero-inner { max-width:1280px; margin:0 auto; width:100%; display:grid; grid-template-columns:1fr 480px; gap:4rem; align-items:center; }
  .hero-eyebrow { display:flex; align-items:center; gap:.8rem; margin-bottom:1.4rem; }
  .hero-dot { width:8px; height:8px; border-radius:50%; background:var(--accent); animation:pulse 2s infinite; }
  .hero-tag { font-family:'DM Mono',monospace; font-size:.75rem; color:var(--accent); letter-spacing:.14em; text-transform:uppercase; }
  .hero-name { font-family:'Bebas Neue',sans-serif; font-size:clamp(5rem,11vw,9.5rem); line-height:.9; letter-spacing:.03em; color:#fff; margin-bottom:1.2rem; }
  .hero-name span { color:var(--accent); }
  .hero-tagline { font-size:clamp(1rem,2vw,1.25rem); color:var(--muted); font-weight:300; line-height:1.7; max-width:500px; margin-bottom:2.8rem; }
  .hero-actions { display:flex; gap:1rem; flex-wrap:wrap; margin-bottom:3rem; }
  .btn-primary { padding:13px 32px; background:var(--accent); color:#050508; border-radius:50px; font-weight:700; font-size:.85rem; letter-spacing:.06em; text-transform:uppercase; border:none; cursor:none; transition:box-shadow .25s,transform .2s; }
  .btn-primary:hover { box-shadow:0 0 30px rgba(0,245,200,.45); transform:translateY(-2px); }
  .btn-ghost { padding:12px 30px; border:1px solid var(--border); color:var(--text); border-radius:50px; font-weight:500; font-size:.85rem; letter-spacing:.06em; text-transform:uppercase; cursor:none; transition:border-color .2s,color .2s; }
  .btn-ghost:hover { border-color:var(--accent); color:var(--accent); }
  .hero-meta { display:flex; gap:2rem; flex-wrap:wrap; }
  .hero-meta-item { display:flex; align-items:center; gap:.5rem; font-size:.78rem; color:var(--muted); font-family:'DM Mono',monospace; }
  .hero-meta-item svg { color:var(--accent); }

  /* PHOTO card */
  .photo-card { position:relative; }
  .photo-frame { border-radius:24px; overflow:hidden; border:1px solid var(--border); background:var(--surface); backdrop-filter:blur(10px); position:relative; }
  .photo-frame img { width:100%; height:520px; object-fit:cover; filter:saturate(1.1); }
  .photo-frame::before { content:''; position:absolute; inset:0; background:linear-gradient(160deg,rgba(0,245,200,.08) 0%,transparent 60%); z-index:1; pointer-events:none; }
  .photo-badge { position:absolute; bottom:-16px; right:-16px; background:rgba(5,5,8,.9); border:1px solid var(--border); backdrop-filter:blur(16px); border-radius:16px; padding:1rem 1.4rem; }
  .photo-badge-n { font-family:'Bebas Neue',sans-serif; font-size:2.4rem; color:var(--accent); line-height:1; }
  .photo-badge-l { font-size:.65rem; letter-spacing:.14em; text-transform:uppercase; color:var(--muted); margin-top:2px; font-family:'DM Mono',monospace; }

  /* MARQUEE */
  .marquee-wrap { overflow:hidden; padding:22px 0; border-top:1px solid var(--border); border-bottom:1px solid var(--border); background:rgba(0,245,200,.03); position:relative; z-index:1; }
  .marquee-track { display:flex; gap:0; animation:marquee 22s linear infinite; white-space:nowrap; }
  .marquee-item { display:inline-flex; align-items:center; gap:1.4rem; padding:0 2rem; font-family:'Bebas Neue',sans-serif; font-size:1.4rem; letter-spacing:.08em; color:rgba(232,230,240,.25); }
  .marquee-item span { color:var(--accent); font-size:.8rem; }
  @keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }

  /* SECTIONS */
  .section { position:relative; z-index:1; padding:100px clamp(1.5rem,4vw,4rem); }
  .section-inner { max-width:1280px; margin:0 auto; }
  .section-header { margin-bottom:4rem; }
  .section-num { font-family:'DM Mono',monospace; font-size:.72rem; color:var(--accent); letter-spacing:.18em; text-transform:uppercase; margin-bottom:.6rem; }
  .section-title { font-family:'Bebas Neue',sans-serif; font-size:clamp(3rem,6vw,5rem); color:#fff; line-height:.95; letter-spacing:.04em; }
  .section-title em { color:var(--accent); font-style:normal; }

  /* REVEAL */
  .reveal { opacity:0; transform:translateY(36px); transition:opacity .7s ease,transform .7s ease; }
  .reveal.show { opacity:1; transform:none; }

  /* SERVICES */
  .svc-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:1.5px; background:var(--border); border:1px solid var(--border); border-radius:var(--r); overflow:hidden; }
  .svc-card { background:var(--bg); padding:2.2rem; transition:background .25s; position:relative; overflow:hidden; }
  .svc-card::before { content:''; position:absolute; top:0; left:0; width:3px; height:0; background:var(--accent); transition:height .35s ease; border-radius:0 0 4px 0; }
  .svc-card:hover { background:rgba(0,245,200,.04); }
  .svc-card:hover::before { height:100%; }
  .svc-num { font-family:'Bebas Neue',sans-serif; font-size:3.5rem; color:rgba(255,255,255,.05); position:absolute; top:1rem; right:1.4rem; line-height:1; }
  .svc-title { font-family:'Bebas Neue',sans-serif; font-size:1.5rem; color:#fff; letter-spacing:.04em; margin-bottom:.7rem; }
  .svc-desc { font-size:.85rem; color:var(--muted); line-height:1.75; }

  /* PROJECTS */
  .proj-list { display:flex; flex-direction:column; gap:0; border:1px solid var(--border); border-radius:var(--r); overflow:hidden; }
  .proj-item { display:grid; grid-template-columns:80px 1fr auto; gap:1.5rem; align-items:center; padding:1.8rem 2rem; border-bottom:1px solid var(--border); background:rgba(255,255,255,.02); transition:background .22s; }
  .proj-item:last-child { border-bottom:none; }
  .proj-item:hover { background:rgba(0,245,200,.05); }
  .proj-year { font-family:'DM Mono',monospace; font-size:.72rem; color:var(--muted); }
  .proj-title { font-family:'Bebas Neue',sans-serif; font-size:1.55rem; letter-spacing:.04em; color:#fff; margin-bottom:.3rem; }
  .proj-desc { font-size:.82rem; color:var(--muted); line-height:1.6; }
  .proj-link { display:inline-flex; align-items:center; justify-content:center; width:38px; height:38px; border:1px solid var(--border); border-radius:50%; color:var(--muted); transition:all .2s; flex-shrink:0; }
  .proj-link:hover { border-color:var(--accent); color:var(--accent); background:rgba(0,245,200,.08); }

  /* EXPERIENCE */
  .timeline { display:flex; flex-direction:column; position:relative; }
  .timeline::before { content:''; position:absolute; left:16px; top:0; bottom:0; width:1px; background:linear-gradient(to bottom,var(--accent),var(--accent2),transparent); }
  .tl-item { display:flex; gap:2rem; padding-bottom:2.8rem; position:relative; }
  .tl-item:last-child { padding-bottom:0; }
  .tl-dot { width:33px; height:33px; border-radius:50%; border:1px solid var(--accent); background:var(--bg); display:flex; align-items:center; justify-content:center; flex-shrink:0; z-index:1; }
  .tl-dot-inner { width:10px; height:10px; border-radius:50%; background:var(--accent); }
  .tl-date { font-family:'DM Mono',monospace; font-size:.7rem; color:var(--accent); margin-bottom:.4rem; letter-spacing:.06em; }
  .tl-role { font-family:'Bebas Neue',sans-serif; font-size:1.4rem; letter-spacing:.04em; color:#fff; margin-bottom:.2rem; }
  .tl-company { font-size:.82rem; color:var(--muted); }

  /* EDU */
  .edu-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:1px; background:var(--border); border:1px solid var(--border); border-radius:var(--r); overflow:hidden; }
  .edu-card { background:var(--bg); padding:2rem; }
  .edu-inst { font-family:'Bebas Neue',sans-serif; font-size:1.3rem; letter-spacing:.04em; color:#fff; margin-bottom:.4rem; }
  .edu-deg { font-size:.82rem; color:var(--muted); margin-bottom:.8rem; line-height:1.5; }
  .edu-badge { display:inline-block; padding:4px 12px; background:rgba(0,245,200,.1); border:1px solid rgba(0,245,200,.2); border-radius:50px; font-family:'DM Mono',monospace; font-size:.7rem; color:var(--accent); }

  /* SKILLS */
  .skills-wrap { display:flex; flex-wrap:wrap; gap:10px; }
  .skill-pill { padding:9px 20px; border:1px solid var(--border); border-radius:50px; font-size:.8rem; font-weight:500; color:var(--muted); background:var(--surface); transition:all .2s; cursor:default; position:relative; overflow:hidden; }
  .skill-pill::before { content:''; position:absolute; inset:0; background:var(--accent); transform:translateX(-100%); transition:transform .25s ease; z-index:0; }
  .skill-pill:hover::before { transform:translateX(0); }
  .skill-pill:hover { color:#050508; border-color:var(--accent); }
  .skill-pill span { position:relative; z-index:1; }

  /* CONTACT */
  .contact-box { display:grid; grid-template-columns:1fr 1fr; gap:3px; background:var(--border); border:1px solid var(--border); border-radius:var(--r); overflow:hidden; }
  .contact-left { background:var(--accent); padding:3.5rem; display:flex; flex-direction:column; justify-content:space-between; }
  .contact-right { background:rgba(255,255,255,.02); padding:3.5rem; backdrop-filter:blur(10px); }
  .contact-big { font-family:'Bebas Neue',sans-serif; font-size:clamp(2.8rem,5vw,4.2rem); color:#050508; line-height:.95; letter-spacing:.04em; margin-bottom:1.5rem; }
  .contact-sub { font-size:.9rem; color:rgba(5,5,8,.6); line-height:1.7; }
  .contact-label { font-family:'DM Mono',monospace; font-size:.65rem; letter-spacing:.16em; text-transform:uppercase; color:var(--muted); margin-bottom:.35rem; }
  .contact-val { font-family:'Bebas Neue',sans-serif; font-size:1.5rem; letter-spacing:.04em; color:#fff; transition:color .2s; }
  .contact-val:hover { color:var(--accent); }
  .contact-field { margin-bottom:1.8rem; }
  .soc-row { display:flex; gap:1rem; flex-wrap:wrap; margin-top:2rem; padding-top:2rem; border-top:1px solid var(--border); }
  .soc-btn { display:inline-flex; align-items:center; gap:6px; padding:8px 16px; border:1px solid var(--border); border-radius:50px; font-size:.75rem; font-weight:500; color:var(--muted); transition:all .2s; }
  .soc-btn:hover { border-color:var(--accent); color:var(--accent); background:rgba(0,245,200,.06); }

  /* FOOTER */
  .footer { position:relative; z-index:1; border-top:1px solid var(--border); padding:1.6rem clamp(1.5rem,4vw,4rem); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:.8rem; }
  .footer p { font-family:'DM Mono',monospace; font-size:.65rem; color:rgba(232,230,240,.2); letter-spacing:.08em; }

  /* ANIMATIONS */
  @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.4)} }
  @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
  @keyframes glow { 0%,100%{box-shadow:0 0 20px rgba(0,245,200,.15)} 50%{box-shadow:0 0 50px rgba(0,245,200,.4)} }
  .photo-frame { animation:float 6s ease-in-out infinite; }
  .hero-dot { animation:glow 2.5s ease-in-out infinite; }

  /* RESPONSIVE */
  @media(max-width:900px) {
    .hero-inner { grid-template-columns:1fr!important; }
    .photo-card { display:none; }
    .contact-box { grid-template-columns:1fr!important; }
    .proj-item { grid-template-columns:1fr!important; }
    .proj-year { display:none; }
  }
  @media(max-width:640px) {
    .nav-links { display:none; }
  }
`;

/* ══════════════════════════════════════════════════════════
   CANVAS PARTICLES
══════════════════════════════════════════════════════════ */
function StarField() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    let W, H, stars = [], raf;
    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    const init = () => {
      stars = Array.from({ length: 160 }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        r: Math.random() * 1.4 + .2, a: Math.random(),
        speed: Math.random() * .3 + .05,
        dx: (Math.random() - .5) * .15,
      }));
    };
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      stars.forEach(s => {
        s.a += .005 * s.speed;
        s.x += s.dx;
        if (s.x < 0) s.x = W; if (s.x > W) s.x = 0;
        const alpha = (Math.sin(s.a) * .5 + .5) * .7;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,245,200,${alpha * .6})`;
        ctx.fill();
      });
      // occasional accent dot
      raf = requestAnimationFrame(draw);
    };
    resize(); init(); draw();
    window.addEventListener("resize", () => { resize(); init(); });
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas id="stars" ref={ref} />;
}

/* ══════════════════════════════════════════════════════════
   CUSTOM CURSOR
══════════════════════════════════════════════════════════ */
function Cursor() {
  const dot = useRef(null);
  const ring = useRef(null);
  useEffect(() => {
    const move = e => {
      if (dot.current) { dot.current.style.left = e.clientX + "px"; dot.current.style.top = e.clientY + "px"; }
      if (ring.current) { ring.current.style.left = e.clientX + "px"; ring.current.style.top = e.clientY + "px"; }
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);
  return (<><div id="cur" ref={dot}/><div id="cur-ring" ref={ring}/></>);
}

/* ══════════════════════════════════════════════════════════
   SCROLL REVEAL HOOK
══════════════════════════════════════════════════════════ */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const obs = new IntersectionObserver(entries => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          setTimeout(() => e.target.classList.add("show"), (e.target.dataset.delay || 0) * 1);
        }
      });
    }, { threshold: 0.12 });
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  });
}

/* ══════════════════════════════════════════════════════════
   NAV
══════════════════════════════════════════════════════════ */
function Nav({ active, DATA }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  const go = id => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  const links = [
    { id: "about", l: "About" },
    DATA.services?.length && { id: "services", l: "Services" },
    DATA.projects?.length && { id: "projects", l: "Work" },
    (DATA.experience?.length || DATA.education?.length) && { id: "journey", l: "Journey" },
    { id: "contact", l: "Contact" },
  ].filter(Boolean);
  return (
    <nav className={`nav${scrolled ? " scrolled" : ""}`}>
      <div className="nav-logo">{DATA.name?.split(" ").map(w => w[0]).join("")}</div>
      <ul className="nav-links">
        {links.map(lk => (
          <li key={lk.id}><a href="#" className={active === lk.id ? "on" : ""} onClick={e => { e.preventDefault(); go(lk.id); }}>{lk.l}</a></li>
        ))}
        {DATA.cv && <li><a href={DATA.cv} className="nav-cv">CV</a></li>}
      </ul>
    </nav>
  );
}

/* ══════════════════════════════════════════════════════════
   HERO
══════════════════════════════════════════════════════════ */
function Hero({ DATA }) {
  const expYears = DATA.experience?.length ? new Date().getFullYear() - new Date(DATA.experience[DATA.experience.length - 1].startDate).getFullYear() : null;
  return (
    <section id="about" className="hero">
      <div className="hero-inner">
        <div>
          <div className="hero-eyebrow reveal" data-delay="0">
            <div className="hero-dot" />
            <span className="hero-tag">{DATA.tagline}</span>
          </div>
          <h1 className="hero-name reveal" data-delay="80">
            {DATA.name?.split(" ")[0]}<br />
            <span>{DATA.name?.split(" ")[1]}</span>
          </h1>
          {DATA.about && <p className="hero-tagline reveal" data-delay="160">{DATA.about}</p>}
          <div className="hero-actions reveal" data-delay="240">
            <button className="btn-primary" onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}>Let's talk</button>
            {DATA.cv && <a href={DATA.cv} className="btn-ghost">Download CV</a>}
          </div>
          <div className="hero-meta reveal" data-delay="320">
            {DATA.place && <div className="hero-meta-item"><PinIcon/>{DATA.place}</div>}
            {DATA.email && <div className="hero-meta-item"><MailIcon/>{DATA.email}</div>}
            {expYears && <div className="hero-meta-item"><ClockIcon/>{expYears}+ years exp.</div>}
          </div>
        </div>

        {DATA.profilePhoto && (
          <div className="photo-card reveal" data-delay="100">
            <div className="photo-frame">
              <img src={DATA.profilePhoto} alt={DATA.name} />
            </div>
            {expYears && (
              <div className="photo-badge">
                <div className="photo-badge-n">{expYears}+</div>
                <div className="photo-badge-l">Years of<br/>excellence</div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════
   MARQUEE
══════════════════════════════════════════════════════════ */
function Marquee({ DATA }) {
  if (!DATA.skills?.length) return null;
  const items = [...DATA.skills, ...DATA.skills];
  return (
    <div className="marquee-wrap">
      <div className="marquee-track">
        {items.map((sk, i) => (
          <div key={i} className="marquee-item">{sk}<span>✦</span></div>
        ))}
        {items.map((sk, i) => (
          <div key={"b"+i} className="marquee-item">{sk}<span>✦</span></div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   SERVICES
══════════════════════════════════════════════════════════ */
function Services({ DATA }) {
  if (!DATA.services?.length) return null;
  return (
    <section id="services" className="section">
      <div className="section-inner">
        <div className="section-header reveal">
          <div className="section-num">01 — What I do</div>
          <h2 className="section-title">Services &<br/><em>Expertise</em></h2>
        </div>
        <div className="svc-grid">
          {DATA.services.map((sv, i) => (
            <div key={i} className="svc-card reveal" data-delay={i * 80}>
              <div className="svc-num">0{i+1}</div>
              <div className="svc-title">{sv.heading}</div>
              <div className="svc-desc">{sv.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════
   SKILLS
══════════════════════════════════════════════════════════ */
function Skills({ DATA }) {
  if (!DATA.skills?.length) return null;
  return (
    <section className="section" style={{ paddingTop: 0 }}>
      <div className="section-inner">
        <div className="section-header reveal">
          <div className="section-num">02 — Technologies</div>
          <h2 className="section-title">Skills &<br/><em>Stack</em></h2>
        </div>
        <div className="skills-wrap">
          {DATA.skills.map((sk, i) => (
            <div key={i} className="skill-pill reveal" data-delay={i * 40}><span>{sk}</span></div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════
   PROJECTS
══════════════════════════════════════════════════════════ */
function Projects({ DATA }) {
  if (!DATA.projects?.length) return null;
  return (
    <section id="projects" className="section">
      <div className="section-inner">
        <div className="section-header reveal">
          <div className="section-num">03 — Portfolio</div>
          <h2 className="section-title">Selected<br/><em>Work</em></h2>
        </div>
        <div className="proj-list reveal">
          {DATA.projects.map((p, i) => (
            <div key={i} className="proj-item">
              <div className="proj-year">{p.year}</div>
              <div>
                <div className="proj-title">{p.title}</div>
                <div className="proj-desc">{p.description}</div>
              </div>
              {p.link ? (
                <a href={p.link} target="_blank" rel="noreferrer" className="proj-link"><ArrowIcon/></a>
              ) : (
                <div className="proj-link" style={{ opacity: .3, cursor: "default" }}><ArrowIcon/></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════
   JOURNEY
══════════════════════════════════════════════════════════ */
function Journey({ DATA }) {
  const hasExp = DATA.experience?.length > 0;
  const hasEdu = DATA.education?.length > 0;
  if (!hasExp && !hasEdu) return null;
  return (
    <section id="journey" className="section">
      <div className="section-inner">
        <div className="section-header reveal">
          <div className="section-num">04 — Background</div>
          <h2 className="section-title">My<br/><em>Journey</em></h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: hasExp && hasEdu ? "1fr 1fr" : "1fr", gap: "4rem" }}>
          {hasExp && (
            <div>
              <div style={{ fontFamily: "'DM Mono',monospace", fontSize: ".65rem", letterSpacing: ".18em", textTransform: "uppercase", color: "var(--accent)", marginBottom: "2.5rem" }}>Work Experience</div>
              <div className="timeline">
                {DATA.experience.map((e, i) => (
                  <div key={i} className="tl-item reveal" data-delay={i * 100}>
                    <div className="tl-dot"><div className="tl-dot-inner"/></div>
                    <div>
                      <div className="tl-date">{fmtD(e.startDate)} — {fmtD(e.endDate)}</div>
                      <div className="tl-role">{e.jobTitle}</div>
                      <div className="tl-company">{e.company}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {hasEdu && (
            <div>
              <div style={{ fontFamily: "'DM Mono',monospace", fontSize: ".65rem", letterSpacing: ".18em", textTransform: "uppercase", color: "var(--accent)", marginBottom: "2.5rem" }}>Education</div>
              <div className="edu-grid">
                {DATA.education.map((e, i) => (
                  <div key={i} className="edu-card reveal" data-delay={i * 100}>
                    <div className="edu-inst">{e.institution}</div>
                    <div className="edu-deg">{e.education}</div>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      {e.year && <span className="edu-badge">{e.year}</span>}
                      {e.percentage && <span className="edu-badge">{e.percentage}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════
   CONTACT
══════════════════════════════════════════════════════════ */
function Contact({ DATA, soc }) {
  return (
    <section id="contact" className="section">
      <div className="section-inner">
        <div className="contact-box reveal">
          <div className="contact-left">
            <div>
              <div className="contact-big">Let's Build<br/>Something<br/>Great.</div>
              <div className="contact-sub">Open to new projects, collaborations, and conversations. Don't be a stranger.</div>
            </div>
            {DATA.lookingVacancy?.length > 0 && (
              <div style={{ marginTop: "2rem" }}>
                <div style={{ fontFamily: "'DM Mono',monospace", fontSize: ".62rem", letterSpacing: ".14em", textTransform: "uppercase", color: "rgba(5,5,8,.5)", marginBottom: ".6rem" }}>Currently open to</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {DATA.lookingVacancy.map((v, i) => (
                    <span key={i} style={{ padding: "4px 12px", background: "rgba(5,5,8,.15)", borderRadius: 50, fontSize: ".72rem", fontWeight: 500, color: "rgba(5,5,8,.7)" }}>{v}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="contact-right">
            {DATA.email && (
              <div className="contact-field">
                <div className="contact-label">Email</div>
                <a href={`mailto:${DATA.email}`} className="contact-val" style={{ display: "block" }}>{DATA.email}</a>
              </div>
            )}
            {DATA.phone && (
              <div className="contact-field">
                <div className="contact-label">Phone</div>
                <a href={`tel:${DATA.phone}`} className="contact-val" style={{ display: "block" }}>{DATA.phone}</a>
              </div>
            )}
            {DATA.place && (
              <div className="contact-field">
                <div className="contact-label">Location</div>
                <div className="contact-val" style={{ fontSize: "1.1rem", color: "var(--muted)" }}>{DATA.place}</div>
              </div>
            )}
            <div className="soc-row">
              {soc.linkedin && <a href={soc.linkedin} target="_blank" rel="noreferrer" className="soc-btn"><LIIcon/>LinkedIn</a>}
              {soc.github && <a href={soc.github} target="_blank" rel="noreferrer" className="soc-btn"><GHIcon/>GitHub</a>}
              {soc.twitter && <a href={soc.twitter} target="_blank" rel="noreferrer" className="soc-btn"><TWIcon/>Twitter</a>}
              {soc.website && <a href={soc.website} target="_blank" rel="noreferrer" className="soc-btn"><GlobeIcon/>Website</a>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════
   FOOTER
══════════════════════════════════════════════════════════ */
function Footer({ DATA }) {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} {DATA.name} — All rights reserved</p>
      <p>{DATA.place} · Built with passion</p>
    </footer>
  );
}

/* ══════════════════════════════════════════════════════════
   MINI ICONS
══════════════════════════════════════════════════════════ */
const PinIcon = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>;
const MailIcon = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7"/></svg>;
const ClockIcon = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const ArrowIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17L17 7M7 7h10v10"/></svg>;
const LIIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" width="13" height="13"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>;
const GHIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" width="13" height="13"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>;
const TWIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" width="13" height="13"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>;
const GlobeIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="13" height="13"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>;

/* ══════════════════════════════════════════════════════════
   APP
══════════════════════════════════════════════════════════ */
export default function Profile5({ data }) {

  const DATA = data || DEMO||{};
  const soc = DATA.socials?.[0] || {};

  const [active, setActive] = useState("about");

  useReveal();

  useEffect(() => {
    const ids = ["about","services","projects","journey","contact"];

    const obs = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) setActive(e.target.id);
      }),
      { threshold: 0.2 }
    );

    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });

    return () => obs.disconnect();
  }, []);

  return (
    <>
      <style>{CSS}</style>
      <StarField />
      <Cursor />

      <Nav active={active} DATA={DATA} />

      <main>
        <Hero DATA={DATA} />
        <Marquee DATA={DATA} />
        <Services DATA={DATA} />
        <Skills DATA={DATA} />
        <Projects DATA={DATA} />
        <Journey DATA={DATA} />
        <Contact DATA={DATA} soc={soc} />
      </main>

      <Footer DATA={DATA} />
    </>
  );
}