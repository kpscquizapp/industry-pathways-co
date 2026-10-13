import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowUp, Shield } from "lucide-react";
import logo from "@/assets/Dark Option.png";

const POLICY_METADATA = [
  "NAME OF THE COMPANY: MAX STACK LABS TECHNOLOGIES PRIVATE LIMITED",
  "CIN: U72900KL2017PTC051031",
  "REGISTERED OFFICE: T.C 17/3478, 1ST Floor, Relcon Plaza, Pattom Palace, Thiruvananthapuram - 695004",
  "NAME OF PRODUCT: “QUICKREKRUIT”",
  "WEBSITE: https://quickrekruit.com/",
  "APPROVED BY THE BOARD ON: 12 December 2026",
];

const POLICY_TEXT = `
1. DEFINITIONS
For the purposes of this Policy, the following terms shall have the meanings set out below:
Consent – a freely given, specific, informed and unambiguous indication of the Data Principal’s wishes by clear affirmative action for a specified purpose.
Data Principal – the individual to whom the personal data relates.
Data Fiduciary – an individual, organisation, public authority, agency or other body which alone or jointly determines the purpose and means of processing personal data.
Data Processor – any person who processes personal data on behalf of a Data Fiduciary.
Personal Data – any data about an individual who is identifiable by or in relation to such data.
Personal Data Breach – any unauthorised processing of personal data or accidental disclosure, acquisition, sharing, use, alteration, destruction or loss of access that compromises the confidentiality, integrity or availability of personal data.
Processing – an automated operation or set of operations performed on digital personal data, including collection, recording, organisation, storage, retrieval, consultation, use, sharing, disclosure, restriction, erasure or destruction.
Disclosure – making personal data available or accessible to any person or entity, including by transmission, sharing, dissemination or publication.
Third Party – any person other than the Data Principal, the Company or a Data Processor engaged by the Company.
These definitions shall be interpreted in accordance with applicable law, including the Digital Personal Data Protection Act, 2023 and applicable Rules.
2. INTRODUCTION
Max Stack Labs Technologies Private Limited (“Company”, “we”, “us” or “our”) is committed to protecting the privacy and security of personal data processed through QUICKREKRUIT. The Company recognises the importance of responsible collection, processing, storage, use, disclosure and deletion of personal data and seeks to process such data in a lawful, fair, transparent and secure manner.
This Policy establishes the principles, responsibilities and procedures governing the processing of personal data by the Company and shall be read together with applicable security policies, employee policies, contractual arrangements, website terms and other applicable policies and procedures.
3. OBJECTIVES
This Policy establishes a framework for the lawful and responsible processing of personal data and seeks to:
a. Protect personal data against unauthorised access, use, disclosure, alteration, loss, destruction or misuse.
b. Ensure that personal data is processed for specified and legitimate purposes.
c. Promote transparency regarding processing activities.
d. Establish procedures for handling personal-data requests.
e. Establish processes for personal-data breach management.
f. Establish appropriate retention and deletion practices.
g. Promote accountability among employees, officers, contractors and service providers and support compliance with applicable data-protection and privacy laws.
4. SCOPE
This Policy applies to the processing of personal data undertaken by or on behalf of the Company, whether such processing is carried out electronically or through other systems that are subsequently digitised, to the extent applicable under law.
The Policy applies to:
a. Customers and prospective customers.
b. Candidates and job seekers.
c. Employees and prospective employees.
d. Directors and officers.
e. Vendors, suppliers and service providers.
f. Consultants and professional advisers.
g. Business partners.
h. Website and application users.
i. Agents and representatives and other individuals whose personal data is processed by the Company.
The Policy applies to employees, officers, consultants, contractors and other persons who have access to personal data in the course of their association with the Company.
This Policy also applies to the processing of personal data undertaken through or in connection with the Company’s software platform, “QUICKREKRUIT”, including its websites, applications, portals, tools, modules and other technology-enabled services.
Depending upon the nature and purpose of the processing activity, the Company may act either as a Data Fiduciary or as a Data Processor.
As a Data Processor, the Company processes personal data on behalf of clients pursuant to documented instructions and applicable data-processing agreements. This may include platform access, client-uploaded data, vendor/workforce management, resource augmentation, and processing of personnel, candidate, consultant, contractor or vendor data.
The applicable Data Processing Agreement shall govern the respective rights and obligations of the Company and the client, including in relation to candidate and applicant data.
As a Data Fiduciary, the Company determines the purposes and means of processing for direct QUICKREKRUIT services, including job boards and recruitment services, marketplaces, mock interviews and assessments, user accounts, communications, support, security and fraud prevention, analytics and service improvement.
5. APPLICABLE LAW
This Policy shall be governed by and interpreted in accordance with applicable data-protection and privacy laws, including the Digital Personal Data Protection Act, 2023, the Digital Personal Data Protection Rules, 2025, applicable provisions of the Information Technology Act, 2000, and other applicable privacy, data-security and information-security laws and regulations.
Where another applicable law, regulation, contractual requirement or regulatory direction imposes a higher or additional requirement, the Company shall comply with such requirement to the extent applicable.
6. PRINCIPLES GOVERNING PROCESSING OF PERSONAL DATA
6.1 Lawfulness and Transparency
Personal data shall be processed lawfully, fairly and transparently and in accordance with applicable law.
6.2 Purpose Limitation
Personal data shall be collected and processed only for specified, explicit and legitimate purposes communicated to the Data Principal, unless otherwise permitted by law.
6.3 Data Minimisation
The Company shall seek to collect and process only such personal data as is reasonably necessary for the relevant purpose.
6.4 Accuracy
Reasonable steps shall be taken to ensure that personal data is accurate, complete and kept up to date where necessary.
6.5 Security
Appropriate technical and organisational measures shall be implemented to protect personal data against unauthorised access, disclosure, alteration, loss, destruction or other unlawful processing.
6.6 Retention Limitation
Personal data shall not be retained for longer than necessary for the purpose for which it is processed or as required or permitted by applicable law.
6.7 Accountability
The Company shall maintain appropriate policies, procedures, records and controls to demonstrate compliance with applicable privacy and data-protection requirements.
7. PERSONAL DATA COLLECTED BY THE COMPANY
Depending upon the nature of the processing activity, the Company may collect personal data relating to candidates and job seekers, recruiters, client users, employees and other individuals.
7.1 Identification Information
Name, photograph, age/date of birth, gender where required, identification details and other information used to identify an individual.
7.2 Contact Information
Residential address, email address, telephone/mobile number and other communication details.
7.3 Financial Information
Bank account details, payment information, remuneration, transaction details, billing information and tax-related information.
7.4 Employment Information
In relation to employees and prospective employees of the Company: educational qualifications, employment history, professional qualifications, attendance, remuneration, statutory employment information and information required for employment administration.
7.5 Candidate and Job Seeker Information
Resume/CV and profile information, skills and competencies, professional interests, education and academic information, employment/work history, current and expected CTC/remuneration, notice period and availability, campus/academic details including college/institution and marks, job preferences, application information and other recruitment-related information.
7.6 Interview and Assessment Data
AI interview video and audio, interview transcripts, call recordings, assessment submissions and responses, AI-generated scores/evaluations/reports, anomaly signals including tab-switching and mouse activity, and other interview or assessment information.
7.7 Technical and Electronic Information
IP address, browser information, device information, login and access logs, cookies and similar technologies, interaction information and other technical information.
Personal data shall not be collected merely because it is technically possible to collect it; collection shall be limited to what is reasonably necessary for the applicable purpose.
7.8 Client and Recruiter Information
Name, designation, work email, telephone and login credentials of recruiters and client users; contact details of authorised representatives of client organisations; job postings, job descriptions and hiring requirements; billing contacts and tax details; and platform usage and activity records. Where such users record candidate shortlists, feedback or hiring decisions on the platform, the Company processes that data as a Data Processor on the client’s instructions under clause 4.
8. PURPOSES OF PROCESSING
The Company may process personal data for purposes including:
a. Providing and administering products and services.
b. Responding to customer requests and processing transactions.
c. Communicating with users, customers, candidates and other individuals.
d. Processing payments and related financial transactions.
e. Complying with legal, regulatory and contractual obligations.
f. Maintaining business and operational records.
g. Detecting, preventing and investigating fraud, misuse and unlawful activity.
h. Maintaining platform, information and workplace security.
i. Recruitment, employment and human-resources administration.
j. Managing vendors, service providers and business partners.
k. Receiving, investigating and responding to complaints and requests.
l. Analysing and improving products, services and user experience.
m. Audits, investigations and compliance reviews.
n. Establishing, exercising or defending legal claims.
o. Managing client accounts, job postings and hiring activity on the platform and other purposes notified to the Data Principal or otherwise permitted by applicable law.
9. NOTICE AND TRANSPARENCY
Before or at the time of collecting personal data, the Company shall provide the relevant Data Principal with an appropriate Privacy Notice in accordance with applicable law.
The Company shall maintain and publish a standalone Privacy Notice on its website and application and shall make the Privacy Notice available to individuals at the time of registration or sign-up, wherever applicable.
The Privacy Notice shall, as applicable:
a. Identify the categories and specific items of personal data proposed to be collected or otherwise processed.
b. Specify the purpose or purposes for which each category of personal data is collected or processed.
c. Provide information regarding the legal basis for processing, including where processing is based on consent.
d. Explain the manner in which consent may be given and withdrawn, where processing is based on consent.
e. Explain the manner in which the Data Principal may exercise applicable rights in relation to their personal data.
f. Provide details of the mechanism for raising grievances with the Company and, where applicable, the manner of approaching the Data Protection Board of India.
g. Provide such other information as may be required under applicable law.
Recruiters and client users shall be provided with the Privacy Notice, or a business-user notice, at the time of registration on the platform.
The Privacy Notice shall be made available in English and, upon request, in any language specified in the Eighth Schedule to the Constitution of India, subject to applicable law and reasonable operational requirements.
The Company may also provide or supplement such notice through forms, contracts, employment documentation, platform interfaces or other appropriate means, where required by the nature of the processing activity.
10. CONSENT
Where consent is the applicable basis for processing, consent shall be voluntary, specific, informed and unambiguous and shall be capable of being withdrawn.
Where applicable, separate consent may be obtained for user profiles; sharing of profiles, resumes or interview reports; recording, AI analysis and scoring; call recording; marketing communications; and AI/model improvement or training.
Withdrawal of consent shall be as easy as giving consent. Upon withdrawal, the Company shall cease the relevant processing unless continued processing is permitted or required by applicable law. Withdrawal shall not affect the lawfulness of processing carried out before withdrawal.
11. PROCESSING WITHOUT CONSENT
The Company may process personal data without consent where permitted or required under applicable law, including for certain legitimate uses specified under Section 7 of the Digital Personal Data Protection Act, 2023, as applicable.
Such processing may include:
a. Processing for compliance with a legal or regulatory obligation.
b. Processing for compliance with an order or judgment of a court or tribunal or an order or direction issued under applicable law.
c. Processing in response to a medical emergency involving a threat to the life or immediate threat to the health of the Data Principal or another individual.
d. Processing for taking measures to provide medical treatment or health services during a threat to public health.
e. Processing for taking measures to provide assistance or services to an individual during a breakdown of public order or a disaster.
f. Processing for the purposes specified under applicable law in relation to employment or safeguarding the employer from loss or liability and such other processing as may constitute a certain legitimate use or otherwise be permitted without consent under applicable law.
12. RIGHTS OF DATA PRINCIPALS
Subject to applicable law, Data Principals may have rights including the right to:
a. Obtain information regarding processing.
b. Access, download or obtain a copy of personal data, where applicable.
c. Request correction or updating.
d. Request erasure where legally available.
e. Know the clients or recruiters with whom personal data has been shared, where applicable.
f. Withdraw consent where processing is based on consent.
g. Raise grievances and nominate another individual as permitted by law.
The Company shall provide self-service mechanisms where feasible and shall process requests in accordance with applicable law and its procedures.
13. PROCEDURE FOR DATA PRINCIPAL REQUESTS 
Data Protection / Privacy Contact:
Name: Arun K Thampy
Designation: Director
Email: arun@quickrekruit.com
Address: Max Stack Labs Technologies Private Limited, Module C-14, -2 Level, Thejaswini Building, Phase I, Technopark, Thiruvananthapuram, Kerala
The Company may require reasonable identity verification before acting on a request. Requests shall be processed within the period prescribed by applicable law. Where a request cannot be complied with, the Company shall provide reasons to the extent required by law.
14. GRIEVANCE REDRESSAL
Grievance Officer / Privacy Contact:
Name: Vishnu.S
Designation: Grievance officer/Operations
Email: vishnu.s@quickrekruit.com
Telephone: +91 79079 83873
The Company shall maintain a mechanism for receiving, recording, investigating and resolving privacy and personal-data grievances and shall publish the relevant contact details.
The Company shall resolve grievances within the period prescribed by applicable law, not exceeding 90 days. Data Principals may have further remedies available under applicable law.
15. DATA SECURITY
The Company shall implement reasonable technical and organisational measures appropriate to the nature and risk of processing, including, as appropriate, encryption or masking, role-based access controls, access management, logging and monitoring, backups, network and endpoint security, physical security, confidentiality obligations, vendor and processor security controls, assessments and training.
Access to personal data shall be limited on a need-to-know and role-based basis and shall be reviewed periodically.
16. EMPLOYEE RESPONSIBILITIES
Employees, officers, contractors and other persons with access to personal data shall use such data only for authorised business purposes, maintain confidentiality, comply with Company policies, avoid unauthorised disclosure, use Company systems responsibly and immediately report suspected personal-data breaches or security incidents.
Violations of this Policy may result in disciplinary, contractual or other action as applicable.
17. DATA PROCESSORS AND THIRD PARTIES
The Company may engage third-party processors and subprocessors, including cloud and hosting providers, AI/LLM and analytics providers, speech/transcription/voice providers, telephony and communications providers, payment gateways, and interview or assessment providers.
Written data-processing agreements shall require documented instructions, confidentiality, security safeguards, breach notification, controls on sub-processing, and deletion or return of personal data.
When processing personal data for a client, the Company shall act only on documented instructions and in accordance with applicable law. The client shall be responsible for establishing the lawful basis and obtaining permissions required for processing for which it is the Data Fiduciary.
Where a third-party interview platform is used, the applicable agreement shall address India hosting, storage and processing, restrictions on independent use or model training, breach notification, return/deletion on termination, and restrictions on unilateral amendment of applicable privacy terms.
The Company shall take reasonable steps to ensure that processors and subprocessors maintain appropriate security and comply with applicable contractual requirements.
18. SHARING AND DISCLOSURE
The Company may disclose personal data where reasonably necessary for providing products or services, engaging service providers and contractors, responding to regulators or government authorities, supporting auditors and professional advisers, processing financial or payment transactions, obtaining legal advice, complying with courts or tribunals, detecting fraud or unlawful activity, or where otherwise permitted or required by law.
Disclosures shall be limited to personal data reasonably necessary for the relevant purpose.
19. CROSS-BORDER PROCESSING
Personal data of QuickRekruit users is hosted, stored and processed in India on dedicated infrastructure.
Such personal data shall not be transferred outside India, except where permitted by applicable law and after the Privacy Notice has been updated.
20. CHILDREN’S PERSONAL DATA
The QUICKREKRUIT platform is intended for individuals aged 18 years and above. The Company shall not knowingly permit registration or use by persons below 18 years where prohibited by applicable law and shall implement age-verification measures where required.
The Company shall not unlawfully process children’s personal data.
21. PERSONAL DATA BREACH MANAGEMENT
The Company shall maintain procedures for identifying, assessing, containing, mitigating and reporting personal-data breaches.
Employees and service providers shall promptly report suspected breaches, including unauthorised access or disclosure, lost devices, cyberattacks, ransomware, accidental deletion or destruction and similar incidents.
Upon a breach, the Company shall, as applicable:
a. Assess, contain and mitigate the incident.
b. Identify the affected personal data and Data Principals.
c. Preserve relevant evidence and implement corrective and preventive measures.
d. Notify the Data Protection Board of India and affected Data Principals without delay and in accordance with applicable law.
e. Provide detailed information to the Board within the applicable statutory period, including any prescribed 72-hour period or extension.
f. Report incidents to CERT-In within the applicable timeline, including the six-hour timeline where applicable.
g. Maintain a breach register and notify and assist clients where the Company acts as a Data Processor, in accordance with the applicable Data Processing Agreement.
Each breach and the measures taken shall be documented appropriately.
22. DATA RETENTION
Personal data shall be retained only for as long as necessary for the purpose for which it was collected or processed, contractual or business requirements, legal obligations, claims, audit, security or other lawful purposes.
Data Retention Schedule:
inactive profiles: 2 years;
interview video/audio, transcripts, AI reports and scores: 12 months;
call recordings: 12 months;
consent records: at least 3 years;
security/access logs: at least one year or longer where required by law; and
other personal data: as specified in the applicable retention schedule or required by law.
Personal data held by processors and service providers shall be deleted or returned in accordance with the Company’s instructions and the applicable agreement, and in any case within three months after termination of that agreement, including backup copies.
Personal data may be retained for longer where necessary or permitted for legal proceedings, audit, disputes, regulatory requirements or other lawful purposes.
23. COOKIES AND TRACKING
The Company may use cookies and similar technologies for functionality, authentication, security, analytics, performance and user-experience purposes.
Consent mechanisms shall be provided where required by applicable law.
24. DIRECT MARKETING
The Company shall undertake direct marketing in accordance with applicable law and the relevant Privacy Notice.
Where required, individuals shall be provided with appropriate mechanisms to manage or withdraw marketing preferences.
25. EMPLOYEE AND HUMAN RESOURCES DATA
The Company may process personal data of its employees and individuals applying for employment with the Company for legitimate employment-related purposes, including:
a. Recruitment.
b. Background verification.
c. Payroll.
d. Benefits.
e. Attendance.
f. Performance management.
g. Statutory compliance.
h. Employee communication.
i. Workplace security.
j. Disciplinary proceedings and termination and separation.
Employee personal data shall be accessed only by authorised personnel having a legitimate business requirement.
26. CONFIDENTIALITY
Personal data shall be treated as confidential. Employees, contractors, service providers and other persons with access to personal data shall be subject to appropriate confidentiality obligations.
Such confidentiality obligations shall continue after termination of employment or engagement where applicable.
27. DATA ACCURACY AND CORRECTION
The Company shall take reasonable steps to maintain accurate and up-to-date personal data where necessary for the relevant purpose.
Data Principals shall be provided with appropriate mechanisms to request correction or updating of their personal data, subject to applicable law.
28. DATA DELETION
The Company shall delete or securely dispose of personal data when the purpose for processing has been fulfilled, the applicable retention period has expired, deletion has been lawfully requested, or continued retention is no longer necessary or permitted.
Where applicable, the Company shall comply with the prior-notice requirements for erasure prescribed under the Digital Personal Data Protection Rules, 2025.
Deletion and disposal shall be carried out using methods appropriate to the nature of the data and the storage medium.
29. DATA PROTECTION GOVERNANCE
The Company shall designate appropriate personnel to oversee privacy and data-protection compliance. The Data Protection / Privacy Contact and the Grievance Officer named in clauses 13, 14 and 38 are the designated personnel and are responsible for handling Data Principal requests and grievances.
Where the Company is notified or classified as a Significant Data Fiduciary, it shall comply with the additional obligations applicable to such entity.
30. AI-ASSISTED AND AUTOMATED PROCESSING
Candidates shall be informed in advance where an interview is conducted using AI.
AI scoring shall be limited to technical answer content and communication and shall not involve emotion or affect analysis or sensitive behavioural analysis.
Candidate matching shall use keyword and semantic search and shall not constitute AI ranking.
Mock interview reports shall be provided only to the candidate.
No candidate shall be rejected solely on the basis of an AI score.
Where anomaly signals or flags are generated, the candidate shall have an opportunity to review and contest the relevant flag before it is shared with a client.
31. TRAINING AND AWARENESS
The Company shall provide appropriate training and awareness programmes on privacy, information security, confidentiality, phishing and social engineering, secure handling of personal data, incident reporting and responsibilities under this Policy.
32. AUDIT AND MONITORING
The Company shall periodically review its privacy and data-protection controls and may conduct internal audits and reviews covering security, vendors, access controls, retention, policy compliance and incidents.
Material deficiencies identified through such reviews shall be addressed through appropriate corrective measures.
33. CONTRACTUAL REQUIREMENTS
Contracts and agreements may include provisions relating to confidentiality, personal-data protection, security, permitted use, access controls, breach notification, retention and deletion, and regulatory or legal cooperation, as appropriate.
34. DATA PROTECTION BY DESIGN
The Company shall, where practicable, consider privacy and data-protection requirements at the design and development stage of products, services and processes and seek to avoid unnecessary collection or processing of personal data.
35. RECORDS AND DOCUMENTATION
The Company shall maintain appropriate records and documentation relating to privacy notices, consent records, processing arrangements, retention schedules, personal-data breaches, Data Principal requests, grievances, vendor assessments, training and policy reviews.
36. NON-COMPLIANCE
Non-compliance with this Policy may expose the Company to legal, regulatory, financial, contractual and reputational risks.
Employees and other persons who violate this Policy may be subject to disciplinary, contractual or other action, as applicable.
37. POLICY REVIEW
This Policy shall be reviewed at least once every six months and whenever there is a material change in applicable law, business operations, processing activities, security environment or regulatory requirements, or following a significant security or privacy incident.
Amendments shall be made with the approval of the competent authority of the Company.
38. CONTACT DETAILS
Company: Max Stack Labs Technologies Private Limited
Data Protection / Privacy Contact: Arun K Thampy
Designation: Director
Email: arun@quickrekruit.com
Telephone: +91 77368 05150
Office Address: Max Stack Labs Technologies Private Limited, Module C-14, -2 Level, Thejaswini Building, Phase I, Technopark, Thiruvananthapuram, Kerala
Website: https://quickrekruit.com/
`;

const POLICY_LINES = POLICY_TEXT.trim().split("\n");
const SECTION_HEADING_PATTERN = /^\d{1,2}\. [A-Z].*$/;
const SECTION_GROUPS = [
  { label: "Overview", sectionNumbers: [1, 2, 3, 4, 5] },
  {
    label: "Data collection and use",
    sectionNumbers: [6, 7, 8, 9, 10, 11],
  },
  {
    label: "Sharing and retention",
    sectionNumbers: [16, 17, 18, 19, 20, 22, 23, 24, 25],
  },
  {
    label: "User rights",
    sectionNumbers: [12, 13, 14, 27, 28],
  },
  {
    label: "Security and AI",
    sectionNumbers: [15, 21, 26, 29, 30, 31, 32, 33, 34, 35, 36, 37],
  },
  { label: "Contact", sectionNumbers: [38] },
];
const IMPORTANT_SECTIONS = new Set([
  "10-consent",
  "12-rights-of-data-principals",
  "14-grievance-redressal",
  "21-personal-data-breach-management",
  "28-data-deletion",
  "30-ai-assisted-and-automated-processing",
  "38-contact-details",
]);
const POLICY_SECTIONS = POLICY_LINES.reduce<
  Array<{ heading: string; lines: string[] }>
>((sections, line) => {
  if (SECTION_HEADING_PATTERN.test(line)) {
    sections.push({ heading: line, lines: [] });
  } else if (sections.length > 0) {
    sections[sections.length - 1].lines.push(line);
  }
  return sections;
}, []);

function getSectionId(heading: string) {
  return heading
    .replace(/^\d+\.\s*/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function getSectionNumber(heading: string) {
  return Number(heading.match(/^\d+/)?.[0]);
}

function formatSectionHeading(heading: string) {
  const [number, ...words] = heading.split(" ");
  const title = words
    .join(" ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
    .replace(/\bAi\b/g, "AI");
  return `${number} ${title}`;
}

function getSectionContent(lines: string[]) {
  const content: Array<
    | { type: "paragraph"; text: string }
    | { type: "subheading"; text: string }
    | { type: "list"; items: string[] }
  > = [];

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (!line) continue;

    if (/^\d{1,2}\.\d{1,2}\s/.test(line)) {
      content.push({ type: "subheading", text: line });
      continue;
    }

    if (/^(?:[a-p]|\d{1,2})\.\s/.test(line)) {
      const items: string[] = [];
      while (
        index < lines.length &&
        /^(?:[a-p]|\d{1,2})\.\s/.test(lines[index])
      ) {
        items.push(lines[index].replace(/^(?:[a-p]|\d{1,2})\.\s*/, ""));
        index += 1;
      }
      index -= 1;
      content.push({ type: "list", items });
      continue;
    }

    content.push({ type: "paragraph", text: line });
  }

  return content;
}

export default function PrivacyPolicy() {
  const [activeGroup, setActiveGroup] = useState("Overview");
  const readingTime = Math.max(
    1,
    Math.ceil(POLICY_TEXT.trim().split(/\s+/).length / 220),
  );

  useEffect(() => {
    const sectionGroupById = new Map<string, string>();
    SECTION_GROUPS.forEach((group) => {
      group.sectionNumbers.forEach((sectionNumber) => {
        const section = POLICY_SECTIONS.find(
          ({ heading }) => getSectionNumber(heading) === sectionNumber,
        );
        if (section) {
          sectionGroupById.set(getSectionId(section.heading), group.label);
        }
      });
    });

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSections = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (first, second) =>
              first.boundingClientRect.top - second.boundingClientRect.top,
          );
        const nextGroup = visibleSections[0]
          ? sectionGroupById.get(visibleSections[0].target.id)
          : undefined;
        if (nextGroup) setActiveGroup(nextGroup);
      },
      { rootMargin: "-18% 0px -72% 0px" },
    );

    POLICY_SECTIONS.forEach(({ heading }) => {
      const section = document.getElementById(getSectionId(heading));
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  const groupedNavigation = SECTION_GROUPS.map((group) => {
    const firstSection = POLICY_SECTIONS.find(
      ({ heading }) =>
        getSectionNumber(heading) === group.sectionNumbers[0],
    );
    return {
      ...group,
      href: firstSection ? `#${getSectionId(firstSection.heading)}` : "#top",
    };
  });

  return (
    <div
      id="top"
      className="min-h-screen bg-slate-50 font-inter text-slate-900 selection:bg-blue-100 selection:text-blue-900"
    >
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="flex items-center gap-2 transition-opacity hover:opacity-80"
          >
            <img src={logo} alt="Quick Recruit" className="h-12 w-auto" />
          </Link>
          <Link
            to="/"
            className="flex items-center gap-1.5 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back to Home</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-12 lg:flex-row">
          <aside className="hidden w-64 shrink-0 lg:block">
            <div className="sticky top-28 space-y-1">
              <p className="mb-4 px-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                Contents
              </p>
              <nav className="flex flex-col gap-1">
                {groupedNavigation.map((group) => (
                  <a
                    key={group.label}
                    href={group.href}
                    aria-current={activeGroup === group.label ? "location" : undefined}
                    className={`rounded-lg px-3 py-2 text-sm transition-colors ${
                      activeGroup === group.label
                        ? "bg-blue-50 font-semibold text-blue-800"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    {group.label}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          <article className="max-w-3xl flex-1">
            <header className="mb-12">
              <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 p-6 text-white shadow-xl shadow-slate-900/10 sm:p-9">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-blue-100 ring-1 ring-inset ring-white/15">
                  <Shield className="h-3.5 w-3.5" />
                  QUICKREKRUIT PRIVACY NOTICE
                </div>
                <h1 className="max-w-2xl text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
                  QuickRekruit Privacy Notice
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-200">
                  Data Privacy and Personal Data Protection Policy
                </p>
                <div className="mt-6 grid gap-3 border-t border-white/15 pt-5 text-sm text-slate-200 sm:grid-cols-3">
                  <p>
                    <strong className="block text-xs font-semibold uppercase tracking-wider text-blue-200">
                      Reading time
                    </strong>
                    <span className="mt-1 block">About {readingTime} minutes</span>
                  </p>
                  {POLICY_METADATA.filter((item) =>
                    item.startsWith("APPROVED BY THE BOARD ON:"),
                  ).map((item) => {
                    const [label, ...value] = item.split(":");
                    return (
                      <p key={label}>
                        <strong className="block text-xs font-semibold uppercase tracking-wider text-blue-200">
                          Board approval date
                        </strong>
                        <span className="mt-1 block">{value.join(":")}</span>
                      </p>
                    );
                  })}
                  <p>
                    <strong className="block text-xs font-semibold uppercase tracking-wider text-blue-200">
                      Website
                    </strong>
                    <a
                      href="https://quickrekruit.com/"
                      className="mt-1 block underline decoration-white/40 underline-offset-2 hover:decoration-white"
                    >
                      quickrekruit.com
                    </a>
                  </p>
                </div>
              </div>
              <details className="mt-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
                <summary className="cursor-pointer text-sm font-semibold text-slate-700">
                  Policy details
                </summary>
                <div className="mt-3 grid gap-3 border-t border-slate-100 pt-3 text-sm text-slate-600 sm:grid-cols-2">
                  {POLICY_METADATA.filter(
                    (item) =>
                      !item.startsWith("APPROVED BY THE BOARD ON:") &&
                      !item.startsWith("WEBSITE:"),
                  ).map((item) => {
                    const [label, ...value] = item.split(":");
                    return (
                      <p key={label}>
                        <strong className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                          {label}
                        </strong>
                        <span className="mt-1 block">{value.join(":")}</span>
                      </p>
                    );
                  })}
                </div>
              </details>
            </header>

            <section className="mb-6 rounded-2xl border border-blue-100 bg-blue-50/70 p-5 sm:p-6">
              <h2 className="text-lg font-bold text-slate-900">
                Your privacy, at a glance
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                This policy explains what information QuickRekruit collects, how
                we use it, when we share it, and how you can control your data.
              </p>
              <nav
                aria-label="Privacy notice highlights"
                className="mt-4 grid gap-2 sm:grid-cols-2"
              >
                {[
                  { label: "Information we collect", href: "#personal-data-collected-by-the-company" },
                  { label: "How we use information", href: "#purposes-of-processing" },
                  { label: "Who we share it with", href: "#sharing-and-disclosure" },
                  { label: "Your privacy choices", href: "#rights-of-data-principals" },
                  { label: "Request data deletion", href: "#data-deletion" },
                  { label: "Withdraw consent", href: "#consent" },
                  { label: "Contact us", href: "#contact-details" },
                ].map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="rounded-lg bg-white px-3 py-2 text-sm font-medium text-blue-800 ring-1 ring-blue-100 transition-colors hover:bg-blue-100"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            </section>

            <details className="mb-6 rounded-xl border border-slate-200 bg-white lg:hidden">
              <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-slate-800">
                Jump to section
              </summary>
              <nav aria-label="Privacy notice contents" className="grid gap-1 px-3 pb-3">
                {groupedNavigation.map((group) => (
                  <a
                    key={group.label}
                    href={group.href}
                    aria-current={activeGroup === group.label ? "location" : undefined}
                    className={`rounded-lg px-3 py-2 text-sm ${
                      activeGroup === group.label
                        ? "bg-blue-50 font-semibold text-blue-800"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {group.label}
                  </a>
                ))}
              </nav>
            </details>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              {POLICY_SECTIONS.map(({ heading, lines }) => (
                <section
                  id={getSectionId(heading)}
                  key={heading}
                  className={`scroll-mt-28 border-b border-slate-200 px-5 py-6 last:border-b-0 sm:px-8 sm:py-8 ${
                    IMPORTANT_SECTIONS.has(getSectionId(heading))
                      ? "border-l-4 border-l-blue-500 bg-blue-50/30"
                      : ""
                  }`}
                >
                  <h2 className="text-lg font-bold leading-snug text-slate-900 sm:text-xl">
                    {formatSectionHeading(heading)}
                  </h2>
                  <div className="mt-4 space-y-4 text-sm leading-7 text-slate-600 sm:text-base">
                    {getSectionContent(lines).map((block, index) => {
                      if (block.type === "subheading") {
                        return (
                          <h3
                            key={`${index}-${block.text}`}
                            className="pt-2 text-base font-bold text-slate-900"
                          >
                            {block.text}
                          </h3>
                        );
                      }

                      if (block.type === "list") {
                        return (
                          <ul
                            key={`list-${index}`}
                            className="list-disc space-y-2 py-1 pl-6 marker:text-blue-600"
                          >
                            {block.items.map((item) => (
                              <li key={item} className="pl-1">
                                {item}
                              </li>
                            ))}
                          </ul>
                        );
                      }

                      const colonIndex = block.text.indexOf(":");
                      const isLabel = colonIndex > 0 && colonIndex < 45;
                      const definition = block.text.indexOf(" – ");
                      return (
                        <p
                          key={`${index}-${block.text}`}
                          className={
                            definition > 0
                              ? "rounded-lg bg-slate-50 px-4 py-3"
                              : ""
                          }
                        >
                          {definition > 0 ? (
                            <>
                              <strong className="font-semibold text-slate-900">
                                {block.text.slice(0, definition)}
                              </strong>
                              {block.text.slice(definition)}
                            </>
                          ) : isLabel ? (
                            <>
                              <strong className="font-semibold text-slate-900">
                                {block.text.slice(0, colonIndex)}:
                              </strong>
                              {block.text.slice(colonIndex + 1)}
                            </>
                          ) : (
                            block.text
                          )}
                        </p>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>

            <footer className="mt-16 border-t border-slate-200 pt-8 text-center text-sm text-slate-500">
              <p className="font-bold text-slate-900 tracking-wider">
                QUICKREKRUIT
              </p>
              <p className="mt-2">https://quickrekruit.com/</p>
              <p className="mt-4">
                &copy; {new Date().getFullYear()} All Rights Reserved.
              </p>
            </footer>
          </article>
        </div>
      </main>

      <div className="fixed bottom-6 right-6 lg:hidden">
        <a
          href="#top"
          className="flex items-center gap-2 rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-xl transition-transform hover:scale-105 active:scale-95"
        >
          <ArrowUp className="h-4 w-4" />
          Back to top
        </a>
      </div>
    </div>
  );
}
