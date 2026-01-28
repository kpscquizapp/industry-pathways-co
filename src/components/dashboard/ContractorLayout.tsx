import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Briefcase, 
  FileCheck, 
  Video, 
  User, 
  DollarSign,
  Sparkles,
  Menu,
  X,
  Bell,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

const sidebarLinks = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/contractor/dashboard' },
  { icon: Briefcase, label: 'Job Matches', href: '/contractor/jobs' },
  { icon: FileCheck, label: 'Skill Tests', href: '/contractor/tests' },
  { icon: Video, label: 'AI Interviews', href: '/contractor/interviews' },
  { icon: User, label: 'Profile', href: '/contractor/profile' },
  { icon: DollarSign, label: 'Earnings', href: '/contractor/earnings' },
];

const ContractorLayout = () => {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className={cn(
        'fixed inset-y-0 left-0 z-50 bg-card border-r border-border transition-all duration-300',
        sidebarOpen ? 'w-64' : 'w-20'
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-border">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 bg-gradient-to-br from-primary to-green-400 rounded-xl flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              {sidebarOpen && <span className="text-lg font-bold">HIRION</span>}
            </Link>
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
            >
              {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>

          {/* Profile Summary */}
          {sidebarOpen && (
            <div className="p-4 border-b border-border">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-semibold">
                  JD
                </div>
                <div>
                  <p className="font-medium text-sm">John Doe</p>
                  <p className="text-xs text-muted-foreground">React Developer</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Profile</span>
                  <span className="text-primary font-medium">85%</span>
                </div>
                <Progress value={85} className="h-1.5" />
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {sidebarLinks.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all',
                    isActive 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <link.icon className="w-5 h-5" />
                  {sidebarOpen && <span className="font-medium">{link.label}</span>}
                </Link>
              );
            })}
          </nav>

          {/* Score Cards */}
          {sidebarOpen && (
            <div className="p-4 border-t border-border">
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 bg-muted/50 rounded-xl text-center">
                  <p className="text-lg font-bold text-primary">87</p>
                  <p className="text-xs text-muted-foreground">Skill Score</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-xl text-center">
                  <p className="text-lg font-bold text-primary">92</p>
                  <p className="text-xs text-muted-foreground">Interview Ready</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className={cn(
        'flex-1 transition-all duration-300',
        sidebarOpen ? 'ml-64' : 'ml-20'
      )}>
        {/* Top Bar */}
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
          <div>
            <h1 className="text-lg font-semibold">Contractor Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
            </button>
            <Button size="sm" className="rounded-xl">
              <Sparkles className="w-4 h-4 mr-2" />
              Find Jobs
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default ContractorLayout;
