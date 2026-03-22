import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import LayoutPreview from "./LayoutPreview";
import { useUser } from "../context/UserContext";

const templates = {
  1: Profile1,
  2: Profile2,
  3: Profile3,
  4: Profile4,
  5: Profile5,
  6: Profile6,
  7: Profile7,
  8: Profile8,
  9: Profile9,
  10: Profile10,
};

export default function LayoutSelector({ data }) {
  const { user } = useUser();
  const navigate = useNavigate();

  const [selectedLayout, setSelectedLayout] = useState(1);

  useEffect(() => {
    if (user?.layoutType) {
      setSelectedLayout(user.layoutType);
    }
  }, [user]);

  const datas = user || data || {};

  const handleView = (e, profileId) => {
    e.stopPropagation(); // prevent triggering card select
    navigate(`/profile/${profileId}`);
  };

  return (
    <div className="w-full px-2 sm:px-4 py-3">

      {/* Title */}
      <div className="mb-4">
        <h2 className="text-sm font-bold text-zinc-800">Choose Layout</h2>
        <p className="text-xs text-zinc-400">
          Pick a template for your profile
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
        {Object.entries(templates).map(([id, Template]) => {
          const layoutId = Number(id);
          const isSelected = selectedLayout === layoutId;

          return (
            <div
              key={id}
              onClick={() => setSelectedLayout(layoutId)}
              className={`relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300
                ${
                  isSelected
                    ? "ring-4 ring-blue-500 bg-blue-50 scale-[1.03] shadow-lg"
                    : "hover:scale-[1.02] hover:shadow-md"
                }
              `}
            >
              <LayoutPreview
                Template={Template}
                data={datas}
                selected={isSelected}
              />

              {/* Hover overlay with View button */}
              <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-all duration-200 flex items-end justify-center pb-3 opacity-0 hover:opacity-100">
                <button
                  onClick={(e) => handleView(e, datas?.profileId || datas?._id || id)}
                  className="bg-white text-zinc-800 text-xs font-semibold px-4 py-1.5 rounded-full shadow-md hover:bg-zinc-100 transition"
                >
                  👁 View
                </button>
              </div>

              {/* Always-visible View button at bottom (non-hover fallback for mobile) */}
              <div className="flex items-center justify-between px-3 py-2 bg-white border-t border-zinc-100">
                <span className="text-[11px] text-zinc-500 font-medium">
                  Layout {id}
                </span>
                <button
                  onClick={(e) => handleView(e, datas?.profileId || datas?._id || id)}
                  className="text-[11px] text-blue-500 font-semibold hover:underline"
                >
                  View →
                </button>
              </div>

              {/* Selected Badge */}
              {isSelected && (
                <div className="absolute top-2 right-2 bg-white text-blue-600 text-[10px] px-2 py-1 rounded-full font-semibold shadow">
                  ✓ Selected
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}