import { Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

// Public Pages
import Home from "../pages/public/Home";

// Auth Pages
import Login from "../pages/public/Login";
import Register from "../pages/public/Register";
import PersonalPortfolio2 from "../components/ProfileLayout2";
import JobListings from "../pages/public/JobList";
import CompanyWebsite3 from "../components/CompanyLayout2";
import CandidateProfileForm from "../pages/candidate/ProfileForm";
import ProfileCard from "../pages/candidate/Profile";
import CompanyRegisterPage from "../pages/company/Register";
import CompanyLoginPage from "../pages/company/Login";
import CompanyHome from "../pages/company/CompanyHome";
import CompanyProfileForm from "../pages/company/ProfileForm";
import ProfilePages from "../pages/public/Profile";
import CandidateHomeSection from "../pages/candidate/Profile";
import Profile12 from "../components/ProfileLayout12";
import JobForm from "../pages/jobs/JobForm";
import CompanyJobsAdmin from "../pages/company/JobsDash";
import LayoutSelector from "../components/LayoutSelector";

import JobDashboard from "../pages/jobs/CandidatesList";

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
        <Route path="/jobs" element={<JobListings />} />
        <Route path="/jobs/form" element={<JobForm/>} />
      </Route>

      {/* Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/home" element={<CandidateHomeSection/>} />
      <Route path="/company/login" element={<CompanyLoginPage />} />
      <Route path="/company/register" element={<CompanyRegisterPage />} />
      <Route path="/company/Home" element={<CompanyHome/>} />
      <Route path="/company/form" element={<CompanyProfileForm/>} />
      <Route path="/profile/form" element={<CandidateProfileForm />} />
      <Route path="/profile/:profileId" element={<ProfilePages />} />
      <Route path="/profile" element={<ProfileCard/>} />
      <Route path="/company" element={<CompanyWebsite3 />} />
      <Route path="/profile/5" element={<Profile12 />} />
      <Route path="/profile/3" element={<PersonalPortfolio2 />} />
      <Route path="/profile/6" element={<Profile12 />} />
      <Route path="/jobslist" element={<CompanyJobsAdmin />} />
      <Route path="/company/jobs/:id" element={<JobDashboard />} />
      <Route path="/companyjobs" element={<CompanyJobsAdmin />} />
      <Route path="/layout" element={<LayoutSelector />} />
     
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