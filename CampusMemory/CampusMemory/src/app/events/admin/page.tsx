"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Calendar,
  Users,
  UserCheck,
  FileText,
  BarChart3,
  TrendingUp,
  Award,
  Bell,
  Settings,
  LogOut,
  Plus,
  Edit,
  Trash2,
  Eye,
  Check,
  X,
  Clock,
  Filter,
  Search,
  Download,
  Upload,
  Mail,
  Phone,
  MapPin,
  DollarSign,
  Star,
  Zap,
  Target,
  Activity,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  ChevronDown,
  ChevronUp,
  Menu,
  Home,
  Building2,
  GraduationCap,
  Sparkles,
  Crown,
  Shield,
  Flame,
  Rocket,
  RefreshCw,
  Send,
  AlertTriangle,
  BookOpen,
  Code,
  Palette,
  Music,
  Trophy,
  Dumbbell,
  Lightbulb,
  Users2,
  ExternalLink,
  Copy,
  Share2,
  Maximize2,
  Minimize2,
} from "lucide-react";

// Types
interface Event {
  id: string;
  title: string;
  description: string;
  category: string;
  department: string;
  date: string;
  time: string;
  venue: string;
  maxParticipants: number;
  maxTeamSize: number;
  registrationDeadline: string;
  posterUrl?: string;
  coordinators: string[];
  budget?: number;
  fee?: number;
  status: "draft" | "active" | "completed" | "cancelled";
  registrations: Registration[];
  attendance: AttendanceRecord[];
  createdAt: string;
  createdBy: string;
}

interface Registration {
  id: string;
  eventId: string;
  studentName: string;
  studentEmail: string;
  studentRoll: string;
  studentDepartment: string;
  studentYear: string;
  registeredAt: string;
  status: "pending" | "approved" | "rejected";
  teamMembers?: TeamMember[];
  isTeamLead?: boolean;
  odEventName?: string;
  odSubjects?: string[];
  sameClassStudents?: string[];
}

interface TeamMember {
  name: string;
  email: string;
  rollNumber: string;
  department: string;
  year: string;
}

interface AttendanceRecord {
  id: string;
  eventId: string;
  studentRoll: string;
  studentName: string;
  markedAt: string;
  markedBy: string;
  status: "present" | "absent" | "late";
}

interface AdminUser {
  name: string;
  email: string;
  role: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "events" | "registrations" | "attendance" | "od-requests" | "analytics">("overview");
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showEventModal, setShowEventModal] = useState(false);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  // Real-time stats
  const [stats, setStats] = useState({
    totalEvents: 0,
    activeEvents: 0,
    totalRegistrations: 0,
    pendingApprovals: 0,
    totalAttendance: 0,
    totalRevenue: 0,
    avgAttendanceRate: 0,
    completedEvents: 0,
  });

  useEffect(() => {
    // Check authentication
    const userData = localStorage.getItem("eventsCurrentUser");
    if (!userData) {
      router.push("/events/auth");
      return;
    }

    const user = JSON.parse(userData);
    if (user.role !== "admin") {
      alert("Access denied. Admin access required.");
      router.push("/events/auth");
      return;
    }

    setCurrentUser(user);
    loadEvents();
    setIsLoading(false);

    // Set up real-time refresh every 5 seconds
    const interval = setInterval(() => {
      loadEvents();
      setRefreshKey(prev => prev + 1);
    }, 5000);

    return () => clearInterval(interval);
  }, [router]);

  const loadEvents = () => {
    const storedEvents = localStorage.getItem("facultyEvents");
    if (storedEvents) {
      const parsedEvents = JSON.parse(storedEvents);
      setEvents(parsedEvents);
      calculateStats(parsedEvents);
    }
  };

  const calculateStats = (eventsList: Event[]) => {
    const totalEvents = eventsList.length;
    const activeEvents = eventsList.filter(e => e.status === "active").length;
    const completedEvents = eventsList.filter(e => e.status === "completed").length;
    const totalRegistrations = eventsList.reduce((sum, e) => sum + e.registrations.length, 0);
    const pendingApprovals = eventsList.reduce((sum, e) => sum + e.registrations.filter(r => r.status === "pending").length, 0);
    const totalAttendance = eventsList.reduce((sum, e) => sum + e.attendance.length, 0);
    const totalRevenue = eventsList.reduce((sum, e) => sum + (e.fee || 0) * e.registrations.filter(r => r.status === "approved").length, 0);
    const avgAttendanceRate = eventsList.length > 0
      ? Math.round((eventsList.reduce((sum, e) => {
          const approved = e.registrations.filter(r => r.status === "approved").length;
          return sum + (approved > 0 ? (e.attendance.length / approved) * 100 : 0);
        }, 0) / eventsList.length))
      : 0;

    setStats({
      totalEvents,
      activeEvents,
      totalRegistrations,
      pendingApprovals,
      totalAttendance,
      totalRevenue,
      avgAttendanceRate,
      completedEvents,
    });
  };

  const handleApproveRegistration = (eventId: string, registrationId: string) => {
    const updatedEvents = events.map(event => {
      if (event.id === eventId) {
        return {
          ...event,
          registrations: event.registrations.map(reg =>
            reg.id === registrationId ? { ...reg, status: "approved" as const } : reg
          ),
        };
      }
      return event;
    });
    
    setEvents(updatedEvents);
    localStorage.setItem("facultyEvents", JSON.stringify(updatedEvents));
    calculateStats(updatedEvents);
  };

  const handleRejectRegistration = (eventId: string, registrationId: string) => {
    const updatedEvents = events.map(event => {
      if (event.id === eventId) {
        return {
          ...event,
          registrations: event.registrations.map(reg =>
            reg.id === registrationId ? { ...reg, status: "rejected" as const } : reg
          ),
        };
      }
      return event;
    });
    
    setEvents(updatedEvents);
    localStorage.setItem("facultyEvents", JSON.stringify(updatedEvents));
    calculateStats(updatedEvents);
  };

  const handleDeleteEvent = (eventId: string) => {
    if (!confirm("Are you sure you want to delete this event? This action cannot be undone.")) return;
    
    const updatedEvents = events.filter(e => e.id !== eventId);
    setEvents(updatedEvents);
    localStorage.setItem("facultyEvents", JSON.stringify(updatedEvents));
    calculateStats(updatedEvents);
    alert("✅ Event deleted successfully!");
  };

  const handleUpdateEventStatus = (eventId: string, newStatus: Event["status"]) => {
    const updatedEvents = events.map(event =>
      event.id === eventId ? { ...event, status: newStatus } : event
    );
    
    setEvents(updatedEvents);
    localStorage.setItem("facultyEvents", JSON.stringify(updatedEvents));
    calculateStats(updatedEvents);
  };

  const handleLogout = () => {
    localStorage.removeItem("eventsCurrentUser");
    router.push("/events/auth");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500/20 text-green-300 border-green-500/30";
      case "completed": return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "cancelled": return "bg-red-500/20 text-red-300 border-red-500/30";
      case "draft": return "bg-gray-500/20 text-gray-300 border-gray-500/30";
      default: return "bg-purple-500/20 text-purple-300 border-purple-500/30";
    }
  };

  const categoryIcons: Record<string, any> = {
    technical: Code,
    cultural: Palette,
    sports: Dumbbell,
    workshop: Lightbulb,
    seminar: BookOpen,
    competition: Trophy,
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || event.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const allRegistrations = events.flatMap(event =>
    event.registrations.map(reg => ({ ...reg, eventTitle: event.title, eventId: event.id }))
  );

  const pendingRegistrations = allRegistrations.filter(r => r.status === "pending");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-white text-xl font-semibold">Loading Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      {/* Header */}
      <header className="relative z-10 bg-black/20 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-full px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition"
              >
                <Menu className="w-6 h-6 text-white" />
              </motion.button>

              <div className="flex items-center gap-3">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg"
                >
                  <Crown className="w-8 h-8 text-white" />
                </motion.div>
                <div>
                  <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                    Admin Control Center
                    <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
                  </h1>
                  <p className="text-purple-300 text-sm">Complete Event Management System</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <motion.div
                key={refreshKey}
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-xl flex items-center gap-2"
              >
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-green-300 text-sm font-semibold">Live</span>
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => loadEvents()}
                className="p-3 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-xl transition"
                title="Refresh Data"
              >
                <RefreshCw className="w-5 h-5 text-blue-300" />
              </motion.button>

              <div className="px-4 py-2 bg-white/10 rounded-xl">
                <p className="text-white font-semibold">{currentUser?.name}</p>
                <p className="text-purple-300 text-xs">Administrator</p>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="p-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-xl transition"
              >
                <LogOut className="w-5 h-5 text-red-300" />
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex relative z-10">
        {/* Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
              className="w-80 bg-black/30 backdrop-blur-xl border-r border-white/10 min-h-screen p-6"
            >
              <nav className="space-y-2">
                {[
                  { id: "overview", label: "Overview", icon: LayoutDashboard, color: "from-purple-500 to-pink-500" },
                  { id: "events", label: "Events Management", icon: Calendar, color: "from-blue-500 to-cyan-500" },
                  { id: "registrations", label: "Registrations", icon: Users, color: "from-green-500 to-emerald-500", badge: stats.pendingApprovals },
                  { id: "attendance", label: "Attendance", icon: UserCheck, color: "from-orange-500 to-amber-500" },
                  { id: "od-requests", label: "OD Requests", icon: FileText, color: "from-pink-500 to-rose-500" },
                  { id: "analytics", label: "Analytics & Reports", icon: BarChart3, color: "from-indigo-500 to-purple-500" },
                ].map((item) => (
                  <motion.button
                    key={item.id}
                    whileHover={{ x: 10, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab(item.id as any)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      activeTab === item.id
                        ? `bg-gradient-to-r ${item.color} text-white shadow-lg`
                        : "bg-white/5 text-purple-300 hover:bg-white/10"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-semibold flex-1 text-left">{item.label}</span>
                    {item.badge && item.badge > 0 && (
                      <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </motion.button>
                ))}
              </nav>

              <div className="mt-8 p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl">
                <h3 className="text-white font-bold mb-2 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-purple-400" />
                  Quick Stats
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-purple-200">
                    <span>Total Events:</span>
                    <span className="font-bold text-white">{stats.totalEvents}</span>
                  </div>
                  <div className="flex justify-between text-purple-200">
                    <span>Active Events:</span>
                    <span className="font-bold text-green-400">{stats.activeEvents}</span>
                  </div>
                  <div className="flex justify-between text-purple-200">
                    <span>Pending Approvals:</span>
                    <span className="font-bold text-yellow-400">{stats.pendingApprovals}</span>
                  </div>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <AnimatePresence mode="wait">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { label: "Total Events", value: stats.totalEvents, icon: Calendar, color: "from-blue-500 to-cyan-500", change: "+12%" },
                    { label: "Total Registrations", value: stats.totalRegistrations, icon: Users, color: "from-green-500 to-emerald-500", change: "+8%" },
                    { label: "Pending Approvals", value: stats.pendingApprovals, icon: Clock, color: "from-yellow-500 to-orange-500", change: "-3%" },
                    { label: "Attendance Rate", value: `${stats.avgAttendanceRate}%`, icon: TrendingUp, color: "from-purple-500 to-pink-500", change: "+5%" },
                  ].map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -5, scale: 1.02 }}
                      className="relative group"
                    >
                      <div className={`absolute -inset-0.5 bg-gradient-to-r ${stat.color} rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-500`} />
                      <div className="relative bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                        <div className="flex items-start justify-between mb-4">
                          <div className={`p-3 bg-gradient-to-r ${stat.color} rounded-xl shadow-lg`}>
                            <stat.icon className="w-6 h-6 text-white" />
                          </div>
                          <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                            stat.change.startsWith('+') ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                          }`}>
                            {stat.change}
                          </span>
                        </div>
                        <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                        <p className="text-purple-300 text-sm">{stat.label}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Pending Registrations */}
                  <div className="bg-black/30 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <AlertCircle className="w-6 h-6 text-yellow-400" />
                      Pending Approvals ({pendingRegistrations.length})
                    </h3>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {pendingRegistrations.slice(0, 10).map((reg, index) => (
                        <motion.div
                          key={reg.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition"
                        >
                          <div className="flex-1">
                            <p className="text-white font-semibold">{reg.studentName}</p>
                            <p className="text-purple-300 text-sm">{reg.eventTitle}</p>
                            <p className="text-purple-400 text-xs">{reg.studentRoll} • {reg.studentDepartment}</p>
                          </div>
                          <div className="flex gap-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleApproveRegistration(reg.eventId, reg.id)}
                              className="p-2 bg-green-500/20 hover:bg-green-500/30 rounded-lg transition"
                              title="Approve"
                            >
                              <Check className="w-4 h-4 text-green-300" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleRejectRegistration(reg.eventId, reg.id)}
                              className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition"
                              title="Reject"
                            >
                              <X className="w-4 h-4 text-red-300" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => {
                                setSelectedRegistration(reg);
                                setShowDetailsModal(true);
                              }}
                              className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4 text-blue-300" />
                            </motion.button>
                          </div>
                        </motion.div>
                      ))}
                      {pendingRegistrations.length === 0 && (
                        <div className="text-center py-8">
                          <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-2" />
                          <p className="text-purple-300">All caught up! No pending approvals.</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Active Events */}
                  <div className="bg-black/30 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <Flame className="w-6 h-6 text-orange-400" />
                      Active Events ({stats.activeEvents})
                    </h3>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {events.filter(e => e.status === "active").map((event, index) => {
                        const CategoryIcon = categoryIcons[event.category.toLowerCase()] || Calendar;
                        return (
                          <motion.div
                            key={event.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition"
                          >
                            <div className="flex items-start gap-3">
                              <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                                <CategoryIcon className="w-5 h-5 text-white" />
                              </div>
                              <div className="flex-1">
                                <p className="text-white font-semibold">{event.title}</p>
                                <p className="text-purple-300 text-sm">{new Date(event.date).toLocaleDateString()} • {event.venue}</p>
                                <div className="flex items-center gap-4 mt-2 text-xs">
                                  <span className="text-green-300">
                                    {event.registrations.filter(r => r.status === "approved").length}/{event.maxParticipants} registered
                                  </span>
                                  <span className="text-blue-300">
                                    {event.attendance.length} attended
                                  </span>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                      {stats.activeEvents === 0 && (
                        <div className="text-center py-8">
                          <Calendar className="w-12 h-12 text-purple-400 mx-auto mb-2" />
                          <p className="text-purple-300">No active events at the moment.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Events Management Tab */}
            {activeTab === "events" && (
              <motion.div
                key="events"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Toolbar */}
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                    <Calendar className="w-8 h-8 text-blue-400" />
                    Events Management
                  </h2>
                  
                  <div className="flex items-center gap-3">
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="px-4 py-2 bg-white/10 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-400 transition"
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="draft">Draft</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>

                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-300" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search events..."
                        className="pl-10 pr-4 py-2 bg-white/10 border border-white/10 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 transition"
                      />
                    </div>
                  </div>
                </div>

                {/* Events Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredEvents.map((event, index) => {
                    const CategoryIcon = categoryIcons[event.category.toLowerCase()] || Calendar;
                    const approvedCount = event.registrations.filter(r => r.status === "approved").length;
                    const fillPercentage = (approvedCount / event.maxParticipants) * 100;

                    return (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ y: -5 }}
                        className="bg-black/30 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/10 hover:border-purple-500/50 transition-all duration-300"
                      >
                        {/* Event Header */}
                        <div className="relative h-40 bg-gradient-to-br from-purple-600 to-pink-600 overflow-hidden">
                          {event.posterUrl ? (
                            <img src={event.posterUrl} alt={event.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <CategoryIcon className="w-20 h-20 text-white/30" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                          
                          {/* Status Badge */}
                          <div className="absolute top-4 left-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(event.status)}`}>
                              {event.status}
                            </span>
                          </div>

                          {/* Quick Actions */}
                          <div className="absolute top-4 right-4 flex gap-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => {
                                setSelectedEvent(event);
                                setShowEventModal(true);
                              }}
                              className="p-2 bg-black/50 hover:bg-black/70 rounded-lg transition backdrop-blur-sm"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4 text-white" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleDeleteEvent(event.id)}
                              className="p-2 bg-red-500/50 hover:bg-red-500/70 rounded-lg transition backdrop-blur-sm"
                              title="Delete Event"
                            >
                              <Trash2 className="w-4 h-4 text-white" />
                            </motion.button>
                          </div>
                        </div>

                        {/* Event Info */}
                        <div className="p-6">
                          <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
                          <p className="text-purple-300 text-sm mb-4 line-clamp-2">{event.description}</p>

                          <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2 text-purple-200 text-sm">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(event.date).toLocaleDateString()} • {event.time}</span>
                            </div>
                            <div className="flex items-center gap-2 text-purple-200 text-sm">
                              <MapPin className="w-4 h-4" />
                              <span>{event.venue}</span>
                            </div>
                            <div className="flex items-center gap-2 text-purple-200 text-sm">
                              <Users className="w-4 h-4" />
                              <span>{approvedCount}/{event.maxParticipants} registered</span>
                            </div>
                          </div>

                          {/* Progress Bar */}
                          <div className="mb-4">
                            <div className="flex justify-between text-xs text-purple-300 mb-1">
                              <span>Capacity</span>
                              <span>{Math.round(fillPercentage)}%</span>
                            </div>
                            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${fillPercentage}%` }}
                                className={`h-full ${
                                  fillPercentage > 90
                                    ? "bg-gradient-to-r from-red-500 to-orange-500"
                                    : fillPercentage > 70
                                    ? "bg-gradient-to-r from-yellow-500 to-orange-500"
                                    : "bg-gradient-to-r from-green-500 to-emerald-500"
                                }`}
                              />
                            </div>
                          </div>

                          {/* Status Change Buttons */}
                          <div className="flex gap-2">
                            {event.status !== "active" && (
                              <button
                                onClick={() => handleUpdateEventStatus(event.id, "active")}
                                className="flex-1 px-3 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-lg text-green-300 text-sm font-semibold transition"
                              >
                                Activate
                              </button>
                            )}
                            {event.status !== "completed" && (
                              <button
                                onClick={() => handleUpdateEventStatus(event.id, "completed")}
                                className="flex-1 px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg text-blue-300 text-sm font-semibold transition"
                              >
                                Complete
                              </button>
                            )}
                            {event.status !== "cancelled" && (
                              <button
                                onClick={() => handleUpdateEventStatus(event.id, "cancelled")}
                                className="flex-1 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-red-300 text-sm font-semibold transition"
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {filteredEvents.length === 0 && (
                  <div className="text-center py-20 bg-black/20 backdrop-blur-xl rounded-2xl border border-white/10">
                    <Calendar className="w-20 h-20 text-purple-400 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-white mb-2">No Events Found</h3>
                    <p className="text-purple-300">Try adjusting your search or filters</p>
                  </div>
                )}
              </motion.div>
            )}

            {/* Registrations Tab */}
            {activeTab === "registrations" && (
              <motion.div
                key="registrations"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                  <Users className="w-8 h-8 text-green-400" />
                  Registration Management
                </h2>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {[
                    { label: "Total", value: allRegistrations.length, color: "from-blue-500 to-cyan-500" },
                    { label: "Pending", value: allRegistrations.filter(r => r.status === "pending").length, color: "from-yellow-500 to-orange-500" },
                    { label: "Approved", value: allRegistrations.filter(r => r.status === "approved").length, color: "from-green-500 to-emerald-500" },
                    { label: "Rejected", value: allRegistrations.filter(r => r.status === "rejected").length, color: "from-red-500 to-pink-500" },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-black/30 backdrop-blur-xl rounded-xl p-6 border border-white/10">
                      <p className="text-purple-300 text-sm mb-1">{stat.label}</p>
                      <p className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                        {stat.value}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Registrations Table */}
                <div className="bg-black/30 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-white/5 border-b border-white/10">
                        <tr>
                          <th className="text-left p-4 text-purple-200 font-semibold">Student</th>
                          <th className="text-left p-4 text-purple-200 font-semibold">Event</th>
                          <th className="text-left p-4 text-purple-200 font-semibold">Department</th>
                          <th className="text-left p-4 text-purple-200 font-semibold">Registered</th>
                          <th className="text-left p-4 text-purple-200 font-semibold">Status</th>
                          <th className="text-center p-4 text-purple-200 font-semibold">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allRegistrations.slice(0, 50).map((reg, index) => (
                          <motion.tr
                            key={reg.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.02 }}
                            className="border-b border-white/5 hover:bg-white/5 transition"
                          >
                            <td className="p-4">
                              <p className="text-white font-semibold">{reg.studentName}</p>
                              <p className="text-purple-300 text-sm">{reg.studentRoll}</p>
                            </td>
                            <td className="p-4 text-purple-200">{reg.eventTitle}</td>
                            <td className="p-4 text-purple-200">{reg.studentDepartment}</td>
                            <td className="p-4 text-purple-200 text-sm">
                              {new Date(reg.registeredAt).toLocaleDateString()}
                            </td>
                            <td className="p-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                                reg.status === "approved"
                                  ? "bg-green-500/20 text-green-300 border-green-500/30"
                                  : reg.status === "rejected"
                                  ? "bg-red-500/20 text-red-300 border-red-500/30"
                                  : "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
                              }`}>
                                {reg.status}
                              </span>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center justify-center gap-2">
                                {reg.status === "pending" && (
                                  <>
                                    <motion.button
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                      onClick={() => handleApproveRegistration(reg.eventId, reg.id)}
                                      className="p-2 bg-green-500/20 hover:bg-green-500/30 rounded-lg transition"
                                      title="Approve"
                                    >
                                      <Check className="w-4 h-4 text-green-300" />
                                    </motion.button>
                                    <motion.button
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                      onClick={() => handleRejectRegistration(reg.eventId, reg.id)}
                                      className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition"
                                      title="Reject"
                                    >
                                      <X className="w-4 h-4 text-red-300" />
                                    </motion.button>
                                  </>
                                )}
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => {
                                    setSelectedRegistration(reg);
                                    setShowDetailsModal(true);
                                  }}
                                  className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition"
                                  title="View Details"
                                >
                                  <Eye className="w-4 h-4 text-blue-300" />
                                </motion.button>
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Attendance Tab */}
            {activeTab === "attendance" && (
              <motion.div
                key="attendance"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                  <UserCheck className="w-8 h-8 text-orange-400" />
                  Attendance Overview
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {events.map((event) => {
                    const approvedCount = event.registrations.filter(r => r.status === "approved").length;
                    const attendanceCount = event.attendance.length;
                    const attendanceRate = approvedCount > 0 ? Math.round((attendanceCount / approvedCount) * 100) : 0;

                    return (
                      <div key={event.id} className="bg-black/30 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                        <h3 className="text-lg font-bold text-white mb-4">{event.title}</h3>
                        
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-purple-300">Registered:</span>
                            <span className="text-white font-semibold">{approvedCount}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-purple-300">Attended:</span>
                            <span className="text-white font-semibold">{attendanceCount}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-purple-300">Attendance Rate:</span>
                            <span className={`font-semibold ${
                              attendanceRate > 80 ? 'text-green-400' : attendanceRate > 50 ? 'text-yellow-400' : 'text-red-400'
                            }`}>
                              {attendanceRate}%
                            </span>
                          </div>

                          <div className="h-2 bg-white/10 rounded-full overflow-hidden mt-2">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${attendanceRate}%` }}
                              className={`h-full ${
                                attendanceRate > 80
                                  ? "bg-gradient-to-r from-green-500 to-emerald-500"
                                  : attendanceRate > 50
                                  ? "bg-gradient-to-r from-yellow-500 to-orange-500"
                                  : "bg-gradient-to-r from-red-500 to-pink-500"
                              }`}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* OD Requests Tab */}
            {activeTab === "od-requests" && (
              <motion.div
                key="od-requests"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                  <FileText className="w-8 h-8 text-pink-400" />
                  OD Requests Management
                </h2>

                <div className="bg-black/30 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                  {allRegistrations.filter(reg => reg.odEventName || reg.odSubjects || reg.sameClassStudents).length > 0 ? (
                    <div className="space-y-4">
                      {allRegistrations
                        .filter(reg => reg.odEventName || reg.odSubjects || reg.sameClassStudents)
                        .map((reg) => (
                          <div key={reg.id} className="p-6 bg-white/5 rounded-xl border border-white/10">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <h3 className="text-lg font-bold text-white">{reg.studentName}</h3>
                                <p className="text-purple-300 text-sm">{reg.eventTitle}</p>
                                <p className="text-purple-400 text-xs">{reg.studentRoll} • {reg.studentDepartment}</p>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                                reg.status === "approved"
                                  ? "bg-green-500/20 text-green-300 border-green-500/30"
                                  : reg.status === "rejected"
                                  ? "bg-red-500/20 text-red-300 border-red-500/30"
                                  : "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
                              }`}>
                                {reg.status}
                              </span>
                            </div>

                            {reg.odEventName && (
                              <div className="mb-3">
                                <p className="text-purple-200 text-sm font-semibold mb-1">Event Name for OD:</p>
                                <p className="text-white">{reg.odEventName}</p>
                              </div>
                            )}

                            {reg.odSubjects && reg.odSubjects.length > 0 && (
                              <div className="mb-3">
                                <p className="text-purple-200 text-sm font-semibold mb-2">Subjects ({reg.odSubjects.length}):</p>
                                <div className="flex flex-wrap gap-2">
                                  {reg.odSubjects.map((subject, idx) => (
                                    <span key={idx} className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full text-blue-200 text-sm">
                                      {subject}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {reg.sameClassStudents && reg.sameClassStudents.length > 0 && (
                              <div>
                                <p className="text-purple-200 text-sm font-semibold mb-2">Same Class Students ({reg.sameClassStudents.length}):</p>
                                <div className="flex flex-wrap gap-2">
                                  {reg.sameClassStudents.map((student, idx) => (
                                    <span key={idx} className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-200 text-sm">
                                      {student}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-20">
                      <FileText className="w-20 h-20 text-purple-400 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold text-white mb-2">No OD Requests</h3>
                      <p className="text-purple-300">No students have submitted OD information yet.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Analytics Tab */}
            {activeTab === "analytics" && (
              <motion.div
                key="analytics"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                  <BarChart3 className="w-8 h-8 text-indigo-400" />
                  Analytics & Reports
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Event Statistics */}
                  <div className="bg-black/30 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                    <h3 className="text-xl font-bold text-white mb-4">Event Statistics</h3>
                    <div className="space-y-4">
                      {[
                        { label: "Total Events", value: stats.totalEvents, color: "text-blue-400" },
                        { label: "Active Events", value: stats.activeEvents, color: "text-green-400" },
                        { label: "Completed Events", value: stats.completedEvents, color: "text-purple-400" },
                        { label: "Average Attendance", value: `${stats.avgAttendanceRate}%`, color: "text-orange-400" },
                      ].map((stat) => (
                        <div key={stat.label} className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                          <span className="text-purple-200">{stat.label}</span>
                          <span className={`text-2xl font-bold ${stat.color}`}>{stat.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Registration Statistics */}
                  <div className="bg-black/30 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                    <h3 className="text-xl font-bold text-white mb-4">Registration Statistics</h3>
                    <div className="space-y-4">
                      {[
                        { label: "Total Registrations", value: stats.totalRegistrations, color: "text-cyan-400" },
                        { label: "Pending Approvals", value: stats.pendingApprovals, color: "text-yellow-400" },
                        { label: "Total Revenue", value: `₹${stats.totalRevenue}`, color: "text-green-400" },
                        { label: "Total Attendance", value: stats.totalAttendance, color: "text-pink-400" },
                      ].map((stat) => (
                        <div key={stat.label} className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                          <span className="text-purple-200">{stat.label}</span>
                          <span className={`text-2xl font-bold ${stat.color}`}>{stat.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Category Breakdown */}
                <div className="bg-black/30 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                  <h3 className="text-xl font-bold text-white mb-4">Events by Category</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {Object.entries(
                      events.reduce((acc, event) => {
                        acc[event.category] = (acc[event.category] || 0) + 1;
                        return acc;
                      }, {} as Record<string, number>)
                    ).map(([category, count]) => {
                      const Icon = categoryIcons[category.toLowerCase()] || Calendar;
                      return (
                        <div key={category} className="p-4 bg-white/5 rounded-xl text-center">
                          <Icon className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                          <p className="text-white font-bold text-2xl">{count}</p>
                          <p className="text-purple-300 text-sm capitalize">{category}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Registration Details Modal */}
      <AnimatePresence>
        {showDetailsModal && selectedRegistration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowDetailsModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-slate-900 to-purple-900 rounded-2xl p-8 max-w-3xl w-full border border-white/20 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <Info className="w-7 h-7 text-blue-400" />
                  Registration Details
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowDetailsModal(false)}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition"
                >
                  <X className="w-6 h-6 text-white" />
                </motion.button>
              </div>

              <div className="space-y-6">
                {/* Student Info */}
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <h3 className="text-lg font-bold text-white mb-4">Student Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-purple-300 text-sm mb-1">Name</p>
                      <p className="text-white font-semibold">{selectedRegistration.studentName}</p>
                    </div>
                    <div>
                      <p className="text-purple-300 text-sm mb-1">Roll Number</p>
                      <p className="text-white font-semibold">{selectedRegistration.studentRoll}</p>
                    </div>
                    <div>
                      <p className="text-purple-300 text-sm mb-1">Email</p>
                      <p className="text-white font-semibold">{selectedRegistration.studentEmail}</p>
                    </div>
                    <div>
                      <p className="text-purple-300 text-sm mb-1">Department</p>
                      <p className="text-white font-semibold">{selectedRegistration.studentDepartment}</p>
                    </div>
                  </div>
                </div>

                {/* Team Members */}
                {selectedRegistration.teamMembers && selectedRegistration.teamMembers.length > 0 && (
                  <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl p-6 border border-blue-500/20">
                    <h3 className="text-lg font-bold text-white mb-4">Team Members ({selectedRegistration.teamMembers.length})</h3>
                    <div className="space-y-3">
                      {selectedRegistration.teamMembers.map((member, idx) => (
                        <div key={idx} className="p-3 bg-white/5 rounded-lg">
                          <p className="text-white font-semibold">{member.name}</p>
                          <p className="text-purple-300 text-sm">{member.rollNumber} • {member.department}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* OD Information */}
                {(selectedRegistration.odEventName || selectedRegistration.odSubjects || selectedRegistration.sameClassStudents) && (
                  <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl p-6 border border-green-500/20">
                    <h3 className="text-lg font-bold text-white mb-4">OD Information</h3>
                    {selectedRegistration.odEventName && (
                      <div className="mb-3">
                        <p className="text-green-200 text-sm mb-1">Event Name for OD:</p>
                        <p className="text-white">{selectedRegistration.odEventName}</p>
                      </div>
                    )}
                    {selectedRegistration.odSubjects && selectedRegistration.odSubjects.length > 0 && (
                      <div className="mb-3">
                        <p className="text-green-200 text-sm mb-2">Subjects:</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedRegistration.odSubjects.map((subject, idx) => (
                            <span key={idx} className="px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-green-200 text-sm">
                              {subject}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {selectedRegistration.sameClassStudents && selectedRegistration.sameClassStudents.length > 0 && (
                      <div>
                        <p className="text-green-200 text-sm mb-2">Same Class Students:</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedRegistration.sameClassStudents.map((student, idx) => (
                            <span key={idx} className="px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-green-200 text-sm">
                              {student}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Actions */}
                {selectedRegistration.status === "pending" && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        handleApproveRegistration(selectedRegistration.eventId, selectedRegistration.id);
                        setShowDetailsModal(false);
                      }}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded-xl text-white font-semibold transition flex items-center justify-center gap-2"
                    >
                      <Check className="w-5 h-5" />
                      Approve Registration
                    </button>
                    <button
                      onClick={() => {
                        handleRejectRegistration(selectedRegistration.eventId, selectedRegistration.id);
                        setShowDetailsModal(false);
                      }}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 rounded-xl text-white font-semibold transition flex items-center justify-center gap-2"
                    >
                      <X className="w-5 h-5" />
                      Reject Registration
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
