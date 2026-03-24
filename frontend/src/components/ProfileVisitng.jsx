import { useEffect, useRef, useState } from "react";
import QRCode from "https://esm.sh/react-qr-code@2.0.15";

function loadHtml2Canvas() {
  return new Promise((resolve, reject) => {
    if (window.html2canvas) return resolve(window.html2canvas);
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
    script.onload = () => resolve(window.html2canvas);
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

export default function BusinessCard({
  name = "Alexandra Chen",
  designation = "Creative Director",
  company = "Luminary Studio",
  phone = "+1 555 091 4823",
  email = "alex@luminarystudio.io",
  profileId = "alex-chen-x4k2",
  baseUrl = "http://localhost:5173",
}) {
  const [flipped, setFlipped] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const cardRef = useRef(null);

  const profileUrl = `${baseUrl}/${profileId}`;
  const initials = name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  useEffect(() => { setTimeout(() => setMounted(true), 120); }, []);

  const captureCard = async () => {
    setCapturing(true);
  
    const wasFlipped = flipped;
    if (wasFlipped) setFlipped(false);
  
    // ✅ Wait for DOM + fonts + layout
    await document.fonts.ready;
  
    await new Promise((r) => setTimeout(r, 600)); // increase delay
  
    const el = cardRef.current;
  
    // ✅ Ensure element has size
    if (!el || el.offsetWidth === 0 || el.offsetHeight === 0) {
      throw new Error("Card not ready for capture");
    }
  
    const h2c = await loadHtml2Canvas();
  
    const canvas = await h2c(el, {
      scale: 3,
      useCORS: true,
      backgroundColor: "#ffffff",
  
      // ✅ VERY IMPORTANT FIXES
      ignoreElements: (element) => {
        // ignore hidden/backface elements
        return window.getComputedStyle(element).backfaceVisibility === "hidden";
      },
    });
  
    if (wasFlipped) setFlipped(true);
    setCapturing(false);
  
    return canvas;
  };

  const handleDownload = async () => {
    try {
      const canvas = await captureCard();
      const link = document.createElement("a");
      link.download = `${name.replace(/\s+/g, "_")}_card.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch { alert("Download failed."); }
  };

  const handleWhatsApp = async () => {
    try {
      const canvas = await captureCard();
      canvas.toBlob(async (blob) => {
        const file = new File([blob], `${name}_card.png`, { type: "image/png" });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({ files: [file], title: `${name} — ${designation}`, text: `${name}\n${designation} at ${company}\n${phone}\n${email}\n${profileUrl}` });
        } else {
          const text = encodeURIComponent(`👤 *${name}*\n💼 ${designation} @ ${company}\n📞 ${phone}\n✉️ ${email}\n🔗 ${profileUrl}`);
          const link = document.createElement("a");
          link.download = `${name.replace(/\s+/g, "_")}_card.png`;
          link.href = canvas.toDataURL("image/png");
          link.click();
          setTimeout(() => window.open(`https://wa.me/?text=${text}`, "_blank"), 800);
        }
      }, "image/png");
    } catch (e) { console.log("Share cancelled", e); }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Mono:wght@300;400&display=swap');

        * { box-sizing: border-box; }

        .bc-scene { perspective: 1400px; }
        .bc-inner {
          position: relative; width: 100%; height: 100%;
          transform-style: preserve-3d;
          transition: transform 0.9s cubic-bezier(0.23, 1, 0.32, 1);
        }
        .bc-inner.flipped { transform: rotateY(180deg); }
        .bc-face {
          position: absolute; inset: 0;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          border-radius: 16px; overflow: hidden;
        }
        .bc-back { transform: rotateY(180deg); }

        .bc-mount {
          opacity: 0; transform: translateY(28px) scale(0.96);
          transition: opacity 0.8s cubic-bezier(0.23,1,0.32,1), transform 0.8s cubic-bezier(0.23,1,0.32,1);
        }
        .bc-mount.on { opacity: 1; transform: none; }

        .bc-btn {
          display: flex; align-items: center; gap: 8px;
          padding: 11px 22px; border-radius: 10px;
          font-family: 'DM Mono', monospace; font-size: 11px;
          font-weight: 400; letter-spacing: 0.1em; text-transform: uppercase;
          cursor: pointer; transition: all 0.25s cubic-bezier(0.23,1,0.32,1);
          min-width: 160px; justify-content: center;
        }
        .bc-btn:disabled { opacity: 0.55; cursor: wait; }
        .bc-btn-outline {
          background: transparent; color: #2a2218;
          border: 1px solid rgba(42,34,24,0.22);
        }
        .bc-btn-outline:hover:not(:disabled) {
          background: rgba(42,34,24,0.05);
          border-color: rgba(42,34,24,0.4);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(42,34,24,0.1);
        }
        .bc-btn-wa {
          background: #1da851; color: #fff;
          border: 1px solid #1da851;
        }
        .bc-btn-wa:hover:not(:disabled) {
          background: #18923f;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(29,168,81,0.35);
        }

        @keyframes spin { to { transform: rotate(360deg); } }
        .bc-spin {
          width: 11px; height: 11px; border-radius: 50%;
          border: 1.5px solid rgba(0,0,0,0.15);
          border-top-color: currentColor;
          animation: spin 0.7s linear infinite;
        }
        .bc-spin-w {
          width: 11px; height: 11px; border-radius: 50%;
          border: 1.5px solid rgba(255,255,255,0.25);
          border-top-color: #fff;
          animation: spin 0.7s linear infinite;
        }

        .bc-row { display: flex; align-items: center; gap: 9px; }
        .bc-icon-wrap {
          width: 20px; height: 20px; border-radius: 6px;
          background: rgba(42,34,24,0.07);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
      `}</style>

      <div style={{
        minHeight: "100vh",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        background: "linear-gradient(160deg, #f9f5ef 0%, #f0ece4 50%, #e8e2d8 100%)",
        gap: 28, padding: "36px 20px",
        fontFamily: "'DM Mono', monospace",
      }}>

        {/* ── CARD ── */}
        <div
          className={`bc-mount ${mounted ? "on" : ""} bc-scene`}
          ref={cardRef}
          style={{ width: 460, height: 260, cursor: "pointer", flexShrink: 0 }}
          onClick={() => !capturing && setFlipped(f => !f)}
        >
          <div className={`bc-inner ${flipped ? "flipped" : ""}`}>

            {/* ══════════════ FRONT ══════════════ */}
            <div className="bc-face" style={{
              background: "#faf8f4",
              boxShadow: "0 2px 2px rgba(0,0,0,0.03), 0 8px 32px rgba(0,0,0,0.08), 0 32px 64px rgba(0,0,0,0.06)",
              border: "1px solid rgba(180,165,140,0.25)",
            }}>

              {/* Corner ornaments */}
              <svg style={{ position: "absolute", top: 0, left: 0 }} width="40" height="40" viewBox="0 0 40 40" fill="none">
                <path d="M4 36 L4 4 L36 4" stroke="rgba(120,100,70,0.2)" strokeWidth="1" fill="none"/>
                <path d="M8 32 L8 8 L32 8" stroke="rgba(120,100,70,0.1)" strokeWidth="0.5" fill="none"/>
              </svg>
              <svg style={{ position: "absolute", bottom: 0, right: 0 }} width="40" height="40" viewBox="0 0 40 40" fill="none">
                <path d="M36 4 L36 36 L4 36" stroke="rgba(120,100,70,0.2)" strokeWidth="1" fill="none"/>
                <path d="M32 8 L32 32 L8 32" stroke="rgba(120,100,70,0.1)" strokeWidth="0.5" fill="none"/>
              </svg>

              {/* Left gold strip */}
              <div style={{
                position: "absolute", left: 0, top: 0, bottom: 0, width: 4,
                background: "linear-gradient(180deg, #8B7355 0%, #C4A882 50%, #8B7355 100%)",
              }} />

              {/* Main content */}
              <div style={{ position: "absolute", inset: 0, left: 4, display: "flex", padding: "24px 22px 20px 26px", gap: 18 }}>

                {/* LEFT: Identity + contacts */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", minWidth: 0 }}>
                  <div>
                    <div style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: 22, fontWeight: 500,
                      color: "#1a1510", letterSpacing: "-0.01em", lineHeight: 1.15,
                    }}>{name}</div>

                    <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "7px 0" }}>
                      <div style={{ height: 1, width: 20, background: "#C4A882" }} />
                      <div style={{
                        fontFamily: "'DM Mono', monospace",
                        fontSize: 8, letterSpacing: "0.22em",
                        textTransform: "uppercase", color: "#9A7E5A",
                      }}>{designation}</div>
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {[
                      { icon: <PhoneIcon />, val: phone },
                      { icon: <MailIcon />, val: email },
                    ].map(({ icon, val }, i) => (
                      <div key={i} className="bc-row">
                        <div className="bc-icon-wrap">{icon}</div>
                        <span style={{ fontSize: 9, color: "#5a4e3c", fontFamily: "'DM Mono', monospace", letterSpacing: "0.02em" }}>{val}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 13, fontStyle: "italic",
                    color: "rgba(90,78,60,0.45)", letterSpacing: "0.04em",
                    marginTop: 4,
                  }}>{company}</div>
                </div>

                {/* Vertical rule */}
                <div style={{
                  width: 1, alignSelf: "stretch",
                  background: "linear-gradient(180deg, transparent, rgba(180,160,120,0.25) 30%, rgba(180,160,120,0.25) 70%, transparent)",
                  flexShrink: 0,
                }} />

                {/* RIGHT: QR */}
                <div style={{
                  display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "flex-end",
                  gap: 6, flexShrink: 0, paddingBottom: 2,
                }}>
                  <div style={{
                    background: "#fff", borderRadius: 10, padding: 6,
                    border: "1px solid rgba(180,160,120,0.3)",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                  }}>
                   <div
  style={{
    width: 78,
    height: 78,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }}
>
  <QRCode
    value={profileUrl}
    size={78}
    bgColor="#ffffff"
    fgColor="#1a1510"
    level="M"
  />
</div> </div>
                  <span style={{
                    fontSize: 7, letterSpacing: "0.18em",
                    textTransform: "uppercase", color: "#C4A882",
                    fontFamily: "'DM Mono', monospace",
                  }}>scan profile</span>
                </div>
              </div>

              {/* Flip hint */}
              <div style={{ position: "absolute", bottom: 9, left: "50%", transform: "translateX(-50%)" }}>
                <span style={{ fontSize: 7, color: "rgba(120,100,70,0.28)", letterSpacing: "0.2em", textTransform: "uppercase" }}>tap to flip</span>
              </div>
            </div>

            {/* ══════════════ BACK ══════════════ */}
            <div className="bc-face bc-back" style={{
              background: "#1a1510",
              boxShadow: "0 8px 40px rgba(0,0,0,0.35)",
            }}>

              {/* Dot grid */}
              <svg style={{ position: "absolute", inset: 0, opacity: 0.08 }} width="100%" height="100%">
                <defs>
                  <pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse">
                    <circle cx="1" cy="1" r="0.8" fill="#C4A882" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#dots)" />
              </svg>

              {/* Inset border */}
              <div style={{
                position: "absolute", inset: 10, borderRadius: 10,
                border: "1px solid rgba(196,168,130,0.15)",
              }} />

              {/* Corner ornaments */}
              <svg style={{ position: "absolute", top: 14, left: 14 }} width="28" height="28" viewBox="0 0 28 28" fill="none">
                <path d="M2 26 L2 2 L26 2" stroke="rgba(196,168,130,0.3)" strokeWidth="1" fill="none"/>
              </svg>
              <svg style={{ position: "absolute", bottom: 14, right: 14 }} width="28" height="28" viewBox="0 0 28 28" fill="none">
                <path d="M26 2 L26 26 L2 26" stroke="rgba(196,168,130,0.3)" strokeWidth="1" fill="none"/>
              </svg>

              {/* Centered monogram + company */}
              <div style={{
                position: "absolute", inset: 0,
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center", gap: 14,
              }}>
                <div style={{
                  width: 60, height: 60, borderRadius: "50%",
                  border: "1px solid rgba(196,168,130,0.4)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  position: "relative",
                }}>
                  <div style={{
                    position: "absolute", inset: 4, borderRadius: "50%",
                    border: "1px solid rgba(196,168,130,0.15)",
                  }} />
                  <span style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 22, fontWeight: 500,
                    color: "rgba(196,168,130,0.9)",
                    letterSpacing: "0.05em",
                  }}>{initials}</span>
                </div>

                <div style={{ textAlign: "center" }}>
                  <div style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 22, fontWeight: 400,
                    color: "rgba(245,240,230,0.88)",
                    letterSpacing: "0.12em", textTransform: "uppercase",
                  }}>{company}</div>

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, margin: "10px 0" }}>
                    <div style={{ width: 24, height: 1, background: "rgba(196,168,130,0.4)" }} />
                    <div style={{ width: 4, height: 4, borderRadius: "50%", background: "rgba(196,168,130,0.5)" }} />
                    <div style={{ width: 24, height: 1, background: "rgba(196,168,130,0.4)" }} />
                  </div>

                  <div style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 8, letterSpacing: "0.24em",
                    textTransform: "uppercase",
                    color: "rgba(196,168,130,0.4)",
                  }}>{profileId}</div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Hint */}
        <p style={{ color: "rgba(90,78,60,0.35)", fontSize: 9, letterSpacing: "0.22em", textTransform: "uppercase", margin: 0 }}>
          tap card · flip · scan qr for profile
        </p>

        {/* Buttons */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
          <button className="bc-btn bc-btn-outline" onClick={handleDownload} disabled={capturing}>
            {capturing ? <span className="bc-spin" /> : <DownloadIcon />}
            {capturing ? "Capturing…" : "Download PNG"}
          </button>
          <button className="bc-btn bc-btn-wa" onClick={handleWhatsApp} disabled={capturing}>
            {capturing ? <span className="bc-spin-w" /> : <WAIcon />}
            {capturing ? "Capturing…" : "Share via WhatsApp"}
          </button>
        </div>

        <p style={{ color: "rgba(90,78,60,0.28)", fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", textAlign: "center", maxWidth: 320, lineHeight: 1.9, margin: 0 }}>
          Mobile shares image directly · Desktop downloads + opens WhatsApp
        </p>
      </div>
    </>
  );
}

function PhoneIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(90,78,60,0.6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.12 1.22 2 2 0 012.1 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92v2z"/>
    </svg>
  );
}
function MailIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(90,78,60,0.6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  );
}
function DownloadIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/>
      <line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  );
}
function WAIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.555 4.126 1.527 5.856L.057 23.882l6.191-1.424A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.013-1.374l-.36-.214-3.724.856.88-3.62-.234-.372A9.818 9.818 0 012.182 12C2.182 6.573 6.573 2.182 12 2.182S21.818 6.573 21.818 12 17.427 21.818 12 21.818z"/>
    </svg>
  );
}