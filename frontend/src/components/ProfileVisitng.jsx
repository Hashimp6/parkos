
  import { useEffect, useState } from "react";
import QRCode from "https://esm.sh/react-qr-code@2.0.15";

// ── Edit your details here ────────────────────────────────────────────────────
const DATA = {
  name: "Arjun Menon",
  designation: "Senior Architect",
  company: "Menon & Associates",
  phone: "+91 98475 12345",
  email: "arjun@menonarch.in",
  website: "https://menonarch.in",
  profileId: "MA · 2024 · 001",
};

// ── QR canvas helper ──────────────────────────────────────────────────────────
function loadQRLib() {
  return new Promise((resolve, reject) => {
    if (window.QRCode) return resolve(window.QRCode);
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js";
    s.onload = () => resolve(window.QRCode);
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

async function renderQRToCanvas(url, size) {
  const QRLib = await loadQRLib();
  const container = document.createElement("div");
  container.style.cssText = "position:fixed;top:-9999px;left:-9999px";
  document.body.appendChild(container);
  return new Promise((resolve) => {
    new QRLib(container, {
      text: url, width: size, height: size,
      colorDark: "#1a1208", colorLight: "#ffffff",
      correctLevel: QRLib.CorrectLevel.M,
    });
    setTimeout(() => {
      const qc = container.querySelector("canvas");
      const out = document.createElement("canvas");
      out.width = size; out.height = size;
      if (qc) out.getContext("2d").drawImage(qc, 0, 0, size, size);
      document.body.removeChild(container);
      resolve(out);
    }, 150);
  });
}

// ── Canvas export for download / WhatsApp ─────────────────────────────────────
async function buildCardCanvas({ name, designation, company, phone, email, domain, website }) {
  const W = 920, H = 520;
  const canvas = document.createElement("canvas");
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext("2d");
  await document.fonts.ready;

  function rrect(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  // Background
  ctx.fillStyle = "#f5f0e8";
  rrect(0, 0, W, H, 32); ctx.fill();

  // Hex pattern
  const hs = 32;
  ctx.strokeStyle = "rgba(155,122,32,0.06)"; ctx.lineWidth = 0.8;
  for (let r = 0; r < H / hs + 2; r++) {
    for (let c = 0; c < W / hs + 2; c++) {
      const x = c * hs * 1.73 + (r % 2) * hs * 0.865 - hs;
      const y = r * hs * 1.5 - hs;
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI / 180) * (60 * i - 30);
        const px = x + hs * Math.cos(a), py = y + hs * Math.sin(a);
        i ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
      }
      ctx.closePath(); ctx.stroke();
    }
  }

  // Gold border
  ctx.strokeStyle = "rgba(218,165,32,0.4)"; ctx.lineWidth = 1.5;
  rrect(0.75, 0.75, W - 1.5, H - 1.5, 32); ctx.stroke();

  // Left gold strip
  const sg = ctx.createLinearGradient(0, 0, 0, H);
  sg.addColorStop(0, "#3d2800"); sg.addColorStop(0.2, "#B8860B");
  sg.addColorStop(0.45, "#FFD700"); sg.addColorStop(0.55, "#DAA520");
  sg.addColorStop(0.8, "#B8860B"); sg.addColorStop(1, "#3d2800");
  ctx.fillStyle = sg; ctx.fillRect(0, 0, 8, H);

  // Top gold hairline
  const tg = ctx.createLinearGradient(8, 0, W, 0);
  tg.addColorStop(0, "rgba(218,165,32,0.9)");
  tg.addColorStop(0.5, "rgba(255,215,0,0.5)");
  tg.addColorStop(1, "rgba(218,165,32,0.1)");
  ctx.strokeStyle = tg; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(8, 1.5); ctx.lineTo(W, 1.5); ctx.stroke();

  // Corner ornaments
  const drawCorner = (x, y, s, flip) => {
    const d = flip ? 1 : -1;
    ctx.strokeStyle = "rgba(218,165,32,0.35)"; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(x, y + d * s); ctx.lineTo(x, y); ctx.lineTo(x + d * s, y); ctx.stroke();
    ctx.strokeStyle = "rgba(218,165,32,0.15)"; ctx.lineWidth = 0.75;
    ctx.beginPath(); ctx.moveTo(x + d * 12, y + d * s); ctx.lineTo(x + d * 12, y + d * 12); ctx.lineTo(x + d * s, y + d * 12); ctx.stroke();
    ctx.fillStyle = "rgba(218,165,32,0.5)";
    ctx.beginPath(); ctx.arc(x, y, 2.5, 0, Math.PI * 2); ctx.fill();
  };
  drawCorner(32, 32, 78, false);
  drawCorner(W - 32, H - 32, 78, true);

  // Name
  ctx.fillStyle = "#1a1208";
  ctx.font = "500 46px 'Playfair Display', Georgia, serif";
  ctx.fillText(name, 68, 110);

  // Gold rule + designation
  const gr = ctx.createLinearGradient(68, 0, 146, 0);
  gr.addColorStop(0, "#B8860B"); gr.addColorStop(0.5, "#FFD700"); gr.addColorStop(1, "rgba(218,165,32,0.3)");
  ctx.strokeStyle = gr; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(68, 132); ctx.lineTo(146, 132); ctx.stroke();
  ctx.fillStyle = "#8B6914";
  ctx.font = "400 13px 'DM Mono', monospace";
  ctx.fillText(designation.toUpperCase(), 156, 137);

  // Contacts
  const contacts = [{ t: "phone", v: phone }, { t: "mail", v: email }, { t: "globe", v: domain }];
  contacts.forEach(({ t, v }, i) => {
    const y = 210 + i * 58;
    ctx.fillStyle = "rgba(26,18,8,0.08)";
    rrect(68, y - 20, 40, 40, 10); ctx.fill();
    ctx.strokeStyle = "rgba(100,74,14,0.2)"; ctx.lineWidth = 0.5;
    rrect(68, y - 20, 40, 40, 10); ctx.stroke();
    ctx.strokeStyle = "rgba(100,74,14,0.7)"; ctx.lineWidth = 2;
    ctx.lineCap = "round"; ctx.lineJoin = "round";
    const cx = 88, cy = y, s = 9;
    if (t === "phone") {
      ctx.beginPath(); ctx.arc(cx - 3, cy - 3, 7, Math.PI * 1.1, Math.PI * 1.8); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx + 3, cy + 3, 7, Math.PI * 0.1, Math.PI * 0.8); ctx.stroke();
    } else if (t === "mail") {
      ctx.beginPath(); ctx.strokeRect(cx - s, cy - 6, s * 2, 12);
      ctx.beginPath(); ctx.moveTo(cx - s, cy - 6); ctx.lineTo(cx, cy + 1); ctx.lineTo(cx + s, cy - 6); ctx.stroke();
    } else {
      ctx.beginPath(); ctx.arc(cx, cy, s, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx - s, cy); ctx.lineTo(cx + s, cy); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(cx, cy, s * 0.55, s, 0, 0, Math.PI * 2); ctx.stroke();
    }
    ctx.fillStyle = "#3d2e12";
    ctx.font = "400 18px 'DM Mono', monospace";
    ctx.fillText(v, 120, y + 6);
  });

  // Company italic
  ctx.fillStyle = "rgba(100,78,20,0.4)";
  ctx.font = "300 italic 28px 'Cormorant Garamond', Georgia, serif";
  ctx.fillText(company, 68, H - 54);

  // Vertical divider
  const divX = W - 280;
  const dg = ctx.createLinearGradient(0, 50, 0, H - 50);
  dg.addColorStop(0, "rgba(218,165,32,0)"); dg.addColorStop(0.25, "rgba(218,165,32,0.25)");
  dg.addColorStop(0.75, "rgba(218,165,32,0.25)"); dg.addColorStop(1, "rgba(218,165,32,0)");
  ctx.strokeStyle = dg; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(divX, 50); ctx.lineTo(divX, H - 50); ctx.stroke();

  // QR code
  const qrSize = 170;
  const qrX = divX + Math.floor((W - divX - qrSize) / 2);
  const qrY = Math.floor((H - qrSize - 50) / 2);
  ctx.fillStyle = "#ffffff";
  rrect(qrX - 13, qrY - 13, qrSize + 26, qrSize + 26, 22); ctx.fill();
  ctx.strokeStyle = "rgba(184,134,11,0.4)"; ctx.lineWidth = 1.5;
  rrect(qrX - 13, qrY - 13, qrSize + 26, qrSize + 26, 22); ctx.stroke();
  const qrCanvas = await renderQRToCanvas(website, qrSize);
  ctx.drawImage(qrCanvas, qrX, qrY, qrSize, qrSize);

  ctx.fillStyle = "#B8860B";
  ctx.font = "400 13px 'DM Mono', monospace";
  ctx.textAlign = "center";
  ctx.fillText("SCAN PROFILE", divX + (W - divX) / 2, qrY + qrSize + 42);
  ctx.textAlign = "left";

  return canvas;
}

// ── SVG pattern helpers ───────────────────────────────────────────────────────
function HexPattern({ width = 500, height = 282 }) {
  const sz = 18, cols = Math.ceil(width / (sz * 1.73)) + 2, rows = Math.ceil(height / (sz * 1.5)) + 2;
  const hexagons = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = c * sz * 1.73 + (r % 2) * sz * 0.865 - sz;
      const y = r * sz * 1.5 - sz;
      const pts = Array.from({ length: 6 }, (_, i) => {
        const a = (Math.PI / 180) * (60 * i - 30);
        return `${x + sz * Math.cos(a)},${y + sz * Math.sin(a)}`;
      }).join(" ");
      hexagons.push(<polygon key={`${r}-${c}`} points={pts} fill="none" stroke="#9B7A20" strokeWidth="0.7" />);
    }
  }
  return (
    <svg style={{ position: "absolute", inset: 0, opacity: 0.06 }} width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {hexagons}
    </svg>
  );
}

function DiamondPattern({ width = 500, height = 282 }) {
  const sz = 30, diamonds = [];
  for (let r = 0; r < height / (sz * 0.6) + 2; r++) {
    for (let c = 0; c < width / sz + 2; c++) {
      const x = c * sz + (r % 2) * sz * 0.5 - sz;
      const y = r * sz * 0.6 - sz;
      const hw = sz * 0.32, cx2 = x + hw, cy2 = y + hw;
      diamonds.push(
        <rect key={`${r}-${c}`} x={x} y={y} width={hw * 2} height={hw * 2}
          transform={`rotate(45,${cx2},${cy2})`} fill="none" stroke="#C4A832" strokeWidth="0.55" />
      );
    }
  }
  return (
    <svg style={{ position: "absolute", inset: 0, opacity: 0.08 }} width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {diamonds}
    </svg>
  );
}

// ── Icons ─────────────────────────────────────────────────────────────────────
const PhoneIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="rgba(100,74,14,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.12 1.22 2 2 0 012.1 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92v2z" />
  </svg>
);
const MailIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="rgba(100,74,14,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);
const GlobeIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="rgba(100,74,14,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15 15 0 010 20a15 15 0 010-20z" />
  </svg>
);
const DownloadIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);
const WAIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.555 4.126 1.527 5.856L.057 23.882l6.191-1.424A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.013-1.374l-.36-.214-3.724.856.88-3.62-.234-.372A9.818 9.818 0 012.182 12C2.182 6.573 6.573 2.182 12 2.182S21.818 6.573 21.818 12 17.427 21.818 12 21.818z" />
  </svg>
);

// ── Main component ────────────────────────────────────────────────────────────
export default function BusinessCard({ name, designation, company, phone, email, profileId, website }) {
  
  const domain = website.replace(/^https?:\/\//, "").split("/")[0];
  const initials = name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  const [flipped, setFlipped] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [capturing, setCapturing] = useState(false);

  useEffect(() => { setTimeout(() => setMounted(true), 120); }, []);

  const captureCard = async () => {
    setCapturing(true);
    await document.fonts.ready;
    await new Promise((r) => setTimeout(r, 300));
    try {
      const canvas = await buildCardCanvas({ name, designation, company, phone, email, domain, website });
      setCapturing(false);
      return canvas;
    } catch (e) { setCapturing(false); throw e; }
  };

  const handleDownload = async () => {
    try {
      const canvas = await captureCard();
      const a = document.createElement("a");
      a.download = `${name.replace(/\s+/g, "_")}_card.png`;
      a.href = canvas.toDataURL("image/png");
      a.click();
    } catch (e) { alert("Download failed: " + e.message); }
  };

  const handleWhatsApp = async () => {
    try {
      const canvas = await captureCard();
      canvas.toBlob(async (blob) => {
        const file = new File([blob], `${name}_card.png`, { type: "image/png" });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({ files: [file], title: `${name} — ${designation}`, text: `${name}\n${designation} at ${company}\n${phone}\n${email}\n${website}` });
        } else {
          const a = document.createElement("a");
          a.download = `${name.replace(/\s+/g, "_")}_card.png`;
          a.href = canvas.toDataURL("image/png"); a.click();
          const t = encodeURIComponent(`👤 *${name}*\n💼 ${designation} @ ${company}\n📞 ${phone}\n✉️ ${email}\n🔗 ${website}`);
          setTimeout(() => window.open(`https://wa.me/?text=${t}`, "_blank"), 800);
        }
      }, "image/png");
    } catch (e) { console.log("Share cancelled", e); }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Mono:wght@300;400&display=swap');
        * { box-sizing: border-box; }
        .bc-scene { perspective: 1600px; }
        .bc-inner { position:relative;width:100%;height:100%;transform-style:preserve-3d;transition:transform 1s cubic-bezier(0.23,1,0.32,1); }
        .bc-inner.flipped { transform: rotateY(180deg); }
        .bc-face { position:absolute;inset:0;backface-visibility:hidden;-webkit-backface-visibility:hidden;border-radius:20px;overflow:hidden; }
        .bc-back-face { transform: rotateY(180deg); }
        .bc-mount { opacity:0;transform:translateY(30px) scale(0.95);transition:opacity 0.9s cubic-bezier(0.23,1,0.32,1),transform 0.9s cubic-bezier(0.23,1,0.32,1); }
        .bc-mount.on { opacity:1;transform:none; }
        @keyframes bc-spin { to { transform: rotate(360deg); } }
        .bc-spin { width:11px;height:11px;border-radius:50%;animation:bc-spin 0.7s linear infinite;display:inline-block; }
        .bc-btn { display:flex;align-items:center;gap:8px;padding:12px 24px;border-radius:12px;font-family:'DM Mono',monospace;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;cursor:pointer;transition:all 0.3s ease;min-width:170px;justify-content:center;border:none; }
        .bc-btn:disabled { opacity:0.45;cursor:wait; }
        .bc-btn-dl { background:transparent;color:rgba(212,180,80,0.85);border:1px solid rgba(196,168,60,0.25); }
        .bc-btn-dl:hover:not(:disabled) { background:rgba(196,168,60,0.08);border-color:rgba(196,168,60,0.5);transform:translateY(-2px); }
        .bc-btn-wa { background:#1da851;color:#fff;border:1px solid #1da851; }
        .bc-btn-wa:hover:not(:disabled) { background:#18923f;transform:translateY(-2px); }
      `}</style>

      {/* Page */}
      <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:28, padding:"40px 20px", background:"radial-gradient(ellipse at 30% 20%,#1e1508 0%,#0a0806 60%)", fontFamily:"'DM Mono',monospace" }}>

        {/* 3D Card Scene */}
        <div
          className={`bc-mount bc-scene ${mounted ? "on" : ""}`}
          style={{ width:500, height:282, cursor: capturing ? "wait" : "pointer", flexShrink:0 }}
          onClick={() => !capturing && setFlipped((f) => !f)}
        >
          <div className={`bc-inner ${flipped ? "flipped" : ""}`}>

            {/* ── FRONT ── */}
            <div className="bc-face" style={{ background:"#f5f0e8", boxShadow:"0 0 0 1px rgba(196,168,60,0.4),0 4px 6px rgba(0,0,0,0.4),0 20px 60px rgba(0,0,0,0.6),0 40px 80px rgba(0,0,0,0.3)" }}>
              <HexPattern width={500} height={282} />

              {/* Gold border overlay */}
              <div style={{ position:"absolute", inset:0, borderRadius:20, border:"1px solid rgba(220,185,80,0.45)", pointerEvents:"none" }} />

              {/* Left gold strip */}
              <div style={{ position:"absolute", left:0, top:0, bottom:0, width:5, background:"linear-gradient(180deg,#3d2800 0%,#B8860B 20%,#FFD700 45%,#DAA520 55%,#B8860B 80%,#3d2800 100%)", borderRadius:"20px 0 0 20px" }} />

              {/* Top gold hairline */}
              <div style={{ position:"absolute", top:0, left:5, right:0, height:2, background:"linear-gradient(90deg,rgba(218,165,32,0.9),rgba(255,215,0,0.6),rgba(218,165,32,0.2))" }} />

              {/* Corner TL */}
              <svg style={{ position:"absolute", top:0, left:5 }} width="52" height="52" viewBox="0 0 52 52" fill="none">
                <path d="M6 46L6 6L46 6" stroke="rgba(218,165,32,0.35)" strokeWidth="1.5" fill="none" />
                <path d="M12 40L12 12L40 12" stroke="rgba(218,165,32,0.15)" strokeWidth="0.75" fill="none" />
                <circle cx="6" cy="6" r="2" fill="rgba(218,165,32,0.5)" />
              </svg>
              {/* Corner BR */}
              <svg style={{ position:"absolute", bottom:0, right:0 }} width="52" height="52" viewBox="0 0 52 52" fill="none">
                <path d="M46 6L46 46L6 46" stroke="rgba(218,165,32,0.35)" strokeWidth="1.5" fill="none" />
                <path d="M40 12L40 40L12 40" stroke="rgba(218,165,32,0.15)" strokeWidth="0.75" fill="none" />
                <circle cx="46" cy="46" r="2" fill="rgba(218,165,32,0.5)" />
              </svg>

              {/* Content */}
              <div style={{ position:"absolute", inset:0, left:5, display:"flex", padding:"20px 18px 16px 22px", gap:14 }}>

                {/* Left column */}
                <div style={{ flex:1, display:"flex", flexDirection:"column", justifyContent:"space-between", minWidth:0 }}>
                  <div>
                    <div style={{ fontFamily:"'Playfair Display',serif", fontSize:24, fontWeight:500, color:"#1a1208", letterSpacing:"-0.01em", lineHeight:1.1 }}>
                      {name}
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:9, marginTop:8 }}>
                      <div style={{ height:1, width:28, background:"linear-gradient(90deg,#B8860B,#FFD700,rgba(218,165,32,0.3))" }} />
                      <span style={{ fontFamily:"'DM Mono',monospace", fontSize:7.5, letterSpacing:"0.28em", textTransform:"uppercase", color:"#8B6914" }}>
                        {designation}
                      </span>
                      <div style={{ height:1, flex:1, background:"linear-gradient(90deg,rgba(218,165,32,0.3),transparent)" }} />
                    </div>
                  </div>

                  <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                    {[
                      { icon: <PhoneIcon />, val: phone },
                      { icon: <MailIcon />,  val: email },
                      { icon: <GlobeIcon />, val: domain },
                    ].map(({ icon, val }, i) => (
                      <div key={i} style={{ display:"flex", alignItems:"center", gap:9 }}>
                        <div style={{ width:24, height:24, borderRadius:7, background:"rgba(26,18,8,0.08)", border:"0.5px solid rgba(184,134,11,0.2)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                          {icon}
                        </div>
                        <span style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:"#3d2e12", letterSpacing:"0.03em" }}>
                          {val}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:13.5, fontStyle:"italic", color:"rgba(100,78,20,0.45)", letterSpacing:"0.06em" }}>
                    {company}
                  </div>
                </div>

                {/* Divider */}
                <div style={{ width:1, alignSelf:"stretch", flexShrink:0, background:"linear-gradient(180deg,transparent 0%,rgba(218,165,32,0.15) 20%,rgba(218,165,32,0.3) 50%,rgba(218,165,32,0.15) 80%,transparent 100%)" }} />

                {/* QR column */}
                <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"flex-end", gap:7, flexShrink:0, paddingBottom:2, width:100 }}>
                  <div style={{ background:"#fff", borderRadius:12, padding:8, border:"1px solid rgba(184,134,11,0.35)", boxShadow:"0 2px 12px rgba(0,0,0,0.12)" }}>
                    <div style={{ width:82, height:82, display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <QRCode value={website} size={82} bgColor="#ffffff" fgColor="#1a1208" level="M" />
                    </div>
                  </div>
                  <span style={{ fontFamily:"'DM Mono',monospace", fontSize:7, letterSpacing:"0.2em", textTransform:"uppercase", color:"#B8860B" }}>
                    scan profile
                  </span>
                </div>
              </div>

              {/* Tap hint */}
              <div style={{ position:"absolute", bottom:7, left:"50%", transform:"translateX(-50%)" }}>
                <span style={{ fontFamily:"'DM Mono',monospace", fontSize:7, color:"rgba(150,110,30,0.25)", letterSpacing:"0.22em", textTransform:"uppercase", whiteSpace:"nowrap" }}>
                  tap to flip
                </span>
              </div>
            </div>

            {/* ── BACK ── */}
            <div className="bc-face bc-back-face" style={{ background:"#080604", boxShadow:"0 0 0 1px rgba(196,168,60,0.3),0 20px 60px rgba(0,0,0,0.8)" }}>
              <DiamondPattern width={500} height={282} />

              {/* Gold bands */}
              <div style={{ position:"absolute", top:0, left:0, right:0, height:4, background:"linear-gradient(90deg,#3d2800 0%,#B8860B 20%,#FFD700 40%,#DAA520 50%,#FFD700 60%,#B8860B 80%,#3d2800 100%)", borderRadius:"20px 20px 0 0" }} />
              <div style={{ position:"absolute", bottom:0, left:0, right:0, height:4, background:"linear-gradient(90deg,#3d2800 0%,#B8860B 20%,#FFD700 40%,#DAA520 50%,#FFD700 60%,#B8860B 80%,#3d2800 100%)", borderRadius:"0 0 20px 20px" }} />

              {/* Inner borders */}
              <div style={{ position:"absolute", inset:12, borderRadius:12, border:"1px solid rgba(196,168,60,0.12)" }} />
              <div style={{ position:"absolute", inset:18, borderRadius:8, border:"0.5px solid rgba(196,168,60,0.06)" }} />

              {/* Corner marks */}
              <svg style={{ position:"absolute", top:16, left:16 }} width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M2 30L2 2L30 2" stroke="rgba(218,165,32,0.35)" strokeWidth="1.5" fill="none" />
                <circle cx="2" cy="2" r="1.5" fill="rgba(218,165,32,0.5)" />
              </svg>
              <svg style={{ position:"absolute", bottom:16, right:16 }} width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M30 2L30 30L2 30" stroke="rgba(218,165,32,0.35)" strokeWidth="1.5" fill="none" />
                <circle cx="30" cy="30" r="1.5" fill="rgba(218,165,32,0.5)" />
              </svg>

              {/* Concentric diamond motif */}
              <svg style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", opacity:0.055 }} width="220" height="220" viewBox="0 0 220 220" fill="none">
                <rect x="20" y="20" width="180" height="180" rx="4" transform="rotate(45,110,110)" stroke="#DAA520" strokeWidth="2" fill="none" />
                <rect x="44" y="44" width="132" height="132" rx="3" transform="rotate(45,110,110)" stroke="#DAA520" strokeWidth="1.5" fill="none" />
                <rect x="66" y="66" width="88" height="88" rx="2" transform="rotate(45,110,110)" stroke="#DAA520" strokeWidth="1" fill="none" />
                <rect x="86" y="86" width="48" height="48" rx="1" transform="rotate(45,110,110)" stroke="#DAA520" strokeWidth="0.75" fill="none" />
              </svg>

              {/* Center content */}
              <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:13 }}>
                {/* Initials ring */}
                <div style={{ position:"relative", width:70, height:70 }}>
                  <div style={{ position:"absolute", inset:0, borderRadius:"50%", border:"1px solid rgba(218,165,32,0.4)" }} />
                  <div style={{ position:"absolute", inset:5, borderRadius:"50%", border:"1px solid rgba(218,165,32,0.15)" }} />
                  <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <span style={{ fontFamily:"'Playfair Display',serif", fontSize:23, fontWeight:500, color:"rgba(218,165,32,0.88)", letterSpacing:"0.05em" }}>
                      {initials}
                    </span>
                  </div>
                </div>

                {/* Company */}
                <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:21, fontWeight:400, color:"rgba(240,228,200,0.82)", letterSpacing:"0.18em", textTransform:"uppercase", textAlign:"center" }}>
                  {company}
                </div>

                {/* Gold ornament divider */}
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <div style={{ width:36, height:1, background:"linear-gradient(90deg,transparent,rgba(218,165,32,0.5))" }} />
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <rect x="1" y="1" width="8" height="8" transform="rotate(45,5,5)" stroke="rgba(218,165,32,0.6)" strokeWidth="1" fill="rgba(218,165,32,0.15)" />
                  </svg>
                  <div style={{ width:36, height:1, background:"linear-gradient(90deg,rgba(218,165,32,0.5),transparent)" }} />
                </div>

                {/* Profile ID */}
                <div style={{ fontFamily:"'DM Mono',monospace", fontSize:8, letterSpacing:"0.3em", textTransform:"uppercase", color:"rgba(218,165,32,0.35)" }}>
                  {profileId}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Hint */}
        <p style={{ color:"rgba(196,168,80,0.35)", fontSize:9, letterSpacing:"0.22em", textTransform:"uppercase", margin:0, fontFamily:"'DM Mono',monospace" }}>
          tap card · flip · scan qr for profile
        </p>

        {/* Buttons */}
        <div style={{ display:"flex", gap:12, flexWrap:"wrap", justifyContent:"center" }}>
          <button className="bc-btn bc-btn-dl" onClick={handleDownload} disabled={capturing}>
            {capturing ? <span className="bc-spin" style={{ border:"1.5px solid rgba(212,180,80,0.3)", borderTopColor:"rgba(212,180,80,0.85)" }} /> : <DownloadIcon />}
            {capturing ? "Capturing…" : "Download PNG"}
          </button>
          <button className="bc-btn bc-btn-wa" onClick={handleWhatsApp} disabled={capturing}>
            {capturing ? <span className="bc-spin" style={{ border:"1.5px solid rgba(255,255,255,0.25)", borderTopColor:"#fff" }} /> : <WAIcon />}
            {capturing ? "Capturing…" : "Share via WhatsApp"}
          </button>
        </div>

        <p style={{ color:"rgba(196,168,80,0.22)", fontSize:9, letterSpacing:"0.12em", textTransform:"uppercase", textAlign:"center", maxWidth:340, lineHeight:2, margin:0, fontFamily:"'DM Mono',monospace" }}>
          mobile shares image directly · desktop downloads + opens whatsapp
        </p>
      </div>
    </>
  );
}