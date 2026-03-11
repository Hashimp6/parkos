import { useEffect, useRef, useState } from "react";
import QRCode from "https://esm.sh/react-qr-code@2.0.15";

// Loads html2canvas from CDN dynamically
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
  website = "https://luminarystudio.io",
}) {
  const [flipped, setFlipped] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => { setTimeout(() => setMounted(true), 100); }, []);

  const vcard = [
    "BEGIN:VCARD", "VERSION:3.0",
    `FN:${name}`, `TITLE:${designation}`, `ORG:${company}`,
    `TEL:${phone}`, `EMAIL:${email}`, `URL:${website}`,
    "END:VCARD",
  ].join("\n");

  // Capture front face as PNG blob
  const captureCard = async () => {
    setCapturing(true);
    // Make sure card shows front
    const wasFlipped = flipped;
    if (wasFlipped) setFlipped(false);
    await new Promise(r => setTimeout(r, 400)); // wait for flip animation

    const h2c = await loadHtml2Canvas();
    const canvas = await h2c(cardRef.current, {
      scale: 3,
      useCORS: true,
      backgroundColor: null,
      logging: false,
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
    } catch (e) {
      alert("Download failed. Please try again.");
    }
  };

  const handleWhatsApp = async () => {
    try {
      const canvas = await captureCard();

      // Try Web Share API with file (works on mobile)
      canvas.toBlob(async (blob) => {
        const file = new File([blob], `${name}_card.png`, { type: "image/png" });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: `${name} — ${designation}`,
            text: `${name}\n${designation} at ${company}\n${phone}\n${email}`,
          });
        } else {
          // Fallback: open WhatsApp with text + instruct to attach image manually
          const text = encodeURIComponent(
            `👤 *${name}*\n💼 ${designation} @ ${company}\n📞 ${phone}\n✉️ ${email}\n🌐 ${website}`
          );
          // Also trigger download so they can attach it
          const link = document.createElement("a");
          link.download = `${name.replace(/\s+/g, "_")}_card.png`;
          link.href = canvas.toDataURL("image/png");
          link.click();
          setTimeout(() => {
            window.open(`https://wa.me/?text=${text}`, "_blank");
          }, 800);
        }
      }, "image/png");
    } catch (e) {
      // User cancelled share or error
      console.log("Share cancelled", e);
    }
  };

  const ActionButton = ({ onClick, children, bg, hoverBg, shadow, shadowHover }) => {
    const [hovered, setHovered] = useState(false);
    return (
      <button
        onClick={onClick}
        disabled={capturing}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: "flex", alignItems: "center", gap: "8px",
          padding: "11px 20px", borderRadius: "12px",
          fontFamily: "'DM Mono', monospace", fontSize: "11px",
          fontWeight: 400, letterSpacing: "0.08em", textTransform: "uppercase",
          color: "#fff", border: "none", cursor: capturing ? "wait" : "pointer",
          background: hovered ? hoverBg : bg,
          boxShadow: hovered ? shadowHover : shadow,
          transform: hovered ? "translateY(-2px)" : "translateY(0)",
          transition: "all 0.22s cubic-bezier(0.23,1,0.32,1)",
          opacity: capturing ? 0.6 : 1,
          minWidth: "148px", justifyContent: "center",
        }}
      >
        {children}
      </button>
    );
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=DM+Mono:wght@300;400&display=swap');
        .cs { perspective: 1200px; }
        .ci { position:relative;width:100%;height:100%;transition:transform 0.8s cubic-bezier(0.23,1,0.32,1);transform-style:preserve-3d; }
        .ci.flip { transform:rotateY(180deg); }
        .cf { position:absolute;inset:0;backface-visibility:hidden;-webkit-backface-visibility:hidden;border-radius:20px;overflow:hidden; }
        .cb { transform:rotateY(180deg); }
        .noise { position:absolute;inset:0;opacity:0.04;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");background-size:128px;pointer-events:none; }
        .sl { position:absolute;top:0;left:-100%;width:55%;height:100%;background:linear-gradient(105deg,transparent 40%,rgba(255,255,255,0.06) 50%,transparent 60%);animation:sl 5s ease-in-out infinite; }
        @keyframes sl { 0%{left:-100%} 60%,100%{left:160%} }
        .cm { opacity:0;transform:translateY(20px) scale(0.97);transition:opacity 0.7s,transform 0.7s cubic-bezier(0.23,1,0.32,1); }
        .cm.on { opacity:1;transform:none; }
        .dg { background-image:radial-gradient(rgba(255,255,255,0.1) 1px,transparent 1px);background-size:16px 16px; }

        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner { width:12px;height:12px;border:2px solid rgba(255,255,255,0.3);border-top-color:#fff;border-radius:50%;animation:spin 0.7s linear infinite; }

        .btn-row { display:flex;gap:10px;justify-content:center;flex-wrap:wrap; }

        /* divider between card and buttons */
        .action-label {
          font-family:'DM Mono',monospace;font-size:9px;letter-spacing:0.2em;
          text-transform:uppercase;color:rgba(255,255,255,0.18);text-align:center;
        }
      `}</style>

      <div style={{
        minHeight: "100vh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        background: "#0d0d0d", gap: "20px", padding: "24px",
      }}>

        {/* Card */}
        <div
          className={`cm ${mounted ? "on" : ""} cs`}
          ref={cardRef}
          style={{
            width: "420px", height: "240px", cursor: "pointer",
            fontFamily: "'DM Mono',monospace", flexShrink: 0,
            transition: "box-shadow 0.3s, transform 0.3s",
          }}
          onClick={() => !capturing && setFlipped(f => !f)}
        >
          <div className={`ci ${flipped ? "flip" : ""}`}>

            {/* ── FRONT ── */}
            <div className="cf" style={{ background: "#080810" }}>
              <div className="noise" />
              <div className="sl" />
              <div style={{ position:"absolute",top:0,left:0,right:0,height:"2px",background:"linear-gradient(90deg,transparent,#c9a96e 30%,#f0d898 50%,#c9a96e 70%,transparent)" }} />
              <div style={{ position:"absolute",top:"-70px",right:"-70px",width:"220px",height:"220px",borderRadius:"50%",border:"1px solid rgba(201,169,110,0.1)" }} />
              <div style={{ position:"absolute",top:"-40px",right:"-40px",width:"150px",height:"150px",borderRadius:"50%",border:"1px solid rgba(201,169,110,0.06)" }} />

              <div style={{ position:"absolute",inset:0,display:"flex",padding:"26px 28px",gap:"18px",alignItems:"stretch" }}>
                <div style={{ flex:1,display:"flex",flexDirection:"column",justifyContent:"space-between",minWidth:0 }}>
                  <div>
                    <div style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:"24px",fontWeight:300,color:"#f0e8d8",lineHeight:1.15,letterSpacing:"0.01em" }}>{name}</div>
                    <div style={{ marginTop:"5px",fontSize:"8px",letterSpacing:"0.22em",textTransform:"uppercase",color:"#c9a96e" }}>{designation}</div>
                  </div>
                  <div>
                    <div style={{ fontSize:"8px",letterSpacing:"0.18em",textTransform:"uppercase",color:"rgba(240,232,216,0.3)",marginBottom:"10px",borderBottom:"1px solid rgba(201,169,110,0.12)",paddingBottom:"8px" }}>{company}</div>
                    <div style={{ display:"flex",flexDirection:"column",gap:"6px" }}>
                      {[{ label:"TEL",val:phone },{ label:"MAIL",val:email },{ label:"WEB",val:website.replace("https://","") }].map(({ label, val }) => (
                        <div key={label} style={{ display:"flex",alignItems:"baseline",gap:"8px" }}>
                          <span style={{ fontSize:"7px",letterSpacing:"0.15em",color:"rgba(201,169,110,0.5)",minWidth:"28px" }}>{label}</span>
                          <span style={{ fontSize:"8px",color:"rgba(240,232,216,0.65)",letterSpacing:"0.02em",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div style={{ display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"flex-end",gap:"5px",flexShrink:0 }}>
                  <div style={{ background:"#fff",borderRadius:"8px",padding:"7px",border:"1px solid rgba(201,169,110,0.3)",boxShadow:"0 0 24px rgba(201,169,110,0.12)" }}>
                    <QRCode value={vcard} size={72} bgColor="#ffffff" fgColor="#111111" level="M" />
                  </div>
                  <div style={{ fontSize:"6px",letterSpacing:"0.14em",textTransform:"uppercase",color:"rgba(201,169,110,0.4)",textAlign:"center" }}>scan to save</div>
                </div>
              </div>

              <div style={{ position:"absolute",bottom:"10px",left:"28px",fontSize:"6px",letterSpacing:"0.2em",textTransform:"uppercase",color:"rgba(255,255,255,0.08)" }}>tap to flip</div>
            </div>

            {/* ── BACK ── */}
            <div className="cf cb dg" style={{ background:"#0a0805" }}>
              <div className="noise" />
              <div style={{ position:"absolute",bottom:0,left:0,right:0,height:"2px",background:"linear-gradient(90deg,transparent,#c9a96e 30%,#f0d898 50%,#c9a96e 70%,transparent)" }} />
              <div style={{ position:"absolute",right:"-5px",top:"50%",transform:"translateY(-50%)",fontFamily:"'Cormorant Garamond',serif",fontSize:"170px",fontWeight:600,color:"rgba(201,169,110,0.05)",lineHeight:1,userSelect:"none",pointerEvents:"none" }}>{name[0]}</div>
              <div style={{ position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"8px" }}>
                <div style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:"32px",fontWeight:300,letterSpacing:"0.1em",color:"rgba(201,169,110,0.9)",textTransform:"uppercase",textAlign:"center" }}>{company}</div>
                <div style={{ width:"48px",height:"1px",background:"linear-gradient(90deg,transparent,#c9a96e,transparent)" }} />
                <div style={{ fontSize:"7px",letterSpacing:"0.3em",textTransform:"uppercase",color:"rgba(240,232,216,0.2)" }}>{website.replace("https://","")}</div>
              </div>
            </div>

          </div>
        </div>

        {/* Tap hint */}
        <p style={{ color:"rgba(255,255,255,0.15)",fontSize:"10px",letterSpacing:"0.2em",textTransform:"uppercase",margin:0 }}>
          tap card to flip
        </p>

        {/* ── Action Buttons ── */}
        <div className="action-label">{capturing ? "Capturing card..." : "Share or save"}</div>

        <div className="btn-row">

          {/* Download */}
          <ActionButton
            onClick={handleDownload}
            bg="rgba(255,255,255,0.07)"
            hoverBg="rgba(255,255,255,0.13)"
            shadow="0 2px 12px rgba(0,0,0,0.3)"
            shadowHover="0 8px 24px rgba(0,0,0,0.4)"
          >
            {capturing ? <span className="spinner" /> : (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
            )}
            {capturing ? "Capturing…" : "Download PNG"}
          </ActionButton>

          {/* WhatsApp */}
          <ActionButton
            onClick={handleWhatsApp}
            bg="linear-gradient(135deg, #1da851, #128c3e)"
            hoverBg="linear-gradient(135deg, #22c55e, #16a34a)"
            shadow="0 4px 18px rgba(29,168,81,0.35)"
            shadowHover="0 8px 28px rgba(29,168,81,0.5)"
          >
            {capturing ? <span className="spinner" /> : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.555 4.126 1.527 5.856L.057 23.882l6.191-1.424A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.013-1.374l-.36-.214-3.724.856.88-3.62-.234-.372A9.818 9.818 0 012.182 12C2.182 6.573 6.573 2.182 12 2.182S21.818 6.573 21.818 12 17.427 21.818 12 21.818z"/>
              </svg>
            )}
            {capturing ? "Capturing…" : "Share on WhatsApp"}
          </ActionButton>

        </div>

        {/* Mobile hint */}
        <p style={{ color:"rgba(255,255,255,0.1)",fontSize:"9px",letterSpacing:"0.12em",textTransform:"uppercase",textAlign:"center",maxWidth:"320px",lineHeight:1.6,margin:0 }}>
          On mobile, card image shares directly · On desktop, image downloads + WhatsApp opens
        </p>
      </div>
    </>
  );
}