import React from 'react';
import { Link } from 'react-router-dom';
import { Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LogoProps {
  isDark?: boolean;
}

const Logo = ({ isDark = false }: LogoProps) => {
  return (
    <Link to="/" className="flex items-center gap-2.5 group">
      <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
        <Building2 className="h-5 w-5 text-primary-foreground" />
      </div>
      <span className={cn(
        "text-xl font-bold tracking-tight",
        isDark ? "text-white" : "text-foreground"
      )}>
        HIRION
      </span>
    </Link>
  );
};

export default Logo;
