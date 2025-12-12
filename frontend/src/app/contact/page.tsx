"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useRef } from "react";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  Twitter, 
  Instagram, 
  Youtube,
  MessageSquare,
  Zap,
  Shield,
  Trophy,
  Target
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log("Form submitted:", formData);
    setIsSubmitting(false);
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactMethods = [
    { 
      icon: Mail, 
      label: "Email", 
      value: "support@metrix.gg",
      delay: 0.2
    },
    { 
      icon: Phone, 
      label: "Phone", 
      value: "+234 (0) 123 456 7890",
      delay: 0.3
    },
    { 
      icon: MapPin, 
      label: "Location", 
      value: "Lagos, Nigeria",
      delay: 0.4
    }
  ];

  const socialPlatforms = [
    { icon: Twitter, name: "Twitter", handle: "@MetrixGG" },
    { icon: Instagram, name: "Instagram", handle: "@metrix.gg" },
    { icon: Youtube, name: "YouTube", handle: "MetrixGaming" },
    { icon: MessageSquare, name: "Discord", handle: "MetrixCommunity" }
  ];

  return (
    <div className="min-h-screen bg-black light:bg-[#f5f5f5] overflow-hidden">
      <Header />
      
      <div ref={containerRef}>
        {/* Hero Section with Parallax */}
        <section className="relative min-h-screen flex items-center justify-center px-4 pt-20">
          {/* Animated Background */}
          <div className="absolute inset-0">
            {/* Base gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-black via-slate-950 to-black light:from-[#f5f5f5] light:via-white light:to-[#e8e8e8]" />
            
            {/* Animated grid */}
            <motion.div 
              className="absolute inset-0 opacity-20"
              style={{ y }}
            >
              <div 
                className="absolute inset-0"
                style={{
                  backgroundImage: 'linear-gradient(rgba(239,68,68,0.2) 2px, transparent 2px), linear-gradient(90deg, rgba(239,68,68,0.2) 2px, transparent 2px)',
                  backgroundSize: '100px 100px',
                }}
              />
            </motion.div>

            {/* Floating particles */}
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-red-500 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -30, 0],
                  opacity: [0.2, 0.8, 0.2],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}

            {/* Radial glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-500/5 rounded-full blur-3xl" />
          </div>

          {/* Hero Content */}
          <div className="relative z-10 max-w-7xl mx-auto w-full">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left Side - Title & Info */}
              <div>
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  {/* Badge */}
                  <motion.div
                    className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-full mb-8"
                    animate={{ 
                      boxShadow: [
                        "0 0 20px rgba(239,68,68,0.2)",
                        "0 0 40px rgba(239,68,68,0.4)",
                        "0 0 20px rgba(239,68,68,0.2)"
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Zap className="w-4 h-4 text-red-500" />
                    <span className="text-red-500 font-bold text-sm uppercase tracking-wider">
                      Quick Response
                    </span>
                  </motion.div>

                  {/* Main Title */}
                  <h1 className="text-6xl md:text-8xl font-black mb-6">
                    <span className="block text-white light:text-gray-900">LET'S</span>
                    <span className="block text-red-500 relative">
                      CONNECT
                      {/* Animated underline */}
                      <motion.div
                        className="absolute -bottom-2 left-0 h-2 bg-red-500"
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                      />
                    </span>
                  </h1>

                  <p className="text-xl text-gray-400 light:text-gray-600 mb-12 max-w-lg">
                    Ready to dominate the competition? Get in touch with our team and level up your gaming experience.
                  </p>

                  {/* Contact Methods - Vertical Stack */}
                  <div className="space-y-4">
                    {contactMethods.map((method, index) => (
                      <motion.div
                        key={method.label}
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: method.delay }}
                        whileHover={{ x: 10 }}
                        className="flex items-center gap-4 group cursor-pointer"
                      >
                        {/* Icon */}
                        <div className="relative">
                          <motion.div
                            className="w-14 h-14 bg-red-500/10 border-2 border-red-500/30 rounded-xl flex items-center justify-center group-hover:border-red-500 transition-colors"
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.6 }}
                          >
                            <method.icon className="w-6 h-6 text-red-500" />
                          </motion.div>
                          {/* Ping effect */}
                          <motion.div
                            className="absolute inset-0 bg-red-500/20 rounded-xl"
                            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                          />
                        </div>

                        {/* Text */}
                        <div>
                          <div className="text-sm text-gray-500 light:text-gray-600 font-medium">
                            {method.label}
                          </div>
                          <div className="text-lg font-bold text-white light:text-gray-900">
                            {method.value}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Right Side - Form with 3D Effect */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative"
              >
                {/* 3D Card Container */}
                <motion.div
                  className="relative"
                  style={{
                    transformStyle: "preserve-3d",
                    perspective: "1000px"
                  }}
                  whileHover={{ rotateY: 2, rotateX: -2 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Glow layers */}
                  <div className="absolute -inset-4 bg-gradient-to-r from-red-500/20 to-red-600/20 rounded-3xl blur-2xl" />
                  
                  {/* Main Form Card */}
                  <div className="relative bg-gradient-to-br from-slate-900 to-black light:from-white light:to-gray-50 border-2 border-red-500/30 rounded-3xl p-8 backdrop-blur-xl">
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-40 h-40 bg-red-500/5 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-red-500/5 rounded-full blur-3xl" />

                    <form onSubmit={handleSubmit} className="relative space-y-6">
                      {/* Form Title */}
                      <div className="mb-8">
                        <h3 className="text-2xl font-black text-white light:text-gray-900 mb-2">
                          DROP US A LINE
                        </h3>
                        <div className="w-20 h-1 bg-red-500" />
                      </div>

                      {/* Name Input */}
                      <div className="relative">
                        <motion.div
                          animate={{
                            scale: focusedField === "name" ? 1.02 : 1,
                          }}
                          transition={{ duration: 0.2 }}
                        >
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            onFocus={() => setFocusedField("name")}
                            onBlur={() => setFocusedField(null)}
                            required
                            placeholder="Your Name"
                            className="w-full px-6 py-4 bg-black/40 light:bg-white/80 border-2 border-gray-700 light:border-gray-300 rounded-xl text-white light:text-gray-900 placeholder-gray-500 focus:border-red-500 focus:outline-none transition-all font-medium"
                          />
                          {focusedField === "name" && (
                            <motion.div
                              layoutId="activeField"
                              className="absolute inset-0 border-2 border-red-500 rounded-xl pointer-events-none"
                              initial={false}
                              transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                          )}
                        </motion.div>
                      </div>

                      {/* Email Input */}
                      <div className="relative">
                        <motion.div
                          animate={{
                            scale: focusedField === "email" ? 1.02 : 1,
                          }}
                          transition={{ duration: 0.2 }}
                        >
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            onFocus={() => setFocusedField("email")}
                            onBlur={() => setFocusedField(null)}
                            required
                            placeholder="Email Address"
                            className="w-full px-6 py-4 bg-black/40 light:bg-white/80 border-2 border-gray-700 light:border-gray-300 rounded-xl text-white light:text-gray-900 placeholder-gray-500 focus:border-red-500 focus:outline-none transition-all font-medium"
                          />
                          {focusedField === "email" && (
                            <motion.div
                              layoutId="activeField"
                              className="absolute inset-0 border-2 border-red-500 rounded-xl pointer-events-none"
                              initial={false}
                              transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                          )}
                        </motion.div>
                      </div>

                      {/* Subject Input */}
                      <div className="relative">
                        <motion.div
                          animate={{
                            scale: focusedField === "subject" ? 1.02 : 1,
                          }}
                          transition={{ duration: 0.2 }}
                        >
                          <input
                            type="text"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            onFocus={() => setFocusedField("subject")}
                            onBlur={() => setFocusedField(null)}
                            required
                            placeholder="Subject"
                            className="w-full px-6 py-4 bg-black/40 light:bg-white/80 border-2 border-gray-700 light:border-gray-300 rounded-xl text-white light:text-gray-900 placeholder-gray-500 focus:border-red-500 focus:outline-none transition-all font-medium"
                          />
                          {focusedField === "subject" && (
                            <motion.div
                              layoutId="activeField"
                              className="absolute inset-0 border-2 border-red-500 rounded-xl pointer-events-none"
                              initial={false}
                              transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                          )}
                        </motion.div>
                      </div>

                      {/* Message Textarea */}
                      <div className="relative">
                        <motion.div
                          animate={{
                            scale: focusedField === "message" ? 1.02 : 1,
                          }}
                          transition={{ duration: 0.2 }}
                        >
                          <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            onFocus={() => setFocusedField("message")}
                            onBlur={() => setFocusedField(null)}
                            required
                            rows={5}
                            placeholder="Your Message"
                            className="w-full px-6 py-4 bg-black/40 light:bg-white/80 border-2 border-gray-700 light:border-gray-300 rounded-xl text-white light:text-gray-900 placeholder-gray-500 focus:border-red-500 focus:outline-none transition-all resize-none font-medium"
                          />
                          {focusedField === "message" && (
                            <motion.div
                              layoutId="activeField"
                              className="absolute inset-0 border-2 border-red-500 rounded-xl pointer-events-none"
                              initial={false}
                              transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                          )}
                        </motion.div>
                      </div>

                      {/* Submit Button */}
                      <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="relative w-full group overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-500 rounded-xl" />
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 rounded-xl"
                          initial={{ x: "-100%" }}
                          whileHover={{ x: 0 }}
                          transition={{ duration: 0.3 }}
                        />
                        
                        <div className="relative px-8 py-4 flex items-center justify-center gap-3">
                          {isSubmitting ? (
                            <>
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                              />
                              <span className="text-white font-bold">SENDING...</span>
                            </>
                          ) : (
                            <>
                              <Send className="w-5 h-5 text-white" />
                              <span className="text-white font-bold">SEND MESSAGE</span>
                            </>
                          )}
                        </div>
                      </motion.button>
                    </form>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Social Section - Unique Hexagonal Layout */}
        <section className="relative py-32 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <h2 className="text-5xl md:text-6xl font-black text-white light:text-gray-900 mb-4">
                JOIN THE <span className="text-red-500">COMMUNITY</span>
              </h2>
              <p className="text-xl text-gray-400 light:text-gray-600">
                Connect with thousands of gamers worldwide
              </p>
            </motion.div>

            {/* Hexagonal Social Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
              {socialPlatforms.map((platform, index) => (
                <motion.div
                  key={platform.name}
                  initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
                  whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  whileHover={{ 
                    y: -10,
                    rotateZ: 5,
                    scale: 1.05
                  }}
                  className="relative group"
                  style={{
                    transformStyle: "preserve-3d"
                  }}
                >
                  {/* Hexagonal shape */}
                  <div 
                    className="relative aspect-square bg-gradient-to-br from-slate-900 to-black light:from-white light:to-gray-100 border-2 border-red-500/30 group-hover:border-red-500 transition-all duration-300"
                    style={{
                      clipPath: "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)"
                    }}
                  >
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-red-500/0 group-hover:bg-red-500/10 transition-all duration-300" />
                    
                    {/* Content */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                      <motion.div
                        whileHover={{ rotate: 360, scale: 1.2 }}
                        transition={{ duration: 0.6 }}
                      >
                        <platform.icon className="w-12 h-12 text-red-500 mb-4" />
                      </motion.div>
                      <h3 className="text-lg font-black text-white light:text-gray-900 mb-1">
                        {platform.name}
                      </h3>
                      <p className="text-sm text-gray-400 light:text-gray-600 text-center">
                        {platform.handle}
                      </p>
                    </div>

                    {/* Animated border */}
                    <motion.div
                      className="absolute inset-0 border-2 border-red-500 opacity-0 group-hover:opacity-100"
                      style={{
                        clipPath: "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)"
                      }}
                      animate={{
                        scale: [1, 1.05, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                      }}
                    />
                  </div>

                  {/* Floating particles around hexagon */}
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 bg-red-500 rounded-full"
                      style={{
                        left: `${20 + i * 30}%`,
                        top: `${10 + i * 20}%`,
                      }}
                      animate={{
                        y: [-10, 10, -10],
                        opacity: [0.2, 1, 0.2],
                      }}
                      transition={{
                        duration: 2 + i * 0.5,
                        repeat: Infinity,
                        delay: i * 0.3,
                      }}
                    />
                  ))}
                </motion.div>
              ))}
            </div>

            {/* Stats Bar */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-20 grid grid-cols-3 gap-8 max-w-4xl mx-auto"
            >
              {[
                { icon: Trophy, label: "Active Players", value: "50K+" },
                { icon: Shield, label: "Tournaments", value: "1000+" },
                { icon: Target, label: "Response Time", value: "< 2hrs" }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative p-6 bg-black/60 light:bg-white/80 border-2 border-red-500/30 rounded-2xl text-center group hover:border-red-500 transition-all"
                >
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="w-12 h-12 mx-auto mb-4 bg-red-500/10 border-2 border-red-500/30 rounded-xl flex items-center justify-center"
                  >
                    <stat.icon className="w-6 h-6 text-red-500" />
                  </motion.div>
                  <div className="text-3xl font-black text-red-500 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-400 light:text-gray-600 font-medium">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
