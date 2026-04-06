import { motion } from 'framer-motion'
import heroMain from '../../assets/landing page main.png'
import interviewImage from '../../assets/image1.png'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6 }
  }
}

const floatingVariants = (delay = 0) => ({
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      delay
    }
  }
})

export default function Hero() {
  return (
    <section className="pt-24 bg-white text-center overflow-hidden">
      <motion.div
        className="max-w-[1200px] mx-auto px-6 pt-16"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >

        {/* Heading */}
        <motion.h1
          variants={itemVariants}
          className="font-heading font-bold text-gray-900 mt-7 mx-auto max-w-5xl tracking-tight leading-none text-4xl md:text-6xl lg:text-[4rem]"
        >
          Say Goodbye to Slow Hiring.
          <br />
          Experience Quickrekruit.
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className="text-gray-500 text-lg md:text-xl font-medium leading-relaxed mt-5 mx-auto max-w-2xl"
        >
          AI-matched resumes, skill tests, and automated interviews.
          <br className="hidden sm:block" />
          All in one platform.
        </motion.p>

        {/* CTA */}
        {/* <motion.div variants={itemVariants} className="mt-7">
          <motion.button
            className="bg-gray-900 text-white border-none rounded-full px-8 py-3.5 text-base font-semibold cursor-pointer font-body hover:text-[#38BDF8]"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            Hire Talent
          </motion.button>
        </motion.div> */}

        {/* Stars */}
        <motion.div
          variants={itemVariants}
          className="mt-5 flex items-center justify-center gap-1.5 text-sm text-gray-400"
        >
          <span className="text-gray-900 text-base">★★★★</span>
          <span className="text-gray-300 text-base">★</span>
          <span className="ml-1">Over 500+ Five Star Reviews</span>
        </motion.div>

        {/* ═══ LAPTOP MOCKUP ═══ */}
        <motion.div
          variants={itemVariants}
          className="mt-12 relative max-w-[880px] mx-auto"
        >
          {/* Laptop frame */}
          <div className="bg-gray-900 rounded-t-2xl p-2.5 pb-0 shadow-2xl overflow-hidden">
            {/* Screen */}
            <div className="rounded-t-xl overflow-hidden relative h-[clamp(200px,38vw,460px)] group">

              {/* Photo scene */}
              <img
                src={heroMain}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                alt="Quickrekruit Dashboard"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />

              {/* Floating Card 1: New Applicants — hidden on xs, visible sm+ */}
              <motion.div
                inherit={false}
                className="absolute top-[7%] left-[2%] bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl z-10 border border-white/20
           hidden sm:block
           p-2 sm:p-3 lg:p-4 lg:pr-5
           w-[clamp(110px,14vw,195px)]"
                {...floatingVariants(0)}
              >
                <div className="flex items-start justify-between mb-1.5 sm:mb-2.5">
                  <div className="w-7 h-7 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-xl bg-black/80 flex items-center justify-center">
                    <svg
                      width="14" height="14"
                      className="sm:w-[18px] sm:h-[18px] lg:w-5 lg:h-5"
                      viewBox="0 0 24 24" fill="none" stroke="#0ea5e9"
                      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    >
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <line x1="19" y1="8" x2="19" y2="14" />
                      <line x1="22" y1="11" x2="16" y2="11" />
                    </svg>
                  </div>
                  <span className="text-green-500 text-[10px] sm:text-sm font-semibold flex items-center gap-0.5">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M5 8V2M2 4.5L5 2L8 4.5" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    12%
                  </span>
                </div>
                <div className="text-left">
                  <div className="text-[10px] sm:text-xs text-gray-900 font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                    New Applicants
                  </div>
                  <div className="text-lg sm:text-2xl lg:text-[28px] font-extrabold text-gray-900 font-heading mt-0.5 tracking-tight">
                    1,247
                  </div>
                  <div className="text-[9px] sm:text-[11px] text-gray-900 mt-0.5">This month</div>
                </div>
              </motion.div>

              {/* Floating Card 2: Interview Schedule — always visible, repositioned on small */}
              <motion.div
                inherit={false}
                className="absolute bg-[#1a2236]/90 backdrop-blur-sm rounded-xl shadow-2xl z-10
           bottom-[4%] left-[2%] w-[clamp(60px,12vw,90px)]
           md:bottom-[8%] md:left-[3%] md:w-[clamp(175px,15%,190px)]"
                {...floatingVariants(0.5)}
              >
                <img
                  src={interviewImage}
                  alt="interviewImage"
                  className="w-full h-full object-cover rounded-xl"
                />
              </motion.div>

              {/* Floating Card 3: Application Trends — hidden on xs, visible sm+ */}
              <motion.div
                inherit={false}
                className="absolute bottom-[6%] right-[1.5%] bg-[#1a1f2e]/90 backdrop-blur-sm rounded-xl shadow-2xl z-10 border border-white/5
           hidden sm:block
           px-2 py-2 sm:px-2.5 sm:py-2 lg:px-3 lg:py-2.5
           w-[clamp(200px,18%,210px)]"
                {...floatingVariants(1)}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[8px] sm:text-[9px] text-gray-400 font-semibold truncate">
                    Application Trends
                  </span>
                  <div className="flex gap-0.5 sm:gap-1 shrink-0">
                    {['Week', 'Mo', 'Yr'].map((t, i) => (
                      <span
                        key={i}
                        className={`text-[6px] sm:text-[7px] px-1 sm:px-1.5 py-0.5 rounded font-semibold ${i === 0 ? 'bg-green-500 text-white' : 'text-gray-500'
                          }`}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <svg viewBox="0 0 180 55" width="100%" height="40" className="block">
                  <path
                    d="M0,42 L18,40 L36,36 L54,38 L72,32 L90,28 L108,22 L126,18 L144,20 L162,14 L180,12"
                    fill="none" stroke="#5CE1E6" strokeWidth="1.8" strokeLinecap="round"
                  />
                  <path
                    d="M0,48 L18,46 L36,44 L54,47 L72,42 L90,40 L108,37 L126,35 L144,33 L162,31 L180,30"
                    fill="none" stroke="#8b5cf6" strokeWidth="1.8" strokeLinecap="round" opacity="0.7"
                  />
                </svg>
                <div className="flex gap-2 mt-1">
                  <span className="text-[6px] sm:text-[7px] text-cyan-accent flex items-center gap-1">
                    <span className="w-1.5 h-[1.5px] bg-cyan-accent rounded" />
                    1,283 views
                  </span>
                  <span className="text-[6px] sm:text-[7px] text-purple-400 flex items-center gap-1">
                    <span className="w-1.5 h-[1.5px] bg-purple-400 rounded" />
                    324 applications
                  </span>
                </div>
              </motion.div>

            </div>
          </div>

          {/* Laptop chin */}
          <div className="h-2.5 sm:h-3 bg-gray-300 rounded-b-lg flex justify-center items-center">
            <div className="w-10 sm:w-12 h-[3px] bg-gray-400 rounded" />
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
