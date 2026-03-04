import { Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import DashboardLayout from "../layouts/DashboardLayout";

// Public Pages
import Home from "../pages/public/Home";
import Jobs from "../pages/public/Jobs";
import JobDetails from "../pages/public/JobDetails";

// Auth Pages
import Login from "../pages/public/Login";
import Register from "../pages/public/Register";
import ProfileFormPage from "../pages/candidate/ProfileDetails";
import PersonalPortfolio from "../components/ProfileLayout1";
import PersonalPortfolio2 from "../components/ProfileLayout2";
import PersonalPortfolio3 from "../components/ProfileLayout3";
import PersonalPortfolio4 from "../components/ProfileLayout4";
import ProfilePage from "../components/ProfileLayout";

// Dashboard Pages
// import DashboardHome from "../pages/dashboard/DashboardHome";
// import Profile from "../pages/dashboard/Profile";
// import ChangePassword from "../pages/dashboard/ChangePassword";

function AppRoutes() {
  return (
    <Routes>

      {/* Public Website */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetails />} />
      </Route>

      {/* Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/profile/name" element={<ProfilePage />} />
      <Route path="/profile/form" element={<ProfileFormPage />} />
      <Route path="/profile/4" element={<PersonalPortfolio4 />} />
      <Route path="/profile/2" element={<PersonalPortfolio2 />} />
      {/* Dashboard (Protected Later) */}
      {/* <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<DashboardHome />} />
        <Route path="/dashboard/profile" element={<Profile />} />
        <Route path="/dashboard/change-password" element={<ChangePassword />} />
      </Route> */}

    </Routes>
  );
}

export default AppRoutes;