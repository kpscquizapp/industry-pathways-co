import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";

const AnimatedNumber = ({ value, suffix = "%" }: { value: number; suffix?: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 30,
    stiffness: 100,
  });
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [isInView, value, motionValue]);

  useEffect(() => {
    return springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = Math.round(latest).toString();
      }
    });
  }, [springValue]);

  return (
    <span className="flex items-baseline font-bold text-4xl md:text-5xl lg:text-6xl text-gray-900">
      <span ref={ref}>0</span>
      <span className="text-[#00A3E0] ml-1">{suffix}</span>
    </span>
  );
};

export default function TrustedCompanies() {
  const stats = [
    {
      value: 70,
      label: "Faster Hiring",
      description: "Reduce time-to-hire with AI automation",
    },
    {
      value: 90,
      label: "Skill Match Accuracy",
      description: "Precise matching using semantic analysis",
    },
    {
      value: 100,
      label: "AI-Assessed Candidates",
      description: "Every candidate verified through AI",
    },
  ];

  return (
    <section className="py-28 sm:py-48 px-6 bg-white overflow-hidden text-center">
      <div className="max-w-[1240px] mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="font-heading font-bold text-gray-900 tracking-tight text-3xl sm:text-4xl md:text-5xl mb-20 text-left sm:text-center"
        >
          Trusted by Companies Worldwide
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 lg:gap-16">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="flex flex-col items-center text-center space-y-4"
            >
              <div className="w-full flex items-start justify-start sm:items-center sm:justify-center">
                <AnimatedNumber value={stat.value} />
              </div>
              <div className="space-y-1 flex flex-col items-start w-full sm:items-center sm:justify-center">
                <h3 className="text-xl font-medium text-gray-900">{stat.label}</h3>
                <p className="text-gray-500 text-sm md:text-base max-w-[280px]">
                  {stat.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
