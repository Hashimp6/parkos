import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API_BASE from "../../../config";
import axios from "axios";
import { Globe, Instagram, Linkedin, Phone, Twitter, Youtube, Facebook } from "lucide-react";

/* ═══════════════════════════════════════════════════════════
   CONSTANTS
═══════════════════════════════════════════════════════════ */
const PARK_STYLES = {
  "Cyberpark":        { bg: "#F0F0F0", color: "#333333", dot: "#555555" },
  "Technopark":       { bg: "#EBEBEB", color: "#222222", dot: "#444444" },
  "Infopark":         { bg: "#F5F5F5", color: "#444444", dot: "#666666" },
  "Smart City":       { bg: "#EEEEEE", color: "#333333", dot: "#555555" },
  "KINFRA Tech Park": { bg: "#F2F2F2", color: "#3A3A3A", dot: "#5A5A5A" },
  "Business Park":    { bg: "#EDEDED", color: "#2A2A2A", dot: "#4A4A4A" },
  "SEZ":              { bg: "#E8E8E8", color: "#111111", dot: "#333333" },
  "Other":            { bg: "#F0F0F0", color: "#666666", dot: "#999999" },
};

const ACCENT_PALETTE = [
  "#111111","#222222","#333333","#444444",
  "#1A1A1A","#2A2A2A","#3A3A3A","#0A0A0A","#1E1E1E","#2E2E2E",
];

/* ═══════════════════════════════════════════════════════════
   UTILS
═══════════════════════════════════════════════════════════ */
const getInitials = (name = "") =>
  name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);

const getAccent = (name = "") => {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return ACCENT_PALETTE[Math.abs(h) % ACCENT_PALETTE.length];
};

/* ─── Debounce hook ──────────────────────────────────────── */
function useDebounce(value, delay = 450) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

/* ═══════════════════════════════════════════════════════════
   GLOBAL CSS  (unchanged from original)
═══════════════════════════════════════════════════════════ */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,700;0,9..144,900;1,9..144,400;1,9..144,700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #F5F5F5; --bg2: #EEEEEE; --bg3: #FFFFFF;
    --ink: #111111; --ink2: #333333; --ink3: #666666; --ink4: #999999;
    --brd: #E0E0E0; --brd2: #CCCCCC;
    --ind: #111111; --ind2: #333333; --ind3: #555555;
    --indxl: #F0F0F0; --indbrd: #CCCCCC;
    --shadow-sm: 0 1px 3px rgba(0,0,0,0.07), 0 1px 2px rgba(0,0,0,0.05);
    --shadow-md: 0 4px 16px rgba(0,0,0,0.07), 0 2px 6px rgba(0,0,0,0.05);
    --shadow-lg: 0 16px 48px rgba(0,0,0,0.12), 0 4px 14px rgba(0,0,0,0.07);
    --r: 16px; --r-sm: 10px; --r-xs: 7px;
  }
  .cs-root { font-family: 'Plus Jakarta Sans', sans-serif; background: var(--bg); color: var(--ink); min-height: 100vh; -webkit-font-smoothing: antialiased; }

  /* ── PAGE HEADER ── */
  .cs-header { background: var(--bg3); border-bottom: 1px solid var(--brd); padding: 48px 40px 36px; }
  .cs-header-inner { max-width: 1220px; margin: 0 auto; display: flex; align-items: flex-end; justify-content: space-between; gap: 24px; flex-wrap: wrap; }
  .cs-breadcrumb { display: flex; align-items: center; gap: 6px; margin-bottom: 14px; }
  .cs-breadcrumb span { font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: var(--ink4); }
  .cs-breadcrumb-dot { width: 3px; height: 3px; border-radius: 50%; background: var(--ink4); }
  .cs-breadcrumb-accent { color: var(--ink2) !important; font-weight: 700; }
  .cs-h1 { font-family: 'Fraunces', serif; font-weight: 900; font-size: clamp(32px,4vw,52px); line-height: 1.05; letter-spacing: -0.03em; color: var(--ink); margin-bottom: 10px; }
  .cs-h1 em { font-style: italic; color: var(--ink3); }
  .cs-sub { font-size: 14px; font-weight: 400; color: var(--ink3); line-height: 1.65; max-width: 440px; }
  .cs-stat-block { display: flex; gap: 28px; align-items: flex-end; flex-shrink: 0; }
  .cs-stat { display: flex; flex-direction: column; align-items: flex-end; gap: 3px; }
  .cs-stat-n { font-family: 'Fraunces', serif; font-weight: 900; font-size: 44px; line-height: 1; letter-spacing: -0.04em; color: var(--ink); }
  .cs-stat-l { font-size: 10px; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase; color: var(--ink4); }
  .cs-stat-divider { width: 1px; height: 40px; background: var(--brd); align-self: center; }

  /* ── CONTROLS ── */
  .cs-controls { max-width: 1220px; margin: 28px auto 0; padding: 0 40px; display: flex; flex-direction: column; gap: 14px; }
  .cs-search-row { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; }
  .cs-search-wrap { position: relative; flex: 1; max-width: 440px; min-width: 200px; }
  .cs-search-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--ink4); pointer-events: none; display: flex; align-items: center; }
  .cs-search-spinner { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); }
  .cs-spinner { width: 14px; height: 14px; border: 2px solid var(--brd2); border-top-color: var(--ink); border-radius: 50%; animation: spin 0.7s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .cs-search-input { width: 100%; border: 1.5px solid var(--brd2); border-radius: var(--r-sm); background: var(--bg3); outline: none; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 14px; font-weight: 400; color: var(--ink); padding: 11px 40px 11px 42px; transition: border-color 0.2s, box-shadow 0.2s; }
  .cs-search-input::placeholder { color: var(--ink4); }
  .cs-search-input:focus { border-color: var(--ind); box-shadow: 0 0 0 3px rgba(17,17,17,0.07); }
  .cs-clear-btn { border: 1.5px solid var(--brd2); border-radius: var(--r-sm); background: var(--bg3); font-family: 'Plus Jakarta Sans', sans-serif; font-size: 12px; font-weight: 600; color: var(--ink3); padding: 11px 16px; cursor: pointer; transition: all 0.15s; white-space: nowrap; }
  .cs-clear-btn:hover { border-color: var(--ink); color: var(--ink); }

  /* ── FILTER SELECTS ── */
  .cs-filter-row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
  .cs-filter-label { font-size: 10px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: var(--ink4); white-space: nowrap; margin-right: 2px; }
  .cs-filter-select { border: 1.5px solid var(--brd2); border-radius: 99px; background: var(--bg3); font-family: 'Plus Jakarta Sans', sans-serif; font-size: 12px; font-weight: 600; color: var(--ink3); padding: 6px 14px; cursor: pointer; outline: none; transition: all 0.17s; appearance: none; -webkit-appearance: none; }
  .cs-filter-select:hover { border-color: var(--ind); color: var(--ind); background: var(--indxl); }
  .cs-filter-select:focus { border-color: var(--ind); color: var(--ind); }
  .cs-filter-select.active { background: var(--ind); border-color: var(--ind); color: #fff; }

  .cs-pill { border: 1.5px solid var(--brd2); background: var(--bg3); border-radius: 99px; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 12px; font-weight: 600; color: var(--ink3); padding: 6px 16px; cursor: pointer; transition: all 0.17s; white-space: nowrap; }
  .cs-pill:hover { border-color: var(--ind); color: var(--ind); background: var(--indxl); }
  .cs-pill.active { background: var(--ind); border-color: var(--ind); color: #fff; }

  /* ── RESULT META BAR ── */
  .cs-meta-bar { max-width: 1220px; margin: 22px auto 0; padding: 0 40px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; }
  .cs-meta-text { font-size: 12px; font-weight: 500; color: var(--ink4); letter-spacing: 0.02em; }
  .cs-meta-text strong { color: var(--ink2); font-weight: 700; }
  .cs-view-toggle { display: flex; gap: 4px; }
  .cs-vbtn { width: 32px; height: 32px; border-radius: 8px; border: 1.5px solid var(--brd2); background: var(--bg3); display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--ink4); transition: all 0.15s; }
  .cs-vbtn.active { background: var(--ind); border-color: var(--ind); color: #fff; }
  .cs-vbtn:hover:not(.active) { border-color: var(--ink); color: var(--ink); }

  /* ── GRID ── */
  .cs-grid { max-width: 1220px; margin: 20px auto 0; padding: 0 40px 40px; display: grid; grid-template-columns: repeat(3,1fr); gap: 18px; }
  .cs-grid.list-view { grid-template-columns: 1fr; gap: 12px; }

  /* ── CARD ── */
  .cs-card { background: var(--bg3); border: 1.5px solid var(--brd); border-radius: var(--r); overflow: hidden; display: flex; flex-direction: column; transition: transform 0.28s cubic-bezier(.34,1.4,.64,1), box-shadow 0.28s, border-color 0.2s; box-shadow: var(--shadow-sm); animation: cardIn 0.4s cubic-bezier(.22,.68,0,1.18) both; cursor: pointer; }
  @keyframes cardIn { from { opacity: 0; transform: translateY(12px) scale(0.98); } to { opacity: 1; transform: none; } }
  .cs-card:hover { transform: translateY(-5px) scale(1.005); box-shadow: var(--shadow-lg); border-color: var(--indbrd); }
  .cs-card-bar { height: 4px; flex-shrink: 0; }
  .cs-card-body { padding: 20px 20px 0; flex: 1; display: flex; flex-direction: column; }
  .cs-card-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; margin-bottom: 14px; }
  .cs-avatar { width: 48px; height: 48px; border-radius: 13px; display: flex; align-items: center; justify-content: center; font-size: 15px; font-weight: 800; color: #fff; letter-spacing: 0.04em; flex-shrink: 0; overflow: hidden; font-family: 'Fraunces', serif; }
  .cs-verified { display: inline-flex; align-items: center; gap: 4px; font-size: 9px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #111111; background: #EBEBEB; border: 1px solid #CCCCCC; border-radius: 99px; padding: 4px 10px; flex-shrink: 0; }
  .cs-company-name { font-family: 'Fraunces', serif; font-size: 17px; font-weight: 700; color: var(--ink); letter-spacing: -0.02em; margin-bottom: 4px; line-height: 1.2; }
  .cs-tagline { font-size: 12px; font-weight: 400; color: var(--ink3); line-height: 1.55; margin-bottom: 16px; }
  .cs-services { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; }
  .cs-service { display: flex; align-items: flex-start; gap: 10px; padding: 10px 12px; border-radius: var(--r-sm); background: var(--bg); border: 1px solid var(--brd); transition: border-color 0.15s; }
  .cs-card:hover .cs-service { border-color: var(--indbrd); background: var(--indxl); }
  .cs-svc-dot { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; margin-top: 6px; }
  .cs-svc-title { font-size: 12px; font-weight: 700; color: var(--ink); margin-bottom: 1px; }
  .cs-svc-desc { font-size: 11px; font-weight: 400; color: var(--ink3); line-height: 1.4; }
  .cs-card-meta { display: flex; align-items: center; justify-content: space-between; padding: 12px 0; border-top: 1px solid var(--brd); margin-top: auto; flex-wrap: wrap; gap: 6px; }
  .cs-park-badge { display: inline-flex; align-items: center; gap: 5px; font-size: 10px; font-weight: 700; letter-spacing: 0.04em; border-radius: 6px; padding: 4px 10px; border: 1px solid; flex-shrink: 0; }
  .cs-park-dot { width: 5px; height: 5px; border-radius: 50%; }
  .cs-location { display: flex; align-items: center; gap: 4px; font-size: 11px; font-weight: 500; color: var(--ink4); }
  .cs-card-foot { padding: 14px 20px 18px; }
  .cs-social-row { display: flex; align-items: center; gap: 6px; margin-bottom: 10px; }
  .cs-soc-btn { width: 30px; height: 30px; border-radius: 8px; border: 1.5px solid var(--brd2); background: transparent; display: flex; align-items: center; justify-content: center; color: var(--ink3); text-decoration: none; transition: all 0.17s; flex-shrink: 0; cursor: pointer; }
  .cs-soc-btn:hover { background: var(--ink); color: #fff; border-color: var(--ink); }
  .cs-view-btn { width: 100%; padding: 11px 16px; border: 1.5px solid var(--ind); border-radius: var(--r-sm); background: transparent; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 12px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; color: var(--ind); cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.2s; }
  .cs-view-btn:hover { background: var(--ind); color: #fff; box-shadow: 0 4px 12px rgba(17,17,17,0.2); }

  /* ── LIST VIEW ── */
  .cs-card.list-card { flex-direction: row; align-items: stretch; border-radius: 14px; }
  .cs-card.list-card .cs-card-bar { height: auto; width: 4px; flex-shrink: 0; }
  .cs-card.list-card .cs-card-body { flex-direction: row; padding: 18px 20px; gap: 20px; align-items: flex-start; flex-wrap: wrap; }
  .cs-card.list-card .cs-card-meta { border-top: none; padding: 0; margin-top: 0; flex-direction: column; align-items: flex-start; }
  .cs-card.list-card .cs-card-foot { padding: 18px 20px 18px 0; display: flex; flex-direction: column; justify-content: space-between; min-width: 160px; border-left: 1px solid var(--brd); }
  .cs-card.list-card .cs-services { display: none; }
  .cs-list-info { flex: 1; min-width: 200px; }
  .cs-list-tags { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 8px; }
  .cs-tag-chip { font-size: 10px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: #333333; background: #EEEEEE; border: 1px solid #DDDDDD; border-radius: 5px; padding: 3px 9px; }

  /* ── EMPTY ── */
  .cs-empty { grid-column: 1/-1; text-align: center; padding: 80px 24px; color: var(--ink4); }
  .cs-empty-icon { font-size: 48px; display: block; margin-bottom: 16px; }
  .cs-empty-title { font-family: 'Fraunces', serif; font-size: 22px; font-weight: 700; color: var(--ink3); margin-bottom: 8px; }
  .cs-empty-sub { font-size: 14px; }

  /* ── PAGINATION ── */
  .cs-pagination { max-width: 1220px; margin: 8px auto 60px; padding: 0 40px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; }
  .cs-page-info { font-size: 13px; font-weight: 500; color: var(--ink4); }
  .cs-page-info strong { color: var(--ink2); font-weight: 700; }
  .cs-page-controls { display: flex; align-items: center; gap: 4px; }
  .cs-page-btn { min-width: 36px; height: 36px; padding: 0 10px; border: 1.5px solid var(--brd2); border-radius: 9px; background: var(--bg3); font-family: 'Plus Jakarta Sans', sans-serif; font-size: 13px; font-weight: 600; color: var(--ink3); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.15s; }
  .cs-page-btn:hover:not(:disabled):not(.active) { border-color: var(--ind); color: var(--ind); background: var(--indxl); }
  .cs-page-btn.active { background: var(--ind); border-color: var(--ind); color: #fff; font-weight: 700; }
  .cs-page-btn:disabled { opacity: 0.35; cursor: not-allowed; }
  .cs-page-btn.nav { font-size: 16px; }
  .cs-page-ellipsis { padding: 0 4px; color: var(--ink4); font-size: 14px; user-select: none; }
  .cs-per-page { display: flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 500; color: var(--ink4); }
  .cs-per-select { border: 1.5px solid var(--brd2); border-radius: 8px; background: var(--bg3); padding: 6px 10px; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 12px; font-weight: 600; color: var(--ink); outline: none; cursor: pointer; transition: border-color 0.15s; }
  .cs-per-select:focus { border-color: var(--ind); }

  /* ── SKELETON ── */
  .cs-skeleton { background: linear-gradient(90deg, var(--bg2) 25%, var(--bg) 50%, var(--bg2) 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; border-radius: 8px; }
  @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
  .cs-skel-card { border-radius: var(--r); overflow: hidden; background: var(--bg3); border: 1.5px solid var(--brd); padding: 20px; display: flex; flex-direction: column; gap: 12px; }

  /* ── MODAL ── */
  .cs-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.45); backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px); display: flex; align-items: center; justify-content: center; z-index: 300; padding: 20px; animation: overlayIn 0.2s ease; }
  @keyframes overlayIn { from { opacity: 0; } to { opacity: 1; } }
  .cs-modal { background: #fff; border-radius: 22px; width: 100%; max-width: 520px; max-height: 90vh; overflow-y: auto; box-shadow: 0 40px 120px rgba(0,0,0,0.22), 0 8px 24px rgba(0,0,0,0.08); animation: modalIn 0.35s cubic-bezier(.34,1.4,.64,1); }
  @keyframes modalIn { from { opacity: 0; transform: scale(0.9) translateY(20px); } to { opacity: 1; transform: none; } }
  .cs-modal-bar { height: 6px; border-radius: 22px 22px 0 0; }
  .cs-modal-body { padding: 26px; }
  .cs-modal-head { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 20px; }
  .cs-modal-brand { display: flex; align-items: center; gap: 14px; }
  .cs-modal-av { width: 56px; height: 56px; border-radius: 16px; display: flex; align-items: center; justify-content: center; font-family: 'Fraunces', serif; font-size: 18px; font-weight: 900; color: #fff; flex-shrink: 0; overflow: hidden; }
  .cs-modal-name { font-family: 'Fraunces', serif; font-size: 20px; font-weight: 700; color: var(--ink); letter-spacing: -0.02em; }
  .cs-modal-sub { font-size: 12px; color: var(--ink3); margin-top: 3px; }
  .cs-modal-close { width: 36px; height: 36px; border-radius: 10px; border: 1.5px solid var(--brd2); background: transparent; cursor: pointer; display: flex; align-items: center; justify-content: center; color: var(--ink3); font-size: 14px; transition: all 0.15s; flex-shrink: 0; }
  .cs-modal-close:hover { background: var(--bg2); color: var(--ink); }
  .cs-modal-about { font-size: 13px; line-height: 1.7; color: var(--ink3); background: var(--bg); border: 1px solid var(--brd); border-radius: 10px; padding: 14px 16px; margin-bottom: 20px; }
  .cs-modal-divider { height: 1px; background: var(--brd); margin: 18px 0; }
  .cs-modal-section-label { font-size: 10px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: var(--ink4); margin-bottom: 10px; }
  .cs-contact-list { display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px; }
  .cs-contact-item { display: flex; align-items: center; gap: 12px; padding: 12px 14px; border-radius: 12px; border: 1px solid var(--brd); background: var(--bg); text-decoration: none; transition: all 0.15s; cursor: default; }
  a.cs-contact-item { cursor: pointer; }
  a.cs-contact-item:hover { border-color: var(--indbrd); background: var(--indxl); }
  .cs-contact-icon { width: 36px; height: 36px; border-radius: 10px; background: #fff; border: 1px solid var(--brd); display: flex; align-items: center; justify-content: center; color: var(--ink3); flex-shrink: 0; }
  .cs-contact-label { font-size: 9px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--ink4); }
  .cs-contact-val { font-size: 13px; font-weight: 600; color: var(--ink); word-break: break-all; }
  .cs-cta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  .cs-cta { padding: 12px 16px; border-radius: 12px; border: none; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 12px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 7px; text-decoration: none; transition: all 0.18s; }
  .cs-cta-call { background: var(--ink); color: #fff; }
  .cs-cta-call:hover { background: var(--ink2); }
  .cs-cta-wa { background: #222222; color: #fff; }
  .cs-cta-wa:hover { background: #444444; }
  .cs-cta-email { grid-column: 1/-1; background: var(--bg); color: var(--ink); border: 1.5px solid var(--brd2) !important; }
  .cs-cta-email:hover { background: var(--bg2); }
  .cs-social-links { display: flex; gap: 7px; margin-top: 14px; flex-wrap: wrap; }
  .cs-social-link { flex: 1; min-width: 80px; padding: 9px 6px; border: 1.5px solid var(--brd2); border-radius: 10px; background: #fff; display: flex; align-items: center; justify-content: center; gap: 5px; font-size: 11px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; color: var(--ink3); text-decoration: none; transition: all 0.17s; }
  .cs-social-link:hover { border-color: var(--ind); color: var(--ind); background: var(--indxl); }

  /* ── RESPONSIVE ── */
  @media (max-width: 1024px) { .cs-grid { grid-template-columns: repeat(2,1fr); } }
  @media (max-width: 640px) {
    .cs-header { padding: 32px 20px 24px; }
    .cs-controls, .cs-meta-bar, .cs-grid, .cs-pagination { padding-left: 18px; padding-right: 18px; }
    .cs-grid { grid-template-columns: 1fr; }
    .cs-stat-block { display: none; }
    .cs-h1 { font-size: 32px; }
    .cs-pagination { flex-direction: column; align-items: flex-start; gap: 12px; }
    .cs-card.list-card { flex-direction: column; }
    .cs-card.list-card .cs-card-bar { height: 4px; width: 100%; }
    .cs-card.list-card .cs-card-foot { border-left: none; border-top: 1px solid var(--brd); padding: 14px 20px 18px; }
  }
`;

/* ═══════════════════════════════════════════════════════════
   SKELETON
═══════════════════════════════════════════════════════════ */
function SkeletonCard() {
  return (
    <div className="cs-skel-card">
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <div className="cs-skeleton" style={{ width: 48, height: 48, borderRadius: 13, flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <div className="cs-skeleton" style={{ height: 14, width: "60%", marginBottom: 8 }} />
          <div className="cs-skeleton" style={{ height: 11, width: "80%" }} />
        </div>
      </div>
      {[1, 2, 3].map(i => (
        <div key={i} className="cs-skeleton" style={{ height: 52, borderRadius: 10 }} />
      ))}
      <div className="cs-skeleton" style={{ height: 38, borderRadius: 10 }} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MODAL (unchanged)
═══════════════════════════════════════════════════════════ */
function Modal({ company, onClose }) {
  const color = getAccent(company.companyName);
  const c = company.contacts || {};
  const waNum = (c.whatsapp || c.phone || "").replace(/\D/g, "");
  const waMsg = encodeURIComponent(`Hi ${company.companyName}, I found you on the platform and I'm interested in your services!`);

  useEffect(() => {
    const fn = e => e.key === "Escape" && onClose();
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, [onClose]);

  const socials = [
    c.linkedin  && { label: "LinkedIn",  Icon: Linkedin,  href: `https://linkedin.com/company/${c.linkedin}` },
    c.instagram && { label: "Instagram", Icon: Instagram, href: `https://instagram.com/${c.instagram}` },
    c.facebook  && { label: "Facebook",  Icon: Facebook,  href: `https://facebook.com/${c.facebook}` },
    c.twitter   && { label: "Twitter",   Icon: Twitter,   href: `https://twitter.com/${c.twitter}` },
    c.youtube   && { label: "YouTube",   Icon: Youtube,   href: `https://youtube.com/${c.youtube}` },
  ].filter(Boolean);

  return (
    <div className="cs-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="cs-modal">
        <div className="cs-modal-bar" style={{ background: color }} />
        <div className="cs-modal-body">
          <div className="cs-modal-head">
            <div className="cs-modal-brand">
              <div className="cs-modal-av" style={{ background: color }}>
                {company.logo
                  ? <img src={company.logo} alt={company.companyName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : getInitials(company.companyName)
                }
              </div>
              <div>
                <div className="cs-modal-name">{company.companyName}</div>
                <div className="cs-modal-sub">
                  {[company.industry, company.address?.place].filter(Boolean).join(" · ")}
                </div>
              </div>
            </div>
            <button className="cs-modal-close" onClick={onClose}>✕</button>
          </div>

          {company.about && (
            <div className="cs-modal-about">
              {company.about.length > 180 ? company.about.slice(0, 180) + "…" : company.about}
            </div>
          )}

          <div className="cs-modal-divider" />
          <div className="cs-modal-section-label">Contact Details</div>
          <div className="cs-contact-list">
            {c.phone && (
              <a href={`tel:${c.phone}`} className="cs-contact-item">
                <div className="cs-contact-icon"><Phone size={15} /></div>
                <div><div className="cs-contact-label">Phone</div><div className="cs-contact-val">{c.phone}</div></div>
              </a>
            )}
            {c.email && (
              <a href={`mailto:${c.email}`} className="cs-contact-item">
                <div className="cs-contact-icon">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="22,4 12,13 2,4"/></svg>
                </div>
                <div><div className="cs-contact-label">Email</div><div className="cs-contact-val">{c.email}</div></div>
              </a>
            )}
            {company.website && (
              <a href={company.website} target="_blank" rel="noreferrer" className="cs-contact-item">
                <div className="cs-contact-icon"><Globe size={15} /></div>
                <div><div className="cs-contact-label">Website</div><div className="cs-contact-val">{company.website.replace(/^https?:\/\//, "")}</div></div>
              </a>
            )}
            {company.address?.place && (
              <div className="cs-contact-item">
                <div className="cs-contact-icon">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                </div>
                <div>
                  <div className="cs-contact-label">Location</div>
                  <div className="cs-contact-val">{[company.address.building, company.address.place].filter(Boolean).join(", ")}</div>
                </div>
              </div>
            )}
            {company.businessPark && company.businessPark !== "Other" && (
              <div className="cs-contact-item">
                <div className="cs-contact-icon">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
                </div>
                <div><div className="cs-contact-label">Business Park</div><div className="cs-contact-val">{company.businessPark}</div></div>
              </div>
            )}
          </div>

          <div className="cs-modal-section-label">Connect Instantly</div>
          <div className="cs-cta-grid">
            {c.phone && (
              <a href={`tel:${c.phone}`} className="cs-cta cs-cta-call">
                <Phone size={12} /> Call Now
              </a>
            )}
            {waNum && (
              <a href={`https://wa.me/${waNum}?text=${waMsg}`} target="_blank" rel="noreferrer" className="cs-cta cs-cta-wa">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a4.67 4.67 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.126.555 4.126 1.527 5.856L.057 23.882l6.191-1.424A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.013-1.374l-.36-.214-3.724.856.88-3.62-.234-.372A9.818 9.818 0 012.182 12C2.182 6.573 6.573 2.182 12 2.182S21.818 6.573 21.818 12 17.427 21.818 12 21.818z"/></svg>
                WhatsApp
              </a>
            )}
            {c.email && (
              <a href={`mailto:${c.email}`} className="cs-cta cs-cta-email" style={{ border: "1.5px solid var(--brd2)" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                Send Email
              </a>
            )}
          </div>

          {socials.length > 0 && (
            <div className="cs-social-links">
              {socials.map(({ label, Icon, href }) => (
                <a key={label} href={href} target="_blank" rel="noreferrer" className="cs-social-link">
                  <Icon size={13} /> {label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   CARD (unchanged)
═══════════════════════════════════════════════════════════ */
function Card({ company, index, onConnect, listView }) {
  const navigate = useNavigate();
  const color    = getAccent(company.companyName);
  const park     = PARK_STYLES[company.businessPark] || PARK_STYLES["Other"];
  const c        = company.contacts || {};

  if (listView) {
    return (
      <div className="cs-card list-card" style={{ animationDelay: `${index * 40}ms` }}>
        <div className="cs-card-bar" style={{ background: color }} />
        <div className="cs-card-body">
          <div className="cs-list-info">
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
              <div className="cs-avatar" style={{ background: color }}>
                {company.logo
                  ? <img src={company.logo} alt={company.companyName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : getInitials(company.companyName)
                }
              </div>
              <div>
                <div className="cs-company-name" style={{ fontSize: 16 }}>{company.companyName}</div>
                <div className="cs-tagline" style={{ marginBottom: 0 }}>{company.tagline}</div>
              </div>
              {company.isVerified && (
                <span className="cs-verified" style={{ marginLeft: "auto" }}>
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                  Verified
                </span>
              )}
            </div>
            <div className="cs-list-tags">
              {(company.tags || []).slice(0, 5).map(t => (
                <span key={t} className="cs-tag-chip">{t}</span>
              ))}
              <span className="cs-park-badge" style={{ background: park.bg, color: park.color, borderColor: park.dot + "44" }}>
                <span className="cs-park-dot" style={{ background: park.dot }} />
                {company.businessPark}
              </span>
            </div>
          </div>
          <div className="cs-card-meta">
            {company.address?.place && (
              <div className="cs-location">
                <svg width="9" height="11" viewBox="0 0 10 13" fill="currentColor"><path d="M5 0C2.24 0 0 2.24 0 5c0 3.75 5 8 5 8s5-4.25 5-8c0-2.76-2.24-5-5-5zm0 6.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3z"/></svg>
                {company.address.place}
              </div>
            )}
            {company.industry && (
              <span style={{ fontSize: 11, fontWeight: 600, color: "var(--ink4)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                {company.industry}
              </span>
            )}
          </div>
        </div>
        <div className="cs-card-foot">
          <div className="cs-social-row" style={{ marginBottom: 10, justifyContent: "flex-end" }}>
            {c.phone    && <a href={`tel:${c.phone}`} className="cs-soc-btn"><Phone size={12} /></a>}
            {c.linkedin && <a href={`https://linkedin.com/company/${c.linkedin}`} target="_blank" rel="noreferrer" className="cs-soc-btn"><Linkedin size={12} /></a>}
            {c.instagram&& <a href={`https://instagram.com/${c.instagram}`} target="_blank" rel="noreferrer" className="cs-soc-btn"><Instagram size={12} /></a>}
            {company.website && <a href={company.website} target="_blank" rel="noreferrer" className="cs-soc-btn"><Globe size={12} /></a>}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
  <button
    className="cs-view-btn"
    onClick={() => navigate(`/company/id/${company._id}`)}
  >
    View {company.companyName.split(" ")[0]}
  </button>

  <button
    className="cs-view-btn"
    style={{
      borderColor: "#ccc",
      color: "#555"
    }}
    onClick={() => navigate(`/company-jobs/${company._id}`)}
  >
    Jobs
  </button>
</div>
        </div>
      </div>
    );
  }

  return (
    <div className="cs-card" style={{ animationDelay: `${index * 50}ms` }}>
      <div className="cs-card-bar" style={{ background: color }} />
      <div className="cs-card-body">
        <div className="cs-card-top">
          <div className="cs-avatar" style={{ background: color }}>
            {company.logo
              ? <img src={company.logo} alt={company.companyName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              : getInitials(company.companyName)
            }
          </div>
          {company.isVerified && (
            <span className="cs-verified">
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
              Verified
            </span>
          )}
        </div>
        <div className="cs-company-name">{company.companyName}</div>
        <div className="cs-tagline">{company.tagline}</div>
        <div className="cs-services">
          {(company.services || []).slice(0, 3).map((s, i) => (
            <div key={i} className="cs-service">
              <div className="cs-svc-dot" style={{ background: color }} />
              <div>
                <div className="cs-svc-title">{s.title}</div>
                {s.description && <div className="cs-svc-desc">{s.description}</div>}
              </div>
            </div>
          ))}
        </div>
        <div className="cs-card-meta">
          <span className="cs-park-badge" style={{ background: park.bg, color: park.color, borderColor: park.dot + "44" }}>
            <span className="cs-park-dot" style={{ background: park.dot }} />
            {company.businessPark}
          </span>
          {company.address?.place && (
            <div className="cs-location">
              <svg width="8" height="10" viewBox="0 0 10 13" fill="currentColor"><path d="M5 0C2.24 0 0 2.24 0 5c0 3.75 5 8 5 8s5-4.25 5-8c0-2.76-2.24-5-5-5zm0 6.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3z"/></svg>
              {company.address.place}
            </div>
          )}
        </div>
      </div>
      <div className="cs-card-foot">
        <div className="cs-social-row">
          {c.phone    && <a href={`tel:${c.phone}`} className="cs-soc-btn" onClick={e => e.stopPropagation()}><Phone size={12} /></a>}
          {c.linkedin && <a href={`https://linkedin.com/company/${c.linkedin}`} target="_blank" rel="noreferrer" className="cs-soc-btn" onClick={e => e.stopPropagation()}><Linkedin size={12} /></a>}
          {c.instagram&& <a href={`https://instagram.com/${c.instagram}`} target="_blank" rel="noreferrer" className="cs-soc-btn" onClick={e => e.stopPropagation()}><Instagram size={12} /></a>}
          {company.website && <a href={company.website} target="_blank" rel="noreferrer" className="cs-soc-btn" onClick={e => e.stopPropagation()}><Globe size={12} /></a>}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
  <button
    className="cs-view-btn"
    onClick={() => navigate(`/company/id/${company._id}`)}
  >
    View Profile
  </button>

  <button
    className="cs-view-btn"
    style={{
      borderColor: "#ccc",
      color: "#555"
    }}
    onClick={() => navigate(`/company-jobs/${company._id}`)}
  >
    Jobs
  </button>
</div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   PAGINATION (unchanged)
═══════════════════════════════════════════════════════════ */
function Pagination({ currentPage, totalPages, onPageChange, totalItems, perPage, onPerPageChange }) {
  if (totalPages <= 1 && totalItems <= 9) return null;
  const getPages = () => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages = [];
    if (currentPage <= 4) pages.push(1, 2, 3, 4, 5, "…", totalPages);
    else if (currentPage >= totalPages - 3) pages.push(1, "…", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    else pages.push(1, "…", currentPage - 1, currentPage, currentPage + 1, "…", totalPages);
    return pages;
  };
  const start = (currentPage - 1) * perPage + 1;
  const end   = Math.min(currentPage * perPage, totalItems);
  return (
    <div className="cs-pagination">
      <div style={{ display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
        <div className="cs-page-info">
          Showing <strong>{start}–{end}</strong> of <strong>{totalItems}</strong> companies
        </div>
        <div className="cs-per-page">
          Per page:
          <select className="cs-per-select" value={perPage} onChange={e => { onPerPageChange(Number(e.target.value)); onPageChange(1); }}>
            {[6, 9, 12, 18, 24].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
      </div>
      <div className="cs-page-controls">
        <button className="cs-page-btn nav" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>‹</button>
        {getPages().map((p, i) =>
          p === "…"
            ? <span key={`e${i}`} className="cs-page-ellipsis">…</span>
            : <button key={p} className={`cs-page-btn ${p === currentPage ? "active" : ""}`} onClick={() => onPageChange(p)}>{p}</button>
        )}
        <button className="cs-page-btn nav" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>›</button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN EXPORT
═══════════════════════════════════════════════════════════ */
export default function Filter() {
  const location = useLocation();
  const gridRef  = useRef(null);

  /* ── Search / filter state ── */
  const [query,       setQuery]       = useState("");
  const [businessPark,setBusinessPark]= useState("");
  const [sortBy,      setSortBy]      = useState("newest");
  const [selected,    setSelected]    = useState(null);
  const [listView,    setListView]    = useState(false);

  /* ── Pagination ── */
  const [page,    setPage]    = useState(1);
  const [perPage, setPerPage] = useState(9);

  /* ── API result state ── */
  const [companies,   setCompanies]   = useState([]);
  const [total,       setTotal]       = useState(0);
  const [totalPages,  setTotalPages]  = useState(1);
  const [loading,     setLoading]     = useState(false);
  const [searching,   setSearching]   = useState(false); // spinner inside search box
  const [filterOpts,  setFilterOpts]  = useState({ businessParks: [] });

  /* ── Tags from URL ── */
  const [urlTags, setUrlTags] = useState([]);
  useEffect(() => {
    const params  = new URLSearchParams(location.search);
    const tagParam= params.get("tags");
    setUrlTags(tagParam ? tagParam.split(",").filter(Boolean) : []);
    setPage(1);
  }, [location.search]);

  /* ── Debounce the search query ── */
  const debouncedQuery = useDebounce(query, 450);

  /* ── Reset to page 1 when filters/query change ── */
  useEffect(() => { setPage(1); }, [debouncedQuery, businessPark, sortBy, perPage, urlTags]);

  /* ── Show spinner in search box while user is typing (before debounce fires) ── */
  useEffect(() => {
    if (query !== debouncedQuery) setSearching(true);
    else setSearching(false);
  }, [query, debouncedQuery]);

  /* ── Fetch filter options once ── */
  useEffect(() => {
    axios.get(`${API_BASE}/companies/filters`)
      .then(res => { if (res.data.success) setFilterOpts(res.data.data); 
        console.log("ddd",res.data.data);
        
      })
      .catch(() => {});
  }, []);

  /* ── Main fetch — fires whenever debounced query, filters, or page change ── */
  useEffect(() => {
    const controller = new AbortController();

    const params = {
      page,
      limit: perPage,
      sort:  sortBy,
    };
    if (debouncedQuery.trim()) params.q = debouncedQuery.trim();
    if (businessPark)          params.businessPark = businessPark;
    if (urlTags.length)        params.tags = urlTags.join(",");

    setLoading(true);
    axios
      .get(`${API_BASE}/companies/filter`, { params, signal: controller.signal })
      .then(res => {
        if (res.data.success) {
          setCompanies(res.data.data);
          setTotal(res.data.pagination.total);
          setTotalPages(res.data.pagination.totalPages);
        }
      })
      .catch(err => { if (!axios.isCancel(err)) console.error("Search error", err); })
      .finally(() => setLoading(false));

    return () => controller.abort(); // cancel in-flight request if params change
  }, [debouncedQuery, businessPark, sortBy, page, perPage, urlTags]);

  /* ── Handlers ── */
  const handlePageChange = (p) => {
    setPage(p);
    setTimeout(() => gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  };

  const handleClear = () => {
    setQuery(""); setBusinessPark(""); setSortBy("newest"); setPage(1);
  };

  const hasFilters = query || businessPark || urlTags.length;

  /* ── Build business park pills from URL tags (legacy) + dropdown ── */
  const tagPills = urlTags.length > 0
    ? [{ label: "All", value: "" }, ...urlTags.map(t => ({ label: t, value: t }))]
    : [];

  /* ── Active tag pill filter (client-side sub-filter within URL tags) ── */
  const [activeTagPill, setActiveTagPill] = useState("");

  // When URL tags change reset active pill
  useEffect(() => { setActiveTagPill(""); }, [urlTags]);

  // If tagPills are active, sub-filter client-side (already filtered server-side by urlTags)
  // This just lets user highlight one tag at a time
  const displayedCompanies = activeTagPill
    ? companies.filter(c => (c.tags || []).some(t => t.toLowerCase() === activeTagPill.toLowerCase()))
    : companies;

  return (
    <>
      <style>{CSS}</style>
      <div className="cs-root">

        {/* ── HEADER ── */}
        <div className="cs-header">
          <div className="cs-header-inner">
            <div>
              <div className="cs-breadcrumb">
                <span>Platform</span>
                <span className="cs-breadcrumb-dot" />
                <span className="cs-breadcrumb-accent">Directory</span>
              </div>
              <h1 className="cs-h1">Find the right<br /><em>company for you.</em></h1>
              <p className="cs-sub">Browse verified businesses, filter by specialty, and connect instantly via call, WhatsApp or email.</p>
            </div>
            <div className="cs-stat-block">
              <div className="cs-stat">
                <div className="cs-stat-n">{loading ? "…" : displayedCompanies.length}</div>
                <div className="cs-stat-l">This Page</div>
              </div>
              <div className="cs-stat-divider" />
              <div className="cs-stat">
                <div className="cs-stat-n">{loading ? "…" : total}</div>
                <div className="cs-stat-l">Total Listed</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── CONTROLS ── */}
        <div className="cs-controls">
          <div className="cs-search-row">
            {/* Search box with debounce spinner */}
            <div className="cs-search-wrap">
              <span className="cs-search-icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              </span>
              <input
                className="cs-search-input"
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search companies, services, tags…"
              />
              {searching && (
                <span className="cs-search-spinner"><div className="cs-spinner" /></span>
              )}
            </div>

            {/* Business Park dropdown */}
            {filterOpts.businessParks?.length > 0 && (
              <select
                className={`cs-filter-select ${businessPark ? "active" : ""}`}
                value={businessPark}
                onChange={e => setBusinessPark(e.target.value)}
              >
                <option value="">All Parks</option>
                {filterOpts.businessParks.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            )}

            {/* Sort */}
            <select
              className="cs-filter-select"
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="name_asc">A → Z</option>
              <option value="name_desc">Z → A</option>
            </select>

            {hasFilters && (
              <button className="cs-clear-btn" onClick={handleClear}>✕ Clear</button>
            )}
          </div>

          {/* Tag pills (from URL — acts as quick sub-filter) */}
          {tagPills.length > 1 && (
            <div className="cs-filter-row">
              <span className="cs-filter-label">Filter:</span>
              {tagPills.map(p => (
                <button
                  key={p.value}
                  className={`cs-pill ${activeTagPill === p.value ? "active" : ""}`}
                  onClick={() => setActiveTagPill(p.value)}
                >
                  {p.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── META BAR ── */}
        <div className="cs-meta-bar" ref={gridRef}>
          <div className="cs-meta-text">
            {loading
              ? "Loading…"
              : <><strong>{total}</strong> {total === 1 ? "company" : "companies"} found{hasFilters && " · filtered"}</>
            }
          </div>
          <div className="cs-view-toggle">
            <button className={`cs-vbtn ${!listView ? "active" : ""}`} onClick={() => setListView(false)} title="Grid view">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
            </button>
            <button className={`cs-vbtn ${listView ? "active" : ""}`} onClick={() => setListView(true)} title="List view">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="4" width="18" height="3" rx="1"/><rect x="3" y="10.5" width="18" height="3" rx="1"/><rect x="3" y="17" width="18" height="3" rx="1"/></svg>
            </button>
          </div>
        </div>

        {/* ── GRID ── */}
        <div className={`cs-grid ${listView ? "list-view" : ""}`}>
          {loading
            ? Array.from({ length: perPage }).map((_, i) => <SkeletonCard key={i} />)
            : displayedCompanies.length > 0
              ? displayedCompanies.map((c, i) => (
                  <Card key={c._id} company={c} index={i} onConnect={setSelected} listView={listView} />
                ))
              : (
                <div className="cs-empty">
                  <span className="cs-empty-icon">🏢</span>
                  <div className="cs-empty-title">No companies found</div>
                  <div className="cs-empty-sub">Try a different search term or clear the filter</div>
                </div>
              )
          }
        </div>

        {/* ── PAGINATION ── */}
        {!loading && total > 0 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            totalItems={total}
            perPage={perPage}
            onPerPageChange={setPerPage}
          />
        )}
      </div>

      {selected && <Modal company={selected} onClose={() => setSelected(null)} />}
    </>
  );
}