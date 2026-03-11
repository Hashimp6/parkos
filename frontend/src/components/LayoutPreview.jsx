export default function LayoutPreview({ Template, data, selected, onClick }) {
    return (
      <div
        onClick={onClick}
        className={`group relative cursor-pointer overflow-hidden rounded-2xl bg-white transition-all duration-300 ease-out
          ${
            selected
              ? "ring-4 ring-blue-500 shadow-2xl scale-[1.03]"
              : "border border-gray-200 shadow-sm hover:shadow-xl hover:scale-[1.03] hover:border-gray-300"
          }`}
      >
        {/* Preview container */}
        <div className="w-full aspect-[3/4] overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
          <div
            style={{
              transform: "scale(0.22)",
              transformOrigin: "top left",
              width: "1000px",
              height: "1400px",
              pointerEvents: "none",
            }}
          >
            <Template data={data} />
          </div>
        </div>
  
        {/* Hover overlay shimmer */}
        {!selected && (
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-black/5 to-transparent pointer-events-none rounded-2xl" />
        )}
  
        {/* Selected badge */}
        {selected && (
          <div className="absolute top-2 right-2 flex items-center gap-1 bg-blue-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-md">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
            </svg>
            Selected
          </div>
        )}
  
        {/* Bottom label slot (optional) */}
        <div className="absolute bottom-0 inset-x-0 h-8 bg-gradient-to-t from-white/80 to-transparent pointer-events-none" />
      </div>
    );
  }
  
  // Usage — wrap your grid like this:
  export function LayoutGrid({ templates, data, selectedId, onSelect }) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 p-4">
        {templates.map((Template, i) => (
          <LayoutPreview
            key={i}
            Template={Template}
            data={data}
            selected={selectedId === i}
            onClick={() => onSelect(i)}
          />
        ))}
      </div>
    );
  }