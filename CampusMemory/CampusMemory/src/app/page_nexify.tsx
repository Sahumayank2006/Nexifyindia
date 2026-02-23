"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { colleges as initialColleges } from "@/lib/data";
import FounderSection from "@/components/FounderSection";
import Footer from "@/components/Footer";
import LoginModal from "@/components/LoginModal";
import EventParticipation from "@/components/EventParticipation";
import Events from "@/components/Events";
import {  ArrowRight, Shield, Brain, FileText, BarChart3, Users, Sparkles,
  TrendingUp, Clock, AlertTriangle, CheckCircle2, Search, X, ChevronRight,
  Zap, Target, Lightbulb, Rocket, Star, Award, BookOpen, Calendar,
  MessageCircle, ThumbsUp, Eye, LineChart, PieChart, Activity,
  GraduationCap, Building, MapPin, Hash, Flame, Hexagon, Circle,
  Triangle, Plus, LogIn, Cpu, Wifi, Boxes, Database, Code, Layers,
  GitBranch, Server, CloudLightning, Gauge, TrendingDown,
  MousePointer2, Sparkle, Atom, Orbit, Binary, Braces
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const [colleges, setColleges] = useState(initialColleges);
  const [showCollegeModal, setShowCollegeModal] = useState(false);
  const [showAddCollegeModal, setShowAddCollegeModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrollY, setScrollY] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showEventsPage, setShowEventsPage] = useState(false);
  const [showEventParticipation, setShowEventParticipation] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  // Live counter animations
  const [liveStats, setLiveStats] = useState({
    dataPoints: 200000,
    eventsAnalyzed: 342,
    wisdomShared: 2391,
    attendees: 12847
  });

  // Particle system
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    size: number;
    delay: number;
    duration: number;
    opacity: number;
  }>>([]);

  useEffect(() => {
    setIsMounted(true);

    // Generate particles
    const newParticles = Array.from({ length: 80 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 5,
      duration: Math.random() * 10 + 10,
      opacity: Math.random() * 0.5 + 0.3,
    }));
    setParticles(newParticles);

    // Load colleges
    const storedColleges = localStorage.getItem("campusMemoryColleges");
    if (storedColleges) {
      setColleges(JSON.parse(storedColleges));
    } else {
      localStorage.setItem("campusMemoryColleges", JSON.stringify(initialColleges));
    }

    // Load current user
    const storedUser = localStorage.getItem("campusMemoryCurrentUser");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }

    const handleScroll = () => setScrollY(window.scrollY);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const filteredColleges = colleges.filter(college =>
    college.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    college.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCollegeSelect = (collegeId: string) => {
    router.push(`/colleges/${collegeId}`);
  };

  const handleLogin = (userData: any) => {
    setCurrentUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("campusMemoryCurrentUser");
    setCurrentUser(null);
  };

  const handleAddCollege = (collegeData: any) => {
    const newCollege = {
      id: `custom-${Date.now()}`,
      ...collegeData,
      memoryIndex: 0,
      activeUsers: 0,
    };
    const updatedColleges = [...colleges, newCollege];
    setColleges(updatedColleges);
    localStorage.setItem("campusMemoryColleges", JSON.stringify(updatedColleges));
    setShowAddCollegeModal(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0A0F1E] via-[#151E2F] to-[#0A0F1E] overflow-x-hidden relative">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-transparent">
        <motion.div
          className="h-full bg-gradient-to-r from-[#8B5CF6] via-[#14F1D9] to-[#FFB800]"
          style={{
            width: `${(scrollY / (typeof window !== 'undefined' ? document.documentElement.scrollHeight - window.innerHeight : 1)) * 100}%`
          }}
        />
      </div>

      {/* Floating particle network background */}
      {isMounted && (
        <div className="fixed inset-0 pointer-events-none">
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute rounded-full bg-[#8B5CF6]"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                opacity: particle.opacity,
              }}
              animate={{
                y: [-20, 20, -20],
                x: [-10, 10, -10],
                scale: [1, 1.5, 1],
                opacity: [particle.opacity, particle.opacity * 1.5, particle.opacity],
              }}
              transition={{
                duration: particle.duration,
                delay: particle.delay,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
          
          {/* Neural network lines */}
          <svg className="absolute inset-0 w-full h-full opacity-10">
            <defs>
              <linearGradient id="lineGradient">
                <stop offset="0%" stopColor="#8B5CF6" />
                <stop offset="50%" stopColor="#14F1D9" />
                <stop offset="100%" stopColor="#FFB800" />
              </linearGradient>
            </defs>
            {particles.slice(0, 20).map((p1, i) => {
              const p2 = particles[(i + 1) % 20];
              return (
                <motion.line
                  key={`line-${i}`}
                  x1={`${p1.x}%`}
                  y1={`${p1.y}%`}
                  x2={`${p2.x}%`}
                  y2={`${p2.y}%`}
                  stroke="url(#lineGradient)"
                  strokeWidth="1"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.3 }}
                  transition={{ duration: 2, delay: i * 0.1 }}
                />
              );
            })}
          </svg>
        </div>
      )}

      {/* Event Participation Overlay */}
      {showEventParticipation && (
        <div className="fixed inset-0 z-[100] bg-white overflow-y-auto">
          <EventParticipation />
          <button
            onClick={() => setShowEventParticipation(false)}
            className="fixed top-6 right-6 z-[101] bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-full transition-all shadow-lg flex items-center gap-2"
          >
            <X className="w-5 h-5" />
            Close
          </button>
        </div>
      )}

      {/* Events Page Overlay */}
      {showEventsPage && (
        <div className="fixed inset-0 z-[100] bg-slate-900">
          <Events
            currentStudent={currentUser}
            onLogin={() => setShowLoginModal(true)}
          />
          <button
            onClick={() => setShowEventsPage(false)}
            className="fixed top-6 right-6 z-[101] bg-white/10 hover:bg-white/20 backdrop-blur-lg text-white p-3 rounded-full transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* SECTION 1: HERO - THE HOOK */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24">
        {/* Animated gradient orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#8B5CF6] rounded-full blur-[128px] opacity-30"
          animate={{
            scale: [1, 1.2, 1],
            x: [-50, 50, -50],
            y: [-30, 30, -30],
          }}
          transition={{ duration: 15, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#14F1D9] rounded-full blur-[128px] opacity-30"
          animate={{
            scale: [1.2, 1, 1.2],
            x: [50, -50, 50],
            y: [30, -30, 30],
          }}
          transition={{ duration: 18, repeat: Infinity }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          {/* Logo/Brand */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/5 backdrop-blur-xl rounded-full border border-white/10">
              <Brain className="w-6 h-6 text-[#14F1D9]" />
              <span className="text-2xl font-bold text-white tracking-wider">NEXIFY</span>
              <div className="w-2 h-2 bg-[#FFB800] rounded-full animate-pulse"></div>
            </div>
            <p className="text-sm text-white/60 mt-2 tracking-widest uppercase">Next-Gen Technologies</p>
          </motion.div>

          {/* Main Headline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mb-8"
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-none mb-6">
              WELCOME TO THE
              <br />
              <span className="bg-gradient-to-r from-[#8B5CF6] via-[#14F1D9] to-[#FFB800] bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                INTELLIGENT
              </span>
              <br />
              CAMPUS ECOSYSTEM
            </h1>
            
            <div className="w-32 h-1 bg-gradient-to-r from-[#8B5CF6] to-[#14F1D9] mx-auto rounded-full"></div>
          </motion.div>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl md:text-2xl text-white/80 max-w-4xl mx-auto mb-12"
          >
            Where AI doesn't just manage events—it <span className="text-[#14F1D9] font-bold">PREDICTS</span>,{" "}
            <span className="text-[#FFB800] font-bold">GUIDES</span>, and{" "}
            <span className="text-[#8B5CF6] font-bold">TRANSFORMS</span> every student's journey
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12"
          >
            {/* Select College - Primary CTA */}
            <motion.button
              onClick={() => setShowCollegeModal(true)}
              className="group relative px-10 py-5 bg-gradient-to-r from-[#8B5CF6] to-[#14F1D9] rounded-full font-bold text-lg text-white shadow-2xl shadow-[#8B5CF6]/50 overflow-hidden"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                className="absolute inset-0 bg-white/20"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.6 }}
              />
              <span className="relative z-10 flex items-center gap-3">
                <Rocket className="w-6 h-6" />
                SELECT YOUR COLLEGE
                <ArrowRight className="w-6 h-6" />
              </span>
            </motion.button>

            {/* Plan an Event - Secondary CTA */}
            <motion.button
              onClick={() => setShowEventParticipation(true)}
              className="group relative px-10 py-5 bg-white/10 backdrop-blur-xl border-2 border-white/20 rounded-full font-bold text-lg text-white hover:bg-white/20 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="flex items-center gap-3">
                <Calendar className="w-6 h-6 text-[#FFB800]" />
                PLAN AN EVENT
                <Sparkles className="w-6 h-6 text-[#14F1D9]" />
              </span>
            </motion.button>
          </motion.div>

          {/* Trust Badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex flex-col items-center gap-3"
          >
            <div className="flex items-center gap-2 text-white/60 text-sm">
              <div className="flex -space-x-2">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className="w-5 h-5 text-[#FFB800] fill-[#FFB800]" />
                ))}
              </div>
              <span className="ml-2">"The future of campus life is here"</span>
            </div>
            <p className="text-white/40 text-sm">Trusted by 12 Amity Schools • 200,000+ Data Points Analyzed</p>
          </motion.div>

          {/* Floating 3D sphere with live data */}
          <motion.div
            className="absolute top-20 right-10 hidden lg:block"
            animate={{
              y: [-20, 20, -20],
              rotate: [0, 360],
            }}
            transition={{
              y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 20, repeat: Infinity, ease: "linear" },
            }}
          >
            <div className="relative w-48 h-48 bg-gradient-to-br from-[#8B5CF6]/20 to-[#14F1D9]/20 backdrop-blur-xl rounded-3xl border border-white/10 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl font-black text-white mb-2">200K+</div>
                <div className="text-sm text-white/60">Data Points<br />Analyzed</div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-[#8B5CF6] to-[#14F1D9] opacity-0 group-hover:opacity-20 rounded-3xl transition-opacity"></div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="flex flex-col items-center gap-2">
            <div className="w-px h-16 bg-gradient-to-b from-transparent via-white/40 to-transparent"></div>
            <MousePointer2 className="w-5 h-5 text-white/60" />
          </div>
        </motion.div>
      </section>

      {/* SECTION 2: THE NEXiFY EFFECT - THREE PILLARS */}
      <section className="relative py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
              THE NE<span className="bg-gradient-to-r from-[#8B5CF6] to-[#14F1D9] bg-clip-text text-transparent">Xi</span>FY EFFECT
            </h2>
            <p className="text-xl text-white/60">Intelligence at Every Step</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1: PREDICT */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group relative p-8 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#8B5CF6]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-[#8B5CF6] to-[#14F1D9] rounded-2xl flex items-center justify-center mb-6">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-3xl font-bold text-white mb-4">PREDICT</h3>
                <div className="text-5xl font-black text-[#14F1D9] mb-4">92%</div>
                <p className="text-lg text-white/80 mb-4">Match Accuracy</p>
                <p className="text-white/60 leading-relaxed">
                  ML algorithms analyze 100K+ past attendees to predict your perfect events
                </p>
                
                {/* Live Demo Visualization */}
                <div className="mt-6 p-4 bg-black/20 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="w-4 h-4 text-[#14F1D9]" />
                    <span className="text-xs text-white/40">Live Prediction</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-[#8B5CF6] to-[#14F1D9]"
                      initial={{ width: "0%" }}
                      whileInView={{ width: "92%" }}
                      transition={{ duration: 2, delay: 0.5 }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Card 2: GUIDE */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group relative p-8 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#FFB800]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-[#FFB800] to-[#F59E0B] rounded-2xl flex items-center justify-center mb-6">
                  <Lightbulb className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-3xl font-bold text-white mb-4">GUIDE</h3>
                <div className="text-5xl font-black text-[#FFB800] mb-4">80%</div>
                <p className="text-lg text-white/80 mb-4">Winner Insights</p>
                <p className="text-white/60 leading-relaxed">
                  Learn from past winners—before you even register
                </p>
                
                {/* Compass Animation */}
                <div className="mt-6 flex justify-center">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    className="w-16 h-16 rounded-full border-4 border-[#FFB800]/30 flex items-center justify-center"
                  >
                    <Target className="w-8 h-8 text-[#FFB800]" />
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Card 3: REWARD */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group relative p-8 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#14F1D9]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-[#14F1D9] to-[#06B6D4] rounded-2xl flex items-center justify-center mb-6">
                  <Award className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-3xl font-bold text-white mb-4">REWARD</h3>
                <div className="text-5xl font-black text-[#14F1D9] mb-4">10K+</div>
                <p className="text-lg text-white/80 mb-4">Badges Earned</p>
                <p className="text-white/60 leading-relaxed">
                  Gamified progression from "Newbie" to "Campus Legend"
                </p>
                
                {/* Trophy Particle Effect */}
                <div className="mt-6 relative h-16 flex items-center justify-center">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute"
                      animate={{
                        y: [0, -40, -80],
                        opacity: [1, 0.5, 0],
                        scale: [1, 1.5, 0.5],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.4,
                      }}
                    >
                      <Sparkle className="w-4 h-4 text-[#FFB800]" />
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* College Selection Modal */}
      <AnimatePresence>
        {showCollegeModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative max-w-6xl w-full max-h-[90vh] bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 overflow-hidden"
            >
              {/* Header */}
              <div className="p-6 border-b border-white/10 bg-gradient-to-r from-[#8B5CF6]/20 to-[#14F1D9]/20">
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-bold text-white">Select Your College</h2>
                  <button
                    onClick={() => setShowCollegeModal(false)}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                  >
                    <X className="w-6 h-6 text-white" />
                  </button>
                </div>
                
                {/* Search */}
                <div className="mt-4 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search colleges..."
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#14F1D9]"
                  />
                </div>
              </div>

              {/* College Grid */}
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredColleges.map((college) => (
                    <motion.button
                      key={college.id}
                      onClick={() => {
                        handleCollegeSelect(college.id);
                        setShowCollegeModal(false);
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl text-left hover:bg-white/10 transition-all group"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#8B5CF6] to-[#14F1D9] rounded-xl flex items-center justify-center flex-shrink-0">
                          <Building className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-white mb-1 group-hover:text-[#14F1D9] transition-colors">
                            {college.name}
                          </h3>
                          <p className="text-sm text-white/60">{college.city}</p>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>

                {/* Add College Button */}
                <motion.button
                  onClick={() => {
                    setShowCollegeModal(false);
                    setShowAddCollegeModal(true);
                  }}
                  whileHover={{ scale: 1.02 }}
                  className="mt-4 w-full p-6 bg-gradient-to-r from-[#8B5CF6] to-[#14F1D9] border border-white/20 rounded-2xl flex items-center justify-center gap-3 text-white font-bold"
                >
                  <Plus className="w-6 h-6" />
                  Add Your College
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add College Modal */}
      <AnimatePresence>
        {showAddCollegeModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative max-w-2xl w-full bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 p-8"
            >
              <h2 className="text-3xl font-bold text-white mb-6">Add New College</h2>
              
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  handleAddCollege({
                    name: formData.get("name"),
                    city: formData.get("city"),
                  });
                }}
                className="space-y-4"
              >
                <input
                  name="name"
                  placeholder="College Name"
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#14F1D9]"
                />
                <input
                  name="city"
                  placeholder="City"
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#14F1D9]"
                />
                
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddCollegeModal(false)}
                    className="flex-1 px-6 py-3 bg-white/5 border border-white/10 text-white rounded-xl font-semibold hover:bg-white/10 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-[#8B5CF6] to-[#14F1D9] text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
                  >
                    Add College
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLogin}
      />

      {/* FOUNDER SECTION */}
      <FounderSection />

      {/* FOOTER */}
      <Footer />

      <style jsx global>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </main>
  );
}
