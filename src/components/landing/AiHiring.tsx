import React from 'react';
import { motion } from 'framer-motion';
import {
  Code2,
  Zap,
  CheckCircle2,
  WandSparkles,
  Rocket,
  Grid,
  FileText
} from 'lucide-react';

const icons = [
  {
    icon: FileText,
    title: "Resume ↔ JD Semantic Matching",
    description: "Deep understanding of skills, experience, and context — not just keyword matching."
  },
  {
    icon: WandSparkles,
    title: "Skill Gap Analysis",
    description: "Instantly identify which candidates have the required skills and where gaps exist."
  },
  {
    icon: Code2,
    title: "Automated Coding & Domain Tests",
    description: "AI-generated skill assessments tailored to each job requirement."
  },
  {
    icon: Rocket,
    title: "AI Interview Scoring",
    description: "Analyze communication, technical depth, and confidence in automated interviews."
  },
  {
    icon: Grid,
    title: "Bias-Reduced Ranking",
    description: "Fair, objective candidate ranking based purely on skills and qualifications."
  },
  {
    icon: Zap,
    title: "Real-Time Processing",
    description: "Get AI-matched shortlists within minutes, not days or weeks."
  }
];

const marqueeItems = [
  "Cost Efficiency",
  "Custom Insights",
  "AI Interview Scoring",
  "Automated Coding & Domain Tests",
  "Semantic Matching",
  "Real-Time Processing",
  "AI Interview Scoring"
];

const AiHiring = () => {
  return (
    <section id="ai-hiring" className="relative py-24 bg-black overflow-hidden font-inter scroll-mt-20">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 z-0 opacity-30"
        style={{
          backgroundImage: `linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}>
      </div>

      {/* Decorative Glows */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-[1240px] mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-[2.5px] mb-6"
          >
            Benefits
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-heading text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight"
          >
            AI That Actually Understands Hiring
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl mx-auto text-gray-400 text-lg md:text-xl leading-relaxed mt-4"
          >
            Our proprietary AI goes beyond basic matching to deliver genuinely qualified candidates.
          </motion.p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20 group">
          {icons.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="relative p-8 rounded-[32px] bg-white/[0.03] border border-white/10 backdrop-blur-md overflow-hidden transition-all duration-300 hover:border-blue-500/30 hover:bg-white/[0.05] h-full flex flex-col"
            >
              {/* Card Inner Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center mb-6 border border-blue-500/30 relative z-10">
                <item.icon className="w-6 h-6 text-blue-400" />
              </div>

              <h3 className="text-xl font-bold text-white mb-3 relative z-10 leading-tight">
                {item.title}
              </h3>

              <p className="text-gray-400 leading-relaxed text-base relative z-10">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Infinite Marquee */}
        <div className="relative mt-12 w-full overflow-hidden py-4 border-t border-b border-white/5">
          {/* Gradient Overlays for Fading edges */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none"></div>

          <div className="flex w-fit animate-infinite-scroll hover:[animation-play-state:paused]">
            {[...marqueeItems, ...marqueeItems].map((item, index) => (
              <div
                key={index}
                className="flex items-center mx-8 whitespace-nowrap bg-[rgba(255,255,255,0.1)] px-4 py-2 rounded-full"
              >
                <div className="w-5 h-5 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center mr-3">
                  <CheckCircle2 className="w-3 h-3 text-blue-400" />
                </div>
                <span className="text-white font-medium tracking-wide uppercase text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes infinite-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-infinite-scroll {
          animation: infinite-scroll 25s linear infinite;
        }
      `}} />
    </section>
  );
};

export default AiHiring;
