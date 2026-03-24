// src/components/PreviewPage.jsx
// ⚠️  Must have NO MainLayout, NO navbar — raw component only.
// Each layout's CSS is isolated inside this iframe document.

import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import Profile1  from "./candidate/ProfileLayout";
import Profile2  from "./candidate/ProfileLayout1";
import Profile3  from "./candidate/ProfileLayout2";
import Profile4  from "./candidate/ProfileLayout3";
import Profile5  from "./candidate/ProfileLayout4";
import Profile6  from "./candidate/ProfileLayout10";
import Profile7  from "./candidate/Profilelayout6";
import Profile8  from "./candidate/ProfileLayout7";
import Profile9  from "./candidate/ProfileLayout8";
import Profile10 from "./candidate/ProfileLayout9";

const TEMPLATES = {
  1:  Profile1,
  2:  Profile2,
  3:  Profile3,
  4:  Profile4,
  5:  Profile5,
  6:  Profile6,
  7:  Profile7,
  8:  Profile8,
  9:  Profile9,
  10: Profile10,
};

export default function PreviewPage() {
  const { layoutId } = useParams();
  const [data, setData] = useState({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem("portfolioPreviewData");
      if (raw) setData(JSON.parse(raw));
    } catch (_) {}
  }, []);

  const Template = TEMPLATES[Number(layoutId)];

  if (!Template) {
    return (
      <div style={{ padding: 40, fontFamily: "sans-serif", color: "#888" }}>
        Layout "{layoutId}" not found.
      </div>
    );
  }

  return <Template data={data} />;
}