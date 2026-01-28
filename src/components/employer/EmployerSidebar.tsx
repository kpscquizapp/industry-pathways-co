import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FileText, 
  Briefcase, 
  GraduationCap, 
  Clock, 
  Globe, 
  Bot, 
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
  Users,
  ClipboardCheck,
  UserPlus,
  Eye,
  Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import hirionLogo from '@/assets/hirion-logo.png';

interface EmployerSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const menuItems = [
  { title: 'Dashboard', icon: LayoutDashboard, path: '/employer-dashboard', isAI: false },
  { title: 'Post Bench Resource', icon: UserPlus, path: '/employer-dashboard/post-bench-resource', isAI: false },
  { title: 'Active Resources', icon: Users, path: '/employer-dashboard/active-resources', isAI: false },
  { title: 'Visibility Settings', icon: Eye, path: '/employer-dashboard/visibility-settings', isAI: false },
];

const EmployerSidebar = ({ collapsed, onToggle }: EmployerSidebarProps) => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <aside 
      className={cn(
        "sticky top-0 left-0  h-screen bg-navy-900 text-white flex flex-col transition-all duration-300 z-50",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="p-4 border-b border-navy-700">
        <Link to="/" className="flex items-center gap-3">
          <img 
            src={hirionLogo} 
            alt="Hirion" 
            className="h-10 w-10 rounded-full object-cover"
          />
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-bold text-lg">HIRION</span>
              <span className="text-xs text-navy-300">Employer Portal</span>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1 px-3">
          {menuItems.map((item) => {
            const isActive = currentPath === item.path || 
              (item.path !== '/employer-dashboard' && currentPath.startsWith(item.path + '/')) ||
              (item.path === '/employer-dashboard' && (currentPath === '/employer-dashboard' || currentPath === '/employer-dashboard/dashboard'));
            const Icon = item.icon;
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group relative",
                    isActive 
                      ? "bg-teal-500/20 text-teal-400 border-l-4 border-teal-400 -ml-3 pl-6" 
                      : "hover:bg-navy-800 text-navy-200 hover:text-white",
                    item.isAI && !isActive && "text-teal-300 hover:text-teal-200"
                  )}
                >
                  <Icon 
                    className={cn(
                      "h-5 w-5 flex-shrink-0",
                      item.isAI && "text-teal-400"
                    )} 
                  />
                  {!collapsed && (
                    <span className={cn(
                      "font-medium text-sm",
                      item.isAI && "text-teal-300"
                    )}>
                      {item.title}
                    </span>
                  )}
                  {item.isAI && !collapsed && (
                    <span className="ml-auto px-2 py-0.5 bg-teal-500/30 text-teal-300 text-xs rounded-full font-medium">
                      AI
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Collapse Toggle */}
      <div className="p-4 border-t border-navy-700">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="w-full text-navy-300 hover:text-white hover:bg-navy-800"
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <>
              <ChevronLeft className="h-5 w-5 mr-2" />
              <span>Collapse</span>
            </>
          )}
        </Button>
      </div>
    </aside>
  );
};

export default EmployerSidebar;
