// src/pages/company/CompanyPreview.jsx  (CompanyLayoutSelector)
// Desktop : sidebar left  + live preview right
// Mobile  : full-screen preview + horizontal film-strip at bottom
// ✅ All thumbnails (left sidebar + film-strip + right preview) use iframes
//    → guaranteed CSS isolation and pixel-perfect match across all three panels

import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCompany } from "../../context/CompanyContext";
import axios from "axios";
import API_BASE from "../../../config";
import toast from "react-hot-toast";

/* ── config ──────────────────────────────────────────────────────── */
const THUMB_W = 1000;
const THUMB_H = 1400;


const COMPANY_DUMMY= {
  companyName: "Axiom Digital",
  tagline: "Building Products That Define Markets.",
  about:
    "We are a full-service technology company delivering world-class software, design, and strategy to ambitious businesses. From Technopark's innovation corridor, we partner with startups and enterprises to engineer digital products that create lasting competitive advantage.",
  industry: "Software & Technology",
  companySize: "51–200",
  foundedYear: 2018,
  businessPark: "Technopark",
  website: "https://axiomdigital.io",
  tags: ["SaaS", "AI", "Cloud", "Mobile", "Enterprise"],
  logo: "",
  banner: "",
  address: {
    building: "Nila Building, Floor 4",
    street: "Technopark Phase I",
    city: "Thiruvananthapuram",
    state: "Kerala",
    pincode: "695581",
    country: "India",
  },
  contacts: {
    email: "hello@axiomdigital.io",
    phone: "+91 98765 43210",
    linkedin: "#",
    twitter: "#",
    instagram: "#",
    whatsapp: "919876543210",
  },
  services: [
    { title: "Product Engineering",    description: "End-to-end web & mobile products built for scale — from idea to launch and beyond." },
    { title: "AI & Automation",        description: "LLM integration, ML pipelines, and intelligent automation that makes your product smarter." },
    { title: "UI/UX Design",           description: "Research-driven interfaces and design systems that convert visitors into loyal users." },
    { title: "Cloud & DevOps",         description: "AWS/GCP/Azure architecture, CI/CD, and zero-downtime deployments at any scale." },
    { title: "Data & Analytics",       description: "Real-time dashboards, ETL pipelines, and BI tools that turn raw data into decisions." },
    { title: "Technology Consulting",  description: "CTO advisory, architecture audits, and technology roadmap planning for growth-stage companies." },
  ],
  projects: [
    { name: "PayFlow",    category: "FinTech",    year: "2024", description: "Real-time B2B payment rails processing ₹300 Cr/month for 800+ merchants across India.", link: "#" },
    { name: "CareSync",  category: "HealthTech", year: "2023", description: "Clinical workflow platform adopted by 60+ hospitals, cutting patient wait times by 45%.", link: "#" },
    { name: "TrackPro",  category: "Logistics",  year: "2024", description: "IoT fleet intelligence SaaS monitoring 60,000+ shipments daily with live GPS tracking.", link: "#" },
    { name: "EduPulse",  category: "EdTech",     year: "2022", description: "AI-adaptive learning platform serving 250K+ students with personalised curriculum paths.", link: "#" },
  ],
  members: [
    { name: "Arun Nair",      position: "Founder & CEO",   image: "", url: "", bio: "2x entrepreneur. Built and scaled tech teams across fintech and healthtech." },
    { name: "Divya Menon",    position: "CTO",             image: "", url: "", bio: "Ex-Amazon engineer. Distributed systems expert who ships at startup velocity." },
    { name: "Rahul George",   position: "Head of Design",  image: "", url: "", bio: "Formerly at Zomato. Turns complex problems into interfaces people love." },
    { name: "Sneha Krishnan", position: "VP Engineering",  image: "", url: "", bio: "15 years building production systems. Champion of clean code and fast deploys." },
    { name: "Kiran Pillai",   position: "Head of AI/ML",   image: "", url: "", bio: "PhD. Bridges research and production — ML that actually works at scale." },
    { name: "Meera Das",      position: "Director Growth", image: "", url: "", bio: "Scaled 3 startups to ₹100 Cr ARR. Growth strategy grounded in data." },
  ],
  clients: [
    { name: "Federal Bank",    sector: "Banking",       logo: "", website: "" },
    { name: "KIMS Health",     sector: "Healthcare",    logo: "", website: "" },
    { name: "UST Global",      sector: "Technology",    logo: "", website: "" },
    { name: "IBS Software",    sector: "Aviation",      logo: "", website: "" },
    { name: "Muthoot Finance", sector: "Finance",       logo: "", website: "" },
    { name: "Tata Elxsi",      sector: "Engineering",   logo: "", website: "" },
    { name: "HCLTech",         sector: "IT Services",   logo: "", website: "" },
    { name: "Kerala Govt.",    sector: "Public Sector", logo: "", website: "" },
  ],
  gallery: [
    { imageUrl: "", caption: "Design Week 2024",      tag: "Event"   },
    { imageUrl: "", caption: "Product Launch — PayFlow", tag: "Launch" },
    { imageUrl: "", caption: "Team Retreat, Munnar",  tag: "Culture" },
    { imageUrl: "", caption: "Hackathon Champions",   tag: "Award"   },
    { imageUrl: "", caption: "Sprint Workshop",       tag: "Work"    },
    { imageUrl: "", caption: "Client Summit 2023",    tag: "Client"  },
  ],
};

// ✅ Add new layouts here — everything else scales automatically
const LAYOUTS = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  label: `Layout ${i + 1}`,
  tag: ["Professional", "Clean", "Simple", "Tech", "Creative"][i % 5],
}));

const TEMPLATE_COUNT = LAYOUTS.length;

const TAG_COLORS = {
  Professional: "#1a1a2e",
  Clean:        "#2d6a4f",
  Simple:       "#555",
  Colorful:     "#7209b7",
  Expressive:   "#d62828",
  Dense:        "#3a3a3a",
  Artistic:     "#e76f51",
  Magazine:     "#023e8a",
  Structured:   "#2b4141",
  Refined:      "#8d6e63",
  Tech:         "#0077b6",
};

/* ── tiny hook: tracks window width ─────────────────────────────── */
function useIsMobile(breakpoint = 768) {
  const [mobile, setMobile] = useState(() => window.innerWidth < breakpoint);
  useEffect(() => {
    const fn = () => setMobile(window.innerWidth < breakpoint);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, [breakpoint]);
  return mobile;
}

/* ── desktop sidebar thumbnail — NOW USES IFRAME ─────────────────── */
function SideThumb({ layout, isActive, onSelect }) {
  const { id, label, tag } = layout;
  const boxRef = useRef(null);
  const [scale, setScale] = useState(0.17);

  useLayoutEffect(() => {
    if (!boxRef.current) return;
    const ro = new ResizeObserver(([e]) =>
      setScale(e.contentRect.width / THUMB_W)
    );
    ro.observe(boxRef.current);
    return () => ro.disconnect();
  }, []);

  const h = Math.max(Math.round(THUMB_H * scale), 150);

  return (
    <button
      onClick={() => onSelect(id)}
      style={{ fontFamily: "'DM Sans', sans-serif" }}
      className={`group w-full text-left rounded-xl overflow-hidden transition-all duration-200
        focus:outline-none border-2
        ${isActive
          ? "border-black shadow-[0_4px_20px_rgba(0,0,0,0.15)]"
          : "border-stone-200 hover:border-stone-400 hover:shadow-md"
        }`}
    >
      {/* thumbnail */}
      <div
        ref={boxRef}
        className="relative w-full overflow-hidden bg-stone-50"
        style={{ height: h }}
      >
        {/* ✅ iframe — same route as right panel, guaranteed CSS match */}
        <iframe
         src={`/company-preview/${id}?mode=dummy`}
          title={`Layout ${id}`}
          scrolling="no"
          style={{
            width: THUMB_W,
            height: THUMB_H,
            border: "none",
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            pointerEvents: "none",
            display: "block",
          }}
        />
        {/* hover dim */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/[0.04] transition-colors pointer-events-none" />

        {/* tag badge — visible when active */}
        <div
          className="absolute top-2 left-2 px-1.5 py-0.5 rounded text-[8px] font-bold tracking-widest uppercase z-10"
          style={{
            background: TAG_COLORS[tag] || "#333",
            color: "white",
            opacity: isActive ? 1 : 0,
            transition: "opacity 0.15s",
          }}
        >
          {tag}
        </div>

        {/* selected tick */}
        {isActive && (
          <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-black flex items-center justify-center z-10">
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
              <path
                d="M1 4L3.8 7L9 1"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}
      </div>

      {/* label */}
      <div
        className={`flex items-center justify-between px-2.5 py-2 border-t text-[11px] font-medium tracking-wide
        ${isActive
          ? "bg-black text-white border-black"
          : "bg-white text-stone-500 border-stone-200 group-hover:bg-stone-50"
        }`}
      >
        <span>{label}</span>
        <span className="opacity-40 tabular-nums">{String(id).padStart(2, "0")}</span>
      </div>
    </button>
  );
}

/* ── mobile film-strip thumbnail ─────────────────────────────────── */
function StripThumb({ layout, isActive, onSelect }) {
  const { id, label } = layout;
  const STRIP_W = 90;
  const scale = STRIP_W / THUMB_W;
  const h = Math.round(THUMB_H * scale);

  return (
    <button
      onClick={() => onSelect(id)}
      className={`shrink-0 rounded-lg overflow-hidden border-2 transition-all duration-150 focus:outline-none
        ${isActive ? "border-black scale-[1.04] shadow-lg" : "border-transparent"}`}
      style={{ width: STRIP_W }}
    >
      <div
        className="relative overflow-hidden bg-stone-100"
        style={{ width: STRIP_W, height: h }}
      >
        <iframe
       src={`/company-preview/${id}?mode=dummy`}
          title={`Layout ${id}`}
          scrolling="no"
          style={{
            width: THUMB_W,
            height: THUMB_H,
            border: "none",
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            pointerEvents: "none",
            display: "block",
          }}
        />
        {isActive && (
          <div className="absolute inset-0 ring-2 ring-inset ring-black rounded-lg pointer-events-none" />
        )}
      </div>
      <div
        className={`text-center text-[9px] font-bold tracking-widest uppercase py-1.5
        ${isActive ? "bg-black text-white" : "bg-white text-stone-400"}`}
      >
        {label}
      </div>
    </button>
  );
}

/* ── main ─────────────────────────────────────────────────────────── */
export default function CompanyLayoutSelector({ data: propData }) {
  const { company } = useCompany();
  const navigate = useNavigate();
  const sideRef  = useRef(null);
  const stripRef = useRef(null);
  const isMobile = useIsMobile();

  const [activeId, setActiveId] = useState(1);
  const [liveKey,  setLiveKey]  = useState(0);
  const [saving,   setSaving]   = useState(false);

  // Restore saved layout choice
  useEffect(() => {
    if (company?.layout) {
      setActiveId(company.layout);
    }
  }, [company]);

  const pageData = company || propData || {};

  // ✅ Sync data into localStorage so iframes can read it
  useEffect(() => {
    if (pageData && Object.keys(pageData).length > 0) {
      try {
        // REAL (right preview)
        localStorage.setItem("companyPreviewData", JSON.stringify(pageData));
  
        // DUMMY (left thumbnails)
        localStorage.setItem("companyPreviewDummy", JSON.stringify(COMPANY_DUMMY));
      } catch (_) {}
    }
  }, [pageData]);

  const activeLayout = LAYOUTS.find((l) => l.id === activeId) || LAYOUTS[0];

  const handleSelect = (id) => {
    setActiveId(id);
    setLiveKey((k) => k + 1);
    sideRef.current
      ?.querySelector(`[data-sid="${id}"]`)
      ?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    stripRef.current
      ?.querySelector(`[data-mid="${id}"]`)
      ?.scrollIntoView({ inline: "center", behavior: "smooth" });
  };



  const openProfile = async () => {
    try {
      if (!company?._id) {
        toast.error("Please login first");
        return;
      }
  
      setSaving(true);
  console.log("cc",company,activeId);
  
      const res = await axios.put(`${API_BASE}/companies/update-layout`, {
        companyId: company._id,
        layout: activeId,
      });
  console.log("rr",res.data);
  
      // ✅ success toast
      toast.success("Layout saved successfully 🎉");
  
      // ✅ small delay so user sees toast
      setTimeout(() => {
        navigate("/company/Home");
      }, 800);
  
    } catch (error) {
      console.error("Layout update error:", error);
  
      // ❌ error toast
      toast.error("Failed to save layout");
    } finally {
      setSaving(false);
    }
  };

  /* ── MOBILE LAYOUT ──────────────────────────────────────────────── */
  if (isMobile) {
    return (
      <div className="flex flex-col h-screen bg-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>

        {/* top bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-stone-200 shrink-0 bg-white">
          <div>
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-stone-400">Template</p>
            <p className="text-sm font-bold text-black leading-tight">
              {activeLayout.label}
              <span className="text-stone-400 font-normal ml-1.5 text-xs">
                {activeId}/{TEMPLATE_COUNT}
              </span>
            </p>
          </div>
          <button
            onClick={openProfile}
            disabled={saving}
            className="flex items-center gap-1.5 px-4 py-2 bg-black text-white text-xs font-bold
              rounded-full tracking-wide active:scale-95 transition-all disabled:opacity-60"
          >
            {saving ? "Saving…" : "Use this"}
            {!saving && (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 6h8M7 3l3 3-3 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
        </div>

        {/* live preview */}
        <div className="flex-1 overflow-hidden relative bg-stone-50">
          <iframe
            key={`m-${activeId}-${liveKey}`}
            src={`/company-preview/${activeId}?mode=real`}
            title={`Preview ${activeId}`}
            className="w-full h-full border-none block"
          />
          <button
            onClick={() => handleSelect(Math.max(LAYOUTS[0].id, activeId - 1))}
            disabled={activeId === LAYOUTS[0].id}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white
              border border-stone-200 shadow-sm flex items-center justify-center
              disabled:opacity-20 active:scale-95 transition-all z-10"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M9 2L4 7l5 5" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            onClick={() => handleSelect(Math.min(LAYOUTS[LAYOUTS.length - 1].id, activeId + 1))}
            disabled={activeId === LAYOUTS[LAYOUTS.length - 1].id}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white
              border border-stone-200 shadow-sm flex items-center justify-center
              disabled:opacity-20 active:scale-95 transition-all z-10"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M5 2l5 5-5 5" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* film-strip */}
        <div className="shrink-0 bg-white border-t border-stone-200">
          <div
            ref={stripRef}
            className="flex gap-2 px-3 py-3 overflow-x-auto"
            style={{ scrollbarWidth: "none" }}
          >
            {LAYOUTS.map((layout) => (
              <div key={layout.id} data-mid={layout.id}>
                <StripThumb
                  layout={layout}
                  isActive={layout.id === activeId}
                  onSelect={handleSelect}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ── DESKTOP LAYOUT ─────────────────────────────────────────────── */
  return (
    <div className="flex h-screen w-full overflow-hidden bg-stone-50" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      {/* LEFT SIDEBAR */}
      <aside className="flex flex-col shrink-0 bg-white border-r border-stone-200" style={{ width: 210 }}>

        {/* header */}
        <div className="px-4 pt-5 pb-4 border-b border-stone-100">
          <p className="text-[9px] font-black tracking-[0.25em] uppercase text-stone-300 mb-0.5">
            Portfolio Templates
          </p>
          <p className="text-base font-black text-black tracking-tight">Choose layout</p>
          <p className="text-[10px] text-stone-400 mt-0.5">{TEMPLATE_COUNT} templates available</p>
        </div>

        {/* thumb list */}
        <div
          ref={sideRef}
          className="flex-1 overflow-y-auto py-3 px-3 space-y-2.5"
          style={{ scrollbarWidth: "thin", scrollbarColor: "#e7e5e4 transparent" }}
        >
          {LAYOUTS.map((layout) => (
            <div key={layout.id} data-sid={layout.id}>
              {/* ✅ No data prop needed — iframe reads from localStorage */}
              <SideThumb
                layout={layout}
                isActive={layout.id === activeId}
                onSelect={handleSelect}
              />
            </div>
          ))}
        </div>

        {/* bottom CTA */}
        <div className="p-3 border-t border-stone-100 space-y-2 shrink-0">
          <div className="flex items-center gap-2 mb-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{ background: TAG_COLORS[activeLayout.tag] || "#333" }}
            />
            <span className="text-[10px] text-stone-500">
              <span className="font-bold text-black">{activeLayout.label}</span> selected
            </span>
          </div>
          <button
            onClick={openProfile}
            disabled={saving}
            className="w-full py-3 rounded-lg bg-black hover:bg-stone-800
              active:scale-[0.98] text-white text-xs font-black tracking-widest
              uppercase transition-all duration-150 disabled:opacity-60"
          >
            {saving ? "Saving…" : "Use this →"}
          </button>
        </div>
      </aside>

      {/* RIGHT PANEL */}
      <main className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* toolbar */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-white border-b border-stone-200 shrink-0">
          <div className="flex items-center gap-3">
            {/* dot indicators — capped at 15 dots max */}
            <div className="flex gap-1">
            {LAYOUTS.map((l) => (
                <button
                  key={l.id}
                  onClick={() => handleSelect(l.id)}
                  title={l.label}
                  className="transition-all duration-200 rounded-full"
                  style={{
                    width:      l.id === activeId ? 16 : 6,
                    height:     6,
                    background: l.id === activeId ? "#000" : "#e7e5e4",
                  }}
                />
              ))}
              {LAYOUTS.length > 15 && (
                <span className="text-[9px] text-stone-400 self-center ml-1">
                  +{LAYOUTS.length - 15}
                </span>
              )}
            </div>
            <span className="text-sm font-bold text-black tracking-tight">{activeLayout.label}</span>
            <span
              className="px-1.5 py-0.5 rounded text-[9px] font-bold tracking-widest uppercase"
              style={{ background: TAG_COLORS[activeLayout.tag] || "#333", color: "white" }}
            >
              {activeLayout.tag}
            </span>
            <span className="text-xs text-stone-400 font-mono">
              {String(activeId).padStart(2, "0")} / {String(TEMPLATE_COUNT).padStart(2, "0")}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const idx = LAYOUTS.findIndex((l) => l.id === activeId);
                if (idx > 0) handleSelect(LAYOUTS[idx - 1].id);
              }}
              disabled={LAYOUTS.findIndex((l) => l.id === activeId) === 0}
              className="w-8 h-8 rounded-full border border-stone-200 flex items-center justify-center
                hover:border-black hover:bg-black hover:text-white transition-all disabled:opacity-25
                disabled:cursor-not-allowed text-black"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M8 2L3 6l5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <button
              onClick={() => {
                const idx = LAYOUTS.findIndex((l) => l.id === activeId);
                if (idx < LAYOUTS.length - 1) handleSelect(LAYOUTS[idx + 1].id);
              }}
              disabled={LAYOUTS.findIndex((l) => l.id === activeId) === LAYOUTS.length - 1}
              className="w-8 h-8 rounded-full border border-stone-200 flex items-center justify-center
                hover:border-black hover:bg-black hover:text-white transition-all disabled:opacity-25
                disabled:cursor-not-allowed text-black"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M4 2l5 4-5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <div className="w-px h-5 bg-stone-200 mx-1" />

            <button
              onClick={openProfile}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-black text-white text-xs font-bold
                rounded-full hover:bg-stone-800 active:scale-95 transition-all tracking-wide uppercase
                disabled:opacity-60"
            >
              {saving ? "Saving…" : "Use this"}
              {!saving && (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6h8M7 3l3 3-3 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* preview canvas */}
        <div className="flex-1 overflow-hidden p-6">
          <div
            className="w-full h-full rounded-xl overflow-hidden shadow-sm ring-1 ring-stone-200 bg-white"
            style={{
              backgroundImage: "radial-gradient(circle, #d6d3d1 1px, transparent 1px)",
              backgroundSize: "20px 20px",
              backgroundColor: "#fafaf9",
            }}
          >
            <div className="w-full h-full rounded-xl overflow-hidden bg-white">
              <iframe
                key={`d-${activeId}-${liveKey}`}
                src={`/company-preview/${activeId}?mode=real`}
                title={`Preview ${activeId}`}
                className="w-full h-full border-none block"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}