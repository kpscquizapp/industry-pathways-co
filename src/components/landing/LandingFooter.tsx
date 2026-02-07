import { Link } from "react-router-dom";
import { Sparkles, Mail, Phone, Linkedin, Twitter, Github } from "lucide-react";
import { RootState } from "@/app/store";
import { useSelector } from "react-redux";
import { useMemo } from "react";

const LandingFooter = () => {
  const user = useSelector((state: RootState) => state.user.userDetails);

  const footerLinks = useMemo(
    () => ({
      forContractors: {
        title: "For Contractors",
        links: [
          {
            label: "Join Marketplace",
            href:
              user?.role === "candidate"
                ? "/contractor/dashboard"
                : "/candidate-login",
          },
          {
            label: "Skill Tests",
            href:
              user?.role === "candidate"
                ? "/contractor/tests"
                : "/candidate-login",
          },
          {
            label: "AI Interviews",
            href:
              user?.role === "candidate"
                ? "/contractor/interviews"
                : "/candidate-login",
          },
          {
            label: "Profile",
            href:
              user?.role === "candidate"
                ? "/contractor/profile"
                : "/candidate-login",
          },
        ],
      },
      forCompanies: {
        title: "For Companies",
        links: [
          {
            label: "Hire Talent",
            href:
              user?.role === "employer"
                ? "/employer/dashboard"
                : "/employer-login",
          },
          {
            label: "List Bench Resources",
            href: user?.role === "hr" ? "/bench/talent" : "/bench-login",
          },
          {
            label: "Post a Job",
            href:
              user?.role === "employer"
                ? "/employer/dashboard"
                : "/employer-login",
          },
          { label: "Pricing", href: "#pricing" },
        ],
      },
      resources: {
        title: "Resources",
        links: [
          { label: "Documentation", href: "#docs" },
          { label: "API Reference", href: "#api" },
          { label: "Blog", href: "#blog" },
          { label: "Support", href: "#support" },
        ],
      },
      legal: {
        title: "Legal",
        links: [
          { label: "Privacy Policy", href: "#privacy" },
          { label: "Terms of Service", href: "#terms" },
          { label: "Compliance", href: "#compliance" },
          { label: "Security", href: "#security" },
        ],
      },
    }),
    [user?.role],
  );

  return (
    <footer className="bg-navy-900 text-white pt-20 pb-8">
      <div className="container">
        <div className="grid lg:grid-cols-5 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-green-400 rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">HIRION</span>
            </Link>
            <p className="text-white/60 text-sm mb-6">
              AI-Powered Contract Hiring Marketplace. Faster. Smarter.
              Bias-Free.
            </p>

            {/* Contact */}
            <div className="space-y-3">
              <a
                href="mailto:hello@hirion.com"
                className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm"
              >
                <Mail className="w-4 h-4" />
                hello@hirion.com
              </a>
              <a
                href="tel:+1234567890"
                className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm"
              >
                <Phone className="w-4 h-4" />
                +1 (234) 567-890
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([key, section]) => (
            <div key={key}>
              <h4 className="font-semibold text-white mb-4">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith("#") ? (
                      <a
                        href={link.href}
                        className="text-white/60 hover:text-white transition-colors text-sm"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        to={link.href}
                        className="text-white/60 hover:text-white transition-colors text-sm"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/40 text-sm">
            © {new Date().getFullYear()} HIRION. All rights reserved.
          </p>

          {/* Social links */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              aria-label="LinkedIn"
              className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              <Linkedin className="w-4 h-4 text-white/60" />
            </button>
            <button
              type="button"
              aria-label="Twitter"
              className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              <Twitter className="w-4 h-4 text-white/60" />
            </button>
            <button
              type="button"
              aria-label="Github"
              className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              <Github className="w-4 h-4 text-white/60" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
