import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X } from 'lucide-react';

const faqData = [
  {
    id: 1,
    question: "What is QuickRekruit?",
    answer: "QuickRekruit is a smart hiring platform that helps businesses find, screen, and hire the right candidates faster using streamlined workflows and modern tools."
  },
  {
    id: 2,
    question: "Who is QuickRekruit for?",
    answer: "It’s built for startups, SMEs, and enterprises looking to simplify recruitment and reduce hiring time."
  },
  {
    id: 3,
    question: "How is QuickRekruit different from other hiring platforms?",
    answer: "We focus on speed, simplicity, and quality—helping you move from job posting to hiring in record time without unnecessary complexity."
  },
  {
    id: 4,
    question: "How quickly can I start hiring?",
    answer: "You can start posting jobs and receiving applications within minutes of setting up your account."
  },
  {
    id: 5,
    question: "Does QuickRekruit pre-screen candidates?",
    answer: "Yes, we help filter candidates based on your requirements so you only see the most relevant profiles."
  }
];

const FAQ = () => {
  const [activeId, setActiveId] = useState<number | null>(1);

  const toggleAccordion = (id: number) => {
    setActiveId(activeId === id ? null : id);
  };

  return (
    <section id="faq" className="py-24 bg-[#F8F8F8] font-inter text-center">
      <div className="container mx-auto px-6 max-w-4xl">
        {/* Section Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center px-4 py-1.5 rounded-full bg-black/5 border border-black/10 text-gray-600 text-xs font-bold uppercase tracking-[2.5px] mb-6"
          >
            Frequently Asked Questions
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-heading text-gray-900 text-4xl md:text-5xl font-bold mb-6 tracking-tight leading-tight"
          >
            Wondering About Something?<br />
            <span>Let’s Clear Things Up!</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto text-gray-500 text-lg md:text-xl leading-relaxed mt-4"
          >
            We've gathered all the important info right here. Explore our FAQs and find the answers you need.
          </motion.p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {faqData.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * index }}
              className={`rounded-[10px] overflow-hidden transition-all duration-500 ${activeId === item.id ? 'bg-[#F4F4F4]' : 'bg-white border border-gray-100'}`}
            >
              <button
                onClick={() => toggleAccordion(item.id)}
                className={`w-full flex items-center justify-between p-6 md:p-8 text-left transition-colors duration-300 ${activeId === item.id ? 'bg-black text-[#10BCF9]' : 'text-black hover:bg-gray-50'}`}
              >
                <span className="text-lg md:text-xl font-bold pr-8">
                  {index + 1}. {item.question}
                </span>
                <div className={`flex-shrink-0 transition-transform duration-300 ${activeId === item.id ? 'rotate-0' : 'rotate-0'}`}>
                  {activeId === item.id ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Plus className="w-5 h-5" />
                  )}
                </div>
              </button>

              <AnimatePresence>
                {activeId === item.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                  >
                    <div className="px-6 pb-8 md:px-8 md:pb-10 pt-2 text-gray-600 text-lg leading-relaxed">
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
