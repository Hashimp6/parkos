import { useState, useEffect, useRef } from "react";

/* ═══════════════════════════════════════════════════════════
   DUMMY DATA  — shown only when no data prop is passed
═══════════════════════════════════════════════════════════ */
const DUMMY = {
  companyName: "Luminary Studio",
  tagline: "Where Vision Meets Velocity.",
  about:
    "We are a multidisciplinary technology studio crafting digital products that inspire, scale, and endure. From breakthrough mobile experiences to enterprise-grade platforms, we turn ambitious ideas into market-defining realities.",
  industry: "Product & Technology",
  companySize: "11–50",
  foundedYear: 2019,
  businessPark: "Technopark",
  website: "https://luminary.studio",
  tags: ["Product Design", "Engineering", "AI", "Mobile", "SaaS"],
  logo: "",
  banner: "",
  address: {
    building: "Level 5, Yamuna",
    street: "Technopark Phase I",
    city: "Thiruvananthapuram",
    state: "Kerala",
    pincode: "695581",
    country: "India",
  },
  contacts: {
    email: "hello@luminary.studio",
    phone: "+91 98765 43210",
    linkedin: "#",
    twitter: "#",
    instagram: "#",
    whatsapp: "919876543210",
  },
  services: [
    { title: "Product Engineering",  description: "Full-stack web & mobile products built for speed, scale, and longevity — from MVP to IPO-ready." },
    { title: "AI Integration",       description: "LLM orchestration, computer vision, and predictive analytics woven seamlessly into your core product." },
    { title: "UX & Brand Design",    description: "Research-backed interfaces and visual identities that users fall in love with on first interaction." },
    { title: "Cloud & DevOps",       description: "Infra-as-code, CI/CD, auto-scaling architectures — ship daily with zero-downtime confidence." },
    { title: "Growth Engineering",   description: "A/B experimentation, funnel analytics, and conversion optimisation baked into every release." },
    { title: "Tech Consulting",      description: "CTO advisory, architecture audits, and technology due diligence for founders and investors." },
  ],
  projects: [
    { name: "Velox Pay",    category: "FinTech",    year: "2024", description: "Real-time payment rails processing ₹500 Cr/month for 1,200+ merchants across South Asia.", link: "#" },
    { name: "CareOS",       category: "HealthTech", year: "2023", description: "Clinical OS adopted by 80+ hospitals — reducing patient wait times by 40% through intelligent scheduling.", link: "#" },
    { name: "Orion Fleet",  category: "Logistics",  year: "2024", description: "IoT-powered fleet intelligence platform tracking 80K+ shipments in real time.", link: "#" },
    { name: "LearnSpark",   category: "EdTech",     year: "2022", description: "AI-adaptive learning engine serving 350K+ students with personalised curriculum paths.", link: "#" },
  ],
  members: [
    { name: "Ananya Krishnan", position: "Founder & CEO",   image: "", url: "", bio: "Serial entrepreneur. 3 exits. Obsessed with products people can't stop using." },
    { name: "Dev Menon",       position: "CTO",             image: "", url: "", bio: "Ex-Google. Distributed systems architect who ships at startup speed." },
    { name: "Nila Varma",      position: "Head of Design",  image: "", url: "", bio: "Cannes Lions finalist. Turns user research into interfaces that feel inevitable." },
    { name: "Rohan Pillai",    position: "VP Engineering",  image: "", url: "", bio: "15 years shipping production systems. Zero-bug champion, zero-ego leader." },
    { name: "Sara George",     position: "Head of AI / ML", image: "", url: "", bio: "PhD MIT. Brings research-grade ML into products real humans use every day." },
    { name: "Kiran Das",       position: "Director, Growth",image: "", url: "", bio: "Scaled three startups from 0 → ₹100 Cr ARR. Growth is a science, not a guess." },
  ],
  clients: [
    { name: "Federal Bank",    sector: "Banking",       logo: "", website: "" },
    { name: "KIMS Health",     sector: "Healthcare",    logo: "", website: "" },
    { name: "UST Global",      sector: "Technology",    logo: "", website: "" },
    { name: "IBS Software",    sector: "Aviation",      logo: "", website: "" },
    { name: "Muthoot Finance", sector: "Finance",       logo: "", website: "" },
    { name: "Tata Elxsi",      sector: "Engineering",   logo: "", website: "" },
    { name: "HCLTech",         sector: "IT Services",   logo: "", website: "" },
    { name: "Kerala Govt.",    sector: "Public Sector", logo: "", website: "" },
  ],
  gallery: [
    { imageUrl: "", caption: "Design Week 2024",       tag: "Event"   },
    { imageUrl: "", caption: "Product Launch — Velox", tag: "Launch"  },
    { imageUrl: "", caption: "Team Retreat, Wayanad",  tag: "Culture" },
    { imageUrl: "", caption: "Hackathon Champions",    tag: "Award"   },
    { imageUrl: "", caption: "Sprint Planning",        tag: "Work"    },
    { imageUrl: "", caption: "Client Summit",          tag: "Client"  },
  ],
};

/* ═══════════════════════════════════════════════════════════
   UTILS
═══════════════════════════════════════════════════════════ */
const has = (v) => {
  if (v == null) return false;
  if (typeof v === "string")  return v.trim() !== "";
  if (typeof v === "number")  return !isNaN(v) && v !== 0;
  if (Array.isArray(v))       return v.length > 0;
  if (typeof v === "object")  return Object.values(v).some(has);
  return !!v;
};

const ini = (n = "") =>
  n.split(" ").filter(Boolean).map(w => w[0]).join("").slice(0, 2).toUpperCase();

const YR = new Date().getFullYear();

/* ═══════════════════════════════════════════════════════════
   DESIGN TOKENS
═══════════════════════════════════════════════════════════ */
const C = {
  // Background layers
  bg0:  "#09090f",   // deepest — hero
  bg1:  "#0d0d17",   // dark sections
  bg2:  "#11111e",   // card bg
  bg3:  "#171728",   // elevated card

  // Gold / Amber accent
  gold:     "#c9a84c",
  goldBright:"#e4c06e",
  goldDim:  "#8a6f2e",
  goldGlow: "rgba(201,168,76,0.18)",
  goldLine: "rgba(201,168,76,0.25)",

  // Neutral text
  textHi:   "#f0ede8",   // headlines
  textMid:  "#a89f94",   // body
  textLow:  "#5a5449",   // muted

  // Borders
  border:   "rgba(255,255,255,0.07)",
  borderGold:"rgba(201,168,76,0.2)",

  // Utility
  white: "#ffffff",
  error: "#e06c6c",
};

/* ═══════════════════════════════════════════════════════════
   BREAKPOINT HOOK
═══════════════════════════════════════════════════════════ */
function useBreakpoint() {
  const [bp, setBp] = useState({ isMobile: false, isTablet: false, isDesktop: true });
  useEffect(() => {
    const update = () => setBp({
      isMobile:  window.innerWidth < 640,
      isTablet:  window.innerWidth >= 640 && window.innerWidth < 1024,
      isDesktop: window.innerWidth >= 1024,
    });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return bp;
}

/* ═══════════════════════════════════════════════════════════
   GLOBAL STYLES
═══════════════════════════════════════════════════════════ */
function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');

      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      html { scroll-behavior: smooth; font-size: 16px; }
      body { background: ${C.bg0}; color: ${C.textHi}; -webkit-font-smoothing: antialiased; overflow-x: hidden; }
      a { text-decoration: none; color: inherit; }
      button { font-family: inherit; }
      ::selection { background: ${C.gold}; color: ${C.bg0}; }
      ::-webkit-scrollbar { width: 3px; }
      ::-webkit-scrollbar-track { background: ${C.bg1}; }
      ::-webkit-scrollbar-thumb { background: ${C.goldDim}; }

      /* ── Typography classes ── */
      .display {
        font-family: 'Playfair Display', serif;
        font-weight: 900;
        line-height: 1.02;
        letter-spacing: -0.02em;
        color: ${C.textHi};
      }
      .display-italic {
        font-family: 'Playfair Display', serif;
        font-weight: 700;
        font-style: italic;
        color: ${C.gold};
      }
      .label {
        font-family: 'DM Sans', sans-serif;
        font-weight: 500;
        font-size: 11px;
        letter-spacing: 0.22em;
        text-transform: uppercase;
        color: ${C.gold};
      }
      .body {
        font-family: 'DM Sans', sans-serif;
        font-weight: 300;
        line-height: 1.8;
        color: ${C.textMid};
      }

      /* ── Layout ── */
      .wrap { max-width: 1280px; margin: 0 auto; padding: 0 24px; }
      @media (min-width: 640px)  { .wrap { padding: 0 40px; } }
      @media (min-width: 1024px) { .wrap { padding: 0 64px; } }

      /* ── Buttons ── */
      .btn-primary {
        display: inline-flex; align-items: center; gap: 10px;
        font-family: 'DM Sans', sans-serif; font-weight: 600; font-size: 13px;
        letter-spacing: 0.08em; text-transform: uppercase;
        background: ${C.gold}; color: ${C.bg0};
        padding: 14px 32px; border: none; cursor: pointer;
        border-radius: 2px;
        transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
        box-shadow: 0 0 0 0 ${C.goldGlow};
      }
      .btn-primary:hover {
        background: ${C.goldBright};
        transform: translateY(-2px);
        box-shadow: 0 8px 32px ${C.goldGlow};
      }
      .btn-outline {
        display: inline-flex; align-items: center; gap: 10px;
        font-family: 'DM Sans', sans-serif; font-weight: 600; font-size: 13px;
        letter-spacing: 0.08em; text-transform: uppercase;
        background: transparent; color: ${C.textHi};
        padding: 13px 32px;
        border: 1px solid ${C.border};
        cursor: pointer; border-radius: 2px;
        transition: border-color 0.2s, color 0.2s, transform 0.2s;
      }
      .btn-outline:hover {
        border-color: ${C.gold}; color: ${C.gold};
        transform: translateY(-2px);
      }

      /* ── Cards ── */
      .glass-card {
        background: ${C.bg2};
        border: 1px solid ${C.border};
        border-radius: 12px;
        transition: border-color 0.3s, transform 0.3s, box-shadow 0.3s;
      }
      .glass-card:hover {
        border-color: ${C.borderGold};
        transform: translateY(-4px);
        box-shadow: 0 16px 48px rgba(0,0,0,0.4);
      }

      /* ── Nav link ── */
      .nav-link {
        font-family: 'DM Sans', sans-serif; font-weight: 500; font-size: 13px;
        letter-spacing: 0.06em; color: ${C.textMid};
        transition: color 0.2s; position: relative;
      }
      .nav-link::after {
        content: ''; position: absolute; bottom: -3px; left: 0;
        width: 0; height: 1px; background: ${C.gold};
        transition: width 0.25s;
      }
      .nav-link:hover { color: ${C.textHi}; }
      .nav-link:hover::after { width: 100%; }

      /* ── Section divider line ── */
      .gold-line {
        width: 40px; height: 2px;
        background: linear-gradient(90deg, ${C.gold}, transparent);
        margin-bottom: 20px;
      }

      /* ── Animations ── */
      @keyframes fadeUp {
        from { opacity: 0; transform: translateY(28px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @keyframes glowPulse {
        0%, 100% { opacity: 0.5; transform: scale(1); }
        50%       { opacity: 0.8; transform: scale(1.08); }
      }
      @keyframes rotateOrb {
        from { transform: rotate(0deg); }
        to   { transform: rotate(360deg); }
      }
      @keyframes ticker {
        from { transform: translateX(0); }
        to   { transform: translateX(-50%); }
      }

      .fu  { animation: fadeUp 0.7s ease both; }
      .fu1 { animation: fadeUp 0.7s 0.1s ease both; }
      .fu2 { animation: fadeUp 0.7s 0.22s ease both; }
      .fu3 { animation: fadeUp 0.7s 0.34s ease both; }
      .fu4 { animation: fadeUp 0.7s 0.46s ease both; }

      .ticker-track { animation: ticker 28s linear infinite; display: flex; white-space: nowrap; }

      /* ── Service accordion ── */
      .svc-row {
        border-bottom: 1px solid ${C.border};
        transition: background 0.2s;
        cursor: pointer;
      }
      .svc-row:hover { background: rgba(201,168,76,0.04); }

      /* ── Team card ── */
      .team-card {
        background: ${C.bg2}; border: 1px solid ${C.border};
        border-radius: 12px; padding: 28px 24px;
        transition: border-color 0.3s, transform 0.3s;
      }
      .team-card:hover { border-color: ${C.borderGold}; transform: translateY(-4px); }

      /* ── Gallery item ── */
      .gal-item {
        position: relative; overflow: hidden; border-radius: 10px;
        cursor: pointer;
      }
      .gal-item::after {
        content: ''; position: absolute; inset: 0;
        background: linear-gradient(to top, rgba(9,9,15,0.85) 0%, transparent 55%);
        opacity: 0; transition: opacity 0.3s;
      }
      .gal-item:hover::after { opacity: 1; }
      .gal-caption {
        position: absolute; bottom: 0; left: 0; right: 0; z-index: 2;
        padding: 16px 18px; opacity: 0; transition: opacity 0.3s;
        transform: translateY(8px); transition: opacity 0.3s, transform 0.3s;
      }
      .gal-item:hover .gal-caption { opacity: 1; transform: translateY(0); }

      /* ── Form field ── */
      .form-field {
        width: 100%; background: transparent;
        border: none; border-bottom: 1px solid ${C.border};
        padding: 14px 0; font-family: 'DM Sans', sans-serif;
        font-weight: 300; font-size: 15px; color: ${C.textHi};
        outline: none; transition: border-color 0.2s;
      }
      .form-field:focus { border-color: ${C.gold}; }
      .form-field::placeholder { color: ${C.textLow}; }

      /* ── Client tile ── */
      .client-tile {
        padding: 24px 20px; border: 1px solid ${C.border};
        border-radius: 8px; background: ${C.bg2};
        display: flex; flex-direction: column; align-items: center;
        gap: 10px; text-align: center;
        transition: border-color 0.25s, background 0.25s;
      }
      .client-tile:hover { border-color: ${C.borderGold}; background: ${C.bg3}; }

      @media (max-width: 639px) {
        .hide-mobile { display: none !important; }
        .show-mobile { display: flex !important; }
      }
      @media (min-width: 640px) {
        .show-mobile { display: none !important; }
      }
    `}</style>
  );
}

/* ═══════════════════════════════════════════════════════════
   DECORATIVE ORB  (pure CSS, no canvas)
═══════════════════════════════════════════════════════════ */
function Orb({ size = 480, style = {} }) {
  return (
    <div style={{
      width: size, height: size, position: "absolute", pointerEvents: "none",
      ...style,
    }}>
      {/* Outer ring */}
      <div style={{
        position: "absolute", inset: 0, borderRadius: "50%",
        border: `1px solid ${C.goldLine}`,
        animation: "rotateOrb 22s linear infinite",
      }}>
        <div style={{
          position: "absolute", top: "12%", left: "50%",
          width: 6, height: 6, borderRadius: "50%",
          background: C.gold, transform: "translateX(-50%)",
          boxShadow: `0 0 12px ${C.gold}`,
        }} />
      </div>
      {/* Middle ring */}
      <div style={{
        position: "absolute", inset: "14%", borderRadius: "50%",
        border: `1px solid rgba(201,168,76,0.12)`,
        animation: "rotateOrb 15s linear infinite reverse",
      }} />
      {/* Core glow */}
      <div style={{
        position: "absolute", inset: "28%", borderRadius: "50%",
        background: `radial-gradient(circle, rgba(201,168,76,0.12) 0%, transparent 70%)`,
        animation: "glowPulse 4s ease-in-out infinite",
      }} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SECTION EYEBROW
═══════════════════════════════════════════════════════════ */
function Eyebrow({ children }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
      <div style={{ width: 24, height: 1, background: C.gold }} />
      <span className="label">{children}</span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   NAV
═══════════════════════════════════════════════════════════ */
function Nav({ company }) {
  const { isMobile } = useBreakpoint();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen]         = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const navItems = [
    has(company.about)    && { id: "about",    label: "About"    },
    has(company.services) && { id: "services", label: "Services" },
    has(company.projects) && { id: "projects", label: "Work"     },
    has(company.members)  && { id: "team",     label: "Team"     },
    has(company.clients)  && { id: "clients",  label: "Clients"  },
    has(company.gallery)  && { id: "gallery",  label: "Gallery"  },
                             { id: "contact",  label: "Contact"  },
  ].filter(Boolean);

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 500,
      background: scrolled ? `rgba(9,9,15,0.92)` : "transparent",
      borderBottom: scrolled ? `1px solid ${C.border}` : "1px solid transparent",
      backdropFilter: scrolled ? "blur(20px)" : "none",
      WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
      transition: "all 0.35s ease",
    }}>
      <div className="wrap" style={{ height: 68, display: "flex", alignItems: "center", justifyContent: "space-between" }}>

        {/* Brand */}
        <a href="#" style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
          {has(company.logo) ? (
            <img src={company.logo} alt={company.companyName} style={{ height: 32, objectFit: "contain" }} />
          ) : (
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              background: `linear-gradient(135deg, ${C.goldDim}, ${C.gold})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: `0 0 16px ${C.goldGlow}`,
            }}>
              <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 13, color: C.bg0 }}>
                {ini(company.companyName)}
              </span>
            </div>
          )}
          <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 18, color: C.textHi, letterSpacing: "0.01em" }}>
            {company.companyName}
          </span>
        </a>

        {/* Desktop links */}
        {!isMobile && (
          <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
            {navItems.map(item => (
              <a key={item.id} href={`#${item.id}`} className="nav-link">{item.label}</a>
            ))}
          </div>
        )}

        {/* CTA / Hamburger */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {!isMobile && has(company.contacts?.email) && (
            <a href={`mailto:${company.contacts.email}`} className="btn-primary" style={{ padding: "10px 24px", fontSize: 12 }}>
              Let's Talk
            </a>
          )}
          {isMobile && (
            <button onClick={() => setOpen(o => !o)} aria-label="Toggle menu"
              style={{ background: "none", border: "none", cursor: "pointer", padding: 6, display: "flex", flexDirection: "column", gap: 5 }}>
              {[0, 1, 2].map(i => (
                <span key={i} style={{
                  display: "block", width: 22, height: 1.5,
                  background: open ? C.gold : C.textHi,
                  transition: "all 0.3s",
                  transform: open
                    ? (i === 0 ? "rotate(45deg) translate(5px,5px)"
                      : i === 2 ? "rotate(-45deg) translate(4px,-4px)" : "none")
                    : "none",
                  opacity: open && i === 1 ? 0 : 1,
                }} />
              ))}
            </button>
          )}
        </div>
      </div>

      {/* Mobile drawer */}
      {isMobile && open && (
        <div style={{ background: C.bg1, borderTop: `1px solid ${C.border}`, padding: "20px 24px 32px" }}>
          {navItems.map(item => (
            <a key={item.id} href={`#${item.id}`} onClick={() => setOpen(false)}
              style={{ display: "block", padding: "14px 0", borderBottom: `1px solid ${C.border}`, fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: 16, color: C.textMid, letterSpacing: "0.04em", transition: "color 0.2s" }}
              onMouseEnter={e => e.target.style.color = C.gold}
              onMouseLeave={e => e.target.style.color = C.textMid}>
              {item.label}
            </a>
          ))}
          {has(company.contacts?.email) && (
            <a href={`mailto:${company.contacts.email}`} className="btn-primary" style={{ marginTop: 24, display: "inline-flex" }}>
              Let's Talk
            </a>
          )}
        </div>
      )}
    </nav>
  );
}

/* ═══════════════════════════════════════════════════════════
   HERO
═══════════════════════════════════════════════════════════ */
function Hero({ company }) {
  const { isMobile, isTablet, isDesktop } = useBreakpoint();
  const addr = company.address || {};

  const tickerItems = [
    ...(has(company.tags) ? company.tags : []),
    has(company.industry) ? company.industry : null,
    has(company.businessPark) && company.businessPark !== "Other" ? company.businessPark : null,
    "Excellence",
    "Innovation",
  ].filter(Boolean);

  return (
    <section style={{
      minHeight: "100vh", paddingTop: 68, position: "relative", overflow: "hidden",
      background: `radial-gradient(ellipse 80% 60% at 65% 40%, rgba(201,168,76,0.06) 0%, transparent 60%), ${C.bg0}`,
      display: "flex", flexDirection: "column",
    }}>
      {/* Orb decoration — desktop only */}
      {isDesktop && (
        <Orb size={520} style={{ right: "4%", top: "50%", transform: "translateY(-50%)" }} />
      )}
      {/* Subtle grid overlay */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: `linear-gradient(${C.border} 1px, transparent 1px), linear-gradient(90deg, ${C.border} 1px, transparent 1px)`,
        backgroundSize: "60px 60px",
        maskImage: "radial-gradient(ellipse 70% 70% at 50% 50%, black 30%, transparent 100%)",
        WebkitMaskImage: "radial-gradient(ellipse 70% 70% at 50% 50%, black 30%, transparent 100%)",
      }} />

      {/* Main content */}
      <div className="wrap" style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: isMobile ? "60px 24px 40px" : "80px 64px", position: "relative", zIndex: 1 }}>

        <div style={{ maxWidth: isDesktop ? "62%" : "100%" }}>
          {/* Location badge */}
          {(has(company.businessPark) || has(addr.city)) && (
            <div className="fu" style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 32, padding: "8px 18px 8px 12px", background: C.goldGlow, border: `1px solid ${C.borderGold}`, borderRadius: 100 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.gold, boxShadow: `0 0 8px ${C.gold}` }} />
              <span className="label" style={{ fontSize: 10 }}>
                {[company.businessPark !== "Other" ? company.businessPark : null, addr.city].filter(Boolean).join(" · ")}
              </span>
            </div>
          )}

          {/* Headline */}
          <h1 className="display fu1" style={{ fontSize: isMobile ? "clamp(44px,12vw,68px)" : isTablet ? 72 : 96, marginBottom: 28, maxWidth: 760 }}>
            {has(company.tagline) ? (
              (() => {
                const parts = company.tagline.replace(/\.$/, "").split(/(?<=\s\w+)\s/);
                if (parts.length >= 2) {
                  const mid = Math.floor(parts.length / 2);
                  return (
                    <>
                      {parts.slice(0, mid).join(" ")}{" "}
                      <span className="display-italic">{parts.slice(mid).join(" ")}.</span>
                    </>
                  );
                }
                return company.tagline;
              })()
            ) : (
              company.companyName
            )}
          </h1>

          {/* About snippet */}
          {has(company.about) && (
            <p className="body fu2" style={{ fontSize: isMobile ? 15 : 17, maxWidth: 540, marginBottom: 40 }}>
              {company.about.length > 180 ? company.about.slice(0, 180) + "…" : company.about}
            </p>
          )}

          {/* CTAs */}
          <div className="fu3" style={{ display: "flex", flexWrap: "wrap", gap: 14, marginBottom: has(company.tags) ? 48 : 0 }}>
            {has(company.services) && (
              <a href="#services" className="btn-primary">
                Explore Services
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </a>
            )}
            <a href="#contact" className="btn-outline">Get In Touch</a>
          </div>

          {/* Tags */}
          {has(company.tags) && (
            <div className="fu4" style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {company.tags.map(t => (
                <span key={t} style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 400, fontSize: 12, color: C.textLow, padding: "5px 14px", border: `1px solid ${C.border}`, borderRadius: 100, letterSpacing: "0.04em" }}>
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Stats strip — shown on desktop inside hero, below on mobile */}
        {(has(company.foundedYear) || has(company.members) || has(company.clients) || has(company.projects)) && (
          <div style={{
            display: "grid",
            gridTemplateColumns: `repeat(${[
              has(company.foundedYear),
              has(company.members),
              has(company.clients),
              has(company.projects),
            ].filter(Boolean).length}, 1fr)`,
            gap: 0,
            marginTop: 64,
            borderTop: `1px solid ${C.border}`,
            paddingTop: 36,
            maxWidth: isDesktop ? "62%" : "100%",
          }}>
            {[
              has(company.foundedYear) && !isNaN(company.foundedYear) && { n: `${YR - company.foundedYear}+`, l: "Years" },
              has(company.members)  && { n: `${company.members.length}+`,  l: "Experts"  },
              has(company.clients)  && { n: `${company.clients.length}+`,  l: "Clients"  },
              has(company.projects) && { n: `${company.projects.length}+`, l: "Products" },
            ].filter(Boolean).map((s, i, arr) => (
              <div key={s.l} style={{
                padding: isMobile ? "0 16px 0 0" : "0 32px 0 0",
                borderRight: i < arr.length - 1 ? `1px solid ${C.border}` : "none",
                marginRight: i < arr.length - 1 ? (isMobile ? 16 : 32) : 0,
              }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: isMobile ? 36 : 48, color: C.textHi, lineHeight: 1, letterSpacing: "-0.02em" }}>
                  {s.n}
                </div>
                <span className="label" style={{ fontSize: 10, display: "block", marginTop: 6 }}>{s.l}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Ticker tape */}
      {tickerItems.length > 0 && (
        <div style={{ background: C.bg1, borderTop: `1px solid ${C.border}`, padding: "12px 0", overflow: "hidden", flexShrink: 0 }}>
          <div className="ticker-track">
            {[...Array(8)].map((_, i) => (
              <span key={i} style={{ display: "inline-flex", alignItems: "center" }}>
                {tickerItems.map((t, j) => (
                  <span key={j} style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: C.textLow, padding: "0 20px" }}>
                    {t}
                    <span style={{ color: C.goldDim, marginLeft: 20 }}>✦</span>
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   ABOUT
═══════════════════════════════════════════════════════════ */
function About({ company }) {
  const { isMobile, isDesktop } = useBreakpoint();
  const addr = company.address || {};

  const metaRows = [
    has(company.industry)    && ["Industry",  company.industry],
    has(company.companySize) && ["Team Size", company.companySize],
    has(company.foundedYear) && ["Founded",   String(company.foundedYear)],
    has(company.businessPark) && company.businessPark !== "Other" && ["Park", company.businessPark],
    has(addr.city)           && ["City",      addr.city],
    has(addr.pincode)        && ["Pincode",   addr.pincode],
  ].filter(Boolean);

  const addrStr = [addr.building, addr.street, addr.city, addr.state, addr.pincode].filter(Boolean).join(", ");

  return (
    <section id="about" style={{ background: C.bg1, padding: isMobile ? "80px 0" : "120px 0", borderTop: `1px solid ${C.border}` }}>
      <div className="wrap">
        <div style={{ display: "grid", gridTemplateColumns: isDesktop ? "1fr 1fr" : "1fr", gap: isMobile ? 48 : 80, alignItems: "start" }}>

          {/* Left */}
          <div>
            <Eyebrow>About Us</Eyebrow>
            <h2 className="display" style={{ fontSize: isMobile ? 40 : 56, marginBottom: 28 }}>
              Built to{" "}
              <span className="display-italic">last.</span>
            </h2>
            {has(company.about) && (
              <p className="body" style={{ fontSize: 16, marginBottom: 32 }}>{company.about}</p>
            )}
            {has(addrStr) && (
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 36, padding: "16px 20px", background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 8 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="1.5" style={{ flexShrink: 0, marginTop: 2 }}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <span className="body" style={{ fontSize: 13, color: C.textMid }}>{addrStr}</span>
              </div>
            )}
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              {has(company.website) && (
                <a href={company.website} target="_blank" rel="noreferrer" className="btn-primary">
                  Visit Website
                </a>
              )}
              <a href="#contact" className="btn-outline">Talk to Us</a>
            </div>
          </div>

          {/* Right: meta grid */}
          {metaRows.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {metaRows.map(([k, v]) => (
                <div key={k} className="glass-card" style={{ padding: "22px 20px" }}>
                  <span className="label" style={{ fontSize: 10, display: "block", marginBottom: 8 }}>{k}</span>
                  <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 18, color: C.textHi }}>{v}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   SERVICES
═══════════════════════════════════════════════════════════ */
function Services({ company }) {
  const { isMobile, isDesktop } = useBreakpoint();
  const [active, setActive] = useState(null);

  return (
    <section id="services" style={{ background: C.bg0, padding: isMobile ? "80px 0" : "120px 0", borderTop: `1px solid ${C.border}` }}>
      <div className="wrap">
        <div style={{ display: "grid", gridTemplateColumns: isDesktop ? "340px 1fr" : "1fr", gap: isMobile ? 40 : 80 }}>

          {/* Left sticky header */}
          <div style={{ position: isDesktop ? "sticky" : "relative", top: isDesktop ? 100 : 0, alignSelf: "start" }}>
            <Eyebrow>What We Do</Eyebrow>
            <h2 className="display" style={{ fontSize: isMobile ? 40 : 54, marginBottom: 20 }}>
              Our{" "}
              <span className="display-italic">expertise.</span>
            </h2>
            <p className="body" style={{ fontSize: 15 }}>
              {company.services.length} practice areas covering the full product lifecycle. Every engagement is led by senior specialists.
            </p>
          </div>

          {/* Right: accordion */}
          <div style={{ borderTop: `1px solid ${C.border}` }}>
            {company.services.map((s, i) => (
              <div key={i} className="svc-row"
                onClick={() => setActive(active === i ? null : i)}
                style={{ padding: isMobile ? "20px 0" : "24px 8px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                  <span className="label" style={{ fontSize: 10, minWidth: 28, color: C.goldDim }}>{String(i + 1).padStart(2, "0")}</span>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: isMobile ? 20 : 28, color: active === i ? C.gold : C.textHi, flex: 1, transition: "color 0.2s", letterSpacing: "-0.01em" }}>
                    {s.title}
                  </h3>
                  <div style={{
                    width: 32, height: 32, borderRadius: "50%",
                    border: `1px solid ${active === i ? C.gold : C.border}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 20, color: active === i ? C.gold : C.textLow,
                    transform: active === i ? "rotate(45deg)" : "none",
                    transition: "all 0.25s", flexShrink: 0,
                  }}>+</div>
                </div>
                {active === i && has(s.description) && (
                  <p className="body" style={{ fontSize: 14, marginTop: 14, paddingLeft: 48, maxWidth: 520 }}>
                    {s.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   PROJECTS
═══════════════════════════════════════════════════════════ */
function Projects({ company }) {
  const { isMobile, isDesktop } = useBreakpoint();
  const gradients = [
    `linear-gradient(135deg, #0d1117 0%, #1a2332 100%)`,
    `linear-gradient(135deg, #110d17 0%, #2a1a32 100%)`,
    `linear-gradient(135deg, #0d1711 0%, #1a3220 100%)`,
    `linear-gradient(135deg, #17110d 0%, #32261a 100%)`,
  ];

  return (
    <section id="projects" style={{ background: C.bg1, padding: isMobile ? "80px 0" : "120px 0", borderTop: `1px solid ${C.border}` }}>
      <div className="wrap">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 24, marginBottom: 56 }}>
          <div>
            <Eyebrow>Selected Work</Eyebrow>
            <h2 className="display" style={{ fontSize: isMobile ? 40 : 56 }}>
              Featured{" "}
              <span className="display-italic">projects.</span>
            </h2>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: isDesktop ? "1fr 1fr" : "1fr", gap: 20 }}>
          {company.projects.map((p, i) => (
            <a key={i} href={has(p.link) ? p.link : undefined}
              style={{ display: "block", background: gradients[i % gradients.length], border: `1px solid ${C.border}`, borderRadius: 14, overflow: "hidden", transition: "border-color 0.3s, transform 0.3s", textDecoration: "none", cursor: has(p.link) ? "pointer" : "default" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.borderGold; e.currentTarget.style.transform = "translateY(-4px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = "translateY(0)"; }}>
              <div style={{ padding: isMobile ? "28px 24px" : "36px 36px 32px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 8 }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    {has(p.category) && (
                      <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: 11, color: C.gold, letterSpacing: "0.14em", textTransform: "uppercase", padding: "4px 12px", border: `1px solid ${C.borderGold}`, borderRadius: 100 }}>
                        {p.category}
                      </span>
                    )}
                    {has(p.year) && (
                      <span className="label" style={{ fontSize: 10, color: C.textLow }}>{p.year}</span>
                    )}
                  </div>
                  {has(p.link) && (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.textLow} strokeWidth="1.5"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>
                  )}
                </div>

                <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: isMobile ? 60 : 80, color: "rgba(255,255,255,0.04)", lineHeight: 1, letterSpacing: "-0.04em", marginBottom: -8, userSelect: "none" }}>
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="display" style={{ fontSize: isMobile ? 30 : 40, marginBottom: 14 }}>{p.name}</h3>
                {has(p.description) && (
                  <p className="body" style={{ fontSize: 14 }}>{p.description}</p>
                )}
              </div>
              {/* Bottom gold accent line */}
              <div style={{ height: 2, background: `linear-gradient(90deg, ${C.gold}, transparent)`, opacity: 0.4 }} />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   TEAM
═══════════════════════════════════════════════════════════ */
function Team({ company }) {
  const { isMobile, isTablet, isDesktop } = useBreakpoint();
  const cols = isMobile ? 1 : isTablet ? 2 : 3;

  const avatarColors = ["#1a2a1a", "#2a1a1a", "#1a1a2a", "#2a2a1a", "#1a2a2a", "#2a1a2a"];

  return (
    <section id="team" style={{ background: C.bg0, padding: isMobile ? "80px 0" : "120px 0", borderTop: `1px solid ${C.border}` }}>
      <div className="wrap">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 24, marginBottom: 56 }}>
          <div>
            <Eyebrow>The People</Eyebrow>
            <h2 className="display" style={{ fontSize: isMobile ? 40 : 56 }}>
              Meet the{" "}
              <span className="display-italic">team.</span>
            </h2>
          </div>
          <p className="body" style={{ fontSize: 15, maxWidth: 380 }}>
            Senior experts, zero middlemen. You work directly with the people building your product.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 16 }}>
          {company.members.map((m, i) => (
            <div key={i} className="team-card"
              onClick={() => has(m.url) && window.open(m.url, "_blank")}
              style={{ cursor: has(m.url) ? "pointer" : "default" }}>
              {has(m.image) ? (
                <img src={m.image} alt={m.name} style={{ width: 52, height: 52, borderRadius: "50%", objectFit: "cover", marginBottom: 18, border: `2px solid ${C.border}` }} />
              ) : (
                <div style={{ width: 52, height: 52, borderRadius: "50%", background: avatarColors[i % avatarColors.length], border: `2px solid ${C.borderGold}`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18, boxShadow: `0 0 16px rgba(201,168,76,0.1)` }}>
                  <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 16, color: C.gold }}>
                    {ini(m.name)}
                  </span>
                </div>
              )}
              <span className="label" style={{ fontSize: 10, display: "block", marginBottom: 6 }}>0{i + 1}</span>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 18, color: C.textHi, marginBottom: 4, letterSpacing: "-0.01em" }}>{m.name}</h3>
              {has(m.position) && (
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 400, fontSize: 12, color: C.gold, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: has(m.bio) ? 12 : 0 }}>{m.position}</p>
              )}
              {has(m.bio) && (
                <p className="body" style={{ fontSize: 13, lineHeight: 1.7 }}>{m.bio}</p>
              )}
              {has(m.url) && (
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: 12, color: C.gold, marginTop: 14, display: "flex", alignItems: "center", gap: 6 }}>
                  View Profile
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   CLIENTS
═══════════════════════════════════════════════════════════ */
function Clients({ company }) {
  const { isMobile, isTablet, isDesktop } = useBreakpoint();
  const cols = isMobile ? 2 : isTablet ? 3 : 4;

  return (
    <section id="clients" style={{ background: C.bg1, padding: isMobile ? "80px 0" : "120px 0", borderTop: `1px solid ${C.border}` }}>
      <div className="wrap">
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <Eyebrow>Trusted By</Eyebrow>
          <h2 className="display" style={{ fontSize: isMobile ? 40 : 56 }}>
            Clients &{" "}
            <span className="display-italic">partners.</span>
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 12 }}>
          {company.clients.map((c, i) => (
            <div key={i} className="client-tile"
              onClick={() => has(c.website) && window.open(c.website, "_blank")}
              style={{ cursor: has(c.website) ? "pointer" : "default" }}>
              {has(c.logo) ? (
                <img src={c.logo} alt={c.name} style={{ height: 32, objectFit: "contain", filter: "brightness(0) invert(1)", opacity: 0.5 }} />
              ) : (
                <div style={{ width: 42, height: 42, borderRadius: "50%", background: C.bg3, border: `1px solid ${C.borderGold}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 14, color: C.gold }}>
                    {ini(c.name)}
                  </span>
                </div>
              )}
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: 13, color: C.textMid, letterSpacing: "0.02em" }}>{c.name}</span>
              {has(c.sector) && (
                <span className="label" style={{ fontSize: 9, color: C.textLow }}>{c.sector}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   GALLERY
═══════════════════════════════════════════════════════════ */
function Gallery({ company }) {
  const { isMobile, isTablet, isDesktop } = useBreakpoint();
  const shades = ["#1a1a2e", "#16213e", "#0f3460", "#1a2a1a", "#2a1a1a", "#1a1a1a"];

  return (
    <section id="gallery" style={{ background: C.bg0, padding: isMobile ? "80px 0" : "120px 0", borderTop: `1px solid ${C.border}` }}>
      <div className="wrap">
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <Eyebrow>{`Life at ${company.companyName}`}</Eyebrow>
          <h2 className="display" style={{ fontSize: isMobile ? 40 : 56 }}>
            Behind the{" "}
            <span className="display-italic">scenes.</span>
          </h2>
        </div>

        {/* Masonry-style grid */}
        {isDesktop ? (
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gridTemplateRows: "280px 280px", gap: 12 }}>
            {company.gallery.map((g, i) => (
              <div key={i} className="gal-item"
                style={{
                  gridColumn: i === 0 ? "1" : undefined,
                  gridRow: i === 0 ? "1 / 3" : undefined,
                  background: has(g.imageUrl) ? "transparent" : shades[i % shades.length],
                  border: `1px solid ${C.border}`,
                  minHeight: 140,
                }}>
                {has(g.imageUrl)
                  ? <img src={g.imageUrl} alt={g.caption || ""} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: i === 0 ? 110 : 64, color: "rgba(255,255,255,0.06)", lineHeight: 1 }}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                }
                <div className="gal-caption">
                  {has(g.tag) && <span className="label" style={{ fontSize: 9, display: "block", marginBottom: 4 }}>{g.tag}</span>}
                  {has(g.caption) && <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: 13, color: C.textHi }}>{g.caption}</p>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: isTablet ? "repeat(3,1fr)" : "repeat(2,1fr)", gap: 10 }}>
            {company.gallery.map((g, i) => (
              <div key={i} className="gal-item"
                style={{ height: 160, background: has(g.imageUrl) ? "transparent" : shades[i % shades.length], border: `1px solid ${C.border}` }}>
                {has(g.imageUrl)
                  ? <img src={g.imageUrl} alt={g.caption || ""} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 48, color: "rgba(255,255,255,0.06)" }}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                }
                <div className="gal-caption">
                  {has(g.caption) && <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: 12, color: C.textHi }}>{g.caption}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   CONTACT
═══════════════════════════════════════════════════════════ */
function Contact({ company }) {
  const { isMobile, isDesktop } = useBreakpoint();
  const [form, setForm]    = useState({ name: "", email: "", phone: "", message: "" });
  const [sent, setSent]    = useState(false);
  const [loading, setLoad] = useState(false);

  const contacts = company.contacts || {};
  const addr     = company.address  || {};

  const contactRows = [
    has(contacts.email) && { icon: "✉", label: "Email",    value: contacts.email,  href: `mailto:${contacts.email}` },
    has(contacts.phone) && { icon: "✆", label: "Phone",    value: contacts.phone,  href: `tel:${contacts.phone}`   },
    has(company.website) && { icon: "⊕", label: "Website", value: company.website.replace(/^https?:\/\//, ""), href: company.website },
    has(addr.city)      && { icon: "◎", label: "Location", value: [addr.building, addr.city].filter(Boolean).join(", ") },
  ].filter(Boolean);

  const socials = [
    has(contacts.linkedin)  && { label: "LinkedIn",  href: contacts.linkedin  },
    has(contacts.twitter)   && { label: "Twitter",   href: contacts.twitter   },
    has(contacts.instagram) && { label: "Instagram", href: contacts.instagram },
    has(contacts.whatsapp)  && { label: "WhatsApp",  href: `https://wa.me/${(contacts.whatsapp || "").replace(/\D/g, "")}` },
    has(contacts.facebook)  && { label: "Facebook",  href: contacts.facebook  },
  ].filter(Boolean);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoad(true);
    setTimeout(() => { setLoad(false); setSent(true); }, 1500);
  };

  return (
    <section id="contact" style={{ background: C.bg1, padding: isMobile ? "80px 0" : "120px 0", borderTop: `1px solid ${C.border}`, position: "relative", overflow: "hidden" }}>
      {/* Background orb */}
      {isDesktop && <Orb size={400} style={{ right: "-8%", bottom: "-20%", opacity: 0.5 }} />}

      <div className="wrap" style={{ position: "relative", zIndex: 1 }}>
        <div style={{ display: "grid", gridTemplateColumns: isDesktop ? "1fr 1fr" : "1fr", gap: isMobile ? 48 : 80 }}>

          {/* Left */}
          <div>
            <Eyebrow>Get In Touch</Eyebrow>
            <h2 className="display" style={{ fontSize: isMobile ? 44 : 64, marginBottom: 20, lineHeight: 1.05 }}>
              Let's build<br />
              <span className="display-italic">something great.</span>
            </h2>
            <p className="body" style={{ fontSize: 15, marginBottom: 48, maxWidth: 420 }}>
              Have a project in mind or want to explore what's possible? We'd love to hear from you. Usually respond within 24 hours.
            </p>

            {contactRows.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 0, marginBottom: 40, border: `1px solid ${C.border}`, borderRadius: 10, overflow: "hidden" }}>
                {contactRows.map(({ icon, label, value, href }, i) => (
                  <div key={label}
                    onClick={() => href && window.open(href, href.startsWith("mailto") || href.startsWith("tel") ? "_self" : "_blank")}
                    style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 20px", borderBottom: i < contactRows.length - 1 ? `1px solid ${C.border}` : "none", background: C.bg2, cursor: href ? "pointer" : "default", transition: "background 0.2s" }}
                    onMouseEnter={e => { if (href) e.currentTarget.style.background = C.bg3; }}
                    onMouseLeave={e => e.currentTarget.style.background = C.bg2}>
                    <span style={{ fontSize: 14, color: C.gold, width: 20, textAlign: "center" }}>{icon}</span>
                    <div>
                      <span className="label" style={{ fontSize: 9, display: "block", marginBottom: 2 }}>{label}</span>
                      <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 400, fontSize: 13, color: C.textMid }}>{value}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {socials.length > 0 && (
              <div>
                <span className="label" style={{ fontSize: 10, display: "block", marginBottom: 14 }}>Follow Us</span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                  {socials.map(({ label, href }) => (
                    <a key={label} href={href} target="_blank" rel="noreferrer"
                      style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: 12, color: C.textMid, letterSpacing: "0.08em", textTransform: "uppercase", padding: "8px 16px", border: `1px solid ${C.border}`, borderRadius: 4, transition: "all 0.2s" }}
                      onMouseEnter={e => { e.target.style.borderColor = C.gold; e.target.style.color = C.gold; }}
                      onMouseLeave={e => { e.target.style.borderColor = C.border; e.target.style.color = C.textMid; }}>
                      {label}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: form */}
          <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 14, padding: isMobile ? "28px 24px" : "44px 40px" }}>
            {sent ? (
              <div style={{ minHeight: 380, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
                <div style={{ width: 60, height: 60, borderRadius: "50%", border: `2px solid ${C.gold}`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20, boxShadow: `0 0 24px ${C.goldGlow}` }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <h3 className="display" style={{ fontSize: 32, marginBottom: 10 }}>Message Sent.</h3>
                <p className="body" style={{ fontSize: 14, maxWidth: 260 }}>We'll get back to you within 24 hours.</p>
                <button className="btn-outline" style={{ marginTop: 28 }} onClick={() => { setSent(false); setForm({ name: "", email: "", phone: "", message: "" }); }}>
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 28 }}>
                <div>
                  <span className="label" style={{ fontSize: 10, display: "block", marginBottom: 10 }}>Your Name *</span>
                  <input className="form-field" type="text" placeholder="Full name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
                </div>
                <div>
                  <span className="label" style={{ fontSize: 10, display: "block", marginBottom: 10 }}>Email Address *</span>
                  <input className="form-field" type="email" placeholder="you@company.com" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required />
                </div>
                <div>
                  <span className="label" style={{ fontSize: 10, display: "block", marginBottom: 10 }}>Phone</span>
                  <input className="form-field" type="tel" placeholder="+91 00000 00000" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
                </div>
                <div>
                  <span className="label" style={{ fontSize: 10, display: "block", marginBottom: 10 }}>Message *</span>
                  <textarea className="form-field" rows={isMobile ? 4 : 5} placeholder="Tell us about your project…" value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} required style={{ resize: "none" }} />
                </div>
                <button type="submit" className="btn-primary" disabled={loading}
                  style={{ alignSelf: "flex-start", opacity: loading ? 0.7 : 1, cursor: loading ? "not-allowed" : "pointer" }}>
                  {loading ? "Sending…" : "Send Message"}
                  {!loading && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   FOOTER
═══════════════════════════════════════════════════════════ */
function Footer({ company }) {
  const { isMobile } = useBreakpoint();
  const contacts  = company.contacts || {};
  const addr      = company.address  || {};
  const locStr    = [addr.city, addr.state, addr.country].filter(Boolean).join(", ");

  const navCols = [
    {
      heading: "Navigate",
      links: [
        has(company.about)    && { label: "About",    href: "#about"    },
        has(company.services) && { label: "Services", href: "#services" },
        has(company.projects) && { label: "Work",     href: "#projects" },
        has(company.members)  && { label: "Team",     href: "#team"     },
        has(company.clients)  && { label: "Clients",  href: "#clients"  },
        has(company.gallery)  && { label: "Gallery",  href: "#gallery"  },
                                 { label: "Contact",  href: "#contact"  },
      ].filter(Boolean),
    },
    {
      heading: "Connect",
      links: [
        has(contacts.linkedin)  && { label: "LinkedIn",  href: contacts.linkedin  },
        has(contacts.twitter)   && { label: "Twitter",   href: contacts.twitter   },
        has(contacts.instagram) && { label: "Instagram", href: contacts.instagram },
        has(contacts.whatsapp)  && { label: "WhatsApp",  href: `https://wa.me/${(contacts.whatsapp||"").replace(/\D/g,"")}` },
        has(company.website)    && { label: "Website",   href: company.website    },
      ].filter(Boolean),
    },
  ];

  return (
    <footer style={{ background: C.bg0, borderTop: `1px solid ${C.border}`, padding: isMobile ? "56px 0 28px" : "80px 0 36px" }}>
      <div className="wrap">
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "2fr 1fr 1fr", gap: isMobile ? 40 : 60, paddingBottom: 48, borderBottom: `1px solid ${C.border}` }}>

          {/* Brand col */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              {has(company.logo) ? (
                <img src={company.logo} alt={company.companyName} style={{ height: 28, objectFit: "contain" }} />
              ) : (
                <div style={{ width: 34, height: 34, borderRadius: "50%", background: `linear-gradient(135deg, ${C.goldDim}, ${C.gold})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 12, color: C.bg0 }}>
                    {ini(company.companyName)}
                  </span>
                </div>
              )}
              <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 17, color: C.textHi }}>
                {company.companyName}
              </span>
            </div>
            {has(company.about) && (
              <p className="body" style={{ fontSize: 13, maxWidth: 300, marginBottom: 16 }}>
                {company.about.slice(0, 110)}{company.about.length > 110 ? "…" : ""}
              </p>
            )}
            {has(locStr) && (
              <span className="label" style={{ fontSize: 10, color: C.textLow }}>{locStr}</span>
            )}
          </div>

          {/* Nav cols */}
          {navCols.map(col => (
            col.links.length > 0 && (
              <div key={col.heading}>
                <span className="label" style={{ fontSize: 10, color: C.textLow, display: "block", marginBottom: 20 }}>{col.heading}</span>
                {col.links.map(l => (
                  <a key={l.label} href={l.href} target={l.href?.startsWith("http") ? "_blank" : "_self"} rel="noreferrer"
                    style={{ display: "block", fontFamily: "'DM Sans', sans-serif", fontWeight: 400, fontSize: 14, color: C.textMid, marginBottom: 12, transition: "color 0.2s" }}
                    onMouseEnter={e => e.target.style.color = C.gold}
                    onMouseLeave={e => e.target.style.color = C.textMid}>
                    {l.label}
                  </a>
                ))}
              </div>
            )
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{ paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, fontSize: 12, color: C.textLow }}>
            © {YR} {company.companyName}. All rights reserved.
          </span>
          {(has(company.businessPark) || has(company.foundedYear)) && (
            <span className="label" style={{ fontSize: 10, color: C.textLow }}>
              {[
                company.businessPark !== "Other" ? company.businessPark : null,
                has(company.foundedYear) ? `Est. ${company.foundedYear}` : null,
              ].filter(Boolean).join(" · ")}
            </span>
          )}
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════════════════
   ROOT EXPORT
═══════════════════════════════════════════════════════════ */
export default function Company6({ data }) {
  const company = data && Object.keys(data).length > 0 ? data : DUMMY;

  return (
    <>
      <GlobalStyles />
      <Nav company={company} />
      <Hero company={company} />
      {has(company.about)    && <About    company={company} />}
      {has(company.services) && <Services company={company} />}
      {has(company.projects) && <Projects company={company} />}
      {has(company.members)  && <Team     company={company} />}
      {has(company.clients)  && <Clients  company={company} />}
      {has(company.gallery)  && <Gallery  company={company} />}
      <Contact company={company} />
      <Footer  company={company} />
    </>
  );
}