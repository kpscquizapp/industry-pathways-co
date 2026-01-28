import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import Logo from "./header/Logo";
import DesktopNavigation from "./header/DesktopNavigation";
import AuthButtons from "./header/AuthButtons";
import MobileMenuToggle from "./header/MobileMenuToggle";
import MobileMenu from "./header/MobileMenu";
import ThemeToggle from "./header/ThemeToggle";
import ProfileMenu from "./ProfileMenu";
import { useSelector } from "react-redux";

const Header = () => {
  const user = useSelector((state: any) => state.user.userDetails);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "py-2 bg-navy-900/98 backdrop-blur-xl shadow-lg border-b border-white/5"
          : "py-3 bg-navy-900"
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <Logo isDark />
          </div>

          {/* Desktop Navigation - Centered */}
          <div className="hidden lg:flex flex-1 justify-center">
            <DesktopNavigation isDark />
          </div>

          {/* Auth Buttons & Theme Toggle - Right side */}
          <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
            <ThemeToggle isDark />
            <AuthButtons isDark />
          </div>

          {/* User Profile */}
          <div className="hidden lg:flex">
            {user && (
              <ProfileMenu
                btnClass="flex items-center gap-2 px-2 text-white"
                avatarFallback="bg-primary rounded-full text-white"
              />
            )}
          </div>

          {/* Mobile Menu Button & Theme Toggle */}
          <div className="lg:hidden flex items-center gap-2">
            <ThemeToggle isDark />
            {user && (
              <ProfileMenu
                btnClass="flex items-center gap-2 px-2 text-white"
                avatarFallback="bg-primary rounded-full text-white"
              />
            )}
            <MobileMenuToggle
              isOpen={mobileMenuOpen}
              onToggle={toggleMobileMenu}
              isDark
            />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </header>
  );
};

export default Header;
