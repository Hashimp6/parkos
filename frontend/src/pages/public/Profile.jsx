import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import ProfileRenderer from "../../components/ProfileRender";

export default function ProfilePages() {
  const { profileId } = useParams();
  const [candidate, setCandidate] = useState(null);

  useEffect(() => {
    const fetchCandidate = async () => {
      try {
        const res = await axios.get(
          "http://192.168.1.27:5006/api/candidate/search/by-username",
          {
            params: { profileId }
          }
        );
console.log("cand",res.data.data);

        setCandidate(res.data.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    if (profileId) {
      fetchCandidate();
    }
  }, [profileId]);

  if (!candidate) return <div>Loading profile...</div>;

  return <ProfileRenderer candidate={candidate} />;
}