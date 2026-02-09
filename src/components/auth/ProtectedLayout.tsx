import { Navigate, Outlet } from "react-router-dom";
import { Suspense, useMemo } from "react";
import BarLoader from "../loader/BarLoader";
import Cookies from "js-cookie";

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
  // Memoize user parsing to avoid repeated JSON.parse on re-renders
  const userInfo = Cookies.get("userInfo");
  const user = useMemo(() => {
    try {
      if (!userInfo) return null;
      const parsed: UserInfo = JSON.parse(userInfo);
      return parsed.userDetails;
    } catch (error) {
      console.error("Failed to parse user info:", error);
      return null;
    }
  }, [userInfo]);

  if (!user) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (allowedRoles?.length && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return (
    <Suspense fallback={<BarLoader />}>
      <Outlet />
    </Suspense>
  );
};
