import Profile1 from "./ProfileLayout";
import Profile2 from "./ProfileLayout1";
import Profile3 from "./ProfileLayout2";
import Profile4 from "./ProfileLayout3";
import Profile5 from "./ProfileLayout4";
import Profile6 from "./ProfileLayout5";
import Profile7 from "./Profilelayout6";
import Profile8 from "./ProfileLayout7";
import Profile9 from "./Profilelayout8";
import Profile10 from "./ProfileLayout9";
import LayoutPreview from "./LayoutPreview";

const templates = {
  1: Profile1,
  2: Profile2,
  3: Profile3,
  4: Profile4,
  5: Profile5,
  6: Profile6,
  7: Profile7,
  8: Profile8,
  10: Profile9,
  11: Profile10,
};

export default function LayoutSelector({ value, onChange, data }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {Object.entries(templates).map(([id, Template]) => (
        <LayoutPreview
          key={id}
          Template={Template}
          data={data}
          selected={value === Number(id)}
          onClick={() => onChange(Number(id))}
        />
      ))}
    </div>
  );
}