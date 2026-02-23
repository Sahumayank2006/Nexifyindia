"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  AlertTriangle,
  MessageSquare,
  Brain,
  Trophy,
  Plus,
  Heart,
  X,
  Edit2,
  Trash2,
  Clock,
  TrendingUp,
  CheckCircle2,
  BarChart3,
  ShieldCheck,
  Zap,
  Save,
  Sparkles,
  Award,
  Star,
  ThumbsUp,
  Filter,
  Search,
  Info,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import type { College, Problem, WisdomTip, Alert, Student } from "@/lib/data";

interface EnhancedDashboardProps {
  college: College;
  currentStudent: any;
  onLogin: () => void;
}

export default function EnhancedCollegeDashboard({
  college,
  currentStudent,
  onLogin,
}: EnhancedDashboardProps) {
  // State management
  const [problems, setProblems] = useState<Problem[]>([]);
  const [wisdom, setWisdom] = useState<WisdomTip[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  
  // Modal states
  const [showProblemModal, setShowProblemModal] = useState(false);
  const [showWisdomModal, setShowWisdomModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  
  // Filter states
  const [problemFilter, setProblemFilter] = useState<string>("all");
  const [wisdomFilter, setWisdomFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Load data from localStorage
  useEffect(() => {
    loadData();
  }, [college.id]);

  const loadData = () => {
    const savedProblems = localStorage.getItem(`problems_${college.id}`);
    const savedWisdom = localStorage.getItem(`wisdom_${college.id}`);
    const savedAlerts = localStorage.getItem(`alerts_${college.id}`);
    const savedStudents = localStorage.getItem(`students_${college.id}`);
    
    if (savedProblems) setProblems(JSON.parse(savedProblems));
    if (savedWisdom) setWisdom(JSON.parse(savedWisdom));
    if (savedAlerts) setAlerts(JSON.parse(savedAlerts));
    if (savedStudents) setStudents(JSON.parse(savedStudents));
  };

  const saveData = (type: string, data: any[]) => {
    localStorage.setItem(`${type}_${college.id}`, JSON.stringify(data));
  };

  // CRUD Operations for Problems
  const addProblem = (newProblem: Omit<Problem, "id">) => {
    const problem: Problem = {
      ...newProblem,
      id: `p${Date.now()}`,
      reportedDate: new Date().toISOString().split("T")[0],
      upvotes: 0,
      supportCount: 0,
      supporters: [],
      college: college.id,
    };
    const updated = [...problems, problem];
    setProblems(updated);
    saveData("problems", updated);
    
    // Award points to user
    if (currentStudent) {
      awardPoints(50, "Problem Reported");
    }
  };

  const updateProblem = (id: string, updates: Partial<Problem>) => {
    const updated = problems.map(p => p.id === id ? { ...p, ...updates } : p);
    setProblems(updated);
    saveData("problems", updated);
  };

  const deleteProblem = (id: string) => {
    const updated = problems.filter(p => p.id !== id);
    setProblems(updated);
    saveData("problems", updated);
  };

  const supportProblem = (id: string) => {
    if (!currentStudent) {
      onLogin();
      return;
    }
    
    const updated = problems.map(p => {
      if (p.id === id) {
        const hasSupported = p.supporters.includes(currentStudent.id);
        return {
          ...p,
          supportCount: hasSupported ? p.supportCount - 1 : p.supportCount + 1,
          supporters: hasSupported 
            ? p.supporters.filter(s => s !== currentStudent.id)
            : [...p.supporters, currentStudent.id],
          upvotes: hasSupported ? p.upvotes - 1 : p.upvotes + 1,
        };
      }
      return p;
    });
    setProblems(updated);
    saveData("problems", updated);
    
    awardPoints(5, "Problem Supported");
  };

  // CRUD Operations for Wisdom
  const addWisdom = (newWisdom: Omit<WisdomTip, "id">) => {
    const wisdomTip: WisdomTip = {
      ...newWisdom,
      id: `w${Date.now()}`,
      upvotes: 0,
      college: college.id,
    };
    const updated = [...wisdom, wisdomTip];
    setWisdom(updated);
    saveData("wisdom", updated);
    
    if (currentStudent) {
      awardPoints(30, "Wisdom Shared");
    }
  };

  const updateWisdom = (id: string, updates: Partial<WisdomTip>) => {
    const updated = wisdom.map(w => w.id === id ? { ...w, ...updates } : w);
    setWisdom(updated);
    saveData("wisdom", updated);
  };

  const deleteWisdom = (id: string) => {
    const updated = wisdom.filter(w => w.id !== id);
    setWisdom(updated);
    saveData("wisdom", updated);
  };

  const upvoteWisdom = (id: string) => {
    if (!currentStudent) {
      onLogin();
      return;
    }
    
    const updated = wisdom.map(w => 
      w.id === id ? { ...w, upvotes: w.upvotes + 1 } : w
    );
    setWisdom(updated);
    saveData("wisdom", updated);
    
    awardPoints(3, "Wisdom Upvoted");
  };

  // CRUD Operations for Alerts
  const addAlert = (newAlert: Omit<Alert, "id">) => {
    const alert: Alert = {
      ...newAlert,
      id: `a${Date.now()}`,
      college: college.id,
    };
    const updated = [...alerts, alert];
    setAlerts(updated);
    saveData("alerts", updated);
  };

  const updateAlert = (id: string, updates: Partial<Alert>) => {
    const updated = alerts.map(a => a.id === id ? { ...a, ...updates } : a);
    setAlerts(updated);
    saveData("alerts", updated);
  };

  const deleteAlert = (id: string) => {
    const updated = alerts.filter(a => a.id !== id);
    setAlerts(updated);
    saveData("alerts", updated);
  };

  // Points and Leaderboard System
  const awardPoints = (points: number, reason: string) => {
    if (!currentStudent) return;
    
    const updatedStudent = {
      ...currentStudent,
      points: currentStudent.points + points,
      contributionsCount: currentStudent.contributionsCount + 1,
    };
    
    // Update in students array
    const updatedStudents = students.map(s => 
      s.id === currentStudent.id ? updatedStudent : s
    );
    
    if (!updatedStudents.find(s => s.id === currentStudent.id)) {
      updatedStudents.push(updatedStudent);
    }
    
    setStudents(updatedStudents);
    saveData("students", updatedStudents);
    
    // Update current user in localStorage
    localStorage.setItem("campusMemoryCurrentUser", JSON.stringify(updatedStudent));
    
    // Show notification
    showNotification(`+${points} points for ${reason}!`);
  };

  const showNotification = (message: string) => {
    // Simple notification implementation
    const notification = document.createElement("div");
    notification.className = "fixed top-20 right-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-full shadow-lg z-50 animate-bounce";
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  };

  // Filtered data
  const filteredProblems = problems.filter(p => {
    const matchesFilter = problemFilter === "all" || p.status === problemFilter;
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         p.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const filteredWisdom = wisdom.filter(w => {
    const matchesFilter = wisdomFilter === "all" || w.category === wisdomFilter;
    const matchesSearch = w.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const sortedAlerts = [...alerts].sort((a, b) => {
    const riskOrder = { red: 0, yellow: 1, green: 2 };
    return riskOrder[a.riskLevel] - riskOrder[b.riskLevel];
  });

  const leaderboard = [...students]
    .filter(s => s.collegeid === college.id)
    .sort((a, b) => b.points - a.points)
    .slice(0, 10);

  return (
    <div className="space-y-12">
      {/* Future Warning Dashboard - Enhanced */}
      <section id="warnings" className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h2 className="font-heading text-4xl font-bold text-gray-900 flex items-center gap-3">
              <Shield className="w-10 h-10 text-primary" />
              <span className="bg-gradient-to-r from-primary to-university-blue bg-clip-text text-transparent">
                Future Warning Dashboard
              </span>
              <Sparkles className="w-6 h-6 text-saffron animate-pulse" />
            </h2>
            <p className="text-gray-600 mt-3 text-lg">
              AI-powered predictions based on years of campus patterns. Prevent problems before they happen.
            </p>
          </div>
          {currentStudent && (
            <button
              onClick={() => {
                setEditingItem(null);
                setShowAlertModal(true);
              }}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 px-6 py-4 font-bold text-white shadow-lg transition-all hover:shadow-2xl hover:scale-105"
            >
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
              <div className="relative flex items-center gap-2">
                <Plus className="w-5 h-5" />
                <span>Create Alert</span>
              </div>
            </button>
          )}
        </motion.div>

        {/* Risk Summary Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            { 
              level: "red", 
              label: "High Risk", 
              count: alerts.filter(a => a.riskLevel === "red").length,
              gradient: "from-red-500 to-pink-500",
              icon: "🚨"
            },
            { 
              level: "yellow", 
              label: "Moderate Risk", 
              count: alerts.filter(a => a.riskLevel === "yellow").length,
              gradient: "from-yellow-500 to-orange-500",
              icon: "⚠️"
            },
            { 
              level: "green", 
              label: "Low Risk", 
              count: alerts.filter(a => a.riskLevel === "green").length,
              gradient: "from-green-500 to-emerald-500",
              icon: "✅"
            },
          ].map((item, index) => (
            <motion.div
              key={item.level}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="group relative overflow-hidden rounded-3xl bg-white p-6 shadow-lg border-2 border-gray-100 hover:shadow-2xl transition-all hover:scale-105"
            >
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${item.gradient} opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform`} />
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-5xl">{item.icon}</span>
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-lg`}>
                    <span className="text-3xl font-black text-white">{item.count}</span>
                  </div>
                </div>
                <h3 className="font-heading text-xl font-bold text-gray-900">{item.label}</h3>
                <p className="text-sm text-gray-500 mt-1">Active alerts requiring attention</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Alert Cards - Enhanced Design */}
        <div className="grid gap-6 md:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {sortedAlerts.map((alert, index) => (
              <AlertCard
                key={alert.id}
                alert={alert}
                index={index}
                currentStudent={currentStudent}
                onEdit={() => {
                  setEditingItem(alert);
                  setShowAlertModal(true);
                }}
                onDelete={() => deleteAlert(alert.id)}
              />
            ))}
          </AnimatePresence>
        </div>

        {sortedAlerts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-dashed border-indigo-200"
          >
            <Shield className="w-20 h-20 mx-auto text-indigo-300 mb-4" />
            <h3 className="text-2xl font-bold text-gray-700 mb-2">All Clear!</h3>
            <p className="text-gray-500">No active warnings. System is monitoring campus patterns...</p>
          </motion.div>
        )}
      </section>

      {/* Problems & Feedback Section - Enhanced */}
      <section id="problems" className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div>
            <h2 className="font-heading text-4xl font-bold text-gray-900 flex items-center gap-3">
              <MessageSquare className="w-10 h-10 text-primary" />
              <span className="bg-gradient-to-r from-primary to-ivy-green bg-clip-text text-transparent">
                Problems & Feedback
              </span>
            </h2>
            <p className="text-gray-600 mt-2">
              Voice your concerns and track resolutions in real-time
            </p>
          </div>
          <button
            onClick={() => {
              if (!currentStudent) {
                onLogin();
                return;
              }
              setEditingItem(null);
              setShowProblemModal(true);
            }}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-university-blue px-8 py-4 font-bold text-white shadow-lg transition-all hover:shadow-2xl hover:scale-105"
          >
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
            <div className="relative flex items-center gap-2">
              <Plus className="w-5 h-5" />
              <span>Report Problem</span>
            </div>
          </button>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-[300px]">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search problems..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/20 outline-none transition-all"
              />
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            {["all", "reported", "analyzing", "solving", "resolved"].map((status) => (
              <button
                key={status}
                onClick={() => setProblemFilter(status)}
                className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                  problemFilter === status
                    ? "bg-primary text-white shadow-lg scale-105"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Problem Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {filteredProblems.map((problem, index) => (
              <ProblemCard
                key={problem.id}
                problem={problem}
                index={index}
                currentStudent={currentStudent}
                onSupport={() => supportProblem(problem.id)}
                onEdit={() => {
                  setEditingItem(problem);
                  setShowProblemModal(true);
                }}
                onDelete={() => deleteProblem(problem.id)}
              />
            ))}
          </AnimatePresence>
        </div>

        {filteredProblems.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 rounded-3xl bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-dashed border-emerald-200"
          >
            <CheckCircle2 className="w-20 h-20 mx-auto text-emerald-400 mb-4" />
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No Problems Found</h3>
            <p className="text-gray-500">Start reporting issues to help improve campus life!</p>
          </motion.div>
        )}
      </section>

      {/* Senior Wisdom Section - Enhanced */}
      <section id="wisdom" className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div>
            <h2 className="font-heading text-4xl font-bold text-gray-900 flex items-center gap-3">
              <Brain className="w-10 h-10 text-primary" />
              <span className="bg-gradient-to-r from-ivy-green to-emerald-600 bg-clip-text text-transparent">
                Senior Wisdom
              </span>
              <Star className="w-7 h-7 text-saffron animate-spin" style={{ animationDuration: "3s" }} />
            </h2>
            <p className="text-gray-600 mt-2">
              Learn from those who walked before you
            </p>
          </div>
          <button
            onClick={() => {
              if (!currentStudent) {
                onLogin();
                return;
              }
              setEditingItem(null);
              setShowWisdomModal(true);
            }}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-ivy-green to-emerald-600 px-8 py-4 font-bold text-white shadow-lg transition-all hover:shadow-2xl hover:scale-105"
          >
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
            <div className="relative flex items-center gap-2">
              <Plus className="w-5 h-5" />
              <span>Share Wisdom</span>
            </div>
          </button>
        </motion.div>

        {/* Wisdom Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filteredWisdom.map((tip, index) => (
              <WisdomCard
                key={tip.id}
                wisdom={tip}
                index={index}
                currentStudent={currentStudent}
                onUpvote={() => upvoteWisdom(tip.id)}
                onEdit={() => {
                  setEditingItem(tip);
                  setShowWisdomModal(true);
                }}
                onDelete={() => deleteWisdom(tip.id)}
              />
            ))}
          </AnimatePresence>
        </div>

        {filteredWisdom.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 rounded-3xl bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-dashed border-purple-200"
          >
            <Brain className="w-20 h-20 mx-auto text-purple-300 mb-4" />
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No Wisdom Yet</h3>
            <p className="text-gray-500">Be the first to share your campus wisdom!</p>
          </motion.div>
        )}
      </section>

      {/* Dynamic Leaderboard - Enhanced */}
      <section id="leaderboard" className="space-y-6">
        <DynamicLeaderboard 
          students={leaderboard}
          currentStudent={currentStudent}
          college={college}
        />
      </section>

      {/* Modals */}
      <ProblemModal
        show={showProblemModal}
        onClose={() => {
          setShowProblemModal(false);
          setEditingItem(null);
        }}
        onSubmit={(data: any) => {
          if (editingItem) {
            updateProblem(editingItem.id, data);
          } else {
            addProblem(data);
          }
          setShowProblemModal(false);
          setEditingItem(null);
        }}
        editData={editingItem}
        currentStudent={currentStudent}
      />

      <WisdomModal
        show={showWisdomModal}
        onClose={() => {
          setShowWisdomModal(false);
          setEditingItem(null);
        }}
        onSubmit={(data: any) => {
          if (editingItem) {
            updateWisdom(editingItem.id, data);
          } else {
            addWisdom(data);
          }
          setShowWisdomModal(false);
          setEditingItem(null);
        }}
        editData={editingItem}
        currentStudent={currentStudent}
      />

      <AlertModal
        show={showAlertModal}
        onClose={() => {
          setShowAlertModal(false);
          setEditingItem(null);
        }}
        onSubmit={(data: any) => {
          if (editingItem) {
            updateAlert(editingItem.id, data);
          } else {
            addAlert(data);
          }
          setShowAlertModal(false);
          setEditingItem(null);
        }}
        editData={editingItem}
      />
    </div>
  );
}

// Component: Alert Card with enhanced design
function AlertCard({ alert, index, currentStudent, onEdit, onDelete }: any) {
  const [expanded, setExpanded] = useState(false);
  
  const riskColors = {
    red: {
      gradient: "from-red-500 to-pink-600",
      bg: "bg-red-50",
      border: "border-red-200",
      text: "text-red-700",
      badge: "bg-red-500",
    },
    yellow: {
      gradient: "from-yellow-500 to-orange-500",
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      text: "text-yellow-700",
      badge: "bg-yellow-500",
    },
    green: {
      gradient: "from-green-500 to-emerald-500",
      bg: "bg-green-50",
      border: "border-green-200",
      text: "text-green-700",
      badge: "bg-green-500",
    },
  };

  const colors = riskColors[alert.riskLevel as keyof typeof riskColors];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay: index * 0.1 }}
      className={`group relative overflow-hidden rounded-3xl border-2 ${colors.border} ${colors.bg} p-6 shadow-lg hover:shadow-2xl transition-all`}
    >
      {/* Animated gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} opacity-5 group-hover:opacity-10 transition-opacity`} />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-4 h-4 rounded-full ${colors.badge} ${alert.riskLevel === 'red' ? 'animate-pulse' : ''}`} />
            <span className={`px-4 py-1.5 rounded-full text-xs font-bold text-white ${colors.badge} shadow-lg`}>
              {alert.riskLevel === "red" ? "🚨 HIGH RISK" : alert.riskLevel === "yellow" ? "⚠️ MODERATE" : "✅ LOW RISK"}
            </span>
          </div>
          {currentStudent && (
            <div className="flex gap-2">
              <button
                onClick={onEdit}
                className="p-2 rounded-xl bg-white/70 hover:bg-white shadow-sm hover:shadow-md transition-all"
              >
                <Edit2 className="w-4 h-4 text-gray-600" />
              </button>
              <button
                onClick={onDelete}
                className="p-2 rounded-xl bg-white/70 hover:bg-red-100 shadow-sm hover:shadow-md transition-all"
              >
                <Trash2 className="w-4 h-4 text-red-600" />
              </button>
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className={`font-heading text-xl font-bold mb-3 ${colors.text}`}>
          {alert.title}
        </h3>
        <p className="text-gray-700 text-sm leading-relaxed mb-4">
          {alert.description}
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-white/80 rounded-2xl p-3 text-center backdrop-blur">
            <Clock className="w-5 h-5 mx-auto text-gray-400 mb-1" />
            <p className="text-2xl font-black text-gray-900">{alert.daysUntil}</p>
            <p className="text-xs text-gray-500 font-medium">Days Left</p>
          </div>
          <div className="bg-white/80 rounded-2xl p-3 text-center backdrop-blur">
            <TrendingUp className="w-5 h-5 mx-auto text-gray-400 mb-1" />
            <p className="text-2xl font-black text-gray-900">{alert.historicalOccurrences}</p>
            <p className="text-xs text-gray-500 font-medium">Past Events</p>
          </div>
          <div className="bg-white/80 rounded-2xl p-3 text-center backdrop-blur">
            <BarChart3 className="w-5 h-5 mx-auto text-gray-400 mb-1" />
            <p className="text-2xl font-black text-gray-900">{alert.confidence}%</p>
            <p className="text-xs text-gray-500 font-medium">Confidence</p>
          </div>
        </div>

        {/* Preventive Actions - Expandable */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between bg-white/80 rounded-2xl p-4 hover:bg-white transition-all"
        >
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary" />
            <span className="font-bold text-gray-900">Preventive Actions</span>
          </div>
          {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-3 bg-white/80 rounded-2xl p-4">
                <ul className="space-y-2">
                  {alert.preventiveActions.map((action: string, i: number) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-start gap-2 text-sm text-gray-700"
                    >
                      <CheckCircle2 className="w-4 h-4 text-ivy-green mt-0.5 shrink-0" />
                      <span>{action}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// Component: Problem Card with enhanced design
function ProblemCard({ problem, index, currentStudent, onSupport, onEdit, onDelete }: any) {
  const severityConfig = {
    critical: { color: "from-red-600 to-red-700", bg: "bg-red-50", icon: "🔴" },
    high: { color: "from-orange-500 to-orange-600", bg: "bg-orange-50", icon: "🟠" },
    medium: { color: "from-yellow-500 to-yellow-600", bg: "bg-yellow-50", icon: "🟡" },
    low: { color: "from-green-500 to-green-600", bg: "bg-green-50", icon: "🟢" },
  };

  const statusConfig = {
    reported: { color: "from-blue-500 to-blue-600", label: "📝 Reported" },
    analyzing: { color: "from-purple-500 to-purple-600", label: "🔍 Analyzing" },
    solving: { color: "from-indigo-500 to-indigo-600", label: "🔧 Solving" },
    resolved: { color: "from-green-500 to-green-600", label: "✅ Resolved" },
    prevented: { color: "from-teal-500 to-teal-600", label: "🛡️ Prevented" },
  };

  const severity = severityConfig[problem.severity as keyof typeof severityConfig];
  const status = statusConfig[problem.status as keyof typeof statusConfig];
  const isSupported = currentStudent && problem.supporters.includes(currentStudent.id);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay: index * 0.05 }}
      className={`group relative overflow-hidden rounded-3xl border-2 border-gray-200 bg-white p-6 shadow-lg hover:shadow-2xl transition-all ${severity.bg}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex flex-wrap gap-2">
          <span className={`px-4 py-1.5 rounded-full text-xs font-bold text-white bg-gradient-to-r ${severity.color} shadow-md`}>
            {severity.icon} {problem.severity.toUpperCase()}
          </span>
          <span className={`px-4 py-1.5 rounded-full text-xs font-bold text-white bg-gradient-to-r ${status.color} shadow-md`}>
            {status.label}
          </span>
        </div>
        {currentStudent && currentStudent.email === problem.reportedBy && (
          <div className="flex gap-2">
            <button
              onClick={onEdit}
              className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-all"
            >
              <Edit2 className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={onDelete}
              className="p-2 rounded-xl bg-red-100 hover:bg-red-200 transition-all"
            >
              <Trash2 className="w-4 h-4 text-red-600" />
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <h4 className="font-heading text-lg font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors">
        {problem.title}
      </h4>
      <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-3">
        {problem.description}
      </p>

      {/* Category */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-600 font-medium">
          📂 {problem.category}
        </span>
        {problem.subcategory && (
          <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-600 font-medium">
            {problem.subcategory}
          </span>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t-2 border-gray-100">
        <button
          onClick={onSupport}
          className={`group/btn flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all ${
            isSupported
              ? "bg-gradient-to-r from-pink-500 to-red-500 text-white shadow-lg"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          <Heart className={`w-5 h-5 ${isSupported ? "fill-current animate-pulse" : ""}`} />
          <span className="text-lg font-bold">{problem.supportCount}</span>
          <span className="text-sm">Support</span>
        </button>
        <div className="text-right">
          <p className="text-xs text-gray-500">Reported by</p>
          <p className="text-sm font-semibold text-gray-700">{problem.reportedBy}</p>
        </div>
      </div>
    </motion.div>
  );
}

// Component: Wisdom Card with enhanced design
function WisdomCard({ wisdom, index, currentStudent, onUpvote, onEdit, onDelete }: any) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, rotateY: -90 }}
      animate={{ opacity: 1, rotateY: 0 }}
      exit={{ opacity: 0, rotateY: 90 }}
      transition={{ delay: index * 0.05, duration: 0.5 }}
      className="group relative overflow-hidden rounded-3xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 p-6 shadow-lg hover:shadow-2xl transition-all"
    >
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform" />
      <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-yellow-400/20 to-orange-400/20 rounded-full -ml-10 -mb-10" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <span className="px-4 py-1.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 shadow-lg">
            🎓 Batch {wisdom.batch}
          </span>
          {currentStudent && currentStudent.name === wisdom.contributedBy && (
            <div className="flex gap-2">
              <button
                onClick={onEdit}
                className="p-2 rounded-xl bg-white/70 hover:bg-white shadow-sm transition-all"
              >
                <Edit2 className="w-4 h-4 text-gray-600" />
              </button>
              <button
                onClick={onDelete}
                className="p-2 rounded-xl bg-white/70 hover:bg-red-100 shadow-sm transition-all"
              >
                <Trash2 className="w-4 h-4 text-red-600" />
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        <p className="text-gray-800 font-medium leading-relaxed mb-4 min-h-[80px]">
          "{wisdom.content}"
        </p>

        {/* Category */}
        <div className="mb-4">
          <span className="text-xs px-3 py-1 rounded-full bg-white/60 text-emerald-700 font-semibold">
            {wisdom.category}
          </span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t-2 border-emerald-100">
          <button
            onClick={onUpvote}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/70 hover:bg-gradient-to-r hover:from-pink-500 hover:to-red-500 hover:text-white font-semibold transition-all group/btn"
          >
            <ThumbsUp className="w-4 h-4 group-hover/btn:animate-bounce" />
            <span className="text-lg font-bold">{wisdom.upvotes}</span>
          </button>
          <div className="text-right">
            <p className="text-xs text-gray-500">By</p>
            <p className="text-sm font-bold text-emerald-700">{wisdom.contributedBy}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Component: Dynamic Leaderboard
function DynamicLeaderboard({ students, currentStudent, college }: any) {
  const [timeFilter, setTimeFilter] = useState<"all" | "week" | "month">("all");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-3xl border-4 border-saffron/30 bg-gradient-to-br from-saffron/5 via-white to-ivy-green/5 p-8 shadow-2xl"
    >
      {/* Animated background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-saffron to-orange-400 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-ivy-green to-emerald-400 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="font-heading text-4xl font-bold flex items-center gap-3 mb-2">
              <Trophy className="w-10 h-10 text-saffron" />
              <span className="bg-gradient-to-r from-saffron via-orange-500 to-red-500 bg-clip-text text-transparent">
                Campus Legends
              </span>
              <Sparkles className="w-8 h-8 text-saffron animate-spin" style={{ animationDuration: "3s" }} />
            </h3>
            <p className="text-gray-600 ml-14">Top contributors making campus better</p>
          </div>
          <div className="flex gap-2">
            {["all", "week", "month"].map((filter) => (
              <button
                key={filter}
                onClick={() => setTimeFilter(filter as any)}
                className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                  timeFilter === filter
                    ? "bg-gradient-to-r from-saffron to-orange-500 text-white shadow-lg scale-105"
                    : "bg-white/70 text-gray-600 hover:bg-white"
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Leaderboard */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {students.map((student: Student, index: number) => {
              const isCurrentUser = currentStudent && student.id === currentStudent.id;
              const medals = ["🥇", "🥈", "🥉"];
              const gradients = [
                "from-yellow-400 via-yellow-500 to-yellow-600",
                "from-gray-300 via-gray-400 to-gray-500",
                "from-orange-400 via-orange-500 to-orange-600",
              ];

              return (
                <motion.div
                  key={student.id}
                  layout
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  transition={{ delay: index * 0.1 }}
                  className={`group relative overflow-hidden rounded-2xl p-6 transition-all ${
                    index < 3
                      ? `bg-gradient-to-r ${gradients[index]} shadow-xl hover:shadow-2xl`
                      : isCurrentUser
                      ? "bg-gradient-to-r from-primary/90 to-university-blue/90 shadow-lg"
                      : "bg-white/80 shadow-md hover:shadow-lg"
                  } ${isCurrentUser ? "ring-4 ring-saffron" : ""}`}
                >
                  {/* Rank Badge */}
                  <div className="absolute -top-3 -left-3">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-lg ${
                      index < 3 ? "bg-white" : "bg-gray-100"
                    }`}>
                      {index < 3 ? medals[index] : index + 1}
                    </div>
                  </div>

                  <div className="flex items-center gap-6 ml-12">
                    {/* Avatar */}
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold shadow-lg ${
                      index < 3 
                        ? "bg-white text-transparent bg-clip-text bg-gradient-to-br from-saffron to-orange-500"
                        : isCurrentUser
                        ? "bg-saffron text-white"
                        : "bg-gradient-to-br from-gray-200 to-gray-300 text-gray-700"
                    }`}>
                      {student.name.charAt(0)}
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className={`font-heading text-xl font-bold ${
                          index < 3 || isCurrentUser ? "text-white" : "text-gray-900"
                        }`}>
                          {student.name}
                          {isCurrentUser && <span className="ml-2 text-sm">(You! 🎉)</span>}
                        </h4>
                        {student.achievements && student.achievements.length > 0 && (
                          <div className="flex gap-1">
                            {student.achievements.slice(0, 3).map((_, i) => (
                              <Award key={i} className={`w-4 h-4 ${index < 3 || isCurrentUser ? "text-white" : "text-saffron"}`} />
                            ))}
                          </div>
                        )}
                      </div>
                      <p className={`text-sm ${index < 3 || isCurrentUser ? "text-white/90" : "text-gray-600"}`}>
                        {student.program} • Batch {student.batch} • {student.contributionsCount} contributions
                      </p>
                    </div>

                    {/* Points */}
                    <div className="text-right">
                      <div className={`text-4xl font-black ${
                        index < 3 || isCurrentUser ? "text-white" : "text-transparent bg-clip-text bg-gradient-to-r from-saffron to-orange-500"
                      }`}>
                        {student.points.toLocaleString()}
                      </div>
                      <p className={`text-sm font-semibold ${index < 3 || isCurrentUser ? "text-white/80" : "text-gray-500"}`}>
                        points
                      </p>
                    </div>
                  </div>

                  {/* Hover effect */}
                  {index >= 3 && !isCurrentUser && (
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {students.length === 0 && (
          <div className="text-center py-16">
            <Trophy className="w-20 h-20 mx-auto text-gray-300 mb-4" />
            <h4 className="text-2xl font-bold text-gray-400 mb-2">No rankings yet</h4>
            <p className="text-gray-500">Start contributing to appear on the leaderboard!</p>
          </div>
        )}

        {/* Current user highlight if not in top 10 */}
        {currentStudent && !students.find((s: Student) => s.id === currentStudent.id) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-6 rounded-2xl bg-gradient-to-r from-primary to-university-blue text-white shadow-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90 mb-1">Your Ranking</p>
                <h4 className="text-2xl font-bold"># {students.length + 1}+</h4>
              </div>
              <div className="text-right">
                <p className="text-3xl font-black">{currentStudent.points}</p>
                <p className="text-sm opacity-90">Keep contributing!</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

// Modal Components
function ProblemModal({ show, onClose, onSubmit, editData, currentStudent }: any) {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    subcategory: "",
    description: "",
    severity: "medium" as Problem["severity"],
    status: "reported" as Problem["status"],
    reportedBy: "",
    sentiment: "neutral" as Problem["sentiment"],
  });

  useEffect(() => {
    if (editData) {
      setFormData(editData);
    } else if (currentStudent) {
      setFormData(prev => ({ ...prev, reportedBy: currentStudent.email }));
    }
  }, [editData, currentStudent]);

  if (!show) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      title: "",
      category: "",
      subcategory: "",
      description: "",
      severity: "medium",
      status: "reported",
      reportedBy: currentStudent?.email || "",
      sentiment: "neutral",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-gradient-to-r from-primary to-university-blue p-6 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-3xl font-bold text-white flex items-center gap-3">
              <MessageSquare className="w-8 h-8" />
              {editData ? "Edit Problem" : "Report New Problem"}
            </h3>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Problem Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Brief description of the problem"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/20 outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Category *</label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/20 outline-none transition-all bg-white"
              >
                <option value="">Select category</option>
                <option value="Academic & Timetable">📚 Academic & Timetable</option>
                <option value="Campus Events & Fests">🎪 Campus Events & Fests</option>
                <option value="Hostel & Accommodation">🏠 Hostel & Accommodation</option>
                <option value="Infrastructure & Logistics">🏗️ Infrastructure & Logistics</option>
                <option value="Administration & Policies">📋 Administration & Policies</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Severity *</label>
              <select
                required
                value={formData.severity}
                onChange={(e) => setFormData({ ...formData, severity: e.target.value as Problem["severity"] })}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/20 outline-none transition-all bg-white"
              >
                <option value="low">🟢 Low</option>
                <option value="medium">🟡 Medium</option>
                <option value="high">🟠 High</option>
                <option value="critical">🔴 Critical</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Subcategory</label>
            <input
              type="text"
              value={formData.subcategory}
              onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
              placeholder="e.g., WiFi issues, Food quality, etc."
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/20 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Detailed Description *</label>
            <textarea
              required
              rows={5}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Provide as much detail as possible..."
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/20 outline-none transition-all resize-none"
            />
          </div>

          {editData && (
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as Problem["status"] })}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/20 outline-none transition-all bg-white"
              >
                <option value="reported">📝 Reported</option>
                <option value="analyzing">🔍 Analyzing</option>
                <option value="solving">🔧 Solving</option>
                <option value="resolved">✅ Resolved</option>
                <option value="prevented">🛡️ Prevented</option>
              </select>
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border-2 border-gray-300 font-bold text-gray-700 hover:bg-gray-100 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-primary to-university-blue text-white font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
            >
              <div className="flex items-center justify-center gap-2">
                <Save className="w-5 h-5" />
                {editData ? "Update Problem" : "Submit Problem"}
              </div>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

function WisdomModal({ show, onClose, onSubmit, editData, currentStudent }: any) {
  const [formData, setFormData] = useState({
    content: "",
    category: "",
    batch: "",
    department: "",
    contributedBy: "",
  });

  useEffect(() => {
    if (editData) {
      setFormData(editData);
    } else if (currentStudent) {
      setFormData(prev => ({
        ...prev,
        contributedBy: currentStudent.name,
        batch: currentStudent.batch,
        department: currentStudent.program,
      }));
    }
  }, [editData, currentStudent]);

  if (!show) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      content: "",
      category: "",
      batch: currentStudent?.batch || "",
      department: currentStudent?.program || "",
      contributedBy: currentStudent?.name || "",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-gradient-to-r from-ivy-green to-emerald-600 p-6 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-3xl font-bold text-white flex items-center gap-3">
              <Brain className="w-8 h-8" />
              {editData ? "Edit Wisdom" : "Share Your Wisdom"}
            </h3>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Your Wisdom *</label>
            <textarea
              required
              rows={5}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Share advice that would have helped you when you started..."
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 outline-none transition-all resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Category *</label>
            <select
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 outline-none transition-all bg-white"
            >
              <option value="">Select category</option>
              <option value="Course selection advice">📚 Course Selection</option>
              <option value="Campus survival hacks">🎯 Campus Survival</option>
              <option value="Internship guidance">💼 Internship Guidance</option>
              <option value="Exam preparation tips">📝 Exam Preparation</option>
              <option value="College life tips">🎓 College Life</option>
              <option value="Career advice">🚀 Career Advice</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Your Batch</label>
              <input
                type="text"
                value={formData.batch}
                onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                placeholder="e.g., 2024"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Department</label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                placeholder="e.g., CSE"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border-2 border-gray-300 font-bold text-gray-700 hover:bg-gray-100 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-ivy-green to-emerald-600 text-white font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
            >
              <div className="flex items-center justify-center gap-2">
                <Save className="w-5 h-5" />
                {editData ? "Update Wisdom" : "Share Wisdom"}
              </div>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

function AlertModal({ show, onClose, onSubmit, editData }: any) {
  const [formData, setFormData] = useState({
    title: "",
    riskLevel: "yellow" as Alert["riskLevel"],
    predictedDate: "",
    daysUntil: 0,
    confidence: 75,
    historicalOccurrences: 0,
    description: "",
    preventiveActions: [""],
  });

  useEffect(() => {
    if (editData) {
      setFormData(editData);
    }
  }, [editData]);

  useEffect(() => {
    if (formData.predictedDate) {
      const days = Math.ceil((new Date(formData.predictedDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      setFormData(prev => ({ ...prev, daysUntil: days }));
    }
  }, [formData.predictedDate]);

  if (!show) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      preventiveActions: formData.preventiveActions.filter(a => a.trim() !== ""),
    });
    setFormData({
      title: "",
      riskLevel: "yellow",
      predictedDate: "",
      daysUntil: 0,
      confidence: 75,
      historicalOccurrences: 0,
      description: "",
      preventiveActions: [""],
    });
  };

  const addAction = () => {
    setFormData({ ...formData, preventiveActions: [...formData.preventiveActions, ""] });
  };

  const updateAction = (index: number, value: string) => {
    const updated = [...formData.preventiveActions];
    updated[index] = value;
    setFormData({ ...formData, preventiveActions: updated });
  };

  const removeAction = (index: number) => {
    setFormData({
      ...formData,
      preventiveActions: formData.preventiveActions.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 p-6 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-3xl font-bold text-white flex items-center gap-3">
              <Shield className="w-8 h-8" />
              {editData ? "Edit Alert" : "Create Predictive Alert"}
            </h3>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Alert Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Library overcrowding predicted"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-500 focus:ring-4 focus:ring-red-500/20 outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Risk Level *</label>
              <select
                required
                value={formData.riskLevel}
                onChange={(e) => setFormData({ ...formData, riskLevel: e.target.value as Alert["riskLevel"] })}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-500 focus:ring-4 focus:ring-red-500/20 outline-none transition-all bg-white"
              >
                <option value="green">✅ Low Risk</option>
                <option value="yellow">⚠️ Moderate</option>
                <option value="red">🚨 High Risk</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Predicted Date *</label>
              <input
                type="date"
                required
                value={formData.predictedDate}
                onChange={(e) => setFormData({ ...formData, predictedDate: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-500 focus:ring-4 focus:ring-red-500/20 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Days Until</label>
              <input
                type="number"
                value={formData.daysUntil}
                readOnly
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Confidence (%) *</label>
              <input
                type="number"
                required
                min="0"
                max="100"
                value={formData.confidence}
                onChange={(e) => setFormData({ ...formData, confidence: parseInt(e.target.value) })}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-500 focus:ring-4 focus:ring-red-500/20 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Historical Occurrences *</label>
              <input
                type="number"
                required
                min="0"
                value={formData.historicalOccurrences}
                onChange={(e) => setFormData({ ...formData, historicalOccurrences: parseInt(e.target.value) })}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-500 focus:ring-4 focus:ring-red-500/20 outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Description *</label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detailed description of the predicted issue..."
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-500 focus:ring-4 focus:ring-red-500/20 outline-none transition-all resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Preventive Actions</label>
            <div className="space-y-3">
              {formData.preventiveActions.map((action, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={action}
                    onChange={(e) => updateAction(index, e.target.value)}
                    placeholder={`Action ${index + 1}`}
                    className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-500 focus:ring-4 focus:ring-red-500/20 outline-none transition-all"
                  />
                  {formData.preventiveActions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeAction(index)}
                      className="p-3 rounded-xl bg-red-100 hover:bg-red-200 text-red-600 transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addAction}
                className="w-full py-3 rounded-xl border-2 border-dashed border-gray-300 text-gray-600 hover:border-red-500 hover:text-red-500 font-semibold transition-all"
              >
                + Add Action
              </button>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border-2 border-gray-300 font-bold text-gray-700 hover:bg-gray-100 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 text-white font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
            >
              <div className="flex items-center justify-center gap-2">
                <Save className="w-5 h-5" />
                {editData ? "Update Alert" : "Create Alert"}
              </div>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
