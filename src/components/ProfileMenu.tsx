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
import { useGetProfileImageQuery as useGetEmployerProfileImageQuery } from "@/app/queries/employerApi";
import { useGetProfileImageQuery as useGetCandidateProfileImageQuery } from "@/app/queries/profileApi";

const ProfileMenu = ({
  btnClass,
  avatarFallback,
}: {
  btnClass: string;
  avatarFallback: string;
}) => {
  const user = useSelector((state: any) => state.user.userDetails);
  const [handleLogout, isLoading] = useLogout();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();
  // Use role-appropriate image endpoint
  const isEmployerOrHr = user?.role === "employer" || user?.role === "hr";
  const { data: employerProfileImage } = useGetEmployerProfileImageQuery(
    user?.id || "",
    { skip: !user?.id || !isEmployerOrHr },
  );
  const { data: candidateProfileImage } = useGetCandidateProfileImageQuery(
    user?.id || "",
    { skip: !user?.id || isEmployerOrHr },
  );
  const profileImage = isEmployerOrHr ? employerProfileImage : candidateProfileImage;

  const handleProfile = () => {
    if (user.role === "hr") {
      navigate("/bench-dashboard");
    } else if (user.role === "candidate") {
      navigate("/contractor/profile");
    } else if (user.role === "employer") {
      navigate("/hire-talent/dashboard");
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
                {user?.firstName?.charAt(0) || "E"}
              </AvatarFallback>
            </Avatar>
            <span className="font-medium text-sm hidden sm:inline">
              {user?.firstName || "Employer"}
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
