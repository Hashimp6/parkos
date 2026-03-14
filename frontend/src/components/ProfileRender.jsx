import Profile1 from "./ProfileLayout";
import Profile2 from "./ProfileLayout1";
import Profile10 from "./ProfileLayout10";
import Profile3 from "./ProfileLayout2";
import Profile4 from "./ProfileLayout3";
import Profile5 from "./ProfileLayout4";
import Profile6 from "./Profilelayout6";
import Profile7 from "./ProfileLayout7";
import Profile8 from "./Profilelayout8";
import Profile9 from "./Profilelayout9";
// import Profile6 from "./ProfileLayout2";
// import Profile7 from "./ProfileLayout2";

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

export default function ProfileRenderer({ candidate }) {
  const Template = templates[candidate.layoutType] || Profile1;

  return <Template data={candidate} />;
}