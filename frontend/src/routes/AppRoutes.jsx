import { Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import NotFound from "../pages/public/NotFound";

/* ================= PUBLIC ================= */
import Home from "../pages/public/Home";
import JobListings from "../pages/public/JobList";
import FreelancerCategories from "../pages/freelance/FreelancersGrid";
import ProfilePages from "../pages/public/Profile";
import ClockScroll3D from "../pages/public/Clock";

/* ================= AUTH ================= */
import Login from "../pages/public/Login";
import Register from "../pages/public/Register";
import ForgotPasswordPage from "../pages/public/ForgotPassword";

/* ================= CANDIDATE ================= */
import CandidateHome from "../pages/candidate/Profile";
import CandidateProfileForm from "../pages/candidate/ProfileForm";
import ApplicationsPage from "../pages/candidate/JobDash";

/* ================= COMPANY ================= */
import CompanyLogin from "../pages/company/Login";
import CompanyRegister from "../pages/company/Register";
import CompanyHome from "../pages/company/CompanyHome";
import CompanyProfileForm from "../pages/company/ProfileForm";
import CompanyProfilePage from "../pages/company/CompanyProfilePage";
import CompanyJobsAdmin from "../pages/company/JobsDash";
import JobDashboard from "../pages/jobs/CandidatesList";
import ServiceCategories from "../pages/company/Category";
import CompanyLayoutSelector from "../pages/company/CompanyPreview";
import CompanyPreview from "../pages/company/Preview";

/* ================= JOB ================= */
import JobForm from "../pages/jobs/JobForm";

/* ================= FREELANCE ================= */
import FreelancerList from "../pages/freelance/Listing";
import FreelancerDetail from "../pages/freelance/Detail";
import AddServiceForm from "../pages/freelance/Form";
import FreelanceDashboard from "../pages/freelance/Dashbord";

/* ================= EXTRA ================= */
import PreviewPage from "../components/LayoutPreview";
import LayoutSelector from "../components/LayoutSelector";

function AppRoutes() {
  return (
    <Routes>

      {/* ================= PUBLIC WEBSITE ================= */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/jobs" element={<JobListings />} />
        <Route path="/freelancers" element={<FreelancerCategories />} />
        <Route path="/profile/:profileId" element={<ProfilePages />} />
        <Route path="/clock" element={<ClockScroll3D />} />
      </Route>

      {/* ================= AUTH ================= */}
      <Route path="/auth">
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
      </Route>

      {/* ================= CANDIDATE ================= */}
      <Route path="/candidate">
        <Route path="home" element={<CandidateHome />} />
        <Route path="profile-form" element={<CandidateProfileForm />} />
        <Route path="applications" element={<ApplicationsPage />} />
      </Route>

      {/* ================= COMPANY ================= */}
      <Route path="/company">
        <Route path="login" element={<CompanyLogin />} />
        <Route path="register" element={<CompanyRegister />} />
        <Route path="home" element={<CompanyHome />} />
        <Route path="profile-form" element={<CompanyProfileForm />} />
        <Route path=":companyId" element={<CompanyProfilePage />} />

        <Route path="jobs" element={<CompanyJobsAdmin />} />
        <Route path="jobs/:id" element={<JobDashboard />} />

        <Route path="category" element={<ServiceCategories />} />
        <Route path="layout-select" element={<CompanyLayoutSelector />} />
        <Route path="preview/:id" element={<CompanyPreview />} />
      </Route>

      {/* ================= JOB ================= */}
      <Route path="/jobs">
        <Route path="create" element={<JobForm />} />
      </Route>

      {/* ================= FREELANCE ================= */}
      <Route path="/freelance">
        <Route path="list" element={<FreelancerList />} />
        <Route path=":id" element={<FreelancerDetail />} />
        <Route path="create" element={<AddServiceForm />} />
        <Route path="dashboard" element={<FreelanceDashboard />} />
      </Route>

      {/* ================= UTIL ================= */}
      <Route path="/preview/:layoutId" element={<PreviewPage />} />
      <Route path="/layout" element={<LayoutSelector />} />

      {/* ================= 404 ================= */}
      <Route path="*" element={<NotFound />} />

    </Routes>
  );
}

export default AppRoutes;