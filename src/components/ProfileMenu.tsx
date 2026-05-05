import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import useLogout from "@/hooks/useLogout";
import { LogOut, User, Settings } from "lucide-react";
import ProfileDialog from "./ProfileDialog";
import { useNavigate, Link } from "react-router-dom";
import { useGetEmployerProfileImageQuery } from "@/app/queries/employerApi";
import { skipToken } from "@reduxjs/toolkit/query";
import { RootState } from "@/app/store";

const ProfileMenu = ({
  btnClass,
  avatarFallback,
}: {
  btnClass: string;
  avatarFallback: string;
}) => {
  const user = useSelector((state: RootState) => state.user.userDetails);
  const [handleLogout, isLoading] = useLogout();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();
  // Use role-appropriate image endpoint
  const isHr = user?.role === "hr";

  // Always resolve image from the avatar endpoint for HR users.
  // This avoids stale UI when metadata and image cache get out of sync.
  const { currentData: employerProfileImage } = useGetEmployerProfileImageQuery(
    isHr && user?.id != null ? user.id : skipToken,
  );

  const profileImage = isHr ? employerProfileImage : null;

  const handleProfile = () => {
    if (!user?.role) return;
    if (user.role === "hr") {
      navigate("/bench-dashboard/visibility-settings");
    } else if (user.role === "candidate") {
      navigate("/contractor/profile");
      return;
    } else if (user.role === "employer") {
      navigate("/hire-talent/dashboard");
      return;
    }
    setIsProfileOpen(true);
  };

  return (
    <div className="w-full">
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button>
            {/* Avatar */}
            <Avatar className="h-10 w-10 bg-cyan-900/40 rounded-xl overflow-hidden flex-shrink-0">
              {profileImage && (
                <AvatarImage
                  className="object-cover"
                  src={profileImage}
                  alt={`${user?.firstName ?? "User"} profile image`}
                />
              )}
              <AvatarFallback className={avatarFallback || "flex items-center justify-center text-[#00e5ff] text-base font-bold bg-transparent"}>
                {user?.firstName?.charAt(0) ||
                  user?.role?.charAt(0)?.toUpperCase() ||
                  "U"}
              </AvatarFallback>
            </Avatar>

            <span className="font-medium text-sm hidden sm:inline font-inter">
              {user?.firstName || user?.role || "User"}
            </span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" side="top" className="w-56 bg-[#0B1221] border-[#1c2e3d] text-slate-300 shadow-2xl shadow-black/50">
          <DropdownMenuItem
            asChild
            //  onClick={handleProfile}
            className="focus:bg-[#112433] focus:text-[#00e5ff] cursor-pointer transition-colors"
          >
            <Link to="/bench-dashboard/visibility-settings" className="w-full flex items-center">
              <User className="h-4 w-4 mr-2" />
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            asChild
            className="focus:bg-[#112433] focus:text-[#00e5ff] cursor-pointer transition-colors"
          >
            <Link to="/bench-dashboard/visibility-settings" className="w-full">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-white/10 border-white/10" />
          <DropdownMenuItem
            onClick={handleLogout}
            className="text-red-400 focus:bg-red-500/10 focus:text-red-300 cursor-pointer transition-colors pt-2"
            disabled={isLoading}
          >
            <LogOut className="h-4 w-4 mr-2" />
            {isLoading ? "Logging out..." : "Log out"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ProfileDialog
        open={isProfileOpen}
        onOpenChange={setIsProfileOpen}
        user={user}
      />
    </div>
  );
};

export default ProfileMenu;

// ---- OLD PROFILE MENU CODE (COMMENTED FOR REFERENCE) ----
/*
return (
<div className="flex flex-col gap-2 p-4 pb-6">    
    <div className="flex items-center w-full p-2.5 rounded-2xl hover:bg-white/5 transition-colors bg-[#111928] border border-transparent hover:border-white/10 gap-3">
      
      {/* Avatar *\/}
      <Avatar className="h-10 w-10 bg-cyan-900/40 rounded-xl overflow-hidden">
        {profileImage && (
          <AvatarImage
            className="object-cover"
            src={profileImage}
            alt={`${user?.firstName ?? "User"} profile image`}
          />
        )}
        <AvatarFallback className="flex items-center justify-center text-[#00e5ff] text-base font-bold bg-transparent">
          {user?.firstName?.charAt(0) ||
            user?.role?.charAt(0)?.toUpperCase() ||
            "U"}
        </AvatarFallback>
      </Avatar>

      {/* User Info *\/}
      <div className="text-left flex-1 min-w-0 pr-1">
        <p className="text-[15px] font-semibold text-white truncate leading-tight">
          {user?.firstName || "User"}
        </p>
        <p className="text-[13px] text-slate-400 truncate mt-0.5">
          {user?.role === "hr"
            ? "Partner Admin"
            : user?.role || "User"}
        </p>
      </div>

      {/* Logout Icon (same functionality) *\/}
      <button
        onClick={handleLogout}
        disabled={isLoading}
        className="h-[22px] w-[22px] text-slate-500 flex-shrink-0 hover:text-slate-300 transition-colors"
      >
        <LogOut className="h-full w-full" />
      </button>
    </div>

    <ProfileDialog
      open={isProfileOpen}
      onOpenChange={setIsProfileOpen}
      user={user}
    />
  </div>
);

// Removed commented JSX that was previously at the bottom of the original file:
// <DropdownMenuItem
//   onClick={handleLogout}
//   className="text-red-600"
//   disabled={isLoading}
// >
//   <LogOut className="h-4 w-4 mr-2" />
//   {isLoading ? "Signing out..." : "Sign out"}
// </DropdownMenuItem>
*/