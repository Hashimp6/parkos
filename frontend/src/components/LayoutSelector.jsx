import Profile1 from "./ProfileLayout";
import Profile2 from "./ProfileLayout1";
import Profile3 from "./ProfileLayout2";
import Profile4 from "./ProfileLayout3";
import Profile5 from "./ProfileLayout4";
import Profile6 from "./ProfileLayout5";
import Profile7 from "./Profilelayout6";
import LayoutPreview from "./LayoutPreview";

const templates = {
  1: Profile1,
  2: Profile2,
  3: Profile3,
  4: Profile4,
  5: Profile5,
  6: Profile6,
  7: Profile7,
};

export default function LayoutSelector({ value, onChange, data }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 w-full">
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