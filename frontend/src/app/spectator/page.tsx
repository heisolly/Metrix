"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Eye, 
  DollarSign, 
  Trophy, 
  CheckCircle, 
  Users,
  Shield,
  Clock,
  Star,
  ArrowRight,
  Zap
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function BecomeSpectatorPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    experience: "",
    games: [] as string[],
    availability: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.games.length === 0) {
      alert("Please select at least one game");
      return;
    }

    try {
      setSubmitting(true);

      const { data, error } = await supabase
        .from('spectator_applications')
        .insert([{
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          experience: formData.experience,
          games: formData.games,
          availability: formData.availability,
          status: 'pending'
        }]);

      if (error) throw error;

      alert("Application submitted successfully! We'll contact you soon.");
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        experience: "",
        games: [],
        availability: "",
      });
    } catch (error: any) {
      console.error('Error submitting application:', error);
      alert(`Failed to submit application: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const games = ["COD Mobile", "FIFA", "Fortnite", "Valorant", "PUBG Mobile"];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{ 
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.05) 35px, rgba(255,255,255,.05) 70px)' 
          }} />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full mb-6">
              <Eye className="w-5 h-5" />
              <span className="font-bold">Official Spectator Program</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black mb-6">
              Become a Metrix Spectator
            </h1>
            
            <p className="text-2xl md:text-3xl text-white/90 mb-8 max-w-3xl mx-auto">
              Earn <span className="font-black text-yellow-300">₦10,000</span> per tournament by ensuring fair play
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="#apply"
                className="px-8 py-4 bg-white text-purple-600 font-black rounded-xl hover:shadow-2xl transition-all text-lg flex items-center gap-2"
              >
                Apply Now
                <ArrowRight className="w-5 h-5" />
              </a>
              <a
                href="#how-it-works"
                className="px-8 py-4 bg-white/20 backdrop-blur-sm text-white font-black rounded-xl hover:bg-white/30 transition-all text-lg"
              >
                Learn More
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 -mt-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-white rounded-2xl shadow-2xl p-8 text-center border-2 border-purple-500">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <DollarSign className="w-8 h-8 text-purple-600" />
            </div>
            <div className="text-4xl font-black text-gray-900 mb-2">₦10,000</div>
            <div className="text-gray-600 font-semibold">Per Tournament</div>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl p-8 text-center border-2 border-pink-500">
            <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-8 h-8 text-pink-600" />
            </div>
            <div className="text-4xl font-black text-gray-900 mb-2">100+</div>
            <div className="text-gray-600 font-semibold">Tournaments Monthly</div>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl p-8 text-center border-2 border-red-500">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-red-600" />
            </div>
            <div className="text-4xl font-black text-gray-900 mb-2">50+</div>
            <div className="text-gray-600 font-semibold">Active Spectators</div>
          </div>
        </motion.div>
      </div>

      {/* What is a Spectator Section */}
      <div className="max-w-7xl mx-auto px-4 py-20" id="how-it-works">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            What is a Spectator?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Spectators are trusted community members who ensure fair play and verify match results
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border-2 border-purple-200"
          >
            <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mb-4">
              <Eye className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-4">Your Role</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-1" />
                <span className="text-gray-700">Watch matches in real-time</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-1" />
                <span className="text-gray-700">Verify match results and scores</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-1" />
                <span className="text-gray-700">Report any rule violations</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-1" />
                <span className="text-gray-700">Ensure fair gameplay</span>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-pink-50 to-red-50 rounded-2xl p-8 border-2 border-pink-200"
          >
            <div className="w-12 h-12 bg-pink-600 rounded-xl flex items-center justify-center mb-4">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-4">Your Earnings</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-pink-600 flex-shrink-0 mt-1" />
                <span className="text-gray-700">₦10,000 per tournament spectated</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-pink-600 flex-shrink-0 mt-1" />
                <span className="text-gray-700">Bonus for multiple tournaments</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-pink-600 flex-shrink-0 mt-1" />
                <span className="text-gray-700">Weekly payouts via bank transfer</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-pink-600 flex-shrink-0 mt-1" />
                <span className="text-gray-700">Flexible schedule - work when you want</span>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>

      {/* Requirements Section */}
      <div className="bg-gray-100 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Requirements
            </h2>
            <p className="text-xl text-gray-600">
              What you need to become a spectator
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Shield className="w-8 h-8" />,
                title: "Trustworthy",
                description: "Clean record and good standing in the community"
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: "Gaming Knowledge",
                description: "Understanding of competitive gaming rules"
              },
              {
                icon: <Clock className="w-8 h-8" />,
                title: "Availability",
                description: "Able to spectate 2-3 tournaments per week"
              },
              {
                icon: <Star className="w-8 h-8" />,
                title: "18+ Years Old",
                description: "Must be at least 18 years of age"
              }
            ].map((req, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-2xl transition-all"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                  {req.icon}
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-2">{req.title}</h3>
                <p className="text-gray-600">{req.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600">
            Simple 4-step process to start earning
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            {
              step: "1",
              title: "Apply",
              description: "Fill out the application form below"
            },
            {
              step: "2",
              title: "Interview",
              description: "Quick video call to verify your details"
            },
            {
              step: "3",
              title: "Training",
              description: "Learn our spectator guidelines and tools"
            },
            {
              step: "4",
              title: "Start Earning",
              description: "Get assigned to tournaments and earn ₦10k each"
            }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100 hover:border-purple-500 transition-all">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-black">
                  {item.step}
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-2 text-center">{item.title}</h3>
                <p className="text-gray-600 text-center">{item.description}</p>
              </div>
              {index < 3 && (
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <ArrowRight className="w-8 h-8 text-purple-300" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Application Form */}
      <div className="bg-gradient-to-br from-purple-600 to-pink-600 py-20" id="apply">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              Apply Now
            </h2>
            <p className="text-xl text-white/90">
              Start your journey as a Metrix Spectator
            </p>
          </div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl p-8 shadow-2xl"
          >
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none text-gray-900"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none text-gray-900"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none text-gray-900"
                  placeholder="+234 800 000 0000"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Gaming Experience
                </label>
                <textarea
                  value={formData.experience}
                  onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none resize-none text-gray-900"
                  placeholder="Tell us about your gaming background..."
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Games You Know *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {games.map(game => (
                    <label key={game} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.games.includes(game)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData(prev => ({ ...prev, games: [...prev.games, game] }));
                          } else {
                            setFormData(prev => ({ ...prev, games: prev.games.filter(g => g !== game) }));
                          }
                        }}
                        className="w-5 h-5 text-purple-600 border-2 border-gray-300 rounded focus:ring-purple-500"
                      />
                      <span className="text-gray-700">{game}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Availability *
                </label>
                <select
                  required
                  value={formData.availability}
                  onChange={(e) => setFormData(prev => ({ ...prev, availability: e.target.value }))}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none text-gray-900"
                >
                  <option value="">Select your availability</option>
                  <option value="weekdays">Weekdays</option>
                  <option value="weekends">Weekends</option>
                  <option value="both">Both Weekdays & Weekends</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black rounded-xl hover:shadow-2xl transition-all text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Submitting...' : 'Submit Application'}
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.form>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {[
            {
              q: "How much can I earn as a spectator?",
              a: "You earn ₦10,000 per tournament. If you spectate 10 tournaments per month, that's ₦100,000!"
            },
            {
              q: "When do I get paid?",
              a: "Payments are processed weekly via bank transfer every Friday for tournaments completed that week."
            },
            {
              q: "Do I need special equipment?",
              a: "Just a stable internet connection and a device to watch matches. We provide all the tools you need."
            },
            {
              q: "How long does each tournament take?",
              a: "Most tournaments last 1-3 hours depending on the game and format."
            },
            {
              q: "Can I spectate from anywhere?",
              a: "Yes! As long as you have internet access, you can spectate from anywhere in Nigeria."
            }
          ].map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100"
            >
              <h3 className="text-xl font-black text-gray-900 mb-3">{faq.q}</h3>
              <p className="text-gray-600">{faq.a}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-900 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-6">
            Ready to Start Earning?
          </h2>
          <p className="text-xl text-white/80 mb-8">
            Join 50+ spectators already earning with Metrix
          </p>
          <a
            href="#apply"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black rounded-xl hover:shadow-2xl transition-all text-lg"
          >
            Apply Now
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </div>
    </div>
  );
}
