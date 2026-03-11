import LayoutSelector from "../../components/LayoutSelector";
import BusinessCard from "../../components/ProfileVisitng";
import { useUser } from "../../context/UserContext";

export default function Home() {
  const { user, setUser } = useUser();



  const updateLayout = (layoutId) => {
    setUser({ ...user, layoutType: layoutId });
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-5">Select CV Layout</h2>
     <BusinessCard/>
    </div>
  );
}