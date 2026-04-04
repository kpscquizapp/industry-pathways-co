import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Scale,
  Scale as Law,
  Users,
  Briefcase,
  ShieldAlert,
  Cpu,
  Layers,
  CreditCard,
  Lock,
  AlertTriangle,
  Gavel,
  XCircle,
  Globe,
  Info,
  ShieldCheck,
  Mail,
  MapPin,
} from "lucide-react";
import logo from "@/assets/Dark Option.png";

const SECTIONS = [
  { id: "introduction", title: "Introduction" },
  { id: "definitions", title: "1. Definitions" },
  { id: "eligibility", title: "2. Eligibility" },
  { id: "services", title: "3. Platform Services" },
  { id: "obligations", title: "4. User Obligations" },
  { id: "ai-services", title: "5. AI Services" },
  { id: "intellectual-property", title: "6. Intellectual Property" },
  { id: "payments", title: "7. Fees & Payments" },
  { id: "confidentiality", title: "8. Confidentiality" },
  { id: "disclaimers", title: "9. Disclaimers" },
  { id: "indemnification", title: "10. Indemnification" },
  { id: "termination", title: "11. Termination" },
  { id: "compliance", title: "12. Legal Compliance" },
  { id: "dispute-resolution", title: "13. Dispute Resolution" },
  { id: "general", title: "14. General Provisions" },
];

export default function TermsService() {
  return (
    <div id="top" className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <img src={logo} alt="Quick Recruit" className="h-12 w-auto" />
          </Link>
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="flex items-center gap-1.5 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back to Home</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-12 lg:flex-row">
          {/* Sidebar Navigation */}
          <aside className="hidden w-64 shrink-0 lg:block">
            <div className="sticky top-28 space-y-1">
              <p className="mb-4 px-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                Terms of Service
              </p>
              <nav className="flex flex-col gap-1">
                {SECTIONS.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="rounded-lg px-3 py-2 text-sm text-slate-600 transition-all hover:bg-slate-100 hover:text-slate-900"
                  >
                    {section.title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Content */}
          <div className="max-w-3xl flex-1">
            <div className="mb-12">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white ring-1 ring-inset ring-slate-900/20">
                <Scale className="h-3 w-3" />
                Legal Agreement
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
                Terms and Conditions
              </h1>
              <p className="mt-4 text-lg font-medium text-slate-700">
                PLEASE READ THESE TERMS AND CONDITIONS CAREFULLY BEFORE USING THE QUICK RECRUIT PLATFORM.
              </p>
              {/* <p className="mt-2 text-slate-600">
                Effective Date: April 4, 2024
              </p> */}
            </div>

            <div className="space-y-16">
              {/* Introduction */}
              <section id="introduction" className="scroll-mt-28">
                <div className="rounded-2xl bg-amber-50 p-6 ring-1 ring-inset ring-amber-600/10">
                  <p className="text-sm font-semibold leading-relaxed text-amber-900">
                    BY REGISTERING, ACCESSING, OR USING OUR SERVICES, YOU AGREE TO BE LEGALLY BOUND BY THESE TERMS. IF YOU DO NOT AGREE, YOU MUST NOT USE THE PLATFORM.
                  </p>
                </div>
              </section>

              {/* 1. Definitions and Interpretation */}
              <section id="definitions" className="scroll-mt-28">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="rounded-lg bg-slate-100 p-2 text-slate-600">
                    <Info className="h-5 w-5" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">1. Definitions and Interpretation</h2>
                </div>
                <div className="mt-6 space-y-4 text-base leading-relaxed text-slate-600">
                  <p>In these Terms and Conditions, the following terms shall have the meanings assigned to them below:</p>
                  <ul className="grid gap-4">
                    <li className="flex flex-col gap-1">
                      <span className="font-bold text-slate-900">"Platform"</span>
                      <span>Quick Recruit website, mobile application, APIs, and all associated services operated by Quick Recruit.</span>
                    </li>
                    <li className="flex flex-col gap-1">
                      <span className="font-bold text-slate-900">"Quick Recruit", "we", "us", or "our"</span>
                      <span>The company operating the Quick Recruit Platform.</span>
                    </li>
                    <li className="flex flex-col gap-1">
                      <span className="font-bold text-slate-900">"User"</span>
                      <span>Any individual or entity that accesses or uses the Platform, including Employers and Candidates.</span>
                    </li>
                    <li className="flex flex-col gap-1">
                      <span className="font-bold text-slate-900">"Employer"</span>
                      <span>Any company, HR professional, hiring manager, or individual using the Platform to post jobs and hire talent.</span>
                    </li>
                    <li className="flex flex-col gap-1">
                      <span className="font-bold text-slate-900">"Candidate"</span>
                      <span>Any individual contractor, freelancer, IT professional, or bench resource registered on the Platform seeking employment or project engagements.</span>
                    </li>
                    <li className="flex flex-col gap-1">
                      <span className="font-bold text-slate-900">"Bench Resource"</span>
                      <span>A Candidate employed by a company but currently available for external deployment and listed on the Platform by their employer's HR team.</span>
                    </li>
                    <li className="flex flex-col gap-1">
                      <span className="font-bold text-slate-900">"AI Services"</span>
                      <span>Proprietary artificial intelligence tools including semantic matching, skill gap analysis, automated assessments, and AI interview scoring.</span>
                    </li>
                  </ul>
                </div>
              </section>

              {/* 2. Eligibility and Account Registration */}
              <section id="eligibility" className="scroll-mt-28">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="rounded-lg bg-slate-100 p-2 text-slate-600">
                    <Users className="h-5 w-5" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">2. Eligibility and Account Registration</h2>
                </div>
                <div className="mt-6 space-y-6 text-base leading-relaxed text-slate-600">
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-slate-900">2.1 Eligibility Requirements</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>You must be at least 18 years of age.</li>
                      <li>If registering on behalf of a company, you must have the legal authority to bind that entity.</li>
                      <li>You must be legally permitted to work or hire in the jurisdiction(s) in which you are operating.</li>
                      <li>You must not be subject to any sanctions or restrictions under Indian or UAE law.</li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-slate-900">2.2 Account Registration</h3>
                    <p>To access core features, you must create a verified account. You agree to:</p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Provide accurate, complete, and up-to-date information.</li>
                      <li>Maintain only one active account per individual or entity.</li>
                      <li>Not share your account credentials with anyone else.</li>
                      <li>Notify us immediately of any suspected unauthorised access.</li>
                    </ul>
                  </div>

                  <div className="rounded-xl bg-blue-50 p-6 ring-1 ring-inset ring-blue-600/10">
                    <h3 className="text-sm font-bold text-blue-900 uppercase tracking-wider mb-2">2.3 HR-Managed Bench Resources</h3>
                    <p className="text-sm text-blue-800 leading-relaxed">
                      HR professionals registering bench resources warrant they have authorisation, have obtained all required consents, and listed individuals are aware of their profile being visible.
                    </p>
                  </div>
                </div>
              </section>

              {/* 3. Platform Services */}
              <section id="services" className="scroll-mt-28">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="rounded-lg bg-slate-100 p-2 text-slate-600">
                    <Briefcase className="h-5 w-5" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">3. Platform Services</h2>
                </div>
                <div className="mt-6 space-y-6 text-base leading-relaxed text-slate-600">
                  <div className="grid gap-4 sm:grid-cols-2">
                    {[
                      "Job Posting & Match Alerts",
                      "Candidate Marketplace Access",
                      "AI Semantic Resume Matching",
                      "AI Skill Gap Analysis",
                      "Automated Skill Assessments",
                      "AI Interview Scoring",
                      "Bias-Reduced Ranking",
                      "Rapid Contractor Deployment"
                    ].map(service => (
                      <div key={service} className="rounded-xl border border-slate-200 p-4 font-medium text-slate-700"> {service} </div>
                    ))}
                  </div>

                  <div className="mt-8 space-y-4">
                    <h3 className="text-xl font-bold text-slate-900">3.2 Nature of Services</h3>
                    <p>
                      Quick Recruit is a technology platform that facilitates connections. We are <strong>NOT</strong> a staffing agency, employment agency, or party to any employment contract. All hiring decisions are made solely by Employers.
                    </p>
                    <p className="rounded-lg border-l-4 border-slate-900 bg-slate-100 p-4 text-sm font-medium">
                      Quick Recruit acts as a technology intermediary. Any employment or contractor engagement is directly between the Employer and Candidate.
                    </p>
                  </div>
                </div>
              </section>

              {/* 4. User Obligations */}
              <section id="obligations" className="scroll-mt-28">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="rounded-lg bg-slate-100 p-2 text-slate-600">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">4. User Obligations and Acceptable Use</h2>
                </div>
                <div className="mt-6 space-y-8 text-base leading-relaxed text-slate-600">
                  <div className="space-y-4">
                    <h3 className="font-bold text-slate-900">4.1 General Obligations</h3>
                    <ul className="grid gap-2 pl-5 list-disc text-sm">
                      <li>Use for lawful recruitment purposes in India and UAE.</li>
                      <li>Provide truthful information.</li>
                      <li>No reverse-engineering of AI systems.</li>
                      <li>No scraping or automated data extraction.</li>
                      <li>No malware, spam, or impersonation.</li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-bold text-slate-900">4.2 Employer-Specific</h3>
                    <ul className="grid gap-2 pl-5 list-disc text-sm">
                      <li>Post only genuine, current job opportunities.</li>
                      <li>Comply with labour and anti-discrimination laws.</li>
                      <li>No unauthorized sharing of Candidate data.</li>
                      <li>AI outputs must be one part of a human-reviewed process.</li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-bold text-slate-900">4.3 Candidate-Specific</h3>
                    <ul className="grid gap-2 pl-5 list-disc text-sm">
                      <li>Profiles must accurately reflect qualifications.</li>
                      <li>Complete assessments independently without assistance or AI.</li>
                      <li>Keep availability status updated.</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* 5. AI Services */}
              <section id="ai-services" className="scroll-mt-28">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="rounded-lg bg-slate-100 p-2 text-slate-600">
                    <Cpu className="h-5 w-5" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">5. AI Services — Terms and Limitations</h2>
                </div>
                <div className="mt-6 space-y-6 text-base leading-relaxed text-slate-600">
                  <div className="rounded-2xl border border-slate-200 p-6 space-y-4">
                    <h3 className="font-bold text-slate-900">Decision-Support Tools</h3>
                    <p className="text-sm">
                      All AI-generated outputs are informational tools to support, not replace, human judgment. Quick Recruit expressly disclaims liability arising from hiring decisions made based on AI outputs.
                    </p>
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      <div className="rounded-xl bg-slate-50 p-4 text-xs">
                        <span className="font-bold block mb-1 uppercase">Accuracy</span>
                        AI models may produce imperfect results. Users should apply professional judgment.
                      </div>
                      <div className="rounded-xl bg-slate-50 p-4 text-xs">
                        <span className="font-bold block mb-1 uppercase">Integrity</span>
                        Cheating on AI assessments results in a permanent ban from the Platform.
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* 6. Intellectual Property */}
              <section id="intellectual-property" className="scroll-mt-28">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="rounded-lg bg-slate-100 p-2 text-slate-600">
                    <Layers className="h-5 w-5" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">6. Intellectual Property</h2>
                </div>
                <div className="mt-6 space-y-6 text-base leading-relaxed text-slate-600">
                  <div className="space-y-4">
                    <h3 className="font-bold text-slate-900 underline decoration-slate-200 underline-offset-4">Quick Recruit's IP</h3>
                    <p className="text-sm">
                      Algorithms, software, design, and branding are the exclusive IP of Quick Recruit, protected under Indian and UAE laws.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-bold text-slate-900 underline decoration-slate-200 underline-offset-4">User-Submitted Content</h3>
                    <p className="text-sm">
                      You retain ownership of Content you submit, but grant us a license to use, store, and process it to provide services.
                    </p>
                  </div>
                </div>
              </section>

              {/* 7. Fees, Payment, and Subscriptions */}
              <section id="payments" className="scroll-mt-28">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="rounded-lg bg-slate-100 p-2 text-slate-600">
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">7. Fees, Payment, and Subscriptions</h2>
                </div>
                <div className="mt-6 space-y-6 text-base leading-relaxed text-slate-600">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 p-6">
                      <h3 className="font-bold text-slate-900 mb-2">Currency</h3>
                      <p className="text-sm">Charged in INR for India and AED for UAE. All payments are non-refundable.</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 p-6">
                      <h3 className="font-bold text-slate-900 mb-2">Taxes</h3>
                      <p className="text-sm">Exclusive of GST in India and VAT in UAE. Tax amounts will be displayed at checkout.</p>
                    </div>
                  </div>
                  <p className="text-sm italic">
                    Subscriptions automatically renew unless cancelled at least 7 days before the renewal date.
                  </p>
                </div>
              </section>

              {/* 8. Confidentiality */}
              <section id="confidentiality" className="scroll-mt-28">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="rounded-lg bg-slate-100 p-2 text-slate-600">
                    <Lock className="h-5 w-5" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">8. Confidentiality</h2>
                </div>
                <div className="mt-6 text-base leading-relaxed text-slate-600">
                  <p>Users must keep all confidential information of other users strictly confidential. This obligation survives termination for a period of 3 years.</p>
                </div>
              </section>

              {/* 9. Disclaimers */}
              <section id="disclaimers" className="scroll-mt-28">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="rounded-lg bg-slate-100 p-2 text-slate-600">
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">9. Disclaimers and Limitation of Liability</h2>
                </div>
                <div className="mt-6 space-y-6 text-base leading-relaxed text-slate-600">
                  <div className="rounded-xl border-2 border-slate-100 p-6 bg-white/50">
                    <p className="font-bold text-slate-900 tracking-tight uppercase mb-4">Platform Provided 'As Is'</p>
                    <p className="text-sm mb-4 italic text-slate-500">
                      QUICK RECRUIT DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE.
                    </p>
                    <p className="text-sm text-slate-600">
                      Total liability shall not exceed the fees paid in the 3 months preceding the claim.
                    </p>
                  </div>
                </div>
              </section>

              {/* 10. Indemnification */}
              <section id="indemnification" className="scroll-mt-28">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="rounded-lg bg-slate-100 p-2 text-slate-600">
                    <ShieldAlert className="h-5 w-5" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">10. Indemnification</h2>
                </div>
                <div className="mt-6 text-base leading-relaxed text-slate-600">
                  <p>You agree to indemnify and hold harmless Quick Recruit from claims arising from your violation of these Terms, misuse of the Platform, or false information submitted.</p>
                </div>
              </section>

              {/* 11. Termination */}
              <section id="termination" className="scroll-mt-28">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="rounded-lg bg-slate-100 p-2 text-slate-600">
                    <XCircle className="h-5 w-5" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">11. Suspension and Termination</h2>
                </div>
                <div className="mt-6 space-y-4 text-base leading-relaxed text-slate-600">
                  <p>You may close your account at any time. Quick Recruit reserves the right to suspend or terminate accounts for breaches, fraud, or 24+ months of inactivity.</p>
                </div>
              </section>

              {/* 12. Compliance */}
              <section id="compliance" className="scroll-mt-28">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="rounded-lg bg-slate-100 p-2 text-slate-600">
                    <Globe className="h-5 w-5" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">12. Legal Compliance — India and UAE</h2>
                </div>
                <div className="mt-6 space-y-4 text-base leading-relaxed text-slate-600">
                  <p>Users must comply with Information Technology Act (India), UAE Labour Law, and Personal Data Protection laws in both regions. We strictly prohibit discrimination in hiring.</p>
                </div>
              </section>

              {/* 13. Dispute Resolution */}
              <section id="dispute-resolution" className="scroll-mt-28">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="rounded-lg bg-slate-100 p-2 text-slate-600">
                    <Gavel className="h-5 w-5" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">13. Governing Law and Dispute Resolution</h2>
                </div>
                <div className="mt-6 space-y-4 text-base leading-relaxed text-slate-600">
                  <p>Governed by laws of India for Indian users and UAE laws for UAE users. Disputes unresolved through negotiation will be referred to arbitration (India) or relevant courts (UAE).</p>
                  <p className="font-bold text-slate-900">All users waive rights to class action proceedings.</p>
                </div>
              </section>

              {/* 14. General Provisions */}
              <section id="general" className="scroll-mt-28">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="rounded-lg bg-slate-100 p-2 text-slate-600">
                    <Info className="h-5 w-5" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">14. General Provisions</h2>
                </div>
                <div className="mt-6 grid gap-6 sm:grid-cols-2 text-sm text-slate-600">
                  <div className="space-y-2">
                    <h4 className="font-bold text-slate-900">Entire Agreement</h4>
                    <p>Constitutes the full agreement between you and Quick Recruit.</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-bold text-slate-900">Amendments</h4>
                    <p>Subject to change with 30 days notice for material updates.</p>
                  </div>
                </div>
              </section>

              {/* End Note */}
              <div className="border-t border-slate-200 pt-12 text-center text-sm text-slate-500">
                <p className="font-bold text-slate-900 text-base">Quick Recruit — Smarter Hiring, Trusted Platform</p>
                <div className="mt-6 grid grid-cols-1 gap-4 max-w-sm mx-auto text-xs font-medium uppercase tracking-widest text-slate-400">
                  <div className="flex flex-col items-center gap-2">
                    <Mail className="h-4 w-4" /> hello@quickrekruit.com
                  </div>
                </div>
                <p className="mt-8 italic">By using Quick Recruit, you confirm that you have read and agreed to these Terms and Conditions.</p>
                <p className="mt-4">&copy; {new Date().getFullYear()} Quick Recruit. All Rights Reserved. | India & UAE</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Action Button (Mobile Only) */}
      <div className="fixed bottom-6 right-6 lg:hidden">
        <a
          href="#top"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-white shadow-xl transition-transform hover:scale-110 active:scale-95"
        >
          <ArrowLeft className="h-6 w-6 rotate-90" />
        </a>
      </div>
    </div>
  );
}
