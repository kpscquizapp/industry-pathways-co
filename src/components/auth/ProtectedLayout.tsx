import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Suspense, useMemo } from "react";
import BarLoader from "../loader/BarLoader";
import Cookies from "js-cookie";
import LazyErrorBoundary from "@/pages/LazyErrorBoundary";

interface ProtectedLayoutProps {
  allowedRoles?: string[];
}

interface UserInfo {
  userDetails: {
    role: string;
    // Add other user properties as needed
  };
}

export const ProtectedLayout = ({ allowedRoles }: ProtectedLayoutProps) => {
  const location = useLocation();
  // Memoize user parsing to avoid repeated JSON.parse on re-renders
  const userInfo = Cookies.get("userInfo");
  const user = useMemo(() => {
    try {
      if (!userInfo) return null;
      const parsed: UserInfo = JSON.parse(userInfo);
      return parsed.userDetails;
    } catch (error) {
      return null;
    }
  }, [userInfo]);

  if (!user) {
    return <Navigate to="/" replace />;
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
