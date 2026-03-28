import { Navigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";

export default function PublicRoute({ children }) {
  const { user } = useUser();

  if (user) {
    return <Navigate to="/home" replace />;
  }

  return children;
}