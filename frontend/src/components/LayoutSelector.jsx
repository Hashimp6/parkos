// src/components/LayoutSelector.jsx
// Desktop : sidebar left  + live preview right
// Mobile  : full-screen preview + horizontal film-strip at bottom

import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import axios from "axios";
import API_BASE from "../../config";

/* ── config ──────────────────────────────────────────────────────── */
const TEMPLATE_COUNT = 10;
const THUMB_W        = 1000;
const THUMB_H        = 1400;
const LABELS = {
  1:"Classic", 2:"Modern",   3:"Minimal",  4:"Aurora",  5:"Bold",
  6:"Compact", 7:"Creative", 8:"Editorial",9:"Grid",   10:"Elegant",
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

/* ── desktop sidebar thumbnail ───────────────────────────────────── */
function SideThumb({ id, isActive, onSelect }) {
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
      className={`group w-full text-left rounded-lg overflow-hidden transition-all duration-200
        focus:outline-none border
        ${isActive
          ? "border-black shadow-[0_0_0_1px_#000]"
          : "border-stone-200 hover:border-stone-400"
        }`}
    >
      {/* thumbnail */}
      <div ref={boxRef} className="relative w-full overflow-hidden bg-stone-50" style={{ height: h }}>
        <iframe
          src={`/preview/${id}`}
          title={`Layout ${id}`}
          scrolling="no"
          style={{
            width: THUMB_W, height: THUMB_H, border: "none",
            transform: `scale(${scale})`, transformOrigin: "top left",
            pointerEvents: "none", display: "block",
          }}
        />
        {/* hover dim */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/[0.04] transition-colors pointer-events-none" />
        {/* selected tick */}
        {isActive && (
          <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-black flex items-center justify-center z-10">
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
              <path d="M1 4L3.8 7L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        )}
      </div>

      {/* label */}
      <div className={`flex items-center justify-between px-2.5 py-2 border-t text-[11px] font-medium tracking-wide
        ${isActive ? "bg-black text-white border-black" : "bg-white text-stone-500 border-stone-200 group-hover:bg-stone-50"}`}
      >
        <span>{LABELS[id]}</span>
        <span className="opacity-40 tabular-nums">{String(id).padStart(2,"0")}</span>
      </div>
    </button>
  );
}

/* ── mobile film-strip thumbnail ─────────────────────────────────── */
function StripThumb({ id, isActive, onSelect }) {
  const STRIP_W = 90;
  const scale   = STRIP_W / THUMB_W;
  const h       = Math.round(THUMB_H * scale);

  return (
    <button
      onClick={() => onSelect(id)}
      className={`shrink-0 rounded-md overflow-hidden border-2 transition-all duration-150 focus:outline-none
        ${isActive ? "border-black scale-[1.04]" : "border-transparent"}`}
      style={{ width: STRIP_W }}
    >
      <div
        className="relative overflow-hidden bg-stone-100"
        style={{ width: STRIP_W, height: h }}
      >
        <iframe
          src={`/preview/${id}`}
          title={`Layout ${id}`}
          scrolling="no"
          style={{
            width: THUMB_W, height: THUMB_H, border: "none",
            transform: `scale(${scale})`, transformOrigin: "top left",
            pointerEvents: "none", display: "block",
          }}
        />
        {isActive && (
          <div className="absolute inset-0 ring-2 ring-inset ring-black rounded-md pointer-events-none" />
        )}
      </div>
      <div className={`text-center text-[9px] font-semibold tracking-widest uppercase py-1
        ${isActive ? "bg-black text-white" : "bg-white text-stone-400"}`}
      >
        {String(id).padStart(2,"0")}
      </div>
    </button>
  );
}

/* ── main ─────────────────────────────────────────────────────────── */
export default function LayoutSelector({ data: propData }) {
  const { user }   = useUser();
  const navigate   = useNavigate();
  const sideRef    = useRef(null);
  const stripRef   = useRef(null);
  const isMobile   = useIsMobile();

  const [activeId, setActiveId] = useState(1);
  const [liveKey,  setLiveKey]  = useState(0);

  useEffect(() => {
    if (user?.layoutType) setActiveId(user.layoutType);
  }, [user]);

  const pageData = user || propData || {};

  useEffect(() => {
    try {
      localStorage.setItem("portfolioPreviewData", JSON.stringify(pageData));
      setLiveKey(k => k + 1);
    } catch (_) {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(pageData)]);

  const handleSelect = (id) => {
    setActiveId(id);
    setLiveKey(k => k + 1);

    // desktop: scroll sidebar thumb into view
    sideRef.current
      ?.querySelector(`[data-sid="${id}"]`)
      ?.scrollIntoView({ block: "nearest", behavior: "smooth" });

    // mobile: scroll strip thumb into view
    stripRef.current
      ?.querySelector(`[data-mid="${id}"]`)
      ?.scrollIntoView({ inline: "center", behavior: "smooth" });
  };

  const openProfile = async () => {
    try {
      if (!user?._id) {
        alert("Please login first");
        return;
      }
  
      await axios.put(`${API_BASE}/candidate/update-layout/${user._id}`, {
        layoutType: activeId,
      });
  
      // after saving → go to profile
      navigate(`/profile/${pageData?.profileId || pageData?._id}`);
  
    } catch (error) {
      console.error("Layout update error:", error);
      alert("Failed to save layout");
    }
  };
  /* ── MOBILE LAYOUT ──────────────────────────────────────────────── */
  if (isMobile) {
    return (
      <div className="flex flex-col h-screen bg-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>

        {/* top bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-stone-200 shrink-0 bg-white">
          <div>
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-stone-400">
              Template
            </p>
            <p className="text-sm font-bold text-black leading-tight">
              {LABELS[activeId]}
              <span className="text-stone-400 font-normal ml-1.5 text-xs">
                {activeId}/{TEMPLATE_COUNT}
              </span>
            </p>
          </div>
          <button
            onClick={openProfile}
            className="flex items-center gap-1.5 px-4 py-2 bg-black text-white text-xs font-bold
              rounded-full tracking-wide active:scale-95 transition-all"
          >
            Use this
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 6h8M7 3l3 3-3 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* live preview — fills remaining space */}
        <div className="flex-1 overflow-hidden relative bg-stone-50">
          <iframe
            key={`m-${activeId}-${liveKey}`}
            src={`/preview/${activeId}`}
            title={`Preview ${activeId}`}
            className="w-full h-full border-none block"
          />

          {/* prev / next floating arrows */}
          <button
            onClick={() => handleSelect(Math.max(1, activeId - 1))}
            disabled={activeId === 1}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white
              border border-stone-200 shadow-sm flex items-center justify-center
              disabled:opacity-20 active:scale-95 transition-all z-10"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M9 2L4 7l5 5" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button
            onClick={() => handleSelect(Math.min(TEMPLATE_COUNT, activeId + 1))}
            disabled={activeId === TEMPLATE_COUNT}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white
              border border-stone-200 shadow-sm flex items-center justify-center
              disabled:opacity-20 active:scale-95 transition-all z-10"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M5 2l5 5-5 5" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* film-strip at bottom */}
        <div className="shrink-0 bg-white border-t border-stone-200">
          <div
            ref={stripRef}
            className="flex gap-2 px-3 py-3 overflow-x-auto"
            style={{ scrollbarWidth: "none" }}
          >
            {Array.from({ length: TEMPLATE_COUNT }, (_, i) => i + 1).map((id) => (
              <div key={id} data-mid={id}>
                <StripThumb id={id} isActive={id === activeId} onSelect={handleSelect} />
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
      <aside className="flex flex-col shrink-0 bg-white border-r border-stone-200" style={{ width: 196 }}>

        {/* brand / header */}
        <div className="px-4 pt-5 pb-4 border-b border-stone-100">
          <p className="text-[9px] font-black tracking-[0.25em] uppercase text-stone-300 mb-1">
            Templates
          </p>
          <p className="text-base font-black text-black tracking-tight">
            Choose layout
          </p>
        </div>

        {/* thumb list */}
        <div
          ref={sideRef}
          className="flex-1 overflow-y-auto py-3 px-3 space-y-2.5"
          style={{ scrollbarWidth: "thin", scrollbarColor: "#e7e5e4 transparent" }}
        >
          {Array.from({ length: TEMPLATE_COUNT }, (_, i) => i + 1).map((id) => (
            <div key={id} data-sid={id}>
              <SideThumb id={id} isActive={id === activeId} onSelect={handleSelect} />
            </div>
          ))}
        </div>

        {/* bottom */}
        <div className="p-3 border-t border-stone-100 space-y-2 shrink-0">
          <button
            onClick={openProfile}
            className="w-full py-3 rounded-lg bg-black hover:bg-stone-800
              active:scale-[0.98] text-white text-xs font-black tracking-widest
              uppercase transition-all duration-150"
          >
            Use this →
          </button>
        </div>
      </aside>

      {/* RIGHT PANEL */}
      <main className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* toolbar */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-white border-b border-stone-200 shrink-0">
          <div className="flex items-center gap-3">
            {/* dot indicator */}
            <div className="flex gap-1">
              {Array.from({ length: TEMPLATE_COUNT }, (_, i) => (
                <button
                  key={i}
                  onClick={() => handleSelect(i + 1)}
                  className="transition-all duration-200 rounded-full"
                  style={{
                    width:  i + 1 === activeId ? 16 : 6,
                    height: 6,
                    background: i + 1 === activeId ? "#000" : "#e7e5e4",
                  }}
                />
              ))}
            </div>
            <span className="text-sm font-bold text-black tracking-tight">
              {LABELS[activeId]}
            </span>
            <span className="text-xs text-stone-400 font-mono">
              {String(activeId).padStart(2, "0")} / {String(TEMPLATE_COUNT).padStart(2, "0")}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSelect(Math.max(1, activeId - 1))}
              disabled={activeId === 1}
              className="w-8 h-8 rounded-full border border-stone-200 flex items-center justify-center
                hover:border-black hover:bg-black hover:text-white transition-all disabled:opacity-25
                disabled:cursor-not-allowed text-black"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M8 2L3 6l5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            <button
              onClick={() => handleSelect(Math.min(TEMPLATE_COUNT, activeId + 1))}
              disabled={activeId === TEMPLATE_COUNT}
              className="w-8 h-8 rounded-full border border-stone-200 flex items-center justify-center
                hover:border-black hover:bg-black hover:text-white transition-all disabled:opacity-25
                disabled:cursor-not-allowed text-black"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M4 2l5 4-5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            <div className="w-px h-5 bg-stone-200 mx-1" />

            <button
              onClick={openProfile}
              className="flex items-center gap-2 px-4 py-2 bg-black text-white text-xs font-bold
                rounded-full hover:bg-stone-800 active:scale-95 transition-all tracking-wide uppercase"
            >
              Use this
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 6h8M7 3l3 3-3 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        {/* preview canvas */}
        <div className="flex-1 overflow-hidden p-6">
          {/* subtle grid background */}
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
                src={`/preview/${activeId}`}
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