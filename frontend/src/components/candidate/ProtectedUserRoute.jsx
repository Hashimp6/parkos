import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../../context/UserContext";       // adjust path as needed
import { useCompany } from "../../context/CompanyContext"; // adjust path as needed

// ── Candidate-only routes ─────────────────────────────────────────────────────
// Requires a logged-in candidate (user + token).
// If not logged in → redirects to /login
export function CandidateRoute() {
  const { user, token } = useUser();

  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

// ── Company-only routes ───────────────────────────────────────────────────────
// Requires a logged-in company (company + token).
// If not logged in → redirects to /company/login
export function CompanyRoute() {
  const { company, token } = useCompany();

  if (!company || !token) {
    return <Navigate to="/company/login" replace />;
  }

  return <Outlet />;
}

// ── Guest-only routes (redirect away if already logged in) ───────────────────
// Useful for login/register pages so logged-in users don't see them again.
// candidateRedirect: where to send a logged-in candidate   (default /home)
// companyRedirect:   where to send a logged-in company     (default /company/Home)
export function GuestRoute({
  candidateRedirect = "/home",
  companyRedirect = "/company/Home",
}) {
  const { user } = useUser();
  const { company } = useCompany();

  if (user)    return <Navigate to={candidateRedirect} replace />;
  if (company) return <Navigate to={companyRedirect}   replace />;

  return <Outlet />;
}








