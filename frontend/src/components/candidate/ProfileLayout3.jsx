import { useState, useEffect, useRef } from "react";

/* ─────────────────────────── DEMO DATA ─────────────────────────── */
const DEMO = {
  name: "Arjun Menon",
  firstName: "Arjun",
  lastName: "Menon",
  role: "Full‑Stack Engineer",
  tagline: "I build products people love.",
  about:
    "7+ years crafting digital experiences at the intersection of engineering and design. I turn complex problems into elegant, performant solutions — from pixel to production.",
  email: "arjun.menon@gmail.com",
  place: "Kochi, Kerala",
  profilePhoto: "https://i.pravatar.cc/900?img=68",
  qualification: "B.Tech CS · NIT Calicut",
  skills: [
    "React","Node.js","TypeScript","MongoDB","GraphQL",
    "Docker","AWS","Figma","Python","Redis","Next.js","PostgreSQL",
  ],
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
  socials: [{ linkedin: "https://linkedin.com", github: "https://github.com", twitter: "https://twitter.com", website: "https://arjunmenon.dev" }],
  lookingVacancy: ["Full-Stack Engineer", "Frontend Lead", "Technical Co-founder"],
};

/* ─────────────────────────── HELPERS ───────────────────────────── */
const fmt = (d) =>
  d ? new Date(d).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "Now";

/** Returns true only when value is a non-empty string / non-empty array / truthy */
const has = (val) => {
  if (Array.isArray(val)) return val.length > 0;
  if (typeof val === "string") return val.trim().length > 0;
  return Boolean(val);
};

/** Normalise socials — DB stores as array of objects */
const getSocials = (socials) => {
  if (!socials) return {};
  if (Array.isArray(socials)) return socials[0] || {};
  return socials;
};

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
  .proj-card:hover { background: ${C.white} !important; box-shadow: 4px 4px 0 ${C.red} !important; transform: translate(-2px,-2px); }
  .proj-card { transition: all .2s ease !important; }
  .social-link:hover { color: ${C.red} !important; border-color: ${C.red} !important; }
  .social-link { transition: all .15s ease !important; }
`;

/* ─────────────────────────── ATOMS ─────────────────────────────── */
function Eyebrow({ children, num }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
      {num && (
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: C.red, letterSpacing: "0.05em" }}>
          {num}
        </span>
      )}
      <div style={{ flex: 1, height: 1, background: C.red }} />
      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: C.mid }}>
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

/* ─────────────────────────── NAV ───────────────────────────────── */
function Nav({ c }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Build nav links only for sections that have data
  const navLinks = [
    has(c.services) && "Work",
    has(c.education) && "Education",
    (has(c.email) || has(c.place)) && "Contact",
  ].filter(Boolean);

  const displayName = has(c.name) ? c.name.split(" ")[0] : "Portfolio";

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
        {displayName}<span style={{ color: C.red }}>.</span>
      </div>

      <div style={{ display: "flex", gap: 32 }}>
        {navLinks.map((item) => (
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

      {has(c.tagline) && (
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: C.light, letterSpacing: "0.12em" }}>
          {c.tagline.toUpperCase()}
        </div>
      )}
    </nav>
  );
}

/* ─────────────────────────── HERO ──────────────────────────────── */
function Hero({ c }) {
  const [on, setOn] = useState(false);
  useEffect(() => { const t = setTimeout(() => setOn(true), 80); return () => clearTimeout(t); }, []);

  const displayName = has(c.name) ? c.name : "Your Name";
  const initials = displayName.split(" ").map((w) => w[0]).join("");

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
        {/* Available badge — only if lookingVacancy exists */}
        {has(c.lookingVacancy) && (
          <div style={{ position: "absolute", top: 80, left: 48, opacity: on ? 1 : 0, transition: "opacity .8s .2s" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: C.red, padding: "5px 12px",
            }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.white, animation: "spin 2s linear infinite" }} />
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: C.white, letterSpacing: "0.15em" }}>
                AVAILABLE FOR WORK
              </span>
            </div>
          </div>
        )}

        {/* Name */}
        <div style={{ opacity: on ? 1 : 0, transform: on ? "none" : "translateY(24px)", transition: "all .8s .3s" }}>
          {displayName.split(" ").map((word, i) => (
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

        {/* Role / qualification */}
        {(has(c.role) || has(c.qualification)) && (
          <p style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 11, letterSpacing: "0.12em",
            color: C.mid, marginTop: 16,
            opacity: on ? 1 : 0, transition: "opacity .8s .45s",
          }}>
            {c.role || c.qualification}
          </p>
        )}

        {/* About */}
        {has(c.about) && (
          <p style={{
            fontFamily: "'Libre Franklin', sans-serif",
            fontSize: 15, lineHeight: 1.75,
            color: C.mid, marginTop: 24, maxWidth: 400,
            fontWeight: 300,
            opacity: on ? 1 : 0, transition: "opacity .8s .5s",
          }}>
            {c.about}
          </p>
        )}

        {/* CTA — email only, no CV/phone */}
        {has(c.email) && (
          <div style={{ marginTop: 40, display: "flex", gap: 12, flexWrap: "wrap", opacity: on ? 1 : 0, transition: "opacity .8s .65s" }}>
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
          </div>
        )}

        {/* Bottom meta strip */}
        {(has(c.place) || has(c.qualification)) && (
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            borderTop: `1px solid ${C.rule}`,
            padding: "14px 48px",
            display: "flex", gap: 24, flexWrap: "wrap",
            opacity: on ? 1 : 0, transition: "opacity .8s .75s",
          }}>
            {has(c.place) && (
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: C.light, letterSpacing: "0.1em" }}>
                📍 {c.place}
              </span>
            )}
            {has(c.qualification) && (
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: C.light, letterSpacing: "0.1em" }}>
                🎓 {c.qualification}
              </span>
            )}
          </div>
        )}
      </div>

      {/* RIGHT: photo + skills */}
      <div style={{ display: "flex", flexDirection: "column", opacity: on ? 1 : 0, transition: "opacity 1s .4s" }}>
        {/* Photo */}
        <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
          {has(c.profilePhoto) ? (
            <img src={c.profilePhoto} alt={displayName} style={{
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
              {initials}
            </div>
          )}
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 4, background: C.red }} />
        </div>

        {/* Skills grid below photo */}
        {has(c.skills) && (
          <div style={{ padding: "24px 32px", borderTop: `1px solid ${C.rule}`, background: C.bg }}>
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
  if (!has(services)) return null;
  return (
    <section id="work" style={{ background: C.paper, borderBottom: `1px solid ${C.rule}` }}>
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
            color: C.ink, lineHeight: 1, letterSpacing: "-0.02em", marginTop: 8,
          }}>
            What I<br /><em style={{ color: C.red, fontStyle: "italic" }}>deliver</em>
          </h2>
        </div>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: C.light, alignSelf: "flex-end" }}>
          {String(services.length).padStart(2, "0")} offerings
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)" }}>
        {services.map((s, i) => (
          <Reveal key={i} delay={i * 0.07}>
            <div className="svc-card" style={{
              padding: "48px",
              borderRight: i % 2 === 0 ? `1px solid ${C.rule}` : "none",
              borderBottom: i < services.length - 2 ? `1px solid ${C.rule}` : "none",
              background: C.paper, cursor: "default",
            }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: C.red, marginBottom: 20, letterSpacing: "0.1em" }}>
                / {String(i + 1).padStart(2, "0")}
              </div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: C.ink, marginBottom: 14 }}>
                {s.heading}
              </h3>
              {has(s.description) && (
                <p style={{ fontFamily: "'Libre Franklin', sans-serif", fontSize: 13, lineHeight: 1.8, color: C.mid, fontWeight: 300 }}>
                  {s.description}
                </p>
              )}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────── EXPERIENCE ────────────────────────── */
function Experience({ experience }) {
  if (!has(experience)) return null;

  // Calculate section number based on what comes before
  const num = "02";

  return (
    <section style={{ background: C.bg, borderBottom: `1px solid ${C.rule}` }}>
      <div style={{ padding: "48px 48px 0", borderBottom: `1px solid ${C.rule}` }}>
        <Eyebrow num={num}>Career</Eyebrow>
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontWeight: 900, fontSize: "clamp(36px,5vw,64px)",
          color: C.ink, lineHeight: 1, letterSpacing: "-0.02em",
          marginTop: 8, paddingBottom: 40,
        }}>
          Experi<em style={{ color: C.red, fontStyle: "italic" }}>ence</em>
        </h2>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "200px 1fr" }}>
        {/* Left: vertical label */}
        <div style={{
          borderRight: `1px solid ${C.rule}`,
          padding: "40px 32px",
          display: "flex", alignItems: "flex-start", justifyContent: "center",
        }}>
          <span style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 10, color: C.light,
            letterSpacing: "0.2em", textTransform: "uppercase",
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
          }}>
            Work History — {experience.length} {experience.length === 1 ? "role" : "roles"}
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
                  {has(e.company) && (
                    <p style={{ fontFamily: "'Libre Franklin', sans-serif", fontSize: 13, fontWeight: 500, color: C.red, letterSpacing: "0.06em" }}>
                      {e.company}
                    </p>
                  )}
                </div>
                {has(e.startDate) && (
                  <div style={{ textAlign: "right" }}>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: C.mid, display: "block", lineHeight: 1.6 }}>
                      {fmt(e.startDate)}
                      <br />
                      <span style={{ color: e.endDate ? C.light : C.red }}>
                        {fmt(e.endDate)}
                      </span>
                    </span>
                  </div>
                )}
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
  if (!has(education)) return null;
  return (
    <section id="education" style={{ background: C.ink, borderBottom: "1px solid #2a2825" }}>
      <div style={{ padding: "48px 48px 40px", borderBottom: "1px solid #2a2825" }}>
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
          color: C.bg, lineHeight: 1, letterSpacing: "-0.02em", marginTop: 8,
        }}>
          Acade<em style={{ color: C.red, fontStyle: "italic" }}>mia</em>
        </h2>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))" }}>
        {education.map((e, i) => (
          <Reveal key={i} delay={i * 0.1}>
            <div style={{ padding: "44px 48px", borderRight: "1px solid #2a2825", borderBottom: "1px solid #2a2825", position: "relative", overflow: "hidden" }}>
              {e.year && (
                <div style={{
                  position: "absolute", bottom: -10, right: 20,
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 900, fontSize: 120,
                  color: "rgba(255,255,255,0.03)",
                  lineHeight: 1, userSelect: "none", pointerEvents: "none",
                }}>
                  {e.year}
                </div>
              )}
              {e.year && (
                <div style={{
                  display: "inline-block",
                  background: C.red, padding: "3px 10px",
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 10, color: C.white,
                  letterSpacing: "0.1em", marginBottom: 20,
                }}>
                  {e.year}
                </div>
              )}
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: C.bg, marginBottom: 10 }}>
                {e.education}
              </h3>
              {has(e.institution) && (
                <p style={{ fontFamily: "'Libre Franklin', sans-serif", fontSize: 13, color: "#887f72", fontWeight: 400, marginBottom: 8 }}>
                  {e.institution}
                </p>
              )}
              {has(e.percentage) && (
                <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: C.red, letterSpacing: "0.05em" }}>
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

/* ─────────────────────────── PROJECTS ──────────────────────────── */
function Projects({ projects }) {
  if (!has(projects)) return null;
  return (
    <section id="projects" style={{ background: C.bg, borderBottom: `1px solid ${C.rule}` }}>
      <div style={{ padding: "48px 48px 40px", borderBottom: `1px solid ${C.rule}`, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <Eyebrow num="04">Projects</Eyebrow>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 900, fontSize: "clamp(36px,5vw,64px)",
            color: C.ink, lineHeight: 1, letterSpacing: "-0.02em", marginTop: 8,
          }}>
            Selected<br /><em style={{ color: C.red, fontStyle: "italic" }}>Work</em>
          </h2>
        </div>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: C.light, alignSelf: "flex-end" }}>
          {String(projects.length).padStart(2, "0")} projects
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)" }}>
        {projects.map((p, i) => (
          <Reveal key={i} delay={i * 0.07}>
            <div
              className="proj-card"
              style={{
                padding: "44px 48px",
                borderRight: i % 2 === 0 ? `1px solid ${C.rule}` : "none",
                borderBottom: i < projects.length - 2 ? `1px solid ${C.rule}` : "none",
                background: C.paper, cursor: p.link && p.link !== "#" ? "pointer" : "default",
                position: "relative",
              }}
              onClick={() => p.link && p.link !== "#" && window.open(p.link, "_blank")}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: C.red, letterSpacing: "0.1em" }}>
                  / {String(i + 1).padStart(2, "0")}
                </div>
                {has(p.year) && (
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: C.light, letterSpacing: "0.08em" }}>
                    {p.year}
                  </span>
                )}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 12 }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: C.ink }}>
                  {p.title}
                </h3>
                {p.link && p.link !== "#" && (
                  <span style={{ color: C.red, fontSize: 18, lineHeight: 1, flexShrink: 0 }}>↗</span>
                )}
              </div>
              {has(p.description) && (
                <p style={{ fontFamily: "'Libre Franklin', sans-serif", fontSize: 13, lineHeight: 1.8, color: C.mid, fontWeight: 300 }}>
                  {p.description}
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
  if (!has(lookingVacancy)) return null;
  return (
    <section style={{
      background: C.red,
      padding: "64px 48px",
      display: "flex", gap: 48,
      alignItems: "center", flexWrap: "wrap",
      borderBottom: `1px solid ${C.rule}`,
    }}>
      <div style={{ flexShrink: 0 }}>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", display: "block", marginBottom: 6 }}>
          Open To
        </span>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: "clamp(28px,4vw,48px)", color: C.white, lineHeight: 1, letterSpacing: "-0.02em" }}>
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

/* ─────────────────────────── SOCIALS ───────────────────────────── */
const SOCIAL_META = {
  linkedin: { label: "LinkedIn", href: (v) => v },
  github: { label: "GitHub", href: (v) => v },
  twitter: { label: "Twitter / X", href: (v) => v },
  instagram: { label: "Instagram", href: (v) => v },
  facebook: { label: "Facebook", href: (v) => v },
  website: { label: "Website", href: (v) => v },
};

function Socials({ socials }) {
  const s = getSocials(socials);
  const links = Object.entries(s).filter(([, val]) => has(val));
  if (!links.length) return null;

  return (
    <div style={{ padding: "32px 48px", borderTop: `1px solid ${C.rule}`, display: "flex", flexWrap: "wrap", gap: 16 }}>
      {links.map(([key, url]) => {
        const meta = SOCIAL_META[key];
        if (!meta) return null;
        return (
          <a
            key={key}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="social-link"
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 10, letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: C.mid,
              textDecoration: "none",
              borderBottom: `1px solid ${C.rule}`,
              paddingBottom: 2,
              transition: "color .15s, border-color .15s",
            }}
          >
            {meta.label} ↗
          </a>
        );
      })}
    </div>
  );
}

/* ─────────────────────────── CONTACT ───────────────────────────── */
function Contact({ c }) {
  // Intentionally excluding phone and cv per requirements
  const rows = [
    has(c.email) && { label: "Email", value: c.email, href: `mailto:${c.email}` },
    has(c.place) && { label: "Location", value: c.place, href: null },
  ].filter(Boolean);

  if (!rows.length) return null;

  return (
    <section id="contact" style={{ background: C.paper, display: "grid", gridTemplateColumns: "1fr 1fr" }}>
      {/* Left */}
      <div style={{
        padding: "64px 48px",
        borderRight: `1px solid ${C.rule}`,
        display: "flex", flexDirection: "column", justifyContent: "space-between",
      }}>
        <div>
          <Eyebrow num="05">Contact</Eyebrow>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 900, fontSize: "clamp(36px,5vw,64px)",
            color: C.ink, lineHeight: 1, letterSpacing: "-0.02em", marginTop: 8,
          }}>
            Get in<br /><em style={{ color: C.red, fontStyle: "italic" }}>Touch</em>
          </h2>
          <p style={{ fontFamily: "'Libre Franklin', sans-serif", fontSize: 14, lineHeight: 1.8, color: C.mid, marginTop: 20, fontWeight: 300, maxWidth: 340 }}>
            Open to new opportunities, collaborations, and conversations about interesting problems.
          </p>
        </div>

        {has(c.email) && (
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

        {/* Socials injected in contact left col */}
        <Socials socials={c.socials} />
      </div>

      {/* Right: contact details */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        {rows.map((r, i) => (
          <Reveal key={i} delay={i * 0.1}>
            <div
              className="contact-row"
              style={{
                padding: "32px 48px",
                borderBottom: i < rows.length - 1 ? `1px solid ${C.rule}` : "none",
                display: "flex", justifyContent: "space-between", alignItems: "center",
                cursor: r.href ? "pointer" : "default",
              }}
              onClick={() => r.href && window.open(r.href)}
            >
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: C.light }}>
                {r.label}
              </span>
              <span className="contact-value" style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 400, color: C.ink, transition: "color .2s" }}>
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
  const displayName = has(name) ? name : "Portfolio";
  return (
    <footer style={{
      background: C.ink,
      padding: "24px 48px",
      display: "flex", justifyContent: "space-between",
      alignItems: "center", flexWrap: "wrap", gap: 12,
    }}>
      <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 15, color: C.bg, letterSpacing: "-0.01em" }}>
        {displayName}
      </span>
      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
        <div style={{ width: 6, height: 6, background: C.red, borderRadius: "50%" }} />
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#554f46", letterSpacing: "0.12em" }}>
          © {new Date().getFullYear()} — ALL RIGHTS RESERVED
        </span>
      </div>
    </footer>
  );
}

/* ─────────────────────────── ROOT ──────────────────────────────── */
export default function PersonalPortfolio3({ data }) {
  // If no real data passed (or empty object), fall back to DEMO
  const c = data && has(data.name) ? data : DEMO;

  return (
    <div style={{ background: C.bg, color: C.ink, minHeight: "100vh", overflowX: "hidden" }}>
      <style>{CSS}</style>
      <Nav c={c} />
      <Hero c={c} />
      <Services services={c.services} />
      <Experience experience={c.experience} />
      <Education education={c.education} />
      <Projects projects={c.projects} />
      <OpenTo lookingVacancy={c.lookingVacancy} />
      <Contact c={c} />
      <Footer name={c.name} />
    </div>
  );
}