import React, { useState, useRef, useCallback, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

interface DesktopNavigationProps {
  isDark?: boolean;
}

interface DropdownItem {
  label: string;
  href: string;
  description?: string;
}

interface DropdownSection {
  title?: string;
  items: DropdownItem[];
}

interface NavItemWithDropdown {
  label: string;
  href: string;
  sections: DropdownSection[];
}

const DesktopNavigation = ({ isDark = false }: DesktopNavigationProps) => {
  const { translations } = useLanguage();
  const navigate = useNavigate();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const dropdownRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const itemRefs = useRef<HTMLAnchorElement[]>([]);

  const navItems: NavItemWithDropdown[] = [
    {
      label: translations.candidates,
      href: "/jobs",
      sections: [
        {
          title: "Job Search",
          items: [
            {
              label: "Browse Jobs",
              href: "/jobs",
              description: "Explore opportunities",
            },
            {
              label: "Job Recommendations",
              href: "/job-recommendations",
              description: "AI-powered matches",
            },
            {
              label: "Saved Jobs",
              href: "/saved-jobs",
              description: "Your bookmarked jobs",
            },
          ],
        },
        {
          title: "Career Growth",
          items: [
            {
              label: "Career Path Planner",
              href: "/career-path",
              description: "Plan your journey",
            },
            {
              label: "Skills Assessment",
              href: "/skills-assessment",
              description: "Validate your skills",
            },
            {
              label: "Learning Resources",
              href: "/resources",
              description: "Upskill yourself",
            },
          ],
        },
      ],
    },
    {
      label: translations.talentMarketplace,
      href: "/marketplace",
      sections: [
        {
          title: "Find Talent",
          items: [
            {
              label: "Browse Talent",
              href: "/employer-login",
              description: "Discover professionals",
            },
            {
              label: "Talent Profiles",
              href: "/talent/1",
              description: "View detailed profiles",
            },
            {
              label: "AI Matching",
              href: "/find-talent?ai=true",
              description: "Smart recommendations",
            },
          ],
        },
        {
          title: "Register",
          items: [
            {
              label: "List Your Talent",
              href: "/employer-login",
              description: "Add bench resources",
            },
            {
              label: "Register as Talent",
              href: "/candidate-register",
              description: "Create your profile",
            },
          ],
        },
      ],
    },
    {
      label: translations.employers,
      href: "/employer",
      sections: [
        {
          title: "Hiring",
          items: [
            {
              label: "Post a Job",
              href: "/employer/post-job",
              description: "Create job listings",
            },
            {
              label: "Hire Full-Time",
              href: "/employer/hire-full-time",
              description: "Permanent positions",
            },
            {
              label: "Hire Interns",
              href: "/employer/hire-interns",
              description: "Internship programs",
            },
            {
              label: "Contract Hiring",
              href: "/employer/contract-hiring",
              description: "Flexible contracts",
            },
          ],
        },
        {
          title: "AI Tools",
          items: [
            {
              label: "AI Screening",
              href: "/employer/ai-screening",
              description: "Automated screening",
            },
            {
              label: "AI Interviews",
              href: "/employer/ai-interviews",
              description: "Virtual interviews",
            },
            {
              label: "Analytics",
              href: "/employer/dashboard",
              description: "Hiring insights",
            },
          ],
        },
      ],
    },
    {
      label: translations.services,
      href: "/services",
      sections: [
        {
          title: "For Candidates",
          items: [
            {
              label: "Resume Building",
              href: "/services/resume",
              description: "Professional help",
            },
            {
              label: "Interview Coaching",
              href: "/services/coaching",
              description: "Ace interviews",
            },
            {
              label: "Career Counseling",
              href: "/services/counseling",
              description: "Expert guidance",
            },
          ],
        },
        {
          title: "For Employers",
          items: [
            {
              label: "Recruitment",
              href: "/services/recruitment",
              description: "End-to-end hiring",
            },
            {
              label: "Background Checks",
              href: "/services/background",
              description: "Verify candidates",
            },
            {
              label: "HR Consulting",
              href: "/services/consulting",
              description: "Strategic support",
            },
          ],
        },
      ],
    },
  ];

  // Get all items from current dropdown
  const getAllItems = useCallback(
    (label: string): DropdownItem[] => {
      const item = navItems.find((n) => n.label === label);
      if (!item) return [];
      return item.sections.flatMap((s) => s.items);
    },
    [navItems]
  );

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, itemLabel: string) => {
      const allItems = getAllItems(itemLabel);

      switch (e.key) {
        case "Escape":
          setActiveDropdown(null);
          setFocusedIndex(-1);
          break;
        case "ArrowDown":
          e.preventDefault();
          if (!activeDropdown) {
            setActiveDropdown(itemLabel);
            setFocusedIndex(0);
          } else {
            setFocusedIndex((prev) => Math.min(prev + 1, allItems.length - 1));
          }
          break;
        case "ArrowUp":
          e.preventDefault();
          if (focusedIndex > 0) {
            setFocusedIndex((prev) => prev - 1);
          }
          break;
        case "Enter":
          if (focusedIndex >= 0 && allItems[focusedIndex]) {
            navigate(allItems[focusedIndex].href);
            setActiveDropdown(null);
            setFocusedIndex(-1);
          }
          break;
        case "Tab":
          setActiveDropdown(null);
          setFocusedIndex(-1);
          break;
      }
    },
    [activeDropdown, focusedIndex, getAllItems, navigate]
  );

  // Focus item when index changes
  useEffect(() => {
    if (focusedIndex >= 0 && itemRefs.current[focusedIndex]) {
      itemRefs.current[focusedIndex].focus();
    }
  }, [focusedIndex]);

  // Reset on dropdown change
  useEffect(() => {
    if (!activeDropdown) {
      setFocusedIndex(-1);
      itemRefs.current = [];
    }
  }, [activeDropdown]);

  return (
    <nav className="flex items-center gap-1" role="menubar">
      {navItems.map((item, navIndex) => {
        const allItems = getAllItems(item.label);
        let itemIndex = 0;

        return (
          <div
            key={item.href}
            className="relative"
            onMouseEnter={() => {
              setActiveDropdown(item.label);
              setFocusedIndex(-1);
            }}
            onMouseLeave={() => {
              setActiveDropdown(null);
              setFocusedIndex(-1);
            }}
            ref={(el) => {
              if (el) dropdownRefs.current.set(item.label, el);
            }}
          >
            <button
              className={cn(
                "flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg",
                isDark
                  ? "text-white/80 hover:text-white hover:bg-white/10"
                  : "text-foreground hover:text-primary hover:bg-primary/5",
                activeDropdown === item.label &&
                  (isDark
                    ? "text-white bg-white/10"
                    : "text-primary bg-primary/5")
              )}
              onKeyDown={(e) => handleKeyDown(e, item.label)}
              onClick={() =>
                setActiveDropdown(
                  activeDropdown === item.label ? null : item.label
                )
              }
              aria-expanded={activeDropdown === item.label}
              aria-haspopup="menu"
              role="menuitem"
            >
              {item.label}
              <ChevronDown
                className={cn(
                  "w-3.5 h-3.5 transition-transform duration-200",
                  activeDropdown === item.label && "rotate-180"
                )}
              />
            </button>

            {/* Dropdown Menu */}
            <div
              className={cn(
                "absolute top-full left-1/2 -translate-x-1/2 pt-3 transition-all duration-200 z-50",
                activeDropdown === item.label
                  ? "opacity-100 visible translate-y-0"
                  : "opacity-0 invisible -translate-y-2 pointer-events-none"
              )}
              role="menu"
              aria-label={item.label}
            >
              <div className="bg-navy-900 rounded-xl shadow-2xl border border-white/10 overflow-hidden min-w-[420px]">
                <div className="grid grid-cols-2">
                  {item.sections.map((section, sectionIndex) => (
                    <div
                      key={section.title || sectionIndex}
                      className={cn("p-5", sectionIndex === 1 && "bg-white/5")}
                    >
                      {section.title && (
                        <h3 className="text-[11px] font-semibold text-primary uppercase tracking-wider mb-3 px-2">
                          {section.title}
                        </h3>
                      )}
                      <div className="space-y-0.5">
                        {section.items.map((dropdownItem) => {
                          const currentIndex = itemIndex++;
                          return (
                            <Link
                              key={dropdownItem.href}
                              to={dropdownItem.href}
                              ref={(el) => {
                                if (el) itemRefs.current[currentIndex] = el;
                              }}
                              className={cn(
                                "block px-3 py-2.5 rounded-lg transition-colors group outline-none",
                                focusedIndex === currentIndex
                                  ? "bg-white/10 ring-2 ring-primary/50"
                                  : "hover:bg-white/10"
                              )}
                              onClick={() => {
                                setActiveDropdown(null);
                                setFocusedIndex(-1);
                              }}
                              onKeyDown={(e) => handleKeyDown(e, item.label)}
                              role="menuitem"
                              tabIndex={activeDropdown === item.label ? 0 : -1}
                            >
                              <span className="block text-sm font-medium text-white group-hover:text-primary transition-colors">
                                {dropdownItem.label}
                              </span>
                              {dropdownItem.description && (
                                <span className="block text-xs text-white/50 mt-0.5">
                                  {dropdownItem.description}
                                </span>
                              )}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </nav>
  );
};

export default DesktopNavigation;
