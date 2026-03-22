// LayoutSelector.jsx
// Left panel  → scaled-down iframe thumbnails (pointerEvents: none)
// Right panel → full-size live iframe preview

import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

const TEMPLATE_COUNT  = 10;
const THUMB_RENDER_W  = 1000; // the "natural" width your layouts expect
const THUMB_RENDER_H  = 1400;

const LABELS = {
  1: "Classic",  2: "Modern",   3: "Minimal",  4: "Aurora",
  5: "Bold",     6: "Compact",  7: "Creative", 8: "Editorial",
  9: "Grid",    10: "Elegant",
};

/* ─── single thumbnail card ─────────────────────────────────────── */
function ThumbCard({ id, isActive, onSelect, previewBase }) {
  const boxRef = useRef(null);
  const [scale, setScale] = useState(0.18);

  useLayoutEffect(() => {
    if (!boxRef.current) return;
    const ro = new ResizeObserver(([e]) => {
      setScale(e.contentRect.width / THUMB_RENDER_W);
    });
    ro.observe(boxRef.current);
    return () => ro.disconnect();
  }, []);

  const thumbH = Math.round(THUMB_RENDER_H * scale);

  return (
    <button
      onClick={() => onSelect(id)}
      className={`group w-full text-left rounded-xl overflow-hidden border-2 transition-all duration-200
        focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400
        ${isActive
          ? "border-blue-500 shadow-lg shadow-blue-100 scale-[1.02]"
          : "border-zinc-200 hover:border-zinc-400 hover:scale-[1.01]"
        }`}
    >
      {/* thumbnail viewport — sized exactly to scaled iframe height */}
      <div
        ref={boxRef}
        className="relative w-full overflow-hidden bg-zinc-50"
        style={{ height: thumbH || 190 }}
      >
        <iframe
          src={`${previewBase}/${id}`}
          title={`Layout ${id}`}
          scrolling="no"
          style={{
            width:           THUMB_RENDER_W,
            height:          THUMB_RENDER_H,
            border:          "none",
            transform:       `scale(${scale})`,
            transformOrigin: "top left",
            pointerEvents:   "none",   // ← block all interaction in thumbnail
            display:         "block",
          }}
        />

        {/* active ring overlay */}
        {isActive && (
          <div className="absolute inset-0 ring-[3px] ring-inset ring-blue-500 rounded-xl pointer-events-none z-10" />
        )}
      </div>

      {/* label row */}
      <div className={`flex items-center justify-between px-3 py-2 border-t transition-colors
        ${isActive
          ? "bg-blue-50 border-blue-100"
          : "bg-white border-zinc-100 group-hover:bg-zinc-50"
        }`}
      >
        <span className={`text-[11px] font-semibold truncate
          ${isActive ? "text-blue-600" : "text-zinc-500"}`}
        >
          {LABELS[id] || `Layout ${id}`}
        </span>
        {isActive && (
          <span className="text-[9px] font-bold tracking-widest uppercase text-blue-400">
            ✓ on
          </span>
        )}
      </div>
    </button>
  );
}

/* ─── main component ─────────────────────────────────────────────── */
export default function LayoutSelector({ data: propData }) {
  const { user }   = useUser();
  const navigate   = useNavigate();
  const sidebarRef = useRef(null);
  const dataVer    = useRef(0); // bumped when data changes → forces iframe remount

  const [activeId, setActiveId] = useState(1);

  // sync with saved layout preference
  useEffect(() => {
    if (user?.layoutType) setActiveId(user.layoutType);
  }, [user]);

  // write user data to localStorage so PreviewPage can read it
  const pageData = user || propData || {};
  useEffect(() => {
    try {
      localStorage.setItem("portfolioPreviewData", JSON.stringify(pageData));
      dataVer.current += 1;
    } catch (_) {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(pageData)]);

  // The route that renders PreviewPage (add to your router — see below)
  const PREVIEW_BASE = "/preview";

  const handleSelect = (id) => {
    setActiveId(id);
    // keep active thumbnail scrolled into view in sidebar
    const el = sidebarRef.current?.querySelector(`[data-tid="${id}"]`);
    el?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  };

  const handleOpen = () => {
    const profileId = pageData?.profileId || pageData?._id || activeId;
    navigate(`/${profileId}`);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-zinc-100 font-sans">

      {/* ── LEFT SIDEBAR ─────────────────────────────────────────── */}
      <aside
        className="flex flex-col shrink-0 border-r border-zinc-200 bg-white"
        style={{ width: 200 }}
      >
        {/* header */}
        <div className="px-4 pt-4 pb-3 border-b border-zinc-100 shrink-0">
          <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-zinc-400 mb-0.5">
            Templates
          </p>
          <p className="text-sm font-bold text-zinc-800">
            {TEMPLATE_COUNT} layouts
          </p>
        </div>

        {/* scrollable thumbnail list */}
        <div
          ref={sidebarRef}
          className="flex-1 overflow-y-auto py-3 px-2.5 space-y-3"
          style={{ scrollbarWidth: "thin", scrollbarColor: "#d4d4d8 transparent" }}
        >
          {Array.from({ length: TEMPLATE_COUNT }, (_, i) => i + 1).map((id) => (
            <div key={id} data-tid={id}>
              <ThumbCard
                id={id}
                isActive={id === activeId}
                onSelect={handleSelect}
                previewBase={PREVIEW_BASE}
              />
            </div>
          ))}
        </div>

        {/* bottom CTA */}
        <div className="p-3 border-t border-zinc-100 shrink-0">
          <button
            onClick={handleOpen}
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700
              active:scale-95 text-white text-xs font-bold tracking-wide
              transition-all duration-150 shadow-sm"
          >
            Open Profile →
          </button>
        </div>
      </aside>

      {/* ── RIGHT PREVIEW PANEL ──────────────────────────────────── */}
      <main className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* toolbar */}
        <div className="flex items-center justify-between px-5 py-3 bg-white border-b border-zinc-200 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
            <span className="text-sm font-semibold text-zinc-700">
              {LABELS[activeId] || `Layout ${activeId}`}
            </span>
            <span className="text-xs text-zinc-400 font-mono">#{activeId}</span>
          </div>

          <div className="flex items-center gap-1">
            {/* prev */}
            <button
              onClick={() => handleSelect(Math.max(1, activeId - 1))}
              disabled={activeId === 1}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100
                disabled:opacity-25 disabled:cursor-not-allowed text-sm transition-all"
            >←</button>

            <span className="text-xs font-mono text-zinc-400 w-14 text-center tabular-nums">
              {activeId} / {TEMPLATE_COUNT}
            </span>

            {/* next */}
            <button
              onClick={() => handleSelect(Math.min(TEMPLATE_COUNT, activeId + 1))}
              disabled={activeId === TEMPLATE_COUNT}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100
                disabled:opacity-25 disabled:cursor-not-allowed text-sm transition-all"
            >→</button>

            <div className="w-px h-5 bg-zinc-200 mx-1.5" />

            <button
              onClick={handleOpen}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600
                hover:bg-blue-700 text-white text-xs font-semibold transition-all shadow-sm"
            >
              Open full view ↗
            </button>
          </div>
        </div>

        {/* live preview — full iframe, scrollable, isolated */}
        <div className="flex-1 overflow-hidden relative p-5">
          <div className="w-full h-full rounded-2xl overflow-hidden shadow-md ring-1 ring-zinc-200 bg-white">
            <iframe
              key={`live-${activeId}-${dataVer.current}`}
              src={`${PREVIEW_BASE}/${activeId}`}
              title={`Preview layout ${activeId}`}
              className="w-full h-full border-none block"
              style={{ minHeight: 0 }}
            />
          </div>
        </div>
      </main>
    </div>
  );
}