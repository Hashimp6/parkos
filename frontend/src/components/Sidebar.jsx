import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div className="w-64 bg-white shadow p-5">
      <h2 className="font-bold mb-4">Dashboard</h2>
      <div className="space-y-3">
        <Link to="/dashboard">Overview</Link>
        <Link to="/dashboard/profile">Profile</Link>
        <Link to="/dashboard/change-password">Change Password</Link>
      </div>
    </div>
  );
}

export default Sidebar;