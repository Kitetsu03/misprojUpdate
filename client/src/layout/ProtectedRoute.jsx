import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({ allowedRoles }) {
  const token = localStorage.getItem("token");

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch (error) {
    console.error("Invalid user session data:", error);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    return <Navigate to="/" replace />;
  }

  // No token = not logged in
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // No valid user or role mismatch
  if (!user || !allowedRoles.includes(user.role)) {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
