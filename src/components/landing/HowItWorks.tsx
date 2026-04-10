import { motion } from "framer-motion";
import {
  Figma,
  Slack,
  Framer,
  Github,
  Trello,
  Chrome,
  Codepen,
  Database,
  Code2,
  Terminal,
  Cpu,
  Layers,
} from "lucide-react";

// Asset imports
import hiw1 from "../../assets/how it work image1.png";
import profilesImg from "../../assets/how it work image 2.png";

const STEPS = [
  {
    title: "Post Job / Join Marketplace",
    desc: "Upload your job description or register as a contractor. Our platform accepts all formats and our AI instantly extracts required skills.",
    features: [
      "AI-powered matching",
      "Faster turnaround",
      "Flexible engagement",
    ],
    imgType: "marketplace",
  },
  {
    title: "AI Match + Skill Validation",
    desc: "Our AI analyzes resumes against job requirements using semantic matching, validates skills through automated coding and domain tests.",
    features: [
      "Precision matching",
      "Automated skill tests",
      "Data-driven insights",
    ],
    imgType: "match",
  },
  {
    title: "Interview & Deploy",
    desc: "AI-powered interviews provide actionable insights with anomaly detection. Hire with confidence and deploy within days, not weeks.",
    features: [
      "AI-driven interviews",
      "Actionable insights",
      "Rapid deployment",
    ],
    imgType: "deploy",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6 },
  },
};

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="py-24 px-6 bg-white overflow-hidden scroll-mt-10"
    >
      <span id="features" className="block h-0 scroll-mt-10" aria-hidden="true" />
      <div className="max-w-[1240px] mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center px-4 py-1.5 rounded-full bg-black/5 border border-black/10 text-gray-600 text-[11px] font-bold uppercase tracking-[2.5px] mb-6 font-mono"
          >
            AI POWERED
          </motion.div>
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-heading font-bold text-gray-900 tracking-tight text-[30px] md:text-[45px]"
          >
            How It Works
          </motion.h2>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="max-w-3xl mx-auto font-medium text-gray-500 text-[17px] leading-relaxed mt-4"
          >
            From job posting to deployment in three simple steps. Our AI handles
            the heavy lifting.
          </motion.p>
        </div>

        {/* Cards grid */}
        <motion.div
          className="hiw-grid grid grid-cols-1 md:grid-cols-3 gap-7"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {STEPS.map((step, i) => (
            <StepCard key={i} step={step} index={i} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function StepCard({ step, index }) {
  return (
    <motion.div
      variants={cardVariants}
      className="bg-white rounded-2xl py-2 flex flex-col h-full"
    >
      <CardImage type={step.imgType} />
      <div className="py-4 flex-1 flex flex-col">
        <h3 className="font-heading font-bold text-[27px] text-gray-900 mt-5 tracking-tight">
          {step.title}
        </h3>
        <p className="text-[17px] text-gray-600 font-medium mt-2.5 leading-relaxed">
          {step.desc}
        </p>
        <div className="mt-auto pt-4 flex flex-col gap-2">
          {step.features.map((feature, i) => (
            <div key={i} className="flex items-center gap-2">
              <CheckIcon />
              <span className="text-sm text-gray-800 font-medium">
                {feature}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function CheckIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className="check-icon"
    >
      <circle cx="8" cy="8" r="7" fill="#0ea5e9" opacity="0.12" />
      <path
        d="M5 8l2.5 2.5L11 6"
        stroke="#0ea5e9"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const MarqueeRow = ({ icons, reverse = false }) => (
  <div className="flex overflow-hidden py-1 whitespace-nowrap">
    <motion.div
      inherit={false}
      initial={{ x: reverse ? "-50%" : "0%" }}
      animate={{ x: reverse ? "0%" : "-50%" }}
      transition={{
        duration: 30,
        ease: "linear",
        repeat: Infinity,
        repeatType: "loop",
      }}
      className="flex gap-4 shrink-0"
    >
      {[...icons, ...icons, ...icons, ...icons].map((Icon, i) => (
        <div
          key={i}
          className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shrink-0"
        >
          <Icon size={22} />
        </div>
      ))}
    </motion.div>
  </div>
);

function CardImage({ type }) {
  if (type === "marketplace") {
    return (
      <div className="card-image bg-gray-100 overflow-hidden relative group h-[250px]  border-[10px] border-black rounded-2xl shadow-xl">
        <img
          src={hiw1}
          alt="Marketplace"
          className="w-full h-full object-cover transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>
    );
  }

  if (type === "match") {
    const row1 = [Figma, Slack, Framer, Github, Trello, Chrome];
    const row2 = [Codepen, Database, Code2, Terminal, Cpu, Layers];

    return (
      <div className="card-image bg-[#0f1520] rounded-xl overflow-hidden relative flex flex-col justify-center p-4 h-[250px]  border-[10px] border-black rounded-2xl shadow-xl">
        <div className="space-y-4 relative z-10 opacity-30">
          <MarqueeRow icons={row1} />
          <MarqueeRow icons={row2} reverse />
        </div>
      </div>
    );
  }

  // Deploy/Profiles
  return (
    <div className="card-image bg-gray-900 rounded-xl overflow-hidden relative h-[250px] border-[10px] border-black rounded-2xl shadow-xl">
      <div className="absolute top-0 left-0 w-full p-4 z-20 bg-gradient-to-b from-gray-900 to-transparent">
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-gray-200 font-bold uppercase tracking-wider">
            Today's Interviews
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-accent text-black font-extrabold shadow-lg">
            LIVE
          </span>
        </div>
      </div>

      <div className="relative w-full h-full pt-10 px-4 overflow-hidden">
        <motion.div
          inherit={false}
          initial={{ y: "0%" }}
          animate={{ y: "-50%" }}
          transition={{
            duration: 20,
            ease: "linear",
            repeat: Infinity,
            repeatType: "loop",
          }}
          className="flex flex-col gap-4"
        >
          <img
            src={profilesImg}
            alt="Candidate Profiles"
            className="w-full rounded-lg shadow-sm"
          />
          <img
            src={profilesImg}
            alt="Candidate Profiles"
            className="w-full rounded-lg shadow-sm"
          />
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-gray-900 to-transparent z-20" />
    </div>
  );
}
