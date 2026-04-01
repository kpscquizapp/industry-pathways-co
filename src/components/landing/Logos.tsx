import { motion } from 'framer-motion'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.5 }
  }
}

export default function Logos() {
  return (
    <section className="py-20 px-6 bg-gray-50 text-center">
      <motion.h2
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="font-heading font-bold text-gray-900 tracking-[-0.5px] max-w-2xl mx-auto text-2xl md:text-3xl lg:text-[48px]"
      >
        When Speed Matters, They Choose{' '}
        <span className="text-[#1d6685] leading-snug">QuickRekruit.</span>
      </motion.h2>

      <motion.div
        className="mt-10 flex flex-col items-center gap-4"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {/* Row 1 */}
        <div className="flex gap-4 flex-wrap justify-center">
          <LogoCircle>
            <svg width="28" height="20" viewBox="0 0 28 20">
              <g stroke="#333" strokeWidth="2" fill="none" strokeLinecap="round">
                {[0, 4, 8, 12, 16, 20, 24].map((x, i) => (
                  <line key={i} x1={x + 2} y1={10 - [3, 7, 5, 9, 6, 8, 4][i]} x2={x + 2} y2={10 + [3, 7, 5, 9, 6, 8, 4][i]} />
                ))}
              </g>
            </svg>
          </LogoCircle>
          <LogoCircle><span className="text-[11px] font-extrabold text-gray-600 tracking-wider">LGN</span></LogoCircle>
          <LogoCircle><span className="text-[11px] font-bold text-gray-600 tracking-wider">LOGO</span></LogoCircle>
          <LogoCircle>
            <svg width="24" height="20" viewBox="0 0 24 20">
              <g stroke="#333" strokeWidth="2.5" fill="none" strokeLinecap="round">
                {[0, 5, 10, 15, 19].map((x, i) => (
                  <line key={i} x1={x + 2} y1={10 - [4, 7, 3, 8, 5][i]} x2={x + 2} y2={10 + [4, 7, 3, 8, 5][i]} />
                ))}
              </g>
            </svg>
          </LogoCircle>
          <LogoCircle><span className="text-[8px] font-bold text-gray-600 tracking-wider">LOGO IPSUM</span></LogoCircle>
        </div>

        {/* Row 2 */}
        <div className="flex gap-4 flex-wrap justify-center">
          <LogoCircle>
            <svg width="30" height="14" viewBox="0 0 30 14">
              <path d="M1 7C4 2 8 2 10 7S16 12 19 7S25 2 29 7" stroke="#333" strokeWidth="2.2" fill="none" strokeLinecap="round" />
            </svg>
          </LogoCircle>
          <LogoCircle>
            <svg width="22" height="22" viewBox="0 0 22 22">
              <g stroke="#333" strokeWidth="1.5" strokeLinecap="round">
                {[...Array(12)].map((_, i) => {
                  const a = (i * 30) * Math.PI / 180
                  return <line key={i} x1={11 + Math.cos(a) * 3.5} y1={11 + Math.sin(a) * 3.5} x2={11 + Math.cos(a) * 9} y2={11 + Math.sin(a) * 9} />
                })}
              </g>
            </svg>
          </LogoCircle>
          <LogoCircle>
            <svg width="22" height="22" viewBox="0 0 22 22">
              <circle cx="11" cy="11" r="3" stroke="#333" strokeWidth="2" fill="none" />
              <circle cx="11" cy="11" r="6.5" stroke="#333" strokeWidth="1.5" fill="none" />
              <circle cx="11" cy="11" r="9.5" stroke="#333" strokeWidth="1" fill="none" />
            </svg>
          </LogoCircle>
          <LogoCircle><span className="text-[10px] font-extrabold text-gray-600 tracking-[3px]">LOGO</span></LogoCircle>
        </div>
      </motion.div>
    </section>
  )
}

function LogoCircle({ children }) {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ scale: 1.3 }}
      className="logo-circle cursor-pointer transition-colors"
    >
      {children}
    </motion.div>
  )
}
