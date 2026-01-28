import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  BarChart3, 
  FileText, 
  CreditCard,
  Sparkles,
  Menu,
  X,
  Bell,
  Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const sidebarLinks = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/bench/dashboard' },
  { icon: Users, label: 'Bench Talent', href: '/bench/talent' },
  { icon: Briefcase, label: 'Job Matches', href: '/bench/matches' },
  { icon: BarChart3, label: 'Analytics', href: '/bench/analytics' },
  { icon: FileText, label: 'Contracts', href: '/bench/contracts' },
  { icon: CreditCard, label: 'Billing', href: '/bench/billing' },
];

const BenchLayout = () => {
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

          {/* Company Info */}
          {sidebarOpen && (
            <div className="p-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-green-400/20 flex items-center justify-center">
                  <span className="text-primary font-bold">TC</span>
                </div>
                <div>
                  <p className="font-medium text-sm">TechCorp Solutions</p>
                  <p className="text-xs text-muted-foreground">12 Bench Resources</p>
                </div>
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

          {/* Quick Stats */}
          {sidebarOpen && (
            <div className="p-4 border-t border-border">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Utilization</span>
                  <span className="text-sm font-bold text-primary">67%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Active Matches</span>
                  <span className="text-sm font-bold text-foreground">8</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Revenue MTD</span>
                  <span className="text-sm font-bold text-primary">$24,500</span>
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
            <h1 className="text-lg font-semibold">Bench Resources</h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
            </button>
            <Button size="sm" className="rounded-xl">
              <Plus className="w-4 h-4 mr-2" />
              Add Resource
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

export default BenchLayout;
