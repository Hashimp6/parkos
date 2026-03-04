import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

function MainLayout() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen p-6">
        <Outlet />
      </div>
    </>
  );
}

export default MainLayout;