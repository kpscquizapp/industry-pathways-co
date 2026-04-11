import { motion } from "framer-motion";

const steps = [
  {
    number: 1,
    title: "Post JD → AI Extracts Skills",
    description: "Upload your job description in any format. Our AI instantly extracts required skills, experience levels, and role context to build a matching profile.",
  },
  {
    number: 2,
    title: "AI-Ranked Shortlist",
    description: "Candidates are matched against your requirements using semantic AI. View a ranked shortlist with mock scorecards visible — filter and sort by skills, scores, and percentile.",
  },
  {
    number: 3,
    title: "Automated Skill Tests",
    description: "Initiate AI-generated skill tests with video proctoring and anomaly detection. Human review escalation available for false positives.",
  },
  {
    number: 4,
    title: "AI Interview → Deploy",
    description: "Conduct AI-powered interviews post skill test. Get scored insights on technical accuracy, communication, and confidence. Deploy your hire with confidence.",
  },
];

export default function CompanyHiringProcess() {
  return (
    <section id="companies" className="py-24 px-6 bg-white overflow-hidden scroll-mt-20">
      <div className="max-w-[1240px] mx-auto">
        {/* Header */}
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center px-4 py-1.5 rounded-full bg-gray-50 border border-gray-100 text-gray-500 text-[11px] font-bold uppercase tracking-[1px] mb-6 font-mono"
          >
            FOR COMPANIES
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-heading font-bold text-gray-900 text-[30px] md:text-[45px] tracking-tight mb-6"
          >
            Hire in Days, Not Months
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 text-[17px] leading-relaxed font-medium max-w-[650px]"
          >
            Post a job description and let AI deliver a ranked shortlist of verified candidates — complete the entire hiring process in 3 days.
          </motion.p>
        </div>

        {/* Timeline Content */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-[24px] md:left-[45px] top-4 bottom-4 w-[2px] bg-gradient-to-b from-[#00d4ff] to-[#192433]" />

          <div className="space-y-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative group pl-12 md:pl-24"
              >
                {/* Step Number Circle */}
                <div className="absolute left-[24px] md:left-[45px] top-0 w-10 h-10 md:w-14 md:h-14 -translate-x-1/2 rounded-full border-2 border-[#00d4ff] bg-white flex items-center justify-center z-10">
                  <span className="text-[#00A3E0] font-bold text-[14px]">
                    {step.number}
                  </span>
                </div>

                {/* Content Card */}
                <div className="bg-[#F8FBFE] p-6 md:p-10 rounded-2xl border border-[#00A3E0]/10 transition-all duration-300">
                  <h3 className="text-[17px] font-bold text-gray-900 mb-3 tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-gray-500 text-[14px] leading-relaxed font-medium">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
