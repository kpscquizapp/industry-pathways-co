import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Menu,
  X,
  User,
  Building2,
  Briefcase,
  ChevronDown,
  LogIn,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";

const LandingHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const user = useSelector((state: RootState) => state.user.userDetails);
  const navigation = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const headerBg = isScrolled
    ? "bg-navy-900/80 backdrop-blur-xl border-b border-white/10 shadow-lg"
    : "bg-transparent";
  const textColor = isSolidHeader ? "text-slate-900 dark:text-white" : "text-white";
  const ghostHoverBg = isSolidHeader ? "hover:bg-slate-900/10 dark:hover:bg-white/10" : "hover:bg-white/10";

  const handleRoleBasedNavigation = (role: string) => {
    if (!role) return;
    if (role === "employer") navigation("/employer-dashboard");
    if (role === "hr") navigation("/bench/dashboard");
    if (role === "candidate") navigation("/contractor/dashboard");
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        headerBg,
      )}
    >
      <div className="container">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-gradient-to-br from-primary to-green-400 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className={cn("text-xl font-bold tracking-tight", textColor)}>
              HIRION
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className={cn(
                "px-4 py-2 rounded-lg font-medium transition-colors",
                textColor,
                "hover:bg-primary/10",
              )}
            >
              Home
            </Link>

            {/* How It Works */}
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger
                className={cn(
                  "flex items-center gap-1 px-4 py-2 rounded-lg font-medium transition-colors",
                  textColor,
                  "hover:bg-primary/10",
                )}
              >
                How It Works
                <ChevronDown className="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="center"
                sideOffset={8}
                className="w-56 bg-card border border-border shadow-lg z-[100]"
              >
                <DropdownMenuItem asChild>
                  <Link
                    to={`${user?.role === "candidate" ? "/contractor/dashboard" : "/candidate-signup"}`}
                    className="flex items-center gap-3 p-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <User className="w-4 h-4 text-primary" />
                    <div>
                      <p className="font-medium">For Contractors</p>
                      <p className="text-xs text-muted-foreground">
                        Find your next gig
                      </p>
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    to={`${user?.role === "hr" ? "/bench/dashboard" : "/bench-registration"}`}
                    className="flex items-center gap-3 p-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Building2 className="w-4 h-4 text-primary" />
                    <div>
                      <p className="font-medium">For Bench Resources</p>
                      <p className="text-xs text-muted-foreground">
                        List your talent
                      </p>
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    to={`${user?.role === "employer" ? "/employer-dashboard" : "/employer-signup"}`}
                    className="flex items-center gap-3 p-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Briefcase className="w-4 h-4 text-primary" />
                    <div>
                      <p className="font-medium">For Hiring Companies</p>
                      <p className="text-xs text-muted-foreground">
                        Hire top talent
                      </p>
                    </div>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link
              to="#pricing"
              className={cn(
                "px-4 py-2 rounded-lg font-medium transition-colors",
                textColor,
                "hover:bg-primary/10",
              )}
            >
              Pricing
            </Link>
          </nav>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <Button
                variant="default"
                size="sm"
                className="rounded-xl"
                onClick={() => handleRoleBasedNavigation(user.role)}
              >
                Dashboard
              </Button>
            ) : (
              <>
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className={cn("rounded-xl", textColor, ghostHoverBg)}
                >
                  <Link to="/employer-login">
                    <LogIn className="w-4 h-4 mr-2" />
                    Login
                  </Link>
                </Button>
                <Button
                  asChild
                  size="sm"
                  className="rounded-xl bg-primary hover:bg-primary/90"
                >
                  <Link to="/employer-signup">Hire Talent</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={cn(
              "md:hidden p-2 rounded-lg",
              textColor,
              "hover:bg-primary/10",
            )}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
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
              to={`${user?.role === "candidate" ? "/contractor/dashboard" : "/candidate-signup"}`}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-4 py-3 rounded-lg font-medium text-foreground hover:bg-muted"
            >
              For Contractors
            </Link>
            <Link
              to={`${user?.role === "hr" ? "/bench/dashboard" : "/bench-registration"}`}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-4 py-3 rounded-lg font-medium text-foreground hover:bg-muted"
            >
              For Bench Resources
            </Link>
            <Link
              to={`${user?.role === "employer" ? "/employer-dashboard" : "/employer-signup"}`}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-4 py-3 rounded-lg font-medium text-foreground hover:bg-muted"
            >
              For Hiring Companies
            </Link>

            <div className="pt-4 border-t border-border space-y-2">
              {user ? (
                <Button
                  className="w-full rounded-xl"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleRoleBasedNavigation(user.role);
                  }}
                >
                  Dashboard
                </Button>
              ) : (
                <>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full rounded-xl"
                  >
                    <Link
                      to="/employer-login"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Login
                    </Link>
                  </Button>
                  <Button asChild className="w-full rounded-xl">
                    <Link
                      to="/employer-signup"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Hire Talent
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
