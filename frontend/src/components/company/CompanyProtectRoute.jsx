import { Navigate } from "react-router-dom";
import { useCompany } from "../../context/CompanyContext";

export default function CompanyRoute({ children }) {
    const { company } = useCompany();

  if (!company ) {
    return <Navigate to="/company/login" />;
  }

  if (user.role !== "candidate") {
    return <Navigate to="/company/login" />;
  }

  return children;
}