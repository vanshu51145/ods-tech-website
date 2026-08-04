import { Navigate, useLocation } from "react-router-dom";

function ProtectedRoute({ children, type = "admin" }) {
  const location = useLocation();
  const tokenKey = type === "client" ? "clientToken" : "token";
  const loginPath = type === "client" ? "/client/login" : "/admin/login";
  const token = localStorage.getItem(tokenKey);

  if (!token) {
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  return children;
}

export default ProtectedRoute;