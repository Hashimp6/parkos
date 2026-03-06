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
import JobListings from "../pages/public/JobList";
import CompanyWebsite from "../components/CompanyLayout1";
import CompanyWebsite1 from "../components/CompanyLayout1";
import CompanyWebsite3 from "../components/CompanyLayout2";
import CandidateProfileForm from "../pages/candidate/ProfileForm";
import ProfileCard from "../pages/candidate/Profile";

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
      <Route path="/form" element={<CandidateProfileForm />} />
      <Route path="/profile" element={<ProfileCard/>} />
      <Route path="/company" element={<CompanyWebsite3 />} />
      <Route path="/profile/form" element={<ProfileFormPage />} />
      <Route path="/profile/4" element={<PersonalPortfolio4 />} />
      <Route path="/profile/3" element={<PersonalPortfolio2 />} />
      <Route path="/jobslist" element={<JobListings />} />
     
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