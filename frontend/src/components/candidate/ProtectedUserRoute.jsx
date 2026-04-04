import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../../context/UserContext";       // adjust path as needed
import { useCompany } from "../../context/CompanyContext"; // adjust path as needed

// ── Candidate-only routes ─────────────────────────────────────────────────────
// Requires a logged-in candidate (user + token).
// If not logged in → redirects to /login
export function CandidateRoute() {
  const { user, token, loading } = useUser();

  if (loading) return null; // or a spinner
  if (!user || !token) return <Navigate to="/login" replace />;
  return <Outlet />;
}

export function CompanyRoute() {
  const { company, token, loading } = useCompany();

  if (loading) return null;
  if (!company || !token) return <Navigate to="/company/login" replace />;
  return <Outlet />;
}

export function GuestRoute({ candidateRedirect = "/home" }) {
  const { user, loading } = useUser();

  if (loading) return null;
  if (user) return <Navigate to={candidateRedirect} replace />;
  return <Outlet />;
}

export function GuestCompanyRoute({ companyRedirect = "/company/Home" }) {
  const { company, loading } = useCompany();

  if (loading) return null;
  if (company) return <Navigate to={companyRedirect} replace />;
  return <Outlet />;
}