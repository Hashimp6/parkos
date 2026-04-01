// components/Hero.jsx
import { useNavigate } from "react-router-dom";

export default function JobsFreelanceHero() {
  const navigate = useNavigate();

  return (
    <section className="bg-white border-b border-zinc-200 p-4 grid grid-cols-2 gap-2.5">

      {/* JOBS — dark */}
      <div
        onClick={() => navigate("/jobs")}
        className="bg-zinc-900 rounded-2xl p-[18px] relative overflow-hidden
          h-40 flex flex-col justify-between cursor-pointer
          transition-transform hover:scale-[1.012]"
      >
        <div>
          <p className="text-[9px] font-bold tracking-[.1em] text-zinc-500 uppercase mb-0.5"
            style={{ fontFamily: "'Syne', sans-serif" }}>
            Find your role
          </p>
          <h2 className="text-[20px] font-black tracking-tighter text-white leading-[1.05]"
            style={{ fontFamily: "'Syne', sans-serif" }}>
            JOBS
          </h2>
          {/* <span className="mt-1.5 inline-flex items-center gap-1 bg-zinc-800 text-zinc-400
            border border-zinc-700 text-[8.5px] font-extrabold uppercase tracking-wide
            px-2 py-0.5 rounded-full">
            🔥 1,200+ live
          </span> */}
        </div>

        <button
          className="inline-flex items-center gap-1 bg-white text-zinc-900
            text-[10px] font-black tracking-widest uppercase px-3.5 py-1.5
            rounded-full hover:opacity-85 transition-opacity w-fit"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          Explore →
        </button>

        {/* Briefcase */}
        <div className="absolute right-0 bottom-0 w-24 h-24 pointer-events-none">
          <svg viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="48" cy="91" rx="28" ry="4" fill="#000" opacity=".4"/>
            <rect x="8" y="34" width="66" height="50" rx="11" fill="#fff" opacity=".06"
              stroke="#fff" strokeWidth="1"/>
            <rect x="8" y="54" width="66" height="7" fill="#fff" opacity=".09"/>
            <path d="M24 34 C24 20 68 20 68 34" stroke="#fff" strokeWidth="5"
              strokeLinecap="round" fill="none" opacity=".18"/>
            <rect x="36" y="50" width="18" height="14" rx="4" fill="#fff"
              opacity=".1" stroke="#fff" strokeWidth=".8"/>
            <rect x="41" y="55" width="9" height="6" rx="1.5" fill="#fff" opacity=".2"/>
            <circle cx="80" cy="25" r="3" fill="#fff" opacity=".08"/>
            <circle cx="12" cy="20" r="2" fill="#fff" opacity=".06"/>
          </svg>
        </div>
      </div>

      {/* FREELANCE — light */}
      <div
        onClick={() => navigate("/freelance")}
        className="bg-zinc-100 border border-zinc-200 rounded-2xl p-[18px] relative
          overflow-hidden h-40 flex flex-col justify-between cursor-pointer
          transition-transform hover:scale-[1.012]"
      >
        <div>
          <p className="text-[9px] font-bold tracking-[.1em] text-zinc-400 uppercase mb-0.5"
            style={{ fontFamily: "'Syne', sans-serif" }}>
            Your terms
          </p>
          <h2 className="text-[20px] font-black tracking-tighter text-zinc-900 leading-[1.05]"
            style={{ fontFamily: "'Syne', sans-serif" }}>
            FREE-<br />LANCE
          </h2>
          {/* <span className="mt-1.5 inline-flex items-center gap-1 bg-white text-zinc-500
            border border-zinc-300 text-[8.5px] font-extrabold uppercase tracking-wide
            px-2 py-0.5 rounded-full">
            ✦ 800+ projects
          </span> */}
        </div>

        <button
          className="inline-flex items-center gap-1 bg-zinc-900 text-white
            text-[10px] font-black tracking-widest uppercase px-3.5 py-1.5
            rounded-full hover:opacity-85 transition-opacity w-fit"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          Explore →
        </button>

        {/* Laptop */}
        <div className="absolute right-0 bottom-0 w-24 h-24 pointer-events-none">
          <svg viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="48" cy="91" rx="30" ry="4" fill="#18181b" opacity=".1"/>
            <rect x="5" y="80" width="78" height="9" rx="4.5" fill="#18181b" opacity=".12"/>
            <rect x="13" y="22" width="63" height="60" rx="8" fill="#18181b" opacity=".06"
              stroke="#18181b" strokeWidth="1"/>
            <rect x="19" y="28" width="51" height="48" rx="5" fill="#18181b" opacity=".05"/>
            <rect x="25" y="36" width="24" height="3" rx="1.5" fill="#18181b" opacity=".13"/>
            <rect x="25" y="43" width="17" height="2.5" rx="1.2" fill="#18181b" opacity=".09"/>
            <rect x="25" y="49" width="30" height="2.5" rx="1.2" fill="#18181b" opacity=".09"/>
            <rect x="25" y="55" width="19" height="2.5" rx="1.2" fill="#18181b" opacity=".09"/>
            <circle cx="60" cy="44" r="13" fill="#18181b" opacity=".9"/>
            <text x="60" y="49.5" textAnchor="middle" fontSize="14" fontWeight="900"
              fill="#fff" fontFamily="Syne,sans-serif">$</text>
            <circle cx="82" cy="26" r="2.5" fill="#18181b" opacity=".07"/>
          </svg>
        </div>
      </div>

    </section>
  );
}