import { useState, useEffect, useRef } from "react";

/* ══════════════════════════════════════════════════════════════
   DEMO DATA — mirrors Mongoose companySchema
══════════════════════════════════════════════════════════════ */
const DEMO = {
  companyName: "Lumio Studio",
  email: "hello@lumiostudio.com",
  phone: "+1 (415) 901-2200",
  logo: "",
  coverPhoto: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=80",
  tagline: "We Design Futures",
  industry: "Creative Technology",
  companySize: "40–80",
  foundedYear: 2017,
  businessPark: "One Market Plaza",
  address: {
    building: "Spear Tower, Suite 2800",
    street: "1 Market Street",
    city: "San Francisco",
    state: "CA",
    pincode: "94105",
  },
  mapEmbedLink: "",
  about:
    "Lumio is a creative technology studio building digital products, brand identities, and interactive experiences for companies that refuse to be ordinary. We believe the best work happens when design and engineering are inseparable — a single discipline, not two.",
  members: [
    { name: "Isabelle Voss", role: "Founder & Creative Director", photo: "https://randomuser.me/api/portraits/women/44.jpg", bio: "Former creative director at Pentagram. Believes every pixel has a purpose.", linkedin: "#", twitter: "#", email: "isabelle@lumiostudio.com" },
    { name: "Kai Tanaka", role: "Chief Technology Officer", photo: "https://randomuser.me/api/portraits/men/32.jpg", bio: "Ex-Vercel engineer. Obsessed with performance and zero-downtime deploys.", linkedin: "#", email: "kai@lumiostudio.com" },
    { name: "Amara Osei", role: "Head of Strategy", photo: "https://randomuser.me/api/portraits/women/68.jpg", bio: "McKinsey alum turned startup operator. Turns chaos into roadmaps.", twitter: "#", email: "amara@lumiostudio.com" },
    { name: "Leo Marchetti", role: "Lead Product Designer", photo: "https://randomuser.me/api/portraits/men/75.jpg", bio: "RISD graduate. Lives in Figma. Hates lorem ipsum.", portfolio: "#", email: "leo@lumiostudio.com" },
  ],
  services: [
    { title: "Brand Identity", description: "Visual identity systems, logo design, typography, color systems, and brand guidelines that hold at any scale.", icon: "✦" },
    { title: "Product Design", description: "UX research, interaction design, design systems, and Figma-to-code handoffs done right.", icon: "◎" },
    { title: "Web Development", description: "React, Next.js, TypeScript. Fast, accessible, beautifully engineered frontends.", icon: "⟡" },
    { title: "Motion & 3D", description: "Animations, micro-interactions, 3D scenes, and immersive digital experiences.", icon: "◈" },
    { title: "AI Integration", description: "Custom LLM features, generative interfaces, and intelligent automation for modern products.", icon: "⊕" },
    { title: "Creative Direction", description: "Campaign strategy, art direction, and visual storytelling that makes people feel something.", icon: "◐" },
  ],
  gallery: [
    { imageUrl: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=900&q=80", caption: "Studio Space" },
    { imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=900&q=80", caption: "Team Workshop" },
    { imageUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=900&q=80", caption: "Design Sprint" },
    { imageUrl: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=900&q=80", caption: "Focus Mode" },
    { imageUrl: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=900&q=80", caption: "Launch Day" },
  ],
  clients: [
    { name: "Stripe", logo: "https://logo.clearbit.com/stripe.com", website: "#" },
    { name: "Notion", logo: "https://logo.clearbit.com/notion.so", website: "#" },
    { name: "Figma", logo: "https://logo.clearbit.com/figma.com", website: "#" },
    { name: "Linear", logo: "https://logo.clearbit.com/linear.app", website: "#" },
    { name: "Vercel", logo: "https://logo.clearbit.com/vercel.com", website: "#" },
    { name: "Airbnb", logo: "https://logo.clearbit.com/airbnb.com", website: "#" },
  ],
  website: "https://lumiostudio.com",
  socialMedia: {
    instagram: "#",
    twitter: "#",
    linkedin: "#",
  },
  jobs: [
    { title: "Senior Product Designer", type: "Full-time", location: "San Francisco / Remote", dept: "Design" },
    { title: "Frontend Engineer", type: "Full-time", location: "Remote", dept: "Engineering" },
    { title: "Brand Strategist", type: "Contract", location: "San Francisco", dept: "Strategy" },
  ],
};

/* ══════════════════════════════════════════════════════════════
   THEME — clean white / warm cream / deep ink
══════════════════════════════════════════════════════════════ */
const C = {
  white:   "#FFFFFF",
  paper:   "#FAFAF7",
  warm:    "#F4F0E8",
  ink:     "#141414",
  inkSoft: "#1E1E1E",
  mid:     "#787878",
  light:   "#C0BDB5",
  rule:    "#E8E4DC",
  accent:  "#E8562A",          /* terracotta — the one pop of colour */
  accentBg:"rgba(232,86,42,.07)",
};

/* ══════════════════════════════════════════════════════════════
   GLOBAL CSS
══════════════════════════════════════════════════════════════ */
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,100;0,9..144,300;0,9..144,400;1,9..144,100;1,9..144,300;1,9..144,400&family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html{scroll-behavior:smooth;font-size:16px;}
body{background:${C.paper};}
::-webkit-scrollbar{width:3px;}
::-webkit-scrollbar-thumb{background:${C.accent};}
::selection{background:${C.accent};color:#fff;}

@keyframes up   {from{opacity:0;transform:translateY(36px)}to{opacity:1;transform:none}}
@keyframes left {from{opacity:0;transform:translateX(-28px)}to{opacity:1;transform:none}}
@keyframes fade {from{opacity:0}to{opacity:1}}
@keyframes ticker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
@keyframes marqueeY{0%{transform:translateY(0)}100%{transform:translateY(-50%)}}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@keyframes scaleUp{from{transform:scale(.92);opacity:0}to{transform:scale(1);opacity:1}}

.reveal{opacity:0;transform:translateY(28px);transition:opacity .8s cubic-bezier(.22,1,.36,1),transform .8s cubic-bezier(.22,1,.36,1);}
.reveal.vis{opacity:1;transform:none;}
.reveal-l{opacity:0;transform:translateX(-28px);transition:opacity .8s cubic-bezier(.22,1,.36,1),transform .8s cubic-bezier(.22,1,.36,1);}
.reveal-l.vis{opacity:1;transform:none;}

.nav-a{transition:color .2s;} .nav-a:hover{color:${C.accent} !important;}

.svc-row{transition:background .25s,padding-left .25s;cursor:default;}
.svc-row:hover{background:${C.accentBg};padding-left:32px !important;}
.svc-row:hover .svc-icon{color:${C.accent} !important;transform:scale(1.2);}
.svc-icon{transition:transform .3s,color .3s;}

.member-wrap:hover .member-photo{transform:scale(1.05);}
.member-photo{transition:transform .5s ease;}
.member-wrap:hover .member-name{color:${C.accent} !important;}
.member-name{transition:color .25s;}

.job-item{transition:background .2s,border-color .2s;}
.job-item:hover{background:${C.accentBg} !important;border-left-color:${C.accent} !important;}

.gal-img{transition:transform .6s ease;}
.gal-item:hover .gal-img{transform:scale(1.06);}

.btn-filled{transition:all .2s;}
.btn-filled:hover{background:${C.inkSoft} !important;transform:translateY(-2px);}
.btn-outline{transition:all .2s;}
.btn-outline:hover{background:${C.ink} !important;color:#fff !important;border-color:${C.ink} !important;}

.social-pill{transition:all .2s;}
.social-pill:hover{background:${C.accent} !important;color:#fff !important;border-color:${C.accent} !important;}

.client-img{filter:grayscale(100%);opacity:.35;transition:opacity .3s,filter .3s;}
.client-img:hover{opacity:.85;filter:grayscale(0%);}
`;

/* ══════════════════════════════════════════════════════════════
   HOOKS
══════════════════════════════════════════════════════════════ */
function useReveal(cls = "reveal") {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    el.className += ` ${cls}`;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.classList.add("vis"); obs.disconnect(); }
    }, { threshold: 0.12 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

/* Wrapper that auto-applies reveal */
function R({ children, d = 0, dir = "up", tag = "div", style: s = {} }) {
  const cls = dir === "left" ? "reveal-l" : "reveal";
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    el.style.transitionDelay = `${d}s`;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.classList.add("vis"); obs.disconnect(); }
    }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  const Tag = tag;
  return <Tag ref={ref} className={cls} style={s}>{children}</Tag>;
}

/* ══════════════════════════════════════════════════════════════
   ATOMS
══════════════════════════════════════════════════════════════ */
const mono = { fontFamily: "'JetBrains Mono',monospace" };
const serif = { fontFamily: "'Fraunces',serif" };
const sans = { fontFamily: "'Outfit',sans-serif" };

function Eyebrow({ children, dark }) {
  return (
    <span style={{
      ...mono, fontSize: 10, letterSpacing: "0.22em",
      textTransform: "uppercase",
      color: dark ? "rgba(255,255,255,.45)" : C.mid,
      display: "inline-block", marginBottom: 14,
    }}>
      {children}
    </span>
  );
}

function DisplayTitle({ children, light, size }) {
  return (
    <h2 style={{
      ...serif, fontWeight: 300,
      fontSize: size || "clamp(44px,6.5vw,88px)",
      lineHeight: 1.0, letterSpacing: "-0.03em",
      color: light ? C.white : C.ink,
    }}>
      {children}
    </h2>
  );
}

/* ══════════════════════════════════════════════════════════════
   NAV
══════════════════════════════════════════════════════════════ */
function Nav({ c }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 900,
      height: 66,
      display: "flex", alignItems: "center", padding: "0 48px",
      background: scrolled ? "rgba(250,250,247,.94)" : "transparent",
      backdropFilter: scrolled ? "blur(18px)" : "none",
      borderBottom: scrolled ? `1px solid ${C.rule}` : "none",
      transition: "all .4s ease",
    }}>
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, flex: "0 0 auto" }}>
        <div style={{
          width: 34, height: 34,
          background: C.ink,
          display: "flex", alignItems: "center", justifyContent: "center",
          position: "relative",
        }}>
          <span style={{ ...serif, fontSize: 15, color: C.paper, fontWeight: 300, fontStyle: "italic" }}>
            {c.companyName?.[0] ?? "L"}
          </span>
          {/* accent dot */}
          <div style={{ position: "absolute", top: -3, right: -3, width: 7, height: 7, background: C.accent, borderRadius: "50%" }} />
        </div>
        <span style={{ ...sans, fontWeight: 700, fontSize: 17, color: C.ink, letterSpacing: "-0.02em" }}>
          {c.companyName}
        </span>
      </div>

      {/* Links */}
      <div style={{ flex: 1, display: "flex", justifyContent: "center", gap: 36 }}>
        {["About", "Services", "Work", "Team", "Careers", "Contact"].map(l => (
          <a key={l} href={`#${l.toLowerCase()}`} className="nav-a" style={{
            ...sans, fontSize: 13, fontWeight: 400,
            color: C.mid, textDecoration: "none",
          }}>
            {l}
          </a>
        ))}
      </div>

      {/* CTA */}
      <a href="#contact" className="btn-filled" style={{
        padding: "9px 22px",
        background: C.ink, color: C.paper,
        ...sans, fontSize: 12, fontWeight: 600,
        textDecoration: "none", letterSpacing: "0.04em",
        textTransform: "uppercase", flexShrink: 0,
      }}>
        Start a Project
      </a>
    </nav>
  );
}

/* ══════════════════════════════════════════════════════════════
   HERO — full-screen split
══════════════════════════════════════════════════════════════ */
function Hero({ c }) {
  const [on, setOn] = useState(false);
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setOn(true), 80);
    const onMouse = (e) => {
      setMouseX((e.clientX / window.innerWidth - 0.5) * 18);
      setMouseY((e.clientY / window.innerHeight - 0.5) * 12);
    };
    window.addEventListener("mousemove", onMouse);
    return () => { clearTimeout(t); window.removeEventListener("mousemove", onMouse); };
  }, []);

  const words = (c.tagline || "We Design Futures").split(" ");

  return (
    <section id="home" style={{
      height: "100vh", minHeight: 680,
      display: "grid", gridTemplateColumns: "1fr 1fr",
      overflow: "hidden", position: "relative",
      background: C.paper,
    }}>
      {/* LEFT: giant type */}
      <div style={{
        display: "flex", flexDirection: "column",
        justifyContent: "flex-end",
        padding: "0 52px 64px",
        borderRight: `1px solid ${C.rule}`,
        position: "relative", overflow: "hidden",
      }}>
        {/* Background huge letter */}
        <div style={{
          position: "absolute", bottom: -60, left: -20,
          ...serif, fontSize: "42vw", fontWeight: 300, fontStyle: "italic",
          color: "rgba(20,20,20,.04)",
          lineHeight: 1, pointerEvents: "none",
          userSelect: "none",
          transform: on ? "none" : "translateY(20px)",
          transition: "transform 1.4s ease",
        }}>
          {c.companyName?.[0]}
        </div>

        {/* Industry badge */}
        <div style={{
          position: "absolute", top: 88, left: 52,
          display: "flex", alignItems: "center", gap: 8,
          opacity: on ? 1 : 0, transition: "opacity .7s .4s",
        }}>
          <div style={{ width: 6, height: 6, background: C.accent, borderRadius: "50%" }} />
          <Eyebrow>{c.industry}</Eyebrow>
        </div>

        {/* Main words */}
        <div style={{ position: "relative", zIndex: 2 }}>
          {words.map((w, i) => (
            <div key={i} style={{
              overflow: "hidden", lineHeight: 1,
            }}>
              <div style={{
                ...serif,
                fontWeight: i % 2 === 1 ? 100 : 300,
                fontStyle: i % 2 === 1 ? "italic" : "normal",
                fontSize: "clamp(58px,9vw,118px)",
                color: C.ink,
                letterSpacing: "-0.03em",
                lineHeight: 0.97,
                display: "block",
                opacity: on ? 1 : 0,
                transform: on ? "none" : "translateY(100%)",
                transition: `opacity .9s ${.15 + i * .1}s, transform .9s ${.15 + i * .1}s cubic-bezier(.22,1,.36,1)`,
              }}>
                {w}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom row */}
        <div style={{
          display: "flex", alignItems: "center", gap: 20,
          marginTop: 40, position: "relative", zIndex: 2,
          opacity: on ? 1 : 0, transition: "opacity .9s .7s",
        }}>
          <a href="#services" className="btn-filled" style={{
            padding: "13px 32px",
            background: C.ink, color: C.paper,
            ...sans, fontSize: 12, fontWeight: 600,
            textDecoration: "none", letterSpacing: "0.06em", textTransform: "uppercase",
          }}>
            Explore →
          </a>
          <span style={{ ...mono, fontSize: 10, color: C.light, letterSpacing: "0.14em" }}>
            Est. {c.foundedYear}
          </span>
        </div>
      </div>

      {/* RIGHT: photo + about snippet */}
      <div style={{
        display: "flex", flexDirection: "column",
        overflow: "hidden",
      }}>
        {/* Photo — top 65% */}
        <div style={{
          flex: "0 0 65%", overflow: "hidden", position: "relative",
        }}>
          {c.coverPhoto && (
            <img src={c.coverPhoto} alt="" style={{
              width: "100%", height: "100%", objectFit: "cover",
              filter: "saturate(.88) brightness(.92)",
              transform: `translate(${mouseX * 0.4}px, ${mouseY * 0.3}px) scale(1.08)`,
              transition: "transform .9s ease",
            }} />
          )}
          {/* Number badge */}
          <div style={{
            position: "absolute", top: 24, right: 24,
            background: C.paper,
            padding: "10px 16px",
            opacity: on ? 1 : 0, transition: "opacity 1s .9s",
          }}>
            <div style={{ ...mono, fontSize: 9, color: C.light, letterSpacing: "0.18em", marginBottom: 3 }}>TEAM SIZE</div>
            <div style={{ ...serif, fontSize: 22, fontWeight: 300, color: C.ink }}>{c.companySize}</div>
          </div>
        </div>

        {/* About snippet — bottom 35% */}
        <div style={{
          flex: "0 0 35%",
          padding: "32px 40px",
          borderTop: `1px solid ${C.rule}`,
          display: "flex", flexDirection: "column",
          justifyContent: "space-between",
        }}>
          <p style={{
            ...sans, fontSize: 14, lineHeight: 1.85,
            color: C.mid, fontWeight: 300,
            opacity: on ? 1 : 0, transition: "opacity .9s .85s",
          }}>
            {c.about?.slice(0, 160)}…
          </p>
          {/* Client count + scroll */}
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            opacity: on ? 1 : 0, transition: "opacity .9s 1s",
          }}>
            <div>
              <div style={{ ...serif, fontWeight: 300, fontSize: 28, color: C.ink }}>{c.clients?.length ?? 0}+</div>
              <div style={{ ...mono, fontSize: 9, color: C.light, letterSpacing: "0.14em", marginTop: 3 }}>HAPPY CLIENTS</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, ...mono, fontSize: 9, color: C.light, letterSpacing: "0.14em" }}>
              <div style={{
                width: 1, height: 36, background: C.rule,
                position: "relative",
              }}>
                <div style={{
                  position: "absolute", top: 0, left: 0, width: "100%",
                  height: "50%", background: C.accent,
                  animation: "marqueeY 1.5s ease-in-out infinite alternate",
                }} />
              </div>
              SCROLL
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════
   CLIENTS STRIP
══════════════════════════════════════════════════════════════ */
function Clients({ clients }) {
  if (!clients?.length) return null;
  const rep = [...clients, ...clients, ...clients, ...clients];
  return (
    <div style={{
      background: C.warm,
      borderTop: `1px solid ${C.rule}`, borderBottom: `1px solid ${C.rule}`,
      padding: "20px 0", overflow: "hidden",
    }}>
      <div style={{ display: "flex", gap: 64, animation: "ticker 20s linear infinite", whiteSpace: "nowrap" }}>
        {rep.map((cl, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
            {cl.logo
              ? <img src={cl.logo} alt={cl.name} className="client-img" style={{ height: 20, objectFit: "contain" }} />
              : <span style={{ ...sans, fontWeight: 600, fontSize: 13, color: C.light }}>{cl.name}</span>
            }
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   ABOUT — full-screen
══════════════════════════════════════════════════════════════ */
function About({ c }) {
  return (
    <section id="about" style={{
      minHeight: "100vh",
      background: C.ink,
      display: "grid", gridTemplateColumns: "1fr 1fr",
      overflow: "hidden",
    }}>
      {/* LEFT: large text */}
      <div style={{
        padding: "120px 64px",
        display: "flex", flexDirection: "column",
        justifyContent: "center",
        borderRight: "1px solid rgba(255,255,255,.07)",
      }}>
        <R dir="left">
          <Eyebrow dark>About Us</Eyebrow>
        </R>
        <R dir="left" d={.1}>
          <h2 style={{
            ...serif, fontWeight: 300, fontStyle: "italic",
            fontSize: "clamp(40px,5.5vw,76px)",
            color: C.paper, lineHeight: 1.08, letterSpacing: "-0.03em",
            marginBottom: 32,
          }}>
            {c.about?.split(" ").slice(0, 6).join(" ")}.
          </h2>
        </R>
        <R dir="left" d={.2}>
          <p style={{ ...sans, fontSize: 15, lineHeight: 1.9, color: "rgba(250,250,247,.55)", fontWeight: 300, maxWidth: 420 }}>
            {c.about}
          </p>
        </R>
      </div>

      {/* RIGHT: facts grid */}
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr",
        gridTemplateRows: "1fr 1fr",
      }}>
        {[
          { val: c.foundedYear, lbl: "Year Founded" },
          { val: c.companySize, lbl: "Team Members" },
          { val: `${c.clients?.length ?? 0}+`, lbl: "Clients Served" },
          { val: c.industry, lbl: "Industry" },
        ].map((s, i) => (
          <R key={i} d={i * 0.08}>
            <div style={{
              padding: "56px 48px",
              borderRight: i % 2 === 0 ? "1px solid rgba(255,255,255,.07)" : "none",
              borderBottom: i < 2 ? "1px solid rgba(255,255,255,.07)" : "none",
              display: "flex", flexDirection: "column",
              justifyContent: "flex-end",
            }}>
              <div style={{ ...serif, fontWeight: 100, fontSize: "clamp(36px,4vw,58px)", color: C.paper, lineHeight: 1 }}>{s.val}</div>
              <div style={{ ...mono, fontSize: 9, color: "rgba(250,250,247,.3)", letterSpacing: "0.18em", textTransform: "uppercase", marginTop: 10 }}>{s.lbl}</div>
            </div>
          </R>
        ))}
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════
   SERVICES — full-screen list
══════════════════════════════════════════════════════════════ */
function Services({ services }) {
  if (!services?.length) return null;
  return (
    <section id="services" style={{
      minHeight: "100vh",
      background: C.paper,
      padding: "120px 0",
      display: "flex", flexDirection: "column",
    }}>
      {/* Header */}
      <div style={{ padding: "0 52px", marginBottom: 72, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <R dir="left">
          <div>
            <Eyebrow>What We Do</Eyebrow>
            <DisplayTitle>Services</DisplayTitle>
          </div>
        </R>
        <R d={.1}>
          <p style={{ ...sans, fontSize: 14, color: C.mid, maxWidth: 300, lineHeight: 1.8, fontWeight: 300, textAlign: "right" }}>
            No cookie-cutter packages. Every engagement is shaped around your specific ambitions.
          </p>
        </R>
      </div>

      {/* Service rows */}
      <div style={{ flex: 1 }}>
        {services.map((s, i) => (
          <R key={i} d={i * 0.05}>
            <div className="svc-row" style={{
              display: "grid",
              gridTemplateColumns: "72px 1fr 2fr 56px",
              alignItems: "center", gap: 32,
              padding: "26px 52px",
              borderTop: `1px solid ${C.rule}`,
              paddingLeft: "52px",
            }}>
              <span style={{ ...mono, fontSize: 11, color: C.light, letterSpacing: "0.08em" }}>0{i + 1}</span>
              <h3 style={{ ...serif, fontWeight: 300, fontSize: 22, color: C.ink, letterSpacing: "-0.01em" }}>{s.title}</h3>
              <p style={{ ...sans, fontSize: 13, color: C.mid, lineHeight: 1.75, fontWeight: 300 }}>{s.description}</p>
              <span className="svc-icon" style={{ fontSize: 20, color: C.light, justifySelf: "end" }}>{s.icon}</span>
            </div>
            {i === services.length - 1 && <div style={{ height: 1, background: C.rule }} />}
          </R>
        ))}
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════
   GALLERY — full-screen masonry feel
══════════════════════════════════════════════════════════════ */
function Gallery({ gallery }) {
  if (!gallery?.length) return null;
  return (
    <section id="work" style={{ minHeight: "100vh", background: C.warm, overflow: "hidden" }}>
      {/* Header */}
      <div style={{ padding: "100px 52px 56px" }}>
        <R dir="left">
          <Eyebrow>Our Studio</Eyebrow>
        </R>
        <R d={.1}>
          <DisplayTitle>
            Behind the<br /><em>scenes.</em>
          </DisplayTitle>
        </R>
      </div>

      {/* Grid: 3 cols, different heights */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "2fr 1fr 1fr",
        gridTemplateRows: "320px 320px",
        gap: 3,
        padding: "0 3px 3px",
      }}>
        {gallery.slice(0, 5).map((g, i) => {
          const span = i === 0 ? { gridRow: "span 2" } : {};
          return (
            <R key={i} d={i * 0.06} style={{ overflow: "hidden", position: "relative", ...span }}>
              <div className="gal-item" style={{ width: "100%", height: "100%", overflow: "hidden", position: "relative" }}>
                <img className="gal-img" src={g.imageUrl} alt={g.caption} style={{
                  width: "100%", height: "100%", objectFit: "cover",
                  filter: "brightness(.88) saturate(.9)",
                }} />
                {/* Caption */}
                <div style={{
                  position: "absolute", bottom: 0, left: 0, right: 0,
                  padding: "16px 20px",
                  background: "linear-gradient(transparent, rgba(20,20,20,.7))",
                }}>
                  <span style={{ ...mono, fontSize: 9, color: "rgba(255,255,255,.6)", letterSpacing: "0.14em", textTransform: "uppercase" }}>
                    {g.caption}
                  </span>
                </div>
              </div>
            </R>
          );
        })}
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════
   TEAM — full-screen grid
══════════════════════════════════════════════════════════════ */
function Team({ members }) {
  if (!members?.length) return null;
  const [hov, setHov] = useState(null);

  return (
    <section id="team" style={{
      minHeight: "100vh",
      background: C.white,
      padding: "120px 52px",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 80, flexWrap: "wrap", gap: 24 }}>
        <R dir="left">
          <div>
            <Eyebrow>The People</Eyebrow>
            <DisplayTitle>Meet the<br /><em>team.</em></DisplayTitle>
          </div>
        </R>
        <R d={.1}>
          <p style={{ ...sans, fontSize: 14, color: C.mid, maxWidth: 320, lineHeight: 1.8, fontWeight: 300 }}>
            A small, radically skilled team that moves fast and cares deeply about the craft.
          </p>
        </R>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 28 }}>
        {members.map((m, i) => (
          <R key={i} d={i * 0.07}>
            <div
              className="member-wrap"
              onMouseEnter={() => setHov(i)}
              onMouseLeave={() => setHov(null)}
              style={{ cursor: "default" }}
            >
              {/* Photo */}
              <div style={{ position: "relative", overflow: "hidden", marginBottom: 18, aspectRatio: "3/4" }}>
                <img
                  className="member-photo"
                  src={m.photo}
                  alt={m.name}
                  style={{
                    width: "100%", height: "100%", objectFit: "cover",
                    display: "block",
                    filter: hov === i ? "grayscale(0%) brightness(1)" : "grayscale(35%) brightness(.9)",
                  }}
                />
                {/* Accent bar */}
                <div style={{
                  position: "absolute", bottom: 0, left: 0,
                  width: hov === i ? "100%" : "0%",
                  height: 3, background: C.accent,
                  transition: "width .4s ease",
                }} />

                {/* Bio overlay */}
                <div style={{
                  position: "absolute", inset: 0,
                  background: "rgba(20,20,20,.82)",
                  opacity: hov === i ? 1 : 0,
                  transition: "opacity .35s ease",
                  display: "flex", flexDirection: "column",
                  justifyContent: "flex-end",
                  padding: "20px",
                }}>
                  <p style={{ ...sans, fontSize: 12, color: "rgba(250,250,247,.8)", lineHeight: 1.7, fontWeight: 300, marginBottom: 14 }}>
                    {m.bio}
                  </p>
                  <div style={{ display: "flex", gap: 8 }}>
                    {m.linkedin && <a href={m.linkedin} style={{ padding: "5px 10px", border: "1px solid rgba(255,255,255,.2)", ...mono, fontSize: 9, color: "rgba(255,255,255,.6)", textDecoration: "none", letterSpacing: "0.1em" }}>LI</a>}
                    {m.twitter && <a href={m.twitter} style={{ padding: "5px 10px", border: "1px solid rgba(255,255,255,.2)", ...mono, fontSize: 9, color: "rgba(255,255,255,.6)", textDecoration: "none", letterSpacing: "0.1em" }}>TW</a>}
                    {m.email && <a href={`mailto:${m.email}`} style={{ padding: "5px 10px", border: "1px solid rgba(255,255,255,.2)", ...mono, fontSize: 9, color: "rgba(255,255,255,.6)", textDecoration: "none", letterSpacing: "0.1em" }}>✉</a>}
                  </div>
                </div>
              </div>

              <h3 className="member-name" style={{ ...sans, fontWeight: 600, fontSize: 15, color: C.ink, marginBottom: 4, letterSpacing: "-0.01em" }}>{m.name}</h3>
              <p style={{ ...mono, fontSize: 9, color: C.mid, letterSpacing: "0.1em", textTransform: "uppercase" }}>{m.role}</p>
            </div>
          </R>
        ))}
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════
   CAREERS
══════════════════════════════════════════════════════════════ */
function Careers({ jobs }) {
  if (!jobs?.length) return null;
  return (
    <section id="careers" style={{
      minHeight: "60vh",
      background: C.warm,
      padding: "120px 52px",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 64, flexWrap: "wrap", gap: 20 }}>
        <R dir="left">
          <div>
            <Eyebrow>Join Us</Eyebrow>
            <DisplayTitle size="clamp(40px,5.5vw,72px)">Open roles.</DisplayTitle>
          </div>
        </R>
        <R d={.1}>
          <p style={{ ...sans, fontSize: 14, color: C.mid, maxWidth: 280, lineHeight: 1.8, fontWeight: 300 }}>
            We hire curious people who ship great work without ego.
          </p>
        </R>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {jobs.map((j, i) => (
          <R key={i} d={i * 0.07}>
            <div className="job-item" style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "24px 32px", gap: 24, flexWrap: "wrap",
              background: C.white,
              borderLeft: `3px solid ${C.rule}`,
            }}>
              <div>
                <h3 style={{ ...serif, fontWeight: 300, fontSize: 21, color: C.ink, marginBottom: 6 }}>{j.title}</h3>
                <div style={{ display: "flex", gap: 16 }}>
                  <span style={{ ...mono, fontSize: 10, color: C.accent, letterSpacing: "0.1em" }}>{j.dept?.toUpperCase()}</span>
                  <span style={{ ...mono, fontSize: 10, color: C.light, letterSpacing: "0.08em" }}>{j.location}</span>
                </div>
              </div>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <span style={{ padding: "5px 14px", border: `1px solid ${C.rule}`, ...mono, fontSize: 9, color: C.mid, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  {j.type}
                </span>
                <a href={`mailto:${DEMO.email}?subject=Application: ${j.title}`} className="btn-outline" style={{
                  padding: "10px 22px",
                  border: `1.5px solid ${C.ink}`,
                  ...sans, fontSize: 12, fontWeight: 600,
                  color: C.ink, textDecoration: "none",
                  letterSpacing: "0.04em",
                }}>
                  Apply →
                </a>
              </div>
            </div>
          </R>
        ))}
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════
   CONTACT — full-screen split
══════════════════════════════════════════════════════════════ */
function Contact({ c }) {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const addr = [c.address?.building, c.address?.street, c.address?.city, c.address?.state].filter(Boolean).join(", ");

  return (
    <section id="contact" style={{
      minHeight: "100vh",
      background: C.ink,
      display: "grid", gridTemplateColumns: "1fr 1fr",
      overflow: "hidden",
    }}>
      {/* LEFT: info */}
      <div style={{
        padding: "120px 64px",
        borderRight: "1px solid rgba(255,255,255,.07)",
        display: "flex", flexDirection: "column", justifyContent: "space-between",
      }}>
        <div>
          <R dir="left"><Eyebrow dark>Get in Touch</Eyebrow></R>
          <R dir="left" d={.1}>
            <h2 style={{
              ...serif, fontWeight: 300, fontStyle: "italic",
              fontSize: "clamp(44px,6vw,84px)",
              color: C.paper, lineHeight: 1.0, letterSpacing: "-0.03em",
              marginBottom: 40,
            }}>
              Let's make<br />something<br />great.
            </h2>
          </R>

          <R dir="left" d={.2}>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {[
                { l: "Email", v: c.email, h: `mailto:${c.email}` },
                { l: "Phone", v: c.phone, h: `tel:${c.phone}` },
                { l: "Address", v: addr, h: null },
                { l: "Website", v: c.website, h: c.website },
              ].filter(r => r.v).map((r, i) => (
                <div key={i} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 20,
                  padding: "18px 0",
                  borderBottom: "1px solid rgba(255,255,255,.07)",
                }}>
                  <span style={{ ...mono, fontSize: 9, color: "rgba(255,255,255,.25)", letterSpacing: "0.16em", textTransform: "uppercase", flexShrink: 0, paddingTop: 2 }}>{r.l}</span>
                  {r.h
                    ? <a href={r.h} style={{ ...sans, fontSize: 13, color: "rgba(250,250,247,.65)", textDecoration: "none", textAlign: "right" }}>{r.v}</a>
                    : <span style={{ ...sans, fontSize: 13, color: "rgba(250,250,247,.65)", textAlign: "right" }}>{r.v}</span>
                  }
                </div>
              ))}
            </div>
          </R>
        </div>

        {/* Socials */}
        <R d={.3}>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {Object.entries(c.socialMedia || {}).filter(([, v]) => v).map(([k, v]) => (
              <a key={k} href={v} className="social-pill" style={{
                padding: "8px 18px",
                border: "1px solid rgba(255,255,255,.12)",
                ...mono, fontSize: 9, color: "rgba(255,255,255,.4)",
                textDecoration: "none", letterSpacing: "0.12em", textTransform: "uppercase",
              }}>
                {k}
              </a>
            ))}
          </div>
        </R>
      </div>

      {/* RIGHT: form */}
      <div style={{ padding: "120px 64px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <R d={.15}>
          {sent ? (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <div style={{
                width: 72, height: 72,
                border: `1px solid ${C.accent}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 28px",
                ...serif, fontSize: 30, color: C.accent, fontStyle: "italic",
              }}>
                ✓
              </div>
              <h3 style={{ ...serif, fontWeight: 300, fontStyle: "italic", fontSize: 32, color: C.paper, marginBottom: 12 }}>Message received.</h3>
              <p style={{ ...sans, fontSize: 14, color: "rgba(255,255,255,.4)" }}>We reply within one business day.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <h3 style={{ ...serif, fontWeight: 300, fontSize: 28, color: C.paper, fontStyle: "italic", marginBottom: 8 }}>
                Start a conversation.
              </h3>

              {[
                { k: "name", lbl: "Your Name", ph: "Jane Smith", t: "text" },
                { k: "email", lbl: "Email Address", ph: "jane@company.com", t: "email" },
              ].map(f => (
                <div key={f.k}>
                  <label style={{ display: "block", ...mono, fontSize: 9, color: "rgba(255,255,255,.3)", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 10 }}>{f.lbl}</label>
                  <input
                    type={f.t} placeholder={f.ph}
                    value={form[f.k]}
                    onChange={e => setForm(p => ({ ...p, [f.k]: e.target.value }))}
                    style={{
                      width: "100%", padding: "14px 18px",
                      background: "rgba(255,255,255,.04)",
                      border: "1px solid rgba(255,255,255,.1)",
                      ...sans, fontSize: 14, color: C.paper, outline: "none",
                      transition: "border-color .2s",
                    }}
                    onFocus={e => e.target.style.borderColor = C.accent}
                    onBlur={e => e.target.style.borderColor = "rgba(255,255,255,.1)"}
                  />
                </div>
              ))}

              <div>
                <label style={{ display: "block", ...mono, fontSize: 9, color: "rgba(255,255,255,.3)", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 10 }}>Message</label>
                <textarea
                  placeholder="Tell us about your project…" rows={5}
                  value={form.message}
                  onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                  style={{
                    width: "100%", padding: "14px 18px",
                    background: "rgba(255,255,255,.04)",
                    border: "1px solid rgba(255,255,255,.1)",
                    ...sans, fontSize: 14, color: C.paper, outline: "none",
                    resize: "vertical",
                    transition: "border-color .2s",
                  }}
                  onFocus={e => e.target.style.borderColor = C.accent}
                  onBlur={e => e.target.style.borderColor = "rgba(255,255,255,.1)"}
                />
              </div>

              <button
                onClick={() => { if (form.name && form.email) setSent(true); }}
                className="btn-filled"
                style={{
                  alignSelf: "flex-start",
                  padding: "14px 36px",
                  background: C.accent, color: C.white,
                  border: "none", cursor: "pointer",
                  ...sans, fontSize: 12, fontWeight: 600,
                  letterSpacing: "0.06em", textTransform: "uppercase",
                }}
              >
                Send Message →
              </button>
            </div>
          )}
        </R>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════
   FOOTER
══════════════════════════════════════════════════════════════ */
function Footer({ c }) {
  return (
    <footer style={{
      background: C.ink,
      borderTop: "1px solid rgba(255,255,255,.07)",
      padding: "32px 52px",
      display: "flex", justifyContent: "space-between",
      alignItems: "center", flexWrap: "wrap", gap: 16,
    }}>
      <span style={{ ...sans, fontWeight: 700, fontSize: 15, color: C.paper, letterSpacing: "-0.01em" }}>{c.companyName}</span>
      <div style={{ display: "flex", gap: 28 }}>
        {["About", "Services", "Work", "Team", "Careers", "Contact"].map(l => (
          <a key={l} href={`#${l.toLowerCase()}`} style={{ ...sans, fontSize: 12, color: "rgba(255,255,255,.25)", textDecoration: "none" }}>{l}</a>
        ))}
      </div>
      <span style={{ ...mono, fontSize: 9, color: "rgba(255,255,255,.2)", letterSpacing: "0.12em" }}>
        © {new Date().getFullYear()} {c.companyName}
      </span>
    </footer>
  );
}

/* ══════════════════════════════════════════════════════════════
   ROOT EXPORT
══════════════════════════════════════════════════════════════ */
export default function CompanyWebsite3({ data = DEMO }) {
  const c = data;
  return (
    <div style={{ background: C.paper, minHeight: "100vh", overflowX: "hidden" }}>
      <style>{STYLES}</style>
      <Nav c={c} />
      <Hero c={c} />
      <Clients clients={c.clients} />
      <About c={c} />
      <Services services={c.services} />
      <Gallery gallery={c.gallery} />
      <Team members={c.members} />
      <Careers jobs={c.jobs} />
      <Contact c={c} />
      <Footer c={c} />
    </div>
  );
}