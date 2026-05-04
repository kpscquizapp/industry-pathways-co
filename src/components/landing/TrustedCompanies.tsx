import { cn } from "@/lib/utils";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef } from "react";

const AnimatedNumber = ({
  value,
  suffix = "%",
  className
}: {
  value: number;
  suffix?: string;
  className?: string
}) => {
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
    <span className={cn("flex items-baseline font-bold text-4xl md:text-5xl lg:text-6xl text-gray-900", className)}>
      <span ref={ref}>0</span>
      <span className="text-[#1d6685] ml-1">{suffix}</span>
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
      label: "AI-Assessed",
      description: "Every candidate verified through AI",
    },
    {
      value: 3,
      label: "Avg. Deployment",
      description: "From posting to hire in record time",
      suffix: " days",
    },
  ];

  return (
    <section className="py-24 sm:py-32 px-6 bg-white overflow-hidden text-left">
      <div className="max-w-[1240px] mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="font-heading font-bold text-gray-900 tracking-tight text-3xl sm:text-4xl md:text-5xl mb-20 text-left"
        >
          Trusted by Companies Worldwide
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-12 md:gap-y-16 gap-x-8 md:gap-x-12">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="flex flex-col items-start space-y-4"
            >
              <div className="w-full flex items-start justify-start">
                <AnimatedNumber
                  value={stat.value}
                  suffix={stat.suffix}
                  className="text-[48px] md:text-[56px] lg:text-[64px] font-medium"
                />
              </div>
              <div className="space-y-1 flex flex-col items-start w-full text-left">
                <h3 className="text-xl font-medium text-gray-900">{stat.label}</h3>
                <p className="text-gray-500 text-sm md:text-base">
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
