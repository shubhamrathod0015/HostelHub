/* eslint-disable react/prop-types */
import LoadingSpinner from "@/components/ui/Loading";
import useAdmin from "@/hooks/useAdmin";
import useAuth from "@/hooks/useAuth";
import { Navigate, useLocation } from "react-router";

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const [isAdmin, isAdminLoading] = useAdmin();
  const location = useLocation();

  if (loading || isAdminLoading) {
    return <LoadingSpinner />;
  }

  if (user && isAdmin) {
    return children;
  }

  return <Navigate to="/" state={{ from: location }} replace></Navigate>;
};

export default AdminRoute;
