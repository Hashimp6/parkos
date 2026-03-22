import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

import Profile1 from "./candidate/ProfileLayout";
import Profile2 from "./candidate/ProfileLayout1";
import Profile3 from "./candidate/ProfileLayout2";
import Profile4 from "./candidate/ProfileLayout3";
import Profile5 from "./candidate/ProfileLayout4";
import Profile6 from "./candidate/ProfileLayout10";
import Profile7 from "./candidate/Profilelayout6";
import Profile8 from "./candidate/ProfileLayout7";
import Profile9 from "./candidate/ProfileLayout8";
import Profile10 from "./candidate/ProfileLayout9";

/* ─── template registry ─────────────────────────────────────────── */
const TEMPLATES = [
  { id: 1, label: "Layout 1", component: Profile1 },
  { id: 2, label: "Layout 2", component: Profile2 },
  { id: 3, label: "Layout 3", component: Profile3 },
  { id: 4, label: "Layout 4", component: Profile4 },
  { id: 5, label: "Layout 5", component: Profile5 },
  { id: 6, label: "Layout 6", component: Profile6 },
  { id: 7, label: "Layout 7", component: Profile7 },
  { id: 8, label: "Layout 8", component: Profile8 },
  { id: 9, label: "Layout 9", component: Profile9 },
  { id: 10, label: "Layout 10", component: Profile10 },
];

const THUMB_W = 1000;
const THUMB_H = 1400;
const PREVIEW_W = 1440;

/* ─── scaled thumbnail ───────────────────────────────────────────── */
function Thumbnail({ Component, data, isActive }) {
  const boxRef = useRef(null);
  const [scale, setScale] = useState(0.18);

  useLayoutEffect(() => {
    if (!boxRef.current) return;
    const { width } = boxRef.current.getBoundingClientRect();
    setScale(width / THUMB_W);
  }, []);

  return (
    <div
      ref={boxRef}
      className="relative w-full overflow-hidden rounded-xl"
      style={{ aspectRatio: "5/7", background: "#f4f4f5" }}
    >
      {/* blocker so template events don't fire */}
      <div className="absolute inset-0 z-10" />

      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          width: THUMB_W,
          height: THUMB_H,
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        <Component data={data} />
      </div>

      {isActive && (
        <div className="absolute inset-0 z-20 ring-[3px] ring-inset ring-blue-500 rounded-xl pointer-events-none" />
      )}
    </div>
  );
}

/* ─── full-size right-panel preview ─────────────────────────────── */
function LivePreview({ Component, data }) {
  const wrapRef = useRef(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    if (!wrapRef.current) return;
    const ro = new ResizeObserver(([e]) => {
      setScale(e.contentRect.width / PREVIEW_W);
    });
    ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={wrapRef} className="w-full overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm" style={{ minHeight: 520 }}>
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          width: PREVIEW_W,
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        <Component data={data} />
      </div>
    </div>
  );
}

/* ─── main ───────────────────────────────────────────────────────── */
export default function LayoutSelector({ data: propData }) {
  const { user } = useUser();
  const navigate = useNavigate();
  const sidebarRef = useRef(null);

  const [activeId, setActiveId] = useState(1);

  useEffect(() => {
    if (user?.layoutType) setActiveId(user.layoutType);
  }, [user]);

  const pageData = user || propData || {};
  const active = TEMPLATES.find((t) => t.id === activeId);

  /* scroll active thumbnail into view when changed via keyboard / arrows */
  const handleSelect = (id) => {
    setActiveId(id);
    const el = sidebarRef.current?.querySelector(`[data-id="${id}"]`);
    el?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  };

  const handleView = () => {
    const profileId = pageData?.profileId || pageData?._id || activeId;
    navigate(`/${profileId}`);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-zinc-50">

      {/* ── LEFT SIDEBAR ───────────────────────────────────────────── */}
      <aside className="flex flex-col w-52 shrink-0 border-r border-zinc-200 bg-white">

        {/* header */}
        <div className="px-4 pt-4 pb-3 border-b border-zinc-100">
          <p className="text-[10px] font-semibold tracking-widest uppercase text-zinc-400 mb-0.5">Templates</p>
          <p className="text-sm font-bold text-zinc-800">{TEMPLATES.length} layouts</p>
        </div>

        {/* scrollable thumbnail list */}
        <div
          ref={sidebarRef}
          className="flex-1 overflow-y-auto py-3 px-3 space-y-3"
          style={{ scrollbarWidth: "thin" }}
        >
          {TEMPLATES.map(({ id, label, component: Comp }) => {
            const isActive = id === activeId;
            return (
              <button
                key={id}
                data-id={id}
                onClick={() => handleSelect(id)}
                className={`group w-full text-left rounded-xl overflow-hidden border transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
                  ${isActive
                    ? "border-blue-500 shadow-md shadow-blue-100 scale-[1.02]"
                    : "border-zinc-200 hover:border-zinc-400 hover:scale-[1.01]"
                  }`}
              >
                <Thumbnail Component={Comp} data={pageData} isActive={isActive} />

                {/* label strip */}
                <div className={`flex items-center justify-between px-2.5 py-2 border-t
                  ${isActive ? "bg-blue-50 border-blue-100" : "bg-white border-zinc-100 group-hover:bg-zinc-50"}`}
                >
                  <span className={`text-[11px] font-semibold ${isActive ? "text-blue-600" : "text-zinc-500"}`}>
                    {label}
                  </span>
                  {isActive && (
                    <span className="text-[9px] font-bold tracking-wider text-blue-500 uppercase">✓ on</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* bottom action */}
        <div className="p-3 border-t border-zinc-100 space-y-2">
          <button
            onClick={handleView}
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold tracking-wide transition-all shadow-sm"
          >
            View Profile →
          </button>
        </div>
      </aside>

      {/* ── RIGHT DETAIL PREVIEW ────────────────────────────────────── */}
      <main className="flex-1 flex flex-col overflow-hidden">

        {/* toolbar */}
        <div className="flex items-center justify-between px-6 py-3 bg-white border-b border-zinc-200 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="text-sm font-semibold text-zinc-700">{active?.label}</span>
            <span className="text-xs text-zinc-400 font-mono">#{activeId}</span>
          </div>

          <div className="flex items-center gap-1">
            {/* prev / next */}
            <button
              onClick={() => {
                const idx = TEMPLATES.findIndex((t) => t.id === activeId);
                if (idx > 0) handleSelect(TEMPLATES[idx - 1].id);
              }}
              disabled={activeId === TEMPLATES[0].id}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm"
            >←</button>

            <span className="text-xs font-mono text-zinc-400 w-14 text-center">
              {TEMPLATES.findIndex((t) => t.id === activeId) + 1} / {TEMPLATES.length}
            </span>

            <button
              onClick={() => {
                const idx = TEMPLATES.findIndex((t) => t.id === activeId);
                if (idx < TEMPLATES.length - 1) handleSelect(TEMPLATES[idx + 1].id);
              }}
              disabled={activeId === TEMPLATES[TEMPLATES.length - 1].id}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm"
            >→</button>

            <div className="w-px h-5 bg-zinc-200 mx-1" />

            <button
              onClick={handleView}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-all shadow-sm"
            >
              <span>Open full view</span>
              <span className="text-[10px]">↗</span>
            </button>
          </div>
        </div>

        {/* scrollable preview canvas */}
        <div className="flex-1 overflow-y-auto p-6" style={{ background: "#f4f4f5" }}>
          {active && <LivePreview Component={active.component} data={pageData} />}
        </div>
      </main>
    </div>
  );
}