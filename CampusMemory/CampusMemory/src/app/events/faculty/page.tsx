"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Users,
  TrendingUp,
  Clock,
  MapPin,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Copy,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  Upload,
  Send,
  BarChart3,
  PieChart,
  Activity,
  UserCheck,
  Settings,
  Bell,
  LogOut,
  Grid3x3,
  List,
  SlidersHorizontal,
  Sparkles,
  Zap,
  Star,
  Award,
  Target,
  TrendingDown,
  ArrowUp,
  ArrowDown,
  MoreVertical,
  FileText,
  Image as ImageIcon,
  Video,
  Mic,
  Hash,
  DollarSign,
  Users2,
  Building2,
  Layers,
  Archive,
  RefreshCw,
  Share2,
  Printer,
  Mail,
  MessageSquare,
  Phone,
  QrCode,
  ScanLine,
  UserPlus,
  UserMinus,
  ChevronRight,
  ChevronDown,
  X,
  Check,
  Info,
  ExternalLink,
  Maximize2,
  BookOpen,
  GraduationCap,
  Briefcase,
  Code,
  Palette,
  Music,
  Trophy,
  Dumbbell,
  Lightbulb,
  Rocket,
  Crown,
  Flame,
  ClipboardList,
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

interface FacultyUser {
  name: string;
  email: string;
  employeeId: string;
  designation: string;
  facultyDepartment: string;
}

export default function FacultyDashboard() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<FacultyUser | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [activeTab, setActiveTab] = useState<"overview" | "events" | "registrations" | "analytics">("overview");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showRegistrationsModal, setShowRegistrationsModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Form state for Create/Edit
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    department: "",
    date: "",
    time: "",
    venue: "",
    maxParticipants: "",
    maxTeamSize: "",
    registrationDeadline: "",
    budget: "",
    fee: "",
    posterUrl: "",
  });

  // Categories
  const categories = [
    { id: "technical", name: "Technical", icon: Code, color: "from-blue-500 to-cyan-500" },
    { id: "cultural", name: "Cultural", icon: Palette, color: "from-pink-500 to-rose-500" },
    { id: "sports", name: "Sports", icon: Dumbbell, color: "from-green-500 to-emerald-500" },
    { id: "workshop", name: "Workshop", icon: Lightbulb, color: "from-yellow-500 to-amber-500" },
    { id: "seminar", name: "Seminar", icon: BookOpen, color: "from-purple-500 to-indigo-500" },
    { id: "competition", name: "Competition", icon: Trophy, color: "from-orange-500 to-red-500" },
  ];

  useEffect(() => {
    // Check authentication
    const userData = localStorage.getItem("eventsCurrentUser");
    if (!userData) {
      router.push("/events/auth");
      return;
    }

    const user = JSON.parse(userData);
    if (user.role !== "faculty") {
      alert("Access denied. Faculty/Coordinator access only.");
      router.push("/events/auth");
      return;
    }

    setCurrentUser(user);

    // Load events
    const storedEvents = localStorage.getItem("facultyEvents");
    if (storedEvents) {
      const parsedEvents = JSON.parse(storedEvents);
      setEvents(parsedEvents);
      setFilteredEvents(parsedEvents);
    } else {
      // Initialize with sample data
      const sampleEvents: Event[] = [
        {
          id: "evt-001",
          title: "AI & Machine Learning Workshop",
          description: "Comprehensive workshop covering fundamentals of AI, ML algorithms, and hands-on projects with Python and TensorFlow.",
          category: "workshop",
          department: "CSE",
          date: "2026-03-15",
          time: "10:00 AM",
          venue: "Seminar Hall - Block A",
          maxParticipants: 100,
          maxTeamSize: 1,
          registrationDeadline: "2026-03-10",
          posterUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800",
          coordinators: ["Dr. Sharma", "Prof. Kumar"],
          budget: 50000,
          fee: 500,
          status: "active",
          registrations: [
            {
              id: "reg-001",
              eventId: "evt-001",
              studentName: "Rahul Verma",
              studentEmail: "rahul.verma@college.edu",
              studentRoll: "21BCE1234",
              studentDepartment: "CSE",
              studentYear: "3",
              registeredAt: "2026-02-20T10:30:00Z",
              status: "approved",
            },
            {
              id: "reg-002",
              eventId: "evt-001",
              studentName: "Priya Sharma",
              studentEmail: "priya.sharma@college.edu",
              studentRoll: "21BCE1456",
              studentDepartment: "CSE",
              studentYear: "3",
              registeredAt: "2026-02-21T14:20:00Z",
              status: "pending",
            },
          ],
          attendance: [
            {
              id: "att-001",
              eventId: "evt-001",
              studentRoll: "21BCE1234",
              studentName: "Rahul Verma",
              markedAt: "2026-03-15T10:05:00Z",
              markedBy: "Dr. Sharma",
              status: "present",
            },
          ],
          createdAt: "2026-02-15T09:00:00Z",
          createdBy: user.email,
        },
        {
          id: "evt-002",
          title: "Annual Cultural Fest 2026",
          description: "Celebrate diversity with music, dance, drama performances, and cultural competitions from all departments.",
          category: "cultural",
          department: "All",
          date: "2026-04-20",
          time: "9:00 AM",
          venue: "Main Auditorium",
          maxParticipants: 500,
          maxTeamSize: 3,
          registrationDeadline: "2026-04-10",
          posterUrl: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800",
          coordinators: ["Dr. Patel", "Prof. Rao"],
          budget: 200000,
          fee: 200,
          status: "active",
          registrations: [],
          attendance: [],
          createdAt: "2026-02-10T11:00:00Z",
          createdBy: user.email,
        },
        {
          id: "evt-003",
          title: "Inter-College Cricket Tournament",
          description: "Competitive cricket tournament featuring teams from various colleges. Register your team now!",
          category: "sports",
          department: "Physical Education",
          date: "2026-03-25",
          time: "7:00 AM",
          venue: "College Sports Ground",
          maxParticipants: 150,
          maxTeamSize: 11,
          registrationDeadline: "2026-03-20",
          posterUrl: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800",
          coordinators: ["Coach Reddy"],
          budget: 75000,
          fee: 1000,
          status: "active",
          registrations: [],
          attendance: [],
          createdAt: "2026-02-12T08:00:00Z",
          createdBy: user.email,
        },
      ];
      setEvents(sampleEvents);
      setFilteredEvents(sampleEvents);
      localStorage.setItem("facultyEvents", JSON.stringify(sampleEvents));
    }

    setIsLoading(false);
  }, [router]);

  // Filter events
  useEffect(() => {
    let filtered = [...events];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.venue.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (filterCategory !== "all") {
      filtered = filtered.filter((event) => event.category === filterCategory);
    }

    // Status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter((event) => event.status === filterStatus);
    }

    setFilteredEvents(filtered);
  }, [searchQuery, filterCategory, filterStatus, events]);

  // Calculate statistics
  const stats = {
    totalEvents: events.length,
    activeEvents: events.filter((e) => e.status === "active").length,
    completedEvents: events.filter((e) => e.status === "completed").length,
    totalRegistrations: events.reduce((sum, e) => sum + e.registrations.length, 0),
    approvedRegistrations: events.reduce((sum, e) => sum + e.registrations.filter((r) => r.status === "approved").length, 0),
    pendingApprovals: events.reduce((sum, e) => sum + e.registrations.filter((r) => r.status === "pending").length, 0),
    totalAttendance: events.reduce((sum, e) => sum + e.attendance.length, 0),
    avgAttendanceRate: events.length > 0
      ? ((events.reduce((sum, e) => sum + (e.attendance.length / Math.max(e.registrations.filter(r => r.status === "approved").length, 1)), 0) / events.length) * 100).toFixed(1)
      : "0",
  };

  // Handle Create Event
  const handleCreateEvent = () => {
    if (!formData.title || !formData.date || !formData.venue) {
      alert("Please fill in all required fields");
      return;
    }

    const newEvent: Event = {
      id: `evt-${Date.now()}`,
      title: formData.title,
      description: formData.description,
      category: formData.category || "workshop",
      department: formData.department || currentUser?.facultyDepartment || "",
      date: formData.date,
      time: formData.time,
      venue: formData.venue,
      maxParticipants: parseInt(formData.maxParticipants) || 100,
      maxTeamSize: parseInt(formData.maxTeamSize) || 1,
      registrationDeadline: formData.registrationDeadline,
      posterUrl: formData.posterUrl,
      coordinators: [currentUser?.name || ""],
      budget: parseFloat(formData.budget) || 0,
      fee: parseFloat(formData.fee) || 0,
      status: "active",
      registrations: [],
      attendance: [],
      createdAt: new Date().toISOString(),
      createdBy: currentUser?.email || "",
    };

    const updatedEvents = [...events, newEvent];
    setEvents(updatedEvents);
    localStorage.setItem("facultyEvents", JSON.stringify(updatedEvents));
    setShowCreateModal(false);
    resetForm();
    alert("✅ Event created successfully!");
  };

  // Handle Update Event
  const handleUpdateEvent = () => {
    if (!selectedEvent) return;

    const updatedEvents = events.map((event) =>
      event.id === selectedEvent.id
        ? {
            ...event,
            title: formData.title,
            description: formData.description,
            category: formData.category,
            department: formData.department,
            date: formData.date,
            time: formData.time,
            venue: formData.venue,
            maxParticipants: parseInt(formData.maxParticipants),
            maxTeamSize: parseInt(formData.maxTeamSize),
            registrationDeadline: formData.registrationDeadline,
            posterUrl: formData.posterUrl,
            budget: parseFloat(formData.budget) || 0,
            fee: parseFloat(formData.fee) || 0,
          }
        : event
    );

    setEvents(updatedEvents);
    localStorage.setItem("facultyEvents", JSON.stringify(updatedEvents));
    setShowEditModal(false);
    setSelectedEvent(null);
    resetForm();
    alert("✅ Event updated successfully!");
  };

  // Handle Delete Event
  const handleDeleteEvent = (eventId: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    const updatedEvents = events.filter((event) => event.id !== eventId);
    setEvents(updatedEvents);
    localStorage.setItem("facultyEvents", JSON.stringify(updatedEvents));
    alert("🗑️ Event deleted successfully!");
  };

  // Handle Duplicate Event
  const handleDuplicateEvent = (event: Event) => {
    const duplicatedEvent: Event = {
      ...event,
      id: `evt-${Date.now()}`,
      title: `${event.title} (Copy)`,
      registrations: [],
      attendance: [],
      createdAt: new Date().toISOString(),
      createdBy: currentUser?.email || "",
    };

    const updatedEvents = [...events, duplicatedEvent];
    setEvents(updatedEvents);
    localStorage.setItem("facultyEvents", JSON.stringify(updatedEvents));
    alert("✅ Event duplicated successfully!");
  };

  // Handle Registration Approval
  const handleApproveRegistration = (eventId: string, registrationId: string, approve: boolean) => {
    const updatedEvents = events.map((event) => {
      if (event.id === eventId) {
        return {
          ...event,
          registrations: event.registrations.map((reg) =>
            reg.id === registrationId ? { ...reg, status: approve ? "approved" as const : "rejected" as const } : reg
          ),
        };
      }
      return event;
    });

    setEvents(updatedEvents);
    localStorage.setItem("facultyEvents", JSON.stringify(updatedEvents));
    alert(approve ? "✅ Registration approved!" : "❌ Registration rejected!");
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "",
      department: "",
      date: "",
      time: "",
      venue: "",
      maxParticipants: "",
      maxTeamSize: "",
      registrationDeadline: "",
      budget: "",
      fee: "",
      posterUrl: "",
    });
  };

  // Open edit modal with pre-filled data
  const openEditModal = (event: Event) => {
    setSelectedEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      category: event.category,
      department: event.department,
      date: event.date,
      time: event.time,
      venue: event.venue,
      maxParticipants: event.maxParticipants.toString(),
      maxTeamSize: event.maxTeamSize.toString(),
      registrationDeadline: event.registrationDeadline,
      budget: event.budget?.toString() || "",
      fee: event.fee?.toString() || "",
      posterUrl: event.posterUrl || "",
    });
    setShowEditModal(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("eventsCurrentUser");
    router.push("/events/auth");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      {/* Header */}
      <header className="relative z-10 bg-white/10 backdrop-blur-xl border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
                <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold text-white">Faculty Dashboard</h1>
                <p className="text-purple-200 text-sm">Manage events and registrations</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push("/events/faculty/attendance")}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition"
              >
                <QrCode className="w-5 h-5" />
                <span className="hidden md:inline">Attendance</span>
              </motion.button>

              <div className="relative group">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition"
                >
                  <Bell className="w-6 h-6 text-white" />
                  {stats.pendingApprovals > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {stats.pendingApprovals}
                    </span>
                  )}
                </motion.button>
              </div>

              <div className="flex items-center gap-3 px-4 py-2 bg-white/10 rounded-lg">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                  {currentUser?.name.charAt(0)}
                </div>
                <div className="hidden md:block">
                  <p className="text-white font-semibold text-sm">{currentUser?.name}</p>
                  <p className="text-purple-200 text-xs">{currentUser?.designation}</p>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition"
              >
                <LogOut className="w-5 h-5 text-red-400" />
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {[
              { id: "overview", label: "Overview", icon: BarChart3 },
              { id: "events", label: "Events", icon: Calendar },
              { id: "registrations", label: "Registrations", icon: Users },
              { id: "analytics", label: "Analytics", icon: TrendingUp },
            ].map((tab) => (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-xl"
                    : "bg-white/10 text-purple-200 hover:bg-white/20"
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </motion.button>
            ))}
            {/* OD Approvals Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/events/faculty/od-approvals")}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-xl shadow-indigo-500/50"
            >
              <ClipboardList className="w-5 h-5" />
              OD Approvals
              {(() => {
                const odRequests = localStorage.getItem("odRequests");
                if (!odRequests) return null;
                const pending = JSON.parse(odRequests).filter((r: any) => r.status === "pending").length;
                if (pending === 0) return null;
                return <span className="px-2 py-0.5 bg-white/30 rounded-full text-xs">{pending}</span>;
              })()}
            </motion.button>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: "Total Events", value: stats.totalEvents, icon: Calendar, color: "from-purple-500 to-indigo-500", change: "+12%" },
                { label: "Active Events", value: stats.activeEvents, icon: Activity, color: "from-green-500 to-emerald-500", change: "+8%" },
                { label: "Total Registrations", value: stats.totalRegistrations, icon: Users, color: "from-blue-500 to-cyan-500", change: "+24%" },
                { label: "Pending Approvals", value: stats.pendingApprovals, icon: Clock, color: "from-orange-500 to-red-500", change: "-5%" },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="relative group"
                >
                  <div className={`absolute -inset-0.5 bg-gradient-to-r ${stat.color} rounded-2xl blur opacity-30 group-hover:opacity-100 transition`} />
                  <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 bg-gradient-to-r ${stat.color} rounded-xl`}>
                        <stat.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className={`flex items-center gap-1 text-sm font-semibold ${
                        stat.change.startsWith("+") ? "text-green-400" : "text-red-400"
                      }`}>
                        {stat.change.startsWith("+") ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                        {stat.change}
                      </div>
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
                    <p className="text-purple-200 text-sm">{stat.label}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Zap className="w-6 h-6 text-yellow-400" />
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowCreateModal(true)}
                  className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl transition"
                >
                  <Plus className="w-6 h-6" />
                  <span>Create New Event</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push("/events/faculty/attendance")}
                  className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl transition"
                >
                  <UserCheck className="w-6 h-6" />
                  <span>Mark Attendance</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab("registrations")}
                  className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl transition relative"
                >
                  <CheckCircle className="w-6 h-6" />
                  <span>Review Registrations</span>
                  {stats.pendingApprovals > 0 && (
                    <span className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white text-sm font-bold rounded-full flex items-center justify-center">
                      {stats.pendingApprovals}
                    </span>
                  )}
                </motion.button>
              </div>
            </div>

            {/* Recent Events */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Star className="w-6 h-6 text-yellow-400" />
                  Recent Events
                </h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setActiveTab("events")}
                  className="text-purple-300 hover:text-white transition text-sm font-semibold flex items-center gap-1"
                >
                  View All
                  <ChevronRight className="w-4 h-4" />
                </motion.button>
              </div>

              <div className="space-y-4">
                {events.slice(0, 3).map((event) => {
                  const categoryData = categories.find((c) => c.id === event.category);
                  return (
                    <motion.div
                      key={event.id}
                      whileHover={{ x: 5 }}
                      className="flex items-center gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition cursor-pointer"
                      onClick={() => {
                        setSelectedEvent(event);
                        setShowDetailsModal(true);
                      }}
                    >
                      <div className={`p-3 bg-gradient-to-r ${categoryData?.color} rounded-lg flex-shrink-0`}>
                        {categoryData && <categoryData.icon className="w-6 h-6 text-white" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-semibold truncate">{event.title}</h3>
                        <p className="text-purple-200 text-sm flex items-center gap-4 mt-1">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(event.date).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {event.registrations.length}/{event.maxParticipants}
                          </span>
                        </p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        event.status === "active" ? "bg-green-500/20 text-green-300" :
                        event.status === "completed" ? "bg-blue-500/20 text-blue-300" :
                        event.status === "cancelled" ? "bg-red-500/20 text-red-300" :
                        "bg-gray-500/20 text-gray-300"
                      }`}>
                        {event.status}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* Events Tab */}
        {activeTab === "events" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Toolbar */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-300" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search events..."
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 transition"
                  />
                </div>

                {/* Category Filter */}
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-400 transition"
                >
                  <option value="all" className="bg-slate-800">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id} className="bg-slate-800">{cat.name}</option>
                  ))}
                </select>

                {/* Status Filter */}
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-400 transition"
                >
                  <option value="all" className="bg-slate-800">All Status</option>
                  <option value="active" className="bg-slate-800">Active</option>
                  <option value="completed" className="bg-slate-800">Completed</option>
                  <option value="cancelled" className="bg-slate-800">Cancelled</option>
                  <option value="draft" className="bg-slate-800">Draft</option>
                </select>

                {/* View Toggle */}
                <div className="flex gap-2 bg-white/5 p-1 rounded-xl">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-lg transition ${viewMode === "grid" ? "bg-purple-500 text-white" : "text-purple-300 hover:bg-white/5"}`}
                  >
                    <Grid3x3 className="w-5 h-5" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-lg transition ${viewMode === "list" ? "bg-purple-500 text-white" : "text-purple-300 hover:bg-white/5"}`}
                  >
                    <List className="w-5 h-5" />
                  </motion.button>
                </div>

                {/* Create Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowCreateModal(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition"
                >
                  <Plus className="w-5 h-5" />
                  Create Event
                </motion.button>
              </div>
            </div>

            {/* Events Grid/List */}
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map((event, index) => {
                  const categoryData = categories.find((c) => c.id === event.category);
                  return (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ y: -8 }}
                      className="group relative"
                    >
                      <div className={`absolute -inset-0.5 bg-gradient-to-r ${categoryData?.color} rounded-2xl blur opacity-0 group-hover:opacity-75 transition`} />
                      <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/20">
                        {/* Event Image */}
                        {event.posterUrl && (
                          <div className="relative h-48 overflow-hidden">
                            <img src={event.posterUrl} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold ${
                              event.status === "active" ? "bg-green-500 text-white" :
                              event.status === "completed" ? "bg-blue-500 text-white" :
                              event.status === "cancelled" ? "bg-red-500 text-white" :
                              "bg-gray-500 text-white"
                            }`}>
                              {event.status}
                            </div>
                          </div>
                        )}

                        <div className="p-6">
                          {/* Category Badge */}
                          <div className={`inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r ${categoryData?.color} rounded-full text-white text-sm font-semibold mb-3`}>
                            {categoryData && <categoryData.icon className="w-4 h-4" />}
                            {categoryData?.name}
                          </div>

                          {/* Title */}
                          <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">{event.title}</h3>

                          {/* Description */}
                          <p className="text-purple-200 text-sm mb-4 line-clamp-2">{event.description}</p>

                          {/* Meta Info */}
                          <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2 text-purple-200 text-sm">
                              <Calendar className="w-4 h-4" />
                              {new Date(event.date).toLocaleDateString()} - {event.time}
                            </div>
                            <div className="flex items-center gap-2 text-purple-200 text-sm">
                              <MapPin className="w-4 h-4" />
                              {event.venue}
                            </div>
                            <div className="flex items-center gap-2 text-purple-200 text-sm">
                              <Users className="w-4 h-4" />
                              {event.registrations.length}/{event.maxParticipants} registered
                            </div>
                          </div>

                          {/* Progress Bar */}
                          <div className="mb-4">
                            <div className="flex items-center justify-between text-xs text-purple-200 mb-1">
                              <span>Registration</span>
                              <span>{Math.round((event.registrations.length / event.maxParticipants) * 100)}%</span>
                            </div>
                            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(event.registrations.length / event.maxParticipants) * 100}%` }}
                                transition={{ duration: 1, delay: index * 0.1 }}
                                className={`h-full bg-gradient-to-r ${categoryData?.color}`}
                              />
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex gap-2">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => {
                                setSelectedEvent(event);
                                setShowDetailsModal(true);
                              }}
                              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white font-semibold transition"
                            >
                              <Eye className="w-4 h-4" />
                              View
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => openEditModal(event)}
                              className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition"
                            >
                              <Edit className="w-4 h-4 text-blue-300" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleDuplicateEvent(event)}
                              className="p-2 bg-green-500/20 hover:bg-green-500/30 rounded-lg transition"
                            >
                              <Copy className="w-4 h-4 text-green-300" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleDeleteEvent(event.id)}
                              className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition"
                            >
                              <Trash2 className="w-4 h-4 text-red-300" />
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredEvents.map((event, index) => {
                  const categoryData = categories.find((c) => c.id === event.category);
                  return (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                      className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 flex items-center gap-6"
                    >
                      {/* Image */}
                      {event.posterUrl && (
                        <div className="w-32 h-32 rounded-xl overflow-hidden flex-shrink-0">
                          <img src={event.posterUrl} alt={event.title} className="w-full h-full object-cover" />
                        </div>
                      )}

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <div className={`inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r ${categoryData?.color} rounded-full text-white text-sm font-semibold`}>
                                {categoryData && <categoryData.icon className="w-4 h-4" />}
                                {categoryData?.name}
                              </div>
                              <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                event.status === "active" ? "bg-green-500/20 text-green-300" :
                                event.status === "completed" ? "bg-blue-500/20 text-blue-300" :
                                event.status === "cancelled" ? "bg-red-500/20 text-red-300" :
                                "bg-gray-500/20 text-gray-300"
                              }`}>
                                {event.status}
                              </div>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-1">{event.title}</h3>
                            <p className="text-purple-200 text-sm line-clamp-2">{event.description}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                          <div className="text-sm">
                            <p className="text-purple-300 mb-1">Date & Time</p>
                            <p className="text-white font-semibold">{new Date(event.date).toLocaleDateString()}</p>
                            <p className="text-purple-200 text-xs">{event.time}</p>
                          </div>
                          <div className="text-sm">
                            <p className="text-purple-300 mb-1">Venue</p>
                            <p className="text-white font-semibold">{event.venue}</p>
                          </div>
                          <div className="text-sm">
                            <p className="text-purple-300 mb-1">Registrations</p>
                            <p className="text-white font-semibold">{event.registrations.length}/{event.maxParticipants}</p>
                            <div className="w-full h-1 bg-white/10 rounded-full mt-1 overflow-hidden">
                              <div className={`h-full bg-gradient-to-r ${categoryData?.color}`} style={{ width: `${(event.registrations.length / event.maxParticipants) * 100}%` }} />
                            </div>
                          </div>
                          <div className="text-sm">
                            <p className="text-purple-300 mb-1">Actions</p>
                            <div className="flex gap-2">
                              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => openEditModal(event)} className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition">
                                <Edit className="w-4 h-4 text-blue-300" />
                              </motion.button>
                              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => handleDuplicateEvent(event)} className="p-2 bg-green-500/20 hover:bg-green-500/30 rounded-lg transition">
                                <Copy className="w-4 h-4 text-green-300" />
                              </motion.button>
                              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => handleDeleteEvent(event.id)} className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition">
                                <Trash2 className="w-4 h-4 text-red-300" />
                              </motion.button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {filteredEvents.length === 0 && (
              <div className="text-center py-20">
                <Calendar className="w-20 h-20 text-purple-300/50 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No Events Found</h3>
                <p className="text-purple-200 mb-6">Create your first event to get started</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowCreateModal(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold shadow-lg"
                >
                  <Plus className="w-5 h-5" />
                  Create Event
                </motion.button>
              </div>
            )}
          </motion.div>
        )}

        {/* Registrations Tab */}
        {activeTab === "registrations" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Users className="w-6 h-6 text-purple-400" />
                Pending Approvals ({stats.pendingApprovals})
              </h2>

              <div className="space-y-4">
                {events.map((event) => {
                  const pendingRegs = event.registrations.filter((r) => r.status === "pending");
                  if (pendingRegs.length === 0) return null;

                  return (
                    <div key={event.id} className="bg-white/5 rounded-xl p-4">
                      <h3 className="text-white font-semibold mb-4">{event.title}</h3>
                      <div className="space-y-3">
                        {pendingRegs.map((reg) => (
                          <div key={reg.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                            <div>
                              <p className="text-white font-semibold">{reg.studentName}</p>
                              <p className="text-purple-200 text-sm">{reg.studentRoll} - {reg.studentDepartment} - Year {reg.studentYear}</p>
                              <p className="text-purple-300 text-xs mt-1">{reg.studentEmail}</p>
                            </div>
                            <div className="flex gap-2">
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleApproveRegistration(event.id, reg.id, true)}
                                className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg text-white font-semibold transition"
                              >
                                <CheckCircle className="w-4 h-4" />
                                Approve
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleApproveRegistration(event.id, reg.id, false)}
                                className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-white font-semibold transition"
                              >
                                <XCircle className="w-4 h-4" />
                                Reject
                              </motion.button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}

                {stats.pendingApprovals === 0 && (
                  <div className="text-center py-12">
                    <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">All Caught Up!</h3>
                    <p className="text-purple-200">No pending registrations to review</p>
                  </div>
                )}
              </div>
            </div>

            {/* All Registrations */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Users2 className="w-6 h-6 text-blue-400" />
                All Registrations ({stats.totalRegistrations})
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left text-purple-200 font-semibold p-4">Student</th>
                      <th className="text-left text-purple-200 font-semibold p-4">Event</th>
                      <th className="text-left text-purple-200 font-semibold p-4">Department</th>
                      <th className="text-left text-purple-200 font-semibold p-4">Status</th>
                      <th className="text-left text-purple-200 font-semibold p-4">Registered</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.flatMap((event) =>
                      event.registrations.map((reg) => (
                        <tr key={reg.id} className="border-b border-white/5 hover:bg-white/5 transition">
                          <td className="p-4">
                            <p className="text-white font-semibold">{reg.studentName}</p>
                            <p className="text-purple-200 text-sm">{reg.studentRoll}</p>
                          </td>
                          <td className="p-4 text-purple-200">{event.title}</td>
                          <td className="p-4 text-purple-200">{reg.studentDepartment} - Year {reg.studentYear}</td>
                          <td className="p-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              reg.status === "approved" ? "bg-green-500/20 text-green-300" :
                              reg.status === "rejected" ? "bg-red-500/20 text-red-300" :
                              "bg-yellow-500/20 text-yellow-300"
                            }`}>
                              {reg.status}
                            </span>
                          </td>
                          <td className="p-4 text-purple-200 text-sm">
                            {new Date(reg.registeredAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* Analytics Tab */}
        {activeTab === "analytics" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Category Distribution */}
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <PieChart className="w-6 h-6 text-purple-400" />
                  Events by Category
                </h2>
                <div className="space-y-4">
                  {categories.map((cat) => {
                    const count = events.filter((e) => e.category === cat.id).length;
                    const percentage = events.length > 0 ? (count / events.length) * 100 : 0;
                    return (
                      <div key={cat.id}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <cat.icon className="w-5 h-5 text-purple-300" />
                            <span className="text-white font-semibold">{cat.name}</span>
                          </div>
                          <span className="text-purple-200">{count} events ({percentage.toFixed(0)}%)</span>
                        </div>
                        <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 1 }}
                            className={`h-full bg-gradient-to-r ${cat.color}`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Status Distribution */}
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Activity className="w-6 h-6 text-blue-400" />
                  Event Status
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { status: "active", label: "Active", color: "from-green-500 to-emerald-500", count: stats.activeEvents },
                    { status: "completed", label: "Completed", color: "from-blue-500 to-cyan-500", count: stats.completedEvents },
                    { status: "cancelled", label: "Cancelled", color: "from-red-500 to-pink-500", count: events.filter(e => e.status === "cancelled").length },
                    { status: "draft", label: "Draft", color: "from-gray-500 to-slate-500", count: events.filter(e => e.status === "draft").length },
                  ].map((item) => (
                    <motion.div
                      key={item.status}
                      whileHover={{ scale: 1.05 }}
                      className="p-6 bg-white/5 rounded-xl"
                    >
                      <div className={`w-12 h-12 bg-gradient-to-r ${item.color} rounded-xl flex items-center justify-center mb-4`}>
                        <span className="text-2xl font-bold text-white">{item.count}</span>
                      </div>
                      <p className="text-purple-200 text-sm">{item.label}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Attendance Stats */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <UserCheck className="w-6 h-6 text-green-400" />
                Attendance Overview
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center p-6 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl border border-green-500/30">
                  <p className="text-4xl font-bold text-green-400 mb-2">{stats.avgAttendanceRate}%</p>
                  <p className="text-green-200 text-sm">Average Attendance</p>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl border border-blue-500/30">
                  <p className="text-4xl font-bold text-blue-400 mb-2">{stats.totalAttendance}</p>
                  <p className="text-blue-200 text-sm">Total Present</p>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-500/30">
                  <p className="text-4xl font-bold text-purple-400 mb-2">{stats.approvedRegistrations}</p>
                  <p className="text-purple-200 text-sm">Approved Registrations</p>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl border border-orange-500/30">
                  <p className="text-4xl font-bold text-orange-400 mb-2">{stats.pendingApprovals}</p>
                  <p className="text-orange-200 text-sm">Pending Approvals</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </main>

      {/* Create Event Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-slate-900 to-purple-900 rounded-2xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-white/20"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-7 h-7 text-yellow-400" />
                  Create New Event
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition"
                >
                  <X className="w-6 h-6 text-white" />
                </motion.button>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handleCreateEvent(); }} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Title */}
                  <div className="md:col-span-2">
                    <label className="block text-purple-200 font-semibold mb-2">Event Title *</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Annual Tech Fest 2026"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 transition"
                      required
                    />
                  </div>

                  {/* Description */}
                  <div className="md:col-span-2">
                    <label className="block text-purple-200 font-semibold mb-2">Description *</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Describe your event..."
                      rows={4}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 transition resize-none"
                      required
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-purple-200 font-semibold mb-2">Category *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-400 transition"
                      required
                    >
                      <option value="" className="bg-slate-800">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id} className="bg-slate-800">{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Department */}
                  <div>
                    <label className="block text-purple-200 font-semibold mb-2">Department</label>
                    <input
                      type="text"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      placeholder="CSE, All, etc."
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 transition"
                    />
                  </div>

                  {/* Date */}
                  <div>
                    <label className="block text-purple-200 font-semibold mb-2">Event Date *</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-400 transition"
                      required
                    />
                  </div>

                  {/* Time */}
                  <div>
                    <label className="block text-purple-200 font-semibold mb-2">Time *</label>
                    <input
                      type="text"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      placeholder="10:00 AM"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 transition"
                      required
                    />
                  </div>

                  {/* Venue */}
                  <div className="md:col-span-2">
                    <label className="block text-purple-200 font-semibold mb-2">Venue *</label>
                    <input
                      type="text"
                      value={formData.venue}
                      onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                      placeholder="Main Auditorium, Block A"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 transition"
                      required
                    />
                  </div>

                  {/* Max Participants */}
                  <div>
                    <label className="block text-purple-200 font-semibold mb-2">Max Participants</label>
                    <input
                      type="number"
                      value={formData.maxParticipants}
                      onChange={(e) => setFormData({ ...formData, maxParticipants: e.target.value })}
                      placeholder="100"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 transition"
                    />
                  </div>

                  {/* Max Team Size */}
                  <div>
                    <label className="block text-purple-200 font-semibold mb-2 flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Max Team Size
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.maxTeamSize}
                      onChange={(e) => setFormData({ ...formData, maxTeamSize: e.target.value })}
                      placeholder="1 for individual, 2+ for team"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 transition"
                    />
                    <p className="text-purple-300/60 text-sm mt-1">Enter 1 for individual events, 2+ for team events</p>
                  </div>

                  {/* Registration Deadline */}
                  <div>
                    <label className="block text-purple-200 font-semibold mb-2">Registration Deadline</label>
                    <input
                      type="date"
                      value={formData.registrationDeadline}
                      onChange={(e) => setFormData({ ...formData, registrationDeadline: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-400 transition"
                    />
                  </div>

                  {/* Budget */}
                  <div>
                    <label className="block text-purple-200 font-semibold mb-2">Budget (₹)</label>
                    <input
                      type="number"
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      placeholder="50000"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 transition"
                    />
                  </div>

                  {/* Fee */}
                  <div>
                    <label className="block text-purple-200 font-semibold mb-2">Registration Fee (₹)</label>
                    <input
                      type="number"
                      value={formData.fee}
                      onChange={(e) => setFormData({ ...formData, fee: e.target.value })}
                      placeholder="500"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 transition"
                    />
                  </div>

                  {/* Poster URL */}
                  <div className="md:col-span-2">
                    <label className="block text-purple-200 font-semibold mb-2">Poster Image URL</label>
                    <input
                      type="url"
                      value={formData.posterUrl}
                      onChange={(e) => setFormData({ ...formData, posterUrl: e.target.value })}
                      placeholder="https://example.com/poster.jpg"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 transition"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex gap-4 pt-4">
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition"
                  >
                    <Rocket className="w-5 h-5" />
                    Create Event
                  </motion.button>
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setShowCreateModal(false);
                      resetForm();
                    }}
                    className="px-6 py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold transition"
                  >
                    Cancel
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Event Modal - Similar to Create Modal */}
      <AnimatePresence>
        {showEditModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowEditModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-slate-900 to-purple-900 rounded-2xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-white/20"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Edit className="w-7 h-7 text-blue-400" />
                  Edit Event
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowEditModal(false)}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition"
                >
                  <X className="w-6 h-6 text-white" />
                </motion.button>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handleUpdateEvent(); }} className="space-y-6">
                {/* Same form fields as Create Modal */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-purple-200 font-semibold mb-2">Event Title *</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-400 transition"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-purple-200 font-semibold mb-2">Description *</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-400 transition resize-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-purple-200 font-semibold mb-2">Category *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-400 transition"
                      required
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id} className="bg-slate-800">{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-purple-200 font-semibold mb-2">Department</label>
                    <input
                      type="text"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-400 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-purple-200 font-semibold mb-2">Event Date *</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-400 transition"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-purple-200 font-semibold mb-2">Time *</label>
                    <input
                      type="text"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-400 transition"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-purple-200 font-semibold mb-2">Venue *</label>
                    <input
                      type="text"
                      value={formData.venue}
                      onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-400 transition"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-purple-200 font-semibold mb-2">Max Participants</label>
                    <input
                      type="number"
                      value={formData.maxParticipants}
                      onChange={(e) => setFormData({ ...formData, maxParticipants: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-400 transition"
                    />
                  </div>

                  {/* Max Team Size */}
                  <div>
                    <label className="block text-purple-200 font-semibold mb-2 flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Max Team Size
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.maxTeamSize}
                      onChange={(e) => setFormData({ ...formData, maxTeamSize: e.target.value })}
                      placeholder="1 for individual, 2+ for team"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 transition"
                    />
                    <p className="text-purple-300/60 text-sm mt-1">Enter 1 for individual events, 2+ for team events</p>
                  </div>

                  <div>
                    <label className="block text-purple-200 font-semibold mb-2">Registration Deadline</label>
                    <input
                      type="date"
                      value={formData.registrationDeadline}
                      onChange={(e) => setFormData({ ...formData, registrationDeadline: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-400 transition"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-bold shadow-lg"
                  >
                    <Check className="w-5 h-5" />
                    Update Event
                  </motion.button>
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setShowEditModal(false);
                      resetForm();
                    }}
                    className="px-6 py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold transition"
                  >
                    Cancel
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Event Details Modal */}
      <AnimatePresence>
        {showDetailsModal && selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowDetailsModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-slate-900 to-purple-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-white/20"
            >
              {/* Header with Image */}
              {selectedEvent.posterUrl && (
                <div className="relative h-64 overflow-hidden rounded-t-2xl">
                  <img src={selectedEvent.posterUrl} alt={selectedEvent.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowDetailsModal(false)}
                    className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-lg backdrop-blur-sm transition"
                  >
                    <X className="w-6 h-6 text-white" />
                  </motion.button>
                </div>
              )}

              <div className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-2">{selectedEvent.title}</h2>
                    <p className="text-purple-200">{selectedEvent.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl">
                    <Calendar className="w-10 h-10 text-purple-400" />
                    <div>
                      <p className="text-purple-200 text-sm">Date & Time</p>
                      <p className="text-white font-semibold">{new Date(selectedEvent.date).toLocaleDateString()}</p>
                      <p className="text-purple-300 text-sm">{selectedEvent.time}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl">
                    <MapPin className="w-10 h-10 text-pink-400" />
                    <div>
                      <p className="text-purple-200 text-sm">Venue</p>
                      <p className="text-white font-semibold">{selectedEvent.venue}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl">
                    <Users className="w-10 h-10 text-blue-400" />
                    <div>
                      <p className="text-purple-200 text-sm">Participants</p>
                      <p className="text-white font-semibold">{selectedEvent.registrations.length} / {selectedEvent.maxParticipants}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl">
                    <Building2 className="w-10 h-10 text-green-400" />
                    <div>
                      <p className="text-purple-200 text-sm">Department</p>
                      <p className="text-white font-semibold">{selectedEvent.department}</p>
                    </div>
                  </div>
                </div>

                {/* Registrations */}
                <div className="bg-white/5 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Users className="w-6 h-6 text-purple-400" />
                    Registrations ({selectedEvent.registrations.length})
                  </h3>
                  {selectedEvent.registrations.length > 0 ? (
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {selectedEvent.registrations.map((reg) => (
                        <div key={reg.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                          <div>
                            <p className="text-white font-semibold">{reg.studentName}</p>
                            <p className="text-purple-200 text-sm">{reg.studentRoll} - {reg.studentDepartment}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            reg.status === "approved" ? "bg-green-500/20 text-green-300" :
                            reg.status === "rejected" ? "bg-red-500/20 text-red-300" :
                            "bg-yellow-500/20 text-yellow-300"
                          }`}>
                            {reg.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-purple-200 text-center py-8">No registrations yet</p>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
