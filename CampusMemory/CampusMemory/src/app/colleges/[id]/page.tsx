"use client";

import { useState, use, useEffect } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
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
} from "lucide-react";
import { colleges } from "@/lib/data";
import EnhancedCollegeDashboard from "@/components/EnhancedCollegeDashboard";
import { seedInitialData } from "@/lib/seedData";

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

export default function CollegePage({ params }: CollegePageProps) {
  const { id } = use(params);
  const college = colleges.find((item) => item.id === id);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [currentStudent, setCurrentStudent] = useState<User | null>(null);
  const [allColleges, setAllColleges] = useState(colleges);
  
  // State for real-time metrics
  const [totalProblems, setTotalProblems] = useState(0);
  const [resolvedProblems, setResolvedProblems] = useState(0);
  const [activeProblemsList, setActiveProblemsList] = useState<any[]>([]);
  const [highRiskAlerts, setHighRiskAlerts] = useState(0);

  // Load user from localStorage on mount
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
      
      // Calculate real-time metrics
      const savedProblems = localStorage.getItem(`problems_${college.id}`);
      const savedStudents = localStorage.getItem(`students_${college.id}`);
      const savedAlerts = localStorage.getItem(`alerts_${college.id}`);
      
      if (savedProblems) {
        const problems = JSON.parse(savedProblems);
        setTotalProblems(problems.length);
        setResolvedProblems(problems.filter((p: any) => p.status === "resolved").length);
        setActiveProblemsList(problems.filter((p: any) => p.status !== "resolved" && p.status !== "prevented"));
      }
      
      if (savedAlerts) {
        const alerts = JSON.parse(savedAlerts);
        setHighRiskAlerts(alerts.filter((a: any) => a.riskLevel === "red").length);
      }
    }
  }, [college]);

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
    alert("Logged out successfully!");
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-marble-white via-white to-university-blue/5">
      {/* Header */}
      <header className="relative overflow-hidden text-white">
        <div className="absolute inset-0 bg-cover bg-center" style={{backgroundImage: "url('https://i.ibb.co/VckjsXLC/image.png')"}} />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-12 md:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 font-semibold backdrop-blur transition hover:bg-white/20"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2">
                <MapPin className="h-4 w-4" />
                {college.city}, {college.state}
              </span>
              {currentStudent ? (
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-2 rounded-full bg-[#D4AF37]/20 backdrop-blur border border-[#D4AF37]/50 px-4 py-2">
                    <Trophy className="h-4 w-4 text-[#D4AF37]" />
                    <span className="font-semibold">{currentStudent.name}</span>
                    <span className="text-[#D4AF37]">•</span>
                    <span className="font-bold text-[#D4AF37]">{currentStudent.points} pts</span>
                  </span>
                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center gap-2 rounded-full bg-red-500/20 backdrop-blur border border-red-300/50 px-4 py-2 hover:bg-red-500/30 transition"
                    title="Logout"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setAuthMode("login");
                    setShowAuthModal(true);
                  }}
                  className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur px-4 py-2 hover:bg-white/30 transition"
                >
                  <Users className="h-4 w-4" />
                  Login / Sign Up
                </button>
              )}
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-sm font-medium uppercase tracking-wide">
                {college.type} Institution
              </span>
              <h1 className="font-heading text-4xl font-bold leading-tight md:text-5xl">
                {college.name}
              </h1>
              <p className="text-lg text-white/90">
                Campus Memory Dashboard - Track experiences, share wisdom, and build a better campus together.
              </p>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4">
                <div className="rounded-xl bg-white/10 backdrop-blur p-3">
                  <p className="text-xs text-white/70">Memory Index</p>
                  <p className="text-2xl font-bold">{college.memoryIndex}%</p>
                </div>
                <div className="rounded-xl bg-white/10 backdrop-blur p-3">
                  <p className="text-xs text-white/70">Active Users</p>
                  <p className="text-2xl font-bold">{college.activeUsers}</p>
                </div>
                <div className="rounded-xl bg-white/10 backdrop-blur p-3">
                  <p className="text-xs text-white/70">Problems</p>
                  <p className="text-2xl font-bold">{totalProblems}</p>
                </div>
                <div className="rounded-xl bg-white/10 backdrop-blur p-3">
                  <p className="text-xs text-white/70">Resolved</p>
                  <p className="text-2xl font-bold">{resolvedProblems}</p>
                </div>
              </div>
            </div>

            {/* Campus Health Metrics */}
            <div className="rounded-3xl border-2 border-white/30 bg-white/20 backdrop-blur-md p-6 relative overflow-hidden">
              {/* Background Image - Check if color is an image URL */}
              {college.color && college.color.startsWith('http') && (
                <div className="absolute inset-0 opacity-20">
                  <img 
                    src={college.color} 
                    alt={college.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="relative z-10">
                <h3 className="font-heading text-xl font-semibold mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Real-time Campus Health
                </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-white/80">Student Satisfaction</span>
                  <span className="text-lg font-bold">87%</span>
                </div>
                <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-green-400" style={{width: "87%"}}></div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <span className="text-sm text-white/80">Resolution Rate</span>
                  <span className="text-lg font-bold">{Math.round(resolvedProblems / totalProblems * 100) || 0}%</span>
                </div>
                <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-400" style={{width: `${resolvedProblems / totalProblems * 100 || 0}%`}}></div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-3">
                  <div className="rounded-lg bg-white/10 p-3 text-center">
                    <p className="text-2xl font-bold">{highRiskAlerts}</p>
                    <p className="text-xs text-white/70">High Risk Alerts</p>
                  </div>
                  <div className="rounded-lg bg-white/10 p-3 text-center">
                    <p className="text-2xl font-bold">{activeProblemsList.length}</p>
                    <p className="text-xs text-white/70">Active Issues</p>
                  </div>
                </div>
              </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Feature Cards Section */}
      <div className="relative mt-8 mb-12">
        <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Events Card */}
            <Link href="/events/auth">
              <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 p-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                    <Calendar className="w-7 h-7 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:translate-x-1 transition-transform duration-300">
                    Events
                  </h3>
                  <p className="text-purple-100 text-sm mb-4 group-hover:translate-x-1 transition-transform duration-300 delay-75">
                    Discover and participate in campus events
                  </p>
                  
                  <div className="flex items-center text-white font-semibold group-hover:translate-x-2 transition-transform duration-300">
                    Explore
                    <ArrowRightIcon className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
                
                <div className="absolute bottom-0 right-0 w-20 h-20 bg-white/5 rounded-tl-full"></div>
              </div>
            </Link>

            {/* Quiz Card */}
            <Link href="/quiz">
              <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 p-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                    <Brain className="w-7 h-7 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:translate-x-1 transition-transform duration-300">
                    Quiz
                  </h3>
                  <p className="text-blue-100 text-sm mb-4 group-hover:translate-x-1 transition-transform duration-300 delay-75">
                    Test your knowledge and compete
                  </p>
                  
                  <div className="flex items-center text-white font-semibold group-hover:translate-x-2 transition-transform duration-300">
                    Start Quiz
                    <ArrowRightIcon className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
                
                <div className="absolute bottom-0 right-0 w-20 h-20 bg-white/5 rounded-tl-full"></div>
              </div>
            </Link>

            {/* Alumni Card */}
            <Link href="/alumni">
              <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 p-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                    <UserCheck className="w-7 h-7 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:translate-x-1 transition-transform duration-300">
                    Alumni
                  </h3>
                  <p className="text-amber-100 text-sm mb-4 group-hover:translate-x-1 transition-transform duration-300 delay-75">
                    Connect with alumni and mentors
                  </p>
                  
                  <div className="flex items-center text-white font-semibold group-hover:translate-x-2 transition-transform duration-300">
                    Connect
                    <ArrowRightIcon className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
                
                <div className="absolute bottom-0 right-0 w-20 h-20 bg-white/5 rounded-tl-full"></div>
              </div>
            </Link>

            {/* Services Card */}
            <Link href="/services">
              <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700 p-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                    <Settings className="w-7 h-7 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:translate-x-1 transition-transform duration-300">
                    Services
                  </h3>
                  <p className="text-emerald-100 text-sm mb-4 group-hover:translate-x-1 transition-transform duration-300 delay-75">
                    Access campus services and facilities
                  </p>
                  
                  <div className="flex items-center text-white font-semibold group-hover:translate-x-2 transition-transform duration-300">
                    View All
                    <ArrowRightIcon className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
                
                <div className="absolute bottom-0 right-0 w-20 h-20 bg-white/5 rounded-tl-full"></div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 lg:px-8 space-y-12">
        {/* Enhanced Dashboard with Full CRUD Operations */}
        <EnhancedCollegeDashboard 
          college={college}
          currentStudent={currentStudent}
          onLogin={() => setShowAuthModal(true)}
        />
      </div>

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
    </main>
  );
}
