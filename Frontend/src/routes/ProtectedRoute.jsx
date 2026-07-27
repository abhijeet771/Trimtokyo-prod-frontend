import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ roles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Checking authentication...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }
  if (!user.role) {
    return <Navigate to="/auth" replace />;
  }
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/auth" replace />;
  }
  return <Outlet />;
};

export default ProtectedRoute;