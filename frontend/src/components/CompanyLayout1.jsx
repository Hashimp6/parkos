import { useState, useEffect, useRef } from "react";

/* ══════════════════════════════════════════════════════════════
   DEMO DATA  — mirrors your Mongoose companySchema exactly
══════════════════════════════════════════════════════════════ */
const DEMO = {
  companyName: "Aether Studio",
  email: "hello@aetherstudio.io",
  phone: "+1 (415) 901-2200",
  logo: "",
  coverPhoto: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=80",
  tagline: "Where Vision Becomes Reality",
  industry: "Creative Technology",
  companySize: "50–120",
  foundedYear: 2016,
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
    "Aether Studio is a creative technology company that sits at the intersection of design, engineering, and strategy. We build digital products that shape culture — from consumer apps used by millions to enterprise platforms that redefine how industries operate. Every pixel, every interaction, every line of code is crafted with the same obsessive care.",
  members: [
    { name: "Camille Fontaine", role: "Founder & CEO", photo: "https://randomuser.me/api/portraits/women/44.jpg", bio: "Previously led product at Figma. Angel investor. Obsessed with tools that make people more creative.", email: "camille@aetherstudio.io", linkedin: "#", twitter: "#" },
    { name: "Rajan Mehta", role: "Chief Technology Officer", photo: "https://randomuser.me/api/portraits/men/32.jpg", bio: "Ex-Google Brain. Shipped ML systems at scale. Believes infrastructure is the product.", email: "rajan@aetherstudio.io", linkedin: "#" },
    { name: "Solène Duval", role: "Head of Design", photo: "https://randomuser.me/api/portraits/women/68.jpg", bio: "RISD graduate. Former creative director at Pentagram. Thinks in systems.", email: "solene@aetherstudio.io", portfolio: "#" },
    { name: "Marcus Webb", role: "VP of Engineering", photo: "https://randomuser.me/api/portraits/men/75.jpg", bio: "Built infra at Stripe and Linear. Open-source contributor. Runs on espresso.", email: "marcus@aetherstudio.io", linkedin: "#" },
  ],
  services: [
    { title: "Product Design", description: "End-to-end UX/UI design, design systems, interaction design, and Figma-to-code handoffs that actually work.", icon: "◈" },
    { title: "Web Engineering", description: "React, Next.js, TypeScript, edge-first architecture. We build fast, accessible, beautiful front-ends.", icon: "◎" },
    { title: "Brand Identity", description: "Visual identity, motion graphics, typography systems, and brand guidelines that hold up at any scale.", icon: "◉" },
    { title: "AI Integration", description: "LLM-powered features, custom fine-tuning, and intelligent automation woven into real products.", icon: "⊕" },
    { title: "Strategy & Research", description: "Market research, competitive analysis, and product strategy that moves the needle on what matters.", icon: "◐" },
    { title: "Growth Systems", description: "Analytics pipelines, A/B testing infrastructure, and data-driven growth loops built to compound.", icon: "◑" },
  ],
  gallery: [
    { imageUrl: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80", caption: "Our SF Studio" },
    { imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80", caption: "Team Workshop" },
    { imageUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80", caption: "Design Sprint" },
    { imageUrl: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=800&q=80", caption: "Deep Work" },
    { imageUrl: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&q=80", caption: "Product Launch" },
    { imageUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80", caption: "Engineering" },
  ],
  clients: [
    { name: "Stripe", logo: "https://logo.clearbit.com/stripe.com", website: "https://stripe.com" },
    { name: "Notion", logo: "https://logo.clearbit.com/notion.so", website: "https://notion.so" },
    { name: "Figma", logo: "https://logo.clearbit.com/figma.com", website: "https://figma.com" },
    { name: "Linear", logo: "https://logo.clearbit.com/linear.app", website: "https://linear.app" },
    { name: "Vercel", logo: "https://logo.clearbit.com/vercel.com", website: "https://vercel.com" },
    { name: "Airbnb", logo: "https://logo.clearbit.com/airbnb.com", website: "https://airbnb.com" },
  ],
  website: "https://aetherstudio.io",
  socialMedia: {
    linkedin: "https://linkedin.com",
    instagram: "https://instagram.com",
    twitter: "https://twitter.com",
    facebook: "https://facebook.com",
  },
  jobs: [
    { title: "Senior Product Designer", type: "Full-time", location: "San Francisco / Remote", dept: "Design" },
    { title: "Frontend Engineer (React)", type: "Full-time", location: "Remote", dept: "Engineering" },
    { title: "Brand Strategist", type: "Contract", location: "San Francisco", dept: "Strategy" },
  ],
};

/* ══════════════════════════════════════════════════════════════
   THEME — deep obsidian + warm gold + cream
══════════════════════════════════════════════════════════════ */
const C = {
  void: "#06060A",
  ink: "#0C0C12",
  surface: "#111118",
  card: "#16161E",
  border: "#1F1F2A",
  gold: "#C9A84C",
  goldLight: "rgba(201,168,76,0.12)",
  goldGlow: "rgba(201,168,76,0.06)",
  cream: "#F0EBE0",
  white: "#FAFAF8",
  mid: "#6B6B7A",
  sub: "#3D3D4A",
};

/* ══════════════════════════════════════════════════════════════
   GLOBAL CSS
══════════════════════════════════════════════════════════════ */
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Canela+Text:ital,wght@0,300;0,400;1,300;1,400&family=Neue+Haas+Grotesk+Display+Pro:wght@400;500;600&family=Monument+Extended:wght@400;800&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,300;0,400;1,300;1,400&family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; font-size: 16px; }
::-webkit-scrollbar { width: 3px; }
::-webkit-scrollbar-thumb { background: ${C.gold}; }
::selection { background: ${C.gold}; color: ${C.void}; }

@keyframes fadeIn    { from{opacity:0} to{opacity:1} }
@keyframes slideUp   { from{opacity:0;transform:translateY(32px)} to{opacity:1;transform:none} }
@keyframes slideLeft { from{opacity:0;transform:translateX(32px)} to{opacity:1;transform:none} }
@keyframes ticker    { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
@keyframes rotateSlow{ from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
@keyframes shimmer   { 0%,100%{opacity:.4} 50%{opacity:1} }
@keyframes scaleIn   { from{transform:scale(.94);opacity:0} to{transform:scale(1);opacity:1} }

.reveal { opacity:0; transform:translateY(28px); transition: opacity .75s cubic-bezier(.22,1,.36,1), transform .75s cubic-bezier(.22,1,.36,1); }
.reveal.vis { opacity:1; transform:none; }

.nav-a:hover { color:${C.gold} !important; }
.nav-a { transition:color .2s !important; }

.svc-item:hover { background: ${C.goldGlow} !important; border-color: ${C.gold} !important; }
.svc-item { transition: all .3s ease !important; }
.svc-item:hover .svc-num { color: ${C.gold} !important; }

.member-card:hover .member-img { transform: scale(1.04) !important; }
.member-card:hover .member-overlay { opacity:1 !important; }
.member-img { transition: transform .5s ease !important; }
.member-overlay { transition: opacity .35s ease !important; }

.job-row:hover { background: ${C.goldGlow} !important; border-left-color: ${C.gold} !important; }
.job-row { transition: all .25s ease !important; }

.client-logo { filter: brightness(0) invert(1); opacity:.35; transition: opacity .3s, filter .3s !important; }
.client-logo:hover { opacity:.9 !important; filter: brightness(1) invert(0) !important; }

.gallery-item:hover img { transform:scale(1.06) !important; }
.gallery-item img { transition: transform .6s ease !important; }
.gallery-item:hover .gal-caption { opacity:1 !important; }
.gal-caption { transition: opacity .3s !important; }

.gold-btn:hover { background: ${C.gold} !important; color: ${C.void} !important; transform:translateY(-2px) !important; box-shadow: 0 12px 40px rgba(201,168,76,.35) !important; }
.gold-btn { transition: all .25s ease !important; }
.ghost-btn:hover { border-color:${C.gold} !important; color:${C.gold} !important; }
.ghost-btn { transition: all .25s ease !important; }

.social-a:hover { background:${C.gold} !important; color:${C.void} !important; border-color:${C.gold} !important; }
.social-a { transition: all .2s ease !important; }
`;

/* ══════════════════════════════════════════════════════════════
   HOOKS
══════════════════════════════════════════════════════════════ */
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.classList.add("vis"); obs.disconnect(); }
    }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

function useOnScreen() {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, vis];
}

function R({ children, delay = 0, style = {} }) {
  const ref = useReveal();
  return (
    <div ref={ref} className="reveal" style={{ transitionDelay: `${delay}s`, ...style }}>
      {children}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   ATOMS
══════════════════════════════════════════════════════════════ */
function Label({ children }) {
  return (
    <span style={{
      fontFamily: "'JetBrains Mono',monospace",
      fontSize: 10, letterSpacing: "0.22em",
      textTransform: "uppercase", color: C.gold,
      display: "inline-block",
    }}>
      {children}
    </span>
  );
}

function SectionTitle({ eyebrow, children }) {
  const ref = useReveal();
  return (
    <div ref={ref} className="reveal" style={{ marginBottom: 64 }}>
      {eyebrow && <Label>{eyebrow}</Label>}
      <h2 style={{
        fontFamily: "'Fraunces',serif",
        fontWeight: 300,
        fontSize: "clamp(44px,6vw,84px)",
        color: C.cream,
        lineHeight: 1.0,
        letterSpacing: "-0.02em",
        marginTop: eyebrow ? 12 : 0,
      }}>
        {children}
      </h2>
    </div>
  );
}

function Divider() {
  return <div style={{ height: 1, background: C.border, margin: "0" }} />;
}

/* ══════════════════════════════════════════════════════════════
   NAV
══════════════════════════════════════════════════════════════ */
function Nav({ c }) {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("home");
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const links = ["About", "Services", "Work", "Team", "Careers", "Contact"];
  const logoLetters = (c.companyName || "A").substring(0, 1).toUpperCase();

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 500,
      height: 72,
      display: "flex", alignItems: "center",
      padding: "0 52px",
      background: scrolled ? "rgba(6,6,10,.92)" : "transparent",
      backdropFilter: scrolled ? "blur(20px)" : "none",
      borderBottom: scrolled ? `1px solid ${C.border}` : "none",
      transition: "all .4s ease",
    }}>
      {/* Logo mark */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, flex: "0 0 auto" }}>
        <div style={{
          width: 36, height: 36,
          border: `1.5px solid ${C.gold}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          position: "relative",
        }}>
          <span style={{
            fontFamily: "'Fraunces',serif",
            fontSize: 16, fontWeight: 400, color: C.gold,
            lineHeight: 1,
          }}>
            {logoLetters}
          </span>
          <div style={{
            position: "absolute", width: 6, height: 6,
            borderRight: `1.5px solid ${C.gold}`, borderBottom: `1.5px solid ${C.gold}`,
            bottom: -4, right: -4, background: C.void,
          }} />
        </div>
        <span style={{
          fontFamily: "'Outfit',sans-serif",
          fontWeight: 600, fontSize: 17,
          color: C.cream, letterSpacing: "-0.01em",
        }}>
          {c.companyName}
        </span>
      </div>

      {/* Links */}
      <div style={{ flex: 1, display: "flex", justifyContent: "center", gap: 36 }}>
        {links.map(l => (
          <a key={l} href={`#${l.toLowerCase()}`} className="nav-a" style={{
            fontFamily: "'Outfit',sans-serif",
            fontSize: 13, fontWeight: 400,
            color: C.mid, textDecoration: "none",
            letterSpacing: "0.02em",
          }}>
            {l}
          </a>
        ))}
      </div>

      {/* CTA */}
      <a href={`mailto:${c.email}`} className="gold-btn" style={{
        padding: "9px 22px",
        border: `1px solid ${C.gold}`,
        color: C.gold,
        fontFamily: "'Outfit',sans-serif",
        fontSize: 12, fontWeight: 600,
        textDecoration: "none",
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        flexShrink: 0,
      }}>
        Hire Us
      </a>
    </nav>
  );
}

/* ══════════════════════════════════════════════════════════════
   HERO
══════════════════════════════════════════════════════════════ */
function Hero({ c }) {
  const [on, setOn] = useState(false);
  useEffect(() => { const t = setTimeout(() => setOn(true), 100); return () => clearTimeout(t); }, []);

  const wordList = (c.tagline || "Where Vision Becomes Reality").split(" ");

  return (
    <section id="home" style={{
      minHeight: "100vh",
      position: "relative",
      display: "flex", flexDirection: "column",
      justifyContent: "flex-end",
      overflow: "hidden",
    }}>
      {/* Cover image */}
      {c.coverPhoto && (
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `url(${c.coverPhoto})`,
          backgroundSize: "cover", backgroundPosition: "center",
          filter: "brightness(.28) saturate(.7)",
          transform: "scale(1.04)",
          transition: "transform 8s ease",
        }} />
      )}

      {/* Gradient overlays */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(6,6,10,.5) 0%, rgba(6,6,10,.0) 40%, rgba(6,6,10,.85) 85%, rgba(6,6,10,1) 100%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(6,6,10,.6) 0%, transparent 60%)", pointerEvents: "none" }} />

      {/* Decorative corner bracket */}
      <div style={{
        position: "absolute", top: 100, right: 52,
        width: 80, height: 80,
        borderTop: `1px solid ${C.gold}`,
        borderRight: `1px solid ${C.gold}`,
        opacity: on ? .6 : 0, transition: "opacity 1.5s 1s",
      }} />
      <div style={{
        position: "absolute", top: 100, right: 52,
        width: 40, height: 40,
        borderTop: `1px solid ${C.gold}`,
        borderRight: `1px solid ${C.gold}`,
        opacity: on ? .3 : 0, transition: "opacity 1.5s 1.2s",
      }} />

      {/* Industry badge */}
      <div style={{
        position: "absolute", top: 90, left: 52,
        display: "flex", alignItems: "center", gap: 10,
        opacity: on ? 1 : 0, transition: "opacity .8s .4s",
      }}>
        <div style={{ width: 6, height: 6, background: C.gold, borderRadius: "50%", animation: "shimmer 2.5s infinite" }} />
        <Label>{c.industry || "Creative Technology"}</Label>
      </div>

      {/* Main content */}
      <div style={{
        position: "relative", zIndex: 2,
        padding: "0 52px 72px",
        maxWidth: 1100,
      }}>
        {/* Tagline */}
        <h1 style={{
          fontFamily: "'Fraunces',serif",
          fontWeight: 300,
          fontSize: "clamp(64px,10vw,140px)",
          lineHeight: 0.95,
          letterSpacing: "-0.03em",
          marginBottom: 36,
        }}>
          {wordList.map((word, i) => (
            <span key={i} style={{
              display: "block",
              color: i % 3 === 1 ? C.gold : C.cream,
              opacity: on ? 1 : 0,
              transform: on ? "none" : "translateY(24px)",
              transition: `opacity .9s ${.25 + i * .12}s, transform .9s ${.25 + i * .12}s cubic-bezier(.22,1,.36,1)`,
            }}>
              {word}
            </span>
          ))}
        </h1>

        {/* About excerpt */}
        <div style={{
          display: "flex", gap: 60, alignItems: "flex-start", flexWrap: "wrap",
          opacity: on ? 1 : 0, transition: "opacity .9s .85s",
        }}>
          <div style={{ width: 1, background: C.gold, height: 56, flexShrink: 0, alignSelf: "center" }} />
          <p style={{
            fontFamily: "'Outfit',sans-serif",
            fontSize: 16, lineHeight: 1.8, fontWeight: 300,
            color: "rgba(240,235,224,.6)",
            maxWidth: 480,
          }}>
            {c.about?.slice(0, 180)}{c.about?.length > 180 ? "…" : ""}
          </p>
          <div style={{ display: "flex", gap: 14, alignSelf: "flex-end", flexWrap: "wrap" }}>
            <a href="#services" className="gold-btn" style={{
              padding: "14px 36px",
              border: `1px solid ${C.gold}`,
              color: C.gold,
              fontFamily: "'Outfit',sans-serif", fontSize: 12,
              fontWeight: 600, letterSpacing: "0.08em",
              textTransform: "uppercase", textDecoration: "none",
            }}>
              Our Work
            </a>
            <a href="#contact" className="ghost-btn" style={{
              padding: "14px 36px",
              border: "1px solid rgba(255,255,255,.15)",
              color: "rgba(255,255,255,.5)",
              fontFamily: "'Outfit',sans-serif", fontSize: 12,
              fontWeight: 500, letterSpacing: "0.06em",
              textTransform: "uppercase", textDecoration: "none",
            }}>
              Contact
            </a>
          </div>
        </div>

        {/* Stats bar */}
        <div style={{
          display: "flex", gap: 0,
          marginTop: 64, paddingTop: 36,
          borderTop: `1px solid ${C.border}`,
          flexWrap: "wrap",
          opacity: on ? 1 : 0, transition: "opacity .9s 1.1s",
        }}>
          {[
            { val: c.foundedYear || "—", lbl: "Founded" },
            { val: c.companySize || "—", lbl: "Team Size" },
            { val: (c.clients?.length || 0) + "+", lbl: "Clients" },
            { val: c.industry || "—", lbl: "Industry" },
          ].map((s, i) => (
            <div key={i} style={{
              paddingRight: 48, marginRight: 48,
              borderRight: i < 3 ? `1px solid ${C.border}` : "none",
              paddingBottom: 8,
            }}>
              <div style={{ fontFamily: "'Fraunces',serif", fontSize: 30, color: C.cream, fontWeight: 300, lineHeight: 1 }}>{s.val}</div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: C.mid, letterSpacing: "0.16em", textTransform: "uppercase", marginTop: 6 }}>{s.lbl}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: "absolute", bottom: 36, right: 52,
        display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
        opacity: on ? .5 : 0, transition: "opacity 1s 1.4s",
      }}>
        <div style={{ width: 1, height: 48, background: C.gold, animation: "shimmer 2s infinite" }} />
        <Label>Scroll</Label>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════
   CLIENTS TICKER
══════════════════════════════════════════════════════════════ */
function ClientsTicker({ clients }) {
  if (!clients?.length) return null;
  const rep = [...clients, ...clients, ...clients];
  return (
    <div style={{
      background: C.ink,
      borderTop: `1px solid ${C.border}`,
      borderBottom: `1px solid ${C.border}`,
      padding: "22px 0",
      overflow: "hidden",
    }}>
      <div style={{
        display: "flex", gap: 64,
        animation: "ticker 22s linear infinite",
        whiteSpace: "nowrap",
      }}>
        {rep.map((cl, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, flexShrink: 0 }}>
            {cl.logo
              ? <img src={cl.logo} alt={cl.name} className="client-logo" style={{ height: 22, objectFit: "contain" }} />
              : <span style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 600, fontSize: 14, color: "rgba(255,255,255,.2)", letterSpacing: "0.04em" }}>{cl.name}</span>
            }
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   ABOUT
══════════════════════════════════════════════════════════════ */
function About({ c }) {
  return (
    <section id="about" style={{ background: C.void, padding: "120px 52px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 100, alignItems: "center" }}>

        <SectionTitle eyebrow="Who We Are">
          Crafting<br /><em>extraordinary</em><br />digital things.
        </SectionTitle>

        <div>
          <R delay={.1}>
            <p style={{
              fontFamily: "'Outfit',sans-serif",
              fontSize: 16, lineHeight: 1.9,
              color: "rgba(240,235,224,.65)",
              fontWeight: 300,
              marginBottom: 36,
            }}>
              {c.about}
            </p>
          </R>
          <R delay={.2}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              {[c.industry, `Est. ${c.foundedYear}`, `${c.companySize} People`, c.businessPark].filter(Boolean).map((t, i) => (
                <span key={i} style={{
                  padding: "7px 16px",
                  border: `1px solid ${C.border}`,
                  fontFamily: "'JetBrains Mono',monospace",
                  fontSize: 10, color: C.mid,
                  letterSpacing: "0.1em", textTransform: "uppercase",
                }}>
                  {t}
                </span>
              ))}
            </div>
          </R>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════
   SERVICES
══════════════════════════════════════════════════════════════ */
function Services({ services }) {
  if (!services?.length) return null;
  return (
    <section id="services" style={{ background: C.ink, padding: "120px 52px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 72, flexWrap: "wrap", gap: 24 }}>
          <SectionTitle eyebrow={`${services.length} Offerings`}>
            Services
          </SectionTitle>
          <R delay={.1}>
            <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, color: C.mid, maxWidth: 320, lineHeight: 1.8, fontWeight: 300 }}>
              Every engagement is built around your specific ambitions — no cookie-cutter playbooks.
            </p>
          </R>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {services.map((s, i) => (
            <R key={i} delay={i * 0.06}>
              <div className="svc-item" style={{
                display: "grid", gridTemplateColumns: "60px 1fr 1fr auto",
                alignItems: "center", gap: 32,
                padding: "28px 32px",
                border: `1px solid ${C.border}`,
                cursor: "default",
                background: "transparent",
              }}>
                <span className="svc-num" style={{
                  fontFamily: "'JetBrains Mono',monospace",
                  fontSize: 11, color: C.sub,
                  letterSpacing: "0.1em",
                  transition: "color .3s",
                }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 style={{
                  fontFamily: "'Fraunces',serif",
                  fontSize: 22, fontWeight: 300,
                  color: C.cream, letterSpacing: "-0.01em",
                }}>
                  {s.title}
                </h3>
                <p style={{
                  fontFamily: "'Outfit',sans-serif",
                  fontSize: 13, color: C.mid,
                  lineHeight: 1.7, fontWeight: 300,
                }}>
                  {s.description}
                </p>
                <span style={{ fontSize: 22, color: C.sub, flexShrink: 0 }}>{s.icon}</span>
              </div>
            </R>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════
   GALLERY / WORK
══════════════════════════════════════════════════════════════ */
function Gallery({ gallery }) {
  if (!gallery?.length) return null;
  return (
    <section id="work" style={{ background: C.void, padding: "120px 0" }}>
      <div style={{ padding: "0 52px", marginBottom: 64 }}>
        <SectionTitle eyebrow="Gallery">
          Behind<br />the<br /><em>curtain.</em>
        </SectionTitle>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gridTemplateRows: "auto auto",
        gap: 3,
      }}>
        {gallery.map((g, i) => (
          <R key={i} delay={i * 0.05}>
            <div className="gallery-item" style={{
              position: "relative", overflow: "hidden",
              aspectRatio: i === 0 ? "auto" : "4/3",
              gridRow: i === 0 ? "span 2" : "auto",
            }}>
              <img src={g.imageUrl} alt={g.caption} style={{
                width: "100%", height: "100%",
                objectFit: "cover", display: "block",
                filter: "brightness(.75) saturate(.8)",
              }} />
              <div className="gal-caption" style={{
                position: "absolute", bottom: 0, left: 0, right: 0,
                padding: "20px",
                background: "linear-gradient(transparent, rgba(6,6,10,.85))",
                opacity: 0,
              }}>
                <span style={{
                  fontFamily: "'JetBrains Mono',monospace",
                  fontSize: 10, color: C.gold, letterSpacing: "0.12em",
                  textTransform: "uppercase",
                }}>
                  {g.caption}
                </span>
              </div>
            </div>
          </R>
        ))}
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════
   TEAM
══════════════════════════════════════════════════════════════ */
function Team({ members }) {
  if (!members?.length) return null;
  const [hovered, setHovered] = useState(null);

  return (
    <section id="team" style={{ background: C.ink, padding: "120px 52px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <SectionTitle eyebrow="Meet the Team">
          The people<br /><em>behind it.</em>
        </SectionTitle>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 32 }}>
          {members.map((m, i) => (
            <R key={i} delay={i * 0.07}>
              <div
                className="member-card"
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                style={{ cursor: "default" }}
              >
                {/* Photo */}
                <div style={{ position: "relative", overflow: "hidden", borderRadius: 4, marginBottom: 20, aspectRatio: "3/4" }}>
                  <img
                    className="member-img"
                    src={m.photo || "https://via.placeholder.com/300x400"}
                    alt={m.name}
                    style={{
                      width: "100%", height: "100%", objectFit: "cover",
                      display: "block",
                      filter: hovered === i ? "grayscale(0%)" : "grayscale(55%) brightness(.85)",
                    }}
                  />
                  {/* Gold bar bottom */}
                  <div style={{
                    position: "absolute", bottom: 0, left: 0, right: 0,
                    height: 3,
                    background: `linear-gradient(90deg, ${C.gold}, transparent)`,
                  }} />
                  {/* Hover overlay with bio */}
                  <div className="member-overlay" style={{
                    position: "absolute", inset: 0,
                    background: "rgba(6,6,10,.86)",
                    display: "flex", flexDirection: "column",
                    justifyContent: "flex-end",
                    padding: 20,
                    opacity: hovered === i ? 1 : 0,
                  }}>
                    {m.bio && (
                      <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, color: "rgba(240,235,224,.8)", lineHeight: 1.7, fontWeight: 300, marginBottom: 14 }}>
                        {m.bio}
                      </p>
                    )}
                    <div style={{ display: "flex", gap: 8 }}>
                      {m.linkedin && <a href={m.linkedin} style={{ padding: "5px 10px", border: `1px solid ${C.gold}`, fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: C.gold, textDecoration: "none", letterSpacing: "0.1em" }}>IN</a>}
                      {m.twitter && <a href={m.twitter} style={{ padding: "5px 10px", border: `1px solid ${C.border}`, fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: C.mid, textDecoration: "none", letterSpacing: "0.1em" }}>TW</a>}
                      {m.email && <a href={`mailto:${m.email}`} style={{ padding: "5px 10px", border: `1px solid ${C.border}`, fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: C.mid, textDecoration: "none", letterSpacing: "0.1em" }}>✉</a>}
                    </div>
                  </div>
                </div>
                <h3 style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 600, fontSize: 16, color: C.cream, marginBottom: 4, letterSpacing: "-0.01em" }}>{m.name}</h3>
                <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: C.gold, letterSpacing: "0.1em", textTransform: "uppercase" }}>{m.role}</p>
              </div>
            </R>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════
   CAREERS
══════════════════════════════════════════════════════════════ */
function Careers({ jobs = [] }) {
  if (!jobs?.length) return null;
  return (
    <section id="careers" style={{ background: C.surface, padding: "120px 52px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 64, flexWrap: "wrap", gap: 24 }}>
          <SectionTitle eyebrow="Open Roles">
            Join<br /><em>us.</em>
          </SectionTitle>
          <R delay={.1}>
            <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, color: C.mid, maxWidth: 300, lineHeight: 1.8, fontWeight: 300 }}>
              We hire curious people who ship. No bureaucracy, just craft.
            </p>
          </R>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {jobs.map((j, i) => (
            <R key={i} delay={i * 0.07}>
              <div className="job-row" style={{
                display: "flex", justifyContent: "space-between",
                alignItems: "center", gap: 24,
                padding: "26px 32px",
                background: C.card,
                borderLeft: `2px solid ${C.border}`,
                flexWrap: "wrap",
                cursor: "pointer",
              }}>
                <div>
                  <h3 style={{ fontFamily: "'Fraunces',serif", fontWeight: 300, fontSize: 20, color: C.cream, marginBottom: 6 }}>{j.title}</h3>
                  <div style={{ display: "flex", gap: 16 }}>
                    <Label>{j.dept}</Label>
                    <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: C.mid, letterSpacing: "0.08em" }}>{j.location}</span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <span style={{
                    padding: "5px 14px",
                    border: `1px solid ${C.border}`,
                    fontFamily: "'JetBrains Mono',monospace", fontSize: 10,
                    color: C.mid, letterSpacing: "0.08em", textTransform: "uppercase",
                  }}>
                    {j.type}
                  </span>
                  <span style={{
                    padding: "5px 14px",
                    border: `1px solid ${C.gold}`,
                    fontFamily: "'Outfit',sans-serif", fontSize: 12,
                    fontWeight: 600, color: C.gold, letterSpacing: "0.04em",
                  }}>
                    Apply →
                  </span>
                </div>
              </div>
            </R>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════
   CONTACT
══════════════════════════════════════════════════════════════ */
function Contact({ c }) {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [done, setDone] = useState(false);

  const addr = [c.address?.building, c.address?.street, c.address?.city, c.address?.state, c.address?.pincode].filter(Boolean).join(", ");

  return (
    <section id="contact" style={{ background: C.void, padding: "120px 52px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        <SectionTitle eyebrow="Contact">
          Let's make<br /><em>something.</em>
        </SectionTitle>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 100, alignItems: "start" }}>

          {/* Left — info */}
          <R delay={0}>
            <div style={{ display: "flex", flexDirection: "column", gap: 0, border: `1px solid ${C.border}` }}>
              {[
                { l: "Email", v: c.email, href: `mailto:${c.email}` },
                { l: "Phone", v: c.phone, href: `tel:${c.phone}` },
                { l: "Address", v: addr || "—", href: null },
                { l: "Website", v: c.website || "—", href: c.website },
              ].map((r, i) => (
                <div key={i} style={{
                  padding: "22px 28px",
                  borderBottom: i < 3 ? `1px solid ${C.border}` : "none",
                  display: "flex", justifyContent: "space-between",
                  alignItems: "flex-start", gap: 24,
                }}>
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: C.sub, letterSpacing: "0.15em", textTransform: "uppercase", flexShrink: 0, paddingTop: 2 }}>{r.l}</span>
                  {r.href
                    ? <a href={r.href} style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, color: "rgba(240,235,224,.7)", textDecoration: "none", textAlign: "right" }}>{r.v}</a>
                    : <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, color: "rgba(240,235,224,.7)", textAlign: "right" }}>{r.v}</span>
                  }
                </div>
              ))}
            </div>

            {/* Socials */}
            <div style={{ display: "flex", gap: 10, marginTop: 24, flexWrap: "wrap" }}>
              {Object.entries(c.socialMedia || {}).filter(([, v]) => v).map(([k, v]) => (
                <a key={k} href={v} className="social-a" style={{
                  padding: "9px 16px",
                  border: `1px solid ${C.border}`,
                  fontFamily: "'JetBrains Mono',monospace", fontSize: 10,
                  color: C.mid, textDecoration: "none",
                  letterSpacing: "0.1em", textTransform: "uppercase",
                }}>
                  {k}
                </a>
              ))}
            </div>
          </R>

          {/* Right — form */}
          <R delay={.15}>
            {done ? (
              <div style={{ padding: "64px 0", textAlign: "center" }}>
                <div style={{
                  width: 64, height: 64,
                  border: `1px solid ${C.gold}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 24px",
                  fontSize: 28, color: C.gold,
                }}>
                  ✓
                </div>
                <h3 style={{ fontFamily: "'Fraunces',serif', fontWeight: 300", fontSize: 28, color: C.cream, marginBottom: 10 }}>Message Received</h3>
                <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, color: C.mid }}>We'll reply within one business day.</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {[
                  { k: "name", lbl: "Your Name", ph: "Jane Smith", t: "text" },
                  { k: "email", lbl: "Email", ph: "jane@company.com", t: "email" },
                ].map(f => (
                  <div key={f.k}>
                    <label style={{ display: "block", fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: C.mid, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 9 }}>{f.lbl}</label>
                    <input
                      type={f.t} placeholder={f.ph}
                      value={form[f.k]}
                      onChange={e => setForm(p => ({ ...p, [f.k]: e.target.value }))}
                      style={{ width: "100%", padding: "13px 16px", background: C.card, border: `1px solid ${C.border}`, fontFamily: "'Outfit',sans-serif", fontSize: 14, color: C.cream, outline: "none", borderRadius: 2 }}
                      onFocus={e => e.target.style.borderColor = C.gold}
                      onBlur={e => e.target.style.borderColor = C.border}
                    />
                  </div>
                ))}
                <div>
                  <label style={{ display: "block", fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: C.mid, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 9 }}>Message</label>
                  <textarea
                    placeholder="Tell us about your project…" rows={5}
                    value={form.message}
                    onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                    style={{ width: "100%", padding: "13px 16px", background: C.card, border: `1px solid ${C.border}`, fontFamily: "'Outfit',sans-serif", fontSize: 14, color: C.cream, outline: "none", resize: "vertical", borderRadius: 2 }}
                    onFocus={e => e.target.style.borderColor = C.gold}
                    onBlur={e => e.target.style.borderColor = C.border}
                  />
                </div>
                <button
                  onClick={() => { if (form.name && form.email) setDone(true); }}
                  className="gold-btn"
                  style={{
                    padding: "15px 36px", alignSelf: "flex-start",
                    border: `1px solid ${C.gold}`, color: C.gold,
                    background: "transparent",
                    fontFamily: "'Outfit',sans-serif", fontSize: 12,
                    fontWeight: 600, letterSpacing: "0.08em",
                    textTransform: "uppercase", cursor: "pointer",
                  }}
                >
                  Send Message →
                </button>
              </div>
            )}
          </R>
        </div>
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
      background: C.void,
      borderTop: `1px solid ${C.border}`,
      padding: "40px 52px",
      display: "flex", justifyContent: "space-between",
      alignItems: "center", flexWrap: "wrap", gap: 16,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 30, height: 30, border: `1px solid ${C.gold}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontFamily: "'Fraunces',serif", fontSize: 13, color: C.gold }}>{c.companyName?.[0]}</span>
        </div>
        <span style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 600, fontSize: 15, color: C.cream }}>{c.companyName}</span>
      </div>
      <div style={{ display: "flex", gap: 28 }}>
        {["About", "Services", "Team", "Careers", "Contact"].map(l => (
          <a key={l} href={`#${l.toLowerCase()}`} style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, color: C.sub, textDecoration: "none" }}>{l}</a>
        ))}
      </div>
      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: C.sub, letterSpacing: "0.12em" }}>
        © {new Date().getFullYear()} {c.companyName}
      </span>
    </footer>
  );
}

/* ══════════════════════════════════════════════════════════════
   ROOT EXPORT
══════════════════════════════════════════════════════════════ */
/**
 * CompanyWebsite
 *
 * Props:
 *   data – object matching your Mongoose companySchema
 *          (any missing field is hidden gracefully)
 *   data.jobs – array of { title, type, location, dept }
 *               (not in schema but passed alongside)
 *
 * Usage:
 *   <CompanyWebsite data={companyFromAPI} />
 *   <CompanyWebsite />   ← renders demo
 */
export default function CompanyWebsite1({ data = DEMO }) {
  const c = data;
  return (
    <div style={{ background: C.void, color: C.cream, minHeight: "100vh", overflowX: "hidden" }}>
      <style>{STYLES}</style>
      <Nav c={c} />
      <Hero c={c} />
      <ClientsTicker clients={c.clients} />
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