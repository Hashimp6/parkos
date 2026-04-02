import { Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import { CandidateRoute, CompanyRoute, GuestCompanyRoute, GuestRoute } from "../components/candidate/ProtectedUserRoute"; // adjust path

// Public Pages
import Home from "../pages/public/Home";
import Login from "../pages/public/Login";
import Register from "../pages/public/Register";
import JobListings from "../pages/public/JobList";
import ProfilePages from "../pages/public/Profile";
import ClockScroll3D from "../pages/public/Clock";
import ForgotPasswordPage from "../pages/public/ForgotPassword";
import NotFound from "../pages/public/NotFound";
import PreviewPage from "../components/LayoutPreview";

// Candidate Pages
import CandidateProfileForm from "../pages/candidate/ProfileForm";
import ProfileCard from "../pages/candidate/Profile";
import CandidateHomeSection from "../pages/candidate/Profile";
import ApplicationsPage from "../pages/candidate/JobDash";
import LayoutSelector from "../components/LayoutSelector";

// Company Pages
import CompanyRegisterPage from "../pages/company/Register";
import CompanyLoginPage from "../pages/company/Login";
import CompanyHome from "../pages/company/CompanyHome";
import CompanyProfileForm from "../pages/company/ProfileForm";
import CompanyJobsAdmin from "../pages/company/JobsDash";
import CompanyServices from "../pages/company/CategoryGrid";
import ServiceCategories from "../pages/company/Category";
import ForgotPasswordPageCompany from "../pages/company/ForgotPassword";
import CompanyLayoutSelector from "../pages/company/CompanyPreview";
import CmpnyPreviewPage from "../pages/company/Preview";
import CompanyProfilePage from "../pages/company/CompanyProfilePage";

// Jobs
import JobForm from "../pages/jobs/JobForm";
import JobDashboard from "../pages/jobs/CandidatesList";

// Freelance
import FreelancerCategories from "../pages/freelance/FreelancersGrid";
import FreelancerList from "../pages/freelance/Listing";
import FreelancerDetail from "../pages/freelance/Detail";
import AddServiceForm from "../pages/freelance/Form";
import FreelanceDashboard from "../pages/freelance/Dashbord";

// Layout components
import Company4 from "../components/company/Layout4";
import Company6 from "../components/company/Company6";
import Company7 from "../components/company/Company7";
import Portfolio1 from "../components/candidate/Layout1";
import Portfolio2 from "../components/candidate/Layout2";
import Portfolio3 from "../components/candidate/Layout3";
import Portfolio4 from "../components/candidate/Layout4";
import Company8 from "../components/company/Company8";
import Company5 from "../components/company/Layout5";
import Layout3 from "../components/company/Layout3";
import Company2 from "../components/company/Layout2";
import Company1 from "../components/company/Layout1";
import Company9 from "../components/company/Company9";

function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>

        {/* ── Fully public ─────────────────────────────────────────────────── */}
        <Route path="/"                    element={<Home />} />
        <Route path="/jobs"                element={<JobListings />} />
        <Route path="/freelance"           element={<FreelancerCategories />} />
        <Route path="/company/category-grid"             element={<CompanyServices />} />
        <Route path="/clock"                    element={<ClockScroll3D/>} />
        </Route>


        <Route path="/freelance-list"      element={<FreelancerList />} />
        <Route path="/freelancer/:id"      element={<FreelancerDetail />} />
        <Route path="/profile/:profileId"  element={<ProfilePages />} />
        <Route path="/company/id/:companyId" element={<CompanyProfilePage />} />
        <Route path="/preview/:layoutId"   element={<PreviewPage />} />
        <Route path="/company-preview/:id" element={<CmpnyPreviewPage />} />
        <Route path="/profile12"           element={<Company9/>} />

        {/* ── Guest-only (redirect if already logged in) ───────────────────── */}
        <Route element={<GuestRoute />}>
          <Route path="/login"                      element={<Login />} />
          <Route path="/register"                   element={<Register />} />
          <Route path="/forgot-password"            element={<ForgotPasswordPage />} />
       </Route>

        <Route element={<GuestCompanyRoute />}>
          <Route path="/company/login"              element={<CompanyLoginPage />} />
          <Route path="/company/register"           element={<CompanyRegisterPage />} />
          <Route path="/company/forgot-password"    element={<ForgotPasswordPageCompany />} />
        </Route>

        {/* ── Candidate-only ───────────────────────────────────────────────── */}
        <Route element={<CandidateRoute />}>
          <Route path="/home"              element={<CandidateHomeSection />} />
          <Route path="/profile"           element={<ProfileCard />} />
          <Route path="/profile/set/form"  element={<CandidateProfileForm />} />
          <Route path="/layout"            element={<LayoutSelector />} />
          <Route path="/job-dash"          element={<ApplicationsPage />} />
          <Route path="/freelance-form"    element={<AddServiceForm />} />
          <Route path="/freelance-dashbord" element={<FreelanceDashboard />} />
        </Route>

        {/* ── Company-only ─────────────────────────────────────────────────── */}
        <Route element={<CompanyRoute />}>
          <Route path="/company/Home"          element={<CompanyHome />} />
          <Route path="/company/form"          element={<CompanyProfileForm />} />
          <Route path="/company/category"      element={<ServiceCategories />} />
          <Route path="/company/layout-select" element={<CompanyLayoutSelector />} />
          <Route path="/companyjobs"           element={<CompanyJobsAdmin />} />
          <Route path="/jobslist"              element={<CompanyJobsAdmin />} />
          <Route path="/jobs/form"             element={<JobForm />} />
          <Route path="/company/jobs/:id"      element={<JobDashboard />} />
        </Route>

   

      {/* 404 — outside MainLayout so it's truly a fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;