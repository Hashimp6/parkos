import { useState, useEffect, useRef, useCallback } from "react";

/* ─── DATA ──────────────────────────────────────────────────────────────────── */
const D = {
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

const soc = D.socials?.[0] || {};
const fmt = d => !d ? "Present" : new Date(d).toLocaleDateString("en-US",{month:"short",year:"numeric"});
const expYrs = D.experience?.length ? new Date().getFullYear() - new Date(D.experience[D.experience.length-1].startDate).getFullYear() : 7;

/* ─── HOOKS ─────────────────────────────────────────────────────────────────── */
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function useCounter(target, visible) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!visible) return;
    let cur = 0; const step = Math.ceil(target / 50);
    const id = setInterval(() => { cur = Math.min(cur + step, target); setV(cur); if (cur >= target) clearInterval(id); }, 30);
    return () => clearInterval(id);
  }, [visible, target]);
  return v;
}

function useMouse() {
  const pos = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const h = e => { pos.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener("mousemove", h);
    return () => window.removeEventListener("mousemove", h);
  }, []);
  return pos;
}

/* ─── ANIMATED TEXT ──────────────────────────────────────────────────────────── */
function FadeUp({ children, delay = 0, className = "", style = {} }) {
  const [ref, vis] = useInView();
  return (
    <div ref={ref} className={className} style={{
      opacity: vis ? 1 : 0,
      transform: vis ? "none" : "translateY(40px)",
      transition: `opacity .9s cubic-bezier(.16,1,.3,1) ${delay}ms, transform .9s cubic-bezier(.16,1,.3,1) ${delay}ms`,
      ...style,
    }}>{children}</div>
  );
}

/* ─── MAGNETIC BUTTON ────────────────────────────────────────────────────────── */
function MagBtn({ children, onClick, href, style = {}, className = "" }) {
  const el = useRef(null);
  const handleMove = e => {
    const r = el.current.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) * 0.25;
    const y = (e.clientY - r.top - r.height / 2) * 0.25;
    el.current.style.transform = `translate(${x}px,${y}px)`;
  };
  const handleLeave = () => { el.current.style.transform = ""; };
  const props = { ref: el, onMouseMove: handleMove, onMouseLeave: handleLeave, onClick, style: { transition: "transform .3s cubic-bezier(.16,1,.3,1)", ...style }, className };
  return href ? <a href={href} {...props}>{children}</a> : <button {...props}>{children}</button>;
}

/* ─── STAT CARD ──────────────────────────────────────────────────────────────── */
function Stat({ n, label }) {
  const [ref, vis] = useInView(0.5);
  const v = useCounter(n, vis);
  return (
    <div ref={ref} style={{ textAlign: "center" }}>
      <div style={{ fontFamily: "'Clash Display',sans-serif", fontSize: "clamp(2.8rem,4.5vw,4rem)", fontWeight: 700, color: "#1a1410", lineHeight: 1, letterSpacing: "-.03em" }}>
        {v}<span style={{ color: "#c9a84c" }}>+</span>
      </div>
      <div style={{ fontFamily: "'Satoshi',sans-serif", fontSize: ".75rem", letterSpacing: ".16em", textTransform: "uppercase", color: "#9b8f7e", marginTop: ".4rem", fontWeight: 500 }}>{label}</div>
    </div>
  );
}

/* ─── CURSOR GLOW ────────────────────────────────────────────────────────────── */
function CursorGlow() {
  const dot = useRef(null);
  const ring = useRef(null);
  const mouse = useRef({ x: -200, y: -200 });
  const ring_pos = useRef({ x: -200, y: -200 });
  useEffect(() => {
    const move = e => { mouse.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener("mousemove", move);
    let raf;
    const tick = () => {
      ring_pos.current.x += (mouse.current.x - ring_pos.current.x) * .12;
      ring_pos.current.y += (mouse.current.y - ring_pos.current.y) * .12;
      if (dot.current) { dot.current.style.left = mouse.current.x + "px"; dot.current.style.top = mouse.current.y + "px"; }
      if (ring.current) { ring.current.style.left = ring_pos.current.x + "px"; ring.current.style.top = ring_pos.current.y + "px"; }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { window.removeEventListener("mousemove", move); cancelAnimationFrame(raf); };
  }, []);
  return (
    <>
      <div ref={dot} style={{ position: "fixed", pointerEvents: "none", zIndex: 9999, width: 8, height: 8, borderRadius: "50%", background: "#c9a84c", transform: "translate(-50%,-50%)", mixBlendMode: "multiply" }} />
      <div ref={ring} style={{ position: "fixed", pointerEvents: "none", zIndex: 9998, width: 40, height: 40, borderRadius: "50%", border: "1.5px solid rgba(201,168,76,.5)", transform: "translate(-50%,-50%)" }} />
    </>
  );
}

/* ─── MARQUEE ────────────────────────────────────────────────────────────────── */
function Marquee({ items }) {
  const doubled = [...items, ...items, ...items];
  return (
    <div style={{ overflow: "hidden", borderTop: "1px solid #e8e0d4", borderBottom: "1px solid #e8e0d4", padding: "18px 0", background: "#f7f3ed" }}>
      <div style={{ display: "flex", animation: "mq 28s linear infinite", whiteSpace: "nowrap" }}>
        {doubled.map((t, i) => (
          <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: "1.2rem", padding: "0 2rem", fontFamily: "'Clash Display',sans-serif", fontSize: "1.1rem", fontWeight: 600, letterSpacing: ".04em", color: "#c5b89a" }}>
            {t} <span style={{ color: "#c9a84c", fontSize: ".6rem" }}>◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── NAV ────────────────────────────────────────────────────────────────────── */
function Nav() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const h = () => setSolid(window.scrollY > 60);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  const go = id => { setOpen(false); document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); };
  const links = [
    D.services?.length && ["services", "Services"],
    D.projects?.length && ["projects", "Work"],
    (D.experience?.length || D.education?.length) && ["journey", "Journey"],
    ["contact", "Contact"],
  ].filter(Boolean);

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 800,
      height: 70, display: "flex", alignItems: "center",
      justifyContent: "space-between",
      padding: "0 clamp(1.5rem,5vw,5rem)",
      background: solid ? "rgba(247,243,237,.92)" : "transparent",
      backdropFilter: solid ? "blur(18px)" : "none",
      borderBottom: solid ? "1px solid rgba(201,168,76,.2)" : "1px solid transparent",
      transition: "all .4s ease",
    }}>
      <div onClick={() => go("hero")} style={{ fontFamily: "'Clash Display',sans-serif", fontSize: "1.4rem", fontWeight: 700, letterSpacing: "-.02em", color: "#1a1410", cursor: "pointer" }}>
        {D.firstName}<span style={{ color: "#c9a84c" }}> {D.lastName}</span>
      </div>

      {/* desktop */}
      <div style={{ display: "flex", gap: "2.5rem", alignItems: "center" }} className="desk-nav">
        {links.map(([id, lbl]) => (
          <button key={id} onClick={() => go(id)} style={{
            fontFamily: "'Satoshi',sans-serif", fontSize: ".8rem", fontWeight: 600,
            letterSpacing: ".1em", textTransform: "uppercase", background: "none",
            border: "none", cursor: "pointer", color: "#5c5248", transition: "color .2s",
            padding: "4px 0", borderBottom: "1px solid transparent",
          }}
            onMouseEnter={e => { e.target.style.color = "#c9a84c"; e.target.style.borderBottomColor = "#c9a84c"; }}
            onMouseLeave={e => { e.target.style.color = "#5c5248"; e.target.style.borderBottomColor = "transparent"; }}
          >{lbl}</button>
        ))}
        {D.cv && (
          <MagBtn href={D.cv} style={{
            padding: "9px 24px", border: "1.5px solid #1a1410",
            borderRadius: 100, fontFamily: "'Satoshi',sans-serif",
            fontSize: ".78rem", fontWeight: 700, letterSpacing: ".08em",
            textTransform: "uppercase", color: "#1a1410", textDecoration: "none",
            background: "transparent", cursor: "pointer",
          }}
            onMouseEnter={e => { e.target.style.background = "#1a1410"; e.target.style.color = "#f7f3ed"; }}
            onMouseLeave={e => { e.target.style.background = "transparent"; e.target.style.color = "#1a1410"; }}
          >CV ↓</MagBtn>
        )}
      </div>

      {/* ham */}
      <button onClick={() => setOpen(o => !o)} className="mob-nav-btn" style={{ display: "none", background: "none", border: "none", cursor: "pointer", flexDirection: "column", gap: 5 }}>
        {[0,1,2].map(i => <span key={i} style={{ display: "block", width: 22, height: 1.5, background: "#1a1410", transition: "all .25s", transform: open && i===0 ? "translateY(6.5px) rotate(45deg)" : open && i===2 ? "translateY(-6.5px) rotate(-45deg)" : open && i===1 ? "scaleX(0)" : "none" }}/>)}
      </button>

      {open && (
        <div style={{ position: "absolute", top: 70, left: 0, right: 0, background: "#f7f3ed", borderBottom: "1px solid #e8e0d4", padding: "1.5rem clamp(1.5rem,5vw,5rem) 2rem" }}>
          {links.map(([id, lbl]) => (
            <button key={id} onClick={() => go(id)} style={{ display: "block", width: "100%", textAlign: "left", background: "none", border: "none", borderBottom: "1px solid #ede7dc", cursor: "pointer", padding: "14px 0", fontFamily: "'Clash Display',sans-serif", fontSize: "1.3rem", fontWeight: 700, color: "#1a1410" }}>{lbl}</button>
          ))}
        </div>
      )}
    </nav>
  );
}

/* ─── HERO ───────────────────────────────────────────────────────────────────── */
function Hero() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setTimeout(() => setLoaded(true), 100); }, []);

  return (
    <section id="hero" style={{ minHeight: "100vh", display: "grid", gridTemplateColumns: "1fr 1fr", background: "#f7f3ed" }}>

      {/* LEFT */}
      <div style={{
        display: "flex", flexDirection: "column", justifyContent: "flex-end",
        padding: "140px clamp(1.5rem,5vw,5rem) 80px",
        position: "relative", zIndex: 2,
      }}>
        {/* floating role pill */}
        <div style={{
          opacity: loaded ? 1 : 0, transform: loaded ? "none" : "translateY(20px)",
          transition: "all .8s cubic-bezier(.16,1,.3,1) .1s",
          display: "inline-flex", alignItems: "center", gap: ".7rem",
          marginBottom: "2.5rem", width: "fit-content",
        }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", display: "inline-block", boxShadow: "0 0 0 3px rgba(34,197,94,.2)", animation: "pulse 2s infinite" }}/>
          <span style={{ fontFamily: "'Satoshi',sans-serif", fontSize: ".78rem", fontWeight: 600, letterSpacing: ".14em", textTransform: "uppercase", color: "#9b8f7e" }}>{D.role}</span>
        </div>

        {/* BIG NAME */}
        <div style={{ overflow: "hidden", marginBottom: ".4rem" }}>
          <h1 style={{
            fontFamily: "'Clash Display',sans-serif", fontWeight: 700,
            fontSize: "clamp(4.5rem,9.5vw,8.5rem)", lineHeight: .87,
            letterSpacing: "-.04em", color: "#1a1410",
            opacity: loaded ? 1 : 0, transform: loaded ? "none" : "translateY(100%)",
            transition: "all 1s cubic-bezier(.16,1,.3,1) .2s",
          }}>
            {D.firstName}
          </h1>
        </div>
        <div style={{ overflow: "hidden", marginBottom: "3rem" }}>
          <h1 style={{
            fontFamily: "'Clash Display',sans-serif", fontWeight: 700,
            fontSize: "clamp(4.5rem,9.5vw,8.5rem)", lineHeight: .87,
            letterSpacing: "-.04em",
            color: "transparent", WebkitTextStroke: "2px #c9a84c",
            opacity: loaded ? 1 : 0, transform: loaded ? "none" : "translateY(100%)",
            transition: "all 1s cubic-bezier(.16,1,.3,1) .35s",
          }}>
            {D.lastName}
          </h1>
        </div>

        {D.about && (
          <p style={{
            fontFamily: "'Satoshi',sans-serif", fontSize: "1.05rem", fontWeight: 400,
            color: "#7a6f62", lineHeight: 1.8, maxWidth: 420, marginBottom: "3rem",
            opacity: loaded ? 1 : 0, transform: loaded ? "none" : "translateY(20px)",
            transition: "all .9s cubic-bezier(.16,1,.3,1) .5s",
          }}>{D.about}</p>
        )}

        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "4rem",
          opacity: loaded ? 1 : 0, transform: loaded ? "none" : "translateY(20px)",
          transition: "all .9s cubic-bezier(.16,1,.3,1) .65s",
        }}>
          <MagBtn onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })} style={{
            padding: "15px 34px", background: "#1a1410", color: "#f7f3ed",
            border: "none", borderRadius: 100, fontFamily: "'Satoshi',sans-serif",
            fontWeight: 700, fontSize: ".88rem", letterSpacing: ".06em",
            textTransform: "uppercase", cursor: "pointer",
            boxShadow: "0 8px 30px rgba(26,20,16,.2)",
          }}>Let's talk</MagBtn>
          {D.cv && (
            <MagBtn href={D.cv} style={{
              padding: "15px 34px", background: "transparent",
              border: "1.5px solid #c5b89a", color: "#1a1410",
              borderRadius: 100, fontFamily: "'Satoshi',sans-serif",
              fontWeight: 600, fontSize: ".88rem", letterSpacing: ".06em",
              textTransform: "uppercase", cursor: "pointer", textDecoration: "none",
            }}>Download CV</MagBtn>
          )}
        </div>

        {/* contact row */}
        <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap",
          opacity: loaded ? 1 : 0, transition: "all .9s cubic-bezier(.16,1,.3,1) .75s",
        }}>
          {[D.email && ["✉", D.email, `mailto:${D.email}`], D.place && ["◎", D.place, null]].filter(Boolean).map(([icon, text, href]) => (
            <div key={text} style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
              <span style={{ color: "#c9a84c", fontSize: ".85rem" }}>{icon}</span>
              {href ? <a href={href} style={{ fontFamily: "'Satoshi',sans-serif", fontSize: ".82rem", color: "#9b8f7e", textDecoration: "none", fontWeight: 500 }}>{text}</a>
                : <span style={{ fontFamily: "'Satoshi',sans-serif", fontSize: ".82rem", color: "#9b8f7e", fontWeight: 500 }}>{text}</span>}
            </div>
          ))}
        </div>

        {/* vertical scroll hint */}
        <div style={{ position: "absolute", bottom: "2.5rem", right: "2rem", display: "flex", alignItems: "center", gap: ".6rem", opacity: .4 }}>
          <div style={{ width: 1, height: 60, background: "#1a1410" }}/>
          <span style={{ fontFamily: "'Satoshi',sans-serif", fontSize: ".65rem", letterSpacing: ".18em", textTransform: "uppercase", color: "#1a1410", writingMode: "vertical-rl" }}>Scroll</span>
        </div>
      </div>

      {/* RIGHT — PHOTO */}
      {D.profilePhoto && (
        <div style={{ position: "relative", overflow: "hidden", background: "#ede7dc" }} className="hero-photo-panel">
          <img
            src={D.profilePhoto} alt={D.name}
            style={{
              width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top",
              opacity: loaded ? 1 : 0, transform: loaded ? "scale(1)" : "scale(1.08)",
              transition: "opacity 1.2s ease .3s, transform 1.2s cubic-bezier(.16,1,.3,1) .3s",
              display: "block",
            }}
          />
          {/* Overlay tint */}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 55%, rgba(26,20,16,.55) 100%)" }}/>
          {/* Qualification pill */}
          {D.qualification && (
            <div style={{
              position: "absolute", bottom: "2.5rem", left: "2rem", right: "2rem",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              background: "rgba(247,243,237,.12)", backdropFilter: "blur(14px)",
              border: "1px solid rgba(247,243,237,.2)", borderRadius: 14,
              padding: "1rem 1.4rem",
              opacity: loaded ? 1 : 0, transform: loaded ? "none" : "translateY(16px)",
              transition: "all 1s cubic-bezier(.16,1,.3,1) 1s",
            }}>
              <div>
                <p style={{ fontFamily: "'Satoshi',sans-serif", fontSize: ".65rem", letterSpacing: ".14em", textTransform: "uppercase", color: "rgba(247,243,237,.5)", margin: "0 0 3px" }}>Qualification</p>
                <p style={{ fontFamily: "'Clash Display',sans-serif", fontWeight: 600, fontSize: "1rem", color: "#fff", margin: 0 }}>{D.qualification}</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontFamily: "'Satoshi',sans-serif", fontSize: ".65rem", letterSpacing: ".14em", textTransform: "uppercase", color: "rgba(247,243,237,.5)", margin: "0 0 3px" }}>Experience</p>
                <p style={{ fontFamily: "'Clash Display',sans-serif", fontWeight: 700, fontSize: "1.4rem", color: "#c9a84c", margin: 0, lineHeight: 1 }}>{expYrs}+<span style={{ fontSize: ".7rem", fontWeight: 500, color: "rgba(247,243,237,.5)", marginLeft: 3 }}>yrs</span></p>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

/* ─── STATS STRIP ─────────────────────────────────────────────────────────────── */
function Stats() {
  return (
    <div style={{ background: "#1a1410", padding: "3.5rem clamp(1.5rem,5vw,5rem)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "2rem" }}>
        <Stat n={expYrs} label="Years Experience" />
        {D.projects?.length > 0 && <Stat n={D.projects.length} label="Projects Shipped" />}
        {D.skills?.length > 0 && <Stat n={D.skills.length} label="Technologies" />}
        {D.experience?.length > 0 && <Stat n={D.experience.length} label="Companies" />}
      </div>
    </div>
  );
}

/* ─── ABOUT / SKILLS ──────────────────────────────────────────────────────────── */
function About() {
  if (!D.skills?.length) return null;
  return (
    <section style={{ background: "#f7f3ed", padding: "120px clamp(1.5rem,5vw,5rem)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6rem", alignItems: "start" }}>
        <FadeUp>
          <p style={{ fontFamily: "'Satoshi',sans-serif", fontSize: ".72rem", fontWeight: 600, letterSpacing: ".2em", textTransform: "uppercase", color: "#c9a84c", marginBottom: "1.2rem" }}>Technologies</p>
          <h2 style={{ fontFamily: "'Clash Display',sans-serif", fontSize: "clamp(2.5rem,4.5vw,3.8rem)", fontWeight: 700, color: "#1a1410", lineHeight: .95, letterSpacing: "-.03em", marginBottom: "2.5rem" }}>Skills &<br/><em style={{ fontStyle: "italic", color: "#c9a84c" }}>Stack</em></h2>
          <p style={{ fontFamily: "'Satoshi',sans-serif", fontSize: "1rem", color: "#7a6f62", lineHeight: 1.85, marginBottom: "3rem" }}>
            I work across the full stack — from architecting databases to crafting animations. Here are the tools I reach for most.
          </p>
        </FadeUp>
        <FadeUp delay={150}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {D.skills.map((sk, i) => (
              <SkillPill key={i} label={sk} index={i} />
            ))}
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

function SkillPill({ label, index }) {
  const [hover, setHover] = useState(false);
  const [ref, vis] = useInView(0.1);
  return (
    <div ref={ref} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{
      padding: "10px 20px", border: `1.5px solid ${hover ? "#c9a84c" : "#ddd5c4"}`,
      borderRadius: 100, fontFamily: "'Satoshi',sans-serif", fontSize: ".85rem",
      fontWeight: 600, color: hover ? "#c9a84c" : "#5c5248",
      background: hover ? "rgba(201,168,76,.08)" : "transparent",
      cursor: "default", transition: "all .25s ease",
      opacity: vis ? 1 : 0, transform: vis ? "none" : "scale(.9)",
      transitionDelay: `${(index % 6) * 50}ms`,
    }}>{label}</div>
  );
}

/* ─── SERVICES ─────────────────────────────────────────────────────────────────── */
function Services() {
  if (!D.services?.length) return null;
  return (
    <section id="services" style={{ background: "#ede7dc", padding: "120px clamp(1.5rem,5vw,5rem)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <FadeUp>
          <p style={{ fontFamily: "'Satoshi',sans-serif", fontSize: ".72rem", fontWeight: 600, letterSpacing: ".2em", textTransform: "uppercase", color: "#c9a84c", marginBottom: "1.2rem" }}>What I offer</p>
          <h2 style={{ fontFamily: "'Clash Display',sans-serif", fontSize: "clamp(2.5rem,4.5vw,3.8rem)", fontWeight: 700, color: "#1a1410", lineHeight: .95, letterSpacing: "-.03em", marginBottom: "5rem" }}>Services &<br/><em style={{ fontStyle: "italic" }}>Expertise</em></h2>
        </FadeUp>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px,1fr))", gap: "2px" }}>
          {D.services.map((sv, i) => <ServiceCard key={i} item={sv} index={i} />)}
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ item, index }) {
  const [hover, setHover] = useState(false);
  const [ref, vis] = useInView();
  return (
    <div ref={ref} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{
      background: hover ? "#1a1410" : "#f7f3ed", padding: "2.5rem 2rem",
      transition: "background .35s ease",
      opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(30px)",
      transitionDelay: `${index * 80}ms`,
      cursor: "default",
    }}>
      <div style={{ fontFamily: "'Clash Display',sans-serif", fontSize: ".72rem", fontWeight: 700, letterSpacing: ".2em", color: hover ? "rgba(201,168,76,.5)" : "#c5b89a", marginBottom: "1.8rem" }}>0{index+1}</div>
      <h3 style={{ fontFamily: "'Clash Display',sans-serif", fontSize: "1.3rem", fontWeight: 700, color: hover ? "#f7f3ed" : "#1a1410", marginBottom: ".8rem", letterSpacing: "-.01em", transition: "color .35s" }}>{item.heading}</h3>
      <p style={{ fontFamily: "'Satoshi',sans-serif", fontSize: ".88rem", color: hover ? "rgba(247,243,237,.55)" : "#9b8f7e", lineHeight: 1.75, margin: 0, transition: "color .35s" }}>{item.description}</p>
    </div>
  );
}

/* ─── PROJECTS ──────────────────────────────────────────────────────────────────── */
function Projects() {
  if (!D.projects?.length) return null;
  return (
    <section id="projects" style={{ background: "#f7f3ed", padding: "120px clamp(1.5rem,5vw,5rem)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <FadeUp style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "4rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <p style={{ fontFamily: "'Satoshi',sans-serif", fontSize: ".72rem", fontWeight: 600, letterSpacing: ".2em", textTransform: "uppercase", color: "#c9a84c", marginBottom: "1.2rem" }}>Portfolio</p>
            <h2 style={{ fontFamily: "'Clash Display',sans-serif", fontSize: "clamp(2.5rem,4.5vw,3.8rem)", fontWeight: 700, color: "#1a1410", lineHeight: .95, letterSpacing: "-.03em" }}>Selected<br/><em style={{ fontStyle: "italic" }}>Work</em></h2>
          </div>
        </FadeUp>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {D.projects.map((p, i) => <ProjectRow key={i} p={p} i={i} />)}
        </div>
      </div>
    </section>
  );
}

function ProjectRow({ p, i }) {
  const [hover, setHover] = useState(false);
  const [ref, vis] = useInView();
  return (
    <div ref={ref} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        display: "grid", gridTemplateColumns: "80px 1fr auto",
        gap: "2rem", alignItems: "center",
        padding: "2rem 0", borderBottom: "1px solid #e0d8cc",
        opacity: vis ? 1 : 0, transform: vis ? "none" : "translateX(-30px)",
        transition: `opacity .7s ease ${i * 100}ms, transform .7s cubic-bezier(.16,1,.3,1) ${i * 100}ms`,
        cursor: "default",
      }}>
      <span style={{ fontFamily: "'Clash Display',sans-serif", fontSize: "2rem", fontWeight: 700, color: hover ? "#c9a84c" : "rgba(26,20,16,.1)", transition: "color .3s", lineHeight: 1 }}>0{i+1}</span>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: ".4rem" }}>
          <h3 style={{ fontFamily: "'Clash Display',sans-serif", fontSize: "clamp(1.3rem,2.5vw,1.8rem)", fontWeight: 700, color: hover ? "#c9a84c" : "#1a1410", letterSpacing: "-.02em", transition: "color .3s" }}>{p.title}</h3>
          <span style={{ fontFamily: "'Satoshi',sans-serif", fontSize: ".68rem", fontWeight: 600, letterSpacing: ".1em", color: "#c5b89a", textTransform: "uppercase" }}>{p.year}</span>
        </div>
        <p style={{ fontFamily: "'Satoshi',sans-serif", fontSize: ".9rem", color: "#9b8f7e", lineHeight: 1.6, margin: 0 }}>{p.description}</p>
      </div>
      {p.link ? (
        <a href={p.link} target="_blank" rel="noreferrer" style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          width: 48, height: 48, borderRadius: "50%",
          border: `1.5px solid ${hover ? "#c9a84c" : "#c5b89a"}`,
          color: hover ? "#c9a84c" : "#c5b89a", flexShrink: 0,
          transition: "all .3s", transform: hover ? "rotate(-45deg)" : "none",
          background: hover ? "rgba(201,168,76,.08)" : "transparent",
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17L17 7M7 7h10v10"/></svg>
        </a>
      ) : <div style={{ width: 48, height: 48, opacity: .15 }}/>}
    </div>
  );
}

/* ─── JOURNEY ───────────────────────────────────────────────────────────────────── */
function Journey() {
  const hasExp = D.experience?.length > 0;
  const hasEdu = D.education?.length > 0;
  if (!hasExp && !hasEdu) return null;
  return (
    <section id="journey" style={{ background: "#1a1410", padding: "120px clamp(1.5rem,5vw,5rem)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <FadeUp>
          <p style={{ fontFamily: "'Satoshi',sans-serif", fontSize: ".72rem", fontWeight: 600, letterSpacing: ".2em", textTransform: "uppercase", color: "#c9a84c", marginBottom: "1.2rem" }}>Background</p>
          <h2 style={{ fontFamily: "'Clash Display',sans-serif", fontSize: "clamp(2.5rem,4.5vw,3.8rem)", fontWeight: 700, color: "#f7f3ed", lineHeight: .95, letterSpacing: "-.03em", marginBottom: "5rem" }}>My<br/><em style={{ fontStyle: "italic", color: "#c9a84c" }}>Journey</em></h2>
        </FadeUp>
        <div style={{ display: "grid", gridTemplateColumns: hasExp && hasEdu ? "1fr 1fr" : "1fr", gap: "5rem" }}>
          {hasExp && (
            <FadeUp>
              <p style={{ fontFamily: "'Satoshi',sans-serif", fontSize: ".7rem", fontWeight: 600, letterSpacing: ".18em", textTransform: "uppercase", color: "rgba(247,243,237,.25)", marginBottom: "2rem", paddingBottom: "1.2rem", borderBottom: "1px solid rgba(247,243,237,.08)" }}>Work Experience</p>
              {D.experience.map((e, i) => (
                <div key={i} style={{ padding: "1.6rem 0", borderBottom: i < D.experience.length - 1 ? "1px solid rgba(247,243,237,.07)" : "none", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem" }}>
                  <div>
                    <h4 style={{ fontFamily: "'Clash Display',sans-serif", fontSize: "1.15rem", fontWeight: 700, color: "#f7f3ed", letterSpacing: "-.01em", marginBottom: ".3rem" }}>{e.jobTitle}</h4>
                    <p style={{ fontFamily: "'Satoshi',sans-serif", fontSize: ".82rem", color: "rgba(247,243,237,.4)", margin: 0 }}>{e.company}</p>
                  </div>
                  <span style={{ fontFamily: "'Satoshi',sans-serif", fontSize: ".72rem", color: "#c9a84c", whiteSpace: "nowrap", flexShrink: 0, paddingTop: 3 }}>{fmt(e.startDate)} — {fmt(e.endDate)}</span>
                </div>
              ))}
            </FadeUp>
          )}
          {hasEdu && (
            <FadeUp delay={200}>
              <p style={{ fontFamily: "'Satoshi',sans-serif", fontSize: ".7rem", fontWeight: 600, letterSpacing: ".18em", textTransform: "uppercase", color: "rgba(247,243,237,.25)", marginBottom: "2rem", paddingBottom: "1.2rem", borderBottom: "1px solid rgba(247,243,237,.08)" }}>Education</p>
              {D.education.map((e, i) => (
                <div key={i} style={{ padding: "1.6rem", marginBottom: "2px", background: "rgba(247,243,237,.04)", borderLeft: "2px solid #c9a84c" }}>
                  <h4 style={{ fontFamily: "'Clash Display',sans-serif", fontSize: "1.1rem", fontWeight: 700, color: "#f7f3ed", letterSpacing: "-.01em", marginBottom: ".3rem" }}>{e.education}</h4>
                  <p style={{ fontFamily: "'Satoshi',sans-serif", fontSize: ".82rem", color: "rgba(247,243,237,.4)", marginBottom: ".8rem" }}>{e.institution}</p>
                  <div style={{ display: "flex", gap: "8px" }}>
                    {e.year && <span style={{ fontFamily: "'Satoshi',sans-serif", fontSize: ".72rem", fontWeight: 600, padding: "3px 12px", background: "rgba(201,168,76,.12)", color: "#c9a84c", border: "1px solid rgba(201,168,76,.2)", borderRadius: 100 }}>{e.year}</span>}
                    {e.percentage && <span style={{ fontFamily: "'Satoshi',sans-serif", fontSize: ".72rem", fontWeight: 600, padding: "3px 12px", background: "rgba(247,243,237,.06)", color: "rgba(247,243,237,.5)", border: "1px solid rgba(247,243,237,.1)", borderRadius: 100 }}>{e.percentage}</span>}
                  </div>
                </div>
              ))}
            </FadeUp>
          )}
        </div>
      </div>
    </section>
  );
}

/* ─── CONTACT ───────────────────────────────────────────────────────────────────── */
function Contact() {
  return (
    <section id="contact" style={{ background: "#f7f3ed", padding: "120px clamp(1.5rem,5vw,5rem)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6rem", alignItems: "start" }}>
          <FadeUp>
            <p style={{ fontFamily: "'Satoshi',sans-serif", fontSize: ".72rem", fontWeight: 600, letterSpacing: ".2em", textTransform: "uppercase", color: "#c9a84c", marginBottom: "1.2rem" }}>Get in touch</p>
            <h2 style={{ fontFamily: "'Clash Display',sans-serif", fontSize: "clamp(2.8rem,5.5vw,4.5rem)", fontWeight: 700, color: "#1a1410", lineHeight: .9, letterSpacing: "-.04em", marginBottom: "2rem" }}>Let's create<br/><em style={{ fontStyle: "italic", color: "#c9a84c" }}>something</em><br/>remarkable.</h2>
            <p style={{ fontFamily: "'Satoshi',sans-serif", fontSize: "1rem", color: "#9b8f7e", lineHeight: 1.8, marginBottom: "2.5rem", maxWidth: 400 }}>Open to new projects, roles, and conversations. I respond within 24 hours.</p>
            {D.lookingVacancy?.length > 0 && (
              <div>
                <p style={{ fontFamily: "'Satoshi',sans-serif", fontSize: ".7rem", fontWeight: 600, letterSpacing: ".14em", textTransform: "uppercase", color: "#c5b89a", marginBottom: ".7rem" }}>Open to</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {D.lookingVacancy.map((v, i) => (
                    <span key={i} style={{ padding: "6px 16px", border: "1.5px solid #ddd5c4", borderRadius: 100, fontFamily: "'Satoshi',sans-serif", fontSize: ".78rem", fontWeight: 500, color: "#7a6f62" }}>{v}</span>
                  ))}
                </div>
              </div>
            )}
          </FadeUp>

          <FadeUp delay={200}>
            <div style={{ display: "flex", flexDirection: "column", gap: "2rem", marginBottom: "3rem" }}>
              {[[D.email, `mailto:${D.email}`, "Email"], [D.phone, `tel:${D.phone}`, "Phone"]].filter(x => x[0]).map(([val, href, lbl]) => (
                <div key={lbl}>
                  <p style={{ fontFamily: "'Satoshi',sans-serif", fontSize: ".68rem", fontWeight: 600, letterSpacing: ".16em", textTransform: "uppercase", color: "#c5b89a", marginBottom: ".35rem" }}>{lbl}</p>
                  <a href={href} style={{ fontFamily: "'Clash Display',sans-serif", fontSize: "clamp(1.1rem,2.5vw,1.55rem)", fontWeight: 700, color: "#1a1410", letterSpacing: "-.02em", textDecoration: "none", transition: "color .2s" }}
                    onMouseEnter={e => e.target.style.color = "#c9a84c"}
                    onMouseLeave={e => e.target.style.color = "#1a1410"}
                  >{val}</a>
                </div>
              ))}
            </div>

            <div style={{ paddingTop: "2.5rem", borderTop: "1px solid #e0d8cc" }}>
              <p style={{ fontFamily: "'Satoshi',sans-serif", fontSize: ".68rem", fontWeight: 600, letterSpacing: ".16em", textTransform: "uppercase", color: "#c5b89a", marginBottom: "1rem" }}>Find me on</p>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {[soc.linkedin && ["LinkedIn", soc.linkedin], soc.github && ["GitHub", soc.github], soc.twitter && ["Twitter", soc.twitter], soc.website && ["Website", soc.website]].filter(Boolean).map(([lbl, url]) => (
                  <a key={lbl} href={url} target="_blank" rel="noreferrer" style={{
                    padding: "9px 20px", border: "1.5px solid #ddd5c4", borderRadius: 100,
                    fontFamily: "'Satoshi',sans-serif", fontSize: ".8rem", fontWeight: 600,
                    color: "#5c5248", textDecoration: "none", transition: "all .2s",
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "#c9a84c"; e.currentTarget.style.color = "#c9a84c"; e.currentTarget.style.background = "rgba(201,168,76,.06)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "#ddd5c4"; e.currentTarget.style.color = "#5c5248"; e.currentTarget.style.background = "transparent"; }}
                  >{lbl}</a>
                ))}
              </div>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

/* ─── FOOTER ─────────────────────────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer style={{ background: "#1a1410", padding: "2rem clamp(1.5rem,5vw,5rem)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: ".8rem" }}>
      <span style={{ fontFamily: "'Clash Display',sans-serif", fontSize: "1rem", fontWeight: 700, color: "rgba(247,243,237,.25)", letterSpacing: "-.01em" }}>{D.firstName} <span style={{ color: "#c9a84c" }}>{D.lastName}</span></span>
      <span style={{ fontFamily: "'Satoshi',sans-serif", fontSize: ".72rem", color: "rgba(247,243,237,.2)", letterSpacing: ".08em" }}>© {new Date().getFullYear()} · {D.place}</span>
    </footer>
  );
}

/* ─── ROOT ────────────────────────────────────────────────────────────────────────── */
export default function Profile7() {
  return (
    <>
      <link href="https://api.fontshare.com/v2/css?f[]=clash-display@700,600&f[]=satoshi@400,500,600,700&display=swap" rel="stylesheet"/>
      <style>{`
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        html { scroll-behavior:smooth; }
        body { background:#f7f3ed; color:#1a1410; -webkit-font-smoothing:antialiased; overflow-x:hidden; cursor:none; }
        @keyframes mq  { from{transform:translateX(0)} to{transform:translateX(-33.333%)} }
        @keyframes pulse { 0%,100%{box-shadow:0 0 0 3px rgba(34,197,94,.2)} 50%{box-shadow:0 0 0 6px rgba(34,197,94,.1)} }
        @media(max-width:860px) {
          .hero-photo-panel { min-height:55vw; }
          section > div { grid-template-columns:1fr !important; }
        }
        @media(max-width:720px) {
          .desk-nav { display:none !important; }
          .mob-nav-btn { display:flex !important; }
          .stats-grid { grid-template-columns:repeat(2,1fr) !important; }
        }
        @media(max-width:600px) {
          #hero { grid-template-columns:1fr !important; }
          .hero-photo-panel { order:-1; height:70vw; }
        }
      `}</style>
      <CursorGlow />
      <Nav />
      <Hero />
      <Stats />
      {D.skills?.length > 0 && <Marquee items={D.skills} />}
      <About />
      <Services />
      <Projects />
      <Journey />
      <Contact />
      <Footer />
    </>
  );
}