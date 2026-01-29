import React, { useState } from 'react';
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
  Search,
  LogOut,
  User,
  ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';

const menuItems = [
  { icon: PlusCircle, label: 'Post Job', href: '/employer/post-job' },
  { icon: Users, label: 'AI Shortlists', href: '/employer/shortlists', isAI: true },
  { icon: ClipboardCheck, label: 'Skill Tests', href: '/employer/tests' },
  { icon: Video, label: 'AI Interviews', href: '/employer/interviews', isAI: true },
  { icon: FileText, label: 'Contracts', href: '/employer/contracts' },
  { icon: Settings, label: 'Settings', href: '/employer/settings' },
];

const EmployerLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/employer-login');
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 bg-gradient-to-br from-primary to-green-400 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-foreground">
                HIRION
              </span>
            </Link>

            {/* Search */}
            <div className="hidden md:flex relative max-w-md flex-1 mx-8">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search jobs, candidates..." 
                className="pl-10 bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-primary rounded-xl"
              />
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 px-2">
                    <Avatar className="h-8 w-8 bg-gradient-to-br from-primary to-green-400">
                      <AvatarFallback className="bg-transparent text-white text-sm font-semibold">
                        {user?.name?.charAt(0) || user?.email?.charAt(0) || 'H'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-left hidden sm:block">
                      <p className="text-sm font-medium">{user?.name || 'InnovateLab Inc.'}</p>
                      <p className="text-xs text-muted-foreground">Hiring Company</p>
                    </div>
                    <ChevronDown className="h-4 w-4 text-muted-foreground hidden sm:block" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
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
            </div>
          </div>
        </div>
      </header>

      {/* Menu Bar */}
      <nav className="bg-background border-b border-border sticky top-16 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide py-1">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.href || 
                (item.href !== '/employer/dashboard' && location.pathname.startsWith(item.href));
              
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    'flex items-center gap-2 px-4 py-3 font-medium text-sm whitespace-nowrap transition-all border-b-2',
                    isActive 
                      ? 'text-primary border-primary bg-primary/5' 
                      : 'text-muted-foreground border-transparent hover:text-foreground hover:bg-muted/50'
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                  {item.isAI && (
                    <span className="ml-1 px-1.5 py-0.5 text-[10px] bg-gradient-to-r from-primary to-green-400 text-white rounded-full font-semibold">
                      AI
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-background py-4 mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <Link to="/help" className="hover:text-foreground">Help</Link>
              <Link to="/terms" className="hover:text-foreground">Terms</Link>
              <Link to="/privacy" className="hover:text-foreground">Privacy</Link>
            </div>
            <p>© 2025 Hirion. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default EmployerLayout;
