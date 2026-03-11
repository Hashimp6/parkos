import { useState, useEffect, useRef } from "react";

/* ─────────────────────────── DEMO DATA ─────────────────────────── */
const DEMO = {
  name: "Alex Smith",
  email: "alex@example.com",
  phone: "+1 (555) 234-5678",
  place: "San Francisco, CA",
  profilePhoto: "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-profiles/avatar-1.webp",
  cv: "",
  about:
    "I craft fast, accessible, and beautiful web experiences. Passionate about clean code, thoughtful UI, and turning complex problems into elegant solutions that live at the intersection of design and engineering.",
  tagline: "Frontend Developer",
  qualification: "B.Sc. Computer Science",
  services: [
    { heading: "UI Development", description: "Pixel-perfect interfaces built with React, Tailwind, and modern CSS." },
    { heading: "Performance", description: "Lighthouse in the green. Lazy-loading, code-splitting, edge delivery." },
    { heading: "Design Systems", description: "Scalable component libraries with Storybook, tokens, Figma handoffs." },
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

/* ─────────────────────────── HELPERS ───────────────────────────── */
const fmt = (d) =>
  d ? new Date(d).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "Now";

function useInView(threshold = 0.1) {
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

/* ─────────────────────────── THEME ─────────────────────────────── */
const C = {
  bg: "#F4F1EB",
  paper: "#FDFAF4",
  red: "#D72B2B",
  redLight: "#fde8e8",
  ink: "#1A1714",
  mid: "#6B6459",
  light: "#C8C0B4",
  rule: "#DDD8CF",
  white: "#FFFFFF",
};

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=DM+Mono:ital,wght@0,400;0,500;1,400&family=Libre+Franklin:wght@300;400;500;600&display=swap');`;

const CSS = `
  ${FONTS}
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-thumb { background: ${C.red}; border-radius: 2px; }

  @keyframes slideIn { from { opacity:0; transform:translateX(-16px); } to { opacity:1; transform:none; } }
  @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:none; } }
  @keyframes drawLine { from { transform: scaleX(0); } to { transform: scaleX(1); } }
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

  .nav-link:hover { color: ${C.red} !important; }
  .svc-card:hover { background: ${C.white} !important; box-shadow: 4px 4px 0 ${C.red} !important; transform: translate(-2px,-2px); }
  .svc-card { transition: all .2s ease !important; }
  .exp-row:hover .exp-title { color: ${C.red} !important; }
  .exp-row:hover { background: ${C.white} !important; }
  .skill-pill:hover { background: ${C.red} !important; color: ${C.white} !important; border-color: ${C.red} !important; }
  .skill-pill { transition: all .15s ease !important; }
  .vacancy-item:hover { background: ${C.red} !important; color: ${C.white} !important; }
  .vacancy-item { transition: all .2s ease !important; }
  .contact-row:hover .contact-value { color: ${C.red} !important; }
`;

/* ─────────────────────────── ATOMS ─────────────────────────────── */
function Eyebrow({ children, num }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
      {num && (
        <span style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 10, color: C.red, letterSpacing: "0.05em",
        }}>
          {num}
        </span>
      )}
      <div style={{ flex: 1, height: 1, background: C.red }} />
      <span style={{
        fontFamily: "'DM Mono', monospace",
        fontSize: 10, letterSpacing: "0.18em",
        textTransform: "uppercase", color: C.mid,
      }}>
        {children}
      </span>
    </div>
  );
}

function Reveal({ children, delay = 0, x = false }) {
  const [ref, vis] = useInView();
  return (
    <div ref={ref} style={{
      opacity: vis ? 1 : 0,
      transform: vis ? "none" : x ? "translateX(-16px)" : "translateY(18px)",
      transition: `opacity .55s ${delay}s, transform .55s ${delay}s`,
    }}>
      {children}
    </div>
  );
}

function Divider() {
  return <div style={{ height: 1, background: C.rule, margin: "0" }} />;
}

/* ─────────────────────────── NAV ───────────────────────────────── */
function Nav({ c }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled ? "rgba(244,241,235,0.95)" : "transparent",
      backdropFilter: scrolled ? "blur(12px)" : "none",
      borderBottom: scrolled ? `1px solid ${C.rule}` : "none",
      transition: "all .3s ease",
      padding: "0 48px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      height: 60,
    }}>
      <div style={{
        fontFamily: "'Playfair Display', serif",
        fontWeight: 900, fontSize: 17,
        color: C.ink, letterSpacing: "-0.01em",
      }}>
        {c.name?.split(" ")[0]}<span style={{ color: C.red }}>.</span>
      </div>

      <div style={{ display: "flex", gap: 32 }}>
        {["Work", "Education", "Contact"].map(item => (
          <a key={item} href={`#${item.toLowerCase()}`} className="nav-link" style={{
            fontFamily: "'Libre Franklin', sans-serif",
            fontSize: 12, fontWeight: 500,
            color: C.mid, textDecoration: "none",
            letterSpacing: "0.08em", textTransform: "uppercase",
            transition: "color .2s",
          }}>
            {item}
          </a>
        ))}
      </div>

      <div style={{
        fontFamily: "'DM Mono', monospace",
        fontSize: 10, color: C.light, letterSpacing: "0.12em",
      }}>
        {c.tagline?.toUpperCase()}
      </div>
    </nav>
  );
}

/* ─────────────────────────── HERO ──────────────────────────────── */
function Hero({ c }) {
  const [on, setOn] = useState(false);
  useEffect(() => { const t = setTimeout(() => setOn(true), 80); return () => clearTimeout(t); }, []);

  return (
    <section style={{
      minHeight: "100vh",
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      background: C.paper,
      borderBottom: `1px solid ${C.rule}`,
      overflow: "hidden",
    }}>
      {/* LEFT: text */}
      <div style={{
        padding: "120px 48px 80px",
        display: "flex", flexDirection: "column", justifyContent: "flex-end",
        borderRight: `1px solid ${C.rule}`,
        position: "relative",
      }}>
        {/* Issue / date tag */}
        <div style={{
          position: "absolute", top: 80, left: 48,
          opacity: on ? 1 : 0, transition: "opacity .8s .2s",
        }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: C.red, padding: "5px 12px",
          }}>
            <div style={{
              width: 6, height: 6, borderRadius: "50%",
              background: C.white,
              animation: "spin 2s linear infinite",
            }} />
            <span style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 10, color: C.white, letterSpacing: "0.15em",
            }}>
              AVAILABLE FOR WORK
            </span>
          </div>
        </div>

        {/* Name */}
        <div style={{
          opacity: on ? 1 : 0,
          transform: on ? "none" : "translateY(24px)",
          transition: "all .8s .3s",
        }}>
          {c.name?.split(" ").map((word, i) => (
            <div key={i} style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 900,
              fontSize: "clamp(58px, 9vw, 120px)",
              lineHeight: 0.92,
              color: i === 1 ? C.red : C.ink,
              letterSpacing: "-0.03em",
            }}>
              {word}
            </div>
          ))}
        </div>

        {/* About */}
        {c.about && (
          <p style={{
            fontFamily: "'Libre Franklin', sans-serif",
            fontSize: 15, lineHeight: 1.75,
            color: C.mid, marginTop: 32, maxWidth: 400,
            fontWeight: 300,
            opacity: on ? 1 : 0,
            transition: "opacity .8s .5s",
          }}>
            {c.about}
          </p>
        )}

        {/* CTA row */}
        <div style={{
          marginTop: 40, display: "flex", gap: 12, flexWrap: "wrap",
          opacity: on ? 1 : 0, transition: "opacity .8s .65s",
        }}>
          {c.cv && (
            <a href={c.cv} download style={{
              padding: "12px 28px",
              background: C.ink, color: C.white,
              fontFamily: "'Libre Franklin', sans-serif",
              fontSize: 12, fontWeight: 600,
              letterSpacing: "0.1em", textTransform: "uppercase",
              textDecoration: "none",
            }}>
              Download CV
            </a>
          )}
          {c.email && (
            <a href={`mailto:${c.email}`} style={{
              padding: "12px 28px",
              border: `1px solid ${C.ink}`, color: C.ink,
              fontFamily: "'Libre Franklin', sans-serif",
              fontSize: 12, fontWeight: 600,
              letterSpacing: "0.1em", textTransform: "uppercase",
              textDecoration: "none",
            }}>
              Say Hello →
            </a>
          )}
        </div>

        {/* Bottom meta strip */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          borderTop: `1px solid ${C.rule}`,
          padding: "14px 48px",
          display: "flex", gap: 24, flexWrap: "wrap",
          opacity: on ? 1 : 0, transition: "opacity .8s .75s",
        }}>
          {c.place && (
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: C.light, letterSpacing: "0.1em" }}>
              📍 {c.place}
            </span>
          )}
          {c.qualification && (
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: C.light, letterSpacing: "0.1em" }}>
              🎓 {c.qualification}
            </span>
          )}
        </div>
      </div>

      {/* RIGHT: photo + skills */}
      <div style={{
        display: "flex", flexDirection: "column",
        opacity: on ? 1 : 0,
        transition: "opacity 1s .4s",
      }}>
        {/* Photo */}
        <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
          {c.profilePhoto ? (
            <img src={c.profilePhoto} alt={c.name} style={{
              width: "100%", height: "100%",
              objectFit: "cover", objectPosition: "top",
              filter: "sepia(10%) contrast(1.05)",
            }} />
          ) : (
            <div style={{
              width: "100%", height: "100%",
              background: C.bg,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "'Playfair Display', serif",
              fontSize: 80, fontWeight: 900, color: C.rule,
            }}>
              {c.name?.split(" ").map(w => w[0]).join("")}
            </div>
          )}
          {/* Red overlay bar */}
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            height: 4, background: C.red,
          }} />
        </div>

        {/* Skills grid below photo */}
        {c.skills?.length > 0 && (
          <div style={{
            padding: "24px 32px",
            borderTop: `1px solid ${C.rule}`,
            background: C.bg,
          }}>
            <span style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 9, letterSpacing: "0.2em",
              textTransform: "uppercase", color: C.mid,
              display: "block", marginBottom: 14,
            }}>
              Tech Stack
            </span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {c.skills.map((s, i) => (
                <span key={i} className="skill-pill" style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 10, color: C.mid,
                  border: `1px solid ${C.rule}`,
                  padding: "4px 12px",
                  background: C.paper,
                  cursor: "default",
                }}>
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/* ─────────────────────────── SERVICES ──────────────────────────── */
function Services({ services }) {
  if (!services?.length) return null;
  return (
    <section id="work" style={{ background: C.paper, borderBottom: `1px solid ${C.rule}` }}>
      {/* Section header */}
      <div style={{
        padding: "48px 48px 40px",
        borderBottom: `1px solid ${C.rule}`,
        display: "flex", justifyContent: "space-between", alignItems: "flex-end",
      }}>
        <div>
          <Eyebrow num="01">Services</Eyebrow>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 900, fontSize: "clamp(36px,5vw,64px)",
            color: C.ink, lineHeight: 1, letterSpacing: "-0.02em",
            marginTop: 8,
          }}>
            What I<br /><em style={{ color: C.red, fontStyle: "italic" }}>deliver</em>
          </h2>
        </div>
        <span style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 12, color: C.light,
          alignSelf: "flex-end",
        }}>
          {String(services.length).padStart(2, "0")} offerings
        </span>
      </div>

      {/* Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
      }}>
        {services.map((s, i) => (
          <Reveal key={i} delay={i * 0.07}>
            <div className="svc-card" style={{
              padding: "48px",
              borderRight: i % 2 === 0 ? `1px solid ${C.rule}` : "none",
              borderBottom: i < services.length - 2 ? `1px solid ${C.rule}` : "none",
              background: C.paper,
              cursor: "default",
            }}>
              <div style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 11, color: C.red,
                marginBottom: 20, letterSpacing: "0.1em",
              }}>
                / {String(i + 1).padStart(2, "0")}
              </div>
              <h3 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 22, fontWeight: 700,
                color: C.ink, marginBottom: 14,
              }}>
                {s.heading}
              </h3>
              <p style={{
                fontFamily: "'Libre Franklin', sans-serif",
                fontSize: 13, lineHeight: 1.8,
                color: C.mid, fontWeight: 300,
              }}>
                {s.description}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────── EXPERIENCE ────────────────────────── */
function Experience({ experience }) {
  if (!experience?.length) return null;
  return (
    <section id="work" style={{
      background: C.bg,
      borderBottom: `1px solid ${C.rule}`,
    }}>
      <div style={{
        padding: "48px 48px 0",
        borderBottom: `1px solid ${C.rule}`,
      }}>
        <Eyebrow num="02">Career</Eyebrow>
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontWeight: 900, fontSize: "clamp(36px,5vw,64px)",
          color: C.ink, lineHeight: 1, letterSpacing: "-0.02em",
          marginTop: 8, paddingBottom: 40,
        }}>
          Experi<em style={{ color: C.red, fontStyle: "italic" }}>ence</em>
        </h2>
      </div>

      {/* Two-column layout: timeline left, entries right */}
      <div style={{ display: "grid", gridTemplateColumns: "200px 1fr" }}>
        {/* Left: vertical label */}
        <div style={{
          borderRight: `1px solid ${C.rule}`,
          padding: "40px 32px",
          display: "flex", alignItems: "flex-start",
          justifyContent: "center",
        }}>
          <span style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 10, color: C.light,
            letterSpacing: "0.2em", textTransform: "uppercase",
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
          }}>
            Work History — {experience.length} roles
          </span>
        </div>

        {/* Right: list */}
        <div>
          {experience.map((e, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <div className="exp-row" style={{
                padding: "32px 48px",
                borderBottom: i < experience.length - 1 ? `1px solid ${C.rule}` : "none",
                display: "grid",
                gridTemplateColumns: "1fr auto",
                alignItems: "center", gap: 24,
                cursor: "default",
                background: "transparent",
                transition: "background .2s",
              }}>
                <div>
                  <p className="exp-title" style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 22, fontWeight: 700,
                    color: C.ink, marginBottom: 6,
                    transition: "color .2s",
                  }}>
                    {e.jobTitle}
                  </p>
                  <p style={{
                    fontFamily: "'Libre Franklin', sans-serif",
                    fontSize: 13, fontWeight: 500,
                    color: C.red, letterSpacing: "0.06em",
                  }}>
                    {e.company}
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 11, color: C.mid,
                    display: "block", lineHeight: 1.6,
                  }}>
                    {fmt(e.startDate)}
                    <br />
                    <span style={{ color: e.endDate ? C.light : C.red }}>
                      {fmt(e.endDate)}
                    </span>
                  </span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── EDUCATION ─────────────────────────── */
function Education({ education }) {
  if (!education?.length) return null;
  return (
    <section id="education" style={{
      background: C.ink,
      borderBottom: `1px solid #2a2825`,
    }}>
      {/* Inverted header */}
      <div style={{
        padding: "48px 48px 40px",
        borderBottom: "1px solid #2a2825",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: C.red, letterSpacing: "0.05em" }}>03</span>
          <div style={{ flex: 1, height: 1, background: C.red }} />
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "#554f46" }}>
            Education
          </span>
        </div>
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontWeight: 900, fontSize: "clamp(36px,5vw,64px)",
          color: C.bg, lineHeight: 1, letterSpacing: "-0.02em",
          marginTop: 8,
        }}>
          Acade<em style={{ color: C.red, fontStyle: "italic" }}>mia</em>
        </h2>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))" }}>
        {education.map((e, i) => (
          <Reveal key={i} delay={i * 0.1}>
            <div style={{
              padding: "44px 48px",
              borderRight: `1px solid #2a2825`,
              borderBottom: `1px solid #2a2825`,
              position: "relative", overflow: "hidden",
            }}>
              {/* Ghost year */}
              {e.year && (
                <div style={{
                  position: "absolute", bottom: -10, right: 20,
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 900, fontSize: 120,
                  color: "rgba(255,255,255,0.03)",
                  lineHeight: 1, userSelect: "none",
                  pointerEvents: "none",
                }}>
                  {e.year}
                </div>
              )}
              <div style={{
                display: "inline-block",
                background: C.red,
                padding: "3px 10px",
                fontFamily: "'DM Mono', monospace",
                fontSize: 10, color: C.white,
                letterSpacing: "0.1em",
                marginBottom: 20,
              }}>
                {e.year}
              </div>
              <h3 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 20, fontWeight: 700,
                color: C.bg, marginBottom: 10,
              }}>
                {e.education}
              </h3>
              <p style={{
                fontFamily: "'Libre Franklin', sans-serif",
                fontSize: 13, color: "#887f72",
                fontWeight: 400, marginBottom: 8,
              }}>
                {e.institution}
              </p>
              {e.percentage && (
                <p style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 11, color: C.red,
                  letterSpacing: "0.05em",
                }}>
                  {e.percentage}
                </p>
              )}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────── OPEN TO ───────────────────────────── */
function OpenTo({ lookingVacancy }) {
  if (!lookingVacancy?.length) return null;
  return (
    <section style={{
      background: C.red,
      padding: "64px 48px",
      display: "flex", gap: 48,
      alignItems: "center", flexWrap: "wrap",
      borderBottom: `1px solid ${C.rule}`,
    }}>
      <div style={{ flexShrink: 0 }}>
        <span style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 10, letterSpacing: "0.2em",
          textTransform: "uppercase", color: "rgba(255,255,255,0.6)",
          display: "block", marginBottom: 6,
        }}>
          Open To
        </span>
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontWeight: 900, fontSize: "clamp(28px,4vw,48px)",
          color: C.white, lineHeight: 1, letterSpacing: "-0.02em",
        }}>
          Next<br /><em>Role</em>
        </h2>
      </div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", flex: 1 }}>
        {lookingVacancy.map((v, i) => (
          <Reveal key={i} delay={i * 0.08}>
            <div className="vacancy-item" style={{
              padding: "14px 26px",
              border: "1px solid rgba(255,255,255,0.4)",
              fontFamily: "'Playfair Display', serif",
              fontSize: 18, fontWeight: 700,
              fontStyle: "italic", color: C.white,
              cursor: "default",
            }}>
              {v}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────── CONTACT ───────────────────────────── */
function Contact({ c }) {
  const rows = [
    c.email && { label: "Email", value: c.email, href: `mailto:${c.email}` },
    c.phone && { label: "Phone", value: c.phone, href: `tel:${c.phone}` },
    c.place && { label: "Location", value: c.place, href: null },
  ].filter(Boolean);
  if (!rows.length) return null;

  return (
    <section id="contact" style={{
      background: C.paper,
      display: "grid", gridTemplateColumns: "1fr 1fr",
    }}>
      {/* Left */}
      <div style={{
        padding: "64px 48px",
        borderRight: `1px solid ${C.rule}`,
        display: "flex", flexDirection: "column", justifyContent: "space-between",
      }}>
        <div>
          <Eyebrow num="04">Contact</Eyebrow>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 900, fontSize: "clamp(36px,5vw,64px)",
            color: C.ink, lineHeight: 1, letterSpacing: "-0.02em",
            marginTop: 8,
          }}>
            Get in<br /><em style={{ color: C.red, fontStyle: "italic" }}>Touch</em>
          </h2>
          <p style={{
            fontFamily: "'Libre Franklin', sans-serif",
            fontSize: 14, lineHeight: 1.8,
            color: C.mid, marginTop: 20, fontWeight: 300, maxWidth: 340,
          }}>
            Open to new opportunities, collaborations, and conversations about interesting problems.
          </p>
        </div>

        {c.email && (
          <a href={`mailto:${c.email}`} style={{
            display: "inline-block",
            marginTop: 32,
            padding: "14px 32px",
            background: C.ink, color: C.white,
            fontFamily: "'Libre Franklin', sans-serif",
            fontSize: 12, fontWeight: 600,
            letterSpacing: "0.1em", textTransform: "uppercase",
            textDecoration: "none",
            alignSelf: "flex-start",
          }}>
            Send a Message →
          </a>
        )}
      </div>

      {/* Right: contact details */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        {rows.map((r, i) => (
          <Reveal key={i} delay={i * 0.1}>
            <div className="contact-row" style={{
              padding: "32px 48px",
              borderBottom: i < rows.length - 1 ? `1px solid ${C.rule}` : "none",
              display: "flex", justifyContent: "space-between", alignItems: "center",
              cursor: r.href ? "pointer" : "default",
            }}
              onClick={() => r.href && window.open(r.href)}
            >
              <span style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 10, letterSpacing: "0.15em",
                textTransform: "uppercase", color: C.light,
              }}>
                {r.label}
              </span>
              <span className="contact-value" style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 17, fontWeight: 400,
                color: C.ink, transition: "color .2s",
              }}>
                {r.value}
              </span>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────── FOOTER ────────────────────────────── */
function Footer({ name }) {
  return (
    <footer style={{
      background: C.ink,
      padding: "24px 48px",
      display: "flex", justifyContent: "space-between",
      alignItems: "center", flexWrap: "wrap", gap: 12,
    }}>
      <span style={{
        fontFamily: "'Playfair Display', serif",
        fontWeight: 700, fontSize: 15,
        color: C.bg, letterSpacing: "-0.01em",
      }}>
        {name}
      </span>
      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
        <div style={{ width: 6, height: 6, background: C.red, borderRadius: "50%" }} />
        <span style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 10, color: "#554f46", letterSpacing: "0.12em",
        }}>
          © {new Date().getFullYear()} — ALL RIGHTS RESERVED
        </span>
      </div>
    </footer>
  );
}

/* ─────────────────────────── ROOT ──────────────────────────────── */
/**
 * PersonalPortfolio — Swiss Editorial Theme
 *
 * Props:
 *   candidate – object matching the candidateSchema.
 *               Any missing field is gracefully hidden.
 *
 * Usage:
 *   <PersonalPortfolio candidate={candidateFromAPI} />
 *   <PersonalPortfolio />   // renders demo data
 */
export default function PersonalPortfolio3({ data}) {
  const c = data || DEMO
  return (
    <div style={{ background: C.bg, color: C.ink, minHeight: "100vh", overflowX: "hidden" }}>
      <style>{CSS}</style>
      <Nav c={c} />
      <Hero c={c} />
      <Services services={c.services} />
      <Experience experience={c.experience} />
      <Education education={c.education} />
      <OpenTo lookingVacancy={c.lookingVacancy} />
      <Contact c={c} />
      <Footer name={c.name} />
    </div>
  );
}