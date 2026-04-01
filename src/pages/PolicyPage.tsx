import { Link, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  FileText,
  Lock,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import logo from "@/assets/Dark Option.png";

type PolicySection = {
  title: string;
  body: string;
};

type PolicyContent = {
  badge: string;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  sections: PolicySection[];
};

const POLICY_CONTENT: Record<"/privacy" | "/terms" | "/security", PolicyContent> =
  {
    "/privacy": {
      badge: "Privacy",
      title: "Privacy Policy",
      subtitle:
        "How QuickRekruit collects, uses, and protects information across the platform.",
      icon: Lock,
      sections: [
        {
          title: "Information we collect",
          body: "We may store account details, profile information, resume and job data, and platform activity needed to run matching, registration, and hiring workflows.",
        },
        {
          title: "How we use it",
          body: "We use information to create accounts, power search and matching, improve the product, communicate with users, and keep the platform reliable.",
        },
        {
          title: "Your choices",
          body: "You can update profile details, manage communications through your account settings, and reach out through the contact section if you need help.",
        },
      ],
    },
    "/terms": {
      badge: "Terms",
      title: "Terms of Service",
      subtitle: "The basic rules for using QuickRekruit and its hiring tools.",
      icon: FileText,
      sections: [
        {
          title: "Using the service",
          body: "Use the platform for lawful recruiting, job search, and career activities only. You agree not to misuse the service or interfere with other users.",
        },
        {
          title: "Accounts and content",
          body: "You are responsible for the accuracy of the information you submit and for keeping your login credentials secure.",
        },
        {
          title: "Availability and changes",
          body: "We may update features, workflows, or availability as the product evolves. We will continue to improve the experience and surface clear product changes.",
        },
      ],
    },
    "/security": {
      badge: "Security",
      title: "Security",
      subtitle: "How we think about account protection and platform safeguards.",
      icon: ShieldCheck,
      sections: [
        {
          title: "Account protection",
          body: "Use a strong password, keep your credentials private, and review account activity regularly. Additional protections can be added as the platform grows.",
        },
        {
          title: "Data safeguards",
          body: "We use access controls and operational safeguards to reduce exposure and keep platform data available only to the right people and systems.",
        },
        {
          title: "Reporting issues",
          body: "If you suspect unauthorized access or a security issue, contact the team right away through the home page contact section.",
        },
      ],
    },
  };

export default function PolicyPage() {
  const { pathname } = useLocation();
  const policy =
    POLICY_CONTENT[pathname as "/privacy" | "/terms" | "/security"] ??
    POLICY_CONTENT["/privacy"];
  const Icon = policy.icon;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(29,102,133,0.06),_transparent_36%),linear-gradient(to_bottom,#ffffff,#f9fafb)] text-gray-900">
      <div className="mx-auto max-w-4xl px-6 py-8 sm:py-10">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center no-underline">
            <img src={logo} alt="QuickRekruit" className="w-32 h-auto" />
          </Link>
          <Link
            to="/#contact"
            className="text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
          >
            Contact
          </Link>
        </div>

        <main className="mt-8 overflow-hidden rounded-[28px] border border-gray-200 bg-white/95 shadow-[0_24px_80px_-32px_rgba(0,0,0,0.2)] backdrop-blur">
          <div className="border-b border-gray-100 px-6 py-8 sm:px-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-gray-500">
              <Icon className="h-3.5 w-3.5" />
              {policy.badge}
            </div>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              {policy.title}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-500 sm:text-base">
              {policy.subtitle}
            </p>
          </div>

          <div className="grid gap-4 px-6 py-8 sm:px-8">
            {policy.sections.map((section) => (
              <section
                key={section.title}
                className="rounded-2xl border border-gray-100 bg-gray-50/60 p-5 sm:p-6"
              >
                <h2 className="text-base font-semibold text-gray-900">
                  {section.title}
                </h2>
                <p className="mt-2 text-sm leading-7 text-gray-600 sm:text-[15px]">
                  {section.body}
                </p>
              </section>
            ))}
          </div>

          <div className="border-t border-gray-100 px-6 py-6 sm:px-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-gray-500">
                Questions about this page? Use the home page contact section and
                we will get back to you.
              </p>
              <Link
                to="/#contact"
                className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gray-800"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to home
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
