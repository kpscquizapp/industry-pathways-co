import React from "react";
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
import { useNavigate } from "react-router-dom";
import useLogout from "@/hooks/useLogout";
import { LogOut, User } from "lucide-react";

const ProfileMenu = ({
  btnClass,
  avatarFallback,
}: {
  btnClass: string;
  avatarFallback: string;
}) => {
  const user = useSelector((state: any) => state.user.userDetails);
  const [handleLogout, isLoading] = useLogout();
  const navigate = useNavigate();

  const handleProfile = () => {
    if (user.role === "employer") {
      navigate("/employer-dashboard");
    } else if (user.role === "candidate") {
      navigate("/profile");
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className={btnClass}>
            <Avatar className="h-8 w-8">
              <AvatarImage src="" />
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
    </>
  );
};

export default ProfileMenu;
