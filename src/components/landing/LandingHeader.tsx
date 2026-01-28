import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Sparkles, 
  Menu, 
  X, 
  User, 
  Building2, 
  Briefcase,
  ChevronDown,
  LogIn
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useSelector } from 'react-redux';

const LandingHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const user = useSelector((state: any) => state.user.userDetails);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHomePage = location.pathname === '/';
  const headerBg = isScrolled || !isHomePage 
    ? 'bg-background/95 backdrop-blur-xl border-b border-border shadow-sm' 
    : 'bg-transparent';
  const textColor = isScrolled || !isHomePage ? 'text-foreground' : 'text-white';

  return (
    <header className={cn('fixed top-0 left-0 right-0 z-50 transition-all duration-300', headerBg)}>
      <div className="container">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-gradient-to-br from-primary to-green-400 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className={cn('text-xl font-bold tracking-tight', textColor)}>
              HIRION
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <Link 
              to="/" 
              className={cn('px-4 py-2 rounded-lg font-medium transition-colors', textColor, 'hover:bg-primary/10')}
            >
              Home
            </Link>

            {/* How It Works */}
            <DropdownMenu>
              <DropdownMenuTrigger className={cn('flex items-center gap-1 px-4 py-2 rounded-lg font-medium transition-colors', textColor, 'hover:bg-primary/10')}>
                How It Works
                <ChevronDown className="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-56 bg-card border border-border">
                <DropdownMenuItem asChild>
                  <Link to="/contractor/dashboard" className="flex items-center gap-3 p-3">
                    <User className="w-4 h-4 text-primary" />
                    <div>
                      <p className="font-medium">For Contractors</p>
                      <p className="text-xs text-muted-foreground">Find your next gig</p>
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/bench/dashboard" className="flex items-center gap-3 p-3">
                    <Building2 className="w-4 h-4 text-primary" />
                    <div>
                      <p className="font-medium">For Bench Resources</p>
                      <p className="text-xs text-muted-foreground">List your talent</p>
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/employer/dashboard" className="flex items-center gap-3 p-3">
                    <Briefcase className="w-4 h-4 text-primary" />
                    <div>
                      <p className="font-medium">For Hiring Companies</p>
                      <p className="text-xs text-muted-foreground">Hire top talent</p>
                    </div>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link 
              to="#pricing" 
              className={cn('px-4 py-2 rounded-lg font-medium transition-colors', textColor, 'hover:bg-primary/10')}
            >
              Pricing
            </Link>
          </nav>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <Button asChild variant="default" size="sm" className="rounded-xl">
                <Link to="/employer/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button 
                  asChild 
                  variant="ghost" 
                  size="sm" 
                  className={cn('rounded-xl', textColor, isScrolled || !isHomePage ? 'hover:bg-muted' : 'hover:bg-white/10')}
                >
                  <Link to="/login">
                    <LogIn className="w-4 h-4 mr-2" />
                    Login
                  </Link>
                </Button>
                <Button asChild size="sm" className="rounded-xl bg-primary hover:bg-primary/90">
                  <Link to="/employer-signup">Start Hiring</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={cn('md:hidden p-2 rounded-lg', textColor, 'hover:bg-primary/10')}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background border-t border-border">
          <div className="container py-4 space-y-2">
            <Link 
              to="/" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-4 py-3 rounded-lg font-medium text-foreground hover:bg-muted"
            >
              Home
            </Link>
            <Link 
              to="/contractor/dashboard" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-4 py-3 rounded-lg font-medium text-foreground hover:bg-muted"
            >
              For Contractors
            </Link>
            <Link 
              to="/bench/dashboard" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-4 py-3 rounded-lg font-medium text-foreground hover:bg-muted"
            >
              For Bench Resources
            </Link>
            <Link 
              to="/employer/dashboard" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-4 py-3 rounded-lg font-medium text-foreground hover:bg-muted"
            >
              For Hiring Companies
            </Link>
            
            <div className="pt-4 border-t border-border space-y-2">
              {user ? (
                <Button asChild className="w-full rounded-xl">
                  <Link to="/employer/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                    Dashboard
                  </Link>
                </Button>
              ) : (
                <>
                  <Button asChild variant="outline" className="w-full rounded-xl">
                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                      Login
                    </Link>
                  </Button>
                  <Button asChild className="w-full rounded-xl">
                    <Link to="/employer-signup" onClick={() => setIsMobileMenuOpen(false)}>
                      Start Hiring
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default LandingHeader;
