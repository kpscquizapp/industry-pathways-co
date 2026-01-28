import React from "react";
import { Link } from "react-router-dom";
import UserMenu from "./UserMenu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSelector } from "react-redux";

interface AuthButtonsProps {
  isMobile?: boolean;
  isDark?: boolean;
}

const AuthButtons = ({
  isMobile = false,
  isDark = false,
}: AuthButtonsProps) => {
  // const { user } = useAuth();

  const user = useSelector((state: any) => state.user.userDetails);

  if (user) {
    return <UserMenu />;
  }

  if (isMobile) {
    return (
      <div className="flex flex-col space-y-3">
        <Link
          to="/candidate-register"
          className="flex items-center justify-center px-4 py-3 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors font-medium text-sm"
        >
          Upload CV
        </Link>
        <Link
          to="/login"
          className="flex items-center justify-center px-4 py-3 rounded-lg text-white/80 hover:text-white hover:bg-white/5 transition-colors font-medium text-sm"
        >
          Login
        </Link>
        <Link
          to="/post-job"
          className="flex items-center justify-center px-4 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors text-sm"
        >
          Post a Job
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {/* Upload CV Button */}
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "rounded-lg font-medium text-sm h-9 px-4",
          isDark
            ? "text-white/80 hover:text-white hover:bg-white/10"
            : "text-foreground hover:text-primary hover:bg-primary/5"
        )}
        asChild
      >
        <Link to="/candidate-register">Upload CV</Link>
      </Button>

      {/* Login Link */}
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "rounded-lg font-medium text-sm h-9 px-4",
          isDark
            ? "text-white/80 hover:text-white hover:bg-white/10"
            : "text-foreground hover:text-primary hover:bg-primary/5"
        )}
        asChild
      >
        <Link to="/login">Login</Link>
      </Button>

      {/* Post a Job Button */}
      <Button
        size="sm"
        className="rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-sm h-9 px-5"
        asChild
      >
        <Link to="/post-job">Post a Job</Link>
      </Button>
    </div>
  );
};

export default AuthButtons;
