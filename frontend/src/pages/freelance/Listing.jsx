import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import API_BASE from "../../../config";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Instrument+Sans:wght@300;400;500;600&display=swap');

  .fl3-root {
    background: #f7f7f5;
    min-height: 100vh;
    font-family: 'Instrument Sans', sans-serif;
    color: #111;
  }

  /* ── Header ── */
  .fl3-header {
    background: #fff;
    border-bottom: 1px solid #e8e8e8;
    padding: 0 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 58px;
    position: sticky;
    top: 0;
    z-index: 10;
  }
  .fl3-logo {
    font-family: 'Playfair Display', serif;
    font-size: 17px;
    font-weight: 700;
    letter-spacing: -0.02em;
  }
  .fl3-search-wrap {
    position: relative;
    flex: 1;
    max-width: 300px;
    margin: 0 28px;
  }
  .fl3-search-wrap svg {
    position: absolute;
    left: 11px;
    top: 50%;
    transform: translateY(-50%);
    color: #aaa;
    pointer-events: none;
  }
  .fl3-search {
    width: 100%;
    background: #f2f2f2;
    border: 1px solid #e4e4e4;
    color: #111;
    font-family: 'Instrument Sans', sans-serif;
    font-size: 13px;
    padding: 8px 12px 8px 34px;
    border-radius: 8px;
    outline: none;
    transition: border-color 0.2s, background 0.2s;
  }
  .fl3-search::placeholder { color: #bbb; }
  .fl3-search:focus { background: #fff; border-color: #111; }
  .fl3-hcount { font-size: 11.5px; color: #999; }

  /* ── Hero ── */
  .fl3-hero {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 36px 32px 30px;
    gap: 24px;
  }
  .fl3-hero-left { flex: 1; }
  .fl3-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #999;
    margin-bottom: 10px;
  }
  .fl3-eyebrow-dot { width: 5px; height: 5px; border-radius: 50%; background: #111; }
  .fl3-hero-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(26px, 3.5vw, 40px);
    font-weight: 700;
    line-height: 1.08;
    letter-spacing: -0.025em;
    margin: 0 0 10px;
  }
  .fl3-hero-title em { font-style: italic; color: #555; }
  .fl3-hero-desc { font-size: 13px; color: #888; font-weight: 300; line-height: 1.6; max-width: 320px; }

  /* ── Projected card (hero right) ── */
  .fl3-hero-right {
    flex-shrink: 0;
    width: 240px;
    display: none;
    animation: fl3-up 0.55s 0.15s ease both;
  }
  @media (min-width: 800px) { .fl3-hero-right { display: block; } }

  .fl3-proj {
    background: #fff;
    border: 1px solid #e0e0e0;
    border-radius: 14px;
    padding: 5px;
    box-shadow: 0 6px 24px rgba(0,0,0,0.07);
    transition: box-shadow 0.25s, transform 0.25s;
  }
  .fl3-proj:hover { box-shadow: 0 12px 36px rgba(0,0,0,0.11); transform: translateY(-2px); }
  .fl3-proj-inner { display: flex; align-items: center; gap: 10px; padding: 9px; }
  .fl3-proj-img {
    width: 52px; height: 52px;
    border-radius: 8px;
    object-fit: cover;
    flex-shrink: 0;
    background: #eee;
  }
  .fl3-proj-info { flex: 1; min-width: 0; }
  .fl3-proj-lbl { font-size: 9px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: #bbb; margin-bottom: 3px; }
  .fl3-proj-name { font-family: 'Playfair Display', serif; font-size: 13px; font-weight: 700; margin-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .fl3-proj-role { font-size: 10.5px; color: #888; margin-bottom: 6px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .fl3-proj-skills { display: flex; flex-wrap: wrap; gap: 3px; }
  .fl3-proj-skill { font-size: 9px; font-weight: 500; padding: 2px 7px; border-radius: 100px; background: #f4f4f4; border: 1px solid #e8e8e8; color: #666; }
  .fl3-proj-foot {
    border-top: 1px solid #f0f0f0;
    padding: 8px 9px 3px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .fl3-proj-rating { font-size: 11px; font-weight: 600; color: #111; display: flex; align-items: center; gap: 3px; }
  .fl3-proj-star { color: #f5a623; }
  .fl3-proj-badge { font-size: 9px; font-weight: 700; letter-spacing: 0.05em; padding: 3px 9px; border-radius: 100px; background: #111; color: #fff; }

  /* ── Divider ── */
  .fl3-divider { height: 1px; background: #e8e8e8; margin: 0 32px; }

  /* ── Grid area ── */
  .fl3-body { padding: 24px 32px 56px; }
  .fl3-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
  }
  .fl3-bar-label { font-size: 10.5px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: #bbb; }
  .fl3-cat-chip { font-size: 10.5px; font-weight: 600; padding: 4px 12px; border-radius: 100px; background: #111; color: #fff; }

  /* 4-column grid */
  .fl3-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
  }
  @media (max-width: 900px) { .fl3-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 540px)  { .fl3-grid { grid-template-columns: 1fr; } }

  /* ── Compact card ── */
  @keyframes fl3-up {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fl3-shimmer {
    from { background-position: -500px 0; }
    to   { background-position: 500px 0; }
  }

  .fl3-card {
    background: #fff;
    border: 1px solid #e8e8e8;
    border-radius: 14px;
    padding: 12px;
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    opacity: 0;
    animation: fl3-up 0.4s ease both;
    transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s cubic-bezier(.22,.68,0,1.2);
    position: relative;
    overflow: hidden;
  }
  .fl3-card::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 2px;
    background: #111;
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.25s ease;
  }
  .fl3-card:hover {
    border-color: #ccc;
    box-shadow: 0 6px 20px rgba(0,0,0,0.08);
    transform: translateY(-3px);
  }
  .fl3-card:hover::after { transform: scaleX(1); }

  /* Square image */
  .fl3-img-wrap {
    width: 52px; height: 52px;
    flex-shrink: 0;
    border-radius: 10px;
    overflow: hidden;
    background: #f0f0f0;
    border: 1px solid #ececec;
  }
  .fl3-img {
    width: 100%; height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.3s;
  }
  .fl3-card:hover .fl3-img { transform: scale(1.08); }

  /* Info */
  .fl3-info { flex: 1; min-width: 0; }
  .fl3-name {
    font-family: 'Playfair Display', serif;
    font-size: 13.5px;
    font-weight: 700;
    margin: 0 0 1px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .fl3-role {
    font-size: 11px;
    color: #777;
    font-weight: 400;
    margin-bottom: 5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .fl3-skills { display: flex; flex-wrap: wrap; gap: 4px; }
  .fl3-skill {
    font-size: 9.5px;
    font-weight: 500;
    padding: 2px 7px;
    border-radius: 100px;
    background: #f5f5f5;
    border: 1px solid #e8e8e8;
    color: #666;
    transition: background 0.15s;
  }
  .fl3-card:hover .fl3-skill { background: #eee; }

  /* Rating pill top-right */
  .fl3-rating {
    position: absolute;
    top: 9px; right: 10px;
    font-size: 9.5px;
    font-weight: 600;
    color: #555;
    display: flex;
    align-items: center;
    gap: 2px;
  }
  .fl3-rstar { color: #f5a623; }

  /* ── Skeleton ── */
  .fl3-skel {
    background: linear-gradient(90deg, #f0f0f0 25%, #e6e6e6 50%, #f0f0f0 75%);
    background-size: 500px 100%;
    animation: fl3-shimmer 1.3s infinite;
    border-radius: 6px;
  }
  .fl3-skel-card {
    background: #fff;
    border: 1px solid #e8e8e8;
    border-radius: 14px;
    padding: 12px;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  /* ── Empty ── */
  .fl3-empty { text-align: center; padding: 60px 0; color: #bbb; font-size: 13px; }
  .fl3-empty-icon { font-size: 32px; margin-bottom: 10px; }
`;

const dummyFreelancers = [
  { _id:"1", name:"Arjun Nair",   tagline:"Video Editor",        place:"Kochi",     profilePhoto:"https://randomuser.me/api/portraits/men/32.jpg",   skills:["Premiere Pro","YouTube"], rating:4.9 },
  { _id:"2", name:"Sarah Thomas", tagline:"UI/UX Designer",      place:"Bangalore", profilePhoto:"https://randomuser.me/api/portraits/women/44.jpg", skills:["Figma","Wireframe"],      rating:4.8 },
  { _id:"3", name:"Rahul Kumar",  tagline:"Full Stack Dev",       place:"Delhi",     profilePhoto:"https://randomuser.me/api/portraits/men/12.jpg",   skills:["React","Node.js"],        rating:4.7 },
  { _id:"4", name:"Priya Menon",  tagline:"Brand Strategist",    place:"Mumbai",    profilePhoto:"https://randomuser.me/api/portraits/women/22.jpg", skills:["Branding","Adobe"],       rating:4.6 },
  { _id:"5", name:"Dev Sharma",   tagline:"Motion Designer",     place:"Pune",      profilePhoto:"https://randomuser.me/api/portraits/men/55.jpg",   skills:["After Effects","C4D"],    rating:4.8 },
  { _id:"6", name:"Nisha Roy",    tagline:"Content Writer",      place:"Chennai",   profilePhoto:"https://randomuser.me/api/portraits/women/65.jpg", skills:["SEO","Copywriting"],      rating:4.5 },
  { _id:"7", name:"Amir Khan",    tagline:"3D Artist",           place:"Hyderabad", profilePhoto:"https://randomuser.me/api/portraits/men/78.jpg",   skills:["Blender","ZBrush"],       rating:4.7 },
  { _id:"8", name:"Meera Das",    tagline:"Illustrator",         place:"Kolkata",   profilePhoto:"https://randomuser.me/api/portraits/women/33.jpg", skills:["Procreate","Illustration"],rating:4.9},
];

function SkeletonCard() {
  return (
    <div className="fl3-skel-card">
      <div className="fl3-skel" style={{ width:52, height:52, borderRadius:10, flexShrink:0 }} />
      <div style={{ flex:1 }}>
        <div className="fl3-skel" style={{ height:13, width:"55%", marginBottom:6 }} />
        <div className="fl3-skel" style={{ height:10, width:"75%", marginBottom:7 }} />
        <div style={{ display:"flex", gap:4 }}>
          <div className="fl3-skel" style={{ height:18, width:52, borderRadius:100 }} />
          <div className="fl3-skel" style={{ height:18, width:44, borderRadius:100 }} />
        </div>
      </div>
    </div>
  );
}

const style = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Outfit:wght@300;400;500;600&display=swap');
 
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
 
  :root {
    --white: #ffffff;
    --off-white: #f8f8fa;
    --border: #e8e8ed;
    --border-light: #f0f0f5;
    --ink: #0a0a0a;
    --ink-mid: #3a3a3a;
    --ink-soft: #8a8a96;
    --ink-faint: #b8b8c4;
    --shadow-sm: 0 1px 3px rgba(0,0,0,0.06);
    --shadow-md: 0 4px 16px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04);
    --shadow-lg: 0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06);
    --shadow-xl: 0 20px 60px rgba(0,0,0,0.14), 0 4px 16px rgba(0,0,0,0.08);
  }
 
  .fl-wrap {
    font-family: 'Outfit', sans-serif;
    position: relative;
    width: 460px;
  }
 
  /* ── CARD ── */
  .fl-card {
    display: flex;
    flex-direction: row;
    align-items: stretch;
    width: 100%;
    height: 160px;
    border-radius: 24px;
    background: var(--white);
    border: 1px solid var(--border);
    overflow: hidden;
    position: relative;
    box-shadow: var(--shadow-md);
    transition: transform 0.3s cubic-bezier(.34,1.4,.64,1), box-shadow 0.3s ease;
    cursor: pointer;
    animation: cardIn 0.5s cubic-bezier(.22,.68,0,1.2) both;
  }
 
  @keyframes cardIn {
    from { opacity:0; transform: translateY(20px) scale(0.96); }
    to   { opacity:1; transform: translateY(0) scale(1); }
  }
 
  .fl-card:hover {
    transform: translateY(-5px) scale(1.008);
    box-shadow: var(--shadow-xl);
  }
 
  /* Corner fold accent */
  .fl-card::after {
    content: '';
    position: absolute;
    bottom: 0; right: 0;
    width: 48px; height: 48px;
    background: linear-gradient(225deg, var(--border-light) 45%, transparent 46%);
    pointer-events: none;
  }
 
  /* ══════════════════════════════
     LEFT IMAGE PANEL
  ══════════════════════════════ */
  .fl-left {
    position: relative;
    width: 150px;
    min-width: 150px;
    overflow: hidden;
    flex-shrink: 0;
  }
 
  /* Full-bleed photo as background */
  .fl-bg-img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: grayscale(18%) contrast(1.05);
    transform: scale(1.04);
    transition: transform 0.5s ease;
  }
 
  .fl-card:hover .fl-bg-img {
    transform: scale(1.08);
  }
 
  /* Gradient overlay for depth */
  .fl-left-overlay {
    position: absolute;
    inset: 0;
    background:
      linear-gradient(to right, transparent 55%, rgba(255,255,255,0.96) 100%),
      linear-gradient(to bottom, rgba(0,0,0,0.12) 0%, transparent 40%, rgba(0,0,0,0.2) 100%);
    pointer-events: none;
    z-index: 1;
  }
 
  /* Subtle vertical separator shimmer */
  .fl-left-edge {
    position: absolute;
    top: 0; right: 0; bottom: 0;
    width: 1px;
    background: linear-gradient(to bottom, transparent, var(--border) 30%, var(--border) 70%, transparent);
    z-index: 2;
  }
 
  /* Rating badge floating on image */
  .fl-rating {
    position: absolute;
    bottom: 12px;
    left: 12px;
    z-index: 3;
    background: rgba(255,255,255,0.92);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255,255,255,0.9);
    border-radius: 10px;
    padding: 4px 8px 4px 6px;
    display: flex;
    align-items: center;
    gap: 3px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.12);
  }
 
  .fl-star { font-size: 10px; color: #f59e0b; line-height: 1; }
  .fl-rating-val {
    font-size: 11px;
    font-weight: 600;
    color: var(--ink);
    line-height: 1;
    letter-spacing: -0.2px;
  }
 
  /* Online indicator */
  .fl-status {
    position: absolute;
    top: 12px;
    left: 12px;
    z-index: 3;
    display: flex;
    align-items: center;
    gap: 4px;
    background: rgba(255,255,255,0.88);
    backdrop-filter: blur(6px);
    border-radius: 99px;
    padding: 3px 7px 3px 5px;
    border: 1px solid rgba(255,255,255,0.9);
    box-shadow: 0 1px 4px rgba(0,0,0,0.1);
  }
 
  .fl-dot {
    width: 7px; height: 7px;
    border-radius: 50%;
    background: #22c55e;
    box-shadow: 0 0 5px rgba(34,197,94,0.6);
    animation: pulse 2.4s ease infinite;
  }
 
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.55; }
  }
 
  .fl-status-txt {
    font-size: 9px;
    font-weight: 600;
    color: #16a34a;
    letter-spacing: 0.03em;
    line-height: 1;
  }
 
  /* ══════════════════════════════
     RIGHT CONTENT
  ══════════════════════════════ */
  .fl-right {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 20px 22px 18px 20px;
    min-width: 0;
    background: var(--white);
    position: relative;
  }
 
  .fl-meta {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 5px;
  }
 
  .fl-badge {
    font-size: 9px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--ink-soft);
    background: var(--off-white);
    border: 1px solid var(--border);
    border-radius: 5px;
    padding: 2px 6px;
    line-height: 1.4;
  }
 
  .fl-badge-pro {
    background: var(--ink);
    color: var(--white);
    border-color: var(--ink);
  }
 
  .fl-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 22px;
    font-weight: 700;
    color: var(--ink);
    letter-spacing: -0.4px;
    line-height: 1.1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 3px;
  }
 
  .fl-title {
    font-size: 11.5px;
    font-weight: 400;
    color: var(--ink-soft);
    letter-spacing: 0.01em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 0;
  }
 
  /* Decorative thin rule */
  .fl-rule {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 11px 0 10px;
  }
 
  .fl-rule-line {
    flex: 1;
    height: 1px;
    background: var(--border-light);
  }
 
  .fl-rule-dot {
    width: 3px; height: 3px;
    border-radius: 50%;
    background: var(--border);
  }
 
  /* Skills */
  .fl-skills {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
  }
 
  .fl-skill {
    font-size: 10px;
    font-weight: 500;
    padding: 4px 10px;
    border-radius: 99px;
    letter-spacing: 0.02em;
    line-height: 1;
    white-space: nowrap;
    transition: all 0.18s ease;
    border: 1px solid var(--border);
    background: var(--off-white);
    color: var(--ink-mid);
  }
 
  .fl-skill:first-child {
    background: var(--ink);
    color: var(--white);
    border-color: var(--ink);
  }
 
  .fl-skill:nth-child(2) {
    background: var(--white);
    color: var(--ink-mid);
    border-color: var(--border);
  }
 
  .fl-card:hover .fl-skill:first-child {
    background: #222;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  }
 
  .fl-card:hover .fl-skill {
    border-color: #d0d0d8;
  }
`;
 
function FreelancerCard({ freelancer = {}, index = 0 }) {
  const [imgErr, setImgErr] = useState(false);
  const fallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(freelancer.name || "F")}&background=e8e8ed&color=0a0a0a&size=256&bold=true`;
  const skills = (freelancer.skills || []).slice(0, 4);
  const isPro = (freelancer.rating || 0) >= 4.8;
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/freelancer/${freelancer._id}`);
  };
  return (
    <>
      <style>{style}</style>
      <div 
  className="fl-wrap" 
  style={{ animationDelay: `${index * 90}ms`, cursor: "pointer" }}
  onClick={handleClick}
>
        <div className="fl-card">
          {/* ── LEFT: Full-bleed photo panel ── */}
          <div className="fl-left">
            <img
              className="fl-bg-img"
              src={imgErr ? fallback : (freelancer.profilePhoto || fallback)}
              alt={freelancer.name}
              onError={() => setImgErr(true)}
            />
            <div className="fl-left-overlay" />
            <div className="fl-left-edge" />
 
            {/* Top: online status */}
            <div className="fl-status">
              <div className="fl-dot" />
              <span className="fl-status-txt">Available</span>
            </div>
 
            {/* Bottom: rating */}
            {freelancer.rating != null && (
              <div className="fl-rating">
                <span className="fl-star">★</span>
                <span className="fl-rating-val">{freelancer.rating.toFixed(1)}</span>
              </div>
            )}
          </div>
 
          {/* ── RIGHT: Content ── */}
          <div className="fl-right">
            <div className="fl-meta">
              {isPro && <span className="fl-badge fl-badge-pro">Pro</span>}
              <span className="fl-badge">Freelancer</span>
            </div>
            <p className="fl-name">{freelancer.name || "Freelancer"}</p>
            <p className="fl-title">{freelancer.tagline || "Independent Consultant"}</p>
 
            <div className="fl-rule">
              <div className="fl-rule-line" />
              <div className="fl-rule-dot" />
              <div className="fl-rule-line" />
            </div>
 
            <div className="fl-skills">
              {skills.map(s => (
                <span key={s} className="fl-skill">{s}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function ProjectedCard({ freelancer }) {
  if (!freelancer) return null;
  const fallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(freelancer.name||"F")}&background=eeeeee&color=111111&size=128`;
  return (
    <div className="fl3-hero-right">
      <div className="fl3-proj">
        <div className="fl3-proj-inner">
          <img className="fl3-proj-img" src={freelancer.profilePhoto || fallback} alt={freelancer.name} onError={e=>{e.target.src=fallback;}} />
          <div className="fl3-proj-info">
            <p className="fl3-proj-lbl">Featured</p>
            <p className="fl3-proj-name">{freelancer.name}</p>
            <p className="fl3-proj-role">{freelancer.tagline}</p>
            <div className="fl3-proj-skills">
              {(freelancer.skills||[]).slice(0,3).map(s=>(
                <span key={s} className="fl3-proj-skill">{s}</span>
              ))}
            </div>
          </div>
        </div>
        <div className="fl3-proj-foot">
          <div className="fl3-proj-rating"><span className="fl3-proj-star">★</span>{freelancer.rating?.toFixed(1)}</div>
          <span className="fl3-proj-badge">Top Rated</span>
        </div>
      </div>
    </div>
  );
}

export default function FreelancerList() {
  const location = useLocation();
  const selectedCategory = location.state?.category || "All";
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState("");

  useEffect(() => {
    const id = "fl3-styles";
    if (!document.getElementById(id)) {
      const el = document.createElement("style");
      el.id = id; el.textContent = STYLES;
      document.head.appendChild(el);
    }
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${API_BASE}/freelance`, {
          params: { category: selectedCategory !== "All" ? selectedCategory : undefined },
        });
        setFreelancers(res.data.services.map(s => ({
          _id: s._id,
          name: s.candidate?.name,
          tagline: s.title,
          place: s.candidate?.place,
          profilePhoto: s.candidate?.profilePhoto,
          skills: s.skills || [],
          rating: s.rating || 4.5,
        })));
      } catch { setFreelancers(dummyFreelancers); }
      setLoading(false);
    })();
  }, [selectedCategory]);

  const filtered = freelancers.filter(f =>
    f.name?.toLowerCase().includes(search.toLowerCase()) ||
    f.tagline?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fl3-root">

      {/* <header className="fl3-header">
        <span className="fl3-logo">Freelancers</span>
        <div className="fl3-search-wrap">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <input
            className="fl3-search"
            type="text"
            placeholder="Search name or service…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <span className="fl3-hcount">
          {loading ? "—" : `${filtered.length} found`}
        </span>
      </header> */}

      <div className="fl3-hero">
        <div className="fl3-hero-left">
          <div className="fl3-eyebrow">
            <span className="fl3-eyebrow-dot" />
            {selectedCategory === "All" ? "All Categories" : selectedCategory}
          </div>
          <h1 className="fl3-hero-title">Find the right<br /><em>freelancer</em> for you</h1>
          <p className="fl3-hero-desc">Browse verified professionals across design, development, video & more.</p>
        </div>
        {/* {!loading && <ProjectedCard freelancer={freelancers[0] || null} />} */}
      </div>

      <div className="fl3-divider" />

      <div className="fl3-body">
        <div className="fl3-bar">
          <span className="fl3-bar-label">{loading ? "Loading…" : `${filtered.length} result${filtered.length !== 1 ? "s" : ""}`}</span>
          <span className="fl3-cat-chip">{selectedCategory}</span>
        </div>

        {loading ? (
          <div className="fl3-grid">{[0,1,2,3,4,5,6,7].map(i=><SkeletonCard key={i}/>)}</div>
        ) : filtered.length === 0 ? (
          <div className="fl3-empty"><div className="fl3-empty-icon">🔍</div><p>No freelancers found.</p></div>
        ) : (
          <div className="fl3-grid">
            {filtered.map((f,i) => <FreelancerCard key={f._id} freelancer={f} index={i} />)}
          </div>
        )}
      </div>

    </div>
  );
}