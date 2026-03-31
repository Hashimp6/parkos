import Profile1 from "./candidate/ProfileLayout";
import Profile2  from "./candidate/Layout1";
import Profile3 from "./candidate/ProfileLayout2";
import Profile4 from "./candidate/ProfileLayout3";
import Profile5 from "./candidate/ProfileLayout4";
import Profile6 from "./candidate/Profilelayout6";
import Profile7 from "./candidate/ProfileLayout7";
import Profile8 from "./candidate/ProfileLayout8";
import Profile9 from "./candidate/ProfileLayout9";
import Profile10 from "./candidate/ProfileLayout10";
import Profile11 from "./candidate/Layout2";
import Profile12 from "./candidate/Layout3";
import Profile13 from "./candidate/Layout4";

const templates = {
   1:  Profile1,
   2:   Profile12,
   3:  Profile10,
   4:  Profile13,
   5:  Profile11,
   6:  Profile5,
   7:  Profile7,
   8:  Profile3,
   9:  Profile9,
   10: Profile2,
  
};

export default function ProfileRenderer({ candidate }) {
  const Template = templates[candidate.layoutType] || Profile1;

  return <Template data={candidate} />;
}