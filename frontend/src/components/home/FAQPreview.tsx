"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, HelpCircle, ArrowRight } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function FAQPreview() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "How do I join a tournament?",
      answer: "Simply create an account, browse available tournaments, pay the entry fee (if any), and you're in! You'll receive all match details via email and on your dashboard.",
      color: "#ef4444"
    },
    {
      question: "How are winners verified?",
      answer: "Every match is verified by both AI systems and human spectators to ensure accuracy and fairness. Results are cross-checked before prize distribution.",
      color: "#22c55e"
    },
    {
      question: "When do I receive my winnings?",
      answer: "Winnings are processed within 24-48 hours after match verification. Payments are made directly to your registered bank account in Nigerian Naira.",
      color: "#ef4444"
    },
    {
      question: "Can I withdraw my entry fee?",
      answer: "Entry fees are non-refundable once a tournament starts. However, if a tournament is cancelled before starting, full refunds are issued automatically.",
      color: "#22c55e"
    },
    {
      question: "What games are supported?",
      answer: "We currently support PUBG Mobile, Valorant, CS:GO, Fortnite, Apex Legends, and more. New games are added regularly based on community demand.",
      color: "#ef4444"
    }
  ];

  return (
    <section className="relative py-24 px-4 bg-gradient-to-b from-black via-slate-950 to-black light:from-[#f5f5f5] light:via-[#e8e8e8] light:to-[#f5f5f5] overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(239, 68, 68, 0.3) 1px, transparent 0)',
            backgroundSize: '30px 30px',
          }}
        />
        
        {/* Animated circles */}
        <motion.div
          className="absolute top-20 left-20 w-64 h-64 bg-red-600/10 light:bg-red-600/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 5, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-64 h-64 bg-green-600/10 light:bg-green-600/5 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5]
          }}
          transition={{ duration: 5, repeat: Infinity }}
        />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-red-500 mb-4 font-black"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <HelpCircle className="w-4 h-4" />
            Got Questions?
          </motion.div>
          <h2 className="text-5xl md:text-6xl font-black text-white light:text-gray-900 mb-4">
            Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-green-500">Questions</span>
          </h2>
          <p className="text-gray-400 light:text-gray-600 text-lg">
            Quick answers to common questions about Metrix
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <div className="space-y-4 mb-12">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            
            return (
              <motion.div
                key={index}
                className="group"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <motion.div
                  className="relative bg-black/60 light:bg-white/80 backdrop-blur-sm border-2 transition-all duration-300 overflow-hidden rounded-2xl"
                  style={{
                    borderColor: isOpen ? `${faq.color}80` : '#1e293b'
                  }}
                  whileHover={{ scale: 1.01 }}
                >
                  {/* Animated background glow */}
                  <motion.div
                    className="absolute inset-0 opacity-0 transition-opacity duration-300"
                    style={{
                      background: `linear-gradient(135deg, ${faq.color}10, transparent)`
                    }}
                    animate={{
                      opacity: isOpen ? 1 : 0
                    }}
                  />

                  {/* Question Button */}
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="w-full px-8 py-6 flex items-center justify-between text-left group relative z-10"
                  >
                    {/* Number badge */}
                    <motion.div
                      className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center mr-4 font-black"
                      style={{
                        background: `linear-gradient(135deg, {faq.color}, ${faq.color}dd)`
                      }}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <span className="text-white text-sm">{String(index + 1).padStart(2, '0')}</span>
                    </motion.div>

                    <span className="text-lg md:text-xl font-bold text-white pr-4 flex-1">
                      {faq.question}
                    </span>

                    {/* Toggle icon */}
                    <motion.div
                      className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{
                        backgroundColor: isOpen ? faq.color : '#1e293b'
                      }}
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {isOpen ? (
                        <Minus className="w-5 h-5 text-white" />
                      ) : (
                        <Plus className="w-5 h-5 text-white" />
                      )}
                    </motion.div>
                  </button>

                  {/* Answer */}
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <motion.div
                          className="px-8 pb-6 pl-[88px]"
                          initial={{ y: -20 }}
                          animate={{ y: 0 }}
                          transition={{ delay: 0.1 }}
                        >
                          <div 
                            className="text-gray-300 leading-relaxed border-l-4 pl-6"
                            style={{ borderColor: faq.color }}
                          >
                            {faq.answer}
                          </div>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Shine effect */}
                  <motion.div
                    className="absolute top-0 left-0 w-full h-full pointer-events-none"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${faq.color}20, transparent)`
                    }}
                    animate={{
                      x: isOpen ? ['-100%', '200%'] : '-100%'
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: isOpen ? Infinity : 0,
                      repeatDelay: 1
                    }}
                  />
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* View All FAQ Button */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.7 }}
        >
          <Link href="/faq">
            <motion.button
              className="group px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-black text-lg rounded-2xl transition-all duration-300 shadow-lg shadow-red-600/30 flex items-center gap-3 mx-auto"
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(239, 68, 68, 0.5)" }}
              whileTap={{ scale: 0.95 }}
            >
              View All FAQs
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight className="w-5 h-5" />
              </motion.div>
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
