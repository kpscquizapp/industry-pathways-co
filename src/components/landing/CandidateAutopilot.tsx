import { motion } from "framer-motion";
import { FileText, Eye, TrendingUp, Map, Bell, BarChart3, Target } from "lucide-react";

const features = [
  {
    title: "Upload Once, Get Found",
    description: "Upload your resume once — AI extracts your skills and stores them. No job browsing, no applying. Fully passive.",
    icon: <FileText className="w-6 h-6 text-blue-500" />,
    iconBg: "bg-blue-50",
  },
  {
    title: "Profile Visibility Dashboard",
    description: "See how many companies viewed your profile, shortlist status per opportunity, and real-time hiring progress.",
    icon: <Eye className="w-6 h-6 text-red-500" />,
    iconBg: "bg-red-50",
  },
  {
    title: "Skill Gap Insights",
    description: "Get notified when you're close to a match — \"3 companies searched React but your profile didn't match.\" Know exactly what to learn.",
    icon: <TrendingUp className="w-6 h-6 text-indigo-500" />,
    iconBg: "bg-indigo-50",
  },
  {
    title: "Career Path Visualization",
    description: "Enter your known skills and let AI recommend a personalized growth path with market demand signals and learning resources.",
    icon: <Map className="w-6 h-6 text-emerald-500" />,
    iconBg: "bg-emerald-50",
  },
  {
    title: "Skill Test Notifications",
    description: "When a company selects your profile, you'll receive an instant notification to complete a tailored AI skill assessment.",
    icon: <Target className="w-6 h-6 text-red-500" />,
    iconBg: "bg-cyan-50",
  },
  {
    title: "Score-Driven Visibility",
    description: "Your mock interview scorecard appears on your profile. Candidates scoring 75+ receive 2x more employer views.",
    icon: <BarChart3 className="w-6 h-6 text-pink-500" />,
    iconBg: "bg-pink-50",
  },
];

export default function CandidateAutopilot() {
  return (
    <section id="candidates" className="py-24 px-6 bg-gradient-to-b from-[#f7f8fa] to-[#ffffff] scroll-mt-20">
      <div className="max-w-[1240px] mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#E6F7F9] text-[#00A3E0] text-[11px] font-bold uppercase tracking-[1px] mb-6 font-mono"
          >
            FOR CANDIDATES
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-heading font-bold text-gray-900 text-3xl md:text-[45px] lg:text-5xl tracking-tight mb-6"
          >
            Your Career on Autopilot
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto text-gray-500 text-[17px] leading-relaxed font-medium"
          >
            Upload your resume once. Our AI does the rest — matching, skill tracking, and career growth recommendations.
          </motion.p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-8 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className={`w-12 h-12 ${feature.iconBg} rounded-xl flex items-center justify-center mb-6`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 tracking-tight">
                {feature.title}
              </h3>
              <p className="text-gray-500 text-[15px] leading-relaxed font-normal">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
