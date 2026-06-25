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
    { id:1, title:"MOMZ CARE",       category:"",    thumbnail:"adhouse/Momzcare.png",          youtubeId:"Ll16FhXEwuA" },
    { id:2, title:"NIRMAL HAIR OIL",      category:"",          thumbnail:"adhouse/Nirmal.png",   youtubeId:"ZS4mOBXzQBo"    },
    { id:3, title:"CAPKON",category:"", thumbnail:"/adhouse/capkon.jpeg",  youtubeId:"pPpvVY3iunU" },
    { id:4, title:"NELLY",   category:"",            thumbnail:"/adhouse/nelly2.png",     youtubeId:"BKg6x36pJSQ"  },
    { id:5, title:"LOTZ",   category:"LED Screen Advertisement",   thumbnail:"/adhouse/Lotz1.png",     youtubeId:"9B5geLLP89Y"  },
    { id:6, title:"JEWELS",    category:"Cinematic Brand Film",       thumbnail:"/adhouse/jewels.png",      youtubeId:"v=rK_z1bq3hRk"  },
    { id:7, title:"LOTZ",    category:"Cinematic Brand Film",       thumbnail:"/adhouse/Lotz2.png",      youtubeId:"D1THhqIjrsE"  },
    { id:8, title:"AGREEMENT",    category:"",       thumbnail:"/adhouse/agreement.png",      youtubeId:"Hkzu9Ek-PIA"  },
    { id:9, title:"LOTZ",    category:"Cinematic Brand Film",       thumbnail:"/adhouse/Lotz3.png",      youtubeId:"4fScfBwd3B0"  },
];

const BRAND = "#6c63ff";
const BRAND_DEEP = "#4e46e5";
const INK = "#0a0a12";
const WHITE = "#ffffff";
const MIST = "#f4f3ff";

const DISPLAY_FONT = "'Archivo Black','Helvetica Neue',Arial,sans-serif";
const BODY_FONT = "'Inter','Helvetica Neue',Arial,sans-serif";
const MONO_FONT = "'JetBrains Mono','Courier New',monospace";

const SHOWREEL_ID = "V0mNF-M3pw8";

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

function useIsMobile(breakpoint = 768) {
    const [isMobile, setIsMobile] = useState(
      typeof window !== "undefined" ? window.innerWidth <= breakpoint : false
    );
  
    useEffect(() => {
      const onResize = () => setIsMobile(window.innerWidth <= breakpoint);
      onResize();
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    }, [breakpoint]);
  
    return isMobile;
  }

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
    const isMobile = useIsMobile();
  
    // choose video based on device
    const videoSrc = isMobile
      ? "https://res.cloudinary.com/dvnifq2mi/video/upload/v1782391247/potrait_2_dbhoav.mp4"
      : "https://res.cloudinary.com/dvnifq2mi/video/upload/v1782391191/landscape_2_gvyyaj.mp4";
  
    return (
      <section
        style={{
          position: "relative",
          height: "100svh",
          minHeight: "580px",
          overflow: "hidden",
          background: INK,
        }}
      >
        {/* Background Video */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
            overflow: "hidden",
          }}
        >
          <video
            key={videoSrc}     // reload when switching mobile/desktop
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
  
              // different sizing logic
              ...(isMobile
                ? {
                    width: "100vw",
                    height: "100svh",
                    objectFit: "cover",
                  }
                : {
                    width: "100vw",
                    height: "100vh",
                    objectFit: "cover",
                  }),
  
              transform: "translate(-50%, -50%) scale(1.03)",
            }}
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
  
          {/* overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg, rgba(10,10,18,0.55) 0%, rgba(10,10,18,0.15) 40%, rgba(10,10,18,0.85) 100%)",
            }}
          />
        </div>
  
        {/* Logo top-left */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          style={{
            position: "absolute",
            top: "clamp(20px,4vw,36px)",
            left: "clamp(20px,5vw,48px)",
            zIndex: 2,
          }}
        >
          <img
            src={LOGO_SRC}
            alt="Ad House"
            style={{
              height: "clamp(28px,5vw,44px)",
              filter: "brightness(0) invert(1)",
            }}
          />
        </motion.div>
  
        {/* Watermark */}
        <div
          style={{
            position: "absolute",
            bottom: "clamp(16px,3vw,28px)",
            right: "clamp(20px,5vw,48px)",
            zIndex: 2,
            fontFamily: MONO_FONT,
            fontSize: "10px",
            letterSpacing: "0.2em",
            color: "rgba(255,255,255,0.2)",
            textTransform: "uppercase",
            userSelect: "none",
          }}
        >
          adhouseadvertising.in
        </div>
  
        {/* Hero text */}
        <div
          style={{
            position: "absolute",
            bottom: "clamp(60px,10vh,100px)",
            left: "clamp(20px,5vw,48px)",
            zIndex: 2,
            maxWidth: "min(90vw,800px)",
          }}
        >
          <div style={{ overflow: "hidden" }}>
            <motion.h1
              initial={{ y: "105%" }}
              animate={{ y: 0 }}
              transition={{
                duration: 0.85,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.15,
              }}
              style={{
                fontFamily: DISPLAY_FONT,
                fontSize: "clamp(2.4rem,8.5vw,7rem)",
                lineHeight: 0.9,
                letterSpacing: "-0.02em",
                color: WHITE,
                margin: 0,
              }}
            >
              THE WORK
            </motion.h1>
          </div>
  
          <div
            style={{
              overflow: "hidden",
              marginBottom: "clamp(20px,4vw,36px)",
            }}
          >
            <motion.h1
              initial={{ y: "105%" }}
              animate={{ y: 0 }}
              transition={{
                duration: 0.85,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.26,
              }}
              style={{
                fontFamily: DISPLAY_FONT,
                fontSize: "clamp(2.4rem,8.5vw,7rem)",
                lineHeight: 0.9,
                letterSpacing: "-0.02em",
                color: BRAND,
                margin: 0,
              }}
            >
              SPEAKS LOUDER.
            </motion.h1>
          </div>
  
        
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
    thumbnail: "/adhouse/tvc.png",
  },

  
  {
    id: "s2", label: "02", tag: "Out-of-home",
    title: "THEATRE ADS",
    desc: "Full-screen immersive films made for the big cinema experience",
    thumbnail: "/adhouse/Theater.png",
  },
  {
    id: "s3", label: "01", tag: "Broadcast",
    title: "Cinimatic videos",
    desc: "15 to 60 second brand stories built for television impact",
    thumbnail: "/adhouse/Cinimatic.png",
  },
 

  {
    id: "s4", label: "08", tag: "Outdoor",
    title: "LED CAMPAIGNS",
    desc: "High-brightness visuals optimised for outdoor LED billboard screens",
    thumbnail: "/adhouse/Motion.png"
  },
  {
    id: "s5", label: "08", tag: "Outdoor",
    title: "MOTION VIDEO",
    desc: "High-brightness visuals optimised for outdoor LED billboard screens",
    thumbnail: "/adhouse/Motionvideo.png"
  },
  {
    id: "s5", label: "08", tag: "Outdoor",
    title: "MOTION VIDEO",
    desc: "High-brightness visuals optimised for outdoor LED billboard screens",
    thumbnail: "/adhouse/Motionvideo.png"
  },
  {
    id: "s5", label: "08", tag: "Outdoor",
    title: "LED Screen Videos",
    desc: "High-brightness visuals optimised for outdoor LED billboard screens",
    thumbnail: "/adhouse/Led.png"
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
  
    return (
      <section
        ref={ref}
        style={{
          background: MIST,
          padding: "clamp(48px,7vw,80px) 0",
          overflow: "hidden",
        }}
      >
      
  
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          style={{ padding: "0 clamp(20px,5vw,48px)" }}
        >
          <img
            src="/adhouse/client.png"
            alt="Our Clients"
            style={{
              width: "100%",
              display: "block",
              objectFit: "contain",
            }}
          />
        </motion.div>
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

// ─────────────────────────────────────────────
// DATA — Campaign
// ─────────────────────────────────────────────
const CAMPAIGN = {
    label: "Campaign Spotlight",
    title: "Shobhika",
    subtitle: "Wedding Campaign",
    description:
      "A city-wide outdoor campaign spanning hoardings, store boards, and holdings — designed to dominate every key touchpoint across Calicut.",
    year: "",
    scope: ["Hoardings", "Store Boards", "Holdings", "Transit"],
    hero: "adhouse/Shobhika1.png",
    thumbnails: [
      "adhouse/Shobhika2.png",
      "adhouse/Shobhika3.png",
      "adhouse/shobhika4.png",
      "adhouse/Shobhika5.png",
      "adhouse/Shobhika6.png",
      
    ],
  };
  
  // Grid columns: 3 images = 3 cols (1 row), 4-6 = 3 cols (2 rows), 7+ = 4 cols
  function getGridCols(count) {
    if (count <= 3) return 3;
    if (count <= 6) return 3;
    return 4;
  }
  
  function CampaignSection() {
    const { ref, inView } = useFadeUpInView(0.1);
    const cols = getGridCols(CAMPAIGN.thumbnails.length);
  
    return (
      <section ref={ref} style={{ background: "#ffffff", padding: "8rem 5vw" }}>
  
        {/* ── Eyebrow + Title Row ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ marginBottom: "2.5rem" }}
        >
          <p
            style={{
              fontSize: "10px",
              letterSpacing: "0.5em",
              textTransform: "uppercase",
              color: "#aaa",
              marginBottom: "0.9rem",
            }}
          >
            {CAMPAIGN.label}
          </p>
  
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <h2
              style={{
                fontSize: "clamp(2.4rem, 5vw, 4.2rem)",
                fontWeight: 900,
                letterSpacing: "-0.03em",
                lineHeight: 0.9,
                color: "black",
                margin: 0,
              }}
            >
              {CAMPAIGN.title}{" "}
              <span
                style={{
                  color: "black",
                  WebkitTextStroke: `2px ${T.text}`,
                }}
              >
                {CAMPAIGN.subtitle}
              </span>
            </h2>
  
            <span
              style={{
                fontSize: "10px",
                letterSpacing: "0.4em",
                textTransform: "uppercase",
                color: "#bbb",
                whiteSpace: "nowrap",
              }}
            >
              {CAMPAIGN.year}
            </span>
          </div>
        </motion.div>
  
        {/* ── HERO — permanent, full width ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.85, delay: 0.1 }}
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "16/9",
            overflow: "hidden",
            marginBottom: "4px",
          }}
        >
          <img
            src={CAMPAIGN.hero}
            alt={`${CAMPAIGN.title} hero`}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
          {/* Corner badge */}
          <div
            style={{
              position: "absolute",
              top: "1.1rem",
              right: "1.1rem",
              background: "#fff",
              color: T.text,
              border: `1px solid ${T.text}`,
              fontSize: "9px",
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              padding: "5px 13px",
            }}
          >
            {CAMPAIGN.subtitle}
          </div>
        </motion.div>
  
        {/* ── GALLERY GRID — smaller images below ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75, delay: 0.25 }}
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gap: "4px",
            marginBottom: "3.5rem",
          }}
        >
          {CAMPAIGN.thumbnails.map((src, i) => (
            <div
              key={i}
              style={{
                position: "relative",
                aspectRatio: "4/3",
                overflow: "hidden",
              }}
            >
              <img
                src={src}
                alt={`Campaign ${i + 2}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                  transition: "transform 0.5s ease",
                }}
                onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.05)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
              />
              {/* Number label */}
              <span
                style={{
                  position: "absolute",
                  bottom: "8px",
                  left: "10px",
                  fontSize: "9px",
                  letterSpacing: "0.25em",
                  color: "#fff",
                  background: "rgba(53,50,84,0.6)",
                  padding: "2px 8px",
                }}
              >
                {String(i + 2).padStart(2, "0")}
              </span>
            </div>
          ))}
        </motion.div>
  
        {/* ── Description + Scope ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.35 }}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: "3rem",
          }}
        >
          <p
            style={{
              fontSize: "0.95rem",
              lineHeight: 1.8,
              color: "#666",
              maxWidth: "460px",
              flex: 1,
            }}
          >
            {CAMPAIGN.description}
          </p>
  
        
        </motion.div>
  
      </section>
    );
  }
  
// ── BRANDING DATA ─────────────────────────────
const BRANDING_CLIENT = {
    label: "Branding Work",
    client: "Branding",
    subtitle: "The Streak Factory",
    description:
      "Complete brand identity design — logo, colour palette, typography system, and collateral — built to carry The Steak Factory's story across every touchpoint.",
    scope: ["Logo Design", "Visual Identity", "Brand Guidelines", "Collateral"],
    // First image = full-width hero. Rest = big grid below.
    images: [
      "adhouse/Branding1.png",   // hero — full width
      "adhouse/Branding2.png",   // big grid
      "adhouse/Branding3.png", 
    ],
  };
  
  // ── BRANDING SECTION ──────────────────────────
  function BrandingSection() {
    const { ref, inView } = useFadeUpInView(0.08);
    const [hero, ...rest] = BRANDING_CLIENT.images;
  
    // rest.length → pick grid layout
    // 1 image  → 1 col full-width
    // 2 images → 2 equal cols
    // 3 images → 3 equal cols
    const gridCols = rest.length === 1 ? "1fr" : rest.length === 2 ? "1fr 1fr" : "1fr 1fr 1fr";
  
    return (
      <section ref={ref} style={{ background: INK, padding: "8rem 5vw" }}>
  
        {/* ── Eyebrow + Heading ── */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75 }}
          style={{ marginBottom: "3rem" }}
        >
          <p style={{
            fontFamily: MONO_FONT, fontSize: "10px", letterSpacing: "0.5em",
            textTransform: "uppercase", color: "rgba(255,255,255,0.25)",
            marginBottom: "1rem",
          }}>
            {BRANDING_CLIENT.label}
          </p>
          <div style={{
            display: "flex", alignItems: "flex-end",
            justifyContent: "space-between", flexWrap: "wrap", gap: "1rem",
          }}>
            <h2 style={{
              fontFamily: DISPLAY_FONT,
              fontSize: "clamp(2.4rem,5vw,4.5rem)",
              fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 0.9,
              color: WHITE, margin: 0,
            }}>
              {BRANDING_CLIENT.client}{" "}
              <span style={{ color: BRAND }}>{BRANDING_CLIENT.subtitle}</span>
            </h2>
            <span style={{
              fontFamily: MONO_FONT, fontSize: "9px", letterSpacing: "0.4em",
              textTransform: "uppercase", color: "rgba(255,255,255,0.18)",
            }}>
              Branding &amp; Identity
            </span>
          </div>
        </motion.div>
  
        {/* ── HERO — full width, tall ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.85, delay: 0.1 }}
          style={{
            width: "100%",
            aspectRatio: "16/8",
            overflow: "hidden",
            marginBottom: "4px",
            position: "relative",
          }}
        >
          <img
            src={hero}
            alt={`${BRANDING_CLIENT.client} hero`}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
          {/* Corner label */}
          <span style={{
            position: "absolute", top: "16px", left: "20px",
            fontFamily: MONO_FONT, fontSize: "10px", letterSpacing: "0.3em",
            textTransform: "uppercase", color: "rgba(255,255,255,0.4)",
          }}>01</span>
        </motion.div>
  
        {/* ── REST — all big, equal grid ── */}
        {rest.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.22 }}
            style={{
              display: "grid",
              gridTemplateColumns: gridCols,
              gap: "4px",
              marginBottom: "4rem",
            }}
          >
            {rest.map((src, i) => (
              <div
                key={i}
                style={{
                  position: "relative",
                  aspectRatio: "4/3",
                  overflow: "hidden",
                }}
              >
                <img
                  src={src}
                  alt={`${BRANDING_CLIENT.client} branding ${i + 2}`}
                  style={{
                    width: "100%", height: "100%", objectFit: "cover",
                    display: "block",
                    transition: "transform 0.6s cubic-bezier(0.22,1,0.36,1)",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.04)")}
                  onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                />
                <span style={{
                  position: "absolute", top: "14px", left: "18px",
                  fontFamily: MONO_FONT, fontSize: "10px", letterSpacing: "0.3em",
                  color: "rgba(255,255,255,0.35)",
                }}>
                  {String(i + 2).padStart(2, "0")}
                </span>
              </div>
            ))}
          </motion.div>
        )}
  
        {/* ── Description + Scope ── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.32 }}
          style={{
            display: "flex", justifyContent: "space-between",
            alignItems: "flex-start", flexWrap: "wrap", gap: "3rem",
          }}
        >
          <p style={{
            fontFamily: BODY_FONT, fontSize: "0.95rem", lineHeight: 1.8,
            color: "rgba(255,255,255,0.42)", maxWidth: "460px", flex: 1,
          }}>
            {BRANDING_CLIENT.description}
          </p>
  
          <div>
            <p style={{
              fontFamily: MONO_FONT, fontSize: "9px", letterSpacing: "0.45em",
              textTransform: "uppercase", color: "rgba(255,255,255,0.22)",
              marginBottom: "0.8rem",
            }}>
              Scope of Work
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "7px" }}>
              {BRANDING_CLIENT.scope.map(tag => (
                <span key={tag} style={{
                  fontFamily: MONO_FONT, fontSize: "9px", letterSpacing: "0.3em",
                  textTransform: "uppercase", color: WHITE,
                  border: "1px solid rgba(255,255,255,0.18)",
                  padding: "7px 16px",
                }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
  
      </section>
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
  
      <FeaturedProductionsSection onOpenModal={setActiveWork} />
      <CampaignSection /> 
      <BrandingSection />
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