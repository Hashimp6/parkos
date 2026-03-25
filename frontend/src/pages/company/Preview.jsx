// src/pages/company/Preview.jsx
import { useParams } from "react-router-dom";
import Company1 from "../../components/company/Layout1";
import Company2 from "../../components/company/Layout2";
import Layout3 from "../../components/company/Layout3";

const PROFILE_MAP = {
  1: Company1,
  2: Company2,
  3: Layout3,
};

export default function CmpnyPreviewPage() {
  const { layoutId, id } = useParams();
  const layoutNum = Number(layoutId ?? id);

  const Component = PROFILE_MAP[layoutNum];

  let data = {};
  try {
    const raw = localStorage.getItem("companyPreviewData");
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