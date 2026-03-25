// components/CompanyShareCard.jsx
// Usage: <CompanyShareCard company={company} onClose={() => setShowShare(false)} />
// Needs: npm install qrcode.react

import { useEffect, useRef, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

export default function CompanyShareCard({ company, onClose }) {
  const [copied, setCopied] = useState(false);
  const overlayRef = useRef();

  const profileUrl = `${window.location.origin}/company/${company?.username || company?._id}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(profileUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // close on backdrop click
  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose?.();
  };

  // close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose?.(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const addressLine = [
    company?.address?.building,
    company?.address?.city,
    company?.businessPark,
  ].filter(Boolean).join(" · ");

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Outfit:wght@300;400;500;600;700&display=swap');

        @keyframes shareOverlayIn { from{opacity:0} to{opacity:1} }
        @keyframes shareCardIn    { from{opacity:0;transform:translateY(40px) scale(.94)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes dotPulse       { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.6);opacity:.5} }
        @keyframes checkPop       { 0%{transform:scale(0)} 60%{transform:scale(1.2)} 100%{transform:scale(1)} }

        .sc-overlay {
          position:fixed; inset:0; z-index:1000;
          background:rgba(0,0,0,.55); backdrop-filter:blur(6px);
          display:flex; align-items:center; justify-content:center;
          padding:20px;
          animation:shareOverlayIn .2s ease both;
        }

        .sc-card {
          background:#fff; border-radius:28px;
          width:100%; max-width:420px;
          box-shadow:0 32px 80px rgba(0,0,0,.22);
          overflow:hidden; position:relative;
          animation:shareCardIn .35s cubic-bezier(.16,1,.3,1) both;
          font-family:'Outfit',system-ui,sans-serif;
        }

        /* ── TOP BAND ── */
        .sc-band {
          background:#0a0a0a; padding:28px 28px 24px;
          position:relative; overflow:hidden;
        }
        .sc-band-grid {
          position:absolute; inset:0;
          background-image:
            linear-gradient(rgba(255,255,255,.03) 1px,transparent 1px),
            linear-gradient(90deg,rgba(255,255,255,.03) 1px,transparent 1px);
          background-size:24px 24px;
        }
        .sc-band-arc {
          position:absolute; bottom:-60px; right:-60px;
          width:200px; height:200px; border-radius:50%;
          border:1px solid rgba(255,255,255,.05);
        }
        .sc-band-arc2 {
          position:absolute; bottom:-30px; right:-30px;
          width:120px; height:120px; border-radius:50%;
          border:1px solid rgba(255,255,255,.04);
        }

        .sc-close {
          position:absolute; top:16px; right:16px; z-index:2;
          width:32px; height:32px; border-radius:50%;
          background:rgba(255,255,255,.08); border:1px solid rgba(255,255,255,.12);
          display:flex; align-items:center; justify-content:center;
          cursor:pointer; color:rgba(255,255,255,.6);
          transition:all .18s;
        }
        .sc-close:hover { background:rgba(255,255,255,.15); color:#fff; }

        .sc-band-inner { position:relative; z-index:1; display:flex; align-items:flex-start; gap:16px; }

        .sc-logo {
          width:56px; height:56px; border-radius:14px; flex-shrink:0;
          background:#1a1a1a; border:2px solid rgba(255,255,255,.1);
          display:flex; align-items:center; justify-content:center;
          overflow:hidden;
          font-family:'DM Serif Display',serif; font-size:22px; color:#fff;
        }
        .sc-logo img { width:100%; height:100%; object-fit:cover; }

        .sc-band-text { flex:1; min-width:0; }
        .sc-company-name {
          font-family:'DM Serif Display',serif; font-size:20px;
          color:#fff; line-height:1.2; margin-bottom:4px;
          white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
        }
        .sc-tagline {
          font-size:11px; color:rgba(255,255,255,.45);
          font-style:italic; margin-bottom:8px;
          white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
        }
        .sc-band-meta { display:flex; flex-wrap:wrap; gap:6px; }
        .sc-meta-pill {
          display:inline-flex; align-items:center; gap:4px;
          padding:3px 9px; border-radius:20px;
          background:rgba(255,255,255,.07); border:1px solid rgba(255,255,255,.1);
          font-size:9.5px; color:rgba(255,255,255,.5); font-weight:500;
        }

        /* ── QR SECTION ── */
        .sc-body { padding:24px 28px 28px; display:flex; flex-direction:column; gap:20px; }

        .sc-qr-wrap {
          display:flex; justify-content:center;
        }
        .sc-qr-outer {
          background:#f8f8f8; border-radius:20px;
          border:1px solid #eee; padding:18px;
          display:inline-flex; flex-direction:column; align-items:center; gap:10px;
          position:relative;
        }
        .sc-qr-label {
          font-size:9px; font-weight:700; letter-spacing:.14em;
          text-transform:uppercase; color:#bbb;
        }
        .sc-qr-canvas {
          border-radius:10px; overflow:hidden;
          box-shadow:0 4px 16px rgba(0,0,0,.08);
        }
        .sc-qr-hint {
          font-size:9.5px; color:#ccc; text-align:center; font-style:italic;
        }

        /* ── URL ROW ── */
        .sc-url-row {
          display:flex; align-items:center; gap:8px;
          background:#f5f5f5; border:1.5px solid #ebebeb;
          border-radius:12px; padding:10px 14px;
          transition:border-color .18s;
        }
        .sc-url-row:focus-within { border-color:#ccc; }
        .sc-url-icon { color:#bbb; flex-shrink:0; }
        .sc-url-text {
          flex:1; font-size:11px; color:#555; font-weight:500;
          white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
          background:none; border:none; outline:none;
          font-family:'Outfit',sans-serif; cursor:default;
        }
        .sc-copy-btn {
          flex-shrink:0; display:inline-flex; align-items:center; gap:5px;
          padding:6px 12px; border-radius:8px;
          background:#0a0a0a; color:#fff;
          font-family:'Outfit',sans-serif; font-size:10px; font-weight:700;
          letter-spacing:.06em; text-transform:uppercase;
          border:none; cursor:pointer;
          transition:all .18s;
        }
        .sc-copy-btn:hover { background:#333; }
        .sc-copy-btn.copied { background:#16a34a; }
        .sc-copy-check { animation:checkPop .25s cubic-bezier(.16,1,.3,1) both; }

        /* ── WEBSITE ROW ── */
        .sc-website-row {
          display:flex; align-items:center; gap:10px;
          padding:12px 16px; border-radius:14px;
          background:#0a0a0a; cursor:pointer;
          transition:all .2s;
          text-decoration:none;
        }
        .sc-website-row:hover { background:#222; transform:translateY(-1px); box-shadow:0 6px 20px rgba(0,0,0,.18); }
        .sc-website-icon {
          width:34px; height:34px; border-radius:9px; flex-shrink:0;
          background:rgba(255,255,255,.08); border:1px solid rgba(255,255,255,.1);
          display:flex; align-items:center; justify-content:center; color:rgba(255,255,255,.6);
        }
        .sc-website-text { flex:1; min-width:0; }
        .sc-website-label { font-size:9px; font-weight:600; letter-spacing:.12em; text-transform:uppercase; color:rgba(255,255,255,.35); margin-bottom:2px; }
        .sc-website-url {
          font-size:12px; color:#fff; font-weight:500;
          white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
        }
        .sc-website-arr { color:rgba(255,255,255,.3); flex-shrink:0; }

        /* ── SHARE FOOTER ── */
        .sc-footer {
          display:flex; gap:8px;
        }
        .sc-share-btn {
          flex:1; display:inline-flex; align-items:center; justify-content:center; gap:6px;
          padding:10px; border-radius:12px;
          font-family:'Outfit',sans-serif; font-size:10px; font-weight:700;
          letter-spacing:.06em; text-transform:uppercase;
          border:1.5px solid #e8e8e8; background:#fff; color:#555;
          cursor:pointer; transition:all .18s;
        }
        .sc-share-btn:hover { background:#f5f5f5; border-color:#ccc; color:#111; transform:translateY(-1px); }

        .sc-live-dot { width:5px; height:5px; border-radius:50%; background:#4ade80; animation:dotPulse 2s ease-in-out infinite; flex-shrink:0; }
      `}</style>

      <div className="sc-overlay" ref={overlayRef} onClick={handleOverlayClick}>
        <div className="sc-card">

          {/* ── TOP BAND ── */}
          <div className="sc-band">
            <div className="sc-band-grid" />
            <div className="sc-band-arc" />
            <div className="sc-band-arc2" />

            <button className="sc-close" onClick={onClose}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>

            <div className="sc-band-inner">
              <div className="sc-logo">
                {company?.logo ? <img src={company.logo} alt="" /> : (company?.companyName?.charAt(0) || "C")}
              </div>
              <div className="sc-band-text">
                <p className="sc-company-name">{company?.companyName || "Company Name"}</p>
                {company?.tagline && <p className="sc-tagline">"{company.tagline}"</p>}
                <div className="sc-band-meta">
                  {company?.industry && (
                    <span className="sc-meta-pill">
                      <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/></svg>
                      {company.industry}
                    </span>
                  )}
                  {addressLine && (
                    <span className="sc-meta-pill">
                      <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                      {addressLine}
                    </span>
                  )}
                  {company?.isVerified && (
                    <span className="sc-meta-pill">
                      <span className="sc-live-dot" /> Verified
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ── BODY ── */}
          <div className="sc-body">

            {/* QR Code */}
            <div className="sc-qr-wrap">
              <div className="sc-qr-outer">
                <span className="sc-qr-label">Scan to visit profile</span>
                <div className="sc-qr-canvas">
                <QRCodeCanvas
  value={profileUrl}
  size={160}
  bgColor="#ffffff"
  fgColor="#0a0a0a"
  level="H"
  includeMargin={false}
/>
                </div>
                <span className="sc-qr-hint">Points to your ParkOS profile page</span>
              </div>
            </div>

            {/* Profile URL */}
            <div className="sc-url-row">
              <svg className="sc-url-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
                <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
              </svg>
              <input className="sc-url-text" value={profileUrl} readOnly />
              <button
                className={`sc-copy-btn ${copied ? "copied" : ""}`}
                onClick={handleCopy}
              >
                {copied ? (
                  <>
                    <svg className="sc-copy-check" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    Copied
                  </>
                ) : (
                  <>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
                    </svg>
                    Copy
                  </>
                )}
              </button>
            </div>

            {/* Website link */}
            {company?.website && (
              <a
                className="sc-website-row"
                href={company.website.startsWith("http") ? company.website : `https://${company.website}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="sc-website-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="2" y1="12" x2="22" y2="12"/>
                    <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
                  </svg>
                </div>
                <div className="sc-website-text">
                  <p className="sc-website-label">Website</p>
                  <p className="sc-website-url">{company.website}</p>
                </div>
                <svg className="sc-website-arr" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
                  <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
              </a>
            )}

            {/* Share buttons */}
            <div className="sc-footer">
              <button
                className="sc-share-btn"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({ title: company?.companyName, url: profileUrl });
                  } else {
                    handleCopy();
                  }
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                </svg>
                Share
              </button>
              <button
                className="sc-share-btn"
                onClick={() => window.print()}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <polyline points="6 9 6 2 18 2 18 9"/>
                  <path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/>
                  <rect x="6" y="14" width="12" height="8"/>
                </svg>
                Print
              </button>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}