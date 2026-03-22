import { useRef, useState, useLayoutEffect } from "react";

export default function LayoutPreview({ Template, data, selected, onClick }) {
  const containerRef = useRef(null);
  const [scale, setScale] = useState(0.22);

  const TEMPLATE_W = 1000;
  const TEMPLATE_H = 1400;

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const { width } = containerRef.current.getBoundingClientRect();
    setScale(width / TEMPLATE_W);
  }, []);

  return (
    <div
      onClick={onClick}
      className={`group relative cursor-pointer overflow-hidden rounded-2xl bg-white transition-all duration-300 ease-out
        ${selected
          ? "ring-4 ring-blue-500 shadow-2xl scale-[1.03]"
          : "border border-gray-200 shadow-sm hover:shadow-xl hover:scale-[1.03] hover:border-gray-300"
        }`}
    >
      <div
        ref={containerRef}
        className="w-full overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100"
        style={{ height: "300px" }}
      >
        <div
          style={{
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            width: `${TEMPLATE_W}px`,
            height: `${TEMPLATE_H}px`,
            pointerEvents: "none",
          }}
        >
          <Template data={data} />
        </div>
      </div>

      {/* badges / overlays unchanged */}
    </div>
  );
}