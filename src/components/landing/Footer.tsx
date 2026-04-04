import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import logo from "@/assets/White Option.png";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";

type FooterLink = {
  label: string;
  href: string;
};

const SOCIALS = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/quickrekruit/",
  },
];

export default function Footer() {


  const userDetails = useSelector((state: RootState) => state.user.userDetails);
  const isCandidate = userDetails?.role === "candidate";
  const loginPath = isCandidate ? "/contractor/dashboard" : "/contractor-signup";

  const FOOTER_COLS: { heading: string; links: FooterLink[] }[] = [
    {
      heading: "Product",
      links: [
        { label: "How It Works", href: "#how-it-works" },
        { label: "Features", href: "#ai-hiring" },
      ],
    },
    {
      heading: "Company",
      links: [
        { label: "About", href: "#about" },
        { label: "Careers", href: loginPath },
      ],
    },
    {
      heading: "Legal",
      links: [
        { label: "Privacy", href: "/privacy" },
        { label: "Terms", href: "/terms" },
      ],
    },
    {
      heading: "Contact",
      links: [
        { label: "Email : hello@quickrekruit.com", href: "mailto:hello@quickrekruit.com" },
        { label: "Phone : +917736805150", href: "tel:+917736805150" },
      ],
    },
  ];


  return (
    <footer
      id="contact"
      className="border-t border-gray-100 overflow-hidden scroll-mt-10 bg-[#121212]"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-[1450px] mx-auto px-6 sm:px-8 pt-12 pb-7"
      >
        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-[2fr_1fr_1fr_1fr_1.5fr] gap-x-8 gap-y-10">
          {/* Brand */}
          <div className="flex flex-col">
            <Link to="/" className="flex items-center no-underline -ml-1">
              <img src={logo} alt="logo" className="w-32 h-auto" />
            </Link>
            <p className="text-sm text-gray-400 mt-3 leading-relaxed max-w-[240px]">
              AI-powered contract hiring platform. Match, validate, and deploy
              talent faster.
            </p>
          </div>

          {/* Link columns */}
          {FOOTER_COLS.map((col) => (
            <div key={col.heading} className="flex flex-col">
              <h4 className="text-xs font-bold text-gray-900 mb-4 uppercase tracking-wider text-white/85">
                {col.heading}
              </h4>
              <div className="flex flex-col">
                {col.links.map((link) => (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-[#1d6685] transition-colors w-fit md:mb-3"
                    whileHover={{ x: 3 }}
                  >
                    {link.label}
                  </motion.a>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-5 border-t border-gray-200/10 flex flex-col sm:flex-row justify-between items-center gap-3">
          <span className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} QuickRekruit. All rights reserved.
          </span>
          <div className="flex gap-5">
            {SOCIALS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-gray-400 no-underline hover:text-[#1d6685] transition-colors"
              >
                {social.label}
              </a>
            ))}
          </div>
        </div>
      </motion.div>
    </footer>
  );
}
