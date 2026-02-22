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
import { useGetProfileImageQuery as useGetEmployerProfileImageQuery } from "@/app/queries/employerApi";
import { useGetProfileImageQuery as useGetCandidateProfileImageQuery } from "@/app/queries/profileApi";
import Cookies from "js-cookie";

type DashboardRole = "contractor" | "bench" | "hire-talent";

interface UnifiedDashboardLayoutProps {
  role: DashboardRole;
}

const getMenuItems = (role: DashboardRole) => {
  switch (role) {
    case "contractor":
      return [
        {
          icon: LayoutDashboard,
          label: "Dashboard",
          href: "/contractor/dashboard",
        },
        { icon: User, label: "Profile", href: "/contractor/profile" },
        { icon: FileCheck, label: "Skill Tests", href: "/contractor/tests" },
        {
          icon: Video,
          label: "AI Interviews",
          href: "/contractor/interviews",
          isAI: true,
        },
        { icon: Settings, label: "Settings", href: "/contractor/settings" },
      ];
    case "bench":
      return [
        { icon: LayoutDashboard, label: "Dashboard", href: "/bench/dashboard" },
        { icon: PlusCircle, label: "Post Job", href: "/bench/post-job" },
        {
          icon: Users,
          label: "AI Shortlists",
          href: "/bench/ai-shortlists",
          isAI: true,
        },
        { icon: BarChart3, label: "Skill Test", href: "/bench/skill-tests" },
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
          icon: LayoutDashboard,
          label: "Dashboard",
          href: "/hire-talent/dashboard",
        },
        { icon: PlusCircle, label: "Post Job", href: "/hire-talent/post-job" },
        {
          icon: Users,
          label: "AI Shortlists",
          href: "/hire-talent/ai-shortlists",
          isAI: true,
        },
        {
          icon: ClipboardCheck,
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
  const user = useSelector((state: RootState) => state.user.userDetails);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { token } = JSON.parse(Cookies.get("userInfo") || "{}");

  // Use role-appropriate image endpoint:
  // - employer/bench use /avatar/business (employerApi)
  // - contractor/candidate use /avatar (profileApi)
  const isEmployerRole = role === "hire-talent" || role === "bench";
  const { data: employerProfileImage, isError: employerProfileImageError } =
    useGetEmployerProfileImageQuery(user?.id || "", {
      skip: !user?.id || !isEmployerRole || !token,
    });
  const { data: candidateProfileImage, isError: candidateProfileImageError } =
    useGetCandidateProfileImageQuery(user?.id || "", {
      skip: !user?.id || isEmployerRole || !token,
    });

  const profileImage = isEmployerRole
    ? employerProfileImageError
      ? null
      : employerProfileImage
    : candidateProfileImageError
      ? null
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
      navigate("/contractor/profile");
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
      className="border-r border-border bg-background"
    >
      <SidebarHeader className="border-b border-border p-4">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          {!isCollapsed && (
            <span className="text-xl font-bold tracking-tight text-foreground">
              HIRION
            </span>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent className="p-3">
        <SidebarMenu>
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
                    "w-full justify-start gap-3 px-3 py-2.5 rounded-xl transition-all",
                    isActive
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted",
                  )}
                >
                  <Link to={item.href}>
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    {!isCollapsed && (
                      <span className="font-medium">{item.label}</span>
                    )}
                    {item.isAI && !isCollapsed && (
                      <span className="ml-auto px-1.5 py-0.5 text-[10px] bg-primary/20 text-primary rounded-full font-semibold">
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

      <SidebarFooter className="border-t border-border p-3">
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <button
              className={cn(
                "flex items-center gap-3 w-full p-2 rounded-xl hover:bg-muted transition-colors",
                isCollapsed && "justify-center",
              )}
            >
              <Avatar className="h-9 w-9 bg-slate-300 flex-shrink-0">
                {profileImage && (
                  <AvatarImage
                    className="object-cover"
                    src={profileImage}
                    alt={`${user?.firstName ?? "User"} profile image`}
                  />
                )}
                <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
                  {user?.firstName?.charAt(0) ||
                    user?.email?.charAt(0) ||
                    role.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {!isCollapsed && (
                <div className="text-left flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {getRoleBadge()}
                  </p>
                </div>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" side="top" className="w-56">
            <DropdownMenuItem onClick={handleProfile}>
              <User className="h-4 w-4 mr-2" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to={`/${role}/settings`}>
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-destructive"
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
      <div className="min-h-screen flex w-full bg-background">
        <UnifiedSidebarContent role={role} />

        <div className="flex-1 flex flex-col min-w-0">
          <header className="sticky top-0 z-40 h-16 bg-background border-b border-border flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
            </div>

            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
              </Button>
              {role === "hire-talent" && (
                <Button size="sm" className="rounded-xl hidden md:flex" asChild>
                  <Link to="/hire-talent/post-job">
                    <Plus className="w-4 h-4 mr-2" />
                    Post Job
                  </Link>
                </Button>
              )}
            </div>
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
