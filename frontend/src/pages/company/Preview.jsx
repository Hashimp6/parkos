// src/pages/company/Preview.jsx
import { useParams } from "react-router-dom";
import Company1 from "../../components/company/Layout1";
import Company2 from "../../components/company/Layout2";
import Layout3 from "../../components/company/Layout3";
import Company4 from "../../components/company/Layout4";
import Company5 from "../../components/company/Layout5";
import { useLocation } from "react-router-dom";
import Company6 from "../../components/company/Company6";
import Company7 from "../../components/company/Company7";
import Company8 from "../../components/company/Company8";
import Company9 from "../../components/company/Company9";

const PROFILE_MAP = {
   1: Company1,
    2: Company2,
    3: Layout3,
    4: Company4,
    5: Company5,
    6: Company6,
    7: Company7,
    8: Company8,
    9: Company9,
  
};

export default function CmpnyPreviewPage() {
  const { layoutId, id } = useParams();
  const location = useLocation();

  const layoutNum = Number(layoutId ?? id);
  const Component = PROFILE_MAP[layoutNum];

  let data = {};

  try {
    const params = new URLSearchParams(location.search);
    const mode = params.get("mode");

    const key =
      mode === "dummy"
        ? "companyPreviewDummy"
        : "companyPreviewData";

    const raw = localStorage.getItem(key);
    if (raw) data = JSON.parse(raw);
  } catch (_) {}

  if (!Component) {
    return (
      <div className="flex items-center justify-center h-screen text-stone-400 text-sm">
        Layout {layoutNum} not found
      </div>
    );
  }

  return <Component data={data || {}} />;
}