import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";

/* ─────────────────────────────────────────────
   SVG ILLUSTRATION — lost park ranger scene
   Strict monochrome: white, black, shades of grey
───────────────────────────────────────────── */
function ParkIllustration() {
  return (
    <svg
      viewBox="0 0 560 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full max-w-2xl mx-auto"
      aria-label="Lost park ranger illustration"
    >
      {/* Ground */}
      <ellipse cx="280" cy="288" rx="250" ry="22" fill="#E5E5E5" />
      <rect x="30" y="276" width="500" height="24" rx="0" fill="#E5E5E5" />

      {/* Dirt path */}
      <path d="M180 286 Q280 250 380 286" stroke="#C4C4C4" strokeWidth="12" strokeLinecap="round" fill="none" />

      {/* BIG TREE LEFT */}
      <rect x="52" y="168" width="20" height="112" rx="6" fill="#1A1A1A" />
      <ellipse cx="62" cy="280" rx="18" ry="6" fill="#C4C4C4" />
      <ellipse cx="62" cy="148" rx="52" ry="58" fill="#3D3D3D" />
      <ellipse cx="40" cy="168" rx="34" ry="40" fill="#2A2A2A" />
      <ellipse cx="84" cy="162" rx="34" ry="38" fill="#111111" />
      <ellipse cx="52" cy="128" rx="20" ry="16" fill="#555555" opacity="0.6" />

      {/* MEDIUM TREE RIGHT */}
      <rect x="452" y="196" width="16" height="84" rx="5" fill="#1A1A1A" />
      <ellipse cx="460" cy="178" rx="40" ry="48" fill="#3D3D3D" />
      <ellipse cx="444" cy="194" rx="26" ry="32" fill="#2A2A2A" />
      <ellipse cx="476" cy="190" rx="26" ry="30" fill="#111111" />
      <ellipse cx="452" cy="162" rx="16" ry="12" fill="#555555" opacity="0.5" />
      <ellipse cx="460" cy="278" rx="14" ry="5" fill="#C4C4C4" />

      {/* SMALL TREE MID-LEFT */}
      <rect x="118" y="222" width="10" height="58" rx="4" fill="#2A2A2A" />
      <ellipse cx="123" cy="210" rx="26" ry="30" fill="#4A4A4A" />
      <ellipse cx="112" cy="222" rx="16" ry="20" fill="#333333" />
      <ellipse cx="134" cy="218" rx="16" ry="18" fill="#1F1F1F" />

      {/* BENCH */}
      <rect x="388" y="248" width="82" height="9" rx="3" fill="#2A2A2A" />
      <rect x="390" y="237" width="78" height="7" rx="3" fill="#1A1A1A" />
      <rect x="396" y="257" width="7" height="22" rx="2" fill="#333333" />
      <rect x="455" y="257" width="7" height="22" rx="2" fill="#333333" />

      {/* SIGNPOST */}
      <rect x="320" y="188" width="9" height="92" rx="3" fill="#1A1A1A" />
      <rect x="295" y="196" width="76" height="36" rx="7" fill="#F5F5F5" stroke="#1A1A1A" strokeWidth="2" />
      <text x="333" y="217" textAnchor="middle" fontSize="10" fill="#1A1A1A" fontFamily="'Courier New', monospace" fontWeight="bold">THIS WAY?</text>
      <text x="333" y="229" textAnchor="middle" fontSize="9" fill="#555" fontFamily="monospace">{"<--  -->"}</text>

      {/* RANGER — shadow */}
      <ellipse cx="238" cy="282" rx="30" ry="8" fill="#C4C4C4" />

      {/* Legs */}
      <rect x="220" y="252" width="16" height="34" rx="6" fill="#2A2A2A" />
      <rect x="240" y="252" width="16" height="34" rx="6" fill="#2A2A2A" />
      {/* Boots */}
      <ellipse cx="228" cy="284" rx="12" ry="7" fill="#111111" />
      <ellipse cx="248" cy="284" rx="12" ry="7" fill="#111111" />

      {/* Body */}
      <rect x="215" y="200" width="48" height="56" rx="12" fill="#1A1A1A" />
      <path d="M239 200 L228 218 L239 214 L250 218 Z" fill="#2A2A2A" />
      {/* Badge */}
      <circle cx="226" cy="216" r="6" fill="#E5E5E5" stroke="#1A1A1A" strokeWidth="1.5" />
      <text x="226" y="219.5" textAnchor="middle" fontSize="4.5" fill="#1A1A1A" fontFamily="monospace" fontWeight="bold">POS</text>
      {/* Belt */}
      <rect x="215" y="244" width="48" height="8" rx="3" fill="#0A0A0A" />
      <rect x="232" y="242" width="12" height="12" rx="2" fill="#3D3D3D" />
      <rect x="235" y="244" width="6" height="6" rx="1" fill="#888" />

      {/* Neck */}
      <rect x="232" y="190" width="14" height="14" rx="4" fill="#D4A88A" />
      {/* Head */}
      <circle cx="239" cy="178" r="28" fill="#D4A88A" />
      <ellipse cx="211" cy="180" rx="5" ry="7" fill="#C49070" />
      <ellipse cx="267" cy="180" rx="5" ry="7" fill="#C49070" />

      {/* Hat */}
      <ellipse cx="239" cy="155" rx="34" ry="7" fill="#111111" />
      <rect x="215" y="138" width="48" height="20" rx="8" fill="#111111" />
      <ellipse cx="239" cy="138" rx="20" ry="6" fill="#1A1A1A" />
      <rect x="215" y="152" width="48" height="5" rx="0" fill="#0A0A0A" />
      <ellipse cx="239" cy="149" rx="7" ry="4" fill="#E5E5E5" />
      <text x="239" y="151" textAnchor="middle" fontSize="4" fill="#111" fontFamily="monospace" fontWeight="bold">PARK</text>

      {/* Eyes */}
      <circle cx="230" cy="178" r="5" fill="white" />
      <circle cx="248" cy="178" r="5" fill="white" />
      <circle cx="231" cy="179" r="3" fill="#1A1A1A" />
      <circle cx="249" cy="179" r="3" fill="#1A1A1A" />
      <circle cx="232" cy="178" r="1" fill="white" />
      <circle cx="250" cy="178" r="1" fill="white" />
      {/* Eyebrows */}
      <path d="M226 170 Q230 166 234 170" stroke="#7A5033" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M244 170 Q248 166 252 170" stroke="#7A5033" strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* Sweat drop */}
      <path d="M258 170 Q261 164 264 170 Q264 176 261 178 Q258 176 258 170Z" fill="#BBBBBB" opacity="0.9" />
      {/* Mouth */}
      <path d="M232 190 Q236 186 239 190 Q242 194 246 190" stroke="#7A5033" strokeWidth="1.5" strokeLinecap="round" fill="none" />

      {/* Arms */}
      <path d="M215 215 Q194 204 186 188" stroke="#1A1A1A" strokeWidth="14" strokeLinecap="round" fill="none" />
      <circle cx="184" cy="185" r="8" fill="#D4A88A" />
      <path d="M263 215 Q282 222 294 230" stroke="#1A1A1A" strokeWidth="14" strokeLinecap="round" fill="none" />
      <circle cx="297" cy="233" r="8" fill="#D4A88A" />

      {/* Map */}
      <rect x="290" y="228" width="42" height="30" rx="4" fill="#F5F5F5" stroke="#555" strokeWidth="1.5" transform="rotate(12 290 228)" />
      <line x1="294" y1="237" x2="324" y2="235" stroke="#AAAAAA" strokeWidth="1" transform="rotate(12 290 228)" />
      <line x1="294" y1="243" x2="320" y2="241" stroke="#AAAAAA" strokeWidth="1" transform="rotate(12 290 228)" />
      <line x1="294" y1="249" x2="322" y2="247" stroke="#AAAAAA" strokeWidth="1" transform="rotate(12 290 228)" />
      <circle cx="307" cy="242" r="4" fill="#1A1A1A" transform="rotate(12 290 228)" />
      <circle cx="307" cy="242" r="2" fill="white" transform="rotate(12 290 228)" />

      {/* Floating ? marks */}
      <text x="148" y="148" fontSize="28" fill="#CCCCCC" fontFamily="Georgia, serif" fontWeight="bold" opacity="0.7">?</text>
      <text x="350" y="132" fontSize="20" fill="#CCCCCC" fontFamily="Georgia, serif" fontWeight="bold" opacity="0.5">?</text>
      <text x="140" y="200" fontSize="14" fill="#CCCCCC" fontFamily="Georgia, serif" fontWeight="bold" opacity="0.4">?</text>
      <text x="420" y="158" fontSize="16" fill="#CCCCCC" fontFamily="Georgia, serif" fontWeight="bold" opacity="0.4">?</text>

      {/* Birds */}
      <path d="M88 82 Q93 76 98 82" stroke="#555" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M104 76 Q109 70 114 76" stroke="#555" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M380 68 Q386 62 392 68" stroke="#555" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M400 74 Q405 68 410 74" stroke="#555" strokeWidth="2" strokeLinecap="round" fill="none" />

      {/* Clouds */}
      <ellipse cx="160" cy="54" rx="48" ry="22" fill="#EEEEEE" />
      <ellipse cx="182" cy="42" rx="32" ry="24" fill="#EEEEEE" />
      <ellipse cx="136" cy="46" rx="30" ry="20" fill="#E8E8E8" />
      <ellipse cx="410" cy="44" rx="40" ry="18" fill="#EEEEEE" />
      <ellipse cx="428" cy="34" rx="26" ry="20" fill="#EEEEEE" />
      <ellipse cx="390" cy="36" rx="24" ry="16" fill="#E8E8E8" />
    </svg>
  );
}

function GlitchText({ text }) {
  const [glitch, setGlitch] = useState(false);
  useEffect(() => {
    const id = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 120);
    }, 3200);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="relative inline-block" style={{ fontFamily: "Georgia, serif" }}>
      <span className={`relative z-10 transition-all duration-75 ${glitch ? "opacity-0" : "opacity-100"}`}>
        {text}
      </span>
      {glitch && (
        <>
          <span className="absolute inset-0 text-gray-300" style={{ transform: "translate(-3px, 2px)", clipPath: "inset(30% 0 40% 0)" }}>{text}</span>
          <span className="absolute inset-0 text-gray-600" style={{ transform: "translate(3px, -2px)", clipPath: "inset(60% 0 10% 0)" }}>{text}</span>
        </>
      )}
    </span>
  );
}

export default function NotFound404() {
  const [visible, setVisible] = useState(false);
  const [dots, setDots] = useState(1);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    const id = setInterval(() => setDots((d) => (d >= 3 ? 1 : d + 1)), 600);
    return () => { clearTimeout(t); clearInterval(id); };
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col" style={{ fontFamily: "'Courier New', monospace" }}>

      {/* TOPBAR */}
     <Navbar/>

      {/* MAIN */}
      <main className={`flex-1 flex flex-col items-center justify-center px-6 py-8 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>

        {/* Error tag */}
        <div className="mb-6 inline-flex items-center gap-2 px-3 py-1 border border-gray-300 rounded-full">
          <span className="w-2 h-2 rounded-full bg-gray-900 animate-pulse" />
          <span className="text-xs text-gray-500 tracking-[0.2em] uppercase">Error 404</span>
        </div>

        {/* Giant 404 */}
        <div className="relative mb-2 leading-none text-center">
          <span
            className="text-[9rem] sm:text-[12rem] font-black text-gray-100 select-none leading-none"
            style={{ fontFamily: "Georgia, serif", letterSpacing: "-0.06em" }}
            aria-hidden="true"
          >
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <h1 className="text-xl sm:text-2xl font-black text-black tracking-tight">
              <GlitchText text="Trail Not Found" />
            </h1>
          </div>
        </div>

        {/* Illustration */}
        <div className="w-full max-w-2xl my-2" style={{ animation: "floatY 4s ease-in-out infinite" }}>
          <ParkIllustration />
        </div>

        {/* Message */}
        <p className="text-gray-500 text-sm text-center max-w-xs leading-relaxed mt-1">
          Our ranger checked the map{".".repeat(dots)}<br />
          <span className="text-gray-400 text-xs">This path doesn't exist in the park system.</span>
        </p>

        {/* Breadcrumb */}
        <div className="mt-4 mb-6 flex items-center gap-1 text-xs text-gray-300 font-mono">
          <span>parkos</span>
          <span>/</span>
          <span>trail</span>
          <span>/</span>
          <span className="text-red-400 line-through">unknown-path</span>
          <span className="text-gray-400 ml-2">← you are here</span>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 border-2 border-black text-black text-xs font-black tracking-widest uppercase hover:bg-black hover:text-white transition-all duration-200 active:scale-95"
          >
            ← Go Back
          </button>
          <button
            onClick={() => (window.location.href = "/")}
            className="px-6 py-3 bg-black text-white text-xs font-black tracking-widest uppercase hover:bg-gray-800 transition-all duration-200 active:scale-95"
          >
            Return to HQ
          </button>
          <button
            onClick={() => (window.location.href = "/support")}
            className="px-6 py-3 border border-gray-200 text-gray-400 text-xs font-bold tracking-widest uppercase hover:border-gray-400 hover:text-gray-600 transition-all duration-200 active:scale-95"
          >
            Report Issue
          </button>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="px-8 py-4 border-t border-gray-100 flex items-center justify-between">
        <span className="text-xs text-gray-300 tracking-widest uppercase font-mono">ParkOS · v2.0</span>
        <span className="text-xs text-gray-300 font-mono">HTTP 404 · Page not found</span>
      </footer>

      <style>{`
        @keyframes floatY {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
}