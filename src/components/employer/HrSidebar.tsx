import { Link, useLocation, useNavigate } from "react-router-dom";
import HirionLogo from "@/assets/White Option.png";
import logoIcon from "@/assets/logo_icon.png";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  Settings,
  LogOut,
  LayoutGrid,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { useGetEmployerProfileImageQuery } from "@/app/queries/employerApi";
import { skipToken } from "@reduxjs/toolkit/query";
import useLogout from "@/hooks/useLogout";

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutGrid,
    path: "/bench-dashboard",
    isAI: false,
  },
  {
    title: "Post Bench Resource",
    icon: UserPlus,
    path: "/bench-dashboard/post-bench-resource",
    isAI: false,
  },
  {
    title: "Active Resources",
    icon: Users,
    path: "/bench-dashboard/active-resources",
    isAI: false,
  },
  {
    title: "Settings",
    icon: Settings,
    path: "/bench-dashboard/visibility-settings",
    isAI: false,
  },
];

const HrSidebarContent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state, isMobile, setOpenMobile } = useSidebar();
  const isCollapsed = state === "collapsed" && !isMobile;

  const handleMobileClose = () => {
    if (isMobile && setOpenMobile) {
      setOpenMobile(false);
    }
  };
  const currentPath = location.pathname;

  const [handleLogout, isLoggingOut] = useLogout();
  const token = useSelector((rootState: RootState) => rootState.user.token);
  const user = useSelector((s: RootState) => s.user.userDetails);

  const { currentData: profileImage } = useGetEmployerProfileImageQuery(
    token && user?.id != null ? user.id : skipToken
  );

  return (
    <Sidebar
      collapsible="icon"
      className="border-none text-slate-300 !bg-[#0B1221]"
      style={
        {
          "--sidebar-background": "221 50% 9%",
          "--sidebar": "221 50% 9%",
        } as React.CSSProperties
      }
    >
      {/* Logo */}
      <SidebarHeader className="p-6">
        {isCollapsed && (
          <img src={logoIcon} alt="logo icon" className="w-12 h-auto" />
        )}
        <Link to="/" className="flex items-center gap-3">
          {!isCollapsed && (
            <img src={HirionLogo} alt="Hirion Logo" className="h-auto w-36" />
          )}
        </Link>
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent className="p-4 pt-2">
        {!isCollapsed && (
          <div className="px-3 mb-4 text-[11px] font-bold tracking-wider text-slate-500 uppercase">Menu</div>
        )}
        <SidebarMenu className="gap-1.5">
          {menuItems.map((item) => {
            const isActive =
              currentPath === item.path ||
              (item.path !== "/bench-dashboard" &&
                currentPath.startsWith(item.path + "/")) ||
              (item.path === "/bench-dashboard" &&
                (currentPath === "/bench-dashboard" ||
                  currentPath === "/bench-dashboard/dashboard"));

            return (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  tooltip={item.title}
                  className={cn(
                    "w-full justify-start transition-all relative overflow-hidden group/menuBtn border border-transparent",
                    !isCollapsed && "px-4 py-6 rounded-sm",
                    isCollapsed && "rounded-sm",
                    isActive
                      ? "!bg-[#112433] !text-[#00e5ff]"
                      : "!text-slate-400 hover:!bg-[rgba(0,229,255,0.05)] hover:!text-white"
                  )}
                >
                  <Link
                    to={item.path}
                    className="flex items-center w-full"
                    onClick={handleMobileClose}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-[#00e5ff] rounded-r-md z-10 shadow-[0_0_10px_rgba(0,229,255,0.4)]" />
                    )}
                    <item.icon
                      className={cn(
                        "!w-[20px] !h-[20px] flex-shrink-0 z-10 transition-colors",
                        isActive ? "" : "group-hover/menuBtn:text-[#00e5ff]"
                      )}
                    />
                    {!isCollapsed && (
                      <span className="font-semibold text-[14px] ml-4 z-10 transition-colors">
                        {item.title}
                      </span>
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      {/* Footer / Profile */}
      <SidebarFooter className="p-4 border-t border-white/5 pb-6">
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <button
              className={cn(
                "flex items-center w-full p-2.5 rounded-2xl hover:bg-white/5 transition-colors bg-[#111928] border border-transparent hover:border-white/10",
                isCollapsed ? "justify-center" : "gap-3"
              )}
            >
              <Avatar className="h-10 w-10 bg-cyan-900/40 flex-shrink-0 rounded-xl">
                {profileImage && (
                  <AvatarImage
                    className="object-cover rounded-xl"
                    src={profileImage}
                    alt={`${user?.firstName ?? "User"} profile image`}
                  />
                )}
                <AvatarFallback className="bg-transparent text-[#00e5ff] text-base font-bold rounded-xl">
                  {user?.firstName?.charAt(0) ||
                    user?.email?.charAt(0) ||
                    "B"}
                  {user?.lastName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              {!isCollapsed && (
                <>
                  <div className="text-left flex-1 min-w-0 pr-1">
                    <p className="text-[15px] font-semibold text-white truncate leading-tight">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-[13px] text-slate-400 truncate mt-0.5">
                      Bench Resource
                    </p>
                  </div>
                  <LogOut className="h-[22px] w-[22px] text-slate-500 flex-shrink-0 hover:text-slate-300" />
                </>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            side="top"
            className="w-56 bg-[#0B1221] border-[#1c2e3d] text-slate-300 shadow-2xl shadow-black/50"
          >
            <DropdownMenuItem
              onClick={() => {
                navigate("/bench-dashboard/visibility-settings?tab=general");
                handleMobileClose();
              }}
              className="focus:bg-[#112433] focus:text-[#00e5ff] cursor-pointer transition-colors"
            >
              <User className="h-4 w-4 mr-2" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem
              asChild
              className="focus:bg-[#112433] focus:text-[#00e5ff] cursor-pointer transition-colors"
            >
              <Link
                to="/bench-dashboard/visibility-settings?tab=account"
                className="w-full"
                onClick={handleMobileClose}
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-red-400 focus:bg-red-500/10 focus:text-red-300 cursor-pointer transition-colors"
              disabled={isLoggingOut}
            >
              <LogOut className="h-4 w-4 mr-2" />
              {isLoggingOut ? "Logging out..." : "Log out"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default HrSidebarContent;
