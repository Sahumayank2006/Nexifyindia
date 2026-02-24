"use client";

import { useState, use, useEffect, useRef } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
  ArrowLeft,
  MapPin,
  Trophy,
  Users,
  Activity,
  LogOut,
  Calendar,
  Brain,
  UserCheck,
  Settings,
  ArrowRight as ArrowRightIcon,
  Plus,
  AlertTriangle,
  MessageSquare,
  Lightbulb,
  Heart,
  Trash2,
  Edit2,
  X,
  Save,
  TrendingUp,
  CheckCircle2,
  Clock,
  Sparkles,
  Award,
  Star,
  Filter,
  Search,
  BarChart3,
  Zap,
  ShieldCheck,
  Target,
  Quote,
  ThumbsUp,
} from "lucide-react";
import { colleges } from "@/lib/data";
import { seedInitialData } from "@/lib/seedData";
import Leaderboard from "@/components/gamification/Leaderboard";

interface CollegePageProps {
  params: Promise<{
    id: string;
  }>;
}

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  collegeid: string;
  program: string;
  year: number;
  batch: string;
  points: number;
  achievements: string[];
  contributionsCount: number;
}

interface Problem {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  reportedBy: string;
  reportedDate: string;
  upvotes: number;
  supportCount: number;
  supporters: string[];
  college: string;
  priority?: string;
  solution?: string;
}

interface WisdomTip {
  id: string;
  content: string;
  category: string;
  author: string;
  date: string;
  upvotes: number;
  helpful: number;
  college: string;
  tags?: string[];
}

interface Alert {
  id: string;
  title: string;
  description: string;
  riskLevel: string;
  affectedAreas: string[];
  predictedDate?: string;
  college: string;
}

export default function CollegePage({ params }: CollegePageProps) {
  const {id } = use(params);
  const college = colleges.find((item) => item.id === id);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [currentStudent, setCurrentStudent] = useState<User | null>(null);
  const [allColleges, setAllColleges] = useState(colleges);
  
  // CRUD State Management
  const [problems, setProblems] = useState<Problem[]>([]);
  const [wisdom, setWisdom] = useState<WisdomTip[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  
  // Modal States
  const [showProblemModal, setShowProblemModal] = useState(false);
  const [showWisdomModal, setShowWisdomModal] = useState(false);
  const [editingProblem, setEditingProblem] = useState<Problem | null>(null);
  const [editingWisdom, setEditingWisdom] = useState<WisdomTip | null>(null);
  
  // Filter & Search States
  const [problemFilter, setProblemFilter] = useState<string>("all");
  const [wisdomFilter, setWisdomFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"problems" | "wisdom" | "alerts" | "gamification">("problems");
  
  // Real-time metrics
  const [totalProblems, setTotalProblems] = useState(0);
  const [resolvedProblems, setResolvedProblems] = useState(0);
  const [activeProblemsList, setActiveProblemsList] = useState<any[]>([]);
  const [highRiskAlerts, setHighRiskAlerts] = useState(0);

  // Scroll animation ref
  const { scrollY } = useScroll();
  const headerOpacity = useTransform(scrollY, [0, 300], [1, 0.8]);
  const headerScale = useTransform(scrollY, [0, 300], [1, 0.95]);

  // Load user and data from localStorage on mount
  useEffect(() => {
    const currentUser = localStorage.getItem("campusMemoryCurrentUser");
    if (currentUser) {
      const userData = JSON.parse(currentUser);
      setCurrentStudent(userData);
    }
    
    // Load colleges from localStorage
    const savedColleges = localStorage.getItem("campusMemoryColleges");
    if (savedColleges) {
      const parsed = JSON.parse(savedColleges);
      setAllColleges(parsed);
    }

    // Seed initial data for this college if not exists
    if (college) {
      seedInitialData(college.id);
      loadAllData();
    }
  }, [college]);

  // Load all data from localStorage
  const loadAllData = () => {
    if (!college) return;
    
    const savedProblems = localStorage.getItem(`problems_${college.id}`);
    const savedWisdom = localStorage.getItem(`wisdom_${college.id}`);
    const savedAlerts = localStorage.getItem(`alerts_${college.id}`);
    
    if (savedProblems) {
      const problemsData = JSON.parse(savedProblems);
      setProblems(problemsData);
      setTotalProblems(problemsData.length);
      setResolvedProblems(problemsData.filter((p: any) => p.status === "resolved").length);
      setActiveProblemsList(problemsData.filter((p: any) => p.status !== "resolved" && p.status !== "prevented"));
    }
    
    if (savedWisdom) {
      setWisdom(JSON.parse(savedWisdom));
    }
    
    if (savedAlerts) {
      const alertsData = JSON.parse(savedAlerts);
      setAlerts(alertsData);
      setHighRiskAlerts(alertsData.filter((a: any) => a.riskLevel === "red").length);
    }
  };

  // Save data to localStorage
  const saveData = (type: string, data: any[]) => {
    if (college) {
      localStorage.setItem(`${type}_${college.id}`, JSON.stringify(data));
    }
  };

  // ==================== CRUD OPERATIONS ====================
  
  // CREATE: Add new problem
  const handleAddProblem = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentStudent) {
      onLogin();
      return;
    }
    
    const formData = new FormData(e.currentTarget);
    const newProblem: Problem = {
      id: `p${Date.now()}`,
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      category: formData.get("category") as string,
      status: "open",
      reportedBy: currentStudent.name,
      reportedDate: new Date().toISOString().split("T")[0],
      upvotes: 0,
      supportCount: 0,
      supporters: [],
      college: college!.id,
      priority: formData.get("priority") as string,
    };
    
    const updatedProblems = [...problems, newProblem];
    setProblems(updatedProblems);
    saveData("problems", updatedProblems);
    setShowProblemModal(false);
    
    // Award points
    awardPoints(10, "Problem reported");
    e.currentTarget.reset();
  };

  // UPDATE: Edit existing problem
  const handleEditProblem = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingProblem) return;
    
    const formData = new FormData(e.currentTarget);
    const updatedProblem: Problem = {
      ...editingProblem,
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      category: formData.get("category") as string,
      status: formData.get("status") as string,
      priority: formData.get("priority") as string,
      solution: formData.get("solution") as string || editingProblem.solution,
    };
    
    const updatedProblems = problems.map(p => p.id === editingProblem.id ? updatedProblem : p);
    setProblems(updatedProblems);
    saveData("problems", updatedProblems);
    setEditingProblem(null);
    setShowProblemModal(false);
  };

  // DELETE: Remove problem
  const handleDeleteProblem = (problemId: string) => {
    if (confirm("Are you sure you want to delete this problem?")) {
      const updatedProblems = problems.filter(p => p.id !== problemId);
      setProblems(updatedProblems);
      saveData("problems", updatedProblems);
    }
  };

  // UPVOTE: Support problem
  const handleUpvoteProblem = (problemId: string) => {
    if (!currentStudent) {
      alert("Please login to upvote");
      return;
    }
    
    const updatedProblems = problems.map(p => {
      if (p.id === problemId) {
        const hasSupported = p.supporters.includes(currentStudent.id);
        return {
          ...p,
          upvotes: hasSupported ? p.upvotes - 1 : p.upvotes + 1,
          supportCount: hasSupported ? p.supportCount - 1 : p.supportCount + 1,
          supporters: hasSupported 
            ? p.supporters.filter(id => id !== currentStudent.id)
            : [...p.supporters, currentStudent.id]
        };
      }
      return p;
    });
    
    setProblems(updatedProblems);
    saveData("problems", updatedProblems);
  };

  // CREATE: Add wisdom tip
  const handleAddWisdom = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentStudent) {
      alert("Please login to share wisdom");
      return;
    }
    
    const formData = new FormData(e.currentTarget);
    const newWisdom: WisdomTip = {
      id: `w${Date.now()}`,
      content: formData.get("content") as string,
      category: formData.get("category") as string,
      author: currentStudent.name,
      date: new Date().toISOString().split("T")[0],
      upvotes: 0,
      helpful: 0,
      college: college!.id,
      tags: (formData.get("tags") as string).split(",").map(t => t.trim()),
    };
    
    const updatedWisdom = [...wisdom, newWisdom];
    setWisdom(updatedWisdom);
    saveData("wisdom", updatedWisdom);
    setShowWisdomModal(false);
    
    // Award points
    awardPoints(15, "Wisdom shared");
    e.currentTarget.reset();
  };

  // UPDATE: Edit wisdom tip
  const handleEditWisdom = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingWisdom) return;
    
    const formData = new FormData(e.currentTarget);
    const updatedWisdomItem: WisdomTip = {
      ...editingWisdom,
      content: formData.get("content") as string,
      category: formData.get("category") as string,
      tags: (formData.get("tags") as string).split(",").map(t => t.trim()),
    };
    
    const updatedWisdomList = wisdom.map(w => w.id === editingWisdom.id ? updatedWisdomItem : w);
    setWisdom(updatedWisdomList);
    saveData("wisdom", updatedWisdomList);
    setEditingWisdom(null);
    setShowWisdomModal(false);
  };

  // DELETE: Remove wisdom tip
  const handleDeleteWisdom = (wisdomId: string) => {
    if (confirm("Are you sure you want to delete this wisdom tip?")) {
      const updatedWisdom = wisdom.filter(w => w.id !== wisdomId);
      setWisdom(updatedWisdom);
      saveData("wisdom", updatedWisdom);
    }
  };

  // UPVOTE: Mark wisdom as helpful
  const handleUpvoteWisdom = (wisdomId: string) => {
    if (!currentStudent) {
      alert("Please login to mark as helpful");
      return;
    }
    
    const updatedWisdom = wisdom.map(w => 
      w.id === wisdomId ? { ...w, helpful: w.helpful + 1, upvotes: w.upvotes + 1 } : w
    );
    
    setWisdom(updatedWisdom);
    saveData("wisdom", updatedWisdom);
  };

  // Award points to current user
  const awardPoints = (points: number, reason: string) => {
    if (!currentStudent) return;
    
    const updatedStudent = {
      ...currentStudent,
      points: currentStudent.points + points,
      contributionsCount: currentStudent.contributionsCount + 1,
    };
    
    setCurrentStudent(updatedStudent);
    localStorage.setItem("campusMemoryCurrentUser", JSON.stringify(updatedStudent));
    
    // Update in users list
    const users = JSON.parse(localStorage.getItem("campusMemoryUsers") || "[]");
    const updatedUsers = users.map((u: User) => 
      u.id === currentStudent.id ? updatedStudent : u
    );
    localStorage.setItem("campusMemoryUsers", JSON.stringify(updatedUsers));
  };

  // ==================== FILTERING & SEARCH ====================
  
  const filteredProblems = (problems || []).filter(p => {
    const matchesFilter = problemFilter === "all" || p.status === problemFilter || p.category === problemFilter;
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         p.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const filteredWisdom = (wisdom || []).filter(w => {
    const matchesFilter = wisdomFilter === "all" || w.category === wisdomFilter;
    const matchesSearch = w.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // ==================== HELPER FUNCTIONS ====================
  
  const onLogin = () => {
    setAuthMode("login");
    setShowAuthModal(true);
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case "high": return "bg-red-500/20 text-red-400 border-red-500/30";
      case "medium": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "low": return "bg-green-500/20 text-green-400 border-green-500/30";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case "resolved": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "in-progress": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "open": return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch(category) {
      case "facilities": return Settings;
      case "academic": return Brain;
      case "events": return Calendar;
      case "safety": return ShieldCheck;
      default: return AlertTriangle;
    }
  };

  if (!college) {
    notFound();
  }

  // Authentication handler with localStorage
  const handleAuth = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const selectedCollege = formData.get("college") as string;
    const program = formData.get("program") as string;
    const year = formData.get("year") as string;

    if (authMode === "signup") {
      // Check if user already exists
      const existingUsers = JSON.parse(localStorage.getItem("campusMemoryUsers") || "[]");
      const userExists = existingUsers.find((u: User) => u.email === email);
      
      if (userExists) {
        alert("User already exists! Please login instead.");
        setAuthMode("login");
        return;
      }

      // Find college ID from name, or use the name itself if custom
      const matchedCollege = allColleges.find(c => c.name === selectedCollege);
      const collegeIdOrName = matchedCollege ? matchedCollege.id : selectedCollege;

      const newStudent: User = {
        id: `u${Date.now()}`,
        name,
        email,
        password,
        collegeid: collegeIdOrName,
        program,
        year: parseInt(year),
        batch: new Date().getFullYear().toString(),
        points: 0,
        achievements: [],
        contributionsCount: 0,
      };
      
      // Save to localStorage
      existingUsers.push(newStudent);
      localStorage.setItem("campusMemoryUsers", JSON.stringify(existingUsers));
      localStorage.setItem("campusMemoryCurrentUser", JSON.stringify(newStudent));
      
      setCurrentStudent(newStudent);
      setShowAuthModal(false);
      alert(`Welcome, ${name}! You're now registered.`);
    } else {
      // Login
      const existingUsers = JSON.parse(localStorage.getItem("campusMemoryUsers") || "[]");
      const user = existingUsers.find((u: User) => u.email === email && u.password === password);
      
      if (user) {
        localStorage.setItem("campusMemoryCurrentUser", JSON.stringify(user));
        setCurrentStudent(user);
        setShowAuthModal(false);
        alert(`Welcome back, ${user.name}!`);
      } else {
        alert("Invalid email or password. Please try again.");
      }
    }
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("campusMemoryCurrentUser");
    setCurrentStudent(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0F1E] via-[#1A1F2E] to-[#0F1528] relative overflow-hidden" suppressHydrationWarning>
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400/30 rounded-full"
            animate={{
              x: [Math.random() * 1000, Math.random() * 1000],
              y: [Math.random() * 800, Math.random() * 800],
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      {/* Floating Orbs Background */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>

      {/* Hero Header with Amity Banner */}
      <motion.header 
        className="relative overflow-hidden text-white"
        style={{ opacity: headerOpacity, scale: headerScale }}
      >
        {/* Background Image - KEEPING AMITY UNIVERSITY BANNER */}
        <div className="absolute inset-0 bg-cover bg-center" style={{backgroundImage: "url('https://i.ibb.co/VckjsXLC/image.png')"}} />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/80 backdrop-blur-sm" />
        
        {/* Animated Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-transparent to-cyan-600/20 animate-pulse"></div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
          {/* Top Navigation Bar */}
          <motion.div 
            className="flex flex-wrap items-center justify-between gap-4 mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link
              href="/"
              className="group inline-flex items-center gap-2 rounded-2xl bg-white/10 px-5 py-3 font-semibold backdrop-blur-xl border border-white/20 transition-all hover:bg-white/20 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/20"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Home</span>
            </Link>
            
            <div className="flex items-center gap-3 flex-wrap">
              <motion.span 
                className="inline-flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-2 backdrop-blur-xl border border-white/20"
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.15)" }}
              >
                <MapPin className="h-4 w-4 text-cyan-400" />
                <span className="text-sm">{college.city}, {college.state}</span>
              </motion.span>
              
              {currentStudent ? (
                <div className="flex items-center gap-2">
                  <motion.div
                    className="inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 backdrop-blur-xl border border-yellow-400/40 px-5 py-2 shadow-lg shadow-yellow-500/20"
                    whileHover={{ scale: 1.05 }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <Trophy className="h-5 w-5 text-yellow-400 animate-pulse" />
                    <div className="flex flex-col">
                      <span className="text-xs text-yellow-200">Welcome back</span>
                      <span className="font-bold text-white">{currentStudent.name}</span>
                    </div>
                    <div className="h-8 w-px bg-yellow-400/30"></div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      <span className="font-bold text-yellow-400 text-lg">{currentStudent.points}</span>
                    </div>
                  </motion.div>
                  <motion.button
                    onClick={handleLogout}
                    className="inline-flex items-center gap-2 rounded-2xl bg-red-500/20 backdrop-blur-xl border border-red-300/40 px-4 py-2 hover:bg-red-500/30 transition-all hover:scale-105 shadow-lg shadow-red-500/10"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    title="Logout"
                  >
                    <LogOut className="h-4 w-4" />
                  </motion.button>
                </div>
              ) : (
                <motion.button
                  onClick={() => {
                    setAuthMode("login");
                    setShowAuthModal(true);
                  }}
                  className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 backdrop-blur-xl px-5 py-3 border border-cyan-400/40 hover:from-cyan-500/30 hover:to-purple-500/30 transition-all hover:scale-105 shadow-lg shadow-cyan-500/20 font-semibold"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Users className="h-4 w-4" />
                  <span>Login / Sign Up</span>
                  <Sparkles className="h-4 w-4 text-cyan-400" />
                </motion.button>
              )}
            </div>
          </motion.div>

          {/* Main Header Content */}
          <div className="grid gap-8 lg:grid-cols-2 items-center">
            {/* Left: College Info */}
            <motion.div 
              className="space-y-5"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <motion.span 
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-500/30 to-cyan-500/30 px-4 py-2 text-sm font-bold uppercase tracking-wide backdrop-blur-xl border border-purple-400/30 shadow-lg"
                whileHover={{ scale: 1.05, rotate: 2 }}
              >
                <Zap className="w-4 h-4 text-cyan-400" />
                {college.type} Institution
              </motion.span>
              
              <motion.h1 
                className="font-heading text-5xl font-bold leading-tight md:text-6xl bg-gradient-to-r from-white via-cyan-200 to-purple-200 bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {college.name}
              </motion.h1>
              
              <motion.p 
                className="text-lg text-cyan-100 leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Campus Memory Dashboard - Track experiences, share wisdom, and build a better campus together.
              </motion.p>

              {/* Quick Stats Grid */}
              <motion.div 
                className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                {[
                  { label: "Memory Index", value: `${college.memoryIndex}%`, icon: Brain, color: "from-purple-500 to-purple-600" },
                  { label: "Active Users", value: college.activeUsers, icon: Users, color: "from-cyan-500 to-cyan-600" },
                  { label: "Total Issues", value: totalProblems, icon: AlertTriangle, color: "from-orange-500 to-orange-600" },
                  { label: "Resolved", value: resolvedProblems, icon: CheckCircle2, color: "from-green-500 to-green-600" },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    className={`rounded-2xl bg-gradient-to-br ${stat.color} p-4 shadow-xl backdrop-blur-xl border border-white/10 hover:scale-105 transition-transform cursor-pointer group`}
                    whileHover={{ y: -5 }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <stat.icon className="w-5 h-5 text-white/80 group-hover:scale-110 transition-transform" />
                      <motion.div
                        className="w-2 h-2 rounded-full bg-white/50"
                        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    </div>
                    <p className="text-xs text-white/70 mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right: Campus Health Metrics */}
            <motion.div 
              className="rounded-3xl border-2 border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl p-6 relative overflow-hidden shadow-2xl"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              whileHover={{ scale: 1.02 }}
            >
              {/* Animated Background Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10 animate-pulse"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 shadow-lg shadow-cyan-500/30">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-heading text-2xl font-semibold text-white">Real-time Campus Health</h3>
                    <p className="text-sm text-cyan-200">Live metrics updating</p>
                  </div>
                </div>
                
                <div className="space-y-5">
                  {/* Student Satisfaction */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-white/90 font-medium flex items-center gap-2">
                        <Heart className="w-4 h-4 text-pink-400" />
                        Student Satisfaction
                      </span>
                      <span className="text-xl font-bold text-white">87%</span>
                    </div>
                    <div className="w-full h-3 bg-black/20 rounded-full overflow-hidden border border-white/10">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full shadow-lg shadow-green-500/50"
                        initial={{ width: 0 }}
                        animate={{ width: "87%" }}
                        transition={{ duration: 1.5, delay: 0.5 }}
                      />
                    </div>
                  </div>

                  {/* Resolution Rate */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-white/90 font-medium flex items-center gap-2">
                        <Target className="w-4 h-4 text-cyan-400" />
                        Resolution Rate
                      </span>
                      <span className="text-xl font-bold text-white">{Math.round((resolvedProblems / totalProblems) * 100) || 0}%</span>
                    </div>
                    <div className="w-full h-3 bg-black/20 rounded-full overflow-hidden border border-white/10">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full shadow-lg shadow-blue-500/50"
                        initial={{ width: 0 }}
                        animate={{ width: `${(resolvedProblems / totalProblems) * 100 || 0}%` }}
                        transition={{ duration: 1.5, delay: 0.7 }}
                      />
                    </div>
                  </div>

                  {/* Alert Stats Grid */}
                  <div className="grid grid-cols-2 gap-3 pt-3">
                    <motion.div 
                      className="rounded-xl bg-gradient-to-br from-red-500/20 to-red-600/20 border border-red-400/30 p-4 text-center backdrop-blur-xl hover:scale-105 transition-transform cursor-pointer"
                      whileHover={{ y: -3 }}
                    >
                      <ShieldCheck className="w-6 h-6 mx-auto mb-2 text-red-400" />
                      <p className="text-3xl font-bold text-white">{highRiskAlerts}</p>
                      <p className="text-xs text-red-200">High Risk Alerts</p>
                    </motion.div>
                    <motion.div 
                      className="rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-600/20 border border-orange-400/30 p-4 text-center backdrop-blur-xl hover:scale-105 transition-transform cursor-pointer"
                      whileHover={{ y: -3 }}
                    >
                      <AlertTriangle className="w-6 h-6 mx-auto mb-2 text-orange-400" />
                      <p className="text-3xl font-bold text-white">{activeProblemsList.length}</p>
                      <p className="text-xs text-orange-200">Active Issues</p>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Feature Cards Section with Enhanced Animations */}
      <div className="relative mt-8 mb-12">
        <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {/* Events Card */}
            <Link href="/events/auth">
              <motion.div 
                className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 p-6 shadow-2xl cursor-pointer h-full"
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <motion.div 
                  className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-2xl"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity }}
                ></motion.div>
                
                <div className="relative z-10">
                  <motion.div 
                    className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 shadow-lg"
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Calendar className="w-8 h-8 text-white" />
                  </motion.div>
                  
                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:translate-x-2 transition-transform duration-300">
                    Events
                  </h3>
                  <p className="text-purple-100 text-sm mb-4 group-hover:translate-x-2 transition-transform duration-300 delay-75">
                    Discover and participate in campus events
                  </p>
                  
                  <div className="flex items-center text-white font-semibold group-hover:translate-x-4 transition-transform duration-300">
                    Explore
                    <ArrowRightIcon className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                  </div>
                </div>
                
                <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/5 rounded-tl-full"></div>
              </motion.div>
            </Link>

            {/* Quiz Card */}
            <Link href="/quiz">
              <motion.div 
                className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 p-6 shadow-2xl cursor-pointer h-full"
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <motion.div 
                  className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-2xl"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                ></motion.div>
                
                <div className="relative z-10">
                  <motion.div 
                    className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 shadow-lg"
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Brain className="w-8 h-8 text-white" />
                  </motion.div>
                  
                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:translate-x-2 transition-transform duration-300">
                    Quiz
                  </h3>
                  <p className="text-blue-100 text-sm mb-4 group-hover:translate-x-2 transition-transform duration-300 delay-75">
                    Test your knowledge and compete
                  </p>
                  
                  <div className="flex items-center text-white font-semibold group-hover:translate-x-4 transition-transform duration-300">
                    Start Quiz
                    <ArrowRightIcon className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                  </div>
                </div>
                
                <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/5 rounded-tl-full"></div>
              </motion.div>
            </Link>

            {/* Alumni Card */}
            <Link href="/alumni">
              <motion.div 
                className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 p-6 shadow-2xl cursor-pointer h-full"
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <motion.div 
                  className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-2xl"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                ></motion.div>
                
                <div className="relative z-10">
                  <motion.div 
                    className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 shadow-lg"
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <UserCheck className="w-8 h-8 text-white" />
                  </motion.div>
                  
                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:translate-x-2 transition-transform duration-300">
                    Alumni
                  </h3>
                  <p className="text-amber-100 text-sm mb-4 group-hover:translate-x-2 transition-transform duration-300 delay-75">
                    Connect with alumni and mentors
                  </p>
                  
                  <div className="flex items-center text-white font-semibold group-hover:translate-x-4 transition-transform duration-300">
                    Connect
                    <ArrowRightIcon className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                  </div>
                </div>
                
                <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/5 rounded-tl-full"></div>
              </motion.div>
            </Link>

            {/* Services Card */}
            <Link href="/services">
              <motion.div 
                className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700 p-6 shadow-2xl cursor-pointer h-full"
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <motion.div 
                  className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-2xl"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
                ></motion.div>
                
                <div className="relative z-10">
                  <motion.div 
                    className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 shadow-lg"
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Settings className="w-8 h-8 text-white" />
                  </motion.div>
                  
                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:translate-x-2 transition-transform duration-300">
                    Services
                  </h3>
                  <p className="text-emerald-100 text-sm mb-4 group-hover:translate-x-2 transition-transform duration-300 delay-75">
                    Access campus services and facilities
                  </p>
                  
                  <div className="flex items-center text-white font-semibold group-hover:translate-x-4 transition-transform duration-300">
                    View All
                    <ArrowRightIcon className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                  </div>
                </div>
                
                <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/5 rounded-tl-full"></div>
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* CRUD Dashboard Section */}
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="space-y-8"
        >
          {/* Dashboard Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Campus Dashboard
              </h2>
              <p className="text-gray-400 mt-2">Manage problems, share wisdom, and view alerts</p>
            </div>
            {currentStudent && (
              <div className="flex gap-3">
                <motion.button
                  onClick={() => {
                    setEditingProblem(null);
                    setShowProblemModal(true);
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold shadow-lg shadow-orange-500/30 hover:scale-105 transition-transform"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Plus className="w-5 h-5" />
                  Report Problem
                </motion.button>
                <motion.button
                  onClick={() => {
                    setEditingWisdom(null);
                    setShowWisdomModal(true);
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold shadow-lg shadow-cyan-500/30 hover:scale-105 transition-transform"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Lightbulb className="w-5 h-5" />
                  Share Wisdom
                </motion.button>
              </div>
            )}
          </div>

          {/* Tabs Navigation */}
          <div className="flex gap-2 border-b border-gray-700/50 pb-2 overflow-x-auto">
            {[
              { id: "problems", label: "Problems", icon: AlertTriangle, count: problems.length },
              { id: "wisdom", label: "Wisdom Tips", icon: Lightbulb, count: wisdom.length },
              { id: "alerts", label: "AI Alerts", icon: ShieldCheck, count: alerts.length },
              { id: "gamification", label: "Leaderboard", icon: Trophy, count: 0 },
            ].map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400 border border-cyan-500/30 shadow-lg shadow-cyan-500/20"
                    : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  activeTab === tab.id ? "bg-cyan-500/30 text-cyan-300" : "bg-gray-700 text-gray-400"
                }`}>
                  {tab.count}
                </span>
              </motion.button>
            ))}
          </div>

          {/* Search and Filter Bar */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/5 border border-gray-700/50 text-white placeholder-gray-500 focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 outline-none transition"
              />
            </div>
            {activeTab === "problems" && (
              <select
                value={problemFilter}
                onChange={(e) => setProblemFilter(e.target.value)}
                className="px-6 py-3 rounded-2xl bg-white/5 border border-gray-700/50 text-white focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 outline-none transition"
              >
                <option value="all">All Problems</option>
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="facilities">Facilities</option>
                <option value="academic">Academic</option>
                <option value="events">Events</option>
              </select>
            )}
            {activeTab === "wisdom" && (
              <select
                value={wisdomFilter}
                onChange={(e) => setWisdomFilter(e.target.value)}
                className="px-6 py-3 rounded-2xl bg-white/5 border border-gray-700/50 text-white focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 outline-none transition"
              >
                <option value="all">All Categories</option>
                <option value="academic">Academic</option>
                <option value="social">Social</option>
                <option value="career">Career</option>
                <option value="life">Life</option>
              </select>
            )}
          </div>

          {/* PROBLEMS TAB */}
          <AnimatePresence mode="wait">
            {activeTab === "problems" && (
              <motion.div
                key="problems"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {filteredProblems.length === 0 ? (
                  <motion.div
                    className="text-center py-20 px-4 bg-white/5 rounded-3xl border border-gray-700/30"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                  >
                    <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-gray-500" />
                    <h3 className="text-2xl font-bold text-white mb-2">No Problems Found</h3>
                    <p className="text-gray-400 mb-6">Be the first to report an issue and help improve campus life!</p>
                    {currentStudent && (
                      <motion.button
                        onClick={() => setShowProblemModal(true)}
                        className="inline-flex items-center gap-2 px-8 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold shadow-lg hover:scale-105 transition-transform"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Plus className="w-5 h-5" />
                        Report a Problem
                      </motion.button>
                    )}
                  </motion.div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredProblems.map((problem, index) => {
                      const CategoryIcon = getCategoryIcon(problem.category);
                      return (
                        <motion.div
                          key={problem.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-gray-700/50 p-6 hover:border-cyan-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/10"
                        >
                          {/* Animated Background Glow */}
                          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-purple-500/0 group-hover:from-cyan-500/5 group-hover:to-purple-500/5 transition-all duration-500" />
                          
                          <div className="relative z-10">
                            {/* Header Row */}
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center gap-3 flex-1">
                                <div className={`p-2.5 rounded-xl ${getPriorityColor(problem.priority || 'medium')} backdrop-blur-xl`}>
                                  <CategoryIcon className="w-5 h-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h3 className="text-lg font-bold text-white truncate group-hover:text-cyan-400 transition-colors">
                                    {problem.title}
                                  </h3>
                                  <p className="text-xs text-gray-400 flex items-center gap-2 mt-1">
                                    <Clock className="w-3 h-3" />
                                    {problem.reportedDate} • by {problem.reportedBy}
                                  </p>
                                </div>
                              </div>
                              
                              {/* Action Buttons */}
                              {currentStudent && currentStudent.name === problem.reportedBy && (
                                <div className="flex gap-2 ml-2">
                                  <motion.button
                                    onClick={() => {
                                      setEditingProblem(problem);
                                      setShowProblemModal(true);
                                    }}
                                    className="p-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </motion.button>
                                  <motion.button
                                    onClick={() => handleDeleteProblem(problem.id)}
                                    className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </motion.button>
                                </div>
                              )}
                            </div>

                            {/* Description */}
                            <p className="text-gray-300 text-sm mb-4 line-clamp-3 leading-relaxed">
                              {problem.description}
                            </p>

                            {/* Tags Row */}
                            <div className="flex flex-wrap gap-2 mb-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(problem.status)}`}>
                                {problem.status === "in-progress" ? "In Progress" : problem.status.charAt(0).toUpperCase() + problem.status.slice(1)}
                              </span>
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(problem.priority || 'medium')}`}>
                                {problem.priority?.toUpperCase() || 'MEDIUM'} Priority
                              </span>
                              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-400 border border-purple-500/30">
                                {problem.category}
                              </span>
                            </div>

                            {/* Footer Actions */}
                            <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
                              <motion.button
                                onClick={() => handleUpvoteProblem(problem.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all ${
                                  currentStudent && problem.supporters.includes(currentStudent.id)
                                    ? 'bg-cyan-500/30 text-cyan-400 border border-cyan-500/50'
                                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-cyan-400 border border-gray-700/50'
                                }`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <Heart className={`w-4 h-4 ${currentStudent && problem.supporters.includes(currentStudent.id) ? 'fill-cyan-400' : ''}`} />
                                <span>{problem.supportCount}</span>
                              </motion.button>
                              
                              <div className="flex items-center gap-3 text-sm text-gray-400">
                                <div className="flex items-center gap-1">
                                  <TrendingUp className="w-4 h-4" />
                                  <span>{problem.upvotes} upvotes</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}

            {/* WISDOM TIPS TAB */}
            {activeTab === "wisdom" && (
              <motion.div
                key="wisdom"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {filteredWisdom.length === 0 ? (
                  <motion.div
                    className="text-center py-20 px-4 bg-white/5 rounded-3xl border border-gray-700/30"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                  >
                    <Lightbulb className="w-16 h-16 mx-auto mb-4 text-gray-500" />
                    <h3 className="text-2xl font-bold text-white mb-2">No Wisdom Tips Yet</h3>
                    <p className="text-gray-400 mb-6">Share your knowledge and help fellow students!</p>
                    {currentStudent && (
                      <motion.button
                        onClick={() => setShowWisdomModal(true)}
                        className="inline-flex items-center gap-2 px-8 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold shadow-lg hover:scale-105 transition-transform"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Lightbulb className="w-5 h-5" />
                        Share Wisdom
                      </motion.button>
                    )}
                  </motion.div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {filteredWisdom.map((tip, index) => (
                      <motion.div
                        key={tip.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 border border-cyan-500/20 p-6 hover:border-cyan-400/40 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/20"
                      >
                        {/* Animated Quote Background */}
                        <motion.div
                          className="absolute top-4 right-4 opacity-5"
                          animate={{ scale: [1, 1.05, 1], rotate: [0, 5, 0] }}
                          transition={{ duration: 5, repeat: Infinity }}
                        >
                          <Quote className="w-32 h-32 text-cyan-400" />
                        </motion.div>

                        <div className="relative z-10">
                          {/* Header */}
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500/30 to-blue-500/30 border border-cyan-400/30">
                                <Lightbulb className="w-5 h-5 text-cyan-400" />
                              </div>
                              <div>
                                <p className="font-bold text-white">{tip.author}</p>
                                <p className="text-xs text-gray-400">{tip.date}</p>
                              </div>
                            </div>
                            
                            {/* Action Buttons */}
                            {currentStudent && currentStudent.name === tip.author && (
                              <div className="flex gap-2">
                                <motion.button
                                  onClick={() => {
                                    setEditingWisdom(tip);
                                    setShowWisdomModal(true);
                                  }}
                                  className="p-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  <Edit2 className="w-4 h-4" />
                                </motion.button>
                                <motion.button
                                  onClick={() => handleDeleteWisdom(tip.id)}
                                  className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </motion.button>
                              </div>
                            )}
                          </div>

                          {/* Content */}
                          <p className="text-gray-200 text-base leading-relaxed mb-4 italic">
                            "{tip.content}"
                          </p>

                          {/* Tags */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                              {tip.category}
                            </span>
                            {tip.tags && tip.tags.map((tag, i) => (
                              <span key={i} className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-400 border border-purple-500/30">
                                #{tag}
                              </span>
                            ))}
                          </div>

                          {/* Footer */}
                          <div className="flex items-center justify-between pt-4 border-t border-cyan-500/20">
                            <motion.button
                              onClick={() => handleUpvoteWisdom(tip.id)}
                              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/30 font-semibold transition-all"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <ThumbsUp className="w-4 h-4" />
                              <span>{tip.helpful} helpful</span>
                            </motion.button>
                            
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span>{tip.upvotes} upvotes</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* AI ALERTS TAB */}
            {activeTab === "alerts" && (
              <motion.div
                key="alerts"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {alerts.length === 0 ? (
                  <motion.div
                    className="text-center py-20 px-4 bg-white/5 rounded-3xl border border-gray-700/30"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                  >
                    <ShieldCheck className="w-16 h-16 mx-auto mb-4 text-green-500" />
                    <h3 className="text-2xl font-bold text-white mb-2">All Clear!</h3>
                    <p className="text-gray-400">No AI alerts detected. Campus is running smoothly.</p>
                  </motion.div>
                ) : (
                  <div className="grid grid-cols-1 gap-6">
                    {(alerts || []).map((alert, index) => {
                      const getRiskColor = (risk: string) => {
                        switch(risk) {
                          case "red": return {
                            bg: "from-red-500/20 to-red-600/20",
                            border: "border-red-500/40",
                            glow: "shadow-red-500/30",
                            text: "text-red-400",
                            icon: "text-red-500"
                          };
                          case "yellow": return {
                            bg: "from-yellow-500/20 to-yellow-600/20",
                            border: "border-yellow-500/40",
                            glow: "shadow-yellow-500/30",
                            text: "text-yellow-400",
                            icon: "text-yellow-500"
                          };
                          case "green": return {
                            bg: "from-green-500/20 to-green-600/20",
                            border: "border-green-500/40",
                            glow: "shadow-green-500/30",
                            text: "text-green-400",
                            icon: "text-green-500"
                          };
                          default: return {
                            bg: "from-gray-500/20 to-gray-600/20",
                            border: "border-gray-500/40",
                            glow: "shadow-gray-500/30",
                            text: "text-gray-400",
                            icon: "text-gray-500"
                          };
                        }
                      };
                      
                      const colors = getRiskColor(alert.riskLevel);
                      
                      return (
                        <motion.div
                          key={alert.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${colors.bg} border ${colors.border} p-6 shadow-xl ${colors.glow}`}
                        >
                          {/* Animated Pulse */}
                          {alert.riskLevel === "red" && (
                            <motion.div
                              className="absolute inset-0 bg-red-500/10 rounded-3xl"
                              animate={{ opacity: [0, 0.3, 0] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            />
                          )}

                          <div className="relative z-10">
                            {/* Header */}
                            <div className="flex items-start gap-4 mb-4">
                              <div className={`p-3 rounded-2xl bg-gradient-to-br ${colors.bg} border ${colors.border} backdrop-blur-xl`}>
                                <AlertTriangle className={`w-6 h-6 ${colors.icon}`} />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className={`text-xl font-bold ${colors.text}`}>
                                    {alert.title}
                                  </h3>
                                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase ${colors.text} bg-black/20`}>
                                    {alert.riskLevel} Risk
                                  </span>
                                </div>
                                <p className="text-gray-300 text-sm leading-relaxed">
                                  {alert.description}
                                </p>
                              </div>
                            </div>

                            {/* Affected Areas */}
                            <div className="mb-4">
                              <p className="text-xs text-gray-400 mb-2 font-semibold">AFFECTED AREAS:</p>
                              <div className="flex flex-wrap gap-2">
                                {alert.affectedAreas && alert.affectedAreas.map((area, i) => (
                                  <span
                                    key={i}
                                    className={`px-3 py-1 rounded-lg text-xs font-semibold bg-black/20 ${colors.text} border ${colors.border}`}
                                  >
                                    {area}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* Predicted Date */}
                            {alert.predictedDate && (
                              <div className="flex items-center gap-2 text-sm text-gray-400 pt-4 border-t border-white/10">
                                <Clock className="w-4 h-4" />
                                <span>Predicted: {alert.predictedDate}</span>
                              </div>
                            )}

                            {/* AI Badge */}
                            <div className="absolute top-4 right-4">
                              <motion.div
                                className="flex items-center gap-1 px-2 py-1 rounded-lg bg-purple-500/20 border border-purple-500/30"
                                animate={{ scale: [1, 1.05, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                              >
                                <Zap className="w-3 h-3 text-purple-400" />
                                <span className="text-xs font-bold text-purple-400">AI</span>
                              </motion.div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}

            {/* GAMIFICATION TAB */}
            {activeTab === "gamification" && (
              <motion.div
                key="gamification"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <Leaderboard 
                  currentStudentId={currentStudent?.id || "student-001"} 
                  limit={10}
                  showFullLeaderboard={false}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Problem Modal */}
      <AnimatePresence>
        {showProblemModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={() => {
              setShowProblemModal(false);
              setEditingProblem(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl shadow-2xl w-full max-w-2xl p-8 max-h-[90vh] overflow-y-auto border border-gray-700"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500">
                    <AlertTriangle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">
                      {editingProblem ? "Edit Problem" : "Report a Problem"}
                    </h3>
                    <p className="text-sm text-gray-400">Help improve campus life</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowProblemModal(false);
                    setEditingProblem(null);
                  }}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={editingProblem ? handleEditProblem : handleAddProblem} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Problem Title *</label>
                  <input
                    type="text"
                    name="title"
                    required
                    defaultValue={editingProblem?.title || ""}
                    placeholder="Give your problem a clear, concise title"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-gray-600 text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Description *</label>
                  <textarea
                    name="description"
                    required
                    defaultValue={editingProblem?.description || ""}
                    placeholder="Describe the problem in detail..."
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-gray-600 text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Category *</label>
                    <select
                      name="category"
                      required
                      defaultValue={editingProblem?.category || ""}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-gray-600 text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition"
                    >
                      <option value="">Select category</option>
                      <option value="facilities">Facilities</option>
                      <option value="academic">Academic</option>
                      <option value="events">Events</option>
                      <option value="safety">Safety</option>
                      <option value="food">Food & Canteen</option>
                      <option value="transport">Transport</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Priority *</label>
                    <select
                      name="priority"
                      required
                      defaultValue={editingProblem?.priority || "medium"}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-gray-600 text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  {editingProblem && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">Status *</label>
                      <select
                        name="status"
                        required
                        defaultValue={editingProblem?.status || "open"}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-gray-600 text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition"
                      >
                        <option value="open">Open</option>
                        <option value="in-progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                      </select>
                    </div>
                  )}
                </div>

                {editingProblem && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Solution (Optional)</label>
                    <textarea
                      name="solution"
                      defaultValue={editingProblem?.solution || ""}
                      placeholder="Describe the solution if resolved..."
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-gray-600 text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition resize-none"
                    />
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowProblemModal(false);
                      setEditingProblem(null);
                    }}
                    className="flex-1 px-6 py-3 rounded-xl bg-white/5 text-gray-300 font-semibold hover:bg-white/10 transition-colors border border-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold hover:shadow-lg hover:shadow-orange-500/30 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                  >
                    <Save className="w-5 h-5" />
                    {editingProblem ? "Update Problem" : "Report Problem"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Wisdom Modal */}
      <AnimatePresence>
        {showWisdomModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={() => {
              setShowWisdomModal(false);
              setEditingWisdom(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl shadow-2xl w-full max-w-2xl p-8 max-h-[90vh] overflow-y-auto border border-gray-700"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500">
                    <Lightbulb className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">
                      {editingWisdom ? "Edit Wisdom Tip" : "Share Your Wisdom"}
                    </h3>
                    <p className="text-sm text-gray-400">Help fellow students succeed</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowWisdomModal(false);
                    setEditingWisdom(null);
                  }}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={editingWisdom ? handleEditWisdom : handleAddWisdom} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Your Wisdom *</label>
                  <textarea
                    name="content"
                    required
                    defaultValue={editingWisdom?.content || ""}
                    placeholder="Share your knowledge, tips, or advice..."
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-gray-600 text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Category *</label>
                  <select
                    name="category"
                    required
                    defaultValue={editingWisdom?.category || ""}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-gray-600 text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition"
                  >
                    <option value="">Select category</option>
                    <option value="academic">Academic</option>
                    <option value="social">Social</option>
                    <option value="career">Career</option>
                    <option value="life">Life</option>
                    <option value="health">Health & Wellness</option>
                    <option value="skills">Skills Development</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Tags (comma-separated)</label>
                  <input
                    type="text"
                    name="tags"
                    defaultValue={editingWisdom?.tags?.join(", ") || ""}
                    placeholder="e.g., study, exams, time-management"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-gray-600 text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition"
                  />
                  <p className="text-xs text-gray-500 mt-1">Separate tags with commas for better discovery</p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowWisdomModal(false);
                      setEditingWisdom(null);
                    }}
                    className="flex-1 px-6 py-3 rounded-xl bg-white/5 text-gray-300 font-semibold hover:bg-white/10 transition-colors border border-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold hover:shadow-lg hover:shadow-cyan-500/30 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                  >
                    <Save className="w-5 h-5" />
                    {editingWisdom ? "Update Wisdom" : "Share Wisdom"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 max-h-[90vh] overflow-y-auto">
            <h3 className="font-heading text-3xl font-bold mb-2">
              {authMode === "login" ? "Welcome Back!" : "Join Campus Memory"}
            </h3>
            <p className="text-gray-600 mb-6">
              {authMode === "login" ? "Login to access your dashboard" : "Create an account to start contributing"}
            </p>
            
            <form onSubmit={handleAuth} className="space-y-4">
              {authMode === "signup" && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
                  <input 
                    type="text" 
                    name="name" 
                    required 
                    placeholder="Enter your full name" 
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition"
                  />
                </div>
              )}
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
                <input 
                  type="email" 
                  name="email" 
                  required 
                  placeholder="your.email@example.com" 
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Password *</label>
                <input 
                  type="password" 
                  name="password" 
                  required 
                  placeholder="Enter your password" 
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition"
                />
              </div>
              
              {authMode === "signup" && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">College/University *</label>
                    <input
                      type="text"
                      name="college"
                      required
                      list="college-list"
                      defaultValue={college.name}
                      placeholder="Type or select your college"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition"
                    />
                    <datalist id="college-list">
                      {allColleges.map(c => (
                        <option key={c.id} value={c.name} />
                      ))}
                    </datalist>
                    <p className="text-xs text-gray-500 mt-1">Pre-filled with your selected college. Type your college if not in the list.</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Programme *</label>
                    <select 
                      name="program" 
                      required 
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition bg-white"
                    >
                      <option value="">Select your programme</option>
                      <option value="B.Tech CSE">B.Tech - Computer Science & Engineering</option>
                      <option value="B.Tech IT">B.Tech - Information Technology</option>
                      <option value="B.Tech ECE">B.Tech - Electronics & Communication</option>
                      <option value="B.Tech ME">B.Tech - Mechanical Engineering</option>
                      <option value="B.Tech CE">B.Tech - Civil Engineering</option>
                      <option value="B.Tech EE">B.Tech - Electrical Engineering</option>
                      <option value="BCA">BCA - Bachelor of Computer Applications</option>
                      <option value="MCA">MCA - Master of Computer Applications</option>
                      <option value="M.Tech">M.Tech - Masters in Technology</option>
                      <option value="MBA">MBA - Master of Business Administration</option>
                      <option value="BBA">BBA - Bachelor of Business Administration</option>
                      <option value="B.Sc">B.Sc - Bachelor of Science</option>
                      <option value="M.Sc">M.Sc - Master of Science</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Current Year / Batch *</label>
                    <select 
                      name="year" 
                      required 
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition bg-white"
                    >
                      <option value="">Select your year</option>
                      <option value="1">1st Year - Batch {new Date().getFullYear() + 3}</option>
                      <option value="2">2nd Year - Batch {new Date().getFullYear() + 2}</option>
                      <option value="3">3rd Year - Batch {new Date().getFullYear() + 1}</option>
                      <option value="4">4th Year - Batch {new Date().getFullYear()}</option>
                      <option value="5">5th Year - Batch {new Date().getFullYear() - 1}</option>
                      <option value="0">Alumni - Passed Out</option>
                    </select>
                  </div>
                </>
              )}
              
              <button 
                type="submit" 
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-white font-bold hover:shadow-lg hover:scale-[1.02] transition-all"
              >
                {authMode === "login" ? "Login to Dashboard" : "Create Account"}
              </button>
            </form>
            
            <div className="flex items-center justify-center gap-2 mt-6">
              <span className="text-sm text-gray-600">
                {authMode === "login" ? "Don't have an account?" : "Already have an account?"}
              </span>
              <button 
                onClick={() => setAuthMode(authMode === "login" ? "signup" : "login")}
                className="text-sm font-semibold text-[#D4AF37] hover:underline"
              >
                {authMode === "login" ? "Sign Up" : "Login"}
              </button>
            </div>
            
            <button 
              onClick={() => setShowAuthModal(false)}
              className="mt-4 w-full text-sm text-gray-500 hover:text-gray-700 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
