import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ isAdmin }) {
  const { user, isFetching } = useContext(AuthContext);

  if (isFetching) {
    return <div className="text-white">Loading...</div>; // Or a spinner
  }

  if (!user) {
    return <Navigate to={isAdmin ? "/admin/login" : "/login"} replace />;
  }

  if (isAdmin && !user.isAdmin) {
    return <Navigate to="/" replace />; // Not an admin
  }

  return <Outlet />; // Render the child routes
}
