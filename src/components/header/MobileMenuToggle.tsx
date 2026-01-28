import React from 'react';
import { cn } from '@/lib/utils';

interface MobileMenuToggleProps {
  isOpen: boolean;
  onToggle: () => void;
  isDark?: boolean;
}

const MobileMenuToggle = ({ isOpen, onToggle, isDark = false }: MobileMenuToggleProps) => {
  return (
    <button
      onClick={onToggle}
      className={cn(
        "w-10 h-10 flex items-center justify-center rounded-lg transition-colors",
        isDark 
          ? "text-white hover:bg-white/10" 
          : "text-foreground hover:bg-neutral-100"
      )}
      aria-label="Toggle menu"
    >
      <div className="w-5 h-4 flex flex-col justify-between">
        <span className={cn(
          "block h-0.5 rounded-full transition-all duration-300",
          isDark ? "bg-white" : "bg-foreground",
          isOpen && "rotate-45 translate-y-1.5"
        )} />
        <span className={cn(
          "block h-0.5 rounded-full transition-all duration-300",
          isDark ? "bg-white" : "bg-foreground",
          isOpen && "opacity-0"
        )} />
        <span className={cn(
          "block h-0.5 rounded-full transition-all duration-300",
          isDark ? "bg-white" : "bg-foreground",
          isOpen && "-rotate-45 -translate-y-1.5"
        )} />
      </div>
    </button>
  );
};

export default MobileMenuToggle;