import { Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

// Public Pages
import Home from "../pages/public/Home";

// Auth Pages
import Login from "../pages/public/Login";
import Register from "../pages/public/Register";
import PersonalPortfolio2 from "../components/candidate/ProfileLayout2";
import JobListings from "../pages/public/JobList";
import CandidateProfileForm from "../pages/candidate/ProfileForm";
import ProfileCard from "../pages/candidate/Profile";
import CompanyRegisterPage from "../pages/company/Register";
import CompanyLoginPage from "../pages/company/Login";
import CompanyHome from "../pages/company/CompanyHome";
import CompanyProfileForm from "../pages/company/ProfileForm";
import ProfilePages from "../pages/public/Profile";
import CandidateHomeSection from "../pages/candidate/Profile";
import Profile12 from "../components/candidate/ProfileLayout12";
import JobForm from "../pages/jobs/JobForm";
import CompanyJobsAdmin from "../pages/company/JobsDash";
import LayoutSelector from "../components/LayoutSelector";
import JobDashboard from "../pages/jobs/CandidatesList";
import Company2 from "../components/company/Layout2";
import FreelancerCategories from "../pages/freelance/FreelancersGrid";
import FreelancerList from "../pages/freelance/Listing";
import FreelancerDetail from "../pages/freelance/Detail";
import AddServiceForm from "../pages/freelance/Form";
import FreelanceDashboard from "../pages/freelance/Dashbord";
import ForgotPasswordPage from "../pages/public/ForgotPassword";
import CompanyServices from "../pages/company/CategoryGrid";
import ServiceCategories from "../pages/company/Category";
import PreviewPage from "../components/LayoutPreview";
import ForgotPasswordPageCompany from "../pages/company/ForgotPassword";
import CompanyLayoutSelector from "../pages/company/CompanyPreview";
import CmpnyPreviewPage from "../pages/company/Preview";
import CompanyProfilePage from "../pages/company/CompanyProfilePage";
import ClockScroll3D from "../pages/public/Clock";
import ApplicationsPage from "../pages/candidate/JobDash";
import Layout3 from "../components/company/Layout3";
import CompanyRoute from "../components/company/CompanyProtectRoute";
import NotFound from "../pages/public/NotFound";
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
        <Route path="/freelance" element={<FreelancerCategories/>} />
        <Route path="/profile" element={<ProfileCard/>} />
        <Route path="/clock" element={<ClockScroll3D/>} />
      </Route>

      {/* Auth */}
   
      <Route path="/company/layout-select" element={<CompanyLayoutSelector/>} />



      <Route path="/preview/:layoutId" element={<PreviewPage />} />
      <Route path="/company-preview/:id" element={<CmpnyPreviewPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage/>} />
      <Route path="/home" element={<CandidateHomeSection/>} />
      <Route path="/profile/form" element={<CandidateProfileForm />} />
      <Route path="/:profileId" element={<ProfilePages />} />
      
      
      {/* company pages  */}
      <Route path="/company/login" element={<CompanyLoginPage />} />
      <Route path="/company/register" element={<CompanyRegisterPage />} />
      <Route path="/company/forgot-password" element={<ForgotPasswordPageCompany/>} />
      <Route path="/company/Home" element={<CompanyHome/>} />
      <Route path="/company/category" element={<ServiceCategories/>} />
      <Route path="/company/form" element={<CompanyProfileForm/>} />
      <Route path="/company/:companyId" element={<CompanyProfilePage />} />


      <Route path="/companyjobs" element={<CompanyJobsAdmin />} />
      <Route path="/company/jobs/:id" element={<JobDashboard />} />

    
      <Route path="/job-dash" element={<ApplicationsPage />} />
      <Route path="/jobslist" element={<CompanyJobsAdmin />} />
      <Route path="/jobs/form" element={<JobForm/>} />
      <Route path="/layout" element={<LayoutSelector />} />
   
   {/* freelance */}
      <Route path="/freelance-list" element={<FreelancerList/>} />
      <Route path="/freelancer/:id" element={<FreelancerDetail />} />
      <Route path="/freelance-form" element={<AddServiceForm />} />
      <Route path="/freelance-dashbord" element={<FreelanceDashboard />} />
      {/* Dashboard (Protected Later) */}
      {/* <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<DashboardHome />} />
        <Route path="/dashboard/profile" element={<Profile />} />
        <Route path="/dashboard/change-password" element={<ChangePassword />} />
      </Route> */}
<Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;