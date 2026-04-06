import { useState, useEffect, type MouseEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import logo from "@/assets/Dark Option.png";
import { Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";

const NAV_LINKS = [
  { label: "About", target: "#about" },
  { label: "How It Works", target: "#how-it-works" },
  { label: "Contact", target: "#contact" },
] as const;

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const userDetails = useSelector((state: RootState) => state.user.userDetails);
  const isCandidate = userDetails?.role === "candidate";
  const loginPath = isCandidate ? "/contractor/dashboard" : "/contractor-login";
  const loginLabel = isCandidate ? "Dashboard" : "Login";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMobileMenu = () => setMobileOpen(false);

  const handleMobileAnchorClick = (
    event: MouseEvent<HTMLAnchorElement>,
    target: string,
  ) => {
    event.preventDefault();
    closeMobileMenu();

    window.setTimeout(() => {
      const targetId = target.slice(1);
      document.getElementById(targetId)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      window.history.replaceState(null, "", target);
    }, 0);
  };

  const handleMobileLoginClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    closeMobileMenu();
    window.setTimeout(() => navigate(loginPath), 0);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-300 ${scrolled ? "bg-white/95 backdrop-blur-md shadow-sm" : "bg-white"
          }`}
      >
        <div className="max-w-[1450px] mx-auto px-6 sm:px-8 py-4 flex items-center justify-between">
          {/* Logo */}
          <motion.a
            href="#"
            className="flex items-center no-underline"
            whileHover={{ scale: 1.02 }}
          >
            <img src={logo} alt="logo" className="w-32 sm:w-44 h-auto" />
          </motion.a>

          {/* Desktop nav links */}
          <div className="nav-desktop flex items-center gap-8">
            {NAV_LINKS.map(({ label, target }) => (
              <motion.a
                key={label}
                href={target}
                className="nav-link"
                whileHover={{ y: -1 }}
              >
                {label}
              </motion.a>
            ))}
          </div>

          {/* CTA button */}
          <div className="nav-desktop flex items-center gap-4">
            <Link
              className="nav-desktop bg-gray-900 text-white border-none rounded-full px-6 py-2.5 text-sm font-semibold cursor-pointer font-body transition-colors hover:text-[#38BDF8]/80"
              to={loginPath}
            >
              {loginLabel}
            </Link>
            {
              !isCandidate && (
                <Link
                  className="nav-desktop bg-gray-900 text-white border-none rounded-full px-6 py-2.5 text-sm font-semibold cursor-pointer font-body transition-colors hover:text-[#38BDF8]/80"
                  to="/contractor-signup"
                >
                  Sign Up
                </Link>
              )
            }
          </div>

          {/* Mobile hamburger */}
          <button
            className="nav-mobile-btn hidden bg-transparent border-none cursor-pointer text-xl text-gray-900 flex items-center justify-center"
            onClick={() => setMobileOpen((prev) => !prev)}
            type="button"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="px-8 pb-6 bg-white border-t border-gray-100 flex flex-col gap-4 overflow-hidden py-12"
            >
              {NAV_LINKS.map(({ label, target }) => (
                <a
                  key={label}
                  href={target}
                  onClick={(event) => handleMobileAnchorClick(event, target)}
                  className="text-gray-500 no-underline text-base font-medium"
                >
                  {label}
                </a>
              ))}
              <Link
                className="bg-gray-900 text-white border-none rounded-full px-6 py-3 text-sm font-semibold cursor-pointer font-body text-center"
                to={loginPath}
                onClick={handleMobileLoginClick}
              >
                {loginLabel}
              </Link>
              {
                !isCandidate && (
                  <Link
                    className="bg-gray-900 text-white border-none rounded-full px-6 py-3 text-sm font-semibold cursor-pointer font-body text-center"
                    to="/contractor-signup"
                  >
                    Sign Up
                  </Link>
                )
              }
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}
