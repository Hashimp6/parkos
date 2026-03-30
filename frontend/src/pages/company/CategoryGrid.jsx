import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import API_BASE from "../../../config";
// ── Sample data matching your exact MongoDB schema ──
const COMPANIES = [
  {
    _id: "1",
    companyName: "PixelForge Studio",
    tagline: "Crafting digital experiences that convert",
    logo: "", banner: "",
    industry: "Technology", companySize: "11-50", foundedYear: 2018,
    about: "We build high-performance web and mobile apps for startups and enterprises alike. Our team specializes in React, Node.js, and cloud architecture.",
    tags: ["web", "mobile", "design"],
    businessPark: "Technopark",
    address: { building: "Tower B, Floor 4", city: "Thiruvananthapuram", state: "Kerala", country: "India" },
    services: [
      { title: "Web Development", description: "Full-stack web apps built to scale." },
      { title: "App Development", description: "iOS & Android apps with great UX." },
      { title: "UI/UX Design", description: "Interfaces users love to use." },
    ],
    contacts: { phone: "+91 98400 12345", email: "hello@pixelforge.io", whatsapp: "919840012345", instagram: "pixelforge.io", linkedin: "pixelforge" },
    website: "https://pixelforge.io", isVerified: true,
  },
  {
    _id: "2",
    companyName: "Crescent Media",
    tagline: "Video & photography for brands that stand out",
    logo: "", banner: "",
    industry: "Media & Entertainment", companySize: "1-10", foundedYear: 2020,
    about: "A creative media house specializing in brand storytelling through cinematic video production and professional photography.",
    tags: ["video", "photo", "media"],
    businessPark: "Other",
    address: { building: "MG Road, Suite 201", city: "Kochi", state: "Kerala", country: "India" },
    services: [
      { title: "Video Editing", description: "Post-production for ads, reels & films." },
      { title: "Photography", description: "Product, event & portrait photography." },
      { title: "Videography", description: "Full video production with crew." },
    ],
    contacts: { phone: "+91 94470 55678", email: "contact@crescentmedia.in", whatsapp: "914447055678", instagram: "crescent.media" },
    website: "https://crescentmedia.in", isVerified: true,
  },
  {
    _id: "3",
    companyName: "Growthlab Marketing",
    tagline: "Data-driven campaigns that scale your reach",
    logo: "", banner: "",
    industry: "Marketing", companySize: "11-50", foundedYear: 2017,
    about: "We help brands grow through performance marketing, SEO, and social media. Over 200 clients served across India.",
    tags: ["marketing", "social", "content"],
    businessPark: "Cyberpark",
    address: { building: "Cyber Hub, 3rd Floor", city: "Thrissur", state: "Kerala", country: "India" },
    services: [
      { title: "Digital Marketing", description: "SEO, SEM and paid media." },
      { title: "Social Media Marketing", description: "Content strategy & community management." },
      { title: "Content Writing", description: "Blogs, copy and brand content." },
    ],
    contacts: { phone: "+91 99470 33210", email: "info@growthlab.in", whatsapp: "919947033210", linkedin: "growthlab-in" },
    website: "https://growthlab.in", isVerified: true,
  },
  {
    _id: "4",
    companyName: "Aurelius Design Co.",
    tagline: "Branding and visuals with lasting impression",
    logo: "", banner: "",
    industry: "Design", companySize: "1-10", foundedYear: 2021,
    about: "Boutique design studio focused on brand identity, visual communication, and print design for premium clients.",
    tags: ["branding", "logo", "print"],
    businessPark: "Smart City",
    address: { building: "Design Quarter, Level 2", city: "Kochi", state: "Kerala", country: "India" },
    services: [
      { title: "Logo Design", description: "Timeless logos that define identity." },
      { title: "Brand Identity", description: "Full brand system from color to type." },
      { title: "Print & Packaging", description: "Posters, brochures & packaging." },
    ],
    contacts: { phone: "+91 89390 77654", email: "studio@aurelius.design", whatsapp: "918939077654", instagram: "aurelius.design" },
    website: "https://aurelius.design", isVerified: false,
  },
  {
    _id: "5",
    companyName: "Zenith Events",
    tagline: "Memorable events, flawlessly executed",
    logo: "", banner: "",
    industry: "Events", companySize: "11-50", foundedYear: 2015,
    about: "End-to-end event management for corporate, cultural and private events. From intimate gatherings to 5000-seat conferences.",
    tags: ["events", "catering", "hosting"],
    businessPark: "Other",
    address: { building: "Beach Road, Convention Centre", city: "Kozhikode", state: "Kerala", country: "India" },
    services: [
      { title: "Event Management", description: "Corporate & private event planning." },
      { title: "Hosting / Presenters", description: "Professional MCs and anchors." },
      { title: "Food & Catering", description: "Multi-cuisine catering services." },
    ],
    contacts: { phone: "+91 97440 22198", email: "book@zenithevents.in", whatsapp: "919744022198", facebook: "zenithevents" },
    website: "https://zenithevents.in", isVerified: true,
  },
  {
    _id: "6",
    companyName: "Bloom Beauty Studio",
    tagline: "Where artistry meets elegance",
    logo: "", banner: "",
    industry: "Beauty & Fashion", companySize: "1-10", foundedYear: 2019,
    about: "Professional makeup artists and henna designers for weddings, films and personal occasions.",
    tags: ["beauty", "makeup", "fashion"],
    businessPark: "Other",
    address: { building: "Shakthan Nagar", city: "Thrissur", state: "Kerala", country: "India" },
    services: [
      { title: "Makeup & Beauty", description: "Bridal, editorial & personal makeup." },
      { title: "Henna / Mehndi Art", description: "Intricate traditional & modern mehndi." },
      { title: "Fashion Styling", description: "Outfit & accessory styling sessions." },
    ],
    contacts: { phone: "+91 96330 44123", email: "appointments@bloombeauty.in", whatsapp: "919633044123", instagram: "bloombeauty.studio" },
    website: "https://bloombeauty.in", isVerified: true,
  },
];

const INDUSTRY_FILTERS = [
  { label: "All", value: "all" },
  { label: "Tech", value: "Technology" },
  { label: "Design", value: "Design" },
  { label: "Media", value: "Media & Entertainment" },
  { label: "Marketing", value: "Marketing" },
  { label: "Events", value: "Events" },
  { label: "Beauty", value: "Beauty & Fashion" },
];

const PARK_STYLES = {
  "Cyberpark":        { bg: "#e8f2ff", color: "#1046a0", dot: "#3b7ef6" },
  "Technopark":       { bg: "#fff3e8", color: "#a03a10", dot: "#f97316" },
  "Infopark":         { bg: "#eaffef", color: "#0a6230", dot: "#22c55e" },
  "Smart City":       { bg: "#f0eaff", color: "#5b10a0", dot: "#a855f7" },
  "KINFRA Tech Park": { bg: "#fffae8", color: "#7a5500", dot: "#f59e0b" },
  "Business Park":    { bg: "#eaedff", color: "#102dab", dot: "#6366f1" },
  "SEZ":              { bg: "#ffecec", color: "#ab1010", dot: "#ef4444" },
  "Other":            { bg: "#f0f0ee", color: "#555", dot: "#9ca3af" },
};

const ACCENT_PALETTE = [
  "#1a1a2e","#2d1b4e","#0d3b2e","#3b2000",
  "#1a2a4a","#3a1030","#0e2233","#1e3a1e","#2a1a00","#001a3a",
];

const getInitials = (name = "") =>
  name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);

const getAccent = (name = "") => {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return ACCENT_PALETTE[Math.abs(h) % ACCENT_PALETTE.length];
};

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Instrument+Serif:ital@0;1&family=DM+Mono:wght@300;400&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --ink:#0c0c0e; --ink2:#3a3a42; --ink3:#7a7a85; --ink4:#b0b0bb;
    --s:#f8f8f6; --s2:#f1f1ee; --s3:#e8e8e4;
    --bd:rgba(0,0,0,0.07); --bd2:rgba(0,0,0,0.13);
    --wh:#ffffff;
  }
  .cp { font-family:'Syne',sans-serif; min-height:100vh; background:var(--s); color:var(--ink); padding-bottom:80px; }

  /* HERO */
  .cp-hero { padding:52px 40px 0; max-width:1180px; margin:0 auto; display:flex; align-items:flex-end; justify-content:space-between; gap:28px; flex-wrap:wrap; }
  .cp-ol { display:inline-flex; align-items:center; gap:8px; font-size:9px; font-weight:700; letter-spacing:0.22em; text-transform:uppercase; color:var(--ink3); margin-bottom:14px; }
  .cp-ol-dash { width:22px; height:1px; background:var(--ink4); }
  .cp-h1 { font-family:'Instrument Serif',serif; font-size:clamp(38px,4.8vw,62px); font-weight:400; line-height:1.02; letter-spacing:-1.5px; color:var(--ink); margin-bottom:12px; }
  .cp-h1 em { font-style:italic; color:var(--ink3); }
  .cp-sub { font-size:13px; font-weight:400; color:var(--ink3); line-height:1.65; max-width:420px; }
  .cp-stat { display:flex; flex-direction:column; align-items:flex-end; gap:4px; flex-shrink:0; }
  .cp-stat-n { font-family:'Instrument Serif',serif; font-size:52px; font-weight:400; color:var(--ink); line-height:1; letter-spacing:-2px; }
  .cp-stat-l { font-size:9px; font-weight:700; letter-spacing:0.18em; text-transform:uppercase; color:var(--ink4); }

  /* CONTROLS */
  .cp-ctrl { max-width:1180px; margin:34px auto 0; padding:0 40px; display:flex; flex-direction:column; gap:12px; }
  .cp-sw { position:relative; flex:1; max-width:420px; }
  .cp-si { position:absolute; left:13px; top:50%; transform:translateY(-50%); color:var(--ink4); pointer-events:none; display:flex; }
  .cp-sin { width:100%; border:1.5px solid var(--bd2); border-radius:12px; background:var(--wh); outline:none; font-family:'Syne',sans-serif; font-size:13px; font-weight:500; color:var(--ink); padding:11px 14px 11px 38px; transition:border-color 0.2s,box-shadow 0.2s; }
  .cp-sin::placeholder { color:var(--ink4); font-weight:400; }
  .cp-sin:focus { border-color:var(--ink); box-shadow:0 0 0 3px rgba(12,12,14,0.07); }
  .cp-frow { display:flex; gap:6px; flex-wrap:wrap; align-items:center; }
  .cp-flabel { font-size:9px; font-weight:700; letter-spacing:0.16em; text-transform:uppercase; color:var(--ink4); margin-right:4px; }
  .cp-pill { border:1.5px solid var(--bd2); background:var(--wh); border-radius:99px; font-family:'Syne',sans-serif; font-size:11px; font-weight:600; color:var(--ink3); padding:6px 14px; cursor:pointer; transition:all 0.17s; white-space:nowrap; }
  .cp-pill:hover { border-color:var(--ink); color:var(--ink); }
  .cp-pill.on { background:var(--ink); border-color:var(--ink); color:#fff; }

  /* RESULT BAR */
  .cp-bar { max-width:1180px; margin:24px auto 18px; padding:0 40px; display:flex; align-items:center; justify-content:space-between; font-size:11px; font-weight:600; letter-spacing:0.05em; text-transform:uppercase; color:var(--ink4); }
  .cp-bar strong { color:var(--ink); }
  .cp-clr { background:none; border:none; cursor:pointer; font-family:'Syne',sans-serif; font-size:11px; font-weight:600; color:var(--ink3); transition:color 0.15s; }
  .cp-clr:hover { color:var(--ink); }

  /* GRID */
  .cp-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:18px; max-width:1180px; margin:0 auto; padding:0 40px; }

  /* CARD */
  .cp-card { background:var(--wh); border:1px solid var(--bd); border-radius:22px; overflow:hidden; display:flex; flex-direction:column; transition:transform 0.3s cubic-bezier(.34,1.3,.64,1),box-shadow 0.3s,border-color 0.2s; animation:cin 0.45s cubic-bezier(.22,.68,0,1.18) both; box-shadow:0 1px 4px rgba(0,0,0,0.04); }
  @keyframes cin { from{opacity:0;transform:translateY(16px) scale(0.97)} to{opacity:1;transform:none} }
  .cp-card:hover { transform:translateY(-5px) scale(1.008); box-shadow:0 16px 48px rgba(0,0,0,0.09),0 4px 14px rgba(0,0,0,0.05); border-color:var(--bd2); }
  .cp-band { height:5px; flex-shrink:0; }
  .cp-body { padding:20px 20px 0; flex:1; display:flex; flex-direction:column; }
  .cp-top { display:flex; align-items:flex-start; justify-content:space-between; gap:10px; margin-bottom:14px; }
  .cp-av { width:48px; height:48px; border-radius:14px; display:flex; align-items:center; justify-content:center; font-size:14px; font-weight:800; color:#fff; letter-spacing:0.04em; flex-shrink:0; }
  .cp-vbadge { display:flex; align-items:center; gap:4px; font-size:9px; font-weight:700; letter-spacing:0.12em; text-transform:uppercase; color:#0a6e35; background:#e8fff0; border:1px solid #a7f3d0; border-radius:99px; padding:4px 9px; }
  .cp-name { font-size:16px; font-weight:700; color:var(--ink); letter-spacing:-0.2px; margin-bottom:3px; line-height:1.2; }
  .cp-tline { font-size:11px; font-weight:400; color:var(--ink3); line-height:1.55; font-family:'DM Mono',monospace; margin-bottom:14px; }
  .cp-svcs { display:flex; flex-direction:column; gap:7px; margin-bottom:14px; }
  .cp-svc { display:flex; align-items:flex-start; gap:9px; padding:9px 11px; border-radius:10px; background:var(--s2); border:1px solid var(--bd); }
  .cp-sdot { width:6px; height:6px; border-radius:50%; flex-shrink:0; margin-top:5px; }
  .cp-stitle { font-size:12px; font-weight:700; color:var(--ink); line-height:1.2; margin-bottom:1px; }
  .cp-sdesc { font-size:10.5px; font-weight:400; color:var(--ink3); line-height:1.4; font-family:'DM Mono',monospace; }
  .cp-meta { display:flex; align-items:center; justify-content:space-between; padding:12px 0; border-top:1px solid var(--bd); margin-top:auto; }
  .cp-park { display:flex; align-items:center; gap:5px; font-size:9.5px; font-weight:700; letter-spacing:0.04em; border-radius:6px; padding:4px 9px; border:1px solid; }
  .cp-pdot { width:5px; height:5px; border-radius:50%; }
  .cp-loc { font-size:10px; font-weight:500; color:var(--ink4); display:flex; align-items:center; gap:4px; font-family:'DM Mono',monospace; }
  .cp-foot { padding:14px 20px 18px; }
  .cp-cbtn { width:100%; padding:11px 16px; border:1.5px solid var(--ink); border-radius:12px; background:transparent; font-family:'Syne',sans-serif; font-size:11.5px; font-weight:700; letter-spacing:0.06em; text-transform:uppercase; color:var(--ink); cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px; transition:all 0.2s; }
  .cp-cbtn:hover { background:var(--ink); color:#fff; }

  /* EMPTY */
  .cp-empty { grid-column:1/-1; text-align:center; padding:80px 0; color:var(--ink4); }
  .cp-empty-i { font-size:40px; display:block; margin-bottom:14px; }
  .cp-empty-t { font-size:15px; font-weight:600; color:var(--ink3); }
  .cp-empty-s { font-size:12px; margin-top:6px; }

  /* MODAL */
  .cp-ov { position:fixed; inset:0; background:rgba(0,0,0,0.48); backdrop-filter:blur(5px); -webkit-backdrop-filter:blur(5px); display:flex; align-items:center; justify-content:center; z-index:200; padding:20px; animation:fbg 0.2s ease; }
  @keyframes fbg { from{opacity:0} to{opacity:1} }
  .cp-modal { background:#fff; border-radius:24px; width:100%; max-width:500px; overflow:hidden; animation:mpop 0.38s cubic-bezier(.34,1.3,.64,1); box-shadow:0 40px 120px rgba(0,0,0,0.25); }
  @keyframes mpop { from{opacity:0;transform:scale(0.88) translateY(24px)} to{opacity:1;transform:none} }
  .cp-mband { height:7px; }
  .cp-mc { padding:26px 26px 24px; }
  .cp-mtop { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:20px; }
  .cp-mid { display:flex; align-items:center; gap:13px; }
  .cp-mav { width:54px; height:54px; border-radius:16px; display:flex; align-items:center; justify-content:center; font-size:17px; font-weight:800; color:#fff; letter-spacing:0.04em; flex-shrink:0; }
  .cp-mname { font-size:18px; font-weight:700; color:var(--ink); letter-spacing:-0.3px; }
  .cp-msub { font-size:11px; font-weight:400; color:var(--ink3); margin-top:3px; font-family:'DM Mono',monospace; }
  .cp-mx { width:34px; height:34px; border-radius:10px; border:1.5px solid var(--bd2); background:transparent; cursor:pointer; display:flex; align-items:center; justify-content:center; color:var(--ink3); font-size:15px; transition:all 0.15s; flex-shrink:0; }
  .cp-mx:hover { background:var(--s2); color:var(--ink); }
  .cp-hr { height:1px; background:var(--bd); margin:16px 0; }
  .cp-slabel { font-size:9px; font-weight:700; letter-spacing:0.2em; text-transform:uppercase; color:var(--ink4); margin-bottom:10px; }
  .cp-about { font-size:11.5px; color:var(--ink3); line-height:1.65; font-family:'DM Mono',monospace; background:var(--s2); border-radius:10px; padding:10px 13px; margin-bottom:18px; border:1px solid var(--bd); }
  .cp-clist { display:flex; flex-direction:column; gap:8px; margin-bottom:18px; }
  .cp-ci { display:flex; align-items:center; gap:12px; padding:10px 13px; border-radius:12px; border:1px solid var(--bd); background:var(--s2); text-decoration:none; transition:border-color 0.15s,background 0.15s; cursor:default; }
  a.cp-ci { cursor:pointer; }
  a.cp-ci:hover { border-color:var(--bd2); background:#fff; }
  .cp-cico { width:34px; height:34px; border-radius:10px; background:#fff; border:1px solid var(--bd); display:flex; align-items:center; justify-content:center; font-size:15px; flex-shrink:0; }
  .cp-clabel { font-size:9px; font-weight:700; letter-spacing:0.12em; text-transform:uppercase; color:var(--ink4); }
  .cp-cval { font-size:12.5px; font-weight:600; color:var(--ink); font-family:'DM Mono',monospace; word-break:break-all; }
  .cp-acts { display:grid; grid-template-columns:1fr 1fr; gap:8px; }
  .cp-act { padding:12px; border-radius:12px; font-family:'Syne',sans-serif; font-size:11px; font-weight:700; letter-spacing:0.06em; text-transform:uppercase; cursor:pointer; border:none; display:flex; align-items:center; justify-content:center; gap:7px; text-decoration:none; transition:all 0.18s; }
  .cp-call { background:#0c0c0e; color:#fff; }
  .cp-call:hover { background:#2a2a2e; }
  .cp-wa { background:#1da851; color:#fff; }
  .cp-wa:hover { background:#18923f; }
  .cp-mail { grid-column:1/-1; background:var(--s2); color:var(--ink); border:1.5px solid var(--bd2) !important; }
  .cp-mail:hover { background:var(--s3); }
  .cp-socials { display:flex; gap:7px; margin-top:14px; }
  .cp-soc { flex:1; padding:9px 6px; border:1.5px solid var(--bd2); border-radius:10px; background:#fff; display:flex; align-items:center; justify-content:center; gap:5px; font-size:10px; font-weight:700; letter-spacing:0.06em; text-transform:uppercase; color:var(--ink3); text-decoration:none; transition:all 0.17s; }
  .cp-soc:hover { border-color:var(--ink); color:var(--ink); }

  @media (max-width:960px) { .cp-grid { grid-template-columns:repeat(2,1fr); } }
  @media (max-width:600px) {
    .cp-hero,.cp-ctrl,.cp-bar,.cp-grid { padding-left:18px; padding-right:18px; }
    .cp-grid { grid-template-columns:1fr; }
    .cp-h1 { font-size:36px; }
    .cp-stat { display:none; }
  }
`;

function Modal({ company, onClose }) {
  const color = getAccent(company.companyName);
  const initials = getInitials(company.companyName);
  const c = company.contacts || {};
  const waNum = (c.whatsapp || c.phone || "").replace(/\D/g, "");
  const waMsg = encodeURIComponent(`Hi ${company.companyName}, I found you on the platform and I'm interested in your services!`);

  const socials = [
    c.linkedin  && { label: "LinkedIn",  ico: "💼", href: `https://linkedin.com/company/${c.linkedin}` },
    c.instagram && { label: "Instagram", ico: "📸", href: `https://instagram.com/${c.instagram}` },
    c.facebook  && { label: "Facebook",  ico: "👥", href: `https://facebook.com/${c.facebook}` },
    c.twitter   && { label: "Twitter",   ico: "🐦", href: `https://twitter.com/${c.twitter}` },
    c.youtube   && { label: "YouTube",   ico: "▶️",  href: `https://youtube.com/${c.youtube}` },
  ].filter(Boolean);

  return (
    <div className="cp-ov" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="cp-modal">
        <div className="cp-mband" style={{ background: color }} />
        <div className="cp-mc">
          <div className="cp-mtop">
            <div className="cp-mid">
              <div className="cp-mav" style={{ background: color }}>{initials}</div>
              <div>
                <div className="cp-mname">{company.companyName}</div>
                <div className="cp-msub">{company.industry} · {company.address?.city}, {company.address?.state}</div>
              </div>
            </div>
            <button className="cp-mx" onClick={onClose}>✕</button>
          </div>

          {company.about && (
            <div className="cp-about">
              {company.about.length > 160 ? company.about.slice(0, 160) + "…" : company.about}
            </div>
          )}

          <div className="cp-hr" />

          <div className="cp-slabel">Contact Details</div>
          <div className="cp-clist">
            {c.phone && (
              <a href={`tel:${c.phone}`} className="cp-ci">
                <div className="cp-cico">📞</div>
                <div><div className="cp-clabel">Phone</div><div className="cp-cval">{c.phone}</div></div>
              </a>
            )}
            {c.email && (
              <a href={`mailto:${c.email}`} className="cp-ci">
                <div className="cp-cico">✉️</div>
                <div><div className="cp-clabel">Email</div><div className="cp-cval">{c.email}</div></div>
              </a>
            )}
            {company.website && (
              <a href={company.website} target="_blank" rel="noreferrer" className="cp-ci">
                <div className="cp-cico">🌐</div>
                <div><div className="cp-clabel">Website</div><div className="cp-cval">{company.website.replace("https://", "")}</div></div>
              </a>
            )}
            {company.address?.city && (
              <div className="cp-ci">
                <div className="cp-cico">📍</div>
                <div>
                  <div className="cp-clabel">Location</div>
                  <div className="cp-cval">{[company.address.building, company.address.city, company.address.state].filter(Boolean).join(", ")}</div>
                </div>
              </div>
            )}
            {company.businessPark && company.businessPark !== "Other" && (
              <div className="cp-ci">
                <div className="cp-cico">🏢</div>
                <div><div className="cp-clabel">Business Park</div><div className="cp-cval">{company.businessPark}</div></div>
              </div>
            )}
          </div>

          <div className="cp-slabel">Connect Instantly</div>
          <div className="cp-acts">
            {c.phone && (
              <a href={`tel:${c.phone}`} className="cp-act cp-call">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.12 1.22 2 2 0 012.1 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>
                Call Now
              </a>
            )}
            {waNum && (
              <a href={`https://wa.me/${waNum}?text=${waMsg}`} target="_blank" rel="noreferrer" className="cp-act cp-wa">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a4.67 4.67 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.555 4.126 1.527 5.856L.057 23.882l6.191-1.424A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.013-1.374l-.36-.214-3.724.856.88-3.62-.234-.372A9.818 9.818 0 012.182 12C2.182 6.573 6.573 2.182 12 2.182S21.818 6.573 21.818 12 17.427 21.818 12 21.818z"/></svg>
                WhatsApp
              </a>
            )}
            {c.email && (
              <a href={`mailto:${c.email}`} className="cp-act cp-mail" style={{ border: "1.5px solid var(--bd2)" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                Send Email
              </a>
            )}
          </div>

          {socials.length > 0 && (
            <div className="cp-socials">
              {socials.map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="cp-soc">
                  {s.ico} {s.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Card({ company, index, onConnect }) {
  const color = getAccent(company.companyName);
  const park = PARK_STYLES[company.businessPark] || PARK_STYLES["Other"];

  return (
    <div className="cp-card" style={{ animationDelay: `${index * 50}ms` }}>
      <div className="cp-band" style={{ background: color }} />
      <div className="cp-body">
        <div className="cp-top">
          <div className="cp-av" style={{ background: color }}>{getInitials(company.companyName)}</div>
          {company.isVerified && (
            <span className="cp-vbadge">
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#0a6e35" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
              Verified
            </span>
          )}
        </div>

        <div className="cp-name">{company.companyName}</div>
        <div className="cp-tline">{company.tagline}</div>

        {/* services[] from your schema */}
        <div className="cp-svcs">
          {(company.services || []).slice(0, 3).map((s, i) => (
            <div key={i} className="cp-svc">
              <div className="cp-sdot" style={{ background: color }} />
              <div>
                <div className="cp-stitle">{s.title}</div>
                {s.description && <div className="cp-sdesc">{s.description}</div>}
              </div>
            </div>
          ))}
        </div>

        <div className="cp-meta">
          <span className="cp-park" style={{ background: park.bg, color: park.color, borderColor: park.dot + "44" }}>
            <span className="cp-pdot" style={{ background: park.dot }} />
            {company.businessPark}
          </span>
          {company.address?.city && (
            <div className="cp-loc">
              <svg width="8" height="10" viewBox="0 0 10 13" fill="currentColor"><path d="M5 0C2.24 0 0 2.24 0 5c0 3.75 5 8 5 8s5-4.25 5-8c0-2.76-2.24-5-5-5zm0 6.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3z"/></svg>
              {company.address.city}
            </div>
          )}
        </div>
      </div>

      <div className="cp-foot">
        <button className="cp-cbtn" onClick={() => onConnect(company)}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
          Connect with {company.companyName.split(" ")[0]}
        </button>
      </div>
    </div>
  );
}

export default function CompanyServices() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [tags, setTags] = useState([]);
  const [category, setCategory] = useState("");
  const location = useLocation();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const params = new URLSearchParams(location.search);
  
    const tagParam = params.get("tags");
    const categoryParam = params.get("category");
  
    const parsedTags = tagParam ? tagParam.split(",") : [];
  
    setTags(parsedTags);
    setCategory(categoryParam || "");
  
    console.log("🔥 Category Clicked:", categoryParam);
    console.log("🔥 Tags:", parsedTags);
  }, [location.search]);


  const fetchCompanies = async (customFilter = filter, customTags = tags) => {
    try {
      setLoading(true);
  
      const params = new URLSearchParams();
  
      if (customTags.length > 0) {
        params.append("tags", customTags.join(","));
      }
  
      if (customFilter !== "all") {
        params.append("industry", customFilter);
      }
  

  
      const res = await fetch(
        `${API_BASE}/companies/company/by-tags?${params.toString()}`
      );
  
      const data = await res.json();
  
      if (data.success) {
        setCompanies(data.companies);
      }
    } catch (err) {
      console.error("Fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tags.length > 0) {
      fetchCompanies("all", tags);
    }
  }, [tags]);

  const filtered = companies.filter(c => {
    const q = query.toLowerCase();
  
    const matchQ =
      c.companyName.toLowerCase().includes(q) ||
      (c.tagline || "").toLowerCase().includes(q) ||
      (c.industry || "").toLowerCase().includes(q) ||
      (c.services || []).some(s => s.title.toLowerCase().includes(q)) ||
      (c.tags || []).some(t => t.includes(q));
  
    const matchTag =
      tags.length === 0 ||
      (c.tags || []).some(t =>
        tags.some(tag => t.toLowerCase().includes(tag.toLowerCase()))
      );
  
    const matchF = filter === "all" || c.industry === filter;
  
    return matchQ && matchF && matchTag;
  });


  

  return (
    <>
      <style>{CSS}</style>
      <div className="cp">

        {/* Hero */}
        <div className="cp-hero">
          <div>
            <div className="cp-ol"><span className="cp-ol-dash"/>Service Directory<span className="cp-ol-dash"/></div>
            <h1 className="cp-h1">Companies <em>built</em><br/>to serve you</h1>
            <p className="cp-sub">Browse verified businesses, filter by industry, and connect instantly via call, WhatsApp, or email.</p>
          </div>
          <div className="cp-stat">
            <div className="cp-stat-n">{COMPANIES.length}</div>
            <div className="cp-stat-l">Active Companies</div>
          </div>
        </div>

        {/* Controls */}
        <div className="cp-ctrl">
          <div className="cp-sw">
            <span className="cp-si">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </span>
            <input className="cp-sin" type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search companies, services, tags…" />
          </div>
          <div className="cp-frow">
            <span className="cp-flabel">Industry</span>
           {/* Always show default filters */}
<button
  className={`cp-pill ${filter === "all" ? "on" : ""}`}
  onClick={() => setFilter("all")}
>
  All
</button>



{/* Optional: show URL tags ALSO */}
{tags.length > 0 && tags.map((tag, i) => (
  <button
    key={`tag-${i}`}
    className={`cp-pill ${filter === tag ? "on" : ""}`}
    onClick={() => setFilter(tag)}
  >
    {tag}
  </button>
))}
          </div>
        </div>

        {/* Result bar */}
        <div className="cp-bar">
          <div>Showing <strong>{filtered.length}</strong> of {COMPANIES.length} companies</div>
          {(filter !== "all" || query) && (
            <button className="cp-clr" onClick={() => { setFilter("all"); setQuery(""); }}>Clear all ✕</button>
          )}
        </div>

        {/* Grid */}
        <div className="cp-grid">
          {filtered.length > 0
            ? filtered.map((c, i) => <Card key={c._id} company={c} index={i} onConnect={setSelected} />)
            : (
              <div className="cp-empty">
                <span className="cp-empty-i">🏢</span>
                <div className="cp-empty-t">No companies found</div>
                <div className="cp-empty-s">Try a different search or clear the filter</div>
              </div>
            )
          }
        </div>
      </div>

      {selected && <Modal company={selected} onClose={() => setSelected(null)} />}
    </>
  );
}








//   useEffect(() => {
//     const params = new URLSearchParams(location.search);
  
//     const tagParam = params.get("tags");
//     const categoryParam = params.get("category");
  
//     const parsedTags = tagParam ? tagParam.split(",") : [];
  
//     setTags(parsedTags);
//     setCategory(categoryParam);
  
//     console.log("🔥 Category Clicked:", categoryParam);
//     console.log("🔥 Tags:", parsedTags);
  
//   }, [location.search]);


//   const filtered = COMPANIES.filter(c => {
//     const q = query.toLowerCase();
  
//     const matchQ =
//       c.companyName.toLowerCase().includes(q) ||
//       (c.tagline || "").toLowerCase().includes(q) ||
//       (c.industry || "").toLowerCase().includes(q) ||
//       (c.services || []).some(s => s.title.toLowerCase().includes(q)) ||
//       (c.tags || []).some(t => t.includes(q));
  
//     const matchTag =
//       tags.length === 0 ||
//       (c.tags || []).some(t =>
//         tags.some(tag => t.toLowerCase().includes(tag.toLowerCase()))
//       );
  
//     const matchF = filter === "all" || c.industry === filter;
  
//     return matchQ && matchF && matchTag;
//   });


  

//   return (
//     <>
//       <style>{CSS}</style>
//       <div className="cp">

//         {/* Hero */}
//         <div className="cp-hero">
//           <div>
//             <div className="cp-ol"><span className="cp-ol-dash"/>Service Directory<span className="cp-ol-dash"/></div>
//             <h1 className="cp-h1">Companies <em>built</em><br/>to serve you</h1>
//             <p className="cp-sub">Browse verified businesses, filter by industry, and connect instantly via call, WhatsApp, or email.</p>
//           </div>
//           <div className="cp-stat">
//             <div className="cp-stat-n">{COMPANIES.length}</div>
//             <div className="cp-stat-l">Active Companies</div>
//           </div>
//         </div>

//         {/* Controls */}
//         <div className="cp-ctrl">
//           <div className="cp-sw">
//             <span className="cp-si">
//               <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
//             </span>
//             <input className="cp-sin" type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search companies, services, tags…" />
//           </div>
//           <div className="cp-frow">
//             <span className="cp-flabel">Industry</span>
//            {/* Always show default filters */}
// <button
//   className={`cp-pill ${filter === "all" ? "on" : ""}`}
//   onClick={() => setFilter("all")}
// >
//   All
// </button>



// {/* Optional: show URL tags ALSO */}
// {tags.length > 0 && tags.map((tag, i) => (
//   <button
//     key={`tag-${i}`}
//     className={`cp-pill ${filter === tag ? "on" : ""}`}
//     onClick={() => setFilter(tag)}
//   >
//     {tag}
//   </button>
// ))}
//           </div>
//         </div>

//         {/* Result bar */}
//         <div className="cp-bar">
//           <div>Showing <strong>{filtered.length}</strong> of {COMPANIES.length} companies</div>
//           {(filter !== "all" || query) && (
//             <button className="cp-clr" onClick={() => { setFilter("all"); setQuery(""); }}>Clear all ✕</button>
//           )}
//         </div>

//         {/* Grid */}
//         <div className="cp-grid">
//           {filtered.length > 0
//             ? filtered.map((c, i) => <Card key={c._id} company={c} index={i} onConnect={setSelected} />)
//             : (
//               <div className="cp-empty">
//                 <span className="cp-empty-i">🏢</span>
//                 <div className="cp-empty-t">No companies found</div>
//                 <div className="cp-empty-s">Try a different search or clear the filter</div>
//               </div>
//             )
//           }
//         </div>
//       </div>

//       {selected && <Modal company={selected} onClose={() => setSelected(null)} />}
//     </>
//   );
// }