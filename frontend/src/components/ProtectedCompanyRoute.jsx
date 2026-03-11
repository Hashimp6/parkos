import { Navigate } from "react-router-dom";
import { useCompany } from "../context/CompanyContext";

export default function ProtectedCompanyRoute({ children }) {

  const { company } = useCompany();

  if (!company) {
    return <Navigate to="/company/login" />;
  }

  return children;
}