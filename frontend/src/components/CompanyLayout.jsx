import { useState, useEffect, useRef } from "react";

/* ─────────────────────────── DEMO DATA ─────────────────────────── */
const DEMO = {
  company: {
    name: "Nordvik",
    tagline: "Building Tomorrow's Infrastructure",
    description: "We design and engineer world-class software infrastructure for forward-thinking enterprises. From cloud architecture to developer tooling, we make complex systems simple.",
    founded: "2015",
    employees: "240+",
    clients: "80+",
    countries: "18",
    logo: null,
    email: "hello@nordvik.io",
    phone: "+1 (415) 882-0100",
    address: "580 Market Street, San Francisco, CA 94104",
    industry: "Enterprise Software",
  },
  services: [
    { icon: "◈", title: "Cloud Architecture", description: "Multi-cloud and hybrid infrastructure design built for scale, reliability, and zero-downtime deployments." },
    { icon: "◎", title: "Platform Engineering", description: "Internal developer platforms, CI/CD pipelines, and golden paths that multiply engineering velocity." },
    { icon: "◉", title: "Data Systems", description: "Real-time analytics pipelines, data warehousing, and ML infrastructure from prototype to production." },
    { icon: "◐", title: "Security & Compliance", description: "SOC 2, ISO 27001, and GDPR readiness embedded into every layer of your system." },
    { icon: "◑", title: "API Strategy", description: "Design-first API development, gateway management, and developer experience programs." },
    { icon: "◒", title: "Engineering Advisory", description: "Fractional CTO engagements, architecture reviews, and technical due diligence for investors." },
  ],
  stats: [
    { value: "99.99%", label: "Uptime SLA" },
    { value: "12ms", label: "Avg. Latency" },
    { value: "3×", label: "Faster Delivery" },
    { value: "$2.4B", label: "Client Revenue Managed" },
  ],
  team: [
    { name: "Elena Marsh", role: "Chief Executive Officer", photo: "https://randomuser.me/api/portraits/women/44.jpg" },
    { name: "James Okafor", role: "Chief Technology Officer", photo: "https://randomuser.me/api/portraits/men/32.jpg" },
    { name: "Priya Nair", role: "VP of Engineering", photo: "https://randomuser.me/api/portraits/women/68.jpg" },
    { name: "David Chen", role: "Head of Product", photo: "https://randomuser.me/api/portraits/men/75.jpg" },
  ],
  clients: ["Stripe", "Vercel", "Notion", "Linear", "Figma", "Airbnb", "Shopify", "Cloudflare"],
  testimonials: [
    {
      quote: "Nordvik cut our infrastructure costs by 40% and tripled our deployment frequency in under six months. Genuinely transformational.",
      author: "Sarah Kim", role: "VP Engineering", company: "Vercel",
    },
    {
      quote: "The team operates at a level I've never seen from an external partner. They think like founders, not consultants.",
      author: "Marcus Webb", role: "CTO", company: "Linear",
    },
  ],
  caseStudies: [
    { tag: "Cloud Migration", title: "Moving 400TB to Multi-Cloud Without a Single Hour of Downtime", metric: "0h downtime" },
    { tag: "Platform Eng.", title: "Building a Developer Platform That Reduced Deploy Time from 45min to 4min", metric: "11× faster" },
    { tag: "Data Systems", title: "Real-Time Analytics at 50M Events/Day for a Global Payments Provider", metric: "50M events/day" },
  ],
};

/* ─────────────────────────── HELPERS ─────────────────────────── */
function useInView(threshold = 0.12) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function Reveal({ children, delay = 0, dir = "up" }) {
  const [ref, vis] = useInView();
  const from = dir === "up" ? "translateY(22px)" : dir === "left" ? "translateX(-22px)" : "translateX(22px)";
  return (
    <div ref={ref} style={{
      opacity: vis ? 1 : 0,
      transform: vis ? "none" : from,
      transition: `opacity .65s ${delay}s, transform .65s ${delay}s`,
    }}>
      {children}
    </div>
  );
}

/* ─────────────────────────── THEME ─────────────────────────── */
const C = {
  bg: "#FAFAF8",
  surface: "#FFFFFF",
  dark: "#0D0F0E",
  navy: "#0F1923",
  accent: "#1A56FF",
  accentLight: "#EEF2FF",
  green: "#00C48C",
  rule: "#E8E6E0",
  text: "#0D0F0E",
  mid: "#6B7280",
  light: "#9CA3AF",
  white: "#FFFFFF",
};

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Epilogue:wght@300;400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500&display=swap');`;

const CSS = `
  ${FONTS}
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-thumb { background: ${C.accent}; border-radius: 2px; }
  @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:none} }
  @keyframes ticker { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
  @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
  .nav-link { transition: color .2s !important; }
  .nav-link:hover { color: ${C.accent} !important; }
  .svc-card:hover { border-color: ${C.accent} !important; background: ${C.accentLight} !important; }
  .svc-card { transition: all .25s ease !important; }
  .cs-card:hover { transform: translateY(-4px) !important; box-shadow: 0 20px 60px rgba(0,0,0,0.1) !important; }
  .cs-card { transition: all .3s ease !important; }
  .team-card:hover img { filter: grayscale(0%) !important; }
  .team-card img { transition: filter .3s ease !important; }
  .cta-btn:hover { background: ${C.accent} !important; color: white !important; transform: translateY(-1px) !important; }
  .cta-btn { transition: all .2s ease !important; }
  .outline-btn:hover { background: white !important; color: ${C.dark} !important; }
  .outline-btn { transition: all .2s ease !important; }
`;

/* ─────────────────────────── NAV ─────────────────────────────── */
function Nav({ company }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
      height: 68,
      background: scrolled ? "rgba(250,250,248,0.94)" : "transparent",
      backdropFilter: scrolled ? "blur(16px)" : "none",
      borderBottom: scrolled ? `1px solid ${C.rule}` : "none",
      transition: "all .35s ease",
      display: "flex", alignItems: "center",
      padding: "0 48px",
      gap: 40,
    }}>
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, flex: "0 0 auto" }}>
        <div style={{
          width: 32, height: 32, background: C.accent, borderRadius: 8,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{ width: 12, height: 12, background: "white", borderRadius: 3 }} />
        </div>
        <span style={{ fontFamily: "'Epilogue',sans-serif", fontWeight: 800, fontSize: 18, color: C.dark, letterSpacing: "-0.03em" }}>
          {company.name}
        </span>
      </div>

      {/* Links */}
      <div style={{ display: "flex", gap: 32, flex: 1, justifyContent: "center" }}>
        {["Services", "Work", "Team", "About", "Contact"].map(item => (
          <a key={item} href={`#${item.toLowerCase()}`} className="nav-link" style={{
            fontFamily: "'Epilogue',sans-serif", fontSize: 13, fontWeight: 500,
            color: C.mid, textDecoration: "none", letterSpacing: "0.01em",
          }}>
            {item}
          </a>
        ))}
      </div>

      {/* CTA */}
      <a href={`mailto:${company.email}`} style={{
        padding: "9px 20px",
        background: C.dark, color: "white",
        fontFamily: "'Epilogue',sans-serif", fontSize: 13, fontWeight: 600,
        textDecoration: "none", borderRadius: 8, letterSpacing: "0.01em",
        flexShrink: 0,
      }}>
        Get in Touch
      </a>
    </nav>
  );
}

/* ─────────────────────────── HERO ────────────────────────────── */
function Hero({ data }) {
  const { company, stats, clients } = data;
  const [on, setOn] = useState(false);
  useEffect(() => { const t = setTimeout(() => setOn(true), 80); return () => clearTimeout(t); }, []);

  return (
    <section style={{
      minHeight: "100vh",
      background: C.navy,
      display: "flex", flexDirection: "column",
      justifyContent: "flex-end",
      padding: "0 48px 0",
      position: "relative", overflow: "hidden",
    }}>
      {/* Dot grid */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)`,
        backgroundSize: "40px 40px",
      }} />
      {/* Blue glow */}
      <div style={{
        position: "absolute", top: "15%", right: "-5%",
        width: 600, height: 600, borderRadius: "50%",
        background: `radial-gradient(circle, rgba(26,86,255,0.18) 0%, transparent 65%)`,
        pointerEvents: "none",
      }} />
      {/* Green glow */}
      <div style={{
        position: "absolute", bottom: "20%", left: "-8%",
        width: 400, height: 400, borderRadius: "50%",
        background: `radial-gradient(circle, rgba(0,196,140,0.10) 0%, transparent 65%)`,
        pointerEvents: "none",
      }} />

      {/* Status bar */}
      <div style={{
        position: "absolute", top: 100, left: 48,
        opacity: on ? 1 : 0, transition: "opacity .8s .3s",
        display: "flex", alignItems: "center", gap: 8,
      }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.green, animation: "pulse 2s infinite" }} />
        <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, color: "rgba(255,255,255,0.5)", letterSpacing: "0.12em" }}>
          ACCEPTING NEW CLIENTS — {new Date().getFullYear()}
        </span>
      </div>

      {/* Hero copy */}
      <div style={{
        position: "relative", zIndex: 2,
        paddingTop: 180,
        paddingBottom: 64,
        maxWidth: 900,
      }}>
        <div style={{
          opacity: on ? 1 : 0,
          transform: on ? "none" : "translateY(30px)",
          transition: "all .9s .25s",
        }}>
          <h1 style={{
            fontFamily: "'Instrument Serif',serif",
            fontSize: "clamp(56px,8.5vw,120px)",
            color: "white", lineHeight: 1.0,
            letterSpacing: "-0.02em",
            marginBottom: 32,
          }}>
            {company.tagline.split(" ").map((word, i) => (
              <span key={i} style={{
                display: i === 1 ? "inline" : "inline",
                color: i === 1 ? C.accent : "white",
              }}>
                {word}{" "}
              </span>
            ))}
          </h1>
        </div>

        <div style={{ opacity: on ? 1 : 0, transition: "opacity .9s .45s" }}>
          <p style={{
            fontFamily: "'Epilogue',sans-serif",
            fontSize: 18, lineHeight: 1.75, fontWeight: 300,
            color: "rgba(255,255,255,0.6)",
            maxWidth: 540, marginBottom: 40,
          }}>
            {company.description}
          </p>
        </div>

        <div style={{
          display: "flex", gap: 14, flexWrap: "wrap",
          opacity: on ? 1 : 0, transition: "opacity .9s .6s",
        }}>
          <a href="#services" className="cta-btn" style={{
            padding: "14px 32px",
            background: C.accent, color: "white",
            fontFamily: "'Epilogue',sans-serif", fontSize: 14, fontWeight: 700,
            textDecoration: "none", borderRadius: 8,
            letterSpacing: "-0.01em",
          }}>
            Explore Services →
          </a>
          <a href="#work" className="outline-btn" style={{
            padding: "14px 32px",
            border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.8)",
            fontFamily: "'Epilogue',sans-serif", fontSize: 14, fontWeight: 500,
            textDecoration: "none", borderRadius: 8,
          }}>
            View Case Studies
          </a>
        </div>

        {/* Stats row */}
        <div style={{
          display: "flex", gap: 0, marginTop: 72, flexWrap: "wrap",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          opacity: on ? 1 : 0, transition: "opacity .9s .75s",
        }}>
          {stats.map((s, i) => (
            <div key={i} style={{
              padding: "28px 40px 24px 0",
              marginRight: 40,
              borderRight: i < stats.length - 1 ? "1px solid rgba(255,255,255,0.08)" : "none",
              paddingRight: i < stats.length - 1 ? 40 : 0,
            }}>
              <div style={{ fontFamily: "'Instrument Serif',serif", fontSize: 36, color: "white", lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: "rgba(255,255,255,0.4)", marginTop: 6, letterSpacing: "0.1em" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Client ticker strip */}
      <div style={{
        borderTop: "1px solid rgba(255,255,255,0.07)",
        padding: "16px 0",
        overflow: "hidden",
        margin: "0 -48px",
        opacity: on ? 1 : 0, transition: "opacity 1s 1s",
      }}>
        <div style={{ display: "flex", gap: 56, animation: "ticker 18s linear infinite", whiteSpace: "nowrap" }}>
          {[...clients, ...clients, ...clients, ...clients].map((c, i) => (
            <span key={i} style={{ fontFamily: "'Epilogue',sans-serif", fontWeight: 700, fontSize: 14, color: "rgba(255,255,255,0.2)", letterSpacing: "0.05em" }}>
              {c}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── ABOUT STRIP ────────────────────────── */
function AboutStrip({ company }) {
  const facts = [
    { label: "Founded", val: company.founded },
    { label: "Team Size", val: company.employees },
    { label: "Clients", val: company.clients },
    { label: "Countries", val: company.countries },
    { label: "Industry", val: company.industry },
  ];
  return (
    <section id="about" style={{
      background: C.surface, borderBottom: `1px solid ${C.rule}`,
      display: "flex", overflow: "hidden",
    }}>
      {facts.map((f, i) => (
        <Reveal key={i} delay={i * 0.07}>
          <div style={{
            padding: "36px 40px",
            borderRight: i < facts.length - 1 ? `1px solid ${C.rule}` : "none",
            flex: "1 1 160px",
            minWidth: 130,
          }}>
            <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: C.light, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>{f.label}</div>
            <div style={{ fontFamily: "'Instrument Serif',serif", fontSize: 26, color: C.dark }}>{f.val}</div>
          </div>
        </Reveal>
      ))}
    </section>
  );
}

/* ─────────────────────────── SERVICES ────────────────────────── */
function Services({ services }) {
  return (
    <section id="services" style={{ background: C.bg, padding: "100px 48px" }}>
      {/* Header */}
      <Reveal>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 64, flexWrap: "wrap", gap: 20 }}>
          <div>
            <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: C.accent, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 12 }}>
              — 01 / WHAT WE DO
            </div>
            <h2 style={{ fontFamily: "'Instrument Serif',serif", fontSize: "clamp(40px,5.5vw,72px)", color: C.dark, lineHeight: 1.05, letterSpacing: "-0.02em" }}>
              Services &<br /><em>Capabilities</em>
            </h2>
          </div>
          <p style={{ fontFamily: "'Epilogue',sans-serif", fontSize: 15, color: C.mid, lineHeight: 1.75, maxWidth: 360, fontWeight: 300 }}>
            We bring deep expertise across the full infrastructure stack, from design through deployment and beyond.
          </p>
        </div>
      </Reveal>

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: 2, background: C.rule }}>
        {services.map((s, i) => (
          <Reveal key={i} delay={i * 0.06}>
            <div className="svc-card" style={{
              background: C.surface, padding: "36px 32px",
              cursor: "default", border: "2px solid transparent",
            }}>
              <div style={{ fontSize: 24, marginBottom: 20, color: C.accent }}>{s.icon}</div>
              <h3 style={{ fontFamily: "'Epilogue',sans-serif", fontWeight: 700, fontSize: 17, color: C.dark, marginBottom: 12, letterSpacing: "-0.01em" }}>
                {s.title}
              </h3>
              <p style={{ fontFamily: "'Epilogue',sans-serif", fontSize: 13, color: C.mid, lineHeight: 1.75, fontWeight: 300 }}>
                {s.description}
              </p>
              <div style={{ marginTop: 24, display: "flex", alignItems: "center", gap: 6, fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: C.accent, letterSpacing: "0.1em" }}>
                LEARN MORE →
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────── CASE STUDIES ────────────────────────── */
function CaseStudies({ caseStudies }) {
  return (
    <section id="work" style={{ background: C.dark, padding: "100px 48px" }}>
      <Reveal>
        <div style={{ marginBottom: 64 }}>
          <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: C.accent, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 12 }}>
            — 02 / CASE STUDIES
          </div>
          <h2 style={{ fontFamily: "'Instrument Serif',serif", fontSize: "clamp(40px,5.5vw,72px)", color: "white", lineHeight: 1.05, letterSpacing: "-0.02em" }}>
            Selected<br /><em style={{ color: C.accent }}>Work</em>
          </h2>
        </div>
      </Reveal>

      <div style={{ display: "flex", flexDirection: "column", gap: 2, background: "rgba(255,255,255,0.04)" }}>
        {caseStudies.map((cs, i) => (
          <Reveal key={i} delay={i * 0.1}>
            <div className="cs-card" style={{
              background: "#131615",
              padding: "44px 48px",
              display: "grid",
              gridTemplateColumns: "140px 1fr auto",
              alignItems: "center", gap: 40,
              cursor: "pointer",
              boxShadow: "none",
            }}>
              <div>
                <span style={{
                  display: "inline-block",
                  padding: "4px 10px",
                  background: C.accentLight, color: C.accent,
                  fontFamily: "'IBM Plex Mono',monospace", fontSize: 10,
                  letterSpacing: "0.08em", textTransform: "uppercase",
                  borderRadius: 4,
                }}>
                  {cs.tag}
                </span>
              </div>
              <h3 style={{
                fontFamily: "'Instrument Serif',serif", fontSize: 22,
                color: "white", fontWeight: 400, lineHeight: 1.3,
              }}>
                {cs.title}
              </h3>
              <div style={{
                textAlign: "right",
                fontFamily: "'Instrument Serif',serif",
                fontSize: 28, color: C.green, whiteSpace: "nowrap",
              }}>
                {cs.metric}
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.3}>
        <div style={{ marginTop: 48, textAlign: "center" }}>
          <a href="#contact" style={{
            padding: "14px 36px",
            border: "1px solid rgba(255,255,255,0.15)",
            color: "rgba(255,255,255,0.7)",
            fontFamily: "'Epilogue',sans-serif", fontSize: 13, fontWeight: 500,
            textDecoration: "none", borderRadius: 8, display: "inline-block",
          }}>
            Discuss your project →
          </a>
        </div>
      </Reveal>
    </section>
  );
}

/* ─────────────────────────── TESTIMONIALS ────────────────────────── */
function Testimonials({ testimonials }) {
  const [active, setActive] = useState(0);
  const t = testimonials[active];
  return (
    <section style={{ background: C.accentLight, padding: "100px 48px" }}>
      <Reveal>
        <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: C.accent, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 48 }}>
          — 03 / CLIENT VOICES
        </div>
      </Reveal>
      <Reveal>
        <div style={{ maxWidth: 780 }}>
          <div style={{ fontFamily: "'Instrument Serif',serif", fontSize: "clamp(22px,3.5vw,36px)", color: C.dark, lineHeight: 1.55, fontStyle: "italic", marginBottom: 32 }}>
            "{t.quote}"
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 42, height: 42, borderRadius: "50%", background: C.accent, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Epilogue',sans-serif", fontWeight: 700, fontSize: 16, color: "white" }}>
              {t.author[0]}
            </div>
            <div>
              <div style={{ fontFamily: "'Epilogue',sans-serif", fontWeight: 600, fontSize: 14, color: C.dark }}>{t.author}</div>
              <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: C.mid, letterSpacing: "0.06em" }}>{t.role}, {t.company}</div>
            </div>
            <div style={{ flex: 1 }} />
            <div style={{ display: "flex", gap: 8 }}>
              {testimonials.map((_, i) => (
                <button key={i} onClick={() => setActive(i)} style={{
                  width: i === active ? 24 : 8, height: 8, borderRadius: 4,
                  background: i === active ? C.accent : "rgba(26,86,255,0.2)",
                  border: "none", cursor: "pointer", transition: "all .25s",
                }} />
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ─────────────────────────── TEAM ────────────────────────────── */
function Team({ team }) {
  return (
    <section id="team" style={{ background: C.surface, padding: "100px 48px" }}>
      <Reveal>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 64, flexWrap: "wrap", gap: 20 }}>
          <div>
            <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: C.accent, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 12 }}>
              — 04 / THE TEAM
            </div>
            <h2 style={{ fontFamily: "'Instrument Serif',serif", fontSize: "clamp(40px,5.5vw,72px)", color: C.dark, lineHeight: 1.05, letterSpacing: "-0.02em" }}>
              Leadership
            </h2>
          </div>
          <p style={{ fontFamily: "'Epilogue',sans-serif", fontSize: 15, color: C.mid, lineHeight: 1.75, maxWidth: 340, fontWeight: 300 }}>
            A team of engineers, designers, and operators who've built at Stripe, Google, AWS, and beyond.
          </p>
        </div>
      </Reveal>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 24 }}>
        {team.map((member, i) => (
          <Reveal key={i} delay={i * 0.08}>
            <div className="team-card" style={{ cursor: "default" }}>
              <div style={{ position: "relative", marginBottom: 16, overflow: "hidden", borderRadius: 12 }}>
                <img
                  src={member.photo}
                  alt={member.name}
                  style={{
                    width: "100%",
                    aspectRatio: "4/5",
                    objectFit: "cover",
                    filter: "grayscale(80%)",
                    display: "block",
                  }}
                />
                <div style={{
                  position: "absolute", bottom: 0, left: 0, right: 0,
                  height: 3, background: `linear-gradient(90deg, ${C.accent}, ${C.green})`,
                }} />
              </div>
              <h3 style={{ fontFamily: "'Epilogue',sans-serif", fontWeight: 700, fontSize: 15, color: C.dark, marginBottom: 4 }}>{member.name}</h3>
              <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: C.mid, letterSpacing: "0.06em" }}>{member.role}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────── CTA BAND ────────────────────────── */
function CTABand({ company }) {
  return (
    <section style={{
      background: `linear-gradient(135deg, ${C.accent} 0%, #0040CC 100%)`,
      padding: "80px 48px",
      display: "flex", justifyContent: "space-between",
      alignItems: "center", flexWrap: "wrap", gap: 32,
    }}>
      <Reveal dir="left">
        <h2 style={{
          fontFamily: "'Instrument Serif',serif",
          fontSize: "clamp(32px,5vw,60px)",
          color: "white", lineHeight: 1.1, letterSpacing: "-0.02em",
        }}>
          Ready to build<br /><em>something great?</em>
        </h2>
      </Reveal>
      <Reveal dir="right">
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          <a href={`mailto:${company.email}`} style={{
            padding: "14px 36px",
            background: "white", color: C.accent,
            fontFamily: "'Epilogue',sans-serif", fontSize: 14, fontWeight: 700,
            textDecoration: "none", borderRadius: 8,
          }}>
            Start a Project →
          </a>
          <a href={`tel:${company.phone}`} style={{
            padding: "14px 36px",
            border: "1px solid rgba(255,255,255,0.4)", color: "white",
            fontFamily: "'Epilogue',sans-serif", fontSize: 14, fontWeight: 500,
            textDecoration: "none", borderRadius: 8,
          }}>
            {company.phone}
          </a>
        </div>
      </Reveal>
    </section>
  );
}

/* ─────────────────────────── CONTACT ────────────────────────── */
function Contact({ company }) {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  return (
    <section id="contact" style={{ background: C.dark, padding: "100px 48px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "start", maxWidth: 1100, margin: "0 auto" }}>

        {/* Left */}
        <Reveal dir="left">
          <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: C.accent, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 16 }}>
            — 05 / CONTACT
          </div>
          <h2 style={{ fontFamily: "'Instrument Serif',serif", fontSize: "clamp(36px,5vw,64px)", color: "white", lineHeight: 1.05, letterSpacing: "-0.02em", marginBottom: 40 }}>
            Get in<br /><em style={{ color: C.accent }}>Touch</em>
          </h2>

          {/* Contact details */}
          <div style={{ display: "flex", flexDirection: "column", gap: 0, border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, overflow: "hidden" }}>
            {[
              { label: "Email", val: company.email, href: `mailto:${company.email}` },
              { label: "Phone", val: company.phone, href: `tel:${company.phone}` },
              { label: "Office", val: company.address, href: null },
            ].map((r, i) => (
              <div key={i} style={{
                padding: "20px 24px",
                borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.07)" : "none",
                display: "flex", justifyContent: "space-between", alignItems: "center",
                gap: 16,
              }}>
                <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em", textTransform: "uppercase", flexShrink: 0 }}>
                  {r.label}
                </span>
                {r.href
                  ? <a href={r.href} style={{ fontFamily: "'Epilogue',sans-serif", fontSize: 13, color: "rgba(255,255,255,0.7)", textDecoration: "none", textAlign: "right" }}>{r.val}</a>
                  : <span style={{ fontFamily: "'Epilogue',sans-serif", fontSize: 13, color: "rgba(255,255,255,0.7)", textAlign: "right" }}>{r.val}</span>
                }
              </div>
            ))}
          </div>
        </Reveal>

        {/* Right: form */}
        <Reveal dir="right">
          {sent ? (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: C.green, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 22, color: "white" }}>✓</div>
              <h3 style={{ fontFamily: "'Instrument Serif',serif", fontSize: 28, color: "white", marginBottom: 8 }}>Message Sent!</h3>
              <p style={{ fontFamily: "'Epilogue',sans-serif", fontSize: 14, color: "rgba(255,255,255,0.5)" }}>We'll be in touch within 1 business day.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { key: "name", label: "Your Name", placeholder: "Jane Smith", type: "text" },
                { key: "email", label: "Email Address", placeholder: "jane@company.com", type: "email" },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ display: "block", fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: "rgba(255,255,255,0.4)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>{f.label}</label>
                  <input
                    type={f.type}
                    placeholder={f.placeholder}
                    value={form[f.key]}
                    onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    style={{ width: "100%", padding: "12px 16px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontFamily: "'Epilogue',sans-serif", fontSize: 14, color: "white", outline: "none" }}
                    onFocus={e => e.target.style.borderColor = C.accent}
                    onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
                  />
                </div>
              ))}
              <div>
                <label style={{ display: "block", fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: "rgba(255,255,255,0.4)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>Message</label>
                <textarea
                  placeholder="Tell us about your project…"
                  value={form.message}
                  onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                  rows={4}
                  style={{ width: "100%", padding: "12px 16px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontFamily: "'Epilogue',sans-serif", fontSize: 14, color: "white", outline: "none", resize: "vertical" }}
                  onFocus={e => e.target.style.borderColor = C.accent}
                  onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
                />
              </div>
              <button
                onClick={() => { if (form.name && form.email) setSent(true); }}
                style={{ padding: "14px", background: C.accent, color: "white", border: "none", borderRadius: 8, fontFamily: "'Epilogue',sans-serif", fontSize: 14, fontWeight: 700, cursor: "pointer", marginTop: 4, letterSpacing: "-0.01em" }}
                onMouseEnter={e => e.currentTarget.style.opacity = ".85"}
                onMouseLeave={e => e.currentTarget.style.opacity = "1"}
              >
                Send Message →
              </button>
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}

/* ─────────────────────────── FOOTER ────────────────────────── */
function Footer({ company }) {
  return (
    <footer style={{
      background: "#09100D",
      padding: "48px",
      display: "flex", justifyContent: "space-between",
      alignItems: "center", flexWrap: "wrap", gap: 16,
      borderTop: "1px solid rgba(255,255,255,0.05)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 28, height: 28, background: C.accent, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 10, height: 10, background: "white", borderRadius: 2 }} />
        </div>
        <span style={{ fontFamily: "'Epilogue',sans-serif", fontWeight: 800, fontSize: 16, color: "white", letterSpacing: "-0.02em" }}>{company.name}</span>
      </div>
      <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
        {["Services", "Work", "Team", "Contact"].map(l => (
          <a key={l} href={`#${l.toLowerCase()}`} style={{ fontFamily: "'Epilogue',sans-serif", fontSize: 12, color: "rgba(255,255,255,0.35)", textDecoration: "none", letterSpacing: "0.03em" }}>{l}</a>
        ))}
      </div>
      <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: "rgba(255,255,255,0.2)", letterSpacing: "0.1em" }}>
        © {new Date().getFullYear()} {company.name}. All rights reserved.
      </span>
    </footer>
  );
}

/* ─────────────────────────── ROOT ──────────────────────────────── */
/**
 * CompanyWebsite
 *
 * Props:
 *   data – full company data object (uses DEMO if omitted)
 *
 * Usage:
 *   <CompanyWebsite data={yourData} />
 *   <CompanyWebsite />   // renders demo
 */
export default function CompanyWebsite({ data = DEMO }) {
  return (
    <div style={{ background: C.bg, color: C.text, minHeight: "100vh", overflowX: "hidden" }}>
      <style>{CSS}</style>
      <Nav company={data.company} />
      <Hero data={data} />
      <AboutStrip company={data.company} />
      <Services services={data.services} />
      <CaseStudies caseStudies={data.caseStudies} />
      <Testimonials testimonials={data.testimonials} />
      <Team team={data.team} />
      <CTABand company={data.company} />
      <Contact company={data.company} />
      <Footer company={data.company} />
    </div>
  );
}