import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Suspense } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import BarLoader from "../loader/BarLoader";
import LazyErrorBoundary from "@/pages/LazyErrorBoundary";
import { isTokenExpired } from "@/lib/helpers";

interface ProtectedLayoutProps {
  allowedRoles?: string[];
}

export const ProtectedLayout = ({ allowedRoles }: ProtectedLayoutProps) => {
  const location = useLocation();

  // 3. Replace the Cookie logic with the Selector
  const { userDetails: user, token } = useSelector(
    (state: RootState) => state.user,
  );

  const isExpired = isTokenExpired(token);

  // 4. Check for both user and token for better security
  if (!user || !token || isExpired) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (allowedRoles?.length && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return (
    <LazyErrorBoundary key={location.pathname}>
      <Suspense fallback={<BarLoader />}>
        <Outlet />
      </Suspense>
    </LazyErrorBoundary>
  );
};
