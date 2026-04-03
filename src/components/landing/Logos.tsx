import React from 'react';
import { motion } from 'framer-motion';
import logo1 from "../../assets/logo1.png";
import logo2 from "../../assets/logo2.png";
import logo3 from "../../assets/logo3.png";
import logo4 from "../../assets/logo4.png";


const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { scale: 0.8, opacity: 0, y: 20 },
  visible: {
    scale: 1,
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 15 } as const,
  },
} as const;

const floatingAnimation = (delay = 0) => ({
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
      delay,
    } as const,
  },
});

export default function Logos() {
  return (
    <section className="py-16 md:py-32 px-6 bg-white text-center overflow-hidden">
      <div className="max-w-[1240px] mx-auto">
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="font-heading font-bold text-gray-900 tracking-tight max-w-3xl mx-auto text-3xl md:text-5xl mb-16"
        >
          When Speed Matters, They Choose{' '}
          <span className="text-[#1d6685] leading-snug">QuickRekruit.</span>
        </motion.h2>

        <motion.div
          className="flex flex-col items-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Squeezed Bubble Cluster */}
          <div className="relative flex flex-col items-center">
            {/* Row 1 — 5 circles */}
            <div className="flex -space-x-4 mb-[-24px] md:mb-[-40px] relative z-10">
              {[0, 1, 2, 3].map((i) => (
                <LogoBubble key={`r1-${i}`} index={i} delay={i * 0.1}>
                  <PlaceholderLogo index={i} />
                </LogoBubble>
              ))}
            </div>

            {/* Row 2 — 4 circles (offset and nestled) */}
            {/* <div className="flex -space-x-4 md:-space-x-8 relative z-0">
              {[5, 6, 7, 8].map((i) => (
                <LogoBubble key={`r2-${i}`} index={i} delay={i * 0.1}>
                  <PlaceholderLogo index={i} />
                </LogoBubble>
              ))}
            </div> */}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

interface LogoBubbleProps {
  children: React.ReactNode;
  index: number;
  delay: number;
}

function LogoBubble({ children, index, delay }: LogoBubbleProps) {
  return (
    <motion.div
      variants={itemVariants}
      className="relative"
    >
      <motion.div
        {...floatingAnimation(delay)}
        whileHover={{ scale: 1.1, zIndex: 50, transition: { duration: 0.2 } }}
        className="w-20 h-20 sm:w-28 sm:h-28 md:w-40 md:h-40 rounded-full bg-[#f8f9fa] border border-gray-100 flex items-center justify-center p-4 shadow-sm hover:shadow-xl transition-shadow cursor-pointer"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

interface PlaceholderLogoProps {
  index: number;
}

function PlaceholderLogo({ index }: PlaceholderLogoProps) {
  // Placeholder minimalist "logo" designs as seen in the reference image
  const logos = [
    <img src={logo1} alt="logo1" className='w-full h-full object-contain' />,
    <img src={logo2} alt="logo2" className='w-full h-full object-contain' />,
    <img src={logo3} alt="logo3" className='w-full h-full object-contain' />,
    <img src={logo4} alt="logo4" className='w-full h-full object-contain' />,
  ];

  return <div className="text-gray-900 flex items-center justify-center w-full h-full">{logos[index % logos.length]}</div>;
}
