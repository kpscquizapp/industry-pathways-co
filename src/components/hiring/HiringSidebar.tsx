import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard,
  Briefcase,
  Users,
  ClipboardCheck,
  Video,
  ChevronLeft,
  ChevronRight,
  Brain
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HiringSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const menuItems = [
  { title: 'Dashboard', icon: LayoutDashboard, path: '/hiring-dashboard' },
  { title: 'Job Board', icon: Briefcase, path: '/hiring-dashboard/jobs' },
  { title: 'AI Matched Candidates', icon: Brain, path: '/hiring-dashboard/ai-candidates', isAI: true },
  { title: 'Schedule Skill Test', icon: ClipboardCheck, path: '/hiring-dashboard/skill-tests' },
  { title: 'AI Interviews', icon: Video, path: '/hiring-dashboard/interviews' },
];

const HiringSidebar: React.FC<HiringSidebarProps> = ({ collapsed, onToggle }) => {
  const location = useLocation();

  return (
    <div 
      className={cn(
        "sticky top-0 h-screen bg-gradient-to-b from-indigo-950 via-purple-950 to-slate-900 text-white flex flex-col transition-all duration-300 shadow-2xl",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="p-4 border-b border-white/10">
        <Link to="/hiring-dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
            <Briefcase className="h-5 w-5 text-white" />
          </div>
          {!collapsed && (
            <div>
              <span className="font-bold text-lg tracking-tight">HIRION</span>
              <p className="text-[10px] text-indigo-300 -mt-1">Hiring Portal</p>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || 
            (item.path !== '/hiring-dashboard' && location.pathname.startsWith(item.path));

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative",
                isActive 
                  ? "bg-gradient-to-r from-indigo-500/30 to-purple-500/20 text-white shadow-lg" 
                  : "text-slate-300 hover:bg-white/10 hover:text-white"
              )}
            >
              <div className={cn(
                "p-1.5 rounded-lg transition-colors",
                isActive ? "bg-gradient-to-br from-indigo-500 to-purple-600" : "bg-white/5 group-hover:bg-white/10",
                item.isAI && "ring-1 ring-purple-400/50"
              )}>
                <Icon className={cn("h-4 w-4", isActive && "text-white")} />
              </div>
              {!collapsed && (
                <span className="font-medium text-sm">{item.title}</span>
              )}
              {item.isAI && !collapsed && (
                <span className="ml-auto px-1.5 py-0.5 text-[10px] bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full font-semibold">
                  AI
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Collapse Button */}
      <div className="p-3 border-t border-white/10">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="w-full justify-center text-slate-400 hover:text-white hover:bg-white/10"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
};

export default HiringSidebar;
