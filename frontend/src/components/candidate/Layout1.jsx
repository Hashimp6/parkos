import { useState, useEffect, useRef } from "react";

const Demo = {
  name: "Alex Mercer",
  tagline: "Crafting digital experiences that leave a mark",
  qualification: "Full Stack Developer",
  company: "currently @ Niche Studios",
  profilePhoto: "https://i.pravatar.cc/900?img=68",
  place: "Kerala, India",
  about:
    "I build products that live at the intersection of elegant design and robust engineering. With a deep obsession for clean code and intentional UX, I turn complex problems into seamless experiences.",
  skills: ["React", "Node.js", "MongoDB", "TypeScript", "Python", "Figma", "AWS", "GraphQL", "Docker", "Redis"],
  services: [
    { heading: "Web Development", description: "Full-stack applications built with modern frameworks, focused on performance and scalability." },
    { heading: "UI/UX Design", description: "Interfaces that feel intuitive and look stunning — from wireframe to pixel-perfect reality." },
    { heading: "API Architecture", description: "Robust REST & GraphQL APIs designed for scale, security, and developer happiness." },
    { heading: "Consulting", description: "Strategic technical guidance for startups and growing teams navigating complexity." },
  ],
  experience: [
    { jobTitle: "Senior Full Stack Engineer", company: "Niche Studios", startDate: "2023", endDate: "Present" },
    { jobTitle: "Frontend Engineer", company: "Axiom Labs", startDate: "2021", endDate: "2023" },
    { jobTitle: "Junior Developer", company: "ByteForge", startDate: "2019", endDate: "2021" },
  ],
  education: [
    { education: "B.Tech Computer Science", institution: "NIT Calicut", year: 2019, percentage: "8.7 CGPA" },
    { education: "Higher Secondary", institution: "Kerala State Board", year: 2015, percentage: "94%" },
  ],
  projects: [
    { title: "Lumina", description: "An AI-powered design system generator that creates production-ready component libraries from natural language prompts.", link: "#" },
    { title: "Vantage", description: "Real-time analytics dashboard with 3D data visualizations processing 10M+ events/day.", link: "#" },
    { title: "Drift Protocol", description: "Decentralized file-sharing network with end-to-end encryption and zero-knowledge proofs.", link: "#" },
    { title: "Echospace", description: "Collaborative music production platform with live jam sessions and AI-assisted mixing.", link: "#" },
  ],
  socials: [{ github: "github.com/alexmercer", linkedin: "linkedin.com/in/alexmercer", twitter: "@alexmercer", instagram: "@alexmercer.dev" }],
};

const NAV_ITEMS = ["About", "Services", "Work", "Experience", "Contact"];

export default function Portfolio1({ data }) {
  const [activeSection, setActiveSection] = useState("about");
  const [menuOpen, setMenuOpen] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [hovering, setHovering] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const cursorRef = useRef(null);
const portfolio=data || Demo
  useEffect(() => {
    setTimeout(() => setLoaded(true), 100);
    const handleMouseMove = (e) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    if (cursorRef.current) {
      cursorRef.current.style.transform = `translate(${cursorPos.x - 10}px, ${cursorPos.y - 10}px)`;
    }
  }, [cursorPos]);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <div
      style={{
        fontFamily: "'Cormorant Garamond', serif",
        background: "#030e0e",
        color: "#e8f4f4",
        minHeight: "100vh",
        overflowX: "hidden",
        cursor: "none",
      }}
    >
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,500&family=Space+Mono:wght@400;700&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }

        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #030e0e; }
        ::-webkit-scrollbar-thumb { background: #3c7d8a; border-radius: 2px; }

        .cursor {
          position: fixed; top: 0; left: 0;
          width: 20px; height: 20px;
          border: 1.5px solid #4fb8c8;
          border-radius: 50%;
          pointer-events: none;
          z-index: 9999;
          transition: transform 0.08s ease, width 0.2s ease, height 0.2s ease, border-color 0.2s;
        }
        .cursor.hover {
          width: 40px; height: 40px;
          border-color: #a8e6ee;
          background: rgba(79,184,200,0.08);
        }

        .fade-in { opacity: 0; transform: translateY(30px); transition: opacity 0.8s ease, transform 0.8s ease; }
        .fade-in.visible { opacity: 1; transform: translateY(0); }

        .hero-text { font-size: clamp(3.5rem, 9vw, 9rem); font-weight: 300; line-height: 0.9; letter-spacing: -0.02em; }
        .italic-em { font-style: italic; color: #4fb8c8; }

        .section-label {
          font-family: 'Space Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: #4fb8c8;
          opacity: 0.8;
        }

        .teal-line {
          width: 40px; height: 1px;
          background: linear-gradient(90deg, #4fb8c8, transparent);
          margin: 1rem 0;
        }

        .service-card {
          border: 1px solid rgba(79,184,200,0.15);
          padding: 2rem;
          position: relative;
          transition: border-color 0.3s, background 0.3s;
          overflow: hidden;
        }
        .service-card::before {
          content: '';
          position: absolute; top: 0; left: 0;
          width: 0; height: 1px;
          background: #4fb8c8;
          transition: width 0.4s ease;
        }
        .service-card:hover::before { width: 100%; }
        .service-card:hover { border-color: rgba(79,184,200,0.4); background: rgba(79,184,200,0.03); }

        .project-card {
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(79,184,200,0.1);
          cursor: none;
          transition: border-color 0.3s;
        }
          .hero-container {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  align-items: center;
  gap: 3rem;
}

.hero-image-wrapper {
  position: relative;
  width: 100%;
  max-width: 420px;
  margin: auto;
}

.hero-image {
  width: 100%;
  height: 520px;
  object-fit: cover;
  border-radius: 20px;
  filter: grayscale(20%) contrast(1.05);
  transition: transform 0.5s ease, filter 0.4s ease;
}

.hero-image:hover {
  transform: scale(1.03);
  filter: grayscale(0%) contrast(1.1);
}

/* glow effect */
.hero-image-wrapper::after {
  content: "";
  position: absolute;
  inset: -20px;
  background: radial-gradient(circle, rgba(79,184,200,0.15), transparent 70%);
  z-index: -1;
  border-radius: 30px;
}

/* MOBILE */
@media (max-width: 900px) {
  .hero-container {
    grid-template-columns: 1fr;
  }

  .hero-image {
    height: 380px;
  }
}
        .project-card:hover { border-color: rgba(79,184,200,0.35); }
        .project-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(3,14,14,0.85) 0%, rgba(28,80,88,0.7) 100%);
          display: flex; flex-direction: column; justify-content: flex-end;
          padding: 2rem;
          opacity: 0;
          transition: opacity 0.4s;
        }
        .project-card:hover .project-overlay { opacity: 1; }

        .skill-tag {
          font-family: 'Space Mono', monospace;
          font-size: 0.7rem;
          padding: 0.4rem 1rem;
          border: 1px solid rgba(79,184,200,0.25);
          color: #8dd8e2;
          letter-spacing: 0.1em;
          transition: border-color 0.2s, background 0.2s;
        }
        .skill-tag:hover { border-color: #4fb8c8; background: rgba(79,184,200,0.08); }

        .nav-link {
          font-family: 'Space Mono', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(200,230,230,0.55);
          text-decoration: none;
          transition: color 0.2s;
          cursor: none;
        }
        .nav-link:hover { color: #4fb8c8; }

        .glitch-line {
          position: absolute;
          background: linear-gradient(90deg, transparent, rgba(79,184,200,0.06), transparent);
          height: 1px; width: 100%;
          animation: scanline 8s linear infinite;
        }
        @keyframes scanline {
          0% { top: -1%; }
          100% { top: 101%; }
        }

        .float-anim { animation: floatUp 6s ease-in-out infinite; }
        @keyframes floatUp {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }

        .exp-line {
          width: 1px;
          background: linear-gradient(180deg, #4fb8c8 0%, rgba(79,184,200,0) 100%);
        }

        @media (max-width: 768px) {
          .hero-text { font-size: clamp(2.8rem, 12vw, 5rem); }
        }
      `}</style>

      {/* Custom Cursor */}
      <div ref={cursorRef} className={`cursor ${hovering ? "hover" : ""}`} />

      {/* Ambient Background */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{
          position: "absolute", top: "10%", left: "60%",
          width: 600, height: 600,
          background: "radial-gradient(circle, rgba(28,95,108,0.18) 0%, transparent 70%)",
          borderRadius: "50%",
        }} />
        <div style={{
          position: "absolute", bottom: "20%", left: "5%",
          width: 400, height: 400,
          background: "radial-gradient(circle, rgba(20,65,75,0.12) 0%, transparent 70%)",
          borderRadius: "50%",
        }} />
        <div className="glitch-line" />
      </div>

      {/* NAV */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "1.4rem 4rem",
        background: "rgba(3,14,14,0.85)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(79,184,200,0.08)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <div style={{ width: 6, height: 6, background: "#4fb8c8", borderRadius: "50%" }} />
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.75rem", letterSpacing: "0.2em", color: "#4fb8c8" }}>
            {portfolio.name}
          </span>
        </div>

        <div style={{ display: "flex", gap: "2.5rem" }}>
          {NAV_ITEMS.map((item) => (
            <button key={item}
              className="nav-link"
              onClick={() => scrollTo(item.toLowerCase())}
              onMouseEnter={() => setHovering(true)}
              onMouseLeave={() => setHovering(false)}
              style={{ background: "none", border: "none" }}
            >
              {item}
            </button>
          ))}
        </div>
      </nav>

      {/* HERO */}
      <section
  id="about"
  style={{
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    padding: "10rem 4rem 6rem",
    position: "relative",
    zIndex: 1,
  }}
>
  <div className="hero-container">

    {/* LEFT SIDE (TEXT) */}
    <div>
      <span className="section-label">
        Portfolio · {new Date().getFullYear()}
      </span>
      {portfolio.name && (
  <>
     <h1 className="hero-text" style={{ marginTop: "1.5rem" }}>
        {portfolio.name.split(" ")[0]}<br />
        <span className="italic-em">
          {portfolio.name.split(" ")[1]}
        </span>
      </h1>
  </>
)}

     

    

      {portfolio.tagline && (
   <p style={{
    fontSize: "1.35rem",
    marginTop: "2rem",
    fontStyle: "italic",
    color: "rgba(200,230,230,0.7)"
  }}>"{portfolio.tagline}"</p>
)}

      <div className="teal-line" style={{ marginTop: "1.5rem" }} />

      
       {(portfolio.qualification || portfolio.company) && (
 <p style={{
    fontFamily: "'Space Mono', monospace",
    fontSize: "0.72rem",
    letterSpacing: "0.15em",
    color: "#4fb8c8",
    marginTop: "1rem"
  }}>
    {portfolio.qualification}
    {portfolio.qualification && portfolio.company && " · "}
    {portfolio.company}
  </p>
)}
     
      {portfolio.about && (
   <p style={{
        marginTop: "2rem",
        lineHeight: 1.7,
        color: "rgba(200,230,230,0.6)"
      }}>{portfolio.about}</p>
)}

    
       {portfolio.skills?.length > 0 && (
  <div style={{
    display: "flex",
    gap: "1rem",
    flexWrap: "wrap",
    marginTop: "2rem"
  }}>
    {portfolio.skills.map((s) => (
      <span key={s}>{s}</span>
    ))}
  </div>
)}
    </div>

    {portfolio.profilePhoto ? (
  <div className="hero-image-wrapper float-anim">
  <img
    src={portfolio.profilePhoto}
    alt={portfolio.name}
    className="hero-image"
    loading="lazy"
  />
</div>
) : null}

    {/* RIGHT SIDE (IMAGE) */}
   

  </div>
</section>

      {/* SERVICES */}
      <section id="services" style={{ padding: "8rem 4rem", position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "2rem", marginBottom: "4rem" }}>
          <span className="section-label">What I Do</span>
          <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, rgba(79,184,200,0.3), transparent)" }} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1px", background: "rgba(79,184,200,0.08)" }}>
         
         
        {portfolio.services?.length > 0 && (
  <section>
    {portfolio.services.map((s, i) => (
            <div key={i} className="service-card"
              onMouseEnter={() => setHovering(true)}
              onMouseLeave={() => setHovering(false)}
              style={{ background: "#030e0e" }}
            >
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.6rem", color: "#4fb8c8", marginBottom: "1.5rem", opacity: 0.6 }}>
                0{i + 1}
              </div>
              <h3 style={{ fontSize: "1.5rem", fontWeight: 400, marginBottom: "1rem", color: "#d8eef0" }}>{s.heading}</h3>
              <p style={{ fontSize: "1rem", lineHeight: 1.7, color: "rgba(200,230,230,0.5)", fontWeight: 300 }}>{s.description}</p>
            </div>
          ))}
  </section>
)}
         
        </div>
      </section>

      {/* PROJECTS */}
      <section id="work" style={{ padding: "8rem 4rem", position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "2rem", marginBottom: "4rem" }}>
          <span className="section-label">Selected Work</span>
          <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, rgba(79,184,200,0.3), transparent)" }} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
         
        {portfolio.projects?.length > 0 && (
  <section>
      {portfolio.projects.map((p, i) => (
            <div key={i} className="project-card"
              onMouseEnter={() => setHovering(true)}
              onMouseLeave={() => setHovering(false)}
              style={{ aspectRatio: "4/3", background: `linear-gradient(135deg, hsl(${180 + i * 15}, 40%, ${6 + i * 2}%) 0%, hsl(${190 + i * 10}, 45%, ${10 + i * 2}%) 100%)` }}
            >
              {/* Background pattern */}
              <div style={{ position: "absolute", inset: 0, opacity: 0.04 }}>
                <svg width="100%" height="100%">
                  <defs>
                    <pattern id={`grid${i}`} width="30" height="30" patternUnits="userSpaceOnUse">
                      <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#4fb8c8" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill={`url(#grid${i})`} />
                </svg>
              </div>

              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "4rem", fontWeight: 700, opacity: 0.06, color: "#4fb8c8" }}>0{i + 1}</span>
              </div>

              <div className="project-overlay">
                <h3 style={{ fontSize: "1.6rem", fontWeight: 400, marginBottom: "0.75rem", color: "#e8f4f4" }}>{p.title}</h3>
                <p style={{ fontSize: "0.9rem", lineHeight: 1.6, color: "rgba(200,230,230,0.7)", fontWeight: 300, marginBottom: "1.2rem" }}>{p.description}</p>
                <a href={p.link}
                  onMouseEnter={() => setHovering(true)}
                  onMouseLeave={() => setHovering(false)}
                  style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#4fb8c8", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  View Project <span style={{ display: "inline-block", transition: "transform 0.2s" }}>→</span>
                </a>
              </div>
            </div>
          ))}
  </section>
)}
         
       
        </div>
      </section>

      {/* EXPERIENCE */}
      <section id="experience" style={{ padding: "8rem 4rem", position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "2rem", marginBottom: "5rem" }}>
          <span className="section-label">Journey</span>
          <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, rgba(79,184,200,0.3), transparent)" }} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem" }}>
          {/* Experience */}
          <div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 400, color: "#4fb8c8", marginBottom: "3rem", fontFamily: "'Space Mono', monospace", fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase" }}>Experience</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
             
            {portfolio.experience?.length > 0 && (
  <section>
   {portfolio.experience.map((e, i) => (
                <div key={i} style={{ display: "flex", gap: "2rem", paddingBottom: "2.5rem", position: "relative" }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", border: "1.5px solid #4fb8c8", background: "#030e0e", flexShrink: 0, marginTop: 4 }} />
                    {i < portfolio.experience.length - 1 && (
                      <div className="exp-line" style={{ flex: 1, marginTop: 4 }} />
                    )}
                  </div>
                  <div>
                    <p style={{ fontSize: "1.3rem", fontWeight: 400, color: "#d8eef0", marginBottom: "0.3rem" }}>{e.jobTitle}</p>
                    <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.68rem", color: "#4fb8c8", letterSpacing: "0.1em", marginBottom: "0.2rem" }}>{e.company}</p>
                    <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.62rem", color: "rgba(200,230,230,0.35)", letterSpacing: "0.05em" }}>{e.startDate} — {e.endDate}</p>
                  </div>
                </div>
              ))}
  </section>
)}
              
            </div>
          </div>

          {/* Education */}
          <div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 400, color: "#4fb8c8", marginBottom: "3rem", fontFamily: "'Space Mono', monospace", fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase" }}>Education</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
            {portfolio.education?.length > 0 && (
  <section>
  {portfolio.education.map((e, i) => (
                <div key={i} style={{ display: "flex", gap: "2rem", paddingBottom: "2.5rem", position: "relative" }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", border: "1.5px solid rgba(79,184,200,0.5)", background: "#030e0e", flexShrink: 0, marginTop: 4 }} />
                    {i < portfolio.education.length - 1 && (
                      <div className="exp-line" style={{ flex: 1, marginTop: 4, opacity: 0.5 }} />
                    )}
                  </div>
                  <div>
                    <p style={{ fontSize: "1.3rem", fontWeight: 400, color: "#d8eef0", marginBottom: "0.3rem" }}>{e.education}</p>
                    <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.68rem", color: "#4fb8c8", letterSpacing: "0.1em", marginBottom: "0.2rem" }}>{e.institution}</p>
                    <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.62rem", color: "rgba(200,230,230,0.35)", letterSpacing: "0.05em" }}>{e.year} · {e.percentage}</p>
                  </div>
                </div>
              ))}
  </section>
)}
            
            
             
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" style={{ padding: "8rem 4rem 6rem", position: "relative", zIndex: 1, borderTop: "1px solid rgba(79,184,200,0.08)" }}>
        <div style={{ maxWidth: 700 }}>
          <span className="section-label">Let's Connect</span>
          <h2 style={{ fontSize: "clamp(2.5rem, 6vw, 5.5rem)", fontWeight: 300, lineHeight: 1, marginTop: "1.5rem", marginBottom: "2rem" }}>
            Have an idea?<br />
            <span className="italic-em">Let's build it.</span>
          </h2>
          <p style={{ fontSize: "1.1rem", lineHeight: 1.8, color: "rgba(200,230,230,0.55)", fontWeight: 300, maxWidth: 480, marginBottom: "3rem" }}>
            Whether you're looking to collaborate, commission work, or just want to talk craft — my inbox is always open.
          </p>

          <a href="mailto:hello@alexmercer.dev"
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
            style={{
              display: "inline-flex", alignItems: "center", gap: "1rem",
              fontFamily: "'Space Mono', monospace", fontSize: "0.75rem", letterSpacing: "0.2em",
              textTransform: "uppercase", color: "#030e0e",
              background: "#4fb8c8", padding: "1rem 2.5rem",
              textDecoration: "none", transition: "background 0.2s, color 0.2s",
            }}>
            Say Hello →
          </a>

          <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap", marginTop: "4rem" }}>
          
          
          {portfolio.socials?.[0] &&
  Object.entries(portfolio.socials[0]).map(([platform, handle]) =>
    handle && (
      <a
        key={platform}
        href={`https://${handle}`}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: "0.65rem",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: "rgba(200,230,230,0.4)",
          textDecoration: "none",
          transition: "color 0.2s"
        }}
        onFocus={(e) => (e.target.style.color = "#4fb8c8")}
      >
        {platform}
      </a>
    )
  )
}
           
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: "6rem", paddingTop: "2rem", borderTop: "1px solid rgba(79,184,200,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.15em", color: "rgba(200,230,230,0.2)", textTransform: "uppercase" }}>
            © {new Date().getFullYear()} {portfolio.name} · {portfolio.place}
          </span>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.15em", color: "rgba(200,230,230,0.2)", textTransform: "uppercase" }}>
            Crafted with intent
          </span>
        </div>
      </section>
    </div>
  );
}