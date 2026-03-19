import { useState, useEffect } from "react";

/* ─────────────────────────────────────────────────────────
   COMPANY DATA
───────────────────────────────────────────────────────── */
const company = {
  companyName: "NexaCore Technologies",
  tagline: "Engineering Tomorrow, Today.",
  about:
    "A product-focused technology company building scalable digital infrastructure for the next generation of enterprises. We blend engineering rigour with design intelligence to ship products that last.",
  industry: "Information Technology",
  companySize: "51–200",
  foundedYear: 2017,
  businessPark: "Technopark",
  website: "https://nexacore.io",
  tags: ["SaaS", "AI / ML", "Cloud", "DevOps", "FinTech"],
  address: {
    building: "Tower C, Floor 9",
    street: "Technopark Phase II",
    city: "Thiruvananthapuram",
    state: "Kerala",
    pincode: "695581",
    country: "India",
  },
  contacts: {
    email: "hello@nexacore.io",
    phone: "+91 98765 43210",
    linkedin: "#",
    twitter: "#",
    instagram: "#",
    whatsapp: "#",
  },
  services: [
    { title: "Product Engineering",    description: "End-to-end development of web & mobile products with a relentless focus on performance, scalability, and user delight." },
    { title: "AI & Data Intelligence", description: "ML pipelines, predictive analytics, and AI integrations that make your product smarter every day." },
    { title: "Cloud Infrastructure",   description: "AWS, GCP, and Azure architecture, migration, cost-optimisation, and 24/7 monitoring." },
    { title: "UX Strategy & Design",   description: "Research-driven design systems and brand experiences built to convert, retain, and inspire." },
    { title: "DevOps & Automation",    description: "CI/CD pipelines, infrastructure-as-code, and release automation that compresses delivery cycles." },
    { title: "Tech Consulting",        description: "CTO-as-a-service, architecture audits, and technology roadmap planning for ambitious companies." },
  ],
  projects: [
    { name: "FinFlow",   year: "2023", category: "FinTech · Payments",  description: "Real-time B2B payments platform processing ₹200 Cr+ monthly across 300+ SMEs, built on event-driven microservices.", link: "#" },
    { name: "MediSync",  year: "2022", category: "HealthTech · AI",     description: "AI-powered patient data platform adopted by 40 hospitals, reducing diagnostic turnaround time by 60%.", link: "#" },
    { name: "LogiTrack", year: "2023", category: "Logistics · IoT",     description: "Supply-chain visibility SaaS monitoring 50,000+ shipments per month with live IoT tracking.", link: "#" },
    { name: "EduSphere", year: "2021", category: "EdTech · Platform",   description: "Adaptive learning platform used by 200,000+ students powered by real-time recommendation AI.", link: "#" },
  ],
  members: [
    { name: "Arjun Menon",    position: "Founder & CEO",            bio: "15 years in product engineering. Previously VP Engineering at a Fortune 500 fintech." },
    { name: "Priya Krishnan", position: "Chief Technology Officer", bio: "Ex-Google engineer. Architected systems serving 100M+ daily users." },
    { name: "Rahul Nair",     position: "Head of Design",           bio: "Award-winning UX lead. Obsessed with typography, motion, and craft." },
    { name: "Sneha Pillai",   position: "VP Engineering",           bio: "Full-stack systems thinker. Champion of developer experience and zero-downtime deploys." },
    { name: "Kiran Das",      position: "Head of AI / ML",          bio: "PhD in machine learning. Turns research papers into production-grade pipelines." },
    { name: "Meera Varma",    position: "Director of Growth",       bio: "Scaled revenue from zero to ₹50 Cr in 18 months across three startups." },
  ],
  clients: [
    { name: "Axis Bank",       sector: "Banking"       },
    { name: "KIMS Health",     sector: "Healthcare"    },
    { name: "Federal Bank",    sector: "Banking"       },
    { name: "UST Global",      sector: "Technology"    },
    { name: "IBS Software",    sector: "Aviation"      },
    { name: "Carnival Group",  sector: "Hospitality"   },
    { name: "Muthoot Finance", sector: "Finance"       },
    { name: "Kerala Govt.",    sector: "Public Sector" },
  ],
  gallery: [
    { caption: "Annual Tech Summit 2024",    tag: "Event"       },
    { caption: "Product Launch — FinFlow 3", tag: "Launch"      },
    { caption: "Team Offsite, Munnar",       tag: "Culture"     },
    { caption: "Hackathon Champions",        tag: "Achievement" },
    { caption: "Design Sprint Workshop",     tag: "Workshop"    },
    { caption: "Client Day, Bangalore",      tag: "Client"      },
  ],
};

/* ─────────────────────────────────────────────────────────
   TOKENS
───────────────────────────────────────────────────────── */
const T = {
  white: "#FFFFFF",
  g50:   "#F7F7F7",
  g100:  "#EFEFEF",
  g200:  "#E0E0E0",
  g300:  "#CACACA",
  g400:  "#AAAAAA",
  g500:  "#888888",
  g600:  "#666666",
  g700:  "#444444",
  g800:  "#2A2A2A",
  g900:  "#181818",
  black: "#0A0A0A",
};

/* ─────────────────────────────────────────────────────────
   BREAKPOINT HOOK  (updates on resize)
───────────────────────────────────────────────────────── */
function useBreakpoint() {
  const get = () => ({
    isMobile:  window.innerWidth < 640,
    isTablet:  window.innerWidth >= 640 && window.innerWidth < 1024,
    isDesktop: window.innerWidth >= 1024,
  });
  const [bp, setBp] = useState({ isMobile: false, isTablet: false, isDesktop: true });
  useEffect(() => {
    const update = () => setBp(get());
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return bp;
}

const initials = (n) => n.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

/* ─────────────────────────────────────────────────────────
   GLOBAL STYLES
───────────────────────────────────────────────────────── */
function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,300;0,400;0,600;0,700;0,800;0,900;1,700&family=Barlow:wght@300;400;500&display=swap');

      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      html { scroll-behavior: smooth; }
      body { background:${T.white}; color:${T.black}; -webkit-font-smoothing:antialiased; }
      a { text-decoration:none; color:inherit; }
      ::selection { background:${T.black}; color:${T.white}; }
      ::-webkit-scrollbar { width:3px; }
      ::-webkit-scrollbar-track { background:${T.g100}; }
      ::-webkit-scrollbar-thumb { background:${T.black}; }

      .fd  { font-family:'Barlow Condensed',sans-serif; font-weight:900; letter-spacing:-0.02em; line-height:0.92; text-transform:uppercase; }
      .fb  { font-family:'Barlow',sans-serif; font-weight:300; line-height:1.8; color:${T.g600}; }
      .fl  { font-family:'Barlow Condensed',sans-serif; font-weight:600; font-size:11px; letter-spacing:0.2em; text-transform:uppercase; color:${T.g400}; }
      .fm  { font-family:'Barlow',sans-serif; font-weight:500; font-size:13px; letter-spacing:0.04em; }

      .btn-b { display:inline-block; background:${T.black}; color:${T.white}; font-family:'Barlow Condensed',sans-serif; font-weight:700; font-size:12px; letter-spacing:0.18em; text-transform:uppercase; padding:13px 32px; border:none; cursor:pointer; transition:background .2s,transform .15s; }
      .btn-b:hover { background:${T.g800}; transform:translateY(-1px); }

      .btn-g { display:inline-block; background:transparent; color:${T.black}; font-family:'Barlow Condensed',sans-serif; font-weight:700; font-size:12px; letter-spacing:0.18em; text-transform:uppercase; padding:12px 32px; border:1px solid ${T.g300}; cursor:pointer; transition:border-color .2s,transform .15s; }
      .btn-g:hover { border-color:${T.black}; transform:translateY(-1px); }

      .nl { font-family:'Barlow Condensed',sans-serif; font-weight:600; font-size:12px; letter-spacing:0.14em; text-transform:uppercase; color:${T.g600}; position:relative; transition:color .2s; }
      .nl::after { content:''; position:absolute; bottom:-2px; left:0; width:0; height:1px; background:${T.black}; transition:width .25s; }
      .nl:hover::after { width:100%; }
      .nl:hover { color:${T.black}; }

      .rh { transition:background .2s; cursor:pointer; }
      .rh:hover { background:${T.g50}; }

      .field { width:100%; background:transparent; border:none; border-bottom:1px solid ${T.g200}; padding:13px 0; font-family:'Barlow',sans-serif; font-weight:300; font-size:15px; color:${T.black}; outline:none; transition:border-color .2s; display:block; }
      .field:focus { border-color:${T.black}; }
      .field::placeholder { color:${T.g300}; }

      .gal-item { position:relative; overflow:hidden; cursor:pointer; }
      .gal-overlay { position:absolute; inset:0; background:${T.black}; opacity:0; transition:opacity .3s; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:6px; padding:12px; text-align:center; }
      .gal-item:hover .gal-overlay { opacity:0.88; }

      @keyframes mq { from{transform:translateX(0)} to{transform:translateX(-50%)} }
      .mq-track { animation:mq 22s linear infinite; display:flex; white-space:nowrap; }

      @keyframes fu { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
      .fu  { animation:fu .65s ease both; }
      .d1  { animation-delay:.08s; }
      .d2  { animation-delay:.18s; }
      .d3  { animation-delay:.28s; }
      .d4  { animation-delay:.38s; }

      /* Responsive helpers */
      .wrap { max-width:1320px; margin:0 auto; padding:0 20px; }
      @media(min-width:640px)  { .wrap { padding:0 32px; } }
      @media(min-width:1024px) { .wrap { padding:0 48px; } }
    `}</style>
  );
}

/* ─────────────────────────────────────────────────────────
   SECTION HEADER
───────────────────────────────────────────────────────── */
function SH({ num, right, dark }) {
  const c = dark ? T.g800 : T.g200;
  return (
    <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:48, borderBottom:`1px solid ${c}`, paddingBottom:20 }}>
      <span className="fl" style={{ color: dark ? T.g600 : T.g400, whiteSpace:"nowrap" }}>{num}</span>
      <div style={{ flex:1, height:1, background:c }} />
      {right && <span className="fl" style={{ color: dark ? T.g700 : T.g300, whiteSpace:"nowrap" }}>{right}</span>}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   NAV
───────────────────────────────────────────────────────── */
function Nav() {
  const { isMobile } = useBreakpoint();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen]         = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const links = ["About","Services","Projects","Team","Clients","Gallery","Contact"];

  return (
    <nav style={{
      position:"fixed", top:0, left:0, right:0, zIndex:200,
      background: scrolled ? "rgba(255,255,255,0.97)" : "transparent",
      borderBottom: scrolled ? `1px solid ${T.g200}` : "1px solid transparent",
      backdropFilter: scrolled ? "blur(14px)" : "none",
      transition:"all .35s",
    }}>
      <div className="wrap" style={{ height:60, display:"flex", alignItems:"center", justifyContent:"space-between" }}>

        {/* Logo */}
        <a href="#" style={{ display:"flex", alignItems:"center", gap:10, flexShrink:0 }}>
          <div style={{ width:28, height:28, background:T.black, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <span style={{ color:T.white, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:11, letterSpacing:1 }}>NC</span>
          </div>
          <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:17, letterSpacing:"0.08em", textTransform:"uppercase", color:T.black }}>
            NexaCore
          </span>
        </a>

        {/* Desktop links */}
        {!isMobile && (
          <div style={{ display:"flex", gap:28, alignItems:"center" }}>
            {links.map(l => <a key={l} href={`#${l.toLowerCase()}`} className="nl">{l}</a>)}
          </div>
        )}

        {/* Desktop CTA / Mobile hamburger */}
        {isMobile ? (
          <button onClick={() => setOpen(!open)}
            style={{ background:"none", border:"none", cursor:"pointer", padding:4, display:"flex", flexDirection:"column", gap:5 }}>
            {[0,1,2].map(i => (
              <span key={i} style={{
                display:"block", width:22, height:2, background:T.black, transition:"all .3s",
                transform: open ? (i===0 ? "rotate(45deg) translate(5px,5px)" : i===2 ? "rotate(-45deg) translate(5px,-5px)" : "none") : "none",
                opacity: open && i===1 ? 0 : 1,
              }} />
            ))}
          </button>
        ) : (
          <a href="#contact" className="btn-b" style={{ padding:"9px 22px", fontSize:11 }}>Get in Touch</a>
        )}
      </div>

      {/* Mobile drawer */}
      {isMobile && open && (
        <div style={{ background:T.white, borderTop:`1px solid ${T.g200}`, padding:"16px 20px 28px" }}>
          {links.map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setOpen(false)}
              style={{ display:"block", padding:"13px 0", borderBottom:`1px solid ${T.g100}`, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:16, letterSpacing:"0.1em", textTransform:"uppercase", color:T.g700 }}>
              {l}
            </a>
          ))}
          <a href="#contact" className="btn-b" style={{ marginTop:20, display:"inline-block" }}>Get in Touch</a>
        </div>
      )}
    </nav>
  );
}

/* ─────────────────────────────────────────────────────────
   HERO
───────────────────────────────────────────────────────── */
function Hero() {
  const { isMobile, isTablet, isDesktop } = useBreakpoint();

  return (
    <section id="hero" style={{ paddingTop:60, background:T.white, overflow:"hidden" }}>

      {/* Info strip — tablet+ only */}
      {!isMobile && (
        <div style={{ borderBottom:`1px solid ${T.g200}`, padding:"10px 0" }}>
          <div className="wrap" style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:8 }}>
            <span className="fl">Est. {company.foundedYear} · {company.businessPark} · {company.address.city}</span>
            <div style={{ display:"flex", gap:20, flexWrap:"wrap" }}>
              {company.tags.map(t => <span key={t} className="fl" style={{ color:T.g400 }}>{t}</span>)}
            </div>
            <span className="fl">{company.industry}</span>
          </div>
        </div>
      )}

      {/* Main grid */}
      <div className="wrap">
        <div style={{
          display:"grid",
          gridTemplateColumns: isDesktop ? "1fr 1fr" : "1fr",
          borderBottom:`1px solid ${T.g200}`,
        }}>
          {/* Left: headline */}
          <div style={{
            borderRight:   isDesktop ? `1px solid ${T.g200}` : "none",
            borderBottom:  !isDesktop ? `1px solid ${T.g200}` : "none",
            padding: isMobile ? "48px 0 40px" : isTablet ? "60px 0 48px" : "72px 56px 72px 0",
            display:"flex", flexDirection:"column", justifyContent:"space-between",
            position:"relative", overflow:"hidden",
            minHeight: isDesktop ? 480 : "auto",
          }}>
            {/* Watermark */}
            <div style={{
              position:"absolute", bottom:-20, left:-10,
              fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900,
              fontSize: isMobile ? 140 : 260,
              lineHeight:1, color:T.g100, userSelect:"none", pointerEvents:"none", letterSpacing:-8,
            }}>NC</div>

            <div style={{ position:"relative" }}>
              <span className="fl fu d1" style={{ display:"block", marginBottom:24 }}>
                Product · Platform · Infrastructure
              </span>
              <h1 className="fd fu d2" style={{ fontSize: isMobile ? 58 : isTablet ? 84 : 108, color:T.black }}>
                Engineering<br />
                <span style={{ color:T.g300, fontStyle:"italic" }}>Tomorrow,</span><br />
                Today.
              </h1>
            </div>

            <div className="fu d3" style={{ display:"flex", gap:12, flexWrap:"wrap", marginTop:40, position:"relative" }}>
              <a href="#services" className="btn-b">Our Services</a>
              <a href="#projects" className="btn-g">View Work</a>
            </div>
          </div>

          {/* Right: about + stats */}
          <div style={{ display:"flex", flexDirection:"column" }}>
            <div style={{
              padding: isMobile ? "36px 0 28px" : isTablet ? "48px 0 36px" : "60px 0 48px 48px",
              borderBottom:`1px solid ${T.g200}`,
              flex:1,
            }}>
              <span className="fl" style={{ display:"block", marginBottom:18 }}>About the company</span>
              <p className="fb fu d2" style={{ fontSize: isMobile ? 15 : 17, lineHeight:1.85, color:T.g700 }}>
                {company.about}
              </p>
            </div>

            {/* Stats */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr" }}>
              {[{ n:"7+", l:"Years" }, { n:"80+", l:"Products" }, { n:"40+", l:"Clients" }].map((s, i) => (
                <div key={s.l} className="fu" style={{
                  padding: isMobile ? "22px 14px" : "28px 24px",
                  borderRight: i < 2 ? `1px solid ${T.g200}` : "none",
                  animationDelay:`${.2+i*.1}s`,
                }}>
                  <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize: isMobile ? 38 : 50, lineHeight:1, letterSpacing:-2, color:T.black }}>{s.n}</div>
                  <span className="fl" style={{ display:"block", marginTop:6 }}>{s.l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Ticker tape */}
      <div style={{ background:T.black, padding:"11px 0", overflow:"hidden" }}>
        <div className="mq-track">
          {[...Array(6)].map((_,i) => (
            <span key={i} style={{ display:"inline-flex", alignItems:"center" }}>
              {[...company.tags,"Product Engineering","Cloud Infra","DevOps",company.businessPark].map((t,j) => (
                <span key={j} style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:11, letterSpacing:"0.2em", textTransform:"uppercase", color:T.g700, padding:"0 18px" }}>
                  {t} <span style={{ color:T.g800 }}>·</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────
   ABOUT
───────────────────────────────────────────────────────── */
function About() {
  const { isMobile, isDesktop } = useBreakpoint();
  const py = isMobile ? 64 : 100;

  return (
    <section id="about" style={{ background:T.g50, padding:`${py}px 0`, borderBottom:`1px solid ${T.g200}` }}>
      <div className="wrap">
        <SH num="01 / About" right="NexaCore" />

        <div style={{ display:"grid", gridTemplateColumns: isDesktop ? "300px 1fr" : "1fr", gap: isMobile ? 40 : 72, alignItems:"start" }}>
          {/* Left meta */}
          <div>
            <h2 className="fd" style={{ fontSize: isMobile ? 44 : 56, color:T.black, marginBottom:28 }}>
              Built on<br />Conviction.
            </h2>
            <div style={{ width:32, height:3, background:T.black, marginBottom:28 }} />
            {[
              ["Industry",  company.industry],
              ["Size",      company.companySize],
              ["Founded",   String(company.foundedYear)],
              ["City",      company.address.city],
              ["Park",      company.businessPark],
              ["Pincode",   company.address.pincode],
            ].map(([k,v]) => (
              <div key={k} style={{ display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:4, padding:"10px 0", borderBottom:`1px solid ${T.g200}` }}>
                <span className="fl">{k}</span>
                <span className="fm" style={{ color:T.g700 }}>{v}</span>
              </div>
            ))}
          </div>

          {/* Right story */}
          <div>
            <p style={{ fontFamily:"'Barlow',sans-serif", fontWeight:300, fontSize: isMobile ? 17 : 21, lineHeight:1.8, color:T.g700, marginBottom:28 }}>
              {company.about}
            </p>
            <p className="fb" style={{ fontSize:15, marginBottom:36 }}>
              Headquartered at {company.businessPark} in Kerala's technology corridor, we partner with startups,
              growth-stage ventures, and blue-chip enterprises across fintech, healthtech, logistics,
              and education — bringing senior engineering talent to every engagement.
            </p>
            <div style={{ borderLeft:`3px solid ${T.black}`, paddingLeft:22, marginBottom:36 }}>
              <p style={{ fontFamily:"'Barlow Condensed',sans-serif", fontStyle:"italic", fontWeight:700, fontSize: isMobile ? 18 : 22, color:T.black, lineHeight:1.4, textTransform:"uppercase" }}>
                "We don't just ship code.<br />We take ownership of outcomes."
              </p>
              <span className="fl" style={{ display:"block", marginTop:10 }}>— Arjun Menon, Founder & CEO</span>
            </div>
            <a href="#contact" className="btn-b">Work With Us →</a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────
   SERVICES
───────────────────────────────────────────────────────── */
function Services() {
  const { isMobile, isDesktop } = useBreakpoint();
  const [active, setActive] = useState(null);
  const py = isMobile ? 64 : 100;

  return (
    <section id="services" style={{ background:T.white, padding:`${py}px 0` }}>
      <div className="wrap">
        <SH num="02 / Services" right="What We Do" />

        <div style={{ display:"grid", gridTemplateColumns: isDesktop ? "1fr 1fr" : "1fr", gap: isMobile ? 24 : 64, marginBottom:48, alignItems:"end" }}>
          <h2 className="fd" style={{ fontSize: isMobile ? 44 : 80, color:T.black }}>
            Six<br />Practice<br />Areas.
          </h2>
          <p className="fb" style={{ fontSize:15 }}>
            From first-principles architecture to scaled delivery — our practice areas cover the
            complete product lifecycle. Every engagement gets a dedicated senior team.
          </p>
        </div>

        <div style={{ borderTop:`1px solid ${T.g200}` }}>
          {company.services.map((s, i) => (
            <div key={i} className="rh"
              onClick={() => setActive(active === i ? null : i)}
              style={{ display:"flex", gap:16, padding:"22px 8px", borderBottom:`1px solid ${T.g200}`, alignItems: active===i ? "flex-start" : "center" }}>
              <span className="fl" style={{ minWidth:32, paddingTop: active===i ? 3 : 0 }}>0{i+1}</span>
              <div style={{ flex:1 }}>
                <h3 style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize: isMobile ? 20 : 32, textTransform:"uppercase", letterSpacing:"-0.01em", color: active===i ? T.black : T.g800, transition:"color .2s" }}>
                  {s.title}
                </h3>
                {active === i && (
                  <p className="fb" style={{ fontSize:14, marginTop:10 }}>{s.description}</p>
                )}
              </div>
              <div style={{ width:28, height:28, border:`1px solid ${active===i ? T.black : T.g200}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, color:T.g400, transform: active===i ? "rotate(45deg)" : "none", transition:"all .25s", flexShrink:0 }}>+</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────
   PROJECTS
───────────────────────────────────────────────────────── */
function Projects() {
  const { isMobile, isDesktop } = useBreakpoint();
  const py = isMobile ? 64 : 100;

  return (
    <section id="projects" style={{ background:T.g900, padding:`${py}px 0` }}>
      <div className="wrap">
        <SH num="03 / Projects" right="Selected Work" dark />

        <div style={{ display:"grid", gridTemplateColumns: isDesktop ? "1fr 1fr" : "1fr", border:`1px solid ${T.g800}` }}>
          {company.projects.map((p, i) => {
            const lastInRow  = isDesktop ? i % 2 === 1 : true;
            const lastRow    = isDesktop ? i >= 2 : i === company.projects.length - 1;
            return (
              <a key={i} href={p.link}
                style={{
                  display:"block",
                  padding: isMobile ? "32px 20px" : "44px 40px",
                  borderRight:  !lastInRow  ? `1px solid ${T.g800}` : "none",
                  borderBottom: !lastRow    ? `1px solid ${T.g800}` : "none",
                  background:"transparent", transition:"background .2s",
                }}
                onMouseEnter={e => e.currentTarget.style.background = T.g800}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:20, alignItems:"center" }}>
                  <span className="fl" style={{ color:T.g600 }}>{p.category}</span>
                  <span className="fl" style={{ color:T.g700 }}>{p.year}</span>
                </div>
                <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize: isMobile ? 52 : 68, color:T.g800, lineHeight:1, marginBottom:6, letterSpacing:-2 }}>
                  0{i+1}
                </div>
                <h3 className="fd" style={{ fontSize: isMobile ? 32 : 48, color:T.white, marginBottom:14, lineHeight:1 }}>{p.name}</h3>
                <p className="fb" style={{ fontSize:14, color:T.g500, marginBottom:24 }}>{p.description}</p>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:11, letterSpacing:"0.18em", textTransform:"uppercase", color:T.g400 }}>Case Study</span>
                  <span style={{ color:T.g500, fontSize:16 }}>↗</span>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────
   TEAM
───────────────────────────────────────────────────────── */
function Team() {
  const { isMobile, isTablet, isDesktop } = useBreakpoint();
  const cols    = isMobile ? 1 : isTablet ? 2 : 3;
  const greys   = [T.black, T.g800, T.g700, T.g600, T.g800, T.black];
  const py      = isMobile ? 64 : 100;

  return (
    <section id="team" style={{ background:T.white, padding:`${py}px 0` }}>
      <div className="wrap">
        <SH num="04 / Team" right="Leadership" />

        <div style={{ display:"grid", gridTemplateColumns: isDesktop ? "1fr 1fr" : "1fr", gap: isMobile ? 20 : 64, marginBottom:48, alignItems:"end" }}>
          <h2 className="fd" style={{ fontSize: isMobile ? 44 : 80, color:T.black }}>The People<br />Behind<br />the Work.</h2>
          <p className="fb" style={{ fontSize:15 }}>
            Six senior leaders with deep domain expertise. No account managers — you work directly with
            the people building your product.
          </p>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:`repeat(${cols},1fr)`, border: isMobile ? "none" : `1px solid ${T.g200}` }}>
          {company.members.map((m, i) => {
            const col     = i % cols;
            const row     = Math.floor(i / cols);
            const lastRow = Math.floor((company.members.length - 1) / cols);
            return (
              <div key={i}
                style={{
                  padding: isMobile ? "28px 0" : "32px 26px",
                  borderRight:  !isMobile && col < cols-1 ? `1px solid ${T.g200}` : "none",
                  borderBottom: isMobile ? `1px solid ${T.g100}` : (row < lastRow ? `1px solid ${T.g200}` : "none"),
                  background:T.white, transition:"background .2s", cursor:"pointer",
                }}
                onMouseEnter={e => e.currentTarget.style.background = T.g50}
                onMouseLeave={e => e.currentTarget.style.background = T.white}
              >
                <div style={{ width:48, height:48, background:greys[i % greys.length], display:"flex", alignItems:"center", justifyContent:"center", marginBottom:18 }}>
                  <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:15, color:T.white, letterSpacing:1 }}>{initials(m.name)}</span>
                </div>
                <span className="fl" style={{ display:"block", marginBottom:6 }}>0{i+1}</span>
                <h3 style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:19, textTransform:"uppercase", letterSpacing:"0.01em", color:T.black, marginBottom:4 }}>{m.name}</h3>
                <p className="fl" style={{ color:T.g500, marginBottom:12 }}>{m.position}</p>
                <p className="fb" style={{ fontSize:13, lineHeight:1.7 }}>{m.bio}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────
   CLIENTS
───────────────────────────────────────────────────────── */
function Clients() {
  const { isMobile, isTablet, isDesktop } = useBreakpoint();
  const cols = isMobile ? 2 : isTablet ? 3 : 4;
  const py   = isMobile ? 64 : 100;

  return (
    <section id="clients" style={{ background:T.g50, padding:`${py}px 0`, borderTop:`1px solid ${T.g200}`, borderBottom:`1px solid ${T.g200}` }}>
      <div className="wrap">
        <SH num="05 / Clients" right="Trusted By" />

        <div style={{ marginBottom:40 }}>
          <h2 className="fd" style={{ fontSize: isMobile ? 44 : 68, color:T.black, marginBottom:20 }}>Trusted by<br />the Best.</h2>
          <p className="fb" style={{ fontSize:15, maxWidth:520 }}>
            From government institutions to nimble VC-backed startups — our clients span every stage and sector.
          </p>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:`repeat(${cols},1fr)`, border:`1px solid ${T.g200}` }}>
          {company.clients.map((c, i) => {
            const col     = i % cols;
            const row     = Math.floor(i / cols);
            const lastRow = Math.floor((company.clients.length - 1) / cols);
            return (
              <div key={i}
                style={{
                  padding: isMobile ? "20px 14px" : "28px 22px",
                  borderRight:  col < cols-1 ? `1px solid ${T.g200}` : "none",
                  borderBottom: row < lastRow ? `1px solid ${T.g200}` : "none",
                  background:T.white, transition:"background .2s",
                }}
                onMouseEnter={e => e.currentTarget.style.background = T.g50}
                onMouseLeave={e => e.currentTarget.style.background = T.white}
              >
                <div style={{ width:38, height:38, background:T.black, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:10 }}>
                  <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:12, color:T.white, letterSpacing:1 }}>
                    {c.name.slice(0,2).toUpperCase()}
                  </span>
                </div>
                <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize: isMobile ? 13 : 14, textTransform:"uppercase", letterSpacing:"0.04em", color:T.black, display:"block", marginBottom:4 }}>
                  {c.name}
                </span>
                <span className="fl">{c.sector}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────
   GALLERY
───────────────────────────────────────────────────────── */
function Gallery() {
  const { isMobile, isTablet, isDesktop } = useBreakpoint();
  const shades = [T.g300, T.g400, T.g500, T.g600, T.g400, T.g300];
  const py     = isMobile ? 64 : 100;

  return (
    <section id="gallery" style={{ background:T.white, padding:`${py}px 0` }}>
      <div className="wrap">
        <SH num="06 / Gallery" right="Life at NexaCore" />

        {/* Mobile: 2-col simple grid */}
        {isMobile && (
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
            {company.gallery.map((g, i) => (
              <div key={i} className="gal-item" style={{ height:150, background:shades[i], border:`1px solid ${T.g200}`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:44, color:"rgba(255,255,255,0.2)" }}>{String(i+1).padStart(2,"0")}</span>
                <div className="gal-overlay">
                  <span className="fl" style={{ color:T.g400, fontSize:9 }}>{g.tag}</span>
                  <p style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:12, color:T.white, textTransform:"uppercase", letterSpacing:"0.04em" }}>{g.caption}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tablet: 3-col even grid */}
        {isTablet && (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8 }}>
            {company.gallery.map((g, i) => (
              <div key={i} className="gal-item" style={{ height:200, background:shades[i], border:`1px solid ${T.g200}`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:56, color:"rgba(255,255,255,0.2)" }}>{String(i+1).padStart(2,"0")}</span>
                <div className="gal-overlay">
                  <span className="fl" style={{ color:T.g400, fontSize:9 }}>{g.tag}</span>
                  <p style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:14, color:T.white, textTransform:"uppercase", letterSpacing:"0.04em" }}>{g.caption}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Desktop: asymmetric — first item spans 2 rows */}
        {isDesktop && (
          <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr", gridTemplateRows:"300px 300px", gap:8 }}>
            {company.gallery.map((g, i) => (
              <div key={i} className="gal-item"
                style={{
                  gridColumn: i === 0 ? "1" : undefined,
                  gridRow:    i === 0 ? "1 / 3" : undefined,
                  background: shades[i],
                  border:`1px solid ${T.g200}`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                }}
              >
                <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize: i===0 ? 110 : 64, color:"rgba(255,255,255,0.18)", letterSpacing:-2 }}>
                  {String(i+1).padStart(2,"0")}
                </span>
                <div className="gal-overlay">
                  <span className="fl" style={{ color:T.g400, fontSize:9 }}>{g.tag}</span>
                  <p style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:15, color:T.white, textTransform:"uppercase", letterSpacing:"0.04em", textAlign:"center" }}>{g.caption}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────
   CONTACT
───────────────────────────────────────────────────────── */
function Contact() {
  const { isMobile, isDesktop } = useBreakpoint();
  const [form,    setForm]  = useState({ name:"", email:"", company:"", message:"" });
  const [sent,    setSent]  = useState(false);
  const [loading, setLoad]  = useState(false);
  const py = isMobile ? 64 : 100;

  const submit = e => {
    e.preventDefault();
    setLoad(true);
    setTimeout(() => { setLoad(false); setSent(true); }, 1400);
  };

  return (
    <section id="contact" style={{ background:T.g50, padding:`${py}px 0`, borderTop:`1px solid ${T.g200}` }}>
      <div className="wrap">
        <SH num="07 / Contact" right="Get in Touch" />

        <div style={{ display:"grid", gridTemplateColumns: isDesktop ? "1fr 1fr" : "1fr", gap: isMobile ? 48 : 80, alignItems:"start" }}>

          {/* Left */}
          <div>
            <h2 className="fd" style={{ fontSize: isMobile ? 48 : 72, color:T.black, marginBottom:28 }}>
              Let's Build<br />Something<br />Great.
            </h2>
            <p className="fb" style={{ fontSize:15, marginBottom:44 }}>
              Whether you're launching a product, scaling engineering, or need a technology
              audit — drop us a message and we'll get back within 24 hours.
            </p>

            <div style={{ borderTop:`2px solid ${T.black}` }}>
              {[
                { label:"Email",    value:company.contacts.email },
                { label:"Phone",    value:company.contacts.phone },
                { label:"Location", value:`${company.address.building}, ${company.address.city}` },
                { label:"Pincode",  value:company.address.pincode },
              ].map(c => (
                <div key={c.label} style={{ display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:6, padding:"13px 0", borderBottom:`1px solid ${T.g200}` }}>
                  <span className="fl">{c.label}</span>
                  <span className="fm" style={{ color:T.g700 }}>{c.value}</span>
                </div>
              ))}
            </div>

            <div style={{ display:"flex", gap:10, marginTop:30, flexWrap:"wrap" }}>
              {["LinkedIn","Twitter","Instagram","WhatsApp"].map(name => (
                <a key={name} href="#"
                  style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:11, letterSpacing:"0.18em", textTransform:"uppercase", color:T.g500, border:`1px solid ${T.g200}`, padding:"7px 14px", transition:"all .2s" }}
                  onMouseEnter={e => { e.target.style.borderColor=T.black; e.target.style.color=T.black; }}
                  onMouseLeave={e => { e.target.style.borderColor=T.g200;  e.target.style.color=T.g500; }}
                >{name}</a>
              ))}
            </div>
          </div>

          {/* Form */}
          <div style={{ background:T.white, border:`1px solid ${T.g200}`, padding: isMobile ? "28px 20px" : "44px 40px" }}>
            {sent ? (
              <div style={{ minHeight:360, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", textAlign:"center" }}>
                <div style={{ width:50, height:50, border:`2px solid ${T.black}`, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:18 }}>
                  <span style={{ fontSize:22 }}>✓</span>
                </div>
                <h3 className="fd" style={{ fontSize:30, color:T.black, marginBottom:10 }}>Message Sent.</h3>
                <p className="fb" style={{ maxWidth:240, fontSize:14 }}>We'll respond within 24 business hours.</p>
              </div>
            ) : (
              <form onSubmit={submit} style={{ display:"flex", flexDirection:"column", gap:26 }}>
                {[
                  { label:"Your Name",     key:"name",    type:"text",  ph:"Full name",        req:true  },
                  { label:"Email Address", key:"email",   type:"email", ph:"you@company.com",  req:true  },
                  { label:"Company",       key:"company", type:"text",  ph:"Your company",     req:false },
                ].map(f => (
                  <div key={f.key}>
                    <span className="fl" style={{ display:"block", marginBottom:8 }}>{f.label}</span>
                    <input className="field" type={f.type} placeholder={f.ph} value={form[f.key]}
                      onChange={e => setForm({...form,[f.key]:e.target.value})} required={f.req} />
                  </div>
                ))}
                <div>
                  <span className="fl" style={{ display:"block", marginBottom:8 }}>Message</span>
                  <textarea className="field" rows={5} placeholder="Tell us about your project and goals…"
                    value={form.message} onChange={e => setForm({...form,message:e.target.value})} required style={{ resize:"none" }} />
                </div>
                <button type="submit" className="btn-b" disabled={loading}
                  style={{ alignSelf:"flex-start", opacity:loading ? .6 : 1, cursor:loading ? "not-allowed" : "pointer" }}>
                  {loading ? "Sending…" : "Send Message →"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────
   FOOTER
───────────────────────────────────────────────────────── */
function Footer() {
  const { isMobile, isTablet, isDesktop } = useBreakpoint();

  return (
    <footer style={{ background:T.black }}>
      <div className="wrap" style={{ padding: isMobile ? "44px 20px 28px" : "60px 48px 36px" }}>
        <div style={{
          display:"grid",
          gridTemplateColumns: isMobile ? "1fr 1fr" : isTablet ? "1fr 1fr 1fr" : "2fr 1fr 1fr 1fr",
          gap: isMobile ? 28 : 44,
          paddingBottom:44,
          borderBottom:`1px solid ${T.g900}`,
        }}>
          {/* Brand — full width on mobile */}
          <div style={{ gridColumn: isMobile ? "1 / -1" : "auto" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
              <div style={{ width:28, height:28, background:T.white, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <span style={{ color:T.black, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:11 }}>NC</span>
              </div>
              <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:16, letterSpacing:"0.08em", textTransform:"uppercase", color:T.white }}>
                NexaCore
              </span>
            </div>
            <p className="fb" style={{ fontSize:13, color:T.g600, maxWidth:260, lineHeight:1.8 }}>
              Building scalable digital infrastructure for the next generation of enterprises.
            </p>
            <p className="fl" style={{ color:T.g700, marginTop:12 }}>
              {company.address.city} · {company.address.state} · {company.address.country}
            </p>
          </div>

          {[
            { heading:"Company", links:["About","Services","Projects","Team"]          },
            { heading:"Work",    links:["Clients","Gallery","Case Studies","Blog"]      },
            { heading:"Connect", links:["LinkedIn","Twitter","Instagram","GitHub"]      },
          ].map(col => (
            <div key={col.heading}>
              <span className="fl" style={{ color:T.g700, display:"block", marginBottom:18 }}>{col.heading}</span>
              {col.links.map(l => (
                <a key={l} href="#"
                  style={{ display:"block", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:600, fontSize:13, letterSpacing:"0.06em", textTransform:"uppercase", color:T.g600, marginBottom:12, transition:"color .2s" }}
                  onMouseEnter={e => e.target.style.color = T.white}
                  onMouseLeave={e => e.target.style.color = T.g600}
                >{l}</a>
              ))}
            </div>
          ))}
        </div>

        <div style={{ paddingTop:22, display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:10 }}>
          <span className="fl" style={{ color:T.g700 }}>© {new Date().getFullYear()} {company.companyName}. All rights reserved.</span>
          <span className="fl" style={{ color:T.g700 }}>{company.businessPark} · Est. {company.foundedYear}</span>
        </div>
      </div>
    </footer>
  );
}

/* ─────────────────────────────────────────────────────────
   ROOT EXPORT
───────────────────────────────────────────────────────── */
export default function Company4() {
  return (
    <>
      <GlobalStyles />
      <Nav />
      <Hero />
      <About />
      <Services />
      <Projects />
      <Team />
      <Clients />
      <Gallery />
      <Contact />
      <Footer />
    </>
  );
}