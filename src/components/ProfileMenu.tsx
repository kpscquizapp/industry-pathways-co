import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import useLogout from "@/hooks/useLogout";
import { LogOut, User } from "lucide-react";
import ProfileDialog from "./ProfileDialog";
import { useNavigate } from "react-router-dom";
import {
  useGetEmployerProfileImageQuery,
  useGetEmployerProfileQuery,
} from "@/app/queries/employerApi";
import { skipToken } from "@reduxjs/toolkit/query";
import { RootState } from "@/app/store";

const ProfileMenu = ({
  btnClass,
  avatarFallback,
}: {
  btnClass: string;
  avatarFallback: string;
}) => {
  const { token } = useSelector((state: RootState) => state.user);

  const user = useSelector((state: RootState) => state.user.userDetails);
  const [handleLogout, isLoading] = useLogout();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();
  // Use role-appropriate image endpoint
  const isHr = user?.role === "hr";

  const { data: employerProfileData } = useGetEmployerProfileQuery(undefined, {
    skip: !isHr || !token || !user?.id,
  });

  const avatarValue = isHr
    ? employerProfileData?.data?.employerProfile?.avatar ||
      employerProfileData?.data?.avatar
    : undefined;

  const hasAvatar =
    !!avatarValue &&
    avatarValue !== "null" &&
    avatarValue !== "undefined" &&
    typeof avatarValue === "string" &&
    avatarValue.trim().length > 0;

  // 2. Fetch actual image only if metadata indicates it exists
  const { data: employerProfileImage } = useGetEmployerProfileImageQuery(
    hasAvatar && isHr && user?.id ? user.id : skipToken,
  );

  const profileImage = isHr ? employerProfileImage : null;

  const handleProfile = () => {
    if (!user?.role) return;
    if (user.role === "hr") {
      navigate("/bench-dashboard");
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
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className={btnClass}>
            <Avatar className="h-8 w-8">
              {profileImage && (
                <AvatarImage
                  className="object-cover"
                  src={profileImage}
                  alt={`${user?.firstName ?? "User"} profile image`}
                />
              )}
              <AvatarFallback className={avatarFallback}>
                {user?.firstName?.charAt(0) ||
                  user?.role?.charAt(0)?.toUpperCase() ||
                  "U"}
              </AvatarFallback>
            </Avatar>
            <span className="font-medium text-sm hidden sm:inline">
              {user?.firstName || user?.role || "User"}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-48 bg-white dark:bg-[#0f1729] dark:text-slate-400"
        >
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleProfile}>
            <User className="h-4 w-4 mr-2" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleLogout}
            className="text-red-600"
            disabled={isLoading}
          >
            <LogOut className="h-4 w-4 mr-2" />
            {isLoading ? "Signing out..." : "Sign out"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ProfileDialog
        open={isProfileOpen}
        onOpenChange={setIsProfileOpen}
        user={user}
      />
    </>
  );
};

export default ProfileMenu;
