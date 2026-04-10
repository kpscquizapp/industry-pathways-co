import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Shield,
  Lock,
  Eye,
  FileText,
  UserCheck,
  Globe,
  Mail,
  MapPin,
  Clock,
  Cpu,
  Database,
  Share2,
  AlertCircle,
} from "lucide-react";
import logo from "@/assets/Dark Option.png";

const SECTIONS = [
  { id: "introduction", title: "1. Introduction" },
  { id: "contact", title: "2. Data Controller & Contact Information" },
  { id: "collection", title: "3. Information We Collect" },
  { id: "legal-basis", title: "4. Legal Basis for Processing" },
  { id: "usage", title: "5. How We Use Your Information" },
  { id: "sharing", title: "6. Sharing of Your Information" },
  { id: "retention", title: "7. Data Retention" },
  { id: "rights", title: "8. Your Data Rights" },
  { id: "cookies", title: "9. Cookies and Tracking Technologies" },
  { id: "security", title: "10. Data Security" },
  { id: "transfers", title: "11. Cross-Border Data Transfers" },
  { id: "ai-processing", title: "12. AI Processing and Automated Decision-Making" },
  { id: "children", title: "13. Children's Privacy" },
  { id: "links", title: "14. Third-Party Links and Integrations" },
  { id: "changes", title: "15. Changes to This Privacy Policy" },
  { id: "governing-law", title: "16. Governing Law and Dispute Resolution" },
];

export default function PrivacyPolicy() {
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
                On this page
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
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600 ring-1 ring-inset ring-blue-600/20">
                <Shield className="h-3 w-3" />
                Privacy Protection
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
                Privacy Policy
              </h1>
              {/* <p className="mt-4 text-lg text-slate-600">
                Effective Date: April 4, 2024
              </p> */}
            </div>

            <div className="space-y-16">
              {/* 1. Introduction */}
              <section id="introduction" className="scroll-mt-28">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="rounded-lg bg-blue-100 p-2 text-blue-600">
                    <FileText className="h-5 w-5" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">1. Introduction</h2>
                </div>
                <div className="mt-6 space-y-4 text-base leading-relaxed text-slate-600">
                  <p>
                    Welcome to <strong>Quick Recruit</strong> ("Platform", "we", "us", or "our"). Quick Recruit is an AI-powered recruitment marketplace that connects employers, hiring managers, and HR professionals ("Employers") with contractors, freelancers, and bench resources ("Candidates"). We are committed to protecting the privacy and security of your personal data in accordance with applicable laws in India and the United Arab Emirates.
                  </p>
                  <p>
                    This Privacy Policy explains how we collect, use, store, share, and protect your personal information when you access or use the Quick Recruit platform, website, mobile application, or any related services. By accessing or using our Platform, you acknowledge that you have read, understood, and agree to this Privacy Policy.
                  </p>
                  <p>
                    This Policy applies to all users including Employers, Candidates, contractors, and HR professionals across India and the UAE.
                  </p>
                </div>
              </section>

              {/* 2. Data Controller & Contact Information */}
              <section id="contact" className="scroll-mt-28">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="rounded-lg bg-blue-100 p-2 text-blue-600">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">2. Data Controller & Contact Information</h2>
                </div>
                <div className="mt-6 text-base leading-relaxed text-slate-600">
                  <p className="mb-4">
                    Quick Recruit is the Data Controller responsible for your personal data. For any privacy-related queries, requests, or complaints, please contact our Data Protection Officer:
                  </p>
                  <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                    <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                      Data Protection Officer (DPO)
                    </h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <Mail className="mt-1 h-4 w-4 text-blue-500 shrink-0" />
                        <span>Email: <a href="mailto:hello@quickrekruit.com" className="text-blue-600 hover:underline">hello@quickrekruit.com</a></span>
                      </li>
                      <li className="flex items-start gap-3">
                        <MapPin className="mt-1 h-4 w-4 text-blue-500 shrink-0" />
                        <span>Address: [Registered Office Address — India / UAE]</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Clock className="mt-1 h-4 w-4 text-blue-500 shrink-0" />
                        <span>Response Time: Within 30 days of receiving your request</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* 3. Information We Collect */}
              <section id="collection" className="scroll-mt-28">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="rounded-lg bg-blue-100 p-2 text-blue-600">
                    <Database className="h-5 w-5" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">3. Information We Collect</h2>
                </div>
                <div className="mt-6 space-y-8 text-base leading-relaxed text-slate-600">
                  <p>
                    We collect personal data that you provide directly, data generated through your use of the Platform, and data from third-party sources, in order to deliver our AI-powered recruitment services.
                  </p>

                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-slate-900">3.1 Information Provided by Employers / HR Professionals</h3>
                    <ul className="list-disc space-y-2 pl-5">
                      <li>Full name, job title, and professional designation</li>
                      <li>Company name, industry, size, and registered address</li>
                      <li>Business email address and phone number</li>
                      <li>Job descriptions, role requirements, and hiring preferences</li>
                      <li>Billing and payment information (processed via secure third-party gateways)</li>
                      <li>Communication history and hiring activity on the Platform</li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-slate-900">3.2 Information Provided by Candidates / Contractors</h3>
                    <ul className="list-disc space-y-2 pl-5">
                      <li>Full name, date of birth, nationality, and contact details</li>
                      <li>Resume/CV, work history, educational qualifications, and certifications</li>
                      <li>Skills profile, portfolio links, and professional references</li>
                      <li>Government-issued identification for verification purposes</li>
                      <li>Availability status, expected compensation, and bench resource status</li>
                      <li>Results of AI-administered coding tests, skill assessments, and domain evaluations</li>
                      <li>AI interview responses, video recordings (where consented), and interview scores</li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-slate-900">3.3 Automatically Collected Information</h3>
                    <ul className="list-disc space-y-2 pl-5">
                      <li>IP address, browser type, operating system, and device identifiers</li>
                      <li>Platform usage data including pages visited, features used, and time spent</li>
                      <li>Log data and session identifiers</li>
                      <li>Cookies and similar tracking technologies (see Section 9)</li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-slate-900">3.4 AI-Generated and Processed Data</h3>
                    <ul className="list-disc space-y-2 pl-5">
                      <li>Resume-to-Job Description semantic match scores</li>
                      <li>Skill gap analysis results and competency ratings</li>
                      <li>Automated interview scoring including communication, technical depth, and confidence metrics</li>
                      <li>Bias-reduced candidate ranking data derived from skills and qualifications</li>
                    </ul>
                  </div>

                  <div className="rounded-xl bg-amber-50 p-4 ring-1 ring-inset ring-amber-600/10">
                    <p className="flex items-start gap-2 text-sm text-amber-800">
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                      Sensitive personal data (such as health information, caste, religion, or biometric data) is NOT collected by Quick Recruit unless legally required and with explicit consent.
                    </p>
                  </div>
                </div>
              </section>

              {/* 4. Legal Basis for Processing */}
              <section id="legal-basis" className="scroll-mt-28">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="rounded-lg bg-blue-100 p-2 text-blue-600">
                    <UserCheck className="h-5 w-5" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">4. Legal Basis for Processing</h2>
                </div>
                <div className="mt-6 space-y-6 text-base leading-relaxed text-slate-600">
                  <p>
                    We process your personal data only where we have a lawful basis to do so. Our legal grounds for processing vary by jurisdiction:
                  </p>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                      <h3 className="mb-4 font-bold text-slate-900">4.1 India — DPDP Act, 2023</h3>
                      <ul className="space-y-2 text-sm">
                        <li><strong>Consent:</strong> Explicit, informed consent for specific purposes.</li>
                        <li><strong>Legitimate Use:</strong> Performance of a contract or legal obligation.</li>
                        <li><strong>Public Interest:</strong> Related to employment and workforce management.</li>
                      </ul>
                    </div>
                    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                      <h3 className="mb-4 font-bold text-slate-900">4.2 UAE — Federal Decree-Law No. 45</h3>
                      <ul className="space-y-2 text-sm">
                        <li><strong>Contractual Necessity:</strong> To fulfill agreed services upon registration.</li>
                        <li><strong>Legitimate Interests:</strong> Fraud prevention and platform security.</li>
                        <li><strong>Consent:</strong> Explicit consent for specific activities.</li>
                        <li><strong>Legal Obligation:</strong> To comply with federal or emirate laws.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              {/* 5. How We Use Your Information */}
              <section id="usage" className="scroll-mt-28">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="rounded-lg bg-blue-100 p-2 text-blue-600">
                    <Eye className="h-5 w-5" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">5. How We Use Your Information</h2>
                </div>
                <div className="mt-6 space-y-4 text-base leading-relaxed text-slate-600">
                  <p>
                    We use your personal data to deliver, improve, and personalize our recruitment services:
                  </p>
                  <ul className="grid gap-3 pl-5 list-disc">
                    <li>Create, manage, and maintain your account on the Platform</li>
                    <li>Match Candidates to Job Descriptions using our AI semantic matching engine</li>
                    <li>Conduct automated skill assessments, coding tests, and domain evaluations</li>
                    <li>Facilitate and score AI-powered interviews and generate candidate insights</li>
                    <li>Provide Employers with ranked candidate shortlists and skill gap analysis reports</li>
                    <li>Process payments and invoices for Platform subscriptions and services</li>
                    <li>Verify the identity and credentials of Candidates and Employers</li>
                    <li>Send transactional communications such as match alerts and interview invites</li>
                    <li>Send marketing communications (opt-out available at any time)</li>
                    <li>Improve our AI algorithms, matching accuracy, and platform features</li>
                    <li>Comply with applicable laws, regulations, and legal processes</li>
                    <li>Detect and prevent fraud, abuse, and unauthorized access</li>
                  </ul>
                  <p className="mt-4 font-semibold text-slate-900">
                    We do NOT sell your personal data to third parties for their independent marketing purposes.
                  </p>
                </div>
              </section>

              {/* 6. Sharing of Your Information */}
              <section id="sharing" className="scroll-mt-28">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="rounded-lg bg-blue-100 p-2 text-blue-600">
                    <Share2 className="h-5 w-5" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">6. Sharing of Your Information</h2>
                </div>
                <div className="mt-6 space-y-6 text-base leading-relaxed text-slate-600">
                  <p>
                    We do not sell your personal data. We may share your information in the following limited circumstances:
                  </p>

                  <div className="space-y-4">
                    <h3 className="font-bold text-slate-900">6.1 Between Platform Users</h3>
                    <p className="text-sm">
                      Candidate profiles, resumes, skill scores, and interview results may be shared with verified Employers who post relevant job listings. Employers' job postings and company details will be visible to registered Candidates. Sharing occurs only within the scope of the recruitment process.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-bold text-slate-900">6.2 Service Providers and Sub-Processors</h3>
                    <p className="text-sm">
                      We engage trusted third-party service providers who process data on our behalf under strict data processing agreements. These include cloud hosting, payment processors, identity verification, and AI infrastructure providers. All sub-processors are bound by contractual obligations equivalent to or stricter than this Policy.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-bold text-slate-900">6.3 Legal and Regulatory Disclosure</h3>
                    <p className="text-sm">
                      We may disclose your information to government authorities, law enforcement, or regulatory bodies in India or the UAE where required by law, court order, or to protect the legal rights of Quick Recruit or our users.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-bold text-slate-900">6.4 Business Transfers</h3>
                    <p className="text-sm">
                      In the event of a merger, acquisition, restructuring, or sale of Quick Recruit, your personal data may be transferred to the acquiring entity. We will notify you of any such transfer and your rights in relation to it.
                    </p>
                  </div>
                </div>
              </section>

              {/* 7. Data Retention */}
              <section id="retention" className="scroll-mt-28">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="rounded-lg bg-blue-100 p-2 text-blue-600">
                    <Clock className="h-5 w-5" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">7. Data Retention</h2>
                </div>
                <div className="mt-6 space-y-4 text-base leading-relaxed text-slate-600">
                  <p>
                    We retain your personal data only for as long as is necessary to fulfil the purposes described in this Policy:
                  </p>
                  <ul className="grid gap-3 pl-5 list-disc text-sm">
                    <li><strong>Active Account Data:</strong> Duration of your account plus 3 years post-closure</li>
                    <li><strong>Candidate Assessment Data:</strong> 2 years from date of generation</li>
                    <li><strong>Employment-Related Data:</strong> Up to 7 years to comply with labour law requirements</li>
                    <li><strong>Financial and Billing Records:</strong> 7 years as required by tax regulations</li>
                    <li><strong>Marketing Consent Records:</strong> 3 years from the date of consent or withdrawal</li>
                  </ul>
                  <p className="text-sm">
                    Upon expiry of the retention period, data is securely deleted or anonymised. You may request earlier deletion subject to our legal obligations.
                  </p>
                </div>
              </section>

              {/* 8. Your Data Rights */}
              <section id="rights" className="scroll-mt-28">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="rounded-lg bg-blue-100 p-2 text-blue-600">
                    <UserCheck className="h-5 w-5" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">8. Your Data Rights</h2>
                </div>
                <div className="mt-6 space-y-8 text-base leading-relaxed text-slate-600">
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-slate-900">8.1 Rights Under Indian Law (DPDP Act, 2023)</h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {["Right to Access", "Right to Correction and Erasure", "Right to Grievance Redressal", "Right to Nominate", "Right to Withdraw Consent"].map((right) => (
                        <div key={right} className="rounded-xl border border-slate-200 p-4 text-sm font-medium"> {right} </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-slate-900">8.2 Rights Under UAE Law (PDPL)</h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {["Right to Know", "Right of Access", "Right to Rectification", "Right to Erasure", "Right to Object", "Right to Data Portability", "Right to Lodge a Complaint"].map((right) => (
                        <div key={right} className="rounded-xl border border-slate-200 p-4 text-sm font-medium"> {right} </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl bg-blue-50/50 p-6 ring-1 ring-inset ring-blue-500/10">
                    <p className="text-sm">
                      To exercise any of these rights, please submit a written request to <a href="mailto:hello@quickrekruit.com" className="font-bold text-blue-600 hover:underline">hello@quickrekruit.com</a>. We will respond within 30 days. Identity verification may be required.
                    </p>
                  </div>
                </div>
              </section>

              {/* 9. Cookies and Tracking Technologies */}
              <section id="cookies" className="scroll-mt-28">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="rounded-lg bg-blue-100 p-2 text-blue-600">
                    <Globe className="h-5 w-5" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">9. Cookies and Tracking Technologies</h2>
                </div>
                <div className="mt-6 space-y-4 text-base leading-relaxed text-slate-600">
                  <p>
                    Quick Recruit uses cookies to operate and improve the Platform. Categories include:
                  </p>
                  <dl className="space-y-4">
                    <div className="rounded-xl border border-slate-200 p-4">
                      <dt className="font-bold text-slate-900">Strictly Necessary Cookies</dt>
                      <dd className="mt-1 text-sm">Essential for Platform operation, authentication, and security. Cannot be disabled.</dd>
                    </div>
                    <div className="rounded-xl border border-slate-200 p-4">
                      <dt className="font-bold text-slate-900">Functional Cookies</dt>
                      <dd className="mt-1 text-sm">Remember your preferences and settings to improve your experience.</dd>
                    </div>
                    <div className="rounded-xl border border-slate-200 p-4">
                      <dt className="font-bold text-slate-900">Analytical / Performance Cookies</dt>
                      <dd className="mt-1 text-sm">Collect anonymised usage data to help us understand usage patterns. Requires consent.</dd>
                    </div>
                    <div className="rounded-xl border border-slate-200 p-4">
                      <dt className="font-bold text-slate-900">Marketing Cookies</dt>
                      <dd className="mt-1 text-sm">Used to deliver relevant advertising content. Requires explicit consent.</dd>
                    </div>
                  </dl>
                </div>
              </section>

              {/* 10. Data Security */}
              <section id="security" className="scroll-mt-28">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="rounded-lg bg-blue-100 p-2 text-blue-600">
                    <Lock className="h-5 w-5" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">10. Data Security</h2>
                </div>
                <div className="mt-6 space-y-4 text-base leading-relaxed text-slate-600">
                  <p>
                    We implement comprehensive technical and organisational security measures:
                  </p>
                  <ul className="grid gap-3 pl-5 list-disc text-sm">
                    <li>AES-256 encryption for data at rest and TLS 1.3 for data in transit</li>
                    <li>Multi-factor authentication (MFA) for all user and admin accounts</li>
                    <li>Role-based access controls (RBAC) for limited data exposure</li>
                    <li>Regular security audits, vulnerability assessments, and penetration testing</li>
                    <li>ISO 27001-aligned information security management practices</li>
                    <li>Data breach response procedures with compliant notification timelines</li>
                  </ul>
                </div>
              </section>

              {/* 11. Cross-Border Data Transfers */}
              <section id="transfers" className="scroll-mt-28">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="rounded-lg bg-blue-100 p-2 text-blue-600">
                    <Globe className="h-5 w-5" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">11. Cross-Border Data Transfers</h2>
                </div>
                <div className="mt-6 space-y-4 text-base leading-relaxed text-slate-600">
                  <p>
                    Quick Recruit operates in India and the UAE. Cross-border transfers are conducted in accordance with legal requirements:
                  </p>
                  <ul className="grid gap-3 pl-5 list-disc text-sm">
                    <li>Standard Contractual Clauses (SCCs) or equivalent mechanisms</li>
                    <li>Ensuring recipient countries provide an adequate level of data protection</li>
                    <li>Obtaining explicit consent for transfers to countries without adequacy decisions</li>
                  </ul>
                </div>
              </section>

              {/* 12. AI Processing and Decision-Making */}
              <section id="ai-processing" className="scroll-mt-28">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="rounded-lg bg-blue-100 p-2 text-blue-600">
                    <Cpu className="h-5 w-5" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">12. AI Processing and Automated Decision-Making</h2>
                </div>
                <div className="mt-6 space-y-6 text-base leading-relaxed text-slate-600">
                  <p>
                    AI is a core feature of our platform. We are committed to transparency and fairness.
                  </p>

                  <div className="space-y-4">
                    <h3 className="font-bold text-slate-900">12.1 AI Features</h3>
                    <ul className="list-disc pl-5 text-sm space-y-2">
                      <li><strong>Semantic Resume-JD Matching:</strong> Contextual fit analysis.</li>
                      <li><strong>Skill Gap Analysis:</strong> Identification of competency alignment.</li>
                      <li><strong>Automated Skill Tests:</strong> Generating tailored assessments.</li>
                      <li><strong>AI Interview Scoring:</strong> Evaluation of communication and technical depth.</li>
                      <li><strong>Bias-Reduced Ranking:</strong> Skill-based ranking with demographic controls.</li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-bold text-slate-900">12.2 Human Oversight</h3>
                    <p className="text-sm">
                      AI scores are tools to support, not replace, human hiring decisions. Employers retain full discretion.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-bold text-slate-900">12.3 Right to Challenge</h3>
                    <p className="text-sm">
                      If you believe an automated assessment has incorrectly evaluated your profile, contact <a href="mailto:hello@quickrekruit.com" className="text-blue-600 hover:underline">hello@quickrekruit.com</a> for human review.
                    </p>
                  </div>
                </div>
              </section>

              {/* 13. Children's Privacy */}
              <section id="children" className="scroll-mt-28">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="rounded-lg bg-blue-100 p-2 text-blue-600">
                    <AlertCircle className="h-5 w-5" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">13. Children's Privacy</h2>
                </div>
                <div className="mt-6 text-base leading-relaxed text-slate-600">
                  <p>
                    Quick Recruit is strictly for individuals aged 18 and above. We do not knowingly collect data from minors. If you suspect a minor has provided data, contact us immediately.
                  </p>
                </div>
              </section>

              {/* 14. Third-Party Links */}
              <section id="links" className="scroll-mt-28">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="rounded-lg bg-blue-100 p-2 text-blue-600">
                    <Share2 className="h-5 w-5" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">14. Third-Party Links and Integrations</h2>
                </div>
                <div className="mt-6 text-base leading-relaxed text-slate-600">
                  <p>
                    We are not responsible for the privacy practices of third-party websites linked on our Platform. We encourage you to review their policies.
                  </p>
                </div>
              </section>

              {/* 15. Changes to This Policy */}
              <section id="changes" className="scroll-mt-28">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="rounded-lg bg-blue-100 p-2 text-blue-600">
                    <Clock className="h-5 w-5" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">15. Changes to This Privacy Policy</h2>
                </div>
                <div className="mt-6 text-base leading-relaxed text-slate-600">
                  <p>
                    We may update this Policy. Material changes will be notified via email or a prominent notice on the Platform for 30 days.
                  </p>
                </div>
              </section>

              {/* 16. Governing Law */}
              <section id="governing-law" className="scroll-mt-28">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="rounded-lg bg-blue-100 p-2 text-blue-600">
                    <FileText className="h-5 w-5" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">16. Governing Law and Dispute Resolution</h2>
                </div>
                <div className="mt-6 text-base leading-relaxed text-slate-600">
                  <p>
                    Governed by the laws of India and the UAE. Disputes are subject to the jurisdiction of courts in India or the UAE as applicable.
                  </p>
                </div>
              </section>

              {/* End Note */}
              <div className="border-t border-slate-200 pt-12 text-center text-sm text-slate-500">
                <p className="font-bold text-slate-900">Quick Recruit — Committed to Your Privacy</p>
                <p className="mt-2">For all privacy inquiries: <a href="mailto:hello@quickrekruit.com" className="text-blue-600 hover:underline">hello@quickrekruit.com</a></p>
                <p className="mt-4">&copy; {new Date().getFullYear()} Quick Recruit. All Rights Reserved.</p>
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
