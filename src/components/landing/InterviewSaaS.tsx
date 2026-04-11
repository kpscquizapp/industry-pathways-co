import { motion } from "framer-motion";

export default function InterviewSaaS() {
  const features = [
    "AI-driven video interviews with real-time scoring",
    "Anomaly detection and proctoring built-in",
    "Custom skill test generation per job role",
    "Detailed candidate scorecards with percentile data",
    "API integration with your ATS or HRMS",
    "White-label option available for agencies",
  ];

  const metrics = [
    { label: "Interviews Today", value: "142", color: "text-white" },
    { label: "Avg. Score", value: "78%", color: "text-emerald-400" },
    { label: "Anomalies Flagged", value: "3", color: "text-orange-500" },
    { label: "Tests Completed", value: "1,890", color: "text-white" },
  ];

  return (
    <section className="py-24 px-6 bg-gradient-to-b from-[#fcfcfc] to-[#ffffff] overflow-hidden scroll-mt-20">
      <div className="max-w-[1240px] mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center px-4 py-1.5 rounded-full bg-gray-50 border border-gray-200 text-gray-500 text-[11px] font-bold uppercase tracking-[1px] mb-6"
          >
            ENTERPRISE
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-heading font-bold text-gray-900 text-[30px] md:text-[45px] tracking-tight mb-6"
          >
            Interview Platform as a Service
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 text-[17px] leading-relaxed font-medium max-w-[700px] mx-auto"
          >
            Use QuickRekruit's AI interview engine as a standalone SaaS tool — plug it into your existing hiring workflow.
          </motion.p>
        </div>

        {/* Main Feature Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white rounded-lg border border-[#00A3E0]/10 p-8 md:p-12 lg:p-16 shadow-2xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        >
          {/* Left Column: Content */}
          <div>
            <motion.h3
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="font-heading font-bold text-gray-900 text-[26px] md:text-[36px] leading-[1.1] mb-6 md:mb-8"
            >
              Power Your Hiring with Our AI Interview Engine
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-gray-500 text-[15px] md:text-[16px] leading-relaxed font-medium mb-8"
            >
              Our interview platform is available standalone for companies that want to add AI-powered interviews to their existing recruitment process without migrating their full pipeline.
            </motion.p>

            <ul className="space-y-4 mb-10">
              {features.map((feature, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.05 }}
                  className="flex items-center gap-3.5"
                >
                  <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-700 text-[14px] md:text-[15px] font-semibold tracking-tight">
                    {feature}
                  </span>
                </motion.li>
              ))}
            </ul>

            <a href="mailto:hello@quickrekruit.com">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-[#192433] text-white px-10 py-4 rounded-full font-bold text-[14px] md:text-[15px] hover:bg-black transition-all shadow-lg shadow-black/10"
                aria-label="Talk to Sales"
              >
                Talk to Sales
              </motion.button>
            </a>
          </div>

          {/* Right Column: Dashboard Graphic */}
          <div className="relative group">
            <div className="bg-[#111827] rounded-[32px] p-6 md:p-10 shadow-3xl border border-white/10 relative overflow-hidden transition-all duration-500 group-hover:border-white/20">
              {/* Metric Grid */}
              <div className="grid grid-cols-2 gap-4 md:gap-5 relative z-10">
                {metrics.map((item, idx) => (
                  <div key={idx} className="bg-white/5 border border-white/[0.08] rounded-2xl p-4 md:p-6 transition-transform duration-300 hover:scale-[1.02]">
                    <p className="text-gray-500 text-[10px] md:text-[11px] font-bold uppercase tracking-widest mb-2">{item.label}</p>
                    <p className={`text-[24px] md:text-[32px] font-extrabold tracking-tight ${item.color}`}>
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Uptime Bar */}
              <div className="mt-6 md:mt-8 bg-white/5 border border-white/[0.08] rounded-2xl p-5 md:p-7 relative z-10 transition-transform duration-300 hover:scale-[1.02]">
                <div className="flex items-end justify-between mb-4">
                  <div>
                    <p className="text-gray-500 text-[10px] md:text-[11px] font-bold uppercase tracking-widest mb-1.5">Platform Uptime</p>
                    <p className="text-[22px] md:text-[28px] font-extrabold text-emerald-400 tracking-tight">99.97%</p>
                  </div>
                  <div className="flex gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="w-1.5 h-3 bg-emerald-400 rounded-full animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
                    ))}
                  </div>
                </div>
                <div className="h-2 md:h-2.5 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "99.97%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-300"
                  />
                </div>
              </div>

              {/* Decorative light streaks */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] -z-0" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 blur-[100px] -z-0" />
            </div>

            {/* Background glow effects */}
            <div className="absolute -inset-4 bg-blue-500/5 blur-[80px] rounded-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
