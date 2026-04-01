import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Asset imports
import contractorPng from "../../assets/contractor.png";
import { Link } from "react-router-dom";
import { RootState } from "@/app/store";
import { useSelector } from "react-redux";
// import benchPng from "../../assets/bench.png";
// import hiringPng from "../../assets/hiring.png";

const TABS = ["CONTRACTORS"];
// , "BENCH", "HIRING"

const TAB_DATA = [
  {
    badge: "JOIN AS CONTRACTOR",
    title: "Individual Contractors",
    desc: "Get matched to jobs automatically and accelerate your career",
    img: contractorPng,
  },
  // {
  //   badge: "LIST BENCH RESOURCES",
  //   title: "Companies with Bench Resources",
  //   desc: "Monetize your idle talent and maximize resource utilization",
  //   img: benchPng,
  // },
  // {
  //   badge: "START HIRING",
  //   title: "Hiring Companies",
  //   desc: "Find and hire the best contract talent with AI-powered insights",
  //   img: hiringPng,
  // },
];

export default function Roles() {
  const [active, setActive] = useState(0);
  const data = TAB_DATA[active];

  const userDetails = useSelector((state: RootState) => state.user.userDetails);
  const isCandidate = userDetails?.role === "candidate";
  const loginPath = isCandidate ? "/contractor/dashboard" : "/contractor-signup";
  const loginLabel = isCandidate ? "Go to Dashboard" : "Get Started";

  return (
    <section
      id="about"
      className="py-20 pb-24 px-6 bg-white overflow-hidden scroll-mt-10"
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-[1200px] mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xs font-bold text-cyan-dark uppercase tracking-[2.5px]"
          >
            PROCESS
          </motion.p>
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-heading font-bold text-gray-900 mt-2.5 tracking-tight text-3xl md:text-4xl lg:text-[48px]"
          >
            Built for Every Role in Contract Hiring
          </motion.h2>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-base text-gray-400 mt-3 mx-auto max-w-md leading-relaxed"
          >
            Whether you're a contractor, a company with
            <br />
            bench resources, or hiring, we've got you covered.
          </motion.p>
        </div>

        {/* Dark card */}
        <div className="dark-card overflow-hidden max-w-[880px] mx-auto shadow-2xl">
          {/* ═══ SLIDING TAB BAR ═══ */}
          <div className="relative flex pt-2.5 px-2.5 gap-0">
            {/* Tab buttons */}
            {TABS.map((tab, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`flex-1 py-3 rounded-t-xl border-none cursor-pointer text-[11px] font-bold tracking-[1.5px] font-body bg-transparent relative z-10 transition-colors duration-300
                  ${active === i ? "text-black" : "text-gray-500 hover:text-gray-300"}`}
              >
                {active === i && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-[#5CE1E6] to-[#38BDF8] rounded-t-xl -z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                {tab}
              </button>
            ))}
          </div>

          {/* ═══ TAB CONTENT ═══ */}
          <div className="tab-content-grid grid grid-cols-1 sm:grid-cols-2 relative min-h-[420px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="col-span-1 sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 w-full h-full"
              >
                {/* Left: Visual Asset */}
                <div className="p-8 pb-4 sm:pb-8 flex items-center justify-center h-full">
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="relative w-full aspect-square max-w-[320px] filter drop-shadow-[0_20px_50px_rgba(92,225,230,0.15)]"
                  >
                    <img
                      src={data.img}
                      alt={data.title}
                      className="w-full h-full object-contain"
                    />
                  </motion.div>
                </div>

                {/* Right: Text Content */}
                <div className="p-8 sm:py-12 sm:pr-12 sm:pl-4 flex flex-col justify-center text-left">
                  <motion.span
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="inline-block self-start px-3 py-1 rounded-full text-[10px] font-bold tracking-[1.5px] uppercase mb-4 border"
                    style={{
                      background: "rgba(92,225,230,.1)",
                      color: "#5CE1E6",
                      borderColor: "rgba(92,225,230,.15)",
                    }}
                  >
                    {data.badge}
                  </motion.span>
                  <motion.h3
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="font-heading font-extrabold text-2xl sm:text-3xl text-white tracking-tight leading-tight"
                  >
                    {data.title}
                  </motion.h3>
                  <motion.p
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-base text-gray-400 mt-4 leading-relaxed max-w-sm"
                  >
                    {data.desc}
                  </motion.p>

                  <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="mt-8"
                  >
                    <Link
                      className="bg-white text-black border-none rounded-full px-7 py-3 text-sm font-bold cursor-pointer hover:bg-cyan-accent transition-colors"
                      to={loginPath}
                    >
                      {loginLabel}
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
