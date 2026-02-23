"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Linkedin, 
  Twitter, 
  Mail, 
  Heart, 
  Sparkles,
  Target,
  Lightbulb,
  Users,
  Quote
} from "lucide-react";

const founders = [
  {
    name: "Mayank Sahu",
    role: "Founder",
    education: "BTech IT 2nd Year",
    image: "https://i.ibb.co/4nVFZ7Y5/Screenshot-20260119-175013.jpg",
    bio: "Ex-college student who faced repeated problems. Determined to make sure no future batch suffers the same way.",
    vision: "Making every campus self-learning and intelligent",
    linkedin: "#",
    twitter: "#",
    email: "mayank@campusmemory.com",
    gradient: "from-[#1E3A8A] via-[#2563EB] to-[#3B82F6]"
  }
];

const teamMembers = [
  {
    name: "Jyotima Tomar",
    role: "Core Team Member",
    education: "BTech IT 2nd Year",
    image: "https://i.ibb.co/qM8PqxBX/image.png",
    gradient: "from-[#D4AF37] via-[#F59E0B] to-[#F59E0B]"
  },
  {
    name: "Vaibhav Singh",
    role: "Core Team Member",
    education: "BTech CSE 2nd Year",
    image: "https://i.ibb.co/GfJLz8pk/image.png",
    gradient: "from-[#059669] via-[#10B981] to-[#10B981]"
  }
];

const missionValues = [
  {
    icon: <Target className="w-8 h-8" />,
    title: "Our Mission",
    description: "Transform colleges into self-learning institutions where every problem becomes a lesson for future generations",
    color: "from-[#D4AF37] to-[#F59E0B]"
  },
  {
    icon: <Lightbulb className="w-8 h-8" />,
    title: "Our Vision",
    description: "A future where no student wastes time on problems that were already solved by their seniors",
    color: "from-[#059669] to-[#10B981]"
  },
  {
    icon: <Heart className="w-8 h-8" />,
    title: "Our Values",
    description: "Student-first, transparency-driven, and committed to making education better for everyone",
    color: "from-[#DC2626] to-[#F87171]"
  }
];

export default function FounderSection() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  return (
    <section className="relative py-32 overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 20% 30%, rgba(30, 58, 138, 0.1) 0%, transparent 50%),
                           radial-gradient(circle at 80% 70%, rgba(212, 175, 55, 0.1) 0%, transparent 50%),
                           radial-gradient(circle at 40% 80%, rgba(5, 150, 105, 0.1) 0%, transparent 50%)`
        }}></div>
      </div>

      {/* Floating Decorative Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-[#D4AF37]/10 rounded-full blur-3xl animate-float-slow"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#1E3A8A]/10 rounded-full blur-3xl animate-float-slow" style={{ animationDelay: '2s' }}></div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-[#1E3A8A]/10 to-[#D4AF37]/10 rounded-full mb-6 border border-[#D4AF37]/30">
            <Sparkles className="w-5 h-5 text-[#D4AF37]" />
            <span className="text-sm font-semibold text-[#1E3A8A]">Meet The Visionary</span>
          </div>
          
          <h2 className="font-serif text-5xl md:text-7xl font-bold text-[#1E3A8A] mb-6">
            Built By Students,
            <span className="block mt-2 bg-gradient-to-r from-[#D4AF37] via-[#F59E0B] to-[#D4AF37] bg-clip-text text-transparent">
              For Students
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Campus Memory was born from personal frustration and a dream to make college life better for everyone
          </p>
        </motion.div>

        {/* Founder Card - Hero Style */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-24"
        >
          <div className="relative max-w-5xl mx-auto">
            {/* Glow Effect */}
            <div className="absolute -inset-4 bg-gradient-to-r from-[#1E3A8A]/20 via-[#D4AF37]/20 to-[#059669]/20 rounded-3xl blur-2xl"></div>
            
            <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
              {/* Top Gradient Bar */}
              <div className="h-2 bg-gradient-to-r from-[#1E3A8A] via-[#D4AF37] to-[#059669]"></div>
              
              <div className="grid md:grid-cols-5 gap-8 p-12">
                {/* Left - Image */}
                <div className="md:col-span-2 flex flex-col items-center">
                  <div className="relative group">
                    {/* Animated Ring */}
                    <div className="absolute -inset-4 bg-gradient-to-r from-[#1E3A8A] via-[#D4AF37] to-[#059669] rounded-full opacity-75 blur-lg group-hover:opacity-100 transition-opacity"></div>
                    <div className="absolute -inset-2 bg-gradient-to-r from-[#1E3A8A] via-[#D4AF37] to-[#059669] rounded-full animate-spin-slow"></div>
                    
                    <div className="relative w-64 h-64 rounded-full overflow-hidden border-8 border-white shadow-2xl">
                      <img 
                        src={founders[0].image}
                        alt={founders[0].name}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  </div>
                  
                  {/* Social Links */}
                  <div className="flex gap-4 mt-8">
                    {[
                      { icon: <Linkedin className="w-5 h-5" />, link: founders[0].linkedin, color: "hover:bg-blue-600" },
                      { icon: <Twitter className="w-5 h-5" />, link: founders[0].twitter, color: "hover:bg-sky-500" },
                      { icon: <Mail className="w-5 h-5" />, link: `mailto:${founders[0].email}`, color: "hover:bg-red-600" }
                    ].map((social, idx) => (
                      <a
                        key={idx}
                        href={social.link}
                        className={`p-3 rounded-full bg-gray-100 text-gray-600 ${social.color} hover:text-white transition-all duration-300 hover:scale-110 hover:shadow-lg`}
                      >
                        {social.icon}
                      </a>
                    ))}
                  </div>
                </div>

                {/* Right - Content */}
                <div className="md:col-span-3 flex flex-col justify-center">
                  <div className="mb-6">
                    <h3 className="text-4xl font-bold text-[#1E3A8A] mb-2">
                      {founders[0].name}
                    </h3>
                    <p className="text-xl text-[#D4AF37] font-semibold mb-1">
                      {founders[0].role}
                    </p>
                    <p className="text-base text-gray-600 mb-4">
                      {founders[0].education}
                    </p>
                    <div className="h-1 w-24 bg-gradient-to-r from-[#D4AF37] to-transparent rounded-full"></div>
                  </div>

                  <p className="text-lg text-gray-700 leading-relaxed mb-6">
                    {founders[0].bio}
                  </p>

                  {/* Vision Statement */}
                  <div className="relative p-6 rounded-2xl bg-gradient-to-br from-[#1E3A8A]/5 to-[#D4AF37]/5 border-l-4 border-[#D4AF37]">
                    <Quote className="absolute top-4 right-4 w-12 h-12 text-[#D4AF37]/20" />
                    <p className="text-sm text-gray-500 font-semibold mb-2">VISION</p>
                    <p className="text-xl font-serif italic text-[#1E3A8A]">
                      "{founders[0].vision}"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Our Team Section - Enhanced */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-24"
        >
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-[#D4AF37]/10 to-[#1E3A8A]/10 rounded-full mb-6 border border-[#D4AF37]/30">
              <Users className="w-5 h-5 text-[#D4AF37]" />
              <span className="text-sm font-semibold text-[#1E3A8A]">The Core Team</span>
            </div>
            <h3 className="text-5xl md:text-6xl font-serif font-bold text-[#1E3A8A] mb-6">
              Meet Our <span className="bg-gradient-to-r from-[#D4AF37] via-[#F59E0B] to-[#D4AF37] bg-clip-text text-transparent">Dream Team</span>
            </h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              The passionate minds building the future of campus intelligence, one problem at a time
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {teamMembers.map((member, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
                className="group relative"
              >
                {/* Enhanced Glow Effect */}
                <div className={`absolute -inset-4 bg-gradient-to-r ${member.gradient} rounded-3xl blur-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-500`}></div>
                
                <div className="relative bg-white rounded-3xl shadow-2xl border-2 border-gray-100 p-10 overflow-hidden group-hover:border-transparent transition-all duration-300">
                  {/* Top Gradient Bar */}
                  <div className={`h-2 absolute top-0 left-0 right-0 bg-gradient-to-r ${member.gradient}`}></div>
                  
                  <div className="flex flex-col items-center text-center">
                    {/* Profile Image - Larger */}
                    <div className="relative group/img mb-6">
                      <div className={`absolute -inset-4 bg-gradient-to-r ${member.gradient} rounded-full opacity-75 blur-lg group-hover/img:opacity-100 transition-opacity`}></div>
                      <div className={`absolute -inset-2 bg-gradient-to-r ${member.gradient} rounded-full animate-spin-slow`}></div>
                      <div className="relative w-40 h-40 rounded-full overflow-hidden border-8 border-white shadow-2xl">
                        <img 
                          src={member.image}
                          alt={member.name}
                          className="w-full h-full object-cover transform group-hover/img:scale-110 transition-transform duration-500"
                        />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <h4 className="text-3xl font-bold text-[#1E3A8A] mb-2 group-hover:text-[#D4AF37] transition-colors">
                        {member.name}
                      </h4>
                      <div className="h-1 w-16 bg-gradient-to-r from-[#D4AF37] to-transparent rounded-full mx-auto mb-3"></div>
                      <p className="text-lg font-semibold text-gray-700 mb-2">
                        {member.role}
                      </p>
                      <p className="text-base text-gray-500 mb-4">
                        {member.education}
                      </p>
                      
                      {/* Stats or badges */}
                      <div className="flex justify-center gap-3 mt-6">
                        <div className="px-4 py-2 rounded-full bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200">
                          <span className="text-sm font-semibold text-gray-700">🚀 Innovator</span>
                        </div>
                        <div className="px-4 py-2 rounded-full bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200">
                          <span className="text-sm font-semibold text-gray-700">💡 Visionary</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Decorative corner - Enhanced */}
                  <div className={`absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl ${member.gradient} opacity-10 rounded-tl-full`}></div>
                  <div className={`absolute top-0 left-0 w-24 h-24 bg-gradient-to-br ${member.gradient} opacity-10 rounded-br-full`}></div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Mission, Vision, Values Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {missionValues.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              onMouseEnter={() => setHoveredCard(idx)}
              onMouseLeave={() => setHoveredCard(null)}
              className="relative group"
            >
              {/* Glow on hover */}
              <div className={`absolute -inset-1 bg-gradient-to-r ${item.color} rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500`}></div>
              
              <div className="relative h-full p-8 rounded-2xl bg-white border-2 border-gray-200 group-hover:border-transparent transition-all duration-300 shadow-lg group-hover:shadow-2xl">
                {/* Icon */}
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${item.color} text-white mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}>
                  {item.icon}
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-[#1E3A8A] mb-4 group-hover:text-[#D4AF37] transition-colors">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 leading-relaxed">
                  {item.description}
                </p>

                {/* Animated Border */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${item.color} transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-b-2xl`}></div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* The Story Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-24"
        >
          <div className="relative max-w-4xl mx-auto">
            <div className="absolute -inset-4 bg-gradient-to-r from-[#1E3A8A]/10 to-[#D4AF37]/10 rounded-3xl blur-2xl"></div>
            
            <div className="relative bg-gradient-to-br from-[#1E3A8A] to-[#1E40AF] rounded-3xl p-12 text-white shadow-2xl overflow-hidden">
              {/* Decorative Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                  backgroundImage: `radial-gradient(circle at 20% 50%, rgba(212, 175, 55, 0.5) 0%, transparent 50%),
                                   radial-gradient(circle at 80% 80%, rgba(5, 150, 105, 0.5) 0%, transparent 50%)`
                }}></div>
              </div>

              <div className="relative z-10">
                <div className="text-center mb-8">
                  <h3 className="text-3xl md:text-4xl font-serif font-bold mb-4">The Story Behind Campus Memory</h3>
                  <div className="h-1 w-32 bg-[#D4AF37] mx-auto rounded-full"></div>
                </div>

                <div className="space-y-6 text-lg leading-relaxed text-white/90">
                  <p>
                    It started in 2022, during college fest preparations. The team faced the same parking chaos, 
                    vendor issues, and coordination problems that had plagued every fest for years. The frustration 
                    was real: <span className="text-[#D4AF37] font-semibold">"Why are we making the same mistakes?"</span>
                  </p>
                  
                  <p>
                    That question sparked an idea. What if colleges could <span className="text-[#D4AF37] font-semibold">remember</span>? 
                    What if every problem, every solution, every lesson learned could be preserved for future batches?
                  </p>

                  <p className="text-xl font-semibold text-[#D4AF37] text-center py-4">
                    Campus Memory was born from that vision.
                  </p>

                  <p>
                    Today, we're building the platform that every student wished they had. A platform where 
                    institutional wisdom doesn't graduate with seniors. Where juniors learn from the past, 
                    not repeat it. Where colleges become <span className="text-[#D4AF37] font-semibold">truly intelligent</span>.
                  </p>
                </div>

                {/* CTA */}
                <div className="text-center mt-10">
                  <div className="inline-flex items-center gap-2 px-6 py-3 bg-[#D4AF37] text-[#1E3A8A] rounded-full font-bold hover:bg-[#F4D03F] transition-colors shadow-lg hover:shadow-xl">
                    <Heart className="w-5 h-5" />
                    <span>Join Our Mission</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }

        @keyframes float-slow {
          0%, 100% { 
            transform: translateY(0px) translateX(0px);
          }
          25% {
            transform: translateY(-20px) translateX(10px);
          }
          50% {
            transform: translateY(-10px) translateX(-10px);
          }
          75% {
            transform: translateY(-30px) translateX(5px);
          }
        }

        .animate-float-slow {
          animation: float-slow 20s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
