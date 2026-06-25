import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";

const LOGO_B64 = "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";

const LOGO_SRC = `data:image/webp;base64,${LOGO_B64}`;


const T = {
    bg:       "black",   // primary background
    bgAlt:    "#2e2b4a",   // darker alternating sections
    bgCard:   "#3d3a62",   // card / surface
    bgDeep:   "#28263f",   // deepest — modal, hero overlay base
    accent:   "#ffffff",   // primary accent (was gold)
    accentDim:"rgba(255,255,255,0.15)",
    text:     "#ffffff",
    alttext:"#6c63ff",
    textMid:  "rgba(255,255,255,0.55)",
    textDim:  "rgba(255,255,255,0.28)",
    border:   "rgba(255,255,255,0.1)",
    borderMid:"rgba(255,255,255,0.22)",
  };

  const FEATURED_PRODUCTIONS = [
    { id:1, title:"MOMZ CARE",       category:"Emotional TV Commercial",    thumbnail:"/VIDEO-5.jpg",          youtubeId:"Ll16FhXEwuA" },
    { id:2, title:"EASY COOK",      category:"Product Commercial",         thumbnail:"https://adhouseadvertising.in/_next/image?url=http%3A%2F%2F84.247.132.242%3A1337%2Fuploads%2FCREATIVES_400_X460_07_63242d74a5.jpg&w=2048&q=75",    youtubeId:"ZS4mOBXzQBo"    },
    { id:3, title:"AI STORY SERIES",category:"AI Storytelling Production", thumbnail:"https://adhouseadvertising.in/_next/image?url=http%3A%2F%2F84.247.132.242%3A1337%2Fuploads%2FCREATIVES_400_X460_19_dac0100f27.jpg&w=2048&q=75",  youtubeId:"pPpvVY3iunU" },
    { id:4, title:"PROJECT FOUR",   category:"Theatre Ad Film",            thumbnail:"https://adhouseadvertising.in/_next/image?url=http%3A%2F%2F84.247.132.242%3A1337%2Fuploads%2Fprkd_branding_31_d8eb8944a9.jpg&w=2048&q=75",     youtubeId:"_1YAjdyq5kQ"  },
    { id:5, title:"PROJECT FIVE",   category:"LED Screen Advertisement",   thumbnail:"https://adhouseadvertising.in/_next/image?url=http%3A%2F%2F84.247.132.242%3A1337%2Fuploads%2FCREATIVES_400_X460_19_dac0100f27.jpg&w=2048&q=75",     youtubeId:"pBFKbVINM10"  },
    { id:6, title:"PROJECT SIX",    category:"Cinematic Brand Film",       thumbnail:"https://adhouseadvertising.in/_next/image?url=http%3A%2F%2F84.247.132.242%3A1337%2Fuploads%2F400x460_POST_19_53fd483612.jpg&w=2048&q=75",      youtubeId:"66z5TDzMOkM"  },
  ];

const BRAND = "#6c63ff";
const BRAND_DEEP = "#4e46e5";
const INK = "#0a0a12";
const WHITE = "#ffffff";
const MIST = "#f4f3ff";

const DISPLAY_FONT = "'Archivo Black','Helvetica Neue',Arial,sans-serif";
const BODY_FONT = "'Inter','Helvetica Neue',Arial,sans-serif";
const MONO_FONT = "'JetBrains Mono','Courier New',monospace";

const SHOWREEL_ID = "fS4cH2fky5M";

// orientation: "portrait" = 4:5, "landscape" = 16:9, "square" = 1:1
// landscape items span 2 columns automatically in the masonry grid.
// Update each entry to match the actual aspect ratio of your real footage.
const WORKS = [
  { id:1,  reel:"001", title:"MEDIWELL",          category:"TV Commercial",       runtime:"00:38", orientation:"portrait",  thumbnail:"https://adhouseadvertising.in/_next/image?url=http%3A%2F%2F84.247.132.242%3A1337%2Fuploads%2FCREATIVES_400_X460_19_dac0100f27.jpg&w=640&q=75", youtubeId:"YOUR_VIDEO_ID_1" },
  { id:2,  reel:"002", title:"EASY COOK",         category:"Product Commercial",  runtime:"00:24", orientation:"landscape", thumbnail:"https://adhouseadvertising.in/_next/image?url=http%3A%2F%2F84.247.132.242%3A1337%2Fuploads%2FCREATIVES_400_X460_07_63242d74a5.jpg&w=640&q=75", youtubeId:"YOUR_VIDEO_ID_2" },
  { id:3,  reel:"003", title:"AI STORY SERIES",   category:"AI Production",       runtime:"01:12", orientation:"portrait",  thumbnail:"https://adhouseadvertising.in/_next/image?url=http%3A%2F%2F84.247.132.242%3A1337%2Fuploads%2Fprkd_branding_31_d8eb8944a9.jpg&w=640&q=75", youtubeId:"YOUR_VIDEO_ID_3" },
  { id:4,  reel:"004", title:"PROJECT FOUR",      category:"Theatre Ad Film",     runtime:"00:45", orientation:"portrait",  thumbnail:"https://adhouseadvertising.in/_next/image?url=http%3A%2F%2F84.247.132.242%3A1337%2Fuploads%2Fprkd_branding_31_d8eb8944a9.jpg&w=640&q=75", youtubeId:"YOUR_VIDEO_ID_4" },
  { id:5,  reel:"005", title:"PROJECT FIVE",      category:"LED Advertisement",   runtime:"00:18", orientation:"landscape", thumbnail:"https://adhouseadvertising.in/_next/image?url=http%3A%2F%2F84.247.132.242%3A1337%2Fuploads%2FCREATIVES_400_X460_19_dac0100f27.jpg&w=640&q=75", youtubeId:"YOUR_VIDEO_ID_5" },
  { id:6,  reel:"006", title:"PROJECT SIX",       category:"Brand Film",          runtime:"00:56", orientation:"square",    thumbnail:"https://adhouseadvertising.in/_next/image?url=http%3A%2F%2F84.247.132.242%3A1337%2Fuploads%2F400x460_POST_19_53fd483612.jpg&w=640&q=75", youtubeId:"YOUR_VIDEO_ID_6" },
  { id:7,  reel:"007", title:"SOCIAL REEL",       category:"Social Media",        runtime:"00:15", orientation:"portrait",  thumbnail:"https://adhouseadvertising.in/_next/image?url=http%3A%2F%2F84.247.132.242%3A1337%2Fuploads%2FCREATIVES_400_X460_07_63242d74a5.jpg&w=640&q=75", youtubeId:"YOUR_VIDEO_ID_7" },
  { id:8,  reel:"008", title:"BRAND FILM",        category:"Cinematic",           runtime:"01:04", orientation:"landscape", thumbnail:"https://adhouseadvertising.in/_next/image?url=http%3A%2F%2F84.247.132.242%3A1337%2Fuploads%2Fprkd_branding_31_d8eb8944a9.jpg&w=640&q=75", youtubeId:"YOUR_VIDEO_ID_8" },
  { id:9,  reel:"009", title:"PROJECT NINE",      category:"Festive Campaign",    runtime:"00:42", orientation:"portrait",  thumbnail:"https://adhouseadvertising.in/_next/image?url=http%3A%2F%2F84.247.132.242%3A1337%2Fuploads%2FCREATIVES_400_X460_19_dac0100f27.jpg&w=640&q=75", youtubeId:"YOUR_VIDEO_ID_9" },
  { id:10, reel:"010", title:"PROJECT TEN",       category:"Retail Launch Film",  runtime:"00:31", orientation:"square",    thumbnail:"https://adhouseadvertising.in/_next/image?url=http%3A%2F%2F84.247.132.242%3A1337%2Fuploads%2FCREATIVES_400_X460_07_63242d74a5.jpg&w=640&q=75", youtubeId:"YOUR_VIDEO_ID_10" },
  { id:11, reel:"011", title:"PROJECT ELEVEN",    category:"Corporate Film",      runtime:"01:20", orientation:"portrait",  thumbnail:"https://adhouseadvertising.in/_next/image?url=http%3A%2F%2F84.247.132.242%3A1337%2Fuploads%2Fprkd_branding_31_d8eb8944a9.jpg&w=640&q=75", youtubeId:"YOUR_VIDEO_ID_11" },
  { id:12, reel:"012", title:"PROJECT TWELVE",    category:"Outdoor Campaign",    runtime:"00:20", orientation:"landscape", thumbnail:"https://adhouseadvertising.in/_next/image?url=http%3A%2F%2F84.247.132.242%3A1337%2Fuploads%2F400x460_POST_19_53fd483612.jpg&w=640&q=75", youtubeId:"YOUR_VIDEO_ID_12" },
];


const CLIENTS = ["MEDIWELL","EASY COOK","PRKD BRANDING","BRAND FOUR","BRAND FIVE","BRAND SIX","BRAND SEVEN","BRAND EIGHT"];

function useFadeUpInView(threshold = 0.1) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: threshold });
  return { ref, inView };
}

// ── MODAL ─────────────────────────────────────
function VideoModal({ work, onClose }) {
  useEffect(() => {
    const fn = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", fn);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", fn);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, zIndex: 9999,
          background: "rgba(8,8,18,0.96)",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "5vw",
        }}
      >
        <motion.div
          initial={{ scale: 0.94, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.94, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          onClick={(e) => e.stopPropagation()}
          style={{ width: "100%", maxWidth: "1000px" }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
          <span style={{ fontFamily: MONO_FONT, fontSize: "11px", letterSpacing: "0.18em", color: "rgba(255,255,255,0.4)", textTransform: "uppercase" }}>
  {work.reel ? `Reel ${work.reel} — ` : ""}{work.category}
</span>
            <button
              onClick={onClose}
              style={{
                fontFamily: MONO_FONT, fontSize: "11px", letterSpacing: "0.15em",
                color: "rgba(255,255,255,0.5)", background: "none", border: "none", cursor: "pointer",
                textTransform: "uppercase",
              }}
              onMouseEnter={e => e.target.style.color = WHITE}
              onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.5)"}
            >
              ESC — Close
            </button>
          </div>
          <div style={{ position: "relative", paddingBottom: "56.25%", background: "#000" }}>
            <iframe
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
              src={`https://www.youtube.com/embed/${work.youtubeId}?autoplay=1&rel=0`}
              title={work.title}
              allow="autoplay; fullscreen"
              allowFullScreen
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ── HERO ─────────────────────────────────────
function HeroSection({ onScrollToReel }) {
  return (
    <section style={{
      position: "relative", height: "100svh", minHeight: "580px",
      overflow: "hidden", background: INK,
    }}>
      {/* Background video */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0, overflow: "hidden" }}>
        <iframe
          style={{
            position: "absolute", top: "50%", left: "50%",
            width: "177.78vh", height: "100vh",
            minWidth: "100%",
            transform: "translate(-50%, -50%)",
            pointerEvents: "none", border: "none",
          }}
          src={`https://www.youtube.com/embed/${SHOWREEL_ID}?autoplay=1&mute=1&controls=0&loop=1&playlist=${SHOWREEL_ID}&showinfo=0&modestbranding=1&iv_load_policy=3`}
          title="Showreel"
          allow="autoplay"
        />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(180deg,rgba(10,10,18,0.6) 0%,rgba(10,10,18,0.08) 40%,rgba(10,10,18,0.82) 100%)",
        }} />
      </div>

      {/* Logo top-left */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        style={{
          position: "absolute", top: "clamp(20px,4vw,36px)", left: "clamp(20px,5vw,48px)",
          zIndex: 2,
        }}
      >
        <img src={LOGO_SRC} alt="Ad House" style={{ height: "clamp(28px,5vw,44px)", filter: "brightness(0) invert(1)" }} />
      </motion.div>

      {/* Watermark bottom-right */}
      <div style={{
        position: "absolute", bottom: "clamp(16px,3vw,28px)", right: "clamp(20px,5vw,48px)",
        zIndex: 2, fontFamily: MONO_FONT, fontSize: "10px",
        letterSpacing: "0.2em", color: "rgba(255,255,255,0.2)", textTransform: "uppercase",
        userSelect: "none",
      }}>
        adhouseadvertising.in
      </div>

      {/* Hero text */}
      <div style={{
        position: "absolute", bottom: "clamp(60px,10vh,100px)", left: "clamp(20px,5vw,48px)",
        zIndex: 2, maxWidth: "min(90vw,800px)",
      }}>
        <div style={{ overflow: "hidden" }}>
          <motion.h1
            initial={{ y: "105%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
            style={{
              fontFamily: DISPLAY_FONT,
              fontSize: "clamp(2.4rem,8.5vw,7rem)",
              lineHeight: 0.9, letterSpacing: "-0.02em",
              color: WHITE, margin: 0,
            }}
          >
            THE WORK
          </motion.h1>
        </div>
        <div style={{ overflow: "hidden", marginBottom: "clamp(20px,4vw,36px)" }}>
          <motion.h1
            initial={{ y: "105%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: 0.26 }}
            style={{
              fontFamily: DISPLAY_FONT,
              fontSize: "clamp(2.4rem,8.5vw,7rem)",
              lineHeight: 0.9, letterSpacing: "-0.02em",
              color: BRAND, margin: 0,
            }}
          >
            SPEAKS LOUDER.
          </motion.h1>
        </div>
        <motion.button
          onClick={onScrollToReel}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.6 }}
          style={{
            fontFamily: MONO_FONT, fontSize: "12px", letterSpacing: "0.16em",
            color: WHITE, background: "none",
            border: "1px solid rgba(255,255,255,0.3)",
            padding: "clamp(10px,2vw,14px) clamp(16px,3vw,24px)",
            cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "10px",
            textTransform: "uppercase",
          }}
        >
          18 Productions
          <motion.span animate={{ y: [0, 4, 0] }} transition={{ duration: 1.8, repeat: Infinity }}>↓</motion.span>
        </motion.button>
      </div>
    </section>
  );
}

// ── FILMSTRIP REEL ────────────────────────────
function SprocketRail() {
  return (
    <div style={{ display: "flex", gap: "20px", padding: "8px 0", overflow: "hidden" }}>
      {Array.from({ length: 60 }).map((_, i) => (
        <div key={i} style={{ width: 5, height: 5, borderRadius: 1, background: "rgba(255,255,255,0.15)", flexShrink: 0 }} />
      ))}
    </div>
  );
}


// ── SERVICES DATA ─────────────────────────────
// Two rows scroll in opposite directions. Replace thumbnails with your own images.
const SERVICES_ROW_A = [
  {
    id: "s1", label: "01", tag: "Broadcast",
    title: "TVC ADS",
    desc: "15 to 60 second brand stories built for television impact",
    thumbnail: "https://d26oc3sg82pgk3.cloudfront.net/files/media/edit/image/37573/original.jpg",
  },
  {
    id: "s2", label: "02", tag: "Out-of-home",
    title: "THEATRE ADS",
    desc: "Full-screen immersive films made for the big cinema experience",
    thumbnail: "https://img.freepik.com/free-photo/3d-cinema-theatre-room-with-seating_23-2151020739.jpg?semt=ais_hybrid&w=740&q=80",
  },
  {
    id: "s3", label: "03", tag: "Storytelling",
    title: "CINEMATIC FILMS",
    desc: "Narrative-driven brand films with a cinematic production finish",
    thumbnail: "data:image/jpeg;base64,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",
  },
  {
    id: "s4", label: "04", tag: "Commerce",
    title: "PRODUCT VIDEOS",
    desc: "Clean hero shots and demo reels that make products sell themselves",
    thumbnail: "https://creative-garage.in/wp-content/uploads/2025/10/65d73f6024bb8ba5299464ce_Product-Video.jpg",
  },
  {
    id: "s5", label: "05", tag: "Design & Motion",
    title: "MOTION GRAPHICS",
    desc: "Animated typography, logo reveals, and visual effects for any screen",
    thumbnail: "data:image/jpeg;base64,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",
  },
  {
    id: "s6", label: "06", tag: "Technology",
    title: "AI VIDEOS",
    desc: "Generative AI production — concept to final cut, faster than ever",
    thumbnail: "data:image/jpeg;base64,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",
  },
  {
    id: "s7", label: "07", tag: "Digital",
    title: "SOCIAL REELS",
    desc: "Short-form vertical content engineered for scroll-stopping reach",
    thumbnail: "https://www.webnx.in/wp-content/uploads/2025/04/The-Power-of-Reels-Shorts-Why-Short-Form-Video-is-Dominating-Social-Media.png",
  },
  {
    id: "s8", label: "08", tag: "Outdoor",
    title: "LED CAMPAIGNS",
    desc: "High-brightness visuals optimised for outdoor LED billboard screens",
    thumbnail: "data:image/jpeg;base64,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",
  },
];



// ── SERVICE CARD ──────────────────────────────
function ServiceCard({ service }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flexShrink: 0,
        width: "min(300px,62vw)",
        position: "relative",
        cursor: "default",
      }}
    >
      <div style={{ position: "relative", aspectRatio: "4/5", overflow: "hidden", background: "#18182a" }}>
        {/* Background image */}
        <img
          src={service.thumbnail} alt={service.title} draggable={false}
          style={{
            width: "100%", height: "100%", objectFit: "cover",
            transform: hovered ? "scale(1.06)" : "scale(1)",
            filter: hovered 
  ? "brightness(1)" 
  : "brightness(0.9)",
            transition: "transform 0.8s cubic-bezier(0.22,1,0.36,1), filter 0.5s",
          }}
        />

        {/* Always-on dark gradient bottom */}
        <div style={{
          position: "absolute", inset: 0,
         background: "linear-gradient(170deg, rgba(10,10,18,0.08) 0%, rgba(10,10,18,0.45) 80%)",
          transition: "opacity 0.4s",
        }} />

        {/* Hover tint */}
        <div style={{
          position: "absolute", inset: 0,
          background: `rgba(108,99,255,${hovered ? 0.2 : 0})`,
          transition: "background 0.4s",
        }} />

        {/* Top — number + tag */}
        <div style={{
          position: "absolute", top: "18px", left: "18px", right: "18px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <span style={{
            fontFamily: MONO_FONT, fontSize: "10px", letterSpacing: "0.18em",
            color: "rgba(255,255,255,0.35)",
          }}>{service.label}</span>
          <span style={{
            fontFamily: MONO_FONT, fontSize: "9px", letterSpacing: "0.14em",
            color: hovered ? BRAND : "rgba(255,255,255,0.3)",
            textTransform: "uppercase",
            transition: "color 0.3s",
          }}>{service.tag}</span>
        </div>

        {/* Bottom — title + desc */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          padding: "20px 18px 20px",
        }}>
          {/* Accent line */}
          <div style={{
            width: hovered ? "40px" : "20px", height: "2px",
            background: BRAND, marginBottom: "12px",
            transition: "width 0.4s cubic-bezier(0.22,1,0.36,1)",
          }} />

          <h3 style={{
            fontFamily: DISPLAY_FONT,
            fontSize: "clamp(1.3rem,2.5vw,1.7rem)",
            letterSpacing: "-0.02em", lineHeight: 1,
            color: WHITE, margin: "0 0 10px",
          }}>{service.title}</h3>

          <p style={{
            fontFamily: BODY_FONT, fontSize: "12px", lineHeight: 1.55,
            color: "rgba(255,255,255,0.55)",
            margin: 0,
            maxHeight: hovered ? "60px" : "0px",
            overflow: "hidden",
            opacity: hovered ? 1 : 0,
            transition: "max-height 0.4s ease, opacity 0.35s ease",
          }}>{service.desc}</p>
        </div>
      </div>
    </div>
  );
}

// ── MARQUEE ROW (services) ────────────────────
function MarqueeRow({ services, direction, duration }) {
  const [paused, setPaused] = useState(false);
  const looped = [...services, ...services, ...services, ...services];
  return (
    <div
      style={{ overflow: "hidden", width: "100%" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      <div
        className={direction === "left" ? "adh-marquee-left" : "adh-marquee-right"}
        style={{
          display: "flex", gap: "3px", width: "max-content",
          animationDuration: `${duration}s`,
          animationPlayState: paused ? "paused" : "running",
        }}
      >
        {looped.map((svc, i) => (
          <ServiceCard key={`${svc.id}-${i}`} service={svc} />
        ))}
      </div>
    </div>
  );
}

function FilmReelSection({ sectionRef }) {
  return (
    <section ref={sectionRef} style={{ background: INK, padding: "clamp(48px,7vw,80px) 0", position: "relative", overflow: "hidden" }}>
      {/* Section header */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "flex-end",
        padding: "0 clamp(20px,5vw,48px)", marginBottom: "clamp(28px,4vw,52px)",
      }}>
        <div>
          <p style={{
            fontFamily: MONO_FONT, fontSize: "10px", letterSpacing: "0.25em",
            color: "rgba(255,255,255,0.3)", textTransform: "uppercase", marginBottom: "8px",
          }}>What We Do</p>
          <h2 style={{
            fontFamily: DISPLAY_FONT,
            fontSize: "clamp(1.6rem,4vw,3rem)",
            letterSpacing: "-0.02em", lineHeight: 0.95,
            color: WHITE, margin: 0,
          }}>
            OUR{" "}
            <span style={{ color: BRAND }}>SERVICES</span>
          </h2>
        </div>
        <span style={{
          fontFamily: MONO_FONT, fontSize: "10px", letterSpacing: "0.15em",
          color: "rgba(255,255,255,0.18)", textTransform: "uppercase",
          display: "none",
        }}
          className="adh-desktop-hint"
        >Hover to pause</span>
      </div>

      <SprocketRail />
      <div style={{ marginTop: "3px" }}>
        <MarqueeRow services={SERVICES_ROW_A} direction="left"  duration={42} />
      </div>
      
      <div style={{ marginTop: "3px" }}>
        <SprocketRail />
      </div>
    </section>
  );
}

// ── WORKS MASONRY GRID ───────────────────────
// Each card respects its natural aspect ratio.
// Landscape (16:9) items span 2 columns so they breathe properly.
// The grid uses CSS columns (masonry-style) on desktop, single col on mobile.

const ASPECT = {
  portrait:  "4 / 5",
  landscape: "16 / 9",
  square:    "1 / 1",
};

function WorksGrid({ onOpenModal }) {
  const { ref, inView } = useFadeUpInView(0.05);

  return (
    <section ref={ref} style={{ background: WHITE, padding: "clamp(48px,9vw,96px) clamp(20px,5vw,48px)" }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.75 }}
        style={{ marginBottom: "clamp(32px,5vw,64px)" }}
      >
        <p style={{
          fontFamily: MONO_FONT, fontSize: "11px", letterSpacing: "0.35em",
          color: "rgba(10,10,18,0.35)", textTransform: "uppercase", marginBottom: "12px",
        }}>All Productions</p>
        <h2 style={{
          fontFamily: DISPLAY_FONT,
          fontSize: "clamp(2rem,6vw,5rem)",
          letterSpacing: "-0.02em", lineHeight: 0.92,
          color: INK, margin: 0,
        }}>
          THE{" "}
          <span style={{ color: "transparent", WebkitTextStroke: `2px ${INK}` }}>WORK</span>
        </h2>
      </motion.div>

      {/* 3-column grid on desktop; each landscape card spans 2 cols */}
      <div className="adh-works-grid">
        {WORKS.map((work, i) => {
          const isLandscape = work.orientation === "landscape";
          return (
            <motion.div
              key={work.id}
              className={isLandscape ? "adh-card-wide" : ""}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              onClick={() => onOpenModal(work)}
              style={{
                cursor: "pointer",
                position: "relative",
                overflow: "hidden",
                background: "#f0f0f8",
                aspectRatio: ASPECT[work.orientation] || "4/5",
              }}
            >
              <GridCard work={work} />
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

function GridCard({ work }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      style={{ width: "100%", height: "100%", position: "relative" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img
        src={work.thumbnail} alt={work.title}
        style={{
          width: "100%", height: "100%", objectFit: "cover",
          transform: hovered ? "scale(1.05)" : "scale(1)",
          transition: "transform 0.65s cubic-bezier(0.22,1,0.36,1)",
        }}
      />
      {/* Hover overlay */}
      <div style={{
        position: "absolute", inset: 0,
        background: hovered ? "rgba(78,70,229,0.84)" : "linear-gradient(to top,rgba(10,10,18,0.78) 0%,transparent 52%)",
        transition: "background 0.35s",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      }}>
        {hovered && (
          <>
            <div style={{
              width: 52, height: 52, borderRadius: "50%",
              border: "1.5px solid rgba(255,255,255,0.55)",
              display: "flex", alignItems: "center", justifyContent: "center",
              marginBottom: "10px",
            }}>
              <span style={{ color: WHITE, fontSize: "15px", marginLeft: "3px" }}>▶</span>
            </div>
            <span style={{ fontFamily: MONO_FONT, fontSize: "10px", letterSpacing: "0.2em", color: "rgba(255,255,255,0.75)", textTransform: "uppercase" }}>Watch</span>
          </>
        )}
      </div>
      {/* Default label */}
      {!hovered && (
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "14px" }}>
          <p style={{ fontFamily: MONO_FONT, fontSize: "9px", letterSpacing: "0.14em", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", margin: "0 0 3px" }}>{work.category}</p>
          <p style={{ fontFamily: DISPLAY_FONT, fontSize: "clamp(0.85rem,1.8vw,1.15rem)", color: WHITE, margin: 0, letterSpacing: "-0.01em", lineHeight: 1.1 }}>{work.title}</p>
        </div>
      )}
      {/* Reel number badge */}
      <span style={{
        position: "absolute", top: "12px", left: "12px",
        fontFamily: MONO_FONT, fontSize: "9px", letterSpacing: "0.12em",
        color: "rgba(255,255,255,0.4)",
      }}>{work.reel}</span>
    </div>
  );
}

function FeaturedProductionsSection({ onOpenModal }) {
  const { ref, inView } = useFadeUpInView();
  return (
    <section ref={ref} style={{ padding:"8rem 5vw", background: T.bg }}>
      <motion.div
        initial={{ opacity:0, y:40 }}
        animate={inView ? { opacity:1, y:0 } : {}}
        transition={{ duration:0.8 }}
        style={{ marginBottom:"5rem" }}
      >
        <p className="text-xs tracking-[0.5em] uppercase" style={{ color: T.textDim, marginBottom:"1rem" }}>Selected Work</p>
        <h2 className="text-4xl md:text-6xl font-black tracking-tighter" style={{ color: T.text }}>
          FEATURED{" "}
          <span style={{ color:"transparent", WebkitTextStroke:`2px ${T.alttext}` }}>PRODUCTIONS</span>
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px" style={{ background: T.border }}>
        {FEATURED_PRODUCTIONS.map((prod, i) => (
          <FeaturedCard key={prod.id} prod={prod} delay={i * 0.1} inView={inView} onOpenModal={onOpenModal} />
        ))}
      </div>
    </section>
  );
}

function FeaturedCard({ prod, delay, inView, onOpenModal }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      initial={{ opacity:0, y:30 }}
      animate={inView ? { opacity:1, y:0 } : {}}
      transition={{ duration:0.7, delay }}
      className="relative overflow-hidden cursor-pointer"
      style={{ background: T.bgCard, aspectRatio:"16/9" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onOpenModal(prod)}

    >
      <img
        src={prod.thumbnail}
        alt={prod.title}
        className="w-full h-full object-cover"
        style={{ transform: hovered ? "scale(1.05)" : "scale(1)", transition:"transform 0.7s ease" }}
      />

      {/* Default gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:"linear-gradient(to top, rgba(40,38,63,0.95) 0%, rgba(40,38,63,0.2) 60%, transparent 100%)",
          opacity: hovered ? 0 : 1,
          transition:"opacity 0.4s",
        }}
      />

      {/* Hover state */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center gap-3"
        style={{ background:"rgba(53,50,84,0.85)", opacity: hovered ? 1 : 0, transition:"opacity 0.35s" }}
      >
        <div
          className="w-16 h-16 rounded-full border flex items-center justify-center"
          style={{ borderColor: T.borderMid, transform: hovered ? "scale(1)" : "scale(0.8)", transition:"transform 0.3s" }}
        >
          <span className="text-2xl" style={{ color: T.text, marginLeft:"4px" }}>▶</span>
        </div>
        <span className="text-xs tracking-[0.3em] uppercase" style={{ color: T.textMid }}>Watch</span>
      </div>

      {/* Labels */}
      <div className="absolute bottom-0 left-0 right-0 p-5" style={{ opacity: hovered ? 0 : 1, transition:"opacity 0.3s" }}>
        <p
          className="text-xs tracking-[0.35em] uppercase mb-1"
          style={{ color: T.textDim }}
        >
          {prod.category}
        </p>
        <h3 className="text-xl font-black tracking-tight" style={{ color: T.text }}>{prod.title}</h3>
      </div>
    </motion.div>
  );
}

// ── CLIENTS ───────────────────────────────────
function ClientsSection() {
  const { ref, inView } = useFadeUpInView();
  const doubled = [...CLIENTS, ...CLIENTS, ...CLIENTS, ...CLIENTS];
  return (
    <section ref={ref} style={{ background: MIST, padding: "clamp(48px,7vw,80px) 0", overflow: "hidden" }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
        style={{ padding: "0 clamp(20px,5vw,48px)", marginBottom: "clamp(28px,4vw,48px)" }}
      >
        <p style={{ fontFamily: MONO_FONT, fontSize: "11px", letterSpacing: "0.25em", color: "rgba(10,10,18,0.35)", marginBottom: "10px", textTransform: "uppercase" }}>Trusted By</p>
        <div style={{ height: "1px", background: "rgba(10,10,18,0.1)" }} />
      </motion.div>

      <div style={{ maskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)", WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)" }}>
        <motion.div
          style={{ display: "flex", gap: "clamp(32px,5vw,64px)", alignItems: "center", whiteSpace: "nowrap" }}
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
        >
          {doubled.map((c, i) => (
            <span key={i} style={{
              fontFamily: DISPLAY_FONT,
              fontSize: "clamp(1rem,2.5vw,1.6rem)",
              letterSpacing: "-0.01em",
              color: "rgba(10,10,18,0.2)", flexShrink: 0,
            }}>{c}</span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ── FOOTER ────────────────────────────────────
function Footer() {
  return (
    <footer style={{
      background: INK, padding: "clamp(40px,6vw,64px) clamp(20px,5vw,48px)",
      display: "flex", flexDirection: "column", gap: "clamp(24px,3vw,32px)",
    }}>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-start", gap: "24px" }}>
        <div>
          <img src={LOGO_SRC} alt="Ad House" style={{ height: "clamp(22px,4vw,32px)", filter: "brightness(0) invert(1)", marginBottom: "12px", display: "block" }} />
          <p style={{ fontFamily: BODY_FONT, fontSize: "13px", color: "rgba(255,255,255,0.35)", margin: 0, maxWidth: "240px", lineHeight: 1.6 }}>
            Advertising · Branding · Events<br />Kozhikode, Kerala
          </p>
        </div>
        <div style={{ display: "flex", gap: "clamp(20px,4vw,48px)", flexWrap: "wrap" }}>
          {["Instagram","YouTube","Facebook","Contact"].map(l => (
            <a key={l} href="#" style={{
              fontFamily: MONO_FONT, fontSize: "11px", letterSpacing: "0.15em",
              color: "rgba(255,255,255,0.35)", textDecoration: "none",
              textTransform: "uppercase", transition: "color 0.2s",
            }}
              onMouseEnter={e => e.target.style.color = WHITE}
              onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.35)"}
            >{l}</a>
          ))}
        </div>
      </div>
      <div style={{ height: "1px", background: "rgba(255,255,255,0.07)" }} />
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "12px" }}>
        <span style={{ fontFamily: MONO_FONT, fontSize: "10px", letterSpacing: "0.15em", color: "rgba(255,255,255,0.2)", textTransform: "uppercase" }}>
          © 2025 Ad House Advertising
        </span>
        <span style={{ fontFamily: MONO_FONT, fontSize: "10px", letterSpacing: "0.15em", color: "rgba(255,255,255,0.15)", textTransform: "uppercase" }}>
          adhouseadvertising.in
        </span>
      </div>
    </footer>
  );
}

// ── ROOT ─────────────────────────────────────
export default function AdHouseWorks() {
  const [activeWork, setActiveWork] = useState(null);
  const reelRef = useRef(null);

  return (
    <div style={{
      position: "relative", width: "100%", minHeight: "100vh",
      background: WHITE, color: INK,
      fontFamily: BODY_FONT, WebkitFontSmoothing: "antialiased",
      overflowX: "hidden",
    }}>
      <HeroSection onScrollToReel={() => reelRef.current?.scrollIntoView({ behavior: "smooth" })} />
      <FilmReelSection sectionRef={reelRef} />
      {/* <WorksGrid onOpenModal={setActiveWork} /> */}
      <FeaturedProductionsSection onOpenModal={setActiveWork} />
      <ClientsSection />
      <Footer />

      {activeWork && <VideoModal work={activeWork} onClose={() => setActiveWork(null)} />}

      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        ::selection { background: rgba(108,99,255,0.25); }

        @keyframes adh-scroll-left {
          from { transform: translateX(0); }
          to   { transform: translateX(-25%); }
        }
        @keyframes adh-scroll-right {
          from { transform: translateX(-25%); }
          to   { transform: translateX(0); }
        }
        .adh-marquee-left {
          animation: adh-scroll-left linear infinite;
          animation-timing-function: linear;
        }
        .adh-marquee-right {
          animation: adh-scroll-right linear infinite;
          animation-timing-function: linear;
        }
        @media (prefers-reduced-motion: reduce) {
          .adh-marquee-left, .adh-marquee-right { animation: none; }
        }

        /* ── Works masonry grid ── */
        .adh-works-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 4px;
        }
        /* Landscape cards span 2 of 3 columns */
        .adh-card-wide {
          grid-column: span 2;
        }
        /* Tablet: 2 columns, landscape still spans 2 (full width) */
        @media (max-width: 768px) {
          .adh-works-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .adh-card-wide {
            grid-column: span 2;
          }
        }
        /* Mobile: single column, orientation ignored */
        @media (max-width: 480px) {
          .adh-works-grid {
            grid-template-columns: 1fr;
          }
          .adh-card-wide {
            grid-column: span 1;
          }
        }

        img { max-width: 100%; display: block; }
        button { font-family: inherit; }
        a { font-family: inherit; }
      `}</style>
    </div>
  );
}