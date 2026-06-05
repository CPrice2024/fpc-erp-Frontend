import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

const ProtectedRoute = ({ allowedRoles }) => {
  const { user } = useAuth();

  console.log("USER IN PROTECTED ROUTE:", user);
  console.log("ROLE:", user?.role);
  console.log("TOKEN:", localStorage.getItem("token"));

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;