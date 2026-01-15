/* eslint-disable react/prop-types */
import { Navigate, useLocation } from "react-router";
import LoadingSpinner from "@/components/ui/Loading";
import useAuth from "@/hooks/useAuth";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner />;
  }
  if (user) {
    return children;
  }

  return <Navigate to="/login" state={{ from: location }} />;
};

export default PrivateRoute;
