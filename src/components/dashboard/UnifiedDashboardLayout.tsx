import React, { useState } from "react";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import {
  PlusCircle,
  Users,
  ClipboardCheck,
  Video,
  FileText,
  Settings,
  Sparkles,
  Bell,
  LogOut,
  User,
  LayoutDashboard,
  FileCheck,
  BarChart3,
  Plus,
  Briefcase,
  LayoutGrid,
  Code,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import SpinnerLoader from "@/components/loader/SpinnerLoader";
import useLogout from "@/hooks/useLogout";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import ProfileDialog from "../ProfileDialog";
import { useGetEmployerProfileImageQuery } from "@/app/queries/employerApi";
import { useGetCandidateProfileImageQuery } from "@/app/queries/profileApi";
import { skipToken } from "@reduxjs/toolkit/query";
import logo from "../../assets/White Option.png";
import logoIcon from "../../assets/logo_icon.png";

type DashboardRole = "contractor" | "bench" | "hire-talent";

interface UnifiedDashboardLayoutProps {
  role: DashboardRole;
}

const getMenuItems = (role: DashboardRole) => {
  switch (role) {
    case "contractor":
      return [
        {
          icon: LayoutGrid,
          label: "Dashboard",
          href: "/contractor/dashboard",
        },
        { icon: User, label: "Profile", href: "/contractor/profile/update" },
        { icon: Code, label: "Skill Tests", href: "/contractor/tests" },
        // {
        //   icon: Video,
        //   label: "AI Interviews",
        //   href: "/contractor/interviews",
        //   isAI: true,
        // },
        { icon: Settings, label: "Settings", href: "/contractor/settings" },
      ];
    case "bench":
      return [
        { icon: LayoutGrid, label: "Dashboard", href: "/bench/dashboard" },
        { icon: PlusCircle, label: "Post Job", href: "/bench/post-job" },
        {
          icon: Users,
          label: "AI Shortlists",
          href: "/bench/ai-shortlists",
          isAI: true,
        },
        { icon: Code, label: "Skill Test", href: "/bench/skill-tests" },
        {
          icon: Video,
          label: "AI Interviews",
          href: "/bench/ai-interviews",
          isAI: true,
        },
        { icon: FileText, label: "Contracts", href: "/bench/contracts" },
        { icon: Settings, label: "Settings", href: "/bench/settings" },
        // { icon: CreditCard, label: "Billing", href: "/bench/billing" },
      ];
    case "hire-talent":
      return [
        {
          icon: LayoutGrid,
          label: "Dashboard",
          href: "/hire-talent/dashboard",
        },
        { icon: PlusCircle, label: "Post Job", href: "/hire-talent/post-job" },
        { icon: Briefcase, label: "Show Jobs", href: "/hire-talent/jobs" },
        {
          icon: Users,
          label: "AI Shortlists",
          href: "/hire-talent/ai-shortlists",
          isAI: true,
        },
        {
          icon: Code,
          label: "Skill Tests",
          href: "/hire-talent/skill-tests",
        },
        {
          icon: Video,
          label: "AI Interviews",
          href: "/hire-talent/ai-interviews",
          isAI: true,
        },
        { icon: FileText, label: "Contracts", href: "/hire-talent/contracts" },
        { icon: Settings, label: "Settings", href: "/hire-talent/settings" },
      ];
    default:
      return [];
  }
};

const UnifiedSidebarContent = ({ role }: { role: DashboardRole }) => {
  const location = useLocation();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const menuItems = getMenuItems(role);
  const navigate = useNavigate();
  const [handleLogout, isLoading] = useLogout();
  const token = useSelector((rootState: RootState) => rootState.user.token);
  const user = useSelector((state: RootState) => state.user.userDetails);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Use role-appropriate image endpoint:
  // - employer/bench use /avatar/business (employerApi)
  // - contractor/candidate use /avatar (profileApi)
  const isEmployerRole = role === "hire-talent" || role === "bench";

  // Fetch the role-appropriate profile image; queries are skipped when unauthenticated.
  const { currentData: employerProfileImage } = useGetEmployerProfileImageQuery(
    isEmployerRole && token && user?.id != null ? user.id : skipToken,
  );

  const { currentData: candidateProfileImage } =
    useGetCandidateProfileImageQuery(
      !isEmployerRole && token && user?.id != null ? user.id : skipToken,
    );

  const profileImage = isEmployerRole
    ? employerProfileImage
    : candidateProfileImage;

  const handleProfile = () => {
    if (role === "hire-talent") {
      setIsProfileOpen(true);
      return;
    }
    if (!user?.role) return;
    if (user.role === "hr") {
      navigate("/bench-dashboard");
    } else if (user.role === "candidate") {
      navigate("/contractor/dashboard");
    } else if (user.role === "employer") {
      navigate("/hire-talent/dashboard");
    } else {
      navigate(`/`);
    }
  };

  const getRoleBadge = () => {
    switch (role) {
      case "contractor":
        return "Contractor";
      case "bench":
        return "Bench Resource";
      case "hire-talent":
        return "Hiring Company";
      default:
        return "";
    }
  };

  return (
    <Sidebar
      collapsible="icon"
      className="border-none text-slate-300 !bg-[#0B1221]"
      style={{
        "--sidebar-background": "221 50% 9%",
        "--sidebar": "221 50% 9%"
      } as React.CSSProperties}
    >
      <SidebarHeader className="p-6">
        {
          isCollapsed && (
            <img src={logoIcon} alt="logo icon" className="w-12 h-auto" />
          )
        }
        <Link to="/" className="flex items-center gap-3">
          {!isCollapsed && (
            <img src={logo} alt="company logo" className="h-auto w-36" />
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent className="p-4 pt-2 font-inter">
        {!isCollapsed && (
          <div className="px-3 mb-4 text-[11px] font-bold tracking-wider text-slate-500 uppercase">
            Menu
          </div>
        )}
        <SidebarMenu className="gap-1.5">
          {menuItems.map((item) => {
            const dashboardHref =
              role === "bench" ? "/bench/dashboard" : `/${role}/dashboard`;
            const isDashboard = item.href === dashboardHref;
            const isActive =
              location.pathname === item.href ||
              (isDashboard && location.pathname === `/${role}`) ||
              (!isDashboard && location.pathname.startsWith(item.href));

            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  tooltip={item.label}
                  className={cn(
                    "w-full justify-start transition-all relative overflow-hidden group/menuBtn border border-transparent",
                    !isCollapsed && "px-4 py-6 rounded-sm",
                    isCollapsed && "rounded-sm",
                    isActive
                      ? "!bg-[#112433] !text-[#00e5ff]/80"
                      : "!text-slate-400 hover:!bg-[rgba(0,229,255,0.05)] hover:!text-white",
                  )}
                >
                  <Link to={item.href} className="flex items-center w-full">
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-[#00e5ff] rounded-r-md z-10 shadow-[0_0_10px_rgba(0,229,255,0.4)]" />
                    )}
                    <item.icon className={cn("!w-[20px] !h-[20px] flex-shrink-0 z-10 transition-colors", isActive ? "" : "group-hover/menuBtn:text-[#00e5ff]")} />
                    {!isCollapsed && (
                      <span className="font-semibold text-[14px] ml-4 z-10 transition-colors">{item.label}</span>
                    )}
                    {item.isAI && !isCollapsed && (
                      <span className="ml-auto px-2 py-0.5 text-[10px] bg-[rgba(0,229,255,0.1)] text-[#00e5ff] rounded-full font-bold">
                        AI
                      </span>
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

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
                <AvatarFallback className="bg-transparent text-[#00e5ff] text-base font-bold rounded-xl font-inter">
                  {user?.firstName?.charAt(0) ||
                    user?.email?.charAt(0) ||
                    role.charAt(0).toUpperCase()}
                  {user?.lastName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              {!isCollapsed && (
                <>
                  <div className="text-left flex-1 min-w-0 pr-1">
                    <p className="text-[13px] font-semibold text-white truncate leading-tight font-inter">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-[13px] text-slate-400 truncate mt-0.5 font-inter">
                      {getRoleBadge()}
                    </p>
                  </div>
                  <LogOut className="h-[22px] w-[22px] text-slate-500 flex-shrink-0 hover:text-slate-300" />
                </>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" side="top" className="w-56 bg-[#0B1221] border-[#1c2e3d] text-slate-300 shadow-2xl shadow-black/50 font-inter">
            <DropdownMenuItem
              onClick={handleProfile}
              className="focus:bg-[#112433] focus:text-[#00e5ff]/80 cursor-pointer transition-colors"
            >
              <User className="h-4 w-4 mr-2" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem
              asChild
              className="focus:bg-[#112433] focus:text-[#00e5ff]/80 cursor-pointer transition-colors"
            >
              <Link to={`/${role}/settings`} className="w-full">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-red-400 focus:bg-red-500/10 focus:text-red-300 cursor-pointer transition-colors"
              disabled={isLoading}
            >
              <LogOut className="h-4 w-4 mr-2" />
              {isLoading ? "Logging out..." : "Log out"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
      {role === "hire-talent" && (
        <ProfileDialog
          open={isProfileOpen}
          onOpenChange={setIsProfileOpen}
          user={user}
        />
      )}
    </Sidebar>
  );
};

const UnifiedDashboardLayout = ({ role }: UnifiedDashboardLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background font-sans">
        <UnifiedSidebarContent role={role} />

        <div className="flex-1 flex flex-col min-w-0">
          <header className="sticky top-0 z-40 h-16 bg-background border-b border-border flex items-center justify-between px-2 sm:px-6">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="text-muted-foreground hover:bg-[#0b1221]/10" title="Toggle Sidebar" />
            </div>

            {/* <div className="flex items-center gap-3">
              <Button size="icon" className="relative bg-transparent hover:bg-[#0b1221]/10">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
              </Button>
            </div> */}
          </header>

          <main className="flex-1 p-6 overflow-auto">
            <React.Suspense
              fallback={
                <div className="flex items-center justify-center h-full">
                  <SpinnerLoader className="w-8 h-8 text-primary" />
                </div>
              }
            >
              <Outlet />
            </React.Suspense>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default UnifiedDashboardLayout;
