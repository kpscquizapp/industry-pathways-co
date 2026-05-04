import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Asset imports
import contractorPng from "../../assets/contractor.png";
import benchPng from "../../assets/bench.png";
import hiringPng from "../../assets/hiring.png";

const TABS = ["CONTRACTORS", "BENCH", "HIRING"];

const TAB_DATA = [
  {
    badge: "JOIN AS CONTRACTOR",
    title: "Individual Contractors",
    desc: "Get matched to jobs automatically and accelerate your career. Upload once, get found by companies looking for your exact skills.",
    img: contractorPng,
    color: "#5CE1E6",
    stats: [
      { label: "Jobs Matched", value: "1,240" },
      { label: "Avg. Salary", value: "$120k" },
    ],
    features: [
      "AI-powered job matching based on your skills",
      "Mock interview with detailed scorecard",
      "Skill gap analysis with growth recommendations",
      "Career path visualization and guidance",
      "Passive profile — no browsing or applying needed",
    ],
    cta: "Get Started",
  },
  {
    badge: "LIST YOUR BENCH",
    title: "Bench Resource Companies",
    desc: "Have talent on the bench? List your available resources and let AI match them to open requirements across the marketplace.",
    img: benchPng,
    color: "#5CE1E6",
    stats: [
      { label: "Active Listings", value: "860+" },
      { label: "Avg. Fill Time", value: "3 days" },
    ],
    features: [
      "Bulk upload bench profiles with skill tagging",
      "AI matches your bench to open requirements",
      "Real-time notifications when a match is found",
      "Track deployment status per resource",
      "Dashboard with utilization & revenue metrics",
    ],
    cta: "List Your Bench",
  },
  {
    badge: "START HIRING",
    title: "Hiring Companies",
    desc: "Post a job description and let AI deliver a ranked shortlist of pre-verified, skill-tested candidates. Complete your entire hiring process in 3 days from posting to deployment.",
    img: hiringPng,
    color: "#5CE1E6",
    stats: [
      { label: "Time to Hire", value: "3 Days" },
      { label: "Talent Pool", value: "10k+" },
    ],
    features: [
      "Post JD in any format — AI extracts skills instantly",
      "AI-ranked shortlist with mock scorecards visible",
      "Filter & sort candidates by skills, scores, percentile",
      "AI-powered interviews with scored insights",
      "Human review escalation for flagged anomalies",
      "Bias-reduced ranking based purely on qualifications",
    ],
    cta: "Start Hiring",
  },
];

export default function Roles() {
  const [active, setActive] = useState(0);
  const data = TAB_DATA[active];

  // Auto-switch tabs every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % TABS.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section
      id="about"
      className="py-24 px-6 bg-white overflow-hidden scroll-mt-10"
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-[1240px] mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center px-4 py-1.5 rounded-full bg-black/5 border border-black/10 text-gray-600 text-xs font-bold uppercase tracking-[2.5px] mb-6 font-mono"
          >
            PROCESS
          </motion.div>
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-heading tracking-tight leading-[1.2] font-bold text-gray-900 text-[30px] md:text-[45px]"
          >
            Built for Every Role in Contract Hiring
          </motion.h2>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto text-gray-500 font-medium text-[17px] leading-relaxed mt-4"
          >
            Whether you're a contractor, a company with
            <br className="hidden sm:block" />
            bench resources, or hiring, we've got you covered.
          </motion.p>
        </div>

        {/* Dark card */}
        <div className="dark-card overflow-hidden max-w-[1200px] min-h-[600px] mx-auto shadow-2xl relative border border-white/[0.05]">
          {/* ═══ SLIDING TAB BAR ═══ */}
          <div className="relative flex p-3 sm:p-4 gap-3 sm:gap-4 items-center justify-center">
            {/* Tab buttons */}
            {TABS.map((tab, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`flex-1 max-w-full py-1 rounded-full border cursor-pointer text-[10px] sm:text-[11px] font-bold tracking-[2px] min-w-0 min-h-0 font-mono relative transition-all duration-300
                  ${active === i
                    ? "text-white border-transparent bg-gradient-to-r from-[#2B4C5A] via-[#38BDF8] to-[#5CE1E6]"
                    : "text-white border-white/[0.08] bg-[#292929] hover:bg-white/[0.05] hover:border-white/20"
                  }`}
              >
                {active === i && (
                  <motion.div
                    layoutId="activeTabRole"
                    className="absolute inset-0 bg-gradient-to-r from-[#2B4C5A] via-[#38BDF8] to-[#5CE1E6] rounded-full -z-10"
                    transition={{ type: "spring", bounce: 0.1, duration: 0.5 }}
                  />
                )}
                <span className="relative z-10">{tab}</span>
              </button>
            ))}
          </div>

          {/* ═══ TAB CONTENT ═══ */}
          <div className="tab-content-grid grid grid-cols-1 md:grid-cols-2 relative min-h-[500px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 w-full h-full"
              >
                {/* Left: Visual Asset */}
                <div className="p-4 sm:p-8 lg:p-10 flex items-center justify-center bg-black/[0.02]">
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="relative w-full aspect-square max-w-[380px] lg:max-w-[420px] filter drop-shadow-[0_20px_60px_rgba(92,225,230,0.15)]"
                  >
                    <img
                      src={data.img}
                      alt={data.title}
                      className="w-full h-full object-contain"
                    />
                  </motion.div>
                </div>

                {/* Right: Text Content */}
                <div className="p-6 sm:p-10 lg:p-12 flex flex-col justify-center items-start text-left">
                  <motion.span
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="inline-block self-start px-3 py-1 rounded-full text-[9px] font-bold tracking-[2px] uppercase mb-3 border font-mono"
                    style={{
                      background: `${data.color}15`,
                      color: data.color,
                      borderColor: `${data.color}25`,
                    }}
                  >
                    {data.badge}
                  </motion.span>
                  <motion.h3
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="font-heading font-extrabold text-[24px] md:text-[32px] text-white tracking-tight leading-[1.1] mb-3"
                  >
                    {data.title}
                  </motion.h3>
                  <motion.p
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-[14px] md:text-[15px] text-gray-400 font-medium leading-relaxed max-w-xl mb-6"
                  >
                    {data.desc}
                  </motion.p>

                  {/* Stats Row */}
                  {data.stats && (
                    <motion.div
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="grid grid-cols-2 gap-3 w-full mb-6"
                    >
                      {data.stats.map((stat, idx) => (
                        <div
                          key={idx}
                          className="bg-white/[0.03] border border-white/[0.05] rounded-[12px] p-4 transition-colors hover:bg-white/[0.05]"
                        >
                          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[1px] mb-1">
                            {stat.label}
                          </p>
                          <p className="text-white text-[20px] font-extrabold tracking-tight">
                            {stat.value}
                          </p>
                        </div>
                      ))}
                    </motion.div>
                  )}

                  {/* Features List */}
                  {data.features && (
                    <motion.ul
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="space-y-3 mb-8"
                    >
                      {data.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <svg
                            className="w-3.5 h-3.5 mt-1 flex-shrink-0"
                            style={{ color: data.color }}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={3}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <span className="text-[13px] md:text-[14px] text-gray-300 font-medium tracking-wide">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </motion.ul>
                  )}

                  {/* CTA Button */}
                  {/* <motion.button
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="font-extrabold px-8 py-3.5 rounded-full text-[14px] transition-all hover:shadow-[0_0_15px_rgba(92,225,230,0.3)]"
                    style={{
                      background: data.color,
                      color: data.color === "#5CE1E6" ? "black" : "white",
                    }}
                  >
                    {data.cta}
                  </motion.button> */}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
