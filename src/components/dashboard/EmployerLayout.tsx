import React from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
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
  ChevronLeft,
  ChevronRight,
  LayoutDashboard
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
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
} from '@/components/ui/sidebar';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/employer/dashboard' },
  { icon: PlusCircle, label: 'Post Job', href: '/employer/post-job' },
  { icon: Users, label: 'AI Shortlists', href: '/employer/ai-shortlists', isAI: true },
  { icon: ClipboardCheck, label: 'Skill Tests', href: '/employer/skill-tests' },
  { icon: Video, label: 'AI Interviews', href: '/employer/ai-interviews', isAI: true },
  { icon: FileText, label: 'Contracts', href: '/employer/contracts' },
  { icon: Settings, label: 'Settings', href: '/employer/settings' },
];

const EmployerSidebarContent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  const handleLogout = () => {
    logout();
    navigate('/employer-login');
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-border bg-background">
      {/* Header */}
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

      {/* Navigation */}
      <SidebarContent className="p-3">
        <SidebarMenu>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.href || 
              (item.href !== '/employer/dashboard' && location.pathname.startsWith(item.href));
            
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
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
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

      {/* Footer */}
      <SidebarFooter className="border-t border-border p-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className={cn(
              "flex items-center gap-3 w-full p-2 rounded-xl hover:bg-muted transition-colors",
              isCollapsed && "justify-center"
            )}>
              <Avatar className="h-9 w-9 bg-primary flex-shrink-0">
                <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
                  {user?.name?.charAt(0) || user?.email?.charAt(0) || 'H'}
                </AvatarFallback>
              </Avatar>
              {!isCollapsed && (
                <div className="text-left flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user?.name || 'InnovateLab Inc.'}</p>
                  <p className="text-xs text-muted-foreground truncate">Hiring Company</p>
                </div>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" side="top" className="w-56">
            <DropdownMenuItem>
              <User className="h-4 w-4 mr-2" />
              Company Profile
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/employer/settings">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

const EmployerLayout = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <EmployerSidebarContent />
        
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Header */}
          <header className="sticky top-0 z-40 h-16 bg-background border-b border-border flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
            </div>

            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
              </Button>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default EmployerLayout;
