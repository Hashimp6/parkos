// src/components/Toast.jsx
import { useEffect, useState } from "react";

export default function Toast({ message, type = "success", onClose }) {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    // Enter
    requestAnimationFrame(() => setVisible(true));

    // Auto dismiss after 3.5s
    const timer = setTimeout(() => dismiss(), 3500);
    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    setLeaving(true);
    setTimeout(() => onClose(), 400);
  };

  const isSuccess = type === "success";

  return (
    <div
      onClick={dismiss}
      style={{
        position: "fixed",
        top: 24,          // 👈 top
        right: 24,        // 👈 right side
        left: "auto",     // 👈 cancel left centering
        transform: visible && !leaving
          ? "translateY(0) scale(1)"
          : leaving
            ? "translateY(-12px) scale(0.96)"
            : "translateY(-16px) scale(0.94)",
        opacity: visible && !leaving ? 1 : 0,
        transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
        zIndex: 9999,
        cursor: "pointer",
        userSelect: "none",
      }}
    >
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "13px 18px",
        borderRadius: 16,
        background: isSuccess ? "#0a0a0a" : "#fff",
        border: isSuccess ? "1px solid #222" : "1px solid #e5e5e5",
        boxShadow: isSuccess
          ? "0 8px 32px rgba(0,0,0,0.28), 0 2px 8px rgba(0,0,0,0.12)"
          : "0 8px 32px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06)",
        minWidth: 260,
        maxWidth: 380,
        fontFamily: "'Outfit', system-ui, sans-serif",
      }}>
        {/* Icon */}
        <div style={{
          width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
          background: isSuccess ? "rgba(255,255,255,0.1)" : "#f5f5f5",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {isSuccess ? (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          ) : (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#e03333" strokeWidth="2.5" strokeLinecap="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          )}
        </div>

        {/* Text */}
        <div style={{ flex: 1 }}>
          <p style={{
            fontSize: 13, fontWeight: 600, margin: 0, lineHeight: 1.3,
            color: isSuccess ? "#fff" : "#0a0a0a",
          }}>
            {isSuccess ? "Success" : "Something went wrong"}
          </p>
          <p style={{
            fontSize: 11.5, margin: "2px 0 0", lineHeight: 1.4,
            color: isSuccess ? "rgba(255,255,255,0.55)" : "#999",
          }}>
            {message}
          </p>
        </div>

        {/* Close */}
        <button onClick={(e) => { e.stopPropagation(); dismiss(); }} style={{
          background: "none", border: "none", cursor: "pointer", padding: 4,
          color: isSuccess ? "rgba(255,255,255,0.35)" : "#ccc",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0, borderRadius: 6,
          transition: "color 0.15s",
        }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      {/* Progress bar */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        height: 2, borderRadius: "0 0 16px 16px",
        background: isSuccess ? "rgba(255,255,255,0.12)" : "#f0f0f0",
        overflow: "hidden",
      }}>
        <div style={{
          height: "100%", borderRadius: "0 0 16px 16px",
          background: isSuccess ? "rgba(255,255,255,0.4)" : "#0a0a0a",
          animation: "toastBar 3.5s linear forwards",
        }}/>
      </div>

      <style>{`
        @keyframes toastBar {
          from { width: 100%; }
          to   { width: 0%; }
        }
      `}</style>
    </div>
  );
}